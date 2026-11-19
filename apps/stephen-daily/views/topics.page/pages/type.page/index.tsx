import Link from 'next/link'
import { GridSeparator } from '@repo/stephen-ui/daily-components'
import { TopicPageHeader } from '@/views/topics.page/components/topic-page-header'
import { PostList } from '../../components/post-list'
import { getPublishedPosts, type TopicCollection } from '../../data'

export function TypePageView({ topic, group }: { topic: TopicCollection; group: TopicCollection['groups'][number] }) {
	return (
		<>
			<TopicPageHeader
				title={group.title}
				description={topic.description}
				actions={
					<Link href={`/topics/${topic.slug}`} className="text-sm text-brand-text">
						{topic.title} →
					</Link>
				}
			/>
			<GridSeparator className="h-12 m-0" />
			<PostList posts={getPublishedPosts([topic], group.slug)} />
		</>
	)
}
