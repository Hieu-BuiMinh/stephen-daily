/* eslint-disable import-x/no-named-as-default */
import GitHubContributions from '@/components/github-contributions'
import { GridRow, SectionHeaderPrimary } from '@repo/stephen-ui/daily-components'

function GithubContributionSection() {
	return (
		<GridRow className="px-4 py-6">
			<SectionHeaderPrimary
				eyebrow="Behind the code"
				title={
					<>
						One commit <span className="text-brand">at a time.</span>
					</>
				}
				subtitle="My commit history across the months and years."
				actions={<span className="font-mono text-xs">Day by day. Year by year.</span>}
			/>
			<GitHubContributions />
		</GridRow>
	)
}

export default GithubContributionSection
