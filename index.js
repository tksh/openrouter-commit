#!/usr/bin/env node

import { execSync } from "child_process";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import prompts from "prompts";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
dotenv.config({ path: path.resolve(process.cwd(), ".env.openrouter") });

const args = process.argv.slice(2);
if (!args.includes("-run")) {
    // console.log("\nUsage: npx openrouter-commit -run");
    // console.log("Missing '-run' argument. Exiting...\n");
    process.exit(1);
}

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
            console.error("Missing OpenRouter API key. Set it in .env.openrouter or as an environment variable.");
            process.exit(1);
        }
        return config;
    }

    setupExitHandler() {
        process.on("SIGINT", () => {
            console.log("\nProcess interrupted. No changes were made.");
            process.exit(0);
        });
        process.on("SIGTERM", () => {
            console.log("\nProcess terminated. No changes were made.");
            process.exit(0);
        });
    }

    checkGitStatus() {
        console.log("Checking git status...");
        const gitStatus = execSync("git status --short", { encoding: "utf-8" }).trim();
        console.log(gitStatus || "No changes detected.");
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
            console.log("Commit aborted.");
            process.exit(0);
        }
    }

    async generateCommitMessage(diff) {
        console.log("Generating commit message with AI...");
        try {
            let systemMessage = `
                Generate a concise git commit message.
                Don't include the file names or line numbers.
                Don't include "Commit message" in the response.
                Be concise and clear.
                Add short title and description.
            `.replace(/\s+/g, " ").trim();

            const userMessage = diff.length > 10000 ? diff.substring(0, 10000) + "... [truncated]" : diff;

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
                console.error("Error: Not enough credits on OpenRouter. Visit https://openrouter.ai/credits to top up.");
                return null;
            }

            return data.choices?.[0]?.message?.content?.trim();
        } catch (error) {
            console.error("Failed to connect to OpenRouter API", error);
            return null;
        }
    }

    pushToGit(finalMessage) {
        console.log("Adding files to Git...");
        execSync("git add .", { stdio: "inherit" });

        console.log("Committing changes...");
        execSync(`git commit -m '${finalMessage.replace(/'/g, '"')}'`, { stdio: "inherit" });

        console.log("Pushing changes...");
        execSync("git push", { stdio: "inherit" });

        console.log("Commit created successfully!");
    }

    async commitChanges() {
        if (!this.checkGitStatus()) process.exit(0);
        await this.promptForStaging();

        let commitMessage = execSync("git diff", { encoding: "utf-8" }).trim();
        if (commitMessage.length > 10000) {
            console.log("Warning: Diff is too large, truncating to 10,000 characters.");
            commitMessage = commitMessage.substring(0, 10000) + "... [truncated]";
        }

        let msg = await this.generateCommitMessage(commitMessage);

        if (!msg) {
            console.error("AI generation failed. You can enter your commit manually.");
            const { customMessage } = await prompts({
                type: "text",
                name: "customMessage",
                message: "Enter your custom commit message:",
            });
            if (!customMessage) {
                console.log("Commit aborted.");
                process.exit(0);
            }
            msg = customMessage;
        }

        console.log("\nSuggested Commit Message:\n", msg);

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
            console.log("Commit aborted.");
            process.exit(0);
        }

        if (action === "custom") {
            const { customMessage } = await prompts({
                type: "text",
                name: "customMessage",
                message: "Enter your custom commit message:",
            });
            if (!customMessage) {
                console.log("Commit aborted.");
                process.exit(0);
            }
            this.pushToGit(customMessage);
        } else {
            this.pushToGit(msg);
        }
    }
}

(async () => {
    const gitgpt = new GitGPT();
    await gitgpt.commitChanges();
})();
