#!/usr/bin/env bun
/**
 * Modern CLI tool using Bun, Commander.js, Chalk, and Ora
 * Demonstrates CLI best practices with TypeScript
 */

import chalk from 'chalk';
import { Command } from 'commander';
import { z } from 'zod';
import { configCommand } from './commands/config.ts';
import { greetCommand } from './commands/greet.ts';
import { processCommand } from './commands/process.ts';

/**
 * CLI configuration schema
 */
export const CliConfigSchema = z.object({
  verbose: z.boolean().default(false),
  color: z.boolean().default(true),
  output: z.enum(['json', 'text', 'table']).default('text'),
});

export type CliConfig = z.infer<typeof CliConfigSchema>;

/**
 * Global CLI context
 */
export interface CliContext {
  config: CliConfig;
  startTime: number;
}

/**
 * Create CLI program
 */
export function createProgram(): Command {
  const program = new Command();

  program
    .name('ts-cli')
    .description('Modern TypeScript CLI tool example')
    .version('1.0.0')
    .option('-v, --verbose', 'Enable verbose output', false)
    .option('--no-color', 'Disable colored output')
    .option('-o, --output <format>', 'Output format (json, text, table)', 'text');

  // Add commands
  program.addCommand(greetCommand);
  program.addCommand(configCommand);
  program.addCommand(processCommand);

  return program;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  try {
    const program = createProgram();
    await program.parseAsync(process.argv);
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    } else {
      console.error(chalk.red('An unknown error occurred'));
    }
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
