'use client'

import { DailyCheckbox } from '@repo/stephen-ui/daily-components'
import { Label } from '@repo/stephen-ui/base/label'
import { Suspense, useId, useState } from 'react'
import { GitHubContributionFallback, GitHubContributionGraph } from './graph'

export type GitHubContributionsOption = { id: string; label: string }

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, index) => CURRENT_YEAR - 4 + index)
const options: GitHubContributionsOption[] = [
	...YEARS.map((year) => ({ id: String(year), label: String(year) })),
	{ id: 'last', label: 'Last year' },
]

export function GitHubContributions() {
	const [selectedId, setSelectedId] = useState('last')
	const id = useId()

	return (
		<div className="flex w-full flex-col items-center gap-3 overflow-x-hidden">
			<div className="flex flex-wrap items-center gap-3">
				{options.map((option) => (
					<div key={option.id} className="flex items-center gap-2">
						<DailyCheckbox
							id={`${id}-${option.id}`}
							checked={selectedId === option.id}
							onCheckedChange={() => setSelectedId(option.id)}
							className="size-3"
						/>
						<Label htmlFor={`${id}-${option.id}`} className="cursor-pointer text-xs text-muted-foreground">
							{option.label}
						</Label>
					</div>
				))}
			</div>
			<Suspense key={selectedId} fallback={<GitHubContributionFallback />}>
				<GitHubContributionGraph year={selectedId === 'last' ? undefined : Number(selectedId)} />
			</Suspense>
		</div>
	)
}

export default GitHubContributions
