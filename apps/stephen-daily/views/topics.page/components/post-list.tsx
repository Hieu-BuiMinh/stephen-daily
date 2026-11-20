import Link from 'next/link'
import { BlogPostCardHeader, DailyBaseImage } from '@repo/stephen-ui/daily-components'
import { formatPostDate, getPostHref, type TopicPost } from '@/views/topics.page/data'

export function PostList({ posts }: { posts: TopicPost[] }) {
	if (posts.length === 0) {
		return <p className="px-4 py-10 text-sm text-muted-foreground">No published posts yet.</p>
	}

	return (
		<ul className="mx-2 my-3 grid grid-cols-1 gap-4 px-2 pt-3 pb-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
			{posts.map((entry) => {
				const href = getPostHref(entry)

				return (
					<li key={href} className="min-w-0">
						<article className="recessed-panel post-card-surface relative flex h-full flex-col gap-4 overflow-hidden p-4 sm:p-5">
							{entry.post.cover && (
								<div className="post-card-cover aspect-3/2">
									<DailyBaseImage
										src={entry.post.cover}
										alt=""
										fill
										unoptimized
										preview={false}
										className="object-cover"
									/>
								</div>
							)}
							<BlogPostCardHeader
								headingAs="h3"
								titleClassName="font-sans"
								subtitleClassName="text-muted-foreground"
								title={
									<Link href={href} className="post-card-link">
										{entry.post.title}
									</Link>
								}
								subtitle={entry.post.description}
							/>
							<div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 border-t pt-3 text-xs text-muted-foreground">
								<span>{entry.post.author.name}</span>
								{entry.post.createdAt && (
									<time dateTime={entry.post.createdAt}>{formatPostDate(entry.post.createdAt)}</time>
								)}
								<span>{entry.post.metadata.readingTime} min read</span>
							</div>
						</article>
					</li>
				)
			})}
		</ul>
	)
}
