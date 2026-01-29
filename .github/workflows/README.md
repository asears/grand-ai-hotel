# GitHub Actions Workflows

This folder contains automated workflow definitions for the Grand Budapest Terminal project.

## Purpose

Automate development processes, security reviews, and documentation maintenance with agentic pipelines.

## Available Workflows

### 1. Monthly Security Review (`monthly-security-review.yml`)

**Status:** ✅ Active  
**Schedule:** 1st of every month at 00:00 UTC  
**Conducted By:** Dmitri (Security Auditor) 🕵️

Multi-language security scanning and SBOM generation across all project languages.

**Features:**
- ✅ Multi-language security scanning (Python, TypeScript, Go, .NET)
- ✅ License compliance auditing
- ✅ SPDX and CycloneDX SBOM generation
- ✅ AI-powered analysis with GitHub Copilot SDK
- ✅ Automated PR creation with findings
- ✅ GitHub Security integration (SARIF upload)
- ✅ 90-day artifact retention

**Scans Performed:**
- **Python**: safety, pip-audit, pip-licenses
- **TypeScript/Node.js**: npm audit, license-checker
- **Go**: govulncheck, go-licenses
- **.NET**: dotnet vulnerability check
- **Multi-Language**: Trivy, Syft

**Outputs:**
- `security-reports/SECURITY_REPORT.md` - AI-generated summary
- `SBOM.spdx.json` - SPDX format SBOM
- `SBOM.cyclonedx.json` - CycloneDX format SBOM
- Detailed scan results in `security-reports/`

**Manual Trigger:**
```bash
gh workflow run monthly-security-review.yml
```

**Documentation:** See detailed guide below.

---

### 2. Weekly README Update (`weekly-readme-update.yml`)

**Status:** 🚧 Commented (Enable when ready)  
**Schedule:** Every Monday at 00:00 UTC  
**Conducted By:** M. Gustave (Architect) 🎩

Automated README maintenance using GitHub Copilot CLI.

**Features:**
- 📊 Analyzes repository changes from past week
- 🤖 Uses Copilot CLI for intelligent updates
- 📝 Maintains Wes Anderson aesthetic
- 🔄 Creates PRs with proposed changes

**Recent Updates:**
- ✅ Migrated to `setup-uv` action (removed manual curl installation)
- ✅ Simplified Python dependency setup
- ✅ Added GitHub CLI authentication for Copilot access
- ✅ Removed dependency on `COPILOT_GITHUB_TOKEN` environment variable

**To Enable:**
Uncomment the workflow in `weekly-readme-update.yml`

---

### 3. Markdown Linting & Spell Check (`markdown-lint.yml`)

**Status:** 🚧 Placeholder (Ready to uncomment)  
**Triggers:** Pull requests and pushes modifying `*.md` files  
**Conducted By:** Ludwig (Type Guardian) & M. Gustave (Architect) 📐

Automated markdown quality enforcement with linting and spell checking.

**Features:**
- ✅ Markdownlint (David Anson) with `.markdownlint.json` config
- ✅ CSpell spell checking with project dictionary
- ✅ LLM detection marker scanning (comprehensive, robust, etc.)
- ✅ Excessive formatting detection (bold overuse)

**Jobs:**
1. **markdown-lint**: Enforces markdown best practices
2. **spell-check**: Detects typos and unknown terms
3. **terminology-check**: Flags LLM markers from TERMS.md
4. **formatting-check**: Warns about excessive bold in standards

**Configuration Files:**
- `.markdownlint.json` - Primary linting rules
- `.markdownlint2.json` - Extended config for CLI2
- `.markdownlintignore` - Excluded files/directories
- `.cspell.json` - Custom dictionary and ignore patterns

**Prohibited Terms** (in professional docs):
- comprehensive → use: complete, full, detailed, thorough
- robust → use: reliable, stable, tested
- seamless → use: smooth, integrated
- See [TERMS.md](../../TERMS.md) for complete list

**To Enable:**
Uncomment the workflow in `markdown-lint.yml`

**Manual Run:**
```bash
# Markdownlint
markdownlint-cli2 "**/*.md"

# CSpell
cspell "**/*.md"

# Terminology check
grep -r -i "\bcomprehensive\b" --include="*.md" \
  --exclude="TERMS.md" --exclude-dir="tutorials" .
```

---

### 4. Dependabot Automated Dependency Updates

**Status:** 🚧 Placeholder (Ready to uncomment)  
**Schedule:** Weekly on Monday 9:00 AM ET  
**Conducted By:** Dmitri (Security Auditor) & Henckels (Standards Officer) 🔒

Automated dependency updates across all project ecosystems.

