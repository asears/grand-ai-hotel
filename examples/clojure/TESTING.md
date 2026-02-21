# Testing Guide

*A detailed guide to testing functional verification code in Clojure*

## Overview

This project demonstrates multiple testing approaches:

1. **Unit Tests**: Test individual functions in isolation
2. **Property-Based Tests**: Test properties that should hold for all inputs
3. **Integration Tests**: Test complete workflows with real files
4. **Edge Case Tests**: Test boundary conditions and error handling
5. **Performance Tests**: Ensure operations complete in reasonable time

## Running Tests

### Run All Tests

```powershell
cd c:\projects\ai\grand-ai-hotel\examples\clojure
clj -M:test -m clojure.test.runner
```

Or use the built-in runner:

```powershell
clj -X:test
```

### Run Specific Test Namespace

```powershell
clj -M:test -n specs.parser-test
```

### Run Tests with Coverage

```powershell
clj -M:test:coverage
```

### Watch Mode (Re-run on File Changes)

```powershell
clj -M:test:watch
```

## Test Organization

```
test/
├── specs/
│   ├── parser_test.clj       # PRD parsing tests
│   └── validator_test.clj     # Specification validation tests
├── verify/
│   └── engine_test.clj        # Code verification tests
├── security/
│   └── analyzer_test.clj      # Security analysis tests
├── performance/
│   └── profiler_test.clj      # Performance profiling tests
├── standards/
│   └── rules_test.clj         # Standards checking tests
└── orchestration/
    └── conductor_test.clj     # Integration tests
```

## Unit Testing Examples

### Basic Assertion Tests

```clojure
(ns my-module-test
  (:require [clojure.test :refer [deftest is testing]]
            [my-module :as m]))

(deftest test-basic-function
  (testing "Function does what it should"
    (is (= 42 (m/my-function 6 7)))
    (is (not= 43 (m/my-function 6 7)))))
```

### Testing with Multiple Assertions

```clojure
(deftest test-parse-requirements
  (testing "Parse requirements from markdown"
    (let [content "## Requirements\n- Feature A\n- Feature B"
          result (parser/extract-requirements content)]
      (is (vector? result))
      (is (= 2 (count result)))
      (is (some #(= "Feature A" %) result))
      (is (some #(= "Feature B" %) result)))))
```

### Testing Exceptions

```clojure
(deftest test-invalid-input
  (testing "Throws exception for invalid input"
    (is (thrown? Exception (parser/parse-prd nil)))
    (is (thrown-with-msg? Exception #"File not found"
                          (parser/parse-prd "nonexistent.md")))))
```

## Property-Based Testing

Property-based testing generates random inputs and verifies properties hold.

### Basic Property Test

```clojure
(ns my-module-test
  (:require [clojure.test.check :as tc]
            [clojure.test.check.generators :as gen]
            [clojure.test.check.properties :as prop]
            [clojure.test.check.clojure-test :refer [defspec]]))

(defspec parse-always-returns-map 100
  (prop/for-all [content gen/string-ascii]
    (map? (parser/parse-markdown-prd content))))
```

This runs 100 random test cases with ASCII strings.

### Custom Generators

```clojure
;; Generate markdown requirements
(def gen-markdown-requirement
  (gen/fmap #(str "- " %) gen/string-ascii))

;; Generate full requirements section
(def gen-requirements-section
  (gen/fmap
   (fn [reqs]
     (str "## Requirements\n" (clojure.string/join "\n" reqs)))
   (gen/vector gen-markdown-requirement 1 10)))

;; Use custom generator in property test
(defspec requirements-parse-correctly 50
  (prop/for-all [section gen-requirements-section]
    (let [result (parser/extract-requirements section)]
      (and (vector? result)
           (every? string? result)
           (pos? (count result))))))
```

### Testing Security Patterns

```clojure
;; Generator for SQL injection patterns
(def gen-sql-injection
  (gen/fmap
   (fn [var-name]
     (str "query = f\"SELECT * FROM users WHERE id = {" var-name "}\""))
   gen/string-alphanumeric))

;; Verify detector finds all generated SQL injections
(defspec sql-injection-always-detected 50
  (prop/for-all [code gen-sql-injection]
    (not-empty (filter #(= :sql-injection (:type %))
                       (security/analyze-python-code code)))))
```

