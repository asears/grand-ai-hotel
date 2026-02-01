# GCP Security Guardrails Guide

**Production Security Best Practices for Google Cloud Platform**

*Implement defense-in-depth security with automated guardrails and zero-trust architecture.*

---

## Table of Contents

1. [Introduction](#introduction)
2. [VPC Service Controls](#vpc-service-controls)
3. [Secret Manager Integration](#secret-manager-integration)
4. [Workload Identity](#workload-identity)
5. [Binary Authorization](#binary-authorization)
6. [Cloud Armor](#cloud-armor)
7. [Security Command Center](#security-command-center)
8. [Compliance Frameworks](#compliance-frameworks)
9. [Security Best Practices Checklist](#security-best-practices-checklist)
10. [Incident Response](#incident-response)

---

## Introduction

Security must be built into your GCP infrastructure from day one. This guide implements a defense-in-depth strategy with multiple layers of security controls.

### Security Principles

**Zero Trust Architecture:**
- Never trust, always verify
- Verify explicitly (identity, device, location)
- Use least privilege access
- Assume breach mentality

**Defense in Depth:**
```
┌─────────────────────────────────────────┐
│   Organization Policy (Preventive)      │
├─────────────────────────────────────────┤
│   VPC Service Controls (Perimeter)      │
├─────────────────────────────────────────┤
│   IAM + Workload Identity (Identity)    │
├─────────────────────────────────────────┤
│   Binary Authorization (Supply Chain)   │
├─────────────────────────────────────────┤
│   Cloud Armor (Network)                 │
├─────────────────────────────────────────┤
│   Security Command Center (Detection)   │
└─────────────────────────────────────────┘
```

### Security Maturity Model

**Level 1: Foundational**
- IAM roles configured
- Basic monitoring enabled
- Service accounts instead of user accounts

**Level 2: Enhanced**
- Workload Identity enabled
- Secret Manager for all secrets
- VPC Service Controls configured
- Organization Policies enforced

**Level 3: Advanced**
- Binary Authorization enforced
- Cloud Armor deployed
- Security Command Center Premium
- Automated compliance scanning
- Incident response runbooks

---

## VPC Service Controls

**VPC Service Controls** create security perimeters to prevent data exfiltration and unauthorized access to GCP resources.

### Overview

**What It Is:**
- Creates security perimeters around GCP services
- Prevents data exfiltration
- Controls access based on identity and context
- Works across projects

**Key Concepts:**
- **Access Policy:** Container for all access controls (one per organization)
- **Service Perimeter:** Boundary around resources
- **Access Levels:** Conditions for allowing access

### Architecture

```
┌──────────────────────────────────────────────────────┐
│              Organization Access Policy               │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │        Production Perimeter                    │  │
│  │  ┌──────────────┐  ┌──────────────┐           │  │
│  │  │  Project A   │  │  Project B   │           │  │
│  │  │  - Storage   │  │  - BigQuery  │           │  │
│  │  │  - BigQuery  │  │  - Storage   │           │  │
│  │  └──────────────┘  └──────────────┘           │  │
│  │                                                │  │
│  │  Restricted Services:                         │  │
│  │  - storage.googleapis.com                     │  │
│  │  - bigquery.googleapis.com                    │  │
│  │  - secretmanager.googleapis.com               │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │        Development Perimeter                   │  │
│  │  ┌──────────────┐                              │  │
│  │  │  Project C   │                              │  │
│  │  │  - Storage   │                              │  │
│  │  └──────────────┘                              │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Setup

**1. Enable Required APIs:**
```bash
gcloud services enable accesscontextmanager.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
```

**2. Create Access Policy:**
```bash
# Get organization ID
gcloud organizations list

# Create access policy
gcloud access-context-manager policies create \
    --organization ORGANIZATION_ID \
    --title "Production Access Policy"

# Get policy ID
gcloud access-context-manager policies list \
    --organization ORGANIZATION_ID
```

**3. Define Access Levels:**
```yaml
# access-level.yaml
- name: corp_network
  title: Corporate Network Access
  basic:
    conditions:
    - ipSubnetworks:
      - "203.0.113.0/24"  # Corporate IP range
      
- name: trusted_devices
  title: Trusted Device Access
  basic:
    conditions:
    - devicePolicy:
        requireScreenlock: true
        requireCorpOwned: true
        
- name: production_access
  title: Production Environment Access
  basic:
    combiningFunction: AND
    conditions:
    - members:
      - "user:admin@company.com"
      - "group:sre-team@company.com"
    - ipSubnetworks:
      - "203.0.113.0/24"
```

**Import Access Levels:**
```bash
gcloud access-context-manager levels create corp_network \
    --title="Corporate Network" \
    --basic-level-spec=access-level.yaml \
    --policy=POLICY_ID
```

**4. Create Service Perimeter:**
```bash
# Get project numbers
gcloud projects describe PROJECT_ID --format="value(projectNumber)"

# Create perimeter
gcloud access-context-manager perimeters create production_perimeter \
    --title="Production Perimeter" \
    --resources="projects/PROJECT_NUMBER_1,projects/PROJECT_NUMBER_2" \
    --restricted-services="storage.googleapis.com,bigquery.googleapis.com,secretmanager.googleapis.com" \
    --access-levels="production_access" \
    --policy=POLICY_ID
```

**5. Perimeter Configuration (YAML):**
```yaml
# perimeter.yaml
name: accessPolicies/POLICY_ID/servicePerimeters/production_perimeter
title: Production Perimeter
description: Protects production data and services
perimeterType: PERIMETER_TYPE_REGULAR

status:
  resources:
    - projects/123456789  # Production Project A
    - projects/987654321  # Production Project B
  
  restrictedServices:
    - storage.googleapis.com
    - bigquery.googleapis.com
    - secretmanager.googleapis.com
    - compute.googleapis.com
  
  accessLevels:
    - accessPolicies/POLICY_ID/accessLevels/production_access
  
  vpcAccessibleServices:
    enableRestriction: true
    allowedServices:
      - storage.googleapis.com
      - bigquery.googleapis.com
  
  ingressPolicies:
    - ingressFrom:
        sources:
          - accessLevel: accessPolicies/POLICY_ID/accessLevels/corp_network
        identities:
          - serviceAccount:cloud-build@PROJECT_ID.iam.gserviceaccount.com
      ingressTo:
        operations:
          - serviceName: storage.googleapis.com
            methodSelectors:
              - method: "*"
        resources:
          - projects/123456789
  
  egressPolicies:
    - egressFrom:
        identities:
          - serviceAccount:app@PROJECT_ID.iam.gserviceaccount.com
      egressTo:
        operations:
          - serviceName: bigquery.googleapis.com
            methodSelectors:
              - method: "*"
        resources:
          - projects/987654321
```

**Update Perimeter:**
```bash
gcloud access-context-manager perimeters update production_perimeter \
    --policy=POLICY_ID \
    --set-restricted-services="storage.googleapis.com,bigquery.googleapis.com" \
    --add-resources="projects/PROJECT_NUMBER"
```

### Dry Run Mode

**Test Before Enforcing:**
```bash
# Create perimeter in dry run mode
gcloud access-context-manager perimeters dry-run create production_perimeter \
    --perimeter-title="Production Perimeter" \
    --perimeter-resources="projects/PROJECT_NUMBER" \
    --perimeter-restricted-services="storage.googleapis.com" \
    --policy=POLICY_ID

# Monitor violations (without blocking)
gcloud logging read "protoPayload.metadata.dryRun=true" --limit 50
```

### Best Practices

**1. Start with Dry Run:**
```bash
# Always test in dry run mode first
# Monitor for 2-4 weeks before enforcing
```

**2. Use Ingress/Egress Policies:**
```yaml
# Allow specific service accounts to cross perimeter
ingressPolicies:
  - ingressFrom:
      identities:
        - serviceAccount:ci-cd@PROJECT_ID.iam.gserviceaccount.com
```

**3. Monitor Violations:**
```bash
# Query for VPC-SC violations
gcloud logging read '
  protoPayload.metadata.violationReason:*
  AND resource.type="audited_resource"
' --limit 100
```

---

## Secret Manager Integration

**Secret Manager** securely stores API keys, passwords, certificates, and other sensitive data. **Never hardcode secrets in code or configuration files.**

### Overview

**What It Is:**
- Centralized secret management
- Automatic encryption at rest
- Versioning and rotation
- Audit logging
- Fine-grained IAM access

**When to Use:**
- Database passwords
- API keys
- OAuth tokens
- TLS certificates
- Any sensitive configuration

### Setup

**1. Enable API:**
```bash
gcloud services enable secretmanager.googleapis.com
```

**2. Create Secrets:**
```bash
# Create secret from literal value
echo -n "super-secret-password" | gcloud secrets create db-password \
    --data-file=- \
    --replication-policy="automatic" \
    --labels="environment=production,app=backend"

# Create secret from file
gcloud secrets create api-key \
    --data-file="./api-key.txt" \
    --replication-policy="automatic"

# Create secret with specific regions
gcloud secrets create db-password \
    --replication-policy="user-managed" \
    --locations="us-central1,us-east1"
```

**3. Grant Access:**
```bash
# Grant service account access to secret
gcloud secrets add-iam-policy-binding db-password \
    --member="serviceAccount:app@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# Grant user access
gcloud secrets add-iam-policy-binding db-password \
    --member="user:developer@company.com" \
    --role="roles/secretmanager.secretAccessor"
```

### Using Secrets

**Python:**
```python
from google.cloud import secretmanager

def access_secret(project_id: str, secret_id: str, version_id: str = "latest") -> str:
    """Access secret from Secret Manager."""
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

# Usage
database_password = access_secret("my-project", "db-password")
```

**Node.js:**
```javascript
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

async function accessSecret(projectId, secretId, version = 'latest') {
  const client = new SecretManagerServiceClient();
  const name = `projects/${projectId}/secrets/${secretId}/versions/${version}`;
  
  const [version_response] = await client.accessSecretVersion({name});
  const payload = version_response.payload.data.toString('utf8');
  return payload;
}

// Usage
const dbPassword = await accessSecret('my-project', 'db-password');
```

**Go:**
```go
package main

import (
    "context"
    "fmt"
    secretmanager "cloud.google.com/go/secretmanager/apiv1"
    secretmanagerpb "cloud.google.com/go/secretmanager/apiv1/secretmanagerpb"
)

func accessSecret(projectID, secretID string) (string, error) {
    ctx := context.Background()
    client, err := secretmanager.NewClient(ctx)
    if err != nil {
        return "", err
    }
    defer client.Close()
    
    name := fmt.Sprintf("projects/%s/secrets/%s/versions/latest", projectID, secretID)
    req := &secretmanagerpb.AccessSecretVersionRequest{
        Name: name,
    }
    
    result, err := client.AccessSecretVersion(ctx, req)
    if err != nil {
        return "", err
    }
    
    return string(result.Payload.Data), nil
}
```

### Integration with GCP Services

**Cloud Run:**
```bash
# Mount secret as environment variable
gcloud run deploy my-service \
    --image gcr.io/PROJECT_ID/my-app \
    --set-secrets "DATABASE_PASSWORD=db-password:latest,API_KEY=api-key:1"

# Mount secret as file
gcloud run deploy my-service \
    --image gcr.io/PROJECT_ID/my-app \
    --set-secrets "/secrets/db-password=db-password:latest"
```

**Cloud Functions:**
```bash
gcloud functions deploy my-function \
    --runtime python311 \
    --set-secrets "DATABASE_PASSWORD=db-password:latest"
```

**GKE (Kubernetes Secret):**
```bash
# Create Kubernetes secret from Secret Manager
kubectl create secret generic db-credentials \
    --from-literal=password="$(gcloud secrets versions access latest --secret=db-password)"

# Or use External Secrets Operator (recommended)
```

**External Secrets Operator (GKE):**
```yaml
# Install External Secrets Operator
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: gcpsm-secret-store
spec:
  provider:
    gcpsm:
      projectID: "my-project"
      auth:
        workloadIdentity:
          clusterLocation: us-central1
          clusterName: my-cluster
          serviceAccountRef:
            name: external-secrets-sa
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: gcpsm-secret-store
    kind: SecretStore
  target:
    name: db-credentials
    creationPolicy: Owner
  data:
  - secretKey: password
    remoteRef:
      key: db-password
```

### Secret Rotation

**Manual Rotation:**
```bash
# Add new version
echo -n "new-password" | gcloud secrets versions add db-password \
    --data-file=-

# List versions
gcloud secrets versions list db-password

# Disable old version
gcloud secrets versions disable 1 --secret=db-password

# Destroy old version (irreversible)
gcloud secrets versions destroy 1 --secret=db-password
```

**Automatic Rotation (Cloud Functions):**
```python
# Cloud Function triggered by Cloud Scheduler
import functions_framework
from google.cloud import secretmanager
import random
import string

@functions_framework.http
def rotate_secret(request):
    """Rotate database password."""
    project_id = "my-project"
    secret_id = "db-password"
    
    # Generate new password
    new_password = ''.join(random.choices(
        string.ascii_letters + string.digits + string.punctuation, k=32
    ))
    
    # Update database with new password
    update_database_password(new_password)
    
    # Add new version to Secret Manager
    client = secretmanager.SecretManagerServiceClient()
    parent = f"projects/{project_id}/secrets/{secret_id}"
    
    payload = {"data": new_password.encode("UTF-8")}
    response = client.add_secret_version(
        request={"parent": parent, "payload": payload}
    )
    
    return f"Rotated secret: {response.name}"
```

**Schedule Rotation:**
```bash
# Create Cloud Scheduler job to rotate monthly
gcloud scheduler jobs create http rotate-db-password \
    --schedule="0 0 1 * *" \
    --uri="https://REGION-PROJECT_ID.cloudfunctions.net/rotate-secret" \
    --http-method=POST \
    --oidc-service-account-email=scheduler@PROJECT_ID.iam.gserviceaccount.com
```

### Best Practices

**1. Never Store Secrets in Code:**
```python
# ❌ BAD
DATABASE_PASSWORD = "super-secret-password"

# ✅ GOOD
from google.cloud import secretmanager
DATABASE_PASSWORD = access_secret("my-project", "db-password")
```

**2. Use Least Privilege:**
```bash
# Grant accessor role, not admin
gcloud secrets add-iam-policy-binding db-password \
    --member="serviceAccount:app@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

**3. Enable Audit Logging:**
```bash
# Secret access is automatically logged
gcloud logging read '
  resource.type="secretmanager.googleapis.com/Secret"
  AND protoPayload.methodName="google.cloud.secretmanager.v1.SecretManagerService.AccessSecretVersion"
' --limit 10
```

**4. Version Your Secrets:**
```bash
# Always create new versions, never update in-place
echo -n "new-value" | gcloud secrets versions add my-secret --data-file=-
```

**5. Use Labels for Organization:**
```bash
gcloud secrets create my-secret \
    --data-file=secret.txt \
    --labels="environment=production,team=backend,rotation=monthly"
```

---

## Workload Identity

**Workload Identity** is the recommended way to authenticate from GKE to GCP services. It eliminates the need for service account keys.

### Overview

**What It Is:**
- Keyless authentication for GKE workloads
- Kubernetes Service Account → GCP Service Account mapping
- No service account keys to manage
- Automatic credential rotation

**Why It's Critical:**
- Service account keys are security risks
- Keys can be stolen, leaked, or compromised
- Workload Identity uses short-lived tokens
- Follows zero-trust principles

### Setup

**1. Enable Workload Identity on Cluster:**
```bash
# New cluster
gcloud container clusters create my-cluster \
    --region us-central1 \
    --workload-pool=PROJECT_ID.svc.id.goog \
    --enable-shielded-nodes

# Existing cluster
gcloud container clusters update my-cluster \
    --region us-central1 \
    --workload-pool=PROJECT_ID.svc.id.goog
```

**2. Create GCP Service Account:**
```bash
gcloud iam service-accounts create my-app-gsa \
    --display-name="My App Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:my-app-gsa@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:my-app-gsa@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectViewer"
```

**3. Create Kubernetes Service Account:**
```bash
kubectl create serviceaccount my-app-ksa --namespace default
```

**4. Bind KSA to GSA:**
```bash
# Allow KSA to impersonate GSA
gcloud iam service-accounts add-iam-policy-binding \
    my-app-gsa@PROJECT_ID.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:PROJECT_ID.svc.id.goog[default/my-app-ksa]"

# Annotate KSA
kubectl annotate serviceaccount my-app-ksa \
    iam.gke.io/gcp-service-account=my-app-gsa@PROJECT_ID.iam.gserviceaccount.com
```

**5. Use in Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      serviceAccountName: my-app-ksa  # Reference KSA
      containers:
      - name: my-app
        image: gcr.io/PROJECT_ID/my-app:latest
        env:
        - name: GOOGLE_CLOUD_PROJECT
          value: "PROJECT_ID"
```

### Verification

**Test Workload Identity:**
```bash
# Deploy test pod
kubectl run -it workload-identity-test \
    --image google/cloud-sdk:slim \
    --serviceaccount my-app-ksa \
    --namespace default

# Inside pod, test access
gcloud auth list
# Should show: my-app-gsa@PROJECT_ID.iam.gserviceaccount.com

# Test Secret Manager access
gcloud secrets versions access latest --secret=db-password
```

### Cloud Run Workload Identity

**Cloud Run automatically uses Workload Identity:**
```bash
# Deploy Cloud Run service
gcloud run deploy my-service \
    --image gcr.io/PROJECT_ID/my-app \
    --service-account my-app-gsa@PROJECT_ID.iam.gserviceaccount.com \
    --region us-central1

# No keys needed! Service automatically authenticates as the service account
```

**In Code (Python):**
```python
# Application Default Credentials automatically uses Workload Identity
from google.cloud import secretmanager

# No explicit credentials needed
client = secretmanager.SecretManagerServiceClient()
# Client automatically uses the service account attached to Cloud Run
```

### Best Practices

**1. Never Use Service Account Keys:**
```bash
# ❌ NEVER DO THIS
gcloud iam service-accounts keys create key.json \
    --iam-account my-app@PROJECT_ID.iam.gserviceaccount.com

# ✅ USE WORKLOAD IDENTITY INSTEAD
```

**2. One KSA per Application:**
```bash
# Create separate service accounts for each app
kubectl create serviceaccount app1-ksa
kubectl create serviceaccount app2-ksa
```

**3. Use Namespaces for Isolation:**
```bash
# Bind KSA to GSA with namespace
gcloud iam service-accounts add-iam-policy-binding \
    my-app-gsa@PROJECT_ID.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:PROJECT_ID.svc.id.goog[production/my-app-ksa]"
```

**4. Audit Workload Identity Usage:**
```bash
# Check which KSAs can impersonate GSAs
gcloud iam service-accounts get-iam-policy \
    my-app-gsa@PROJECT_ID.iam.gserviceaccount.com
```

---

## Binary Authorization

**Binary Authorization** ensures only trusted container images are deployed to GKE or Cloud Run.

### Overview

**What It Is:**
- Deploy-time security control
- Enforces signature verification
- Prevents untrusted containers from running
- Integrates with CI/CD pipelines

**Use Cases:**
- Ensure images come from trusted sources
- Verify images haven't been tampered with
- Enforce security policies (vulnerability scanning)
- Comply with regulatory requirements

### Setup

**1. Enable API:**
```bash
gcloud services enable binaryauthorization.googleapis.com
gcloud services enable containeranalysis.googleapis.com
```

**2. Create Attestor (Trust Authority):**
```bash
# Create note (represents attestor)
curl "https://containeranalysis.googleapis.com/v1/projects/PROJECT_ID/notes/?noteId=my-attestor-note" \
  --request "POST" \
  --header "Authorization: Bearer $(gcloud auth print-access-token)" \
  --header "Content-Type: application/json" \
  --data-binary @- <<EOF
{
  "name": "projects/PROJECT_ID/notes/my-attestor-note",
  "attestation": {
    "hint": {
      "human_readable_name": "Production Attestor"
    }
  }
}
EOF

# Create attestor
gcloud container binauthz attestors create my-attestor \
    --attestation-authority-note=my-attestor-note \
    --attestation-authority-note-project=PROJECT_ID
```

**3. Create Key Pair:**
```bash
# Generate key pair
openssl req -x509 -newkey rsa:4096 -keyout private-key.pem \
    -out public-key.pem -days 365 -nodes \
    -subj "/CN=my-attestor"

# Add public key to attestor
gcloud container binauthz attestors public-keys add \
    --attestor=my-attestor \
    --public-key-file=public-key.pem
```

**4. Create Policy:**
```yaml
# policy.yaml
admissionWhitelistPatterns:
- namePattern: gcr.io/google_containers/*
- namePattern: gcr.io/google-containers/*
- namePattern: k8s.gcr.io/*
- namePattern: gke.gcr.io/*

defaultAdmissionRule:
  requireAttestationsBy:
    - projects/PROJECT_ID/attestors/my-attestor
  enforcementMode: ENFORCED_BLOCK_AND_AUDIT_LOG
  evaluationMode: REQUIRE_ATTESTATION

globalPolicyEvaluationMode: ENABLE

clusterAdmissionRules:
  us-central1.my-cluster:
    requireAttestationsBy:
      - projects/PROJECT_ID/attestors/my-attestor
    enforcementMode: ENFORCED_BLOCK_AND_AUDIT_LOG
    evaluationMode: REQUIRE_ATTESTATION
```

**Import Policy:**
```bash
gcloud container binauthz policy import policy.yaml
```

**5. Enable on GKE:**
```bash
# New cluster
gcloud container clusters create my-cluster \
    --enable-binauthz \
    --region us-central1

# Existing cluster
gcloud container clusters update my-cluster \
    --enable-binauthz \
    --region us-central1
```

### CI/CD Integration

**Sign Images in Cloud Build:**
```yaml
# cloudbuild.yaml
steps:
  # Build image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/my-app:$COMMIT_SHA', '.']
  
  # Push image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/my-app:$COMMIT_SHA']
  
  # Create attestation
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'bash'
    args:
    - '-c'
    - |
      # Get image digest
      IMAGE_DIGEST=$(gcloud container images describe gcr.io/$PROJECT_ID/my-app:$COMMIT_SHA --format='get(image_summary.digest)')
      
      # Create attestation signature
      gcloud beta container binauthz attestations sign-and-create \
        --artifact-url="gcr.io/$PROJECT_ID/my-app@$IMAGE_DIGEST" \
        --attestor="projects/$PROJECT_ID/attestors/my-attestor" \
        --attestor-project="$PROJECT_ID" \
        --keyversion-project="$PROJECT_ID" \
        --keyversion-location="global" \
        --keyversion-keyring="binauthz-keyring" \
        --keyversion-key="attestor-key" \
        --keyversion="1"
```

**Using KMS for Signing:**
```bash
# Create keyring
gcloud kms keyrings create binauthz-keyring --location global

# Create signing key
gcloud kms keys create attestor-key \
    --keyring binauthz-keyring \
    --location global \
    --purpose asymmetric-signing \
    --default-algorithm rsa-sign-pkcs1-4096-sha512

# Get public key
gcloud kms keys versions get-public-key 1 \
    --key attestor-key \
    --keyring binauthz-keyring \
    --location global \
    --output-file public-key.pem

# Add to attestor
gcloud container binauthz attestors public-keys add \
    --attestor my-attestor \
    --keyversion-key attestor-key \
    --keyversion-keyring binauthz-keyring \
    --keyversion-location global \
    --keyversion-project PROJECT_ID
```

### Testing

**Deploy Unsigned Image (Should Fail):**
```bash
kubectl run test --image=nginx
# Error: image policy webhook backend denied
```

**Deploy Signed Image (Should Succeed):**
```bash
kubectl run test --image=gcr.io/PROJECT_ID/my-app:signed
# pod/test created
```

### Best Practices

**1. Use Dry Run Mode First:**
```yaml
defaultAdmissionRule:
  requireAttestationsBy:
    - projects/PROJECT_ID/attestors/my-attestor
  enforcementMode: DRYRUN_AUDIT_LOG_ONLY  # Test first!
```

**2. Allow System Images:**
```yaml
admissionWhitelistPatterns:
- namePattern: gcr.io/google_containers/*
- namePattern: k8s.gcr.io/*
```

**3. Automate Attestation in CI/CD:**
```yaml
# Always sign images after successful security scans
```

**4. Use Multiple Attestors:**
```yaml
# Require multiple attestations (e.g., security scan + code review)
requireAttestationsBy:
  - projects/PROJECT_ID/attestors/security-scan-attestor
  - projects/PROJECT_ID/attestors/code-review-attestor
```

---

## Cloud Armor

**Cloud Armor** provides DDoS protection and Web Application Firewall (WAF) capabilities.

### Overview

**What It Is:**
- DDoS protection
- WAF (Web Application Firewall)
- Rate limiting
- Geo-blocking
- Bot mitigation

**Use Cases:**
- Protect public-facing applications
- Block malicious traffic
- Rate limit API endpoints
- Comply with geographic restrictions

### Setup

**1. Create Security Policy:**
```bash
gcloud compute security-policies create web-app-policy \
    --description "Security policy for web application"
```

**2. Add Rules:**
```bash
# Block specific IP ranges
gcloud compute security-policies rules create 1000 \
    --security-policy web-app-policy \
    --description "Block malicious IPs" \
    --src-ip-ranges "203.0.113.0/24,198.51.100.0/24" \
    --action "deny-403"

# Rate limiting
gcloud compute security-policies rules create 2000 \
    --security-policy web-app-policy \
    --description "Rate limit API" \
    --expression "request.path.matches('/api/.*')" \
    --action "rate-based-ban" \
    --rate-limit-threshold-count 100 \
    --rate-limit-threshold-interval-sec 60 \
    --ban-duration-sec 600

# Geo-blocking
gcloud compute security-policies rules create 3000 \
    --security-policy web-app-policy \
    --description "Allow only US and Canada" \
    --expression "origin.region_code != 'US' && origin.region_code != 'CA'" \
    --action "deny-403"

# SQL injection protection (using preconfigured rules)
gcloud compute security-policies rules create 4000 \
    --security-policy web-app-policy \
    --description "SQL injection protection" \
    --expression "evaluatePreconfiguredExpr('sqli-stable')" \
    --action "deny-403"

# XSS protection
gcloud compute security-policies rules create 5000 \
    --security-policy web-app-policy \
    --description "XSS protection" \
    --expression "evaluatePreconfiguredExpr('xss-stable')" \
    --action "deny-403"

# Default rule (allow everything else)
gcloud compute security-policies rules create 2147483647 \
    --security-policy web-app-policy \
    --description "Default rule" \
    --action "allow"
```

**3. Attach to Backend Service:**
```bash
# Attach to load balancer backend
gcloud compute backend-services update BACKEND_SERVICE \
    --security-policy web-app-policy \
    --global
```

### Advanced Rules

**Custom WAF Rules:**
```bash
# Block requests with suspicious user agents
gcloud compute security-policies rules create 6000 \
    --security-policy web-app-policy \
    --expression "request.headers['user-agent'].contains('badbot')" \
    --action "deny-403"

# Require authentication header for admin paths
gcloud compute security-policies rules create 7000 \
    --security-policy web-app-policy \
    --expression "request.path.matches('/admin/.*') && !has(request.headers['authorization'])" \
    --action "deny-401"

# Block large POST requests
gcloud compute security-policies rules create 8000 \
    --security-policy web-app-policy \
    --expression "request.method == 'POST' && int(request.headers['content-length']) > 1048576" \
    --action "deny-413"
```

**Adaptive Protection (ML-based DDoS):**
```bash
# Enable adaptive protection
gcloud compute security-policies update web-app-policy \
    --enable-layer7-ddos-defense \
    --layer7-ddos-defense-rule-visibility=STANDARD
```

### Monitoring

**View Security Policy Logs:**
```bash
# View blocked requests
gcloud logging read '
  resource.type="http_load_balancer"
  AND jsonPayload.enforcedSecurityPolicy.name="web-app-policy"
  AND jsonPayload.enforcedSecurityPolicy.outcome="DENY"
' --limit 50

# Analyze blocked IPs
gcloud logging read '
  resource.type="http_load_balancer"
  AND jsonPayload.enforcedSecurityPolicy.outcome="DENY"
' --format="value(jsonPayload.remoteIp)" --limit 1000 | sort | uniq -c | sort -rn
```

### Best Practices

**1. Start with Preview Mode:**
```bash
# Set action to preview-only to test rules
gcloud compute security-policies rules create 1000 \
    --security-policy web-app-policy \
    --expression "..." \
    --action "deny-403" \
    --preview
```

**2. Use Preconfigured Rules:**
```bash
# OWASP Top 10 protection
evaluatePreconfiguredExpr('sqli-stable')      # SQL injection
evaluatePreconfiguredExpr('xss-stable')       # Cross-site scripting
evaluatePreconfiguredExpr('lfi-stable')       # Local file inclusion
evaluatePreconfiguredExpr('rfi-stable')       # Remote file inclusion
evaluatePreconfiguredExpr('rce-stable')       # Remote code execution
evaluatePreconfiguredExpr('methodenforcement-stable')  # Method enforcement
evaluatePreconfiguredExpr('scannerdetection-stable')   # Scanner detection
evaluatePreconfiguredExpr('protocolattack-stable')     # Protocol attacks
evaluatePreconfiguredExpr('sessionfixation-stable')    # Session fixation
```

**3. Enable Logging:**
```bash
gcloud compute security-policies update web-app-policy \
    --log-level VERBOSE
```

**4. Combine with Cloud CDN:**
```bash
# Cloud CDN + Cloud Armor = Best performance + security
gcloud compute backend-services update BACKEND_SERVICE \
    --enable-cdn \
    --security-policy web-app-policy \
    --global
```

---

## Security Command Center

**Security Command Center (SCC)** provides centralized visibility and control over GCP security.

### Overview

**What It Is:**
- Centralized security dashboard
- Vulnerability scanning
- Threat detection
- Compliance monitoring
- Security analytics

**Tiers:**
- **Standard:** Free, basic security findings
- **Premium:** Advanced threat detection, compliance, SLA

### Enable SCC

```bash
# Enable at organization level (requires organization admin)
gcloud services enable securitycenter.googleapis.com --project=PROJECT_ID

# Navigate to Security → Security Command Center in console
```

### Key Features

**1. Asset Discovery:**
- Automatically discovers all GCP resources
- Tracks changes over time
- Identifies misconfigurations

**2. Vulnerability Detection:**
```bash
# View vulnerabilities
gcloud scc findings list ORGANIZATION_ID \
    --source=SOURCE_ID \
    --filter="category='VULNERABILITY'"
```

**3. Threat Detection (Premium):**
- Anomalous IAM grants
- Cryptocurrency mining
- Malware detection
- Data exfiltration
- Brute force attacks

**4. Compliance Monitoring:**
- CIS GCP Foundations Benchmark
- PCI-DSS
- HIPAA
- ISO 27001
- SOC 2

### Security Health Analytics

**Built-in Detectors:**
- Public IP addresses
- Open firewall rules
- Unencrypted resources
- Legacy authorization
- Over-privileged service accounts
- Missing organization policies

**Example Findings:**
```bash
# List all open firewall rules
gcloud scc findings list ORGANIZATION_ID \
    --filter="category='OPEN_FIREWALL'"

# List publicly accessible storage buckets
gcloud scc findings list ORGANIZATION_ID \
    --filter="category='PUBLIC_BUCKET'"
```

### Event Threat Detection (Premium)

**Detected Threats:**
- Malware: Execution Dropped Binary
- Malware: Execution Miner
- Persistence: IAM Anomalous Grant
- Initial Access: Log4j Compromise Attempt
- Credential Access: External Member Added
- Exfiltration: BigQuery Data Exfiltration
- Impact: Account Disabled

**View Threats:**
```bash
gcloud scc findings list ORGANIZATION_ID \
    --source=SOURCE_ID \
    --filter="category='Persistence: IAM Anomalous Grant'"
```

### Automated Response

**Pub/Sub Integration:**
```bash
# Create Pub/Sub topic for findings
gcloud pubsub topics create scc-findings

# Create notification config
gcloud scc notifications create scc-notifications \
    --organization ORGANIZATION_ID \
    --description "Send findings to Pub/Sub" \
    --pubsub-topic projects/PROJECT_ID/topics/scc-findings \
    --filter "category='PUBLIC_BUCKET' OR category='OPEN_FIREWALL'"
```

**Automated Remediation (Cloud Functions):**
```python
import functions_framework
from google.cloud import storage

@functions_framework.cloud_event
def remediate_public_bucket(cloud_event):
    """Automatically remediate public storage buckets."""
    finding = cloud_event.data
    
    if finding['category'] == 'PUBLIC_BUCKET':
        bucket_name = extract_bucket_name(finding)
        
        # Remove public access
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        
        policy = bucket.get_iam_policy(requested_policy_version=3)
        policy.bindings = [
            b for b in policy.bindings
            if 'allUsers' not in b.get('members', [])
            and 'allAuthenticatedUsers' not in b.get('members', [])
        ]
        bucket.set_iam_policy(policy)
        
        print(f"Remediated public bucket: {bucket_name}")
```

### Best Practices

**1. Enable All Sources:**
```bash
# Enable all built-in detectors
# Navigate to SCC → Settings → Sources
```

**2. Set Up Notifications:**
```bash
# Get critical findings immediately
gcloud scc notifications create critical-findings \
    --organization ORGANIZATION_ID \
    --pubsub-topic projects/PROJECT_ID/topics/critical-findings \
    --filter "severity='CRITICAL'"
```

**3. Review Findings Weekly:**
```bash
# Export findings for analysis
gcloud scc findings list ORGANIZATION_ID \
    --format=json > findings-$(date +%Y%m%d).json
```

**4. Integrate with SIEM:**
```bash
# Send findings to external SIEM (Splunk, Chronicle, etc.)
# Use Pub/Sub → Dataflow → SIEM
```

---

## Compliance Frameworks

### HIPAA (Healthcare)

**Requirements:**
- Data encryption at rest and in transit
- Access controls and audit logging
- Business Associate Agreement (BAA) with Google
- Regular security assessments

**GCP Services Supporting HIPAA:**
- ✅ Compute Engine
- ✅ GKE
- ✅ Cloud Run
- ✅ Cloud Storage
- ✅ Cloud SQL
- ✅ BigQuery
- ❌ App Engine Standard (use Flexible or Cloud Run)

**Implementation:**
```bash
# Enable CMEK (Customer-Managed Encryption Keys)
gcloud kms keyrings create hipaa-keyring --location us-central1
gcloud kms keys create hipaa-key \
    --keyring hipaa-keyring \
    --location us-central1 \
    --purpose encryption

# Encrypt Cloud Storage bucket
gcloud storage buckets update gs://BUCKET_NAME \
    --default-encryption-key projects/PROJECT_ID/locations/us-central1/keyRings/hipaa-keyring/cryptoKeys/hipaa-key

# Encrypt Cloud SQL
gcloud sql instances create INSTANCE_NAME \
    --disk-encryption-key projects/PROJECT_ID/locations/us-central1/keyRings/hipaa-keyring/cryptoKeys/hipaa-key
```

### PCI-DSS (Payment Card Industry)

**Requirements:**
- Network segmentation
- Encryption of cardholder data
- Access control
- Regular security testing
- Vulnerability management

**Implementation:**
```bash
# Network segmentation with VPC
gcloud compute networks create pci-network --subnet-mode custom

gcloud compute networks subnets create pci-subnet \
    --network pci-network \
    --region us-central1 \
    --range 10.1.0.0/24

# Firewall rules (deny all by default)
gcloud compute firewall-rules create deny-all-ingress \
    --network pci-network \
    --action deny \
    --direction ingress \
    --priority 65534 \
    --rules all

# Allow only specific traffic
gcloud compute firewall-rules create allow-https \
    --network pci-network \
    --action allow \
    --direction ingress \
    --priority 1000 \
    --source-ranges 0.0.0.0/0 \
    --rules tcp:443
```

### SOC 2

**Requirements:**
- Security controls
- Availability monitoring
- Processing integrity
- Confidentiality
- Privacy protection

**Implementation:**
```bash
# Enable audit logging (already enabled by default)
# Enable SCC for continuous monitoring
# Implement least privilege access
# Regular access reviews
# Incident response procedures
```

### ISO 27001

**Requirements:**
- Information security management system (ISMS)
- Risk assessment
- Security policies
- Access control
- Incident management

**GCP Compliance:**
- Google Cloud is ISO 27001 certified
- Inherit certifications for covered services
- Implement additional controls as needed

---

## Security Best Practices Checklist

### Identity and Access Management
- [ ] Use Workload Identity (no service account keys)
- [ ] Implement least privilege IAM roles
- [ ] Use groups instead of individual users
- [ ] Enable MFA for all users
- [ ] Regular access reviews (quarterly)
- [ ] Use organization policies to enforce constraints

### Network Security
- [ ] Enable VPC Service Controls for sensitive data
- [ ] Use Cloud Armor for public-facing services
- [ ] Implement Private Google Access
- [ ] Enable VPC Flow Logs
- [ ] Use Cloud NAT for outbound traffic
- [ ] Segment networks by environment/sensitivity

### Data Protection
- [ ] Use Secret Manager for all secrets
- [ ] Enable encryption at rest (CMEK for sensitive data)
- [ ] Encrypt data in transit (TLS 1.2+)
- [ ] Implement data loss prevention (DLP)
- [ ] Regular backup testing
- [ ] Data retention policies

### Compute Security
- [ ] Enable Binary Authorization (GKE/Cloud Run)
- [ ] Use Container Analysis for vulnerability scanning
- [ ] Shielded VMs for Compute Engine
- [ ] OS patch management
- [ ] Disable serial port access
- [ ] Use minimal base images

### Monitoring and Detection
- [ ] Enable Security Command Center
- [ ] Configure audit logging for all services
- [ ] Set up alerting for security events
- [ ] Regular security scans
- [ ] Anomaly detection enabled
- [ ] SIEM integration

### Compliance and Governance
- [ ] Document security policies
- [ ] Regular compliance audits
- [ ] Incident response plan
- [ ] Disaster recovery testing
- [ ] Security training for team
- [ ] Vendor risk assessment (Google Cloud)

### Application Security
- [ ] Input validation
- [ ] Output encoding
- [ ] Parameterized queries (prevent SQL injection)
- [ ] CSRF protection
- [ ] Secure session management
- [ ] Security headers (CSP, HSTS, X-Frame-Options)

---

## Incident Response

### Preparation

**1. Create Incident Response Plan:**
```markdown
1. Detection and Analysis
2. Containment
3. Eradication
4. Recovery
5. Post-Incident Review
```

**2. Define Roles:**
- Incident Commander
- Security Analyst
- Communications Lead
- Technical Lead

**3. Set Up Communication Channels:**
```bash
# Create Pub/Sub topic for security alerts
gcloud pubsub topics create security-incidents

# Subscribe incident response team
gcloud pubsub subscriptions create security-team-sub \
    --topic security-incidents \
    --push-endpoint https://incident-response-system.com/webhook
```

### Detection

**Security Command Center Alerts:**
```bash
# High-severity findings notification
gcloud scc notifications create high-severity \
    --organization ORGANIZATION_ID \
    --pubsub-topic projects/PROJECT_ID/topics/security-incidents \
    --filter "severity='HIGH' OR severity='CRITICAL'"
```

**Custom Detection (Cloud Logging):**
```bash
# Alert on suspicious IAM changes
gcloud logging sinks create iam-anomalies \
    pubsub.googleapis.com/projects/PROJECT_ID/topics/security-incidents \
    --log-filter='
        protoPayload.serviceName="iam.googleapis.com"
        AND protoPayload.methodName=~".*setIamPolicy"
        AND severity>=WARNING
    '
```

### Containment

**Isolate Compromised Resources:**
```bash
# Disable compromised service account
gcloud iam service-accounts disable compromised-sa@PROJECT_ID.iam.gserviceaccount.com

# Delete service account keys
gcloud iam service-accounts keys list \
    --iam-account compromised-sa@PROJECT_ID.iam.gserviceaccount.com \
    --format="value(name)" | while read key; do
    gcloud iam service-accounts keys delete $key \
        --iam-account compromised-sa@PROJECT_ID.iam.gserviceaccount.com --quiet
done

# Isolate VM (remove from network)
gcloud compute instances delete-access-config INSTANCE_NAME \
    --access-config-name "external-nat" \
    --zone us-central1-a

# Block IP at Cloud Armor
gcloud compute security-policies rules create 100 \
    --security-policy web-app-policy \
    --src-ip-ranges "MALICIOUS_IP/32" \
    --action "deny-403"
```

### Investigation

**Collect Evidence:**
```bash
# Export audit logs
gcloud logging read '
    timestamp>="2024-01-15T00:00:00Z"
    AND timestamp<="2024-01-15T23:59:59Z"
    AND protoPayload.authenticationInfo.principalEmail="compromised@email.com"
' --format=json > incident-logs-$(date +%Y%m%d).json

# Create disk snapshot for forensics
gcloud compute disks snapshot DISK_NAME \
    --zone us-central1-a \
    --snapshot-names incident-snapshot-$(date +%Y%m%d)
```

### Recovery

**Restore to Known Good State:**
```bash
# Restore from backup
# Rotate all secrets
# Update security policies
# Re-deploy applications
```

### Post-Incident Review

**Document:**
- Timeline of events
- Root cause analysis
- Actions taken
- Lessons learned
- Improvements needed

---

## Additional Resources

**Official Documentation:**
- [VPC Service Controls](https://cloud.google.com/vpc-service-controls/docs)
- [Secret Manager](https://cloud.google.com/secret-manager/docs)
- [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)
- [Binary Authorization](https://cloud.google.com/binary-authorization/docs)
- [Cloud Armor](https://cloud.google.com/armor/docs)
- [Security Command Center](https://cloud.google.com/security-command-center/docs)

**Security Best Practices:**
- [GCP Security Best Practices](https://cloud.google.com/security/best-practices)
- [GCP Security Foundations Blueprint](https://cloud.google.com/architecture/security-foundations)
- [CIS Google Cloud Platform Foundation Benchmark](https://www.cisecurity.org/benchmark/google_cloud_computing_platform)

**Compliance:**
- [Google Cloud Compliance](https://cloud.google.com/security/compliance)
- [HIPAA on GCP](https://cloud.google.com/security/compliance/hipaa)
- [PCI-DSS on GCP](https://cloud.google.com/security/compliance/pci-dss)

---

*Last Updated: 2024*
*Maintained by: Grand Budapest Terminal Security Team*
