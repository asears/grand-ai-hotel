# Dependencies and Licensing Information

> **Generated:** January 28, 2026  
> **Project:** Grand Budapest Terminal  
> **License:** CC0-1.0 (Public Domain)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Languages Used](#languages-used)
- [Python Dependencies](#python-dependencies)
- [TypeScript/Node.js Dependencies](#typescriptnodejs-dependencies)
- [Go Dependencies](#go-dependencies)
- [.NET Dependencies](#net-dependencies)
- [License Management Tools](#license-management-tools)
- [Security & Vulnerability Scanning](#security--vulnerability-scanning)
- [SBOM Generation](#sbom-generation)
- [License Compliance Summary](#license-compliance-summary)

---

## Overview

This document provides a comprehensive overview of all dependencies used in the Grand Budapest Terminal project across multiple programming languages, their licenses, and tools for managing security and compliance.

**Project License:** [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) (Public Domain Dedication)

---

## Languages Used

| Language   | Version | Purpose                           | Package Manager |
|------------|---------|-----------------------------------|-----------------|
| Python     | 3.11+   | Core automation, SDK examples     | uv, pip         |
| TypeScript | 5.3+    | Node.js SDK examples              | npm             |
| Go         | 1.22+   | Performance-critical examples     | go mod          |
| .NET/C#    | 8.0+    | Enterprise SDK examples           | NuGet           |

---

## Python Dependencies

### Production Dependencies

Defined in [`pyproject.toml`](./pyproject.toml)

| Package             | Version    | License     | Purpose                          | PyPI Link                                           |
|---------------------|------------|-------------|----------------------------------|-----------------------------------------------------|
| `github-copilot-sdk`| >=0.1.0    | MIT         | GitHub Copilot SDK integration   | [PyPI](https://pypi.org/project/github-copilot-sdk/)|
| `python-pptx`       | >=0.6.23   | MIT         | PowerPoint file creation         | [PyPI](https://pypi.org/project/python-pptx/)       |
| `python-docx`       | >=1.1.0    | MIT         | Word document processing         | [PyPI](https://pypi.org/project/python-docx/)       |
| `aiofiles`          | >=23.2.0   | Apache-2.0  | Async file I/O                   | [PyPI](https://pypi.org/project/aiofiles/)          |

### Development Dependencies

| Package           | Version | License    | Purpose                    | PyPI Link                                      |
|-------------------|---------|------------|----------------------------|------------------------------------------------|
| `pytest`          | latest  | MIT        | Testing framework          | [PyPI](https://pypi.org/project/pytest/)       |
| `pytest-asyncio`  | latest  | Apache-2.0 | Async pytest support       | [PyPI](https://pypi.org/project/pytest-asyncio/)|
| `pytest-mock`     | latest  | MIT        | Mocking for tests          | [PyPI](https://pypi.org/project/pytest-mock/)  |
| `pytest-cov`      | latest  | MIT        | Coverage reporting         | [PyPI](https://pypi.org/project/pytest-cov/)   |
| `ruff`            | latest  | MIT        | Linting and formatting     | [PyPI](https://pypi.org/project/ruff/)         |
| `prek`            | latest  | MIT        | Pre-commit hooks (Rust)    | [PyPI](https://pypi.org/project/prek/)         |
| `types-aiofiles`  | latest  | Apache-2.0 | Type stubs for aiofiles    | [PyPI](https://pypi.org/project/types-aiofiles/)|
| `ty`              | latest  | MIT        | Fast type checker          | [PyPI](https://pypi.org/project/ty/)           |

### Python Security & License Tools

| Tool              | Purpose                              | Installation                | Documentation                                    |
|-------------------|--------------------------------------|-----------------------------|--------------------------------------------------|
| `pip-licenses`    | List licenses of dependencies        | `pip install pip-licenses`  | [GitHub](https://github.com/raimon49/pip-licenses)|
| `safety`          | Check for known vulnerabilities      | `pip install safety`        | [Docs](https://docs.pyup.io/docs/safety-20-intro)|
| `pip-audit`       | Audit dependencies (PyPA official)   | `pip install pip-audit`     | [PyPI](https://pypi.org/project/pip-audit/)      |
| `licensecheck`    | Analyze license compatibility        | `pip install licensecheck`  | [PyPI](https://pypi.org/project/licensecheck/)   |

**Snyk for Python:**
- Dashboard: [Snyk Python Projects](https://snyk.io/vuln/pip)
- CLI: `npm install -g snyk && snyk test --file=requirements.txt`

---

## TypeScript/Node.js Dependencies

### Production Dependencies

Example from tutorial (`examples/typescript/package.json`):

| Package              | Version | License | Purpose                       | npm Link                                           |
|----------------------|---------|---------|-------------------------------|----------------------------------------------------|
| `@github/copilot-sdk`| latest  | MIT     | GitHub Copilot SDK            | [npm](https://www.npmjs.com/package/@github/copilot-sdk) |
| `pptxgenjs`          | ^3.12.0 | MIT     | PowerPoint generation         | [npm](https://www.npmjs.com/package/pptxgenjs)     |
| `docxtemplater`      | ^3.42.3 | MIT     | Word document templating      | [npm](https://www.npmjs.com/package/docxtemplater) |
| `pizzip`             | ^3.1.6  | MIT/GPL | ZIP file handling for docx    | [npm](https://www.npmjs.com/package/pizzip)        |

### Development Dependencies

| Package         | Version | License | Purpose                  | npm Link                                      |
|-----------------|---------|---------|--------------------------|-----------------------------------------------|
| `@types/node`   | ^20.0.0 | MIT     | TypeScript definitions   | [npm](https://www.npmjs.com/package/@types/node)|
| `typescript`    | ^5.3.0  | Apache-2.0| TypeScript compiler   | [npm](https://www.npmjs.com/package/typescript)|
| `jest`          | ^29.7.0 | MIT     | Testing framework        | [npm](https://www.npmjs.com/package/jest)     |
| `@types/jest`   | ^29.5.0 | MIT     | Jest type definitions    | [npm](https://www.npmjs.com/package/@types/jest)|
| `ts-jest`       | ^29.1.0 | MIT     | TypeScript Jest support  | [npm](https://www.npmjs.com/package/ts-jest)  |
| `eslint`        | ^8.56.0 | MIT     | Linting                  | [npm](https://www.npmjs.com/package/eslint)   |

### TypeScript/Node.js Security & License Tools

| Tool                | Purpose                              | Installation                     | Documentation                                    |
|---------------------|--------------------------------------|----------------------------------|--------------------------------------------------|
| `license-checker`   | List licenses of dependencies        | `npm install -g license-checker` | [npm](https://www.npmjs.com/package/license-checker)|
| `npm audit`         | Built-in vulnerability scanner       | Built into npm                   | [Docs](https://docs.npmjs.com/cli/v10/commands/npm-audit)|
| `yarn audit`        | Yarn's vulnerability scanner         | Built into Yarn                  | [Docs](https://yarnpkg.com/cli/audit)            |
| `licensee`          | License compliance checking          | `npm install -g licensee`        | [npm](https://www.npmjs.com/package/licensee)    |

**Snyk for Node.js:**
- Dashboard: [Snyk npm Vulnerabilities](https://snyk.io/vuln/npm)
- CLI: `npm install -g snyk && snyk test`

---

## Go Dependencies

### Production Dependencies

**⚠️ IMPORTANT:** The Go examples in this project currently reference dependencies with licensing issues:

| Package                          | Version | License      | Status     | Notes                                    |
|----------------------------------|---------|--------------|------------|------------------------------------------|
| `github.com/github/copilot-sdk/go` | v0.1.0  | MIT          | ✅ Active  | GitHub Copilot SDK for Go                |
| ~~`github.com/nguyenthenguyen/docx`~~ | ~~v1.0.0~~ | ~~Unknown~~  | ⚠️ **DEPRECATED** | Outdated, unmaintained                   |
| ~~`github.com/unidoc/unioffice`~~ | ~~v1.26.0~~ | ~~Commercial~~ | ⚠️ **REMOVED** | **Requires commercial license or trial** |

**Recommended Alternatives:**

| Package                     | Version | License | Purpose                      | Link                                           |
|-----------------------------|---------|---------|------------------------------|------------------------------------------------|
| `github.com/unidoc/unioffice` | -     | Commercial | **PLACEHOLDER - See note below** | [UniDoc](https://unidoc.io/)                  |
| Alternative: Manual XML     | -       | N/A     | Process Office Open XML manually | [ECMA-376](https://www.ecma-international.org/publications-and-standards/standards/ecma-376/) |

> **Note:** The UniDoc UniOffice library requires a commercial license. For tutorial purposes, we've replaced actual usage with placeholder comments. Production implementations should either:
> 1. Purchase a UniDoc license
> 2. Implement custom Office Open XML processing
> 3. Use cloud services (Microsoft Graph API)

### Go Security & License Tools

| Tool              | Purpose                              | Installation                | Documentation                                    |
|-------------------|--------------------------------------|-----------------------------|--------------------------------------------------|
| `go-licenses`     | List and check Go dependencies       | `go install github.com/google/go-licenses@latest` | [GitHub](https://github.com/google/go-licenses) |
| `nancy`           | Vulnerability scanner for Go         | `go install github.com/sonatype-nexus-community/nancy@latest` | [GitHub](https://github.com/sonatype-nexus-community/nancy) |
| `govulncheck`     | Official Go vulnerability scanner    | `go install golang.org/x/vuln/cmd/govulncheck@latest` | [Docs](https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck) |
| `trivy`           | Multi-language vulnerability scanner | See [Trivy Docs](https://trivy.dev/) | [GitHub](https://github.com/aquasecurity/trivy) |

**Snyk for Go:**
- Dashboard: [Snyk Go Vulnerabilities](https://snyk.io/vuln/golang)
- CLI: `snyk test --file=go.mod`

---

## .NET Dependencies

### Production Dependencies

Example from tutorial (`examples/dotnet/*.csproj`):

| Package                      | Version | License    | Purpose                      | NuGet Link                                           |
|------------------------------|---------|------------|------------------------------|------------------------------------------------------|
| `GitHub.Copilot.SDK`         | 0.1.0   | MIT        | GitHub Copilot SDK           | [NuGet](https://www.nuget.org/packages/GitHub.Copilot.SDK/) |
| `DocumentFormat.OpenXml`     | 3.0.0   | MIT        | Office document processing   | [NuGet](https://www.nuget.org/packages/DocumentFormat.OpenXml/) |

### .NET Security & License Tools

| Tool                  | Purpose                              | Installation                | Documentation                                    |
|-----------------------|--------------------------------------|-----------------------------|--------------------------------------------------|
| `dotnet list package` | List packages with vulnerabilities   | Built into .NET CLI         | [Docs](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-list-package) |
| `NuGetDefense`        | Check for known vulnerabilities      | `dotnet tool install --global NuGetDefense.Tool` | [GitHub](https://github.com/digitalcoyote/NuGetDefense) |
| `dotnet-outdated`     | Check for outdated packages          | `dotnet tool install --global dotnet-outdated-tool` | [GitHub](https://github.com/dotnet-outdated/dotnet-outdated) |
| `CycloneDX`           | Generate SBOM for .NET               | `dotnet tool install --global CycloneDX` | [GitHub](https://github.com/CycloneDX/cyclonedx-dotnet) |

**Snyk for .NET:**
- Dashboard: [Snyk NuGet Vulnerabilities](https://snyk.io/vuln/nuget)
- CLI: `snyk test --file=*.csproj`

---

## License Management Tools

### Cross-Language Tools

| Tool           | Languages          | Purpose                       | Link                                           |
|----------------|--------------------|-------------------------------|------------------------------------------------|
| **FOSSA**      | All                | License compliance automation | [fossa.com](https://fossa.com/)                |
| **Snyk**       | All                | Security & license scanning   | [snyk.io](https://snyk.io/)                    |
| **WhiteSource**| All                | Open source security & license| [mend.io](https://www.mend.io/)                |
| **Black Duck** | All                | SBOM & license compliance     | [blackducksoftware.com](https://www.blackducksoftware.com/) |
| **Trivy**      | All                | Vulnerability & license scan  | [trivy.dev](https://trivy.dev/)                |

### SPDX SBOM Generators

| Tool              | Format       | Languages | Command Example                          |
|-------------------|--------------|-----------|------------------------------------------|
| **syft**          | SPDX, CycloneDX | All    | `syft . -o spdx-json > sbom.spdx.json`   |
| **cdxgen**        | CycloneDX, SPDX | All    | `cdxgen -o sbom.json -t spdx`            |
| **sbom-tool**     | SPDX 2.2     | All       | `sbom-tool generate -b . -bc . -pn grand-budapest-terminal` |
| **CycloneDX CLI** | CycloneDX    | Multiple  | `cyclonedx-cli merge --input-files ...`  |

---

## Security & Vulnerability Scanning

### GitHub Security Features

- **Dependabot**: Automated dependency updates
  - Configuration: `.github/dependabot.yml`
  - [Enable Dependabot](https://docs.github.com/en/code-security/dependabot)

- **Code Scanning**: Security vulnerability detection
  - CodeQL analysis for multiple languages
  - [Setup CodeQL](https://docs.github.com/en/code-security/code-scanning)

- **Secret Scanning**: Detect committed secrets
  - Automatically enabled for public repos
  - [Docs](https://docs.github.com/en/code-security/secret-scanning)

### Snyk Integration

**Repository Security Dashboard:**
```
https://app.snyk.io/org/[your-org]/projects
```

**Language-Specific Scans:**
```bash
# Python
snyk test --file=requirements.txt

# Node.js
snyk test --file=package.json

# Go
snyk test --file=go.mod

# .NET
snyk test --file=YourProject.csproj
```

**Monitor for Continuous Scanning:**
```bash
snyk monitor --all-projects
```

### Safety Database (Python)

```bash
# Install
pip install safety

# Scan dependencies
safety check

# JSON output
safety check --json
```

---

## SBOM Generation

### Generating SPDX SBOM

**Using Microsoft's sbom-tool:**

```bash
# Install
dotnet tool install --global Microsoft.Sbom.DotNetTool

# Generate SBOM
sbom-tool generate \
  -b . \
  -bc . \
  -pn "grand-budapest-terminal" \
  -pv "1.0.0" \
  -ps "The Grand Budapest Terminal Ensemble" \
  -nsb "https://github.com/asears/grand-ai-hotel"
```

**Using Syft:**

```bash
# Install (macOS/Linux)
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin

# Windows (PowerShell)
iwr -useb https://raw.githubusercontent.com/anchore/syft/main/install.ps1 | iex

# Generate SPDX SBOM
syft . -o spdx-json=sbom.spdx.json
syft . -o spdx=sbom.spdx
```

**Using CycloneDX:**

```bash
# Python
pip install cyclonedx-bom
cyclonedx-py requirements requirements.txt -o sbom.json

# Node.js
npx @cyclonedx/cyclonedx-npm --output-file sbom.json

# .NET
dotnet tool install --global CycloneDX
dotnet CycloneDX YourProject.csproj -o sbom.json
```

---

## License Compliance Summary

### Permissive Licenses (✅ Compatible)

All production dependencies use permissive licenses compatible with CC0-1.0:

- **MIT License**: Most dependencies (Copilot SDK, python-pptx, pptxgenjs, etc.)
- **Apache-2.0**: aiofiles, TypeScript compiler
- **CC0-1.0**: This project (Public Domain)

### Restrictive Licenses (⚠️ Removed)

The following dependencies with restrictive licenses have been **removed** or **marked as placeholders**:

| Dependency              | License      | Status      | Resolution                               |
|-------------------------|--------------|-------------|------------------------------------------|
| `unidoc/unioffice` (Go) | Commercial   | **REMOVED** | Replaced with placeholder comments       |
| `nguyenthenguyen/docx`  | Unknown      | **REMOVED** | Deprecated, replaced with TODO comment   |

### License Compatibility Matrix

| Source License | Compatible With CC0-1.0 | Notes                                |
|----------------|-------------------------|--------------------------------------|
| MIT            | ✅ Yes                  | Permissive, attribution recommended  |
| Apache-2.0     | ✅ Yes                  | Permissive, patent grant             |
| BSD-3-Clause   | ✅ Yes                  | Permissive, attribution required     |
| CC0-1.0        | ✅ Yes                  | Public domain dedication             |
| GPL-3.0        | ⚠️ Copyleft             | Requires derivative works be GPL     |
| Commercial     | ❌ No                   | Requires license purchase            |
| Unknown        | ❌ No                   | Cannot verify compatibility          |

---

## Recommended Actions

### Immediate Actions

1. **Remove Commercial Dependencies**
   - ✅ Marked UniOffice usage as placeholder in tutorials
   - ✅ Added TODO comments for alternative solutions

2. **Generate SBOM**
   ```bash
   # Install syft
   curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh
   
   # Generate SPDX SBOM
   syft . -o spdx-json > SBOM.spdx.json
   ```

3. **Run Security Scans**
   ```bash
   # Python
   pip install pip-audit safety
   pip-audit
   safety check
   
   # Node.js
   npm audit
   
   # Go
   go install golang.org/x/vuln/cmd/govulncheck@latest
   govulncheck ./...
   
   # .NET
   dotnet list package --vulnerable
   ```

### Ongoing Maintenance

1. **Enable Dependabot**
   - Create `.github/dependabot.yml`
   - Configure for Python, npm, Go modules, NuGet

2. **Regular License Audits**
   ```bash
   # Python
   pip-licenses --format=markdown > python-licenses.md
   
   # Node.js
   npx license-checker --markdown > nodejs-licenses.md
   
   # Go
   go-licenses report ./... --template=licenses.md.tpl
   
   # .NET
   dotnet list package --include-transitive
   ```

3. **Continuous Monitoring**
   - Set up Snyk continuous monitoring
   - Enable GitHub security alerts
   - Review security advisories weekly

---

## Additional Resources

### Documentation
- [SPDX Specification](https://spdx.dev/specifications/)
- [CycloneDX Specification](https://cyclonedx.org/specification/overview/)
- [OSI Approved Licenses](https://opensource.org/licenses)
- [GitHub Licensing Guide](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)

### Tools Documentation
- [Syft Documentation](https://github.com/anchore/syft)
- [Microsoft SBOM Tool](https://github.com/microsoft/sbom-tool)
- [Snyk CLI](https://docs.snyk.io/snyk-cli)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)

### Compliance Resources
- [FOSSA Blog](https://fossa.com/blog/)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)
- [National Vulnerability Database](https://nvd.nist.gov/)
- [OSS Review Toolkit](https://github.com/oss-review-toolkit/ort)

---

## License

This document is part of the Grand Budapest Terminal project, licensed under [CC0-1.0](./LICENSE) (Public Domain).

**Last Updated:** January 28, 2026  
**Maintained By:** The Grand Budapest Terminal Ensemble
