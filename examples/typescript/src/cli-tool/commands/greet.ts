/**
 * Greet command - demonstrates basic CLI command with options
 */

import chalk from 'chalk';
import { Command } from 'commander';
import { z } from 'zod';

/**
 * Greet options schema
 */
const GreetOptionsSchema = z.object({
  name: z.string().min(1),
  shout: z.boolean().default(false),
  repeat: z.number().int().min(1).max(10).default(1),
  emoji: z.boolean().default(false),
});

/**
 * Greet action handler
 */
async function greetAction(options: unknown): Promise<void> {
  const parsed = GreetOptionsSchema.safeParse(options);

  if (!parsed.success) {
    console.error(chalk.red('Invalid options:'));
    for (const error of parsed.error.errors) {
      console.error(chalk.red(`  - ${error.path.join('.')}: ${error.message}`));
    }
    process.exit(1);
  }

  const { name, shout, repeat, emoji } = parsed.data;

  let greeting = `Hello, ${name}!`;

  if (shout) {
    greeting = greeting.toUpperCase();
  }

  if (emoji) {
    greeting = `👋 ${greeting}`;
  }

  for (let i = 0; i < repeat; i++) {
    console.log(chalk.green(greeting));
  }
}

/**
 * Greet command definition
 */
export const greetCommand = new Command('greet')
  .description('Greet a user')
  .requiredOption('-n, --name <name>', 'Name to greet')
  .option('-s, --shout', 'Shout the greeting', false)
  .option('-r, --repeat <count>', 'Repeat greeting N times', '1')
  .option('-e, --emoji', 'Add emoji to greeting', false)
  .action(greetAction);
