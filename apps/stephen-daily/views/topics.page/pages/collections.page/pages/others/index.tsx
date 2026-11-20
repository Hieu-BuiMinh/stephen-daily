import Link from 'next/link'
import { TopicPageHeader } from '@/views/topics.page/components/topic-page-header'
import type { TopicCollection } from '@/views/topics.page/data'
import { CollectionPostGroups } from '@/views/topics.page/pages/collections.page'

export function OthersCollectionPageView({ topic }: { topic: TopicCollection }) {
	return (
		<>
			<TopicPageHeader
				title={topic.title}
				description={topic.description}
				image={{ src: '/assets/images/hero/jim-rohn.png', alt: 'Jim Rohn' }}
				actions={
					<Link href="/topics" className="text-sm text-brand-text">
						All topics →
					</Link>
				}
			/>
			<CollectionPostGroups topic={topic} />
		</>
	)
}
