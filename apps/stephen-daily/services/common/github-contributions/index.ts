import { commonRequest } from '@repo/stephen-utils/axios'
import type { GitHubContributionsRequest } from './github-contributions-req.dto'
import type { GitHubContributionsResponse } from './github-contributions-res.dto'

export const githubContributionsService = {
	getContributions: {
		key: (params: GitHubContributionsRequest) =>
			['common', 'github_contributions', 'get_contributions', params] as const,
		get: async ({ username, year }: GitHubContributionsRequest, options?: { signal?: AbortSignal }) => {
			const response = await commonRequest.get<GitHubContributionsResponse>(
				`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`,
				{ params: { y: year ?? 'last' }, signal: options?.signal }
			)
			return response.data
		},
	},
}
