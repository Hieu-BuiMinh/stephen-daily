import type { PropsWithChildren } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostHref, getTopicPost } from '@/views/topics.page/data'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ collection: string; type: string; id: string }>
}): Promise<Metadata> {
	const entry = getTopicPost(await params)
	if (!entry) notFound()
	const { post } = entry
	return {
		title: `${post.title} | Stephen Daily`,
		description: post.description,
		alternates: { canonical: getPostHref(entry) },
		openGraph: {
			type: 'article',
			title: post.title,
			description: post.description,
			publishedTime: post.createdAt,
			authors: [post.author.name],
			...(post.cover && { images: [{ url: post.cover, alt: post.title }] }),
		},
	}
}

export default function PostLayout({ children }: PropsWithChildren) {
	return children
}