## Integration Testing

Test complete workflows with real files.

### Setup Test Fixtures

```clojure
(defn with-test-files
  "Ensure test files exist before running tests"
  [f]
  (when (and (.exists (clojure.java.io/file "sample-requirements.md"))
             (.exists (clojure.java.io/file "sample-python/auth.py")))
    (f)))

(use-fixtures :once with-test-files)
```

### Test Full Workflow

```clojure
(deftest test-full-verification-workflow
  (testing "Complete verification process"
    (let [result (conductor/full-verification 
                  "sample-requirements.md" 
                  "sample-python/auth.py")]
      (is (map? result))
      (is (contains? result :spec-validation))
      (is (contains? result :code-verification))
      (is (contains? result :security-analysis))
      (is (= "PASS" (get-in result [:summary :overall-status]))))))
```

## Edge Case Testing

### Test Empty Inputs

```clojure
(deftest test-empty-content
  (testing "Handle empty content gracefully"
    (let [result (parser/parse-markdown-prd "")]
      (is (map? result))
      (is (empty? (:requirements result))))))
```

### Test Malformed Data

```clojure
(deftest test-malformed-markdown
  (testing "Handle malformed markdown"
    (let [content "Random ### text without ## proper structure"
          result (parser/parse-markdown-prd content)]
      (is (map? result))
      (is (contains? result :requirements)))))
```

### Test Missing Files

```clojure
(deftest test-nonexistent-file
  (testing "Handle missing files"
    (is (thrown? Exception
                (conductor/full-verification "missing.md" "code.py")))))
```

## Performance Testing

### Basic Timing Test

```clojure
(deftest test-performance
  (testing "Completes in reasonable time"
    (let [start (System/currentTimeMillis)
          _ (heavy-computation)
          elapsed (- (System/currentTimeMillis) start)]
      (is (< elapsed 5000) "Should complete in < 5 seconds"))))
```

### Large Input Test

```clojure
(deftest test-large-file
  (testing "Handle large files efficiently"
    (let [large-code (apply str (repeat 10000 "def func(): pass\n"))
          start (System/currentTimeMillis)
          _ (security/analyze-python-code large-code)
          elapsed (- (System/currentTimeMillis) start)]
      (is (< elapsed 5000)))))
```

## Test-Driven Development Workflow

### 1. Write Test First

```clojure
(deftest test-new-feature
  (testing "New feature works correctly"
    (is (= expected-result (my-module/new-feature input)))))
```

### 2. Run Test (Should Fail)

```powershell
clj -M:test -n my-module-test
```

### 3. Implement Feature

```clojure
(defn new-feature
  [input]
  ;; Implementation
  expected-result)
```

### 4. Run Test Again (Should Pass)

```powershell
clj -M:test -n my-module-test
```

### 5. Refactor with Confidence

Tests ensure behavior doesn't change during refactoring.

## Interactive Testing in REPL

### Load Test Namespace

```clojure
(require '[specs.parser-test :as pt] :reload)
```

### Run Individual Test

```clojure
(pt/test-extract-requirements)
```

### Run All Tests in Namespace

```clojure
(clojure.test/run-tests 'specs.parser-test)
```

### Run Property Tests with Custom Parameters

```clojure
(require '[clojure.test.check :as tc])

;; Run with more iterations
(tc/quick-check 1000 
  (prop/for-all [content gen/string-ascii]
    (map? (parser/parse-markdown-prd content))))

;; Run with specific seed for reproducibility
(tc/quick-check 100
  (prop/for-all [content gen/string-ascii]
    (vector? (parser/extract-requirements content)))
  :seed 1234567890)
```

### Debug Failing Property Test

```clojure
;; Find the failing input
(def result (tc/quick-check 100 my-property))

;; Get the smallest failing case
(:shrunk result)

;; Test with that specific input
(my-function (:smallest (:shrunk result)))
```

## Writing Good Tests

### DO: Test Behavior, Not Implementation

