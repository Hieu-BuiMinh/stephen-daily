'use client'

import { Copy } from 'lucide-react'
import { DailyButton, type DailyButtonProps } from '..'

export type CopyButtonProps = Omit<DailyButtonProps, 'onAction' | 'onCopy' | 'asChild'> & {
	value: string
	onCopy?: (value: string) => void
}

export function CopyButton({
	value,
	onCopy,
	children = 'Copy',
	successLabel = 'Copied',
	errorLabel = 'Failed',
	resetAfter = 2000,
	icon = <Copy />,
	...props
}: CopyButtonProps) {
	return (
		<DailyButton
			{...props}
			icon={icon}
			successLabel={successLabel}
			errorLabel={errorLabel}
			resetAfter={resetAfter}
			onAction={async () => {
				await navigator.clipboard.writeText(value)
				onCopy?.(value)
			}}
		>
			{children}
		</DailyButton>
	)
}
