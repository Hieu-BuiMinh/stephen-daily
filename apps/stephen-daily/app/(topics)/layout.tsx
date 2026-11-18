import type { PropsWithChildren } from 'react'
import { connection } from 'next/server'
import PageLayout from '@/components/layouts/page-layout'
import PageViewContainer from '@/components/containers/page-view-container'

export default async function TopicsLayout({ children }: PropsWithChildren) {
	await connection()
	return (
		<PageLayout editionDate={new Date().toISOString()}>
			<PageViewContainer>
				<main>{children}</main>
			</PageViewContainer>
		</PageLayout>
	)
}
