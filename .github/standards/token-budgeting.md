# Token Budgeting Strategies
*The Art of Context Management and Premium Request Optimization*

**Maintained by**: M. Gustave (Resource Allocation) and Ludwig (Precision Accounting)  
**Last Updated**: 2026-01-29

---

## 📊 Understanding Your Resources

### GitHub Copilot Premium Request Allocation

**Your Monthly Budget**:
- **2,000 premium requests per month** (Copilot Individual/Business)
- Resets on your billing cycle date
- Shared across all Copilot interfaces (Chat, CLI, Edits)
- Premium requests use advanced models (GPT-4, Claude Sonnet/Opus)

**What Counts as a Premium Request**:
- Each message in Copilot Chat using a premium model
- Each CLI command execution (`gh copilot suggest`, `gh copilot explain`)
- Each Copilot Edits operation
- Each inline completion request (minimal cost, but counted)

**What Doesn't Count**:
- Using standard/fast models when available
- Reading Copilot's responses
- Opening Copilot panels or windows
- Browsing Copilot documentation

---

## 🎯 Token Fundamentals

### What Are Tokens?

**Definition**: Tokens are the atomic units of text that AI models process.

**Estimation Rules**:
- **~4 characters ≈ 1 token** (English text average)
- **~0.75 words ≈ 1 token** (English text average)
- Code is generally more token-dense than prose
- Special characters and formatting add tokens

**Examples**:
```
Text: "Hello, world!" 
Tokens: ~3 tokens

Text: "const fetchUser = async (id) => {...}"
Tokens: ~12 tokens

Text: Complete Python file (300 lines)
Tokens: ~2,000-3,000 tokens
```

### Context Windows by Model

| Model | Context Window | Typical Use | Cost Tier |
|-------|---------------|-------------|-----------|
| **GPT-4 Turbo** | ~128,000 tokens | Copilot Chat default | Premium |
| **GPT-4** | ~8,000 tokens | Older Copilot | Premium |
| **Claude Sonnet 4.5** | ~200,000 tokens | High-context tasks | Premium |
| **Claude Opus 4.5** | ~200,000 tokens | Complex reasoning | Ultra-premium |
| **Claude Haiku 4.5** | ~200,000 tokens | Fast operations | Standard |
| **GPT-3.5 Turbo** | ~16,000 tokens | Quick completions | Standard |

**Context Window Composition**:
```
Total Context Window = Input Tokens + Output Tokens

Input Tokens:
├─ Your prompt
├─ Open files in editor
├─ Conversation history
├─ System instructions
└─ Selected code

Output Tokens:
├─ Model's response
└─ Generated code/text
```

---

## 💰 Premium Request Budgeting

### Monthly Allocation Strategy

**The 2,000 Request Budget Breakdown**:

```
Total: 2,000 premium requests/month
│
├─ Daily Average: ~67 requests/day (30-day month)
│   └─ Hourly: ~8 requests/hour (8-hour workday)
│
├─ Recommended Allocation:
│   ├─ Development Work: 60% (1,200 requests)
│   ├─ Learning/Research: 20% (400 requests)
│   ├─ Code Review: 10% (200 requests)
│   └─ Reserve/Overflow: 10% (200 requests)
│
└─ By Week:
    ├─ Week 1: 500 requests (buffer for complex work)
    ├─ Week 2: 500 requests
    ├─ Week 3: 500 requests
    └─ Week 4: 500 requests (includes reserve)
```

### Request Cost Awareness

**Low-Cost Activities** (1-2 requests):
- Simple inline completions
- Quick questions with short answers
- File formatting
- Simple refactoring
- Documentation generation

**Medium-Cost Activities** (3-10 requests):
- Code generation for new features
- Debugging sessions
- Test generation
- Multi-file understanding
- Architecture discussions

**High-Cost Activities** (10-50+ requests):
- Complex refactoring across many files
- Deep debugging of production issues
- Learning new frameworks/languages
- Architectural redesigns
- Large-scale code reviews

**Very High-Cost Activities** (50-200+ requests):
- Multi-hour pair programming sessions
- Complete feature development
- System-wide refactoring
- Comprehensive code audits
- Migration projects

