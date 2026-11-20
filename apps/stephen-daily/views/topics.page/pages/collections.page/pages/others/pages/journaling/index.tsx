import Link from 'next/link'
import { GridSeparator } from '@repo/stephen-ui/daily-components'
import { TopicPageHeader } from '@/views/topics.page/components/topic-page-header'
import { PostList } from '@/views/topics.page/components/post-list'
import { getPublishedPosts } from '@/views/topics.page/data'
import type { TypePageViewProps } from '@/views/topics.page/pages/type.page'

export function JournalingPageView({ topic, group }: TypePageViewProps) {
	return (
		<>
			<TopicPageHeader
				title={group.title}
				description={topic.description}
				image={{ src: '/assets/images/hero/jim-rohn.png', alt: 'Jim Rohn' }}
				actions={
					<Link href="/topics" className="text-sm text-brand-text">
						All topics →
					</Link>
				}
			/>
			<GridSeparator className="h-12 m-0" />
			<PostList posts={getPublishedPosts([topic], group.slug)} />
		</>
	)
}
