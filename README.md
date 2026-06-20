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

### First-time setup (required once)

The deploy job returns **404** until Pages is enabled in the repo:

1. Open [Settings → Pages](https://github.com/TheChosenMok/dev-spaces-agent-dash/settings/pages)
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”)
3. Re-run the workflow: **Actions → Deploy to GitHub Pages → Run workflow**

After a successful run, the site is at **https://thechosenmok.github.io/dev-spaces-agent-dash/**
