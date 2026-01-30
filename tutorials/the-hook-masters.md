# The Hook Masters: Automation Mastery with Claude Desktop

**A Technical Deep Dive by The Grand Budapest Terminal Staff**

**Directed by:** Dmitri Desgoffe-und-Taxis (Security & Automation)  
**Co-Directed by:** Henckels (Standards & Enforcement)  
**Featuring:** Ludwig (Validation), Agatha (Testing), Zero (Implementation)

**Runtime:** 20-30 minutes  
**Genre:** Technical Tutorial / Spy Thriller Aesthetic  
**Color Palette:** `#2C3E50` (Midnight Blue), `#E74C3C` (Crimson), `#95A5A6` (Silver), `#34495E` (Wet Asphalt)

---

## Chapter I: The Control Room

*The scene opens in a dimly lit control room. Walls lined with clockwork mechanisms, pneumatic tubes, and brass levers. Each lever is labeled with a hook type. Dmitri stands at the center console.*

```
╔═══════════════════════════════════════════════════════════════╗
║                    THE HOOK CONTROL ROOM                      ║
║             Where Every AI Action Can Be Intercepted          ║
╚═══════════════════════════════════════════════════════════════╝

     PreToolUse          PostToolUse       UserPromptSubmit
        ╔═╗                 ╔═╗                 ╔═╗
        ║█║                 ║█║                 ║█║
        ╚═╝                 ╚═╝                 ╚═╝
         │                   │                   │
         └───────────┬───────┴───────────────────┘
                     │
              ┌──────▼───────┐
              │  HOOK ENGINE │
              │   (stdio)    │
              └──────┬───────┘
                     │
              ┌──────▼───────┐
              │ Claude Desktop│
              └──────────────┘
```

**DMITRI**

Hooks are control. Before Claude acts, I see it. After Claude acts, I respond. When user speaks, I listen. This is power.

**HENCKELS**  
*(adjusting his military uniform)*

Not just power, Dmitri. *Precision*. Hooks enforce standards, maintain security, ensure compliance.

**LUDWIG**

Gentlemen, perhaps we should explain hooks to our audience before discussing philosophy.

---

## Chapter II: Hook Fundamentals

### What Are Hooks?

**ZERO**

Hooks are event-driven scripts that execute at specific points in Claude Desktop's workflow. They let you:

- ✅ Validate actions before they execute (PreToolUse)
- ✅ Automate tasks after actions complete (PostToolUse)
- ✅ Log and monitor user interactions (UserPromptSubmit)
- ✅ Trigger notifications and alerts (Notification)
- ✅ Clean up and summarize sessions (SessionEnd)

### Hook Lifecycle

```
┌────────────────────────────────────────────────────────────┐
│                    COMPLETE HOOK LIFECYCLE                  │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  1️⃣  USER INTERACTION                                      │
│     │                                                       │
│     ├─► UserPromptSubmit Hook                             │
│     │   • Log prompt                                       │
│     │   • Validate input                                   │
│     │   • Modify/enhance prompt                            │
│     │                                                       │
│  2️⃣  CLAUDE PROCESSING                                     │
│     │   (Reasoning, planning)                              │
│     │                                                       │
│  3️⃣  TOOL SELECTION                                        │
│     │                                                       │
│     ├─► PreToolUse Hook                                    │
│     │   • Security validation                              │
│     │   • Permission checks                                │
│     │   • Backup before destructive ops                    │
│     │   • Can BLOCK tool execution                         │
│     │                                                       │
│  4️⃣  TOOL EXECUTION                                        │
│     │   (File edit, shell command, API call)               │
│     │                                                       │
│     ├─► PostToolUse Hook                                   │
│     │   • Auto-format code                                 │
│     │   • Run tests/linters                                │
│     │   • Create audit logs                                │
│     │   • Trigger builds                                   │
│     │                                                       │
│  5️⃣  NOTIFICATION (if needed)                              │
│     │                                                       │
│     ├─► Notification Hook                                  │
│         • Desktop alerts                                   │
│         • Webhook triggers                                 │
│         • Email notifications                              │
│                                                             │
│  6️⃣  SESSION END                                           │
│     │                                                       │
│     └─► SessionEnd Hook                                    │
│         • Generate summaries                               │
│         • Cleanup temp files                               │
│         • Archive logs                                     │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## Chapter III: Hook Types and Use Cases

### 1. PreToolUse - The Gatekeeper

**DMITRI**

This is my favorite. Before Claude touches anything, I decide: allowed or blocked.

**Configuration Location:**
- `~/.config/claude-desktop/hooks.json` (Linux/macOS)
- `%APPDATA%\Claude\hooks.json` (Windows)
- Or embedded in Desktop Extension manifest

**Basic Structure:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "name": "security-check",
        "description": "Validate tool usage for security",
        "toolNamePattern": ".*",
        "script": {
          "command": "python",
          "args": ["scripts/security_check.py", "{toolName}", "{args}"]
        },
        "blocking": true,
        "timeout": 5000
      }
    ]
  }
}
```

