/**
 * Centralized error handling middleware
 */

import { winstonLogger } from './logger.js';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {boolean} isOperational
   */
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Express error handling middleware
 * @param {Error | ApiError} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = undefined;

  // Handle known error types
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message
    }));
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  }

  // Log error
  winstonLogger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method
  });

  // Send error response
  const response = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path
  };

  if (errors) {
    response.errors = errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
