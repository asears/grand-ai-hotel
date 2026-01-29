# Grand Budapest Hotel Agent Personas
## Visual Guide & Character-to-Feature Mapping

---

## 🎭 Character Roster

```
┌─────────────────────────────────────────────────────────────────────┐
│                    THE GRAND BUDAPEST TERMINAL                       │
│                         Agent Ensemble                               │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────┬──────────────────┬────────────────────────────────┐
│   CHARACTER    │   PERSONALITY    │      SPECIALIZATION            │
├────────────────┼──────────────────┼────────────────────────────────┤
│ M. Gustave     │ Refined          │ Code quality, documentation,   │
│                │ Perfectionist    │ API design, architecture       │
│                │ Eloquent         │                                │
├────────────────┼──────────────────┼────────────────────────────────┤
│ Zero Moustafa  │ Loyal            │ General assistance, command    │
│                │ Eager to learn   │ execution, task completion     │
│                │ Professional     │                                │
├────────────────┼──────────────────┼────────────────────────────────┤
│ Agatha         │ Sweet            │ Data preparation, testing,     │
│                │ Precise          │ validation, sample datasets    │
│                │ Resourceful      │                                │
├────────────────┼──────────────────┼────────────────────────────────┤
│ Dmitri         │ Aggressive       │ Security testing, adversarial  │
│                │ Challenging      │ testing, edge cases, breaking  │
│                │ Ruthless         │                                │
├────────────────┼──────────────────┼────────────────────────────────┤
│ Henckels       │ Honorable        │ Compliance, standards, code    │
│                │ Dutiful          │ review, CI/CD workflows        │
│                │ Diplomatic       │                                │
├────────────────┼──────────────────┼────────────────────────────────┤
│ Ludwig         │ Meticulous       │ Validation, type checking,     │
│                │ Precise          │ schema verification, licensing │
│                │ Methodical       │                                │
├────────────────┼──────────────────┼────────────────────────────────┤
│ Serge X.       │ Scholarly        │ Performance analysis, model    │
│                │ Analytical       │ evaluation, benchmarking       │
│                │ Authentication   │                                │
└────────────────┴──────────────────┴────────────────────────────────┘
```

---

## 🎬 Scene-to-Feature Mapping

### Act I: Arrival at the Terminal

| Scene | Feature Demonstrated | Character(s) | Core Thought |
|-------|---------------------|--------------|--------------|
| 1: The Lobby | `copilot` launch, `--banner` flag | M. Gustave, Zero | "First impressions matter. Let whimsy meet function." |
| 2: The Help Desk | `/help`, keyboard shortcuts | M. Gustave, Zero, Ludwig | "Knowledge is the foundation of all assistance." |
| 3: Authentication | `/login`, `/logout`, PAT setup | M. Gustave, Agatha | "Trust must be established before collaboration begins." |

### Act II: Navigation & Context

| Scene | Feature Demonstrated | Character(s) | Core Thought |
|-------|---------------------|--------------|--------------|
| 4: Working Directory | `/cwd`, `/cd`, `/add-dir`, `/list-dirs` | Henckels, M. Gustave | "Navigation requires discipline and permission." |
| 5: Context Window | `/context`, `/compact`, `@file` mention | Serge X., M. Gustave, Zero | "Understanding boundaries enables efficiency." |
| 6: Session Management | `/session`, `/resume`, `/clear`, `/rename` | M. Gustave, Ludwig | "Every conversation deserves proper organization." |

### Act III: The Advanced Features

