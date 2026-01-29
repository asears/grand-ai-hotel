# GitHub Secrets Management Guide

## Overview

GitHub Secrets provide secure storage for sensitive values used in GitHub Actions workflows. This guide covers repository secrets, environment secrets, OIDC authentication, and rotation procedures.

## Why Use GitHub Secrets?

Following **OWASP A07:2021 – Identification and Authentication Failures**:

✅ **Benefits:**
- Encrypted at rest and in transit
- Audit logging for access
- Environment-based access control
- Integration with OIDC for cloud providers
- No secrets in workflow files or logs

❌ **Never do this:**
```yaml
# ❌ BAD: Hardcoded credentials
- name: Deploy
  run: |
    az login --service-principal \
      --username "abc-123" \
      --password "hardcoded-secret" \
      --tenant "xyz-789"
```

✅ **Do this instead:**
```yaml
# ✅ GOOD: Using secrets
- name: Deploy
  run: az login --service-principal
  env:
    AZURE_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
    AZURE_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}
    AZURE_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}
```

---

## Types of Secrets

```
┌─────────────────────────────────────────────────────────┐
│ Secret Type          │ Scope          │ Use Case        │
├─────────────────────────────────────────────────────────┤
│ Repository Secrets   │ Entire repo    │ CI/CD, builds   │
├─────────────────────────────────────────────────────────┤
│ Environment Secrets  │ Per environment│ Deployments     │
├─────────────────────────────────────────────────────────┤
│ Organization Secrets │ Across repos   │ Shared services │
├─────────────────────────────────────────────────────────┤
│ Dependabot Secrets   │ Dependabot PRs │ Private registries│
└─────────────────────────────────────────────────────────┘
```

---

## Repository Secrets

### Creating via GitHub CLI

```bash
# Install GitHub CLI
winget install GitHub.cli

# Authenticate
gh auth login

# Set a secret
gh secret set AZURE_CLIENT_ID --body "your-client-id"

# Set from file
gh secret set SSH_PRIVATE_KEY < ~/.ssh/id_rsa

# Set interactively (prompts for value)
gh secret set API_KEY

# Set from environment variable
gh secret set DATABASE_URL --body "$DATABASE_URL"

# List secrets
gh secret list

# Delete a secret
gh secret delete API_KEY
```

### Creating via GitHub UI

1. Navigate to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Enter:
   - **Name:** `AZURE_CLIENT_ID`
   - **Value:** `your-client-id`
4. Click **Add secret**

### Using in Workflows

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build
        env:
          # Access repository secrets
          API_KEY: ${{ secrets.API_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          echo "Building with secure credentials..."
          npm run build
      
      - name: Azure Login
        env:
          AZURE_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
          AZURE_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}
          AZURE_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}
        run: |
          az login --service-principal \
            --username "$AZURE_CLIENT_ID" \
            --password "$AZURE_CLIENT_SECRET" \
            --tenant "$AZURE_TENANT_ID"
```

---

## Environment Secrets

### Creating Environments

```bash
# Create environment via CLI (requires gh extension)
gh api repos/{owner}/{repo}/environments/production -X PUT

# Set environment secret
gh secret set PROD_API_KEY --env production --body "prod-key-value"
gh secret set STAGING_API_KEY --env staging --body "staging-key-value"

# List environment secrets
gh secret list --env production
```

### Configuring Environment Protection

**Via GitHub UI:**

1. **Settings** → **Environments** → **New environment**
2. Enter name: `production`
3. Configure protection rules:
   - ✅ Required reviewers
   - ✅ Wait timer
   - ✅ Branch restrictions

### Using Environment Secrets

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    # Specify environment
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy
        env:
          # Environment-specific secrets
          API_KEY: ${{ secrets.PROD_API_KEY }}
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
        run: |
          echo "Deploying to production..."
          ./deploy.sh
```

### Multiple Environments Example

```yaml
name: Multi-Environment Deploy

on:
  push:
    branches: [main, staging, dev]

jobs:
  deploy-dev:
    if: github.ref == 'refs/heads/dev'
    environment: development
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Dev
        env:
          API_KEY: ${{ secrets.DEV_API_KEY }}
        run: ./deploy.sh dev
  
  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Staging
        env:
          API_KEY: ${{ secrets.STAGING_API_KEY }}
        run: ./deploy.sh staging
  
  deploy-production:
    if: github.ref == 'refs/heads/main'
    environment: production
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        env:
          API_KEY: ${{ secrets.PROD_API_KEY }}
        run: ./deploy.sh production
```

---

## OIDC Authentication

**OpenID Connect (OIDC)** eliminates long-lived secrets by using short-lived tokens.

### Benefits

✅ **No long-lived secrets**  
✅ **Automatic token rotation**  
✅ **Better audit trail**  
✅ **Cloud provider integration**

