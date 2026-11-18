# Stephen News workspace

Frontend monorepo with pnpm 10.13.1, Turborepo, Next.js, React, and TypeScript.
Use Node 22.15+ and below 25 for the local CodeGraph CLI.

## Development

```sh
pnpm install
pnpm run dev:stephen-daily
```

Stephen Daily: http://localhost:3000. Docs: http://localhost:3001 (`pnpm run dev:docs`).
`pnpm dev` starts both apps.

## Root commands

Run these commands from the workspace root. Scripts are defined in the root `package.json`;
they invoke Turborepo internally where needed.

| Command                                                            | Action                                                                |
| ------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `pnpm run dev`                                                     | Start both apps in development                                        |
| `pnpm run dev:stephen-daily`                                       | Start Stephen Daily on port 3000                                      |
| `pnpm run dev:docs`                                                | Start Docs on port 3001                                               |
| `pnpm run build`                                                   | Build all apps                                                        |
| `pnpm run build:stephen-daily` / `pnpm run build:docs`             | Build one app and its dependencies                                    |
| `pnpm run start:stephen-daily` / `pnpm run start:docs`             | Serve a production build on port 3000 / 3001; build first             |
| `pnpm run lint` / `pnpm run lint:check`                            | Check ESLint across the workspace                                     |
| `pnpm run lint:fix`                                                | Apply available ESLint fixes across the workspace; bypass Turbo cache |
| `pnpm run lint:stephen-daily` / `pnpm run lint:docs`               | Check ESLint for one app and its shared dependencies                  |
| `pnpm run check-types`                                             | Check TypeScript across the workspace                                 |
| `pnpm run check-types:stephen-daily` / `pnpm run check-types:docs` | Check TypeScript for one app and its shared dependencies              |
| `pnpm run format`                                                  | Format files with Prettier                                            |
| `pnpm run format:check`                                            | Check formatting without changing files                               |
| `pnpm run check`                                                   | Run formatting check, ESLint, and TypeScript checks in sequence       |

Before submitting changes, run `pnpm run check`. To apply automatic fixes, use
`pnpm run lint:fix` and `pnpm run format`, then run the checks again.

To run Stephen Daily in production locally:

```sh
pnpm run build:stephen-daily
pnpm run start:stephen-daily
```

## Generate and preview posts

Run these commands from the workspace root.

Generate content once from MDX in `packages/stephen-contents/articles/`:

```sh
pnpm --filter stephen-contents build
```

Generated data is written to `packages/stephen-contents/.velite/`.

Start Stephen Daily with automatic content generation and MDX watching:

```sh
pnpm dev:stephen-daily
```

