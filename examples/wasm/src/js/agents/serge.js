/**
 * Serge X. - Performance Analyst Agent
 * Analyzes code complexity and performance characteristics
 * 
 * Metrics:
 * - Cyclomatic complexity
 * - Time complexity estimation
 * - Nesting depth
 * - Function length
 * - Performance hotspots
 * 
 * @module agents/serge
 * @author Serge X. (Performance Specialist)
 */

import { BaseAgent } from './base-agent.js';

export class SergeAgent extends BaseAgent {
  constructor() {
    super('Serge X.', 'Performance Analyst', '📊', '#4B5320');
    this.metrics = null;
  }

  analyze(analysisData) {
    if (!analysisData.complexity) {
      this.metrics = null;
      this.results = { metrics: {}, issues: [] };
      return;
    }

    this.metrics = analysisData.complexity;
    this.results = {
      metrics: this.metrics,
      issues: this.identifyPerformanceIssues(),
    };
  }

  renderResults(container) {
    if (!this.results || !this.metrics) {
      container.innerHTML = this.createErrorMessage('No complexity data available');
      return;
    }

    const metricsHtml = `
      <div class="metrics-grid">
        <div class="metric-card">
          <h4>Cyclomatic Complexity</h4>
          <p class="metric-value ${this.getComplexityClass(this.metrics.avg_complexity)}">
            ${this.metrics.avg_complexity?.toFixed(1) || 'N/A'}
          </p>
          <p class="metric-label">Average per function</p>
        </div>
        <div class="metric-card">
          <h4>Max Complexity</h4>
          <p class="metric-value ${this.getComplexityClass(this.metrics.max_complexity)}">
            ${this.metrics.max_complexity || 'N/A'}
          </p>
          <p class="metric-label">Highest function</p>
        </div>
        <div class="metric-card">
          <h4>Max Nesting</h4>
          <p class="metric-value ${this.getNestingClass(this.metrics.max_nesting_depth)}">
            ${this.metrics.max_nesting_depth || 'N/A'}
          </p>
          <p class="metric-label">Deepest nesting level</p>
        </div>
        <div class="metric-card">
          <h4>Functions</h4>
          <p class="metric-value">${this.metrics.total_functions || 0}</p>
          <p class="metric-label">Total count</p>
        </div>
      </div>
    `;

    const issuesHtml = this.results.issues.length > 0
      ? `
        <h3>Performance Concerns</h3>
        <div class="issues-list">
          ${this.results.issues.map((issue) => this.createIssueCard(issue)).join('')}
        </div>
      `
      : this.createSuccessMessage('No performance issues detected.');

    container.innerHTML = `
      <h3>Complexity Analysis</h3>
      ${metricsHtml}
      ${issuesHtml}
      <div class="agent-footer">
        <p><em>— Serge X., Performance Analyst</em></p>
      </div>
    `;
  }

  /**
   * Identify performance issues based on metrics
   * @returns {Array<Object>} Issues
   */
  identifyPerformanceIssues() {
    const issues = [];

    if (this.metrics.max_complexity > 10) {
      issues.push({
        severity: this.metrics.max_complexity > 20 ? 'HIGH' : 'MEDIUM',
        title: 'High Cyclomatic Complexity',
        description: `Maximum complexity of ${this.metrics.max_complexity} exceeds recommended limit of 10.`,
        recommendation: 'Consider breaking down complex functions into smaller, focused functions.',
      });
    }

    if (this.metrics.max_nesting_depth > 4) {
      issues.push({
        severity: this.metrics.max_nesting_depth > 6 ? 'HIGH' : 'MEDIUM',
        title: 'Deep Nesting Detected',
        description: `Maximum nesting depth of ${this.metrics.max_nesting_depth} exceeds recommended limit of 4.`,
        recommendation: 'Reduce nesting by using early returns, guard clauses, or helper functions.',
      });
    }

    return issues;
  }

  /**
   * Get CSS class for complexity value
   * @param {number} complexity - Complexity value
   * @returns {string} CSS class
   */
  getComplexityClass(complexity) {
    if (complexity <= 5) return 'good';
    if (complexity <= 10) return 'medium';
    return 'poor';
  }

  /**
   * Get CSS class for nesting depth
   * @param {number} depth - Nesting depth
   * @returns {string} CSS class
   */
  getNestingClass(depth) {
    if (depth <= 3) return 'good';
    if (depth <= 5) return 'medium';
    return 'poor';
  }
}
