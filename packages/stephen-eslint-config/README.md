# @repo/stephen-eslint-config

Shared flat configs for every workspace:

- `@repo/stephen-eslint-config/base`: JavaScript, TypeScript, typed linting, import checks, Turbo, and Prettier rules.
- `@repo/stephen-eslint-config/react-internal`: base plus React recommended/JSX runtime, accessibility, browser globals, and React Hooks rules.
- `@repo/stephen-eslint-config/next-js`: React plus Next.js recommended and Core Web Vitals rules.

Each consumer imports its preset from an `eslint.config.js` or `eslint.config.mjs`
and defines `lint: eslint . --max-warnings 0` in its package scripts.
The workspace root `.prettierrc.json` supplies formatting options to the Prettier ESLint rule.

## Compatibility

ESLint and `@eslint/js` are pinned to 9.39.5 throughout the workspace because the installed
React and JSX accessibility plugins declare support for ESLint 9, not ESLint 10.
Do not upgrade ESLint independently of these plugins' peer requirements.

## Type-aware rules

The `recommendedTypeChecked` preset uses the TypeScript project service for `.ts` and `.tsx`
files under `src`, `app`, `components`, `hooks`, and `lib`, relative to each consumer's ESLint config.
This includes the Next.js apps, which currently use `app` rather than `src/app`.
Each source file must belong to its package's `tsconfig.json`. JavaScript config files retain untyped linting.

This enables rules such as `@typescript-eslint/no-floating-promises` and
`@typescript-eslint/no-misused-promises`. Type-aware linting takes longer than syntax-only checks.

## Imports

`eslint-plugin-import-x` uses its recommended and TypeScript presets with
`eslint-import-resolver-typescript`. It checks unresolved imports, exports, duplicate imports,
and dependency cycles (`import-x/no-cycle`). The resolver uses the consumer's TypeScript configuration.

## React and accessibility

React consumers use the `recommended` and `jsx-runtime` presets. Runtime `react/prop-types`
checking is disabled for TSX because component props already have TypeScript types.
`jsx-a11y` uses its recommended preset and maps `Image`, `Link`, and `TextField` to their DOM equivalents.
Prettier remains the final formatting preset.

Keep exceptions narrow and documented. Source shadcn exceptions preserve upstream behavior in
Carousel, Combobox, Sidebar skeleton, the mobile hook, InputGroup's pointer-focus addon,
and Recharts' untyped payload boundary. The Next.js plugin's CommonJS config access also has
a line-level import warning exception because Node cannot import its configs as an ESM named export.

## Verification

Run `pnpm lint`, `pnpm check-types`, `pnpm build`, and `pnpm format:check` at the workspace root.
The new rules have also been checked against invalid in-memory samples for missing JSX keys,
missing image alt text, unresolved imports, and floating Promises.

Sources: [React](https://github.com/jsx-eslint/eslint-plugin-react),
[JSX accessibility](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y),
[import-x](https://github.com/un-ts/eslint-plugin-import-x),
[typed linting](https://typescript-eslint.io/getting-started/typed-linting/).
