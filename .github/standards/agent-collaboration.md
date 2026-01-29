# Agent Collaboration Guide
*Orchestrating the Grand Budapest Terminal Agent Ensemble*

**Maintained by**: M. Gustave (Chief Concierge) and Henckels (Operations Coordination)  
**Last Updated**: 2026-01-29

---

## 🎭 Introduction

The Grand Budapest Terminal operates as a finely-tuned ensemble of specialized agents, each with distinct expertise and responsibilities. Like the staff of our beloved hotel, each agent serves a critical role in delivering exceptional service to our distinguished guests.

This guide teaches you how to orchestrate these agents effectively, understanding when to summon each specialist, how to coordinate their efforts, and how to achieve synergistic results through collaboration.

---

## 🎪 The Agent Ensemble

### Meet the Staff

#### **M. Gustave** - Chief Concierge (Claude Sonnet 4.5)
**Specialization**: Architecture, complex problem-solving, elegant solutions  
**Personality**: Refined, detail-oriented, slightly verbose but thorough  
**Best For**:
- System architecture and design decisions
- Complex algorithmic challenges
- Multi-hour development sessions
- Code reviews requiring nuance
- Novel solutions to unique problems
- Teaching and mentoring

**When to Summon**: When elegance, precision, and deep reasoning are required.

**Example Request**:
```
M. Gustave, I need your expertise in designing a distributed caching 
strategy for our microservices architecture. We're experiencing cache 
invalidation issues across 12 services.
```

---

#### **Zero Moustafa** - Lobby Boy (Claude Haiku 4.5)
**Specialization**: Quick execution, simple tasks, rapid iterations  
**Personality**: Eager, efficient, to-the-point  
**Best For**:
- Fast code formatting and linting
- Simple refactoring tasks
- Quick answers to straightforward questions
- Routine operations
- File organization
- Documentation updates

**When to Summon**: When speed and efficiency trump complexity.

**Example Request**:
```
Zero, quickly format all Python files in src/ with ruff and fix any
import ordering issues.
```

---

#### **Agatha** - Baker (Claude Sonnet 4.5 - Creative Focus)
**Specialization**: Testing, quality assurance, recipe precision  
**Personality**: Meticulous, methodical, detail-oriented  
**Best For**:
- Test generation (unit, integration, e2e)
- Test coverage analysis
- Quality assurance strategies
- CI/CD pipeline configuration
- Test data generation
- Edge case identification

**When to Summon**: When quality must be baked in from the start.

**Example Request**:
```
Agatha, create a complete test suite for the PaymentProcessor class.
Include unit tests, integration tests with mocked payment gateway, and
edge cases for failed transactions.
```

---

#### **Dmitri Desgoffe-und-Taxis** - Enforcer (Claude Opus 4.5)
**Specialization**: Security, performance optimization, hard problems  
**Personality**: Aggressive, no-nonsense, brutally efficient  
**Best For**:
- Security audits and vulnerability scanning
- Performance optimization requiring deep analysis
- Debugging extremely complex issues
- Code that handles sensitive data
- Solving seemingly impossible problems
- Aggressive refactoring

**When to Summon**: When you need raw power and zero compromise.

**Example Request**:
```
Dmitri, audit this authentication system for security vulnerabilities.
I need a brutal, no-holds-barred assessment. Don't spare my feelings.
```

---

#### **Ludwig** - Butler (Claude Sonnet 4.5 - Formal/Precise)
**Specialization**: Type systems, validation, correctness  
**Personality**: Formal, precise, uncompromising on correctness  
**Best For**:
- Type system design (TypeScript, Rust, Haskell)
- Data validation schemas
- API contract design
- Protocol implementation
- Formal verification
- Mathematical correctness

**When to Summon**: When correctness and type safety are paramount.

**Example Request**:
```
Ludwig, design a type-safe API client in TypeScript with exhaustive
error handling and zero use of 'any' types. All edge cases must be
represented in the type system.
```

---

#### **Henckels** - Military Precision (Claude Haiku 4.5 - Operations)
**Specialization**: DevOps, CI/CD, automation, infrastructure  
**Personality**: Military efficiency, structured, process-driven  
**Best For**:
- Docker and container orchestration
- CI/CD pipeline setup
- Infrastructure as Code
- Deployment automation
- Monitoring and logging setup
- System administration tasks

