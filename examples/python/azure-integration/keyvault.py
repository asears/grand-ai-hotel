"""
Azure Key Vault integration using DefaultAzureCredential.

Demonstrates secure secret retrieval from Azure Key Vault with
automatic authentication.

Example:
    >>> from keyvault import KeyVaultClient
    >>> client = KeyVaultClient("https://myvault.vault.azure.net")
    >>> secret = client.get_secret("database-password")
"""

from typing import Any

from azure.core.exceptions import ResourceNotFoundError
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import KeyVaultSecret, SecretClient, SecretProperties
from loguru import logger


class KeyVaultClient:
    """
    Azure Key Vault client with DefaultAzureCredential.
    
    Provides type-safe methods for interacting with Azure Key Vault secrets.
    
    Attributes:
        vault_url: Key Vault URL (https://<vault-name>.vault.azure.net)
        client: Azure SecretClient instance
        
    Example:
        >>> vault_url = "https://myvault.vault.azure.net"
        >>> kv = KeyVaultClient(vault_url)
        >>> secret_value = kv.get_secret("api-key")
    """
    
    def __init__(self, vault_url: str) -> None:
        """
        Initialize Key Vault client.
        
        Args:
            vault_url: Key Vault URL
            
        Example:
            >>> kv = KeyVaultClient("https://myvault.vault.azure.net")
        """
        self.vault_url = vault_url
        logger.info(f"Initializing Key Vault client: {vault_url}")
        
        # DefaultAzureCredential tries multiple auth methods automatically
        credential = DefaultAzureCredential()
        self.client = SecretClient(vault_url=vault_url, credential=credential)
        
        logger.info("Key Vault client initialized successfully")
    
    def get_secret(self, secret_name: str) -> str:
        """
        Get secret value from Key Vault.
        
        Args:
            secret_name: Name of the secret
            
        Returns:
            Secret value as string
            
        Raises:
            ResourceNotFoundError: If secret doesn't exist
            
        Example:
            >>> kv = KeyVaultClient("https://myvault.vault.azure.net")
            >>> db_password = kv.get_secret("database-password")
            >>> print(db_password)
        """
        logger.info(f"Retrieving secret: {secret_name}")
        
        try:
            secret = self.client.get_secret(secret_name)
            logger.info(f"✓ Successfully retrieved secret: {secret_name}")
            return secret.value
        except ResourceNotFoundError:
            logger.error(f"Secret not found: {secret_name}")
            raise
        except Exception as e:
            logger.error(f"Failed to retrieve secret {secret_name}: {e}")
            raise
    
    def get_secret_with_metadata(self, secret_name: str) -> KeyVaultSecret:
        """
        Get secret with full metadata.
        
        Args:
            secret_name: Name of the secret
            
        Returns:
            KeyVaultSecret object with value and metadata
            
        Example:
            >>> kv = KeyVaultClient("https://myvault.vault.azure.net")
            >>> secret = kv.get_secret_with_metadata("api-key")
            >>> print(f"Value: {secret.value}")
            >>> print(f"Created: {secret.properties.created_on}")
            >>> print(f"Enabled: {secret.properties.enabled}")
        """
        logger.info(f"Retrieving secret with metadata: {secret_name}")
        
        try:
            secret = self.client.get_secret(secret_name)
            logger.info(f"✓ Retrieved secret: {secret_name}")
            logger.debug(f"  Created: {secret.properties.created_on}")
            logger.debug(f"  Updated: {secret.properties.updated_on}")
            logger.debug(f"  Enabled: {secret.properties.enabled}")
            return secret
        except Exception as e:
            logger.error(f"Failed to retrieve secret {secret_name}: {e}")
            raise
    
    def set_secret(self, secret_name: str, value: str) -> KeyVaultSecret:
        """
        Set or update a secret in Key Vault.
        
        Args:
            secret_name: Name of the secret
            value: Secret value
            
        Returns:
            Created/updated KeyVaultSecret
            
        Example:
            >>> kv = KeyVaultClient("https://myvault.vault.azure.net")
            >>> kv.set_secret("new-api-key", "secret-value-123")
        """
        logger.info(f"Setting secret: {secret_name}")
        
        try:
            secret = self.client.set_secret(secret_name, value)
            logger.info(f"✓ Successfully set secret: {secret_name}")
            return secret
        except Exception as e:
            logger.error(f"Failed to set secret {secret_name}: {e}")
            raise
    
    def delete_secret(self, secret_name: str) -> None:
        """
        Delete a secret from Key Vault.
        
        Note: Deleted secrets can be recovered within retention period.
        
        Args:
            secret_name: Name of the secret to delete
            
        Example:
            >>> kv = KeyVaultClient("https://myvault.vault.azure.net")
            >>> kv.delete_secret("old-api-key")
        """
        logger.info(f"Deleting secret: {secret_name}")
        
        try:
            poller = self.client.begin_delete_secret(secret_name)
            deleted_secret = poller.result()
            logger.info(f"✓ Successfully deleted secret: {secret_name}")
            logger.info(f"  Deletion date: {deleted_secret.deleted_date}")
            logger.info(f"  Recovery id: {deleted_secret.recovery_id}")
        except Exception as e:
            logger.error(f"Failed to delete secret {secret_name}: {e}")
            raise
    
    def list_secrets(self) -> list[str]:
        """
        List all secret names in the vault.
        
        Returns:
            List of secret names
            
        Example:
            >>> kv = KeyVaultClient("https://myvault.vault.azure.net")
            >>> secrets = kv.list_secrets()
            >>> for name in secrets:
            ...     print(name)
        """
        logger.info("Listing all secrets")
        
        try:
            secret_properties = self.client.list_properties_of_secrets()
            secret_names = [prop.name for prop in secret_properties]
            logger.info(f"✓ Found {len(secret_names)} secrets")
            return secret_names
        except Exception as e:
            logger.error(f"Failed to list secrets: {e}")
            raise
    
    def get_multiple_secrets(
        self,
        secret_names: list[str],
    ) -> dict[str, str]:
        """
        Get multiple secrets efficiently.
        
        Args:
            secret_names: List of secret names to retrieve
            
        Returns:
            Dictionary mapping secret names to values
            
        Example:
            >>> kv = KeyVaultClient("https://myvault.vault.azure.net")
            >>> secrets = kv.get_multiple_secrets([
            ...     "database-password",
            ...     "api-key",
            ...     "storage-key"
            ... ])
            >>> print(secrets["database-password"])
        """
        logger.info(f"Retrieving {len(secret_names)} secrets")
        
        secrets: dict[str, str] = {}
        
        for secret_name in secret_names:
            try:
                value = self.get_secret(secret_name)
                secrets[secret_name] = value
            except ResourceNotFoundError:
                logger.warning(f"Secret not found: {secret_name}")
            except Exception as e:
                logger.error(f"Error retrieving {secret_name}: {e}")
        
        logger.info(f"✓ Retrieved {len(secrets)}/{len(secret_names)} secrets")
        return secrets
    
    def secret_exists(self, secret_name: str) -> bool:
        """
        Check if a secret exists in the vault.
        
        Args:
            secret_name: Name of the secret
            
        Returns:
            True if secret exists, False otherwise
            
        Example:
            >>> kv = KeyVaultClient("https://myvault.vault.azure.net")
            >>> if kv.secret_exists("api-key"):
            ...     print("API key is configured")
        """
        try:
            self.client.get_secret(secret_name)
            return True
        except ResourceNotFoundError:
            return False
        except Exception as e:
            logger.error(f"Error checking secret {secret_name}: {e}")
            return False
    
    def update_secret_properties(
        self,
        secret_name: str,
        enabled: bool | None = None,
        content_type: str | None = None,
        tags: dict[str, str] | None = None,
    ) -> SecretProperties:
        """
        Update secret properties without changing the value.
        
        Args:
            secret_name: Name of the secret
            enabled: Enable or disable the secret
            content_type: Content type (e.g., "text/plain", "application/json")
            tags: Key-value tags for the secret
            
        Returns:
            Updated SecretProperties
            
        Example:
            >>> kv = KeyVaultClient("https://myvault.vault.azure.net")
            >>> props = kv.update_secret_properties(
            ...     "api-key",
            ...     enabled=True,
            ...     tags={"environment": "production", "version": "v2"}
            ... )
        """
        logger.info(f"Updating properties for secret: {secret_name}")
        
        try:
            # Get current properties
            secret = self.client.get_secret(secret_name)
            properties = secret.properties
            
            # Update properties
            if enabled is not None:
                properties.enabled = enabled
            if content_type is not None:
                properties.content_type = content_type
            if tags is not None:
                properties.tags = tags
            
            # Update in Key Vault
            updated = self.client.update_secret_properties(
                secret_name,
                enabled=properties.enabled,
                content_type=properties.content_type,
                tags=properties.tags,
            )
            
            logger.info(f"✓ Updated properties for secret: {secret_name}")
            return updated
        except Exception as e:
            logger.error(f"Failed to update secret properties: {e}")
            raise
    
    def close(self) -> None:
        """
        Close the Key Vault client.
        
        Example:
            >>> kv = KeyVaultClient("https://myvault.vault.azure.net")
            >>> try:
            ...     secret = kv.get_secret("api-key")
            ... finally:
            ...     kv.close()
        """
        logger.info("Closing Key Vault client")
        self.client.close()


