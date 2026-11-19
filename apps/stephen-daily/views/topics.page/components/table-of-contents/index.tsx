import { RetroMusicPlayer } from '@repo/stephen-ui/daily-components/audio'
import type { ContentPost } from '../../data'
import { TableOfContentsNav } from './toc-nav'

export function TableOfContents({
	items,
	audio,
	cover,
}: {
	items: ContentPost['toc']
	audio?: ContentPost['audio']
	cover?: ContentPost['cover']
}) {
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
			{audio && <RetroMusicPlayer source={audio} cover={cover} className="shrink-0" />}
		</aside>
	)
}
