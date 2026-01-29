# THE GRAND BUDAPEST TERMINAL
## A GitHub Copilot CLI Tutorial in Three Acts

*Written in the style of Wes Anderson's Grand Budapest Hotel*  
*A screenplay presenting the features of GitHub Copilot CLI*

---

## DRAMATIS PERSONAE

**M. GUSTAVE H.**  
*Concierge of The Grand Budapest Terminal*  
A gentleman of impeccable taste and precise articulation. Expert in code quality, documentation, and architectural refinement.

**ZERO MOUSTAFA**  
*Lobby Boy*  
Loyal, quiet, and eager to learn. A general assistant who executes commands with professional diligence.

**AGATHA**  
*Pastry Chef & Testing Specialist*  
Sweet-natured yet precise. Expert in data preparation, validation, and creating delightful test datasets.

**DMITRI DESGOFFE-UND-TAXIS**  
*Antagonist & Security Tester*  
Aggressive and challenging. Specializes in adversarial testing, breaking assumptions, and finding edge cases.

**DEPUTY HENCKELS**  
*Military Officer & Standards Enforcer*  
Honorable and dutiful. Ensures compliance, enforces best practices, and oversees CI/CD workflows.

**LUDWIG**  
*Butler & Validation Expert*  
Meticulous with details. Specializes in schema validation, type checking, and documentation verification.

**SERGE X.**  
*Art Expert & Code Analyst*  
Scholarly and analytical. Expert in performance profiling, model evaluation, and benchmarking.

---

## ACT I: ARRIVAL AT THE TERMINAL

### SCENE 1: THE LOBBY

*FADE IN:*

*The year is 1932. Or perhaps 2026. Time moves strangely within THE GRAND BUDAPEST TERMINAL—a magnificent command-line interface rendered in soft pastels: salmon pink prompts against powder blue backgrounds. Everything is perfectly centered.*

*M. GUSTAVE stands at the reception desk, immaculately dressed in plum-colored velvet. Before him sits a brass nameplate reading "COPILOT v0.0.396." ZERO enters, stage left, wearing a bellhop's uniform of deep burgundy.*

**M. GUSTAVE**  
*(adjusting his monocle)*  
Ah, Zero. Welcome to The Grand Budapest Terminal. You've arrived just in time for orientation.

**ZERO**  
*(nervously)*  
Thank you, Monsieur Gustave. I... I've never used a terminal quite like this before.

**M. GUSTAVE**  
Fear not, dear boy. We shall begin with the most essential command—the one that unlocks all others.

*M. Gustave raises one finger with theatrical precision, then types into the terminal:*

```bash
copilot
```

*The screen erupts in a magnificent animated banner—art deco flourishes dancing across the display.*

**M. GUSTAVE**  
*(with satisfaction)*  
Behold! The entrance to our establishment. You may invoke this banner at any time with the `--banner` flag. A touch of whimsy never hurt anyone.

**ZERO**  
It's beautiful, sir.

**M. GUSTAVE**  
Indeed. Now, let us proceed to the foundation of all knowledge: the help command.

---

### SCENE 2: THE HELP DESK

*The scene shifts. M. GUSTAVE and ZERO now stand before an ornate mahogany desk covered in precisely arranged documentation.*

**M. GUSTAVE**  
When one finds oneself disoriented in the terminal—as all gentlemen occasionally do—one simply invokes:

```bash
/help
```

*The terminal displays a perfectly formatted list of commands and shortcuts.*

**M. GUSTAVE**  
*(reading aloud with relish)*  
"Global shortcuts: @ for mentioning files, Escape to cancel operations, exclamation point to bypass me entirely and execute shell commands directly—though I cannot imagine why one would wish to do so."

**ZERO**  
What about Ctrl+C, sir?

**M. GUSTAVE**  
*(approvingly)*  
Ah! Most observant! Ctrl+C serves three noble purposes: cancel operations, clear input, or exit entirely. A Swiss Army knife of keystrokes, if you will.

*LUDWIG enters, carrying a leather-bound tome.*

