/**
 * Stream pipeline composition
 * Demonstrates combining multiple transforms into pipelines
 */

import { pipeline, Transform, Readable, Writable } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

/**
 * Create a composed pipeline from transforms
 * @param {...Transform} transforms - Transform streams to compose
 * @returns {Transform} Composed transform stream
 */
export function compose(...transforms) {
  return new Transform({
    objectMode: true,
    async transform(chunk, encoding, callback) {
      let current = chunk;

      try {
        for (const transform of transforms) {
          current = await new Promise((resolve, reject) => {
            const result = [];
            
            const collect = new Writable({
              objectMode: true,
              write(chunk, encoding, cb) {
                result.push(chunk);
                cb();
              }
            });

            const source = Readable.from([current]);
            
            pipeline(source, transform, collect, (err) => {
              if (err) reject(err);
              else resolve(result[0] || current);
            });
          });
        }

        this.push(current);
        callback();
      } catch (error) {
        callback(error);
      }
    }
  });
}

/**
 * Pipeline builder for fluent API
 */
export class PipelineBuilder {
  constructor() {
    this.transforms = [];
    this.errorHandlers = [];
  }

  /**
   * Add transform to pipeline
   * @param {Transform|Function} transform - Transform stream or function
   * @returns {PipelineBuilder} Builder instance
   */
  pipe(transform) {
    if (typeof transform === 'function') {
      this.transforms.push(new Transform({
        objectMode: true,
        async transform(chunk, encoding, callback) {
          try {
            const result = await transform(chunk);
            if (result !== null && result !== undefined) {
              this.push(result);
            }
            callback();
          } catch (error) {
            callback(error);
          }
        }
      }));
    } else {
      this.transforms.push(transform);
    }
    return this;
  }

  /**
   * Add filter to pipeline
   * @param {Function} predicate - Filter predicate
   * @returns {PipelineBuilder} Builder instance
   */
  filter(predicate) {
    return this.pipe(async (chunk) => {
      return predicate(chunk) ? chunk : null;
    });
  }

  /**
   * Add map transform to pipeline
   * @param {Function} mapper - Mapper function
   * @returns {PipelineBuilder} Builder instance
   */
  map(mapper) {
    return this.pipe(mapper);
  }

  /**
   * Add batch transform to pipeline
   * @param {number} size - Batch size
   * @returns {PipelineBuilder} Builder instance
   */
  batch(size) {
    let buffer = [];

    return this.pipe(new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        buffer.push(chunk);
        if (buffer.length >= size) {
          this.push([...buffer]);
          buffer = [];
        }
        callback();
      },
      flush(callback) {
        if (buffer.length > 0) {
          this.push([...buffer]);
        }
        callback();
      }
    }));
  }

  /**
   * Add error handler
   * @param {Function} handler - Error handler function
   * @returns {PipelineBuilder} Builder instance
   */
  catch(handler) {
    this.errorHandlers.push(handler);
    return this;
  }

  /**
   * Execute pipeline
   * @param {Readable} source - Input stream
   * @param {Writable} [destination] - Output stream
   * @returns {Promise<void>}
   */
  async execute(source, destination) {
    const streams = [source, ...this.transforms];
    
    if (destination) {
      streams.push(destination);
    }

    try {
      await pipelineAsync(...streams);
    } catch (error) {
      for (const handler of this.errorHandlers) {
        await handler(error);
      }
      throw error;
    }
  }

  /**
   * Execute pipeline and collect results
   * @param {Readable} source - Input stream
   * @returns {Promise<Array>} Collected results
   */
  async collect(source) {
    const results = [];
    
    const collector = new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        results.push(chunk);
        callback();
      }
    });

    await this.execute(source, collector);
    return results;
  }
}

/**
 * Example usage
 */
