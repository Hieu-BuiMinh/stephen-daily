---
name: codegraph
description: Navigate this monorepo with its local CodeGraph index to find symbols, trace callers, and assess change impact. Use when initializing or refreshing .codegraph or investigating code across files.
---

# CodeGraph

This project uses `@colbymchenry/codegraph` from root devDependencies.
Run commands at the repository root; use `pnpm exec codegraph` instead of a global binary.

Check the index with `pnpm exec codegraph status`. If absent, run
`pnpm exec codegraph init --yes`. Before relying on an existing index after edits,
run `pnpm exec codegraph sync`.

Use the available CodeGraph MCP tools when connected. Otherwise use the CLI:

- `pnpm exec codegraph query "symbol"` finds symbols.
- `pnpm exec codegraph explore "task or question"` gathers relevant source and relationships.
- `pnpm exec codegraph callers "symbol"` traces consumers.
- `pnpm exec codegraph impact "symbol"` checks the effect of a proposed change.
- `pnpm exec codegraph affected apps/stephen-daily/app/page.tsx` locates related tests.

Read `pnpm exec codegraph <command> --help` for version-specific options.
Verify findings against source files and actual consumers before changing behavior.
Graph results supplement source inspection; an empty result does not prove code is unused.
Keep generated `.codegraph/` data out of version control.

Upstream: https://github.com/colbymchenry/codegraph
