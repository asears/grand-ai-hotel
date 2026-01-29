# The Plugin Bazaar: A Model Context Protocol Adventure

**A Tutorial by The Grand Budapest Terminal Staff**

**Directed by:** M. Gustave H. (Chief Architect) & Zero (Implementation)  
**Featuring:** Ludwig (Validation Expert), Agatha (Testing Specialist), Dmitri (Security Auditor)  
**Special Appearance:** Henckels (Standards Enforcer), Serge X. (Performance Analyst)

**Runtime:** 30-45 minutes  
**Genre:** Technical Tutorial / Wes Anderson Aesthetic  
**Color Palette:** `#F1BB7B` (Mendl's Pink), `#5D4E6D` (Royal Purple), `#E8998D` (Dusty Rose), `#FD6467` (Raspberry)

---

## Act I: The Bazaar Opens

### Scene 1: The Grand Atrium

*The camera pulls back to reveal an ornate marketplace within the Grand Budapest Terminal. Colorful merchant stalls line both sides of a marble corridor. Each stall displays its wares—MCP servers, hooks, extensions—like exotic spices in a Moroccan souk.*

```
     ╔═══════════════════════════════════════════════════════════╗
     ║                  THE PLUGIN BAZAAR                        ║
     ║              Model Context Protocol Servers                ║
     ║                  & Desktop Extensions                      ║
     ╚═══════════════════════════════════════════════════════════╝

           🏪             🏪             🏪             🏪
        [GitHub]      [Filesystem]    [Database]    [Apidog]
          MCP            MCP            MCP           MCP

           🏪             🏪             🏪             🏪
        [Slack]        [Gmail]        [Search]      [Cloud]
          MCP            MCP            MCP           MCP
```

**M. GUSTAVE**  
*(adjusting his perfect lavender tie)*

Welcome, dear colleagues, to The Plugin Bazaar—where Claude Desktop becomes infinitely extensible through the Model Context Protocol. Each merchant here offers a server: a bridge between our AI and the external world.

**ZERO**

Monsieur Gustave, what exactly *is* a Model Context Protocol server?

**LUDWIG**  
*(pushing his glasses up, consulting a leather-bound manual)*

An MCP server, Zero, is a standardized interface. It allows Claude Desktop to safely interact with external tools, data sources, and services without compromising security or consistency.

```
┌──────────────────────────────────────────────────────────┐
│                MCP Architecture (ASCII)                   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐         ┌──────────────┐               │
│  │   Claude    │◄───────►│  MCP Host    │               │
│  │  Desktop    │  stdio  │  (npx/uvx)   │               │
│  └─────────────┘         └──────────────┘               │
│                                 │                         │
│                                 ▼                         │
│                    ┌────────────────────────┐            │
│                    │   MCP Server Process   │            │
│                    │  (Node.js / Python)    │            │
│                    └────────────────────────┘            │
│                                 │                         │
│                  ┌──────────────┼──────────────┐         │
│                  ▼              ▼              ▼          │
│           ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│           │  Tools   │   │Resources │   │ Prompts  │    │
│           └──────────┘   └──────────┘   └──────────┘    │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

### Scene 2: The Most Popular Stalls

*Serge X., the art expert, leads a guided tour through the bazaar.*

**SERGE X.**

Based on extensive analysis of community adoption and impact, I present: the essential MCP servers of 2026.

#### 🏆 Top 10 Essential MCP Servers

```ascii
┌─────────────────────────────────────────────────────────────────┐
│ Rank │ Server Name      │ Purpose            │ Impact Rating    │
├──────┼──────────────────┼────────────────────┼──────────────────┤
│  1   │ GitHub MCP       │ Repository mgmt    │ ████████████ 12/10│
│  2   │ Filesystem       │ Local file access  │ ███████████ 11/10│
│  3   │ Postgres/SQLite  │ Database queries   │ ██████████ 10/10 │
│  4   │ Apidog           │ API testing/docs   │ █████████ 9/10   │
│  5   │ Sequential Think │ Enhanced reasoning │ █████████ 9/10   │
│  6   │ Slack/Gmail      │ Communication      │ ████████ 8/10    │
│  7   │ Web Search (Exa) │ Real-time info     │ ████████ 8/10    │
│  8   │ Cloud (AWS/GCP)  │ Infrastructure     │ ███████ 7/10     │
│  9   │ Figma            │ Design integration │ ███████ 7/10     │
│ 10   │ Notion/Airtable  │ Project tracking   │ ██████ 6/10      │
└─────────────────────────────────────────────────────────────────┘
```

**AGATHA**  
*(examining a tray of pastries shaped like file icons)*

Monsieur Serge, could you elaborate on the GitHub server? We use it extensively.

**SERGE X.**

Of course, ma chère. The GitHub MCP server is the crown jewel.

#### GitHub MCP Server Deep Dive

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_TOKEN": "<your-github-pat>"
      }
    }
  }
}
```

**Capabilities:**
- 🔍 Search repositories, code, issues, PRs
- 📋 Create/update/close issues and PRs
- 🌿 Manage branches, commits, and merges
- 📊 View workflow runs and artifacts
- 💬 Add comments and reviews

**Example Prompts:**
- "List all open issues in asears/grand-ai-hotel with label 'documentation'"
- "Create a PR from feature/modern-typing to main with title 'Modernize Python typing'"
- "Show me the diff of the last commit on this branch"

---

### Scene 3: Installing Your First MCP Server

**ZERO**

How do we actually install one of these servers, Monsieur Gustave?

**M. GUSTAVE**  
*(producing an ornate instruction card from his pocket)*

Ah, installation. A delicate dance between configuration and execution. Ludwig will demonstrate the traditional method.

**LUDWIG**

The configuration lives in `claude_desktop_config.json`. Location varies by platform:

```powershell
# Windows
$env:APPDATA\Claude\claude_desktop_config.json

# macOS
~/Library/Application Support/Claude/claude_desktop_config.json

# Linux
~/.config/Claude/claude_desktop_config.json
```

**Example Configuration:**

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_yourTokenHere"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\projects"]
    },
    "postgres": {
      "command": "uvx",
      "args": ["mcp-server-postgres", "postgresql://localhost/mydb"]
    }
  }
}
```

**HENCKELS**  
*(marching up with military precision)*

Attention! Security protocol must be observed. Never commit tokens to version control. Use environment variables or secret managers.

```powershell
# Windows - Set environment variable
$env:GITHUB_TOKEN = "ghp_yourSecretToken"

