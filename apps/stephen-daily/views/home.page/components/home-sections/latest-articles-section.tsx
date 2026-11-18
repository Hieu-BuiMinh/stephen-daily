import { BlogPostCard, SectionHeaderSecondary } from '@repo/stephen-ui/daily-components'
import Image from 'next/image'
import { APP_CONFIG } from '@/constants/app-config'

const posts = [
	{
		title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
		subtitle:
			'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
		href: '/blog/lorem-ipsum',
		date: '2026-11-13',
		dateLabel: 'Nov 13, 2026',
		views: 1280,
		likes: 42,
		imageSrc: '/assets/images/fallback/01.png',
	},
	{
		title: 'Ut enim ad minim veniam, quis nostrud exercitation',
		subtitle:
			'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		href: '/blog/ut-enim-ad-minim',
		date: '2026-11-12',
		dateLabel: 'Nov 12, 2026',
		views: 864,
		likes: 28,
		imageSrc: '/assets/images/fallback/01.png',
	},
	{
		title: 'Quis autem vel eum iure reprehenderit qui in ea voluptate',
		subtitle:
			'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident. Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
		href: '/blog/quis-autem',
		date: '2026-11-11',
		dateLabel: 'Nov 11, 2026',
		views: 642,
		likes: 19,
		imageSrc: '/assets/images/fallback/01.png',
	},
	{
		title: 'Nam libero tempore, cum soluta nobis est eligendi',
		subtitle:
			'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
		href: '/blog/nam-libero-tempore',
		date: '2026-11-10',
		dateLabel: 'Nov 10, 2026',
		views: 510,
		likes: 16,
		imageSrc: '/assets/images/fallback/01.png',
	},
]

function LatestArticlesSection() {
	return (
		<section aria-labelledby="latest-articles-title">
			<SectionHeaderSecondary
				titleId="latest-articles-title"
				title="Latest articles"
				subtitle="Recent stories and notes on design, technology, and everyday discoveries."
				actions={
					<a href="/blog" className="text-xs text-brand-text">
						Explore articles →
					</a>
				}
			/>
			<ul className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-3 sm:p-4">
				{posts.map(({ imageSrc, ...post }, index) => (
					<li key={post.href} className={index === 0 ? 'min-w-0 sm:col-span-3' : 'min-w-0'}>
						<BlogPostCard
							{...post}
							author={{
								name: APP_CONFIG.author.name,
								href: `https://github.com/${APP_CONFIG.author.githubUserName}`,
								avatar: (
									<Image
										src="/assets/images/hero/01.png"
										alt=""
										width={24}
										height={24}
										className="object-top"
									/>
								),
							}}
							orientation={index === 0 ? 'horizontal' : 'vertical'}
							imageSrc={imageSrc}
						/>
					</li>
				))}
			</ul>
		</section>
	)
}

export default LatestArticlesSection
