(ns verify.engine
  "Verify Python codebase against specifications.
   
   Agatha's domain: comprehensive testing and validation."
  (:require [clojure.string :as str]
            [clojure.java.io :as io]
            [clojure.set :as set]))

(defn check-python-files
  "Scan Python directory and verify against specification.
   Returns {:verified [] :warnings [] :failures []}"
  [python-dir spec]
  (let [files (find-python-files python-dir)]
    {:verified (map #(verify-file % spec) files)
     :warnings (collect-warnings files spec)
     :failures (collect-failures files spec)}))

(defn- find-python-files [dir]
  (filter #(str/ends-with? (.getName %) ".py")
          (file-seq (io/file dir))))

(defn- verify-file [file spec]
  (let [content (slurp file)
        checks [(check-imports content spec)
                (check-functions content spec)
                (check-types content spec)
                (check-documentation content)]]
    {:file (.getPath file)
     :results checks
     :passed? (every? :passed? checks)}))

(defn- check-imports [content spec]
  "Verify required imports are present."
  (let [required-imports (:required-imports spec)
        imports-found (re-seq #"import\s+(\w+)" content)]
    {:check "imports"
     :passed? (seq imports-found)
     :details {:required required-imports
               :found (map second imports-found)}}))

(defn- check-functions [content spec]
  "Verify required functions exist."
  (let [required-funcs (:required-functions spec)
        funcs-found (re-seq #"def\s+(\w+)" content)]
    {:check "functions"
     :passed? (seq funcs-found)
     :details {:found (map second funcs-found)}}))

(defn- check-types [content spec]
  "Verify type hints are present."
  (let [type-hints (re-seq #":\s*(\w+)" content)]
    {:check "type-annotations"
     :passed? (> (count type-hints) 0)
     :details {:hints-found (count type-hints)}}))

(defn- check-documentation [content]
  "Verify docstrings present."
  (let [docstrings (re-seq #"\"\"\"" content)]
    {:check "documentation"
     :passed? (> (count docstrings) 0)
     :details {:docstrings-found (/ (count docstrings) 2)}}))

(defn- collect-warnings [files spec]
  (mapcat (fn [file]
            (let [content (slurp file)
                  missing-docs (not (re-find #"\"\"\"" content))]
              (when missing-docs
                [(str "WARNING: " (.getName file) " lacks documentation")])))
          files))

(defn- collect-failures [files spec]
  (mapcat (fn [file]
            (let [content (slurp file)
                  checks [(check-imports content spec)
                          (check-functions content spec)]]
              (when (some (complement :passed?) checks)
                [(str "FAILURE: " (.getName file) " failed verification")])))
          files))

(defn report
  "Generate verification report."
  [{:keys [verified warnings failures]}]
  (str "VERIFICATION REPORT\n"
       "==================\n"
       "Files Verified: " (count verified) "\n"
       "Warnings: " (count warnings) "\n"
       "Failures: " (count failures) "\n\n"
       (if (seq warnings)
         (str "Warnings:\n" (str/join "\n" (map #(str "  ⚠ " %) warnings)) "\n\n")
         "")
       (if (seq failures)
         (str "Failures:\n" (str/join "\n" (map #(str "  ✗ " %) failures)))
         (str "✓ All verifications passed!"))))
