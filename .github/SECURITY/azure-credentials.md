# Azure Credentials Guide: DefaultAzureCredential

## Overview

`DefaultAzureCredential` is the recommended authentication pattern for Azure services. It provides a unified authentication interface that works seamlessly across development and production environments.

## Why DefaultAzureCredential?

Following **OWASP A07:2021 – Identification and Authentication Failures** principles:

✅ **Benefits:**
- Single authentication code path for all environments
- Automatic credential chain fallback
- No hardcoded credentials
- Works with managed identities in production
- Simplified local development

❌ **Replaces these anti-patterns:**
- Hardcoded connection strings
- Environment-specific authentication code
- Checked-in service principal secrets
- Manual credential management

---

## Credential Chain Explanation

`DefaultAzureCredential` tries multiple authentication methods in order:

```
┌──────────────────────────────────────────────────────┐
│ DefaultAzureCredential Authentication Chain          │
├──────────────────────────────────────────────────────┤
│ 1. Environment Variables                             │
│    ├─ AZURE_CLIENT_ID                                │
│    ├─ AZURE_TENANT_ID                                │
│    ├─ AZURE_CLIENT_SECRET (Service Principal)        │
│    └─ AZURE_CLIENT_CERTIFICATE_PATH (Certificate)    │
├──────────────────────────────────────────────────────┤
│ 2. Workload Identity (Kubernetes)                    │
│    └─ AZURE_FEDERATED_TOKEN_FILE                     │
├──────────────────────────────────────────────────────┤
│ 3. Managed Identity                                  │
│    ├─ System-assigned                                │
│    └─ User-assigned (AZURE_CLIENT_ID)                │
├──────────────────────────────────────────────────────┤
│ 4. Azure CLI                                         │
│    └─ az login                                       │
├──────────────────────────────────────────────────────┤
│ 5. Azure PowerShell                                  │
│    └─ Connect-AzAccount                              │
├──────────────────────────────────────────────────────┤
│ 6. Azure Developer CLI                               │
│    └─ azd auth login                                 │
└──────────────────────────────────────────────────────┘

First successful authentication method is used.
```

---

## Environment Setup

### Development Environment

**Recommended:** Azure CLI authentication

```bash
# Install Azure CLI
winget install Microsoft.AzureCLI

# Login
az login

# Verify
az account show

# Set default subscription (if needed)
az account set --subscription "Your Subscription Name"
```

### Production Environment

**Recommended:** Managed Identity

```bash
# Azure VM/App Service: System-assigned identity enabled automatically
# Azure Container Apps, AKS: User-assigned identity

# Verify managed identity
az vm identity show --resource-group myRG --name myVM
```

---

## Python Implementation

### Installation

```bash
pip install azure-identity azure-keyvault-secrets azure-storage-blob
```

### Basic Usage

```python
"""Azure services with DefaultAzureCredential."""

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.storage.blob import BlobServiceClient


class AzureServiceClient:
    """Unified Azure service client using DefaultAzureCredential."""
    
    def __init__(self) -> None:
        """Initialize credential that works everywhere."""
        self.credential = DefaultAzureCredential()
    
    def get_secret(self, vault_url: str, secret_name: str) -> str:
        """Retrieve secret from Key Vault."""
        client = SecretClient(
            vault_url=vault_url,
            credential=self.credential
        )
        secret = client.get_secret(secret_name)
        return secret.value
    
    def upload_blob(
        self,
        storage_account: str,
        container: str,
        blob_name: str,
        data: bytes,
    ) -> None:
        """Upload blob to storage account."""
        account_url = f"https://{storage_account}.blob.core.windows.net"
        
        blob_service = BlobServiceClient(
            account_url=account_url,
            credential=self.credential
        )
        
        blob_client = blob_service.get_blob_client(
            container=container,
            blob=blob_name
        )
        blob_client.upload_blob(data, overwrite=True)


# Usage - same code works everywhere!
if __name__ == "__main__":
    client = AzureServiceClient()
    
    # Get secret from Key Vault
    secret = client.get_secret(
        vault_url="https://my-vault.vault.azure.net",
        secret_name="my-secret"
    )
    
    # Upload to blob storage
    client.upload_blob(
        storage_account="mystorageaccount",
        container="mycontainer",
        blob_name="myfile.txt",
        data=b"Hello Azure!"
    )
```

