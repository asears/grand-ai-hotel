/**
 * CSV processing with streams
 * Demonstrates reading, transforming, and writing CSV data
 */

import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
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
 * CSV row transform stream
 */
export class CSVTransform extends Transform {
  /**
   * @param {Function} transformer - Row transformation function
   * @param {object} [options] - Stream options
   */
  constructor(transformer, options = {}) {
    super({
      ...options,
      objectMode: true
    });
    this.transformer = transformer;
  }

  /**
   * Transform CSV row
   * @param {object} row - CSV row object
   * @param {string} encoding - Encoding
   * @param {Function} callback - Callback
   */
  async _transform(row, encoding, callback) {
    try {
      const transformed = await this.transformer(row);
      if (transformed !== null && transformed !== undefined) {
        this.push(transformed);
      }
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * CSV processor class
 */
export class CSVProcessor {
  /**
   * Parse CSV file to objects
   * @param {string} filePath - Input CSV file path
   * @param {object} [options] - Parser options
   * @returns {AsyncIterable<object>} Async iterable of rows
   */
  static async *parseFile(filePath, options = {}) {
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      ...options
    });

    const fileStream = createReadStream(filePath);
    const stream = fileStream.pipe(parser);

    for await (const row of stream) {
      yield row;
    }
  }

  /**
   * Process CSV file with transformation
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @param {Function} transformer - Row transformer function
   * @param {object} [options] - Options
   */
  static async processFile(inputPath, outputPath, transformer, options = {}) {
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      ...options.parse
    });

    const transformStream = new CSVTransform(transformer);

    const stringifier = stringify({
      header: true,
      ...options.stringify
    });

    await pipelineAsync(
      createReadStream(inputPath),
      parser,
      transformStream,
      stringifier,
      createWriteStream(outputPath)
    );
  }

  /**
   * Filter CSV rows
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @param {Function} predicate - Filter predicate
   */
  static async filterFile(inputPath, outputPath, predicate) {
    await this.processFile(inputPath, outputPath, async (row) => {
      return predicate(row) ? row : null;
    });
  }

  /**
   * Aggregate CSV data
   * @param {string} filePath - Input file path
   * @param {Function} reducer - Reducer function
   * @param {any} initialValue - Initial accumulator value
   * @returns {Promise<any>} Aggregated result
   */
  static async aggregate(filePath, reducer, initialValue) {
    let accumulator = initialValue;

    for await (const row of this.parseFile(filePath)) {
      accumulator = await reducer(accumulator, row);
    }

    return accumulator;
  }
}

/**
 * Example usage
 */
async function example() {
  console.log('=== CSV Processing Examples ===\n');

  // Create sample CSV file
  const sampleDir = join(__dirname, '..', 'data');
  await mkdir(sampleDir, { recursive: true });

  const inputFile = join(sampleDir, 'users.csv');
  const outputFile = join(sampleDir, 'users_processed.csv');

  const sampleData = `id,name,email,age,city
1,Alice,alice@example.com,25,New York
2,Bob,bob@example.com,30,Los Angeles
3,Charlie,charlie@example.com,35,Chicago
4,David,david@example.com,28,Houston
5,Eve,eve@example.com,32,Phoenix
6,Frank,frank@example.com,45,Philadelphia
7,Grace,grace@example.com,29,San Antonio
8,Henry,henry@example.com,38,San Diego`;

  await writeFile(inputFile, sampleData);
  console.log('Created sample CSV file\n');

  // Example 1: Parse and iterate
  console.log('1. Parse and iterate through CSV:');
  let count = 0;
  for await (const row of CSVProcessor.parseFile(inputFile)) {
    if (count < 3) {
      console.log(`  - ${row.name} (${row.age}) from ${row.city}`);
    }
    count++;
  }
  console.log(`  Total rows: ${count}\n`);

  // Example 2: Transform CSV (uppercase names)
  console.log('2. Transform CSV (uppercase names):');
  await CSVProcessor.processFile(
    inputFile,
    outputFile,
    async (row) => ({
      ...row,
      name: row.name.toUpperCase(),
      email: row.email.toLowerCase()
    })
  );
  console.log(`  Processed file saved to: ${outputFile}\n`);

  // Example 3: Filter CSV (age > 30)
  console.log('3. Filter CSV (age > 30):');
  const filteredFile = join(sampleDir, 'users_filtered.csv');
  await CSVProcessor.filterFile(
    inputFile,
    filteredFile,
    (row) => parseInt(row.age) > 30
  );

  console.log('  Filtered users:');
  for await (const row of CSVProcessor.parseFile(filteredFile)) {
    console.log(`  - ${row.name} (${row.age})`);
  }
  console.log();

  // Example 4: Aggregate (average age by city)
  console.log('4. Aggregate (count by city):');
  const cityCounts = await CSVProcessor.aggregate(
    inputFile,
    (acc, row) => {
      acc[row.city] = (acc[row.city] || 0) + 1;
      return acc;
    },
    {}
  );

  Object.entries(cityCounts).forEach(([city, count]) => {
    console.log(`  ${city}: ${count} user(s)`);
  });
  console.log();

  // Example 5: Complex transformation pipeline
  console.log('5. Complex pipeline (filter + transform + aggregate):');
  const pipeline = async function* (filePath) {
    for await (const row of CSVProcessor.parseFile(filePath)) {
      // Filter: age > 28
      if (parseInt(row.age) > 28) {
        // Transform: add age group
        yield {
          ...row,
          ageGroup: parseInt(row.age) < 35 ? '29-34' : '35+'
        };
      }
    }
  };

  const ageGroups = {};
  for await (const row of pipeline(inputFile)) {
    ageGroups[row.ageGroup] = (ageGroups[row.ageGroup] || 0) + 1;
  }

  console.log('  Age group distribution:');
  Object.entries(ageGroups).forEach(([group, count]) => {
    console.log(`  ${group}: ${count} user(s)`);
  });
  console.log();

  console.log('Examples completed successfully!');
}

// Run example if executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  example().catch(console.error);
}
