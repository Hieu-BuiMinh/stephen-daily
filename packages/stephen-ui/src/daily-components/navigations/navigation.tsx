'use client'

import type { ComponentProps, ReactNode } from 'react'
import { NavigationMenu, NavigationMenuList } from '@repo/stephen-ui/base/navigation-menu'

export type DailyNavigationProps = { children: ReactNode } & Pick<
	ComponentProps<typeof NavigationMenu>,
	'value' | 'onValueChange'
>

export function DailyNavigation({ children, ...props }: DailyNavigationProps) {
	return (
		<NavigationMenu
			{...props}
			aria-label="Main navigation"
			delayDuration={150}
			className="w-full min-w-0 max-w-none flex-col items-stretch font-playfair text-sm font-semibold sm:text-base"
			viewportProps={{
				containerClassName: 'relative top-auto left-auto z-auto w-full',
				className: 'mt-0 w-full rounded-none border-0 bg-transparent shadow-none animate-none! md:w-full',
			}}
		>
			<NavigationMenuList className="grid w-full grid-cols-2 gap-0 sm:grid-cols-4">{children}</NavigationMenuList>
		</NavigationMenu>
	)
}