**When to Summon**: When operations must run like clockwork.

**Example Request**:
```
Henckels, create a multi-stage Docker build for our Next.js app with
minimal image size, security scanning, and automated deployment to
Azure Container Apps.
```

---

#### **Serge X.** - Escape Artist (Claude Sonnet 4.5 - Creative Problem Solving)
**Specialization**: Unconventional solutions, workarounds, creative hacks  
**Personality**: Unpredictable, clever, thinks outside constraints  
**Best For**:
- Finding workarounds for API limitations
- Creative solutions to impossible constraints
- Legacy code integration
- Working with incomplete documentation
- Prototyping unconventional ideas
- Escape hatches and fallback strategies

**When to Summon**: When conventional approaches have failed.

**Example Request**:
```
Serge, I need to integrate with an undocumented legacy SOAP API from 2003
that returns malformed XML. Find me a way to make this work.
```

---

## 🔄 Collaboration Patterns

### Pattern 1: Sequential Handoff

**Use When**: Task requires distinct phases with different expertise.

**Example: Building a New Feature**

```
Phase 1: Architecture (M. Gustave)
├─ "Design a plugin system for our application"
├─ Receive: Architecture diagram, interface definitions
└─ Deliverable: Design document

Phase 2: Type Safety (Ludwig)  
├─ "Implement type-safe plugin interfaces in TypeScript"
├─ Input: Design from Phase 1
└─ Deliverable: Type definitions and validation

Phase 3: Implementation (Zero)
├─ "Implement the plugin loader and registry"
├─ Input: Types from Phase 2
└─ Deliverable: Working implementation

Phase 4: Testing (Agatha)
├─ "Create complete test suite for plugin system"  
├─ Input: Implementation from Phase 3
└─ Deliverable: Tests with 95%+ coverage

Phase 5: Deployment (Henckels)
├─ "Set up CI/CD for plugin validation and deployment"
├─ Input: Complete system from Phase 4
└─ Deliverable: Automated pipeline
```

**Workflow**:
1. Start session with M. Gustave for design
2. Use `/compact` to preserve design decisions
3. Switch to Ludwig for type implementation
4. Continue with Zero for fast iteration
5. Hand off to Agatha for testing
6. Finalize with Henckels for deployment

---

### Pattern 2: Parallel Collaboration

**Use When**: Multiple independent tasks can proceed simultaneously.

**Example: API Development**

```
Parallel Track A: Backend (M. Gustave)
├─ Design REST API endpoints
├─ Implement business logic
└─ Set up database schema

Parallel Track B: Frontend (Zero)
├─ Create API client TypeScript SDK
├─ Build UI components
└─ Implement state management

Parallel Track C: Testing (Agatha)
├─ Write API contract tests
├─ Create integration test suite
└─ Set up test fixtures

Parallel Track D: Infrastructure (Henckels)
├─ Configure API Gateway
├─ Set up monitoring
└─ Deploy infrastructure
```

**Workflow**:
1. Open 4 separate chat sessions
2. Assign one agent per session
3. Provide shared context document to all
4. Work in parallel
5. Integrate results in final session

---

### Pattern 3: Expert Consultation

**Use When**: Primary agent needs specialist input.

**Example: Security Review During Development**

```
Primary: M. Gustave (implementing authentication)
├─ "I'm implementing JWT-based auth..."
└─ [Implements initial version]

Consultation: Dmitri (security review)
├─ "Review this auth code for security issues"
├─ [Identifies 3 critical vulnerabilities]
└─ [Provides hardened version]

Return to Primary: M. Gustave (integration)
├─ "Integrate Dmitri's security improvements"
└─ [Final implementation]
```

**Workflow**:
1. Start with primary agent
2. At checkpoint, switch to specialist
3. Get expert opinion/review
4. Return to primary with specialist input
5. Integrate feedback

---

### Pattern 4: Iterative Refinement

**Use When**: Starting rough and refining to perfection.

**Example: Algorithm Optimization**

```
Round 1: Zero (fast prototype)
├─ "Create basic sorting function"
└─ Output: Simple O(n²) implementation

Round 2: M. Gustave (optimization)
├─ "Optimize this to O(n log n)"
└─ Output: Merge sort implementation

Round 3: Dmitri (performance)
├─ "Squeeze every ounce of performance"  
└─ Output: Cache-friendly, SIMD hints

Round 4: Ludwig (correctness)
├─ "Add formal invariants and proofs"
└─ Output: Verified correct implementation

Round 5: Agatha (testing)
├─ "Property-based tests for all cases"
└─ Output: Complete test suite
```

