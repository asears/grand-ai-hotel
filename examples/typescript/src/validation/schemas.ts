/**
 * Advanced Zod schemas demonstrating complex patterns
 * Shows nested objects, discriminated unions, recursive schemas, and more
 */

import { z } from 'zod';

/**
 * Recursive tree structure
 */
export const TreeNodeSchema: z.ZodType<{
  value: string;
  children?: Array<{ value: string; children?: unknown }>;
}> = z.lazy(() =>
  z.object({
    value: z.string(),
    children: z.array(TreeNodeSchema).optional(),
  }),
);

export type TreeNode = z.infer<typeof TreeNodeSchema>;

/**
 * Discriminated union for different event types
 */
const ClickEventSchema = z.object({
  type: z.literal('click'),
  x: z.number(),
  y: z.number(),
  button: z.enum(['left', 'right', 'middle']),
});

const KeyEventSchema = z.object({
  type: z.literal('key'),
  key: z.string(),
  modifiers: z.object({
    ctrl: z.boolean(),
    alt: z.boolean(),
    shift: z.boolean(),
  }),
});

const ScrollEventSchema = z.object({
  type: z.literal('scroll'),
  deltaX: z.number(),
  deltaY: z.number(),
  target: z.string(),
});

export const EventSchema = z.discriminatedUnion('type', [
  ClickEventSchema,
  KeyEventSchema,
  ScrollEventSchema,
]);

export type Event = z.infer<typeof EventSchema>;

/**
 * Complex nested object with various validations
 */
export const AddressSchema = z.object({
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().length(2).toUpperCase(),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  country: z.string().default('US'),
});

export type Address = z.infer<typeof AddressSchema>;

export const PersonSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  age: z.number().int().min(0).max(150),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\+?1?\d{10,14}$/, 'Invalid phone number')
    .optional(),
  address: AddressSchema,
  emergencyContact: z
    .object({
      name: z.string().min(1),
      relationship: z.string().min(1),
      phone: z.string().regex(/^\+?1?\d{10,14}$/),
    })
    .optional(),
});

export type Person = z.infer<typeof PersonSchema>;

/**
 * Schema with transforms
 */
export const DateRangeSchema = z
  .object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  })
  .transform((data) => ({
    start: new Date(data.start),
    end: new Date(data.end),
  }))
  .refine((data) => data.end > data.start, {
    message: 'End date must be after start date',
  });

export type DateRange = z.infer<typeof DateRangeSchema>;

/**
 * Schema with custom refinements
 */
export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((val) => /[a-z]/.test(val), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((val) => /[0-9]/.test(val), {
    message: 'Password must contain at least one number',
  })
  .refine((val) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val), {
    message: 'Password must contain at least one special character',
  });

export type Password = z.infer<typeof PasswordSchema>;

/**
 * Union with literal types
 */
export const HttpStatusSchema = z.union([
  z.literal(200),
  z.literal(201),
  z.literal(204),
  z.literal(400),
  z.literal(401),
  z.literal(403),
  z.literal(404),
  z.literal(500),
  z.literal(502),
  z.literal(503),
]);

export type HttpStatus = z.infer<typeof HttpStatusSchema>;

/**
 * Conditional schema based on discriminator
 */
const BaseApiResponseSchema = z.object({
  timestamp: z.string().datetime(),
  requestId: z.string().uuid(),
});

export const ApiResponseSchema = z.discriminatedUnion('status', [
  BaseApiResponseSchema.extend({
    status: z.literal('success'),
    data: z.unknown(),
  }),
  BaseApiResponseSchema.extend({
    status: z.literal('error'),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }),
  }),
]);

export type ApiResponse = z.infer<typeof ApiResponseSchema>;

/**
 * Schema with preprocess
 */
export const NumericStringSchema = z.preprocess(
  (val) => (typeof val === 'string' ? Number.parseFloat(val) : val),
  z.number().finite(),
);

/**
 * Schema with coercion
 */
export const CoercedBooleanSchema = z.coerce.boolean();
export const CoercedDateSchema = z.coerce.date();

/**
 * Array with min/max length and unique items
 */
export const TagsSchema = z
  .array(z.string().min(1).max(20))
  .min(1, 'At least one tag is required')
  .max(10, 'Maximum 10 tags allowed')
  .refine((tags) => new Set(tags).size === tags.length, {
    message: 'Tags must be unique',
  });

export type Tags = z.infer<typeof TagsSchema>;

/**
 * Record/Map schema
 */
export const MetadataSchema = z.record(
  z.string().min(1).max(50),
  z.union([z.string(), z.number(), z.boolean()]),
);

export type Metadata = z.infer<typeof MetadataSchema>;

/**
 * Tuple schema
 */
export const CoordinatesSchema = z.tuple([
  z.number().min(-180).max(180),
  z.number().min(-90).max(90),
]);

export type Coordinates = z.infer<typeof CoordinatesSchema>;

/**
 * Enum-like schema
 */
export const UserRoleSchema = z.enum(['admin', 'moderator', 'user', 'guest']);
export type UserRole = z.infer<typeof UserRoleSchema>;

/**
 * Complex form schema with nested validation
 */
export const RegistrationFormSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email(),
    password: PasswordSchema,
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
    role: UserRoleSchema.default('user'),
    profile: z
      .object({
        displayName: z.string().min(1).max(100),
        bio: z.string().max(500).optional(),
        website: z.string().url().optional(),
        avatar: z.string().url().optional(),
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegistrationForm = z.infer<typeof RegistrationFormSchema>;

/**
 * Nullable vs Optional demonstration
 */
export const NullableOptionalSchema = z.object({
  // Can be undefined (not provided)
  optional: z.string().optional(),
  // Can be null
  nullable: z.string().nullable(),
  // Can be both null or undefined
  nullish: z.string().nullish(),
  // Required field
  required: z.string(),
});

export type NullableOptional = z.infer<typeof NullableOptionalSchema>;

/**
 * Default values schema
 */
export const ConfigSchema = z.object({
  debug: z.boolean().default(false),
  port: z.number().int().positive().default(3000),
  host: z.string().default('localhost'),
  env: z.enum(['development', 'staging', 'production']).default('development'),
  features: z
    .object({
      authentication: z.boolean().default(true),
      analytics: z.boolean().default(false),
      caching: z.boolean().default(true),
    })
    .default({}),
});

export type Config = z.infer<typeof ConfigSchema>;
