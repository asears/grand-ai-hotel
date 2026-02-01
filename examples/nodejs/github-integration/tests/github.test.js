/**
 * GitHub integration tests using Vitest and Nock
 */

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

  describe('getRepository', () => {
    it('should fetch repository information', async () => {
      const mockRepo = {
        id: 1,
        name: 'Hello-World',
        full_name: 'octocat/Hello-World',
        description: 'My first repository',
        stargazers_count: 100,
        forks_count: 50
      };

      nock('https://api.github.com')
        .get('/repos/octocat/Hello-World')
        .reply(200, mockRepo);

      const repo = await client.getRepository('octocat', 'Hello-World');

      expect(repo.name).toBe('Hello-World');
      expect(repo.full_name).toBe('octocat/Hello-World');
      expect(repo.stargazers_count).toBe(100);
    });

    it('should handle repository not found', async () => {
      nock('https://api.github.com')
        .get('/repos/octocat/non-existent')
        .reply(404, { message: 'Not Found' });

      await expect(
        client.getRepository('octocat', 'non-existent')
      ).rejects.toThrow('Failed to get repository');
    });
  });

  describe('listIssues', () => {
    it('should list repository issues', async () => {
      const mockIssues = [
        {
          number: 1,
          title: 'Bug report',
          state: 'open',
          user: { login: 'user1' }
        },
        {
          number: 2,
          title: 'Feature request',
          state: 'open',
          user: { login: 'user2' }
        }
      ];

      nock('https://api.github.com')
        .get('/repos/octocat/Hello-World/issues')
        .query({ state: 'open', per_page: 30 })
        .reply(200, mockIssues);

      const issues = await client.listIssues('octocat', 'Hello-World');

      expect(issues).toHaveLength(2);
      expect(issues[0].title).toBe('Bug report');
      expect(issues[1].title).toBe('Feature request');
    });

    it('should filter issues by state', async () => {
      nock('https://api.github.com')
        .get('/repos/octocat/Hello-World/issues')
        .query({ state: 'closed', per_page: 10 })
        .reply(200, []);

      const issues = await client.listIssues('octocat', 'Hello-World', {
        state: 'closed',
        perPage: 10
      });

      expect(issues).toHaveLength(0);
    });
  });

  describe('createIssue', () => {
    it('should create a new issue', async () => {
      const mockIssue = {
        number: 42,
        title: 'New bug',
        body: 'Bug description',
        state: 'open',
        labels: [{ name: 'bug' }],
        created_at: '2024-01-29T10:00:00Z'
      };

      nock('https://api.github.com')
        .post('/repos/octocat/Hello-World/issues', {
          title: 'New bug',
          body: 'Bug description',
          labels: ['bug'],
          assignees: []
        })
        .reply(201, mockIssue);

      const issue = await client.createIssue('octocat', 'Hello-World', {
        title: 'New bug',
        body: 'Bug description',
        labels: ['bug']
      });

      expect(issue.number).toBe(42);
      expect(issue.title).toBe('New bug');
      expect(issue.state).toBe('open');
    });
  });

  describe('createPullRequest', () => {
    it('should create a pull request', async () => {
      const mockPR = {
        number: 10,
        title: 'Feature X',
        head: { ref: 'feature-x' },
        base: { ref: 'main' },
        state: 'open',
        mergeable: true
      };

      nock('https://api.github.com')
        .post('/repos/octocat/Hello-World/pulls', {
          title: 'Feature X',
          head: 'feature-x',
          base: 'main',
          body: 'Implements feature X'
        })
        .reply(201, mockPR);

      const pr = await client.createPullRequest('octocat', 'Hello-World', {
        title: 'Feature X',
        head: 'feature-x',
        base: 'main',
        body: 'Implements feature X'
      });

      expect(pr.number).toBe(10);
      expect(pr.title).toBe('Feature X');
      expect(pr.mergeable).toBe(true);
    });
  });

  describe('getPullRequestFiles', () => {
    it('should get changed files in PR', async () => {
      const mockFiles = [
        {
          filename: 'src/index.js',
          status: 'modified',
          additions: 10,
          deletions: 5,
          changes: 15
        },
        {
          filename: 'README.md',
          status: 'modified',
          additions: 2,
          deletions: 0,
          changes: 2
        }
      ];

      nock('https://api.github.com')
        .get('/repos/octocat/Hello-World/pulls/10/files')
        .reply(200, mockFiles);

      const files = await client.getPullRequestFiles('octocat', 'Hello-World', 10);

      expect(files).toHaveLength(2);
      expect(files[0].filename).toBe('src/index.js');
      expect(files[0].additions).toBe(10);
      expect(files[1].filename).toBe('README.md');
    });
  });

  describe('addComment', () => {
    it('should add comment to issue', async () => {
      const mockComment = {
        id: 1,
        body: 'This is a comment',
        user: { login: 'octocat' },
        created_at: '2024-01-29T10:00:00Z'
      };

      nock('https://api.github.com')
        .post('/repos/octocat/Hello-World/issues/1/comments', {
          body: 'This is a comment'
        })
        .reply(201, mockComment);

      const comment = await client.addComment(
        'octocat',
        'Hello-World',
        1,
        'This is a comment'
      );

      expect(comment.id).toBe(1);
      expect(comment.body).toBe('This is a comment');
    });
  });

  describe('getFileContents', () => {
    it('should get file contents', async () => {
      const content = Buffer.from('console.log("Hello");').toString('base64');
      const mockFile = {
        type: 'file',
        name: 'index.js',
        path: 'src/index.js',
        content,
        encoding: 'base64'
      };

      nock('https://api.github.com')
        .get('/repos/octocat/Hello-World/contents/src/index.js')
        .reply(200, mockFile);

      const file = await client.getFileContents('octocat', 'Hello-World', 'src/index.js');

      expect(file.type).toBe('file');
      expect(file.decodedContent).toBe('console.log("Hello");');
    });
  });

  describe('searchRepositories', () => {
    it('should search repositories', async () => {
      const mockResults = {
        total_count: 2,
        items: [
          {
            id: 1,
            name: 'repo1',
            full_name: 'user/repo1',
            stargazers_count: 100
          },
          {
            id: 2,
            name: 'repo2',
            full_name: 'user/repo2',
            stargazers_count: 50
          }
        ]
      };

      nock('https://api.github.com')
        .get('/search/repositories')
        .query({ q: 'javascript', sort: 'stars', order: 'desc' })
        .reply(200, mockResults);

      const results = await client.searchRepositories('javascript', {
        sort: 'stars',
        order: 'desc'
      });

      expect(results.total_count).toBe(2);
      expect(results.items).toHaveLength(2);
      expect(results.items[0].stargazers_count).toBe(100);
    });
  });

  describe('listCommits', () => {
    it('should list repository commits', async () => {
      const mockCommits = [
        {
          sha: 'abc123',
          commit: {
            message: 'Initial commit',
            author: { name: 'Octocat' }
          }
        },
        {
          sha: 'def456',
          commit: {
            message: 'Second commit',
            author: { name: 'Octocat' }
          }
        }
      ];

      nock('https://api.github.com')
        .get('/repos/octocat/Hello-World/commits')
        .query({ per_page: 30 })
        .reply(200, mockCommits);

      const commits = await client.listCommits('octocat', 'Hello-World');

      expect(commits).toHaveLength(2);
      expect(commits[0].commit.message).toBe('Initial commit');
    });
  });

  describe('getAuthenticatedUser', () => {
    it('should get authenticated user', async () => {
      const mockUser = {
        login: 'octocat',
        id: 1,
        name: 'The Octocat',
        email: 'octocat@github.com'
      };

      nock('https://api.github.com')
        .get('/user')
        .reply(200, mockUser);

      const user = await client.getAuthenticatedUser();

      expect(user.login).toBe('octocat');
      expect(user.name).toBe('The Octocat');
    });
  });

  describe('createRepository', () => {
    it('should create repository', async () => {
      const mockRepo = {
        id: 1,
        name: 'new-repo',
        full_name: 'octocat/new-repo',
        private: false
      };

      nock('https://api.github.com')
        .post('/user/repos', {
          name: 'new-repo',
          description: 'A new repo',
          private: false,
          auto_init: true
        })
        .reply(201, mockRepo);

      const repo = await client.createRepository({
        name: 'new-repo',
        description: 'A new repo',
        autoInit: true
      });

      expect(repo.name).toBe('new-repo');
      expect(repo.private).toBe(false);
    });
  });
});
