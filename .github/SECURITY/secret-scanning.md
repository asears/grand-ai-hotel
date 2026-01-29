# Secret Scanning Guide

## Overview

Secret scanning prevents sensitive credentials from being committed to the repository. This guide covers multiple tools and strategies for detecting and preventing secret leakage.

## Why Secret Scanning Matters

According to OWASP:
- **A02:2021 – Cryptographic Failures** includes exposure of sensitive data
- **A07:2021 – Identification and Authentication Failures** often result from exposed credentials

**Common consequences of exposed secrets:**
- Unauthorized access to cloud resources
- Data breaches and compliance violations
- Financial loss from resource abuse
- Reputational damage

## Multi-Layer Defense Strategy

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: Pre-commit Hooks (prek + detect-secrets)  │
│         Block secrets before commit                 │
├─────────────────────────────────────────────────────┤
│ Layer 2: Repository Scanning (gitleaks)            │
│         Scan existing repository                    │
├─────────────────────────────────────────────────────┤
│ Layer 3: History Scanning (truffleHog)             │
│         Deep dive into Git history                  │
├─────────────────────────────────────────────────────┤
│ Layer 4: GitHub Advanced Security                   │
│         Continuous monitoring and alerts            │
└─────────────────────────────────────────────────────┘
```

---

## Tool 1: detect-secrets

**Best for:** Pre-commit scanning and baseline management

### Installation

```bash
# Using pip
pip install detect-secrets

# Using pipx (recommended for CLI tools)
pipx install detect-secrets
```

### Configuration

Create `.secrets.baseline` in repository root:

```bash
# Generate initial baseline
detect-secrets scan > .secrets.baseline

# Audit the baseline (mark false positives)
detect-secrets audit .secrets.baseline
```

### Usage

```bash
# Scan entire repository
detect-secrets scan

# Scan specific files
detect-secrets scan src/ --baseline .secrets.baseline

# Update baseline with new files
detect-secrets scan --baseline .secrets.baseline

# Find new secrets since baseline
detect-secrets scan --baseline .secrets.baseline --list-all-found
```

### Configuration File (pyproject.toml)

```toml
[tool.detect_secrets]
exclude_files = '''
  .*\.lock$|
  .*\.min\.js$|
  \.git/|
  \.venv/|
  node_modules/|
  dist/|
  build/
'''

[tool.detect_secrets.filters_used]
plugins = [
    "ArtifactoryDetector",
    "AWSKeyDetector",
    "AzureStorageKeyDetector",
    "Base64HighEntropyString",
    "BasicAuthDetector",
    "CloudantDetector",
    "DiscordBotTokenDetector",
    "GitHubTokenDetector",
    "HexHighEntropyString",
    "IbmCloudIamDetector",
    "IbmCosHmacDetector",
    "IPPublicDetector",
    "JwtTokenDetector",
    "KeywordDetector",
    "MailchimpDetector",
    "NpmDetector",
    "PrivateKeyDetector",
    "PypiTokenDetector",
    "SendGridDetector",
    "SlackDetector",
    "SoftlayerDetector",
    "SquareOAuthDetector",
    "StripeDetector",
    "TwilioKeyDetector"
]
```

### Managing False Positives

```bash
# Inline pragma to ignore a line
api_key = "not-a-real-key"  # pragma: allowlist secret

# Audit baseline to mark false positives
detect-secrets audit .secrets.baseline
# Press 'n' for false positives, 'y' for real secrets
```

---

## Tool 2: gitleaks

**Best for:** Fast scanning with custom rules

### Installation

```bash
# Windows (via winget)
winget install gitleaks

# Using Go
go install github.com/gitleaks/gitleaks/v8@latest

# Using Chocolatey
choco install gitleaks
```

### Configuration

Create `.gitleaks.toml` in repository root:

```toml
title = "Grand Budapest Terminal Gitleaks Config"

[extend]
useDefault = true

