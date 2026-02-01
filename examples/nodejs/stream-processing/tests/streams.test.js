/**
 * Stream processing tests using Vitest
 */

import { describe, it, expect } from 'vitest';
import { Readable, Writable, pipeline } from 'stream';
import { promisify } from 'util';
import {
  UpperCaseTransform,
  LowerCaseTransform,
  ReverseTransform
} from '../transforms/text-transform.js';
import {
  FilterTransform,
  MapTransform,
  BatchTransform
} from '../transforms/object-transform.js';
import { BackpressureTransform } from '../transforms/backpressure-transform.js';
import { PipelineBuilder } from '../processors/pipeline.js';

const pipelineAsync = promisify(pipeline);

/**
 * Helper to collect stream output
 * @param {Readable} stream - Input stream
 * @returns {Promise<Array>} Collected chunks
 */
async function collect(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return chunks;
}

describe('Text Transforms', () => {
  it('should transform text to uppercase', async () => {
    const input = Readable.from(['hello', ' ', 'world']);
    const transform = new UpperCaseTransform();
    
    const result = await collect(input.pipe(transform));
    expect(result.join('')).toBe('HELLO WORLD');
  });

  it('should transform text to lowercase', async () => {
    const input = Readable.from(['HELLO', ' ', 'WORLD']);
    const transform = new LowerCaseTransform();
    
    const result = await collect(input.pipe(transform));
    expect(result.join('')).toBe('hello world');
  });

  it('should reverse text', async () => {
    const input = Readable.from(['hello']);
    const transform = new ReverseTransform();
    
    const result = await collect(input.pipe(transform));
    expect(result.join('')).toBe('olleh');
  });

  it('should chain transforms', async () => {
    const input = Readable.from(['hello']);
    const uppercase = new UpperCaseTransform();
    const reverse = new ReverseTransform();
    
    const result = await collect(input.pipe(uppercase).pipe(reverse));
    expect(result.join('')).toBe('OLLEH');
  });
});

describe('Object Transforms', () => {
  const sampleData = [
    { id: 1, name: 'Alice', age: 25, active: true },
    { id: 2, name: 'Bob', age: 30, active: false },
    { id: 3, name: 'Charlie', age: 35, active: true },
    { id: 4, name: 'David', age: 28, active: false }
  ];

  it('should filter objects', async () => {
    const input = Readable.from(sampleData);
    const filter = new FilterTransform((obj) => obj.active);
    
    const result = await collect(input.pipe(filter));
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Alice');
    expect(result[1].name).toBe('Charlie');
  });

  it('should map objects', async () => {
    const input = Readable.from(sampleData);
    const mapper = new MapTransform((obj) => ({
      ...obj,
      name: obj.name.toUpperCase()
    }));
    
    const result = await collect(input.pipe(mapper));
    expect(result).toHaveLength(4);
    expect(result[0].name).toBe('ALICE');
    expect(result[1].name).toBe('BOB');
  });

  it('should batch objects', async () => {
    const input = Readable.from(sampleData);
    const batcher = new BatchTransform(2);
    
    const result = await collect(input.pipe(batcher));
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(2);
    expect(result[1]).toHaveLength(2);
  });

  it('should batch with remainder', async () => {
    const input = Readable.from([1, 2, 3, 4, 5]);
    const batcher = new BatchTransform(2);
    
    const result = await collect(input.pipe(batcher));
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual([1, 2]);
    expect(result[1]).toEqual([3, 4]);
    expect(result[2]).toEqual([5]);
  });

  it('should chain filter and map', async () => {
    const input = Readable.from(sampleData);
    const filter = new FilterTransform((obj) => obj.age > 28);
    const mapper = new MapTransform((obj) => obj.name);
    
    const result = await collect(input.pipe(filter).pipe(mapper));
    expect(result).toEqual(['Bob', 'Charlie']);
  });
});

