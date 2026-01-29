
---

## Dependabot Configuration Guide

### Ecosystems Configured

1. **Python (pip)** - Root directory
   - Weekly updates on Monday 9:00 AM ET
   - Groups: dev-dependencies, security-tools
   - Max 5 PRs at once

2. **TypeScript/Node.js (npm)** - `/examples/typescript`
   - Weekly updates on Monday 9:00 AM ET
   - Groups: dev-dependencies
   - Max 5 PRs at once

3. **Node.js (npm)** - `/examples/nodejs`
   - Weekly updates on Monday 9:00 AM ET
   - Max 5 PRs at once

4. **Go (gomod)** - `/examples/go`
   - Weekly updates on Monday 9:00 AM ET
   - Groups: testing tools
   - Max 5 PRs at once

5. **.NET (nuget)** - `/examples/dotnet`
   - Weekly updates on Monday 9:00 AM ET
   - Groups: testing frameworks
   - Max 5 PRs at once

6. **GitHub Actions** - Root directory
   - Weekly updates on Monday 9:00 AM ET
   - Groups: core actions, security actions
   - Max 10 PRs at once

### Configuration Features

#### Update Grouping
Dependencies are grouped logically:
- **Python:** Dev tools (pytest, ruff, mypy), Security tools (safety, pip-audit)
- **TypeScript:** Type definitions, linters, TypeScript compiler
- **Go:** Testing frameworks
- **.NET:** Testing frameworks (xUnit, NUnit, Moq)
- **GitHub Actions:** Core actions, Security scanning actions

#### Security
- Major version updates ignored by default (requires manual review)
- Security updates automatically prioritized by Dependabot
- Integration with GitHub Security advisories

#### Pull Request Management
- Automatic reviewer assignment (@asears)
- Consistent labeling (dependencies, language-specific, automated)
- Conventional commit prefixes (chore(deps), ci)
- Limited concurrent PRs to avoid overwhelming reviews

### Enabling Dependabot

**To activate:**
1. Uncomment the entire configuration in `.github/dependabot.yml`
2. Push to main branch
3. Dependabot will start creating PRs on next Monday 9:00 AM ET

**Recommended before enabling:**
- Review current dependency status with `monthly-security-review.yml`
- Update all dependencies to latest compatible versions
- Set up branch protection rules requiring PR reviews
- Configure auto-merge for patch updates (optional)

### Advanced Configuration

#### Auto-merge for Patch Updates
Add to repository settings or use Dependabot auto-merge:
```yaml
# In dependabot.yml, add to each ecosystem:
# enable-beta-ecosystems: true
# automerge:
#   - match:
#       dependency-type: "development"
#       update-type: "semver:patch"
```

#### Custom Ignore Patterns
```yaml
# Ignore specific packages:
# ignore:
#   - dependency-name: "package-name"
#   - dependency-name: "another-package"
#     versions: ["1.x", "2.x"]
```

#### Rebase Strategy
```yaml
# Add to ecosystem config:
# rebase-strategy: "auto"
```

### Integration with Workflows

Dependabot PRs will trigger:
- ✅ Markdown linting (if .md files in dependencies)
- ⚠️ Monthly security review (manual trigger only)
- ✅ All PR-triggered workflows

**Best Practice:**
Create a dedicated workflow for Dependabot PRs:
```yaml
# .github/workflows/dependabot-auto-merge.yml (future)
# Automatically approve and merge patch/minor updates
# after CI passes
```

### Monitoring Dependabot

**View updates:**
```bash
# GitHub CLI
gh dependabot view

# Web UI
# Navigate to: Insights > Dependency graph > Dependabot
```

**Check alerts:**
```bash
# Security alerts
gh api repos/asears/grand-ai-hotel/dependabot/alerts

# Or visit:
# https://github.com/asears/grand-ai-hotel/security/dependabot
```

### Troubleshooting

**Common Issues:**

1. **No PRs created**
   - Check ecosystem directory paths match repository structure
   - Verify package manifests exist (package.json, go.mod, etc.)
   - Check Dependabot logs in Insights > Dependency graph

2. **Too many PRs**
   - Reduce `open-pull-requests-limit`
   - Add more dependencies to `ignore` list
   - Use more aggressive grouping

3. **Merge conflicts**
   - Enable `rebase-strategy: "auto"`
   - Manually close conflicting PRs
   - Update base branch dependencies first

### Dependency Update Workflow

**Recommended process:**
1. **Monday 9:00 AM ET:** Dependabot creates PRs
2. **Monday-Tuesday:** Automated CI runs
3. **Tuesday-Wednesday:** Manual review by @asears
4. **Wednesday-Thursday:** Merge approved updates
5. **Friday:** Verify no regressions from updates

**Monthly Security Review Integration:**
- Run on 1st of month (see `monthly-security-review.yml`)
- Dependabot runs weekly (every Monday)
- Security review provides full audit
- Dependabot provides continuous updates

### Related Documentation

- [DEPENDENCIES.md](../../DEPENDENCIES.md) - Current dependency inventory
- [ROADMAP.md](../../ROADMAP.md) - Technology release schedule
- [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) - SBOM phases
- [.github/workflows/README.md](../workflows/README.md) - CI/CD workflows

### Dependabot Resources

- **Documentation:** [GitHub Dependabot Docs](https://docs.github.com/code-security/dependabot)
- **Configuration:** [dependabot.yml reference](https://docs.github.com/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- **Best Practices:** [Dependabot best practices](https://docs.github.com/code-security/dependabot/working-with-dependabot/keeping-your-dependencies-updated-automatically)

---

**Created:** January 29, 2026  
**Last Updated:** January 29, 2026  
**Maintained By:** Dmitri (Security Auditor) & Henckels (Standards Officer)  
**Status:** Placeholder (commented out, ready to uncomment)
