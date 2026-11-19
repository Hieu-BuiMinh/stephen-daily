import { bookRecap, devPost, projectPost, shortWriting } from 'stephen-contents'
import type { BookRecap, DevBlogPost, DocBlogPost, ProjectPost, RetroPost, ShortWriting } from 'stephen-contents/types'

export type ContentPost = BookRecap | DevBlogPost | DocBlogPost | ProjectPost | RetroPost | ShortWriting

export type TopicPost = {
	collection: string
	type: string
	post: ContentPost
}

export type TopicCollection = {
	slug: string
	title: string
	description: string
	groups: { slug: string; title: string }[]
	posts: TopicPost[]
}

export const topicCollections: TopicCollection[] = [
	{
		slug: 'dev',
		title: 'Engineering',
		description: 'Notes on building software and solving problems.',
		groups: [
			{ slug: 'post', title: 'Articles' },
			{ slug: 'short', title: 'Short notes' },
		],
		posts: devPost.map((post) => ({ collection: 'dev', type: post.type, post })),
	},
	{
		slug: 'books',
		title: 'Books',
		description: 'Reading notes and ideas to carry into everyday life.',
		groups: [
			{ slug: 'life-habits', title: 'Life & habits' },
			{ slug: 'productivity', title: 'Productivity' },
			{ slug: 'others', title: 'Other reading' },
		],
		posts: bookRecap.map((post) => ({ collection: 'books', type: post.type, post })),
	},
	{
		slug: 'others',
		title: 'Personal stories',
		description: 'Reflections, observations, and lessons along the way.',
		groups: [
			{ slug: 'ba-zi', title: 'Ba Zi' },
			{ slug: 'i-ching', title: 'I Ching' },
			{ slug: 'buddhism', title: 'Buddhism' },
			{ slug: 'single', title: 'Stories' },
			{ slug: 'journaling', title: 'Journaling' },
			{ slug: 'inner-compass', title: 'Inner compass' },
			{ slug: 'year-recap', title: 'Year in review' },
		],
		posts: shortWriting.map((post) => ({ collection: 'others', type: post.type, post })),
	},
]

export const projectPosts: TopicPost[] = projectPost.map((post) => ({
	collection: 'projects',
	type: 'project',
	post,
}))

export function getPublishedPosts(collections: Pick<TopicCollection, 'posts'>[], type?: string): TopicPost[] {
	return collections
		.flatMap((collection) => collection.posts)
		.filter((entry) => entry.post.published && (type === undefined || entry.type === type))
		.sort(
			(a, b) =>
				(b.post.createdAt ?? '').localeCompare(a.post.createdAt ?? '') || a.post.id.localeCompare(b.post.id)
		)
}

export function getTopicPost({ collection, type, id }: { collection: string; type: string; id: string }) {
	return topicCollections
		.find((topic) => topic.slug === collection)
		?.posts.find((entry) => entry.type === type && entry.post.id === id && entry.post.published)
}

export function getPostHref({ collection, type, post }: TopicPost) {
	if (collection === 'projects') return `/projects/${encodeURIComponent(post.id)}`
	return `/topics/${collection}/${type}/${encodeURIComponent(post.id)}`
}

export function formatPostDate(date: string) {
	return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date))
}
