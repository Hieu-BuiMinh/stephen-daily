'use client'

import type { PropsWithChildren } from 'react'
import ThemeProvider from '@/components/providers/theme-provider'
import ReactQueryProvider from '@/components/providers/react-query-provider'

function AppProvider({ children }: PropsWithChildren) {
	return (
		<ReactQueryProvider>
			<ThemeProvider>{children}</ThemeProvider>
		</ReactQueryProvider>
	)
}

export default AppProvider
