# Implementation Plan: Modern Python 3.12+ Typing & Cross-Platform Agentic Tools

> **Project:** Grand Budapest Terminal  
> **Created:** 2026-01-29  
> **Status:** Planning

---

## Overview

This plan covers two major initiatives:

1. **Modernize Python typing** across the entire project to use Python 3.12+ syntax
2. **Create cross-platform agentic shell tools** using Rust-based modern alternatives with tutorials

---

## Phase 1: Python 3.12+ Typing Modernization

### Objectives
- Update all Python code to use modern built-in generic types (`list[]`, `dict[]`, etc.)
- Replace old `typing` module imports (`List`, `Dict`, `Optional`, `Union`)
- Update type checker configuration for Python 3.12
- Ensure WASM playground code follows modern standards

### Tasks

#### 1.1 Update Project Configuration
- [ ] Update `pyproject.toml` - set `requires-python = ">=3.12"`
- [ ] Update `target-version = "py312"` in ruff configuration
- [ ] Update `python_version = "3.12"` in ty/mypy configuration
- [ ] Update `.python-version` file to `3.12`
- [ ] Update WASM example `pyproject.toml` to Python 3.12

#### 1.2 Update Type Annotations in WASM Code
- [ ] `examples/wasm/src/python/ast_analyzer.py` - convert all typing imports
  - [ ] Replace `Dict[str, Any]` → `dict[str, str]`
  - [ ] Replace `List[str]` → `list[str]`
  - [ ] Replace `Optional[ast.AST]` → `ast.AST | None`
- [ ] `examples/wasm/src/python/security_scanner.py` - convert typing
- [ ] Run ruff check and fix on WASM code
- [ ] Run ty check to validate types

#### 1.3 Update Type Annotations Across Project
- [ ] Search for all files using old typing syntax: `from typing import Dict, List, Optional, Union`
- [ ] Update `src/` directory Python files
- [ ] Update `tests/` directory Python files
- [ ] Update `examples/` directory Python files
- [ ] Update `main.py` if needed

#### 1.4 Testing & Validation
- [ ] Run `ruff format .` to format all code
- [ ] Run `ruff check --fix .` to auto-fix issues
- [ ] Run `ty check src/` for type validation
- [ ] Run `pytest` to ensure tests pass
- [ ] Test WASM playground locally

#### 1.5 Update Documentation
- [ ] Update `.instructions.md` if needed (already mentions 3.11+, update to 3.12+)
- [ ] Update README.md Python version badges (3.12+)
- [ ] Add migration notes to IMPLEMENTATION-PLAN.md

---

## Phase 2: Cross-Platform Agentic Shell Tools

### Objectives
- Create Python wrappers for common Unix/bash commands
- Use modern Rust-based alternatives (ripgrep, fd, bat, etc.)
- Support both Windows PowerShell and Linux/macOS
- Provide educational tutorials with Linux Foundation and Red Hat materials

### Tasks

#### 2.1 Research & Design
- [ ] Document Rust-based modern alternatives
  - [ ] `ripgrep` (rg) - faster grep
  - [ ] `fd` - faster find
  - [ ] `bat` - cat with syntax highlighting
  - [ ] `exa`/`eza` - modern ls
  - [ ] `dust` - modern du
  - [ ] `sd` - modern sed
  - [ ] `delta` - better diff
  - [ ] `zoxide` - smarter cd
  - [ ] `procs` - modern ps/top
  - [ ] `bottom` (btm) - modern top
  - [ ] `tokei` - fast code counter
- [ ] Design cross-platform abstraction layer
- [ ] Plan fallback to native commands when Rust tools unavailable

#### 2.2 Create Core Agentic Tool Library
- [ ] Create `src/tools/` directory structure
  - [ ] `src/tools/__init__.py`
  - [ ] `src/tools/search.py` (grep/ripgrep wrapper)
  - [ ] `src/tools/files.py` (find/fd, cat/bat, ls/eza)
  - [ ] `src/tools/text.py` (sed/sd, awk alternatives)
  - [ ] `src/tools/process.py` (ps/procs, top/bottom)
  - [ ] `src/tools/stream.py` (tail, head, watch)
  - [ ] `src/tools/scheduler.py` (cron-like functionality)
  - [ ] `src/tools/terminal.py` (tmux-like session management)
  - [ ] `src/tools/platform.py` (platform detection utilities)

#### 2.3 Implement Individual Tool Wrappers

**Search Tools:**
- [ ] `grep()` - wrapper for ripgrep with fallback to native grep
- [ ] `find()` - wrapper for fd with fallback to native find
- [ ] Add type hints (Python 3.12+ syntax)
- [ ] Add docstrings with examples
- [ ] Cross-platform path handling