| Scene | Feature Demonstrated | Character(s) | Core Thought |
|-------|---------------------|--------------|--------------|
| 7: Model Selection | `/model`, model options | M. Gustave, Serge X. | "Different challenges require different intellects." |
| 8: Agent Delegation | `/agent`, custom agent browsing | Dmitri, M. Gustave, Agatha | "Specialization produces excellence." |
| 9: Planning Room | `/plan`, implementation planning | M. Gustave, Henckels | "A gentleman always plans before acting." |
| 10: Code Review | `/review`, review agent | Henckels, M. Gustave, Dmitri | "Quality gates protect against mediocrity." |
| 11: Diff Visualization | `/diff`, change viewing | M. Gustave, Agatha | "One must observe modifications with clarity." |
| 12: Delegation Bureau | `/delegate`, PR generation | M. Gustave, Henckels | "Delegate with confidence, verify with diligence." |
| 13: Skills Library | `/skills` management | Ludwig, M. Gustave | "Education refines capability." |
| 14: MCP Integration | `/mcp` server management | Serge X., Dmitri | "Extension points unlock infinite possibility." |
| 15: Sharing Ceremony | `/share` file/gist | Agatha | "Knowledge shared is knowledge multiplied." |
| 16: Feedback & Usage | `/feedback`, `/usage` | M. Gustave, Serge X. | "Measurement and feedback drive improvement." |
| 17: Theme Atelier | `/theme` customization | M. Gustave | "Aesthetics enhance productivity." |
| 18: IDE Connection | `/ide` workspace connection | Zero | "Bridge tools for seamless workflow." |
| 19: Terminal Config | `/terminal-setup` | Henckels | "Configuration precedes efficient operation." |
| 20: User Management | `/user` account switching | Ludwig | "Identity management enables flexibility." |

### Act IV: The Grand Finale

| Scene | Feature Demonstrated | Character(s) | Core Thought |
|-------|---------------------|--------------|--------------|
| 21: Instruction Hierarchy | Instruction file locations | All | "Context flows from global to specific." |
| 22: The Farewell | Session completion, Ctrl+D | All | "Every beginning has an ending; every session, a memory." |

---

## 💭 Agent Thought Patterns

### M. Gustave (Concierge)
```
Primary Motivation: Excellence in all endeavors
Key Phrases: 
  - "Let us refine this further..."
  - "A touch of elegance is warranted here."
  - "Documentation is the mark of civilization."
  
When to Invoke:
  - Code needs better documentation
  - API design requires review
  - Architecture decisions await
  - Quality standards must be upheld
```

### Zero Moustafa (Lobby Boy)
```
Primary Motivation: Helpful execution and learning
Key Phrases:
  - "Yes, sir. Right away, sir."
  - "How should I proceed?"
  - "I'll handle that immediately."
  
When to Invoke:
  - General tasks need execution
  - Commands require running
  - Simple modifications needed
  - Learning by doing
```

### Agatha (Baker/Tester)
```
Primary Motivation: Precision and reliability
Key Phrases:
  - "Let me validate that for you."
  - "The data needs proper preparation."
  - "I've created test samples."
  
When to Invoke:
  - Data preprocessing required
  - Test datasets needed
  - Validation tasks arise
  - Quality assurance demanded
```

### Dmitri (Antagonist/Security)
```
Primary Motivation: Find weaknesses and vulnerabilities
Key Phrases:
  - "This will never work!"
  - "What happens when...?"
  - "Let me try to break this."
  
When to Invoke:
  - Security testing needed
  - Edge cases must be found
  - Adversarial testing required
  - Assumptions need challenging
```

### Deputy Henckels (Officer/Standards)
```
Primary Motivation: Order and compliance
Key Phrases:
  - "This must meet standards."
  - "Proper procedure requires..."
  - "I must enforce the rules."
  
When to Invoke:
  - Code review needed
  - Standards enforcement
  - CI/CD pipeline work
  - Compliance verification
```

### Ludwig (Butler/Validator)
```
Primary Motivation: Accuracy and correctness
Key Phrases:
  - "The types don't align, sir."
  - "According to the schema..."
  - "I've verified the details."
  
When to Invoke:
  - Type checking needed
  - Schema validation required
  - Contract verification
  - License compliance
```

### Serge X. (Art Expert/Analyst)
```
Primary Motivation: Deep analysis and authentication
Key Phrases:
  - "Upon closer examination..."
  - "The performance metrics indicate..."
  - "I've benchmarked three approaches."
  
When to Invoke:
  - Performance analysis needed
  - Model evaluation required
  - Benchmarking tasks
  - Deep code analysis
```

---

## 🎯 Prompt Examples by Character

### M. Gustave Prompts
```markdown
"Review this API design for elegance and consistency"
"Document this module with detailed examples"
"Refine the architecture of this component"
"Improve code quality in the authentication layer"
```

### Zero Prompts
```markdown
"Run the test suite"
"Install these dependencies"
"Execute this migration script"
"Create a basic user model"
```

