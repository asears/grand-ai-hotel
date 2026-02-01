/**
 * Request validation middleware using Zod
 */

import { z } from 'zod';

/**
 * Create validation middleware for request schemas
 * @param {object} schemas - Validation schemas
 * @param {z.ZodSchema} [schemas.body] - Body schema
 * @param {z.ZodSchema} [schemas.query] - Query schema
 * @param {z.ZodSchema} [schemas.params] - Params schema
 * @returns {import('express').RequestHandler}
 */
export function validate(schemas) {
  return async (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
            code: e.code
          })),
          timestamp: new Date().toISOString()
        });
      }
      next(error);
    }
  };
}

/**
 * Basic request validator middleware
 * Validates content-type for POST/PUT/PATCH requests
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function requestValidator(req, res, next) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'Content-Type must be application/json',
        timestamp: new Date().toISOString()
      });
    }
  }
  next();
}