---

## 📏 Token Estimation Strategies

### Estimating Your Prompt Cost

**Quick Estimation Formula**:
```
Prompt Tokens ≈ (Characters ÷ 4) + (Open Files × 1000) + (Conversation History × 500)
```

**Example Calculation**:
```
Scenario: Ask Copilot to review a function

Your prompt: 200 characters → ~50 tokens
Selected code: 800 characters → ~200 tokens  
Open file context: 2 files → ~2,000 tokens
Conversation history: 5 turns → ~2,500 tokens
────────────────────────────────────────────
Total Input: ~4,750 tokens

Expected output: ~500-1,000 tokens
────────────────────────────────────────────
Total Context Used: ~5,250-5,750 tokens
```

### Tools for Token Counting

**Manual Estimation**:
```python
# Quick Python token estimator
def estimate_tokens(text: str) -> int:
    """Rough token estimation for English text and code."""
    return len(text) // 4

# Usage
code = open('myfile.py').read()
estimated = estimate_tokens(code)
print(f"Estimated tokens: {estimated}")
```

**Online Tools**:
- OpenAI Tokenizer: https://platform.openai.com/tokenizer
- Anthropic Token Counter: Built into Claude interface
- tiktoken (Python library): `pip install tiktoken`

**VS Code Extension**:
```
Extension: "Token Counter"
- Shows token count in status bar
- Estimates cost per request
- Tracks daily usage
```

---

## ⚡ Model Tier Selection

### Choosing the Right Model for the Task

#### Use Standard/Fast Models (Haiku, GPT-3.5) When:

**Perfect For**:
- ✅ Code formatting and linting
- ✅ Simple refactoring (variable renames, import organization)
- ✅ Documentation generation
- ✅ Translating code between similar languages
- ✅ Generating boilerplate code
- ✅ Quick factual questions
- ✅ Syntax corrections
- ✅ Unit test generation for simple functions

**Example Prompts**:
```
"Format this Python file with black"
"Add docstrings to these functions"
"Generate Jest tests for this utility function"
"Rename variable 'x' to 'userId' throughout this file"
```

**Cost**: Typically FREE or minimal premium request usage

---

#### Use Premium Models (Sonnet, GPT-4) When:

**Perfect For**:
- ✅ Complex code generation
- ✅ Architectural decisions
- ✅ Debugging tricky issues
- ✅ Multi-file refactoring
- ✅ Learning new concepts
- ✅ Code reviews requiring nuance
- ✅ Security analysis
- ✅ Performance optimization

**Example Prompts**:
```
"Design a microservices architecture for this monolith"
"Debug why this async function causes a race condition"
"Refactor this class to use dependency injection"
"Review this authentication code for security vulnerabilities"
```

**Cost**: 1 premium request per interaction

---

#### Use Ultra-Premium Models (Opus) When:

**Perfect For**:
- ✅ Novel algorithmic challenges
- ✅ Complex system design
- ✅ Security audits of critical systems
- ✅ Performance optimization requiring deep analysis
- ✅ Solving truly hard problems
- ✅ Creative problem-solving
- ✅ Research-level questions

**Example Prompts**:
```
"Design a custom consensus algorithm for our distributed system"
"Optimize this compiler pass for LLVM"
"Audit this cryptographic implementation"
"Find the optimal data structure for this constraint satisfaction problem"
```

**Cost**: 1 premium request (higher token cost per request)

---

### Model Selection Decision Tree

```
Is the task routine/mechanical?
├─ YES → Use Fast Model (Haiku/GPT-3.5)
│         Examples: formatting, simple refactoring
│
└─ NO → Is the task complex but standard?
        ├─ YES → Use Premium Model (Sonnet/GPT-4)
        │         Examples: feature development, debugging
        │
        └─ NO → Is the task exceptionally difficult?
                ├─ YES → Use Ultra-Premium (Opus)
                │         Examples: novel algorithms, research
                │
                └─ UNSURE → Start with Sonnet, escalate if needed
```

---

## 🧠 Context Window Monitoring