### Agatha Prompts
```markdown
"Generate sample test data for the NLP pipeline"
"Validate the preprocessing output"
"Create unit tests for the tokenizer"
"Prepare training and validation datasets"
```

### Dmitri Prompts
```markdown
"Try to break this authentication flow"
"Find edge cases in the input validation"
"Test with malicious input patterns"
"Identify security vulnerabilities"
```

### Henckels Prompts
```markdown
"Review this PR for standards compliance"
"Set up GitHub Actions workflow"
"Enforce linting rules across the project"
"Create pre-commit hooks for code quality"
```

### Ludwig Prompts
```markdown
"Verify type hints throughout the codebase"
"Validate JSON schema against spec"
"Check license compatibility of dependencies"
"Ensure function signatures match documentation"
```

### Serge X. Prompts
```markdown
"Profile the model training performance"
"Benchmark three different tokenization approaches"
"Analyze memory usage in the preprocessing pipeline"
"Evaluate model accuracy across test sets"
```

---

## 🔄 Collaboration Workflows

### Example 1: New Feature Development
```
1. M. Gustave:  /plan Implement sentiment analysis API
2. Zero:        Execute initial implementation
3. Ludwig:      Validate types and schemas
4. Agatha:      Create test data and unit tests
5. Dmitri:      Test edge cases and security
6. Henckels:    Review code and run CI checks
7. Serge X.:    Benchmark performance
8. M. Gustave:  Final documentation polish
```

### Example 2: Bug Investigation
```
1. Serge X.:    Analyze error logs and metrics
2. Dmitri:      Reproduce edge case causing issue
3. Ludwig:      Verify contract violations
4. Zero:        Implement fix
5. Agatha:      Validate fix with test cases
6. Henckels:    Review and approve
```

### Example 3: Code Quality Sprint
```
1. M. Gustave:  Define quality standards
2. Ludwig:      Add type hints throughout
3. Henckels:    Set up linting and formatting
4. Agatha:      Increase test coverage
5. Serge X.:    Profile and optimize hotspots
6. M. Gustave:  Update documentation
```

---

## 📊 Character Decision Tree

```
Need help? Start here:
    │
    ├─ Do you know what you want?
    │   │
    │   ├─ YES → Do you need quality/refinement?
    │   │   ├─ YES → M. Gustave
    │   │   └─ NO → Zero (execute)
    │   │
    │   └─ NO → Do you need to find problems?
    │       ├─ YES → Dmitri (adversarial)
    │       └─ NO → Serge X. (analyze)
    │
    ├─ Is this about data/testing?
    │   └─ YES → Agatha
    │
    ├─ Is this about standards/compliance?
    │   └─ YES → Henckels
    │
    └─ Is this about validation/contracts?
        └─ YES → Ludwig
```

---

## 🎨 Visual Style Guide

### Color Palette (Wes Anderson Aesthetic)
- **M. Gustave**: Plum purple (#8B4789)
- **Zero**: Deep burgundy (#800020)
- **Agatha**: Soft pink (#FFB6C1)
- **Dmitri**: Dark crimson (#990000)
- **Henckels**: Military green (#4B5320)
- **Ludwig**: Charcoal grey (#36454F)
- **Serge X.**: Antique gold (#C5B358)

### Typography
- Scene headers: Art Deco style
- Dialogue: Formal, period-appropriate
- Code blocks: Monospace, clearly delineated
- Stage directions: Italicized descriptions

---

## 📝 Key Takeaways

1. **Each agent has a distinct personality** that makes their role memorable
2. **Specializations align with character traits** from The Grand Budapest Hotel
3. **Agents can work independently or collaborate** on complex tasks
4. **The screenplay format makes CLI features engaging** and easier to learn
5. **Prompt patterns follow character motivations** for intuitive usage

---

## 🔗 Related Resources

- **Screenplay**: `.github/prompts/grand-budapest-cli-tutorial.md`
- **Agent Definitions**: `.github/agents/*.agent.md`
- **CLI Documentation**: Run `/help` in terminal
- **Official Docs**: https://docs.github.com/copilot/concepts/agents/about-copilot-cli

---

*"The Grand Budapest Terminal: Where elegance meets the command line."*
