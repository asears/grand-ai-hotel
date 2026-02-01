"""
Azure Blob Storage operations using DefaultAzureCredential.

Demonstrates uploading, downloading, and managing blobs in Azure Storage
with automatic authentication.

Example:
    >>> from storage import BlobStorageClient
    >>> client = BlobStorageClient("mystorageaccount", "mycontainer")
    >>> client.upload_blob("data.txt", b"Hello, Azure!")
"""

from collections.abc import Iterator
from pathlib import Path

from azure.core.exceptions import ResourceExistsError, ResourceNotFoundError
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobClient, BlobServiceClient, ContainerClient
from loguru import logger


class BlobStorageClient:
    """
    Azure Blob Storage client with DefaultAzureCredential.
    
    Provides type-safe methods for blob operations with automatic authentication.
    
    Attributes:
        account_name: Storage account name
        container_name: Container name
        container_client: Azure ContainerClient instance
        
    Example:
        >>> storage = BlobStorageClient("mystorageaccount", "mycontainer")
        >>> storage.upload_blob("file.txt", b"content")
    """
    
    def __init__(self, account_name: str, container_name: str) -> None:
        """
        Initialize Blob Storage client.
        
        Args:
            account_name: Azure Storage account name
            container_name: Container name
            
        Example:
            >>> storage = BlobStorageClient("mystorageaccount", "data")
        """
        self.account_name = account_name
        self.container_name = container_name
        
        account_url = f"https://{account_name}.blob.core.windows.net"
        logger.info(f"Initializing Blob Storage client: {account_url}")
        
        # DefaultAzureCredential for automatic authentication
        credential = DefaultAzureCredential()
        
        # Create service client
        self.service_client = BlobServiceClient(
            account_url=account_url,
            credential=credential,
        )
        
        # Get container client
        self.container_client = self.service_client.get_container_client(
            container_name
        )
        
        logger.info(f"Blob Storage client initialized: {container_name}")
    
    def create_container_if_not_exists(self) -> None:
        """
        Create container if it doesn't exist.
        
        Example:
            >>> storage = BlobStorageClient("account", "container")
            >>> storage.create_container_if_not_exists()
        """
        logger.info(f"Creating container: {self.container_name}")
        
        try:
            self.container_client.create_container()
            logger.info(f"✓ Container created: {self.container_name}")
        except ResourceExistsError:
            logger.info(f"Container already exists: {self.container_name}")
        except Exception as e:
            logger.error(f"Failed to create container: {e}")
            raise
    
    def upload_blob(
        self,
        blob_name: str,
        data: bytes | str,
        overwrite: bool = False,
    ) -> None:
        """
        Upload data to blob.
        
        Args:
            blob_name: Name of the blob
            data: Data to upload (bytes or string)
            overwrite: Overwrite if blob exists
            
        Example:
            >>> storage = BlobStorageClient("account", "container")
            >>> storage.upload_blob("file.txt", b"Hello, Azure!")
            >>> storage.upload_blob("data.json", '{"key": "value"}')
        """
        logger.info(f"Uploading blob: {blob_name}")
        
        try:
            blob_client = self.container_client.get_blob_client(blob_name)
            blob_client.upload_blob(data, overwrite=overwrite)
            logger.info(f"✓ Successfully uploaded: {blob_name}")
        except ResourceExistsError:
            logger.error(f"Blob already exists: {blob_name}")
            raise
        except Exception as e:
            logger.error(f"Failed to upload blob: {e}")
            raise
    
    def upload_file(
        self,
        blob_name: str,
        file_path: str | Path,
        overwrite: bool = False,
    ) -> None:
        """
        Upload file to blob storage.
        
        Args:
            blob_name: Name of the blob
            file_path: Path to local file
            overwrite: Overwrite if blob exists
            
        Example:
            >>> storage = BlobStorageClient("account", "container")
            >>> storage.upload_file("backup.zip", "/path/to/backup.zip")
        """
        file_path = Path(file_path)
        logger.info(f"Uploading file: {file_path} -> {blob_name}")
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        try:
            with open(file_path, "rb") as f:
                self.upload_blob(blob_name, f.read(), overwrite=overwrite)
            
            logger.info(f"✓ Successfully uploaded file: {blob_name}")
        except Exception as e:
            logger.error(f"Failed to upload file: {e}")
            raise
    
    def download_blob(self, blob_name: str) -> bytes:
        """
        Download blob data.
        
        Args:
            blob_name: Name of the blob
            
        Returns:
            Blob data as bytes
            
        Example:
            >>> storage = BlobStorageClient("account", "container")
            >>> data = storage.download_blob("file.txt")
            >>> print(data.decode())
        """
        logger.info(f"Downloading blob: {blob_name}")
        
        try:
            blob_client = self.container_client.get_blob_client(blob_name)
            data = blob_client.download_blob().readall()
            logger.info(f"✓ Downloaded {len(data)} bytes from {blob_name}")
            return data
        except ResourceNotFoundError:
            logger.error(f"Blob not found: {blob_name}")
            raise
        except Exception as e:
            logger.error(f"Failed to download blob: {e}")
            raise
    
    def download_to_file(
        self,
        blob_name: str,
        file_path: str | Path,
    ) -> None:
        """
        Download blob to local file.
        
        Args:
            blob_name: Name of the blob
            file_path: Destination file path
            
        Example:
            >>> storage = BlobStorageClient("account", "container")
            >>> storage.download_to_file("backup.zip", "/tmp/backup.zip")
        """
        file_path = Path(file_path)
        logger.info(f"Downloading blob to file: {blob_name} -> {file_path}")
        
        try:
            data = self.download_blob(blob_name)
            
            file_path.parent.mkdir(parents=True, exist_ok=True)
            with open(file_path, "wb") as f:
                f.write(data)
            
            logger.info(f"✓ Downloaded to: {file_path}")
        except Exception as e:
            logger.error(f"Failed to download to file: {e}")
            raise
    
    def list_blobs(self, prefix: str | None = None) -> list[str]:
        """
        List all blobs in container.
        
        Args:
            prefix: Optional prefix filter
            
        Returns:
            List of blob names
            
        Example:
            >>> storage = BlobStorageClient("account", "container")
            >>> blobs = storage.list_blobs()
            >>> for name in blobs:
            ...     print(name)
            >>> 
            >>> # List with prefix
            >>> logs = storage.list_blobs(prefix="logs/")
        """
        logger.info(f"Listing blobs (prefix={prefix})")
        
        try:
            blob_list = self.container_client.list_blobs(name_starts_with=prefix)
            blob_names = [blob.name for blob in blob_list]
            logger.info(f"✓ Found {len(blob_names)} blobs")
            return blob_names
        except Exception as e:
            logger.error(f"Failed to list blobs: {e}")
            raise
    
    def delete_blob(self, blob_name: str) -> None:
        """
        Delete a blob.
        
        Args:
            blob_name: Name of the blob to delete
            
        Example:
            >>> storage = BlobStorageClient("account", "container")
            >>> storage.delete_blob("old-file.txt")
        """
        logger.info(f"Deleting blob: {blob_name}")
        
        try:
            blob_client = self.container_client.get_blob_client(blob_name)
            blob_client.delete_blob()
            logger.info(f"✓ Deleted blob: {blob_name}")
        except ResourceNotFoundError:
            logger.warning(f"Blob not found: {blob_name}")
        except Exception as e:
            logger.error(f"Failed to delete blob: {e}")
            raise
    
    def blob_exists(self, blob_name: str) -> bool:
        """
        Check if blob exists.
        
        Args:
            blob_name: Name of the blob
            
        Returns:
            True if blob exists, False otherwise
            
        Example:
            >>> storage = BlobStorageClient("account", "container")
            >>> if storage.blob_exists("file.txt"):
            ...     print("File exists")
        """
        try:
            blob_client = self.container_client.get_blob_client(blob_name)
            blob_client.get_blob_properties()
            return True
        except ResourceNotFoundError:
            return False
        except Exception as e:
            logger.error(f"Error checking blob {blob_name}: {e}")
            return False
    
    def get_blob_properties(self, blob_name: str) -> dict[str, str | int]:
        """
        Get blob properties.
        
        Args:
            blob_name: Name of the blob
            
        Returns:
            Dictionary with blob properties
            
        Example:
            >>> storage = BlobStorageClient("account", "container")
            >>> props = storage.get_blob_properties("file.txt")
            >>> print(f"Size: {props['size']} bytes")
            >>> print(f"Content type: {props['content_type']}")
        """
        logger.info(f"Getting properties for blob: {blob_name}")
        
        try:
            blob_client = self.container_client.get_blob_client(blob_name)
            properties = blob_client.get_blob_properties()
            
            return {
                "name": blob_name,
                "size": properties.size,
                "content_type": properties.content_settings.content_type,
                "last_modified": str(properties.last_modified),
                "etag": properties.etag,
            }
        except Exception as e:
            logger.error(f"Failed to get blob properties: {e}")
            raise
    
    def copy_blob(
        self,
        source_blob: str,
        dest_blob: str,
        source_container: str | None = None,
    ) -> None:
        """
        Copy blob within or across containers.
        
        Args:
            source_blob: Source blob name
            dest_blob: Destination blob name
            source_container: Source container (uses same if None)
            
        Example:
            >>> storage = BlobStorageClient("account", "container")
            >>> storage.copy_blob("original.txt", "copy.txt")
            >>> 
            >>> # Copy from different container
            >>> storage.copy_blob("file.txt", "backup.txt", source_container="other")
        """
        source_container = source_container or self.container_name
        logger.info(f"Copying blob: {source_container}/{source_blob} -> {dest_blob}")
        
        try:
            source_url = (
                f"https://{self.account_name}.blob.core.windows.net/"
                f"{source_container}/{source_blob}"
            )
            
            dest_client = self.container_client.get_blob_client(dest_blob)
            dest_client.start_copy_from_url(source_url)
            
            logger.info(f"✓ Copied blob: {source_blob} -> {dest_blob}")
        except Exception as e:
            logger.error(f"Failed to copy blob: {e}")
            raise
    
    def close(self) -> None:
        """
        Close the storage client.
        
        Example:
            >>> storage = BlobStorageClient("account", "container")
            >>> try:
            ...     storage.upload_blob("file.txt", b"data")
            ... finally:
            ...     storage.close()
        """
        logger.info("Closing Blob Storage client")
        self.service_client.close()


