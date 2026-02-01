# GCP Labs - Production-Ready Google Cloud Platform Infrastructure

**Complete learning infrastructure for Google Cloud Platform with security best practices, working examples, and Infrastructure as Code.**

---

## 📚 Overview

This comprehensive GCP labs infrastructure provides everything you need to get started with Google Cloud Platform, from beginner setup to production deployments with enterprise-grade security.

### What's Included

- **3 In-Depth Guides** (~25,000 words total)
- **Working Code Examples** (Cloud Run, Cloud Functions, Terraform)
- **Production-Ready Infrastructure** (Terraform modules)
- **Security-First Approach** (Workload Identity, Secret Manager, Binary Authorization)
- **CI/CD Pipelines** (Cloud Build configurations)
- **Cost Optimization Strategies**

---

## 🗂️ Repository Structure

```
labs/gcp/
├── README.md (this file)
├── LABS_SUMMARY.md
│
├── 📖 GUIDES/
│   ├── gcp-getting-started.md (6,000+ words)
│   ├── gcp-deployments.md (7,000+ words)
│   └── gcp-security-guardrails.md (8,000+ words)
│
└── 💻 EXAMPLES/
    ├── cloud-run/              ✅ COMPLETE
    │   ├── app/               (FastAPI application)
    │   ├── terraform/         (Infrastructure as Code)
    │   ├── Dockerfile
    │   ├── cloudbuild.yaml
    │   └── README.md
    │
    ├── cloud-functions/       🚧 IN PROGRESS
    │   ├── http-trigger/
    │   ├── pubsub-trigger/
    │   └── storage-trigger/
    │
    └── terraform/             🚧 IN PROGRESS
        └── modules/
            ├── cloud-run/
            ├── cloud-functions/
            ├── vpc/
            ├── secret-manager/
            └── monitoring/
```

---

## 🚀 Quick Start

### 1. Read the Guides (30-60 minutes)

**Start here if you're new to GCP:**

1. **[gcp-getting-started.md](gcp-getting-started.md)** - Complete beginner's guide
   - GCP account setup ($300 free trial)
   - gcloud CLI installation
   - Project management
   - Billing and budgets
   - IAM and service accounts
   - SDK installation

2. **[gcp-deployments.md](gcp-deployments.md)** - Choose your deployment platform
   - Cloud Run (recommended for most apps)
   - Cloud Functions (serverless functions)
   - App Engine (PaaS)
   - GKE (Kubernetes)
   - Compute Engine (VMs)
   - **Decision matrix to help you choose**

3. **[gcp-security-guardrails.md](gcp-security-guardrails.md)** - Production security
   - VPC Service Controls
   - Secret Manager (never hardcode secrets!)
   - Workload Identity (no service account keys)
   - Binary Authorization
   - Cloud Armor (DDoS/WAF)
   - Security Command Center
   - Compliance (HIPAA, PCI-DSS, SOC 2)

### 2. Try the Examples (15-30 minutes each)

**Hands-on learning with production-ready code:**

#### Cloud Run FastAPI Example ✅

```bash
cd examples/cloud-run

# 1. Set up GCP project
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# 2. Enable APIs
gcloud services enable run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com

# 3. Create secrets
echo -n "your-db-url" | gcloud secrets create database-url --data-file=-
echo -n "your-api-key" | gcloud secrets create api-key --data-file=-

# 4. Deploy
gcloud run deploy fastapi-app \
    --source . \
    --region us-central1 \
    --set-secrets "DATABASE_URL=database-url:latest,API_KEY=api-key:latest" \
    --allow-unauthenticated

# 5. Test
curl $(gcloud run services describe fastapi-app --region us-central1 --format="value(status.url)")/health
```

**Or use Terraform:**
```bash
cd examples/cloud-run/terraform
terraform init
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
terraform apply
```

---

## 🎯 Learning Path

### Beginner (Week 1-2)

- [ ] Read `gcp-getting-started.md`
- [ ] Set up GCP account ($300 free credits)
- [ ] Install gcloud CLI
- [ ] Create first project
- [ ] Deploy Cloud Run example
- [ ] Explore GCP Console

### Intermediate (Week 3-4)

- [ ] Read `gcp-deployments.md`
- [ ] Compare deployment options
- [ ] Deploy Cloud Functions example
- [ ] Set up CI/CD with Cloud Build
- [ ] Implement monitoring and logging
- [ ] Learn Terraform basics

### Advanced (Week 5-8)

