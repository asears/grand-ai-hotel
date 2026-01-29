/**
 * M. Gustave - Quality Auditor Agent
 * Evaluates code quality and style compliance
 * 
 * Checks for:
 * - PEP 8 compliance
 * - Docstring presence
 * - Variable naming conventions
 * - Function length
 * - Code organization
 * 
 * @module agents/gustave
 * @author M. Gustave (Quality Specialist)
 */

import { BaseAgent } from './base-agent.js';

export class GustaveAgent extends BaseAgent {
  constructor() {
    super('M. Gustave', 'Quality Auditor', '🎩', '#C5B358');
    this.issues = [];
  }

  analyze(analysisData) {
    if (!analysisData.quality) {
      this.issues = [];
      this.results = { issues: [], score: 100 };
      return;
    }

    this.issues = analysisData.quality;
    this.results = {
      issues: this.issues,
      count: this.issues.length,
      score: this.calculateQualityScore(),
    };
  }

  renderResults(container) {
    if (!this.results) {
      container.innerHTML = this.createErrorMessage('No analysis data available');
      return;
    }

    if (this.issues.length === 0) {
      container.innerHTML = this.createSuccessMessage(
        'Code quality is excellent! Well done, my friend.'
      );
      return;
    }

    const score = this.results.score;
    const scoreClass = score >= 80 ? 'good' : score >= 60 ? 'medium' : 'poor';

    const summary = `
      <div class="quality-summary">
        <h3>Code Quality Score: <span class="score ${scoreClass}">${score}/100</span></h3>
        <p>Found ${this.issues.length} quality issue(s)</p>
      </div>
    `;

    const issuesHtml = this.issues.map((issue) => this.createIssueCard(issue)).join('');

    container.innerHTML = `
      ${summary}
      <div class="issues-list">
        ${issuesHtml}
      </div>
      <div class="agent-footer">
        <p><em>"Rudeness is merely the expression of fear. People fear they won't get what they want."</em></p>
        <p><em>— M. Gustave, Quality Auditor</em></p>
      </div>
    `;
  }

  /**
   * Calculate quality score (0-100)
   * @returns {number} Score
   */
  calculateQualityScore() {
    if (!this.issues || this.issues.length === 0) return 100;

    const weights = {
      CRITICAL: 20,
      HIGH: 10,
      MEDIUM: 5,
      LOW: 2,
      INFO: 1,
    };

    const penalty = this.issues.reduce((sum, issue) => {
      return sum + (weights[issue.severity] || 0);
    }, 0);

    return Math.max(0, 100 - penalty);
  }
}
