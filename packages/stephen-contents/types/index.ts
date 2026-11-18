import type { BOOKS_POST_TYPE, DEV_POST_TYPE, OTHERS_POST_TYPE } from './post'

export * from './articles'
export * from './post'
export type { MDXComponents } from 'mdx/types'
export type {
	BookRecap,
	DevBlogPost,
	DocBlogPost,
	ProjectPost,
	retroPost as RetroPost,
	shortWriting as ShortWriting,
} from '../.velite/index.js'

export interface Metadata {
	wordCount: number
	readingTime: number
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}

export type Body = string

export interface Author {
	avatar: string
	name: string
	github: string
}

export interface TocItem {
	title: string
	url: string
	items: TocItem[]
}

export type TPost = {
	id: string
	slug: string
	title: string
	createdAt: string
	updatedAt?: string
	milestone?: string
	relatedPostUrl?: string
	cover?: string
	audio?: string | null
	metadata?: Metadata
	description?: string
	published: boolean
	hashTags?: string[]
	type: DEV_POST_TYPE | BOOKS_POST_TYPE | OTHERS_POST_TYPE
	retroType?: 'MILESTONE' | 'RECAP'
	body: Body
	author: Author
	toc: TocItem[]
	links?: {
		repoUrl?: string
		demoUrl?: string
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}
