# Local HTTPS Development Guide

## Overview

Using HTTPS in local development ensures your environment matches production and prevents issues with secure contexts, cookies, service workers, and modern web APIs.

## Why HTTPS Matters for Local Development

### Security and Compliance

Following **OWASP A02:2021 – Cryptographic Failures**:

- ✅ Test security features in realistic environment
- ✅ Catch mixed content warnings early
- ✅ Ensure secure cookie handling works
- ✅ Validate CSP and security headers

### Modern Web Features Requiring HTTPS

Many APIs require secure contexts (HTTPS):

```javascript
// These APIs require HTTPS (except localhost)
navigator.geolocation
navigator.mediaDevices.getUserMedia()
navigator.clipboard
navigator.serviceWorker
WebAuthn / Web Authentication
Payment Request API
HTTP/2 and HTTP/3
```

### Production Parity

**Development should mirror production:**

```
Development (HTTPS) → Staging (HTTPS) → Production (HTTPS)
         ↓                  ↓                    ↓
    Same security context across all environments
```

---

## mkcert: Local Certificate Authority

**mkcert** creates locally-trusted development certificates with zero configuration.

### Installation

#### Windows

```powershell
# Using Chocolatey
choco install mkcert

# Using Scoop
scoop bucket add extras
scoop install mkcert

# Manual download
# Download from: https://github.com/FiloSottile/mkcert/releases
```

#### Verify Installation

```powershell
mkcert -version
# Output: v1.4.4 (or later)
```

### Initial Setup

```powershell
# Install local CA (one-time setup)
mkcert -install

# Output:
# Created a new local CA 💥
# The local CA is now installed in the system trust store! ⚡️
```

**What this does:**
- Creates a local Certificate Authority (CA)
- Installs CA certificate in Windows trust store
- Stores CA in: `%LocalAppData%\mkcert`

---

## Generating Certificates

### Basic Certificate Generation

```powershell
# Navigate to project directory
cd C:\projects\ai\copilot

# Create certs directory
New-Item -ItemType Directory -Force -Path ".\certs"

# Generate certificate
mkcert -cert-file certs\localhost.pem -key-file certs\localhost-key.pem localhost 127.0.0.1 ::1

# Output:
# Created a new certificate valid for the following names 📜
#  - "localhost"
#  - "127.0.0.1"
#  - "::1"
#
# The certificate is at "certs\localhost.pem" and the key at "certs\localhost-key.pem" ✅
```

### Multiple Domains

```powershell
# Generate certificate for multiple domains
mkcert -cert-file certs\dev.pem -key-file certs\dev-key.pem \
  localhost \
  127.0.0.1 \
  ::1 \
  grandbudapest.local \
  *.grandbudapest.local

# Now valid for:
# - localhost
# - 127.0.0.1
# - ::1 (IPv6 localhost)
# - grandbudapest.local
# - *.grandbudapest.local (wildcard)
```

### Custom Domains (hosts file)

```powershell
# Edit hosts file (requires admin)
notepad C:\Windows\System32\drivers\etc\hosts

# Add entries:
# 127.0.0.1  grandbudapest.local
# 127.0.0.1  api.grandbudapest.local
# 127.0.0.1  app.grandbudapest.local

# Generate certificate
mkcert -cert-file certs\custom.pem -key-file certs\custom-key.pem \
  grandbudapest.local \
  api.grandbudapest.local \
  app.grandbudapest.local
```

---

## Configuring Development Servers

### Python (Flask)

```python
"""Flask app with HTTPS."""

from flask import Flask

app = Flask(__name__)


@app.route("/")
def index():
    return "Hello from HTTPS!"


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        ssl_context=(
            "certs/localhost.pem",      # Certificate
            "certs/localhost-key.pem"   # Private key
        ),
        debug=True
    )
```

**Run:**
```bash
python app.py
# Visit: https://localhost:5000
```

### Python (FastAPI/Uvicorn)

```python
"""FastAPI app with HTTPS."""

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello from HTTPS!"}


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        ssl_keyfile="certs/localhost-key.pem",
        ssl_certfile="certs/localhost.pem",
    )
```

**Run:**
```bash
python main.py
# Visit: https://localhost:8000
```

**Or via CLI:**
```bash
uvicorn main:app \
  --host 127.0.0.1 \
  --port 8000 \
  --ssl-keyfile certs/localhost-key.pem \
  --ssl-certfile certs/localhost.pem \
  --reload
```

### Node.js (Express)

