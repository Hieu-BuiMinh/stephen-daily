import { GridSeparator, SectionHeaderSecondary } from '@repo/stephen-ui/daily-components'
import Link from 'next/link'
import { PostList } from '@/views/topics.page/components/post-list'
import { getPublishedPosts, type TopicCollection } from '@/views/topics.page/data'

export function CollectionPostGroups({ topic }: { topic: TopicCollection }) {
	return (
		<>
			<GridSeparator className="h-12 m-0" />
			{topic.groups.map((group) => (
				<section key={group.slug} aria-labelledby={`group-${group.slug}`} className="border-b">
					<SectionHeaderSecondary
						titleId={`group-${group.slug}`}
						title={group.title}
						actions={
							<Link href={`/topics/${topic.slug}/${group.slug}`} className="text-sm text-brand-text">
								View all →
							</Link>
						}
					/>
					<PostList posts={getPublishedPosts([topic], group.slug).slice(0, 4)} />
				</section>
			))}
		</>
	)
}