Open [http://localhost:3000/topics](http://localhost:3000/topics) to browse published posts.
To show the example post, set `published: true` in
`packages/stephen-contents/articles/dev/posts/mdx-example.mdx`, then open
[http://localhost:3000/topics/dev/post/mdx-example](http://localhost:3000/topics/dev/post/mdx-example).
When not watching, run the content build again after editing MDX.

Watch content independently without starting the app:

```sh
pnpm --filter stephen-contents dev
```

Generate content and check its TypeScript types:

```sh
pnpm --filter stephen-contents check-types
```

See [Stephen Contents](packages/stephen-contents/README.md) for collections and frontmatter,
and [content pages](apps/stephen-daily/README.md#content-pages) for routes and rendering.

## Shared packages

| Package                           | Purpose                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `@repo/stephen-ui`                | shadcn primitives in `src/base`, Daily compositions in `src/daily-components`, shared CSS in `src/styles/base.css` |
| `@repo/stephen-utils`             | Framework-independent helpers, including `cn`                                                                      |
| `@repo/stephen-lib`               | Shared integrations and application libraries; currently an empty entry point until a concrete integration exists  |
| `@repo/stephen-eslint-config`     | Shared base, React, and Next.js ESLint flat configs                                                                |
| `@repo/stephen-typescript-config` | Shared TypeScript configs                                                                                          |

Use `workspace:*` for internal dependencies. Source packages are consumed directly by Next.js, without a separate library build.
TypeScript is pinned to 6.0.3 to satisfy the installed typescript-eslint peer contract.

## Editor auto-imports

Open the workspace root in VS Code/Cursor. `.vscode/settings.json` prefers non-relative
auto-imports and points IntelliSense to the workspace TypeScript installation.
Select **TypeScript: Select TypeScript Version → Use Workspace Version**, then restart the TS server
if import suggestions are still cached.

Use `@/...` for files inside an app and public package exports such as
`@repo/stephen-ui/daily-components` for shared components. Avoid importing `packages/.../src` directly.

## UI and styles in an app

Add `@repo/stephen-ui` to the app dependencies, then import the shared stylesheet once in the app's global CSS:

```css
@import '@repo/stephen-ui/styles.css';
@source '../';
```

The source path is relative to the app stylesheet (the example assumes `app/globals.css`).
The UI stylesheet scans its own `src` directory, includes Tailwind and animation styles,
and owns the shared shadcn tokens, `--content-max-width`, and `--page-gutter`.
Use `.dark` on the root element for the dark palette. Override tokens after the import for app-specific themes.

In `postcss.config.mjs`:

```js
export { default } from '@repo/stephen-ui/postcss.config'
```

In the Next.js config, include `transpilePackages: ['@repo/stephen-ui', '@repo/stephen-utils', '@repo/stephen-lib']`.
Import global CSS from the root layout. Both existing apps demonstrate this setup.

```tsx
import { Button } from '@repo/stephen-ui/base/button'
import { WelcomeCard } from '@repo/stephen-ui/daily-components'
import { cn } from '@repo/stephen-utils'
```

Add primitives using the configured shadcn CLI:

```sh
pnpm dlx shadcn@latest add input --cwd packages/stephen-ui --yes
pnpm format
```

Keep generic primitives in `src/base`. Build Daily components by composing those primitives in `src/daily-components`.
The UI package includes all 61 components available for its `new-york` preset,
plus the mobile hook required by Sidebar. Dependencies and shared Chart/Sidebar theme tokens are installed.
The registry does not provide `code-block`, `questionnaire`, `toast`, or `trace` for this preset;
use the included Sonner component for toast notifications.
Wrap tooltip consumers in `TooltipProvider` from `@repo/stephen-ui/base/tooltip`.
Mount `Toaster` from `@repo/stephen-ui/base/sonner` in an app layout when enabling notifications.

Internal component imports use `@repo/stephen-ui/...` so they resolve consistently in consuming apps.
Documented line-level ESLint exceptions retain upstream behavior in Carousel, Combobox,
Sidebar skeleton, the mobile hook, InputGroup's focus addon, and Recharts payload handling;
shared lint rules remain enabled elsewhere.

The original starter components remain exported at `@repo/stephen-ui/button`, `@repo/stephen-ui/card`, and `@repo/stephen-ui/code` for compatibility.
App-level `components.json` files point to the shared UI package; copy one when creating another app.

## Lint and formatting

Every app and package has a lint task using `@repo/stephen-eslint-config`.
Use `base` for TypeScript libraries, `react-internal` for React packages, and `next-js` for Next.js apps.
New packages must depend on the shared config and expose a lint task so Turbo includes them.

```js
export { config as default } from '@repo/stephen-eslint-config/base'
```

The base config enforces JavaScript/TypeScript recommended rules, type-aware checks for source files,
import validation/cycles, Turbo environment rules, and the root Prettier configuration.
React presets add React recommended/JSX runtime and accessibility rules; Next.js inherits these.
ESLint is pinned to 9.39.5 for compatibility with the React/accessibility plugins.
Errors are not downgraded to warnings. See `packages/stephen-eslint-config/README.md` for scope and exceptions.
`.prettierrc.json` is the shared source of truth: tabs, no semicolons, single quotes, 120 columns, LF.

```sh
pnpm format
pnpm format:check
pnpm lint
pnpm check-types
pnpm build
```

## Agents

`AGENTS.md` defines project rules. Project skills: `.agents/skills/codegraph` and `.agents/skills/caveman`.
Codex MCP configuration uses the local CodeGraph binary through pnpm. Restart Codex and trust this project to enable it.
Use `$caveman` for concise replies, `normal mode` to stop.

```sh
pnpm exec codegraph init --yes
pnpm exec codegraph sync
pnpm exec codegraph status
```

The `.codegraph/` index is local and ignored by Git.

References: [shadcn monorepo](https://ui.shadcn.com/docs/monorepo),
[Tailwind Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs),
[typescript-eslint](https://typescript-eslint.io/getting-started/).
"# stephen-daily"
"# stephen-daily"
"# stephen-daily"
"# stephen-daily"
"# stephen-daily"
