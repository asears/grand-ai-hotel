/**
 * WASM Python Playground - Main Application
 * 
 * Integrates Pyodide WebAssembly Python runtime with Monaco editor
 * and AI agent analysis for interactive Python code analysis.
 * 
 * Features:
 * - Real-time Python AST parsing
 * - Security vulnerability detection (Dmitri)
 * - Code quality analysis (M. Gustave)
 * - Complexity metrics (Serge X.)
 * - Test suggestions (Agatha)
 * - Type hint analysis (Ludwig)
 * 
 * @module main
 * @author M. Gustave, Zero, and the Grand Budapest Team
 */

import { loadPyodide } from './pyodide-loader.js';
import { runPythonAnalyzer } from './python-runner.js';
import { initializeEditor, getEditorCode, loadExample } from './ui/editor.js';
import { DmitriAgent } from './agents/dmitri.js';
import { GustaveAgent } from './agents/gustave.js';
import { SergeAgent } from './agents/serge.js';
import { AgathaAgent } from './agents/agatha.js';
import { LudwigAgent } from './agents/ludwig.js';

// Application state
const state = {
  pyodideLoaded: false,
  currentAnalysis: null,
  agents: {},
};

// Initialize all agents
function initializeAgents() {
  state.agents = {
    dmitri: new DmitriAgent(),
    gustave: new GustaveAgent(),
    serge: new SergeAgent(),
    agatha: new AgathaAgent(),
    ludwig: new LudwigAgent(),
  };
}

/**
 * Initialize application
 */
async function init() {
  console.log('🎨 Initializing Grand Budapest Python Playground...');

  // Initialize agents
  initializeAgents();

  // Initialize Monaco editor
  const editor = initializeEditor('editor-container', () => {
    // Clear previous analysis when code changes
    clearResults();
  });

  // Setup UI event listeners
  setupEventListeners();

  // Load Pyodide in background
  loadPyodideAsync();

  console.log('✅ Application initialized');
}

/**
 * Load Pyodide asynchronously
 */
async function loadPyodideAsync() {
  const statusEl = document.getElementById('pyodide-status');
  
  try {
    updateStatus('Loading Python runtime...', 'loading');
    
    await loadPyodide((message) => {
      updateStatus(message, 'loading');
    });

    state.pyodideLoaded = true;
    updateStatus('Python ready! 🐍', 'success');
    
    // Enable analyze button
    document.getElementById('analyze-btn').disabled = false;
  } catch (error) {
    console.error('❌ Pyodide initialization failed:', error);
    updateStatus('Failed to load Python runtime', 'error');
  }
}

/**
 * Setup UI event listeners
 */
function setupEventListeners() {
  // Analyze button
  const analyzeBtn = document.getElementById('analyze-btn');
  analyzeBtn.addEventListener('click', handleAnalyze);

  // Example selector
  const exampleSelect = document.getElementById('example-select');
  if (exampleSelect) {
    exampleSelect.addEventListener('change', (e) => {
      loadExample(e.target.value);
    });
  }

  // Tab navigation
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });

  // Agent cards
  const agentCards = document.querySelectorAll('.agent-card');
  agentCards.forEach((card) => {
    card.addEventListener('click', () => {
      const agentName = card.dataset.agent;
      showAgentResults(agentName);
    });
  });
}

/**
 * Handle analyze button click
 */
async function handleAnalyze() {
  if (!state.pyodideLoaded) {
    alert('Python runtime not loaded yet. Please wait...');
    return;
  }

  const code = getEditorCode();
  if (!code.trim()) {
    alert('Please enter some Python code to analyze.');
    return;
  }

  const analyzeBtn = document.getElementById('analyze-btn');
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing...';

  try {
    updateStatus('Running analysis...', 'loading');

    // Run Python analysis
    const startTime = performance.now();
    const results = await runPythonAnalyzer(code);
    const duration = ((performance.now() - startTime) / 1000).toFixed(2);

    if (!results.success) {
      throw new Error(results.error || 'Analysis failed');
    }

    state.currentAnalysis = results;

    // Run agent analysis
    Object.values(state.agents).forEach((agent) => {
      agent.analyze(results);
    });

    // Display results
    displayResults(results);
    updateMetrics(results);
    updateAgentCards();

    updateStatus(`Analysis complete in ${duration}s`, 'success');
    console.log('✅ Analysis results:', results);
  } catch (error) {
    console.error('❌ Analysis error:', error);
    updateStatus(`Analysis failed: ${error.message}`, 'error');
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze Code';
  }
}

/**
 * Display analysis results
 * @param {Object} results - Analysis results
 */
