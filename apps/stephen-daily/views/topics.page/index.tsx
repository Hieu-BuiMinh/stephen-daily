import Link from 'next/link'
import { GridSeparator } from '@repo/stephen-ui/daily-components'
import { TopicPageHeader } from '@/views/topics.page/components/topic-page-header'
import { getPublishedPosts, topicCollections } from './data'

export const topicsDescription = 'Engineering articles, reading notes, and personal stories.'

export function TopicsPageView() {
	return (
		<>
			<TopicPageHeader title="Topics" description={topicsDescription} />
			<GridSeparator className="h-12 m-0" />
			<ul className="grid divide-y sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
				{topicCollections.map((collection) => (
					<li key={collection.slug} className="border-border p-6 sm:border-r sm:border-b">
						<h2 className="font-playfair text-2xl font-bold">
							<Link href={`/topics/${collection.slug}`} className="hover:text-brand-text">
								{collection.title}
							</Link>
						</h2>
						<p className="mt-3 text-sm text-muted-foreground">{collection.description}</p>
						<p className="mt-5 font-mono text-xs text-brand-text">
							{getPublishedPosts([collection]).length} published posts
						</p>
					</li>
				))}
			</ul>
		</>
	)
}
