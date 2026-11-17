'use client'

import { cn } from '@repo/stephen-utils'
import { useComposedRefs, useInView } from '@repo/stephen-ui/motion'
import { useRef, type ComponentProps } from 'react'

export type GridSeparatorProps = ComponentProps<'div'> & { borderX?: boolean }

export function GridSeparator({ className, borderX = false, ref, ...props }: GridSeparatorProps) {
	const elementRef = useRef<HTMLDivElement>(null)
	const isInView = useInView(elementRef, { once: true, amount: 0.2 })
	const composedRef = useComposedRefs(elementRef, ref)

	return (
		<div
			aria-hidden="true"
			{...props}
			ref={composedRef}
			data-slot="grid-separator"
			data-in-view={isInView}
			className={cn('stripe-divider h-12 w-full my-4', borderX ? 'border-x' : 'border-x-0', className)}
		/>
	)
}
