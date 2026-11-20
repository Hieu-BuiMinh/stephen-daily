import Link from 'next/link'
import { GridSeparator } from '@repo/stephen-ui/daily-components'
import { TopicPageHeader } from '@/views/topics.page/components/topic-page-header'
import { PostList } from '@/views/topics.page/components/post-list'
import { getPublishedPosts, type TopicCollection } from '@/views/topics.page/data'

export type TypePageViewProps = {
	topic: TopicCollection
	group: TopicCollection['groups'][number]
}

export function TypePageView({ topic, group }: TypePageViewProps) {
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
