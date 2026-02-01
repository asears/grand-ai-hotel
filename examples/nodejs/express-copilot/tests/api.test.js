/**
 * API integration tests using Vitest and Supertest
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app, startServer } from '../server.js';

let server;

beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

describe('Health Endpoints', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('memory');
  });

  it('should return readiness status', async () => {
    const response = await request(app).get('/health/ready');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ready');
  });

  it('should return liveness status', async () => {
    const response = await request(app).get('/health/live');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'alive');
  });
});

describe('Copilot Completion API', () => {
  it('should generate completion successfully', async () => {
    const response = await request(app)
      .post('/api/copilot/complete')
      .send({
        prompt: 'Write a hello world function',
        model: 'gpt-4',
        temperature: 0.7
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('completion');
    expect(response.body.data).toHaveProperty('usage');
  });

  it('should validate prompt is required', async () => {
    const response = await request(app)
      .post('/api/copilot/complete')
      .send({
        model: 'gpt-4'
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Validation Error');
  });

  it('should validate model enum', async () => {
    const response = await request(app)
      .post('/api/copilot/complete')
      .send({
        prompt: 'test',
        model: 'invalid-model'
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
  });

  it('should reject missing Content-Type', async () => {
    const response = await request(app)
      .post('/api/copilot/complete')
      .send('{"prompt":"test"}');

    expect(response.status).toBe(415);
  });
});

describe('Copilot Chat API', () => {
  it('should generate chat completion', async () => {
    const response = await request(app)
      .post('/api/copilot/chat')
      .send({
        messages: [
          { role: 'user', content: 'Hello!' }
        ]
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data.choices).toHaveLength(1);
    expect(response.body.data.choices[0].message).toHaveProperty('role', 'assistant');
  });

  it('should validate messages format', async () => {
    const response = await request(app)
      .post('/api/copilot/chat')
      .send({
        messages: [
          { role: 'invalid', content: 'test' }
        ]
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
  });

  it('should require at least one message', async () => {
    const response = await request(app)
      .post('/api/copilot/chat')
      .send({
        messages: []
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
  });
});

describe('Models API', () => {
  it('should list available models', async () => {
    const response = await request(app).get('/api/copilot/models');

    expect(response.status).toBe(200);
    expect(response.body.data.models).toBeInstanceOf(Array);
    expect(response.body.data.models.length).toBeGreaterThan(0);
    expect(response.body.data.models[0]).toHaveProperty('id');
    expect(response.body.data.models[0]).toHaveProperty('name');
  });
});

describe('Error Handling', () => {
  it('should handle 404 for unknown routes', async () => {
    const response = await request(app).get('/api/unknown');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
  });
});
