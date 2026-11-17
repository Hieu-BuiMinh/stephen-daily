import pluginNext from '@next/eslint-plugin-next'
import { config as reactConfig } from './react-internal.js'

// The installed Next.js plugin is CommonJS and does not expose a Node ESM named export.
// eslint-disable-next-line import-x/no-named-as-default-member
const nextConfigs = pluginNext.configs

export const nextJsConfig = [
	...reactConfig,
	{
		plugins: { '@next/next': pluginNext },
		rules: {
			...nextConfigs.recommended.rules,
			...nextConfigs['core-web-vitals'].rules,
		},
	},
]
