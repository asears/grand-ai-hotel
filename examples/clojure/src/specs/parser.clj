(ns specs.parser
  "Parse Product Requirements Documents and extract specification constraints.
   
   M. Gustave's domain: extracting structure and elegance from raw requirements."
  (:require [clojure.string :as str]
            [clojure.edn :as edn]))

(defn parse-prd
  "Parse PRD file into structured specification map.
   Handles markdown and EDN formats."
  [filepath]
  (let [content (slurp filepath)
        format (if (str/ends-with? filepath ".md") :markdown :edn)]
    (case format
      :edn (edn/read-string content)
      :markdown (parse-markdown-prd content))))

(defn parse-markdown-prd
  "Extract specification sections from markdown PRD.
   
   Sections expected:
   - # Requirements
   - # Constraints
   - # Data Model
   - # API Specification"
  [content]
  (let [lines (str/split-lines content)
        sections (group-by-section lines)]
    {:requirements (extract-requirements sections)
     :constraints (extract-constraints sections)
     :data-model (extract-data-model sections)
     :api-spec (extract-api-spec sections)}))

(defn- group-by-section [lines]
  (reduce (fn [acc line]
            (if (str/starts-with? line "#")
              (conj acc {:header line :content []})
              (update acc (dec (count acc)) update :content conj line)))
          []
          lines))

(defn- extract-requirements [sections]
  (let [req-section (first (filter #(str/includes? (:header %) "Requirements") sections))]
    (map str/trim (:content req-section))))

(defn- extract-constraints [sections]
  (let [constraint-section (first (filter #(str/includes? (:header %) "Constraints") sections))]
    (map str/trim (filter not-empty (:content constraint-section)))))

(defn- extract-data-model [sections]
  (let [model-section (first (filter #(str/includes? (:header %) "Data Model") sections))]
    (into {} (map parse-model-line (:content model-section)))))

(defn- extract-api-spec [sections]
  (let [api-section (first (filter #(str/includes? (:header %) "API") sections))]
    (into {} (map parse-endpoint-line (:content api-section)))))

(defn- parse-model-line [line]
  (let [[key val] (str/split line #":")]
    [(str/trim key) (str/trim val)]))

(defn- parse-endpoint-line [line]
  (let [[method path] (str/split line #" " 2)]
    [(str method " " path) {}]))

(defn prd-summary
  "Generate human-readable summary of specification."
  [prd]
  (str "Specification Summary:\n"
       "Requirements: " (count (:requirements prd)) "\n"
       "Constraints: " (count (:constraints prd)) "\n"
       "Data Models: " (count (:data-model prd)) "\n"
       "API Endpoints: " (count (:api-spec prd))))
