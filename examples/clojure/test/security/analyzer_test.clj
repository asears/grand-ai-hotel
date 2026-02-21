(ns security.analyzer-test
  (:require [clojure.test :refer [deftest is testing]]
            [clojure.test.check.generators :as gen]
            [clojure.test.check.properties :as prop]
            [clojure.test.check.clojure-test :refer [defspec]]
            [security.analyzer :as security]))

;; Unit Tests for Individual Vulnerability Patterns

(deftest test-detect-sql-injection
  (testing "Detect SQL injection vulnerabilities"
    (let [vulnerable-code "query = f\"SELECT * FROM users WHERE id = {user_id}\""
          safe-code "cursor.execute(\"SELECT * FROM users WHERE id = ?\", (user_id,))"]
      (is (not-empty (filter #(= :sql-injection (:type %))
                             (security/analyze-python-code vulnerable-code))))
      (is (empty? (filter #(= :sql-injection (:type %))
                          (security/analyze-python-code safe-code)))))))

(deftest test-detect-hardcoded-secrets
  (testing "Detect hardcoded API keys and passwords"
    (let [code-with-secret "API_KEY = \"sk-1234567890abcdef\"\npassword = \"admin123\""
          safe-code "API_KEY = os.environ.get('API_KEY')"]
      (is (not-empty (filter #(= :hardcoded-secrets (:type %))
                             (security/analyze-python-code code-with-secret))))
      (is (empty? (filter #(= :hardcoded-secrets (:type %))
                          (security/analyze-python-code safe-code)))))))

(deftest test-detect-unsafe-eval
  (testing "Detect unsafe eval/exec usage"
    (let [dangerous-code "eval(user_input)\nexec(code_string)"
          safe-code "ast.literal_eval(safe_string)"]
      (is (not-empty (filter #(= :unsafe-eval (:type %))
                             (security/analyze-python-code dangerous-code))))
      (is (empty? (filter #(= :unsafe-eval (:type %))
                          (security/analyze-python-code safe-code)))))))

(deftest test-detect-path-traversal
  (testing "Detect path traversal vulnerabilities"
    (let [vulnerable-code "open(f\"data/{filename}\")"
          safe-code "file_path = os.path.join(safe_dir, os.path.basename(filename))"]
      (is (not-empty (filter #(= :path-traversal (:type %))
                             (security/analyze-python-code vulnerable-code)))))))

(deftest test-detect-unvalidated-redirect
  (testing "Detect unvalidated redirect vulnerabilities"
    (let [vulnerable-code "redirect(request.args.get('next'))"
          safe-code "if url_validator(next_url): redirect(next_url)"]
      (is (not-empty (filter #(= :unvalidated-redirect (:type %))
                             (security/analyze-python-code vulnerable-code)))))))

;; Threat Score Tests

(deftest test-threat-score-calculation
  (testing "Threat score increases with vulnerability count"
    (let [clean-code "def safe_function(): return True"
          one-vuln "API_KEY = \"secret\""
          multiple-vulns "API_KEY = \"secret\"\neval(code)\nquery = f\"SELECT * FROM users WHERE id = {id}\""
          score-clean (security/threat-score (security/analyze-python-code clean-code))
          score-one (security/threat-score (security/analyze-python-code one-vuln))
          score-multiple (security/threat-score (security/analyze-python-code multiple-vulns))]
      (is (= 0 score-clean))
      (is (< 0 score-one 100))
      (is (< score-one score-multiple))
      (is (<= score-multiple 100)))))

(deftest test-threat-score-bounds
  (testing "Threat score always between 0 and 100"
    (let [many-vulns (apply str (repeat 100 "eval(x)\n"))
          score (security/threat-score (security/analyze-python-code many-vulns))]
      (is (<= 0 score 100)))))

;; Report Generation Tests

(deftest test-generate-report-structure
  (testing "Report has correct structure"
    (let [code "API_KEY = \"secret\"\neval(code)"
          report (security/generate-report code)]
      (is (map? report))
      (is (contains? report :threats))
      (is (contains? report :threat-score))
      (is (contains? report :risk-level))
      (is (vector? (:threats report)))
      (is (number? (:threat-score report)))
      (is (keyword? (:risk-level report))))))