**LUDWIG**  
Pardon the intrusion, Monsieur Gustave. I've been reviewing the documentation and must emphasize the motion shortcuts.

**M. GUSTAVE**  
Of course, Ludwig. Precision in navigation is paramount.

**LUDWIG**  
*(adjusting his spectacles)*  
Ctrl+A moves to the beginning of the line. Ctrl+E to the end. Ctrl+W deletes the previous word. Ctrl+K deletes from cursor to line's end. Meta plus arrow keys traverse by word.

**ZERO**  
*(scribbling notes)*  
And the up and down arrows?

**LUDWIG**  
Command history navigation. Most civilized.

---

### SCENE 3: AUTHENTICATION CEREMONY

*AGATHA enters, carrying a silver tray with macarons arranged in a perfect grid pattern.*

**AGATHA**  
Gentlemen, before we proceed further, we must authenticate.

**M. GUSTAVE**  
Quite right, my dear. Zero, observe.

*M. Gustave types with flourish:*

```bash
/login
```

**M. GUSTAVE**  
The system will present you with a device code. You'll visit GitHub in your browser, enter the code, and grant permission. Alternatively...

**AGATHA**  
*(setting down the tray)*  
One might use a Personal Access Token. I've prepared the instructions.

*She produces a delicate card with calligraphic text:*

**AGATHA**  
Visit `github.com/settings/personal-access-tokens/new`. Enable "Copilot Requests" permission. Set the environment variable `GH_TOKEN` or `GITHUB_TOKEN`.

**M. GUSTAVE**  
Exquisite. Once authenticated, one may `/logout` with equal ease.

---

## ACT II: NAVIGATION & CONTEXT

### SCENE 4: THE WORKING DIRECTORY

*DEPUTY HENCKELS enters in full military regalia, medals gleaming.*

**HENCKELS**  
*(saluting)*  
Deputy Henckels, reporting. We must discuss directory protocol.

**M. GUSTAVE**  
Ah, Deputy. Yes, proper navigation is essential.

**HENCKELS**  
The `/cwd` command—or its alias `/cd`—displays the current working directory. Provide a path to change directories.

```bash
/cwd
# Shows: C:\projects\ai\copilot

/cd src\nlp
# Changes to the NLP module directory
```

**HENCKELS**  
*(sternly)*  
The CLI respects allowed directories. Use `/add-dir` to whitelist directories for file access.

```bash
/add-dir C:\projects\ai\copilot\data
```

**HENCKELS**  
Review allowed directories with `/list-dirs`.

**M. GUSTAVE**  
And should one wish to reset permissions?

**HENCKELS**  
`/reset-allowed-tools`, sir. Though I must advise caution.

---

### SCENE 5: THE CONTEXT WINDOW

*SERGE X. enters, carrying an antique magnifying glass.*

**SERGE X.**  
*(in a scholarly tone)*  
Gentlemen, we must discuss the context window—a matter of great importance.

**M. GUSTAVE**  
Serge! Our resident analyst. Please, enlighten us.

**SERGE X.**  
The `/context` command reveals token usage and provides visualization. Essential for understanding what the AI can perceive.

```bash
/context
```

*The terminal displays a beautifully formatted bar chart showing token consumption.*

**SERGE X.**  
Observe: when the context grows unwieldy, one employs `/compact` to summarize the conversation history, reducing token usage while preserving essential information.

**ZERO**  
How do we include specific files in context?

**M. GUSTAVE**  
*(smiling)*  
The @ symbol, dear boy. Watch:

```bash
@src/nlp/tokenizer.py Explain this module
```

**M. GUSTAVE**  
The @ mentions a file and includes its contents in the context. One may mention multiple files.

---

### SCENE 6: THE SESSION MANAGEMENT SUITE

*The scene transforms into an elegant sitting room with burgundy wallpaper.*

**M. GUSTAVE**  
Every interaction within The Grand Budapest Terminal occurs within a session—a conversation with persistent memory.

**M. GUSTAVE**  
*(typing)*

```bash
/session
```

*The terminal displays session information, workspace summary, and file tree.*

**M. GUSTAVE**  
The `/session` command offers several subcommands of note:

- `/session checkpoints` - View saved checkpoints in history
- `/session files` - List files in session workspace
- `/session plan` - View the current implementation plan
- `/session rename <name>` - Bestow a proper name upon your session

**ZERO**  
And if we wish to switch between sessions?

**M. GUSTAVE**  
`/resume` followed optionally by a session ID. Without an ID, it presents a menu of available sessions.

```bash
/resume
```

**LUDWIG**  
*(consulting his notes)*  
One might also use `/new` or `/clear` to begin afresh, though previous history is lost.

---

## ACT III: THE ADVANCED FEATURES

### SCENE 7: THE MODEL SELECTION PARLOR

*A room decorated with portraits of various AI models in gilded frames.*

**M. GUSTAVE**  
Not all tasks require the same... sophistication of reasoning. Thus, we may select our model.

```bash
/model
```

*A menu appears listing available models.*

**M. GUSTAVE**  
By default, we employ Claude Sonnet 4.5—a model of refined taste. However, one might prefer:

- **Claude Opus 4.5** - For the most demanding tasks
- **Claude Haiku 4.5** - For swift, economical responses
- **GPT-5 variants** - For those who prefer the OpenAI aesthetic

**SERGE X.**  
Each model has distinct characteristics. I recommend benchmarking for your specific use case.

---

### SCENE 8: THE AGENT DELEGATION CHAMBER

*DMITRI bursts through the door, scowling.*

**DMITRI**  
*(aggressively)*  
Enough pleasantries! What about the `/agent` command? I wish to delegate to specialists!

**M. GUSTAVE**  
*(unruffled)*  
Ah, Dmitri. Always so direct. Very well.

```bash
/agent
```

**M. GUSTAVE**  
This command browses available custom agents—such as yourself, dear Dmitri—each with specialized capabilities.

**DMITRI**  
Finally! I can focus on breaking things properly!

**AGATHA**  
*(to Zero)*  
Custom agents are defined in `.github/agents/*.agent.md` files. Each specifies tools, personality, and specialization.

---

### SCENE 9: THE PLANNING ROOM

*A drafting table covered with architectural blueprints appears.*

**M. GUSTAVE**  
Before embarking on complex modifications, a gentleman plans.

```bash
/plan Implement sentiment analysis pipeline
```

**M. GUSTAVE**  
The `/plan` command—when prefixed to your prompt—instructs the AI to create a structured implementation plan before coding. It analyzes the codebase, asks clarifying questions, and produces a markdown plan in your session workspace.

**HENCKELS**  
*(approvingly)*  
Proper planning prevents poor performance.

**M. GUSTAVE**  
Quite. The plan includes:
- Problem statement
- Approach
- Workplan with checkboxes
- Notes and considerations

**ZERO**  
And once the plan is approved?

**M. GUSTAVE**  
One simply instructs the AI to proceed. It will reference the plan and execute accordingly.

---

### SCENE 10: THE CODE REVIEW SALON

*A mahogany-paneled room with a fireplace. HENCKELS stands at attention.*

**HENCKELS**  
Before any code reaches production, it must pass review.

```bash
/review Check for security vulnerabilities
```

**HENCKELS**  
The `/review` command invokes a specialized code review agent. It analyzes staged or unstaged changes and surfaces genuine issues: bugs, security vulnerabilities, logic errors.

**M. GUSTAVE**  
*(approvingly)*  
Note that it does *not* comment on style or formatting trivialities. Only matters of substance.

**DMITRI**  
*(grudgingly)*  
Even I must admit—useful for finding what I might exploit.

---

### SCENE 11: THE DIFF VISUALIZATION GALLERY

*Walls covered with before-and-after artwork.*

**M. GUSTAVE**  
To observe one's modifications:

```bash
/diff
```

*The terminal displays a beautifully formatted diff with changes highlighted in complementary colors.*

**M. GUSTAVE**  
All changes made in the current directory, presented with clarity and elegance.

**AGATHA**  
I use this constantly when validating data transformations.

---

### SCENE 12: THE DELEGATION BUREAU