describe('Backpressure', () => {
  it('should handle backpressure with slow processing', async () => {
    const items = Array.from({ length: 10 }, (_, i) => i);
    const input = Readable.from(items);

    const transform = new BackpressureTransform(
      async (item) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return item * 2;
      },
      { maxConcurrent: 2 }
    );

    const result = await collect(input.pipe(transform));
    expect(result).toHaveLength(10);
    expect(result[0]).toBe(0);
    expect(result[9]).toBe(18);

    const stats = transform.getStats();
    expect(stats.processing).toBe(0); // All processing complete
  });

  it('should respect concurrency limit', async () => {
    let maxConcurrent = 0;
    let currentConcurrent = 0;

    const items = Array.from({ length: 20 }, (_, i) => i);
    const input = Readable.from(items);

    const transform = new BackpressureTransform(
      async (item) => {
        currentConcurrent++;
        maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
        await new Promise((resolve) => setTimeout(resolve, 5));
        currentConcurrent--;
        return item;
      },
      { maxConcurrent: 3 }
    );

    await collect(input.pipe(transform));
    expect(maxConcurrent).toBeLessThanOrEqual(3);
  });
});

describe('Pipeline Builder', () => {
  it('should build and execute simple pipeline', async () => {
    const input = Readable.from([1, 2, 3, 4, 5]);
    
    const result = await new PipelineBuilder()
      .filter((n) => n % 2 === 0)
      .map((n) => n * 2)
      .collect(input);

    expect(result).toEqual([4, 8]);
  });

  it('should handle async transformations', async () => {
    const input = Readable.from([1, 2, 3]);
    
    const result = await new PipelineBuilder()
      .map(async (n) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return n * 2;
      })
      .collect(input);

    expect(result).toEqual([2, 4, 6]);
  });

  it('should batch items', async () => {
    const input = Readable.from([1, 2, 3, 4, 5]);
    
    const result = await new PipelineBuilder()
      .batch(2)
      .collect(input);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual([1, 2]);
    expect(result[1]).toEqual([3, 4]);
    expect(result[2]).toEqual([5]);
  });

  it('should filter and map in sequence', async () => {
    const users = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 35 }
    ];
    const input = Readable.from(users);
    
    const result = await new PipelineBuilder()
      .filter((user) => user.age > 28)
      .map((user) => user.name)
      .collect(input);

    expect(result).toEqual(['Bob', 'Charlie']);
  });

  it('should handle complex pipeline', async () => {
    const input = Readable.from(Array.from({ length: 20 }, (_, i) => i + 1));
    
    const result = await new PipelineBuilder()
      .filter((n) => n % 2 === 0)
      .map((n) => n * 2)
      .filter((n) => n > 10)
      .batch(3)
      .collect(input);

    expect(result.length).toBeGreaterThan(0);
    result.forEach((batch) => {
      expect(Array.isArray(batch)).toBe(true);
      batch.forEach((n) => {
        expect(n).toBeGreaterThan(10);
        expect(n % 4).toBe(0);
      });
    });
  });
});

describe('Stream Error Handling', () => {
  it('should propagate errors from transform', async () => {
    const input = Readable.from([1, 2, 3, 4, 5]);
    
    const transform = new MapTransform((n) => {
      if (n === 3) throw new Error('Number 3 is bad');
      return n * 2;
    });

    await expect(collect(input.pipe(transform))).rejects.toThrow('Number 3 is bad');
  });

  it('should handle errors in pipeline', async () => {
    const input = Readable.from([1, 2, 3, 4, 5]);
    
    await expect(
      new PipelineBuilder()
        .map((n) => {
          if (n === 3) throw new Error('Error at 3');
          return n;
        })
        .collect(input)
    ).rejects.toThrow('Error at 3');
  });
});

describe('Stream Performance', () => {
  it('should process large dataset efficiently', async () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => i);
    const input = Readable.from(largeDataset);
    
    const startTime = Date.now();
    const result = await new PipelineBuilder()
      .filter((n) => n % 2 === 0)
      .map((n) => n * 2)
      .batch(10)
      .collect(input);
    
    const elapsed = Date.now() - startTime;
    
    expect(result.length).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(1000); // Should complete in under 1 second
  });

  it('should handle high throughput', async () => {
    const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, value: i * 2 }));
    const input = Readable.from(items);
    
    const result = await new PipelineBuilder()
      .filter((item) => item.id % 10 === 0)
      .map((item) => item.value)
      .collect(input);
    
    expect(result).toHaveLength(1000);
  });
});
