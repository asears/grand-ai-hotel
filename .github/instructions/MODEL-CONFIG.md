# Agent Model Configuration Summary

## Current Configuration (Optimized for Token Conservation)

All agents are configured with economical models by default, with premium options available as commented alternatives.

| Agent | Default Model | Premium Model (Commented) | Use Case |
|-------|---------------|---------------------------|----------|
| **M. Gustave** | `claude-sonnet-4.5` | `claude-opus-4.5` | Code quality, docs, architecture |
| **Zero** | `claude-haiku-4.5` | `claude-sonnet-4.5` | General assistance, execution |
| **Agatha** | `claude-haiku-4.5` | `claude-sonnet-4.5` | Testing, data prep, validation |
| **Dmitri** | `claude-sonnet-4.5` | `claude-opus-4.5` | Security, adversarial testing |
| **Henckels** | `gpt-5.1-codex-mini` | `gpt-5.2-codex` | Standards, CI/CD, code review |
| **Ludwig** | `gpt-5.1-codex-mini` | `gpt-5.1-codex` | Validation, type checking |
| **Serge X.** | `claude-sonnet-4.5` | `claude-opus-4.5` | Analysis, benchmarking |

## How to Switch Models

### Option 1: Edit Agent File Directly

Open the agent file (e.g., `.github/agents/m-gustave.agent.md`) and swap the commented lines:

**Before (economical):**
```yaml
model: claude-sonnet-4.5
# model: claude-opus-4.5  # Premium option for most demanding tasks
```

**After (premium):**
```yaml
# model: claude-sonnet-4.5  # Economical option
model: claude-opus-4.5
```

### Option 2: Use /model Command During Session

After invoking an agent, switch models on-the-fly:

```bash
/agent
# Select M. Gustave

# For demanding tasks, upgrade to premium:
/model claude-opus-4.5

# For quick iterations, downgrade to economical:
/model claude-haiku-4.5
```

## Model Selection Philosophy

### Start Economical, Upgrade as Needed
- Begin with default (economical) models for most work
- Monitor results and complexity
- Switch to premium models when:
  - Hitting complex architectural decisions
  - Requiring deep reasoning or analysis
  - Standard model produces incomplete solutions
  - Security analysis needs adversarial depth

### Token Budget Awareness
- **Economical models**: claude-haiku-4.5, gpt-5.1-codex-mini, gpt-5-mini
  - Use for: iteration, simple edits, straightforward tasks
  
- **Balanced models**: claude-sonnet-4.5, gpt-5.1-codex
  - Use for: standard development, most coding tasks
  
- **Premium models**: claude-opus-4.5, gpt-5.2-codex
  - Reserve for: complex problems, architectural decisions, deep analysis

## Per-Agent Rationale

### M. Gustave (Code Quality)
- **Default**: Sonnet balances quality and efficiency
- **Premium**: Opus for architectural reviews requiring deep thought

### Zero (General Assistant)  
- **Default**: Haiku for fast execution of straightforward tasks
- **Premium**: Sonnet when tasks prove more complex than expected

### Agatha (Testing)
- **Default**: Haiku for rapid test generation and data prep
- **Premium**: Sonnet for complex validation logic

### Dmitri (Security)
- **Default**: Sonnet provides good adversarial thinking
- **Premium**: Opus for thorough security audits and deep vulnerability analysis

### Henckels (Standards)
- **Default**: Codex-Mini for quick lint/format enforcement
- **Premium**: Full Codex for complex code review sessions

### Ludwig (Validation)
- **Default**: Codex-Mini for type checking and schema validation
- **Premium**: Full Codex for complete contract verification

### Serge X. (Analysis)
- **Default**: Sonnet for most profiling and benchmarking
- **Premium**: Opus for deep performance analysis and optimization strategies

---

**Last Updated**: 2026-01-28  
**See**: `tutorials/model-and-token-management.md` for complete model documentation

