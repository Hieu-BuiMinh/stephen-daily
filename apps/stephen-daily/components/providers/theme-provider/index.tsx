'use client'

import type { PropsWithChildren } from 'react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

function ThemeProvider({ children }: PropsWithChildren) {
	return (
		<NextThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
			// Run the bootstrap during SSR; client-created scripts are inert and trigger a React warning.
			scriptProps={{ type: typeof window === 'undefined' ? undefined : 'text/plain' }}
		>
			{children}
		</NextThemeProvider>
	)
}

export default ThemeProvider
