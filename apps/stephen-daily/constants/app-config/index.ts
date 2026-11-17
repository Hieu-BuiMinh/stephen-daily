import type { TAppConfig } from '@/dto/types/app-config'

export const APP_CONFIG = {
	version: '0.0.1',
	site: {
		name: 'Stephen Daily',
		description: 'Stephen Daily',
		locale: 'en',
	},
	seo: {
		title: 'Stephen Daily',
		description: 'Stephen Daily',
	},
	socials: [],
	author: {
		// avatar: '/assets/images/avt/me_12.png',
		name: 'Stephen Ming',
		resume: 'https://hieu-buiminh-resume.io.vn/',
		githubUserName: 'Hieu-BuiMinh',
		twitterUserName: 'Stephen_b591',
		linkedinUserName: 'minh-hieu-78a315208',
	},
} satisfies TAppConfig
