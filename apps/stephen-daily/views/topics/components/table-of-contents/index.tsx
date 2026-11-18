import type { ContentPost } from '../../data'
import { TableOfContentsNav } from './toc-nav'

export function TableOfContents({ items, audio }: { items: ContentPost['toc']; audio?: ContentPost['audio'] }) {
	if (items.length === 0 && !audio) return null

	return (
		<aside
			aria-label="Article navigation"
			className="hidden min-h-10 min-w-0 max-h-[calc(100svh-var(--toc-top)-1rem)] flex-col gap-4 p-4 transition-[top] duration-300 ease-out [--toc-top:1rem] motion-reduce:transition-none lg:sticky lg:top-(--toc-top) lg:col-span-3 lg:flex lg:self-start lg:group-has-data-[navbar-visible=true]/page-layout:[--toc-top:calc(var(--navbar-height)+2rem)]"
		>
			{items.length > 0 && (
				<div className="flex min-h-0 flex-col">
					<TableOfContentsNav items={items} />
				</div>
			)}
			{audio && (
				// The content schema supplies an audio URL without a caption file.
				// eslint-disable-next-line jsx-a11y/media-has-caption
				<audio
					src={audio}
					controls
					preload="none"
					aria-label="Listen to this article"
					className="w-full shrink-0"
				/>
			)}
		</aside>
	)
}
