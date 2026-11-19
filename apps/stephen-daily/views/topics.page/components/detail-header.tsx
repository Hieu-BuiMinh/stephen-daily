import { DailyBaseImage, GridRowStriped } from '@repo/stephen-ui/daily-components'
import { RetroMusicPlayer } from '@repo/stephen-ui/daily-components/audio'
import type { ContentPost } from '../data'

export type DetailHeaderProps = Pick<ContentPost, 'cover' | 'title' | 'description' | 'createdAt' | 'audio'>

export function DetailHeader({ cover, title, description, createdAt, audio }: DetailHeaderProps) {
	const publishedAt = createdAt ? new Date(createdAt) : undefined

	return (
		<header className="">
			<div className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_auto_auto]">
				<h1 className="col-span-full min-w-0 px-4 py-5 font-playfair text-3xl leading-[1.4] font-black tracking-tight text-balance sm:text-4xl md:col-span-1 md:flex md:items-center md:px-8 md:py-7 md:leading-tight lg:text-5xl">
					{title}
				</h1>
				{cover && (
					<div className="min-w-0 border-t p-3 md:w-44 md:border-t-0 md:border-l lg:w-52">
						<div className="relative aspect-3/2 h-full min-h-28 overflow-hidden bg-muted md:aspect-auto">
							<DailyBaseImage
								src={cover}
								alt={title}
								fill
								unoptimized
								preview={false}
								sizes="(min-width: 1024px) 184px, (min-width: 768px) 152px, 80vw"
								className="object-cover"
							/>
						</div>
					</div>
				)}
				{publishedAt && (
					<time
						dateTime={createdAt}
						aria-label={publishedAt.toLocaleDateString('en-US', { timeZone: 'UTC' })}
						className="col-start-2 flex w-16 flex-col items-center justify-center border-t border-l py-3 font-sans text-xl leading-none font-bold text-foreground tabular-nums md:col-start-auto md:border-t-0"
					>
						<span className="w-12 border-b border-foreground/60 py-1 text-center">
							{publishedAt.getUTCFullYear()}
						</span>
						<span className="w-12 border-b border-foreground/60 py-1 text-center">
							{String(publishedAt.getUTCMonth() + 1).padStart(2, '0')}
						</span>
						<span className="w-12 border-b border-foreground/60 py-1 text-center text-brand">
							{String(publishedAt.getUTCDate()).padStart(2, '0')}
						</span>
						<span className="py-1 uppercase">
							{publishedAt.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}
						</span>
					</time>
				)}
			</div>
			{audio && (
				<div className="relative z-10 mt-5 px-3 lg:hidden">
					<RetroMusicPlayer source={audio} cover={cover} />
				</div>
			)}
			{description && (
				<GridRowStriped className="min-h-12 flex items-center justify-center px-4 py-2 text-sm md:px-8">
					{description}
				</GridRowStriped>
			)}
		</header>
	)
}
