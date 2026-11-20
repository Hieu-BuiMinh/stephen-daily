import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { topicCollections } from '@/views/topics.page/data'
import { TypePageView } from '@/views/topics.page/pages/type.page'
import { BaZiPageView } from '@/views/topics.page/pages/collections.page/pages/others/pages/ba-zi'
import { IChingPageView } from '@/views/topics.page/pages/collections.page/pages/others/pages/i-ching'
import { BuddhismPageView } from '@/views/topics.page/pages/collections.page/pages/others/pages/buddhism'
import { StoriesPageView } from '@/views/topics.page/pages/collections.page/pages/others/pages/single'
import { JournalingPageView } from '@/views/topics.page/pages/collections.page/pages/others/pages/journaling'
import { InnerCompassPageView } from '@/views/topics.page/pages/collections.page/pages/others/pages/inner-compass'
import { YearRecapPageView } from '@/views/topics.page/pages/collections.page/pages/others/pages/year-recap'

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

	if (collection === 'others') {
		switch (type) {
			case 'ba-zi':
				return <BaZiPageView topic={topic} group={group} />
			case 'i-ching':
				return <IChingPageView topic={topic} group={group} />
			case 'buddhism':
				return <BuddhismPageView topic={topic} group={group} />
			case 'single':
				return <StoriesPageView topic={topic} group={group} />
			case 'journaling':
				return <JournalingPageView topic={topic} group={group} />
			case 'inner-compass':
				return <InnerCompassPageView topic={topic} group={group} />
			case 'year-recap':
				return <YearRecapPageView topic={topic} group={group} />
		}
	}

	return <TypePageView topic={topic} group={group} />
}
