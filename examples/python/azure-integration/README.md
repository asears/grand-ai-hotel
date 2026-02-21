# Azure Services Integration

Modern Python examples demonstrating Azure services integration using `DefaultAzureCredential` for seamless authentication across development and production environments.

## Features

- ✅ **DefaultAzureCredential** chain demonstration
- ✅ **Azure Key Vault** secret management
- ✅ **Azure Blob Storage** operations
- ✅ Automatic authentication across environments
- ✅ Type-safe with modern Python 3.12+ syntax
- ✅ Tests with mocks
- ✅ Production-ready error handling

## What is DefaultAzureCredential?

`DefaultAzureCredential` is a unified authentication API that automatically tries multiple authentication methods in order:

1. **EnvironmentCredential** - Service principal from environment variables
2. **WorkloadIdentityCredential** - Kubernetes workload identity
3. **ManagedIdentityCredential** - Azure Managed Identity (for Azure-hosted apps)
4. **AzureCliCredential** - Azure CLI (`az login`) for local development
5. **AzurePowerShellCredential** - Azure PowerShell
6. **InteractiveBrowserCredential** - Browser-based login (fallback)

This means **one line of code works everywhere** - local development, CI/CD, and production!

## Requirements

- Python 3.12+
- Azure subscription
- Azure CLI (for local development)

## Installation

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Install Azure CLI

**Windows:**
```powershell
winget install Microsoft.AzureCLI
```

**macOS:**
```bash
brew install azure-cli
```

**Linux:**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### 4. Login to Azure

```bash
az login
```

## Authentication Setup

### Local Development (Azure CLI)

```bash
# Login to Azure
az login

# Set default subscription (optional)
az account set --subscription "Your Subscription Name"

# Verify
az account show
```

Now all examples will work automatically using your Azure CLI credentials!

### Production (Managed Identity)

Deploy to Azure App Service, Container Apps, or AKS with Managed Identity:

```bash
# Enable system-assigned managed identity
az webapp identity assign --name myapp --resource-group mygroup

# Grant Key Vault access
az keyvault set-policy --name myvault \
  --object-id $(az webapp identity show --name myapp --resource-group mygroup --query principalId -o tsv) \
  --secret-permissions get list

# Grant Storage access
az role assignment create \
  --assignee $(az webapp identity show --name myapp --resource-group mygroup --query principalId -o tsv) \
  --role "Storage Blob Data Contributor" \
  --scope /subscriptions/{subscription-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}
```

### CI/CD (Service Principal)

```bash
# Create service principal
az ad sp create-for-rbac --name "myapp-ci" --role contributor

# Set environment variables in your CI/CD pipeline
export AZURE_TENANT_ID=<tenant-id>
export AZURE_CLIENT_ID=<client-id>
export AZURE_CLIENT_SECRET=<client-secret>
```

## Running Examples

### 1. Credential Chain Demo

```bash
python credentials.py
```

Output shows which authentication methods are available:
```
Testing EnvironmentCredential...
✗ EnvironmentCredential not available
Testing ManagedIdentityCredential...
✗ ManagedIdentityCredential not available
Testing AzureCliCredential...
✓ AzureCliCredential available
```

### 2. Key Vault Example

```bash
# Set your Key Vault URL
export AZURE_KEYVAULT_URL=https://myvault.vault.azure.net

# Run example
python keyvault.py
```

### 3. Blob Storage Example

```bash
# Set your storage account
export AZURE_STORAGE_ACCOUNT=mystorageaccount

# Run example
python storage.py
```

## Usage Examples

### DefaultAzureCredential

```python
from credentials import AzureAuthDemo

# Initialize
demo = AzureAuthDemo()

# Get credential (tries all methods automatically)
credential = demo.get_default_credential()

# Test which credentials are available
results = demo.demonstrate_credential_chain()
print(results)
# {'AzureCliCredential': True, 'ManagedIdentityCredential': False, ...}

# Get token
token_info = demo.get_token_info(credential)
print(token_info)
```

### Azure Key Vault

```python
from keyvault import KeyVaultClient

# Initialize client
kv = KeyVaultClient("https://myvault.vault.azure.net")

# Get secret
api_key = kv.get_secret("api-key")
print(f"API Key: {api_key}")

# Set secret
kv.set_secret("new-secret", "secret-value-123")

# List all secrets
secrets = kv.list_secrets()
for name in secrets:
    print(f"- {name}")

# Get multiple secrets
secrets_dict = kv.get_multiple_secrets([
    "database-password",
    "api-key",
    "storage-key"
])

# Check if secret exists
if kv.secret_exists("important-key"):
    value = kv.get_secret("important-key")

# Close client
kv.close()
```

### Azure Blob Storage

