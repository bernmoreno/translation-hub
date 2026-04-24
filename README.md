# Lingo Drift

Lingo Drift is a modern translation app with a bright, high-contrast layout, a dedicated dashboard, and a visible dependencies panel in the UI.

## Features

- Accessible bright color palette with stronger text/background contrast
- Translation workspace with source and output panels
- Dashboard cards for live status, character count, and target language
- Dependency section rendered directly in the app
- Static GitHub Pages deployment workflow
- Local Node-based static server

## Project Structure

- `index.html` contains the app layout and dashboard sections
- `styles.css` defines the visual system and responsive layout
- `script.js` powers translation actions and the dependency dashboard
- `server.js` serves the app locally on `http://localhost:4173`
- `.github/workflows/deploy.yml` deploys the app to GitHub Pages

## Local Run

From the `translation-studio` folder:

```powershell
node server.js
```

Then open:

```text
http://localhost:4173
```

## Dependencies Shown In The Dashboard

- `Node.js`
- `HTTP Server`
- `Google Fonts`
- `MyMemory API`
- `GitHub Pages`

## Deployment

Push this project to a GitHub repository and enable GitHub Pages with Actions. The included workflow publishes the static app automatically from the `main` branch.
