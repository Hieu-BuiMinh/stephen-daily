import type { Metadata } from 'next'
import { TopicsPageView, topicsDescription } from '@/views/topics.page'

export const metadata: Metadata = {
	title: 'Topics | Stephen Daily',
	description: topicsDescription,
}

export default function TopicsPage() {
	return <TopicsPageView />
}
