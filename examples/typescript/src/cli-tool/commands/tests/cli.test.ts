/**
 * CLI tool tests
 */

import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createProgram } from '../../cli.ts';

describe('CLI Tool', () => {
  const configPath = path.join(os.homedir(), '.ts-cli-config.json');

  afterEach(async () => {
    try {
      await fs.unlink(configPath);
    } catch {
      // Ignore if file doesn't exist
    }
  });

  describe('Program', () => {
    it('should create program with correct name', () => {
      const program = createProgram();
      expect(program.name()).toBe('ts-cli');
    });

    it('should have version defined', () => {
      const program = createProgram();
      expect(program.version()).toBe('1.0.0');
    });

    it('should have greet command', () => {
      const program = createProgram();
      const commands = program.commands.map((cmd) => cmd.name());
      expect(commands).toContain('greet');
    });

    it('should have config command', () => {
      const program = createProgram();
      const commands = program.commands.map((cmd) => cmd.name());
      expect(commands).toContain('config');
    });

    it('should have process command', () => {
      const program = createProgram();
      const commands = program.commands.map((cmd) => cmd.name());
      expect(commands).toContain('process');
    });
  });

  describe('Options', () => {
    it('should have verbose option', () => {
      const program = createProgram();
      const options = program.options.map((opt) => opt.long);
      expect(options).toContain('--verbose');
    });

    it('should have color option', () => {
      const program = createProgram();
      const options = program.options.map((opt) => opt.long);
      expect(options).toContain('--no-color');
    });

    it('should have output option', () => {
      const program = createProgram();
      const options = program.options.map((opt) => opt.long);
      expect(options).toContain('--output');
    });
  });

  describe('Command structure', () => {
    it('should have greet command with required name option', () => {
      const program = createProgram();
      const greetCmd = program.commands.find((cmd) => cmd.name() === 'greet');
      expect(greetCmd).toBeDefined();

      if (greetCmd) {
        const options = greetCmd.options.map((opt) => opt.long);
        expect(options).toContain('--name');
      }
    });

    it('should have config command with subcommands', () => {
      const program = createProgram();
      const configCmd = program.commands.find((cmd) => cmd.name() === 'config');
      expect(configCmd).toBeDefined();

      if (configCmd) {
        const subcommands = configCmd.commands.map((cmd) => cmd.name());
        expect(subcommands).toContain('show');
        expect(subcommands).toContain('set');
        expect(subcommands).toContain('reset');
      }
    });

    it('should have process command with file option', () => {
      const program = createProgram();
      const processCmd = program.commands.find((cmd) => cmd.name() === 'process');
      expect(processCmd).toBeDefined();

      if (processCmd) {
        const options = processCmd.options.map((opt) => opt.long);
        expect(options).toContain('--file');
        expect(options).toContain('--workers');
        expect(options).toContain('--batch');
        expect(options).toContain('--dry-run');
      }
    });
  });
});