function displayResults(results) {
  // Display AST structure
  displayASTStructure(results.structure);

  // Display metrics
  displayMetrics(results.metrics);

  // Switch to Overview tab
  switchTab('overview');
}

/**
 * Display AST structure
 * @param {Object} structure - AST structure
 */
function displayASTStructure(structure) {
  const container = document.getElementById('ast-tree');
  
  if (!structure) {
    container.innerHTML = '<p class="error-message">No AST data available</p>';
    return;
  }

  const html = `
    <div class="ast-summary">
      <h3>Code Structure</h3>
      <div class="structure-stats">
        <div class="stat">
          <span class="stat-value">${structure.functions?.length || 0}</span>
          <span class="stat-label">Functions</span>
        </div>
        <div class="stat">
          <span class="stat-value">${structure.classes?.length || 0}</span>
          <span class="stat-label">Classes</span>
        </div>
        <div class="stat">
          <span class="stat-value">${structure.imports?.length || 0}</span>
          <span class="stat-label">Imports</span>
        </div>
      </div>
    </div>

    ${structure.functions && structure.functions.length > 0 ? `
      <h4>Functions</h4>
      <ul class="ast-list">
        ${structure.functions.map((f) => `
          <li>
            <code>${f.name}</code> 
            ${f.args ? `(${f.args.map((a) => a.arg).join(', ')})` : '()'}
            ${f.return_annotation ? ` → ${f.return_annotation}` : ''}
          </li>
        `).join('')}
      </ul>
    ` : ''}

    ${structure.classes && structure.classes.length > 0 ? `
      <h4>Classes</h4>
      <ul class="ast-list">
        ${structure.classes.map((c) => `
          <li>
            <code>${c.name}</code>
            ${c.methods?.length ? ` (${c.methods.length} methods)` : ''}
          </li>
        `).join('')}
      </ul>
    ` : ''}

    ${structure.imports && structure.imports.length > 0 ? `
      <h4>Imports</h4>
      <ul class="ast-list">
        ${structure.imports.map((imp) => `<li><code>${imp}</code></li>`).join('')}
      </ul>
    ` : ''}
  `;

  container.innerHTML = html;
}

/**
 * Display code metrics
 * @param {Object} metrics - Code metrics
 */
function displayMetrics(metrics) {
  if (!metrics) return;

  const updates = [
    { id: 'metric-loc', value: metrics.total_lines || 0 },
    { id: 'metric-functions', value: metrics.function_count || 0 },
    { id: 'metric-classes', value: metrics.class_count || 0 },
    { id: 'metric-complexity', value: metrics.avg_complexity?.toFixed(1) || '0.0' },
    { id: 'metric-imports', value: metrics.import_count || 0 },
    { id: 'metric-nesting', value: metrics.max_nesting_depth || 0 },
  ];

  updates.forEach(({ id, value }) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

/**
 * Update agent cards with results
 */
function updateAgentCards() {
  Object.entries(state.agents).forEach(([name, agent]) => {
    const card = document.querySelector(`.agent-card[data-agent="${name}"]`);
    if (!card) return;

    const badge = card.querySelector('.agent-badge');
    if (!badge) return;

    if (!agent.results || agent.results.count === 0) {
      badge.textContent = '✅';
      badge.className = 'agent-badge success';
    } else {
      badge.textContent = agent.results.count || '0';
      badge.className = 'agent-badge warning';
    }
  });
}

/**
 * Show agent-specific results
 * @param {string} agentName - Agent identifier
 */
function showAgentResults(agentName) {
  const agent = state.agents[agentName];
  if (!agent) return;

  const container = document.getElementById('agent-results');
  agent.renderResults(container);

  // Switch to Agent Analysis tab
  switchTab('agents');
}

/**
 * Switch active tab
 * @param {string} tabId - Tab identifier
 */
function switchTab(tabId) {
  // Update tab buttons
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });

  // Update tab panels
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `${tabId}-panel`);
  });
}

/**
 * Clear analysis results
 */
function clearResults() {
  state.currentAnalysis = null;
  Object.values(state.agents).forEach((agent) => agent.clear());
  
  // Reset UI
  const containers = ['ast-tree', 'agent-results', 'metrics-panel'];
  containers.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });
}

/**
 * Update status message
 * @param {string} message - Status message
 * @param {string} type - Status type (loading, success, error)
 */
function updateStatus(message, type = 'info') {
  const statusEl = document.getElementById('status-message');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;
}

/**
 * Update metrics display
 * @param {Object} results - Analysis results
 */
function updateMetrics(results) {
  displayMetrics(results.metrics);
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for debugging
window.playgroundState = state;
