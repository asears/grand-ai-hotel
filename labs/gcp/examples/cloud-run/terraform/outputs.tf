output "service_url" {
  description = "Cloud Run service URL"
  value       = google_cloud_run_v2_service.fastapi.uri
}

output "service_name" {
  description = "Service name"
  value       = google_cloud_run_v2_service.fastapi.name
}

output "service_account_email" {
  description = "Service account email"
  value       = google_service_account.cloud_run.email
}
