/**
 * Pyodide WebAssembly Loader
 * Handles loading and initializing Python runtime in browser
 * 
 * Features:
 * - Singleton pattern (one instance)
 * - Progress callbacks for UX
 * - CDN caching
 * - Pre-import common modules
 * 
 * @module pyodide-loader
 * @author M. Gustave & Zero
 */

let pyodideInstance = null;
let loadingPromise = null;

/**
 * Load Pyodide WASM runtime
 * @param {Function} onProgress - Progress callback (message: string) => void
 * @returns {Promise<Pyodide>} Pyodide instance
 */
export async function loadPyodide(onProgress) {
  // Return existing instance if already loaded
  if (pyodideInstance) {
    return pyodideInstance;
  }

  // Return existing promise if loading in progress
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      onProgress?.('Downloading Pyodide runtime (8MB, cached after first load)...');

      // Load from CDN (cached by browser after first load)
      const startTime = performance.now();
      pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      });

      const loadTime = ((performance.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ Pyodide loaded in ${loadTime}s`);

      onProgress?.('Loading Python standard library modules...');

      // Pre-import required modules
      await pyodideInstance.runPythonAsync(`
        import ast
        import json
        import re
        import sys
        print(f'Python {sys.version} ready in WebAssembly!')
      `);

      onProgress?.('Pyodide ready! 🐍');
      return pyodideInstance;
    } catch (error) {
      console.error('❌ Pyodide load failed:', error);
      loadingPromise = null;
      throw new Error(`Failed to load Pyodide: ${error.message}`);
    }
  })();

  return loadingPromise;
}

/**
 * Get existing Pyodide instance (must be loaded first)
 * @returns {Pyodide} Pyodide instance
 * @throws {Error} If Pyodide not loaded
 */
export function getPyodide() {
  if (!pyodideInstance) {
    throw new Error('Pyodide not loaded. Call loadPyodide() first.');
  }
  return pyodideInstance;
}

/**
 * Check if Pyodide is loaded
 * @returns {boolean} True if loaded
 */
export function isPyodideLoaded() {
  return pyodideInstance !== null;
}

/**
 * Load Python module from file
 * @param {string} modulePath - Path to Python file
 * @returns {Promise<void>}
 */
export async function loadPythonModule(modulePath) {
  const pyodide = getPyodide();
  
  try {
    const response = await fetch(modulePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${modulePath}: ${response.statusText}`);
    }
    
    const moduleCode = await response.text();
    await pyodide.runPythonAsync(moduleCode);
    console.log(`✅ Loaded Python module: ${modulePath}`);
  } catch (error) {
    console.error(`❌ Failed to load Python module ${modulePath}:`, error);
    throw error;
  }
}
