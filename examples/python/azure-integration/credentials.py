"""
Azure DefaultAzureCredential chain demonstration.

Shows how DefaultAzureCredential tries multiple authentication methods
in a specific order to authenticate with Azure services.

Example:
    >>> from credentials import AzureAuthDemo
    >>> demo = AzureAuthDemo()
    >>> demo.demonstrate_credential_chain()
"""

from azure.core.credentials import AccessToken
from azure.identity import (
    AzureCliCredential,
    AzurePowerShellCredential,
    ChainedTokenCredential,
    DefaultAzureCredential,
    EnvironmentCredential,
    ManagedIdentityCredential,
    WorkloadIdentityCredential,
)
from loguru import logger


class AzureAuthDemo:
    """
    Demonstrates Azure authentication credential chain.
    
    DefaultAzureCredential tries credentials in this order:
    1. EnvironmentCredential - Environment variables
    2. WorkloadIdentityCredential - Kubernetes workload identity
    3. ManagedIdentityCredential - Azure Managed Identity
    4. AzureCliCredential - Azure CLI (az login)
    5. AzurePowerShellCredential - Azure PowerShell
    6. InteractiveBrowserCredential - Browser login (fallback)
    
    Example:
        >>> demo = AzureAuthDemo()
        >>> credential = demo.get_default_credential()
        >>> token = credential.get_token("https://management.azure.com/.default")
    """
    
    def __init__(self) -> None:
        """Initialize Azure authentication demo."""
        logger.info("Initializing Azure authentication demo")
    
    def get_default_credential(self) -> DefaultAzureCredential:
        """
        Get DefaultAzureCredential instance.
        
        Returns:
            DefaultAzureCredential instance
            
        Example:
            >>> demo = AzureAuthDemo()
            >>> credential = demo.get_default_credential()
        """
        logger.info("Creating DefaultAzureCredential")
        return DefaultAzureCredential()
    
    def demonstrate_credential_chain(self) -> dict[str, bool]:
        """
        Demonstrate which credentials in the chain are available.
        
        Returns:
            Dictionary mapping credential type to availability
            
        Example:
            >>> demo = AzureAuthDemo()
            >>> results = demo.demonstrate_credential_chain()
            >>> print(results)
            {
                'EnvironmentCredential': False,
                'ManagedIdentityCredential': False,
                'AzureCliCredential': True,
                ...
            }
        """
        logger.info("Testing credential chain availability")
        
        scope = "https://management.azure.com/.default"
        results: dict[str, bool] = {}
        
        # Test EnvironmentCredential
        logger.info("Testing EnvironmentCredential...")
        try:
            cred = EnvironmentCredential()
            token = cred.get_token(scope)
            results["EnvironmentCredential"] = True
            logger.info("✓ EnvironmentCredential available")
        except Exception as e:
            results["EnvironmentCredential"] = False
            logger.info(f"✗ EnvironmentCredential not available: {type(e).__name__}")
        
        # Test WorkloadIdentityCredential
        logger.info("Testing WorkloadIdentityCredential...")
        try:
            cred = WorkloadIdentityCredential()
            token = cred.get_token(scope)
            results["WorkloadIdentityCredential"] = True
            logger.info("✓ WorkloadIdentityCredential available")
        except Exception as e:
            results["WorkloadIdentityCredential"] = False
            logger.info(f"✗ WorkloadIdentityCredential not available: {type(e).__name__}")
        
        # Test ManagedIdentityCredential
        logger.info("Testing ManagedIdentityCredential...")
        try:
            cred = ManagedIdentityCredential()
            token = cred.get_token(scope)
            results["ManagedIdentityCredential"] = True
            logger.info("✓ ManagedIdentityCredential available")
        except Exception as e:
            results["ManagedIdentityCredential"] = False
            logger.info(f"✗ ManagedIdentityCredential not available: {type(e).__name__}")
        
        # Test AzureCliCredential
        logger.info("Testing AzureCliCredential...")
        try:
            cred = AzureCliCredential()
            token = cred.get_token(scope)
            results["AzureCliCredential"] = True
            logger.info("✓ AzureCliCredential available")
        except Exception as e:
            results["AzureCliCredential"] = False
            logger.info(f"✗ AzureCliCredential not available: {type(e).__name__}")
        
        # Test AzurePowerShellCredential
        logger.info("Testing AzurePowerShellCredential...")
        try:
            cred = AzurePowerShellCredential()
            token = cred.get_token(scope)
            results["AzurePowerShellCredential"] = True
            logger.info("✓ AzurePowerShellCredential available")
        except Exception as e:
            results["AzurePowerShellCredential"] = False
            logger.info(f"✗ AzurePowerShellCredential not available: {type(e).__name__}")
        
        return results
    
    def create_custom_credential_chain(
        self,
        prefer_cli: bool = True,
    ) -> ChainedTokenCredential:
        """
        Create custom credential chain with specific order.
        
        Args:
            prefer_cli: Prioritize CLI credential over others
            
        Returns:
            Custom chained credential
            
        Example:
            >>> demo = AzureAuthDemo()
            >>> credential = demo.create_custom_credential_chain(prefer_cli=True)
        """
        logger.info("Creating custom credential chain")
        
        if prefer_cli:
            # Prefer Azure CLI for local development
            credentials = [
                AzureCliCredential(),
                EnvironmentCredential(),
                ManagedIdentityCredential(),
            ]
        else:
            # Standard order
            credentials = [
                EnvironmentCredential(),
                ManagedIdentityCredential(),
                AzureCliCredential(),
            ]
        
        return ChainedTokenCredential(*credentials)
    
    def get_token_info(self, credential: DefaultAzureCredential) -> dict[str, str]:
        """
        Get token information from credential.
        
        Args:
            credential: Azure credential
            
        Returns:
            Token information
            
        Example:
            >>> demo = AzureAuthDemo()
            >>> cred = demo.get_default_credential()
            >>> info = demo.get_token_info(cred)
        """
        logger.info("Retrieving token information")
        
        try:
            scope = "https://management.azure.com/.default"
            token = credential.get_token(scope)
            
            return {
                "token_preview": f"{token.token[:20]}...",
                "expires_on": str(token.expires_on),
                "scope": scope,
            }
        except Exception as e:
            logger.error(f"Failed to get token: {e}")
            raise
    
    def demonstrate_environment_credential(self) -> None:
        """
        Demonstrate EnvironmentCredential usage.
        
        Requires environment variables:
        - AZURE_TENANT_ID
        - AZURE_CLIENT_ID
        - AZURE_CLIENT_SECRET
        
        Example:
            >>> import os
            >>> os.environ['AZURE_TENANT_ID'] = 'your-tenant-id'
            >>> os.environ['AZURE_CLIENT_ID'] = 'your-client-id'
            >>> os.environ['AZURE_CLIENT_SECRET'] = 'your-secret'
            >>> demo = AzureAuthDemo()
            >>> demo.demonstrate_environment_credential()
        """
        import os
        
        logger.info("Demonstrating EnvironmentCredential")
        
        required_vars = [
            "AZURE_TENANT_ID",
            "AZURE_CLIENT_ID",
            "AZURE_CLIENT_SECRET",
        ]
        
        missing = [var for var in required_vars if not os.getenv(var)]
        
        if missing:
            logger.warning(
                f"Missing environment variables: {', '.join(missing)}"
            )
            logger.info(
                "Set these variables to use EnvironmentCredential:\n"
                "  export AZURE_TENANT_ID=<tenant-id>\n"
                "  export AZURE_CLIENT_ID=<client-id>\n"
                "  export AZURE_CLIENT_SECRET=<client-secret>"
            )
            return
        
        try:
            credential = EnvironmentCredential()
            token = credential.get_token("https://management.azure.com/.default")
            logger.info("✓ Successfully authenticated with EnvironmentCredential")
            logger.info(f"Token expires: {token.expires_on}")
        except Exception as e:
            logger.error(f"EnvironmentCredential failed: {e}")
    
    def demonstrate_managed_identity(self) -> None:
        """
        Demonstrate ManagedIdentityCredential usage.
        
        Only works when running on Azure resources:
        - Azure App Service
        - Azure Container Apps
        - Azure Functions
        - Azure Virtual Machines
        - Azure Kubernetes Service
        
        Example:
            >>> demo = AzureAuthDemo()
            >>> demo.demonstrate_managed_identity()
        """
        logger.info("Demonstrating ManagedIdentityCredential")
        
        try:
            # System-assigned managed identity
            credential = ManagedIdentityCredential()
            token = credential.get_token("https://management.azure.com/.default")
            logger.info("✓ Successfully authenticated with Managed Identity")
            logger.info(f"Token expires: {token.expires_on}")
        except Exception as e:
            logger.warning(
                "ManagedIdentityCredential not available. "
                "This is normal when running locally. "
                "Managed Identity only works on Azure resources."
            )
            logger.debug(f"Error: {e}")
    
    def demonstrate_azure_cli_credential(self) -> None:
        """
        Demonstrate AzureCliCredential usage.
        
        Requires Azure CLI to be installed and logged in:
        $ az login
        
        Example:
            >>> demo = AzureAuthDemo()
            >>> demo.demonstrate_azure_cli_credential()
        """
        logger.info("Demonstrating AzureCliCredential")
        
        try:
            credential = AzureCliCredential()
            token = credential.get_token("https://management.azure.com/.default")
            logger.info("✓ Successfully authenticated with Azure CLI")
            logger.info(f"Token expires: {token.expires_on}")
            logger.info("Azure CLI credential is perfect for local development!")
        except Exception as e:
            logger.error("AzureCliCredential failed. Run 'az login' first.")
            logger.debug(f"Error: {e}")


