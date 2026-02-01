"""
Pytest tests for Azure integration modules.

Tests Azure authentication, Key Vault, and Blob Storage with mocks.
"""

from unittest.mock import MagicMock, patch

import pytest
from azure.core.exceptions import ResourceNotFoundError
from azure.identity import DefaultAzureCredential

from credentials import AzureAuthDemo
from keyvault import KeyVaultClient
from storage import BlobStorageClient


class TestAzureAuthDemo:
    """Tests for Azure authentication demonstration."""
    
    def test_get_default_credential_returns_credential(self) -> None:
        """
        Given: An AzureAuthDemo instance
        When: Getting default credential
        Then: Returns DefaultAzureCredential instance
        """
        # Given
        demo = AzureAuthDemo()
        
        # When
        credential = demo.get_default_credential()
        
        # Then
        assert isinstance(credential, DefaultAzureCredential)
    
    @patch("credentials.EnvironmentCredential")
    def test_demonstrate_credential_chain_tests_environment(
        self,
        mock_env_cred: MagicMock,
    ) -> None:
        """
        Given: Mocked credentials
        When: Demonstrating credential chain
        Then: Tests EnvironmentCredential availability
        """
        # Given
        demo = AzureAuthDemo()
        mock_env_cred.return_value.get_token.side_effect = Exception("Not available")
        
        # When
        results = demo.demonstrate_credential_chain()
        
        # Then
        assert "EnvironmentCredential" in results
        assert isinstance(results["EnvironmentCredential"], bool)
    
    def test_create_custom_credential_chain_with_cli_preference(self) -> None:
        """
        Given: Preference for CLI credential
        When: Creating custom chain
        Then: Returns ChainedTokenCredential
        """
        # Given
        demo = AzureAuthDemo()
        
        # When
        credential = demo.create_custom_credential_chain(prefer_cli=True)
        
        # Then
        assert credential is not None