### Understanding Context Saturation

**Context Window Filling Process**:
```
Start of Conversation: 0% full
├─ Turn 1: Prompt + Response → 5% full
├─ Turn 10: → 25% full  
├─ Turn 30: → 60% full
├─ Turn 50: → 85% full (performance degradation begins)
└─ Turn 70: → 95% full (compaction recommended)
```

**Signs You're Approaching Limit**:
- ⚠️ Slower response times
- ⚠️ Model seems to "forget" earlier conversation
- ⚠️ Responses become less accurate
- ⚠️ Warnings about context window
- ⚠️ Conversation exceeds 50+ turns

### Checking Context Usage

**In Copilot Chat**:
```
Unfortunately, Copilot doesn't show token count directly.
Monitor by conversation length and complexity.

Rule of thumb:
- Short conversation (< 10 turns): ~10-20% context
- Medium conversation (10-30 turns): ~30-60% context  
- Long conversation (30-50 turns): ~60-85% context
- Very long (50+ turns): ~85-95%+ context
```

**In Claude (Grand Budapest Agents)**:
```
Command: /context

Output:
┌────────────────────────────────────┐
│ Context Window Usage               │
├────────────────────────────────────┤
│ Total: 67,234 / 200,000 tokens     │
│ Usage: 34%                         │
│ Turns: 42                          │
│ Status: Healthy                    │
└────────────────────────────────────┘
```

### Context Window Optimization

**Reduce Context Consumption**:

1. **Close Unnecessary Files**
   ```
   Each open file adds ~500-2,000 tokens
   Close files not relevant to current task
   ```

2. **Clear Conversation History**
   ```
   Start new chat for unrelated topics
   Don't carry over irrelevant context
   ```

3. **Be Concise in Prompts**
   ```
   ❌ "I was wondering if you might be able to help me with something.
      I'm working on this project and I have this function that I wrote
      but I'm not sure if it's the best way to do it..."
      
   ✅ "Review this function for performance issues: [code]"
   ```

4. **Use File References Instead of Pasting**
   ```
   ❌ [Paste entire 500-line file]
      "Review this file"
      
   ✅ "Review src/utils/auth.ts" (if file is already open)
   ```

5. **Selective Code Selection**
   ```
   Select only relevant functions/classes
   Don't include entire files unless necessary
   ```

---

## 🔄 Strategic Compaction Timing

### What is Compaction?

**Definition**: Compaction summarizes conversation history to free context window space while preserving important information.

**What Happens During Compaction**:
```
Before Compaction:
├─ All conversation turns (1-50+)
├─ All code snippets
├─ All explanations
└─ Total: 150,000 tokens

After Compaction:
├─ Summary of earlier conversation
├─ Recent turns (last ~15-20) preserved verbatim
├─ Key decisions documented
├─ Current task context maintained
└─ Total: ~40,000 tokens
```

### When to Compact (Strategic Timing)

**✅ Good Times to Compact**:

1. **After Major Milestone**
   ```
   "We just completed the API implementation.
    Let's compact before starting the frontend."
   ```

2. **Before Topic Switch**
   ```
   "Finished debugging. Now moving to performance optimization.
    Compacting to start fresh..."
   ```

3. **At Natural Breakpoints**
   ```
   - End of work session
   - Lunch breaks
   - After code review
   - Before major refactoring
   ```

4. **When Warned**
   ```
   If model says: "Context window is approaching limit"
   → Compact immediately
   ```

5. **Proactive Compaction (50+ turns)**
   ```
   Even if not warned, compact at ~50 turns
   to maintain performance
   ```

**❌ Bad Times to Compact**:

1. **During Active Debugging**
   ```
   You're tracing through stack traces and error messages
   → Don't compact, you'll lose critical context
   ```

2. **Mid-Implementation**
   ```
   You're iterating on a complex function
   → Wait until implementation is complete
   ```

3. **During Code Review**
   ```
   You're going through multiple files for review
   → Compact after review is complete
   ```

4. **Before Getting Final Answer**
   ```
   You asked a complex question
   → Wait for complete answer before compacting
   ```

