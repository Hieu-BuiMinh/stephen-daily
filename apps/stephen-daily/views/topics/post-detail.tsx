import { Button } from '@repo/stephen-ui/base/button'
import { DailyBaseImage, MDXContent } from '@repo/stephen-ui/daily-components'
import { DetailHeader } from './components/detail-header'
import type { TopicPost } from './data'
import { TableOfContents } from '@/views/topics/components/table-of-contents'

export function PostDetail({ entry }: { entry: TopicPost }) {
	return (
		<article className="min-w-0">
			<DetailHeader
				title={entry.post.title}
				description={entry.post.description}
				cover={entry.post.cover}
				createdAt={entry.post.createdAt}
			/>
			<div className="grid grid-cols-1 lg:grid-cols-12 p-4">
				<div className="flex min-w-0 flex-col gap-4 lg:col-span-9 mr-4">
					{entry.post.cover && (
						<div className="relative aspect-8/5 w-full overflow-hidden bg-muted">
							<DailyBaseImage
								src={entry.post.cover}
								alt={entry.post.title}
								fill
								unoptimized
								preview
								sizes="(min-width: 1280px) 960px, (min-width: 1024px) 75vw, 100vw"
								className="object-cover"
							/>
						</div>
					)}
					<div
						data-mdx-body
						className="prose prose-sm prose-stone min-w-0 max-w-none prose-headings:scroll-mt-[calc(var(--navbar-height)+2rem)] prose-headings:font-playfair prose-a:text-brand-text prose-table:block prose-table:overflow-x-auto dark:prose-invert"
					>
						<MDXContent code={entry.post.body} components={{ Button }} />
					</div>
				</div>
				<TableOfContents items={entry.post.toc} audio={entry.post.audio} />
			</div>
		</article>
	)
}
