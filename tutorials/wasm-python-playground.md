# Building a WebAssembly Python Playground with AI Agents

> **Tutorial: Creating an interactive Python AST parser in the browser**  
> **Difficulty:** Advanced  
> **Time:** 2-3 hours  
> **Last Updated:** January 29, 2026

---

## 🎯 What You'll Build

An interactive Python code analyzer that runs entirely in your browser using WebAssembly, featuring:

- 🐍 **Pyodide** - Full Python runtime in WASM
- 🌳 **AST Parsing** - Real-time code structure analysis
- 🤖 **AI Agents** - Security, quality, and performance analysis
- 🎨 **Monaco Editor** - VS Code-like editing experience
- 📊 **Visual Analytics** - Interactive code metrics
- 🚀 **GitHub Pages** - Zero-cost deployment

**Live Demo:** [asears.github.io/grand-ai-hotel/wasm-playground](https://asears.github.io/grand-ai-hotel/wasm-playground)

---

## 📚 Prerequisites

### Knowledge Required
- Intermediate JavaScript (ES modules, async/await)
- Basic Python (AST module familiarity helpful)
- HTML/CSS fundamentals
- Git and GitHub basics

### Tools & Setup
```bash
# Verify Node.js 18+
node --version  # Should be v18.0.0 or higher

# Verify Python 3.11+
python --version  # Should be 3.11 or higher

# Clone repository
git clone https://github.com/asears/grand-ai-hotel.git
cd grand-ai-hotel/examples/wasm
```

---

## 🏗️ Architecture Overview

### The Stack

```
┌─────────────────────────────────────────┐
│         User Interface (HTML/CSS)       │
│  Monaco Editor + Results Dashboard      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      JavaScript Application Layer       │
│  • Editor setup (Monaco)                │
│  • Event handlers                       │
│  • Agent orchestration                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Pyodide WASM Runtime            │
│  • Python 3.11 interpreter              │
│  • AST module (built-in)                │
│  • Custom analyzers (Python)            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Analysis Modules (Python)       │
│  • ast_analyzer.py                      │
│  • security_scanner.py                  │
│  • complexity_analyzer.py               │
└─────────────────────────────────────────┘
```

### Why This Architecture?

**WebAssembly Benefits:**
- ✅ Near-native performance
- ✅ Secure sandbox (no file/network access)
- ✅ Run Python in browser without server
- ✅ Portable across all platforms

**Pyodide Advantages:**
- ✅ Full Python 3.11 runtime
- ✅ Standard library included (ast, re, json)
- ✅ ~8MB compressed (cached after first load)
- ✅ Active development & community

---

## 📦 Part 1: Project Setup

### Step 1.1: Initialize Project

```bash
cd examples/wasm

# Install dependencies
npm install

# Project structure
mkdir -p src/{js,python,styles}
mkdir -p src/js/{agents,ui,utils}
mkdir -p tests/{python,js}
mkdir -p docs
```

### Step 1.2: Configure Build Tool (Vite)

Create `vite.config.js`:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/grand-ai-hotel/wasm-playground/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 8080,
    open: true,
  },
  optimizeDeps: {
    exclude: ['pyodide'],
  },
});
```

**Why Vite?**
- ⚡ Lightning-fast HMR (Hot Module Replacement)
- 📦 Automatic code splitting
- 🔧 Zero configuration for ES modules
- 🚀 Optimized production builds

### Step 1.3: Test Development Server

```bash
npm run dev
# Should open http://localhost:8080
```

---

## 🐍 Part 2: Integrating Pyodide

### Step 2.1: Load Pyodide Runtime

Create `src/js/pyodide-loader.js`:

```javascript
/**
 * Pyodide WebAssembly Loader
 * Initializes Python runtime in browser
 */

let pyodideInstance = null;
let loadingPromise = null;