### Advanced Configuration

```python
"""Advanced DefaultAzureCredential configuration."""

from azure.identity import (
    DefaultAzureCredential,
    AzureCliCredential,
    ManagedIdentityCredential,
    EnvironmentCredential,
    ChainedTokenCredential,
)
import os


class ConfigurableAzureCredential:
    """Azure credential with custom configuration."""
    
    def __init__(
        self,
        exclude_environment_credential: bool = False,
        exclude_managed_identity_credential: bool = False,
        exclude_azure_cli_credential: bool = False,
        managed_identity_client_id: str | None = None,
    ) -> None:
        """
        Initialize with custom credential chain.
        
        Args:
            exclude_environment_credential: Skip environment variables
            exclude_managed_identity_credential: Skip managed identity
            exclude_azure_cli_credential: Skip Azure CLI
            managed_identity_client_id: User-assigned managed identity
        """
        self.credential = DefaultAzureCredential(
            exclude_environment_credential=exclude_environment_credential,
            exclude_managed_identity_credential=exclude_managed_identity_credential,
            exclude_cli_credential=exclude_azure_cli_credential,
            managed_identity_client_id=managed_identity_client_id,
        )
    
    def get_token(self, *scopes: str) -> str:
        """Get access token for specified scopes."""
        token = self.credential.get_token(*scopes)
        return token.token


class CustomCredentialChain:
    """Custom credential chain with fallback."""
    
    def __init__(self) -> None:
        """Initialize custom chain: CLI → Managed Identity → Environment."""
        self.credential = ChainedTokenCredential(
            AzureCliCredential(),
            ManagedIdentityCredential(
                client_id=os.getenv("AZURE_CLIENT_ID")
            ),
            EnvironmentCredential(),
        )


# Usage
if __name__ == "__main__":
    # Default behavior
    cred1 = DefaultAzureCredential()
    
    # Development only (Azure CLI)
    cred2 = ConfigurableAzureCredential(
        exclude_managed_identity_credential=True,
        exclude_environment_credential=True,
    )
    
    # Production only (Managed Identity)
    cred3 = ConfigurableAzureCredential(
        exclude_azure_cli_credential=True,
        managed_identity_client_id="your-client-id",
    )
    
    # Custom chain
    cred4 = CustomCredentialChain()
```

### Error Handling

```python
"""Robust error handling for Azure credentials."""

from azure.identity import DefaultAzureCredential
from azure.core.exceptions import ClientAuthenticationError
from azure.keyvault.secrets import SecretClient
import logging

logger = logging.getLogger(__name__)


class RobustAzureClient:
    """Azure client with proper error handling."""
    
    def __init__(self, vault_url: str) -> None:
        """Initialize with credential error handling."""
        try:
            self.credential = DefaultAzureCredential()
            self.client = SecretClient(
                vault_url=vault_url,
                credential=self.credential
            )
        except Exception as e:
            logger.error(f"Failed to initialize Azure credentials: {e}")
            raise
    
    def get_secret_safe(self, secret_name: str) -> str | None:
        """Get secret with error handling."""
        try:
            secret = self.client.get_secret(secret_name)
            return secret.value
        except ClientAuthenticationError as e:
            logger.error(f"Authentication failed: {e}")
            logger.info("Ensure you're logged in with 'az login'")
            return None
        except Exception as e:
            logger.error(f"Failed to retrieve secret '{secret_name}': {e}")
            return None


# Usage
client = RobustAzureClient(
    vault_url="https://my-vault.vault.azure.net"
)

secret = client.get_secret_safe("my-secret")
if secret:
    print("Secret retrieved successfully")
else:
    print("Failed to retrieve secret - check logs")
```

---

## TypeScript/JavaScript Implementation

### Installation

```bash
npm install @azure/identity @azure/keyvault-secrets @azure/storage-blob
```

### Basic Usage

