# Security Policy

## Overview

Security is a top priority for The Grand Budapest Terminal. This document outlines our security practices, how to report vulnerabilities, and where to find detailed security guides.

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| < 1.0   | :x:                |

**Note:** As this project is in active development, we recommend always using the latest version from the `main` branch.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

### Preferred Methods

1. **GitHub Security Advisories** (Recommended)
   - Navigate to the Security tab in this repository
   - Click "Report a vulnerability"
   - Provide detailed information about the vulnerability

2. **Email**
   - Send details to: `security@grandbudapest.dev` (if configured)
   - Use PGP key: `[Your PGP Key ID]` for sensitive information

### What to Include

Please include as much of the following information as possible:

- Type of vulnerability (e.g., credential exposure, injection, authentication bypass)
- Full paths of affected source files
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Depends on severity (see below)

#### Severity Levels

- **Critical:** Fix within 24-48 hours
- **High:** Fix within 7 days
- **Medium:** Fix within 30 days
- **Low:** Fix in next regular release

## Security Update Schedule

- **Critical/High vulnerabilities:** Immediate patch release
- **Medium/Low vulnerabilities:** Included in next scheduled release
- **Dependency updates:** Weekly automated checks via Dependabot
- **Security audits:** Quarterly reviews

## Security Best Practices

This project follows OWASP security guidelines and implements multiple layers of security:

### 🔐 Credential Management
- Never commit secrets to the repository
- Use secure credential stores (Windows Credential Manager, Azure Key Vault)
- Leverage managed identities and OIDC when possible
- Rotate credentials regularly

### 🔍 Secret Scanning
- Pre-commit hooks with `detect-secrets` and `gitleaks`
- GitHub Advanced Security secret scanning enabled
- Automated scanning of commit history with `truffleHog`

### 🔒 HTTPS Everywhere
- Local development uses HTTPS via `mkcert`
- All API communications encrypted in transit
- Certificate validation enforced

### 🛡️ Dependency Security
- Automated vulnerability scanning with Dependabot
- Regular dependency updates
- SBOM (Software Bill of Materials) maintained

## Detailed Security Guides

For implementation details and step-by-step guides, see our security documentation:

### Core Security Documentation

1. **[Secret Scanning Guide](.github/SECURITY/secret-scanning.md)**
   - Tools: detect-secrets, gitleaks, truffleHog
   - Pre-commit hook configuration
   - Secret pattern detection
   - Remediation procedures

2. **[Credential Management Guide](.github/SECURITY/credential-management.md)**
   - Windows Credential Store integration
   - Azure Key Vault usage
   - GitHub Secrets management
   - Environment variable best practices

3. **[Local HTTPS Setup](.github/SECURITY/https-local-dev.md)**
   - Installing and configuring mkcert
   - Certificate generation and trust
   - Dev server configuration (Python/Node/Go/.NET)
   - Troubleshooting guide

4. **[Azure Credentials Guide](.github/SECURITY/azure-credentials.md)**
   - DefaultAzureCredential usage
   - Managed Identity configuration
   - Service Principal vs OIDC
   - Multi-language examples

5. **[GitHub Secrets Guide](.github/SECURITY/github-secrets.md)**
   - Repository and environment secrets
   - OIDC token configuration
   - Secret rotation workflows
   - Dependabot secret management

## Security Tools in Use

| Tool | Purpose | Documentation |
|------|---------|---------------|
| `detect-secrets` | Pre-commit secret scanning | [secret-scanning.md](.github/SECURITY/secret-scanning.md) |
| `gitleaks` | Git secret detection | [secret-scanning.md](.github/SECURITY/secret-scanning.md) |
| `truffleHog` | Repository history scanning | [secret-scanning.md](.github/SECURITY/secret-scanning.md) |
| `prek` | Pre-commit hook manager | [secret-scanning.md](.github/SECURITY/secret-scanning.md) |
| `mkcert` | Local HTTPS certificates | [https-local-dev.md](.github/SECURITY/https-local-dev.md) |
| `keyring` | Secure credential storage | [credential-management.md](.github/SECURITY/credential-management.md) |
| Dependabot | Dependency vulnerability scanning | GitHub Settings |
| GitHub Advanced Security | Code scanning & secret detection | GitHub Settings |

## Compliance and Standards

This project aims to comply with:

- **OWASP Top 10** - Application Security Risks
- **OWASP ASVS** - Application Security Verification Standard
- **CWE Top 25** - Most Dangerous Software Weaknesses
- **NIST Cybersecurity Framework** - Core security practices

## Security Checklist for Contributors

Before submitting a PR, ensure:

- [ ] No hardcoded credentials or secrets
- [ ] Pre-commit hooks pass (detect-secrets, gitleaks)
- [ ] Dependencies have no known vulnerabilities
- [ ] Sensitive data is encrypted at rest and in transit
- [ ] Input validation implemented where applicable
- [ ] Authentication and authorization properly implemented
- [ ] Error messages don't leak sensitive information

## Security Contact

For security-related questions or concerns:

- **Security Team:** security@grandbudapest.dev
- **Maintainers:** See [MAINTAINERS.md](MAINTAINERS.md)
- **GitHub Security Advisories:** [Security Tab](../../security/advisories)

## Acknowledgments

We thank the security community for responsibly disclosing vulnerabilities and helping us maintain a secure codebase.

---

**Last Updated:** January 2026  
**Next Review:** April 2026

*"Security, like hospitality, is not a one-time achievement but a continuous practice."* — M. Gustave H.
