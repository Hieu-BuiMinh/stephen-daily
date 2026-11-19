<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": true` in the root `turbo.json` or `turbo.jsonc` to opt in; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

# Project rules

Act as a pragmatic senior front-end engineer. Correctness, simplicity, readability,
and preserving existing business behavior take priority.

## Workspace

- Use pnpm 10.13.1; Node 22.15+ (below 25 for CodeGraph).
- `apps/stephen-daily`: Next.js app, port 3000.
- `apps/docs`: Next.js docs app, port 3001.
- `packages/stephen-ui`: shared React components, imported through `@repo/stephen-ui/*`.
- `packages/stephen-eslint-config` and `packages/stephen-typescript-config`: shared tooling.
- Use `workspace:*` for internal dependencies. Add runtime dependencies to their consuming package.

## Changes

- For migration or parity work, use the sibling checkout `../stephen-v2` as a
  read-only reference for original components, utilities, and content. Check
  `stephen-news` first, then look in that checkout before asking for its path.

- Inspect implementation, callers, types, similar code, and actual data flow before editing.
- Preserve business logic, API contracts, UI flows, state, loading/errors, forms, routing,
  and responsive behavior unless the task explicitly changes them.
- Verify edge cases against types, APIs, schemas, fixtures, or logs. State unverified
  assumptions; do not add speculative guards, fallbacks, or try/catch.
- Make the smallest focused fix. Follow existing conventions. Avoid unrelated cleanup,
  formatting, renaming, and refactoring.
- Prefer direct, readable code. Extract functions only for demonstrated reuse,
  difficult blocks, or meaningful domain concepts. Avoid speculative abstractions.
- Derive values from props/state. Do not add effects, state, memoization, or custom
  hooks without a concrete need.
- Comments explain why, especially business rules and non-obvious constraints.
- Refactors need a concrete problem, benefit, and explicit behavior assessment.

## Verification and review

Run `pnpm lint`, `pnpm check-types`, and `pnpm build` for changes to the workspace
or shared tooling. For app-only changes, filter to the affected app and consider
its consumers. Add tests for meaningful behavior; do not add tests that mirror code.

Review business correctness first, then bugs, readability, maintainability, consistency,
and evidenced performance issues. Distinguish confirmed bugs, supported risks,
optional suggestions, and preferences. Do not manufacture findings.

Report what changed, why, validation results, and any unverified assumptions concisely.

## Skills and code navigation

Before adding or modifying API requests, services, DTOs, or TanStack Query usage in
`apps/stephen-daily`, read and follow [Service Layer & Query Keys](.agents/rules/SERVICE-LAYER.md).

Project skills live in `.agents/skills/`:

- `codegraph`: local index, symbol navigation, callers, and impact analysis.
- `caveman`: concise responses when requested; preserve technical details and the user's language.

Use source inspection to verify graph results. After pulling code or making changes,
sync the index with `pnpm exec codegraph sync` before relying on it.

<!-- CODEGRAPH_START -->

## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->

UI primitives belong in packages/stephen-ui/src/base; compose them in src/daily-components. Import shared CSS through @repo/stephen-ui/styles.css. Every app and package must use a shared ESLint preset and expose a lint script. Run pnpm format:check as well as lint, check-types, and build for workspace changes. Do not override the root Prettier settings per package.