5. **When Model Needs Recent Details**
   ```
   "Using the types we defined 3 turns ago..."
   → Those details would be summarized away
   ```

### Compaction Best Practices

**Before Compacting**:
```
1. Save important artifacts to files
   - Design decisions → docs/architecture.md
   - Code snippets → src/
   - Test cases → tests/

2. Summarize key points yourself
   - What was decided
   - What was implemented  
   - What's next

3. Ensure current work is saved
   - Commit code to git
   - Save open files
```

**Compaction Commands**:

**In Claude**:
```
/compact [optional: what to preserve]

Examples:
/compact
/compact preserve the API design we discussed
/compact keep the security requirements
```

**In Copilot Chat**:
```
Copilot doesn't have explicit compaction.
Instead:
- Start a new chat for new topics
- Reference previous work explicitly
- Save artifacts to workspace files
```

**After Compacting**:
```
1. Verify critical context survived
   - Ask: "What were we working on?"
   - Check: Does model remember key decisions?

2. Reference saved artifacts
   - "Continuing from architecture.md..."
   - "Implementing the design we documented..."

3. Start fresh if context is lost
   - Load relevant files
   - Restate current goal
   - Reference documentation
```

---

## 📅 Multi-Session Planning

### Long-Term Project Strategies

**Project Duration > 1 Day**:
Use multiple sessions with context transfer.

**Session 1: Planning & Design** (Premium)
```
Duration: 1-2 hours
Model: Sonnet or Opus
Tasks:
├─ Requirements gathering
├─ Architecture design  
├─ Technology selection
└─ Create design docs

Output Artifacts:
├─ docs/architecture.md
├─ docs/requirements.md
└─ docs/tech-stack.md

Token Budget: ~300-500 requests
```

**Session 2-N: Implementation** (Mixed)
```
Duration: Multiple sessions
Models: Mostly Haiku/Standard, Sonnet when needed
Tasks:
├─ Implement features
├─ Write tests
├─ Iterate on feedback
└─ Document as you go

Output Artifacts:
├─ src/ (code)
├─ tests/ (tests)
└─ README updates

Token Budget: ~100-200 requests per session
Strategy: Use fast models for routine work
```

**Final Session: Review & Polish** (Premium)
```
Duration: 1-2 hours
Model: Sonnet
Tasks:
├─ Code review
├─ Security audit
├─ Performance check
└─ Documentation review

Token Budget: ~200-300 requests
```

### Context Transfer Between Sessions

**Method 1: Workspace Files**
```
Session 1: Create docs/session-notes.md
├─ Document decisions
├─ List completed tasks
├─ Note blockers
└─ Define next steps

Session 2: Reference session-notes.md
├─ "Continuing from session-notes.md..."
├─ "Implementing the API design from docs/architecture.md..."
└─ Update session-notes.md with progress
```

**Method 2: Git Commits**
```
Session 1:
├─ Implement feature
├─ Commit with detailed message
└─ End session

Session 2:
├─ "Review my last commit"
├─ "Continue implementing feature X from last commit"
└─ Context automatically loaded from git history
```

**Method 3: Explicit Summaries**
```
End of Session 1:
"Summarize what we accomplished today and what's next"
→ Copy summary to clipboard

Start of Session 2:
"Here's where we left off: [paste summary]
 Let's continue..."
```

---

## 💡 Cost Optimization Techniques

### Technique 1: Batch Similar Tasks

**Inefficient** (Multiple requests):
```
Request 1: "Add docstring to function A"
Request 2: "Add docstring to function B"  
Request 3: "Add docstring to function C"
Request 4: "Add docstring to function D"

Cost: 4 premium requests
```

**Efficient** (Single request):
```
Request: "Add docstrings to functions A, B, C, and D in this file"

Cost: 1 premium request
```

**Savings**: 75% reduction in requests

---

### Technique 2: Use CLI for Commands

**Inefficient**:
```
Copilot Chat: "How do I find all TODO comments in my codebase?"
→ Wait for explanation
→ Copy command
→ Run in terminal

Cost: 1 premium request + time
```

