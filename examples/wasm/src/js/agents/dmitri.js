/**
 * Dmitri - Security Auditor Agent
 * Identifies security vulnerabilities in Python code
 * 
 * Checks for:
 * - Dangerous functions (eval, exec, pickle)
 * - SQL injection vulnerabilities
 * - Path traversal issues
 * - Hardcoded secrets
 * - Weak cryptography
 * - Shell injection
 * 
 * @module agents/dmitri
 * @author Dmitri (Security Specialist)
 */

import { BaseAgent } from './base-agent.js';

export class DmitriAgent extends BaseAgent {
  constructor() {
    super('Dmitri', 'Security Auditor', '🔒', '#800020');
    this.issues = [];
  }

  analyze(analysisData) {
    if (!analysisData.security) {
      this.issues = [];
      this.results = { issues: [], count: 0 };
      return;
    }

    this.issues = analysisData.security;
    this.results = {
      issues: this.issues,
      count: this.issues.length,
      criticalCount: this.issues.filter((i) => i.severity === 'CRITICAL').length,
      highCount: this.issues.filter((i) => i.severity === 'HIGH').length,
      mediumCount: this.issues.filter((i) => i.severity === 'MEDIUM').length,
      lowCount: this.issues.filter((i) => i.severity === 'LOW').length,
    };
  }

  renderResults(container) {
    if (!this.results) {
      container.innerHTML = this.createErrorMessage('No analysis data available');
      return;
    }

    if (this.issues.length === 0) {
      container.innerHTML = this.createSuccessMessage(
        'No security issues found. Code looks secure!'
      );
      return;
    }

    const summary = `
      <div class="issues-summary">
        <h3>Found ${this.issues.length} security issue(s)</h3>
        <div class="severity-counts">
          ${this.results.criticalCount > 0 ? `<span class="count critical">🔴 ${this.results.criticalCount} Critical</span>` : ''}
          ${this.results.highCount > 0 ? `<span class="count high">🟠 ${this.results.highCount} High</span>` : ''}
          ${this.results.mediumCount > 0 ? `<span class="count medium">🟡 ${this.results.mediumCount} Medium</span>` : ''}
          ${this.results.lowCount > 0 ? `<span class="count low">🔵 ${this.results.lowCount} Low</span>` : ''}
        </div>
      </div>
    `;

    const issuesHtml = this.issues.map((issue) => this.createIssueCard(issue)).join('');

    container.innerHTML = `
      ${summary}
      <div class="issues-list">
        ${issuesHtml}
      </div>
      <div class="agent-footer">
        <p><em>— Dmitri, Security Auditor</em></p>
      </div>
    `;
  }

  /**
   * Get security score (0-100)
   * @returns {number} Score
   */
  getSecurityScore() {
    if (!this.results) return 100;

    const weights = {
      CRITICAL: 25,
      HIGH: 15,
      MEDIUM: 5,
      LOW: 2,
    };

    const penalty = this.issues.reduce((sum, issue) => {
      return sum + (weights[issue.severity] || 0);
    }, 0);

    return Math.max(0, 100 - penalty);
  }
}
