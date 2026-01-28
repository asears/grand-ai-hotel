# Model and Token Management Guide
## GitHub Copilot CLI - Strategic Resource Usage

---

## 📊 Understanding Models in Copilot CLI

### Available Models

GitHub Copilot CLI provides access to multiple AI models via the `/model` command. Each model has different characteristics, costs, and optimal use cases.

#### Claude Models (Anthropic)

**Claude Sonnet 4.5** *(Default)*
- **Tier**: Standard
- **Best for**: General development tasks, balanced quality and speed
- **Strengths**: Code generation, refactoring, documentation
- **Token window**: ~200K tokens
- **Speed**: Moderate
- **Cost**: 1 premium request per prompt

**Claude Opus 4.5**
- **Tier**: Premium
- **Best for**: Complex reasoning, architectural decisions, difficult debugging
- **Strengths**: Deep analysis, complex refactoring, system design
- **Token window**: ~200K tokens
- **Speed**: Slower (more thorough)
- **Cost**: 1 premium request per prompt (highest quality)

**Claude Haiku 4.5**
- **Tier**: Fast/Economical
- **Best for**: Quick queries, simple edits, rapid iteration
- **Strengths**: Speed, efficiency, straightforward tasks
- **Token window**: ~200K tokens
- **Speed**: Very fast
- **Cost**: 1 premium request per prompt (best value)

**Claude Sonnet 4**
- **Tier**: Standard
- **Best for**: Legacy support, specific use cases
- **Strengths**: Proven reliability
- **Token window**: ~200K tokens
- **Speed**: Moderate
- **Cost**: 1 premium request per prompt

#### GPT Models (OpenAI)

**GPT-5.2-Codex**
- **Tier**: Standard
- **Best for**: Code-specific tasks, API usage
- **Strengths**: Code understanding, programming languages
- **Speed**: Fast
- **Cost**: 1 premium request per prompt

**GPT-5.1-Codex-Max**
- **Tier**: Standard
- **Best for**: Large codebases, complex code analysis
- **Strengths**: Extended context, comprehensive understanding
- **Speed**: Moderate
- **Cost**: 1 premium request per prompt

**GPT-5.1-Codex**
- **Tier**: Standard
- **Best for**: Standard coding tasks
- **Strengths**: Balance of capability and speed
- **Speed**: Fast
- **Cost**: 1 premium request per prompt

**GPT-5.2**
- **Tier**: Standard
- **Best for**: General-purpose tasks, natural language
- **Strengths**: Versatility, broad knowledge
- **Speed**: Fast
- **Cost**: 1 premium request per prompt

**GPT-5.1**
- **Tier**: Standard
- **Best for**: General development work
- **Strengths**: Reliable performance
- **Speed**: Fast
- **Cost**: 1 premium request per prompt

**GPT-5**
- **Tier**: Standard
- **Best for**: Standard tasks
- **Strengths**: Foundation model
- **Speed**: Fast
- **Cost**: 1 premium request per prompt

**GPT-5.1-Codex-Mini**
- **Tier**: Fast/Economical
- **Best for**: Quick code queries, simple tasks
- **Strengths**: Speed, low resource usage
- **Speed**: Very fast
- **Cost**: 1 premium request per prompt

**GPT-5-mini**
- **Tier**: Fast/Economical
- **Best for**: Simple queries, rapid responses
- **Strengths**: Fastest responses, efficiency
- **Speed**: Extremely fast
- **Cost**: 1 premium request per prompt

**GPT-4.1**
- **Tier**: Fast/Economical
- **Best for**: Legacy support, cost optimization
- **Strengths**: Proven capability, economy
- **Speed**: Fast
- **Cost**: 1 premium request per prompt

#### Gemini Models (Google)

**Gemini 3 Pro (Preview)**
- **Tier**: Standard
- **Best for**: Experimental features, Google ecosystem
- **Strengths**: Multimodal capabilities, newest features
- **Speed**: Moderate
- **Cost**: 1 premium request per prompt

---

## 🎯 Model Selection Strategy

### By Task Type