# Add to config without hardcoding
{
  "env": {
    "GITHUB_TOKEN": "${GITHUB_TOKEN}"
  }
}
```

---

## Act II: Modern Installation - Desktop Extensions

### Scene 4: The .mcpb Revolution

*The scene shifts to a modern glass storefront within the bazaar. A sign reads: "DESKTOP EXTENSIONS - .mcpb FILES"*

**M. GUSTAVE**

But wait! The landscape has evolved. Allow me to present: Desktop Extensions—the `.mcpb` format.

**Pixel Art Diagram:**

```
    ┌─────────────────────────────────────────┐
    │   📦 MCP Desktop Extension (.mcpb)      │
    ├─────────────────────────────────────────┤
    │                                          │
    │  ┌──────────────────────────────────┐   │
    │  │  📜 manifest.json                │   │
    │  │  • name, version, permissions    │   │
    │  │  • icon, author, description     │   │
    │  └──────────────────────────────────┘   │
    │                                          │
    │  ┌──────────────────────────────────┐   │
    │  │  🔧 MCP Server Code              │   │
    │  │  • index.js / main.py            │   │
    │  │  • dependencies bundled          │   │
    │  └──────────────────────────────────┘   │
    │                                          │
    │  ┌──────────────────────────────────┐   │
    │  │  ⚙️  Pre-configured Hooks         │   │
    │  │  • PreToolUse / PostToolUse      │   │
    │  │  • Auto-format, test, lint       │   │
    │  └──────────────────────────────────┘   │
    │                                          │
    └─────────────────────────────────────────┘
              │ ONE-CLICK INSTALL │
              ▼                    ▼
    ┌──────────────────────────────────────┐
    │  Claude Desktop Automatically:       │
    │  ✅ Extracts extension               │
    │  ✅ Installs dependencies            │
    │  ✅ Configures hooks                 │
    │  ✅ Starts MCP server                │
    └──────────────────────────────────────┘
```

**ZERO**

So it's like... a package manager for MCP servers?

**LUDWIG**

Precisely. One-click installation, automatic configuration, bundled dependencies. No manual JSON editing required.

**Installation:**

```powershell
# Download .mcpb file
curl -O https://example.com/github-mcp.mcpb

