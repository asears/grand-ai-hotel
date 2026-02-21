# Copilot CLI Slash Commands Field Guide

*Scene: The lobby desk. Brass keys, crisp stationery, and a terminal awaiting a command.*

This tutorial turns the most useful Copilot Chat slash commands into a practical flow you can use from the Copilot CLI. The commands are the same shortcuts you see in VS Code Copilot Chat, presented here with CLI-friendly examples and a simple routine.

## Quick Start

1. Open a terminal in the repo.
2. Launch Copilot CLI: `copilot`.
3. Start a chat session and type a slash command, like `/tests`, followed by a short request.

Example:

```
/tests Add unit tests for the email validator in src/utils/email.py
```

## The 10 Commands You Will Use Daily

Below are the most practical commands, adapted from the common VS Code Copilot Chat set and tuned for CLI usage.

### 1) /tests — Generate unit tests

Use when you finished a function and want coverage fast.

```
/tests Write tests for parse_invoice in src/billing/invoice.py using pytest
```

### 2) /fix — Debug and patch

Use when you have an error, stack trace, or failing test.

```
/fix Tests are failing with AttributeError: 'NoneType' on line 88 in src/auth/session.py
```

### 3) /explain — Walk through code

Use to understand a block or a file you just opened.

```
/explain Explain the logic in src/nlp/tokenizer.py and call out edge cases
```

### 4) /doc — Add documentation

Use to add docstrings or README snippets.

```
/doc Add docstrings for public functions in src/utils/date_utils.py
```

### 5) /refactor — Improve structure

Use to shorten, rename, or clarify a function without changing behavior.

```
/refactor Simplify extract_entities in src/nlp/ner.py while keeping output the same
```

### 6) /add — Implement a feature

Use when you want Copilot to draft a new helper or integration.

```
/add Add a CLI option --dry-run to main.py and update usage text
```

### 7) /optimize — Improve speed

Use to target slow loops, expensive calls, or heavy parsing.

```
/optimize Find hot spots in src/data/merge.py and suggest improvements
```

### 8) /new — Scaffold

Use to create a new file, module, or skeleton.

```
/new Create a new module src/utils/retry.py with a backoff helper
```

### 9) /terminal — Shell command help

Use when you need a command or a fix for a terminal error.

```
/terminal Show a command to find large files over 100 MB in this repo
```

### 10) /github — Repo and PR help

Use for review notes, changelogs, or issue triage.

```
/github Draft a PR summary for the changes in this branch
```

## A Simple Daily Routine

1. Use `/explain` on unfamiliar code.
2. Use `/refactor` for clarity.
3. Use `/tests` to lock behavior.
4. Use `/fix` when something breaks.

## Tips That Keep Outputs Useful

- Keep requests short and precise.
- Include file paths to reduce guesswork.
- Paste errors or failing test output into `/fix`.
- Ask for a single change at a time.

## Source and Further Reading

This guide is informed by Shrinivass AB's Medium post on slash commands and the official Copilot cheat sheets.

- https://medium.com/@shrinivassab/top-10-github-copilot-slash-commands-every-vs-code-developer-must-know-in-2025-4f866360fdad
- https://docs.github.com/en/copilot/reference/cheat-sheet
- https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features
