# AGENTS.md

## Overview

Static single-page personal site. Hosted on GitHub Pages from the repo root. Domain: `www.lindeberg.io`.

## Styles

- Edit `styles.scss`, never `styles.css` directly -- it is compiled output.
- Compile: `npx sass styles.scss styles.css`
- `styles.css` must be committed (no CI build step).

## Deployment

Push to `main` triggers GitHub Pages. No build pipeline -- all files are served as-is from the repo root.
