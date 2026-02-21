# Credential Management Guide

## Overview

Proper credential management is essential for security. This guide covers secure storage patterns for different environments, focusing on Windows development with Azure cloud integration.

## Core Principles

Following **OWASP A07:2021 – Identification and Authentication Failures** guidelines:

1. **Never store credentials in code or configuration files**
2. **Never store secrets at rest unencrypted**
3. **Use managed identities when possible**
4. **Rotate credentials regularly**
5. **Apply principle of least privilege**
6. **Audit credential access**

---

## Credential Storage Options

```
┌─────────────────────────────────────────────────────────┐
│ Environment         │ Storage Method                    │
├─────────────────────────────────────────────────────────┤
│ Local Development   │ Windows Credential Store         │
│                     │ (via keyring library)             │
├─────────────────────────────────────────────────────────┤
│ Cloud Development   │ Azure Key Vault                   │
│                     │ Managed Identity                  │
├─────────────────────────────────────────────────────────┤
│ CI/CD               │ GitHub Secrets                    │
│                     │ Environment Variables             │
├─────────────────────────────────────────────────────────┤
│ Production          │ Azure Key Vault                   │
│                     │ Managed Identity                  │
└─────────────────────────────────────────────────────────┘
```

---

## Windows Credential Store

### Using keyring Library (Python)

**Best for:** Local development credentials

#### Installation

```bash
pip install keyring
```

#### Basic Usage

```python
import keyring

# Store a credential
keyring.set_password(
    "grand-budapest-terminal",  # Service name
    "github-token",              # Account/key name
    "ghp_yourtoken123456"        # Secret value
)

# Retrieve a credential
token = keyring.get_password(
    "grand-budapest-terminal",
    "github-token"
)

# Delete a credential
keyring.delete_password(
    "grand-budapest-terminal",
    "github-token"
)
```

#### Example: Copilot Client Configuration

```python
"""Copilot client with secure credential management."""

import keyring
import os


class SecureCopilotClient:
    """GitHub Copilot client with credential store integration."""
    
    SERVICE_NAME = "grand-budapest-terminal"
    TOKEN_KEY = "github-copilot-token"
    
    def __init__(self, token: str | None = None) -> None:
        """
        Initialize client with token from secure store or parameter.
        
        Args:
            token: Optional token (for initial setup)
        """
        if token:
            # Store for future use
            keyring.set_password(self.SERVICE_NAME, self.TOKEN_KEY, token)
        
        self.token = self._get_token()
    
    def _get_token(self) -> str:
        """Get token from credential store or environment."""
        # Try credential store first
        token = keyring.get_password(self.SERVICE_NAME, self.TOKEN_KEY)
        
        if token:
            return token
        
        # Fallback to environment variable
        token = os.getenv("GITHUB_COPILOT_TOKEN")
        if token:
            # Store for future use
            keyring.set_password(self.SERVICE_NAME, self.TOKEN_KEY, token)
            return token
        
        raise ValueError(
            "No token found. Set GITHUB_COPILOT_TOKEN environment variable "
            "or pass token to constructor."
        )
    
    def rotate_token(self, new_token: str) -> None:
        """Rotate the stored token."""
        keyring.set_password(self.SERVICE_NAME, self.TOKEN_KEY, new_token)
        self.token = new_token


# Usage
if __name__ == "__main__":
    # Initial setup - store token securely
    client = SecureCopilotClient(token="ghp_yourtoken")
    
    # Subsequent usage - retrieves automatically
    client = SecureCopilotClient()
```

#### Multiple Credentials Example