class TestKeyVaultClient:
    """Tests for Key Vault client."""
    
    @pytest.fixture
    def mock_secret_client(self) -> MagicMock:
        """Mock SecretClient fixture."""
        return MagicMock()
    
    @pytest.fixture
    def kv_client(self, mock_secret_client: MagicMock) -> KeyVaultClient:
        """KeyVaultClient fixture with mocked SecretClient."""
        with patch("keyvault.SecretClient", return_value=mock_secret_client):
            with patch("keyvault.DefaultAzureCredential"):
                client = KeyVaultClient("https://test.vault.azure.net")
                client.client = mock_secret_client
                return client
    
    def test_get_secret_returns_value(
        self,
        kv_client: KeyVaultClient,
        mock_secret_client: MagicMock,
    ) -> None:
        """
        Given: A secret exists in Key Vault
        When: Getting the secret
        Then: Returns secret value
        """
        # Given
        mock_secret = MagicMock()
        mock_secret.value = "secret-value-123"
        mock_secret_client.get_secret.return_value = mock_secret
        
        # When
        value = kv_client.get_secret("test-secret")
        
        # Then
        assert value == "secret-value-123"
        mock_secret_client.get_secret.assert_called_once_with("test-secret")
    
    def test_get_secret_raises_on_not_found(
        self,
        kv_client: KeyVaultClient,
        mock_secret_client: MagicMock,
    ) -> None:
        """
        Given: A secret doesn't exist
        When: Getting the secret
        Then: Raises ResourceNotFoundError
        """
        # Given
        mock_secret_client.get_secret.side_effect = ResourceNotFoundError()
        
        # When/Then
        with pytest.raises(ResourceNotFoundError):
            kv_client.get_secret("nonexistent")
    
    def test_set_secret_calls_client(
        self,
        kv_client: KeyVaultClient,
        mock_secret_client: MagicMock,
    ) -> None:
        """
        Given: A KeyVaultClient instance
        When: Setting a secret
        Then: Calls set_secret on client
        """
        # Given
        mock_secret = MagicMock()
        mock_secret_client.set_secret.return_value = mock_secret
        
        # When
        result = kv_client.set_secret("new-secret", "value-123")
        
        # Then
        mock_secret_client.set_secret.assert_called_once_with("new-secret", "value-123")
        assert result == mock_secret
    
    def test_list_secrets_returns_names(
        self,
        kv_client: KeyVaultClient,
        mock_secret_client: MagicMock,
    ) -> None:
        """
        Given: Multiple secrets in vault
        When: Listing secrets
        Then: Returns list of secret names
        """
        # Given
        mock_props = [
            MagicMock(name="secret1"),
            MagicMock(name="secret2"),
            MagicMock(name="secret3"),
        ]
        mock_secret_client.list_properties_of_secrets.return_value = mock_props
        
        # When
        names = kv_client.list_secrets()
        
        # Then
        assert names == ["secret1", "secret2", "secret3"]
    
    def test_get_multiple_secrets_returns_dict(
        self,
        kv_client: KeyVaultClient,
        mock_secret_client: MagicMock,
    ) -> None:
        """
        Given: Multiple secrets to retrieve
        When: Getting multiple secrets
        Then: Returns dictionary of values
        """
        # Given
        def get_secret_side_effect(name: str) -> MagicMock:
            mock = MagicMock()
            mock.value = f"value-{name}"
            return mock
        
        mock_secret_client.get_secret.side_effect = get_secret_side_effect
        
        # When
        secrets = kv_client.get_multiple_secrets(["secret1", "secret2", "secret3"])
        
        # Then
        assert secrets == {
            "secret1": "value-secret1",
            "secret2": "value-secret2",
            "secret3": "value-secret3",
        }
    
    def test_secret_exists_returns_true_when_found(
        self,
        kv_client: KeyVaultClient,
        mock_secret_client: MagicMock,
    ) -> None:
        """
        Given: A secret exists
        When: Checking if secret exists
        Then: Returns True
        """
        # Given
        mock_secret_client.get_secret.return_value = MagicMock()
        
        # When
        exists = kv_client.secret_exists("existing-secret")
        
        # Then
        assert exists is True
    
    def test_secret_exists_returns_false_when_not_found(
        self,
        kv_client: KeyVaultClient,
        mock_secret_client: MagicMock,
    ) -> None:
        """
        Given: A secret doesn't exist
        When: Checking if secret exists
        Then: Returns False
        """
        # Given
        mock_secret_client.get_secret.side_effect = ResourceNotFoundError()
        
        # When
        exists = kv_client.secret_exists("nonexistent")
        
        # Then
        assert exists is False


