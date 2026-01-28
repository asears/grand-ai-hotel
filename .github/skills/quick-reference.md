# Grand Budapest Terminal Quick Reference
*Character-to-Feature Guide*

---

## 🎭 When to Use Each Character

### M. Gustave - The Concierge
**"Excellence in all endeavors"**

**Use when you need:**
- Code quality improvements
- Documentation writing
- API design review
- Architectural decisions
- Elegant solutions

**Example prompts:**
```
"Review this API for consistency"
"Document the NLP module comprehensively"
"Refine this component's architecture"
```

---

### Zero Moustafa - The Lobby Boy
**"At your service"**

**Use when you need:**
- General task execution
- Command running
- Basic implementations
- Learning new concepts
- Quick modifications

**Example prompts:**
```
"Run the test suite"
"Install project dependencies"
"Create a basic data loader"
```

---

### Agatha - The Baker/Tester
**"Precision and sweetness"**

**Use when you need:**
- Test data generation
- Data preprocessing
- Unit test creation
- Validation tasks
- Quality assurance

**Example prompts:**
```
"Generate sample NLP training data"
"Create unit tests for the tokenizer"
"Validate the preprocessing output"
```

---

### Dmitri - The Antagonist
**"Let me try to break this"**

**Use when you need:**
- Security testing
- Edge case discovery
- Adversarial testing
- Vulnerability assessment
- Challenge assumptions

**Example prompts:**
```
"Find edge cases in input validation"
"Test for security vulnerabilities"
"Try malicious input patterns"
```

---

### Deputy Henckels - The Officer
**"Order and compliance"**

**Use when you need:**
- Code review
- Standards enforcement
- CI/CD setup
- Compliance checks
- Best practices

**Example prompts:**
```
"Review this PR for standards"
"Set up GitHub Actions workflow"
"Enforce linting rules"
```

---

### Ludwig - The Butler
**"Meticulous precision"**

**Use when you need:**
- Type checking
- Schema validation
- Contract verification
- License compliance
- Documentation accuracy

**Example prompts:**
```
"Add type hints to the codebase"
"Validate JSON schema"
"Check license compatibility"
```

---

### Serge X. - The Art Expert
**"Upon closer examination..."**

**Use when you need:**
- Performance analysis
- Model evaluation
- Benchmarking
- Code profiling
- Metric collection

**Example prompts:**
```
"Profile training performance"
"Benchmark tokenization approaches"
"Analyze memory usage patterns"
```

---

## ⚡ Quick Command Cheatsheet

### Essential CLI Commands
```bash
copilot              # Launch CLI
/help                # Show help
/login               # Authenticate
/agent               # Browse agents
```

### Navigation
```bash
/cwd                 # Show current directory
/cd src/nlp          # Change directory
/add-dir <path>      # Whitelist directory
@file.py             # Mention file in context
```

### Planning & Review
```bash
/plan <prompt>       # Create implementation plan
/review <prompt>     # Run code review
/diff                # Show changes
```

### Session Management
```bash
/session             # View session info
/resume              # Switch sessions
/clear               # Start new session
/rename <name>       # Rename session
```

### Configuration
```bash
/model               # Select AI model
/skills list         # View skills
/theme set dark      # Change theme
/mcp show            # Show MCP servers
```

---

## 🔄 Common Workflows

### New Feature
```
1. /plan Implement <feature>     (M. Gustave plans)
2. @relevant-file.py Implement   (Zero executes)
3. /review                       (Henckels reviews)
4. Generate tests                (Agatha tests)
5. Find edge cases               (Dmitri challenges)
```

### Bug Fix
```
1. Analyze error logs            (Serge X. analyzes)
2. Reproduce the bug             (Dmitri finds edge case)
3. Implement fix                 (Zero fixes)
4. Validate fix                  (Agatha validates)
```

### Code Quality
```
1. Define standards              (M. Gustave)
2. Add type hints                (Ludwig)
3. Set up linting                (Henckels)
4. Increase coverage             (Agatha)
5. Optimize hotspots             (Serge X.)
```

---

## 📍 File Locations

**Agent Definitions:**
- `.github/agents/*.agent.md`

**Instructions:**
- `.github/instructions/*.instructions.md`

**Skills:**
- `.github/skills/*.md`

**Prompts:**
- `.github/prompts/*.md`

**Workflows:**
- `.github/workflows/*.md`

---

## 🎯 Decision Guide

**Need quality/docs?** → M. Gustave  
**Need execution?** → Zero  
**Need testing/data?** → Agatha  
**Need breaking?** → Dmitri  
**Need compliance?** → Henckels  
**Need validation?** → Ludwig  
**Need analysis?** → Serge X.

---

*For the full screenplay tutorial, see:*  
`.github/prompts/grand-budapest-cli-tutorial.md`

*For detailed persona diagrams, see:*  
`.github/skills/agent-personas-diagram.md`
