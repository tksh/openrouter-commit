# **openrouter-commit - AI-powered Git Commit Messages** 🚀  

**`openrouter-commit`** is a CLI tool that generates **clear, concise, and AI-powered** commit messages using OpenRouter's LLM models.  
It supports **DeepSeek R1** and **any OpenRouter model**, making it a more flexible and cost-efficient alternative to other commit tools.  

---

## **✨ Quick Start**  

### **Run without installation**
You can use `openrouter-commit` immediately with `npx`.  
To execute the command, you must provide the `-run` flag:  

```sh
npx openrouter-commit -run
```

### **Install globally**
If you use it frequently, install it globally:  
```sh
npm install -g openrouter-commit
openrouter-commit -run
```

### **Use in any project with `package.json`**
You can **add it to any project** without installing globally. Just place a `package.json` in your directory and run:  

```sh
yarn commit  # or npm run commit
```

#### **Example `package.json` setup:**
```json
{
    "name": "your-project",
    "scripts": {
        "commit": "npx openrouter-commit -run"
    }
}
```

Now, running `yarn commit` or `npm run commit` will generate an AI-powered commit message!

---

## **🔄 Updating**
To update to the latest version, use:

- **Global install:**  
  ```sh
  npm update -g openrouter-commit
  ```
- **npx users:**  
  ```sh
  npx clear-npx-cache
  ```
- **Local project:**  
  ```sh
  npm update openrouter-commit
  ```

---

## **🔧 Configuration**
Before using `openrouter-commit`, set up your **OpenRouter API key** and **model**.

### **Option 1: Using a `.env.openrouter` file**  
Create a `.env.openrouter` file in your project's root:  
```sh
OPENROUTER_API_KEY=your-api-key
OPENROUTER_MODEL=deepseek/deepseek-r1
```

### **Option 2: Setting environment variables manually**  
Alternatively, export your API key and model in the terminal:  
```sh
export OPENROUTER_API_KEY=your-api-key
export OPENROUTER_MODEL=deepseek/deepseek-r1
```

### **Option 3: Specify a custom `.env` path**  
By default, `openrouter-commit` looks for `.env.openrouter` in your project's root.  
You can **specify a different path** using the `--env-path` flag:  
```sh
npx openrouter-commit -run --env-path /custom/path/.env
```

---

## **🚀 How It Works**
When you run `openrouter-commit -run`, the script will:  
1️⃣ **Check your Git status** and show modified files.  
2️⃣ **Prompt you to stage all changes** (if they are not staged).  
3️⃣ **Generate a commit message** based on the Git diff using OpenRouter AI.  
4️⃣ **Allow you to confirm, modify, or manually enter a commit message**.  
5️⃣ **Automatically commit and push your changes**.  

---

## **🔹 Features**
✅ **AI-powered commit messages** (DeepSeek R1 + all OpenRouter models)  
✅ **Interactive CLI with confirmation prompts**  
✅ **Works with `.env.openrouter` or CLI environment variables**  
✅ **Supports custom `.env` file paths** (`--env-path <path>`)  
✅ **Handles large diffs (truncates beyond 10,000 characters)**  
✅ **Failsafe exit handling (Ctrl+C won’t commit unfinished work)**  
✅ **Prevents accidental execution with the `-run` flag**  

---

## **❓ Troubleshooting**
### **Not enough OpenRouter credits?**
Visit [OpenRouter Credits](https://openrouter.ai/credits) and add more.

### **Command not found?**
Try running:
```sh
npx openrouter-commit -run
```
Or, if installed globally:
```sh
npm install -g openrouter-commit
openrouter-commit -run
```

### **Git push fails?**
Ensure your branch is set up to track a remote branch:
```sh
git branch --set-upstream-to=origin/main
```

---

## **💡 About**
Developed by [Unrealos.com](https://unrealos.com) – AI, SaaS, and PaaS solutions for businesses.

## **📜 License**
MIT © **Unrealos.com** 🚀