**Available Variables:**
- `{toolName}` - Name of tool being invoked
- `{args}` - JSON-encoded arguments
- `{userId}` - Current user ID
- `{timestamp}` - ISO 8601 timestamp
- `{sessionId}` - Current session identifier

#### Use Case 1A: Block Dangerous Commands

```python
# scripts/security_check.py
import sys
import json
import re

DANGEROUS_PATTERNS = [
    r'rm\s+-rf\s+/',
    r'del\s+/[fFsS]\s+/[qQ]',
    r'DROP\s+DATABASE',
    r'chmod\s+777',
    r'eval\s*\(',
    r'exec\s*\(',
    r'__import__\s*\(',
    r'system\s*\(',
]

def check_security(tool_name: str, args: str) -> None:
    """
    Exit 0 = allow, exit 1 = block.
    """
    args_str = json.dumps(args).lower()
    
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, args_str, re.IGNORECASE):
            print(f"❌ BLOCKED: Dangerous pattern '{pattern}' detected", file=sys.stderr)
            print(f"Tool: {tool_name}", file=sys.stderr)
            print(f"Args: {args_str[:200]}", file=sys.stderr)
            sys.exit(1)
    
    print(f"✅ Security check passed: {tool_name}")
    sys.exit(0)

if __name__ == "__main__":
    tool_name = sys.argv[1]
    args = sys.argv[2]
    check_security(tool_name, args)
```

#### Use Case 1B: Require Confirmation for Sensitive Ops

```bash
#!/bin/bash
# scripts/confirm_sensitive.sh

TOOL_NAME="$1"
ARGS="$2"

# Check if tool modifies production
if echo "$ARGS" | grep -q "production\|main\|master"; then
    # Use zenity or osascript for GUI dialog
    if command -v zenity &> /dev/null; then
        zenity --question \
            --title="Confirm Sensitive Operation" \
            --text="$TOOL_NAME will modify production. Continue?" \
            --width=400
        exit $?
    elif command -v osascript &> /dev/null; then
        osascript -e "display dialog \"$TOOL_NAME will modify production. Continue?\" buttons {\"Cancel\", \"OK\"} default button \"Cancel\""
        exit $?
    fi
fi

exit 0
```

#### Use Case 1C: Backup Before Destructive Operations

```javascript
// scripts/backup_before_delete.js
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

async function backupBeforeDelete(toolName, argsJson) {
  const args = JSON.parse(argsJson);
  
  if (toolName === 'delete' || toolName === 'remove') {
    const filePath = args.path || args.filePath;
    
    if (filePath) {
      const backupDir = path.join(process.env.HOME, '.claude-backups');
      await fs.mkdir(backupDir, { recursive: true });
      
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const backupPath = path.join(backupDir, `${path.basename(filePath)}.${timestamp}.backup`);
      
      try {
        await fs.copyFile(filePath, backupPath);
        console.log(`✅ Backed up to: ${backupPath}`);
        process.exit(0);
      } catch (error) {
        console.error(`❌ Backup failed: ${error.message}`);
        process.exit(1);
      }
    }
  }
  
  process.exit(0);
}

const toolName = process.argv[2];
const args = process.argv[3];
backupBeforeDelete(toolName, args);
```

