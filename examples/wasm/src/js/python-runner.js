/**
 * Python Code Runner
 * Executes Python analysis modules via Pyodide
 * 
 * @module python-runner
 * @author Zero
 */

import { getPyodide, loadPythonModule } from './pyodide-loader.js';

let modulesLoaded = false;

/**
 * Load all Python analyzer modules
 * @returns {Promise<void>}
 */
async function ensureModulesLoaded() {
  if (modulesLoaded) return;

  const modules = [
    '/src/python/ast_analyzer.py',
    '/src/python/security_scanner.py',
    '/src/python/complexity_analyzer.py',
    '/src/python/quality_checker.py',
    '/src/python/test_hints.py',
  ];

  for (const modulePath of modules) {
    await loadPythonModule(modulePath);
  }

  modulesLoaded = true;
  console.log('✅ All Python modules loaded');
}

/**
 * Run complete Python code analysis
 * @param {string} pythonCode - Python source code to analyze
 * @returns {Promise<Object>} Analysis results
 */
export async function runPythonAnalyzer(pythonCode) {
  const pyodide = getPyodide();

  // Ensure all modules are loaded
  await ensureModulesLoaded();

  try {
    // Run comprehensive analysis
    const result = await pyodide.runPythonAsync(`
import json
import ast
from ast_analyzer import analyze_code
from security_scanner import scan_security
from complexity_analyzer import analyze_complexity
from quality_checker import check_quality
from test_hints import suggest_tests

code = json.loads(${JSON.stringify(JSON.stringify(pythonCode))})

# Get basic AST analysis
analysis_result = json.loads(analyze_code(code))

if analysis_result['success']:
    tree = ast.parse(code)
    
    # Add security scan (Dmitri)
    analysis_result['security'] = scan_security(code, tree)
    
    # Add complexity analysis (Serge X.)
    analysis_result['complexity'] = analyze_complexity(code, tree)
    
    # Add quality checks (M. Gustave)
    analysis_result['quality'] = check_quality(code, tree)
    
    # Add test suggestions (Agatha)
    analysis_result['test_hints'] = suggest_tests(code, tree)

json.dumps(analysis_result, indent=2)
    `);

    return JSON.parse(result);
  } catch (error) {
    console.error('❌ Python analysis failed:', error);
    return {
      success: false,
      error: error.message,
      traceback: error.toString(),
    };
  }
}

/**
 * Run single Python analyzer module
 * @param {string} moduleName - Name of analyzer (e.g., 'security', 'complexity')
 * @param {string} pythonCode - Python source code
 * @returns {Promise<Object>} Analysis results
 */
export async function runSingleAnalyzer(moduleName, pythonCode) {
  const pyodide = getPyodide();
  await ensureModulesLoaded();

  const analyzerMap = {
    security: 'from security_scanner import scan_security; scan_security(code, ast.parse(code))',
    complexity: 'from complexity_analyzer import analyze_complexity; analyze_complexity(code, ast.parse(code))',
    quality: 'from quality_checker import check_quality; check_quality(code, ast.parse(code))',
    test_hints: 'from test_hints import suggest_tests; suggest_tests(code, ast.parse(code))',
  };

  const analyzerCall = analyzerMap[moduleName];
  if (!analyzerCall) {
    throw new Error(`Unknown analyzer: ${moduleName}`);
  }

  try {
    const result = await pyodide.runPythonAsync(`
import json
import ast
code = json.loads(${JSON.stringify(JSON.stringify(pythonCode))})
result = ${analyzerCall}
json.dumps(result, indent=2)
    `);

    return JSON.parse(result);
  } catch (error) {
    console.error(`❌ ${moduleName} analyzer failed:`, error);
    return { error: error.message };
  }
}

/**
 * Execute arbitrary Python code (for testing)
 * @param {string} pythonCode - Python code to execute
 * @returns {Promise<string>} Python output
 */
export async function executePython(pythonCode) {
  const pyodide = getPyodide();

  try {
    const result = await pyodide.runPythonAsync(pythonCode);
    return String(result);
  } catch (error) {
    console.error('❌ Python execution failed:', error);
    throw error;
  }
}