def main() -> None:
    """
    Example usage of KeyVaultClient.
    
    Note: Requires actual Azure Key Vault and authentication.
    """
    import os
    
    vault_url = os.getenv("AZURE_KEYVAULT_URL")
    
    if not vault_url:
        logger.error(
            "AZURE_KEYVAULT_URL environment variable not set.\n"
            "Example: export AZURE_KEYVAULT_URL=https://myvault.vault.azure.net"
        )
        return
    
    try:
        # Initialize client
        kv = KeyVaultClient(vault_url)
        
        # List all secrets
        logger.info("\n1. Listing all secrets:")
        secret_names = kv.list_secrets()
        for name in secret_names:
            logger.info(f"  - {name}")
        
        # Get a secret (example)
        if secret_names:
            secret_name = secret_names[0]
            logger.info(f"\n2. Getting secret: {secret_name}")
            
            # Get just the value
            value = kv.get_secret(secret_name)
            logger.info(f"  Value: {value[:10]}...")
            
            # Get with metadata
            secret = kv.get_secret_with_metadata(secret_name)
            logger.info(f"  Created: {secret.properties.created_on}")
            logger.info(f"  Enabled: {secret.properties.enabled}")
        
        # Close client
        kv.close()
        
    except Exception as e:
        logger.error(f"Error: {e}")
        logger.info(
            "\nMake sure you have:\n"
            "1. Azure CLI installed and logged in (az login)\n"
            "2. Access to the Key Vault\n"
            "3. Correct AZURE_KEYVAULT_URL"
        )


if __name__ == "__main__":
    from loguru import logger
    
    logger.remove()
    logger.add(
        lambda msg: print(msg, end=""),
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
        colorize=True,
    )
    
    main()
