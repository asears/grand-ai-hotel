# GCP Getting Started Guide

**Complete Beginner's Guide to Google Cloud Platform**

*A production-ready guide for setting up GCP from scratch with security and cost optimization in mind.*

---

## Table of Contents

1. [Introduction](#introduction)
2. [GCP Account Setup](#gcp-account-setup)
3. [gcloud CLI Installation](#gcloud-cli-installation)
4. [Project Management](#project-management)
5. [Billing and Budget Management](#billing-and-budget-management)
6. [Identity and Access Management (IAM)](#identity-and-access-management)
7. [Security Hardening](#security-hardening)
8. [SDK Installation](#sdk-installation)
9. [Cost Monitoring and Optimization](#cost-monitoring-and-optimization)
10. [Troubleshooting](#troubleshooting)

---

## Introduction

Google Cloud Platform (GCP) is a suite of cloud computing services that runs on the same infrastructure Google uses internally for its end-user products. This guide will walk you through setting up a production-ready GCP environment with security best practices and cost optimization strategies.

**What You'll Learn:**
- Setting up a GCP account with $300 free credits
- Installing and configuring the gcloud CLI
- Managing projects and billing
- Implementing security best practices from day one
- Monitoring and optimizing costs

**Prerequisites:**
- A Google account (Gmail or Google Workspace)
- Credit card for verification (required even for free tier)
- Basic command-line knowledge
- Understanding of cloud computing concepts (helpful but not required)

---

## GCP Account Setup

### Step 1: Create Your GCP Account

1. **Navigate to GCP Console**
   ```
   https://console.cloud.google.com
   ```

2. **Sign in with Google Account**
   - Use an existing Google account or create a new one
   - For production, consider using a dedicated account separate from personal email

3. **Activate Free Trial**
   - Click "Activate" or "Start Free Trial"
   - Accept the Terms of Service
   - Select your country
   - Choose "Business" or "Individual" account type

4. **Verify Your Identity**
   - Enter credit card information
   - Google charges $1 temporarily for verification (refunded immediately)
   - **Note:** You won't be charged after free trial ends unless you upgrade

### Free Trial Details

**$300 Credit Benefits:**
- Valid for 90 days from activation
- Applies to most GCP services
- No automatic charges after expiration
- Requires manual upgrade to paid account

**Always Free Tier (Beyond Trial):**
- Compute Engine: 1 f1-micro instance/month (US regions only)
- Cloud Storage: 5 GB-months of regional storage
- Cloud Functions: 2 million invocations/month
- Cloud Run: 180,000 vCPU-seconds/month
- BigQuery: 1 TB of queries/month
- Cloud Build: 120 build-minutes/day

**Documentation:**
- [Free Trial Details](https://cloud.google.com/free)
- [Always Free Tier](https://cloud.google.com/free/docs/free-cloud-features)

### Step 2: Understand the GCP Resource Hierarchy

```
Organization (optional)
    └── Folder (optional)
        └── Project (required)
            └── Resources (VMs, databases, etc.)
```

**Key Concepts:**
- **Organization:** Root node, linked to Google Workspace or Cloud Identity
- **Folders:** Organize projects by department, team, or environment
- **Projects:** Isolated containers for resources, billing, and IAM
- **Resources:** Individual services (VMs, databases, storage buckets)

---

## gcloud CLI Installation

The `gcloud` CLI is the primary command-line interface for GCP. It allows you to manage resources, deploy applications, and automate workflows.

### Windows Installation

**Method 1: Interactive Installer (Recommended)**

1. **Download the Installer**
   ```
   https://cloud.google.com/sdk/docs/install
   ```

2. **Run the Installer**
   - Download `GoogleCloudSDKInstaller.exe`
   - Run the installer with administrator privileges
   - Follow the prompts

3. **Configure Installation**
   - Install all components (gcloud, gsutil, bq)
   - Add gcloud to PATH (check this option)
   - Run `gcloud init` after installation (check this option)

4. **Verify Installation**
   ```powershell
   # Open a new PowerShell window
   gcloud version
   ```

   Expected output:
   ```
   Google Cloud SDK 460.0.0
   bq 2.0.101
   core 2024.01.19
   gcloud-crc32c 1.0.0
   gsutil 5.27
   ```

**Method 2: PowerShell (Advanced)**

```powershell
# Download and extract
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe

# Or use Chocolatey
choco install gcloudsdk
```

### macOS Installation

**Method 1: Official Installer (Recommended)**

```bash
# Download the appropriate package for your chip
# For M1/M2 (Apple Silicon):
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-darwin-arm.tar.gz

# For Intel:
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-darwin-x86_64.tar.gz

# Extract
tar -xzf google-cloud-cli-darwin-*.tar.gz

# Install
./google-cloud-sdk/install.sh

# Initialize
./google-cloud-sdk/bin/gcloud init
```

**Method 2: Homebrew**

```bash
brew install --cask google-cloud-sdk

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
source "$(brew --prefix)/share/google-cloud-sdk/path.zsh.inc"
source "$(brew --prefix)/share/google-cloud-sdk/completion.zsh.inc"

# Reload shell
source ~/.zshrc

# Verify
gcloud version
```

### Linux Installation

**Ubuntu/Debian:**

```bash
# Add the Cloud SDK distribution URI as a package source
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

# Import the Google Cloud public key
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -

# Update and install
sudo apt-get update && sudo apt-get install google-cloud-cli

# Verify
gcloud version
```

**Red Hat/CentOS/Fedora:**

```bash
# Add the Cloud SDK repo
sudo tee -a /etc/yum.repos.d/google-cloud-sdk.repo << EOM
[google-cloud-cli]
name=Google Cloud CLI
baseurl=https://packages.cloud.google.com/yum/repos/cloud-sdk-el8-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=0
gpgkey=https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOM

# Install
sudo yum install google-cloud-cli

# Verify
gcloud version
```

### Initial Configuration

**Initialize gcloud CLI:**

```bash
gcloud init
```

This interactive command will:
1. Authenticate with your Google account
2. Set the default project
3. Set the default compute region/zone

**Manual Configuration:**

```bash
# Authenticate
gcloud auth login

# List available projects
gcloud projects list

# Set default project
gcloud config set project PROJECT_ID

# Set default region and zone
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a

# View current configuration
gcloud config list

# Create named configurations for multiple environments
gcloud config configurations create production
gcloud config configurations create development
gcloud config configurations activate development
```

**Additional Components:**

```bash
# Install additional components
gcloud components install kubectl  # Kubernetes CLI
gcloud components install beta     # Beta commands
gcloud components install alpha    # Alpha commands

# Update components
gcloud components update

# List installed components
gcloud components list
```

---

## Project Management

Projects are the fundamental organizational unit in GCP. All resources belong to a project.

### Creating a Project

**Via Console:**
1. Navigate to [GCP Console](https://console.cloud.google.com)
2. Click the project dropdown (top bar)
3. Click "New Project"
4. Enter project details:
   - **Project name:** `my-app-production`
   - **Project ID:** `my-app-prod-123456` (globally unique)
   - **Organization:** Select if available
5. Click "Create"

**Via gcloud CLI:**

```bash
# Create project
gcloud projects create PROJECT_ID \
    --name="My Application Production" \
    --organization=ORGANIZATION_ID \
    --labels=environment=production,team=platform

# Example
gcloud projects create my-app-prod-123456 \
    --name="My Application Production" \
    --labels=environment=production

# Set as default
gcloud config set project my-app-prod-123456
```

### Project Best Practices

**Naming Convention:**
```
{app-name}-{environment}-{random-suffix}

Examples:
- analytics-platform-prod-a1b2c3
- customer-api-dev-d4e5f6
- ml-pipeline-staging-g7h8i9
```

**Project Organization Strategy:**

```
Organization: company.com
├── Folder: Production
│   ├── web-app-prod-abc123
│   ├── api-services-prod-def456
│   └── data-platform-prod-ghi789
├── Folder: Staging
│   ├── web-app-staging-jkl012
│   └── api-services-staging-mno345
├── Folder: Development
│   ├── web-app-dev-pqr678
│   └── api-services-dev-stu901
└── Folder: Shared Services
    ├── monitoring-shared-vwx234
    └── networking-shared-yza567
```

**Labels for Resource Management:**

```bash
# Apply labels to projects
gcloud projects update PROJECT_ID \
    --update-labels=environment=production,cost-center=engineering,team=platform,app=analytics

# Query projects by label
gcloud projects list --filter="labels.environment=production"
```

### Enabling APIs

Most GCP services require API activation:

```bash
# Enable common APIs
gcloud services enable compute.googleapis.com           # Compute Engine
gcloud services enable container.googleapis.com         # GKE
gcloud services enable run.googleapis.com              # Cloud Run
gcloud services enable cloudfunctions.googleapis.com   # Cloud Functions
gcloud services enable cloudbuild.googleapis.com       # Cloud Build
gcloud services enable secretmanager.googleapis.com    # Secret Manager
gcloud services enable artifactregistry.googleapis.com # Artifact Registry
gcloud services enable cloudresourcemanager.googleapis.com

# List enabled services
gcloud services list --enabled

# Enable multiple services at once
gcloud services enable \
    compute.googleapis.com \
    run.googleapis.com \
    cloudfunctions.googleapis.com \
    secretmanager.googleapis.com
```

---

## Billing and Budget Management

Proper billing setup is critical to avoid unexpected charges.

### Link Billing Account

**Via Console:**
1. Navigate to **Billing** → **Account Management**
2. Click "Create Account" or link existing
3. Enter payment information
4. Link billing account to project:
   - Go to **Billing** → **Account Management**
   - Select billing account
   - Click "Manage Projects"
   - Link your project

**Via gcloud CLI:**

```bash
# List billing accounts
gcloud billing accounts list

# Link project to billing account
gcloud billing projects link PROJECT_ID \
    --billing-account=BILLING_ACCOUNT_ID
```

### Create Budget Alerts

**Via Console:**
1. Navigate to **Billing** → **Budgets & alerts**
2. Click "Create Budget"
3. Configure:
   - **Name:** `monthly-budget-production`
   - **Projects:** Select projects
   - **Budget amount:** $100/month
   - **Thresholds:** 50%, 90%, 100%, 110%
4. Set alert recipients (email)

**Via gcloud CLI:**

```bash
# Create budget (requires billing API)
gcloud billing budgets create \
    --billing-account=BILLING_ACCOUNT_ID \
    --display-name="Monthly Budget - Production" \
    --budget-amount=100USD \
    --threshold-rule=percent=0.5 \
    --threshold-rule=percent=0.9 \
    --threshold-rule=percent=1.0 \
    --threshold-rule=percent=1.1
```

**Budget Alert with Pub/Sub Notification:**

```bash
# Create Pub/Sub topic for budget alerts
gcloud pubsub topics create budget-alerts

# Create budget with Pub/Sub notification
gcloud billing budgets create \
    --billing-account=BILLING_ACCOUNT_ID \
    --display-name="Budget with Alerts" \
    --budget-amount=100USD \
    --threshold-rule=percent=0.9 \
    --all-updates-rule-pubsub-topic=projects/PROJECT_ID/topics/budget-alerts
```

### Cost Control Strategies

**1. Set Project Quota:**

```bash
# Request quota decrease (requires support ticket)
# Navigate to: IAM & Admin → Quotas
# Example: Limit Compute Engine instances to 5
```

**2. Use Committed Use Discounts:**
- 1-year or 3-year commitments
- Up to 57% discount on Compute Engine
- Up to 52% discount on Cloud SQL

**3. Use Preemptible/Spot VMs:**
- Up to 80% discount
- Can be terminated by GCP at any time
- Ideal for batch jobs, CI/CD

**4. Enable Cost Allocation Labels:**

```bash
# Label resources for cost tracking
gcloud compute instances create my-instance \
    --labels=environment=production,cost-center=engineering,app=web
```

---

## Identity and Access Management (IAM)

IAM controls who (identity) has what access (role) to which resources.

### IAM Concepts

**Principals (Who):**
- Google Account (user@gmail.com)
- Service Account (sa@project.iam.gserviceaccount.com)
- Google Group (team@company.com)
- Cloud Identity domain (company.com)

**Roles (What Access):**
- **Primitive Roles:** Owner, Editor, Viewer (avoid in production)
- **Predefined Roles:** Curated by Google (e.g., `roles/run.admin`)
- **Custom Roles:** Fine-grained permissions

**Resources (Which):**
- Projects, VMs, buckets, databases, etc.

### Create Service Accounts

Service accounts are identities for applications, not humans.

```bash
# Create service account
gcloud iam service-accounts create app-backend \
    --display-name="Application Backend Service Account" \
    --description="Service account for backend application"

# Grant role to service account
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:app-backend@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# List service accounts
gcloud iam service-accounts list

# Create service account key (AVOID in production - use Workload Identity)
gcloud iam service-accounts keys create ~/key.json \
    --iam-account=app-backend@PROJECT_ID.iam.gserviceaccount.com
```

### Grant IAM Permissions

**Project-level:**

```bash
# Grant user editor access
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="user:developer@company.com" \
    --role="roles/editor"

# Grant service account specific role
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:app@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudrun.invoker"

# Grant group access
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="group:engineering@company.com" \
    --role="roles/viewer"
```

**Resource-level (more secure):**

```bash
# Grant access to specific Cloud Run service
gcloud run services add-iam-policy-binding SERVICE_NAME \
    --region=us-central1 \
    --member="user:developer@company.com" \
    --role="roles/run.developer"

# Grant access to specific bucket
gcloud storage buckets add-iam-policy-binding gs://BUCKET_NAME \
    --member="serviceAccount:app@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectViewer"
```

### IAM Best Practices

**1. Principle of Least Privilege:**
```bash
# Bad: Granting owner role
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="user:developer@company.com" \
    --role="roles/owner"

# Good: Granting specific role
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="user:developer@company.com" \
    --role="roles/run.developer"
```

**2. Use Groups Instead of Individual Users:**
```bash
# Create Google Group: engineering-team@company.com
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="group:engineering-team@company.com" \
    --role="roles/viewer"
```

**3. Avoid Service Account Keys:**
- Use Workload Identity for GKE
- Use Cloud Run/Functions default service account
- Use Application Default Credentials (ADC)

**4. Regular Access Reviews:**
```bash
# List all IAM bindings
gcloud projects get-iam-policy PROJECT_ID \
    --flatten="bindings[].members" \
    --format="table(bindings.role, bindings.members)"

# Export for audit
gcloud projects get-iam-policy PROJECT_ID \
    --format=json > iam-policy-$(date +%Y%m%d).json
```

**5. Use Conditions for Time-based Access:**
```bash
# Grant temporary access (expires at specific time)
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="user:contractor@company.com" \
    --role="roles/viewer" \
    --condition='expression=request.time < timestamp("2024-12-31T23:59:59Z"),title=temporary-access'
```

---

## Security Hardening

Implement security best practices from day one.

### Enable Organization Policies

Organization Policies enforce constraints across your GCP organization.

**Common Policies:**

```bash
# Disable service account key creation
gcloud resource-manager org-policies set-policy \
    --organization=ORGANIZATION_ID \
    policy.yaml

# policy.yaml:
# constraint: iam.disableServiceAccountKeyCreation
# booleanPolicy:
#   enforced: true
```

**Essential Policies:**

1. **Restrict Public IP Addresses:**
   - Constraint: `compute.vmExternalIpAccess`
   - Prevents VMs from having public IPs

2. **Require OS Login:**
   - Constraint: `compute.requireOsLogin`
   - Forces centralized user management

3. **Disable Service Account Key Creation:**
   - Constraint: `iam.disableServiceAccountKeyCreation`
   - Prevents key-based authentication

4. **Restrict Resource Locations:**
   - Constraint: `gcp.resourceLocations`
   - Enforce data residency requirements

### Enable Security Features

**1. Enable VPC Flow Logs:**

```bash
# Enable flow logs on subnet
gcloud compute networks subnets update SUBNET_NAME \
    --region=us-central1 \
    --enable-flow-logs \
    --logging-aggregation-interval=interval-5-sec \
    --logging-flow-sampling=0.5
```

**2. Enable Cloud Audit Logs:**

```bash
# Via Console: IAM & Admin → Audit Logs
# Enable for all services:
# - Admin Read
# - Data Read
# - Data Write
```

**3. Enable Binary Authorization (GKE/Cloud Run):**

```bash
# Enable Binary Authorization
gcloud services enable binaryauthorization.googleapis.com

# Create policy requiring attestation
gcloud container binauthz policy import policy.yaml
```

**4. Set Up VPC Service Controls:**

```bash
# Create access policy
gcloud access-context-manager policies create \
    --organization=ORGANIZATION_ID \
    --title="Production Access Policy"

# Create service perimeter
gcloud access-context-manager perimeters create production_perimeter \
    --title="Production Perimeter" \
    --resources=projects/PROJECT_NUMBER \
    --restricted-services=storage.googleapis.com,bigquery.googleapis.com \
    --policy=POLICY_ID
```

### Security Scanning

**1. Enable Security Command Center:**

```bash
# Enable Security Command Center (organization level)
# Navigate to: Security → Security Command Center
# Activate Standard or Premium tier
```

**2. Container Scanning:**

```bash
# Enable Container Analysis API
gcloud services enable containeranalysis.googleapis.com
gcloud services enable containerscanning.googleapis.com

# Images in Artifact Registry are automatically scanned
```

**3. Web Security Scanner:**

```bash
# Enable Web Security Scanner
gcloud services enable websecurityscanner.googleapis.com

# Create scan (via Console or API)
```

---

## SDK Installation

Install language-specific SDKs for programmatic access to GCP.

### Python SDK

**Installation:**

```bash
# Install Google Cloud Python libraries
pip install google-cloud-storage
pip install google-cloud-secret-manager
pip install google-cloud-firestore
pip install google-cloud-pubsub
pip install google-cloud-logging

# Or install all common libraries
pip install google-cloud
```

**Authentication:**

```python
# Method 1: Application Default Credentials (Recommended)
from google.cloud import storage

# ADC automatically uses:
# 1. GOOGLE_APPLICATION_CREDENTIALS environment variable
# 2. gcloud auth application-default login
# 3. Compute Engine/Cloud Run/Cloud Functions metadata server

client = storage.Client()

# Method 2: Explicit credentials (not recommended)
from google.oauth2 import service_account

credentials = service_account.Credentials.from_service_account_file(
    'path/to/key.json'
)
client = storage.Client(credentials=credentials)
```

**Setup ADC:**

```bash
# Login for local development
gcloud auth application-default login

# Set quota project
gcloud auth application-default set-quota-project PROJECT_ID
```

**Example - Cloud Storage:**

```python
from google.cloud import storage

def upload_blob(bucket_name: str, source_file: str, destination_blob: str) -> None:
    """Upload file to GCS bucket."""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(destination_blob)
    
    blob.upload_from_filename(source_file)
    print(f"File {source_file} uploaded to {destination_blob}")

# Usage
upload_blob("my-bucket", "local-file.txt", "remote-file.txt")
```

### Node.js SDK

**Installation:**

```bash
# Install Google Cloud Node.js libraries
npm install @google-cloud/storage
npm install @google-cloud/secret-manager
npm install @google-cloud/firestore
npm install @google-cloud/pubsub
npm install @google-cloud/logging
```

**Authentication:**

```javascript
// Application Default Credentials (Recommended)
const {Storage} = require('@google-cloud/storage');

// ADC is used automatically
const storage = new Storage();

// Explicit credentials (not recommended)
const storage = new Storage({
  keyFilename: 'path/to/key.json'
});
```

**Example - Cloud Storage:**

```javascript
const {Storage} = require('@google-cloud/storage');

async function uploadFile(bucketName, filename, destination) {
  const storage = new Storage();
  
  await storage.bucket(bucketName).upload(filename, {
    destination: destination,
  });
  
  console.log(`${filename} uploaded to ${bucketName}/${destination}`);
}

// Usage
uploadFile('my-bucket', 'local-file.txt', 'remote-file.txt');
```

### Go SDK

**Installation:**

```bash
# Install Google Cloud Go libraries
go get cloud.google.com/go/storage
go get cloud.google.com/go/secretmanager
go get cloud.google.com/go/firestore
go get cloud.google.com/go/pubsub
go get cloud.google.com/go/logging
```

**Authentication:**

```go
package main

import (
    "context"
    "cloud.google.com/go/storage"
)

func main() {
    ctx := context.Background()
    
    // Application Default Credentials (Recommended)
    client, err := storage.NewClient(ctx)
    if err != nil {
        // Handle error
    }
    defer client.Close()
    
    // Explicit credentials (not recommended)
    // client, err := storage.NewClient(ctx, option.WithCredentialsFile("path/to/key.json"))
}
```

**Example - Cloud Storage:**

```go
package main

import (
    "context"
    "fmt"
    "io"
    "os"
    "cloud.google.com/go/storage"
)

func uploadFile(bucketName, objectName, filename string) error {
    ctx := context.Background()
    client, err := storage.NewClient(ctx)
    if err != nil {
        return err
    }
    defer client.Close()
    
    f, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer f.Close()
    
    wc := client.Bucket(bucketName).Object(objectName).NewWriter(ctx)
    if _, err = io.Copy(wc, f); err != nil {
        return err
    }
    if err := wc.Close(); err != nil {
        return err
    }
    
    fmt.Printf("File uploaded to %s/%s\n", bucketName, objectName)
    return nil
}
```

### .NET SDK

**Installation:**

```bash
# Install Google Cloud .NET libraries
dotnet add package Google.Cloud.Storage.V1
dotnet add package Google.Cloud.SecretManager.V1
dotnet add package Google.Cloud.Firestore
dotnet add package Google.Cloud.PubSub.V1
dotnet add package Google.Cloud.Logging.V2
```

**Authentication:**

```csharp
using Google.Cloud.Storage.V1;

// Application Default Credentials (Recommended)
var storage = StorageClient.Create();

// Explicit credentials (not recommended)
var storage = StorageClient.Create(GoogleCredential.FromFile("path/to/key.json"));
```

**Example - Cloud Storage:**

```csharp
using Google.Cloud.Storage.V1;
using System;
using System.IO;

public class UploadFile
{
    public void Upload(string bucketName, string localPath, string objectName)
    {
        var storage = StorageClient.Create();
        using var fileStream = File.OpenRead(localPath);
        storage.UploadObject(bucketName, objectName, null, fileStream);
        Console.WriteLine($"Uploaded {localPath} to {bucketName}/{objectName}");
    }
}
```

---

## Cost Monitoring and Optimization

Proactive cost management prevents bill shock.

### Enable Billing Export

**BigQuery Export (Detailed Billing Data):**

```bash
# Enable BigQuery API
gcloud services enable bigquery.googleapis.com

# Create dataset for billing data
bq mk --dataset --location=US PROJECT_ID:billing_export

# Enable export via Console:
# Billing → Billing Export → BigQuery Export
# Select project and dataset
```

**Analyze Costs with BigQuery:**

```sql
-- Top 10 most expensive services this month
SELECT
  service.description AS service,
  SUM(cost) AS total_cost
FROM `PROJECT_ID.billing_export.gcp_billing_export_v1_BILLING_ID`
WHERE DATE(usage_start_time) >= DATE_TRUNC(CURRENT_DATE(), MONTH)
GROUP BY service
ORDER BY total_cost DESC
LIMIT 10;

-- Daily cost trend
SELECT
  DATE(usage_start_time) AS usage_date,
  SUM(cost) AS daily_cost
FROM `PROJECT_ID.billing_export.gcp_billing_export_v1_BILLING_ID`
WHERE DATE(usage_start_time) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY usage_date
ORDER BY usage_date;

-- Cost by project
SELECT
  project.name AS project_name,
  SUM(cost) AS total_cost
FROM `PROJECT_ID.billing_export.gcp_billing_export_v1_BILLING_ID`
WHERE DATE(usage_start_time) >= DATE_TRUNC(CURRENT_DATE(), MONTH)
GROUP BY project_name
ORDER BY total_cost DESC;
```

### Cost Optimization Strategies

**1. Right-size Compute Resources:**

```bash
# Get VM recommendations
gcloud recommender recommendations list \
    --project=PROJECT_ID \
    --location=us-central1 \
    --recommender=google.compute.instance.MachineTypeRecommender

# Apply recommendation
gcloud recommender recommendations mark-claimed RECOMMENDATION_ID \
    --location=us-central1 \
    --recommender=google.compute.instance.MachineTypeRecommender
```

**2. Use Autoscaling:**

```bash
# Cloud Run autoscaling (configured per service)
gcloud run deploy SERVICE_NAME \
    --min-instances=0 \
    --max-instances=10 \
    --concurrency=80

# GKE autoscaling
gcloud container clusters update CLUSTER_NAME \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=10 \
    --zone=us-central1-a
```

**3. Schedule Non-Production Resources:**

```bash
# Use Cloud Scheduler to stop/start VMs
# Create startup schedule
gcloud scheduler jobs create http start-dev-vms \
    --schedule="0 9 * * 1-5" \
    --uri="https://compute.googleapis.com/compute/v1/projects/PROJECT_ID/zones/us-central1-a/instances/INSTANCE_NAME/start" \
    --http-method=POST \
    --oauth-service-account-email=scheduler@PROJECT_ID.iam.gserviceaccount.com

# Create shutdown schedule
gcloud scheduler jobs create http stop-dev-vms \
    --schedule="0 18 * * 1-5" \
    --uri="https://compute.googleapis.com/compute/v1/projects/PROJECT_ID/zones/us-central1-a/instances/INSTANCE_NAME/stop" \
    --http-method=POST \
    --oauth-service-account-email=scheduler@PROJECT_ID.iam.gserviceaccount.com
```

**4. Use Cloud Storage Lifecycle Policies:**

```bash
# Create lifecycle policy
cat > lifecycle.json << EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {"age": 30}
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
        "condition": {"age": 90}
      },
      {
        "action": {"type": "Delete"},
        "condition": {"age": 365}
      }
    ]
  }
}
EOF

# Apply to bucket
gcloud storage buckets update gs://BUCKET_NAME --lifecycle-file=lifecycle.json
```

**5. Clean Up Unused Resources:**

```bash
# Find unused disks
gcloud compute disks list --filter="NOT users:*"

# Find old snapshots
gcloud compute snapshots list \
    --filter="creationTimestamp<$(date -d '30 days ago' +%Y-%m-%d)" \
    --format="table(name, creationTimestamp)"

# Delete old snapshots
gcloud compute snapshots delete SNAPSHOT_NAME --quiet
```

### Set Up Cost Alerts

**Create Budget with Programmatic Notifications:**

```python
from google.cloud import billing_budgets_v1

def create_budget_alert(billing_account_id: str, project_id: str, budget_amount: float):
    """Create budget with Pub/Sub alert."""
    client = billing_budgets_v1.BudgetServiceClient()
    
    budget = billing_budgets_v1.Budget()
    budget.display_name = "Monthly Budget Alert"
    budget.budget_filter.projects = [f"projects/{project_id}"]
    budget.amount.specified_amount.units = int(budget_amount)
    
    # Set thresholds
    budget.threshold_rules = [
        billing_budgets_v1.ThresholdRule(threshold_percent=0.5),
        billing_budgets_v1.ThresholdRule(threshold_percent=0.9),
        billing_budgets_v1.ThresholdRule(threshold_percent=1.0),
    ]
    
    # Add Pub/Sub notification
    budget.notifications_rule.pubsub_topic = f"projects/{project_id}/topics/budget-alerts"
    
    parent = f"billingAccounts/{billing_account_id}"
    response = client.create_budget(parent=parent, budget=budget)
    print(f"Created budget: {response.name}")

create_budget_alert("BILLING_ACCOUNT_ID", "PROJECT_ID", 100.0)
```

---

## Troubleshooting

### Common Issues and Solutions

**1. Authentication Errors**

**Problem:** `Error 403: Permission denied`

**Solution:**
```bash
# Refresh authentication
gcloud auth login

# Re-initialize ADC
gcloud auth application-default login

# Check current account
gcloud auth list

# Verify project permissions
gcloud projects get-iam-policy PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.members:user:YOUR_EMAIL"
```

**2. Quota Exceeded**

**Problem:** `Error 429: Quota exceeded for quota metric`

**Solution:**
```bash
# Check quotas
gcloud compute project-info describe --project=PROJECT_ID

# Request quota increase
# Navigate to: IAM & Admin → Quotas
# Select quota → Click "Edit Quotas" → Request increase
```

**3. API Not Enabled**

**Problem:** `API [service] not enabled on project [project]`

**Solution:**
```bash
# Enable the required API
gcloud services enable SERVICE_NAME.googleapis.com

# Example
gcloud services enable compute.googleapis.com
```

**4. Billing Not Enabled**

**Problem:** `Project PROJECT_ID is not linked to a billing account`

**Solution:**
```bash
# Check billing status
gcloud billing projects describe PROJECT_ID

# Link billing account
gcloud billing projects link PROJECT_ID \
    --billing-account=BILLING_ACCOUNT_ID
```

**5. gcloud Command Not Found**

**Problem:** `gcloud: command not found`

**Solution:**
```bash
# Windows: Add to PATH
# Open Environment Variables → Add SDK bin directory

# macOS/Linux: Add to shell profile
echo 'source /path/to/google-cloud-sdk/path.bash.inc' >> ~/.bashrc
source ~/.bashrc
```

### Debugging Commands

```bash
# Get detailed debug output
gcloud compute instances list --log-http

# Verbose output
gcloud compute instances list --verbosity=debug

# Check configuration
gcloud config list
gcloud config configurations list

# Test connectivity
gcloud compute networks list

# Validate credentials
gcloud auth print-access-token
gcloud auth print-identity-token
```

---

## Next Steps

Now that you have a production-ready GCP environment:

1. **Explore Deployment Options:** Read `gcp-deployments.md` to learn about Cloud Run, Cloud Functions, GKE, and more.

2. **Implement Security Guardrails:** Review `gcp-security-guardrails.md` for production security best practices.

3. **Build Working Examples:** Explore the `examples/` directory for production-ready code samples.

4. **Set Up CI/CD:** Implement Cloud Build pipelines for automated deployments.

5. **Monitor and Optimize:** Regularly review costs, performance metrics, and security findings.

---

## Additional Resources

**Official Documentation:**
- [GCP Documentation](https://cloud.google.com/docs)
- [gcloud CLI Reference](https://cloud.google.com/sdk/gcloud/reference)
- [GCP Pricing Calculator](https://cloud.google.com/products/calculator)
- [GCP Free Tier](https://cloud.google.com/free)

**Best Practices:**
- [GCP Best Practices Center](https://cloud.google.com/architecture/framework)
- [Security Best Practices](https://cloud.google.com/security/best-practices)
- [Cost Optimization](https://cloud.google.com/architecture/framework/cost-optimization)

**Learning Resources:**
- [Google Cloud Skills Boost](https://www.cloudskillsboost.google/)
- [GCP Quickstarts](https://cloud.google.com/docs/quickstarts)
- [Architecture Center](https://cloud.google.com/architecture)

**Community:**
- [GCP Community](https://www.googlecloudcommunity.com/)
- [Stack Overflow - GCP](https://stackoverflow.com/questions/tagged/google-cloud-platform)
- [GCP Slack Community](https://googlecloud-community.slack.com/)

---

*Last Updated: 2024*
*Maintained by: Grand Budapest Terminal Team*
