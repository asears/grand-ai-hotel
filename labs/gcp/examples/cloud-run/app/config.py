"""Configuration management using Pydantic settings."""

import os
from typing import List
from pydantic_settings import BaseSettings
from google.cloud import secretmanager


class Settings(BaseSettings):
    """Application settings."""
    
    # Environment
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Server
    port: int = int(os.getenv("PORT", "8080"))
    host: str = "0.0.0.0"
    
    # CORS
    cors_origins: List[str] = ["*"]
    
    # GCP
    project_id: str = os.getenv("GCP_PROJECT", os.getenv("GOOGLE_CLOUD_PROJECT", ""))
    
    # Secrets (loaded from Secret Manager or environment)
    database_url: str = ""
    api_key: str = ""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._load_secrets()
    
    def _load_secrets(self):
        """Load secrets from Secret Manager or environment variables."""
        # Try environment variables first (for local development)
        self.database_url = os.getenv("DATABASE_URL", "")
        self.api_key = os.getenv("API_KEY", "")
        
        # If running in GCP and secrets not in env, load from Secret Manager
        if self.project_id and not self.database_url:
            self.database_url = self._get_secret("database-url")
        if self.project_id and not self.api_key:
            self.api_key = self._get_secret("api-key")
    
    def _get_secret(self, secret_id: str, version: str = "latest") -> str:
        """Retrieve secret from Secret Manager."""
        try:
            client = secretmanager.SecretManagerServiceClient()
            name = f"projects/{self.project_id}/secrets/{secret_id}/versions/{version}"
            response = client.access_secret_version(request={"name": name})
            return response.payload.data.decode("UTF-8")
        except Exception as e:
            print(f"Warning: Could not load secret {secret_id}: {e}")
            return ""


# Global settings instance
settings = Settings()
