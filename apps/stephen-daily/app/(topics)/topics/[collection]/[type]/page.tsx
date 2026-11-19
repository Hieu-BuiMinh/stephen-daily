import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { topicCollections } from '@/views/topics.page/data'
import { TypePageView } from '@/views/topics.page/pages/type.page'

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
	return <TypePageView topic={topic} group={group} />
}
