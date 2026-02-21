(ns security.analyzer
  "Threat modeling and security vulnerability detection.
   
   Dmitri's domain: ruthless adversarial analysis."
  (:require [clojure.string :as str]
            [clojure.java.io :as io]))

(def threat-patterns
  "Known vulnerability patterns"
  {:sql-injection {:pattern #"(?i)(query|execute|sql|%s)" :severity "HIGH"}
   :hardcoded-secrets {:pattern #"(password|secret|api_key|token)\s*=\s*[\"']" :severity "CRITICAL"}
   :unsafe-eval {:pattern #"(eval|exec|__import__)" :severity "CRITICAL"}
   :path-traversal {:pattern #"(\.\.\/|\.\.\\)" :severity "HIGH"}
   :unvalidated-redirect {:pattern #"(redirect|Location)" :severity "MEDIUM"}})

(defn analyze-python-code
  "Scan Python code for security vulnerabilities."
  [dir]
  (let [files (find-python-files dir)
        findings (mapcat #(scan-file %) files)]
    {:total-findings (count findings)
     :critical (count (filter #(= (:severity %) "CRITICAL") findings))
     :high (count (filter #(= (:severity %) "HIGH") findings))
     :medium (count (filter #(= (:severity %) "MEDIUM") findings))
     :findings findings}))

(defn- find-python-files [dir]
  (filter #(str/ends-with? (.getName %) ".py")
          (file-seq (io/file dir))))

(defn- scan-file [file]
  (let [content (slurp file)
        lines (str/split-lines content)]
    (mapcat (fn [[idx line]]
              (scan-line line idx file))
            (map-indexed vector lines))))

(defn- scan-line [line idx file]
  (mapcat (fn [[threat-name {:keys [pattern severity]}]]
            (when (re-find pattern line)
              [{:threat threat-name
                :severity severity
                :file (.getPath file)
                :line (inc idx)
                :code (str/trim line)}]))
          threat-patterns))

(defn generate-report
  "Generate security audit report."
  [findings-map]
  (str "SECURITY AUDIT REPORT\n"
       "====================\n"
       "Total Findings: " (:total-findings findings-map) "\n"
       "Critical: " (:critical findings-map) "\n"
       "High: " (:high findings-map) "\n"
       "Medium: " (:medium findings-map) "\n\n"
       (if (seq (:findings findings-map))
         (str "Findings:\n"
              (str/join "\n"
                        (map (fn [{:keys [threat severity file line code]}]
                               (str "  [" severity "] " threat " at " file ":" line "\n"
                                    "    Code: " code))
                             (:findings findings-map))))
         "✓ No vulnerabilities detected")))

(defn threat-score
  "Calculate overall threat risk score (0-100)."
  [{:keys [critical high medium]}]
  (+ (* critical 40)
     (* high 20)
     (* medium 5)))
