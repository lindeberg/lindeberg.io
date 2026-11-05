# AGENTS.md

Static single-page toy site, served by GitHub Pages from the repo root at `www.lindeberg.io`.

- Plain HTML, CSS and JS. No build step, no dependencies, nothing loaded from other origins (the CSP in `index.html` enforces it).
- The page must not say anything about its owner: no name, employer, location, links to profiles, or SEO metadata. It stays `noindex`.
- Push to `main` deploys.
