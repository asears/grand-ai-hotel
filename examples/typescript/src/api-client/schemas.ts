/**
 * Zod schemas for API validation
 * Demonstrates schema composition, transforms, and refinements
 */

import { z } from 'zod';

/**
 * User schema with email validation
 */
export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Post schema with nested author
 */
export const PostSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  authorId: z.number().int().positive(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Post = z.infer<typeof PostSchema>;

/**
 * Post with author details (joined query)
 */
export const PostWithAuthorSchema = PostSchema.extend({
  author: UserSchema,
});

export type PostWithAuthor = z.infer<typeof PostWithAuthorSchema>;

/**
 * Pagination metadata
 */
export const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  perPage: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

/**
 * Paginated response wrapper
 */
export const createPaginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: PaginationMetaSchema,
  });

export const PaginatedUsersSchema = createPaginatedSchema(UserSchema);
export type PaginatedUsers = z.infer<typeof PaginatedUsersSchema>;

export const PaginatedPostsSchema = createPaginatedSchema(PostSchema);
export type PaginatedPosts = z.infer<typeof PaginatedPostsSchema>;

/**
 * Create user input schema
 */
export const CreateUserSchema = UserSchema.pick({
  email: true,
  name: true,
  age: true,
}).strict();

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

/**
 * Update user input schema (partial)
 */
export const UpdateUserSchema = UserSchema.pick({
  email: true,
  name: true,
  age: true,
})
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

/**
 * API error response schema
 */
export const ApiErrorResponseSchema = z.object({
  error: z.object({
    type: z.enum([
      'network',
      'validation',
      'authentication',
      'authorization',
      'not_found',
      'server',
      'rate_limit',
      'timeout',
      'unknown',
    ]),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

/**
 * Search query parameters
 */
export const SearchParamsSchema = z.object({
  q: z.string().min(1).optional(),
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type SearchParams = z.infer<typeof SearchParamsSchema>;

/**
 * Example of transform schema - converts string dates to Date objects
 */
export const UserWithDatesSchema = UserSchema.transform((data) => ({
  ...data,
  createdAt: new Date(data.createdAt),
  updatedAt: new Date(data.updatedAt),
}));

export type UserWithDates = z.infer<typeof UserWithDatesSchema>;
