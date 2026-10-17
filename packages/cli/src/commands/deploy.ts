import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import axios from "axios";

export const deployCommand = new Command("deploy")
  .description("Deploy the current API project to a cloud platform (Vercel, Render, Fly.io)")
  .option("-p, --platform <platform>", "Deployment target (vercel, render, flyio)", "vercel")
  .option("--prod", "Deploy directly to production", true)
  .action(async (options) => {
    console.log(chalk.cyan(`🚀 Target Platform: ${options.platform.toUpperCase()}`));

    const spinner = ora("Compiling container and dispatching cloud rollout...").start();

    try {
      const response = await axios.post("http://localhost:8000/api/v1/deploy/", {
        projectId: "cli-deploy",
        projectName: "CLI Microservice",
        platform: options.platform,
      });

      const { url, status, logs } = response.data;
      spinner.succeed(chalk.green(`Deployment ${status}!`));

      console.log("\n" + chalk.bold.cyan("🌐 Public Endpoint:"));
      console.log(chalk.underline.green(url));

      console.log("\n" + chalk.gray("Build Log Summary:"));
      for (const log of logs.slice(-3)) {
        console.log(chalk.gray(`  ${log}`));
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      spinner.fail(chalk.red(`Deployment failed: ${errorMsg}`));
    }
  });