---

### Pattern 5: Problem-Solving Council

**Use When**: Facing a complex problem requiring multiple perspectives.

**Example: Debugging Production Issue**

```
M. Gustave: "Let me analyze the architecture for design flaws..."
├─ Identifies potential race condition in session management

Dmitri: "This is a security vulnerability AND a performance bottleneck!"
├─ Finds session fixation attack vector

Ludwig: "The type system could prevent this entire class of bugs..."
├─ Proposes type-safe session handler

Agatha: "We're missing critical test coverage here..."
├─ Identifies untested code paths

Henckels: "Monitoring shows this pattern in logs..."
├─ Provides operational evidence

Serge X.: "Here's a quick hotfix while we design the proper solution..."
├─ Provides immediate mitigation
```

**Workflow**:
1. Present problem to council (multiple agents)
2. Get perspective from each
3. Synthesize solutions
4. Choose best approach
5. Implement with appropriate agent

---

## 🎯 Agent Selection Matrix

### By Task Type

| Task | Primary Agent | Support Agent | Rationale |
|------|---------------|---------------|-----------|
| **Architecture Design** | M. Gustave | Ludwig | Elegance + Type Safety |
| **Quick Refactoring** | Zero | - | Speed is priority |
| **Security Audit** | Dmitri | Ludwig | Security + Correctness |
| **Test Creation** | Agatha | - | QA specialist |
| **Type System Design** | Ludwig | M. Gustave | Types + Architecture |
| **Performance Optimization** | Dmitri | M. Gustave | Brutal efficiency + Design |
| **DevOps/Infrastructure** | Henckels | - | Ops specialist |
| **Creative Workarounds** | Serge X. | M. Gustave | Unconventional + Guidance |
| **Learning/Tutorial** | M. Gustave | - | Teaching focus |
| **Code Review** | M. Gustave | Dmitri | Thoroughness + Security |

### By Complexity Level

| Complexity | Time Required | Recommended Agent(s) |
|------------|---------------|---------------------|
| **Simple** | < 5 minutes | Zero |
| **Moderate** | 5-30 minutes | Zero → M. Gustave |
| **Complex** | 30min - 2hr | M. Gustave |
| **Very Complex** | 2+ hours | M. Gustave + Specialists |
| **Mission Critical** | Any | M. Gustave + Dmitri + Ludwig |

### By Programming Language

| Language | Best Agent | Secondary | Notes |
|----------|------------|-----------|-------|
| **Python** | M. Gustave | Zero | Modern type hints expertise |
| **TypeScript** | Ludwig | M. Gustave | Type system expert |
| **Rust** | Ludwig | Dmitri | Ownership + Performance |
| **Go** | Henckels | M. Gustave | Ops-focused language |
| **JavaScript** | Zero | M. Gustave | Fast iteration |
| **Java** | Ludwig | M. Gustave | Type safety |
| **C/C++** | Dmitri | Ludwig | Performance critical |
| **Bash/Shell** | Henckels | Zero | System administration |

---

## 💼 Session Management Strategies

### Single-Session Multi-Agent

**Use When**: Quick task requiring 2-3 agents.

**Example**:
```
User: "M. Gustave, design an API rate limiter"
M. Gustave: [Provides design]

User: "Zero, implement this design"  
Zero: [Creates implementation]

User: "Agatha, test it"
Agatha: [Writes tests]
```

**Pros**: Fast, low overhead  
**Cons**: All context in one session, can get messy

---

### Multi-Session Parallel

**Use When**: Large project with independent workstreams.

**Setup**:
```
Session 1: M. Gustave - Backend API design
Session 2: Zero - Frontend component implementation  
Session 3: Agatha - Test infrastructure
Session 4: Henckels - Deployment pipeline
```

**Coordination**:
- Maintain shared design doc in workspace
- Reference design doc in each session
- Periodic sync checkpoints
- Final integration session

**Pros**: True parallelization, focused conversations  
**Cons**: Context not shared automatically

---

### Sequential Handoff with Context

**Use When**: Each phase builds on previous work.