```python
"""Manage multiple service credentials."""

import keyring
from dataclasses import dataclass


@dataclass
class ServiceCredentials:
    """Credentials for a service."""
    api_key: str
    api_secret: str | None = None
    endpoint: str | None = None


class CredentialManager:
    """Centralized credential management."""
    
    SERVICE_NAME = "grand-budapest-terminal"
    
    def store_credentials(
        self,
        service: str,
        credentials: ServiceCredentials,
    ) -> None:
        """Store service credentials."""
        keyring.set_password(
            self.SERVICE_NAME,
            f"{service}:api_key",
            credentials.api_key
        )
        
        if credentials.api_secret:
            keyring.set_password(
                self.SERVICE_NAME,
                f"{service}:api_secret",
                credentials.api_secret
            )
        
        if credentials.endpoint:
            keyring.set_password(
                self.SERVICE_NAME,
                f"{service}:endpoint",
                credentials.endpoint
            )
    
    def get_credentials(self, service: str) -> ServiceCredentials:
        """Retrieve service credentials."""
        api_key = keyring.get_password(
            self.SERVICE_NAME,
            f"{service}:api_key"
        )
        
        if not api_key:
            raise ValueError(f"No credentials found for {service}")
        
        api_secret = keyring.get_password(
            self.SERVICE_NAME,
            f"{service}:api_secret"
        )
        
        endpoint = keyring.get_password(
            self.SERVICE_NAME,
            f"{service}:endpoint"
        )
        
        return ServiceCredentials(
            api_key=api_key,
            api_secret=api_secret,
            endpoint=endpoint
        )
    
    def delete_credentials(self, service: str) -> None:
        """Delete service credentials."""
        for key in ["api_key", "api_secret", "endpoint"]:
            try:
                keyring.delete_password(
                    self.SERVICE_NAME,
                    f"{service}:{key}"
                )
            except keyring.errors.PasswordDeleteError:
                pass  # Already deleted


# Usage
manager = CredentialManager()

# Store OpenAI credentials
manager.store_credentials(
    "openai",
    ServiceCredentials(
        api_key="sk-proj-...",
        endpoint="https://api.openai.com/v1"
    )
)

# Retrieve credentials
creds = manager.get_credentials("openai")
print(f"API Key: {creds.api_key[:10]}...")
```

### Using PowerShell

**Best for:** Scripts and automation

#### Store Credential

```powershell
# Store a credential securely
$credential = Get-Credential -UserName "github-token" -Message "Enter GitHub Token"
$credential | Export-Clixml -Path "$env:LOCALAPPDATA\GrandBudapest\github-cred.xml"

# Or store specific values
$secureString = ConvertTo-SecureString "ghp_yourtoken" -AsPlainText -Force
$secureString | ConvertFrom-SecureString | Set-Content "$env:LOCALAPPDATA\GrandBudapest\token.txt"
```

#### Retrieve Credential

```powershell
# Retrieve credential
$credential = Import-Clixml -Path "$env:LOCALAPPDATA\GrandBudapest\github-cred.xml"
$token = $credential.GetNetworkCredential().Password

# Or retrieve specific value
$secureString = Get-Content "$env:LOCALAPPDATA\GrandBudapest\token.txt" | ConvertTo-SecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureString)
$token = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
```

#### Example: Script with Secure Credentials

```powershell
<#
.SYNOPSIS
    Example script using Windows Credential Store
#>

function Get-StoredToken {
    param(
        [string]$Service = "GrandBudapest",
        [string]$Name = "GitHubToken"
    )
    
    $credPath = "$env:LOCALAPPDATA\$Service\$Name.xml"
    
    if (Test-Path $credPath) {
        $credential = Import-Clixml -Path $credPath
        return $credential.GetNetworkCredential().Password
    }
    
    # Fallback to environment variable
    $envToken = $env:GITHUB_COPILOT_TOKEN
    if ($envToken) {
        return $envToken
    }
    
    throw "No token found. Run Set-StoredToken first."
}

function Set-StoredToken {
    param(
        [string]$Service = "GrandBudapest",
        [string]$Name = "GitHubToken",
        [string]$Token
    )
    
    $servicePath = "$env:LOCALAPPDATA\$Service"
    New-Item -ItemType Directory -Force -Path $servicePath | Out-Null
    
    $secureToken = ConvertTo-SecureString $Token -AsPlainText -Force
    $credential = New-Object System.Management.Automation.PSCredential($Name, $secureToken)
    $credential | Export-Clixml -Path "$servicePath\$Name.xml"
    
    Write-Host "✅ Token stored securely"
}

# Usage
# Set-StoredToken -Token "ghp_yourtoken"
# $token = Get-StoredToken
```

---

## Azure Key Vault Integration

### Setup

```bash
# Install Azure CLI
winget install Microsoft.AzureCLI

# Login
az login

# Create Key Vault
az keyvault create \
  --name grand-budapest-vault \
  --resource-group grand-budapest-rg \
  --location eastus

# Add a secret
az keyvault secret set \
  --vault-name grand-budapest-vault \
  --name github-copilot-token \
  --value "ghp_yourtoken"
```

### Python with Azure SDK

#### Installation

```bash
pip install azure-keyvault-secrets azure-identity
```

#### Basic Usage

