(ns performance.profiler
  "Analysis and profiling for computational complexity and performance.
   
   Serge X.'s domain: scholarly analysis of system performance."
  (:require [clojure.string :as str]))

(defn profile-functions
  "Extract function definitions and estimate complexity.
   Uses lazy sequences for memory efficiency."
  [python-code]
  (let [lines (str/split-lines python-code)
        functions (parse-functions lines)
        complexities (map estimate-complexity functions)]
    (into {} (map vector (map :name functions) complexities))))

(defn- parse-functions [lines]
  (let [indexed (map-indexed vector lines)
        func-starts (filter (fn [[_ line]] (str/starts-with? (str/trim line) "def "))
                           indexed)]
    (map (fn [[idx line]]
           {:name (extract-func-name line)
            :line (inc idx)
            :code (str/trim line)})
         func-starts)))

(defn- extract-func-name [line]
  (second (str/split line #"def\s+(\w+)")))

(defn- estimate-complexity [func]
  (let [code (:code func)
        loops (count (re-seq #"for|while" code))
        recursion (if (re-find #"return\s+\w+\(" code) 1 0)
        conditionals (count (re-seq #"if|elif" code))]
    {:name (:name func)
     :estimated-complexity (+ loops recursion)
     :branch-count conditionals
     :risk-level (estimate-risk-level (+ loops recursion))}))

(defn- estimate-risk-level [complexity]
  (cond
    (= complexity 0) "O(1)"
    (= complexity 1) "O(n)"
    (= complexity 2) "O(n²)"
    (> complexity 2) "O(n³+)"
    :else "Unknown"))

(defn generate-profile
  "Generate performance profile report."
  [profile-map]
  (let [high-risk (filter #(str/includes? (:risk-level %) "n³") (vals profile-map))
        avg-complexity (/ (reduce + (map :estimated-complexity (vals profile-map)))
                         (count profile-map))]
    (str "PERFORMANCE PROFILE\n"
         "==================\n"
         "Average Complexity: " avg-complexity "\n"
         "High-Risk Functions: " (count high-risk) "\n\n"
         "Function Analysis:\n"
         (str/join "\n"
                   (map (fn [[name {:keys [estimated-complexity branch-count risk-level]}]]
                          (str "  " name ": " risk-level 
                               " (branches: " branch-count ")"))
                        profile-map)))))

(defn lazy-sequence-analysis
  "Use lazy sequences to process large codebases without loading all in memory."
  [large-file-seq]
  (let [file-lines (mapcat (fn [file]
                            (with-open [rdr (clojure.java.io/reader file)]
                              (doall (line-seq rdr))))
                          large-file-seq)
        functions (filter #(str/starts-with? % "def ") file-lines)]
    (take 20 functions))) ;; Lazily take first 20
