export const LIBRARY_NAME = "openrouter-commit";

export const IGNORED_FILES = [
    "node_modules/", "package-lock.json", ".npm/",
    "venv/", "env/", "__pycache__/", "*.pyc", "*.pyo", "*.pyd", 
    "Pipfile", "Pipfile.lock", "poetry.lock", ".python-version",
    ".env", ".env.*", ".env.openrouter",
    "logs/", "*.log", "npm-debug.log*", "yarn-debug.log*", "debug.log*",
    ".cache/", ".pnp.js", ".pnp.cjs", ".pnp.mjs", "dist/", "build/", 
    "site/", ".pytest_cache/", ".mypy_cache/",
    ".idea/", "*.iml", ".vscode/", ".editorconfig",
    ".DS_Store", "Thumbs.db",
    "coverage/", ".coverage", "htmlcov/", "nosetests.xml", "coverage.xml", 
    "*.cover", "*.py,cover", ".hypothesis/",
    ".gitignore", ".gitattributes",
    ".github/", ".gitlab/", ".circleci/", ".travis.yml",
    ".ipynb_checkpoints/"
];