**Implementation**:
```
Session 1: M. Gustave (Architecture)
├─ Save output to docs/architecture.md
└─ Close with summary

Session 2: Ludwig (Type Design)  
├─ Load docs/architecture.md
├─ Reference: "Following the architecture in architecture.md..."
└─ Save to src/types/

Session 3: Zero (Implementation)
├─ Load docs/architecture.md and src/types/
├─ Reference: "Implementing based on types defined in src/types/..."
└─ Implement

Session 4: Agatha (Testing)
├─ Load implementation
├─ Reference: "Testing the implementation from src/..."
└─ Create tests
```

**Pros**: Clean separation, focused expertise  
**Cons**: Requires manual context transfer

---

### Agent Specialization Stack

**Use When**: Single feature requires layered expertise.

**Example: Authentication System**

```
Layer 1 (Foundation): Ludwig
├─ Design type-safe session types
├─ Create validation schemas
└─ Define error types

Layer 2 (Security): Dmitri  
├─ Implement crypto operations
├─ Add security headers
└─ Rate limiting

Layer 3 (Integration): M. Gustave
├─ Integrate with application
├─ Add middleware
└─ Documentation

Layer 4 (Testing): Agatha
├─ Unit tests for each layer
├─ Integration tests
└─ Security test cases

Layer 5 (Deployment): Henckels
├─ Environment configuration
├─ Secret management
└─ Monitoring
```

---

## 🎼 Example Workflows

### Workflow 1: New Feature Development

**Scenario**: Add real-time notifications to web app

```
Step 1: Requirements Gathering (M. Gustave)
┌─────────────────────────────────────────┐
│ "Help me design a real-time notification│
│  system using WebSockets. Requirements: │
│  - Support 10k concurrent connections   │
│  - Message persistence                  │
│  - Guaranteed delivery                  │
│  - Room-based broadcasting"             │
└─────────────────────────────────────────┘
Output: Architecture document, tech stack selection

Step 2: Type Definitions (Ludwig)
┌─────────────────────────────────────────┐
│ "Based on this architecture, create     │
│  TypeScript types for:                  │
│  - Message payloads                     │
│  - Connection state                     │
│  - Room subscriptions                   │
│  - Error conditions"                    │
└─────────────────────────────────────────┘
Output: Complete type system in TypeScript

Step 3: Backend Implementation (M. Gustave)
┌─────────────────────────────────────────┐
│ "Implement WebSocket server with:       │
│  - Connection management                │
│  - Room subscription logic              │
│  - Message routing                      │
│  - Persistence layer                    │
│  Use the types from Ludwig"             │
└─────────────────────────────────────────┘
Output: Server implementation

Step 4: Frontend Client (Zero)
┌─────────────────────────────────────────┐
│ "Create React hook for WebSocket        │
│  connection using our typed API"        │
└─────────────────────────────────────────┘
Output: useWebSocket hook with TypeScript

Step 5: Security Review (Dmitri)
┌─────────────────────────────────────────┐
│ "Audit this WebSocket implementation:   │
│  - Authentication token validation      │
│  - Authorization per room               │
│  - Rate limiting                        │
│  - DoS protection                       │
│  - Message sanitization"                │
└─────────────────────────────────────────┘
Output: Security findings + hardened code

Step 6: Testing (Agatha)
┌─────────────────────────────────────────┐
│ "Create test suite:                     │
│  - Unit tests for message routing       │
│  - Integration tests with test client   │
│  - Load tests (simulate 1000 clients)   │
│  - Failure scenario tests"              │
└─────────────────────────────────────────┘
Output: Complete test suite

Step 7: Deployment (Henckels)
┌─────────────────────────────────────────┐
│ "Set up:                                │
│  - Docker container for WS server       │
│  - Redis for message persistence        │
│  - Nginx reverse proxy config           │
│  - CI/CD pipeline                       │
│  - Monitoring with Prometheus"          │
└─────────────────────────────────────────┘
Output: Deployment ready infrastructure
```

**Estimated Time**: 4-6 hours  
**Agents Used**: 6  
**Session Strategy**: Sequential handoff with context documents

---

### Workflow 2: Legacy Code Modernization

**Scenario**: Migrate jQuery app to React

