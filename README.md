# openrouter-commit 🚀 AI-Powered Git Commit Messages

**Generate smart, AI-driven Git commit messages** using OpenRouter models. Automate your commit workflow and write meaningful commits effortlessly.

Forked from <https://github.com/markolofsen/openrouter-commit/>

---

## ⚡ Quick Start

### Install Globally from Github Repository

Use the `link` command for global installation and easy customization.

#### With Bun

```sh
# 1. Clone the repository
git clone git@github.com:tksh/openrouter-commit.git
cd openrouter-commit

# 2. Install the dependencies
bun add git@github.com:tksh/openrouter-commit.git

# 3. Link as global
bun link
```

#### With NodeJS

```sh
# 1. Clone the repository
git clone git@github.com:tksh/openrouter-commit.git
cd openrouter-commit

# 2. Install the dependencies
npm install

# 3. Link as global
npm link

# 4. Replace the shebang
#    For Linux/Mac
sed -i '1s|bun|node|' src/index.js
#    For Windows
(Get-Content src/index.js) -replace '(?<=^#!/usr/bin/env )bun', 'node' | Set-Content src/index.js
```

#### Uninstall

##### From Bun

```sh
cd openrouter-commit
bun unlink
bun remove openrouter-commit
```

##### From NPM

```bash
cd openrouter-commit
npm unlink
npm uninstall openrouter-commit
```

##### Remove Repository Directory

```bash
cd ..
rm -rf openrouter-commit  # Bash
```

```powershell
cd ..
Remove-Item -Path openrouter-commit -Recurse -Force  # Powershell
```

##### Clear Shell Command Cache (Optional but Recommended)

After uninstalling, your shell might still remember the old command path. Run the following to refresh:

```bash
# Forget all remembered locations for Bash
hash -r
```

```powershell
# In Powershell on Windows, `exit` and restart the shell to clear the cache
exit
```

---

## ⚙️ Setup

### Prerequisites

- ✅ `Git` installed
- ✅ `Bun` or `Node.js` installed
- ✅ `OpenRouter` account with API key

### API Key & Model

```txt .env.openrouter
OPENROUTER_API_KEY=your-api-key
OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free
```

- Create account: [OpenRouter website](https://openrouter.ai)
  - Get API key: <https://openrouter.ai/settings/keys>
  - Browse models: <https://openrouter.ai/models?max_price=0>

#### Option 1: Default `.env.openrouter` file

Place your `.env.openrouter` file in the current directory and run:

```sh
openrouter-commit -run
```

#### Option 2: Custom environment file path

Use `--env-path` to specify a custom location:

```sh
openrouter-commit -run --env-path /custom/path/.env

# Example: Use file in home directory
openrouter-commit -run --env-path ~/.env.openrouter
```

#### Option 3: System environment variables

Add variables to your shell profile (`.bashrc`/`.zshrc`):

```sh
export OPENROUTER_API_KEY=your-api-key
export OPENROUTER_MODEL=mistralai/devstral-small:free
```

#### Configuration Priority

The tool checks sources in this order:

1. Custom `--env-path` value
2. Default `.env.openrouter` in current directory
3. Shell environment variables

---

## 🚀 How It Works

1️⃣ **Checks Git status**
2️⃣ **Prompts to stage changes**
3️⃣ **Generates an AI-powered commit message**
4️⃣ **Lets you confirm or edit it**
5️⃣ **Commits and pushes automatically**

---

## 📂 Ignored Files

By default, `openrouter-commit` **ignores common files** that shouldn't be in commits:

- `.env.openrouter`
- `bun.lock`, `node_modules/`, `.npm/`, `package-lock.json`
- `dist/`, `venv/`, `env/`, `__pycache__/`, `*.pyc`, `*.pyo`, `Pipfile.lock`, `poetry.lock`
- `logs/`, `*.log`, `debug.log*`, `*.swp`, `*.swo`
- `.cache/`, `.idea/`, `.editorconfig`
- `.DS_Store`, `Thumbs.db`

If needed, modify the `IGNORED_FILES` list in `openrouter-commit`'s source code.

---

## 🔥 Features

✅ **AI-powered commit messages**
✅ **Interactive CLI with confirmation prompts**
✅ **Custom `.env` paths with `--env-path`**
✅ **Handles large diffs intelligently**
✅ **Failsafe exit handling (Ctrl+C won’t commit unfinished work)**
✅ **Prevents accidental execution with `-run` flag**
✅ **Ignores unnecessary files from commits**

---

## ❓ Troubleshooting

### Not enough OpenRouter credits?

🔗 [Top up here](https://openrouter.ai/credits)

### Git push fails?

Ensure your branch is tracking a remote branch:

```sh
git branch --set-upstream-to=origin/main
```

---

## 💡 About

Built by [Unrealos.com](https://unrealos.com) – AI, SaaS, and PaaS solutions.

---

## 📜 License

MIT © **Unrealos.com** 🚀

---

## The Changes by [tksh](https://github.com/tksh/)

- Installation instruction changed to be using `link` command
- Bun first (replace default shebang at index.js from `node` to `bun`)
- Default AI model value removed (must be provided explicitly)
