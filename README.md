# **openrouter-commit 🚀 AI-Powered Git Commit Messages**  

**Generate smart, concise Git commit messages** using OpenRouter AI models. Supports **DeepSeek R1** and any OpenRouter model.

---

## **⚡ Quick Start**  

### **One-time use (no install)**
```sh
npx openrouter-commit -run
```

### **Global install**
```sh
npm install -g openrouter-commit
openrouter-commit -run
```

### **Project-based usage (`package.json`)**
Add to your project:
```json
{
    "scripts": {
        "commit": "npx openrouter-commit -run"
    }
}
```
Run with:
```sh
npm run commit  # or yarn commit
```

---

## **🔄 Updating**
- **Global:** `npm update -g openrouter-commit`  
- **npx users:** `npx clear-npx-cache`  
- **Project-based:** `npm update openrouter-commit`  

---

## **⚙️ Setup**
### **API Key & Model Configuration**
#### **Option 1: Use a `.env.openrouter` file (recommended)**
```sh
OPENROUTER_API_KEY=your-api-key
OPENROUTER_MODEL=deepseek/deepseek-r1
```
#### **Option 2: Set as environment variables**
```sh
export OPENROUTER_API_KEY=your-api-key
export OPENROUTER_MODEL=deepseek/deepseek-r1
```
#### **Option 3: Specify a custom `.env` path**
```sh
npx openrouter-commit -run --env-path /custom/path/.env
```

---

## **🚀 How It Works**
1️⃣ **Checks Git status**  
2️⃣ **Prompts to stage changes**  
3️⃣ **Generates an AI-powered commit message**  
4️⃣ **Lets you confirm or edit it**  
5️⃣ **Commits and pushes automatically**  

---

## **🔥 Features**
✅ **AI-powered commit messages** (DeepSeek R1 + all OpenRouter models)  
✅ **Interactive CLI with confirmation prompts**  
✅ **Supports `.env.openrouter` or CLI environment variables**  
✅ **Custom `.env` paths with `--env-path`**  
✅ **Smart handling of large diffs (truncated to 10,000 characters)**  
✅ **Failsafe exit handling (Ctrl+C won’t commit unfinished work)**  
✅ **Prevents accidental execution with `-run` flag**  

---

## **❓ Troubleshooting**
### **Not enough OpenRouter credits?**
🔗 [Top up here](https://openrouter.ai/credits)

### **Command not found?**
```sh
npx openrouter-commit -run
```
Or:
```sh
npm install -g openrouter-commit
openrouter-commit -run
```

### **Git push fails?**
Ensure your branch tracks a remote branch:
```sh
git branch --set-upstream-to=origin/main
```

---

## **💡 About**
Built by [Unrealos.com](https://unrealos.com) – AI, SaaS, and PaaS solutions.

## **📜 License**
MIT © **Unrealos.com** 🚀
