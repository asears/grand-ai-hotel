# Sample Python Code for Verification

This directory contains sample Python code used to demonstrate The Grand Budapest Terminal verification suite.

## Files

### auth.py (Clean Code)
Well-documented authentication module with:
- ✓ Type hints
- ✓ Docstrings
- ✓ Secure password hashing
- ✓ Input validation

**Purpose**: Demonstrates code that passes verification.

### insecure_db.py (Intentionally Vulnerable)
Database operations module with **intentional security issues**:
- ✗ Hardcoded credentials
- ✗ SQL injection vulnerability
- ✗ Unsafe eval usage
- ✗ Path traversal risk
- ✗ Unvalidated redirects
- ✗ Missing docstrings
- ✗ Non-standard naming (CamelCase function)

**Purpose**: Demonstrates Dmitri's security analysis capabilities.

**⚠️ WARNING**: Never use patterns from `insecure_db.py` in production code!

## Running Verification

From the `examples/clojure` directory:

```bash
# Verify clean code
clj -M:verify --python sample-python/auth.py

# Verify vulnerable code (will show security issues)
clj -M:verify --python sample-python/insecure_db.py

# Quick security check
clj -M:verify --quick --python sample-python/
```

## Expected Results

### auth.py
- ✓ **Specification**: Valid
- ✓ **Verification**: Passed
- ✓ **Security**: No vulnerabilities
- ⚠️ **Standards**: Minor issues (if any)

### insecure_db.py
- ✗ **Security**: CRITICAL issues detected
  - Hardcoded API key (severity: CRITICAL)
  - SQL injection pattern (severity: HIGH)
  - Unsafe eval (severity: CRITICAL)
  - Path traversal (severity: HIGH)
- ✗ **Standards**: Multiple violations
  - Missing docstrings
  - CamelCase function name

## Learning Objectives

1. Understand what secure code looks like (auth.py)
2. Recognize common vulnerabilities (insecure_db.py)
3. See functional verification in action
4. Learn how agents collaborate to ensure quality