```typescript
// azureClient.ts
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { BlobServiceClient } from "@azure/storage-blob";

export class AzureServiceClient {
  private credential: DefaultAzureCredential;

  constructor() {
    this.credential = new DefaultAzureCredential();
  }

  async getSecret(vaultUrl: string, secretName: string): Promise<string> {
    const client = new SecretClient(vaultUrl, this.credential);
    const secret = await client.getSecret(secretName);
    return secret.value!;
  }

  async uploadBlob(
    storageAccount: string,
    container: string,
    blobName: string,
    data: Buffer
  ): Promise<void> {
    const accountUrl = `https://${storageAccount}.blob.core.windows.net`;
    
    const blobService = new BlobServiceClient(
      accountUrl,
      this.credential
    );
    
    const containerClient = blobService.getContainerClient(container);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    
    await blobClient.upload(data, data.length);
  }
}

// Usage
const client = new AzureServiceClient();

const secret = await client.getSecret(
  "https://my-vault.vault.azure.net",
  "my-secret"
);

await client.uploadBlob(
  "mystorageaccount",
  "mycontainer",
  "myfile.txt",
  Buffer.from("Hello Azure!")
);
```

### Advanced Configuration

```typescript
// customCredential.ts
import {
  DefaultAzureCredential,
  ChainedTokenCredential,
  AzureCliCredential,
  ManagedIdentityCredential,
  EnvironmentCredential,
} from "@azure/identity";

export class ConfigurableAzureCredential {
  public credential: DefaultAzureCredential | ChainedTokenCredential;

  constructor(options?: {
    excludeEnvironmentCredential?: boolean;
    excludeManagedIdentityCredential?: boolean;
    excludeCliCredential?: boolean;
    managedIdentityClientId?: string;
  }) {
    this.credential = new DefaultAzureCredential({
      excludeEnvironmentCredential: options?.excludeEnvironmentCredential,
      excludeManagedIdentityCredential: options?.excludeManagedIdentityCredential,
      excludeCliCredential: options?.excludeCliCredential,
      managedIdentityClientId: options?.managedIdentityClientId,
    });
  }

  async getToken(...scopes: string[]): Promise<string> {
    const token = await this.credential.getToken(scopes);
    return token.token;
  }
}

// Custom chain
export class CustomCredentialChain {
  public credential: ChainedTokenCredential;

  constructor() {
    this.credential = new ChainedTokenCredential(
      new AzureCliCredential(),
      new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID),
      new EnvironmentCredential()
    );
  }
}
```

---

## Go Implementation

### Installation

```bash
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
go get github.com/Azure/azure-sdk-for-go/sdk/keyvault/azsecrets
go get github.com/Azure/azure-sdk-for-go/sdk/storage/azblob
```

### Basic Usage

```go
// azureclient.go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/keyvault/azsecrets"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
)

type AzureServiceClient struct {
	credential *azidentity.DefaultAzureCredential
}

func NewAzureServiceClient() (*AzureServiceClient, error) {
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create credential: %w", err)
	}

	return &AzureServiceClient{
		credential: cred,
	}, nil
}

func (c *AzureServiceClient) GetSecret(vaultURL, secretName string) (string, error) {
	client, err := azsecrets.NewClient(vaultURL, c.credential, nil)
	if err != nil {
		return "", fmt.Errorf("failed to create secret client: %w", err)
	}

	secret, err := client.GetSecret(context.Background(), secretName, "", nil)
	if err != nil {
		return "", fmt.Errorf("failed to get secret: %w", err)
	}

	return *secret.Value, nil
}

func (c *AzureServiceClient) UploadBlob(
	storageAccount, container, blobName string,
	data []byte,
) error {
	accountURL := fmt.Sprintf("https://%s.blob.core.windows.net", storageAccount)

	client, err := azblob.NewClient(accountURL, c.credential, nil)
	if err != nil {
		return fmt.Errorf("failed to create blob client: %w", err)
	}

	_, err = client.UploadBuffer(
		context.Background(),
		container,
		blobName,
		data,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to upload blob: %w", err)
	}

	return nil
}