```
┌─────────────────────────┬────────────────────────────┐
│ Task Type               │ Recommended Model          │
├─────────────────────────┼────────────────────────────┤
│ Complex architecture    │ Claude Opus 4.5            │
│ Difficult debugging     │ Claude Opus 4.5            │
│ System design           │ Claude Opus 4.5            │
├─────────────────────────┼────────────────────────────┤
│ General coding          │ Claude Sonnet 4.5          │
│ Refactoring             │ Claude Sonnet 4.5          │
│ Documentation           │ Claude Sonnet 4.5          │
│ Code review             │ Claude Sonnet 4.5          │
├─────────────────────────┼────────────────────────────┤
│ Quick edits             │ Claude Haiku 4.5           │
│ Simple queries          │ GPT-5-mini                 │
│ Rapid iteration         │ GPT-5.1-Codex-Mini         │
│ Fast responses          │ Claude Haiku 4.5           │
├─────────────────────────┼────────────────────────────┤
│ Code-specific tasks     │ GPT-5.2-Codex              │
│ API generation          │ GPT-5.2-Codex              │
│ Large codebase analysis │ GPT-5.1-Codex-Max          │
├─────────────────────────┼────────────────────────────┤
│ Natural language heavy  │ GPT-5.2                    │
│ Documentation writing   │ Claude Sonnet 4.5 / GPT-5  │
│ Explanations            │ Claude Sonnet 4.5          │
└─────────────────────────┴────────────────────────────┘
```

### By Agent Persona

```
┌─────────────────────┬────────────────────────────┐
│ Agent               │ Recommended Model          │
├─────────────────────┼────────────────────────────┤
│ M. Gustave          │ Claude Opus 4.5            │
│ (Quality/Docs)      │ (Demands excellence)       │
├─────────────────────┼────────────────────────────┤
│ Zero                │ Claude Sonnet 4.5          │
│ (General assistant) │ (Balanced for all tasks)   │
├─────────────────────┼────────────────────────────┤
│ Agatha              │ Claude Haiku 4.5           │
│ (Testing/Data)      │ (Fast iteration on tests)  │
├─────────────────────┼────────────────────────────┤
│ Dmitri              │ Claude Opus 4.5            │
│ (Security)          │ (Deep adversarial thinking)│
├─────────────────────┼────────────────────────────┤
│ Henckels            │ GPT-5.2-Codex              │
│ (Standards/CI)      │ (Code-focused, systematic) │
├─────────────────────┼────────────────────────────┤
│ Ludwig              │ GPT-5.1-Codex              │
│ (Validation)        │ (Precise, type-focused)    │
├─────────────────────┼────────────────────────────┤
│ Serge X.            │ Claude Opus 4.5            │
│ (Analysis)          │ (Deep analytical reasoning)│
└─────────────────────┴────────────────────────────┘
```

---

## 💰 Premium Request Management

### Understanding Premium Requests

Each time you submit a prompt to GitHub Copilot CLI, it consumes **one premium request** from your monthly quota, regardless of which model you use.

**Quota by Plan:**
- **Copilot Individual**: 2,000 premium requests/month
- **Copilot Business**: 2,000 premium requests/month
- **Copilot Enterprise**: 2,000 premium requests/month (check current plan)

### Checking Usage

```bash
/usage
```

This displays:
- Premium requests consumed this month
- Tokens used in current session
- Operations performed
- Session statistics

### Conservation Strategies

#### 1. Batch Related Questions

**❌ Wasteful:**
```
Prompt 1: "What does this function do?"
Prompt 2: "How can I optimize it?"
Prompt 3: "Add error handling"
```
*Cost: 3 premium requests*

**✅ Efficient:**
```
"What does this function do, how can I optimize it, and add error handling?"
```
*Cost: 1 premium request*

#### 2. Use Context Wisely

**Include relevant files with @:**
```bash
@src/nlp/tokenizer.py @tests/test_tokenizer.py
Refactor the tokenizer for better performance and update tests
```

This prevents follow-up questions about "what tests exist?" or "where is this used?"

#### 3. Leverage `/compact`

When context grows large:
```bash
/compact
```

Summarizes conversation history, reducing token usage while preserving essential information for future prompts.

#### 4. Use Appropriate Models

Don't use Claude Opus for simple queries:
- Simple edits → Claude Haiku or GPT-5-mini
- Standard work → Claude Sonnet 4.5
- Complex reasoning → Claude Opus 4.5

#### 5. Plan Before Executing

Use `/plan` for complex tasks:
```bash
/plan Implement sentiment analysis pipeline with BERT
```

The AI creates a plan you can review and edit before implementation, preventing multiple rounds of corrections.

---

## 🧮 Token Usage Strategies

### Understanding Tokens

- **Input tokens**: Your prompt + context (files, conversation history)
- **Output tokens**: AI's response
- **Context window**: Maximum tokens model can process (~200K for most models)

### Viewing Token Usage

