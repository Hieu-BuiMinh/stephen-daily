'use client'

import type { ComponentProps } from 'react'
import { Checkbox } from '@repo/stephen-ui/base/checkbox'
import { cn } from '@repo/stephen-utils'

export type DailyCheckboxProps = ComponentProps<typeof Checkbox>

export function DailyCheckbox({ className, ...props }: DailyCheckboxProps) {
	return (
		<Checkbox
			{...props}
			data-slot="daily-checkbox"
			className={cn(
				'rounded-none border-border bg-background shadow-none transition-colors duration-150 enabled:hover:border-brand focus-visible:border-brand focus-visible:ring-brand/25 data-[state=checked]:border-brand data-[state=checked]:bg-brand data-[state=checked]:text-brand-foreground data-[state=indeterminate]:border-brand data-[state=indeterminate]:bg-brand data-[state=indeterminate]:text-brand-foreground dark:bg-background dark:data-[state=checked]:bg-brand [&_svg]:size-2.5',
				className
			)}
		/>
	)
}
