(ns orchestration.conductor-test
  (:require [clojure.test :refer [deftest is testing use-fixtures]]
            [orchestration.conductor :as conductor]))

;; Test Fixtures

(def sample-spec-file "sample-requirements.md")
(def clean-code-file "sample-python/auth.py")
(def vulnerable-code-file "sample-python/insecure_db.py")

(defn with-test-files
  "Ensure test files exist before running tests"
  [f]
  (when (and (.exists (clojure.java.io/file sample-spec-file))
             (.exists (clojure.java.io/file clean-code-file))
             (.exists (clojure.java.io/file vulnerable-code-file)))
    (f)))

(use-fixtures :once with-test-files)

;; Full Verification Tests

(deftest test-full-verification-structure
  (testing "Full verification returns expected structure"
    (let [result (conductor/full-verification sample-spec-file clean-code-file)]
      (is (map? result))
      (is (contains? result :spec-validation))
      (is (contains? result :code-verification))
      (is (contains? result :security-analysis))
      (is (contains? result :performance-profile))
      (is (contains? result :standards-check))
      (is (contains? result :summary)))))

(deftest test-full-verification-clean-code
  (testing "Clean code passes verification"
    (let [result (conductor/full-verification sample-spec-file clean-code-file)
          summary (:summary result)]
      (is (= "PASS" (:overall-status summary)))
      (is (true? (get-in result [:spec-validation :valid?])))
      (is (zero? (get-in result [:security-analysis :threat-score])))
      (is (empty? (get-in result [:standards-check :violations]))))))

(deftest test-full-verification-vulnerable-code
  (testing "Vulnerable code fails security checks"
    (let [result (conductor/full-verification sample-spec-file vulnerable-code-file)
          summary (:summary result)]
      (is (= "FAIL" (:overall-status summary)))
      (is (pos? (get-in result [:security-analysis :threat-score])))
      (is (seq (get-in result [:security-analysis :threats]))))))

;; Quick Check Tests

(deftest test-quick-check-structure
  (testing "Quick check returns simplified structure"
    (let [result (conductor/quick-check sample-spec-file clean-code-file)]
      (is (map? result))
      (is (contains? result :security-analysis))
      (is (contains? result :standards-check))
      (is (contains? result :summary))
      ;; Should NOT contain full verification results
      (is (not (contains? result :performance-profile))))))

(deftest test-quick-check-faster-than-full
  (testing "Quick check completes faster than full verification"
    (let [start-quick (System/currentTimeMillis)
          _ (conductor/quick-check sample-spec-file clean-code-file)
          quick-time (- (System/currentTimeMillis) start-quick)
          
          start-full (System/currentTimeMillis)
          _ (conductor/full-verification sample-spec-file clean-code-file)
          full-time (- (System/currentTimeMillis) start-full)]
      ;; Quick check should be faster (or at least not slower)
      (is (<= quick-time full-time)))))

;; Summary Generation Tests

(deftest test-generate-summary-with-failures
  (testing "Summary correctly identifies failures"
    (let [results {:spec-validation {:valid? false :errors ["Missing constraint"]}
                   :security-analysis {:threat-score 85 :threats [{:type :sql-injection}]}
                   :standards-check {:violations [{:rule "docstring"}]}}
          summary (conductor/generate-summary results)]
      (is (= "FAIL" (:overall-status summary)))
      (is (pos? (:total-issues summary)))
      (is (seq (:critical-findings summary))))))

(deftest test-generate-summary-all-pass
  (testing "Summary shows PASS when all checks succeed"
    (let [results {:spec-validation {:valid? true :errors []}
                   :security-analysis {:threat-score 0 :threats []}
                   :standards-check {:violations []}}
          summary (conductor/generate-summary results)]
      (is (= "PASS" (:overall-status summary)))
      (is (zero? (:total-issues summary)))
      (is (empty? (:critical-findings summary))))))

;; Report Generation Tests

(deftest test-generate-report-format
  (testing "Generated report has expected format"
    (let [results (conductor/full-verification sample-spec-file clean-code-file)
          report (conductor/generate-report results)]
      (is (string? report))
      (is (.contains report "=== GRAND BUDAPEST VERIFICATION REPORT ==="))
      (is (.contains report "M. Gustave"))
      (is (.contains report "Overall Status:")))))

(deftest test-generate-report-includes-agent-names
  (testing "Report mentions all agents"
    (let [results (conductor/full-verification sample-spec-file clean-code-file)
          report (conductor/generate-report results)
          agents ["Ludwig" "Agatha" "Dmitri" "Serge X." "Henckels"]]
      (doseq [agent agents]
        (is (.contains report agent) (str "Report should mention " agent))))))

(deftest test-generate-report-highlights-vulnerabilities
  (testing "Report highlights security vulnerabilities prominently"
    (let [results (conductor/full-verification sample-spec-file vulnerable-code-file)
          report (conductor/generate-report results)]
      (is (.contains report "CRITICAL") 
          "Report should highlight critical issues")
      (is (.contains report "Threat Score:"))
      (is (or (.contains report "SQL Injection")
              (.contains report "sql-injection"))))))

