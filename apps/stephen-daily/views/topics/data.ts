import { bookRecap, devPost, docPost, projectPost, retroPost, shortWriting } from 'stephen-contents'
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
	{
		slug: 'doc',
		title: 'Documentation',
		description: 'Guides and references from my work.',
		groups: [{ slug: 'doc', title: 'Guides' }],
		posts: docPost.map((post) => ({ collection: 'doc', type: 'doc', post })),
	},
	{
		slug: 'projects',
		title: 'Projects',
		description: 'Selected work, experiments, and things I have built.',
		groups: [{ slug: 'project', title: 'Selected work' }],
		posts: projectPost.map((post) => ({ collection: 'projects', type: 'project', post })),
	},
	{
		slug: 'retro',
		title: 'Retrospectives',
		description: 'Milestones and reflections on the journey.',
		groups: [
			{ slug: 'milestone', title: 'Milestones' },
			{ slug: 'recap', title: 'Recaps' },
		],
		posts: retroPost.map((post) => ({ collection: 'retro', type: post.retroType.toLowerCase(), post })),
	},
]

export function getPublishedPosts(collections: TopicCollection[], type?: string): TopicPost[] {
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
	return `/topics/${collection}/${type}/${encodeURIComponent(post.id)}`
}

export function formatPostDate(date: string) {
	return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date))
}