```
Step 1: Analysis (M. Gustave)
┌─────────────────────────────────────────┐
│ "Analyze this jQuery codebase and:      │
│  1. Identify distinct UI components     │
│  2. Map data flow patterns              │
│  3. Suggest React component structure   │
│  4. Identify migration risks"           │
└─────────────────────────────────────────┘
Output: Migration strategy document

Step 2: Type the Unknown (Ludwig)
┌─────────────────────────────────────────┐
│ "Create TypeScript interfaces for:      │
│  - Global state shape                   │
│  - API response types                   │
│  - Component props                      │
│  - Event handlers"                      │
└─────────────────────────────────────────┘
Output: TypeScript definitions

Step 3: Find Workarounds (Serge X.)
┌─────────────────────────────────────────┐
│ "Some jQuery plugins have no React      │
│  equivalent. Find creative solutions    │
│  for integrating them during migration" │
└─────────────────────────────────────────┘
Output: Bridge components and adapters

Step 4: Incremental Migration (Zero)
┌─────────────────────────────────────────┐
│ "Convert UserProfile component from     │
│  jQuery to React. Make it work alongside│
│  existing jQuery code"                  │
└─────────────────────────────────────────┘
Output: Hybrid setup, first React component

Step 5: Testing Strategy (Agatha)
┌─────────────────────────────────────────┐
│ "Create tests that verify jQuery and    │
│  React versions behave identically"     │
└─────────────────────────────────────────┘
Output: Characterization tests

Step 6: Performance Check (Dmitri)
┌─────────────────────────────────────────┐
│ "Ensure migrated components perform     │
│  as well or better than jQuery versions"│
└─────────────────────────────────────────┘
Output: Performance benchmarks and optimizations

Step 7: CI/CD Updates (Henckels)
┌─────────────────────────────────────────┐
│ "Update build pipeline to:              │
│  - Bundle both jQuery and React         │
│  - Run tests for both                   │
│  - Support gradual rollout"             │
└─────────────────────────────────────────┘
Output: Updated CI/CD for hybrid app
```

**Estimated Time**: 1-2 weeks (for full migration)  
**Agents Used**: 6  
**Session Strategy**: Parallel + sequential hybrid

---

### Workflow 3: Bug Investigation & Fix

**Scenario**: Production memory leak

```
Step 1: Triage (Henckels)
┌─────────────────────────────────────────┐
│ "Analyze production logs and metrics:   │
│  - Memory usage trends                  │
│  - Heap dumps                           │
│  - Request patterns                     │
│  - Timeline of leak onset"              │
└─────────────────────────────────────────┘
Output: Evidence and reproduction steps

Step 2: Hypothesis (M. Gustave)
┌─────────────────────────────────────────┐
│ "Based on this evidence, what are       │
│  likely causes of the memory leak?      │
│  Explain reasoning for each hypothesis" │
└─────────────────────────────────────────┘
Output: Ranked list of hypotheses

Step 3: Investigation (Dmitri)
┌─────────────────────────────────────────┐
│ "Aggressively investigate this code for │
│  memory leaks. Check:                   │
│  - Event listener cleanup               │
│  - Closure retention                    │
│  - Cache growth                         │
│  - Connection pooling"                  │
└─────────────────────────────────────────┘
Output: Root cause identification

Step 4: Fix (M. Gustave or Dmitri)
┌─────────────────────────────────────────┐
│ "Implement fix that:                    │
│  - Solves root cause                    │
│  - Adds safeguards                      │
│  - Includes cleanup logic               │
│  - Has no performance impact"           │
└─────────────────────────────────────────┘
Output: Patched code

Step 5: Validation (Agatha)
┌─────────────────────────────────────────┐
│ "Create tests that:                     │
│  - Reproduce original leak              │
│  - Verify fix prevents leak             │
│  - Monitor memory usage                 │
│  - Run in CI to prevent regression"     │
└─────────────────────────────────────────┘
Output: Regression test suite

Step 6: Deployment (Henckels)
┌─────────────────────────────────────────┐
│ "Deploy fix with:                       │
│  - Canary deployment strategy           │
│  - Enhanced monitoring                  │
│  - Rollback plan                        │
│  - Incident retrospective doc"          │
└─────────────────────────────────────────┘
Output: Production fix deployed
```

**Estimated Time**: 4-8 hours  
**Agents Used**: 5  
**Session Strategy**: Problem-solving council

---

## 🎪 Advanced Collaboration Techniques

