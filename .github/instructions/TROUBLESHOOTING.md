# Troubleshooting Agent Detection

## Common Issue: `/agents` vs `/agent`

### ❌ WRONG Command
```bash
/agents
```

### ✅ CORRECT Command
```bash
/agent
```

The command is **singular**: `/agent` (not `/agents`)

---

## Verification Checklist

### 1. File Location
✅ Agents must be in `.github/agents/` directory
```
.github/
  agents/
    agatha.agent.md
    dmitri.agent.md
    henckels.agent.md
    ludwig.agent.md
    m-gustave.agent.md
    serge.agent.md
    zero.agent.md
```

### 2. File Naming Convention
✅ Files must have `.agent.md` suffix
- ✅ `zero.agent.md` - CORRECT
- ❌ `zero.md` - WRONG
- ❌ `zero-agent.md` - WRONG

### 3. Frontmatter Format
✅ Must have valid YAML frontmatter with required fields:
```yaml
---
description: "Agent description"
name: Agent Name
model: model-name  # optional
tools: ['tool1', 'tool2']  # must be array
---
```

### 4. Required Frontmatter Fields
- `description`: String describing the agent
- `name`: Display name for the agent
- `tools`: Array of tool names (must use array syntax)

### 5. Git Repository
⚠️ Agents are detected from the Git repository root
- Make sure you're in a Git repository (`git init` was run)
- Change to repository root directory if needed: `/cwd`

---

## Testing Agent Detection

### Step 1: Launch Copilot CLI in Repository
```bash
cd C:\projects\ai\copilot
copilot
```

### Step 2: Use Correct Command
```bash
/agent
```

You should see a menu with all available agents:
- M. Gustave
- Zero
- Agatha
- Dmitri
- Deputy Henckels
- Ludwig
- Serge X

### Step 3: Verify Current Directory
```bash
/cwd
```

Should show: `C:\projects\ai\copilot` (or your repo root)

---

## If Agents Still Don't Appear

### Option 1: Reload CLI
Exit and restart:
```bash
/exit
copilot
```

### Option 2: Check Frontmatter Syntax
Common issues:
- ❌ Tools as string: `tools: 'shell, read'`
- ✅ Tools as array: `tools: ['shell', 'read']`

- ❌ Missing quotes: `description: Agent without quotes`
- ✅ With quotes: `description: "Agent with quotes"`

### Option 3: Verify Git Repository
```bash
git status
```

Should show you're on a branch (not "not a git repository")

### Option 4: Check File Encoding
Files should be UTF-8 encoded without BOM

---

## Current Repository Status

All agent files have been verified and contain:
- ✅ Correct `.agent.md` suffix
- ✅ Valid YAML frontmatter
- ✅ Required fields (description, name, tools)
- ✅ Proper array syntax for tools
- ✅ Located in `.github/agents/` directory
- ✅ Git repository initialized and pushed

---

## Quick Test Commands

```bash
# 1. Navigate to repo (if not already there)
cd C:\projects\ai\copilot

# 2. Verify you're in the repo
git status

# 3. Launch Copilot
copilot

# 4. Try the agent command (singular!)
/agent
```

---

## Expected Behavior

When you run `/agent`, you should see a list of available agents to select from.

---

## Additional Notes

- Agent files are read from the Git repository, not from the file system directly
- Changes to agent files require restarting the CLI session to take effect
- The `model` field in frontmatter is optional but recommended
- Comments in YAML (lines starting with `#`) are ignored
- Only `.agent.md` files should be in the `.github/agents/` folder

---

**Remember**: It's `/agent` (singular), not `/agents` (plural)!
