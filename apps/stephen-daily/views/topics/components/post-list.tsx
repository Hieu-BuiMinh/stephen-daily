import Link from 'next/link'
import { BlogPostCardHeader, DailyBaseImage } from '@repo/stephen-ui/daily-components'
import { formatPostDate, getPostHref, type TopicPost } from '../data'

export function PostList({ posts }: { posts: TopicPost[] }) {
	if (posts.length === 0) {
		return <p className="px-4 py-10 text-sm text-muted-foreground">No published posts yet.</p>
	}

	return (
		<ul className="grid grid-cols-1 divide-y border-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
			{posts.map((entry) => (
				<li key={getPostHref(entry)} className="min-w-0 border-border sm:border-r sm:border-b">
					<article className="paper-texture-card flex h-full flex-col gap-4 p-4 sm:p-6">
						{entry.post.cover && (
							<DailyBaseImage
								src={entry.post.cover}
								alt=""
								width={960}
								height={640}
								unoptimized
								preview={false}
								className="aspect-3/2 w-full object-cover"
							/>
						)}
						<BlogPostCardHeader
							headingAs="h3"
							title={
								<Link
									href={getPostHref(entry)}
									className="hover:text-brand-text focus-visible:underline"
								>
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
			))}
		</ul>
	)
}
