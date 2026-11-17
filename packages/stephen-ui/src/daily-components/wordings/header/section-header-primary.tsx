import { cn } from '@repo/stephen-utils'
import type { HeaderContentProps } from './types'

export function SectionHeaderPrimary({
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
			data-slot="section-header-primary"
			className={cn('flex flex-col items-center gap-4 px-4 py-6 text-center sm:py-8', className)}
		>
			<div className="w-full min-w-0">
				{eyebrow && (
					<div className="mb-3 flex items-center justify-center gap-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase before:h-px before:w-10 before:bg-border after:h-px after:w-10 after:bg-border">
						{eyebrow}
					</div>
				)}
				<Heading
					id={titleId}
					className={cn(
						'font-yeseva text-3xl leading-tight tracking-tight text-balance sm:text-5xl',
						titleClassName
					)}
				>
					{title}
				</Heading>
				{subtitle && (
					<div
						className={cn(
							'mx-auto mt-3 max-w-2xl font-playfair text-base leading-relaxed text-muted-foreground italic',
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
