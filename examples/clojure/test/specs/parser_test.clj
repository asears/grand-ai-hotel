(ns specs.parser-test
  (:require [clojure.test :refer [deftest is testing]]
            [clojure.test.check :as tc]
            [clojure.test.check.generators :as gen]
            [clojure.test.check.properties :as prop]
            [clojure.test.check.clojure-test :refer [defspec]]
            [specs.parser :as parser]))

;; Unit Tests

(deftest test-extract-requirements
  (testing "Extract requirements from markdown sections"
    (let [content "## Requirements\n- User authentication\n- Password hashing\n## Other"
          result (parser/extract-requirements content)]
      (is (= 2 (count result)))
      (is (some #(= % "User authentication") result))
      (is (some #(= % "Password hashing") result)))))

(deftest test-extract-constraints
  (testing "Extract constraints from markdown"
    (let [content "## Constraints\n- Must use HTTPS\n- Max 100 requests/min"
          result (parser/extract-constraints content)]
      (is (= 2 (count result)))
      (is (some #(= % "Must use HTTPS") result)))))

(deftest test-parse-markdown-prd
  (testing "Parse complete PRD structure"
    (let [content "# Authentication Service\n## Requirements\n- JWT tokens\n## Constraints\n- HTTPS only"
          result (parser/parse-markdown-prd content)]
      (is (map? result))
      (is (contains? result :title))
      (is (contains? result :requirements))
      (is (contains? result :constraints))
      (is (= "Authentication Service" (:title result)))
      (is (seq (:requirements result))))))

(deftest test-extract-data-model
  (testing "Extract data model from markdown"
    (let [content "## Data Model\n- User: {id, email, password_hash}\n- Session: {token, expires}"
          result (parser/extract-data-model content)]
      (is (= 2 (count result)))
      (is (some #(.contains % "User:") result)))))

(deftest test-extract-api-spec
  (testing "Extract API endpoints from markdown"
    (let [content "## API Endpoints\n- POST /auth/login\n- POST /auth/logout"
          result (parser/extract-api-spec content)]
      (is (= 2 (count result)))
      (is (some #(.contains % "POST /auth/login") result)))))

;; Property-Based Tests

(defspec parse-prd-always-returns-map 100
  (prop/for-all [content gen/string-ascii]
    (let [result (parser/parse-markdown-prd content)]
      (map? result))))

(defspec parse-prd-has-required-keys 100
  (prop/for-all [content gen/string-ascii]
    (let [result (parser/parse-markdown-prd content)
          required-keys #{:title :requirements :constraints :data-model :api-spec}]
      (every? #(contains? result %) required-keys))))

(defspec extract-requirements-returns-vector 100
  (prop/for-all [content gen/string-ascii]
    (vector? (parser/extract-requirements content))))

(defspec extract-constraints-returns-vector 100
  (prop/for-all [content gen/string-ascii]
    (vector? (parser/extract-constraints content))))

;; Custom Generators

(def gen-markdown-requirement
  (gen/fmap #(str "- " %) gen/string-ascii))

(def gen-requirements-section
  (gen/fmap
   (fn [reqs]
     (str "## Requirements\n" (clojure.string/join "\n" reqs)))
   (gen/vector gen-markdown-requirement 1 10)))

(defspec requirements-section-parses-correctly 50
  (prop/for-all [section gen-requirements-section]
    (let [result (parser/extract-requirements section)]
      (and (vector? result)
           (every? string? result)
           (pos? (count result))))))

;; Idempotence Tests

(deftest test-parse-idempotence
  (testing "Parsing same content twice yields same result"
    (let [content "# Test\n## Requirements\n- Feature A"
          result1 (parser/parse-markdown-prd content)
          result2 (parser/parse-markdown-prd content)]
      (is (= result1 result2)))))

;; Edge Cases

(deftest test-empty-content
  (testing "Parsing empty content"
    (let [result (parser/parse-markdown-prd "")]
      (is (map? result))
      (is (empty? (:requirements result)))
      (is (empty? (:constraints result))))))

(deftest test-malformed-markdown
  (testing "Gracefully handle malformed markdown"
    (let [content "Random text without proper structure ##"
          result (parser/parse-markdown-prd content)]
      (is (map? result))
      (is (contains? result :requirements)))))

(deftest test-multiple-requirement-sections
  (testing "Handle multiple Requirements sections"
    (let [content "## Requirements\n- A\n## Other\n## Requirements\n- B"
          result (parser/extract-requirements content)]
      (is (vector? result))
      ;; Should aggregate all requirements
      (is (or (some #(= "A" %) result)
              (some #(= "B" %) result))))))

;; Integration-style Tests

(deftest test-parse-sample-file
  (testing "Parse actual sample requirements file"
    (let [content (slurp "sample-requirements.md")
          result (parser/parse-prd "sample-requirements.md")]
      (is (map? result))
      (is (= "User Authentication Service" (:title result)))
      (is (seq (:requirements result)))
      (is (seq (:constraints result))))))

;; Run property-based tests manually
(comment
  ;; Run a specific number of tests
  (tc/quick-check 1000 
    (prop/for-all [content gen/string-ascii]
      (map? (parser/parse-markdown-prd content))))
  
  ;; Run with custom seed for reproducibility
  (tc/quick-check 100
    (prop/for-all [content gen/string-ascii]
      (vector? (parser/extract-requirements content)))
    :seed 1234567890))
