import { fileURLToPath } from 'node:url'
import { build } from 'velite'

export function buildContent(watch = false) {
	// A running dev server may still be reading the generated files during a build.
	return build({ config: fileURLToPath(new URL('./velite.config.ts', import.meta.url)), watch })
}
