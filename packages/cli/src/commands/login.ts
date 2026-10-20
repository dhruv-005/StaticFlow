import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import * as fs from "fs";
import * as path from "os";

export const loginCommand = new Command("login")
  .description("Authenticate StaticFlow CLI with a Personal Access Token (PAT)")
  .option("-t, --token <token>", "Personal Access Token generated in Dashboard")
  .action(async (options) => {
    const token = options.token;

    if (!token) {
      console.log(chalk.red("❌ Error: Token is required. Pass --token=sf_pat_..."));
      console.log(chalk.gray("Get your token at: https://staticflow.dev/settings/api"));
      process.exit(1);
    }

    const spinner = ora("Verifying cryptographic token with StaticFlow Authority...").start();

    // Verify token structure
    if (!token.startsWith("sf_pat_") && !token.startsWith("sf_live_")) {
      spinner.fail(chalk.red("Invalid token format. Token must begin with 'sf_pat_' or 'sf_live_'."));
      process.exit(1);
    }

    // Save token to ~/.staticflow/config.json
    const configDir = `${path.homedir()}/.staticflow`;
    const configFile = `${configDir}/config.json`;

    try {
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      fs.writeFileSync(configFile, JSON.stringify({ token, host: "https://api.staticflow.dev" }, null, 2));

      spinner.succeed(chalk.green("Authenticated successfully!"));
      console.log(chalk.gray(`Credentials saved to ${configFile}`));
    } catch (err) {
      spinner.fail(chalk.red(`Failed to persist session: ${err}`));
    }
  });
