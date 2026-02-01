# Node.js Stream Processing Examples

Production-ready Node.js Streams API examples demonstrating transforms, backpressure handling, pipeline composition, and real-world data processing patterns.

## Features

- ✅ **Transform Streams** - Custom transforms for text and objects
- 🔄 **Backpressure** - Proper flow control and memory management
- 📊 **CSV/JSON Processing** - Real-world data format handling
- 🔗 **Pipeline Composition** - Fluent API for stream pipelines
- 🧪 **Test Coverage** - Vitest with stream assertions
- 📝 **JSDoc** - Full API documentation
- 🚀 **Pure ESM** - Modern ES modules

## Project Structure

```
stream-processing/
├── transforms/
│   ├── text-transform.js           # Text transformation streams
│   ├── object-transform.js         # Object filtering, mapping, batching
│   └── backpressure-transform.js   # Backpressure handling examples
├── processors/
│   ├── csv-processor.js            # CSV stream processing
│   ├── json-processor.js           # JSONL stream processing
│   └── pipeline.js                 # Pipeline composition utilities
├── tests/
│   └── streams.test.js             # Stream tests with assertions
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Usage Examples

### Text Transforms

```javascript
import { UpperCaseTransform, ReverseTransform } from './transforms/text-transform.js';
import { Readable } from 'stream';

// Uppercase transform
const input = Readable.from(['hello ', 'world']);
const uppercase = new UpperCaseTransform();

input.pipe(uppercase).on('data', (chunk) => {
  console.log(chunk); // HELLO WORLD
});

// Chained transforms
const chain = input.pipe(new UpperCaseTransform()).pipe(new ReverseTransform());
```

### Object Transforms

```javascript
import { FilterTransform, MapTransform, BatchTransform } from './transforms/object-transform.js';

const users = [
  { id: 1, name: 'Alice', age: 25, active: true },
  { id: 2, name: 'Bob', age: 30, active: false }
];

// Filter active users
Readable.from(users)
  .pipe(new FilterTransform((user) => user.active))
  .on('data', (user) => console.log(user.name));

// Map to uppercase names
Readable.from(users)
  .pipe(new MapTransform((user) => ({
    ...user,
    name: user.name.toUpperCase()
  })))
  .on('data', (user) => console.log(user.name));

// Batch processing
Readable.from(users)
  .pipe(new BatchTransform(2))
  .on('data', (batch) => {
    console.log('Batch:', batch.map(u => u.name));
  });
```

### Backpressure Handling

```javascript
import { BackpressureTransform } from './transforms/backpressure-transform.js';

const transform = new BackpressureTransform(
  async (item) => {
    // Slow async processing
    await heavyComputation(item);
    return processed;
  },
  { 
    maxConcurrent: 10,      // Max concurrent operations
    highWaterMark: 16       // Buffer size
  }
);

Readable.from(largeDataset)
  .pipe(transform)
  .on('data', handleProcessed);

// Monitor backpressure
const stats = transform.getStats();
console.log('Processing:', stats.processing);
console.log('Backpressure events:', stats.backpressureEvents);
```

### CSV Processing

```javascript
import { CSVProcessor } from './processors/csv-processor.js';

// Parse CSV file
for await (const row of CSVProcessor.parseFile('users.csv')) {
  console.log(row.name, row.age);
}

// Transform CSV
await CSVProcessor.processFile(
  'input.csv',
  'output.csv',
  async (row) => ({
    ...row,
    name: row.name.toUpperCase(),
    processed: true
  })
);

// Filter CSV
await CSVProcessor.filterFile(
  'users.csv',
  'adults.csv',
  (row) => parseInt(row.age) >= 18
);

// Aggregate CSV data
const stats = await CSVProcessor.aggregate(
  'sales.csv',
  (acc, row) => {
    acc.total += parseFloat(row.amount);
    return acc;
  },
  { total: 0 }
);
```

### JSON Lines (JSONL) Processing

```javascript
import { JSONProcessor, JSONLParser, JSONLStringifier } from './processors/json-processor.js';

// Parse JSONL file
for await (const log of JSONProcessor.parseJSONL('logs.jsonl')) {
  console.log(`[${log.level}] ${log.message}`);
}

// Transform JSONL
await JSONProcessor.transformJSONL(
  'input.jsonl',
  'output.jsonl',
  (log) => ({
    ...log,
    processedAt: new Date().toISOString()
  })
);

// Write JSONL
const logs = async function* () {
  for (const log of logsArray) {
    yield log;
  }
};

await JSONProcessor.writeJSONL('output.jsonl', logs());

// Stream processing with async generator
const processed = async function* () {
  for await (const item of JSONProcessor.parseJSONL('data.jsonl')) {
    const result = await processItem(item);
    yield result;
  }
};

await JSONProcessor.writeJSONL('results.jsonl', processed());
```

### Pipeline Composition

```javascript
import { PipelineBuilder } from './processors/pipeline.js';
import { Readable } from 'stream';

// Fluent pipeline API
const results = await new PipelineBuilder()
  .filter((n) => n % 2 === 0)          // Keep even numbers
  .map((n) => n * 2)                    // Double them
  .batch(3)                             // Group into batches of 3
  .collect(Readable.from([1, 2, 3, 4, 5, 6, 7, 8]));

console.log(results); // [[4, 8, 12], [16]]

// Async transformations
const processed = await new PipelineBuilder()
  .map(async (item) => {
    const result = await apiCall(item);
    return result;
  })
  .filter((result) => result.success)
  .batch(10)
  .collect(input);