class TestBlobStorageClient:
    """Tests for Blob Storage client."""
    
    @pytest.fixture
    def mock_container_client(self) -> MagicMock:
        """Mock ContainerClient fixture."""
        return MagicMock()
    
    @pytest.fixture
    def storage_client(
        self,
        mock_container_client: MagicMock,
    ) -> BlobStorageClient:
        """BlobStorageClient fixture with mocked clients."""
        with patch("storage.BlobServiceClient"):
            with patch("storage.DefaultAzureCredential"):
                client = BlobStorageClient("testaccount", "testcontainer")
                client.container_client = mock_container_client
                return client
    
    def test_upload_blob_uploads_data(
        self,
        storage_client: BlobStorageClient,
        mock_container_client: MagicMock,
    ) -> None:
        """
        Given: Data to upload
        When: Uploading blob
        Then: Calls upload_blob on client
        """
        # Given
        mock_blob_client = MagicMock()
        mock_container_client.get_blob_client.return_value = mock_blob_client
        
        # When
        storage_client.upload_blob("test.txt", b"test data")
        
        # Then
        mock_blob_client.upload_blob.assert_called_once_with(
            b"test data",
            overwrite=False,
        )
    
    def test_download_blob_returns_data(
        self,
        storage_client: BlobStorageClient,
        mock_container_client: MagicMock,
    ) -> None:
        """
        Given: A blob exists
        When: Downloading blob
        Then: Returns blob data
        """
        # Given
        mock_blob_client = MagicMock()
        mock_download = MagicMock()
        mock_download.readall.return_value = b"blob data"
        mock_blob_client.download_blob.return_value = mock_download
        mock_container_client.get_blob_client.return_value = mock_blob_client
        
        # When
        data = storage_client.download_blob("test.txt")
        
        # Then
        assert data == b"blob data"
    
    def test_list_blobs_returns_names(
        self,
        storage_client: BlobStorageClient,
        mock_container_client: MagicMock,
    ) -> None:
        """
        Given: Multiple blobs in container
        When: Listing blobs
        Then: Returns list of blob names
        """
        # Given
        mock_blobs = [
            MagicMock(name="blob1.txt"),
            MagicMock(name="blob2.txt"),
            MagicMock(name="blob3.txt"),
        ]
        mock_container_client.list_blobs.return_value = mock_blobs
        
        # When
        names = storage_client.list_blobs()
        
        # Then
        assert names == ["blob1.txt", "blob2.txt", "blob3.txt"]
    
    def test_list_blobs_with_prefix_filters(
        self,
        storage_client: BlobStorageClient,
        mock_container_client: MagicMock,
    ) -> None:
        """
        Given: Blobs with different prefixes
        When: Listing with prefix filter
        Then: Passes prefix to list_blobs
        """
        # Given
        mock_container_client.list_blobs.return_value = []
        
        # When
        storage_client.list_blobs(prefix="logs/")
        
        # Then
        mock_container_client.list_blobs.assert_called_once_with(
            name_starts_with="logs/"
        )
    
    def test_delete_blob_deletes(
        self,
        storage_client: BlobStorageClient,
        mock_container_client: MagicMock,
    ) -> None:
        """
        Given: A blob exists
        When: Deleting blob
        Then: Calls delete_blob on client
        """
        # Given
        mock_blob_client = MagicMock()
        mock_container_client.get_blob_client.return_value = mock_blob_client
        
        # When
        storage_client.delete_blob("test.txt")
        
        # Then
        mock_blob_client.delete_blob.assert_called_once()
    
    def test_blob_exists_returns_true_when_found(
        self,
        storage_client: BlobStorageClient,
        mock_container_client: MagicMock,
    ) -> None:
        """
        Given: A blob exists
        When: Checking if blob exists
        Then: Returns True
        """
        # Given
        mock_blob_client = MagicMock()
        mock_blob_client.get_blob_properties.return_value = MagicMock()
        mock_container_client.get_blob_client.return_value = mock_blob_client
        
        # When
        exists = storage_client.blob_exists("test.txt")
        
        # Then
        assert exists is True
    
    def test_blob_exists_returns_false_when_not_found(
        self,
        storage_client: BlobStorageClient,
        mock_container_client: MagicMock,
    ) -> None:
        """
        Given: A blob doesn't exist
        When: Checking if blob exists
        Then: Returns False
        """
        # Given
        mock_blob_client = MagicMock()
        mock_blob_client.get_blob_properties.side_effect = ResourceNotFoundError()
        mock_container_client.get_blob_client.return_value = mock_blob_client
        
        # When
        exists = storage_client.blob_exists("nonexistent.txt")
        
        # Then
        assert exists is False
    
    @pytest.mark.parametrize(
        "blob_name,data,overwrite",
        [
            ("file.txt", b"binary data", False),
            ("data.json", '{"key": "value"}', True),
            ("backup.zip", b"compressed", False),
        ],
    )
    def test_upload_blob_with_different_data_types(
        self,
        storage_client: BlobStorageClient,
        mock_container_client: MagicMock,
        blob_name: str,
        data: bytes | str,
        overwrite: bool,
    ) -> None:
        """
        Given: Different data types to upload
        When: Uploading blob
        Then: Successfully uploads with correct parameters
        """
        # Given
        mock_blob_client = MagicMock()
        mock_container_client.get_blob_client.return_value = mock_blob_client
        
        # When
        storage_client.upload_blob(blob_name, data, overwrite=overwrite)
        
        # Then
        mock_blob_client.upload_blob.assert_called_once_with(data, overwrite=overwrite)