**Ecosystems Configured:**
- ✅ Python (pip) - Root directory
- ✅ TypeScript/Node.js (npm) - `/examples/typescript`
- ✅ Node.js (npm) - `/examples/nodejs`
- ✅ Go (gomod) - `/examples/go`
- ✅ .NET (nuget) - `/examples/dotnet`
- ✅ GitHub Actions - Workflow files

**Features:**
- 📦 Automatic PR creation for dependency updates
- 🔒 Security updates prioritized
- 👥 Auto-assignment to @asears for review
- 🏷️ Consistent labeling (dependencies, language, automated)
- 📊 Dependency grouping (dev tools, security tools, testing)
- ⚠️ Major version updates ignored (manual review required)

**Update Groups:**
- **Python:** dev-dependencies (pytest, ruff, mypy), security-tools (safety, pip-audit)
- **TypeScript:** dev-dependencies (@types/*, eslint, typescript)
- **Go:** testing frameworks
- **.NET:** testing frameworks (xUnit, NUnit, Moq)
- **GitHub Actions:** core actions, security actions

**Configuration File:**
`.github/dependabot.yml`

**To Enable:**
1. Uncomment configuration in `.github/dependabot.yml`
2. Push to main branch
3. First run: Next Monday 9:00 AM ET

**View Updates:**
```bash
# GitHub CLI
gh dependabot view

# Web UI
# Navigate to: Insights > Dependency graph > Dependabot
```

**Integration with Security Review:**
- Security Review: 1st of month (full audit)
- Dependabot: Every Monday (continuous updates)
- Complementary approach for complete dependency management



---

## Workflow Documentation

### Monthly Security Review - Detailed Guide

#### Overview

The Monthly Security Review is an automated agentic pipeline that performs complete security scanning, license auditing, and SBOM generation across all project languages.

#### Workflow Architecture

```
┌─────────────────────────────────────────────┐
│   Trigger: Monthly (1st) or Manual         │
└─────────────────┬───────────────────────────┘
                  │
    ┌─────────────▼──────────────┐
    │  Setup Environment         │
    │  - Python (uv)             │
    │  - Node.js                 │
    │  - Go                      │
    │  - .NET                    │
    └─────────────┬──────────────┘
                  │
    ┌─────────────▼──────────────┐
    │  Language-Specific Scans   │
    ├────────────────────────────┤
    │  Python:                   │
    │  • safety check            │
    │  • pip-audit               │
    │  • pip-licenses            │
    ├────────────────────────────┤
    │  TypeScript/Node.js:       │
    │  • npm audit               │
    │  • license-checker         │
    ├────────────────────────────┤
    │  Go:                       │
    │  • govulncheck             │
    │  • go-licenses             │
    ├────────────────────────────┤
    │  .NET:                     │
    │  • dotnet vulnerability    │
    └─────────────┬──────────────┘
                  │
    ┌─────────────▼──────────────┐
    │  Multi-Language Tools      │
    │  • Trivy (full scan)       │
    │  • Syft (SBOM generation)  │
    └─────────────┬──────────────┘
                  │
    ┌─────────────▼──────────────┐
    │  AI-Powered Analysis       │
    │  • Aggregate findings      │
    │  • Generate report         │
    │  • Categorize by severity  │
    └─────────────┬──────────────┘
                  │
    ┌─────────────▼──────────────┐
    │  Outputs                   │
    │  • Security reports        │
    │  • SBOMs (SPDX, CycloneDX) │
    │  • SARIF → GitHub Security │
    └─────────────┬──────────────┘
                  │
    ┌─────────────▼──────────────┐
    │  Create Pull Request       │
    │  • Commit reports          │
    │  • Update SBOMs            │
    │  • Detailed PR description │
    └────────────────────────────┘
```

#### Severity Response Times

| Severity | Symbol | SLA | Action Required |
|----------|--------|-----|-----------------|
| 🔴 Critical | CRITICAL | 24 hours | Immediate patch, emergency PR |
| 🟠 High | HIGH | 48 hours | Priority fix, scheduled PR |
| 🟡 Medium | MEDIUM | 1 week | Planned fix, next sprint |
| 🟢 Low | LOW | 1 month | Track, routine update |

#### Manual Execution

**Via GitHub Actions UI:**
1. Go to **Actions** tab
2. Select **Monthly Security Review**
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

**Via GitHub CLI:**
```bash
gh workflow run monthly-security-review.yml
```

**Via API:**
```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/asears/grand-ai-hotel/actions/workflows/monthly-security-review.yml/dispatches \
  -d '{"ref":"main"}'
```

#### Output Files

```
project-root/
├── SBOM.spdx.json              # SPDX SBOM
├── SBOM.cyclonedx.json         # CycloneDX SBOM
└── security-reports/
    ├── SECURITY_REPORT.md      # AI-generated summary
    ├── python-safety.json
    ├── python-audit.json
    ├── python-licenses.md
    ├── nodejs-audit.json
    ├── nodejs-licenses.md
    ├── go-vulncheck.txt
    ├── go-licenses.txt
    ├── dotnet-vulnerabilities.txt
    ├── dotnet-packages.txt
    ├── trivy-report.json
    └── trivy-results.sarif     # Uploaded to GitHub Security
```

#### Responding to Findings

**For Critical/High Vulnerabilities:**

1. **Review** - Check `security-reports/SECURITY_REPORT.md`
2. **Identify** - Find affected packages in JSON reports
3. **Update** - Apply patches:
   ```bash
   # Python
   uv pip install --upgrade <package>
   
   # Node.js
   npm update <package>
   
   # Go
   go get -u <package>
   
   # .NET
   dotnet add package <Package> --version <version>
   ```
4. **Verify** - Re-run security scan
5. **Merge** - Approve and merge the PR

**For Medium/Low Vulnerabilities:**

1. Create tracking issues
2. Schedule for next sprint
3. Monitor in monthly reviews
4. Fix during routine updates

---

## Customization

### Adjust Monthly Security Review Schedule

Edit `monthly-security-review.yml`:

```yaml
on:
  schedule:
    # Quarterly instead of monthly
    - cron: '0 0 1 1,4,7,10 *'
```

### Add Custom Security Scanners

Add a new step to the workflow:

```yaml
- name: Custom Security Tool
  run: |
    custom-scanner . --output security-reports/custom.json
```

### Modify Artifact Retention

```yaml
- uses: actions/upload-artifact@v4
  with:
    retention-days: 180  # Change from 90
```

---

## Integration with Existing Tools

### Works Alongside

| Tool | Purpose | Frequency | Relationship |
|------|---------|-----------|--------------|
| **Dependabot** | Dependency updates | Weekly | Complementary |
| **CodeQL** | Code analysis | Per commit | Complementary |
| **Security Review** | Dependency audit | Monthly | Primary audit |

### Combined Security Strategy

```
┌──────────────────────────────────────────────┐
│  Continuous Security Posture                 │
├──────────────────────────────────────────────┤
│  Daily:     Dependabot alerts (auto)         │
│  Per Push:  CodeQL analysis (auto)           │
│  Weekly:    Dependabot PRs (auto)            │
│  Monthly:   Security Review (auto)           │
│  Ad-hoc:    Manual security scan (on-demand) │
└──────────────────────────────────────────────┘
```

---

## Troubleshooting

### Common Issues

**1. Workflow fails with "Tool not found"**
- Check tool installation logs
- Verify PATH configuration
- Ensure correct OS (ubuntu-latest)

**2. SARIF upload fails**
- Verify `security-events: write` permission
- Check SARIF file exists
- Review GitHub Security tab settings

**3. AI analysis step fails**
- Check Python environment setup
- Verify JSON parsing of scan results
- Review workflow logs for errors

**4. PR not created**
- Ensure changes were committed
- Verify `contents: write` and `pull-requests: write` permissions
- Check branch protection rules

---

## Resources

### Documentation
- [DEPENDENCIES.md](../../DEPENDENCIES.md) - Full dependency inventory
- [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) - Security roadmap
- [.github/DEPENDENCY_CHECKLIST.md](../DEPENDENCY_CHECKLIST.md) - Developer guide

### External Tools
- [Trivy](https://aquasecurity.github.io/trivy/) - Vulnerability scanner
- [Syft](https://github.com/anchore/syft) - SBOM generator
- [safety](https://pyup.io/safety/) - Python security
- [govulncheck](https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck) - Go security

### Standards
- [SPDX](https://spdx.dev/) - Software Bill of Materials standard
- [CycloneDX](https://cyclonedx.org/) - Alternative SBOM format
- [SARIF](https://sarifweb.azurewebsites.net/) - Security analysis format

---

## Support

**Security Lead:** Dmitri 🕵️  
**CI/CD Lead:** Henckels 🎖️  
**Issues:** [GitHub Issues](https://github.com/asears/grand-ai-hotel/issues)

---

*"Automation is the hallmark of excellence. Manual processes are the enemy of consistency."*  
— Henckels, Deputy of Standards

*"Security is not merely a practice, but a philosophy."*  
— Dmitri, The Security Auditor

---

**Last Updated:** January 29, 2026  
**Version:** 2.0
