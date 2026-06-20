# Dev Spaces — Agentic Dashboard

Interactive mockup of an agentic development environment dashboard: project sidebar, agent activity log, raw CLI, diff viewer, git staging, file editor, and user terminal.

Built with React 19, Vite, TypeScript, and xterm.js.

## Live demo

After GitHub Pages is enabled, the app is published at:

**https://thechosenmok.github.io/dev-spaces-agent-dash/**

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

Production builds use the `/dev-spaces-agent-dash/` base path for GitHub Pages.

## Deploy

Pushes to `main` trigger the [GitHub Actions workflow](.github/workflows/deploy-pages.yml), which builds and deploys to GitHub Pages.

### First-time setup (required — do this in GitHub, not in code)

GitHub Pages **cannot** be turned on from the workflow. The repo owner must do this once in the browser:

1. Open **https://github.com/TheChosenMok/dev-spaces-agent-dash/settings/pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”)
3. Go to **Actions** → **Deploy to GitHub Pages** → **Run workflow**

Until step 2 is done, deploy will fail with `404 Not Found`.

After a successful run: **https://thechosenmok.github.io/dev-spaces-agent-dash/**
