/**
 * Config command - demonstrates config file management
 */

import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import chalk from 'chalk';
import { Command } from 'commander';
import { z } from 'zod';

/**
 * User configuration schema
 */
const UserConfigSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().default('en'),
});

type UserConfig = z.infer<typeof UserConfigSchema>;

/**
 * Get config file path
 */
function getConfigPath(): string {
  return path.join(os.homedir(), '.ts-cli-config.json');
}

/**
 * Load configuration
 */
async function loadConfig(): Promise<UserConfig | null> {
  try {
    const configPath = getConfigPath();
    const content = await fs.readFile(configPath, 'utf-8');
    const data: unknown = JSON.parse(content);
    const parsed = UserConfigSchema.safeParse(data);

    if (!parsed.success) {
      console.error(chalk.yellow('Warning: Invalid config file, using defaults'));
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

/**
 * Save configuration
 */
async function saveConfig(config: UserConfig): Promise<void> {
  const configPath = getConfigPath();
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Show config action
 */
async function showConfigAction(): Promise<void> {
  const config = await loadConfig();

  if (!config) {
    console.log(chalk.yellow('No configuration found'));
    return;
  }

  console.log(chalk.bold('\nCurrent Configuration:'));
  console.log(chalk.gray('─'.repeat(40)));

  for (const [key, value] of Object.entries(config)) {
    console.log(`${chalk.cyan(key.padEnd(15))}: ${chalk.white(String(value))}`);
  }

  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.dim(`\nConfig file: ${getConfigPath()}`));
}

/**
 * Set config action
 */
async function setConfigAction(key: string, value: string): Promise<void> {
  const config = (await loadConfig()) ?? {
    username: '',
    email: '',
    theme: 'auto' as const,
    notifications: true,
    language: 'en',
  };

  // Parse boolean values and update config
  let finalValue: string | boolean = value;
  if (value === 'true' || value === 'false') {
    finalValue = value === 'true';
  }

  const newConfig = { ...config, [key]: finalValue };
  const parsed = UserConfigSchema.safeParse(newConfig);

  if (!parsed.success) {
    console.error(chalk.red('Invalid configuration:'));
    for (const error of parsed.error.errors) {
      console.error(chalk.red(`  - ${error.path.join('.')}: ${error.message}`));
    }
    process.exit(1);
  }

  await saveConfig(parsed.data);
  console.log(chalk.green(`✓ Set ${key} = ${value}`));
}

/**
 * Reset config action
 */
async function resetConfigAction(): Promise<void> {
  try {
    await fs.unlink(getConfigPath());
    console.log(chalk.green('✓ Configuration reset'));
  } catch {
    console.log(chalk.yellow('No configuration to reset'));
  }
}

/**
 * Config command with subcommands
 */
export const configCommand = new Command('config').description('Manage configuration');

configCommand.command('show').description('Show current configuration').action(showConfigAction);

configCommand
  .command('set')
  .description('Set a configuration value')
  .argument('<key>', 'Configuration key')
  .argument('<value>', 'Configuration value')
  .action(setConfigAction);

configCommand
  .command('reset')
  .description('Reset configuration to defaults')
  .action(resetConfigAction);