```javascript
// server.js
const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from HTTPS!');
});

const options = {
  key: fs.readFileSync('certs/localhost-key.pem'),
  cert: fs.readFileSync('certs/localhost.pem')
};

https.createServer(options, app).listen(3000, () => {
  console.log('HTTPS server running on https://localhost:3000');
});
```

**Run:**
```bash
node server.js
# Visit: https://localhost:3000
```

### Node.js (Vite)

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('certs/localhost-key.pem'),
      cert: fs.readFileSync('certs/localhost.pem')
    },
    port: 5173
  }
});
```

**Run:**
```bash
npm run dev
# Visit: https://localhost:5173
```

### Go (Standard Library)

```go
// main.go
package main

import (
    "fmt"
    "log"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello from HTTPS!")
}

func main() {
    http.HandleFunc("/", handler)
    
    log.Println("HTTPS server running on https://localhost:8080")
    err := http.ListenAndServeTLS(
        ":8080",
        "certs/localhost.pem",
        "certs/localhost-key.pem",
        nil,
    )
    if err != nil {
        log.Fatal(err)
    }
}
```

**Run:**
```bash
go run main.go
# Visit: https://localhost:8080
```

### .NET (ASP.NET Core)

```csharp
// Program.cs
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.Server.Kestrel.Https;
using System.Security.Cryptography.X509Certificates;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel for HTTPS
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5001, listenOptions =>
    {
        listenOptions.UseHttps(
            "certs/localhost.pem",
            "certs/localhost-key.pem"
        );
    });
});

var app = builder.Build();

app.MapGet("/", () => "Hello from HTTPS!");

app.Run();
```

**Or via appsettings.json:**

```json
{
  "Kestrel": {
    "Endpoints": {
      "Https": {
        "Url": "https://localhost:5001",
        "Certificate": {
          "Path": "certs/localhost.pem",
          "KeyPath": "certs/localhost-key.pem"
        }
      }
    }
  }
}
```

**Run:**
```bash
dotnet run
# Visit: https://localhost:5001
```

---

## Managing Certificates

### Directory Structure

```
C:\projects\ai\copilot\
├── certs\
│   ├── localhost.pem          # Certificate
│   ├── localhost-key.pem      # Private key (DO NOT COMMIT!)
│   ├── dev.pem               # Custom domain cert
│   └── dev-key.pem           # Custom domain key
├── .gitignore                # Exclude certs directory
└── README.md
```

### .gitignore Configuration

```bash
# .gitignore
# SSL Certificates (regenerate locally with mkcert)
certs/
*.pem
*.key
*.crt
*.pfx

# mkcert CA (never commit!)
rootCA.pem
rootCA-key.pem
```

**✅ DO:** Commit certificate generation script  
**❌ DON'T:** Commit actual certificates or keys

### Certificate Generation Script

```powershell
# scripts/setup-https.ps1

<#
.SYNOPSIS
    Setup HTTPS certificates for local development
#>

param(
    [string]$Domain = "localhost"
)

# Check if mkcert is installed
if (-not (Get-Command mkcert -ErrorAction SilentlyContinue)) {
    Write-Error "mkcert not found. Install with: choco install mkcert"
    exit 1
}

# Create certs directory
$certsDir = Join-Path $PSScriptRoot ".." "certs"
New-Item -ItemType Directory -Force -Path $certsDir | Out-Null

# Install local CA (if not already installed)
Write-Host "📜 Installing local CA..."
mkcert -install

# Generate certificates
Write-Host "🔐 Generating certificates for $Domain..."
$certPath = Join-Path $certsDir "$Domain.pem"
$keyPath = Join-Path $certsDir "$Domain-key.pem"

mkcert -cert-file $certPath -key-file $keyPath $Domain 127.0.0.1 ::1

Write-Host "✅ Certificates generated:"
Write-Host "   Certificate: $certPath"
Write-Host "   Private Key: $keyPath"
Write-Host ""
Write-Host "🚀 You can now run your dev server with HTTPS!"
```

**Usage:**
```powershell
.\scripts\setup-https.ps1
.\scripts\setup-https.ps1 -Domain "grandbudapest.local"
```

---

## Troubleshooting

### Certificate Not Trusted

**Symptom:** Browser shows "Not Secure" or certificate warning

**Solution:**
```powershell
# Reinstall local CA
mkcert -uninstall
mkcert -install

# Regenerate certificates
mkcert -cert-file certs\localhost.pem -key-file certs\localhost-key.pem localhost 127.0.0.1 ::1
```

### CA Location

```powershell
# Find CA certificate location
mkcert -CAROOT

