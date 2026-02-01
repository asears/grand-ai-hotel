# GCP Deployment Options Guide

**Complete Guide to Google Cloud Platform Deployment Services**

*Choose the right deployment platform for your application with this detailed comparison and decision matrix.*

---

## Table of Contents

1. [Introduction](#introduction)
2. [Cloud Run](#cloud-run)
3. [Cloud Functions](#cloud-functions)
4. [App Engine](#app-engine)
5. [Google Kubernetes Engine (GKE)](#google-kubernetes-engine-gke)
6. [Compute Engine](#compute-engine)
7. [Artifact Registry](#artifact-registry)
8. [Cloud Build](#cloud-build)
9. [Deployment Decision Matrix](#deployment-decision-matrix)
10. [Migration Strategies](#migration-strategies)

---

## Introduction

Google Cloud Platform offers multiple deployment options, each optimized for different use cases. This guide helps you choose the right platform based on your application requirements, team expertise, and operational preferences.

### Deployment Platform Spectrum

```
Managed ← ------------------------------------------------ → Control
Cloud Functions | Cloud Run | App Engine | GKE | Compute Engine
Serverless      | Containers| PaaS       | CaaS| IaaS
```

**Key Decision Factors:**
- **Operational Overhead:** How much infrastructure management are you willing to handle?
- **Scaling Requirements:** Do you need zero-scale or sustained baseline traffic?
- **Runtime Flexibility:** Standard runtime or custom dependencies?
- **Cost Model:** Pay-per-use vs. sustained resources?
- **Team Expertise:** Serverless, containers, or VMs?

---

## Cloud Run

**Cloud Run** is a fully managed serverless platform for deploying containerized applications that scale automatically from zero to production.

### Overview

**What It Is:**
- Fully managed container runtime
- Scales to zero (no idle costs)
- Automatic HTTPS/TLS
- Built on Knative (portable to other Kubernetes environments)

**When to Use:**
- Web applications and APIs
- Microservices architectures
- Event-driven applications
- Workloads with variable traffic
- Want container flexibility without Kubernetes complexity

**Pricing Model:**
- Pay only for CPU/memory used during request processing
- No charges when idle (scales to zero)
- Free tier: 2 million requests/month, 360,000 vCPU-seconds

### Key Features

**1. Container-First:**
```dockerfile
# Any container that responds to HTTP on PORT environment variable
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 main:app
```

**2. Automatic Scaling:**
```bash
# Deploy with scaling configuration
gcloud run deploy my-service \
    --image gcr.io/PROJECT_ID/my-app \
    --platform managed \
    --region us-central1 \
    --min-instances 0 \
    --max-instances 100 \
    --concurrency 80 \
    --cpu 2 \
    --memory 512Mi \
    --timeout 300s \
    --allow-unauthenticated
```

**3. Traffic Splitting (Blue/Green Deployments):**
```bash
# Deploy new revision
gcloud run deploy my-service \
    --image gcr.io/PROJECT_ID/my-app:v2 \
    --no-traffic

# Gradually shift traffic
gcloud run services update-traffic my-service \
    --to-revisions v2=10,v1=90

# Full cutover
gcloud run services update-traffic my-service \
    --to-latest
```

**4. Service-to-Service Authentication:**
```python
# Calling service
import google.auth
from google.auth.transport.requests import AuthorizedSession

def call_cloud_run_service(url: str) -> dict:
    """Call another Cloud Run service with authentication."""
    credentials, project = google.auth.default()
    authed_session = AuthorizedSession(credentials)
    
    response = authed_session.get(url)
    return response.json()
```

### Configuration Options

**Environment Variables:**
```bash
gcloud run deploy my-service \
    --image gcr.io/PROJECT_ID/my-app \
    --set-env-vars "DATABASE_URL=postgres://...,LOG_LEVEL=info"

# Or from file
gcloud run deploy my-service \
    --image gcr.io/PROJECT_ID/my-app \
    --env-vars-file .env.yaml
```

**Secret Manager Integration:**
```bash
# Mount secrets as environment variables
gcloud run deploy my-service \
    --image gcr.io/PROJECT_ID/my-app \
    --set-secrets "DATABASE_PASSWORD=db-password:latest,API_KEY=api-key:1"

# Mount as files
gcloud run deploy my-service \
    --image gcr.io/PROJECT_ID/my-app \
    --set-secrets "/secrets/db-password=db-password:latest"
```

**VPC Connector (Private Network Access):**
```bash
# Create VPC connector
gcloud compute networks vpc-access connectors create my-connector \
    --region us-central1 \
    --subnet my-subnet \
    --subnet-project PROJECT_ID

# Deploy with VPC access
gcloud run deploy my-service \
    --image gcr.io/PROJECT_ID/my-app \
    --vpc-connector my-connector \
    --vpc-egress all-traffic
```

**Custom Domains:**
```bash
# Add custom domain
gcloud run domain-mappings create \
    --service my-service \
    --domain api.example.com \
    --region us-central1
```

### Best Practices

**1. Health Checks:**
```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/health')
def health():
    """Health check endpoint for Cloud Run."""
    return jsonify({"status": "healthy"}), 200

@app.route('/readiness')
def readiness():
    """Readiness probe - checks dependencies."""
    # Check database connection, cache, etc.
    return jsonify({"ready": True}), 200
```

**2. Graceful Shutdown:**
```python
import signal
import sys

def signal_handler(sig, frame):
    """Handle SIGTERM for graceful shutdown."""
    print('Received SIGTERM, shutting down gracefully...')
    # Close database connections, flush logs, etc.
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_handler)
```

**3. Optimize Cold Starts:**
```dockerfile
# Multi-stage build to reduce image size
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH
CMD exec gunicorn --bind :$PORT main:app
```

**4. Use Minimum Instances for Latency-Sensitive Apps:**
```bash
# Keep at least 1 instance warm
gcloud run deploy my-service \
    --image gcr.io/PROJECT_ID/my-app \
    --min-instances 1
```

### Limitations

- **Request Timeout:** Maximum 60 minutes (3600 seconds)
- **Memory:** Up to 32 GiB
- **CPU:** Up to 8 vCPUs (during request processing only)
- **Concurrency:** Up to 1000 concurrent requests per instance
- **Container Image:** Maximum 32 GiB
- **Ephemeral Storage:** Limited (use Cloud Storage for persistence)

---

## Cloud Functions

**Cloud Functions** is a serverless execution environment for building event-driven applications without managing servers.

### Overview

**What It Is:**
- Function-as-a-Service (FaaS)
- Gen 2 built on Cloud Run infrastructure
- Automatic scaling from zero
- Event-driven execution

**When to Use:**
- Small, single-purpose functions
- Event processing (Pub/Sub, Storage, Firestore)
- API endpoints (simple REST)
- Scheduled tasks (cron jobs)
- Webhooks and integrations

**Pricing Model:**
- Pay per invocation and compute time
- Free tier: 2 million invocations/month
- Gen 2 pricing aligned with Cloud Run

### Cloud Functions Gen 2 vs Gen 1

| Feature | Gen 2 (Recommended) | Gen 1 (Legacy) |
|---------|---------------------|----------------|
| Runtime | Cloud Run infrastructure | Proprietary |
| Max Timeout | 60 minutes | 9 minutes |
| Concurrency | Up to 1000 | 1 (single request) |
| Min Instances | Supported | No |
| Traffic Splitting | Yes | No |
| VPC Connector | Yes | Limited |
| Event Sources | Eventarc (90+ sources) | Limited triggers |

**Always use Gen 2 for new projects.**

### HTTP Functions

**Python Example:**
```python
# main.py
import functions_framework
from flask import Request, jsonify

@functions_framework.http
def hello_http(request: Request):
    """HTTP Cloud Function."""
    request_json = request.get_json(silent=True)
    name = request_json.get('name', 'World') if request_json else 'World'
    
    return jsonify({
        'message': f'Hello, {name}!',
        'status': 'success'
    })
```

**Node.js Example:**
```javascript
// index.js
const functions = require('@google-cloud/functions-framework');

functions.http('helloHttp', (req, res) => {
  const name = req.body.name || req.query.name || 'World';
  res.json({
    message: `Hello, ${name}!`,
    status: 'success'
  });
});
```

**Go Example:**
```go
// function.go
package function

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type Response struct {
    Message string `json:"message"`
    Status  string `json:"status"`
}

func HelloHTTP(w http.ResponseWriter, r *http.Request) {
    var d struct {
        Name string `json:"name"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
        d.Name = "World"
    }
    
    response := Response{
        Message: fmt.Sprintf("Hello, %s!", d.Name),
        Status:  "success",
    }
    
    json.NewEncoder(w).Encode(response)
}
```

**Deployment:**
```bash
# Deploy Python function
gcloud functions deploy hello-http \
    --gen2 \
    --runtime python311 \
    --entry-point hello_http \
    --source . \
    --trigger-http \
    --region us-central1 \
    --allow-unauthenticated

# Deploy Node.js function
gcloud functions deploy hello-http \
    --gen2 \
    --runtime nodejs20 \
    --entry-point helloHttp \
    --source . \
    --trigger-http \
    --region us-central1

# Deploy Go function
gcloud functions deploy hello-http \
    --gen2 \
    --runtime go121 \
    --entry-point HelloHTTP \
    --source . \
    --trigger-http \
    --region us-central1
```

### Event-Driven Functions

**Pub/Sub Trigger (Python):**
```python
import functions_framework
import base64
import json
from cloudevents.http import CloudEvent

@functions_framework.cloud_event
def process_pubsub(cloud_event: CloudEvent) -> None:
    """Process Pub/Sub message."""
    # Decode message data
    message_data = base64.b64decode(cloud_event.data["message"]["data"]).decode()
    message = json.loads(message_data)
    
    print(f"Processing message: {message}")
    # Process the message
```

**Deploy:**
```bash
gcloud functions deploy process-pubsub \
    --gen2 \
    --runtime python311 \
    --entry-point process_pubsub \
    --source . \
    --trigger-topic my-topic \
    --region us-central1
```

**Cloud Storage Trigger (Node.js):**
```javascript
const functions = require('@google-cloud/functions-framework');

functions.cloudEvent('processFile', async (cloudEvent) => {
  const file = cloudEvent.data;
  
  console.log(`File: ${file.name}`);
  console.log(`Bucket: ${file.bucket}`);
  console.log(`Event Type: ${cloudEvent.type}`);
  
  // Process file (e.g., generate thumbnail, extract metadata)
});
```

**Deploy:**
```bash
gcloud functions deploy process-file \
    --gen2 \
    --runtime nodejs20 \
    --entry-point processFile \
    --source . \
    --trigger-bucket my-bucket \
    --region us-central1
```

**Firestore Trigger (Go):**
```go
package function

import (
    "context"
    "fmt"
    "log"
    
    "github.com/GoogleCloudPlatform/functions-framework-go/functions"
    "github.com/cloudevents/sdk-go/v2/event"
)

func init() {
    functions.CloudEvent("ProcessFirestore", processFirestore)
}

func processFirestore(ctx context.Context, e event.Event) error {
    log.Printf("Event Type: %s", e.Type())
    log.Printf("Event Subject: %s", e.Subject())
    
    // Process Firestore document change
    return nil
}
```

### Advanced Configuration

**Secret Manager Integration:**
```python
# Access secrets in function
from google.cloud import secretmanager

def get_secret(secret_id: str) -> str:
    """Retrieve secret from Secret Manager."""
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/PROJECT_ID/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

@functions_framework.http
def my_function(request):
    api_key = get_secret("api-key")
    # Use api_key
```

**Or use environment variables:**
```bash
gcloud functions deploy my-function \
    --gen2 \
    --runtime python311 \
    --set-secrets "API_KEY=api-key:latest"
```

**VPC Access:**
```bash
gcloud functions deploy my-function \
    --gen2 \
    --runtime python311 \
    --vpc-connector my-connector \
    --egress-settings all
```

**Concurrency and Scaling:**
```bash
gcloud functions deploy my-function \
    --gen2 \
    --runtime python311 \
    --min-instances 1 \
    --max-instances 100 \
    --concurrency 80
```

### Best Practices

**1. Idempotent Functions:**
```python
# Handle duplicate events
import hashlib

processed_events = set()

@functions_framework.cloud_event
def idempotent_processor(cloud_event):
    """Idempotent event processing."""
    event_id = cloud_event["id"]
    
    if event_id in processed_events:
        print(f"Event {event_id} already processed, skipping")
        return
    
    # Process event
    process_event(cloud_event)
    
    # Mark as processed
    processed_events.add(event_id)
```

**2. Error Handling and Retries:**
```python
@functions_framework.cloud_event
def reliable_processor(cloud_event):
    """Handle errors and retries."""
    try:
        process_event(cloud_event)
    except Exception as e:
        print(f"Error processing event: {e}")
        # For Pub/Sub: raise exception to trigger retry
        raise
```

**3. Optimize Dependencies:**
```python
# requirements.txt - only include necessary packages
functions-framework==3.*
google-cloud-storage==2.*
# Avoid heavy dependencies that slow cold starts
```

**4. Use Global Variables for Reuse:**
```python
# Initialize expensive resources outside handler
from google.cloud import storage

# Global variable (reused across invocations in same instance)
storage_client = storage.Client()

@functions_framework.http
def my_function(request):
    """Reuse storage client across requests."""
    bucket = storage_client.bucket("my-bucket")
    # Use bucket
```

---

## App Engine

**App Engine** is a fully managed platform-as-a-service (PaaS) for building scalable web applications and backends.

### Overview

**What It Is:**
- Original GCP serverless platform (launched 2008)
- Two environments: Standard and Flexible
- Application-centric deployment model
- Integrated services (Cron, Task Queues, Memcache)

**When to Use:**
- Traditional web applications
- Need integrated services (Cron, Task Queues)
- Want minimal configuration
- Migrating from Heroku
- Long-running background tasks (Flexible)

**Standard vs. Flexible:**

| Feature | Standard | Flexible |
|---------|----------|----------|
| Startup Time | Milliseconds | Minutes |
| Scaling | Zero to thousands | Minimum 1 instance |
| Pricing | Instance hours | VM pricing |
| Runtime | Sandboxed (specific versions) | Docker containers |
| SSH Access | No | Yes |
| Local Disk | No (volatile only) | Yes (ephemeral) |
| WebSockets | Yes | Yes |
| Background Threads | Limited | Unlimited |

### App Engine Standard

**Supported Runtimes:**
- Python 3.7, 3.8, 3.9, 3.10, 3.11
- Node.js 12, 14, 16, 18, 20
- Java 11, 17
- PHP 7.4, 8.1
- Ruby 2.7, 3.0, 3.1, 3.2
- Go 1.16, 1.17, 1.18, 1.19, 1.20, 1.21

**Python Example:**
```python
# main.py
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello from App Engine!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

**app.yaml Configuration:**
```yaml
runtime: python311
entrypoint: gunicorn -b :$PORT main:app

instance_class: F2

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 0
  max_instances: 10
  min_pending_latency: 30ms
  max_pending_latency: automatic
  max_concurrent_requests: 80

env_variables:
  LOG_LEVEL: "info"
  
# Secret Manager
env_variables:
  DATABASE_URL: ${DATABASE_URL}
```

**Deploy:**
```bash
gcloud app deploy app.yaml --project=PROJECT_ID
```

**Cron Jobs (cron.yaml):**
```yaml
cron:
- description: "Daily data cleanup"
  url: /tasks/cleanup
  schedule: every day 02:00
  timezone: America/New_York
  
- description: "Hourly sync"
  url: /tasks/sync
  schedule: every 1 hours
```

**Deploy cron:**
```bash
gcloud app deploy cron.yaml
```

**Task Queues (queue.yaml):**
```yaml
queue:
- name: default
  rate: 5/s
  bucket_size: 10
  max_concurrent_requests: 10
  
- name: batch-processing
  rate: 1/s
  retry_parameters:
    task_retry_limit: 7
    task_age_limit: 2d
```

### App Engine Flexible

**Custom Runtime (Docker):**
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 main:app
```

**app.yaml:**
```yaml
runtime: custom
env: flex

resources:
  cpu: 1
  memory_gb: 0.5
  disk_size_gb: 10

automatic_scaling:
  min_num_instances: 1
  max_num_instances: 10
  cpu_utilization:
    target_utilization: 0.65

network:
  instance_tag: app-engine-flex
  
vpc_access_connector:
  name: projects/PROJECT_ID/locations/us-central1/connectors/my-connector
```

### Best Practices

**1. Version Management:**
```bash
# Deploy new version without migrating traffic
gcloud app deploy --no-promote

# List versions
gcloud app versions list

# Split traffic
gcloud app services set-traffic default \
    --splits v2=0.1,v1=0.9

# Migrate all traffic
gcloud app services set-traffic default \
    --splits v2=1
```

**2. Use Dispatch Rules:**
```yaml
# dispatch.yaml - route requests to specific services
dispatch:
  - url: "*/api/*"
    service: api-service
    
  - url: "*/admin/*"
    service: admin-service
    
  - url: "*/*"
    service: default
```

**3. Health Checks:**
```python
@app.route('/_ah/health')
def health_check():
    """App Engine health check endpoint."""
    return 'ok', 200
```

### Migration from App Engine

**To Cloud Run:**
- More cost-effective for variable traffic
- Better container support
- Faster deployments

**Migration steps:**
```bash
# 1. Containerize application
# 2. Deploy to Cloud Run
gcloud run deploy my-service \
    --source . \
    --region us-central1

# 3. Update DNS/routing
# 4. Decommission App Engine version
```

---

## Google Kubernetes Engine (GKE)

**GKE** is a managed Kubernetes service for deploying, managing, and scaling containerized applications.

### Overview

**What It Is:**
- Fully managed Kubernetes
- GKE Autopilot (fully managed) or Standard (more control)
- Enterprise-grade security and compliance
- Integrated with GCP services

**When to Use:**
- Complex microservices architectures
- Need Kubernetes-specific features (StatefulSets, DaemonSets)
- Multi-cloud portability requirements
- Advanced networking requirements
- Existing Kubernetes expertise

**Autopilot vs. Standard:**

| Feature | Autopilot | Standard |
|---------|-----------|----------|
| Node Management | Fully managed | You manage |
| Pod Security | Enforced | Configurable |
| Pricing | Pay per pod | Pay per node |
| Control | Less | More |
| Best For | Teams wanting simplicity | Advanced use cases |

### GKE Autopilot (Recommended)

**Create Cluster:**
```bash
gcloud container clusters create-auto my-cluster \
    --region us-central1 \
    --release-channel regular \
    --enable-autotuning \
    --workload-pool=PROJECT_ID.svc.id.goog
```

**Deploy Application:**
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      serviceAccountName: web-app-ksa
      containers:
      - name: web-app
        image: gcr.io/PROJECT_ID/web-app:v1
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 3
---
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  type: LoadBalancer
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 8080
```

**Deploy:**
```bash
# Get credentials
gcloud container clusters get-credentials my-cluster \
    --region us-central1

# Deploy
kubectl apply -f deployment.yaml

# Check status
kubectl get pods
kubectl get services
```

### Workload Identity (Keyless Authentication)

**Enable Workload Identity:**
```bash
# Already enabled in Autopilot

# For Standard clusters:
gcloud container clusters update my-cluster \
    --workload-pool=PROJECT_ID.svc.id.goog
```

**Configure:**
```bash
# Create Kubernetes Service Account
kubectl create serviceaccount web-app-ksa

# Create GCP Service Account
gcloud iam service-accounts create web-app-gsa \
    --display-name="Web App Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:web-app-gsa@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# Bind Kubernetes SA to GCP SA
gcloud iam service-accounts add-iam-policy-binding \
    web-app-gsa@PROJECT_ID.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:PROJECT_ID.svc.id.goog[default/web-app-ksa]"

# Annotate Kubernetes SA
kubectl annotate serviceaccount web-app-ksa \
    iam.gke.io/gcp-service-account=web-app-gsa@PROJECT_ID.iam.gserviceaccount.com
```

### GKE Best Practices

**1. Use Horizontal Pod Autoscaler:**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

**2. Use ConfigMaps and Secrets:**
```bash
# Create secret from Secret Manager
kubectl create secret generic db-credentials \
    --from-literal=url='postgres://...'

# Or use External Secrets Operator
```

**3. Network Policies:**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: web-app-network-policy
spec:
  podSelector:
    matchLabels:
      app: web-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

**4. Pod Security Standards:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

---

## Compute Engine

**Compute Engine** provides virtual machines running on Google's infrastructure.

### Overview

**What It Is:**
- Infrastructure-as-a-Service (IaaS)
- Full control over VMs
- Sustained use discounts (automatic)
- Preemptible/Spot VMs for cost savings

**When to Use:**
- Legacy applications requiring specific OS configurations
- Windows applications
- GPU/TPU workloads
- High-performance computing
- Custom networking requirements
- Applications not containerizable

### Create VM Instance

**Via gcloud:**
```bash
# Create basic VM
gcloud compute instances create my-vm \
    --zone us-central1-a \
    --machine-type e2-medium \
    --boot-disk-size 20GB \
    --boot-disk-type pd-standard \
    --image-family ubuntu-2204-lts \
    --image-project ubuntu-os-cloud \
    --tags http-server,https-server

# Create Spot VM (up to 91% discount)
gcloud compute instances create spot-vm \
    --zone us-central1-a \
    --machine-type e2-medium \
    --provisioning-model SPOT \
    --instance-termination-action DELETE

# Create VM with startup script
gcloud compute instances create web-server \
    --zone us-central1-a \
    --machine-type e2-medium \
    --metadata-from-file startup-script=startup.sh \
    --tags http-server
```

**Startup Script (startup.sh):**
```bash
#!/bin/bash

# Update system
apt-get update
apt-get install -y docker.io nginx

# Pull and run container
docker pull gcr.io/PROJECT_ID/my-app
docker run -d -p 8080:8080 gcr.io/PROJECT_ID/my-app

# Configure nginx reverse proxy
cat > /etc/nginx/sites-available/default << EOF
server {
    listen 80;
    location / {
        proxy_pass http://localhost:8080;
    }
}
EOF

systemctl restart nginx
```

### Instance Templates and Managed Instance Groups

**Create Instance Template:**
```bash
gcloud compute instance-templates create web-template \
    --machine-type e2-medium \
    --boot-disk-size 20GB \
    --image-family ubuntu-2204-lts \
    --image-project ubuntu-os-cloud \
    --tags http-server \
    --metadata-from-file startup-script=startup.sh \
    --service-account web-sa@PROJECT_ID.iam.gserviceaccount.com \
    --scopes cloud-platform
```

**Create Managed Instance Group:**
```bash
# Create autoscaling instance group
gcloud compute instance-groups managed create web-mig \
    --base-instance-name web \
    --template web-template \
    --size 2 \
    --zone us-central1-a

# Configure autoscaling
gcloud compute instance-groups managed set-autoscaling web-mig \
    --zone us-central1-a \
    --min-num-replicas 2 \
    --max-num-replicas 10 \
    --target-cpu-utilization 0.6 \
    --cool-down-period 60
```

### Load Balancing

**HTTP(S) Load Balancer:**
```bash
# Create health check
gcloud compute health-checks create http web-health-check \
    --port 80 \
    --request-path /health

# Create backend service
gcloud compute backend-services create web-backend \
    --protocol HTTP \
    --health-checks web-health-check \
    --global

# Add instance group to backend
gcloud compute backend-services add-backend web-backend \
    --instance-group web-mig \
    --instance-group-zone us-central1-a \
    --global

# Create URL map
gcloud compute url-maps create web-map \
    --default-service web-backend

# Create target HTTP proxy
gcloud compute target-http-proxies create web-proxy \
    --url-map web-map

# Create forwarding rule
gcloud compute forwarding-rules create web-forwarding-rule \
    --target-http-proxy web-proxy \
    --ports 80 \
    --global
```

### Best Practices

**1. Use Managed Instance Groups:**
- Automatic scaling
- Self-healing (auto-replace failed instances)
- Rolling updates

**2. Use Sustained Use Discounts:**
- Automatic discounts for sustained usage
- Up to 30% discount

**3. Use Committed Use Discounts:**
- 1-year or 3-year commitments
- Up to 57% discount

**4. Use Service Accounts:**
```bash
# Create service account
gcloud iam service-accounts create web-server-sa

# Grant permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member "serviceAccount:web-server-sa@PROJECT_ID.iam.gserviceaccount.com" \
    --role "roles/storage.objectViewer"

# Attach to VM
gcloud compute instances create my-vm \
    --service-account web-server-sa@PROJECT_ID.iam.gserviceaccount.com \
    --scopes cloud-platform
```

---

## Artifact Registry

**Artifact Registry** is a fully managed repository for container images and language packages.

### Overview

**What It Is:**
- Successor to Container Registry (gcr.io)
- Multi-format support (Docker, Maven, npm, Python, etc.)
- Regional and multi-regional repositories
- Integrated vulnerability scanning
- IAM-based access control

**Formats Supported:**
- Docker/OCI containers
- Maven (Java)
- npm (Node.js)
- Python (PyPI)
- Apt (Debian)
- Yum (RPM)
- Go modules

### Setup

**Enable API:**
```bash
gcloud services enable artifactregistry.googleapis.com
```

**Create Repository:**
```bash
# Docker repository
gcloud artifacts repositories create docker-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker container images"

# Python repository
gcloud artifacts repositories create python-repo \
    --repository-format=python \
    --location=us-central1 \
    --description="Python packages"

# npm repository
gcloud artifacts repositories create npm-repo \
    --repository-format=npm \
    --location=us-central1 \
    --description="Node.js packages"
```

### Docker Usage

**Configure Docker:**
```bash
# Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev
```

**Build and Push:**
```bash
# Build image
docker build -t us-central1-docker.pkg.dev/PROJECT_ID/docker-repo/my-app:v1 .

# Push image
docker push us-central1-docker.pkg.dev/PROJECT_ID/docker-repo/my-app:v1

# Pull image
docker pull us-central1-docker.pkg.dev/PROJECT_ID/docker-repo/my-app:v1
```

### Python Package Repository

**Configure pip:**
```bash
# Add to ~/.pip/pip.conf
[global]
extra-index-url = https://us-central1-python.pkg.dev/PROJECT_ID/python-repo/simple/
```

**Upload Package:**
```bash
# Install twine
pip install twine keyrings.google-artifactregistry-auth

# Build package
python setup.py sdist bdist_wheel

# Upload
twine upload --repository-url https://us-central1-python.pkg.dev/PROJECT_ID/python-repo/ dist/*
```

### npm Package Repository

**Configure npm:**
```bash
# Add to .npmrc
@mycompany:registry=https://us-central1-npm.pkg.dev/PROJECT_ID/npm-repo/
//us-central1-npm.pkg.dev/PROJECT_ID/npm-repo/:always-auth=true
```

**Publish Package:**
```bash
# Authenticate
npx google-artifactregistry-auth

# Publish
npm publish
```

### IAM and Access Control

```bash
# Grant read access
gcloud artifacts repositories add-iam-policy-binding docker-repo \
    --location us-central1 \
    --member "serviceAccount:cloud-run@PROJECT_ID.iam.gserviceaccount.com" \
    --role "roles/artifactregistry.reader"

# Grant write access
gcloud artifacts repositories add-iam-policy-binding docker-repo \
    --location us-central1 \
    --member "serviceAccount:cloud-build@PROJECT_ID.iam.gserviceaccount.com" \
    --role "roles/artifactregistry.writer"
```

### Vulnerability Scanning

**Enable Scanning:**
```bash
# Scanning is automatic for images pushed to Artifact Registry

# View vulnerabilities
gcloud artifacts docker images list us-central1-docker.pkg.dev/PROJECT_ID/docker-repo \
    --show-occurrences

# Get detailed scan results
gcloud artifacts docker images describe \
    us-central1-docker.pkg.dev/PROJECT_ID/docker-repo/my-app:v1 \
    --show-all-metadata
```

---

## Cloud Build

**Cloud Build** is a serverless CI/CD platform for building, testing, and deploying applications.

### Overview

**What It Is:**
- Fully managed CI/CD service
- Builds containers from source
- Deploy to multiple targets (Cloud Run, GKE, App Engine)
- Integrates with GitHub, Bitbucket, GitLab

**Pricing:**
- Free tier: 120 build-minutes/day
- $0.003/build-minute after free tier

### Build Configuration

**cloudbuild.yaml:**
```yaml
steps:
  # Build container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/docker-repo/my-app:$COMMIT_SHA', '.']
  
  # Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/docker-repo/my-app:$COMMIT_SHA']
  
  # Run tests
  - name: 'us-central1-docker.pkg.dev/$PROJECT_ID/docker-repo/my-app:$COMMIT_SHA'
    entrypoint: 'pytest'
    args: ['tests/']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'my-service'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/docker-repo/my-app:$COMMIT_SHA'
      - '--region=us-central1'
      - '--platform=managed'

images:
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/docker-repo/my-app:$COMMIT_SHA'

options:
  logging: CLOUD_LOGGING_ONLY
  machineType: 'E2_HIGHCPU_8'
```

**Trigger Build:**
```bash
# Manual build
gcloud builds submit --config=cloudbuild.yaml .

# Create trigger from GitHub
gcloud builds triggers create github \
    --name=main-branch-trigger \
    --repo-name=my-repo \
    --repo-owner=my-org \
    --branch-pattern=^main$ \
    --build-config=cloudbuild.yaml
```

### Multi-Stage Builds

**Production Build:**
```yaml
# cloudbuild.yaml
steps:
  # Run tests
  - name: 'python:3.11-slim'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        pip install pytest
        pytest tests/
  
  # Build production image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-f', 'Dockerfile.prod', '-t', '$_IMAGE_NAME:$COMMIT_SHA', '.']
  
  # Security scan
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['container', 'images', 'scan', '$_IMAGE_NAME:$COMMIT_SHA']
  
  # Deploy
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'gcloud'
    args: ['run', 'deploy', '$_SERVICE_NAME', '--image=$_IMAGE_NAME:$COMMIT_SHA', '--region=$_REGION']

substitutions:
  _IMAGE_NAME: 'us-central1-docker.pkg.dev/${PROJECT_ID}/docker-repo/my-app'
  _SERVICE_NAME: 'my-service'
  _REGION: 'us-central1'

timeout: 1200s
```

### Best Practices

**1. Use Substitutions:**
```yaml
substitutions:
  _ENV: 'production'
  _REGION: 'us-central1'
```

**2. Cache Dependencies:**
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '--cache-from', 'us-central1-docker.pkg.dev/$PROJECT_ID/docker-repo/my-app:latest', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/docker-repo/my-app:$COMMIT_SHA', '.']
```

**3. Parallel Steps:**
```yaml
steps:
  # Run tests in parallel
  - name: 'python:3.11'
    id: 'unit-tests'
    entrypoint: 'pytest'
    args: ['tests/unit']
    waitFor: ['-']
  
  - name: 'python:3.11'
    id: 'integration-tests'
    entrypoint: 'pytest'
    args: ['tests/integration']
    waitFor: ['-']
  
  # Deploy after tests complete
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    id: 'deploy'
    waitFor: ['unit-tests', 'integration-tests']
    entrypoint: 'gcloud'
    args: ['run', 'deploy', '...']
```

---

## Deployment Decision Matrix

Choose the right deployment platform based on your requirements:

### Decision Tree

```
Start
  ↓
  Do you need Kubernetes features (StatefulSets, DaemonSets)?
  ├─ Yes → GKE
  └─ No
      ↓
      Is it a single-purpose function or webhook?
      ├─ Yes → Cloud Functions
      └─ No
          ↓
          Is it a containerized application?
          ├─ Yes → Cloud Run
          └─ No
              ↓
              Need managed platform with zero config?
              ├─ Yes → App Engine
              └─ No → Compute Engine
```

### Feature Comparison

| Feature | Cloud Run | Cloud Functions | App Engine | GKE | Compute Engine |
|---------|-----------|-----------------|------------|-----|----------------|
| **Pricing Model** | Pay-per-use | Pay-per-invocation | Pay-per-use | Pay-per-node | Pay-per-VM |
| **Scale to Zero** | Yes | Yes | Yes (Standard) | No | No |
| **Cold Start** | ~1s | ~1s | <1s (Standard) | N/A | N/A |
| **Max Timeout** | 60 min | 60 min | 24 hrs (Flex) | Unlimited | Unlimited |
| **Concurrency** | Up to 1000 | Up to 1000 | Varies | Configurable | Configurable |
| **Custom Runtime** | Any container | Limited | Custom (Flex) | Any container | Any software |
| **Traffic Splitting** | Yes | Yes | Yes | Manual | Manual |
| **Min Instances** | 0+ | 0+ | 0+ (Standard) | 1+ | 1+ |
| **Complexity** | Low | Very Low | Low-Medium | High | Medium |
| **Portability** | High (Knative) | Low | Low | High (K8s) | Low |

### Use Case Recommendations

**Cloud Run - Best For:**
- ✅ REST APIs and microservices
- ✅ Web applications with variable traffic
- ✅ Event-driven containers (via Eventarc)
- ✅ Batch processing jobs
- ✅ WebSockets and streaming
- ❌ Stateful applications
- ❌ Applications requiring persistent local storage

**Cloud Functions - Best For:**
- ✅ Simple HTTP endpoints
- ✅ Event processing (Pub/Sub, Storage, Firestore)
- ✅ Webhooks
- ✅ Scheduled tasks (cron jobs)
- ✅ Small, single-purpose functions
- ❌ Complex applications
- ❌ Long-running processes

**App Engine - Best For:**
- ✅ Traditional web applications
- ✅ Applications needing integrated cron/task queues
- ✅ Heroku migrations
- ✅ Minimal configuration requirements
- ❌ Modern cloud-native apps (use Cloud Run instead)

**GKE - Best For:**
- ✅ Complex microservices architectures
- ✅ StatefulSets (databases, caches)
- ✅ Multi-cloud portability
- ✅ Advanced networking requirements
- ✅ Existing Kubernetes expertise
- ❌ Simple applications (overhead not justified)

**Compute Engine - Best For:**
- ✅ Legacy applications
- ✅ Windows applications
- ✅ GPU/TPU workloads
- ✅ Custom OS requirements
- ✅ High-performance computing
- ❌ Cloud-native applications

---

## Migration Strategies

### From App Engine to Cloud Run

**Benefits:**
- Lower costs (scale to zero)
- Faster deployments
- Better container support
- More flexible

**Migration Steps:**
1. Containerize application
2. Deploy to Cloud Run alongside App Engine
3. Test thoroughly
4. Shift traffic gradually
5. Decommission App Engine

**Example Migration:**
```bash
# Step 1: Create Dockerfile
cat > Dockerfile << EOF
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD exec gunicorn --bind :\$PORT main:app
EOF

# Step 2: Deploy to Cloud Run
gcloud run deploy my-service \
    --source . \
    --region us-central1 \
    --no-allow-unauthenticated

# Step 3: Test
curl https://my-service-xyz-uc.a.run.app

# Step 4: Update DNS
# Point custom domain to Cloud Run

# Step 5: Stop App Engine versions
gcloud app versions stop VERSION_ID
```

### From VMs to Containers

**Benefits:**
- Faster deployments
- Better resource utilization
- Easier scaling
- Improved consistency

**Migration Steps:**
1. Package application as container
2. Test locally
3. Deploy to Cloud Run or GKE
4. Migrate data/state
5. Decommission VMs

---

## Next Steps

1. **Review Security Guardrails:** Read `gcp-security-guardrails.md` for production security.

2. **Explore Examples:** Check `examples/` for working code samples.

3. **Set Up CI/CD:** Implement Cloud Build pipelines.

4. **Monitor and Optimize:** Set up logging, monitoring, and cost tracking.

---

## Additional Resources

**Official Documentation:**
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Cloud Functions Docs](https://cloud.google.com/functions/docs)
- [GKE Docs](https://cloud.google.com/kubernetes-engine/docs)
- [Compute Engine Docs](https://cloud.google.com/compute/docs)

**Choosing a Platform:**
- [Choosing a Compute Option](https://cloud.google.com/blog/topics/developers-practitioners/where-should-i-run-my-stuff-choosing-google-cloud-compute-option)
- [Serverless Options](https://cloud.google.com/serverless-options)

---

*Last Updated: 2024*
*Maintained by: Grand Budapest Terminal Team*
