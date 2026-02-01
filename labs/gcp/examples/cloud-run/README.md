# Cloud Run FastAPI Example

Production-ready FastAPI application deployed to Cloud Run with security best practices.

## Architecture

```
Internet → Cloud Load Balancer → Cloud Run Service
                                      ↓
                           ┌──────────┴──────────┐
                           ↓                     ↓
                    Secret Manager        Cloud Logging
```

## Features

- ✅ FastAPI web framework
- ✅ Multi-stage Docker build
- ✅ Cloud Build CI/CD pipeline
- ✅ Secret Manager integration
- ✅ Health checks and readiness probes
- ✅ Structured logging
- ✅ Terraform infrastructure
- ✅ Production-grade error handling

## Project Structure

```
cloud-run/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI application
│   ├── config.py         # Configuration
│   └── routes/
│       ├── __init__.py
│       ├── health.py     # Health endpoints
│       └── api.py        # API endpoints
├── Dockerfile            # Multi-stage build
├── cloudbuild.yaml       # CI/CD pipeline
├── terraform/            # Infrastructure as code
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars.example
├── requirements.txt
├── .dockerignore
└── README.md
```

## Prerequisites

- GCP project with billing enabled
- gcloud CLI installed and configured
- Docker installed (for local testing)
- Terraform installed (for infrastructure deployment)

## Quick Start

### 1. Setup GCP Project

```bash
# Set project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com

# Create Artifact Registry repository
gcloud artifacts repositories create cloud-run-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker repository for Cloud Run"
```

### 2. Create Secrets

```bash
# Create database URL secret
echo -n "postgresql://user:pass@host:5432/db" | \
    gcloud secrets create database-url --data-file=-

# Create API key secret
echo -n "your-api-key-here" | \
    gcloud secrets create api-key --data-file=-

# Grant Cloud Run access to secrets
gcloud secrets add-iam-policy-binding database-url \
    --member="serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding api-key \
    --member="serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### 3. Local Testing

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
export DATABASE_URL="postgresql://localhost:5432/testdb"
export API_KEY="test-key"
uvicorn app.main:app --reload

# Test
curl http://localhost:8000/health
```

### 4. Deploy with gcloud

```bash
# Build and deploy
gcloud run deploy fastapi-app \
    --source . \
    --region us-central1 \
    --set-secrets "DATABASE_URL=database-url:latest,API_KEY=api-key:latest" \
    --allow-unauthenticated \
    --min-instances 0 \
    --max-instances 10 \
    --memory 512Mi \
    --cpu 1 \
    --timeout 300s \
    --concurrency 80

# Get service URL
gcloud run services describe fastapi-app \
    --region us-central1 \
    --format "value(status.url)"
```

### 5. Deploy with Terraform

```bash
cd terraform

# Initialize
terraform init

# Copy and edit variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Plan
terraform plan

# Apply
terraform apply
```

## CI/CD with Cloud Build

### Setup Trigger

```bash
# Connect GitHub repository (one-time)
gcloud builds triggers create github \
    --name="cloud-run-deploy" \
    --repo-name="your-repo" \
    --repo-owner="your-org" \
    --branch-pattern="^main$" \
    --build-config="cloudbuild.yaml"
```

### Manual Build

```bash
gcloud builds submit --config=cloudbuild.yaml .
```

## API Endpoints

### Health Check
```bash
curl https://YOUR-SERVICE-URL/health
# {"status": "healthy", "timestamp": "2024-01-15T12:00:00"}
```

### Readiness Check
```bash
curl https://YOUR-SERVICE-URL/ready
# {"ready": true, "checks": {"database": "ok", "cache": "ok"}}
```

### API Example
```bash
curl https://YOUR-SERVICE-URL/api/v1/items \
    -H "X-API-Key: your-api-key"
# {"items": [...]}
```

## Monitoring

### View Logs
```bash
gcloud logging read "resource.type=cloud_run_revision \
    AND resource.labels.service_name=fastapi-app" \
    --limit 50 \
    --format json
```

### View Metrics
```bash
# Navigate to Cloud Console → Cloud Run → fastapi-app → Metrics
```

## Security Features

1. **Secret Management**: All secrets stored in Secret Manager
2. **HTTPS Only**: Automatic HTTPS with managed certificates
3. **Service Account**: Custom service account with minimal permissions
4. **API Key Authentication**: Protected endpoints require API key
5. **Request Validation**: Pydantic models validate all input
6. **Rate Limiting**: Configurable rate limits per endpoint

## Cost Optimization

- **Scale to Zero**: No charges when idle
- **Autoscaling**: Scales based on traffic
- **Resource Limits**: CPU and memory optimized
- **Request Timeout**: 5-minute timeout to prevent runaway costs

**Estimated Monthly Cost** (1M requests, avg 100ms):
- Requests: $0.40
- CPU: $2.40
- Memory: $0.40
- **Total: ~$3.20/month**

## Troubleshooting

### Container Fails to Start
```bash
# Check logs
gcloud logging read "resource.type=cloud_run_revision" --limit 100

# Common issues:
# - PORT environment variable not used
# - Dependencies missing in requirements.txt
# - Secret not accessible
```

### 503 Service Unavailable
```bash
# Check scaling settings
gcloud run services describe fastapi-app --region us-central1

# Increase max instances if needed
gcloud run services update fastapi-app \
    --max-instances 20 \
    --region us-central1
```

## Production Checklist

- [ ] Secrets in Secret Manager (never in code)
- [ ] Custom service account with minimal permissions
- [ ] Health and readiness probes configured
- [ ] Logging and monitoring enabled
- [ ] Error tracking configured
- [ ] Rate limiting enabled
- [ ] Authentication required for sensitive endpoints
- [ ] Terraform state in remote backend
- [ ] CI/CD pipeline automated
- [ ] Backup and disaster recovery plan

## Next Steps

1. Add authentication with Cloud Identity Platform
2. Implement caching with Cloud Memorystore
3. Add database with Cloud SQL
4. Set up Cloud CDN for static assets
5. Implement rate limiting with Cloud Armor

## Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
