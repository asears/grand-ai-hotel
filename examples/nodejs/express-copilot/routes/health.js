/**
 * Health check routes
 */

import express from 'express';

const router = express.Router();

/**
 * Basic health check endpoint
 */
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    },
    node: process.version
  });
});

/**
 * Readiness check endpoint
 */
router.get('/ready', (req, res) => {
  // Add checks for required services (database, cache, etc.)
  const ready = true; // Replace with actual readiness checks

  if (ready) {
    res.json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Liveness check endpoint
 */
router.get('/live', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

export default router;