### Azure OIDC Setup

#### 1. Create Azure App Registration

```bash
# Create app registration
az ad app create --display-name "GitHub Actions OIDC"

# Get app ID
APP_ID=$(az ad app list --display-name "GitHub Actions OIDC" --query "[0].appId" -o tsv)

# Create service principal
az ad sp create --id $APP_ID

# Get service principal object ID
SP_OBJECT_ID=$(az ad sp show --id $APP_ID --query id -o tsv)

# Assign role
az role assignment create \
  --role Contributor \
  --assignee $SP_OBJECT_ID \
  --scope /subscriptions/{subscription-id}/resourceGroups/{resource-group}
```

#### 2. Configure Federated Credentials

```bash
# For main branch deployments
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-actions-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:your-org/your-repo:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# For pull requests
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-actions-pr",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:your-org/your-repo:pull_request",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# For specific environment
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-actions-production",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:your-org/your-repo:environment:production",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

#### 3. Store Azure Information as Secrets

```bash
# These are not sensitive - just identifiers
gh secret set AZURE_CLIENT_ID --body "$APP_ID"
gh secret set AZURE_TENANT_ID --body "$(az account show --query tenantId -o tsv)"
gh secret set AZURE_SUBSCRIPTION_ID --body "$(az account show --query id -o tsv)"
```

#### 4. Use in GitHub Actions

```yaml
name: Azure Deployment with OIDC

on:
  push:
    branches: [main]

permissions:
  id-token: write  # Required for OIDC
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Azure Login (OIDC)
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      
      - name: Deploy to Azure
        run: |
          az webapp deploy --resource-group myRG --name myApp --src-path dist/
```

### AWS OIDC Setup

#### 1. Create IAM Role

```bash
# Create trust policy
cat > trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::{account-id}:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:your-org/your-repo:ref:refs/heads/main"
        }
      }
    }
  ]
}
EOF

# Create role
aws iam create-role \
  --role-name GitHubActionsRole \
  --assume-role-policy-document file://trust-policy.json

# Attach policy
aws iam attach-role-policy \
  --role-name GitHubActionsRole \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess
```

#### 2. Store AWS Information

```bash
gh secret set AWS_ROLE_ARN --body "arn:aws:iam::{account-id}:role/GitHubActionsRole"
```

#### 3. Use in GitHub Actions

```yaml
name: AWS Deployment with OIDC

on:
  push:
    branches: [main]

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-east-1
      
      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://my-bucket/
```

---

## Dependabot Secrets

Dependabot runs in a restricted environment with limited access to secrets.

### Setting Dependabot Secrets

```bash
# Set Dependabot secret (requires specific API)
gh api repos/{owner}/{repo}/dependabot/secrets/NPM_TOKEN \
  -X PUT \
  -f encrypted_value="..." \
  -f key_id="..."

# Or via UI:
# Settings → Secrets and variables → Dependabot → New repository secret
```

### Using Dependabot Secrets

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
    registries:
      - npm-registry
    
registries:
  npm-registry:
    type: npm-registry
    url: https://npm.pkg.github.com
    token: ${{ secrets.NPM_TOKEN }}
```

---

## Secret Rotation Procedures

### Manual Rotation

```bash
# 1. Generate new credential
NEW_KEY=$(openssl rand -base64 32)

# 2. Update GitHub secret
gh secret set API_KEY --body "$NEW_KEY"

# 3. Trigger workflow to verify
gh workflow run deploy.yml

# 4. Revoke old credential (after verification)
# (cloud provider specific)
```

### Automated Rotation Script

```bash
#!/bin/bash
# scripts/rotate-secrets.sh

set -e

SECRETS=(
  "AZURE_CLIENT_SECRET"
  "API_KEY"
  "DATABASE_PASSWORD"
)

for SECRET in "${SECRETS[@]}"; do
  echo "🔄 Rotating $SECRET..."
  
  # Generate new value (example for Azure)
  if [[ $SECRET == "AZURE_CLIENT_SECRET" ]]; then
    NEW_VALUE=$(az ad sp credential reset \
      --id "$AZURE_CLIENT_ID" \
      --query password -o tsv)
  else
    NEW_VALUE=$(openssl rand -base64 32)
  fi
  
  # Update GitHub secret
  gh secret set "$SECRET" --body "$NEW_VALUE"
  
  echo "✅ Rotated $SECRET"
done

echo "🎉 All secrets rotated successfully"
```

### Rotation Workflow

