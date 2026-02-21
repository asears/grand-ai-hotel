(ns orchestration.conductor
  "Orchestrate all verification agents in a unified workflow.
   
   Zero's domain: coordination and automation of the ensemble."
  (:require [specs.parser :as parser]
            [specs.validator :as validator]
            [verify.engine :as verify]
            [security.analyzer :as security]
            [performance.profiler :as performance]
            [standards.rules :as standards]
            [clojure.string :as str]))

(defn full-verification
  "Run complete verification suite across all agents.
   Returns comprehensive analysis map."
  [{:keys [spec-file python-dir]}]
  (println "🎩 M. Gustave: Beginning verification suite...")
  (let [spec (parser/parse-prd spec-file)
        _ (println "📋 Ludwig: Validating specification...")
        validation (validator/validate spec)
        _ (println "🧪 Agatha: Verifying Python code...")
        verification (verify/check-python-files python-dir spec)
        _ (println "🔒 Dmitri: Running security audit...")
        security-audit (security/analyze-python-code python-dir)
        _ (println "📊 Serge X.: Profiling performance...")
        performance-profile (analyze-performance python-dir)
        _ (println "📏 Henckels: Checking standards...")
        standards-check (check-standards-all python-dir)]
    {:specification {:file spec-file
                     :validation validation}
     :verification verification
     :security security-audit
     :performance performance-profile
     :standards standards-check
     :summary (generate-summary validation verification security-audit 
                              performance-profile standards-check)}))

(defn- analyze-performance [python-dir]
  (let [files (file-seq (clojure.java.io/file python-dir))
        py-files (filter #(str/ends-with? (.getName %) ".py") files)
        profiles (map (fn [file]
                       (let [code (slurp file)]
                         {(.getName file) (performance/profile-functions code)}))
                     py-files)]
    (apply merge profiles)))

(defn- check-standards-all [python-dir]
  (let [files (file-seq (clojure.java.io/file python-dir))
        py-files (filter #(str/ends-with? (.getName %) ".py") files)
        violations (mapcat (fn [file]
                            (let [code (slurp file)]
                              (map #(assoc % :file (.getName file))
                                   (standards/check-against code))))
                          py-files)]
    {:total-violations (count violations)
     :violations violations}))

(defn- generate-summary [validation verification security performance standards]
  (let [spec-valid? (:valid? validation)
        verification-passed? (every? :passed? (:verified verification))
        security-critical (:critical security)
        perf-high-risk (count (filter #(str/includes? (:risk-level %) "n³") 
                                     (vals performance)))
        standards-violations (:total-violations standards)]
    {:overall-status (cond
                      (not spec-valid?) "SPECIFICATION INVALID"
                      (> security-critical 0) "CRITICAL SECURITY ISSUES"
                      (not verification-passed?) "VERIFICATION FAILED"
                      (> standards-violations 10) "STANDARDS COMPLIANCE LOW"
                      (> perf-high-risk 5) "PERFORMANCE CONCERNS"
                      :else "PASSED")
     :spec-valid? spec-valid?
     :verification-passed? verification-passed?
     :security-critical security-critical
     :performance-risks perf-high-risk
     :standards-violations standards-violations}))

(defn generate-report
  "Generate unified verification report from all agents."
  [results]
  (str "╔══════════════════════════════════════════════════════════════╗\n"
       "║    THE GRAND BUDAPEST TERMINAL - VERIFICATION REPORT        ║\n"
       "╚══════════════════════════════════════════════════════════════╝\n\n"
       "OVERALL STATUS: " (get-in results [:summary :overall-status]) "\n"
       (str/join (repeat 70 "═")) "\n\n"
       "📋 SPECIFICATION (Ludwig)\n"
       (str/join (repeat 70 "─")) "\n"
       (validator/report (get-in results [:specification :validation])) "\n\n"
       "🧪 VERIFICATION (Agatha)\n"
       (str/join (repeat 70 "─")) "\n"
       (verify/report (:verification results)) "\n\n"
       "🔒 SECURITY (Dmitri)\n"
       (str/join (repeat 70 "─")) "\n"
       (security/generate-report (:security results)) "\n\n"
       "📏 STANDARDS (Henckels)\n"
       (str/join (repeat 70 "─")) "\n"
       (standards/generate-report (get-in results [:standards :violations])) "\n\n"
       "╔══════════════════════════════════════════════════════════════╗\n"
       "║    \"Excellence in all endeavors, dear colleague.\"           ║\n"
       "║                                      — M. Gustave H.         ║\n"
       "╚══════════════════════════════════════════════════════════════╝\n"))

(defn quick-check
  "Fast verification - specs and security only."
  [{:keys [spec-file python-dir]}]
  (let [spec (parser/parse-prd spec-file)
        validation (validator/validate spec)
        security-audit (security/analyze-python-code python-dir)]
    {:validation validation
     :security security-audit
     :passed? (and (:valid? validation)
                  (zero? (:critical security-audit)))}))