---

### 2. PostToolUse - The Automator

**HENCKELS**

After action, standards must be enforced. Format code. Run tests. Log changes.

**Configuration:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "name": "auto-format",
        "toolNamePattern": "edit|create",
        "script": {
          "command": "node",
          "args": ["scripts/auto_format.js", "{filePath}", "{language}"]
        },
        "async": false
      },
      {
        "name": "run-tests",
        "toolNamePattern": "edit",
        "script": {
          "command": "pytest",
          "args": ["tests/", "-v", "--tb=short"]
        },
        "async": true,
        "continueOnError": true
      }
    ]
  }
}
```

**Available Variables:**
- All PreToolUse variables, plus:
- `{filePath}` - Path to modified file (if applicable)
- `{language}` - Detected programming language
- `{result}` - Tool execution result
- `{duration}` - Execution time in milliseconds

#### Use Case 2A: Auto-Format Code

```javascript
// scripts/auto_format.js
const { execSync } = require('child_process');
const path = require('path');

const FORMATTERS = {
  python: 'ruff format {filePath}',
  javascript: 'prettier --write {filePath}',
  typescript: 'prettier --write {filePath}',
  go: 'gofmt -w {filePath}',
  rust: 'rustfmt {filePath}',
  json: 'prettier --write {filePath}',
  yaml: 'prettier --write {filePath}',
};

function formatFile(filePath, language) {
  const formatter = FORMATTERS[language];
  
  if (!formatter) {
    console.log(`⚠️  No formatter configured for ${language}`);
    return;
  }
  
  const command = formatter.replace('{filePath}', filePath);
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Formatted: ${path.basename(filePath)} (${language})`);
  } catch (error) {
    console.error(`❌ Format failed: ${error.message}`);
    process.exit(1);
  }
}

const filePath = process.argv[2];
const language = process.argv[3] || 'unknown';
formatFile(filePath, language);
```

#### Use Case 2B: Smart Test Runner

```python
# scripts/smart_test_runner.py
import sys
import os
import subprocess
from pathlib import Path

def run_tests(file_path: str) -> None:
    """
    Run tests related to the modified file.
    """
    file_path = Path(file_path)
    
    # Determine test file
    if 'src' in file_path.parts:
        # Convert src/module/file.py -> tests/module/test_file.py
        test_path = Path('tests') / file_path.relative_to('src').parent / f'test_{file_path.name}'
    else:
        test_path = Path('tests') / f'test_{file_path.name}'
    
    if test_path.exists():
        print(f"🧪 Running tests: {test_path}")
        try:
            subprocess.run(
                ['pytest', str(test_path), '-v', '--tb=short'],
                check=True
            )
            print(f"✅ Tests passed: {test_path}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Tests failed: {test_path}")
            sys.exit(1)
    else:
        print(f"⚠️  No tests found for {file_path}")

if __name__ == "__main__":
    file_path = sys.argv[1]
    run_tests(file_path)
```

#### Use Case 2C: Git Auto-Commit

```bash
#!/bin/bash
# scripts/git_auto_commit.sh

FILE_PATH="$1"
TOOL_NAME="$2"

# Only auto-commit if in git repo
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    exit 0
fi

# Check if file is tracked or in staging area
FILE_NAME=$(basename "$FILE_PATH")

git add "$FILE_PATH"
git commit -m "Auto-commit: $TOOL_NAME on $FILE_NAME

Generated by Claude Desktop hook at $(date -Iseconds)"

echo "✅ Auto-committed: $FILE_PATH"
```

---

### 3. UserPromptSubmit - The Logger

**LUDWIG**

Every prompt is data. Log it, validate it, analyze it.

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "name": "log-prompt",
        "script": {
          "command": "python",
          "args": ["scripts/log_prompt.py", "{prompt}", "{userId}"]
        },
        "async": true
      }
    ]
  }
}
```

#### Use Case 3A: Prompt Analytics

```python
# scripts/log_prompt.py
import sys
import json
from datetime import datetime
from pathlib import Path

