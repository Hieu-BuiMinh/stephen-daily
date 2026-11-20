import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { topicCollections } from '@/views/topics.page/data'
import { BooksCollectionPageView } from '@/views/topics.page/pages/collections.page/pages/books'
import { DevCollectionPageView } from '@/views/topics.page/pages/collections.page/pages/dev'
import { OthersCollectionPageView } from '@/views/topics.page/pages/collections.page/pages/others'

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

	switch (collection) {
		case 'dev':
			return <DevCollectionPageView topic={topic} />
		case 'books':
			return <BooksCollectionPageView topic={topic} />
		case 'others':
			return <OthersCollectionPageView topic={topic} />
		default:
			notFound()
	}
}
