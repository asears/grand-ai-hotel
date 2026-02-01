/**
 * Custom validators and validation utilities
 * Demonstrates reusable validation patterns
 */

import { z } from 'zod';

/**
 * Credit card number validator (Luhn algorithm)
 */
export function validateCreditCard(value: string): boolean {
  const digits = value.replace(/\D/g, '');

  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i] ?? '0', 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export const CreditCardSchema = z.string().refine(validateCreditCard, {
  message: 'Invalid credit card number',
});

/**
 * IBAN validator
 */
export function validateIban(value: string): boolean {
  const iban = value.replace(/\s/g, '').toUpperCase();

  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) {
    return false;
  }

  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (char) => String(char.charCodeAt(0) - 55));

  let remainder = '';
  for (const digit of numeric) {
    const current = remainder + digit;
    remainder = String(Number.parseInt(current, 10) % 97);
  }

  return Number.parseInt(remainder, 10) === 1;
}

export const IbanSchema = z.string().refine(validateIban, {
  message: 'Invalid IBAN',
});

/**
 * Phone number validator with country code
 */
export function validateInternationalPhone(value: string): boolean {
  return /^\+[1-9]\d{1,14}$/.test(value);
}

export const InternationalPhoneSchema = z.string().refine(validateInternationalPhone, {
  message: 'Invalid international phone number (use E.164 format)',
});

/**
 * IP address validators
 */
export function validateIpv4(value: string): boolean {
  const parts = value.split('.');
  if (parts.length !== 4) {
    return false;
  }

  return parts.every((part) => {
    const num = Number.parseInt(part, 10);
    return !Number.isNaN(num) && num >= 0 && num <= 255;
  });
}

export function validateIpv6(value: string): boolean {
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv6Regex.test(value);
}

export const Ipv4Schema = z.string().refine(validateIpv4, {
  message: 'Invalid IPv4 address',
});

export const Ipv6Schema = z.string().refine(validateIpv6, {
  message: 'Invalid IPv6 address',
});

export const IpAddressSchema = z.union([Ipv4Schema, Ipv6Schema]);

/**
 * MAC address validator
 */
export function validateMacAddress(value: string): boolean {
  return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(value);
}

export const MacAddressSchema = z.string().refine(validateMacAddress, {
  message: 'Invalid MAC address',
});

/**
 * Coordinate validator
 */
export function validateLatitude(value: number): boolean {
  return value >= -90 && value <= 90;
}

export function validateLongitude(value: number): boolean {
  return value >= -180 && value <= 180;
}

export const LatitudeSchema = z.number().refine(validateLatitude, {
  message: 'Latitude must be between -90 and 90',
});

export const LongitudeSchema = z.number().refine(validateLongitude, {
  message: 'Longitude must be between -180 and 180',
});

export const CoordinatesSchema = z.object({
  lat: LatitudeSchema,
  lng: LongitudeSchema,
});

/**
 * File size validator
 */
export function createFileSizeValidator(maxSizeBytes: number) {
  return (size: number): boolean => {
    return size > 0 && size <= maxSizeBytes;
  };
}

export const createFileSizeSchema = (maxSizeBytes: number) =>
  z.number().refine(createFileSizeValidator(maxSizeBytes), {
    message: `File size must not exceed ${maxSizeBytes} bytes`,
  });

/**
 * Date range validator
 */
export function validateDateRange(start: Date, end: Date): boolean {
  return end > start;
}

export const DateRangeSchema = z
  .object({
    start: z.date(),
    end: z.date(),
  })
  .refine((data) => validateDateRange(data.start, data.end), {
    message: 'End date must be after start date',
  });

/**
 * Age validator
 */
export function createAgeValidator(minAge: number, maxAge?: number) {
  return (birthDate: Date): boolean => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (actualAge < minAge) {
      return false;
    }
    if (maxAge && actualAge > maxAge) {
      return false;
    }

    return true;
  };
}

export const createAgeSchema = (minAge: number, maxAge?: number) =>
  z.coerce.date().refine(createAgeValidator(minAge, maxAge), {
    message: `Age must be between ${minAge} and ${maxAge ?? '∞'}`,
  });

/**
 * Custom error formatter
 */
export function formatZodError(error: z.ZodError): string[] {
  return error.errors.map((err) => {
    const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
    return `${path}${err.message}`;
  });
}

/**
 * Safe parse with custom error handling
 */
export function parseWithErrors<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): { success: true; data: z.infer<T> } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: formatZodError(result.error),
  };
}

/**
 * Async validator wrapper
 */
export async function validateAsync<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): Promise<z.infer<T>> {
  return schema.parseAsync(data);
}

/**
 * Partial deep validator
 */
export function createPartialDeep<T extends z.ZodTypeAny>(schema: T): z.ZodTypeAny {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const newShape: Record<string, z.ZodTypeAny> = {};

    for (const key in shape) {
      const field = shape[key];
      if (!field) {
        continue;
      }
      newShape[key] = createPartialDeep(field).optional();
    }

    return z.object(newShape);
  }

  return schema;
}

/**
 * String sanitizer
 */
export const SanitizedStringSchema = z.string().transform((val) => val.trim().replace(/\s+/g, ' '));

/**
 * Normalized email schema
 */
export const NormalizedEmailSchema = z
  .string()
  .email()
  .transform((val) => val.toLowerCase().trim());

/**
 * Safe JSON schema
 */
export const JsonSchema = z.string().transform((str, ctx): unknown => {
  try {
    return JSON.parse(str) as unknown;
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid JSON',
    });
    return z.NEVER;
  }
});

/**
 * Conditional required field
 */
export function conditionalRequired<T extends z.ZodTypeAny>(
  condition: boolean,
  schema: T,
): z.ZodTypeAny {
  return condition ? schema : schema.optional();
}