[[rules]]
id = "azure-storage-key"
description = "Azure Storage Account Key"
regex = '''(?i)(DefaultEndpointsProtocol=https;AccountName=.*?;AccountKey=)([A-Za-z0-9+/]{86}==)'''
tags = ["azure", "storage"]

[[rules]]
id = "github-pat"
description = "GitHub Personal Access Token"
regex = '''ghp_[0-9a-zA-Z]{36}'''
tags = ["github", "token"]

[[rules]]
id = "github-oauth"
description = "GitHub OAuth Token"
regex = '''gho_[0-9a-zA-Z]{36}'''
tags = ["github", "oauth"]

[[rules]]
id = "github-app-token"
description = "GitHub App Token"
regex = '''(ghu|ghs)_[0-9a-zA-Z]{36}'''
tags = ["github", "app"]

[[rules]]
id = "azure-subscription-key"
description = "Azure Subscription Key"
regex = '''(?i)(subscription-key|subscriptionkey|Ocp-Apim-Subscription-Key)['"\s]*[:=]\s*['"]?([a-f0-9]{32})['"]?'''
tags = ["azure", "api"]

[[rules]]
id = "openai-api-key"
description = "OpenAI API Key"
regex = '''sk-[a-zA-Z0-9]{48}'''
tags = ["openai", "api"]

[allowlist]
description = "Allowlist for false positives"
paths = [
  '''.secrets.baseline''',
  '''.*\.example$''',
  '''.*\.sample$''',
  '''.*\.template$''',
  '''tests/fixtures/'''
]

regexes = [
  '''EXAMPLE_.*''',
  '''DUMMY_.*''',
  '''FAKE_.*''',
  '''TEST_.*'''
]
```

### Usage

```bash
# Scan entire repository
gitleaks detect --source . --verbose

# Scan uncommitted files
gitleaks protect --staged --verbose

# Scan with custom config
gitleaks detect --config .gitleaks.toml

# Generate report
gitleaks detect --report-format json --report-path gitleaks-report.json

# Scan specific directory
gitleaks detect --source ./src --verbose
```

---

## Tool 3: truffleHog

**Best for:** Deep history scanning and entropy detection

### Installation

```bash
# Using Go
go install github.com/trufflesecurity/trufflehog/v3@latest

# Using Docker
docker pull trufflesecurity/trufflehog:latest

# Windows binary
# Download from: https://github.com/trufflesecurity/trufflehog/releases
```

### Usage

```bash
# Scan entire Git history
trufflehog git file://. --only-verified

# Scan specific branch
trufflehog git file://. --branch main

# Scan since specific commit
trufflehog git file://. --since-commit abc123

# Scan GitHub repository
trufflehog github --org your-org --repo your-repo

# Generate JSON report
trufflehog git file://. --json > trufflehog-report.json

# Scan with custom regex
trufflehog git file://. --regex --rules custom-rules.yaml
```

### Custom Rules (custom-rules.yaml)

```yaml
rules:
  - id: azure-tenant-id
    description: Azure Tenant ID
    regex: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
    tags:
      - azure
      - tenant
    
  - id: azure-client-secret
    description: Azure Client Secret
    regex: '([a-zA-Z0-9_\-~\.]{34,})'
    keywords:
      - AZURE_CLIENT_SECRET
      - CLIENT_SECRET
    
  - id: copilot-token
    description: GitHub Copilot Token
    regex: 'ghu_[A-Za-z0-9]{36,255}'
    tags:
      - github
      - copilot
```

---

## Tool 4: prek Pre-commit Hooks

**Best for:** Automated prevention at commit time

### Installation

```bash
# Install prek
pip install prek

# Or using pipx
pipx install prek
```

### Configuration (prek.toml)

Create or update `prek.toml`:

```toml
[[hooks]]
name = "detect-secrets"
command = "detect-secrets scan --baseline .secrets.baseline"
pass_filenames = false
description = "Scan for secrets using detect-secrets"

[[hooks]]
name = "gitleaks"
command = "gitleaks protect --staged --verbose"
pass_filenames = false
description = "Scan staged files for secrets using gitleaks"

