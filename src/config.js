import dotenv from "dotenv";
import path from "path";
import fetch from "node-fetch";
import semver from "semver";
import chalk from "chalk";
import boxen from "boxen";
import { LIBRARY_NAME } from "./constants.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

export function getConfig() {
  return {
    version: packageJson.version,
    apiKey: process.env.OPENROUTER_API_KEY || "",
    model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3-0324:free"
  }
}

export function loadEnvironment(envPath) {
    const result = dotenv.config({ path: envPath, override: true });
    if (result.error) {
        console.error(chalk.red("⚠️ Failed to load .env file:"), result.error);
        return;
    }
}

export async function checkForUpdates() {
    try {
        const response = await fetch(`https://registry.npmjs.org/${LIBRARY_NAME}/latest`);
        const data = await response.json();
        const latestVersion = data.version;

        if (latestVersion && semver.gt(latestVersion, CONFIG.version)) {
            console.log(boxen(
                chalk.yellow.bold("⚠️  Update available!") + "\n" +
                chalk.cyan(`Latest version: v${latestVersion}`) + "\n" +
                chalk.cyan(`Your version: v${CONFIG.version}`) + "\n\n" +
                chalk.white.bold(`Run: npm update -g ${LIBRARY_NAME}`),
                { padding: 1, borderStyle: "round", borderColor: "yellow" }
            ));
        }
    } catch (error) {
        console.warn(chalk.red("⚠️ Failed to check for updates."));
    }
}