func main() {
	client, err := NewAzureServiceClient()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	// Get secret
	secret, err := client.GetSecret(
		"https://my-vault.vault.azure.net",
		"my-secret",
	)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Secret retrieved: %s\n", secret[:10])

	// Upload blob
	err = client.UploadBlob(
		"mystorageaccount",
		"mycontainer",
		"myfile.txt",
		[]byte("Hello Azure!"),
	)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Blob uploaded successfully")
}
```

---

## .NET Implementation

### Installation

```bash
dotnet add package Azure.Identity
dotnet add package Azure.Security.KeyVault.Secrets
dotnet add package Azure.Storage.Blobs
```

### Basic Usage

```csharp
// AzureServiceClient.cs
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Azure.Storage.Blobs;

namespace GrandBudapestTerminal;

public class AzureServiceClient
{
    private readonly DefaultAzureCredential _credential;

    public AzureServiceClient()
    {
        _credential = new DefaultAzureCredential();
    }

    public async Task<string> GetSecretAsync(string vaultUrl, string secretName)
    {
        var client = new SecretClient(
            new Uri(vaultUrl),
            _credential
        );

        KeyVaultSecret secret = await client.GetSecretAsync(secretName);
        return secret.Value;
    }

    public async Task UploadBlobAsync(
        string storageAccount,
        string container,
        string blobName,
        byte[] data)
    {
        var accountUrl = $"https://{storageAccount}.blob.core.windows.net";

        var blobService = new BlobServiceClient(
            new Uri(accountUrl),
            _credential
        );

        var containerClient = blobService.GetBlobContainerClient(container);
        var blobClient = containerClient.GetBlobClient(blobName);

        using var stream = new MemoryStream(data);
        await blobClient.UploadAsync(stream, overwrite: true);
    }
}

// Program.cs
var client = new AzureServiceClient();

// Get secret
var secret = await client.GetSecretAsync(
    "https://my-vault.vault.azure.net",
    "my-secret"
);
Console.WriteLine($"Secret retrieved: {secret[..10]}...");

// Upload blob
await client.UploadBlobAsync(
    "mystorageaccount",
    "mycontainer",
    "myfile.txt",
    System.Text.Encoding.UTF8.GetBytes("Hello Azure!")
);
Console.WriteLine("Blob uploaded successfully");
```

---

## Managed Identity Setup

### System-Assigned Managed Identity

#### Azure VM

```bash
# Enable system-assigned identity
az vm identity assign \
  --resource-group myRG \
  --name myVM

# Grant Key Vault access
az keyvault set-policy \
  --name my-vault \
  --object-id $(az vm identity show --resource-group myRG --name myVM --query principalId -o tsv) \
  --secret-permissions get list
```

#### Azure App Service

```bash
# Enable system-assigned identity
az webapp identity assign \
  --resource-group myRG \
  --name myApp

# Grant Key Vault access
az keyvault set-policy \
  --name my-vault \
  --object-id $(az webapp identity show --resource-group myRG --name myApp --query principalId -o tsv) \
  --secret-permissions get list
```

### User-Assigned Managed Identity

```bash
# Create user-assigned identity
az identity create \
  --resource-group myRG \
  --name myUserIdentity

# Assign to VM
az vm identity assign \
  --resource-group myRG \
  --name myVM \
  --identities $(az identity show --resource-group myRG --name myUserIdentity --query id -o tsv)

# Grant Key Vault access
az keyvault set-policy \
  --name my-vault \
  --object-id $(az identity show --resource-group myRG --name myUserIdentity --query principalId -o tsv) \
  --secret-permissions get list

# Set environment variable (for DefaultAzureCredential)
export AZURE_CLIENT_ID=$(az identity show --resource-group myRG --name myUserIdentity --query clientId -o tsv)
```

---

## Service Principal vs OIDC

### Service Principal (Traditional)

**Use when:** Legacy systems, non-Azure CI/CD

```bash
# Create service principal
az ad sp create-for-rbac \
  --name grand-budapest-sp \
  --role Contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/myRG

# Output:
# {
#   "appId": "abc-123",
#   "displayName": "grand-budapest-sp",
#   "password": "secret-value",
#   "tenant": "xyz-789"
# }

# Set environment variables
export AZURE_CLIENT_ID="abc-123"
export AZURE_TENANT_ID="xyz-789"
export AZURE_CLIENT_SECRET="secret-value"
```

**❌ Drawbacks:**
- Long-lived secrets
- Manual rotation required
- Secret storage needed

### OIDC (Modern - Recommended)

**Use when:** GitHub Actions, modern CI/CD

```bash
# Create app registration
az ad app create --display-name grand-budapest-oidc

