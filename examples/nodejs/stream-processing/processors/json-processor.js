/**
 * JSON processing with streams
 * Demonstrates streaming JSON parsing and generation
 */

import { Transform, pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';
import { writeFile, mkdir } from 'fs/promises';
import { promisify } from 'util';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pipelineAsync = promisify(pipeline);

/**
 * JSON Lines (JSONL) parser transform
 * Parses newline-delimited JSON
 */
export class JSONLParser extends Transform {
  /**
   * @param {object} [options] - Stream options
   */
  constructor(options = {}) {
    super({
      ...options,
      objectMode: true
    });
    this.buffer = '';
  }

  /**
   * Parse JSONL chunks
   * @param {Buffer|string} chunk - Input chunk
   * @param {string} encoding - Encoding
   * @param {Function} callback - Callback
   */
  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');

    // Keep last incomplete line in buffer
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) {
        try {
          const obj = JSON.parse(line);
          this.push(obj);
        } catch (error) {
          this.emit('error', new Error(`Invalid JSON: ${line}`));
          return callback(error);
        }
      }
    }

    callback();
  }

  /**
   * Flush remaining buffer
   * @param {Function} callback - Callback
   */
  _flush(callback) {
    if (this.buffer.trim()) {
      try {
        const obj = JSON.parse(this.buffer);
        this.push(obj);
      } catch (error) {
        return callback(new Error(`Invalid JSON: ${this.buffer}`));
      }
    }
    callback();
  }
}

/**
 * JSON Lines stringifier transform
 */
export class JSONLStringifier extends Transform {
  /**
   * @param {object} [options] - Stream options
   */
  constructor(options = {}) {
    super({
      ...options,
      writableObjectMode: true,
      readableObjectMode: false
    });
    this.pretty = options.pretty || false;
  }

