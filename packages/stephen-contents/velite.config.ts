import rehypeShiki from '@shikijs/rehype'
import { transformerMetaHighlight } from '@shikijs/transformers'
import { defineConfig } from 'velite'
import rehypeSlug from 'rehype-slug'
import { bookRecap } from './collections/book.collections'
import { devPost } from './collections/dev.collections'
import { docPost } from './collections/doc.collections'
import { projectPost } from './collections/project.collections'
import { retroPost } from './collections/retro.collections'
import { shortWriting } from './collections/short.collections'

export default defineConfig({
	root: '.',
	strict: true,
	mdx: {
		rehypePlugins: [
			rehypeSlug,
			[
				rehypeShiki,
				{
					themes: { light: 'github-light', dark: 'github-dark' },
					transformers: [transformerMetaHighlight()],
				},
			],
		],
	},
	collections: { bookRecap, devPost, docPost, projectPost, retroPost, shortWriting },
	output: {
		data: '.velite',
		assets: '../../apps/stephen-daily/public/velite',
		base: '/velite/',
	},
})
