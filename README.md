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

In the repo **Settings → Pages**, set **Source** to **GitHub Actions** if it is not already.
