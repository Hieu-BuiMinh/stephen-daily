'use client'

import { useState, type PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@repo/stephen-utils/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function ReactQueryProvider({ children }: PropsWithChildren) {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export default ReactQueryProvider
