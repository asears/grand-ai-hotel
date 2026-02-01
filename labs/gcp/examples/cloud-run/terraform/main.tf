# Terraform Configuration for Cloud Run FastAPI

terraform {
  required_version = ">= 1.5"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
  ])
  
  service = each.key
  disable_on_destroy = false
}

# Create Artifact Registry repository
resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "cloud-run-repo"
  description   = "Docker repository for Cloud Run"
  format        = "DOCKER"
  
  depends_on = [google_project_service.required_apis]
}

# Create secrets
resource "google_secret_manager_secret" "database_url" {
  secret_id = "database-url"
  replication { auto {} }
  depends_on = [google_project_service.required_apis]
}

resource "google_secret_manager_secret_version" "database_url" {
  secret      = google_secret_manager_secret.database_url.id
  secret_data = var.database_url
}

resource "google_secret_manager_secret" "api_key" {
  secret_id = "api-key"
  replication { auto {} }
  depends_on = [google_project_service.required_apis]
}

resource "google_secret_manager_secret_version" "api_key" {
  secret      = google_secret_manager_secret.api_key.id
  secret_data = var.api_key
}

# Service account
resource "google_service_account" "cloud_run" {
  account_id   = "cloud-run-fastapi"
  display_name = "Cloud Run FastAPI Service Account"
}

# Grant secret access
resource "google_secret_manager_secret_iam_member" "database_url_access" {
  secret_id = google_secret_manager_secret.database_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_secret_manager_secret_iam_member" "api_key_access" {
  secret_id = google_secret_manager_secret.api_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run.email}"
}

# Deploy Cloud Run service
resource "google_cloud_run_v2_service" "fastapi" {
  name     = var.service_name
  location = var.region
  
  template {
    service_account = google_service_account.cloud_run.email
    
    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }
    
    containers {
      image = var.container_image
      
      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
      }
      
      env {
        name  = "ENVIRONMENT"
        value = var.environment
      }
      
      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.database_url.secret_id
            version = "latest"
          }
        }
      }
      
      env {
        name = "API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.api_key.secret_id
            version = "latest"
          }
        }
      }
    }
  }
  
  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
  
  depends_on = [
    google_project_service.required_apis,
    google_secret_manager_secret_version.database_url,
    google_secret_manager_secret_version.api_key,
  ]
}

# Public access (optional)
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  count    = var.allow_unauthenticated ? 1 : 0
  location = google_cloud_run_v2_service.fastapi.location
  name     = google_cloud_run_v2_service.fastapi.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