# Double-click in file explorer, or:
claude://install-extension?url=https://example.com/github-mcp.mcpb

# Claude Desktop handles the rest automatically
```

---

## Act III: The Hook Masters

### Scene 5: Automation Through Hooks

*A mysterious curtained alcove opens. Inside, clockwork mechanisms tick rhythmically. Gears, levers, and pneumatic tubes create an elaborate automation system.*

**DMITRI**  
*(emerging from shadows, examining a hook mechanism)*

You want automation? Hooks are where control happens. Before tools run. After tools complete. When prompts submit.

**AGATHA**

Dmitri's right—though he could be less ominous about it. Hooks let us validate, transform, and respond to every MCP action.

#### Essential Claude Desktop Hooks

```
┌───────────────────────────────────────────────────────────────┐
│                    HOOK LIFECYCLE                              │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  User Submits Prompt                                          │
│         │                                                      │
│         ▼                                                      │
│  ┌──────────────────┐                                         │
│  │ UserPromptSubmit │ ◄─── Log prompts, validate input       │
│  └──────────────────┘                                         │
│         │                                                      │
│         ▼                                                      │
│  Claude Decides to Use Tool                                   │
│         │                                                      │
│         ▼                                                      │
│  ┌──────────────────┐                                         │
│  │   PreToolUse     │ ◄─── Block dangerous commands          │
│  └──────────────────┘      Enforce policies                   │
│         │                  Require confirmations               │
│         ▼                                                      │
│  Tool Executes (e.g., file edit, git commit)                 │
│         │                                                      │
│         ▼                                                      │
│  ┌──────────────────┐                                         │
│  │   PostToolUse    │ ◄─── Auto-format code                  │
│  └──────────────────┘      Run tests/linters                  │
│         │                  Create audit logs                   │
│         ▼                                                      │
│  ┌──────────────────┐                                         │
│  │  Notification    │ ◄─── Desktop alerts                    │
│  └──────────────────┘      External triggers                  │
│         │                                                      │
│         ▼                                                      │
│  ┌──────────────────┐                                         │
│  │   SessionEnd     │ ◄─── Cleanup, summaries               │
│  └──────────────────┘      Final reports                      │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

#### Hook Configuration Example

**Location:** `hooks.json` or within Desktop Extension

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "name": "security-check",
        "toolNamePattern": "MCP:.*",
        "script": {
          "command": "python",
          "args": ["scripts/security_check.py", "{toolName}", "{args}"]
        }
      }
    ],
    "PostToolUse": [
      {
        "name": "auto-format",
        "toolNamePattern": "edit|create",
        "script": {
          "command": "ruff",
          "args": ["format", "{filePath}"]
        }
      },
      {
        "name": "run-tests",
        "toolNamePattern": "edit",
        "script": {
          "command": "pytest",
          "args": ["tests/", "-v", "--tb=short"]
        },
        "async": true
      }
    ],
    "UserPromptSubmit": [
      {
        "name": "log-prompt",
        "script": {
          "command": "node",
          "args": ["scripts/log-prompt.js", "{prompt}"]
        }
      }
    ]
  }
}
```

**HENCKELS**

Observe: hooks can be synchronous (blocking) or asynchronous (non-blocking). Choose wisely based on workflow requirements.

#### Popular Hook Patterns

**1. Security Validation (PreToolUse)**

```python
# scripts/security_check.py
import sys
import json

def validate_tool_use(tool_name: str, args: str) -> None:
    """Block dangerous operations."""
    dangerous_patterns = [
        "rm -rf /",
        "del /f /s /q",
        "DROP DATABASE",
        "chmod 777"
    ]
    
    for pattern in dangerous_patterns:
        if pattern in args:
            print(f"❌ BLOCKED: Dangerous pattern detected: {pattern}")
            sys.exit(1)
    
    print(f"✅ Security check passed for {tool_name}")
    sys.exit(0)

if __name__ == "__main__":
    tool_name = sys.argv[1]
    args = sys.argv[2]
    validate_tool_use(tool_name, args)
```

**2. Auto-Formatting (PostToolUse)**

```javascript
// scripts/auto-format.js
const { execSync } = require('child_process');
const path = require('path');