def main() -> None:
    """
    Main demonstration of Azure authentication.
    
    Shows different credential types and the DefaultAzureCredential chain.
    """
    logger.info("=== Azure Authentication Demo ===\n")
    
    demo = AzureAuthDemo()
    
    # Test credential chain
    logger.info("1. Testing credential chain availability:")
    results = demo.demonstrate_credential_chain()
    logger.info(f"\nResults: {results}\n")
    
    # Show environment credential
    logger.info("2. Environment Credential:")
    demo.demonstrate_environment_credential()
    logger.info("")
    
    # Show managed identity
    logger.info("3. Managed Identity:")
    demo.demonstrate_managed_identity()
    logger.info("")
    
    # Show Azure CLI
    logger.info("4. Azure CLI Credential:")
    demo.demonstrate_azure_cli_credential()
    logger.info("")
    
    # Try DefaultAzureCredential
    logger.info("5. DefaultAzureCredential (tries all in order):")
    try:
        credential = demo.get_default_credential()
        info = demo.get_token_info(credential)
        logger.info(f"✓ Successfully authenticated!")
        logger.info(f"Token info: {info}")
    except Exception as e:
        logger.error(f"DefaultAzureCredential failed: {e}")
        logger.info(
            "\nTo authenticate, use one of:\n"
            "  - az login (for local development)\n"
            "  - Set environment variables (AZURE_TENANT_ID, etc.)\n"
            "  - Run on Azure resource with Managed Identity"
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
