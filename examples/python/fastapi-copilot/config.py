"""
Application configuration with Azure Key Vault integration.

Demonstrates modern configuration management using Pydantic settings
and Azure Key Vault with DefaultAzureCredential.
"""

from functools import lru_cache

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from loguru import logger
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings with Azure Key Vault integration.
    
    Loads configuration from environment variables and optionally
    from Azure Key Vault for secrets.
    
    Attributes:
        app_name: Application name
        version: Application version
        environment: Deployment environment (development, staging, production)
        azure_keyvault_url: Azure Key Vault URL (optional)
        copilot_api_key: GitHub Copilot API key
        log_level: Logging level
        
    Example:
        >>> settings = Settings()
        >>> settings.environment
        'development'
    """
    
    app_name: str = Field(default="fastapi-copilot")
    version: str = Field(default="1.0.0")
    environment: str = Field(default="development")
    
    # Azure Key Vault settings
    azure_keyvault_url: str | None = Field(
        default=None,
        description="Azure Key Vault URL",
    )
    
    # API keys (can be loaded from Key Vault)
    copilot_api_key: str | None = Field(
        default=None,
        description="GitHub Copilot API key",
    )
    
    # Logging
    log_level: str = Field(default="INFO")
    
    # Database (example)
    database_url: str = Field(
        default="sqlite:///./app.db",
        description="Database connection URL",
    )
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )
    
    def load_secrets_from_keyvault(self) -> None:
        """
        Load secrets from Azure Key Vault using DefaultAzureCredential.
        
        DefaultAzureCredential tries multiple authentication methods:
        1. Environment variables (AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_CLIENT_SECRET)
        2. Managed Identity (for Azure-hosted apps)
        3. Azure CLI (for local development)
        4. Azure PowerShell
        5. Interactive browser (fallback)
        
        Example:
            >>> settings = Settings(azure_keyvault_url="https://myvault.vault.azure.net")
            >>> settings.load_secrets_from_keyvault()
        """
        if not self.azure_keyvault_url:
            logger.warning("Azure Key Vault URL not configured, skipping secret loading")
            return
        
        try:
            logger.info(f"Loading secrets from Key Vault: {self.azure_keyvault_url}")
            
            # DefaultAzureCredential automatically tries multiple auth methods
            credential = DefaultAzureCredential()
            client = SecretClient(
                vault_url=self.azure_keyvault_url,
                credential=credential,
            )
            
            # Load Copilot API key from Key Vault
            try:
                secret = client.get_secret("copilot-api-key")
                self.copilot_api_key = secret.value
                logger.info("Successfully loaded copilot-api-key from Key Vault")
            except Exception as e:
                logger.warning(f"Could not load copilot-api-key: {e}")
            
            # Load database URL from Key Vault (example)
            try:
                secret = client.get_secret("database-url")
                self.database_url = secret.value
                logger.info("Successfully loaded database-url from Key Vault")
            except Exception as e:
                logger.warning(f"Could not load database-url: {e}")
            
            credential.close()
            
        except Exception as e:
            logger.error(f"Failed to load secrets from Key Vault: {e}")
            raise


def configure_logging(settings: Settings) -> None:
    """
    Configure structured logging with loguru.
    
    Args:
        settings: Application settings
        
    Example:
        >>> settings = Settings(log_level="DEBUG")
        >>> configure_logging(settings)
    """
    logger.remove()  # Remove default handler
    
    # Add console handler with custom format
    logger.add(
        sink=lambda msg: print(msg, end=""),
        format=(
            "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
            "<level>{message}</level>"
        ),
        level=settings.log_level,
        colorize=True,
    )
    
    # Add file handler for production
    if settings.environment == "production":
        logger.add(
            "logs/app_{time:YYYY-MM-DD}.log",
            rotation="1 day",
            retention="30 days",
            level=settings.log_level,
            format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} | {message}",
        )


@lru_cache
def get_settings() -> Settings:
    """
    Get cached application settings.
    
    Returns:
        Singleton Settings instance
        
    Example:
        >>> settings = get_settings()
        >>> settings.app_name
        'fastapi-copilot'
    """
    settings = Settings()
    configure_logging(settings)
    
    # Load secrets from Key Vault if configured
    if settings.azure_keyvault_url:
        try:
            settings.load_secrets_from_keyvault()
        except Exception as e:
            logger.error(f"Failed to initialize Key Vault: {e}")
    
    return settings