```python
"""Azure Key Vault credential retrieval."""

from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
import os


class AzureCredentialStore:
    """Azure Key Vault credential management."""
    
    def __init__(self, vault_url: str | None = None) -> None:
        """
        Initialize Key Vault client.
        
        Args:
            vault_url: Key Vault URL (or use AZURE_KEYVAULT_URL env var)
        """
        self.vault_url = vault_url or os.getenv("AZURE_KEYVAULT_URL")
        if not self.vault_url:
            raise ValueError("Vault URL required")
        
        # DefaultAzureCredential handles multiple auth methods
        self.credential = DefaultAzureCredential()
        self.client = SecretClient(
            vault_url=self.vault_url,
            credential=self.credential
        )
    
    def get_secret(self, name: str) -> str:
        """Retrieve secret from Key Vault."""
        secret = self.client.get_secret(name)
        return secret.value
    
    def set_secret(self, name: str, value: str) -> None:
        """Store secret in Key Vault."""
        self.client.set_secret(name, value)
    
    def delete_secret(self, name: str) -> None:
        """Delete secret from Key Vault."""
        poller = self.client.begin_delete_secret(name)
        poller.wait()


# Usage
if __name__ == "__main__":
    store = AzureCredentialStore(
        vault_url="https://grand-budapest-vault.vault.azure.net"
    )
    
    # Retrieve secret
    token = store.get_secret("github-copilot-token")
    print(f"Token: {token[:10]}...")
    
    # Store secret
    store.set_secret("new-api-key", "sk-proj-...")
```

#### Advanced: Caching and Fallback

```python
"""Key Vault with local caching and fallback."""

from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from functools import lru_cache
import keyring
import os


class HybridCredentialStore:
    """Credential store with Key Vault and local fallback."""
    
    SERVICE_NAME = "grand-budapest-terminal"
    
    def __init__(
        self,
        vault_url: str | None = None,
        use_local_cache: bool = True,
    ) -> None:
        """
        Initialize hybrid credential store.
        
        Args:
            vault_url: Azure Key Vault URL
            use_local_cache: Cache secrets locally in Windows Credential Store
        """
        self.use_local_cache = use_local_cache
        self.vault_url = vault_url or os.getenv("AZURE_KEYVAULT_URL")
        
        # Try to initialize Key Vault client
        self.client: SecretClient | None = None
        if self.vault_url:
            try:
                credential = DefaultAzureCredential()
                self.client = SecretClient(
                    vault_url=self.vault_url,
                    credential=credential
                )
            except Exception as e:
                print(f"⚠️  Key Vault unavailable: {e}")
    
    @lru_cache(maxsize=128)
    def get_secret(self, name: str) -> str:
        """
        Get secret with fallback chain:
        1. Local cache (Windows Credential Store)
        2. Azure Key Vault
        3. Environment variable
        """
        # Try local cache first
        if self.use_local_cache:
            cached = keyring.get_password(self.SERVICE_NAME, name)
            if cached:
                return cached
        
        # Try Key Vault
        if self.client:
            try:
                secret = self.client.get_secret(name)
                value = secret.value
                
                # Cache locally
                if self.use_local_cache:
                    keyring.set_password(self.SERVICE_NAME, name, value)
                
                return value
            except Exception as e:
                print(f"⚠️  Key Vault error: {e}")
        
        # Fallback to environment variable
        env_value = os.getenv(name.upper().replace("-", "_"))
        if env_value:
            return env_value
        
        raise ValueError(f"Secret '{name}' not found in any store")


# Usage
store = HybridCredentialStore(
    vault_url="https://grand-budapest-vault.vault.azure.net"
)

# Automatically tries Key Vault → Local cache → Env var
token = store.get_secret("github-copilot-token")
```

---

## GitHub Secrets

See detailed guide: [GitHub Secrets Management](./github-secrets.md)

### Quick Reference

```bash
# Set repository secret
gh secret set AZURE_CLIENT_ID --body "your-client-id"

# Set environment secret
gh secret set PROD_API_KEY --env production --body "key"

# List secrets
gh secret list
```

---

## Environment Variable Best Practices

### .env Files (Development Only)

**✅ DO:**

```bash
# .env.example (committed to repo)
GITHUB_COPILOT_TOKEN=your-token-here
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
```

```python
# .gitignore
.env
.env.local
*.env.local
```

**❌ DON'T:**

```bash
# Never commit .env with real values!
# .env (DO NOT COMMIT)
GITHUB_COPILOT_TOKEN=ghp_realtoken123456
```

### Loading Environment Variables

