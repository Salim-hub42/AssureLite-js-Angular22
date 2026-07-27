# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 22 application scaffolded with the Angular CLI, using standalone components, SCSS styles, and Vitest (via `@angular/build:unit-test`) as the test runner. Coding guidelines (TypeScript/Angular best practices, signals, accessibility) live in `.claude/CLAUDE.md` and must be followed.

## Commands

- `npm start` — dev server at http://localhost:4200 (development configuration, live reload)
- `npm run build` — production build to `dist/`
- `npm run watch` — development build in watch mode
- `npm test` — run unit tests with Vitest
- `npm test -- --include src/app/app.spec.ts` — run a single test file
- `ng generate component <name>` — scaffold a component (SCSS style is the configured default)

There is no lint target configured. Prettier is configured (`.prettierrc`: 100-char width, single quotes, Angular parser for HTML); format with `npx prettier --write <files>`.

## Architecture

- `src/main.ts` bootstraps the standalone root component `App` (`src/app/app.ts`) with `appConfig` from `src/app/app.config.ts` — providers are registered there (router, global error listeners), not in NgModules.
- Routes are defined in `src/app/app.routes.ts` (currently empty); feature routes should be lazy-loaded.
- Static assets go in `public/` (served at the root path); global styles in `src/styles.scss`.
- TypeScript uses project references: `tsconfig.app.json` for app code, `tsconfig.spec.json` for tests, both extending the strict options in `tsconfig.json`.
