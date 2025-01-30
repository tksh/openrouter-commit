import { execSync } from "child_process";
import chalk from "chalk";
import boxen from "boxen";
import { IGNORED_FILES } from "./constants.js";

export function fetchGitStatus() {
    console.log(chalk.blue("🔍 Checking Git status..."));
    try {
        const gitStatus = execSync("git status --short", { encoding: "utf-8" }).trim();
        if (!gitStatus) {
            console.log(chalk.green("✅ No changes detected.\n"));
            return [];
        }

        const files = gitStatus
            .split("\n")
            .map(line => line.trim().split(" ").pop())
            .filter(file => !IGNORED_FILES.some(ignored => file.includes(ignored)));

        if (files.length === 0) {
            console.log(chalk.yellow("🛑 No relevant changes detected. Ignored standard files.\n"));
            process.exit(0);
        }

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

export function commitAndPush(commitMessage) {
    console.log(chalk.green("\n✅ Committing changes..."));
    execSync(`git add . && git commit -m "${commitMessage.replace(/"/g, "'")}" && git push`, { stdio: "inherit" });
    console.log(chalk.green("🎉 Commit created successfully!"));
}