async function example() {
  console.log('=== Pipeline Composition Examples ===\n');

  // Sample data
  const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
  const users = [
    { id: 1, name: 'Alice', age: 25, active: true },
    { id: 2, name: 'Bob', age: 30, active: false },
    { id: 3, name: 'Charlie', age: 35, active: true },
    { id: 4, name: 'David', age: 28, active: true },
    { id: 5, name: 'Eve', age: 32, active: false },
    { id: 6, name: 'Frank', age: 45, active: true }
  ];

  // Example 1: Simple pipeline with fluent API
  console.log('1. Simple pipeline (filter even, multiply by 2, batch):');
  
  const result1 = await new PipelineBuilder()
    .filter((n) => n % 2 === 0)
    .map((n) => n * 2)
    .batch(3)
    .collect(Readable.from(numbers));

  result1.forEach((batch, i) => {
    console.log(`  Batch ${i + 1}:`, batch);
  });
  console.log();

  // Example 2: Complex user processing pipeline
  console.log('2. User processing pipeline:');
  
  const result2 = await new PipelineBuilder()
    .filter((user) => user.active)
    .map((user) => ({
      ...user,
      name: user.name.toUpperCase(),
      ageGroup: user.age < 30 ? 'young' : 'senior'
    }))
    .filter((user) => user.ageGroup === 'young')
    .collect(Readable.from(users));

  console.log('  Filtered and transformed users:');
  result2.forEach((user) => {
    console.log(`  - ${user.name} (${user.age}, ${user.ageGroup})`);
  });
  console.log();

  // Example 3: Pipeline with error handling
  console.log('3. Pipeline with error handling:');
  
  let errorCaught = false;
  await new PipelineBuilder()
    .map((n) => {
      if (n === 5) throw new Error('Number 5 not allowed!');
      return n * 2;
    })
    .catch((error) => {
      console.log(`  Error caught: ${error.message}`);
      errorCaught = true;
    })
    .collect(Readable.from([1, 2, 3, 4, 5, 6]))
    .catch(() => {
      console.log('  Pipeline failed as expected');
    });

  console.log();

  // Example 4: Async processing pipeline
  console.log('4. Async processing pipeline:');
  
  const startTime = Date.now();
  const result4 = await new PipelineBuilder()
    .map(async (n) => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return n * 2;
    })
    .filter((n) => n > 10)
    .collect(Readable.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

  const elapsed = Date.now() - startTime;
  console.log(`  Results: ${result4.join(', ')}`);
  console.log(`  Time elapsed: ${elapsed}ms\n`);

  // Example 5: Multi-stage aggregation pipeline
  console.log('5. Multi-stage aggregation pipeline:');
  
  const logs = [
    { level: 'info', service: 'api', message: 'Request received' },
    { level: 'error', service: 'api', message: 'Database error' },
    { level: 'info', service: 'worker', message: 'Job started' },
    { level: 'error', service: 'worker', message: 'Job failed' },
    { level: 'warn', service: 'api', message: 'Slow query' },
    { level: 'info', service: 'api', message: 'Request completed' }
  ];

  const result5 = await new PipelineBuilder()
    .filter((log) => log.level === 'error')
    .map((log) => ({
      service: log.service,
      errorMessage: log.message.toUpperCase()
    }))
    .batch(2)
    .collect(Readable.from(logs));

  console.log('  Error batches:');
  result5.forEach((batch, i) => {
    console.log(`  Batch ${i + 1}:`);
    batch.forEach((item) => {
      console.log(`    [${item.service}] ${item.errorMessage}`);
    });
  });
  console.log();

  // Example 6: Custom transform in pipeline
  console.log('6. Custom transform in pipeline:');
  
  const customTransform = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      // Emit original and doubled value
      this.push(chunk);
      this.push(chunk * 2);
      callback();
    }
  });

  const result6 = await new PipelineBuilder()
    .pipe(customTransform)
    .filter((n) => n % 3 === 0)
    .collect(Readable.from([1, 2, 3, 4, 5]));

  console.log(`  Results: ${result6.join(', ')}\n`);

  // Example 7: Pipeline with statistics
  console.log('7. Pipeline with statistics:');
  
  let processedCount = 0;
  let filteredCount = 0;

  const statsTransform = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      processedCount++;
      this.push(chunk);
      callback();
    }
  });

  const result7 = await new PipelineBuilder()
    .pipe(statsTransform)
    .filter((n) => {
      const pass = n > 10;
      if (pass) filteredCount++;
      return pass;
    })
    .collect(Readable.from(numbers));

  console.log(`  Processed: ${processedCount} items`);
  console.log(`  Filtered: ${filteredCount} items`);
  console.log(`  Results: ${result7.join(', ')}\n`);

  console.log('Examples completed successfully!');
}

// Run example if executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  example();
}