function formatFile(filePath) {
  const ext = path.extname(filePath);
  
  try {
    if (ext === '.py') {
      execSync(`ruff format ${filePath}`, { stdio: 'inherit' });
      console.log(`✅ Formatted Python file: ${filePath}`);
    } else if (ext === '.js' || ext === '.ts') {
      execSync(`prettier --write ${filePath}`, { stdio: 'inherit' });
      console.log(`✅ Formatted JS/TS file: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Format failed: ${error.message}`);
    process.exit(1);
  }
}

const filePath = process.argv[2];
formatFile(filePath);
```

**3. Test Runner (PostToolUse - Async)**

```bash
#!/bin/bash
# scripts/run-tests.sh

FILE_PATH=$1

# Determine test file
if [[ $FILE_PATH == *"/src/"* ]]; then
    TEST_FILE=$(echo $FILE_PATH | sed 's/src/tests/' | sed 's/.py/_test.py/')
    
    if [ -f "$TEST_FILE" ]; then
        echo "🧪 Running tests for $FILE_PATH"
        pytest "$TEST_FILE" -v --tb=short
    else
        echo "⚠️  No test file found: $TEST_FILE"
    fi
fi
```

---

## Act IV: Building Your Own Plugin

### Scene 6: A Journey to the Provinces

*The scene transitions. A train departs The Grand Budapest Terminal, heading through snowy mountains to a small artisan workshop in rural Zubrowka, 1932.*

**M. GUSTAVE**  
*(narrating over vintage footage)*

And so, we journey beyond the hotel—to the provinces—where plugins are crafted by hand, marketed to the masses, and monetized with precision.

#### The Plugin Creation Workshop

*Inside a rustic studio. Workbenches covered with blueprints, typewriters, and brass instruments. A craftsman (IVAN THE PLUGIN MAKER) hunches over a desk.*

**IVAN**  
*(thick accent, looking up)*

You want to make MCP server? I show you. First, structure.

```
my-custom-mcp/
├── package.json          # Node.js metadata
├── manifest.json         # Desktop Extension metadata
├── index.js              # MCP server entry point
├── src/
│   ├── tools/            # Tool implementations
│   ├── resources/        # Resource providers
│   └── prompts/          # Prompt templates
├── scripts/
│   └── hooks/            # Hook scripts
├── icon.png              # Extension icon (256x256)
├── README.md             # Documentation
└── LICENSE               # Open source license
```

#### Step 1: Create package.json

```json
{
  "name": "mcp-server-custom",
  "version": "1.0.0",
  "description": "Custom MCP server for specialized workflows",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0"
  },
  "bin": {
    "mcp-server-custom": "./index.js"
  },
  "keywords": ["mcp", "claude", "ai", "automation"],
  "author": "Your Name",
  "license": "MIT"
}
```

#### Step 2: Create manifest.json (Desktop Extension)

```json
{
  "manifestVersion": "1.0",
  "name": "Custom MCP Server",
  "id": "com.yourcompany.mcp.custom",
  "version": "1.0.0",
  "description": "Specialized MCP server for your workflow",
  "author": {
    "name": "Your Name",
    "email": "you@example.com"
  },
  "icon": "icon.png",
  "permissions": [
    "filesystem:read",
    "filesystem:write",
    "network:http"
  ],
  "mcpServer": {
    "command": "node",
    "args": ["index.js"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "name": "validate-input",
        "script": "scripts/hooks/validate.js"
      }
    ],
    "PostToolUse": [
      {
        "name": "log-usage",
        "script": "scripts/hooks/log.js"
      }
    ]
  }
}
```

#### Step 3: Implement MCP Server (index.js)

```javascript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

// Create MCP server
const server = new Server(
  {
    name: 'custom-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {}
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_code',
        description: 'Analyze code quality and complexity',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Path to code file'
            },
            language: {
              type: 'string',
              description: 'Programming language'
            }
          },
          required: ['filePath']
        }
      }
    ]
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'analyze_code') {
    const { filePath, language = 'auto' } = args;
    
    // Your custom logic here
    const analysis = {
      complexity: 'moderate',
      lines: 250,
      issues: []
    };
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(analysis, null, 2)
        }
      ]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Custom MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
```

---

### Scene 7: Marketing, Branding, and Monetization

*The workshop transforms into a 1930s advertising agency. Posters, packaging, and promotional materials line the walls.*

**IVAN**

Good server is not enough. Must market! Must brand! Must monetize!

#### Branding Your MCP Server

**Visual Identity:**

```
┌─────────────────────────────────────────────────┐
│         MCP SERVER BRANDING CHECKLIST            │
├─────────────────────────────────────────────────┤
│                                                  │
│  ☑ Icon (256x256 PNG, distinctive design)      │
│  ☑ Color palette (2-4 colors, Wes Anderson)    │
│  ☑ Logo with wordmark                           │
│  ☑ Typography (monospace for code, serif UI)   │
│  ☑ Consistent naming convention                 │
│  ☑ Tagline (10 words or less)                  │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Example Branding:**