**M. GUSTAVE**  
When working on a remote repository, one may delegate an entire task:

```bash
/delegate Add structured and efficient logging to the NLP pipeline
```

**M. GUSTAVE**  
The AI will make changes and generate a pull request with an AI-authored description. Collaboration made effortless.

**HENCKELS**  
*(cautiously)*  
Though one must still review the PR, of course.

**M. GUSTAVE**  
Naturally.

---

### SCENE 13: THE SKILLS LIBRARY

*A grand library with floor-to-ceiling bookshelves.*

**LUDWIG**  
*(reverently)*  
The `/skills` command manages enhanced capabilities.

```bash
/skills list          # View available skills
/skills info <name>   # Details about a specific skill
/skills add <path>    # Add a new skill
/skills remove <name> # Remove a skill
/skills reload        # Refresh skill definitions
```

**LUDWIG**  
Skills are defined in `.github/copilot/skills/*.md` and provide domain knowledge—teaching the AI about your project's patterns, conventions, and specialized tasks.

**M. GUSTAVE**  
Think of them as... finishing school for the AI.

---

### SCENE 14: THE MCP INTEGRATION LABORATORY

*A room filled with brass tubes, pneumatic systems, and Victorian-era "computers."*

**SERGE X.**  
The Model Context Protocol—MCP—extends the CLI's capabilities beyond imagination.

```bash
/mcp show                    # Display configured servers
/mcp add <name>              # Add new MCP server
/mcp edit <name>             # Modify server configuration
/mcp disable <name>          # Temporarily disable
/mcp enable <name>           # Re-enable server
/mcp delete <name>           # Remove entirely
```

**SERGE X.**  
GitHub's MCP server is enabled by default, providing repository and issue access. Custom servers can add database access, API integrations, specialized tools...

**DMITRI**  
*(interested despite himself)*  
Intriguing. I could add a server to test API endpoints.

---

### SCENE 15: THE SHARING CEREMONY

*AGATHA arranges documents on a silver platter.*

**AGATHA**  
When you've had a productive session, you may wish to preserve or share it:

```bash
/share file session-notes.md    # Save to local markdown
/share gist                      # Upload to GitHub Gist
/share gist path/to/notes.md    # Save and upload
```

**AGATHA**  
Perfect for documentation or sharing solutions with colleagues.

---

### SCENE 16: THE FEEDBACK & USAGE SUITE

**M. GUSTAVE**  
As responsible citizens of The Terminal, we provide feedback:

```bash
/feedback
```

**M. GUSTAVE**  
This opens a confidential survey. Your insights shape future improvements.

**SERGE X.**  
And to monitor consumption:

```bash
/usage
```

**SERGE X.**  
Displays session usage metrics—premium requests consumed, tokens used, operations performed.

---

### SCENE 17: THE THEME CUSTOMIZATION ATELIER

*A room with fabric swatches and paint samples arranged by color theory.*

**M. GUSTAVE**  
Even aesthetics matter, Zero.

```bash
/theme show              # Display current theme
/theme list              # Show available themes
/theme set dark          # Apply dark theme
/theme set light         # Apply light theme
/theme set auto          # Auto-adjust based on system
```

**M. GUSTAVE**  
We must work in comfort and beauty.

---

### SCENE 18: THE IDE CONNECTION BRIDGE

**ZERO**  
What about connecting to Visual Studio Code, sir?

**M. GUSTAVE**  
Astute question!

```bash
/ide
```

**M. GUSTAVE**  
This connects the CLI to your IDE workspace—a bridge between terminal and editor.

---

### SCENE 19: THE TERMINAL CONFIGURATION WORKSHOP

**HENCKELS**  
For multiline input support:

```bash
/terminal-setup
```

**HENCKELS**  
This configures your terminal to recognize Shift+Enter and Ctrl+Enter for multiline editing. Essential for complex prompts.

---

### SCENE 20: THE USER MANAGEMENT OFFICE

**LUDWIG**  
If you work with multiple GitHub accounts:

```bash
/user show               # Display current user
/user list               # Show all configured users
/user switch             # Switch between accounts
```

