import { cn } from '@repo/stephen-utils'
import type { ComponentProps, CSSProperties } from 'react'

type Column = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type NewsGridProps = ComponentProps<'div'>

export type NewsGridSectionProps = ComponentProps<'section'> & {
	colSpan?: Column
	colStart?: Column | 'auto'
}

function NewsGridRoot({ className, ...props }: NewsGridProps) {
	return (
		<div
			{...props}
			data-slot="news-grid"
			className={cn('mx-auto grid w-full max-w-9xl grid-cols-12 gap-4', className)}
		/>
	)
}

function NewsGridSection({ colSpan = 12, colStart = 'auto', className, style, ...props }: NewsGridSectionProps) {
	return (
		<section
			{...props}
			data-slot="news-grid-section"
			className={cn('min-w-0 col-span-(--news-col-span) col-start-(--news-col-start)', className)}
			style={
				{
					'--news-col-span': colSpan,
					'--news-col-start': colStart,
					...style,
				} as CSSProperties
			}
		/>
	)
}

const NewsGrid = Object.assign(NewsGridRoot, { Section: NewsGridSection })

export { NewsGrid }
export default NewsGrid
