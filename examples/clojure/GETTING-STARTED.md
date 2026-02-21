# Getting Started with Clojure Verification

*A detailed guide to running your first verification suite*

## Prerequisites

### Install Java (JDK 21)

```powershell
winget install --id=Oracle.JDK.21 -e
```

Or alternatives

https://winget.run/search?query=jdk

https://www.java.com/releases/


Verify installation:
```powershell
java --version
```

### Install Clojure CLI Tools

```powershell
winget install --id=Clojure.Clojure -e
```

Just kidding, you'll need to get this elsewhere, it's a mac and java friendly ecosystem.

https://clojure.org/guides/install_clojure

Verify installation:
```powershell
clj --version
```

## Quick Start: 5 Minutes to First Verification

### 1. Navigate to Project Directory

```powershell
cd c:\projects\ai\grand-ai-hotel\examples\clojure
```

### 2. Verify Dependencies

```powershell
clj -Stree
```

This downloads all dependencies and displays the dependency tree.

### 3. Run Your First Verification

**Full verification with all agents:**

```powershell
clj -M:verify --spec sample-requirements.md --python sample-python/auth.py
```

**Quick security and standards check:**

```powershell
clj -M:verify --spec sample-requirements.md --python sample-python/auth.py --quick
```

**Analyze vulnerable code:**

```powershell
clj -M:verify --python sample-python/insecure_db.py --quick
```

### 4. Explore Results

The verification suite will output:
- **Specification Validation**: Ludwig checks PRD completeness
- **Code Verification**: Agatha matches implementation to requirements
- **Security Analysis**: Dmitri identifies vulnerabilities
- **Performance Profiling**: Serge X. estimates complexity
- **Standards Compliance**: Henckels enforces coding standards

## Interactive Development: Using the REPL

### Start a REPL Session

```powershell
clj -M:repl
```

### Load Modules Interactively

```clojure
;; Load the orchestration conductor
(require '[orchestration.conductor :as conductor])

;; Load specific agent modules
(require '[security.analyzer :as security])
(require '[performance.profiler :as profiler])
(require '[specs.parser :as parser])

;; Parse a specification
(def spec (parser/parse-prd "sample-requirements.md"))

;; Inspect the parsed data
(:requirements spec)
(:constraints spec)

;; Run a quick security scan
(security/analyze-python-code (slurp "sample-python/auth.py"))

;; Profile performance characteristics
(profiler/profile-functions (slurp "sample-python/auth.py"))

;; Run full verification
(conductor/full-verification "sample-requirements.md" "sample-python/auth.py")
```

### Interactive Development Workflow

```clojure
;; 1. Parse your specification
(def spec (parser/parse-prd "sample-requirements.md"))

;; 2. Validate it
(require '[specs.validator :as validator])
(validator/validate spec)

;; 3. Verify implementation
(require '[verify.engine :as engine])
(engine/check-python-files ["sample-python/auth.py"] spec)

;; 4. Check security
(security/analyze-python-code (slurp "sample-python/auth.py"))

;; 5. Profile performance
(profiler/profile-functions (slurp "sample-python/auth.py"))

;; 6. Check standards compliance
(require '[standards.rules :as rules])
(rules/check-code (slurp "sample-python/auth.py"))
```

## Understanding the Output

### Successful Verification (auth.py)

```
=== SPECIFICATION VALIDATION (Ludwig) ===
✓ All requirements validated
✓ Constraints verified
✓ Data model complete

=== CODE VERIFICATION (Agatha) ===
✓ hash_password found and properly implemented
✓ verify_password found and properly implemented
✓ bcrypt imported
✓ Type hints present

=== SECURITY ANALYSIS (Dmitri) ===
✓ No critical vulnerabilities detected
✓ Threat score: 0

=== PERFORMANCE PROFILE (Serge X.) ===
✓ hash_password: O(1) - LOW RISK
✓ verify_password: O(1) - LOW RISK

=== STANDARDS COMPLIANCE (Henckels) ===
✓ Docstrings present
✓ Naming conventions followed
✓ Line length acceptable
```

### Failed Verification (insecure_db.py)