- **Name:** CodeQuality MCP
- **Tagline:** "Precision in every line"
- **Colors:** `#F4A460` (Sandy Brown), `#2F4F4F` (Dark Slate Gray)
- **Icon:** Vintage magnifying glass over code
- **Target Audience:** Senior developers, code reviewers, technical leads

#### Marketing Channels

**SERGE X.**  
*(analyzing market data on a vintage adding machine)*

Based on 2026 MCP adoption patterns:

```
┌──────────────────────────────────────────────────────────┐
│     MCP Server Distribution Channels (by Reach)          │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1. Claude Directory (claudedirectory.org)               │
│     • 50,000+ monthly visitors                           │
│     • Curated listings                                   │
│     • Category-based discovery                           │
│                                                           │
│  2. GitHub Awesome List (Awesome-Claude-MCP-Servers)     │
│     • 25,000+ stars                                      │
│     • Community-driven                                   │
│     • Open source preferred                              │
│                                                           │
│  3. NPM Registry (@modelcontextprotocol scope)           │
│     • Direct installation via npx                        │
│     • Searchable, versioned                              │
│                                                           │
│  4. Anthropic MCP Marketplace (coming 2026)              │
│     • Official distribution                              │
│     • Quality reviewed                                   │
│     • Monetization support                               │
│                                                           │
│  5. MCPcat.io                                            │
│     • Detailed reviews, guides                           │
│     • Installation instructions                          │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

#### Monetization Strategies

**M. GUSTAVE**  
*(presenting on a vintage overhead projector)*

Ah, the delicate art of extracting value while maintaining elegance.

**Model 1: Open Core**
- ✅ Basic MCP server: Free, open source (MIT/Apache 2.0)
- 💰 Premium features: Paid tier ($9-$49/month)
  - Advanced analytics
  - Priority support
  - Team collaboration features
  - Custom integrations

**Model 2: Freemium**
- ✅ Free tier: 100 requests/day
- 💰 Pro tier: Unlimited ($19/month)
- 💰 Enterprise: Custom pricing, SLA, dedicated support

**Model 3: Marketplace Commission**
- ✅ Free to download
- 💰 Revenue share on integrations (e.g., API calls, cloud storage)
- 📊 Example: Apidog MCP generates revenue when users upgrade to Apidog Pro

**Model 4: Sponsorship**
- ✅ Open source, free forever
- 💰 GitHub Sponsors, Patreon
- 🏢 Corporate sponsorships
- 📢 Sponsored by [Company] badge

#### Capabilities That Sell

**AGATHA**  
*(consulting market research data)*

Users pay for these capabilities:

1. **Time Savings** (automation, bulk operations)
2. **Data Integration** (connect disparate systems)
3. **Security & Compliance** (audit logs, role-based access)
4. **Team Collaboration** (shared contexts, workflows)
5. **Advanced Analytics** (insights, reporting)

---

### Scene 8: Publishing to the Marketplace

**ZERO**

Monsieur Ivan, how do we actually publish this?

**IVAN**

Ah! The final step. Package, document, submit.

#### Step 1: Package as Desktop Extension (.mcpb)

```bash
# Install packaging tool
npm install -g @anthropic/mcp-packager

# Package your MCP server
mcp-pack create \
  --manifest manifest.json \
  --entry index.js \
  --icon icon.png \
  --output custom-mcp.mcpb

# Result: custom-mcp.mcpb (portable, installable)
```

#### Step 2: Create Documentation

**README.md Template:**

```markdown
# Custom MCP Server

> Precision code analysis for Claude Desktop

## Features

- 🔍 Code complexity analysis
- 📊 Quality metrics
- 🚨 Issue detection

## Installation

### Via Desktop Extension (.mcpb)
1. Download `custom-mcp.mcpb`
2. Double-click to install
3. Restart Claude Desktop