[[hooks]]
name = "trufflehog-staged"
command = "git diff --staged --name-only | xargs trufflehog filesystem"
pass_filenames = false
description = "Scan staged files with trufflehog"

[[hooks]]
name = "check-secrets-patterns"
command = "python scripts/check_secrets.py"
pass_filenames = true
description = "Custom secret pattern checker"
```

### Installation and Usage

```bash
# Install hooks
prek install

# Test hooks without committing
prek run

# Run specific hook
prek run detect-secrets

# Bypass hooks (emergency only!)
git commit --no-verify -m "Emergency fix"
```

---

## Common Secret Patterns to Detect

### API Keys and Tokens

```regex
# Generic API Key
api[_-]?key['"\s]*[:=]\s*['"]?([a-zA-Z0-9_\-]{20,})['"]?

# Generic Token
token['"\s]*[:=]\s*['"]?([a-zA-Z0-9_\-]{20,})['"]?

# Generic Secret
secret['"\s]*[:=]\s*['"]?([a-zA-Z0-9_\-]{20,})['"]?
```

### Cloud Provider Credentials

```regex
# AWS Access Key
AKIA[0-9A-Z]{16}

# AWS Secret Key
aws_secret_access_key['"\s]*[:=]\s*['"]?([A-Za-z0-9/+=]{40})['"]?

# Azure Storage Key
DefaultEndpointsProtocol=https;AccountName=.*?;AccountKey=([A-Za-z0-9+/]{86}==)

# Azure Client Secret
[a-zA-Z0-9_\-~\.]{34,}

# Google Cloud Key
"type"\s*:\s*"service_account"
```

### GitHub Tokens

```regex
# Personal Access Token (classic)
ghp_[0-9a-zA-Z]{36}

# OAuth Token
gho_[0-9a-zA-Z]{36}

# User-to-Server Token
ghu_[0-9a-zA-Z]{36}

# Server-to-Server Token
ghs_[0-9a-zA-Z]{36}

# Refresh Token
ghr_[0-9a-zA-Z]{36}
```

### Database Connection Strings

```regex
# Generic connection string with password
(mongodb|mysql|postgres|postgresql)://[^:]+:([^@]+)@

# SQL Server
Server=.*;Password=([^;]+);

# Redis
redis://:([^@]+)@
```

---

## Managing .secrets.baseline

### Initial Setup

```bash
# Generate baseline
detect-secrets scan > .secrets.baseline

# Audit and mark false positives
detect-secrets audit .secrets.baseline
```

### Updating Baseline

```bash
# Add new files to baseline
detect-secrets scan --baseline .secrets.baseline

# Re-audit after updates
detect-secrets audit .secrets.baseline
```

### Example .secrets.baseline Structure

```json
{
  "version": "1.4.0",
  "plugins_used": [
    {
      "name": "ArtifactoryDetector"
    },
    {
      "name": "AWSKeyDetector"
    },
    {
      "name": "AzureStorageKeyDetector"
    }
  ],
  "results": {
    "examples/config.example.yaml": [
      {
        "type": "Secret Keyword",
        "filename": "examples/config.example.yaml",
        "line_number": 5,
        "is_verified": false,
        "is_secret": false
      }
    ]
  }
}
```

---

## GitHub Advanced Security Integration

### Enabling Secret Scanning

1. **Repository Settings** → **Security** → **Code security and analysis**
2. Enable **Secret scanning**
3. Enable **Push protection** (blocks commits with secrets)

### Custom Patterns

Add custom patterns in **Settings** → **Security** → **Secret scanning**:

```yaml
# Example: Custom API key pattern
name: Custom API Key
pattern: CUSTOM_API_[A-Z0-9]{32}
```

### Handling Alerts

```bash
# List secret scanning alerts via gh CLI
gh api repos/{owner}/{repo}/secret-scanning/alerts

# Close an alert
gh api repos/{owner}/{repo}/secret-scanning/alerts/{alert_number} \
  -X PATCH \
  -f state=resolved \
  -f resolution=revoked