# Output: C:\Users\YourName\AppData\Local\mkcert
```

### Mixed Content Warnings

**Problem:** HTTPS page loading HTTP resources

**Solution:**
```html
<!-- ❌ Bad: HTTP resource on HTTPS page -->
<script src="http://example.com/script.js"></script>

<!-- ✅ Good: Protocol-relative or HTTPS -->
<script src="//example.com/script.js"></script>
<script src="https://example.com/script.js"></script>
```

### Certificate Expired

**Problem:** mkcert certificates expire after 10 years

**Solution:**
```powershell
# Regenerate certificate
mkcert -cert-file certs\localhost.pem -key-file certs\localhost-key.pem localhost 127.0.0.1 ::1
```

### Port Already in Use

**Problem:** `Address already in use`

**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :443

# Kill process (if safe)
taskkill /PID <pid> /F

# Or use different port
```

### Firefox Not Trusting Certificate

**Problem:** Firefox has its own certificate store

**Solution:**
```powershell
# mkcert -install automatically handles Firefox
# If issues persist:
mkcert -uninstall
mkcert -install

# Verify Firefox is running during install
```

---

## Security Considerations

### Development vs Production Certificates

| Aspect | Development (mkcert) | Production |
|--------|---------------------|------------|
| CA | Self-signed local CA | Public CA (Let's Encrypt, DigiCert) |
| Trust | Local machine only | Globally trusted |
| Validity | 10 years | 90 days (Let's Encrypt) |
| Cost | Free | Free (Let's Encrypt) or Paid |
| Use Case | Local development | Public-facing servers |

### Best Practices

✅ **DO:**
- Use mkcert for local development only
- Add `certs/` to `.gitignore`
- Generate certificates per developer
- Use HTTPS for all local development
- Test with real domains via hosts file
- Rotate certificates annually

❌ **DON'T:**
- Use self-signed certs in production
- Commit certificates to repository
- Share CA private keys
- Use production certificates locally
- Ignore certificate warnings
- Use HTTP for authentication testing

---

## Advanced: Reverse Proxy with Caddy

For complex setups, use Caddy as reverse proxy:

### Installation

```powershell
winget install Caddy.Caddy
```

### Caddyfile Configuration

```caddyfile
# Caddyfile
grandbudapest.local {
    tls certs/localhost.pem certs/localhost-key.pem
    
    # Reverse proxy to backend
    reverse_proxy localhost:8000
}

api.grandbudapest.local {
    tls certs/localhost.pem certs/localhost-key.pem
    
    # Reverse proxy to API
    reverse_proxy localhost:5000
}
```

**Run:**
```powershell
caddy run --config Caddyfile
```

---

## Integration with justfile

```make
# Setup HTTPS certificates
setup-https:
    @echo "🔐 Setting up HTTPS certificates..."
    mkcert -install
    mkcert -cert-file certs/localhost.pem -key-file certs/localhost-key.pem localhost 127.0.0.1 ::1
    @echo "✅ HTTPS setup complete"

# Run dev server with HTTPS
dev-https:
    uvicorn main:app --host 127.0.0.1 --port 8000 \
      --ssl-keyfile certs/localhost-key.pem \
      --ssl-certfile certs/localhost.pem \
      --reload

# Clean certificates
clean-certs:
    rm -rf certs/
    @echo "🧹 Certificates removed. Run 'just setup-https' to regenerate."
```

---

## Testing HTTPS Locally

### Verify Certificate

```powershell
# PowerShell: Check certificate details
$cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2("certs\localhost.pem")
$cert | Format-List

# Output shows:
# Subject, Issuer, NotAfter, NotBefore, Thumbprint
```

### curl Testing

```bash
# Test HTTPS endpoint
curl https://localhost:8000

# Verify certificate
curl -v https://localhost:8000

# Ignore certificate (debugging only)
curl -k https://localhost:8000
```

### Browser DevTools

1. Open DevTools (F12)
2. Security tab
3. Verify:
   - ✅ Connection is secure
   - ✅ Certificate is valid
   - ✅ Issued by: mkcert

---

## References

- **mkcert Repository**: https://github.com/FiloSottile/mkcert
- **OWASP Transport Layer Security**: https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html
- **MDN Secure Contexts**: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
- **Let's Encrypt (Production)**: https://letsencrypt.org/

---

**Next Steps:**
- Configure [Credential Management](./credential-management.md)
- Set up [Azure Credentials](./azure-credentials.md)
- Review [Secret Scanning](./secret-scanning.md)

---

*"Even in development, one must maintain the highest standards of security and elegance."* — M. Gustave H.