// Error handling
await new PipelineBuilder()
  .map((item) => processItem(item))
  .catch((error) => {
    console.error('Pipeline error:', error);
  })
  .execute(input, output);
```

### Real-World Example: Log Processing

```javascript
import { JSONProcessor } from './processors/json-processor.js';
import { PipelineBuilder } from './processors/pipeline.js';

// Process application logs
async function processLogs() {
  const logStream = async function* () {
    for await (const log of JSONProcessor.parseJSONL('app.log')) {
      yield log;
    }
  };

  const alerts = await new PipelineBuilder()
    // Filter errors and warnings
    .filter((log) => ['error', 'warn'].includes(log.level))
    // Enrich with metadata
    .map((log) => ({
      ...log,
      severity: log.level === 'error' ? 'high' : 'medium',
      timestamp: new Date(log.timestamp)
    }))
    // Filter recent logs (last hour)
    .filter((log) => {
      const hourAgo = Date.now() - 60 * 60 * 1000;
      return log.timestamp.getTime() > hourAgo;
    })
    // Batch for API submission
    .batch(100)
    .collect(Readable.from(logStream()));

  // Send alerts in batches
  for (const batch of alerts) {
    await sendToAlertingSystem(batch);
  }
}
```

## Running Examples

```bash
# Run CSV processing example
npm run example:csv

# Run JSON processing example
npm run example:json

# Run pipeline composition example
npm run example:pipeline

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Stream Patterns

### 1. Transform Pattern

```javascript
class MyTransform extends Transform {
  constructor(options) {
    super({ objectMode: true, ...options });
  }

  _transform(chunk, encoding, callback) {
    try {
      const result = this.processChunk(chunk);
      this.push(result);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
```

### 2. Async Transform Pattern

```javascript
class AsyncTransform extends Transform {
  async _transform(chunk, encoding, callback) {
    try {
      const result = await this.asyncProcess(chunk);
      this.push(result);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}
```

### 3. Flush Pattern

```javascript
class BufferedTransform extends Transform {
  constructor() {
    super({ objectMode: true });
    this.buffer = [];
  }

  _transform(chunk, encoding, callback) {
    this.buffer.push(chunk);
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
    callback();
  }

  _flush(callback) {
    if (this.buffer.length > 0) {
      this.push(this.buffer);
      this.buffer = [];
    }
    callback();
  }
}
```

### 4. Pipeline Pattern

```javascript
import { pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

await pipelineAsync(
  inputStream,
  transform1,
  transform2,
  transform3,
  outputStream
);
```

### 5. Async Iterator Pattern

```javascript
// Producer
async function* generateData() {
  for (let i = 0; i < 100; i++) {
    yield { id: i, data: await fetchData(i) };
  }
}

// Consumer
for await (const item of generateData()) {
  await processItem(item);
}
```

## Performance Tips

1. **Use object mode** for structured data processing
2. **Set appropriate highWaterMark** to control memory usage
3. **Handle backpressure** by respecting `push()` return value
4. **Limit concurrency** in async transforms
5. **Batch operations** when making external API calls
6. **Use pipeline()** for automatic error handling
7. **Monitor memory** with `process.memoryUsage()`

## Testing

```javascript
import { describe, it, expect } from 'vitest';
import { Readable } from 'stream';

describe('MyTransform', () => {
  it('should transform data', async () => {
    const input = Readable.from([1, 2, 3]);
    const transform = new MyTransform();
    
    const results = [];
    for await (const chunk of input.pipe(transform)) {
      results.push(chunk);
    }
    
    expect(results).toEqual([2, 4, 6]);
  });
});
```

## Error Handling

```javascript
// Stream error handling
stream.on('error', (error) => {
  console.error('Stream error:', error);
});

// Pipeline error handling
pipeline(input, transform, output, (error) => {
  if (error) {
    console.error('Pipeline failed:', error);
  } else {
    console.log('Pipeline succeeded');
  }
});

// Async/await error handling
try {
  await pipelineAsync(input, transform, output);
} catch (error) {
  console.error('Pipeline error:', error);
}
```

## Backpressure Monitoring

```javascript
const readable = new Readable({
  read() {
    const canContinue = this.push(data);
    if (!canContinue) {
      console.log('Backpressure detected, pausing...');
    }
  }
});

readable.on('drain', () => {
  console.log('Drain event, resuming...');
});
```

## Common Use Cases

- **Log Processing** - Parse, filter, and aggregate application logs
- **Data ETL** - Extract, transform, load data pipelines
- **CSV/JSON Conversion** - Convert between data formats
- **API Rate Limiting** - Control request throughput
- **Batch Processing** - Group items for efficient processing
- **Real-time Analytics** - Process streaming data
- **File Processing** - Process large files without loading into memory

## Modern JavaScript Features

- **ESM imports** - `import`/`export` syntax
- **Top-level await** - Async at module level
- **Async iterators** - `for await...of` loops
- **Async generators** - `async function*`
- **Pipeline operator** - Stream composition
- **Nullish coalescing** - `??` operator
- **Optional chaining** - `?.` operator

## Next Steps

1. Implement parallel processing with worker threads
2. Add Prometheus metrics for stream monitoring
3. Create custom Duplex streams
4. Implement stream multiplexing
5. Add compression/decompression transforms
6. Create stream debugging utilities
7. Implement circuit breaker pattern
8. Add retry logic with exponential backoff

## License

MIT
