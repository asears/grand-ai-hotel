/**
 * Validation tests with edge cases
 */

import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  EmailSchema,
  HexColorSchema,
  SlugSchema,
  UserIdSchema,
  createEmail,
  createHexColor,
  createSlug,
  createUserId,
  isEmail,
  isHexColor,
} from '../branded-types.ts';
import {
  AddressSchema,
  ApiResponseSchema,
  CoordinatesSchema,
  DateRangeSchema,
  EventSchema,
  MetadataSchema,
  PasswordSchema,
  PersonSchema,
  RegistrationFormSchema,
  TagsSchema,
  TreeNodeSchema,
  UserRoleSchema,
} from '../schemas.ts';
import {
  CreditCardSchema,
  IbanSchema,
  InternationalPhoneSchema,
  Ipv4Schema,
  Ipv6Schema,
  MacAddressSchema,
  SanitizedStringSchema,
  formatZodError,
  parseWithErrors,
  validateCreditCard,
  validateIban,
  validateIpv4,
  validateIpv6,
} from '../validators.ts';

describe('Complex Schemas', () => {
  describe('TreeNodeSchema', () => {
    it('should validate simple tree node', () => {
      const node = {
        value: 'root',
      };

      const result = TreeNodeSchema.safeParse(node);
      expect(result.success).toBe(true);
    });

    it('should validate nested tree', () => {
      const tree = {
        value: 'root',
        children: [
          { value: 'child1' },
          {
            value: 'child2',
            children: [{ value: 'grandchild1' }],
          },
        ],
      };

      const result = TreeNodeSchema.safeParse(tree);
      expect(result.success).toBe(true);
    });
  });

  describe('EventSchema (Discriminated Union)', () => {
    it('should validate click event', () => {
      const event = {
        type: 'click' as const,
        x: 100,
        y: 200,
        button: 'left' as const,
      };

      const result = EventSchema.safeParse(event);
      expect(result.success).toBe(true);
    });

    it('should validate key event', () => {
      const event = {
        type: 'key' as const,
        key: 'Enter',
        modifiers: {
          ctrl: true,
          alt: false,
          shift: false,
        },
      };

      const result = EventSchema.safeParse(event);
      expect(result.success).toBe(true);
    });

    it('should reject invalid event type', () => {
      const event = {
        type: 'invalid',
        x: 100,
      };

      const result = EventSchema.safeParse(event);
      expect(result.success).toBe(false);
    });
  });

  describe('PersonSchema', () => {
    it('should validate complete person', () => {
      const person = {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        email: 'john@example.com',
        phone: '+12125551234',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
        },
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+12125555678',
        },
      };

      const result = PersonSchema.safeParse(person);
      expect(result.success).toBe(true);
    });

    it('should validate person without optional fields', () => {
      const person = {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        email: 'john@example.com',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
        },
      };

      const result = PersonSchema.safeParse(person);
      expect(result.success).toBe(true);
    });

    it('should reject invalid ZIP code', () => {
      const person = {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        email: 'john@example.com',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: 'invalid',
        },
      };

      const result = PersonSchema.safeParse(person);
      expect(result.success).toBe(false);
    });
  });

  describe('DateRangeSchema', () => {
    it('should validate valid date range', () => {
      const range = {
        start: '2024-01-01T00:00:00Z',
        end: '2024-12-31T23:59:59Z',
      };

      const result = DateRangeSchema.safeParse(range);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.start).toBeInstanceOf(Date);
        expect(result.data.end).toBeInstanceOf(Date);
      }
    });

    it('should reject end before start', () => {
      const range = {
        start: '2024-12-31T23:59:59Z',
        end: '2024-01-01T00:00:00Z',
      };

      const result = DateRangeSchema.safeParse(range);
      expect(result.success).toBe(false);
    });
  });

  describe('PasswordSchema', () => {
    it('should validate strong password', () => {
      const password = 'StrongP@ssw0rd!';
      const result = PasswordSchema.safeParse(password);
      expect(result.success).toBe(true);
    });

    it('should reject password without uppercase', () => {
      const password = 'weakp@ssw0rd!';
      const result = PasswordSchema.safeParse(password);
      expect(result.success).toBe(false);
    });

    it('should reject password without special character', () => {
      const password = 'StrongPassw0rd';
      const result = PasswordSchema.safeParse(password);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const password = 'Sh0rt!';
      const result = PasswordSchema.safeParse(password);
      expect(result.success).toBe(false);
    });
  });

  describe('TagsSchema', () => {
    it('should validate unique tags', () => {
      const tags = ['typescript', 'javascript', 'node'];
      const result = TagsSchema.safeParse(tags);
      expect(result.success).toBe(true);
    });

    it('should reject duplicate tags', () => {
      const tags = ['typescript', 'javascript', 'typescript'];
      const result = TagsSchema.safeParse(tags);
      expect(result.success).toBe(false);
    });

    it('should reject too many tags', () => {
      const tags = Array.from({ length: 11 }, (_, i) => `tag${i}`);
      const result = TagsSchema.safeParse(tags);
      expect(result.success).toBe(false);
    });

    it('should reject empty tags array', () => {
      const tags: string[] = [];
      const result = TagsSchema.safeParse(tags);
      expect(result.success).toBe(false);
    });
  });

  describe('RegistrationFormSchema', () => {
    it('should validate complete registration', () => {
      const form = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'StrongP@ss123',
        confirmPassword: 'StrongP@ss123',
        terms: true,
        role: 'user' as const,
        profile: {
          displayName: 'John Doe',
          bio: 'Software developer',
          website: 'https://example.com',
        },
      };

      const result = RegistrationFormSchema.safeParse(form);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const form = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'StrongP@ss123',
        confirmPassword: 'DifferentP@ss456',
        terms: true,
      };

      const result = RegistrationFormSchema.safeParse(form);
      expect(result.success).toBe(false);
    });

    it('should reject without accepting terms', () => {
      const form = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'StrongP@ss123',
        confirmPassword: 'StrongP@ss123',
        terms: false,
      };

      const result = RegistrationFormSchema.safeParse(form);
      expect(result.success).toBe(false);
    });
  });
});