- [ ] Read `gcp-security-guardrails.md`
- [ ] Implement VPC Service Controls
- [ ] Set up Workload Identity
- [ ] Configure Binary Authorization
- [ ] Deploy Cloud Armor
- [ ] Enable Security Command Center
- [ ] Build multi-region infrastructure

---

## 💡 Key Features

### Security-First Design

✅ **No Hardcoded Secrets** - All secrets in Secret Manager  
✅ **Workload Identity** - Keyless authentication (no service account keys)  
✅ **Binary Authorization** - Only signed containers deploy  
✅ **VPC Service Controls** - Data exfiltration prevention  
✅ **Cloud Armor** - DDoS and WAF protection  
✅ **Least Privilege** - Minimal IAM permissions  
✅ **Audit Logging** - Complete audit trail  

### Production-Ready Code

✅ **Health Checks** - Liveness and readiness probes  
✅ **Structured Logging** - JSON logging for Cloud Logging  
✅ **Error Handling** - Proper exception handling  
✅ **Input Validation** - Pydantic models  
✅ **Multi-Stage Builds** - Optimized Docker images  
✅ **CI/CD Pipelines** - Automated deployments  
✅ **Infrastructure as Code** - Terraform modules  

### Cost Optimization

✅ **Scale to Zero** - No charges when idle  
✅ **Autoscaling** - Automatic scaling based on load  
✅ **Resource Limits** - CPU and memory optimized  
✅ **Committed Use** - Discounts for sustained workloads  
✅ **Budget Alerts** - Prevent cost overruns  
✅ **Cost Monitoring** - BigQuery exports for analysis  

---

## 📋 Examples Overview

### 1. Cloud Run - FastAPI Application ✅ COMPLETE

**What it demonstrates:**
- Production-ready FastAPI web application
- Multi-stage Docker build
- Secret Manager integration
- Cloud Build CI/CD pipeline
- Terraform infrastructure
- Health checks and monitoring
- API authentication

**Tech Stack:**
- Python 3.11
- FastAPI
- Uvicorn/Gunicorn
- Pydantic
- Docker
- Terraform

**Files:**
- `app/main.py` - FastAPI application
- `app/config.py` - Configuration with Secret Manager
- `app/routes/` - API and health endpoints
- `Dockerfile` - Multi-stage build
- `cloudbuild.yaml` - CI/CD pipeline
- `terraform/` - Infrastructure as Code

### 2. Cloud Functions - Event-Driven 🚧 IN PROGRESS

**What it will demonstrate:**
- HTTP-triggered function (Node.js)
- Pub/Sub-triggered function (Python)
- Storage-triggered function (Go)
- Secret Manager integration
- Event processing patterns
- Terraform deployment

### 3. Terraform Modules 🚧 IN PROGRESS

**What it will include:**
- Cloud Run module (with CDN, load balancer)
- Cloud Functions module
- VPC networking module
- Secret Manager module
- Monitoring and alerting module
- Complete example combining all modules

---

## 🔧 Prerequisites

### Required
- Google Cloud account
- Credit card (for verification, even with free trial)
- Basic command-line knowledge
- Understanding of cloud concepts (helpful)

### Tools to Install
- **gcloud CLI** - [Installation guide in gcp-getting-started.md]
- **Docker** - For local testing
- **Terraform** - For infrastructure as code
- **Git** - For version control

### Recommended
- **Python 3.11+** - For Cloud Run example
- **Node.js 18+** - For Cloud Functions example
- **Go 1.21+** - For Cloud Functions example
- **VS Code** - With GCP extensions

---

## 📊 Cost Estimate

### Free Tier (Monthly)
- Cloud Run: 2M requests, 360K vCPU-seconds - **FREE**
- Cloud Functions: 2M invocations - **FREE**
- Cloud Build: 120 build-minutes/day - **FREE**
- Secret Manager: 6 active secrets - **FREE**

### Example Costs (After Free Tier)

**Small App (1M requests/month):**
- Cloud Run: ~$3/month
- Cloud Functions: ~$2/month
- Artifact Registry: ~$0.10/month
- **Total: ~$5/month**

**Medium App (10M requests/month):**
- Cloud Run: ~$30/month
- Cloud Storage: ~$1/month
- Cloud Build: ~$5/month
- **Total: ~$36/month**

**Plus $300 free trial credit for first 90 days!**

---

## 🎓 What You'll Learn