```bash
/context
```

Shows:
- Current token count
- Percentage of context window used
- Visual representation of token distribution

### Token Conservation

#### 1. Selective File Inclusion

**❌ Heavy:**
```bash
@src/**/*.py Explain the codebase
```

**✅ Targeted:**
```bash
@src/nlp/tokenizer.py @src/nlp/embeddings.py
Explain how tokenization feeds into embeddings
```

#### 2. Use `/compact` Regularly

Long conversations accumulate tokens. Compact when context exceeds 50%:

```bash
/context    # Check usage
/compact    # Summarize if needed
```

#### 3. Start Fresh When Appropriate

```bash
/clear
```

Starts a new session when previous context is no longer relevant.

#### 4. Avoid Redundant Context

If a file is already in context, don't re-mention it:

**❌ Redundant:**
```bash
First: @models/bert.py Explain this model
Later: @models/bert.py Now add logging  # Already in context
```

**✅ Efficient:**
```bash
First: @models/bert.py Explain this model
Later: Now add logging to the BERT model  # Refers to existing context
```

---

## 🔄 Switching Models Mid-Session

```bash
/model
```

A menu appears. Use arrow keys to select, or type model name:

```bash
/model claude-opus-4.5
```

**When to switch:**

- **To Opus**: Hit a complex problem requiring deep reasoning
- **To Haiku/Mini**: Doing simple edits, want faster responses
- **To Codex**: Working heavily with code generation/analysis

---

## 📈 Advanced Optimization Techniques

### 1. Progressive Refinement

Start with fast model for draft, use premium model for polish:

```bash
/model claude-haiku-4.5
Create a basic sentiment analysis function

# Review output, then:
/model claude-opus-4.5
Refine this function with error handling, optimization, and comprehensive docs
```

### 2. Agent-Model Pairing

Invoke agents with appropriate models already selected:

```bash
/model claude-opus-4.5
/agent
# Select M. Gustave for architectural review

/model claude-haiku-4.5
/agent
# Select Agatha for test data generation
```

### 3. Session Planning

For long-running work:

1. **Plan with Opus**: Architecture, design decisions
2. **Implement with Sonnet**: Standard coding work
3. **Iterate with Haiku**: Quick fixes, adjustments
4. **Polish with Opus**: Final review, documentation

### 4. Context Window Management

Monitor and manage context aggressively:

```bash
/context              # Check at session start
# Work...
/context              # Check periodically
/compact              # Summarize when >50%
# Continue working...
/context              # Monitor again
/clear                # Fresh start when changing topics
```

---

## 🎓 Best Practices Summary

### ✅ DO:
- Use `/usage` to monitor quota consumption
- Use `/context` to track token usage
- Batch related questions into single prompts
- Select appropriate models for task complexity
- Use `/compact` when context grows large
- Include relevant files with @ to prevent follow-ups
- Use `/plan` for complex, multi-step tasks

### ❌ DON'T:
- Use Claude Opus for simple queries
- Re-mention files already in context
- Ask multiple sequential questions that could be batched
- Let context window exceed 80% without compacting
- Use premium requests for typo fixes or trivial edits

---

## 📊 Example Resource Management Session

```bash
# Start with context check
/context
# Usage: 15% (good headroom)

# Select appropriate model for task
/model claude-sonnet-4.5

# Include necessary context efficiently
@src/nlp/tokenizer.py @src/models/bert.py
Refactor tokenizer to work with BERT model, add type hints, and create tests

# Check usage after response
/usage
# 47 requests used this month / 2000 remaining

# Continue working, check context periodically
/context
# Usage: 62% (approaching limit)

# Compact before continuing
/compact

# Switch to faster model for iteration
/model claude-haiku-4.5

# Quick iterations
Fix the import error
Add logging to the transform method
Update docstring

# Final polish with premium model
/model claude-opus-4.5
Final review: ensure production readiness, security, and performance

# Check final usage
/usage
# 51 requests used / 2000 remaining (conservative usage)
```

---

## 🔗 Related Documentation

- **Agent Personas**: `.github/skills/agent-personas-diagram.md`
- **CLI Tutorial**: `tutorials/grand-budapest-cli-tutorial.md`
- **Quick Reference**: `.github/skills/quick-reference.md`
- **Official Docs**: https://docs.github.com/copilot/concepts/agents/about-copilot-cli

---

*"Choose your model wisely, conserve your quota judiciously, and may your tokens never overflow."*  
— M. Gustave H., Concierge of The Grand Budapest Terminal
