---
title: ".NET App Modernization: 4.5 to .NET 11"
subtitle: "A Tutorial from The Grand Budapest Terminal"
agents: ["Henckels", "M. Gustave", "Ludwig", "Zero", "Dmitri", "Agatha"]
difficulty: "Advanced"
duration: "75 minutes"
---

# ACT I: THE LEGACY WING

*Scene: Henckels presents a migration dossier.*

**HENCKELS:** We will stub a sample modernization workspace and document the staged workflow: assessment, planning, execution. The goal is to upgrade a .NET Framework 4.5 app to .NET 11 with clear checkpoints and human oversight.

Docs: https://learn.microsoft.com/en-us/dotnet/core/porting/github-copilot-app-modernization/overview

## Folder stub

This tutorial uses a sample folder with a staged plan and working notes:

```
examples/dotnet/app-modernization-45-to-11/
```

---

# ACT II: THE MODERNIZATION WORKFLOW

*Scene: Henckels pins the three stages to the corkboard.*

The app modernization agent writes Markdown artifacts as it progresses:

- Assessment: `.github/upgrades/assessment.md` with compatibility findings.
- Planning: `.github/upgrades/plan.md` with upgrade steps.
- Execution: `.github/upgrades/tasks.md` with validation checkpoints.

These files are editable. If you steer the work, the agent uses your edits.

## Stage 1: Assessment

Goals:
- Identify runtime and API gaps from .NET Framework 4.5 to .NET 11.
- Note third-party packages that block upgrade.
- Decide if the app needs a multi-step target (4.5 -> 4.8 -> .NET 11).

Artifacts:
- `assessment.md` includes a compatibility summary and risks.

## Stage 2: Planning

Goals:
- Convert findings to upgrade steps with clear owners.
- Decide on target frameworks, build tooling, and test scope.
- Capture any manual refactors before automated fixes.

Artifacts:
- `plan.md` lists steps and success checks.

## Stage 3: Execution

Goals:
- Convert the plan into tasks with validation and rollback notes.
- Track what changed, what was validated, and what remains.

Artifacts:
- `tasks.md` lists tasks, commands, and checkpoints.

---

# ACT III: GROUNDING AND HUMAN-IN-THE-LOOP

*Scene: Zero distributes checklists for state and feedback.*

Use extra grounding files to preserve decisions and improve agent accuracy.

Suggested files in the stub folder:

- `grounding/memory.md`: stable facts, conventions, and constraints.
- `grounding/state.md`: in-progress decisions, open questions.
- `grounding/telemetry.md`: trace IDs or build outputs you want to keep.
- `grounding/debug-log.md`: command logs or failures with timestamps.
- `grounding/human-feedback.md`: reviewer notes and steering cues.
- `grounding/steering.md`: preferred sequencing or banned changes.

Guidance:
- Keep memory short and updated.
- Put risk decisions in writing so the agent can follow them.
- Record test results that justify a step as complete.

---

# ACT IV: TOOLING NOTES (COPILOT CLI)

*Scene: Ludwig explains CLI agent control.*

GitHub Copilot CLI can guide a modernization run from the terminal and keeps a running context. It supports interactive and programmatic usage, plus plan mode and tool approvals.

Docs: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli

Examples:

```bash
copilot
```

Plan mode lets Copilot draft a plan before it changes files. Use `/context` and `/compact` to manage session state. Use `--allow-tool` or `--deny-tool` to restrict operations.

---

# ACT V: OPTIONAL TOOLING (CLAUDE CLI, GEMINI CLI)

*Scene: Dmitri requests exact vendor docs before enabling tools.*

Add CLI tooling only after you validate official vendor docs and compliance policies. If your team uses Claude or Gemini CLIs, add verified links and approved usage patterns here.

Placeholders (add verified URLs):
- Claude CLI docs: <ADD OFFICIAL DOC URL>
- Gemini CLI docs: <ADD OFFICIAL DOC URL>

---

# ACT VI: SAMPLE RUNBOOK (4.5 TO .NET 11)

*Scene: Henckels delivers a structured runbook.*

1. Lock a baseline: run existing tests, capture results in `grounding/telemetry.md`.
2. Run assessment and review `assessment.md` for blocking issues.
3. Update `plan.md` with target frameworks and refactor steps.
4. Convert plan items into task entries with commands in `tasks.md`.
5. Validate each task with build and tests, then record outputs.

---

# EPILOGUE: EXIT REVIEW

**HENCKELS:** No upgrade is complete without validation evidence and a review pass. Keep changes scoped, write down decisions, and gate each step with tests.

## Reference links

- App modernization agent: https://learn.microsoft.com/en-us/dotnet/core/porting/github-copilot-app-modernization/overview
- Copilot CLI: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli
