/**
 * Agatha - Testing Specialist Agent
 * Suggests test cases and identifies untested code
 * 
 * Features:
 * - Identify untested functions
 * - Suggest edge cases
 * - Test coverage gaps
 * - Test organization recommendations
 * 
 * @module agents/agatha
 * @author Agatha (Testing Specialist)
 */

import { BaseAgent } from './base-agent.js';

export class AgathaAgent extends BaseAgent {
  constructor() {
    super('Agatha', 'Testing Specialist', '🧪', '#FFB6C1');
    this.suggestions = [];
  }

  analyze(analysisData) {
    if (!analysisData.test_hints) {
      this.suggestions = [];
      this.results = { suggestions: [], count: 0 };
      return;
    }

    this.suggestions = analysisData.test_hints;
    this.results = {
      suggestions: this.suggestions,
      count: this.suggestions.length,
    };
  }

  renderResults(container) {
    if (!this.results) {
      container.innerHTML = this.createErrorMessage('No test analysis data available');
      return;
    }

    if (this.suggestions.length === 0) {
      container.innerHTML = this.createSuccessMessage(
        'Code has good test coverage patterns!'
      );
      return;
    }

    const summary = `
      <div class="test-summary">
        <h3>Test Suggestions</h3>
        <p>Found ${this.suggestions.length} testing opportunity(ies)</p>
      </div>
    `;

    const suggestionsHtml = this.suggestions
      .map((suggestion) => this.createSuggestionCard(suggestion))
      .join('');

    container.innerHTML = `
      ${summary}
      <div class="suggestions-list">
        ${suggestionsHtml}
      </div>
      <div class="agent-footer">
        <p><em>"Good tests catch bugs before customers do."</em></p>
        <p><em>— Agatha, Testing Specialist</em></p>
      </div>
    `;
  }

  /**
   * Create suggestion card HTML
   * @param {Object} suggestion - Test suggestion
   * @returns {string} HTML
   */
  createSuggestionCard(suggestion) {
    return `
      <div class="suggestion-card">
        <div class="suggestion-header">
          <span class="suggestion-type">${suggestion.type || 'Test Suggestion'}</span>
          ${suggestion.function_name ? `<span class="function-name">${suggestion.function_name}</span>` : ''}
        </div>
        <p class="suggestion-description">${suggestion.description}</p>
        ${suggestion.test_cases && suggestion.test_cases.length > 0 ? `
          <div class="test-cases">
            <strong>Suggested test cases:</strong>
            <ul>
              ${suggestion.test_cases.map((tc) => `<li>${this.escapeHtml(tc)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${suggestion.example_code ? `
          <pre class="code-snippet"><code>${this.escapeHtml(suggestion.example_code)}</code></pre>
        ` : ''}
      </div>
    `;
  }
}
