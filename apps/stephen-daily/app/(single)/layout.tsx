import PageLayout from '@/components/layouts/page-layout'
import { connection } from 'next/server'
import type { PropsWithChildren } from 'react'

async function AppNewsLayout({ children }: PropsWithChildren) {
	await connection()

	return <PageLayout editionDate={new Date().toISOString()}>{children}</PageLayout>
}

export default AppNewsLayout
