import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { topicCollections } from '@/views/topics.page/data'
import { CollectionPageView } from '@/views/topics.page/pages/collections.page'

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
	return <CollectionPageView topic={topic} />
}
