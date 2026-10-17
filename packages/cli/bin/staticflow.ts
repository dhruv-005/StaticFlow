#!/usr/bin/env node

/**
 * StaticFlow CLI Entrypoint
 */

import { Command } from "commander";
import chalk from "chalk";
import { loginCommand } from "../src/commands/login";
import { generateCommand } from "../src/commands/generate";
import { scanCommand } from "../src/commands/scan";
import { deployCommand } from "../src/commands/deploy";

const program = new Command();

console.log(
  chalk.cyan(`
  ⚡ StaticFlow CLI v1.0.0
  ---------------------------------
  The AI-Powered API Builder, Tester & Deployer
`)
);

program
  .name("staticflow")
  .description("Build, secure, test, document, and deploy APIs directly from your terminal.")
  .version("1.0.0");

// Attach Subcommands
program.addCommand(loginCommand);
program.addCommand(generateCommand);
program.addCommand(scanCommand);
program.addCommand(deployCommand);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
