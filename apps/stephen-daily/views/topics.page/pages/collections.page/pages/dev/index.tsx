import Link from 'next/link'
import { TopicPageHeader } from '@/views/topics.page/components/topic-page-header'
import type { TopicCollection } from '@/views/topics.page/data'
import { CollectionPostGroups } from '@/views/topics.page/pages/collections.page'

const steveJobsSubTexts = [
	{
		title: 'Follow your curiosity',
		text: 'A calligraphy class seemed unrelated to computers. Years later, what Jobs learned there helped shape the typography of the first Macintosh.',
	},
	{
		title: 'Start over',
		text: 'After losing his job at Apple, Jobs went back to building. He described starting over as a chance to take creative risks again.',
	},
	{
		title: 'Choose what matters',
		text: 'Knowing that time is limited helped Jobs take other people’s expectations less seriously and decide which work mattered enough to pursue.',
	},
].map(({ title, text }) => ({
	value: (
		<p className="font-sans text-muted-foreground">
			<strong className="mb-1 block text-left text-base text-foreground">{title}</strong>
			{text}
		</p>
	),
}))

export function DevCollectionPageView({ topic }: { topic: TopicCollection }) {
	return (
		<>
			<TopicPageHeader
				title={topic.title}
				description={topic.description}
				image={{ src: '/assets/images/hero/steve-jobs.png', alt: 'Steve Jobs' }}
				subTexts={steveJobsSubTexts}
				actions={
					<Link href="/topics" className="text-sm text-brand-text">
						All topics →
					</Link>
				}
			/>
			<CollectionPostGroups topic={topic} />
		</>
	)
}
