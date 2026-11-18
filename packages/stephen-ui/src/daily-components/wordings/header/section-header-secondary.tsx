import { cn } from '@repo/stephen-utils'
import type { HeaderContentProps } from './types'

export function SectionHeaderSecondary({
	title,
	subtitle,
	eyebrow,
	actions,
	headingAs: Heading = 'h2',
	titleId,
	titleClassName,
	subtitleClassName,
	className,
	...props
}: HeaderContentProps) {
	return (
		<header
			{...props}
			data-slot="section-header-secondary"
			className={cn('flex flex-wrap items-end justify-between gap-4 border-b border-border px-4 py-4', className)}
		>
			<div className="min-w-0 flex-1 border-l-4 border-brand pl-4">
				{eyebrow && (
					<div className="mb-2 font-mono text-[10px] tracking-widest text-brand-text uppercase">
						{eyebrow}
					</div>
				)}
				<Heading
					id={titleId}
					className={cn(
						'font-sans text-2xl leading-none font-black tracking-tight uppercase sm:text-3xl',
						titleClassName
					)}
				>
					{title}
				</Heading>
				{subtitle && (
					<div
						className={cn(
							'mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground',
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
