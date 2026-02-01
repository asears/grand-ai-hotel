/**
 * Transform stream for filtering and mapping objects
 * Demonstrates object mode streams
 */

import { Transform } from 'stream';

/**
 * Filter transform stream
 * Passes through only objects that match the predicate
 */
export class FilterTransform extends Transform {
  /**
   * @param {Function} predicate - Filter function (obj => boolean)
   * @param {object} [options] - Stream options
   */
  constructor(predicate, options = {}) {
    super({
      ...options,
      objectMode: true
    });
    this.predicate = predicate;
  }

  /**
   * Transform implementation
   * @param {object} chunk - Input object
   * @param {string} encoding - Chunk encoding
   * @param {Function} callback - Completion callback
   */
  _transform(chunk, encoding, callback) {
    try {
      if (this.predicate(chunk)) {
        this.push(chunk);
      }
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * Map transform stream
 * Transforms each object using the mapper function
 */
export class MapTransform extends Transform {
  /**
   * @param {Function} mapper - Map function (obj => newObj)
   * @param {object} [options] - Stream options
   */
  constructor(mapper, options = {}) {
    super({
      ...options,
      objectMode: true
    });
    this.mapper = mapper;
  }

  /**
   * Transform implementation
   * @param {object} chunk - Input object
   * @param {string} encoding - Chunk encoding
   * @param {Function} callback - Completion callback
   */
  _transform(chunk, encoding, callback) {
    try {
      const mapped = this.mapper(chunk);
      this.push(mapped);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * Batch transform stream
 * Groups objects into batches of specified size
 */
export class BatchTransform extends Transform {
  /**
   * @param {number} batchSize - Number of items per batch
   * @param {object} [options] - Stream options
   */
  constructor(batchSize, options = {}) {
    super({
      ...options,
      objectMode: true
    });
    this.batchSize = batchSize;
    this.buffer = [];
  }

  /**
   * Transform implementation
   * @param {object} chunk - Input object
   * @param {string} encoding - Chunk encoding
   * @param {Function} callback - Completion callback
   */
  _transform(chunk, encoding, callback) {
    this.buffer.push(chunk);

    if (this.buffer.length >= this.batchSize) {
      this.push([...this.buffer]);
      this.buffer = [];
    }

    callback();
  }

  /**
   * Flush remaining items
   * @param {Function} callback - Completion callback
   */
  _flush(callback) {
    if (this.buffer.length > 0) {
      this.push([...this.buffer]);
      this.buffer = [];
    }
    callback();
  }
}

/**
 * Rate limit transform stream
 * Limits throughput to specified items per second
 */
export class RateLimitTransform extends Transform {
  /**
   * @param {number} itemsPerSecond - Maximum items per second
   * @param {object} [options] - Stream options
   */
  constructor(itemsPerSecond, options = {}) {
    super({
      ...options,
      objectMode: true
    });
    this.delay = 1000 / itemsPerSecond;
    this.lastTime = 0;
  }

  /**
   * Transform implementation with rate limiting
   * @param {object} chunk - Input object
   * @param {string} encoding - Chunk encoding
   * @param {Function} callback - Completion callback
   */
  async _transform(chunk, encoding, callback) {
    try {
      const now = Date.now();
      const elapsed = now - this.lastTime;

      if (elapsed < this.delay) {
        await new Promise((resolve) => setTimeout(resolve, this.delay - elapsed));
      }

      this.lastTime = Date.now();
      this.push(chunk);
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

  console.log('=== Object Transform Examples ===\n');

  // Sample data
  const users = [
    { id: 1, name: 'Alice', age: 25, active: true },
    { id: 2, name: 'Bob', age: 30, active: false },
    { id: 3, name: 'Charlie', age: 35, active: true },
    { id: 4, name: 'David', age: 28, active: true },
    { id: 5, name: 'Eve', age: 32, active: false }
  ];

  // Example 1: Filter active users
  console.log('1. Filter (active users only):');
  const filterStream = Readable.from(users)
    .pipe(new FilterTransform((user) => user.active));

  for await (const user of filterStream) {
    console.log(`  - ${user.name} (${user.age})`);
  }
  console.log();

  // Example 2: Map to uppercase names
  console.log('2. Map (uppercase names):');
  const mapStream = Readable.from(users)
    .pipe(new MapTransform((user) => ({
      ...user,
      name: user.name.toUpperCase()
    })));

  for await (const user of mapStream) {
    console.log(`  - ${user.name}`);
  }
  console.log();

  // Example 3: Batch processing
  console.log('3. Batch (groups of 2):');
  const batchStream = Readable.from(users)
    .pipe(new BatchTransform(2));

  let batchNum = 1;
  for await (const batch of batchStream) {
    console.log(`  Batch ${batchNum++}:`, batch.map((u) => u.name).join(', '));
  }
  console.log();

  // Example 4: Chained transforms
  console.log('4. Chained (filter active -> map names -> batch):');
  const chainedStream = Readable.from(users)
    .pipe(new FilterTransform((user) => user.active))
    .pipe(new MapTransform((user) => user.name))
    .pipe(new BatchTransform(2));

  let chainBatch = 1;
  for await (const batch of chainedStream) {
    console.log(`  Batch ${chainBatch++}:`, batch.join(', '));
  }
  console.log();

  // Example 5: Rate limiting
  console.log('5. Rate Limit (2 items/second):');
  const startTime = Date.now();
  const rateLimitStream = Readable.from([1, 2, 3, 4, 5])
    .pipe(new RateLimitTransform(2));

  for await (const item of rateLimitStream) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`  [${elapsed}s] Item ${item}`);
  }
  console.log();
}

// Run example if executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  example();
}
