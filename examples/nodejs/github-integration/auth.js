/**
 * GitHub App authentication with Octokit
 * Supports JWT and installation token authentication
 */

import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import { readFile } from 'fs/promises';

/**
 * GitHub App authenticator
 */
export class GitHubAppAuth {
  /**
   * @param {object} options
   * @param {number} options.appId - GitHub App ID
   * @param {string} options.privateKey - GitHub App private key (PEM format)
   * @param {number} [options.installationId] - Installation ID
   * @param {string} [options.clientId] - OAuth client ID
   * @param {string} [options.clientSecret] - OAuth client secret
   */
  constructor({ appId, privateKey, installationId, clientId, clientSecret }) {
    this.appId = appId;
    this.privateKey = privateKey;
    this.installationId = installationId;
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    this.auth = createAppAuth({
      appId: this.appId,
      privateKey: this.privateKey,
      installationId: this.installationId,
      clientId: this.clientId,
      clientSecret: this.clientSecret
    });
  }

  /**
   * Create from private key file
   * @param {object} options
   * @param {number} options.appId - GitHub App ID
   * @param {string} options.privateKeyPath - Path to private key file
   * @param {number} [options.installationId] - Installation ID
   * @returns {Promise<GitHubAppAuth>}
   */
  static async fromKeyFile({ appId, privateKeyPath, installationId }) {
    const privateKey = await readFile(privateKeyPath, 'utf-8');
    return new GitHubAppAuth({ appId, privateKey, installationId });
  }

  /**
   * Get app JWT token
   * @returns {Promise<string>} JWT token
   */
  async getAppToken() {
    const { token } = await this.auth({ type: 'app' });
    return token;
  }

  /**
   * Get installation access token
   * @param {number} [installationId] - Override installation ID
   * @returns {Promise<object>} Installation token data
   */
  async getInstallationToken(installationId) {
    const id = installationId || this.installationId;
    if (!id) {
      throw new Error('Installation ID is required');
    }

    const { token, expiresAt, permissions } = await this.auth({
      type: 'installation',
      installationId: id
    });

    return { token, expiresAt, permissions };
  }

  /**
   * Create authenticated Octokit instance for app
   * @returns {Promise<Octokit>} Authenticated Octokit instance
   */
  async getAppOctokit() {
    const token = await this.getAppToken();
    return new Octokit({
      auth: token,
      userAgent: 'github-app-example/1.0.0'
    });
  }

  /**
   * Create authenticated Octokit instance for installation
   * @param {number} [installationId] - Override installation ID
   * @returns {Promise<Octokit>} Authenticated Octokit instance
   */
  async getInstallationOctokit(installationId) {
    const { token } = await this.getInstallationToken(installationId);
    return new Octokit({
      auth: token,
      userAgent: 'github-app-example/1.0.0'
    });
  }

  /**
   * List installations for the app
   * @returns {Promise<Array>} List of installations
   */
  async listInstallations() {
    const octokit = await this.getAppOctokit();
    const { data } = await octokit.apps.listInstallations();
    return data;
  }

  /**
   * Get repositories accessible to installation
   * @param {number} [installationId] - Override installation ID
   * @returns {Promise<Array>} List of repositories
   */
  async getInstallationRepositories(installationId) {
    const octokit = await this.getInstallationOctokit(installationId);
    const { data } = await octokit.apps.listReposAccessibleToInstallation();
    return data.repositories;
  }
}

/**
 * OAuth App authentication
 */
export class GitHubOAuthAuth {
  /**
   * @param {object} options
   * @param {string} options.clientId - OAuth client ID
   * @param {string} options.clientSecret - OAuth client secret
   */
  constructor({ clientId, clientSecret }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /**
   * Exchange OAuth code for access token
   * @param {string} code - OAuth authorization code
   * @returns {Promise<object>} Token data
   */
  async exchangeCode(code) {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`OAuth error: ${data.error_description || data.error}`);
    }

    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      scope: data.scope
    };
  }

  /**
   * Create authenticated Octokit instance from access token
   * @param {string} accessToken - OAuth access token
   * @returns {Octokit} Authenticated Octokit instance
   */
  createOctokit(accessToken) {
    return new Octokit({
      auth: accessToken,
      userAgent: 'github-oauth-example/1.0.0'
    });
  }
}

/**
 * Example usage
 */
async function example() {
  // Example 1: GitHub App authentication
  try {
    const appAuth = await GitHubAppAuth.fromKeyFile({
      appId: parseInt(process.env.GITHUB_APP_ID || '0'),
      privateKeyPath: process.env.GITHUB_PRIVATE_KEY_PATH || './private-key.pem',
      installationId: parseInt(process.env.GITHUB_INSTALLATION_ID || '0')
    });

    // Get app token
    const appToken = await appAuth.getAppToken();
    console.log('App JWT token obtained:', appToken.substring(0, 20) + '...');

    // Get installation token
    const { token, expiresAt } = await appAuth.getInstallationToken();
    console.log('Installation token obtained');
    console.log('Expires at:', expiresAt);

    // List installations
    const installations = await appAuth.listInstallations();
    console.log(`Found ${installations.length} installations`);

    // Get repositories for installation
    const repos = await appAuth.getInstallationRepositories();
    console.log(`Installation has access to ${repos.length} repositories`);
  } catch (error) {
    console.error('GitHub App auth error:', error.message);
  }

  // Example 2: OAuth authentication
  try {
    const oauthAuth = new GitHubOAuthAuth({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
    });

    // In a real app, you'd get this code from OAuth callback
    const code = process.env.GITHUB_OAUTH_CODE;
    if (code) {
      const { accessToken } = await oauthAuth.exchangeCode(code);
      console.log('OAuth access token obtained');

      const octokit = oauthAuth.createOctokit(accessToken);
      const { data: user } = await octokit.users.getAuthenticated();
      console.log('Authenticated as:', user.login);
    }
  } catch (error) {
    console.error('OAuth error:', error.message);
  }
}

// Run example if executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  example();
}
