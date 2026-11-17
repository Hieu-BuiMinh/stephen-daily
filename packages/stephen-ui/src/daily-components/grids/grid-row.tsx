'use client'

import { cn } from '@repo/stephen-utils'
import { useComposedRefs, useInView } from '@repo/stephen-ui/motion'
import { useRef, type ComponentProps } from 'react'

export type GridRowProps = ComponentProps<'div'> & { borderX?: boolean }

export function GridRow({ className, borderX = false, ref, ...props }: GridRowProps) {
	const elementRef = useRef<HTMLDivElement>(null)
	const isInView = useInView(elementRef, { once: true, amount: 0.2 })
	const composedRef = useComposedRefs(elementRef, ref)

	return (
		<div
			{...props}
			ref={composedRef}
			data-slot="grid-row"
			data-in-view={isInView}
			className={cn('grid-row w-full', borderX ? 'border-x' : 'border-x-0', className)}
		/>
	)
}
