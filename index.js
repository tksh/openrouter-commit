#!/usr/bin/env node

import { execSync } from "child_process";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import prompts from "prompts";
import { fileURLToPath } from "url";
import chalk from "chalk";
import boxen from "boxen";
import figlet from "figlet";
import semver from "semver";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

const __filename = fileURLToPath(import.meta.url);
const args = process.argv.slice(2);

// 🚀 Ensure '-run' flag is present
if (!args.includes("-run")) {
    console.log(chalk.red.bold("\nUsage: npx openrouter-commit -run [--env-path <path>]"));
    console.log(chalk.yellow("Missing '-run' argument. Exiting...\n"));
    process.exit(1);
}

// 🌱 Get `.env` path
const envPathIndex = args.indexOf("--env-path");
const envFilePath = envPathIndex !== -1 && args[envPathIndex + 1]
    ? path.resolve(args[envPathIndex + 1])
    : path.resolve(process.cwd(), ".env.openrouter");

// 🎨 Print Header
function displayHeader() {
    console.log(chalk.cyan(figlet.textSync("OpenRouter Commit", { horizontalLayout: "fitted" })));
    console.log(chalk.blueBright(`🚀 openrouter-commit v${packageJson.version}\n`));
}
displayHeader();

// 📢 Check for Updates
async function checkForUpdates() {
    try {
        const response = await fetch("https://registry.npmjs.org/openrouter-commit/latest");
        const data = await response.json();
        const latestVersion = data.version;

        if (latestVersion && semver.gt(latestVersion, packageJson.version)) {
            console.log(boxen(
                chalk.yellow.bold("⚠️  Update available!") + "\n" +
                chalk.cyan("Latest version: ") + chalk.greenBright(`v${latestVersion}`) + "\n" +
                chalk.cyan("Your version: ") + chalk.redBright(`v${packageJson.version}`) + "\n\n" +
                chalk.white.bold("Run: npm update -g openrouter-commit"),
                { padding: 1, borderStyle: "round", borderColor: "yellow" }
            ));
        }
    } catch (error) {
        console.warn(chalk.red("⚠️ Failed to check for updates."));
    }
}
await checkForUpdates();

// 🛠 Load Environment Variables
console.log(chalk.cyan(`🔍 Loading environment variables from: ${envFilePath}\n`));
dotenv.config({ path: envFilePath });

class GitGPT {
    constructor() {
        this.config = this.loadConfig();
        this.setupExitHandler();
    }

    loadConfig() {
        let config = {
            apiKey: process.env.OPENROUTER_API_KEY || "",
            model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-r1",
        };
        if (!config.apiKey) {
            console.error(chalk.red.bold(`❌ Missing OpenRouter API key. Ensure it's set in ${envFilePath} or as an environment variable.`));
            process.exit(1);
        }
        return config;
    }

    setupExitHandler() {
        process.on("SIGINT", () => {
            console.log(chalk.red.bold("\n🚨 Process interrupted. No changes were made."));
            process.exit(0);
        });
        process.on("SIGTERM", () => {
            console.log(chalk.red.bold("\n🚨 Process terminated. No changes were made."));
            process.exit(0);
        });
    }

    fetchGitStatus() {
        console.log(chalk.blue("🔍 Checking Git status..."));
        try {
            const gitStatus = execSync("git status --short", { encoding: "utf-8" }).trim();
            if (!gitStatus) {
                console.log(chalk.green("✅ No changes detected.\n"));
                return [];
            }

            const files = gitStatus.split("\n").map(line => line.trim().split(" ").pop());
            console.log(boxen(
                chalk.cyan.bold("📂 Changed Files:") + "\n" +
                files.map(file => `  - ${chalk.green(file)}`).join("\n"),
                { padding: 1, borderStyle: "round", borderColor: "cyan" }
            ));
            return files;
        } catch (error) {
            console.error(chalk.red("❌ Failed to retrieve changed files."), error);
            return [];
        }
    }

    async promptForStaging() {
        const addFiles = await prompts({
            type: "confirm",
            name: "value",
            message: "Would you like to add all changes to the commit?",
            initial: true,
        });
        if (!addFiles.value) {
            console.log(chalk.red("❌ Commit aborted."));
            process.exit(0);
        }
    }

    async commitChanges() {
        const changedFiles = this.fetchGitStatus();
        if (!changedFiles.length) process.exit(0);

        await this.promptForStaging();
        const diff = this.fetchDiffWithLimit(changedFiles);

        let msg = await this.generateCommitMessage(diff, changedFiles);
        if (!msg) {
            console.error(chalk.red("❌ AI generation failed. Please enter a commit manually."));
        }

        console.log(
            chalk.blue("\n💡 Suggested Commit Message:"),
            boxen(chalk.green.bold(msg || "No AI-generated message."), { padding: 1, borderStyle: "round", borderColor: "cyan" })
        );

        // ✅ ADDING PROMPT TO CHOOSE AI COMMIT, CUSTOM, OR EXIT
        const { action } = await prompts({
            type: "select",
            name: "action",
            message: "What would you like to do?",
            choices: [
                { title: "✅ Use AI-generated commit", value: "use" },
                { title: "✏️ Enter my own commit message", value: "custom" },
                { title: "🚪 Exit without committing", value: "exit" },
            ],
        });

        if (action === "exit") {
            console.log(chalk.red("❌ Commit aborted."));
            process.exit(0);
        }

        if (action === "custom") {
            const { customMessage } = await prompts({
                type: "text",
                name: "customMessage",
                message: "Enter your custom commit message:",
            });
            if (!customMessage) {
                console.log(chalk.red("❌ Commit aborted."));
                process.exit(0);
            }
            msg = customMessage;
        }

        this.pushToGit(msg);
    }

    pushToGit(finalMessage) {
        console.log(chalk.green("\n✅ Committing changes..."));
        execSync(`git add . && git commit -m "${finalMessage.replace(/"/g, "'")}" && git push`, { stdio: "inherit" });
        console.log(chalk.green("🎉 Commit created successfully!"));
    }
}

(async () => {
    const gitgpt = new GitGPT();
    await gitgpt.commitChanges();
})();