**Efficient**:
```
gh copilot suggest "find all TODO comments in git-tracked files"
→ Get command immediately
→ Execute

Cost: 1 CLI request (faster, optimized for commands)
```

---

### Technique 3: Incremental Prompts

**Inefficient** (All at once):
```
"Create a REST API with authentication, rate limiting, caching,
 logging, error handling, tests, documentation, and deployment config"

Result: Overwhelming response, may miss requirements
Cost: 1 request, but likely needs iteration (3-5 total)
```

**Efficient** (Incremental):
```
Request 1: "Create basic REST API structure"
Request 2: "Add JWT authentication"
Request 3: "Add rate limiting middleware"
Request 4: "Add request logging"
...

Result: Better control, fewer iterations
Cost: 5-7 requests, but more precise
```

**When to Use Which**:
- Use all-at-once for simple tasks
- Use incremental for complex tasks or learning

---

### Technique 4: Self-Service First

**Before Asking Copilot**:
```
1. Check documentation
2. Search codebase with grep/find
3. Read error messages carefully
4. Try obvious solution
5. If stuck > 15 minutes → Ask Copilot
```

**This Saves**:
- Premium requests for truly complex issues
- Develops your problem-solving skills
- Faster resolution for simple issues

**When to Ask Immediately**:
- Unfamiliar technology
- Complex architectural decisions
- Security-sensitive code
- Time-critical debugging

---

### Technique 5: Model Switching

**Start with Standard → Escalate if Needed**:
```
Attempt 1: Fast model (free/cheap)
├─ "Format this code"
└─ If successful: Done ✓

Attempt 2: Premium model
├─ "Refactor this for better performance"
└─ If not satisfactory: Escalate

Attempt 3: Ultra-premium model
├─ "Design optimal algorithm for this constraint"
└─ Complex reasoning required
```

**Don't**:
```
❌ Always use Opus for everything (waste)
❌ Always use Haiku for everything (inadequate for complex tasks)
```

**Do**:
```
✅ Match model to task complexity
✅ Start cheap, escalate when needed
✅ Use Opus sparingly for truly hard problems
```

---

### Technique 6: Workspace Organization

**Efficient Context Loading**:
```
Organized Workspace:
├─ Open only files relevant to current task
├─ Close files when done with them
├─ Use workspaces to group related files
└─ Clear file structure

Result: Lower token consumption per request
```

**Inefficient Context Loading**:
```
Messy Workspace:
├─ 20+ files open  
├─ Unrelated files mixed together
├─ Large files open unnecessarily
└─ Poor organization

Result: Every request includes unnecessary context
```

**Token Savings**: 30-50% per request

---

### Technique 7: Prompt Templates

**Create Reusable Templates**:

```markdown
<!-- template-code-review.md -->
Review this [LANGUAGE] code for:
1. Security vulnerabilities
2. Performance issues
3. Code quality and maintainability
4. Best practices compliance

Code:
[CODE_HERE]

Provide specific line numbers and actionable suggestions.
```

**Usage**:
```
Copy template → Fill in blanks → Send
Consistent, efficient, no wasted tokens on rephrasing
```

**Common Templates**:
- Code review
- Test generation
- Bug report
- Feature request
- Refactoring request
- Documentation generation

---

## 📊 Usage Tracking & Monitoring

### Manual Tracking

**Spreadsheet Method**:
```
Date       | Task              | Requests | Model  | Notes
-----------|-------------------|----------|--------|------------------
2024-01-29 | Feature dev       | 47       | Sonnet | New API endpoint
2024-01-29 | Code review       | 12       | Sonnet | Security audit
2024-01-29 | Quick fixes       | 8        | Haiku  | Formatting
-----------|-------------------|----------|--------|------------------
Daily:     |                   | 67       |        |
Monthly:   |                   | 1,243    |        | 757 remaining
```

### Automated Tracking

**Script to Track Copilot Usage** (Conceptual):
```bash
# Note: GitHub doesn't provide official API for this yet
# This is a manual logging approach

# Create log file
LOG_FILE="$HOME/.copilot-usage.log"

# Add alias to track usage
alias copilot-log='echo "$(date +%Y-%m-%d) - $1" >> $LOG_FILE'

# Usage
copilot-log "Code review session - ~20 requests"

# View monthly total
grep "$(date +%Y-%m)" $LOG_FILE | wc -l
```

