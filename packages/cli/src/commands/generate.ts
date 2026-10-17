import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

export const generateCommand = new Command("generate")
  .alias("gen")
  .description("Generate complete API code from a natural language prompt")
  .argument("<prompt>", "Natural language description of the API")
  .option("-l, --language <lang>", "Runtime stack (node-express, python-fastapi, go-gin)", "node-express")
  .option("-d, --database <db>", "Database (postgresql, mongodb, mysql, sqlite)", "postgresql")
  .option("-o, --output <dir>", "Output directory", "./generated-api")
  .action(async (prompt, options) => {
    console.log(chalk.cyan(`🤖 Prompt: "${prompt}"`));
    console.log(chalk.gray(`Stack: ${options.language} + ${options.database}`));

    const spinner = ora("Synthesizing API architecture with AI Engine...").start();

    try {
      const response = await axios.post("http://localhost:8000/api/v1/generate/", {
        prompt,
        language: options.language,
        database: options.database,
        includeAuth: true,
        includeDocker: true,
      });

      const { codeBlocks, summary } = response.data;
      spinner.succeed(chalk.green(`API generated successfully!`));

      const outDir = path.resolve(process.cwd(), options.output);
      fs.mkdirSync(outDir, { recursive: true });

      for (const block of codeBlocks) {
        const filePath = path.join(outDir, block.fileName);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, block.code);
        console.log(chalk.green(`  ✔ Created ${block.fileName}`));
      }

      console.log("\n" + chalk.bold.cyan("🚀 Next steps:"));
      console.log(chalk.gray(`  cd ${options.output}`));
      console.log(chalk.gray("  npm install"));
      console.log(chalk.gray("  npm run dev"));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      spinner.fail(chalk.red(`Generation failed: ${errorMsg}`));
      console.log(chalk.yellow("Ensure FastAPI backend is active at http://localhost:8000"));
    }
  });