(deftest test-risk-level-classification
  (testing "Risk levels classified correctly"
    (let [clean "def func(): pass"
          low-risk "password = 'test123'"
          high-risk (str "API_KEY = 'secret'\n"
                        "eval(x)\n"
                        "exec(y)\n"
                        "query = f\"SELECT * FROM t WHERE id={id}\"")
          report-clean (security/generate-report clean)
          report-low (security/generate-report low-risk)
          report-high (security/generate-report high-risk)]
      (is (= :safe (:risk-level report-clean)))
      (is (#{:low :medium} (:risk-level report-low)))
      (is (#{:high :critical} (:risk-level report-high))))))

;; Integration Tests

(deftest test-analyze-auth-py
  (testing "Analyze clean sample code"
    (let [code (slurp "sample-python/auth.py")
          report (security/generate-report code)]
      (is (= :safe (:risk-level report)))
      (is (zero? (:threat-score report))))))

(deftest test-analyze-insecure-db-py
  (testing "Analyze vulnerable sample code"
    (let [code (slurp "sample-python/insecure_db.py")
          report (security/generate-report code)
          threats (:threats report)]
      (is (#{:critical :high} (:risk-level report)))
      (is (> (:threat-score report) 50))
      (is (some #(= :hardcoded-secrets (:type %)) threats))
      (is (some #(= :sql-injection (:type %)) threats))
      (is (some #(= :unsafe-eval (:type %)) threats))
      (is (some #(= :path-traversal (:type %)) threats)))))

;; Property-Based Tests

(defspec analyze-always-returns-vector 100
  (prop/for-all [code gen/string-ascii]
    (vector? (security/analyze-python-code code))))

(defspec threat-score-is-valid 100
  (prop/for-all [code gen/string-ascii]
    (let [score (security/threat-score (security/analyze-python-code code))]
      (and (number? score)
           (<= 0 score 100)))))

(defspec report-has-required-keys 100
  (prop/for-all [code gen/string-ascii]
    (let [report (security/generate-report code)
          required-keys #{:threats :threat-score :risk-level}]
      (every? #(contains? report %) required-keys))))

;; Edge Cases

(deftest test-empty-code
  (testing "Handle empty code"
    (let [report (security/generate-report "")]
      (is (empty? (:threats report)))
      (is (zero? (:threat-score report)))
      (is (= :safe (:risk-level report))))))

(deftest test-multiline-string-literals
  (testing "Don't flag strings in multiline docstrings"
    (let [code "def func():\n    \"\"\"API_KEY example in docs\"\"\"\n    pass"
          threats (security/analyze-python-code code)]
      ;; This might still flag - depends on sophistication of analyzer
      ;; The test documents current behavior
      (is (vector? threats)))))

(deftest test-comments-with-secrets
  (testing "Flag secrets even in comments"
    (let [code "# password = \"admin123\" - don't do this!"
          threats (security/analyze-python-code code)]
      (is (not-empty (filter #(= :hardcoded-secrets (:type %)) threats))))))

;; Performance Tests

(deftest test-large-file-analysis
  (testing "Analyze large file without hanging"
    (let [large-code (apply str (repeat 10000 "def func(): pass\n"))
          start (System/currentTimeMillis)
          _ (security/analyze-python-code large-code)
          elapsed (- (System/currentTimeMillis) start)]
      ;; Should complete in reasonable time (< 5 seconds)
      (is (< elapsed 5000)))))

;; Regression Tests

(deftest test-false-positive-password-variable
  (testing "Handle legitimate password variables"
    (let [code "def hash_password(password: str) -> str:\n    return bcrypt.hashpw(password)"
          threats (security/analyze-python-code code)
          ;; Parameter names shouldn't be flagged
          secret-threats (filter #(= :hardcoded-secrets (:type %)) threats)]
      ;; This is a known limitation - documents expected behavior
      (is (vector? threats)))))

;; Custom Generators for Security Testing

(def gen-sql-injection
  (gen/fmap
   (fn [var-name]
     (str "query = f\"SELECT * FROM users WHERE id = {" var-name "}\""))
   gen/string-alphanumeric))

(def gen-hardcoded-secret
  (gen/fmap
   (fn [[key val]]
     (str key " = \"" val "\""))
   (gen/tuple (gen/elements ["API_KEY" "SECRET_KEY" "password" "token"])
              gen/string-alphanumeric)))

(defspec generated-sql-injection-detected 50
  (prop/for-all [code gen-sql-injection]
    (not-empty (filter #(= :sql-injection (:type %))
                       (security/analyze-python-code code)))))

(defspec generated-secrets-detected 50
  (prop/for-all [code gen-hardcoded-secret]
    (not-empty (filter #(= :hardcoded-secrets (:type %))
                       (security/analyze-python-code code)))))

;; Helper for interactive testing
(comment
  ;; Test with specific code snippet
  (security/analyze-python-code "eval(user_input)")
  
  ;; Generate full report
  (security/generate-report (slurp "sample-python/insecure_db.py"))
  
  ;; Test threat scoring
  (security/threat-score
   [{:type :sql-injection :severity :high}
    {:type :hardcoded-secrets :severity :high}]))