def log_prompt(prompt: str, user_id: str) -> None:
    """
    Log prompts for analytics and auditing.
    """
    log_dir = Path.home() / '.claude-logs'
    log_dir.mkdir(exist_ok=True)
    
    log_file = log_dir / f'prompts_{datetime.now():%Y-%m}.jsonl'
    
    entry = {
        'timestamp': datetime.now().isoformat(),
        'user_id': user_id,
        'prompt': prompt,
        'length': len(prompt),
        'word_count': len(prompt.split())
    }
    
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(json.dumps(entry) + '\n')
    
    print(f"✅ Logged prompt ({len(prompt)} chars)")

if __name__ == "__main__":
    prompt = sys.argv[1]
    user_id = sys.argv[2]
    log_prompt(prompt, user_id)
```

---

### 4. Notification - The Alerter

**AGATHA**

When something important happens, I want to know immediately.

```json
{
  "hooks": {
    "Notification": [
      {
        "name": "desktop-notify",
        "script": {
          "command": "node",
          "args": ["scripts/notify.js", "{title}", "{message}"]
        }
      }
    ]
  }
}
```

#### Use Case 4A: Cross-Platform Notifications

```javascript
// scripts/notify.js
const { execSync } = require('child_process');
const os = require('os');

function sendNotification(title, message) {
  const platform = os.platform();
  
  try {
    if (platform === 'darwin') {
      // macOS
      execSync(`osascript -e 'display notification "${message}" with title "${title}"'`);
    } else if (platform === 'linux') {
      // Linux
      execSync(`notify-send "${title}" "${message}"`);
    } else if (platform === 'win32') {
      // Windows PowerShell
      const psScript = `
        Add-Type -AssemblyName System.Windows.Forms
        $notification = New-Object System.Windows.Forms.NotifyIcon
        $notification.Icon = [System.Drawing.SystemIcons]::Information
        $notification.BalloonTipTitle = "${title}"
        $notification.BalloonTipText = "${message}"
        $notification.Visible = $true
        $notification.ShowBalloonTip(5000)
      `;
      execSync(`powershell -Command "${psScript}"`);
    }
    
    console.log(`✅ Notification sent: ${title}`);
  } catch (error) {
    console.error(`❌ Notification failed: ${error.message}`);
  }
}

const title = process.argv[2];
const message = process.argv[3];
sendNotification(title, message);
```

---

### 5. SessionEnd - The Summarizer

**SERGE X.**

When session ends, I analyze. Token usage, files modified, time spent.

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "name": "session-summary",
        "script": {
          "command": "python",
          "args": ["scripts/session_summary.py", "{sessionId}", "{totalTokens}", "{duration}"]
        }
      }
    ]
  }
}
```

#### Use Case 5A: Generate Session Report

```python
# scripts/session_summary.py
import sys
import json
from datetime import datetime, timedelta
from pathlib import Path

def generate_summary(session_id: str, total_tokens: int, duration_ms: int) -> None:
    """
    Generate session summary report.
    """
    duration = timedelta(milliseconds=duration_ms)
    
    report_dir = Path.home() / '.claude-reports'
    report_dir.mkdir(exist_ok=True)
    
    report = {
        'session_id': session_id,
        'timestamp': datetime.now().isoformat(),
        'total_tokens': total_tokens,
        'duration_ms': duration_ms,
        'duration_human': str(duration),
        'tokens_per_minute': round(total_tokens / (duration_ms / 60000), 2)
    }
    
    report_file = report_dir / f'session_{session_id}.json'
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📊 Session Summary")
    print(f"   Session ID: {session_id}")
    print(f"   Duration: {duration}")
    print(f"   Tokens: {total_tokens:,}")
    print(f"   Rate: {report['tokens_per_minute']:.2f} tokens/min")
    print(f"   Report: {report_file}\n")

if __name__ == "__main__":
    session_id = sys.argv[1]
    total_tokens = int(sys.argv[2])
    duration_ms = int(sys.argv[3])
    generate_summary(session_id, total_tokens, duration_ms)
```