### Via npx
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "custom": {
      "command": "npx",
      "args": ["-y", "mcp-server-custom"]
    }
  }
}
```

## Usage

Ask Claude:
- "Analyze the code complexity of src/main.py"
- "What quality issues exist in this file?"

## Configuration

Set environment variables for advanced features:
- `CUSTOM_MCP_API_KEY` - Premium features
- `CUSTOM_MCP_WEBHOOK_URL` - Notifications

## License

MIT
```

#### Step 3: Submit to Directories

**Claude Directory Submission:**

```yaml
# Submit PR to github.com/claudedirectory/servers
name: Custom MCP Server
category: Code Analysis
author: Your Name
repository: github.com/yourname/mcp-server-custom
description: |
  Precision code analysis with complexity metrics,
  quality scoring, and issue detection.
tags:
  - code-quality
  - analysis
  - python
  - javascript
installation: npx -y mcp-server-custom
```

**NPM Publishing:**

```bash
# Login to NPM
npm login

# Publish under @modelcontextprotocol scope (or your own)
npm publish --access public

# Tag version
git tag v1.0.0
git push --tags
```

---

## Act V: The Hook Library

### Scene 9: Zero's Hook Collection

*Zero presents a leather-bound tome titled "The Complete Hook Compendium"*

**ZERO**

I've catalogued every useful hook pattern from the community. Here are the essentials.

#### Essential Hooks Collection

**1. Auto-Format on Save**

```json
{
  "name": "auto-format",
  "event": "PostToolUse",
  "toolPattern": "edit|create",
  "languages": {
    "python": "ruff format {filePath}",
    "javascript": "prettier --write {filePath}",
    "go": "gofmt -w {filePath}",
    "rust": "rustfmt {filePath}"
  }
}
```

**2. Git Auto-Commit**

```json
{
  "name": "git-auto-commit",
  "event": "PostToolUse",
  "toolPattern": "edit|create|delete",
  "script": "git add {filePath} && git commit -m 'Auto-commit: {toolName} on {fileName}'"
}
```

**3. Security Scanner**

```json
{
  "name": "security-scan",
  "event": "PreToolUse",
  "toolPattern": ".*",
  "script": "python scripts/security_scan.py {toolName} {args}"
}
```

**4. Test Runner (Smart)**

```json
{
  "name": "smart-test-runner",
  "event": "PostToolUse",
  "toolPattern": "edit",
  "conditions": {
    "pathPattern": "src/**/*.py"
  },
  "script": "pytest tests/$(basename {filePath} .py)_test.py -v"
}
```

**5. Notification on Error**

```json
{
  "name": "error-notification",
  "event": "ToolError",
  "script": "notify-send 'MCP Error' '{errorMessage}'"
}
```

**6. Token Usage Logger**

```json
{
  "name": "token-logger",
  "event": "SessionEnd",
  "script": "echo '$(date): {totalTokens} tokens used' >> logs/token-usage.log"
}
```

**7. Backup Before Destructive Ops**

```json
{
  "name": "backup-before-delete",
  "event": "PreToolUse",
  "toolPattern": "delete|remove",
  "script": "cp {filePath} backups/{fileName}.backup"
}
```

**8. Lint Before Commit**

```json
{
  "name": "lint-before-commit",
  "event": "PreToolUse",
  "toolPattern": "git.*commit",
  "script": "ruff check . --fix && prettier --check ."
}
```

**9. Sync to Cloud**

```json
{
  "name": "sync-to-cloud",
  "event": "PostToolUse",
  "async": true,
  "script": "rclone sync . remote:backup/"
}
```

**10. Performance Profiler**

```json
{
  "name": "profile-execution",
  "event": "PostToolUse",
  "toolPattern": "execute|run",
  "script": "python -m cProfile {scriptPath} > profiles/{timestamp}.prof"
}
```

---

## Epilogue: The Bazaar at Night

*The camera pulls back. The bazaar lights dim. M. Gustave locks the ornate gates.*

**M. GUSTAVE**

And so, dear colleagues, The Plugin Bazaar closes for the evening. But the MCP ecosystem—ah, it never sleeps. Servers hum, hooks trigger, and Claude Desktop grows ever more capable.

**LUDWIG**

Remember: every MCP server is a bridge. Every hook is automation. Together, they transform Claude from assistant to infrastructure.

**SERGE X.**

The numbers speak for themselves:
- 200+ MCP servers available (2026)
- 1,000+ published hooks
- 50,000+ active Claude Desktop users leveraging MCP
- 10x productivity gains reported

**AGATHA**

And most importantly: these tools are *tested*. The community validates every server.

