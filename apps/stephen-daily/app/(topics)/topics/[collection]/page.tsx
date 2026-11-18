import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SectionHeaderSecondary } from '@repo/stephen-ui/daily-components'
import { topicCollections, getPublishedPosts } from '@/views/topics/data'
import { PostList } from '@/views/topics/components/post-list'

type Props = { params: Promise<{ collection: string }> }

export function generateStaticParams() {
	return topicCollections.map((collection) => ({ collection: collection.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { collection } = await params
	const topic = topicCollections.find((topic) => topic.slug === collection)
	if (!topic) notFound()
	return { title: `${topic.title} | Stephen Daily`, description: topic.description }
}

export default async function CollectionPage({ params }: Props) {
	const { collection } = await params
	const topic = topicCollections.find((topic) => topic.slug === collection)
	if (!topic) notFound()

	return (
		<>
			<SectionHeaderSecondary
				headingAs="h1"
				title={topic.title}
				subtitle={topic.description}
				actions={
					<Link href="/topics" className="text-sm text-brand-text">
						All topics →
					</Link>
				}
			/>
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
