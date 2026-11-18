import { SectionHeaderSecondary } from '@repo/stephen-ui/daily-components'
import Link from 'next/link'
import { getPublishedPosts, topicCollections } from '@/views/topics/data'
import { PostList } from '@/views/topics/components/post-list'

function LatestArticlesSection() {
	return (
		<section aria-labelledby="latest-articles-title">
			<SectionHeaderSecondary
				titleId="latest-articles-title"
				title="Latest articles"
				subtitle="Recent stories and notes on design, technology, and everyday discoveries."
				actions={
					<Link href="/topics" className="text-xs text-brand-text">
						Explore articles →
					</Link>
				}
			/>
			<PostList posts={getPublishedPosts(topicCollections).slice(0, 4)} />
		</section>
	)
}

export default LatestArticlesSection