---

## Chapter IV: Advanced Patterns

### Pattern 1: Conditional Hooks

**DMITRI**

Not all hooks fire always. Use conditions to control when.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "name": "production-only-hook",
        "toolNamePattern": "deploy",
        "conditions": {
          "environment": "production",
          "branchPattern": "main|master"
        },
        "script": {
          "command": "bash",
          "args": ["scripts/production_deploy.sh"]
        }
      }
    ]
  }
}
```

### Pattern 2: Hook Chains

**HENCKELS**

Multiple hooks can execute in sequence. Order matters.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "name": "format",
        "order": 1,
        "script": "ruff format {filePath}"
      },
      {
        "name": "lint",
        "order": 2,
        "script": "ruff check {filePath}"
      },
      {
        "name": "test",
        "order": 3,
        "script": "pytest tests/",
        "continueOnError": true
      },
      {
        "name": "commit",
        "order": 4,
        "script": "git add . && git commit -m 'Auto: format, lint, test'"
      }
    ]
  }
}
```

### Pattern 3: Async vs Sync Hooks

**ZERO**

Some hooks must complete before continuing (sync). Others can run in background (async).

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "name": "critical-validation",
        "async": false,
        "blocking": true,
        "script": "python scripts/validate.py"
      },
      {
        "name": "backup-to-cloud",
        "async": true,
        "continueOnError": true,
        "script": "rclone sync . remote:backup/"
      }
    ]
  }
}
```

**Decision Matrix:**

```
┌──────────────────────────────────────────────────────────┐
│           Async vs Sync Hook Decision Matrix             │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Use SYNC (blocking) when:                               │
│  • Security validation required                          │
│  • Must ensure action completes before continuing        │
│  • Results needed for next step                          │
│  • Short execution time (<5 seconds)                     │
│                                                           │
│  Use ASYNC (non-blocking) when:                          │
│  • Long-running operations (cloud sync, backups)         │
│  • Non-critical notifications                            │
│  • Logging and analytics                                 │
│  • Can tolerate failures                                 │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Pattern 4: Error Handling

**LUDWIG**