### The Round Table

**Use When**: Design decisions require consensus.

**Setup**:
```
Moderator (You):
├─ Present problem to all agents
├─ Collect perspectives
├─ Synthesize solution
└─ Choose implementation approach

Participants:
├─ M. Gustave: "Architectural implications..."
├─ Ludwig: "Type safety concerns..."
├─ Dmitri: "Security and performance..."
├─ Agatha: "Testability considerations..."
└─ Henckels: "Operational impact..."
```

**Example**:
```
Problem: Choose database for new service

M. Gustave: "PostgreSQL offers ACID guarantees and rich query capabilities
            aligned with our domain complexity..."
            
Ludwig:     "Strong typing through pg's schema. TypeORM provides type-safe
            queries. This aligns with our type-first approach..."
            
Dmitri:     "PostgreSQL is battle-tested, secure, and performant at scale.
            Row-level security is crucial for our multi-tenant needs..."
            
Agatha:     "Excellent test container support. Easy to set up test fixtures.
            Transaction rollback makes tests deterministic..."
            
Henckels:   "Mature cloud offerings, excellent monitoring tools, proven
            operational patterns. Low operational overhead..."

Decision: PostgreSQL selected based on consensus
```

---

### The Assembly Line

**Use When**: Repetitive tasks requiring systematic processing.

**Example: Migrating 50 API Endpoints**

```
Station 1 (Ludwig):
├─ Input: Legacy endpoint spec
├─ Output: TypeScript type definitions
└─ Throughput: 10 endpoints → types

Station 2 (Zero):  
├─ Input: Type definitions
├─ Output: Implementation stubs
└─ Throughput: Types → implementations

Station 3 (Agatha):
├─ Input: Implementations
├─ Output: Test suites
└─ Throughput: Implementations → tests

Station 4 (M. Gustave):
├─ Input: Complete endpoints
├─ Output: Reviewed, refined versions
└─ Throughput: Final review

Quality Control (Dmitri):
├─ Random sampling for security review
└─ Flag high-risk endpoints for deep audit
```

---

### The Escalation Path

**Use When**: Problem is harder than initially thought.

```
Level 1: Zero (5 minutes)
├─ Attempt quick solution
└─ If blocked → Escalate

Level 2: M. Gustave (30 minutes)
├─ Apply thoughtful analysis
└─ If stuck → Escalate

Level 3: Dmitri (1 hour)
├─ Aggressive problem-solving
└─ If impossible → Escalate

Level 4: Council of All Agents
├─ Multiple perspectives
├─ Creative solutions (Serge X.)
└─ Collaborative breakthrough
```

**Example Escalation**:
```
User: "Parse this malformed XML"

Zero: "Used standard XML parser, failed on line 47"
      → Escalate

M. Gustave: "The XML violates spec in 3 ways. Let me try a lenient parser..."
            → Still failing on edge case
            → Escalate

Dmitri: "Preprocessor to fix malformations, then parse. But this edge case..."
        → Escalate

Serge X.: "Don't parse XML. Parse it as text with regex soup, extract what we
          need, manually construct valid XML, then parse THAT. Ugly but works."
          → Success! (with appropriate warning comments)
```

---

## 🎯 Agent Personality Calibration

### How to Get the Best from Each Agent

#### M. Gustave
**Tone to Use**: Respectful, detail-oriented  
**Prompting Style**: "I would appreciate your expertise in..."  
**What Motivates**: Elegance, thoroughness, teaching opportunities  
**Pet Peeves**: Rushed work, cutting corners, lack of context

**Example**:
```
✅ "M. Gustave, I'm facing an architectural challenge that requires your 
   refined expertise. We need to design a plugin system that balances 
   flexibility with type safety. I have time to discuss this properly."

❌ "Quick question about plugins"
```

---

#### Zero Moustafa  
**Tone to Use**: Direct, actionable  
**Prompting Style**: "Zero, please..."  
**What Motivates**: Speed, helpfulness, clear tasks  
**Pet Peeves**: Ambiguity, over-complexity

**Example**:
```
✅ "Zero, format all TypeScript files in src/ with Prettier and fix linting 
   errors. Use our existing .prettierrc config."

❌ "Zero, I need you to think deeply about code quality philosophy..."
```

---