export async function loadPyodide(onProgress) {
  // Return existing instance if already loaded
  if (pyodideInstance) {
    return pyodideInstance;
  }

  // Return existing promise if loading in progress
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      onProgress?.('Downloading Pyodide runtime...');

      // Load from CDN (cached after first load)
      pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      });

      onProgress?.('Loading Python modules...');

      // Pre-import required modules
      await pyodideInstance.runPythonAsync(`
        import ast
        import json
        import re
        print('Python runtime ready!')
      `);

      onProgress?.('Pyodide ready!');
      return pyodideInstance;
    } catch (error) {
      console.error('Pyodide load failed:', error);
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
}

export function getPyodide() {
  if (!pyodideInstance) {
    throw new Error('Pyodide not loaded. Call loadPyodide() first.');
  }
  return pyodideInstance;
}
```

**Key Points:**
- Singleton pattern ensures one Pyodide instance
- Progress callbacks for UX feedback
- CDN caching reduces subsequent loads
- Pre-import common modules

### Step 2.2: Load Python Analyzer Modules

Create `src/js/python-runner.js`:

```javascript
import { getPyodide } from './pyodide-loader.js';

/**
 * Execute Python code analyzer
 */
export async function runPythonAnalyzer(pythonCode) {
  const pyodide = getPyodide();

  // Load analyzer module into Pyodide
  const analyzerCode = await fetch('/src/python/ast_analyzer.py').then((r) =>
    r.text()
  );
  await pyodide.runPythonAsync(analyzerCode);

  // Load security scanner
  const securityCode = await fetch('/src/python/security_scanner.py').then((r) =>
    r.text()
  );
  await pyodide.runPythonAsync(securityCode);

  // Run analysis
  const result = await pyodide.runPythonAsync(`
    import json
    from ast_analyzer import analyze_code
    from security_scanner import scan_security
    import ast

    code = '''${pythonCode.replace(/'/g, "\\'")}'''
    
    # Get basic analysis
    analysis = json.loads(analyze_code(code))
    
    if analysis['success']:
        # Add security scan
        tree = ast.parse(code)
        analysis['security'] = scan_security(code, tree)
    
    json.dumps(analysis)
  `);

  return JSON.parse(result);
}
```

---

## 🎨 Part 3: Building the UI

### Step 3.1: Monaco Editor Integration

Create `src/js/ui/editor.js`:

```javascript
import * as monaco from 'monaco-editor';

let editorInstance = null;

export function initializeEditor(containerId) {
  const container = document.getElementById(containerId);

  editorInstance = monaco.editor.create(container, {
    value: getDefaultCode(),
    language: 'python',
    theme: 'vs-dark',
    automaticLayout: true,
    fontSize: 14,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
  });

  // Update stats on change
  editorInstance.onDidChangeModelContent(() => {
    updateEditorStats();
  });

  return editorInstance;
}

function getDefaultCode() {
  return `# Python AST Playground
# Write Python code and analyze it!

def greet(name: str) -> str:
    """Greet someone by name."""
    return f"Hello, {name}!"

class Calculator:
    """Simple calculator class."""
    
    def add(self, a: int, b: int) -> int:
        return a + b
    
    def multiply(self, a: int, b: int) -> int:
        return a * b

# Example usage
if __name__ == "__main__":
    calc = Calculator()
    result = calc.add(5, 3)
    print(greet("World"))
    print(f"5 + 3 = {result}")
`;
}

function updateEditorStats() {
  const model = editorInstance.getModel();
  const lineCount = model.getLineCount();
  const charCount = model.getValue().length;

  document.getElementById('line-count').textContent = `Lines: ${lineCount}`;
  document.getElementById('char-count').textContent = `Characters: ${charCount}`;
}

export function getEditorCode() {
  return editorInstance?.getValue() || '';
}

