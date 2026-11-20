import type { ComponentProps } from 'react'
import { cn } from '@repo/stephen-utils'
import { DailyBaseImage, type DailyBaseImageProps } from '../../image'
import { BlogPostCardHeader, type BlogPostCardHeaderProps } from './header'

export type BlogPostCardProps = Omit<ComponentProps<'div'>, 'title' | 'children'> & {
	title: string
	subtitle: string
	author?: BlogPostCardHeaderProps['author']
	href: string
	imageSrc: DailyBaseImageProps['src']
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
	imageSrc,
	date,
	dateLabel,
	views,
	likes,
	orientation = 'vertical',
	className,
	...props
}: BlogPostCardProps) {
	return (
		<div
			{...props}
			role="article"
			data-slot="blog-post-card"
			data-orientation={orientation}
			className={cn(
				'recessed-panel post-card-surface relative flex h-full min-w-0 flex-col overflow-hidden p-4 sm:p-5',
				className
			)}
		>
			<div
				className={cn(
					'flex min-w-0 flex-1 flex-col gap-3',
					orientation === 'horizontal' && 'sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-5'
				)}
			>
				<div className="post-card-cover aspect-3/2 [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:saturate-75">
					<DailyBaseImage
						src={imageSrc}
						alt=""
						fill
						preview={false}
						sizes={
							orientation === 'horizontal'
								? '(max-width: 639px) 100vw, 40vw'
								: '(max-width: 639px) 100vw, 33vw'
						}
					/>
				</div>
				<div className="flex min-w-0 flex-1 flex-col">
					<BlogPostCardHeader
						headingAs="h3"
						eyebrow={<time dateTime={date}>{dateLabel}</time>}
						title={
							<a href={href} className="post-card-link">
								{title}
							</a>
						}
						subtitle={subtitle}
						author={author}
						className="mb-3 min-w-0"
						titleClassName={cn('truncate font-sans', orientation === 'horizontal' && 'sm:text-3xl')}
						subtitleClassName={cn(
							'line-clamp-3 max-w-none text-justify text-muted-foreground',
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
		</div>
	)
}