### Cloud Fundamentals
- GCP project and billing management
- IAM roles and service accounts
- Resource organization and labels
- Cost monitoring and optimization
- Security best practices

### Deployment Platforms
- Cloud Run (serverless containers)
- Cloud Functions (FaaS)
- App Engine (PaaS)
- GKE (Kubernetes)
- Compute Engine (VMs)
- **When to use each platform**

### Security & Compliance
- Secret Manager integration
- Workload Identity (keyless auth)
- VPC Service Controls
- Binary Authorization
- Cloud Armor (WAF/DDoS)
- Security Command Center
- HIPAA, PCI-DSS, SOC 2 compliance

### DevOps & CI/CD
- Docker containerization
- Cloud Build pipelines
- Artifact Registry
- Blue/green deployments
- Canary releases
- Automated testing

### Infrastructure as Code
- Terraform basics
- GCP provider
- Module development
- State management
- Best practices

---

## 🛠️ Troubleshooting

### Common Issues

**1. "Permission denied" errors**
```bash
# Check current account
gcloud auth list

# Re-authenticate
gcloud auth login

# Check project permissions
gcloud projects get-iam-policy PROJECT_ID
```

**2. "API not enabled"**
```bash
# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

**3. "Billing not enabled"**
```bash
# Check billing status
gcloud billing projects describe PROJECT_ID

# Link billing account
gcloud billing projects link PROJECT_ID --billing-account=ACCOUNT_ID
```

**4. "Container fails to start"**
```bash
# Check logs
gcloud logging read "resource.type=cloud_run_revision" --limit 100

# Common fixes:
# - Use PORT environment variable
# - Check dependencies in requirements.txt
# - Verify secret access
```

See guides for detailed troubleshooting sections.

---

## 📚 Additional Resources

### Official Documentation
- [GCP Documentation](https://cloud.google.com/docs)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Cloud Functions Docs](https://cloud.google.com/functions/docs)
- [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

### Learning Resources
- [Google Cloud Skills Boost](https://www.cloudskillsboost.google/) - Free labs
- [GCP Quickstarts](https://cloud.google.com/docs/quickstarts)
- [Architecture Center](https://cloud.google.com/architecture)

### Community
- [GCP Community](https://www.googlecloudcommunity.com/)
- [Stack Overflow - GCP](https://stackoverflow.com/questions/tagged/google-cloud-platform)
- [Reddit r/googlecloud](https://reddit.com/r/googlecloud)

### Tools
- [GCP Pricing Calculator](https://cloud.google.com/products/calculator)
- [GCP Status Dashboard](https://status.cloud.google.com/)
- [GCP Release Notes](https://cloud.google.com/release-notes)

---

## 🤝 Contributing

This is a learning resource for the Grand Budapest Terminal project. Improvements welcome!

**To contribute:**
1. Test all code examples
2. Verify security best practices
3. Update documentation
4. Follow Python coding standards (see main repo)

---

## 📝 License

See main repository LICENSE file.

---

## ✅ Production Checklist

Before deploying to production, ensure:

**Security:**
- [ ] All secrets in Secret Manager
- [ ] Workload Identity enabled (no service account keys)
- [ ] Binary Authorization configured
- [ ] VPC Service Controls enabled
- [ ] Cloud Armor deployed
- [ ] Audit logging enabled
- [ ] Security Command Center active

**Reliability:**
- [ ] Health checks configured
- [ ] Auto-scaling enabled
- [ ] Multi-region deployment
- [ ] Backup and disaster recovery plan
- [ ] Monitoring and alerting
- [ ] Error tracking (Cloud Error Reporting)

**Operations:**
- [ ] CI/CD pipeline automated
- [ ] Infrastructure as Code (Terraform)
- [ ] Logging centralized
- [ ] Runbooks documented
- [ ] On-call rotation defined

**Cost:**
- [ ] Budget alerts configured
- [ ] Resource quotas set
- [ ] Auto-scaling limits defined
- [ ] Committed use discounts applied
- [ ] Regular cost reviews scheduled

---

## 📞 Support

**For GCP issues:**
- [GCP Support](https://cloud.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-cloud-platform)
- [GCP Community](https://www.googlecloudcommunity.com/)

**For this repo:**
- Open an issue in the main repository
- Check existing guides for answers
- Review code examples

---

**Ready to get started? Begin with [gcp-getting-started.md](gcp-getting-started.md)!**

*Last Updated: 2024*  
*Maintained by: Grand Budapest Terminal Team*