describe('Branded Types', () => {
  describe('UserIdSchema', () => {
    it('should create branded UserId', () => {
      const id = createUserId(123);
      expect(id).toBe(123);
    });

    it('should reject negative UserId', () => {
      const id = createUserId(-1);
      expect(id).toBeNull();
    });

    it('should reject zero UserId', () => {
      const id = createUserId(0);
      expect(id).toBeNull();
    });
  });

  describe('EmailSchema', () => {
    it('should create branded Email', () => {
      const email = createEmail('test@example.com');
      expect(email).toBe('test@example.com');
    });

    it('should reject invalid email', () => {
      const email = createEmail('not-an-email');
      expect(email).toBeNull();
    });

    it('should work with type guard', () => {
      const value: unknown = 'test@example.com';
      if (isEmail(value)) {
        expect(value).toBe('test@example.com');
      }
    });
  });

  describe('SlugSchema', () => {
    it('should validate valid slug', () => {
      const slug = createSlug('my-blog-post');
      expect(slug).toBe('my-blog-post');
    });

    it('should reject slug with uppercase', () => {
      const slug = createSlug('My-Blog-Post');
      expect(slug).toBeNull();
    });

    it('should reject slug with spaces', () => {
      const slug = createSlug('my blog post');
      expect(slug).toBeNull();
    });
  });

  describe('HexColorSchema', () => {
    it('should validate valid hex color', () => {
      const color = createHexColor('#FF5733');
      expect(color).toBe('#FF5733');
    });

    it('should reject invalid hex color', () => {
      const color = createHexColor('#GG5733');
      expect(color).toBeNull();
    });

    it('should reject short hex color', () => {
      const color = createHexColor('#F00');
      expect(color).toBeNull();
    });

    it('should work with type guard', () => {
      const value: unknown = '#FF5733';
      if (isHexColor(value)) {
        expect(value).toBe('#FF5733');
      }
    });
  });
});

describe('Custom Validators', () => {
  describe('Credit Card Validator', () => {
    it('should validate valid credit card', () => {
      expect(validateCreditCard('4532015112830366')).toBe(true);
    });

    it('should reject invalid credit card', () => {
      expect(validateCreditCard('4532015112830367')).toBe(false);
    });

    it('should validate with schema', () => {
      const result = CreditCardSchema.safeParse('4532015112830366');
      expect(result.success).toBe(true);
    });
  });

  describe('IBAN Validator', () => {
    it('should validate valid IBAN', () => {
      expect(validateIban('GB82 WEST 1234 5698 7654 32')).toBe(true);
    });

    it('should reject invalid IBAN', () => {
      expect(validateIban('GB82 WEST 1234 5698 7654 33')).toBe(false);
    });
  });

  describe('IP Address Validators', () => {
    it('should validate IPv4', () => {
      expect(validateIpv4('192.168.1.1')).toBe(true);
      expect(validateIpv4('255.255.255.255')).toBe(true);
    });

    it('should reject invalid IPv4', () => {
      expect(validateIpv4('256.1.1.1')).toBe(false);
      expect(validateIpv4('192.168.1')).toBe(false);
    });

    it('should validate IPv6', () => {
      expect(validateIpv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
      expect(validateIpv6('2001:db8:85a3::8a2e:370:7334')).toBe(true);
    });
  });

  describe('Error Formatting', () => {
    it('should format Zod errors', () => {
      const result = PersonSchema.safeParse({
        firstName: '',
        lastName: 'Doe',
        age: -5,
        email: 'invalid',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = formatZodError(result.error);
        expect(errors.length).toBeGreaterThan(0);
      }
    });

    it('should use parseWithErrors helper', () => {
      const result = parseWithErrors(UserIdSchema, -1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('String Sanitization', () => {
    it('should trim and normalize whitespace', () => {
      const result = SanitizedStringSchema.parse('  hello   world  ');
      expect(result).toBe('hello world');
    });
  });
});