**File Tools:**
- [ ] `cat()` - wrapper for bat with fallback
- [ ] `ls()` - wrapper for eza with fallback
- [ ] `head()` - read first N lines
- [ ] `tail()` - read last N lines, follow mode
- [ ] `wc()` - word/line/char count

**Text Processing:**
- [ ] `sed()` - wrapper for sd or native sed
- [ ] `awk()` - Python-based alternative or native awk
- [ ] `cut()` - column extraction
- [ ] `sort()` - sorting utility
- [ ] `uniq()` - unique line filter

**Process Management:**
- [ ] `ps()` - wrapper for procs with fallback
- [ ] `top()` - wrapper for bottom/btm with fallback
- [ ] `kill()` - cross-platform process termination
- [ ] `jobs()` - background job management

**Scheduling & Background:**
- [ ] `cron()` - simple cron-like scheduler
- [ ] `background()` - run commands in background
- [ ] `watch()` - repeatedly execute command

**Terminal Session:**
- [ ] `session_create()` - create named session
- [ ] `session_attach()` - attach to session
- [ ] `session_list()` - list sessions
- [ ] Simple tmux-like session management

#### 2.4 Testing
- [ ] Create `tests/tools/` directory
- [ ] Write tests for each tool wrapper
- [ ] Test on Windows PowerShell
- [ ] Test on Linux (if available via WSL/CI)
- [ ] Test on macOS (if available via CI)
- [ ] Mock tests for unavailable platforms
- [ ] Add integration tests

#### 2.5 Documentation & Tutorials
- [ ] Create `tutorials/modern-cli-tools.md` tutorial
  - [ ] Introduction to Rust-based CLI tools
  - [ ] Installation guide (cargo, package managers)
  - [ ] Comparison with traditional Unix tools
  - [ ] Performance benchmarks
  - [ ] Links to Linux Foundation courses
  - [ ] Links to Red Hat documentation
  - [ ] Links to Rust CLI working group
- [ ] Create `tutorials/ripgrep-fd-guide.md` deep dive
  - [ ] ripgrep (rg) usage and patterns
  - [ ] fd usage and examples
  - [ ] Integration with other tools
  - [ ] Performance tips
- [ ] Create `tutorials/agentic-tools-api.md` API reference
  - [ ] Python API documentation
  - [ ] Code examples
  - [ ] Cross-platform considerations
  - [ ] Best practices
- [ ] Update README.md with tools section
- [ ] Add external resource links:
  - [ ] Linux Foundation: Introduction to Linux (LFS101)
  - [ ] Linux Foundation: Linux Tools for Developers (LFD109)
  - [ ] Red Hat: RHEL documentation
  - [ ] Rust CLI Working Group
  - [ ] uutils/coreutils (Rust reimplementation)

---

## Phase 3: Local Testing Infrastructure

### Objectives
- Create justfile for consistent test/build/lint commands
- Add PowerShell scripts for Windows-native workflows
- Configure CI/CD for WASM playground

### Tasks

#### 3.1 Create Justfile
- [ ] Create `justfile` at project root
- [ ] Add recipe: `test` - run pytest
- [ ] Add recipe: `test-wasm` - run WASM playground tests
- [ ] Add recipe: `lint` - run ruff check
- [ ] Add recipe: `lint-fix` - run ruff check --fix
- [ ] Add recipe: `format` - run ruff format
- [ ] Add recipe: `typecheck` - run ty check
- [ ] Add recipe: `wasm-build` - build WASM playground
- [ ] Add recipe: `wasm-serve` - serve WASM playground locally
- [ ] Add recipe: `install-tools` - install Rust-based CLI tools
- [ ] Add recipe: `check-all` - format + lint + typecheck + test
- [ ] Add recipe: `dev-setup` - setup development environment

#### 3.2 Create PowerShell Scripts
- [ ] Create `scripts/` directory
- [ ] Create `scripts/Test-Wasm.ps1` - test WASM playground
- [ ] Create `scripts/Install-Tools.ps1` - install Rust CLI tools on Windows
- [ ] Create `scripts/Build-Wasm.ps1` - build WASM playground
- [ ] Create `scripts/Serve-Wasm.ps1` - serve WASM playground with live reload
- [ ] Add execution policy notes to README

#### 3.3 CI/CD Updates
- [ ] Update `.github/workflows/test-wasm-playground.yml`
  - [ ] Use Python 3.12
  - [ ] Install Rust CLI tools in CI
  - [ ] Run justfile recipes
- [ ] Update `.github/workflows/deploy-wasm-playground.yml`
  - [ ] Use Python 3.12
  - [ ] Build with modern typing
