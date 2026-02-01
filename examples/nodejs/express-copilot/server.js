/**
 * Modern Express.js server with GitHub Copilot SDK integration
 * Features: ESM, async/await, structured logging, security headers, request validation
 */

import express from 'express';
import helmet from 'helmet';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestValidator } from './middleware/validator.js';
import copilotRoutes from './routes/copilot.js';
import healthRoutes from './routes/health.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(logger);

// Routes
app.use('/health', healthRoutes);
app.use('/api/copilot', requestValidator, copilotRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

/**
 * Start the server
 * @returns {Promise<import('http').Server>}
 */
async function startServer() {
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📝 Health check: http://localhost:${PORT}/health`);
        console.log(`🤖 Copilot API: http://localhost:${PORT}/api/copilot`);
        resolve(server);
      }
    });
  });
}

// Start server if running directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export { app, startServer };
