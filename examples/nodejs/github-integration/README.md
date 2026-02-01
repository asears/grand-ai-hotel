# GitHub Integration Example

Modern GitHub API integration using Octokit SDK, webhooks, and GitHub App authentication. Pure ESM implementation with full test coverage.

## Features

- ✅ **Octokit SDK** - GitHub REST API client
- 🔐 **GitHub App Auth** - JWT and installation tokens
- 🎣 **Webhooks** - Event handling with crypto verification
- 🔑 **OAuth** - OAuth App authentication flow
- 🧪 **Testing** - Nock for HTTP mocking
- 📝 **JSDoc** - Full API documentation
- 🚀 **Pure ESM** - Modern ES modules

## Project Structure

```
github-integration/
├── github-client.js       # Octokit client wrapper
├── auth.js                # GitHub App & OAuth authentication
├── webhooks.js            # Webhook event handling
├── tests/
│   └── github.test.js     # Integration tests with Nock
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```bash
# Personal Access Token
GITHUB_TOKEN=ghp_your_personal_access_token

# GitHub App credentials
GITHUB_APP_ID=123456
GITHUB_PRIVATE_KEY_PATH=./private-key.pem
GITHUB_INSTALLATION_ID=987654

# OAuth App credentials
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# Webhooks
GITHUB_WEBHOOK_SECRET=your_webhook_secret
PORT=3000
```

## Usage Examples

### GitHub API Client

```javascript
import { GitHubClient } from './github-client.js';

const client = new GitHubClient({
  auth: process.env.GITHUB_TOKEN
});

// Get repository information
const repo = await client.getRepository('octocat', 'Hello-World');
console.log(`${repo.name} has ${repo.stargazers_count} stars`);

// List open issues
const issues = await client.listIssues('owner', 'repo', {
  state: 'open',
  perPage: 10
});

// Create an issue
const issue = await client.createIssue('owner', 'repo', {
  title: 'Bug report',
  body: 'Description of the bug',
  labels: ['bug', 'priority-high'],
  assignees: ['username']
});

// Create a pull request
const pr = await client.createPullRequest('owner', 'repo', {
  title: 'Add new feature',
  head: 'feature-branch',
  base: 'main',
  body: 'This PR adds feature X'
});

// Get PR files
const files = await client.getPullRequestFiles('owner', 'repo', 42);
files.forEach(file => {
  console.log(`${file.filename}: +${file.additions} -${file.deletions}`);
});

// Add comment
await client.addComment('owner', 'repo', 1, 'Great work!');

// Get file contents
const file = await client.getFileContents('owner', 'repo', 'src/index.js');
console.log(file.decodedContent);

// Search repositories
const results = await client.searchRepositories('language:javascript stars:>1000');
console.log(`Found ${results.total_count} repositories`);

// List commits
const commits = await client.listCommits('owner', 'repo', {
  sha: 'main',
  perPage: 20
});

// Get authenticated user
const user = await client.getAuthenticatedUser();
console.log(`Logged in as ${user.login}`);

// Create repository
const newRepo = await client.createRepository({
  name: 'my-new-repo',
  description: 'A new repository',
  private: false,
  autoInit: true
});
```

### GitHub App Authentication

```javascript
import { GitHubAppAuth } from './auth.js';

// Initialize from private key file
const appAuth = await GitHubAppAuth.fromKeyFile({
  appId: 123456,
  privateKeyPath: './private-key.pem',
  installationId: 987654
});

// Get app JWT token
const appToken = await appAuth.getAppToken();

// Get installation access token
const { token, expiresAt, permissions } = await appAuth.getInstallationToken();
console.log('Token expires at:', expiresAt);

// Get authenticated Octokit instance for app
const appOctokit = await appAuth.getAppOctokit();

// Get authenticated Octokit instance for installation
const installOctokit = await appAuth.getInstallationOctokit();

// List all installations
const installations = await appAuth.listInstallations();
console.log(`App installed on ${installations.length} accounts`);

// Get repositories accessible to installation
const repos = await appAuth.getInstallationRepositories();
console.log(`Installation has access to ${repos.length} repositories`);
```

### OAuth Authentication

```javascript
import { GitHubOAuthAuth } from './auth.js';

const oauthAuth = new GitHubOAuthAuth({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET
});

// Exchange OAuth code for access token
// (code comes from OAuth callback after user authorization)
const { accessToken, scope } = await oauthAuth.exchangeCode(code);

// Create authenticated Octokit instance
const octokit = oauthAuth.createOctokit(accessToken);
const { data: user } = await octokit.users.getAuthenticated();
console.log(`Authenticated as ${user.login}`);
```

### Webhook Handling

```javascript
import { GitHubWebhookHandler, eventHandlers } from './webhooks.js';

