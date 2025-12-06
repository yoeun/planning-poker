# nvm (Node Version Manager) Quick Reference

You now have nvm installed! Here are the most useful commands:

## Common Commands

### List available Node versions
```bash
nvm list-remote          # Show all available versions
nvm list                 # Show installed versions
```

### Install Node versions
```bash
nvm install 20           # Install Node.js v20
nvm install --lts        # Install latest LTS version
nvm install node         # Install latest stable version
```

### Switch between versions
```bash
nvm use 20               # Switch to Node.js v20
nvm use default          # Switch to default version
nvm use --lts            # Switch to latest LTS
```

### Set default version
```bash
nvm alias default 20     # Set Node 20 as default
nvm alias default node   # Set latest as default
```

### Current status
```bash
nvm current              # Show current version
nvm which node           # Show path to current node
```

## For This Project

The Dockerfile uses Node 20, but Node 24 (current LTS) will work fine. If you want to match exactly:

```bash
nvm install 20
nvm use 20
nvm alias default 20
```

## Tips

- Each Node version comes with its own npm
- You can have multiple versions installed simultaneously
- Switch versions per project: `nvm use 20` in project directory
- Create `.nvmrc` file in project root with version number for auto-switching

## Verify Installation

```bash
node --version   # Should show v24.11.1 (or your current version)
npm --version    # Should show 11.6.2 (or your current version)
```

