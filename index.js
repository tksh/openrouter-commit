#!/usr/bin/env node

import { execSync } from "child_process";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import prompts from "prompts";
import { fileURLToPath } from "url";
import chalk from "chalk";
import boxen from "boxen";
import { createRequire } from "module";

// Import package.json dynamically
const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

const __filename = fileURLToPath(import.meta.url);

// Parse command-line arguments
const args = process.argv.slice(2);
if (!args.includes("-run")) {
    console.log(chalk.red.bold("\nUsage: npx openrouter-commit -run [--env-path <path>]"));
    console.log(chalk.yellow("Missing '-run' argument. Exiting...\n"));
    process.exit(1);
}

// Parse `.env` file path
let envPathIndex = args.indexOf("--env-path");
let envFilePath = envPathIndex !== -1 && args[envPathIndex + 1] ? path.resolve(args[envPathIndex + 1]) : path.resolve(process.cwd(), ".env.openrouter");

// Load environment variables
console.log(chalk.cyan(`🔍 Loading environment variables from: ${envFilePath}`));
const envLoadResult = dotenv.config({ path: envFilePath });

if (envLoadResult.error) {
    console.warn(chalk.yellow(`⚠️  Warning: Could not load .env file at ${envFilePath}. Make sure the path is correct.`));
}

// Display package version and check for updates
const currentVersion = packageJson.version;
console.log(chalk.blueBright(`🚀 openrouter-commit v${currentVersion}`));

async function checkForUpdates() {
    try {
        const response = await fetch("https://registry.npmjs.org/openrouter-commit/latest");
        const data = await response.json();
        const latestVersion = data.version;

        if (latestVersion !== currentVersion) {
            console.log(
                chalk.yellow.bold("\n⚠️  Update available: ") +
                chalk.greenBright(`v${latestVersion}`) +
                chalk.yellow(" (You are using v" + currentVersion + ")")
            );
            console.log(chalk.cyan("Run ") + chalk.white.bold("npm update -g openrouter-commit") + chalk.cyan(" to update!\n"));
        }
    } catch (error) {
        console.warn(chalk.red("⚠️ Failed to check for updates."));
    }
}
checkForUpdates();

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

    checkGitStatus() {
        console.log(chalk.blue("🔍 Checking Git status..."));
        const gitStatus = execSync("git status --short", { encoding: "utf-8" }).trim();
        console.log(gitStatus ? chalk.yellow(gitStatus) : chalk.green("✅ No changes detected."));
        return gitStatus;
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

    async generateCommitMessage(diff, changedFiles) {
        console.log(chalk.cyan("🤖 Generating commit message with AI..."));
        try {
            const systemMessage = `
                Generate a concise Git commit message.
                Don't include "Commit message" in the response.
                Be clear, add a short title and description.
                The following files have changed: ${changedFiles.join(", ")}
            `.replace(/\s+/g, " ").trim();

            const userMessage = diff.length > 10000 ? diff.substring(0, 10000) + "... [truncated]" : diff;
            console.debug(chalk.blue("🔍 AI request: "), systemMessage, userMessage);

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.config.model,
                    messages: [
                        { role: "system", content: systemMessage },
                        { role: "user", content: userMessage },
                    ],
                    temperature: 0.7,
                }),
            });
            const data = await response.json();

            if (data.error?.code === 402) {
                console.error(chalk.red("❌ Not enough OpenRouter credits. Visit https://openrouter.ai/credits to top up."));
                return null;
            }

            return data.choices?.[0]?.message?.content?.trim();
        } catch (error) {
            console.error(chalk.red("❌ Failed to connect to OpenRouter API"), error);
            return null;
        }
    }

    async commitChanges() {
        if (!this.checkGitStatus()) process.exit(0);
        await this.promptForStaging();

        const changedFiles = execSync("git diff --name-only", { encoding: "utf-8" })
            .trim()
            .split("\n")
            .filter(file => file.length > 0);

        let commitMessage = execSync("git diff", { encoding: "utf-8" }).trim();
        if (commitMessage.length > 10000) {
            console.log(chalk.yellow("⚠️  Diff is too large, truncating to 10,000 characters."));
            commitMessage = commitMessage.substring(0, 10000) + "... [truncated]";
        }

        let msg = await this.generateCommitMessage(commitMessage, changedFiles);

        if (!msg) {
            console.error(chalk.red("❌ AI generation failed. Please enter your commit manually."));
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

        console.log(
            chalk.blue("\n💡 Suggested Commit Message:"),
            boxen(chalk.green.bold(msg), { padding: 1, borderStyle: "round", borderColor: "cyan" })
        );

        const { action } = await prompts({
            type: "select",
            name: "action",
            message: "What would you like to do?",
            choices: [
                { title: "Use this commit message", value: "use" },
                { title: "Enter my own message", value: "custom" },
                { title: "Exit", value: "exit" },
            ],
        });

        if (action === "exit") {
            console.log(chalk.red("❌ Commit aborted."));
            process.exit(0);
        }

        const finalMessage = action === "custom"
            ? (await prompts({ type: "text", name: "customMessage", message: "Enter your custom commit message:" })).customMessage
            : msg;

        console.log(chalk.green("\n✅ Committing changes..."));
        execSync(`git add . && git commit -m "${finalMessage.replace(/"/g, "'")}" && git push`, { stdio: "inherit" });

        console.log(chalk.green("🎉 Commit created successfully!"));
    }
}

(async () => {
    const gitgpt = new GitGPT();
    await gitgpt.commitChanges();
})();
