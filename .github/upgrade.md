---
title: Agent Tooling Upgrade Notes
upgrade_checklist:
	- Check VS Code agent tool names and update agent tool lists.
	- Refresh model IDs from copilot_models_*.txt and VS Code model picker.
	- Review agent instructions for new tools, limits, and behaviors.
	- Re-run agent smoke tests in VS Code after changes.
links:
	vscode_release_notes: "https://code.visualstudio.com/updates"
	copilot_release_notes: "https://code.visualstudio.com/docs/copilot/copilot-release-notes"
	claude_release_notes: "https://docs.anthropic.com/en/release-notes"
---

# Agent Tooling Upgrade Notes

This document summarizes tool name changes and a plan to update agent tool lists, based on the VS Code Copilot agent tools reference and the current Zero agent configuration.

## Findings (Zero Agent)

Current tools in [zero.agent.md](.github/agents/zero.agent.md) include several names that do not map to the VS Code agent tools list:

- `shell` should be updated to the supported terminal execution tool name `execute`.
- `read`, `search`, and `edit` should be replaced with their current tool names.
- `task`, `skill`, `web/fetch`, `web_fetch`, and `ask_user` are not valid tool names in the reference list.
- `web/fetch` and `web_fetch` are duplicates; use a single supported fetch tool name.

Model value `claude-haiku-4.5` appears in the agent, but model availability depends on your VS Code Copilot configuration. Validate that the model name is supported in your environment.  As of `Feb, 2026` the reference lists `Claude Haiku 4.5 (copilot)` as a supported model name, so update to that format if using this model.

## Suggested Tool Mapping (Reference)

Update the tools list to match the official tool names from the VS Code Copilot agent tools reference:

- Terminal execution: replace `shell` with the reference tool name for terminal commands.
- File reads: replace `read` with the reference tool name for reading files.
- Searches: replace `search` with the reference tool names for codebase, text, and file searches.
- File edits: replace `edit` with the reference tool name for editing files.
- Tasks: replace `task` with the reference tool name(s) for creating or running tasks.
- Web fetch: replace `web/fetch` and `web_fetch` with the reference fetch tool name.
- Remove tools that are not part of the VS Code agent tools list: `skill`, `ask_user`.

## Upgrade Plan

1. Audit each agent file under [./.github/agents/](.github/agents/).
2. Replace legacy tool names with the current VS Code tool names.
3. Remove invalid tools that are not in the reference list.
4. Add any missing tools that the agent should use (e.g., problems, changes, usages, testFailure), based on its role.
5. Validate model names against the configured models in your environment.
6. Run a quick smoke test by invoking each agent and confirming its tools resolve without warnings.

## Source

- https://code.visualstudio.com/docs/copilot/agents/agent-tools