# Create service principal
az ad sp create --id $(az ad app show --id grand-budapest-oidc --query appId -o tsv)

# Configure federated credential for GitHub Actions
az ad app federated-credential create \
  --id $(az ad app show --display-name grand-budapest-oidc --query appId -o tsv) \
  --parameters '{
    "name": "github-actions",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:your-org/your-repo:environment:production",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

**✅ Benefits:**
- No long-lived secrets
- Token-based authentication
- Automatic rotation
- Better security

---

## Local Development Patterns

### Recommended: Azure CLI

```bash
# One-time setup
az login
az account set --subscription "Your Subscription"

# Code automatically uses CLI credentials
# No environment variables needed!
```

### Alternative: Service Principal

```bash
# .env (DO NOT COMMIT!)
AZURE_CLIENT_ID=your-client-id
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_SECRET=your-client-secret
```

```python
# Load from .env
from dotenv import load_dotenv
from azure.identity import DefaultAzureCredential

load_dotenv()

# DefaultAzureCredential automatically uses environment variables
credential = DefaultAzureCredential()
```

### Development vs Production

```python
"""Environment-aware credential selection."""

import os
from azure.identity import DefaultAzureCredential, AzureCliCredential


def get_credential():
    """Get credential based on environment."""
    if os.getenv("ENVIRONMENT") == "production":
        # Production: Use managed identity only
        return DefaultAzureCredential(
            exclude_cli_credential=True,
            exclude_environment_credential=True,
        )
    else:
        # Development: Use Azure CLI
        return AzureCliCredential()
```

---

## Troubleshooting

### Authentication Errors

**Error:** `DefaultAzureCredential failed to retrieve a token`

**Solutions:**

```bash
# 1. Verify Azure CLI login
az account show

# If not logged in:
az login

# 2. Check environment variables
echo $AZURE_CLIENT_ID
echo $AZURE_TENANT_ID

# 3. Enable logging (Python)
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Debugging Credential Chain

```python
"""Debug which credential is used."""

from azure.identity import DefaultAzureCredential
import logging

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("azure.identity")
logger.setLevel(logging.DEBUG)

# Initialize credential
credential = DefaultAzureCredential()

# Get token (check logs to see which method succeeded)
token = credential.get_token("https://management.azure.com/.default")
print(f"Token acquired: {token.token[:20]}...")
```

### Permission Issues

**Error:** `Access denied` or `Forbidden`

**Solution:**

```bash
# Verify Key Vault access policy
az keyvault show --name my-vault --query properties.accessPolicies

# Add missing permissions
az keyvault set-policy \
  --name my-vault \
  --object-id <your-principal-id> \
  --secret-permissions get list
```

---

## Best Practices

### ✅ DO

- Use `DefaultAzureCredential` for all Azure SDK code
- Use Azure CLI for local development (`az login`)
- Use Managed Identity in production
- Use OIDC for CI/CD pipelines
- Enable debug logging during development
- Apply least privilege permissions
- Rotate service principals regularly (if used)

### ❌ DON'T

- Hardcode credentials in code
- Check in service principal secrets
- Use service principals when managed identity is available
- Use different authentication code for dev/prod
- Store credentials in configuration files
- Share service principals across services

---

## Integration with justfile

```make
# Login to Azure CLI
azure-login:
    az login
    az account show

# Test Azure credentials
test-azure-auth:
    python scripts/test_azure_auth.py

# Create service principal (development)
create-sp:
    az ad sp create-for-rbac --name grand-budapest-dev --role Contributor
```

---

## References

- **DefaultAzureCredential Documentation**: https://docs.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential
- **Azure Identity SDK**: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/identity
- **Managed Identities**: https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/
- **OIDC with GitHub Actions**: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure

---

**Next Steps:**
- Configure [Azure Key Vault](./credential-management.md#azure-key-vault-integration)
- Set up [GitHub OIDC](./github-secrets.md#oidc-authentication)
- Review [Credential Management](./credential-management.md)

---

*"Authentication should be effortless, yet impenetrable."* — M. Gustave H.