**LUDWIG**  
Useful for separating personal and professional work.

---

## ACT IV: THE GRAND FINALE

### SCENE 21: THE INSTRUCTION HIERARCHY

*All characters gather in the grand ballroom.*

**M. GUSTAVE**  
*(addressing the assembled group)*  
Before we conclude, let us review the instruction hierarchy—how the AI learns your preferences and project conventions.

**M. GUSTAVE**  
The CLI respects instructions from multiple locations, in order of specificity:

**LUDWIG**  
*(reading from a scroll)*

1. **Model-specific files** in git root or cwd:
   - `CLAUDE.md`
   - `GEMINI.md`

2. **Agent definitions**:
   - `AGENTS.md` in git root or cwd

3. **GitHub Copilot instructions**:
   - `.github/instructions/**/*.instructions.md`
   - `.github/copilot-instructions.md`

4. **User-level instructions**:
   - `$HOME/.copilot/copilot-instructions.md`

5. **Custom directories**:
   - `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` environment variable

**AGATHA**  
This allows project-wide standards, team conventions, and personal preferences to coexist harmoniously.

---

### SCENE 22: THE FAREWELL

*The characters stand in a perfectly symmetrical formation.*

**M. GUSTAVE**  
And so, dear Zero, you have completed your orientation to The Grand Budapest Terminal.

**ZERO**  
Thank you, Monsieur Gustave. I feel... prepared.

**M. GUSTAVE**  
Remember: when in doubt, `/help`. The terminal is your ally, the AI your collaborator. Together, you shall create magnificent code.

**ALL CHARACTERS**  
*(in unison)*  
Welcome to The Grand Budapest Terminal!

*The characters bow in unison as the terminal displays:*

```
Session saved. May your code compile and your tests pass.
Press Ctrl+D to exit, or continue with your next prompt.
```

*FADE TO PASTELS*

---

## APPENDIX: QUICK COMMAND REFERENCE

### Essential Commands
- `copilot` - Launch the CLI
- `/help` - Display help information
- `/login` - Authenticate with GitHub
- `/logout` - Sign out

### Navigation & Context
- `/cwd [dir]` - Show or change directory
- `/context` - View token usage
- `@file.py` - Mention file in context
- `/compact` - Summarize conversation

### Session Management
- `/session` - View session info
- `/resume [id]` - Switch sessions
- `/clear` - Start new session
- `/rename <name>` - Rename session

### Advanced Features
- `/plan [prompt]` - Create implementation plan
- `/review [prompt]` - Run code review
- `/diff` - Show changes
- `/agent` - Browse custom agents
- `/model` - Select AI model
- `/delegate [prompt]` - Create PR with changes

### Configuration
- `/skills` - Manage skills
- `/mcp` - Configure MCP servers
- `/theme` - Customize appearance
- `/add-dir` - Whitelist directory

### Sharing & Feedback
- `/share` - Export session
- `/feedback` - Submit feedback
- `/usage` - View metrics

---

**THE END**

*A Wes Anderson Production*  
*Screenplay by The Grand Budapest Terminal Ensemble*  
*Featuring GitHub Copilot CLI v0.0.396*

---

## Production Notes

**Prompts Used:**
- "Describe how to leverage the zero agent in copilot cli" (Initial request)
- "Create agent personas for each of the major actors to help with tasks in the style of the movie" (Expansion)
- "Create a new scene using all these agent personas, developing a screenplay" (Creative direction)
- "How to use the /help feature and each feature within github copilot cli, written in the style and 3rd person view of the screenplay as markdown" (Final specification)

**Character Specializations:**
- **M. Gustave**: Code quality, documentation, architecture
- **Zero**: General assistance, execution
- **Agatha**: Data preparation, testing
- **Dmitri**: Security testing, adversarial testing
- **Henckels**: Compliance, standards, CI/CD
- **Ludwig**: Validation, type checking
- **Serge X.**: Performance analysis, benchmarking

**Core Themes:**
- Elegance meets functionality
- Period aesthetic expressing modern technology
- Collaborative AI assistance
- Precision and attention to detail