;; Integration Tests with Multiple Files

(deftest test-verify-multiple-files
  (testing "Verify multiple Python files at once"
    (let [results (conductor/full-verification 
                   sample-spec-file 
                   [clean-code-file vulnerable-code-file])]
      (is (map? results))
      ;; Should aggregate results from both files
      (is (contains? results :security-analysis)))))

;; Edge Cases

(deftest test-nonexistent-spec-file
  (testing "Handle missing specification file gracefully"
    (is (thrown? Exception
                (conductor/full-verification "nonexistent.md" clean-code-file)))))

(deftest test-nonexistent-code-file
  (testing "Handle missing code file gracefully"
    (is (thrown? Exception
                (conductor/full-verification sample-spec-file "nonexistent.py")))))

(deftest test-empty-file-list
  (testing "Handle empty file list"
    (let [result (conductor/full-verification sample-spec-file [])]
      (is (map? result))
      ;; Should still validate spec
      (is (contains? result :spec-validation)))))

;; Idempotence Tests

(deftest test-verification-idempotence
  (testing "Running verification twice yields same results"
    (let [result1 (conductor/full-verification sample-spec-file clean-code-file)
          result2 (conductor/full-verification sample-spec-file clean-code-file)]
      (is (= (:summary result1) (:summary result2)))
      (is (= (get-in result1 [:security-analysis :threat-score])
             (get-in result2 [:security-analysis :threat-score]))))))

;; Performance Tests

(deftest test-verification-performance
  (testing "Verification completes in reasonable time"
    (let [start (System/currentTimeMillis)
          _ (conductor/full-verification sample-spec-file clean-code-file)
          elapsed (- (System/currentTimeMillis) start)]
      ;; Should complete in under 10 seconds
      (is (< elapsed 10000)
          (str "Verification took " elapsed "ms, expected < 10000ms")))))

;; Agent Coordination Tests

(deftest test-all-agents-invoked
  (testing "Full verification invokes all agents"
    (let [result (conductor/full-verification sample-spec-file clean-code-file)]
      ;; M. Gustave coordinates
      (is (contains? result :spec-validation))
      ;; Ludwig validates
      (is (get-in result [:spec-validation :valid?]))
      ;; Agatha verifies
      (is (contains? result :code-verification))
      ;; Dmitri analyzes security
      (is (contains? result [:security-analysis :threat-score]))
      ;; Serge X. profiles performance
      (is (contains? result :performance-profile))
      ;; Henckels checks standards
      (is (contains? result :standards-check)))))

(deftest test-agent-failure-isolation
  (testing "Failure in one agent doesn't prevent others from running"
    ;; Even with invalid spec, other checks should still run
    (let [result (conductor/full-verification "invalid-spec.md" clean-code-file)]
      ;; May fail spec validation, but other analyses should still work
      (is (or (contains? result :security-analysis)
              (contains? result :standards-check))))))

;; Report Formatting Tests

(deftest test-report-line-length
  (testing "Report lines don't exceed reasonable length"
    (let [results (conductor/full-verification sample-spec-file clean-code-file)
          report (conductor/generate-report results)
          lines (clojure.string/split report #"\n")]
      (doseq [line lines]
        (is (<= (count line) 120)
            "Report lines should be <= 120 characters for readability")))))

(deftest test-report-includes-timestamp
  (testing "Report includes generation timestamp"
    (let [results (conductor/full-verification sample-spec-file clean-code-file)
          report (conductor/generate-report results)]
      ;; Should include some date/time reference
      (is (or (.contains report "Generated")
              (.contains report "Date")
              (.contains report "Time"))))))

;; Summary Statistics Tests

(deftest test-summary-issue-count
  (testing "Summary counts issues correctly"
    (let [results {:spec-validation {:errors ["Error 1" "Error 2"]}
                   :security-analysis {:threats [{:type :a} {:type :b} {:type :c}]}
                   :standards-check {:violations [{:rule "r1"} {:rule "r2"}]}}
          summary (conductor/generate-summary results)
          total (:total-issues summary)]
      (is (= 7 total) "Should count 2 spec errors + 3 threats + 2 violations"))))

;; Helper for Interactive Testing
(comment
  ;; Run full verification
  (def results (conductor/full-verification 
                "sample-requirements.md" 
                "sample-python/auth.py"))
  
  ;; View summary
  (:summary results)
  
  ;; Generate formatted report
  (println (conductor/generate-report results))
  
  ;; Quick security check
  (def quick (conductor/quick-check 
              "sample-requirements.md" 
              "sample-python/insecure_db.py"))
  
  ;; Compare clean vs vulnerable
  (def clean (conductor/full-verification 
              "sample-requirements.md" 
              "sample-python/auth.py"))
  (def vuln (conductor/full-verification 
             "sample-requirements.md" 
             "sample-python/insecure_db.py"))
  
  (println "Clean code threat score:" 
           (get-in clean [:security-analysis :threat-score]))
  (println "Vulnerable code threat score:" 
           (get-in vuln [:security-analysis :threat-score])))
