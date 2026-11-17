import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { Card } from '@repo/stephen-ui/base/card'
import { cn } from '@repo/stephen-utils'
import { BlogPostCardHeader, type BlogPostCardHeaderProps } from './header'
import { createTornPaperMask } from './torn-paper-mask'

export type BlogPostCardProps = Omit<ComponentProps<typeof Card>, 'title' | 'children'> & {
	title: string
	subtitle: string
	author?: BlogPostCardHeaderProps['author']
	href: string
	image: ReactNode
	date: string
	dateLabel: string
	views: number
	likes: number
	orientation?: 'vertical' | 'horizontal'
}

export function BlogPostCard({
	title,
	subtitle,
	author,
	href,
	image,
	date,
	dateLabel,
	views,
	likes,
	orientation = 'vertical',
	className,
	style,
	...props
}: BlogPostCardProps) {
	const halftoneSeed =
		Array.from(href).reduce((seed, character) => Math.imul(seed, 31) + character.charCodeAt(0), 0) >>> 0

	return (
		<Card
			{...props}
			role="article"
			data-slot="blog-post-card"
			data-orientation={orientation}
			style={
				{
					'--torn-paper-mask': createTornPaperMask(href),
					'--paper-halftone-position': ['0% 0%', '100% 0%', '0% 100%', '100% 100%'][halftoneSeed % 4],
					'--paper-halftone-offset': `${halftoneSeed % 320}px ${(halftoneSeed >>> 8) % 320}px`,
					...style,
				} as CSSProperties
			}
			className={cn(
				'torn-paper-card h-full min-w-0 gap-0 rounded-none border-0 bg-transparent p-4 text-foreground shadow-none sm:p-5',
				className
			)}
		>
			<span aria-hidden="true" className="paper-halftone" />
			<div
				className={cn(
					'group relative flex min-w-0 flex-1 flex-col gap-3',
					orientation === 'horizontal' && 'sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-5'
				)}
			>
				<div className="relative aspect-3/2 overflow-hidden bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:saturate-75">
					{image}
				</div>
				<div className="flex min-w-0 flex-1 flex-col">
					<BlogPostCardHeader
						headingAs="h3"
						eyebrow={<time dateTime={date}>{dateLabel}</time>}
						title={
							<a
								href={href}
								className="outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-brand focus-visible:after:ring-offset-4 focus-visible:after:ring-offset-background"
							>
								{title}
							</a>
						}
						subtitle={subtitle}
						author={author}
						className="mb-3 min-w-0"
						titleClassName={cn(
							'truncate transition-colors group-hover:text-brand group-focus-within:text-brand',
							orientation === 'horizontal' && 'sm:text-3xl'
						)}
						subtitleClassName={cn(
							'line-clamp-3 max-w-none text-justify',
							orientation === 'horizontal' && 'sm:line-clamp-10'
						)}
					/>
					<div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-2 font-mono text-[10px] text-muted-foreground tabular-nums">
						<span>{views.toLocaleString('en')} views</span>
						<span aria-hidden="true">·</span>
						<span>{likes.toLocaleString('en')} likes</span>
					</div>
				</div>
			</div>
		</Card>
	)
}
