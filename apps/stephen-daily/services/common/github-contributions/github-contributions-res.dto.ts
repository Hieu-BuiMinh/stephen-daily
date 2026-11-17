export type GitHubActivity = {
	date: string
	count: number
	level: 0 | 1 | 2 | 3 | 4
}

export type GitHubContributionsResponse = {
	total: Record<string, number>
	contributions: GitHubActivity[]
}