### Budget Alerts

**Set Up Reminders**:
```
Week 1: Check usage (should be ~500)
Week 2: Check usage (should be ~1,000 total)
Week 3: Check usage (should be ~1,500 total)  
Week 4: Conserve if > 1,800

If > 1,600 by Week 3:
└─ Switch to standard models for routine tasks
```

---

## 🎯 Advanced Optimization Strategies

### Strategy 1: The Triage System

**Before Each Request, Ask**:

```
Urgency:
├─ Critical (blocking work) → Use premium
├─ Important (needed soon) → Use premium
├─ Nice-to-have → Use standard or defer
└─ Learning → Use premium strategically

Complexity:
├─ Trivial → Use standard model
├─ Moderate → Use standard, escalate if needed
├─ Complex → Use premium
└─ Very complex → Use ultra-premium

Alternatives:
├─ Can I find this in docs? → Read docs first
├─ Can I experiment myself? → Try first
├─ Do I need AI for this? → Consider manual approach
└─ Is this best use of premium request? → Triage
```

---

### Strategy 2: The Learning Investment

**Invest in Learning Early**:
```
Week 1: Heavy usage learning new framework
├─ Use premium models liberally
├─ Ask lots of questions
├─ Build strong foundation
└─ Cost: 600-800 requests

Weeks 2-4: Reap benefits
├─ Reduced questions needed
├─ Can solve more independently
├─ Use standard models for routine work
└─ Cost: 300-400 requests/week
```

**ROI**: Higher upfront cost, but overall efficiency gain

---

### Strategy 3: The Code Review Partnership

**Hybrid Human + AI Review**:
```
First Pass (You): Manual review
├─ Obvious issues
├─ Style violations
├─ Simple bugs
└─ Cost: 0 requests

Second Pass (AI): Deep review
├─ Security vulnerabilities
├─ Performance issues
├─ Edge cases
├─ Architecture concerns
└─ Cost: 1-2 requests (targeted)

Result: Better reviews, lower cost
```

---

### Strategy 4: The Documentation Buffer

**Maintain Living Documentation**:
```
docs/
├─ architecture.md (agent-generated, reviewed)
├─ coding-standards.md (one-time generation)
├─ common-patterns.md (accumulated over time)
└─ faq.md (built up from Q&A sessions)

When Questions Arise:
1. Check documentation first
2. If not found, ask Copilot
3. Add answer to documentation
4. Reuse documentation in future

Token Savings: 
- Initial: High cost to create docs
- Ongoing: Massive savings (reference instead of asking)
```

---

### Strategy 5: The Pair Programming Protocol

**Efficient Long Sessions**:
```
Hour 1: High-Touch (Premium Model)
├─ Architecture discussion
├─ Complex problem solving
├─ Design decisions
└─ Cost: ~50-80 requests

Hour 2-3: Implementation (Mixed Models)
├─ Use standard for boilerplate  
├─ Use premium for complex logic
├─ Reference decisions from Hour 1
└─ Cost: ~30-50 requests/hour

Hour 4: Review (Premium Model)
├─ Code review
├─ Refinement
├─ Documentation
└─ Cost: ~30-40 requests

Total: ~140-220 requests for 4-hour session
```

---

## 🏆 Token Efficiency Hall of Fame

### Champion Strategies from Grand Budapest Staff

**M. Gustave's Rule**:
> "One should never request what one already possesses in documentation."

**Application**:
- Maintain project documentation
- Reference existing patterns
- Build on previous work
- Save ~200 requests/month

---

**Zero's Speed Trick**:
> "For the hundredth formatting request, create a script."

**Application**:
```bash
# Instead of asking Copilot each time:
alias format-py="ruff format . && ruff check --fix ."
alias format-ts="prettier --write 'src/**/*.ts'"

# Savings: ~50-100 requests/month
```

---

**Ludwig's Type System Philosophy**:
> "Types documented once save questions asked a thousand times."

