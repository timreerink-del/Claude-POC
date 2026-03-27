# DMP WorkNow — Team Setup Guide

## Quick Start (< 10 minutes)

### Prerequisites
- Node.js 20 (use `nvm install 20 && nvm use 20` — a `.nvmrc` file is included)
- Git
- Expo Go app on your phone (for testing)
- Figma account with access to the DMP POC file
- Claude Code CLI (`npm install -g @anthropic-ai/claude-code`)

### Get the repo
```bash
git clone https://github.com/timreerink-del/Claude-POC.git
cd Claude-POC/dmp-prototype
./setup/team-setup.sh
```

### Figma Access
Request access to:
https://www.figma.com/design/amLMUl0QJ1LCFErsiE4hkg/DMP-x-Claude-POC

### Claude Code Setup
Claude Code is the AI coding assistant used on this project. Install it and sign in:
```bash
npm install -g @anthropic-ai/claude-code
claude login
```

### MCP Setup (Figma + Claude Code)
Install the Southleft Figma Console MCP:
```bash
claude mcp add figma-console -s user \
  -e FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN_HERE \
  -e ENABLE_MCP_APPS=true \
  -- npx -y figma-console-mcp@latest
```

Get your Figma token at:
https://www.figma.com/developers/api#access-tokens

### Daily Workflow
1. Pull latest: `git pull`
2. Run guardian: `./scripts/guardian.sh`
3. Create restore point before new work:
   `./scripts/restore-point.sh "your-feature-name"`
4. Build your feature
5. Run guardian again after: `./scripts/guardian.sh`
6. Create final restore point:
   `./scripts/restore-point.sh "your-feature-name-complete"`
7. Push: `git push`

### Design Rules
- Figma design is always the source of truth
- Use only design tokens — no hardcoded hex values
- Read `CLAUDE.md` before starting any Claude Code session
- Read `.claude/skills/ui-ux-pro-max/SKILL.md` before any design or UI work

### Restore Points
View all restore points:
```bash
./scripts/restore.sh
```

Roll back to a restore point:
```bash
git checkout restore/2025-01-15-feature-name
```

### Live Deployments
- Prototype: https://dist-eight-sigma-60.vercel.app/
- Latest: *(update this after each deploy)*

### Project Structure
```
dmp-prototype/
├── src/
│   ├── screens/        # Screen components
│   ├── components/     # Reusable UI components
│   │   ├── features/   # Domain-specific components
│   │   ├── navigation/ # Nav components
│   │   └── ui/         # Primitive components
│   ├── navigation/     # React Navigation setup
│   ├── tokens/         # Design tokens (colors, spacing, etc.)
│   └── data/           # Mock data
├── assets/             # Images, videos, illustrations
├── scripts/            # Guardian, restore point scripts
├── setup/              # This setup script
└── .claude/
    ├── skills/         # AI skill definitions
    └── commands/       # Custom slash commands
```

### Key Commands
| Command | Purpose |
|---------|---------|
| `npm run web` | Start web dev server |
| `npx expo start` | Start Expo dev server |
| `./scripts/guardian.sh` | Health check |
| `./scripts/restore-point.sh "name"` | Create restore point |
| `./scripts/restore.sh` | List restore points |
| `npx expo export --platform web && vercel deploy --prod --yes dist` | Deploy |
