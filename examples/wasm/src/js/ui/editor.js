/**
 * Monaco Editor Setup
 * Configures VS Code-like editor with Python support
 * 
 * @module ui/editor
 * @author Zero
 */

import * as monaco from 'monaco-editor';

let editorInstance = null;

/**
 * Initialize Monaco editor
 * @param {string} containerId - DOM container ID
 * @param {Function} onChange - Change callback
 * @returns {monaco.editor.IStandaloneCodeEditor} Editor instance
 */
export function initializeEditor(containerId, onChange) {
  const container = document.getElementById(containerId);

  if (!container) {
    throw new Error(`Container #${containerId} not found`);
  }

  editorInstance = monaco.editor.create(container, {
    value: getDefaultCode(),
    language: 'python',
    theme: 'vs-dark',
    automaticLayout: true,
    fontSize: 14,
    fontFamily: "'Courier New', monospace",
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    glyphMargin: true,
    folding: true,
    renderWhitespace: 'boundary',
    wordWrap: 'on',
  });

  // Register change handler
  if (onChange) {
    editorInstance.onDidChangeModelContent(() => {
      onChange(editorInstance.getValue());
      updateEditorStats();
    });
  }

  updateEditorStats();
  return editorInstance;
}

/**
 * Get default example code
 * @returns {string} Python code
 */
function getDefaultCode() {
  return `# Python AST Playground
# Write Python code and analyze it with AI agents!

def greet(name: str) -> str:
    """Greet someone by name."""
    if not name:
        return "Hello, stranger!"
    return f"Hello, {name}!"

class Calculator:
    """Simple calculator class."""
    
    def add(self, a: int, b: int) -> int:
        """Add two numbers."""
        return a + b
    
    def multiply(self, a: int, b: int) -> int:
        """Multiply two numbers."""
        return a * b
    
    def divide(self, a: float, b: float) -> float:
        """Divide two numbers."""
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b

# Example usage
if __name__ == "__main__":
    calc = Calculator()
    result = calc.add(5, 3)
    greeting = greet("World")
    print(greeting)
    print(f"5 + 3 = {result}")
`;
}

/**
 * Update editor statistics display
 */
function updateEditorStats() {
  if (!editorInstance) return;

  const model = editorInstance.getModel();
  const lineCount = model.getLineCount();
  const charCount = model.getValue().length;
  const selection = editorInstance.getSelection();
  const selectedText = model.getValueInRange(selection);

  const lineCountEl = document.getElementById('line-count');
  const charCountEl = document.getElementById('char-count');

  if (lineCountEl) lineCountEl.textContent = `Lines: ${lineCount}`;
  if (charCountEl) charCountEl.textContent = `Characters: ${charCount}`;

  if (selectedText) {
    const selectedLines = selectedText.split('\n').length;
    if (lineCountEl) {
      lineCountEl.textContent += ` (${selectedLines} selected)`;
    }
  }
}

/**
 * Get current editor code
 * @returns {string} Python code
 */
export function getEditorCode() {
  return editorInstance?.getValue() || '';
}

/**
 * Set editor code
 * @param {string} code - Python code
 */
export function setEditorCode(code) {
  editorInstance?.setValue(code);
}

/**
 * Get editor instance
 * @returns {monaco.editor.IStandaloneCodeEditor} Editor
 */
export function getEditor() {
  return editorInstance;
}

/**
 * Load example code
 * @param {string} exampleName - Example identifier
 */
export function loadExample(exampleName) {
  const examples = {
    default: getDefaultCode(),
    security: getSecurityExample(),
    complexity: getComplexityExample(),
    quality: getQualityExample(),
  };

  const code = examples[exampleName] || examples.default;
  setEditorCode(code);
}

/**
 * Get security example (with vulnerabilities)
 * @returns {string} Python code
 */
function getSecurityExample() {
  return `# Security Example (intentional vulnerabilities for testing)
import os
import pickle

def execute_user_code(user_input):
    """UNSAFE: Uses eval() on user input"""
    result = eval(user_input)  # HIGH severity
    return result

def query_database(user_id):
    """UNSAFE: SQL injection vulnerability"""
    query = f"SELECT * FROM users WHERE id = {user_id}"  # CRITICAL
    return db.execute(query)

def load_data(filename):
    """UNSAFE: Arbitrary file access"""
    path = f"/data/{filename}"  # Path traversal risk
    with open(path, 'rb') as f:
        data = pickle.load(f)  # Unsafe deserialization
    return data

# Hardcoded credentials (CRITICAL)
API_KEY = "sk_live_1234567890abcdef"
PASSWORD = "admin123"
`;
}

/**
 * Get complexity example (high complexity code)
 * @returns {string} Python code
 */
function getComplexityExample() {
  return `# Complexity Example (intentionally complex)

def process_data(data, options):
    """Highly complex function with deep nesting"""
    results = []
    
    for item in data:
        if item.get('active'):
            if item.get('type') == 'A':
                for sub in item.get('children', []):
                    if sub.get('valid'):
                        if sub.get('score') > 50:
                            if options.get('strict'):
                                if sub.get('verified'):
                                    results.append(sub)
                            else:
                                results.append(sub)
    
    return results

def calculate_score(value):
    """High cyclomatic complexity"""
    if value < 0:
        return 0
    elif value < 10:
        return value * 2
    elif value < 20:
        return value * 3
    elif value < 30:
        return value * 4
    elif value < 40:
        return value * 5
    elif value < 50:
        return value * 6
    else:
        return value * 10
`;
}

/**
 * Get quality example (poor quality code)
 * @returns {string} Python code
 */
function getQualityExample() {
  return `# Quality Example (poor code quality)

def f(x,y,z):  # No docstring, unclear name
    a=x+y  # No spaces around operators
    b=a*z
    return b

class c:  # Class name should be PascalCase
    def __init__(self,value):
        self.v=value  # Unclear variable name
    
    def DoSomething(self):  # Method should be snake_case
        VeryLongVariableNameThatIsNotNecessary=self.v*2  # PascalCase for variable
        return VeryLongVariableNameThatIsNotNecessary
`;
}