**Application**:
- Invest in strong type definitions
- Use TypeScript/Rust/typed languages
- Types answer questions automatically
- Save ~100 requests/month on "what type is this?"

---

**Agatha's Testing Wisdom**:
> "Tests written with care prevent debugging despair."

**Application**:
- Use premium requests for quality test generation
- Comprehensive tests reduce debugging needs
- Net savings from fewer debugging sessions
- Save ~150 requests/month on debugging

---

**Dmitri's Efficiency Mandate**:
> "Never use premium when standard suffices."

**Application**:
- Default to standard models
- Escalate only when necessary
- Save premium for complex tasks
- Save ~300 requests/month

---

**Henckels' Automation Doctrine**:
> "Automate repetition, reserve AI for cognition."

**Application**:
- Create scripts for repeated tasks
- Use CI/CD for mechanical work
- Save AI for decisions
- Save ~250 requests/month

---

## 💡 Quick Tips

### Request Conservation
- **Batch similar tasks** into single requests
- **Use CLI** for command generation (more efficient)
- **Check docs first** before asking questions
- **Start with standard models**, escalate if needed
- **Close unused files** to reduce context size

### Context Management
- **Monitor conversation length** (compact at ~50 turns)
- **Start new chats** for unrelated topics
- **Save artifacts to files** before compacting
- **Reference documentation** instead of re-asking
- **Use selective code selection**, not whole files

### Model Selection
- **Haiku/GPT-3.5**: Formatting, simple refactoring, quick questions
- **Sonnet/GPT-4**: Feature development, debugging, reviews
- **Opus**: Novel algorithms, very complex problems only
- **Match model to task complexity** for efficiency

### Long-Term Projects
- **Plan multi-session workflow** at the start
- **Document decisions** in workspace files
- **Use git commits** for context transfer
- **Create templates** for common requests
- **Build documentation** to reduce future questions

### Budget Tracking
- **Check usage weekly** (target ~500/week)
- **Conserve in Week 4** if approaching limit
- **Invest heavily in learning** (pays off later)
- **Automate repetitive tasks** to save requests
- **Review usage patterns** monthly for optimization

---

## 🔗 Related Documentation

- [Claude Best Practices](./claude-best-practices.md) - Context window management
- [Copilot Best Practices](./copilot-best-practices.md) - Effective prompting
- [Agent Collaboration Guide](./agent-collaboration.md) - Multi-agent efficiency
- [Python Coding Standards](./python-standards.md) - Code quality

---

## 📚 Tutorials Referenced

- **The Memory Palace** - Advanced context management techniques
- **The Concierge's Budget** - Resource allocation strategies  
- **The Accountant's Ledger** - Usage tracking methods
- **The Efficiency Expert** - Optimization patterns
- **The Long Game** - Multi-session planning

---

## 📈 Monthly Review Template

```markdown
## Month: [Month Year]

### Usage Statistics
- Total Requests Used: ___ / 2,000
- Average per Day: ___
- Peak Day: ___ requests
- Quietest Day: ___ requests

### Breakdown by Activity
- Development: ___ requests (___%)
- Code Review: ___ requests (___%)
- Learning: ___ requests (___%)
- Debugging: ___ requests (___%)
- Other: ___ requests (___%)

### Model Distribution
- Standard (Haiku/GPT-3.5): ___ requests
- Premium (Sonnet/GPT-4): ___ requests
- Ultra-Premium (Opus): ___ requests

### Efficiency Metrics
- Average Requests per Feature: ___
- Requests Saved by Documentation: ___
- Requests Saved by Automation: ___

### Optimization Opportunities
1. [What could be automated?]
2. [What could be documented?]
3. [Where did we overuse premium models?]
4. [Where did we underuse AI assistance?]

### Next Month Goals
- Target Usage: ___ requests
- Focus Areas: ___
- Automation Goals: ___
- Learning Investments: ___
```

---

**"Elegance in resource management is not about restriction, but about intentional allocation toward maximum value."** — M. Gustave H.

*For questions about token budgeting and optimization, consult Ludwig at the accounting desk.*
