# Bella Technologies

Marketing site for Bella Technologies — B2B lead generation, targeting US/Florida
spa & wellness business owners. Built with [Astro](https://astro.build) and
[Tailwind CSS](https://tailwindcss.com).

## Requirements

- Node.js >= 22.12.0 (see `.nvmrc`)
- pnpm

## Getting started

```sh
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321`.

## Scripts

| Command         | Description                              |
| --------------- | ----------------------------------------- |
| `pnpm dev`      | Start the local dev server                |
| `pnpm build`    | Build the production site to `dist/`      |
| `pnpm preview`  | Preview the production build locally      |

## Project structure

```
src/
  components/   Astro components (Nav, Hero, Footer, etc.)
  layouts/       Shared page layout
  pages/         Route pages (index.astro)
  styles/        Global CSS
public/          Static assets
```

See [DESIGN.md](DESIGN.md) for the design system and layout conventions.

## Analytics

Google Tag Manager (`GTM-5ZN587DK`) is loaded in [Layout.astro](src/layouts/Layout.astro),
gated behind `import.meta.env.PROD` so it never fires during local development.

## Deployment

Pushing a `vX.Y.Z` tag to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site on a GitHub-hosted runner and rsyncs `dist/` to
`bellatech-blr-prod`, served by Caddy (see [`deploy/Caddyfile`](deploy/Caddyfile)).

Use the project's `/release <version>` command to cut a release branch, bump
`package.json`, and update `CHANGELOG.md` in one step. See [CHANGELOG.md](CHANGELOG.md)
for release history.
