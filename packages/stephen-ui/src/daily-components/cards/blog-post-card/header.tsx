import { cn } from '@repo/stephen-utils'
import type { ReactNode } from 'react'
import type { HeaderContentProps } from '../../wordings/header/types'

export type BlogPostCardHeaderProps = HeaderContentProps & {
	author?: { name: string; avatar: ReactNode; href: string }
}

export function BlogPostCardHeader({
	title,
	subtitle,
	author,
	eyebrow,
	actions,
	headingAs: Heading = 'h2',
	titleId,
	titleClassName,
	subtitleClassName,
	className,
	...props
}: BlogPostCardHeaderProps) {
	return (
		<header
			{...props}
			data-slot="blog-post-card-header"
			className={cn('flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2', className)}
		>
			<div className="min-w-0 flex-1">
				{eyebrow && (
					<div className="mb-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
						{eyebrow}
					</div>
				)}
				<Heading
					id={titleId}
					className={cn('font-playfair text-xl leading-tight font-bold tracking-tight', titleClassName)}
				>
					{title}
				</Heading>
				{author && (
					<a
						href={author.href}
						target="_blank"
						rel="noopener noreferrer"
						className="relative z-10 mt-2 flex w-fit max-w-full min-w-0 items-center gap-2 text-[11px] text-muted-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand"
					>
						<span className="size-6 shrink-0 overflow-hidden border border-border bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
							{author.avatar}
						</span>
						<span className="truncate">
							By <span className="font-medium text-foreground">{author.name}</span>
						</span>
					</a>
				)}
				{subtitle && (
					<div
						className={cn(
							'mt-2 max-w-2xl font-sans text-sm leading-relaxed text-foreground/80',
							subtitleClassName
						)}
					>
						{subtitle}
					</div>
				)}
			</div>
			{actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
		</header>
	)
}