```
=== SECURITY ANALYSIS (Dmitri) ===
⚠ CRITICAL VULNERABILITIES DETECTED

Hardcoded Secrets (Line 3):
  API_KEY = "sk-1234567890abcdef"

SQL Injection (Line 15):
  query = f"SELECT * FROM users WHERE id = {user_id}"

Unsafe Eval (Line 23):
  eval(user_code)

Path Traversal (Line 31):
  open(f"data/{filename}")

THREAT SCORE: 95/100 - CRITICAL
```

## Common Workflows

### Workflow 1: Validate a New PRD

```powershell
# Parse and validate only
clj -e "(require '[specs.parser :as p] '[specs.validator :as v]) (-> \"your-spec.md\" p/parse-prd v/validate :valid?)"
```

### Workflow 2: Security Audit

```powershell
# Quick security scan
clj -M:verify --python src/**/*.py --quick
```

### Workflow 3: Full CI/CD Verification

```powershell
# Generate JSON report for CI/CD
clj -M:verify --spec requirements.md --python src/ --output results.json
```

### Workflow 4: Performance Analysis

```powershell
# Profile specific files
clj -e "(require '[performance.profiler :as prof]) (prof/profile-functions (slurp \"your-file.py\"))"
```

## Development with Portal (Visual REPL)

Portal provides an interactive data visualization tool.

### Start Portal

```clojure
(require '[portal.api :as portal])

;; Open Portal window
(def p (portal/open))

;; Send data to Portal
(add-tap #'portal/submit)

;; Now all verified data appears in Portal
(tap> (conductor/full-verification "sample-requirements.md" "sample-python/auth.py"))

;; Inspect security findings interactively
(tap> (security/analyze-python-code (slurp "sample-python/insecure_db.py")))
```

Portal opens a browser window showing interactive, explorable data structures.

## Extending the Framework

### Add Your Own Verification Rule

Create `src/custom/rules.clj`:

```clojure
(ns custom.rules
  (:require [clojure.string :as str]))

(defn check-custom-rule
  "Your custom verification logic"
  [code]
  {:rule "custom-check"
   :passed? (str/includes? code "# VERIFIED")
   :message "Code must include verification marker"})

;; Use in conductor
(defn full-custom-verification
  [spec-file code-files]
  (let [base-results (conductor/full-verification spec-file code-files)
        custom-checks (map check-custom-rule (map slurp code-files))]
    (assoc base-results :custom custom-checks)))
```

### Create a Custom CLI Command

Edit `src/verify/commands.clj`:

```clojure
;; Add to cli-options
["-c" "--custom" "Run custom verification rules"]

;; Add to run-verification
(when (:custom options)
  (require '[custom.rules :as custom])
  (custom/full-custom-verification spec-file python-files))
```

## Troubleshooting

### Issue: "Could not find artifact"

```powershell
# Clear local Maven cache
rm -r ~/.m2/repository
clj -Stree
```

### Issue: "No such namespace"

```clojure
;; In REPL, reload namespaces
(require '[your.namespace :reload-all])
```

### Issue: "FileNotFoundException"

```powershell
# Verify you're in the correct directory
cd c:\projects\ai\grand-ai-hotel\examples\clojure

# Check file paths are correct
ls sample-python/
ls sample-requirements.md
```

### Issue: REPL Hangs

```
Press Ctrl+C twice to exit
Restart with: clj -M:repl
```

## Next Steps

1. **Read the Tutorial**: See [clojure-functional-verification.md](../../tutorials/clojure-functional-verification.md)
2. **Explore Agent Modules**: Browse `src/` directory to understand each agent's implementation
3. **Run Sample Verifications**: Compare `auth.py` (clean) vs `insecure_db.py` (vulnerable)
4. **Create Your Own Specs**: Write a PRD in `sample-requirements.md` format
5. **Integrate with CI/CD**: Use `--output results.json` for automated pipelines

## Resources

- **Clojure Documentation**: https://clojure.org/guides/getting_started
- **Clojure CLI Tools**: https://clojure.org/guides/deps_and_cli
- **Portal**: https://github.com/djblue/portal
- **Rebel Readline**: https://github.com/bhauman/rebel-readline

---

*"A well-structured verification suite is like a well-run hotel. Every detail must be perfect."*  
— M. Gustave H.