Hooks fail. Plan for it.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "name": "risky-operation",
        "script": "node scripts/risky.js",
        "continueOnError": true,
        "retries": 3,
        "retryDelay": 1000,
        "onError": {
          "script": "node scripts/handle_error.js {error}"
        }
      }
    ]
  }
}
```

---

## Chapter V: The Hook Library

### Complete Hook Collection

**ZERO**

I've compiled the 20 most useful hooks from the community.

#### Security & Validation

```json
{
  "name": "security-validator",
  "event": "PreToolUse",
  "script": "python scripts/security_check.py {toolName} {args}"
}
```

```json
{
  "name": "permission-check",
  "event": "PreToolUse",
  "script": "bash scripts/check_permissions.sh {userId} {toolName}"
}
```

#### Code Quality

```json
{
  "name": "auto-format",
  "event": "PostToolUse",
  "toolPattern": "edit|create",
  "script": "ruff format {filePath}"
}
```

```json
{
  "name": "lint-check",
  "event": "PostToolUse",
  "toolPattern": "edit|create",
  "script": "ruff check {filePath} --fix"
}
```

```json
{
  "name": "type-check",
  "event": "PostToolUse",
  "toolPattern": "edit",
  "script": "ty check {filePath}"
}
```

#### Testing

```json
{
  "name": "smart-test-runner",
  "event": "PostToolUse",
  "toolPattern": "edit",
  "script": "python scripts/smart_test.py {filePath}",
  "async": true
}
```

```json
{
  "name": "coverage-check",
  "event": "PostToolUse",
  "toolPattern": "edit",
  "script": "pytest --cov={module} tests/",
  "continueOnError": true
}
```

#### Version Control

```json
{
  "name": "git-auto-commit",
  "event": "PostToolUse",
  "toolPattern": "edit|create|delete",
  "script": "bash scripts/auto_commit.sh {filePath} {toolName}"
}
```

```json
{
  "name": "pre-commit-hooks",
  "event": "PreToolUse",
  "toolPattern": "git.*commit",
  "script": "prek run"
}
```

#### Backup & Safety

```json
{
  "name": "backup-before-delete",
  "event": "PreToolUse",
  "toolPattern": "delete|remove",
  "script": "node scripts/backup.js {filePath}"
}
```

```json
{
  "name": "cloud-sync",
  "event": "PostToolUse",
  "script": "rclone sync . remote:backup/",
  "async": true
}
```

#### Notifications

```json
{
  "name": "desktop-notify",
  "event": "Notification",
  "script": "node scripts/notify.js {title} {message}"
}
```

```json
{
  "name": "slack-webhook",
  "event": "PostToolUse",
  "toolPattern": "deploy",
  "script": "curl -X POST $SLACK_WEBHOOK -d '{\"text\": \"Deployment completed\"}'"
}
```

#### Analytics & Logging

```json
{
  "name": "prompt-logger",
  "event": "UserPromptSubmit",
  "script": "python scripts/log_prompt.py {prompt} {userId}",
  "async": true
}
```

```json
{
  "name": "token-tracker",
  "event": "SessionEnd",
  "script": "python scripts/track_tokens.py {sessionId} {totalTokens}"
}
```

```json
{
  "name": "audit-log",
  "event": "PostToolUse",
  "script": "node scripts/audit.js {toolName} {userId} {timestamp}",
  "async": true
}
```

#### Performance

```json
{
  "name": "performance-profiler",
  "event": "PostToolUse",
  "toolPattern": "execute|run",
  "script": "python -m cProfile {scriptPath} > profiles/{timestamp}.prof"
}
```

```json
{
  "name": "benchmark",
  "event": "PostToolUse",
  "toolPattern": "execute",
  "script": "hyperfine --export-json bench.json {command}"
}
```

#### Documentation

```json
{
  "name": "auto-docstring",
  "event": "PostToolUse",
  "toolPattern": "create",
  "script": "python scripts/add_docstrings.py {filePath}",
  "continueOnError": true
}
```

```json
{
  "name": "update-readme",
  "event": "PostToolUse",
  "toolPattern": "create|delete",
  "script": "node scripts/update_readme.js"
}
```

#### Cleanup

```json
{
  "name": "session-cleanup",
  "event": "SessionEnd",
  "script": "bash scripts/cleanup.sh {sessionId}"
}
```

---

## Chapter VI: Installation & Configuration

### Setup Instructions

**HENCKELS**

Follow protocol exactly.

**Step 1: Locate hooks configuration**

```powershell
# Windows
$hooksFile = "$env:APPDATA\Claude\hooks.json"

# macOS
hooksFile="$HOME/Library/Application Support/Claude/hooks.json"

# Linux
hooksFile="$HOME/.config/Claude/hooks.json"
```

**Step 2: Create hooks.json**

```json
{
  "version": "1.0",
  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "UserPromptSubmit": [],
    "Notification": [],
    "SessionEnd": []
  }
}
```

**Step 3: Add hook scripts**

Create `scripts/` directory in your project:

```
project/
├── scripts/
│   ├── security_check.py
│   ├── auto_format.js
│   ├── smart_test.py
│   ├── notify.js
│   └── session_summary.py
└── .claude/
    └── hooks.json