def main() -> None:
    """
    Example usage of BlobStorageClient.
    
    Note: Requires actual Azure Storage account and authentication.
    """
    import os
    
    account_name = os.getenv("AZURE_STORAGE_ACCOUNT")
    container_name = os.getenv("AZURE_STORAGE_CONTAINER", "demo-container")
    
    if not account_name:
        logger.error(
            "AZURE_STORAGE_ACCOUNT environment variable not set.\n"
            "Example: export AZURE_STORAGE_ACCOUNT=mystorageaccount"
        )
        return
    
    try:
        # Initialize client
        storage = BlobStorageClient(account_name, container_name)
        
        # Create container
        logger.info("\n1. Creating container:")
        storage.create_container_if_not_exists()
        
        # Upload blob
        logger.info("\n2. Uploading blob:")
        storage.upload_blob("demo.txt", b"Hello from Azure Storage!", overwrite=True)
        
        # List blobs
        logger.info("\n3. Listing blobs:")
        blobs = storage.list_blobs()
        for blob in blobs:
            logger.info(f"  - {blob}")
        
        # Download blob
        logger.info("\n4. Downloading blob:")
        data = storage.download_blob("demo.txt")
        logger.info(f"  Content: {data.decode()}")
        
        # Get properties
        logger.info("\n5. Getting blob properties:")
        props = storage.get_blob_properties("demo.txt")
        for key, value in props.items():
            logger.info(f"  {key}: {value}")
        
        # Close client
        storage.close()
        
    except Exception as e:
        logger.error(f"Error: {e}")
        logger.info(
            "\nMake sure you have:\n"
            "1. Azure CLI installed and logged in (az login)\n"
            "2. Access to the storage account\n"
            "3. Correct AZURE_STORAGE_ACCOUNT"
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
