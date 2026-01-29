/**
 * Base Agent Class
 * Abstract class for all AI analysis agents
 * 
 * @module agents/base-agent
 * @author M. Gustave (Architect)
 */

export class BaseAgent {
  /**
   * @param {string} name - Agent name (e.g., "M. Gustave")
   * @param {string} role - Agent role (e.g., "Quality Auditor")
   * @param {string} icon - Emoji icon
   * @param {string} color - Agent color (Wes Anderson palette)
   */
  constructor(name, role, icon, color) {
    this.name = name;
    this.role = role;
    this.icon = icon;
    this.color = color;
    this.results = null;
    this.lastAnalyzedCode = null;
  }

  /**
   * Analyze code (must be implemented by subclass)
   * @param {Object} analysisData - Complete analysis data from Python
   * @abstract
   */
  analyze(analysisData) {
    throw new Error(`${this.name}: analyze() must be implemented by subclass`);
  }

  /**
   * Render results to DOM (must be implemented by subclass)
   * @param {HTMLElement} container - DOM container element
   * @abstract
   */
  renderResults(container) {
    throw new Error(`${this.name}: renderResults() must be implemented by subclass`);
  }

  /**
   * Get agent summary
   * @returns {Object} Summary data
   */
  getSummary() {
    return {
      name: this.name,
      role: this.role,
      icon: this.icon,
      color: this.color,
      hasResults: this.results !== null,
    };
  }

  /**
   * Clear analysis results
   */
  clear() {
    this.results = null;
    this.lastAnalyzedCode = null;
  }

  /**
   * Create severity badge HTML
   * @param {string} severity - CRITICAL, HIGH, MEDIUM, LOW, INFO
   * @returns {string} HTML
   */
  createSeverityBadge(severity) {
    const severityClass = severity.toLowerCase();
    const severityIcons = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🔵',
      info: '⚪',
    };
    const icon = severityIcons[severityClass] || '⚪';
    return `<span class="severity-badge ${severityClass}">${icon} ${severity}</span>`;
  }

  /**
   * Create issue card HTML
   * @param {Object} issue - Issue object with title, description, severity, etc.
   * @returns {string} HTML
   */
  createIssueCard(issue) {
    return `
      <div class="issue-card issue-${issue.severity.toLowerCase()}">
        <div class="issue-header">
          ${this.createSeverityBadge(issue.severity)}
          <span class="issue-title">${issue.title}</span>
          ${issue.lineno ? `<span class="issue-line">Line ${issue.lineno}</span>` : ''}
        </div>
        <p class="issue-description">${issue.description}</p>
        ${issue.recommendation ? `
          <p class="issue-recommendation">
            <strong>Recommendation:</strong> ${issue.recommendation}
          </p>
        ` : ''}
        ${issue.code_snippet ? `
          <pre class="code-snippet"><code>${this.escapeHtml(issue.code_snippet)}</code></pre>
        ` : ''}
      </div>
    `;
  }

  /**
   * Escape HTML characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Create success message HTML
   * @param {string} message - Success message
   * @returns {string} HTML
   */
  createSuccessMessage(message) {
    return `
      <div class="success-message">
        ✅ ${message}
      </div>
    `;
  }

  /**
   * Create error message HTML
   * @param {string} message - Error message
   * @returns {string} HTML
   */
  createErrorMessage(message) {
    return `
      <div class="error-message">
        ❌ ${message}
      </div>
    `;
  }
}
