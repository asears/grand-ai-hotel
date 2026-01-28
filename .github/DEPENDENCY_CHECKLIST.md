# License & Security Management Checklist

> Quick reference for Grand Budapest Terminal developers

---

## 🔍 Before Adding a New Dependency

- [ ] Check the license (must be MIT, Apache-2.0, BSD, or similar permissive)
- [ ] Verify on Snyk vulnerability database
- [ ] Check for active maintenance (commits in last 6 months)
- [ ] Review security advisories
- [ ] Ensure compatibility with CC0-1.0 project license
- [ ] Document in appropriate section below

---

## 🐍 Python Dependencies

### Adding a Package
```bash
# Activate environment
.\.venv\Scripts\Activate.ps1

# Add package with uv
uv add <package-name>

# Check license
pip install pip-licenses
pip-licenses | grep <package-name>

# Check security
pip install safety
safety check
```

### Pre-Merge Checklist
- [ ] Package added to `pyproject.toml`
- [ ] License verified (run `pip-licenses`)
- [ ] No security vulnerabilities (run `safety check`)
- [ ] Tests passing with new dependency
- [ ] Documentation updated if needed

---

## 📦 TypeScript/Node.js Dependencies

### Adding a Package
```bash
cd examples/typescript

# Add package
npm install <package-name>

# Check license
npx license-checker | grep <package-name>

# Check security
npm audit
```

### Pre-Merge Checklist
- [ ] Package added to `package.json`
- [ ] License verified (run `license-checker`)
- [ ] No security vulnerabilities (run `npm audit`)
- [ ] Tests passing
- [ ] Documentation updated if needed

---

## 🚀 Go Dependencies

### Adding a Package
```bash
cd examples/go

# Add package
go get <package-url>

# Check license
go install github.com/google/go-licenses@latest
go-licenses check ./...

# Check security
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...
```

### Pre-Merge Checklist
- [ ] Package added to `go.mod`
- [ ] License verified (run `go-licenses check`)
- [ ] No commercial license requirements
- [ ] No security vulnerabilities (run `govulncheck`)
- [ ] Tests passing
- [ ] Documentation updated if needed

---

## 🔷 .NET Dependencies

### Adding a Package
```bash
cd examples/dotnet

# Add package
dotnet add package <PackageName>

# Check for vulnerabilities
dotnet list package --vulnerable --include-transitive

# View all packages
dotnet list package --include-transitive
```

### Pre-Merge Checklist
- [ ] Package added to `.csproj`
- [ ] License verified on NuGet.org
- [ ] No security vulnerabilities (run `dotnet list package --vulnerable`)
- [ ] Tests passing
- [ ] Documentation updated if needed

---

## ⚠️ Forbidden Licenses

**Do NOT add packages with these licenses:**

- ❌ GPL (v2, v3)
- ❌ AGPL
- ❌ LGPL (unless dynamically linked)
- ❌ Commercial/Proprietary (requires purchase)
- ❌ Unknown/Unlicensed
- ❌ Custom restrictive licenses

**If you need functionality from a restricted package:**
1. Find an alternative with permissive license
2. Implement custom solution
3. Use cloud API (e.g., Microsoft Graph)
4. Consult with M. Gustave (architecture lead)

---

## 🔒 Security Scanning Schedule

### Daily (Automated)
- GitHub Dependabot alerts
- Snyk monitoring (if configured)

### Weekly (Automated)
- GitHub Actions security scan
- SBOM regeneration

### Monthly (Manual)
- Full dependency audit
- License compliance review
- Update this checklist if needed

### Quarterly (Manual)
- Comprehensive security review
- Remove unused dependencies
- Upgrade outdated packages
- Generate compliance report

---

## 🛠️ Tool Installation

### One-Time Setup

**Python:**
```bash
pip install pip-licenses safety pip-audit
```

**Node.js:**
```bash
npm install -g license-checker snyk
```

**Go:**
```bash
go install github.com/google/go-licenses@latest
go install golang.org/x/vuln/cmd/govulncheck@latest
```

**Cross-Language:**
```bash
# Syft (SBOM generation)
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh

# Trivy (vulnerability scanning)
# See: https://trivy.dev/
```

---

## 📊 Quick Commands

### Generate SBOM
```bash
syft . -o spdx-json=SBOM.spdx.json
```

### Check All Licenses
```bash
# Python
pip-licenses --format=markdown

# Node.js
npx license-checker --summary

# Go
go-licenses report ./...

# .NET
dotnet list package --include-transitive
```

### Security Scan All
```bash
# Python
safety check && pip-audit

# Node.js
npm audit

# Go
govulncheck ./...

# .NET
dotnet list package --vulnerable --include-transitive

# All (using Trivy)
trivy fs .
```

---

## 🚨 Security Incident Response

### If You Discover a Vulnerability

1. **Immediate**: Check severity (Critical/High/Medium/Low)
2. **Critical/High**: 
   - Notify team immediately
   - Create GitHub Security Advisory
   - Investigate if vulnerability is exploitable in our context
3. **All Severities**:
   - Document in GitHub Issue (private if needed)
   - Assign to Dmitri (security lead)
   - Check for available patches/updates
   - Test patch in development environment
   - Deploy fix to production
   - Update SBOM and documentation

### Response Time SLA

- **Critical**: 24 hours
- **High**: 48 hours
- **Medium**: 1 week
- **Low**: Next sprint

---

## 📚 Resources

### Internal Documentation
- [DEPENDENCIES.md](./DEPENDENCIES.md) - Full dependency inventory
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Implementation roadmap
- [SBOM_SUMMARY.md](./SBOM_SUMMARY.md) - Executive summary

### External Resources
- [PyPI](https://pypi.org/) - Python packages
- [npm](https://www.npmjs.com/) - Node.js packages
- [pkg.go.dev](https://pkg.go.dev/) - Go packages
- [NuGet](https://www.nuget.org/) - .NET packages
- [Snyk Vulnerability DB](https://snyk.io/vuln/)
- [SPDX License List](https://spdx.org/licenses/)
- [OSI Approved Licenses](https://opensource.org/licenses)

---

## 🎭 Agent Assignments

| Agent        | Role                          | Responsibilities                        |
|--------------|-------------------------------|-----------------------------------------|
| M. Gustave   | Architecture & Standards      | License policy, dependency strategy     |
| Zero         | Implementation                | Tool setup, automation                  |
| Agatha       | Testing & Validation          | Verify scans, test new dependencies     |
| Dmitri       | Security                      | Vulnerability assessment, incident response |
| Henckels     | CI/CD & Compliance            | Automation, reporting, audits           |
| Ludwig       | Validation & Type Safety      | License compatibility, schema validation|
| Serge X.     | Performance                   | Tool performance, optimization          |

---

## ✅ Definition of Done

A dependency is properly managed when:

- [x] License is documented and compatible (MIT, Apache-2.0, BSD, etc.)
- [x] Security scan shows no critical/high vulnerabilities
- [x] Package is actively maintained (commits in last 6 months)
- [x] Package is listed in appropriate `pyproject.toml`, `package.json`, `go.mod`, or `.csproj`
- [x] SBOM is updated (automatic via CI/CD)
- [x] Tests pass with new dependency
- [x] Documentation updated if public API changes
- [x] PR approved by at least one reviewer
- [x] CI/CD checks pass (license, security, tests)

---

**Maintained By:** Ludwig (Validation Expert) & Henckels (Standards Officer)  
**Last Updated:** January 28, 2026  
**Next Review:** February 28, 2026
