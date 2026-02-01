/**
 * Branded types for type safety
 * Prevents mixing up values of the same primitive type
 */

import { z } from 'zod';

/**
 * Brand symbol for nominal typing
 */
declare const brand: unique symbol;

/**
 * Branded type helper
 */
export type Branded<T, B> = T & { [brand]: B };

/**
 * User ID branded type
 */
export type UserId = Branded<number, 'UserId'>;

export const UserIdSchema = z.number().int().positive().brand<'UserId'>();

/**
 * Post ID branded type
 */
export type PostId = Branded<number, 'PostId'>;

export const PostIdSchema = z.number().int().positive().brand<'PostId'>();

/**
 * Email branded type
 */
export type Email = Branded<string, 'Email'>;

export const EmailSchema = z.string().email().brand<'Email'>();

/**
 * URL branded type
 */
export type Url = Branded<string, 'Url'>;

export const UrlSchema = z.string().url().brand<'Url'>();

/**
 * UUID branded type
 */
export type Uuid = Branded<string, 'Uuid'>;

export const UuidSchema = z.string().uuid().brand<'Uuid'>();

/**
 * Hex color branded type
 */
export type HexColor = Branded<string, 'HexColor'>;

export const HexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format')
  .brand<'HexColor'>();

/**
 * Positive integer branded type
 */
export type PositiveInt = Branded<number, 'PositiveInt'>;

export const PositiveIntSchema = z.number().int().positive().brand<'PositiveInt'>();

/**
 * Non-empty string branded type
 */
export type NonEmptyString = Branded<string, 'NonEmptyString'>;

export const NonEmptyStringSchema = z.string().min(1).brand<'NonEmptyString'>();

/**
 * Percentage (0-100) branded type
 */
export type Percentage = Branded<number, 'Percentage'>;

export const PercentageSchema = z.number().min(0).max(100).brand<'Percentage'>();

/**
 * Unix timestamp branded type
 */
export type UnixTimestamp = Branded<number, 'UnixTimestamp'>;

export const UnixTimestampSchema = z.number().int().nonnegative().brand<'UnixTimestamp'>();

/**
 * ISO 8601 date string branded type
 */
export type IsoDateString = Branded<string, 'IsoDateString'>;

export const IsoDateStringSchema = z.string().datetime().brand<'IsoDateString'>();

/**
 * Slug branded type (URL-friendly string)
 */
export type Slug = Branded<string, 'Slug'>;

export const SlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
  .brand<'Slug'>();

/**
 * JWT token branded type
 */
export type JwtToken = Branded<string, 'JwtToken'>;

export const JwtTokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, 'Invalid JWT format')
  .brand<'JwtToken'>();

/**
 * Semver version branded type
 */
export type SemVer = Branded<string, 'SemVer'>;

export const SemVerSchema = z
  .string()
  .regex(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
    'Invalid semver format',
  )
  .brand<'SemVer'>();

/**
 * Example usage with domain models
 */
export const UserSchema = z.object({
  id: UserIdSchema,
  email: EmailSchema,
  username: SlugSchema,
  createdAt: IsoDateStringSchema,
});

export type User = z.infer<typeof UserSchema>;

export const PostSchema = z.object({
  id: PostIdSchema,
  authorId: UserIdSchema,
  slug: SlugSchema,
  url: UrlSchema.optional(),
  createdAt: IsoDateStringSchema,
});

export type Post = z.infer<typeof PostSchema>;

/**
 * Helper functions for creating branded values safely
 */

export function createUserId(value: number): UserId | null {
  const result = UserIdSchema.safeParse(value);
  return result.success ? (result.data as unknown as UserId) : null;
}

export function createEmail(value: string): Email | null {
  const result = EmailSchema.safeParse(value);
  return result.success ? (result.data as unknown as Email) : null;
}

export function createSlug(value: string): Slug | null {
  const result = SlugSchema.safeParse(value);
  return result.success ? (result.data as unknown as Slug) : null;
}

export function createHexColor(value: string): HexColor | null {
  const result = HexColorSchema.safeParse(value);
  return result.success ? (result.data as unknown as HexColor) : null;
}

/**
 * Type guards for branded types
 */

export function isUserId(value: unknown): value is UserId {
  return UserIdSchema.safeParse(value).success;
}

export function isEmail(value: unknown): value is Email {
  return EmailSchema.safeParse(value).success;
}

export function isSlug(value: unknown): value is Slug {
  return SlugSchema.safeParse(value).success;
}

export function isHexColor(value: unknown): value is HexColor {
  return HexColorSchema.safeParse(value).success;
}
