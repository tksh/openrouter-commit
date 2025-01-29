
# **openrouter-commit - AI-powered Git Commit Messages** 🚀

**`openrouter-commit`** is a CLI tool that helps you write **clear, concise, and AI-generated** commit messages using OpenRouter's LLM models.

## **Installation & Usage**

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

### **Why is `-run` required?**
The `-run` flag is used as a safety mechanism to **prevent unintended executions** when running `npx openrouter-commit`.  
If the flag is missing, the script will show:
```
Usage: openrouter-commit -run
Missing '-run' argument. Exiting...
```

## **Configuration**
Before using `openrouter-commit`, set up your OpenRouter **API key** and **model**.

1. **Create a `.env.openrouter` file** in your project's root:
   ```sh
   OPENROUTER_API_KEY=your-api-key
   OPENROUTER_MODEL=deepseek/deepseek-r1
   ```

2. **Or set the environment variables manually**:
   ```sh
   export OPENROUTER_API_KEY=your-api-key
   export OPENROUTER_MODEL=deepseek/deepseek-r1
   ```

## **How It Works**
When you run `openrouter-commit -run`, the script will:
1. **Check your Git status** and show modified files.
2. **Prompt you to stage all changes** (if they are not staged).
3. **Generate a commit message** based on the Git diff using OpenRouter AI.
4. **Allow you to confirm, modify, or manually enter a commit message**.
5. **Automatically commit and push your changes**.

## **Example Workflow**
```sh
npx openrouter-commit -run
```
✔ Checking Git status...  
✔ Would you like to add all changes to the commit? **(Y/n)**  
✔ Generating commit message with AI...  
✔ **Suggested Commit Message:**  
  📝 `"Fix API response handling and improve error messages"`  
✔ What would you like to do?  
   - **Use this commit message**  
   - **Enter my own message**  
   - **Exit**  

## **Features**
✅ **AI-powered commit messages**  
✅ **Interactive CLI with confirmation prompts**  
✅ **Uses `.env.openrouter` for easy configuration**  
✅ **Handles large diffs (truncates beyond 10,000 characters)**  
✅ **Failsafe exit handling (Ctrl+C won’t commit unfinished work)**  
✅ **Prevents accidental execution with the `-run` flag**  

## **Troubleshooting**
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

## **About**
Developed by [Unrealos.com](https://unrealos.com) – AI, SaaS, and PaaS solutions for businesses.

## **License**
MIT © **Unrealos.com**