```python
from storage import BlobStorageClient

# Initialize client
storage = BlobStorageClient("mystorageaccount", "mycontainer")

# Create container
storage.create_container_if_not_exists()

# Upload blob
storage.upload_blob("file.txt", b"Hello, Azure Storage!")

# Upload file
storage.upload_file("backup.zip", "/path/to/local/backup.zip")

# Download blob
data = storage.download_blob("file.txt")
print(data.decode())

# Download to file
storage.download_to_file("backup.zip", "/tmp/backup.zip")

# List blobs
blobs = storage.list_blobs()
for blob in blobs:
    print(f"- {blob}")

# List with prefix
logs = storage.list_blobs(prefix="logs/")

# Check if blob exists
if storage.blob_exists("file.txt"):
    print("File exists!")

# Get blob properties
props = storage.get_blob_properties("file.txt")
print(f"Size: {props['size']} bytes")
print(f"Last modified: {props['last_modified']}")

# Copy blob
storage.copy_blob("original.txt", "copy.txt")

# Delete blob
storage.delete_blob("old-file.txt")

# Close client
storage.close()
```

## Running Tests

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=. --cov-report=html
open htmlcov/index.html
```

### Run Specific Test Class

```bash
pytest tests/test_azure.py::TestKeyVaultClient -v
```

## Code Quality

### Format and Lint

```bash
# Format code
ruff format .

# Lint code
ruff check .

# Fix auto-fixable issues
ruff check --fix .
```

## Azure Resources Setup

### Create Key Vault

```bash
# Create resource group
az group create --name mygroup --location eastus

# Create Key Vault
az keyvault create \
  --name myvault \
  --resource-group mygroup \
  --location eastus

# Set secrets
az keyvault secret set --vault-name myvault --name api-key --value "secret123"
az keyvault secret set --vault-name myvault --name db-password --value "password456"

# Grant yourself access (for local development)
az keyvault set-policy \
  --name myvault \
  --upn $(az account show --query user.name -o tsv) \
  --secret-permissions get list set delete
```

### Create Storage Account

```bash
# Create storage account
az storage account create \
  --name mystorageaccount \
  --resource-group mygroup \
  --location eastus \
  --sku Standard_LRS

# Create container
az storage container create \
  --name mycontainer \
  --account-name mystorageaccount \
  --auth-mode login

# Grant yourself access (for local development)
az role assignment create \
  --assignee $(az account show --query user.name -o tsv) \
  --role "Storage Blob Data Contributor" \
  --scope /subscriptions/$(az account show --query id -o tsv)/resourceGroups/mygroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount
```

## Project Structure

```
azure-integration/
├── credentials.py         # DefaultAzureCredential demonstration
├── keyvault.py           # Azure Key Vault client
├── storage.py            # Azure Blob Storage client
├── requirements.txt      # Python dependencies
├── README.md            # This file
└── tests/
    └── test_azure.py    # Pytest tests with mocks
```

## Modern Python Features

### Type Hints (Python 3.12+)

```python
# Modern lowercase type hints
def get_secrets(names: list[str]) -> dict[str, str]:
    pass

# Union types with |
def get_secret(name: str) -> str | None:
    pass
```

### Pattern Matching

```python
match credential_type:
    case "environment":
        cred = EnvironmentCredential()
    case "cli":
        cred = AzureCliCredential()
    case _:
        cred = DefaultAzureCredential()
```

### Structured Logging

```python
from loguru import logger

logger.info("Retrieving secret: {name}", name=secret_name)
logger.error("Failed to authenticate: {error}", error=str(e))
```

## Best Practices

### 1. Use DefaultAzureCredential

```python
# ✅ Good: Works everywhere
from azure.identity import DefaultAzureCredential
credential = DefaultAzureCredential()

# ❌ Avoid: Hard-coded credentials
credential = ClientSecretCredential(tenant, client_id, secret)
```

### 2. Close Clients

```python
# ✅ Good: Close when done
client = KeyVaultClient(vault_url)
try:
    secret = client.get_secret("key")
finally:
    client.close()

# Better: Use context manager (if available)
```

### 3. Handle Exceptions

```python
# ✅ Good: Specific exception handling
try:
    secret = kv.get_secret("api-key")
except ResourceNotFoundError:
    logger.warning("Secret not found, using default")
    secret = "default-value"
```

### 4. Use Type Hints

```python
# ✅ Good: Type-safe
def get_secret(kv: KeyVaultClient, name: str) -> str:
    return kv.get_secret(name)

# ❌ Avoid: No types
def get_secret(kv, name):
    return kv.get_secret(name)
```

## Common Issues and Solutions

### Issue: "Az login required"

**Solution:**
```bash
az login
az account show  # Verify login
```

### Issue: "Access denied to Key Vault"

**Solution:**
```bash
# Grant yourself access
az keyvault set-policy \
  --name myvault \
  --upn $(az account show --query user.name -o tsv) \
  --secret-permissions get list
```

### Issue: "Storage access denied"

**Solution:**
```bash
# Grant storage access
az role assignment create \
  --assignee $(az account show --query user.name -o tsv) \
  --role "Storage Blob Data Contributor" \
  --scope /subscriptions/{subscription-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}
```

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `AZURE_KEYVAULT_URL` | Key Vault URL | `https://myvault.vault.azure.net` |
| `AZURE_STORAGE_ACCOUNT` | Storage account name | `mystorageaccount` |
| `AZURE_STORAGE_CONTAINER` | Container name | `mycontainer` |
| `AZURE_TENANT_ID` | Tenant ID (for service principal) | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `AZURE_CLIENT_ID` | Client ID (for service principal) | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `AZURE_CLIENT_SECRET` | Client secret (for service principal) | `your-secret-here` |

## License

MIT
