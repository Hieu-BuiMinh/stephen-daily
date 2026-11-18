import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SectionHeaderSecondary } from '@repo/stephen-ui/daily-components'
import { topicCollections, getPublishedPosts } from '@/views/topics/data'
import { PostList } from '@/views/topics/components/post-list'

type Props = { params: Promise<{ collection: string; type: string }> }

export function generateStaticParams() {
	return topicCollections.flatMap((collection) =>
		collection.groups.map((group) => ({ collection: collection.slug, type: group.slug }))
	)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { collection, type } = await params
	const topic = topicCollections.find((topic) => topic.slug === collection)
	const group = topic?.groups.find((group) => group.slug === type)
	if (!topic || !group) notFound()
	return { title: `${group.title} · ${topic.title} | Stephen Daily`, description: topic.description }
}

export default async function TypePage({ params }: Props) {
	const { collection, type } = await params
	const topic = topicCollections.find((topic) => topic.slug === collection)
	const group = topic?.groups.find((group) => group.slug === type)
	if (!topic || !group) notFound()

	return (
		<>
			<SectionHeaderSecondary
				headingAs="h1"
				title={group.title}
				subtitle={topic.description}
				actions={
					<Link href={`/topics/${topic.slug}`} className="text-sm text-brand-text">
						{topic.title} →
					</Link>
				}
			/>
			<PostList posts={getPublishedPosts([topic], type)} />
		</>
	)
}
