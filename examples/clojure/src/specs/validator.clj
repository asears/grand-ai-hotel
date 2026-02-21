(ns specs.validator
  "Validate specifications for completeness, consistency, and correctness.
   
   Ludwig's domain: type-checking and contract verification."
  (:require [clojure.string :as str]))

(defn validate
  "Validate a specification against schema requirements.
   Returns map of {:valid? boolean :errors [strings]}"
  [prd]
  (let [errors (concat
                (validate-requirements prd)
                (validate-constraints prd)
                (validate-data-model prd)
                (validate-api-spec prd))]
    {:valid? (empty? errors)
     :errors errors
     :spec prd}))

(defn- validate-requirements [prd]
  (let [reqs (:requirements prd)]
    (cond
      (empty? reqs) ["ERROR: No requirements defined"]
      (< (count reqs) 3) ["WARNING: Fewer than 3 requirements"]
      :else [])))

(defn- validate-constraints [prd]
  (let [constraints (:constraints prd)]
    (cond
      (empty? constraints) ["WARNING: No constraints specified"]
      :else [])))

(defn- validate-data-model [prd]
  (let [model (:data-model prd)
        errors (atom [])]
    (doseq [[key val] model]
      (when (str/blank? key)
        (swap! errors conj "ERROR: Empty model key"))
      (when (str/blank? val)
        (swap! errors conj (str "ERROR: Model key '" key "' has no type"))))
    @errors))

(defn- validate-api-spec [prd]
  (let [api (:api-spec prd)
        valid-methods #{"GET" "POST" "PUT" "DELETE" "PATCH"}]
    (mapcat (fn [[endpoint _]]
              (let [[method] (str/split endpoint #" ")]
                (when-not (valid-methods method)
                  [(str "ERROR: Invalid HTTP method '" method "'")])))
            api)))

(defn report
  "Generate formatted validation report."
  [{:keys [valid? errors spec]}]
  (str (if valid?
         "✓ SPECIFICATION VALID\n"
         "✗ SPECIFICATION INVALID\n")
       "\nValidation Errors:\n"
       (if (empty? errors)
         "  None\n"
         (str/join "\n" (map #(str "  - " %) errors)))
       "\n\nSpecification:\n"
       (str "  " (str/join "\n  " 
                           [(str "Requirements: " (count (:requirements spec)))
                            (str "Constraints: " (count (:constraints spec)))
                            (str "Models: " (count (:data-model spec)))
                            (str "APIs: " (count (:api-spec spec)))])))))