```yaml
name: Rotate Secrets

on:
  schedule:
    # Run every 90 days
    - cron: '0 0 1 */3 *'
  workflow_dispatch:  # Manual trigger

jobs:
  rotate:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Azure Login (OIDC)
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      
      - name: Rotate Azure Client Secret
        id: rotate
        run: |
          NEW_SECRET=$(az ad sp credential reset \
            --id ${{ secrets.AZURE_CLIENT_ID }} \
            --query password -o tsv)
          echo "::add-mask::$NEW_SECRET"
          echo "new_secret=$NEW_SECRET" >> $GITHUB_OUTPUT
      
      - name: Update GitHub Secret
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh secret set AZURE_CLIENT_SECRET --body "${{ steps.rotate.outputs.new_secret }}"
```

---

## Best Practices

### ✅ DO

- Use environment secrets for deployments
- Rotate secrets every 90 days
- Use OIDC when possible (no long-lived secrets)
- Apply least privilege (limit secret access)
- Use different secrets per environment
- Mask secrets in logs (`echo "::add-mask::$SECRET"`)
- Audit secret access regularly
- Delete unused secrets

### ❌ DON'T

- Hardcode secrets in workflows
- Log secrets (GitHub masks them, but still avoid)
- Use same secret across environments
- Share secrets via email/chat
- Store secrets in code or config files
- Use weak or predictable secrets
- Ignore rotation schedules

---

## Security Considerations

### Secret Masking

GitHub automatically masks secrets in logs:

```yaml
- name: Example
  env:
    API_KEY: ${{ secrets.API_KEY }}
  run: |
    # This will be masked: ***
    echo "$API_KEY"
    
    # Manually mask additional values
    echo "::add-mask::$DERIVED_VALUE"
```

### Access Control

**Limit who can access secrets:**

1. **Settings** → **Actions** → **General**
2. **Fork pull request workflows** → Configure:
   - Require approval for first-time contributors
   - Require approval for all outside collaborators

### Secret Scoping

```yaml
# ✅ Good: Minimal scope
- name: Deploy
  env:
    DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
  run: ./deploy.sh

# ❌ Bad: Entire workflow has access
env:
  DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # All steps can access DEPLOY_KEY
```

---

## Troubleshooting

### Secret Not Found

**Error:** `Secret not found: API_KEY`

**Solutions:**

```bash
# 1. Verify secret exists
gh secret list

# 2. Check secret name (case-sensitive!)
gh secret set API_KEY --body "value"  # Correct
gh secret set api_key --body "value"  # Wrong!

# 3. Verify environment (if using environment secrets)
gh secret list --env production
```

### OIDC Authentication Failure

**Error:** `Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN`

**Solutions:**

1. Add permissions to workflow:
```yaml
permissions:
  id-token: write
  contents: read
```

2. Verify federated credential subject matches:
```bash
# Check configured subjects
az ad app federated-credential list --id $APP_ID
```

### Secret Not Masked

**Problem:** Secret appears in logs

**Solution:**

```yaml
# Explicitly mask secret
- name: Process secret
  env:
    SECRET: ${{ secrets.MY_SECRET }}
  run: |
    echo "::add-mask::$SECRET"
    # Use secret safely
```

---

## Integration with justfile

```make
# Set GitHub secret
gh-secret-set NAME VALUE:
    gh secret set {{NAME}} --body "{{VALUE}}"

# List GitHub secrets
gh-secret-list:
    gh secret list

# Rotate all secrets
rotate-secrets:
    ./scripts/rotate-secrets.sh

# Verify OIDC setup
verify-oidc:
    gh workflow run test-oidc.yml
```

---

## Advanced: Secret Encryption

### Encrypting Secrets Locally

```bash
# Install libsodium (required)
pip install pynacl

# Encrypt script
python << EOF
from base64 import b64encode
from nacl import encoding, public
import requests

# Get repository public key
response = requests.get(
    "https://api.github.com/repos/OWNER/REPO/actions/secrets/public-key",
    headers={"Authorization": "token YOUR_PAT"}
)
public_key = public.PublicKey(
    response.json()["key"].encode("utf-8"),
    encoding.Base64Encoder()
)

# Encrypt secret
sealed_box = public.SealedBox(public_key)
encrypted = sealed_box.encrypt(b"my-secret-value")
print(b64encode(encrypted).decode("utf-8"))
EOF
```

---

## References

- **GitHub Secrets Documentation**: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **OIDC with GitHub Actions**: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect
- **Azure OIDC Setup**: https://docs.microsoft.com/en-us/azure/developer/github/connect-from-azure
- **OWASP Secrets Management**: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html

---

**Next Steps:**
- Configure [Azure OIDC](./azure-credentials.md#oidc-modern---recommended)
- Set up [Credential Management](./credential-management.md)
- Review [Secret Scanning](./secret-scanning.md)

---

*"In the world of automation, secrets should be ephemeral, rotated, and never exposed."* — M. Gustave H.
