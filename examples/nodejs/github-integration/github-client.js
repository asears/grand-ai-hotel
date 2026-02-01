/**
 * GitHub API client using Octokit
 * Modern ESM implementation with async/await
 */

import { Octokit } from '@octokit/rest';

/**
 * GitHub client wrapper with common operations
 */
export class GitHubClient {
  /**
   * @param {object} options
   * @param {string} [options.auth] - GitHub personal access token or OAuth token
   * @param {string} [options.baseUrl] - GitHub API base URL (for GitHub Enterprise)
   */
  constructor({ auth, baseUrl = 'https://api.github.com' } = {}) {
    this.octokit = new Octokit({
      auth,
      baseUrl,
      userAgent: 'github-integration-example/1.0.0'
    });
  }

  /**
   * Get repository information
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<object>} Repository data
   */
  async getRepository(owner, repo) {
    try {
      const { data } = await this.octokit.repos.get({
        owner,
        repo
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to get repository: ${error.message}`);
    }
  }

  /**
   * List repository issues
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {object} options
   * @param {string} [options.state='open'] - Issue state (open, closed, all)
   * @param {number} [options.perPage=30] - Results per page
   * @returns {Promise<Array>} List of issues
   */
  async listIssues(owner, repo, { state = 'open', perPage = 30 } = {}) {
    try {
      const { data } = await this.octokit.issues.listForRepo({
        owner,
        repo,
        state,
        per_page: perPage
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to list issues: ${error.message}`);
    }
  }

  /**
   * Create an issue
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {object} issue
   * @param {string} issue.title - Issue title
   * @param {string} [issue.body] - Issue body
   * @param {string[]} [issue.labels] - Issue labels
   * @param {string[]} [issue.assignees] - Issue assignees
   * @returns {Promise<object>} Created issue
   */
  async createIssue(owner, repo, { title, body, labels = [], assignees = [] }) {
    try {
      const { data } = await this.octokit.issues.create({
        owner,
        repo,
        title,
        body,
        labels,
        assignees
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to create issue: ${error.message}`);
    }
  }

  /**
   * Create a pull request
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {object} pr
   * @param {string} pr.title - PR title
   * @param {string} pr.head - Branch containing changes
   * @param {string} pr.base - Branch to merge into
   * @param {string} [pr.body] - PR description
   * @returns {Promise<object>} Created pull request
   */
  async createPullRequest(owner, repo, { title, head, base, body }) {
    try {
      const { data } = await this.octokit.pulls.create({
        owner,
        repo,
        title,
        head,
        base,
        body
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to create pull request: ${error.message}`);
    }
  }

  /**
   * Get pull request files
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} pullNumber - Pull request number
   * @returns {Promise<Array>} List of changed files
   */
  async getPullRequestFiles(owner, repo, pullNumber) {
    try {
      const { data } = await this.octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to get PR files: ${error.message}`);
    }
  }

  /**
   * Add comment to issue or PR
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} issueNumber - Issue or PR number
   * @param {string} body - Comment body
   * @returns {Promise<object>} Created comment
   */
  async addComment(owner, repo, issueNumber, body) {
    try {
      const { data } = await this.octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to add comment: ${error.message}`);
    }
  }

  /**
   * Get file contents from repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} path - File path
   * @param {string} [ref] - Git ref (branch, commit, tag)
   * @returns {Promise<object>} File content and metadata
   */
  async getFileContents(owner, repo, path, ref) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref
      });

      // Decode base64 content if it's a file
      if (data.type === 'file' && data.content) {
        data.decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to get file contents: ${error.message}`);
    }
  }

  /**
   * Search repositories
   * @param {string} query - Search query
   * @param {object} options
   * @param {string} [options.sort] - Sort field (stars, forks, updated)
   * @param {string} [options.order='desc'] - Sort order (asc, desc)
   * @returns {Promise<object>} Search results
   */
  async searchRepositories(query, { sort, order = 'desc' } = {}) {
    try {
      const { data } = await this.octokit.search.repos({
        q: query,
        sort,
        order
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to search repositories: ${error.message}`);
    }
  }

  /**
   * List commits in repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {object} options
   * @param {string} [options.sha] - Branch or commit SHA
   * @param {number} [options.perPage=30] - Results per page
   * @returns {Promise<Array>} List of commits
   */
  async listCommits(owner, repo, { sha, perPage = 30 } = {}) {
    try {
      const { data } = await this.octokit.repos.listCommits({
        owner,
        repo,
        sha,
        per_page: perPage
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to list commits: ${error.message}`);
    }
  }

  /**
   * Get authenticated user
   * @returns {Promise<object>} User data
   */
  async getAuthenticatedUser() {
    try {
      const { data } = await this.octokit.users.getAuthenticated();
      return data;
    } catch (error) {
      throw new Error(`Failed to get authenticated user: ${error.message}`);
    }
  }

  /**
   * Create a repository
   * @param {object} options
   * @param {string} options.name - Repository name
   * @param {string} [options.description] - Repository description
   * @param {boolean} [options.private=false] - Private repository flag
   * @param {boolean} [options.autoInit=false] - Initialize with README
   * @returns {Promise<object>} Created repository
   */
  async createRepository({ name, description, private: isPrivate = false, autoInit = false }) {
    try {
      const { data } = await this.octokit.repos.createForAuthenticatedUser({
        name,
        description,
        private: isPrivate,
        auto_init: autoInit
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to create repository: ${error.message}`);
    }
  }
}

/**
 * Example usage
 */
async function example() {
  // Initialize client with token from environment
  const client = new GitHubClient({
    auth: process.env.GITHUB_TOKEN
  });

  try {
    // Get repository information
    const repo = await client.getRepository('octocat', 'Hello-World');
    console.log('Repository:', repo.name);
    console.log('Stars:', repo.stargazers_count);
    console.log('Forks:', repo.forks_count);

    // List open issues
    const issues = await client.listIssues('octocat', 'Hello-World', {
      state: 'open',
      perPage: 5
    });
    console.log(`\nFound ${issues.length} open issues:`);
    issues.forEach((issue) => {
      console.log(`- #${issue.number}: ${issue.title}`);
    });

    // Search repositories
    const searchResults = await client.searchRepositories('language:javascript stars:>1000', {
      sort: 'stars',
      order: 'desc'
    });
    console.log(`\nFound ${searchResults.total_count} repositories`);
    console.log('Top 3:');
    searchResults.items.slice(0, 3).forEach((repo) => {
      console.log(`- ${repo.full_name} (${repo.stargazers_count} stars)`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run example if executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  example();
}

export default GitHubClient;