  /**
   * Stringify objects to JSONL
   * @param {object} chunk - Input object
   * @param {string} encoding - Encoding
   * @param {Function} callback - Callback
   */
  _transform(chunk, encoding, callback) {
    try {
      const json = this.pretty
        ? JSON.stringify(chunk, null, 2)
        : JSON.stringify(chunk);
      this.push(json + '\n');
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * JSON array parser transform
 * Parses JSON array and emits individual items
 */
export class JSONArrayParser extends Transform {
  /**
   * @param {object} [options] - Stream options
   */
  constructor(options = {}) {
    super({
      ...options,
      objectMode: true
    });
    this.buffer = '';
    this.depth = 0;
    this.inArray = false;
    this.currentItem = '';
  }

  /**
   * Parse JSON array
   * @param {Buffer|string} chunk - Input chunk
   * @param {string} encoding - Encoding
   * @param {Function} callback - Callback
   */
  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();

    try {
      this.parseBuffer();
      callback();
    } catch (error) {
      callback(error);
    }
  }

  /**
   * Parse accumulated buffer
   */
  parseBuffer() {
    for (let i = 0; i < this.buffer.length; i++) {
      const char = this.buffer[i];

      if (char === '[') {
        this.depth++;
        if (this.depth === 1) {
          this.inArray = true;
          continue;
        }
      } else if (char === ']') {
        this.depth--;
        if (this.depth === 0) {
          if (this.currentItem.trim()) {
            this.push(JSON.parse(this.currentItem));
          }
          this.buffer = this.buffer.slice(i + 1);
          return;
        }
      }

      if (this.inArray && this.depth > 0) {
        if (char === ',' && this.depth === 1) {
          if (this.currentItem.trim()) {
            this.push(JSON.parse(this.currentItem));
            this.currentItem = '';
          }
        } else if (this.depth > 0) {
          this.currentItem += char;
          if (char === '{') this.depth++;
          if (char === '}') this.depth--;
        }
      }
    }

    this.buffer = '';
  }

  /**
   * Flush remaining data
   * @param {Function} callback - Callback
   */
  _flush(callback) {
    if (this.currentItem.trim()) {
      try {
        this.push(JSON.parse(this.currentItem));
      } catch (error) {
        return callback(error);
      }
    }
    callback();
  }
}

/**
 * JSON processor class
 */
export class JSONProcessor {
  /**
   * Parse JSONL file
   * @param {string} filePath - Input file path
   * @returns {AsyncIterable<object>} Async iterable of objects
   */
  static async *parseJSONL(filePath) {
    const parser = new JSONLParser();
    const fileStream = createReadStream(filePath);
    const stream = fileStream.pipe(parser);

    for await (const obj of stream) {
      yield obj;
    }
  }

  /**
   * Write objects to JSONL file
   * @param {string} filePath - Output file path
   * @param {AsyncIterable<object>} objects - Objects to write
   * @param {object} [options] - Options
   */
  static async writeJSONL(filePath, objects, options = {}) {
    const stringifier = new JSONLStringifier(options);
    const writeStream = createWriteStream(filePath);

    await pipelineAsync(
      async function* () {
        for await (const obj of objects) {
          yield obj;
        }
      },
      stringifier,
      writeStream
    );
  }

  /**
   * Transform JSONL file
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @param {Function} transformer - Transformer function
   */
  static async transformJSONL(inputPath, outputPath, transformer) {
    const parser = new JSONLParser();
    const transformStream = new Transform({
      objectMode: true,
      async transform(chunk, encoding, callback) {
        try {
          const result = await transformer(chunk);
          if (result !== null && result !== undefined) {
            this.push(result);
          }
          callback();
        } catch (error) {
          callback(error);
        }
      }
    });
    const stringifier = new JSONLStringifier();

    await pipelineAsync(
      createReadStream(inputPath),
      parser,
      transformStream,
      stringifier,
      createWriteStream(outputPath)
    );
  }
}

/**
 * Example usage
 */
async function example() {
  console.log('=== JSON Processing Examples ===\n');

  // Create sample data directory
  const sampleDir = join(__dirname, '..', 'data');
  await mkdir(sampleDir, { recursive: true });

  // Example 1: JSONL processing
  console.log('1. JSONL Processing:\n');

  const jsonlFile = join(sampleDir, 'logs.jsonl');
  const sampleLogs = [
    { timestamp: '2024-01-29T10:00:00Z', level: 'info', message: 'Server started' },
    { timestamp: '2024-01-29T10:01:00Z', level: 'debug', message: 'Request received' },
    { timestamp: '2024-01-29T10:02:00Z', level: 'error', message: 'Database connection failed' },
    { timestamp: '2024-01-29T10:03:00Z', level: 'info', message: 'Request completed' },
    { timestamp: '2024-01-29T10:04:00Z', level: 'warn', message: 'High memory usage' }
  ];

  // Write JSONL
  await writeFile(jsonlFile, sampleLogs.map((log) => JSON.stringify(log)).join('\n'));
  console.log('  Created JSONL file\n');

  // Read and parse JSONL
  console.log('  Parsing JSONL:');
  for await (const log of JSONProcessor.parseJSONL(jsonlFile)) {
    console.log(`  [${log.level}] ${log.message}`);
  }
  console.log();

  // Example 2: Filter JSONL (errors only)
  console.log('2. Filter JSONL (errors and warnings):');
  const filteredFile = join(sampleDir, 'errors.jsonl');
  await JSONProcessor.transformJSONL(
    jsonlFile,
    filteredFile,
    (log) => ['error', 'warn'].includes(log.level) ? log : null
  );

  console.log('  Filtered logs:');
  for await (const log of JSONProcessor.parseJSONL(filteredFile)) {
    console.log(`  [${log.level}] ${log.message}`);
  }
  console.log();

  // Example 3: Transform JSONL (add metadata)
  console.log('3. Transform JSONL (add metadata):');
  const enrichedFile = join(sampleDir, 'logs_enriched.jsonl');
  await JSONProcessor.transformJSONL(
    jsonlFile,
    enrichedFile,
    (log) => ({
      ...log,
      processedAt: new Date().toISOString(),
      severity: log.level === 'error' ? 'high' : 'low'
    })
  );

  console.log('  Enriched logs:');
  let count = 0;
  for await (const log of JSONProcessor.parseJSONL(enrichedFile)) {
    if (count++ < 2) {
      console.log(`  [${log.level}/${log.severity}] ${log.message}`);
    }
  }
  console.log(`  ... (${count} total logs)\n`);

  // Example 4: Aggregate JSONL
  console.log('4. Aggregate JSONL (count by level):');
  const levelCounts = {};
  for await (const log of JSONProcessor.parseJSONL(jsonlFile)) {
    levelCounts[log.level] = (levelCounts[log.level] || 0) + 1;
  }

  Object.entries(levelCounts).forEach(([level, count]) => {
    console.log(`  ${level}: ${count}`);
  });
  console.log();

  // Example 5: Stream processing with async generator
  console.log('5. Stream processing with async generator:');
  const processed = async function* () {
    for await (const log of JSONProcessor.parseJSONL(jsonlFile)) {
      // Simulate async processing
      await new Promise((resolve) => setTimeout(resolve, 10));
      yield {
        ...log,
        processed: true,
        uppercaseMessage: log.message.toUpperCase()
      };
    }
  };

  const processedFile = join(sampleDir, 'logs_processed.jsonl');
  await JSONProcessor.writeJSONL(processedFile, processed());
  console.log('  Stream processing completed\n');

  console.log('Examples completed successfully!');
}

// Run example if executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  example().catch(console.error);
}