```clojure
;; Good - tests behavior
(is (= 4 (count (parser/extract-requirements content))))

;; Avoid - tests implementation details
(is (= [:req1 :req2 :req3 :req4] (parser/extract-requirements content)))
```

### DO: Use Descriptive Test Names

```clojure
;; Good
(deftest test-sql-injection-detected-in-formatted-strings)

;; Avoid
(deftest test1)
```

### DO: Test One Concept Per Test

```clojure
;; Good - focused test
(deftest test-extract-requirements
  (testing "Extract requirements from markdown"
    (is (= 2 (count (extract-requirements sample-markdown))))))

;; Avoid - testing multiple concepts
(deftest test-everything
  (is (= 2 (count (extract-requirements content))))
  (is (= 85 (security/threat-score code)))
  (is (= :high (performance/estimate-complexity func))))
```

### DO: Use Testing Blocks for Context

```clojure
(deftest test-security-analyzer
  (testing "SQL injection detection"
    (is (detected? "f\"SELECT * FROM t WHERE id={id}\"")))
  
  (testing "Hardcoded secrets detection"
    (is (detected? "API_KEY = \"secret\"")))
  
  (testing "Safe code passes"
    (is (not (detected? "cursor.execute(\"SELECT * WHERE id=?\", (id,))")))))
```

### DO: Test Edge Cases

```clojure
(deftest test-edge-cases
  (testing "Empty input"
    (is (zero? (count (parser/extract-requirements "")))))
  
  (testing "Very long input"
    (is (vector? (parser/extract-requirements (apply str (repeat 10000 "x"))))))
  
  (testing "Unicode characters"
    (is (map? (parser/parse-markdown-prd "# 🎭 Requirements\n- Feature 你好")))))
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: DeLaGuardo/setup-clojure@12.1
        with:
          cli: 1.11.1.1413
      - name: Run tests
        run: clj -M:test -m clojure.test.runner
```

### Pre-commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
cd examples/clojure
clj -M:test -m clojure.test.runner || exit 1
```

## Test Coverage

### Run with Coverage Analysis

```powershell
clj -M:test:coverage
```

### View Coverage Report

```powershell
start htmlcov/index.html
```

### Aim for High Coverage

- **Critical paths**: 100% coverage (security, validation)
- **Core logic**: 90%+ coverage
- **Edge cases**: 80%+ coverage
- **UI/formatting**: 70%+ acceptable

## Common Testing Patterns

### Test Data Builders

```clojure
(defn make-spec
  [& {:keys [title requirements constraints]
      :or {title "Test Spec"
           requirements []
           constraints []}}]
  {:title title
   :requirements requirements
   :constraints constraints
   :data-model []
   :api-spec []})

;; Use in tests
(deftest test-with-builder
  (let [spec (make-spec :requirements ["Auth" "Logging"])]
    (is (= 2 (count (:requirements spec))))))
```

### Shared Test Setup

```clojure
(def test-spec
  (make-spec :requirements ["JWT authentication"
                           "Password hashing"]))

(deftest test-validation
  (is (validator/validate test-spec)))

(deftest test-verification
  (is (verify/check-against-spec "auth.py" test-spec)))
```

## Debugging Tests

### Print Debug Information

```clojure
(deftest test-with-debug
  (let [result (my-function input)]
    (println "Result:" result)
    (clojure.pprint/pprint result)
    (is (= expected result))))
```

### Use `prn-str` for Lazy Sequences

```clojure
(deftest test-lazy-seq
  (let [result (lazy-function)]
    (println "Realized:" (prn-str (doall result)))
    (is (= expected (vec result)))))
```

### Run Test with Stack Traces

```powershell
clj -M:test -n failing-test-ns
```

## Resources

- **Clojure Testing**: https://clojure.org/guides/test_check_beginner
- **test.check Documentation**: https://github.com/clojure/test.check
- **Property Testing Guide**: https://github.com/clojure/test.check/blob/master/doc/intro.md

---

*"A well-tested codebase is like a well-managed hotel. Every detail is verified, every guest is satisfied."*  
— M. Gustave H.
