import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import { importX } from 'eslint-plugin-import-x'
import globals from 'globals'
import { configs as typescriptConfigs } from 'typescript-eslint'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import turboPlugin from 'eslint-plugin-turbo'

export const config = defineConfig([
	globalIgnores([
		'**/node_modules/**',
		'**/.next/**',
		'**/.turbo/**',
		'**/.codegraph/**',
		'**/dist/**',
		'**/out/**',
		'**/build/**',
		'**/next-env.d.ts',
	]),
	js.configs.recommended,
	...typescriptConfigs.recommended,
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	{
		settings: {
			'import-x/resolver-next': [createTypeScriptImportResolver()],
		},
		rules: {
			'import-x/no-cycle': 'error',
			'import-x/no-duplicates': 'error',
		},
	},
	{
		files: [
			'src/**/*.{ts,tsx}',
			'app/**/*.{ts,tsx}',
			'components/**/*.{ts,tsx}',
			'hooks/**/*.{ts,tsx}',
			'lib/**/*.{ts,tsx}',
		],
		extends: [typescriptConfigs.recommendedTypeChecked],
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
		},
	},
	{
		languageOptions: { globals: { ...globals.node } },
		plugins: { turbo: turboPlugin },
		rules: { 'turbo/no-undeclared-env-vars': 'error' },
	},
	prettierRecommended,
])