```

---

## Remediation Workflow

### If a Secret is Detected

1. **Don't panic** - Follow these steps:

```bash
# 1. Immediately revoke the exposed credential
# (GitHub, Azure Portal, AWS Console, etc.)

# 2. Remove from Git history (if already committed)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (if safe to do so)
git push origin --force --all

# 4. Generate new credentials
# (Use proper credential management from now on)

# 5. Update .secrets.baseline
detect-secrets scan > .secrets.baseline
```

### Using BFG Repo-Cleaner (Alternative)

```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Create file with secrets to remove
echo "old-secret-value" > secrets.txt

# Clean repository
java -jar bfg.jar --replace-text secrets.txt

# Force push
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push origin --force --all
```

---

## Best Practices

### DO ✅

- Run secret scanning tools before every commit
- Maintain `.secrets.baseline` for false positives
- Use pre-commit hooks (`prek`) to automate scanning
- Educate team members on secret management
- Rotate credentials immediately if exposed
- Use `.gitignore` to exclude sensitive file patterns
- Enable GitHub push protection

### DON'T ❌

- Commit `.env` files with real credentials
- Store secrets in code comments
- Use `--no-verify` flag unless absolutely necessary
- Ignore secret scanning warnings
- Assume deleted secrets are safe (they're in history!)
- Share credentials via chat or email

---

## Integration with justfile

Create recipes in `justfile`:

```make
# Scan for secrets using all tools
scan-secrets:
    @echo "🔍 Scanning for secrets..."
    detect-secrets scan --baseline .secrets.baseline
    gitleaks detect --source . --verbose
    @echo "✅ Secret scan complete"

# Update secrets baseline
update-baseline:
    detect-secrets scan > .secrets.baseline
    detect-secrets audit .secrets.baseline

# Deep scan with truffleHog
deep-scan:
    @echo "🔍 Deep scanning Git history..."
    trufflehog git file://. --only-verified --json > trufflehog-report.json
    @echo "✅ Report saved to trufflehog-report.json"

# Install security tools
install-security-tools:
    pip install detect-secrets
    pipx install prek
    winget install gitleaks
    @echo "✅ Security tools installed"
```

---

## Troubleshooting

### False Positives

**Problem:** Legitimate code flagged as secret

**Solution:**
```python
# Use pragma comment
dummy_key = "not-a-real-secret"  # pragma: allowlist secret

# Or add to .secrets.baseline
detect-secrets audit .secrets.baseline  # Mark as false positive
```

### Pre-commit Hook Failures

**Problem:** Hook blocks legitimate commit

**Solution:**
```bash
# Review the finding first
detect-secrets scan path/to/file.py

# If false positive, update baseline
detect-secrets scan --baseline .secrets.baseline

# Emergency bypass (use sparingly!)
git commit --no-verify -m "Fix"
```

### Performance Issues

**Problem:** Scanning takes too long

**Solution:**
```bash
# Exclude large directories in .gitleaks.toml
[allowlist]
paths = [
  '''node_modules/''',
  '''\.venv/''',
  '''dist/''',
  '''build/'''
]

# Or scan only changed files
gitleaks protect --staged
```

---

## References

- **OWASP Secrets Management Cheat Sheet**: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- **detect-secrets Documentation**: https://github.com/Yelp/detect-secrets
- **gitleaks Documentation**: https://github.com/gitleaks/gitleaks
- **truffleHog Documentation**: https://github.com/trufflesecurity/trufflehog
- **GitHub Secret Scanning**: https://docs.github.com/en/code-security/secret-scanning

---

**Next Steps:**
- Set up [Credential Management](.github/SECURITY/credential-management.md)
- Configure [GitHub Secrets](.github/SECURITY/github-secrets.md)
- Review [Azure Credentials Guide](.github/SECURITY/azure-credentials.md)

---

*"A secret exposed is a disaster waiting to happen. Prevention is elementary."* — M. Gustave H.
