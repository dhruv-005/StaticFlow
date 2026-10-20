import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import axios from "axios";

export const scanCommand = new Command("scan")
  .description("Run an automated OWASP security audit against a target API URL")
  .argument("[url]", "Target API base URL", "http://localhost:3000")
  .option("--depth <depth>", "Scan depth: quick, deep, full", "quick")
  .option("--strict", "Fail with exit code 1 if any vulnerability is found", false)
  .action(async (url, options) => {
    console.log(chalk.cyan(`🛡️  Target: ${url}`));
    console.log(chalk.gray(`Depth: ${options.depth.toUpperCase()}`));

    const spinner = ora("Executing OWASP Top 10 automated test suites...").start();

    try {
      const response = await axios.post("http://localhost:8000/api/v1/security/scan", {
        projectId: "cli-target",
        scanType: options.depth,
        targetUrl: url,
      });

      const { score, grade, vulnerabilities, testsRun, durationMs } = response.data;

      if (score >= 90) {
        spinner.succeed(chalk.green(`Security Scan Complete — Score: ${score}/100 (${grade})`));
      } else {
        spinner.warn(chalk.yellow(`Security Scan Complete with Warnings — Score: ${score}/100 (${grade})`));
      }

      console.log(chalk.gray(`  • Tests Executed: ${testsRun}`));
      console.log(chalk.gray(`  • Scan Duration:  ${durationMs}ms\n`));

      if (vulnerabilities.length === 0) {
        console.log(chalk.green("  ✔ 0 Vulnerabilities Detected!"));
      } else {
        console.log(chalk.bold.red(`  ⚠️  Found ${vulnerabilities.length} issue(s):`));
        for (const v of vulnerabilities) {
          console.log(chalk.red(`    - [${v.severity.toUpperCase()}] ${v.title}`));
          console.log(chalk.gray(`      Fix: ${v.fix}`));
        }

        if (options.strict) {
          process.exit(1);
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      spinner.fail(chalk.red(`Scan failed: ${errorMsg}`));
    }
  });
