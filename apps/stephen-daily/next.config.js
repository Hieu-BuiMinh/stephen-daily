import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'
import { buildContent } from 'stephen-contents/build'

if (process.argv.includes('build')) {
	await buildContent()
}

/** @type {ReturnType<typeof buildContent> | undefined} */
let contentWatcher

/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['@repo/stephen-ui', '@repo/stephen-utils', '@repo/stephen-lib', 'stephen-contents'],
}

export default async function config(phase) {
	if (phase === PHASE_DEVELOPMENT_SERVER) {
		contentWatcher ??= buildContent(true)
		await contentWatcher
	}

	return nextConfig
}
