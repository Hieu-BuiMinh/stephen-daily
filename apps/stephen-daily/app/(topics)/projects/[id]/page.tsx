import { notFound } from 'next/navigation'
import { getPublishedPosts, projectPosts } from '@/views/topics.page/data'
import { PostDetail } from '@/views/topics.page/pages/post-detail.page'

type Props = { params: Promise<{ id: string }> }

export function generateStaticParams() {
	return getPublishedPosts([{ posts: projectPosts }]).map(({ post }) => ({ id: post.id }))
}

export default async function ProjectPage({ params }: Props) {
	const { id } = await params
	const entry = projectPosts.find(({ post }) => post.id === id && post.published)
	if (!entry) notFound()

	return <PostDetail entry={entry} />
}
