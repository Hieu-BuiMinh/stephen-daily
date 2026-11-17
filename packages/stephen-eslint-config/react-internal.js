import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReact from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import { config as baseConfig } from './base.js'

export const config = [
	...baseConfig,
	{ ...pluginReact.configs.flat.recommended, files: ['**/*.{jsx,tsx}'] },
	{ ...pluginReact.configs.flat['jsx-runtime'], files: ['**/*.{jsx,tsx}'] },
	{ ...jsxA11y.flatConfigs.recommended, files: ['**/*.{jsx,tsx}'] },
	{
		files: ['**/*.{jsx,tsx}'],
		languageOptions: { globals: { ...globals.browser } },
		settings: {
			react: { version: 'detect' },
			'jsx-a11y': { components: { Image: 'img', Link: 'a', TextField: 'input' } },
		},
	},
	{
		files: ['**/*.tsx'],
		rules: { 'react/prop-types': 'off' },
	},
	pluginReactHooks.configs.flat.recommended,
	prettierRecommended,
]
