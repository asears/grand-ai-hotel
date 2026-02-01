/**
 * Transform stream for converting text to uppercase
 * Demonstrates basic Transform stream implementation
 */

import { Transform } from 'stream';

/**
 * Transform stream that converts chunks to uppercase
 */
export class UpperCaseTransform extends Transform {
  /**
   * @param {object} [options] - Stream options
   */
  constructor(options = {}) {
    super({
      ...options,
      objectMode: options.objectMode ?? false
    });
  }

  /**
   * Transform implementation
   * @param {Buffer|string} chunk - Input chunk
   * @param {string} encoding - Chunk encoding
   * @param {Function} callback - Completion callback
   */
  _transform(chunk, encoding, callback) {
    try {
      const text = chunk.toString().toUpperCase();
      this.push(text);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * Transform stream that converts text to lowercase
 */
export class LowerCaseTransform extends Transform {
  /**
   * @param {object} [options] - Stream options
   */
  constructor(options = {}) {
    super({
      ...options,
      objectMode: options.objectMode ?? false
    });
  }

  /**
   * Transform implementation
   * @param {Buffer|string} chunk - Input chunk
   * @param {string} encoding - Chunk encoding
   * @param {Function} callback - Completion callback
   */
  _transform(chunk, encoding, callback) {
    try {
      const text = chunk.toString().toLowerCase();
      this.push(text);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * Transform stream that reverses text
 */
export class ReverseTransform extends Transform {
  /**
   * @param {object} [options] - Stream options
   */
  constructor(options = {}) {
    super({
      ...options,
      objectMode: options.objectMode ?? false
    });
  }

  /**
   * Transform implementation
   * @param {Buffer|string} chunk - Input chunk
   * @param {string} encoding - Chunk encoding
   * @param {Function} callback - Completion callback
   */
  _transform(chunk, encoding, callback) {
    try {
      const text = chunk.toString().split('').reverse().join('');
      this.push(text);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * Example usage
 */
async function example() {
  const { Readable } = await import('stream');

  console.log('=== Text Transform Examples ===\n');

  // Example 1: Uppercase transform
  console.log('1. Uppercase Transform:');
  const input1 = Readable.from(['hello ', 'world', '!']);
  const uppercase = new UpperCaseTransform();

  input1.pipe(uppercase).on('data', (chunk) => {
    process.stdout.write(chunk.toString());
  });

  await new Promise((resolve) => uppercase.on('end', resolve));
  console.log('\n');

  // Example 2: Lowercase transform
  console.log('2. Lowercase Transform:');
  const input2 = Readable.from(['HELLO ', 'WORLD', '!']);
  const lowercase = new LowerCaseTransform();

  input2.pipe(lowercase).on('data', (chunk) => {
    process.stdout.write(chunk.toString());
  });

  await new Promise((resolve) => lowercase.on('end', resolve));
  console.log('\n');

  // Example 3: Reverse transform
  console.log('3. Reverse Transform:');
  const input3 = Readable.from(['hello']);
  const reverse = new ReverseTransform();

  input3.pipe(reverse).on('data', (chunk) => {
    process.stdout.write(chunk.toString());
  });

  await new Promise((resolve) => reverse.on('end', resolve));
  console.log('\n');

  // Example 4: Chained transforms
  console.log('4. Chained Transforms (uppercase -> reverse):');
  const input4 = Readable.from(['hello world']);
  const chain1 = new UpperCaseTransform();
  const chain2 = new ReverseTransform();

  input4.pipe(chain1).pipe(chain2).on('data', (chunk) => {
    process.stdout.write(chunk.toString());
  });

  await new Promise((resolve) => chain2.on('end', resolve));
  console.log('\n');
}

// Run example if executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  example();
}
