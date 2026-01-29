/**
 * Ludwig - Type Guardian Agent
 * Analyzes type hints and type safety
 * 
 * Checks for:
 * - Missing type hints
 * - Inconsistent type usage
 * - Type annotation completeness
 * - Return type specifications
 * 
 * @module agents/ludwig
 * @author Ludwig (Type Guardian)
 */

import { BaseAgent } from './base-agent.js';

export class LudwigAgent extends BaseAgent {
  constructor() {
    super('Ludwig', 'Type Guardian', '🛡️', '#36454F');
    this.issues = [];
  }

  analyze(analysisData) {
    // Ludwig analyzes type hints from structure data
    if (!analysisData.structure) {
      this.issues = [];
      this.results = { issues: [], score: 0 };
      return;
    }

    this.analyzeTypeHints(analysisData.structure);
    this.results = {
      issues: this.issues,
      count: this.issues.length,
      score: this.calculateTypeScore(analysisData.structure),
    };
  }

  /**
   * Analyze type hints in code structure
   * @param {Object} structure - Code structure from AST
   */
  analyzeTypeHints(structure) {
    this.issues = [];

    if (!structure.functions || structure.functions.length === 0) {
      return;
    }

    let functionsWithoutTypes = 0;
    let functionsWithoutReturnType = 0;
    let totalParams = 0;
    let paramsWithoutTypes = 0;

    structure.functions.forEach((func) => {
      const hasAnyTypeHints =
        func.args?.some((arg) => arg.annotation) || func.return_annotation;

      if (!hasAnyTypeHints) {
        functionsWithoutTypes++;
      }

      if (!func.return_annotation) {
        functionsWithoutReturnType++;
      }

      if (func.args) {
        func.args.forEach((arg) => {
          if (arg.arg === 'self' || arg.arg === 'cls') return;
          totalParams++;
          if (!arg.annotation) {
            paramsWithoutTypes++;
          }
        });
      }
    });

    if (functionsWithoutTypes > 0) {
      this.issues.push({
        severity: 'MEDIUM',
        title: 'Missing Type Hints',
        description: `${functionsWithoutTypes} function(s) have no type hints at all.`,
        recommendation: 'Add type hints to function parameters and return values for better code clarity and IDE support.',
      });
    }

    if (functionsWithoutReturnType > 0) {
      this.issues.push({
        severity: 'LOW',
        title: 'Missing Return Type Annotations',
        description: `${functionsWithoutReturnType} function(s) missing return type annotations.`,
        recommendation: 'Specify return types with -> TypeName syntax for better documentation.',
      });
    }

    if (paramsWithoutTypes > 0) {
      this.issues.push({
        severity: 'LOW',
        title: 'Missing Parameter Type Hints',
        description: `${paramsWithoutTypes} parameter(s) missing type annotations.`,
        recommendation: 'Add type hints to parameters: def func(name: str, count: int) -> None',
      });
    }
  }

  renderResults(container) {
    if (!this.results) {
      container.innerHTML = this.createErrorMessage('No type analysis data available');
      return;
    }

    const score = this.results.score;
    const scoreClass = score >= 80 ? 'good' : score >= 50 ? 'medium' : 'poor';

    if (this.issues.length === 0) {
      container.innerHTML = `
        ${this.createSuccessMessage('Excellent type hint coverage!')}
        <div class="type-score">
          <h3>Type Safety Score: <span class="score good">${score}/100</span></h3>
        </div>
        <div class="agent-footer">
          <p><em>— Ludwig, Type Guardian</em></p>
        </div>
      `;
      return;
    }

    const summary = `
      <div class="type-summary">
        <h3>Type Safety Score: <span class="score ${scoreClass}">${score}/100</span></h3>
        <p>Found ${this.issues.length} type-related issue(s)</p>
      </div>
    `;

    const issuesHtml = this.issues.map((issue) => this.createIssueCard(issue)).join('');

    container.innerHTML = `
      ${summary}
      <div class="issues-list">
        ${issuesHtml}
      </div>
      <div class="agent-footer">
        <p><em>"Type hints are love letters to your future self."</em></p>
        <p><em>— Ludwig, Type Guardian</em></p>
      </div>
    `;
  }

  /**
   * Calculate type safety score (0-100)
   * @param {Object} structure - Code structure
   * @returns {number} Score
   */
  calculateTypeScore(structure) {
    if (!structure.functions || structure.functions.length === 0) {
      return 100; // No functions = no type issues
    }

    let totalFunctions = structure.functions.length;
    let functionsWithTypes = 0;
    let totalParams = 0;
    let paramsWithTypes = 0;
    let returnsWithTypes = 0;

    structure.functions.forEach((func) => {
      const hasTypeHints = func.args?.some((arg) => arg.annotation);
      if (hasTypeHints) functionsWithTypes++;

      if (func.return_annotation) returnsWithTypes++;

      if (func.args) {
        func.args.forEach((arg) => {
          if (arg.arg === 'self' || arg.arg === 'cls') return;
          totalParams++;
          if (arg.annotation) paramsWithTypes++;
        });
      }
    });

    const functionCoverage = (functionsWithTypes / totalFunctions) * 100;
    const paramCoverage = totalParams > 0 ? (paramsWithTypes / totalParams) * 100 : 100;
    const returnCoverage = (returnsWithTypes / totalFunctions) * 100;

    // Weighted average
    const score = (functionCoverage * 0.3 + paramCoverage * 0.4 + returnCoverage * 0.3);
    return Math.round(score);
  }
}
