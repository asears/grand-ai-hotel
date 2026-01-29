# SBOM & License Management Implementation Plan

> **Project:** Grand Budapest Terminal  
> **Date:** January 28, 2026  
> **Status:** Planning Phase

---

## Executive Summary

This document outlines the plan to implement Software Bill of Materials (SBOM) generation, license management, and security vulnerability scanning for the Grand Budapest Terminal project across multiple programming languages (Python, TypeScript, Go, .NET).

---

## Table of Contents

1. [Objectives](#objectives)
2. [Current State Assessment](#current-state-assessment)
3. [Implementation Phases](#implementation-phases)
4. [Tooling Strategy](#tooling-strategy)
5. [Automation & CI/CD Integration](#automation--cicd-integration)
6. [Compliance & Reporting](#compliance--reporting)
7. [Timeline & Milestones](#timeline--milestones)
8. [Success Criteria](#success-criteria)

---

## Objectives

### Primary Goals

1. **Generate SPDX-compliant SBOM** for all project dependencies
2. **Identify and document all licenses** across Python, TypeScript, Go, and .NET
3. **Remove or replace restrictive/commercial dependencies** with open-source alternatives
4. **Establish automated security scanning** in CI/CD pipeline
5. **Create centralized dependency documentation** for compliance teams

### Secondary Goals

- Integrate with GitHub Security features (Dependabot, CodeQL)
- Set up continuous vulnerability monitoring
- Create license compatibility matrix
- Document alternative solutions for removed dependencies

---

## Current State Assessment

### ✅ Strengths

- Project license is CC0-1.0 (permissive, public domain)
- Most dependencies use MIT or Apache-2.0 licenses
- Clear dependency management via `pyproject.toml`, `package.json`, etc.
- Active development with modern tooling (uv, ruff, pytest)

### ⚠️ Issues Identified

1. **Commercial Dependency**: `github.com/unidoc/unioffice` (Go)
   - Requires paid license or trial
   - Used in tutorial examples only
   - **Resolution**: Replaced with placeholder comments + alternatives

2. **Deprecated Dependency**: `github.com/nguyenthenguyen/docx` (Go)
   - Unmaintained, outdated
   - Unknown license status
   - **Resolution**: Removed, marked as TODO

3. **Missing SBOM**: No automated SBOM generation
4. **No Automated License Scanning**: Manual tracking only
5. **Limited Vulnerability Scanning**: Relying on GitHub alerts only

---

## Implementation Phases

### Phase 1: Cleanup & Documentation (Week 1)

**Tasks:**
- [x] Create `DEPENDENCIES.md` with license information
- [x] Remove commercial dependencies from tutorial code
- [x] Add placeholder comments with alternative solutions
- [x] Update README.md to remove problematic library references
- [ ] Audit all dependencies for license compatibility
- [ ] Document alternative approaches for removed functionality

**Deliverables:**
- `DEPENDENCIES.md` - Completed ✅
- Updated tutorial with placeholders ✅
- Updated README.md ✅
- License audit report (CSV/JSON)

---

### Phase 2: SBOM Generation (Week 1-2)

**Tasks:**
- [ ] Install and configure SBOM generation tools
  - [ ] Syft (multi-language)
  - [ ] Microsoft SBOM Tool
  - [ ] CycloneDX generators per language
- [ ] Generate initial SPDX SBOM for project
- [ ] Validate SBOM completeness
- [ ] Set up automated SBOM generation in CI/CD
- [ ] Store SBOMs in version control or artifact registry

**Deliverables:**
- `SBOM.spdx.json` - Project-wide SBOM
- `SBOM.cyclonedx.json` - Alternative format
- Per-language SBOMs (Python, TypeScript, Go, .NET)
- CI/CD workflow for SBOM generation

**Commands:**

```bash
# Install Syft
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh

# Generate SPDX SBOM
syft . -o spdx-json=SBOM.spdx.json

# Generate CycloneDX SBOM
syft . -o cyclonedx-json=SBOM.cyclonedx.json

# Python-specific
pip install cyclonedx-bom
cyclonedx-py requirements pyproject.toml -o python-sbom.json

# Node.js-specific
npx @cyclonedx/cyclonedx-npm --output-file nodejs-sbom.json

# .NET-specific
dotnet tool install --global CycloneDX
dotnet CycloneDX *.csproj -o dotnet-sbom.json

# Go-specific
go install github.com/CycloneDX/cyclonedx-gomod/cmd/cyclonedx-gomod@latest
cyclonedx-gomod mod -json -output go-sbom.json
```

---

### Phase 3: License Scanning & Management (Week 2)

**Tasks:**
- [ ] Install license scanning tools per language
- [ ] Run initial license audits
- [ ] Generate license reports
- [ ] Create license compatibility matrix
- [ ] Document any incompatibilities or concerns
- [ ] Set up automated license checking in CI/CD

**Tools & Commands:**

**Python:**
```bash
pip install pip-licenses licensecheck
pip-licenses --format=markdown --output-file=licenses/python-licenses.md
pip-licenses --format=json --output-file=licenses/python-licenses.json
licensecheck
```

**TypeScript/Node.js:**
```bash
npm install -g license-checker licensee
license-checker --markdown > licenses/nodejs-licenses.md
license-checker --json > licenses/nodejs-licenses.json
```

**Go:**
```bash
go install github.com/google/go-licenses@latest
go-licenses report ./... --template=licenses.md.tpl > licenses/go-licenses.md
go-licenses save ./... --save_path=licenses/go-dependencies
```

**.NET:**
```bash
dotnet list package --include-transitive > licenses/dotnet-packages.txt
# Manual review required - .NET doesn't have built-in license reporting
```

**Deliverables:**
- `licenses/` directory with per-language reports
- License compatibility matrix spreadsheet
- Documentation of any incompatibilities
- CI/CD license check workflow

---

### Phase 4: Security Vulnerability Scanning (Week 2-3)

**Tasks:**
- [ ] Configure GitHub Dependabot
- [ ] Set up Snyk integration
- [ ] Install and run language-specific scanners
- [ ] Create vulnerability baseline report
- [ ] Triage and prioritize vulnerabilities
- [ ] Set up automated security scanning in CI/CD
- [ ] Configure security alerting

**Tools & Configuration:**

**GitHub Dependabot** (`.github/dependabot.yml`):
```yaml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
  
  - package-ecosystem: "npm"
    directory: "/examples/typescript"
    schedule:
      interval: "weekly"
  
  - package-ecosystem: "gomod"
    directory: "/examples/go"
    schedule:
      interval: "weekly"
  
  - package-ecosystem: "nuget"
    directory: "/examples/dotnet"
    schedule:
      interval: "weekly"
```

**Snyk Setup:**
```bash
npm install -g snyk
snyk auth

# Scan all ecosystems
snyk test --all-projects

# Continuous monitoring
snyk monitor --all-projects
```

**Per-Language Scanning:**

```bash
# Python
pip install safety pip-audit
safety check --json > security/python-safety.json
pip-audit --format=json > security/python-audit.json

# Node.js
npm audit --json > security/nodejs-audit.json

# Go
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./... > security/go-vulncheck.txt

# .NET
dotnet list package --vulnerable --include-transitive > security/dotnet-vulnerabilities.txt
```

**Deliverables:**
- `.github/dependabot.yml` configuration
- Snyk project integration
- Vulnerability baseline reports
- CI/CD security scanning workflows
- Security alert configuration

---

### Phase 5: CI/CD Integration (Week 3)

**Tasks:**
- [ ] Create GitHub Actions workflow for SBOM generation
- [ ] Create workflow for license checking
- [ ] Create workflow for security scanning
- [ ] Set up artifact storage for SBOMs
- [ ] Configure PR checks for new dependencies
- [ ] Set up automated reporting

**GitHub Actions Workflows:**

**`.github/workflows/sbom-generation.yml`**:
```yaml
name: SBOM Generation

on:
  push:
    branches: [ main ]
  pull_request:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  generate-sbom:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Syft
        run: |
          curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin
      
      - name: Generate SPDX SBOM
        run: |
          syft . -o spdx-json=SBOM.spdx.json
          syft . -o cyclonedx-json=SBOM.cyclonedx.json
      
      - name: Upload SBOM Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: sbom-files
          path: |
            SBOM.spdx.json
            SBOM.cyclonedx.json
      
      - name: Commit SBOM to Repository
        if: github.event_name == 'push'
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"
          git add SBOM.*.json
          git commit -m "chore: update SBOM [skip ci]" || true
          git push
```

**`.github/workflows/license-check.yml`**:
```yaml
name: License Compliance Check

on:
  pull_request:
  push:
    branches: [ main ]

jobs:
  license-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install pip-licenses licensecheck
      
      - name: Check Python licenses
        run: |
          pip-licenses --fail-on="GPL;AGPL;LGPL" --format=markdown
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Check Node.js licenses
        run: |
          cd examples/typescript
          npx license-checker --failOn "GPL;AGPL;LGPL"
      
      - name: Summary
        run: echo "✅ No restrictive licenses found"
```

**`.github/workflows/security-scan.yml`**:
```yaml
name: Security Vulnerability Scan

on:
  pull_request:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install Python security tools
        run: pip install safety pip-audit
      
      - name: Python Security Scan
        run: |
          safety check --json || true
          pip-audit --format=json || true
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Node.js Security Scan
        run: |
          cd examples/typescript
          npm audit --json || true
      
      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      
      - name: Go Vulnerability Check
        run: |
          cd examples/go
          go install golang.org/x/vuln/cmd/govulncheck@latest
          govulncheck ./... || true
      
      - name: Run Trivy scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'
```

**Deliverables:**
- Three GitHub Actions workflows (SBOM, License, Security)
- Automated artifact storage
- PR checks for dependency changes
- Integration with GitHub Security tab

---

### Phase 6: Documentation & Training (Week 3-4)

**Tasks:**
- [ ] Create developer guide for dependency management
- [ ] Document SBOM generation process
- [ ] Create runbooks for security incidents
- [ ] Train team on license compliance
- [ ] Document escalation procedures
- [ ] Create FAQ for common scenarios

**Deliverables:**
- `docs/DEVELOPER_GUIDE.md` - Dependency management guide
- `docs/SECURITY_RUNBOOK.md` - Incident response procedures
- `docs/LICENSE_FAQ.md` - Common license questions
- Team training session materials

---

## Tooling Strategy

### Multi-Language Support

| Language   | SBOM Tool          | License Tool       | Security Tool    |
|------------|--------------------|--------------------|------------------|
| Python     | Syft, CycloneDX    | pip-licenses       | safety, pip-audit|
| TypeScript | Syft, CycloneDX    | license-checker    | npm audit, Snyk  |
| Go         | Syft, CycloneDX    | go-licenses        | govulncheck      |
| .NET       | Syft, CycloneDX    | Manual review      | dotnet list pkg  |
| **All**    | **Trivy, Snyk**    | **FOSSA (optional)**| **Snyk, GitHub**|

### Tool Selection Criteria

1. **Open Source**: Prefer OSS tools (Syft, Trivy)
2. **Active Maintenance**: Regular updates and community support
3. **CI/CD Friendly**: Easy automation and JSON output
4. **Multi-Format**: Support SPDX and CycloneDX
5. **GitHub Integration**: Native support for GitHub features

---

## Automation & CI/CD Integration

### Workflow Triggers

| Workflow          | Trigger                          | Frequency  |
|-------------------|----------------------------------|------------|
| SBOM Generation   | Push to main, weekly schedule    | Weekly     |
| License Check     | PR, push to main                 | On-demand  |
| Security Scan     | PR, push to main, weekly schedule| Weekly     |
| Dependency Update | Dependabot schedule              | Weekly     |

### Artifact Management

**Storage Strategy:**
- Commit SBOMs to repository (`SBOM.spdx.json`, `SBOM.cyclonedx.json`)
- Upload detailed reports as GitHub Actions artifacts (30-day retention)
- Archive quarterly snapshots to external storage (compliance requirement)

---

## Compliance & Reporting

### Regular Reports

1. **Weekly**: Security vulnerability summary
2. **Monthly**: License compliance audit
3. **Quarterly**: Full SBOM snapshot + compliance report
4. **Annual**: Dependency review and cleanup

### Stakeholder Communication

| Stakeholder       | Report Type          | Frequency  | Format     |
|-------------------|----------------------|------------|------------|
| Development Team  | Security alerts      | Real-time  | Email/Slack|
| Tech Leads        | Compliance summary   | Monthly    | Dashboard  |
| Legal/Compliance  | License audit        | Quarterly  | PDF/Excel  |
| Management        | Executive summary    | Quarterly  | Presentation|

---

## Timeline & Milestones

```
Week 1:
├─ Day 1-2: Phase 1 - Cleanup & Documentation ✅
├─ Day 3-4: Phase 2 - SBOM Generation (setup)
└─ Day 5: Phase 2 - Initial SBOM creation

Week 2:
├─ Day 1-2: Phase 2 - SBOM validation & automation
├─ Day 3-4: Phase 3 - License scanning
└─ Day 5: Phase 4 - Security scanning (setup)

Week 3:
├─ Day 1-2: Phase 4 - Security scanning (complete)
├─ Day 3-4: Phase 5 - CI/CD integration
└─ Day 5: Phase 5 - Testing & validation

Week 4:
├─ Day 1-2: Phase 6 - Documentation
├─ Day 3: Team training
├─ Day 4: Final review & adjustments
└─ Day 5: Go-live & monitoring
```

---

## Success Criteria

### Phase Completion Criteria

- [x] **Phase 1**: All commercial dependencies removed, DEPENDENCIES.md created
- [ ] **Phase 2**: SPDX SBOM generated and validated
- [ ] **Phase 3**: All dependencies have documented licenses, no incompatibilities
- [ ] **Phase 4**: Zero critical vulnerabilities, automated scanning active
- [ ] **Phase 5**: All workflows running successfully in CI/CD
- [ ] **Phase 6**: Team trained, documentation complete

### Key Performance Indicators (KPIs)

1. **License Compliance**: 100% of dependencies with known, compatible licenses
2. **Security Posture**: <5 medium vulnerabilities, 0 critical/high
3. **SBOM Coverage**: 100% of production dependencies in SBOM
4. **Automation**: 100% of checks automated in CI/CD
5. **Response Time**: Security vulnerabilities triaged within 48 hours

### Acceptance Criteria

- ✅ All phases completed
- ✅ No blocking vulnerabilities
- ✅ No license compliance issues
- ✅ CI/CD workflows passing
- ✅ Team trained and documentation complete
- ✅ Stakeholder sign-off

---

## Risk Management

### Identified Risks

| Risk                        | Impact | Likelihood | Mitigation                                |
|-----------------------------|--------|------------|-------------------------------------------|
| False positives in scans    | Medium | High       | Manual triage process, tool tuning        |
| Tool integration complexity | Medium | Medium     | Start simple, iterate, use proven tools   |
| Team resistance to process  | High   | Low        | Training, automation, clear value prop    |
| Commercial tool costs       | Low    | Low        | Prioritize OSS tools, evaluate ROI        |
| SBOM format compatibility   | Low    | Low        | Use both SPDX and CycloneDX standards     |

---

## Next Steps

### Immediate Actions (This Week)

1. ✅ Complete Phase 1 cleanup
2. Install Syft and generate initial SBOM
3. Run initial license audits per language
4. Set up Dependabot configuration
5. Create GitHub Actions workflows

### Short-term (Next Month)

1. Complete all 6 phases
2. Achieve 100% license documentation
3. Implement automated security scanning
4. Train development team
5. Establish reporting cadence

### Long-term (Next Quarter)

1. Integrate with enterprise compliance tools (if applicable)
2. Establish dependency review process for new libraries
3. Create dashboard for real-time compliance monitoring
4. Quarterly compliance audits
5. Continuous improvement based on lessons learned

---

## Appendix: Alternative Solutions for Removed Dependencies

### Go Office Document Processing

Since we removed `unidoc/unioffice` (commercial) and `nguyenthenguyen/docx` (unmaintained), here are production-ready alternatives:

#### Option 1: Custom Office Open XML Parser (Free, Open Source)

```go
import (
    "archive/zip"
    "encoding/xml"
    "io"
)

func readDocx(path string) (string, error) {
    r, err := zip.OpenReader(path)
    if err != nil {
        return "", err
    }
    defer r.Close()
    
    // Find document.xml
    for _, f := range r.File {
        if f.Name == "word/document.xml" {
            rc, err := f.Open()
            if err != nil {
                return "", err
            }
            defer rc.Close()
            
            // Parse XML and extract text
            // (Implementation details omitted for brevity)
        }
    }
    return text, nil
}
```

**Pros**: Free, full control, no licensing issues  
**Cons**: Requires understanding ECMA-376 spec

#### Option 2: Microsoft Graph API (Cloud-based)

```go
import "github.com/microsoftgraph/msgraph-sdk-go"

// Use Microsoft Graph API to process documents in cloud
// Requires Azure AD app registration
```

**Pros**: Official Microsoft support, feature-rich  
**Cons**: Requires cloud connectivity, Azure subscription

#### Option 3: LibreOffice Headless (Server-side)

```bash
# Convert documents using LibreOffice
soffice --headless --convert-to txt document.docx
```

**Pros**: Free, supports many formats  
**Cons**: Requires LibreOffice installation

---

**Document Owner:** The Grand Budapest Terminal Ensemble  
**Last Updated:** January 28, 2026  
**Version:** 1.0