export function setEditorCode(code) {
  editorInstance?.setValue(code);
}
```

### Step 3.2: Wes Anderson Color Theme

Create `src/styles/main.css`:

```css
:root {
  /* Wes Anderson color palette */
  --burgundy: #800020;
  --pink: #ffb6c1;
  --gold: #c5b358;
  --cream: #fffdd0;
  --charcoal: #36454f;
  --sage: #9caf88;

  /* Semantic colors */
  --primary: var(--burgundy);
  --accent: var(--pink);
  --text: var(--charcoal);
  --bg: var(--cream);
  --border: var(--gold);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', monospace;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

.header {
  background: var(--primary);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid var(--gold);
}

.title {
  font-size: 2rem;
  font-weight: bold;
}

.subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Grand Budapest aesthetic */
.btn-primary {
  background: var(--burgundy);
  color: white;
  border: 2px solid var(--gold);
}

.btn-primary:hover:not(:disabled) {
  background: var(--pink);
  color: var(--burgundy);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.agent-card {
  background: white;
  border: 3px solid var(--gold);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: transform 0.2s;
}

.agent-card:hover {
  transform: translateX(4px);
  box-shadow: -4px 4px 0 var(--pink);
}
```

---

## 🤖 Part 4: Implementing AI Agents

### Step 4.1: Base Agent Class

Create `src/js/agents/base-agent.js`:

```javascript
export class BaseAgent {
  constructor(name, role, icon) {
    this.name = name;
    this.role = role;
    this.icon = icon;
  }

  analyze(analysisData) {
    throw new Error('analyze() must be implemented by subclass');
  }

  renderResults(container) {
    throw new Error('renderResults() must be implemented by subclass');
  }
}
```

### Step 4.2: Dmitri (Security Agent)

Create `src/js/agents/dmitri.js`:

```javascript
import { BaseAgent } from './base-agent.js';

export class DmitriAgent extends BaseAgent {
  constructor() {
    super('Dmitri', 'Security Auditor', '🔒');
    this.issues = [];
  }

  analyze(analysisData) {
    if (!analysisData.security) {
      this.issues = [];
      return;
    }

    this.issues = analysisData.security;
  }

  renderResults(container) {
    if (this.issues.length === 0) {
      container.innerHTML = `
        <div class="success-message">
          ✅ No security issues found. Code looks secure!
        </div>
      `;
      return;
    }

    const issuesHtml = this.issues.map((issue) => `
      <div class="issue issue-${issue.severity.toLowerCase()}">
        <div class="issue-header">
          <span class="severity-badge ${issue.severity.toLowerCase()}">
            ${issue.severity}
          </span>
          <span class="issue-title">${issue.title}</span>
          <span class="issue-line">Line ${issue.lineno}</span>
        </div>
        <p class="issue-description">${issue.description}</p>
        <p class="issue-recommendation">
          <strong>Fix:</strong> ${issue.recommendation}
        </p>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="issues-summary">
        Found ${this.issues.length} security issue(s)
      </div>
      ${issuesHtml}
    `;
  }
}
```

---

## 🚀 Part 5: Deployment to GitHub Pages

### Step 5.1: Create Deployment Workflow

See `.github/workflows/deploy-wasm-playground.yml` (commented out for now)

### Step 5.2: Configure GitHub Pages

1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. Save

### Step 5.3: Build and Deploy

```bash
# Build production bundle
npm run build

# Deploy manually (or use workflow)
npm run deploy
```

---

## 🧪 Part 6: Testing

### Step 6.1: Python Unit Tests

Create `tests/python/test_security_scanner.py`:

```python
import ast
import pytest
from src.python.security_scanner import SecurityScanner

def test_detects_eval():
    code = "result = eval(user_input)"
    tree = ast.parse(code)
    scanner = SecurityScanner(code, tree)
    issues = scanner.scan()
    
    assert len(issues) > 0
    assert any("eval" in issue["title"] for issue in issues)
    assert any(issue["severity"] == "HIGH" for issue in issues)

def test_detects_sql_injection():
    code = '''
query = f"SELECT * FROM users WHERE id = {user_id}"
db.execute(query)
'''
    tree = ast.parse(code)
    scanner = SecurityScanner(code, tree)
    issues = scanner.scan()
    
    assert len(issues) > 0
    assert any("SQL" in issue["title"] for issue in issues)
```

Run tests:
```bash
pytest tests/python/ -v --cov=src/python
```

---

## 📊 Performance Optimization

### Lazy Loading Pyodide

Only load when user interacts:

```javascript
let pyodideLoaded = false;

analyzeButton.addEventListener('click', async () => {
  if (!pyodideLoaded) {
    await loadPyodide(updateStatus);
    pyodideLoaded = true;
  }
  // Proceed with analysis
});
```

### Web Workers for Non-Blocking

```javascript
// Future enhancement: Run Pyodide in Web Worker
const worker = new Worker('/js/pyodide-worker.js');
worker.postMessage({ code: pythonCode });
worker.onmessage = (e) => {
  displayResults(e.data);
};
```

---

## 🎓 Learning Outcomes

After completing this tutorial, you'll understand:

✅ WebAssembly fundamentals and use cases  
✅ Pyodide integration and Python in browser  
✅ AST parsing and static code analysis  
✅ Security pattern detection  
✅ Monaco Editor integration  
✅ GitHub Pages deployment  
✅ Agent-based architecture patterns  

---

## 🔗 Related Resources

- [Pyodide Documentation](https://pyodide.org/en/stable/)
- [Python AST Module](https://docs.python.org/3/library/ast.html)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/)
- [WebAssembly MDN](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Agent Patterns Guide](../examples/wasm/docs/agent-patterns.md)

---

## 🐛 Troubleshooting

### NPM Audit Vulnerabilities (Updated: Jan 29, 2026)

**Error:** `5 moderate severity vulnerabilities`

**Issue:** Initial package.json used outdated Vite 5.0 and Vitest 1.0  
**CVE:** esbuild SSRF vulnerability (GHSA-67mh-4wv8-2f99)

**Solution:**
```bash
# Update package.json to use:
# "vite": "^6.1.7"
# "vitest": "^2.1.8"
# "@vitest/ui": "^2.1.8"

npm install
npm audit  # Should show 0 vulnerabilities
```

**Note:** Vite 6.x may have breaking changes. Test thoroughly after upgrade.

### Missing Python Modules

**Error:** `404 Not Found` when loading analyzer modules

**Issue:** Three Python modules referenced in JavaScript but not implemented:
- `complexity_analyzer.py` (Serge X.)
- `quality_checker.py` (M. Gustave)  
- `test_hints.py` (Agatha)

**Solution:** See [IMPLEMENTATION_PLAN.md](../examples/wasm/IMPLEMENTATION_PLAN.md) for module specifications.

### Missing Configuration Files

**Error:** Vite/TypeScript/ESLint not configured

**Solution:** Create required config files:
```bash
# See examples/wasm/IMPLEMENTATION_PLAN.md for:
# - vite.config.js
# - tsconfig.json
# - .eslintrc.json
# - .prettierrc
# - playwright.config.js
```

### Pyodide Fails to Load

**Error:** `Failed to fetch pyodide`

**Solution:**
```javascript
// Use specific CDN version
indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
```

### Monaco Editor Not Displaying

**Error:** Blank editor area

**Solution:**
```css
#editor-container {
  height: 600px; /* Must set explicit height */
  width: 100%;
}
```

### CORS Issues in Development

**Error:** `Cross-origin request blocked`

**Solution:**
```bash
# Use Vite dev server (handles CORS)
npm run dev
```

### Vite 6 Breaking Changes

**Error:** Build fails after upgrading to Vite 6.x

**Solution:**
```javascript
// vite.config.js may need updates
// Check migration guide: https://vitejs.dev/guide/migration.html
```

---

## 🎯 Next Steps

**Enhance Your Playground:**
1. Add more agents (Ludwig for types, Agatha for tests)
2. Implement AST visualization with D3.js
3. Add code fix suggestions (auto-fix security issues)
4. Integrate GitHub Copilot API for AI suggestions
5. Export analysis reports as PDF
6. Share results via URL encoding

**Advanced Features:**
- Real-time collaboration (WebRTC)
- Custom security rules editor
- Plugin system for custom analyzers
- Multi-file project support

---

**Author:** M. Gustave (Architect) & Zero (Implementer)  
**Contributors:** Dmitri (Security), Agatha (Testing), Ludwig (Types)  
**Last Updated:** January 29, 2026  
**License:** CC0-1.0
