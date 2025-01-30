#!/usr/bin/env node

import path from "path";
import { fileURLToPath } from "url";
import prompts from "prompts";
import chalk from "chalk";
import figlet from "figlet";
import boxen from "boxen";
import { fetchGitStatus, commitAndPush } from "./git.js";
import { checkForUpdates, loadEnvironment } from "./config.js";
import { generateCommitMessage } from "./ai.js";
import { LIBRARY_NAME } from "./constants.js";

const __filename = fileURLToPath(import.meta.url);
const args = process.argv.slice(2);

if (!args.includes("-run")) {
    console.log(chalk.red.bold(`\nUsage: npx ${LIBRARY_NAME} -run [--env-path <path>]`));
    process.exit(1);
}

console.log(chalk.cyan(figlet.textSync(LIBRARY_NAME, { horizontalLayout: "fitted" })));

await checkForUpdates();
const envPath = path.resolve(process.cwd(), ".env.openrouter");
loadEnvironment(envPath);

const changedFiles = fetchGitStatus();
if (!changedFiles.length) process.exit(0);

// 🔹 Use `let` so `action` can be reassigned if needed
let { action } = await prompts({
    type: "select",
    name: "action",
    message: "What would you like to do?",
    choices: [
        { title: "✅ Use AI commit", value: "use" },
        { title: "✏️ Enter manually", value: "custom" },
        { title: "🚪 Exit", value: "exit" }
    ],
});

if (action === "exit") {
    console.log(chalk.red("❌ Commit aborted."));
    process.exit(0);
}

let commitMessage = "";

if (action === "use") {
    console.log(chalk.cyan(`🤖 Generating commit message using model: ${process.env.OPENROUTER_MODEL || "deepseek/deepseek-r1"}...`));

    commitMessage = await generateCommitMessage("", changedFiles);

    if (!commitMessage || commitMessage.trim().length === 0) {
        console.log(chalk.red("❌ AI failed to generate a commit message. Switching to manual entry."));
        action = "custom";
    } else {
        console.log(
            chalk.blue("\n💡 Suggested Commit Message:"),
            boxen(chalk.green.bold(commitMessage), { padding: 1, borderStyle: "round", borderColor: "cyan" })
        );
    }
}

if (action === "custom") {
    const { customMessage } = await prompts({
        type: "text",
        name: "customMessage",
        message: "Enter your custom commit message:",
    });

    commitMessage = customMessage && customMessage.trim().length > 0 ? customMessage : "Manual commit message.";
}

// Push commit with final message
commitAndPush(commitMessage);
