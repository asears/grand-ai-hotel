(ns standards.rules
  "Declarative rules engine for code quality and standards.
   
   Henckels' domain: duty-bound consistency and standards enforcement."
  (:require [clojure.string :as str]))

(def coding-rules
  "Declarative set of coding standards to enforce"
  {:naming-conventions
   {:rule "Functions should use snake_case"
    :pattern #"def\s+([A-Z])" ;; CamelCase function
    :severity "MEDIUM"
    :fix "Rename to snake_case"}
   
   :line-length
   {:rule "Lines should not exceed 100 characters"
    :check (fn [line] (> (count line) 100))
    :severity "LOW"
    :fix "Break into multiple lines"}
   
   :docstring-required
   {:rule "Public functions must have docstrings"
    :check (fn [code] (not (re-find #"def\s+(\w+).*:\s+\"\"\"" code)))
    :severity "HIGH"
    :fix "Add docstring immediately after function definition"}
   
   :imports-organized
   {:rule "Imports should be at top of file"
    :pattern #"import\s+\w+\s+.*?\ndef"
    :severity "MEDIUM"
    :fix "Move imports to top"}
   
   :magic-numbers
   {:rule "Avoid magic numbers; use named constants"
    :pattern #"[=\(]\s+\d{3,}" ;; Numbers with 3+ digits
    :severity "LOW"
    :fix "Extract to named constant"}})

(defn check-against
  "Check Python code against all standards rules.
   Returns map of violations."
  [python-code]
  (let [lines (str/split-lines python-code)
        violations (atom [])]
    (doseq [[rule-name {:keys [rule check pattern severity]}] coding-rules]
      (doseq [[idx line] (map-indexed vector lines)]
        (let [violation? (cond
                          pattern (re-find pattern line)
                          check (check line)
                          :else false)]
          (when violation?
            (swap! violations conj
                   {:rule rule-name
                    :line (inc idx)
                    :severity severity
                    :code (str/trim line)})))))
    @violations))

(defn generate-report
  "Generate standards compliance report."
  [violations]
  (let [by-severity (group-by :severity violations)]
    (str "CODE STANDARDS REPORT\n"
         "====================\n"
         "Total Violations: " (count violations) "\n"
         "High: " (count (get by-severity "HIGH" [])) "\n"
         "Medium: " (count (get by-severity "MEDIUM" [])) "\n"
         "Low: " (count (get by-severity "LOW" [])) "\n\n"
         (if (seq violations)
           (str "Violations:\n"
                (str/join "\n"
                          (map (fn [{:keys [rule severity line code]}]
                                 (str "  [" severity "] " rule " at line " line "\n"
                                      "    " code))
                               violations)))
           "✓ All standards met"))))

(defn suggest-fixes
  "Suggest fixes for violations."
  [violations rule-defs]
  (map (fn [{:keys [rule] :as violation}]
         (assoc violation :suggestion (:fix (get rule-defs rule))))
       violations))