const webhookHandler = new GitHubWebhookHandler({
  secret: process.env.GITHUB_WEBHOOK_SECRET,
  port: 3000
});

// Register built-in event handlers
webhookHandler.on('push', eventHandlers.onPush);
webhookHandler.on('pull_request', eventHandlers.onPullRequest);
webhookHandler.on('issues', eventHandlers.onIssues);
webhookHandler.on('issue_comment', eventHandlers.onIssueComment);
webhookHandler.on('pull_request_review', eventHandlers.onPullRequestReview);

// Custom event handler
webhookHandler.on('star', async ({ payload }) => {
  console.log(`${payload.sender.login} starred ${payload.repository.full_name}`);
  console.log(`Total stars: ${payload.repository.stargazers_count}`);
});

// Start webhook server
await webhookHandler.start();
console.log('Webhook server ready at http://localhost:3000');
```

### Manual Signature Verification

```javascript
const webhookHandler = new GitHubWebhookHandler({ secret: 'my-secret' });

const isValid = webhookHandler.verifySignature(
  requestBody,
  request.headers['x-hub-signature-256']
);

if (isValid) {
  // Process webhook
} else {
  // Reject request
}
```

## Webhook Events

Supported webhook events:

- `push` - Code pushed to repository
- `pull_request` - PR opened, closed, merged, etc.
- `issues` - Issue opened, closed, edited, etc.
- `issue_comment` - Comment on issue or PR
- `pull_request_review` - PR review submitted
- `pull_request_review_comment` - Comment on PR review
- `repository` - Repository created, deleted, etc.
- `star` - Repository starred/unstarred
- `fork` - Repository forked
- `release` - Release published
- `workflow_run` - GitHub Actions workflow completed

## Testing

Run tests with Nock for HTTP mocking:

```bash
npm test
```

Run with coverage:

```bash
npm run test:coverage
```

### Test Example

```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { GitHubClient } from '../github-client.js';

describe('GitHubClient', () => {
  let client;

  beforeEach(() => {
    client = new GitHubClient({ auth: 'test-token' });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch repository', async () => {
    nock('https://api.github.com')
      .get('/repos/octocat/Hello-World')
      .reply(200, { name: 'Hello-World', stargazers_count: 100 });

    const repo = await client.getRepository('octocat', 'Hello-World');
    expect(repo.stargazers_count).toBe(100);
  });
});
```

## GitHub App Setup

1. Create a GitHub App at https://github.com/settings/apps/new
2. Set webhook URL to your server endpoint
3. Generate and download private key
4. Note your App ID
5. Install the app on repositories
6. Note the installation ID

## Webhook Configuration

1. Go to repository Settings > Webhooks
2. Add webhook URL: `http://your-domain:3000`
3. Set content type: `application/json`
4. Enter webhook secret (matches `GITHUB_WEBHOOK_SECRET`)
5. Select events to receive
6. Ensure webhook is active

## API Rate Limits

GitHub API rate limits:

- **Authenticated requests**: 5,000 per hour
- **Unauthenticated requests**: 60 per hour
- **Search API**: 30 requests per minute
- **GitHub App**: 5,000 per installation per hour

Check rate limit status:

```javascript
const { data: rateLimit } = await octokit.rateLimit.get();
console.log('Remaining:', rateLimit.resources.core.remaining);
console.log('Resets at:', new Date(rateLimit.resources.core.reset * 1000));
```

## Error Handling

All methods throw errors with descriptive messages:

```javascript
try {
  const repo = await client.getRepository('owner', 'non-existent');
} catch (error) {
  console.error('Error:', error.message);
  // Output: "Failed to get repository: Not Found"
}
```

## Modern JavaScript Features

- **ESM imports** - `import`/`export`
- **Top-level await** - No async IIFE needed
- **Async/await** - Clean promise handling
- **Destructuring** - Object/array destructuring
- **Optional chaining** - `?.` operator
- **Nullish coalescing** - `??` operator
- **Template literals** - String interpolation

## Security Best Practices

1. **Never commit tokens or secrets** - Use environment variables
2. **Verify webhook signatures** - Always validate HMAC signature
3. **Use timing-safe comparison** - Prevent timing attacks
4. **Rotate tokens regularly** - Refresh access tokens
5. **Minimal permissions** - Request only necessary scopes
6. **HTTPS only** - Use TLS for webhook endpoints

## Next Steps

1. Implement Probot framework integration
2. Add GraphQL API support
3. Implement pagination helpers
4. Add retry logic with exponential backoff
5. Create webhook event replay system
6. Add metrics and monitoring
7. Implement caching layer
8. Add request/response logging

## License

MIT
