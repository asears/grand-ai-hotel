(ns verify.commands
  "Command-line interface for verification suite."
  (:require [orchestration.conductor :as conductor]
            [clojure.tools.cli :as cli]
            [clojure.string :as str])
  (:gen-class))

(def cli-options
  [["-s" "--spec FILE" "Specification file (PRD)"
    :default "sample-requirements.md"]
   ["-p" "--python DIR" "Python source directory"
    :default "sample-python"]
   ["-q" "--quick" "Quick check (spec + security only)"]
   ["-o" "--output FORMAT" "Output format (text or json)"
    :default "text"]
   ["-h" "--help" "Show help"]])

(defn usage [options-summary]
  (->> ["The Grand Budapest Terminal - Verification Suite"
        ""
        "Usage: clj -M:verify [options]"
        ""
        "Options:"
        options-summary
        ""
        "Examples:"
        "  clj -M:verify --spec requirements.md --python src/"
        "  clj -M:verify --quick"
        "  clj -M:verify --output json > report.json"]
       (str/join \newline)))

(defn error-msg [errors]
  (str "The following errors occurred:\n\n"
       (str/join \newline errors)))

(defn validate-args [args]
  (let [{:keys [options arguments errors summary]} (cli/parse-opts args cli-options)]
    (cond
      (:help options)
      {:exit-message (usage summary) :ok? true}
      
      errors
      {:exit-message (error-msg errors)}
      
      :else
      {:options options})))

(defn run-verification [options]
  (println "\n🎩 Welcome to The Grand Budapest Terminal Verification Suite\n")
  (let [spec-file (:spec options)
        python-dir (:python options)
        quick? (:quick options)]
    (if quick?
      (do
        (println "Running quick verification (spec + security)...")
        (let [results (conductor/quick-check {:spec-file spec-file
                                              :python-dir python-dir})]
          (println "\nQuick Check Result:" (if (:passed? results) "✓ PASSED" "✗ FAILED"))
          (if-not (:passed? results)
            (do
              (println "\nValidation:" (:validation results))
              (println "\nSecurity:" (:security results)))
            (println "\nNo critical issues detected."))))
      (do
        (println "Running full verification suite...")
        (let [results (conductor/full-verification {:spec-file spec-file
                                                    :python-dir python-dir})]
          (if (= (:output options) "json")
            (println (cheshire.core/generate-string results {:pretty true}))
            (println (conductor/generate-report results))))))))

(defn exit [status msg]
  (println msg)
  (System/exit status))

(defn -main [& args]
  (let [{:keys [options exit-message ok?]} (validate-args args)]
    (if exit-message
      (exit (if ok? 0 1) exit-message)
      (try
        (run-verification options)
        (exit 0 "\n✓ Verification complete")
        (catch Exception e
          (exit 1 (str "✗ Error: " (.getMessage e))))))))