```python
"""Safe environment variable loading."""

import os
from pathlib import Path


def load_env_file(env_file: Path = Path(".env")) -> None:
    """Load environment variables from file."""
    if not env_file.exists():
        return
    
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip("'\"")
            
            if key and value:
                os.environ[key] = value


def get_required_env(name: str) -> str:
    """Get required environment variable or raise."""
    value = os.getenv(name)
    if not value:
        raise ValueError(f"Required environment variable '{name}' not set")
    return value


def get_optional_env(name: str, default: str = "") -> str:
    """Get optional environment variable with default."""
    return os.getenv(name, default)


# Usage
load_env_file()
token = get_required_env("GITHUB_COPILOT_TOKEN")
```

### Python-dotenv (Recommended)

```bash
pip install python-dotenv
```

```python
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# Access variables
token = os.getenv("GITHUB_COPILOT_TOKEN")
```

---

## Credential Rotation

### Automated Rotation Script

```python
"""Credential rotation script."""

import keyring
import os
from datetime import datetime, timedelta
from pathlib import Path
import json


class CredentialRotator:
    """Manage credential rotation."""
    
    SERVICE_NAME = "grand-budapest-terminal"
    ROTATION_FILE = Path.home() / ".grand-budapest" / "rotations.json"
    
    def __init__(self, rotation_days: int = 90) -> None:
        """Initialize with rotation period."""
        self.rotation_days = rotation_days
        self.ROTATION_FILE.parent.mkdir(exist_ok=True)
    
    def needs_rotation(self, credential_name: str) -> bool:
        """Check if credential needs rotation."""
        if not self.ROTATION_FILE.exists():
            return True
        
        with open(self.ROTATION_FILE) as f:
            rotations = json.load(f)
        
        last_rotation = rotations.get(credential_name)
        if not last_rotation:
            return True
        
        last_date = datetime.fromisoformat(last_rotation)
        return datetime.now() - last_date > timedelta(days=self.rotation_days)
    
    def record_rotation(self, credential_name: str) -> None:
        """Record credential rotation."""
        rotations = {}
        if self.ROTATION_FILE.exists():
            with open(self.ROTATION_FILE) as f:
                rotations = json.load(f)
        
        rotations[credential_name] = datetime.now().isoformat()
        
        with open(self.ROTATION_FILE, "w") as f:
            json.dump(rotations, f, indent=2)
    
    def rotate_credential(
        self,
        credential_name: str,
        new_value: str,
    ) -> None:
        """Rotate a credential."""
        # Store new value
        keyring.set_password(
            self.SERVICE_NAME,
            credential_name,
            new_value
        )
        
        # Record rotation
        self.record_rotation(credential_name)
        
        print(f"✅ Rotated '{credential_name}'")


# Usage
rotator = CredentialRotator(rotation_days=90)

if rotator.needs_rotation("github-copilot-token"):
    print("⚠️  Token needs rotation!")
    # new_token = get_new_token()  # Your rotation logic
    # rotator.rotate_credential("github-copilot-token", new_token)
```

---

## Security Checklist

### ✅ DO

- Use Windows Credential Store for local development
- Use Azure Key Vault for production secrets
- Use GitHub Secrets for CI/CD
- Rotate credentials every 90 days
- Use managed identities when possible
- Apply principle of least privilege
- Audit credential access regularly
- Use different credentials per environment

### ❌ DON'T

- Store credentials in code or config files
- Commit `.env` files to Git
- Share credentials via email/chat
- Use production credentials in development
- Store credentials in plain text
- Use the same credential across services
- Leave default credentials unchanged

---

## Integration with justfile

```make
# Setup credential store
setup-credentials:
    python scripts/setup_credentials.py

# Rotate credentials
rotate-credentials:
    python scripts/rotate_credentials.py

# Check credential health
check-credentials:
    python scripts/check_credential_rotation.py
```

---

## References

- **OWASP Secrets Management**: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- **keyring Documentation**: https://github.com/jaraco/keyring
- **Azure Key Vault**: https://docs.microsoft.com/en-us/azure/key-vault/
- **DefaultAzureCredential**: See [Azure Credentials Guide](./azure-credentials.md)

---

**Next Steps:**
- Configure [Azure Key Vault with DefaultAzureCredential](./azure-credentials.md)
- Set up [GitHub Secrets](./github-secrets.md)
- Review [Secret Scanning](./secret-scanning.md)

---

*"A gentleman never reveals his secrets, but he always keeps them secure."* — M. Gustave H.