```

**Step 4: Configure paths**

Update hooks.json with absolute paths or ensure scripts are in PATH.

**Step 5: Restart Claude Desktop**

Hooks are loaded on startup.

---

## Epilogue: The Master's Wisdom

*The control room dims. Dmitri turns to the camera.*

**DMITRI**

You now know hooks. But knowledge is not mastery. Mastery comes from:

1. **Precision** - Right hook, right time
2. **Testing** - Always test hooks in isolation
3. **Error Handling** - Plan for failure
4. **Performance** - Fast hooks, async when possible
5. **Security** - Never trust user input

**HENCKELS**

Standards must be maintained. Document your hooks. Version control them. Test them.

**LUDWIG**

And validate. Every hook should have tests.

**AGATHA**

With comprehensive test coverage.

**ZERO**

Thank you, masters. I'll use hooks wisely.

**DMITRI**  
*(final glance at the control panel)*

Good. Now you have power. Use it carefully.

---

## Resources

### Official Documentation
- [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks)
- [MCP Hooks Specification](https://modelcontextprotocol.io/docs/hooks)

### Community Resources
- [Hook Automation Guide (eesel.ai)](https://www.eesel.ai/blog/hooks-in-claude-code)
- [Ultimate Claude Code Guide (dev.to)](https://dev.to/holasoymalva/the-ultimate-claude-code-guide)
- [Hook Examples Repository](https://github.com/claude-hooks/examples)

### Tools
- [Hookdeck](https://hookdeck.com/) - Webhook infrastructure
- [n8n](https://n8n.io/) - Workflow automation
- [Zapier Claude Integration](https://zapier.com/apps/claude/integrations)

---

## Appendix: Quick Reference

### Hook Event Types

| Event | When Triggered | Can Block | Variables |
|-------|---------------|-----------|-----------|
| `UserPromptSubmit` | User submits prompt | No | `{prompt}`, `{userId}` |
| `PreToolUse` | Before tool executes | Yes | `{toolName}`, `{args}` |
| `PostToolUse` | After tool completes | No | `{toolName}`, `{result}`, `{filePath}` |
| `Notification` | Claude sends notification | No | `{title}`, `{message}` |
| `SessionEnd` | Session terminates | No | `{sessionId}`, `{totalTokens}`, `{duration}` |
| `ToolError` | Tool execution fails | No | `{toolName}`, `{error}` |
| `SubagentStart` | Subagent spawned | No | `{agentType}`, `{prompt}` |
| `SubagentStop` | Subagent completes | No | `{agentType}`, `{result}` |

### Exit Codes

| Code | Meaning | Action |
|------|---------|--------|
| `0` | Success | Continue execution |
| `1` | Error | Block execution (PreToolUse) or log error (PostToolUse) |
| `2` | Warning | Continue with warning logged |
| `3` | Skip | Skip remaining hooks in chain |

---

**Agent Avatars:**

```
     DMITRI                    HENCKELS                 LUDWIG
       🔒                         ⚔️                      📚
    ┌─────┐                   ┌─────┐                  ┌─────┐
    │ >_< │                   │ ├─┤ │                  │ ◉_◉ │
    └─┬─┬─┘                   └─┬─┬─┘                  └─┬─┬─┘
   ┌──┴─┴──┐                 ┌──┴─┴──┐                ┌──┴─┴──┐
   │▓▓▓▓▓▓▓│                 │╬╬╬╬╬╬╬│                │═══════│
   └───┬───┘                 └───┬───┘                └───┬───┘
```

---

*"Control is not tyranny. It is precision."*  
— Dmitri Desgoffe-und-Taxis, Security Specialist

---

**Tutorial Version:** 1.0.0  
**Last Updated:** 2026-01-29  
**License:** MIT  
**Repository:** [github.com/asears/grand-ai-hotel](https://github.com/asears/grand-ai-hotel)