- [ ] Add workflow for testing tools library

---

## Phase 4: Integration & Polish

### Tasks

#### 4.1 Update Documentation
- [ ] Update main README.md
  - [ ] Add "Agentic Shell Tools" section
  - [ ] Add justfile usage examples
  - [ ] Update Python version requirements
- [ ] Update DEPENDENCIES.md with new tool dependencies
- [ ] Update ROADMAP.md with completed items

#### 4.2 Code Quality
- [ ] Run final `ruff format` on all code
- [ ] Run final `ruff check --fix` on all code
- [ ] Run final `ty check` on all code
- [ ] Ensure 80%+ test coverage
- [ ] Update prek.toml if needed

#### 4.3 Final Validation
- [ ] Test all justfile recipes
- [ ] Test PowerShell scripts on Windows
- [ ] Run full test suite
- [ ] Build WASM playground successfully
- [ ] Verify GitHub Actions workflows pass
- [ ] Manual testing of tool wrappers

---

## Success Criteria

### Phase 1 (Python 3.12+ Typing)
- ✅ Zero old-style typing imports (`from typing import Dict, List, ...`)
- ✅ All code uses modern syntax (`dict[]`, `list[]`, `|` for unions)
- ✅ `ty check src/` passes with no errors
- ✅ `ruff check` passes with no errors
- ✅ All tests pass

### Phase 2 (Agentic Tools)
- ✅ At least 10 core tool wrappers implemented
- ✅ Cross-platform support (Windows/Linux/macOS)
- ✅ Tutorials with external links
- ✅ 80%+ test coverage for tools
- ✅ API documentation complete

### Phase 3 (Local Testing)
- ✅ Justfile with 10+ useful recipes
- ✅ PowerShell scripts for Windows workflows
- ✅ CI/CD updated and passing
- ✅ Local development workflow documented

### Phase 4 (Integration)
- ✅ All documentation updated
- ✅ Code quality checks pass
- ✅ WASM playground builds and deploys
- ✅ Tools library usable by agents

---

## External Resources to Include

### Linux Foundation Courses
- [Introduction to Linux (LFS101)](https://training.linuxfoundation.org/training/introduction-to-linux/)
- [Linux Tools for Developers (LFD109)](https://training.linuxfoundation.org/training/linux-tools-for-developers/)
- [Open Source Software Development, Linux and Git (LFD201)](https://training.linuxfoundation.org/training/open-source-software-development-linux-and-git/)

### Red Hat Resources
- [Red Hat Enterprise Linux Documentation](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/)
- [Red Hat System Administration Guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/)

### Rust-based Modern Tools
- [ripgrep](https://github.com/BurntSushi/ripgrep) - Fast line-oriented search
- [fd](https://github.com/sharkdp/fd) - Fast alternative to find
- [bat](https://github.com/sharkdp/bat) - Cat clone with syntax highlighting
- [exa/eza](https://github.com/eza-community/eza) - Modern ls replacement
- [sd](https://github.com/chmln/sd) - Intuitive sed alternative
- [delta](https://github.com/dandavison/delta) - Better git diff
- [bottom](https://github.com/ClementTsang/bottom) - Graphical process monitor
- [procs](https://github.com/dalance/procs) - Modern ps replacement
- [dust](https://github.com/bootandy/dust) - More intuitive du
- [tokei](https://github.com/XAMPPRocky/tokei) - Fast code statistics
- [uutils/coreutils](https://github.com/uutils/coreutils) - Rust GNU coreutils

### Additional Resources
- [Rust CLI Working Group](https://github.com/rust-cli)
- [Command Line Interface Guidelines](https://clig.dev/)
- [Modern Unix Tools](https://github.com/ibraheemdev/modern-unix)

---

## Notes & Considerations

### Python 3.12 Typing Migration
- Modern syntax is cleaner and more readable
- No runtime performance difference
- Type checkers fully support new syntax
- Easier for LLMs to understand and generate

### Cross-Platform Tool Design
- Use `shutil.which()` to detect available tools
- Graceful fallback to native commands
- Platform detection via `sys.platform`
- Path handling with `pathlib.Path`
- Subprocess handling with `asyncio.subprocess`

### Rust Tool Installation
- Most available via `cargo install`
- Many available via package managers (apt, brew, choco, scoop)
- Consider vendoring binaries for critical tools
- Document installation in tutorials

### Agentic Use Cases
- AI agents can use these tools for code analysis
- Cross-platform compatibility important for diverse environments
- Type hints help LLMs generate correct code
- Consistent API simplifies agent development

---

**Plan created:** 2026-01-29  
**Next step:** Review plan, then ask user to confirm before starting implementation
