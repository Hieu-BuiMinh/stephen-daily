import Link from 'next/link'
import { GridSeparator } from '@repo/stephen-ui/daily-components'
import { TopicPageHeader } from '@/views/topics.page/components/topic-page-header'
import { PostList } from '@/views/topics.page/components/post-list'
import { getPublishedPosts } from '@/views/topics.page/data'
import type { TypePageViewProps } from '@/views/topics.page/pages/type.page'

const buddhismVerses = [
	{
		title: 'Do good',
		verse: 183,
		text: 'To avoid all evil, to cultivate wholesome qualities, and to cleanse one’s mind—this is the teaching of the Buddhas.',
		source: 'https://www.buddhistnuns.org/dhammapada-the-hand-book-of-the-wise/',
	},
	{
		title: 'Impermanence',
		verse: 277,
		text: '‘All conditioned things are impermanent.’ When one sees this with insight (pannā) one becomes weary of suffering. This is the Way to Purity.',
		source: 'https://dhammapada.at/chapter/20/verse/5',
	},
	{
		title: 'Non-hatred',
		verse: 5,
		text: 'Hatred is never appeased by hatred in this world. By non-hatred alone is hatred appeased. This is a law eternal.',
		source: 'https://www.accesstoinsight.org/tipitaka/kn/dhp/dhp.01.budd.html',
	},
]

const buddhismSubTexts = buddhismVerses.map(({ title, verse, text, source }) => ({
	value: (
		<p className="font-sans text-muted-foreground">
			<strong className="mb-1 block text-left text-base text-foreground">{title}</strong>
			<q cite={source}>{text}</q>
			<a href={source} className="mt-2 block text-left text-xs text-brand-text underline">
				Dhammapada {verse}
			</a>
		</p>
	),
}))

export function BuddhismPageView({ topic, group }: TypePageViewProps) {
	return (
		<>
			<TopicPageHeader
				title={group.title}
				description="Notes on bringing Buddhist practice into everyday life."
				image={{ src: '/assets/images/hero/buddha.png', alt: 'Buddha' }}
				subTexts={buddhismSubTexts}
				actions={
					<Link href="/topics" className="text-sm text-brand-text">
						All topics →
					</Link>
				}
			/>
			<GridSeparator className="h-12 m-0" />
			<PostList posts={getPublishedPosts([topic], group.slug)} />
		</>
	)
}
