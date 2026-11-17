'use client'

import type { ComponentProps } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@repo/stephen-ui/base/dialog'
import { cn } from '@repo/stephen-utils'

export {
	Dialog as DailyModal,
	DialogClose as DailyModalClose,
	DialogTrigger as DailyModalTrigger,
} from '@repo/stephen-ui/base/dialog'

export type DailyModalContentProps = ComponentProps<typeof DialogContent>

export function DailyModalContent({ className, ...props }: DailyModalContentProps) {
	return (
		<DialogContent
			{...props}
			data-slot="daily-modal-content"
			className={cn(
				'max-h-[calc(100svh-2rem)] gap-0 overflow-y-auto rounded-none border-border bg-background p-0 text-foreground shadow-xl *:data-[slot=dialog-close]:rounded-none *:data-[slot=dialog-close]:border *:data-[slot=dialog-close]:border-border *:data-[slot=dialog-close]:p-1 *:data-[slot=dialog-close]:opacity-100 *:data-[slot=dialog-close]:transition-colors *:data-[slot=dialog-close]:hover:border-brand *:data-[slot=dialog-close]:hover:text-brand *:data-[slot=dialog-close]:focus:ring-brand',
				className
			)}
		/>
	)
}

export function DailyModalHeader({ className, ...props }: ComponentProps<typeof DialogHeader>) {
	return (
		<DialogHeader
			{...props}
			data-slot="daily-modal-header"
			className={cn('gap-2 border-b border-border px-5 py-4 pr-14 text-left', className)}
		/>
	)
}

export function DailyModalTitle({ className, ...props }: ComponentProps<typeof DialogTitle>) {
	return (
		<DialogTitle
			{...props}
			data-slot="daily-modal-title"
			className={cn('font-playfair text-2xl leading-tight font-bold tracking-tight', className)}
		/>
	)
}

export function DailyModalDescription({ className, ...props }: ComponentProps<typeof DialogDescription>) {
	return (
		<DialogDescription
			{...props}
			data-slot="daily-modal-description"
			className={cn('font-serif text-sm leading-relaxed text-muted-foreground', className)}
		/>
	)
}

export function DailyModalBody({ className, ...props }: ComponentProps<'div'>) {
	return <div {...props} data-slot="daily-modal-body" className={cn('min-w-0 px-5 py-5', className)} />
}

export function DailyModalFooter({ className, ...props }: ComponentProps<typeof DialogFooter>) {
	return (
		<DialogFooter
			{...props}
			data-slot="daily-modal-footer"
			className={cn('gap-3 border-t border-border px-5 py-3', className)}
		/>
	)
}
