'use client'

import { Button } from '@repo/stephen-ui/base/button'
import { cn } from '@repo/stephen-utils'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ModeToggle({ className }: { className?: string }) {
	const { setTheme, resolvedTheme } = useTheme()

	const toggleTheme = () => {
		const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

		if (!document.startViewTransition) {
			setTheme(newTheme)
			return
		}

		document.startViewTransition(() => {
			// Update the class synchronously so the transition captures the new theme.
			document.documentElement.classList.toggle('dark', newTheme === 'dark')
			setTheme(newTheme)
		})
	}

	return (
		<Button
			type="button"
			onClick={toggleTheme}
			className={cn('relative', className)}
			variant="link"
			size="icon"
			aria-label="Toggle color theme"
		>
			<Sun aria-hidden="true" className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon
				aria-hidden="true"
				className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
		</Button>
	)
}
