'use client'

import { cn } from '@repo/stephen-utils'
import { useComposedRefs, useInView } from '@repo/stephen-ui/motion'
import { useRef, type ComponentProps } from 'react'

export type GridRowStripedProps = ComponentProps<'div'> & { borderX?: boolean }

export function GridRowStriped({ className, borderX = false, ref, children, ...props }: GridRowStripedProps) {
	const elementRef = useRef<HTMLDivElement>(null)
	const isInView = useInView(elementRef, { once: true, amount: 0.2 })
	const composedRef = useComposedRefs(elementRef, ref)

	return (
		<div
			{...props}
			ref={composedRef}
			data-slot="grid-row-striped"
			data-in-view={isInView}
			className={cn('grid-row-striped w-full', borderX ? 'border-x' : 'border-x-0', className)}
		>
			<span aria-hidden="true" data-slot="grid-row-striped-lines" />
			{children}
		</div>
	)
}