**DMITRI**

*Secured*. Or they should be. Always audit your MCP servers.

**HENCKELS**

*Standardized*. The Model Context Protocol ensures compatibility.

**ZERO**

Thank you all. I understand now—the bazaar isn't just a marketplace. It's an ecosystem.

**M. GUSTAVE**  
*(final glance at the moonlit bazaar)*

Precisely, Zero. Now let us retire. Tomorrow, we build our own plugin.

---

## Resources & References

### Official Documentation
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop Extensions Guide](https://www.anthropic.com/engineering/desktop-extensions)
- [Hooks Reference (Claude Code)](https://code.claude.com/docs/en/hooks)

### Community Directories
- [Claude Directory](https://www.claudedirectory.org/) - Curated MCP servers
- [Awesome Claude MCP Servers (GitHub)](https://github.com/win4r/Awesome-Claude-MCP-Servers)
- [MCPcat.io Guides](https://mcpcat.io/guides/best-mcp-servers-for-claude-code/)

### Popular MCP Servers
- [@modelcontextprotocol/server-github](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [@modelcontextprotocol/server-filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [mcp-server-postgres](https://github.com/benborgers/mcp-server-postgres)
- [Apidog MCP Server](https://apidog.com/blog/top-10-mcp-servers-for-claude-code/)

### Development Tools
- [MCP SDK (Node.js)](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP SDK (Python)](https://github.com/modelcontextprotocol/python-sdk)
- [@anthropic/mcp-packager](https://www.npmjs.com/package/@anthropic/mcp-packager) (hypothetical)

### Tutorials & Guides
- [MCP Server Development Guide](https://modelcontextprotocol.io/docs/getting-started)
- [Hook Automation Patterns](https://www.eesel.ai/blog/hooks-in-claude-code)
- [Desktop Extension Packaging](https://www.youtube.com/watch?v=MI1IEN9QORk)

---

## Appendix: Agent Avatars (ASCII Pixel Art)

```
     M. GUSTAVE                    ZERO                    LUDWIG
       🎩                          📋                       📚
     ┌─────┐                    ┌─────┐                  ┌─────┐
     │ ^-^ │                    │ o_o │                  │ ◉_◉ │
     └─┬─┬─┘                    └─┬─┬─┘                  └─┬─┬─┘
    ┌──┴─┴──┐                  ┌──┴─┴──┐                ┌──┴─┴──┐
    │ ♦ ♦ ♦ │                  │   ▓   │                │ ═════ │
    └───┬───┘                  └───┬───┘                └───┬───┘

      AGATHA                    DMITRI                   HENCKELS
        🧁                        🔒                       ⚔️
     ┌─────┐                    ┌─────┐                  ┌─────┐
     │ ^_^ │                    │ >_< │                  │ ├─┤ │
     └─┬─┬─┘                    └─┬─┬─┘                  └─┬─┬─┘
    ┌──┴─┴──┐                  ┌──┴─┴──┐                ┌──┴─┴──┐
    │ ░▒▓▒░ │                  │ ▓▓▓▓▓ │                │ ╬╬╬╬╬ │
    └───┬───┘                  └───┬───┘                └───┬───┘

                              SERGE X.
                                🎨
                             ┌─────┐
                             │ @_@ │
                             └─┬─┬─┘
                            ┌──┴─┴──┐
                            │ ▓░▓░▓ │
                            └───┬───┘
```

---

**End Credits:**

**Written by:** M. Gustave H. & Zero Moustafa  
**Technical Direction:** Ludwig (Type Safety)  
**Security Consultant:** Dmitri Desgoffe-und-Taxis  
**Testing Specialist:** Agatha (Mendl's Bakery)  
**Standards Enforcement:** Deputy Henckels  
**Performance Analysis:** Serge X.  
**Special Thanks:** Ivan the Plugin Maker

**Color Grading:** Wes Anderson Color Palette  
**Cinematography:** Symmetrical frames, vintage filters  
**Soundtrack:** Balalaika arrangements

---

*"The Plugin Bazaar never closes, dear boy. It merely waits for the next act."*  
— M. Gustave H., Concierge of The Grand Budapest Terminal

---

**Tutorial Version:** 1.0.0  
**Last Updated:** 2026-01-29  
**License:** MIT  
**Repository:** [github.com/asears/grand-ai-hotel](https://github.com/asears/grand-ai-hotel)
