import type { Metadata } from 'next'

export type TAppAuthor = {
	name: string
	resume: string
	githubUserName: string
	twitterUserName: string
	linkedinUserName: string
	username?: string
	bio?: string
	avatar?: string
	email?: string
	location?: string
	website?: string
}

export type TAppSocialLink = {
	platform?: string
	label: string
	url: string
}

export type TAppConfig = {
	version: string
	site: {
		name: string
		description: string
		url?: string
		locale: string
	}
	seo: Metadata
	author?: TAppAuthor
	socials: TAppSocialLink[]
}