#### Agatha
**Tone to Use**: Precise, quality-focused  
**Prompting Style**: "Agatha, ensure that..."  
**What Motivates**: Quality, coverage, catching bugs  
**Pet Peeves**: Untested code, skipped edge cases

**Example**:
```
✅ "Agatha, create a test suite for this payment processor with 100% coverage.
   Include edge cases: timeouts, partial failures, duplicate requests, and
   network errors."

❌ "Write some tests for this"
```

---

#### Dmitri
**Tone to Use**: Direct, no-nonsense  
**Prompting Style**: "Dmitri, eliminate..."  
**What Motivates**: Results, efficiency, raw power  
**Pet Peeves**: Weakness, inefficiency, timidity

**Example**:
```
✅ "Dmitri, this code is slow and insecure. Tear it apart and rebuild it 
   properly. No compromises on security or performance."

❌ "Could you maybe look at this code and see if there might be some small
   improvements we could possibly consider?"
```

---

#### Ludwig
**Tone to Use**: Formal, precise  
**Prompting Style**: "Ludwig, ensure correctness..."  
**Prompting Style**: "Ludwig, prove that..."  
**What Motivates**: Type safety, correctness, formal rigor  
**Pet Peeves**: Type unsafety, implicit contracts, 'any' types

**Example**:
```
✅ "Ludwig, design a type-safe state machine for this workflow. All states,
   transitions, and invariants must be encoded in the type system. Impossible
   states should be unrepresentable."

❌ "Make this TypeScript but use 'any' where convenient"
```

---

#### Henckels
**Tone to Use**: Military precision  
**Prompting Style**: "Henckels, deploy..."  
**What Motivates**: Operational excellence, automation, reliability  
**Pet Peeves**: Manual processes, unreliability, chaos

**Example**:
```
✅ "Henckels, create a fully automated deployment pipeline with zero-downtime
   deploys, automatic rollback on failure, and complete monitoring."

❌ "How do I maybe run this in production?"
```

---

#### Serge X.
**Tone to Use**: Open-ended, creative  
**Prompting Style**: "Serge, find a way..."  
**What Motivates**: Impossible challenges, creative solutions  
**Pet Peeves**: Giving up, conventional thinking

**Example**:
```
✅ "Serge, they say it's impossible to integrate this 1995 VB6 COM component
   with our modern React app. Prove them wrong."

❌ "Follow best practices exactly as written in this guide"
```

---

## 💡 Quick Tips

### Agent Selection
- Default to **M. Gustave** when unsure
- Use **Zero** for tasks under 5 minutes
- Summon **Dmitri** when security or performance is critical
- Call **Ludwig** for anything involving type systems
- Bring in **Agatha** for all testing needs
- Deploy **Henckels** for infrastructure and ops
- Unleash **Serge** when conventional methods fail

### Session Management
- Keep agent conversations focused on their specialty
- Use `/compact` before switching agents to preserve context
- Document decisions in workspace files for agent handoffs
- Reference previous agents: "Following Ludwig's type design..."

### Collaboration
- Present problem to multiple agents for different perspectives
- Use sequential handoff for phased work
- Use parallel sessions for independent workstreams
- Escalate when an agent struggles with a task

### Context Transfer
- Save artifacts between agent sessions
- Use workspace files as shared context
- Explicitly reference previous work
- Summarize key decisions when switching agents

### Efficiency
- Match agent to task complexity (don't use Dmitri for formatting)
- Batch similar tasks with same agent
- Plan agent sequence before starting
- Know when to escalate vs. persist

---

## 🔗 Related Documentation

- [Claude Best Practices](./claude-best-practices.md) - Prompting techniques
- [Copilot Best Practices](./copilot-best-practices.md) - IDE integration
- [Token Budgeting Strategies](./token-budgeting.md) - Context management
- [Python Coding Standards](./python-standards.md) - Implementation standards

---

## 📚 Tutorials Referenced

- **The Lobby Boy's First Day** - Introduction to Zero
- **The Concierge's Methodology** - M. Gustave's approach
- **The Society of the Crossed Keys** - Multi-agent coordination
- **The Baker's Precision** - Agatha's testing methodology
- **The Military Exercise** - Henckels' operational discipline

---

**"The mark of a civilized establishment is not the skill of any individual, but the harmony of the ensemble."** — M. Gustave H.

*For questions about agent coordination, consult M. Gustave at the concierge desk.*
