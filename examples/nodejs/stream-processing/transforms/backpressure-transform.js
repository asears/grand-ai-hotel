/**
 * Transform stream with backpressure handling
 * Demonstrates proper flow control
 */

import { Transform } from 'stream';

/**
 * Transform stream with backpressure monitoring
 */
export class BackpressureTransform extends Transform {
  /**
   * @param {Function} processor - Async processing function
   * @param {object} [options] - Stream options
   */
  constructor(processor, options = {}) {
    super({
      ...options,
      objectMode: true,
      highWaterMark: options.highWaterMark || 16
    });
    this.processor = processor;
    this.processing = 0;
    this.maxConcurrent = options.maxConcurrent || 10;
    this.backpressureCount = 0;
  }

  /**
   * Transform with concurrency control
   * @param {any} chunk - Input chunk
   * @param {string} encoding - Chunk encoding
   * @param {Function} callback - Completion callback
   */
  async _transform(chunk, encoding, callback) {
    // Wait if too many concurrent operations
    while (this.processing >= this.maxConcurrent) {
      this.backpressureCount++;
      await new Promise((resolve) => setImmediate(resolve));
    }

    this.processing++;

    try {
      const result = await this.processor(chunk);
      const canContinue = this.push(result);

      if (!canContinue) {
        // Downstream is applying backpressure
        this.backpressureCount++;
      }

      callback();
    } catch (error) {
      callback(error);
    } finally {
      this.processing--;
    }
  }

  /**
   * Get backpressure statistics
   * @returns {object} Statistics
   */
  getStats() {
    return {
      processing: this.processing,
      backpressureEvents: this.backpressureCount,
      highWaterMark: this.readableHighWaterMark
    };
  }
}

/**
 * Slow consumer stream for testing backpressure
 */
export class SlowConsumer extends Transform {
  /**
   * @param {number} delayMs - Delay in milliseconds
   * @param {object} [options] - Stream options
   */
  constructor(delayMs, options = {}) {
    super({
      ...options,
      objectMode: true
    });
    this.delayMs = delayMs;
    this.itemsProcessed = 0;
  }

  /**
   * Slow transform implementation
   * @param {any} chunk - Input chunk
   * @param {string} encoding - Chunk encoding
   * @param {Function} callback - Completion callback
   */
  async _transform(chunk, encoding, callback) {
    // Simulate slow processing
    await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    this.itemsProcessed++;
    this.push(chunk);
    callback();
  }
}

/**
 * Fast producer readable stream
 */
export class FastProducer {
  /**
   * Create a fast producer stream
   * @param {number} count - Number of items to produce
   * @returns {import('stream').Readable}
   */
  static create(count) {
    const { Readable } = require('stream');

    let i = 0;
    return new Readable({
      objectMode: true,
      read() {
        if (i < count) {
          // Push items rapidly
          const pushed = this.push({ id: i++, timestamp: Date.now() });
          if (!pushed) {
            console.log('Producer: backpressure detected, pausing...');
          }
        } else {
          this.push(null); // End stream
        }
      }
    });
  }
}

/**
 * Example demonstrating backpressure
 */
async function example() {
  const { Readable, pipeline } = await import('stream');
  const { promisify } = await import('util');
  const pipelineAsync = promisify(pipeline);

  console.log('=== Backpressure Examples ===\n');

  // Example 1: Fast producer, slow consumer
  console.log('1. Backpressure with slow consumer:');
  const items = Array.from({ length: 20 }, (_, i) => ({ id: i }));
  const fastProducer = Readable.from(items);

  const slowProcessor = new BackpressureTransform(
    async (item) => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return { ...item, processed: true };
    },
    { maxConcurrent: 3, highWaterMark: 5 }
  );

  const slowConsumer = new SlowConsumer(100);

  let outputCount = 0;
  const startTime = Date.now();

  try {
    await pipelineAsync(
      fastProducer,
      slowProcessor,
      slowConsumer,
      async function* (source) {
        for await (const item of source) {
          outputCount++;
          if (outputCount % 5 === 0) {
            const stats = slowProcessor.getStats();
            console.log(
              `  Processed: ${outputCount}, ` +
              `Concurrent: ${stats.processing}, ` +
              `Backpressure events: ${stats.backpressureEvents}`
            );
          }
          yield item;
        }
      }
    );

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`  Total time: ${elapsed}s`);
    console.log(`  Final stats:`, slowProcessor.getStats());
  } catch (error) {
    console.error('Pipeline error:', error);
  }

  console.log();

  // Example 2: Controlled flow
  console.log('2. Controlled flow with highWaterMark:');
  const controlledProducer = Readable.from(
    Array.from({ length: 100 }, (_, i) => i),
    { highWaterMark: 10 }
  );

  const processor = new Transform({
    objectMode: true,
    highWaterMark: 5,
    async transform(chunk, encoding, callback) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      this.push(chunk * 2);
      callback();
    }
  });

  let buffered = 0;
  processor.on('data', () => {
    buffered++;
  });

  processor.on('end', () => {
    console.log(`  Processed ${buffered} items with controlled buffering`);
  });

  controlledProducer.pipe(processor);
  await new Promise((resolve) => processor.on('end', resolve));
  console.log();

  // Example 3: Handling backpressure events
  console.log('3. Manual backpressure handling:');
  const manualProducer = new Readable({
    objectMode: true,
    highWaterMark: 5,
    read() {
      // Producer logic
    }
  });

  let produced = 0;
  const maxItems = 50;

  const produceItem = () => {
    let canContinue = true;
    while (produced < maxItems && canContinue) {
      canContinue = manualProducer.push({ id: produced++ });
      if (!canContinue) {
        console.log(`  Backpressure at item ${produced}, pausing...`);
      }
    }

    if (produced >= maxItems) {
      manualProducer.push(null);
    }
  };

  manualProducer.on('drain', () => {
    console.log(`  Drain event, resuming production...`);
    produceItem();
  });

  produceItem();

  let consumed = 0;
  for await (const item of manualProducer) {
    consumed++;
    // Simulate slow consumption
    await new Promise((resolve) => setTimeout(resolve, 5));
  }

  console.log(`  Produced: ${produced}, Consumed: ${consumed}`);
  console.log();
}

// Run example if executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  example();
}
