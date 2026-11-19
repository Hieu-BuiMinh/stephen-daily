import { notFound } from 'next/navigation'
import { getPublishedPosts, getTopicPost, topicCollections } from '@/views/topics.page/data'
import { PostDetail } from '@/views/topics.page/pages/post-detail.page'

type Props = { params: Promise<{ collection: string; type: string; id: string }> }

export function generateStaticParams() {
	return getPublishedPosts(topicCollections).map(({ collection, type, post }) => ({ collection, type, id: post.id }))
}

export default async function PostPage({ params }: Props) {
	const entry = getTopicPost(await params)

	if (!entry) notFound()

	return <PostDetail entry={entry} />
}
