/**
 * Process command - demonstrates async processing with spinners
 */

import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';
import { z } from 'zod';

/**
 * Process options schema
 */
const ProcessOptionsSchema = z.object({
  file: z.string().min(1),
  workers: z.number().int().min(1).max(16).default(4),
  batch: z.number().int().min(1).max(1000).default(10),
  dryRun: z.boolean().default(false),
});

/**
 * Simulated task processing
 */
async function processTask(
  id: number,
  delay: number,
): Promise<{ id: number; success: boolean; duration: number }> {
  const start = Date.now();
  await new Promise((resolve) => setTimeout(resolve, delay));
  const duration = Date.now() - start;

  return {
    id,
    success: Math.random() > 0.1,
    duration,
  };
}

/**
 * Process batch of tasks
 */
async function processBatch(
  tasks: number[],
  _workers: number,
): Promise<{ success: number; failed: number; total: number }> {
  const results = await Promise.all(tasks.map((id) => processTask(id, Math.random() * 1000 + 500)));

  const success = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return { success, failed, total: results.length };
}

/**
 * Process command action
 */
async function processAction(options: unknown): Promise<void> {
  const parsed = ProcessOptionsSchema.safeParse(options);

  if (!parsed.success) {
    console.error(chalk.red('Invalid options:'));
    for (const error of parsed.error.errors) {
      console.error(chalk.red(`  - ${error.path.join('.')}: ${error.message}`));
    }
    process.exit(1);
  }

  const { file, workers, batch, dryRun } = parsed.data;

  console.log(chalk.bold('\nProcessing Configuration:'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(`${chalk.cyan('File'.padEnd(15))}: ${chalk.white(file)}`);
  console.log(`${chalk.cyan('Workers'.padEnd(15))}: ${chalk.white(workers)}`);
  console.log(`${chalk.cyan('Batch Size'.padEnd(15))}: ${chalk.white(batch)}`);
  console.log(
    `${chalk.cyan('Mode'.padEnd(15))}: ${chalk.white(dryRun ? 'Dry Run' : 'Production')}`,
  );
  console.log(chalk.gray('─'.repeat(40)));
  console.log();

  if (dryRun) {
    console.log(chalk.yellow('🔍 Running in dry-run mode\n'));
    return;
  }

  const totalTasks = 50;
  const batches = Math.ceil(totalTasks / batch);

  const mainSpinner = ora({
    text: 'Initializing processing...',
    color: 'cyan',
  }).start();

  let totalSuccess = 0;
  let totalFailed = 0;

  for (let i = 0; i < batches; i++) {
    const batchStart = i * batch;
    const batchEnd = Math.min((i + 1) * batch, totalTasks);
    const batchTasks = Array.from({ length: batchEnd - batchStart }, (_, idx) => batchStart + idx);

    mainSpinner.text = `Processing batch ${i + 1}/${batches} (${batchTasks.length} tasks)...`;

    const results = await processBatch(batchTasks, workers);

    totalSuccess += results.success;
    totalFailed += results.failed;

    mainSpinner.text = `Batch ${i + 1}/${batches} complete: ${results.success} succeeded, ${results.failed} failed`;
  }

  mainSpinner.succeed(chalk.green('Processing complete!\n'));

  console.log(chalk.bold('Results:'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(`${chalk.green('✓ Successful')}: ${totalSuccess}`);
  console.log(`${chalk.red('✗ Failed')}: ${totalFailed}`);
  console.log(`${chalk.cyan('Total')}: ${totalTasks}`);
  console.log(
    `${chalk.yellow('Success Rate')}: ${((totalSuccess / totalTasks) * 100).toFixed(1)}%`,
  );
  console.log(chalk.gray('─'.repeat(40)));
}

/**
 * Process command definition
 */
export const processCommand = new Command('process')
  .description('Process tasks with worker pool')
  .requiredOption('-f, --file <path>', 'Input file path')
  .option('-w, --workers <count>', 'Number of worker threads', '4')
  .option('-b, --batch <size>', 'Batch size', '10')
  .option('-d, --dry-run', 'Run without making changes', false)
  .action(processAction);
