/**
 * GitHub Webhooks handling with crypto verification
 * Supports push, pull_request, issues, and other events
 */

import { createServer } from 'http';
import { createHmac, timingSafeEqual } from 'crypto';
import { Webhooks } from '@octokit/webhooks';

/**
 * Webhook event handler
 */
export class GitHubWebhookHandler {
  /**
   * @param {object} options
   * @param {string} options.secret - Webhook secret for signature verification
   * @param {number} [options.port=3000] - Server port
   */
  constructor({ secret, port = 3000 }) {
    this.secret = secret;
    this.port = port;
    this.webhooks = new Webhooks({ secret });
    this.handlers = new Map();
  }

  /**
   * Register event handler
   * @param {string} event - Event name (push, pull_request, issues, etc.)
   * @param {Function} handler - Async handler function
   */
  on(event, handler) {
    this.webhooks.on(event, handler);
    this.handlers.set(event, handler);
  }

  /**
   * Verify webhook signature
   * @param {string} payload - Raw request body
   * @param {string} signature - X-Hub-Signature-256 header value
   * @returns {boolean} Signature is valid
   */
  verifySignature(payload, signature) {
    if (!signature) {
      return false;
    }

    const hmac = createHmac('sha256', this.secret);
    hmac.update(payload);
    const digest = 'sha256=' + hmac.digest('hex');

    try {
      return timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
      );
    } catch {
      return false;
    }
  }

  /**
   * Handle incoming webhook request
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   */
  async handleRequest(req, res) {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const signature = req.headers['x-hub-signature-256'];
        const event = req.headers['x-github-event'];
        const deliveryId = req.headers['x-github-delivery'];

        // Verify signature
        if (!this.verifySignature(body, signature)) {
          console.error('Invalid signature');
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid signature' }));
          return;
        }

        console.log(`Received ${event} event (${deliveryId})`);

        // Process webhook
        const payload = JSON.parse(body);
        await this.webhooks.receive({
          id: deliveryId,
          name: event,
          payload
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success' }));
      } catch (error) {
        console.error('Webhook error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  }

  /**
   * Start webhook server
   * @returns {Promise<import('http').Server>}
   */
  async start() {
    return new Promise((resolve) => {
      const server = createServer((req, res) => this.handleRequest(req, res));
      server.listen(this.port, () => {
        console.log(`🎣 Webhook server listening on port ${this.port}`);
        resolve(server);
      });
    });
  }
}

/**
 * Common webhook event handlers
 */
export const eventHandlers = {
  /**
   * Handle push events
   * @param {object} context
   */
  async onPush(context) {
    const { payload } = context;
    console.log('Push event received:');
    console.log(`- Repository: ${payload.repository.full_name}`);
    console.log(`- Branch: ${payload.ref.replace('refs/heads/', '')}`);
    console.log(`- Commits: ${payload.commits.length}`);
    console.log(`- Pusher: ${payload.pusher.name}`);

    payload.commits.forEach((commit) => {
      console.log(`  - ${commit.id.substring(0, 7)}: ${commit.message}`);
    });
  },

  /**
   * Handle pull request events
   * @param {object} context
   */
  async onPullRequest(context) {
    const { payload } = context;
    const { action, pull_request: pr } = payload;

    console.log('Pull Request event received:');
    console.log(`- Action: ${action}`);
    console.log(`- PR #${pr.number}: ${pr.title}`);
    console.log(`- Author: ${pr.user.login}`);
    console.log(`- Base: ${pr.base.ref} <- Head: ${pr.head.ref}`);
    console.log(`- State: ${pr.state}`);
    console.log(`- Mergeable: ${pr.mergeable ?? 'unknown'}`);
  },

  /**
   * Handle issue events
   * @param {object} context
   */
  async onIssues(context) {
    const { payload } = context;
    const { action, issue } = payload;

    console.log('Issue event received:');
    console.log(`- Action: ${action}`);
    console.log(`- Issue #${issue.number}: ${issue.title}`);
    console.log(`- Author: ${issue.user.login}`);
    console.log(`- State: ${issue.state}`);
    console.log(`- Labels: ${issue.labels.map((l) => l.name).join(', ') || 'none'}`);
  },

  /**
   * Handle issue comment events
   * @param {object} context
   */
  async onIssueComment(context) {
    const { payload } = context;
    const { action, issue, comment } = payload;

    console.log('Issue Comment event received:');
    console.log(`- Action: ${action}`);
    console.log(`- Issue #${issue.number}: ${issue.title}`);
    console.log(`- Comment by: ${comment.user.login}`);
    console.log(`- Comment: ${comment.body.substring(0, 100)}...`);
  },

  /**
   * Handle pull request review events
   * @param {object} context
   */
  async onPullRequestReview(context) {
    const { payload } = context;
    const { action, review, pull_request: pr } = payload;

    console.log('PR Review event received:');
    console.log(`- Action: ${action}`);
    console.log(`- PR #${pr.number}: ${pr.title}`);
    console.log(`- Reviewer: ${review.user.login}`);
    console.log(`- State: ${review.state}`);
    console.log(`- Comment: ${review.body || 'none'}`);
  },

  /**
   * Handle repository events
   * @param {object} context
   */
  async onRepository(context) {
    const { payload } = context;
    const { action, repository } = payload;

    console.log('Repository event received:');
    console.log(`- Action: ${action}`);
    console.log(`- Repository: ${repository.full_name}`);
    console.log(`- Private: ${repository.private}`);
  }
};

/**
 * Example webhook server setup
 */
async function example() {
  const webhookHandler = new GitHubWebhookHandler({
    secret: process.env.GITHUB_WEBHOOK_SECRET || 'development-secret',
    port: parseInt(process.env.PORT || '3000')
  });

  // Register event handlers
  webhookHandler.on('push', eventHandlers.onPush);
  webhookHandler.on('pull_request', eventHandlers.onPullRequest);
  webhookHandler.on('issues', eventHandlers.onIssues);
  webhookHandler.on('issue_comment', eventHandlers.onIssueComment);
  webhookHandler.on('pull_request_review', eventHandlers.onPullRequestReview);
  webhookHandler.on('repository', eventHandlers.onRepository);

  // Custom handler example
  webhookHandler.on('star', async ({ payload }) => {
    console.log('Star event received:');
    console.log(`- Action: ${payload.action}`);
    console.log(`- Repository: ${payload.repository.full_name}`);
    console.log(`- Starred by: ${payload.sender.login}`);
    console.log(`- Total stars: ${payload.repository.stargazers_count}`);
  });

  // Start server
  await webhookHandler.start();
  console.log('Webhook server ready to receive events');
  console.log('Configure webhook URL: http://your-domain:3000');
}

// Run example if executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  example();
}
