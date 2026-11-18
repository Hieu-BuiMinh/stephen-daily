import assert from 'node:assert/strict'
import test from 'node:test'
import { getPostHref, getPublishedPosts, getTopicPost, topicCollections } from '../views/topics/data.ts'

function entry(id, createdAt, published = true, type = 'post') {
	return {
		collection: 'dev',
		type,
		post: { id, createdAt, published },
	}
}

test('latest posts are published, filtered by type, and sorted before taking the first four', () => {
	const posts = [
		entry('old', '2026-01-01'),
		entry('draft', '2026-12-01', false),
		entry('no-date', undefined),
		entry('middle', '2026-06-01'),
		entry('recent', '2026-10-01'),
		entry('newest', '2026-11-01'),
		entry('short', '2026-11-02', true, 'short'),
	]
	assert.deepEqual(
		getPublishedPosts([{ posts }], 'post')
			.slice(0, 4)
			.map(({ post }) => post.id),
		['newest', 'recent', 'middle', 'old']
	)
	assert.equal(getPublishedPosts([{ posts }], 'post').at(-1).post.id, 'no-date')
	assert.deepEqual(
		getPublishedPosts([{ posts }], 'short').map(({ post }) => post.id),
		['short']
	)
	assert.equal(getPublishedPosts([{ posts }]).length, 6)
	assert.equal(posts[0].post.id, 'old')
})

test('detail lookup validates collection, type, ID and publication together', () => {
	const collection = topicCollections.find(({ slug }) => slug === 'dev')
	const published = entry('route-test-published', '2026-11-18')
	const draft = entry('route-test-draft', '2026-11-18', false)
	collection.posts.push(published, draft)
	try {
		assert.equal(getTopicPost({ collection: 'dev', type: 'post', id: published.post.id }), published)
		assert.equal(getTopicPost({ collection: 'dev', type: 'short', id: published.post.id }), undefined)
		assert.equal(getTopicPost({ collection: 'books', type: 'post', id: published.post.id }), undefined)
		assert.equal(getTopicPost({ collection: 'missing', type: 'post', id: published.post.id }), undefined)
		assert.equal(getTopicPost({ collection: 'dev', type: 'post', id: draft.post.id }), undefined)
		assert.equal(getTopicPost({ collection: 'dev', type: 'post', id: 'missing' }), undefined)
	} finally {
		collection.posts.splice(collection.posts.indexOf(published), 2)
	}
})

test('post links use frontmatter IDs and encode them as a single URL segment', () => {
	assert.equal(getPostHref(entry('a/b c', '2026-11-18')), '/topics/dev/post/a%2Fb%20c')
})

test('every generated entry belongs to a configured topic and type', () => {
	assert.equal(topicCollections.length, 6)
	for (const collection of topicCollections) {
		for (const post of collection.posts) {
			assert.equal(post.collection, collection.slug)
			assert.ok(collection.groups.some(({ slug }) => slug === post.type))
		}
	}
})
