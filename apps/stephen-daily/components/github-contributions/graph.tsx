/**
 * primitives (MIT License)
 * Copyright (c) zephinax: https://github.com/zephinax
 * Source: https://github.dev/zephinax/personal-website
 * Modified by: Stephen
 */

'use client'

import { DailySkeleton } from '@repo/stephen-ui/daily-components'
import { Spinner } from '@repo/stephen-ui/base/spinner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/stephen-ui/base/tooltip'
import { motion, useReducedMotion } from '@repo/stephen-ui/motion'
import { d } from '@repo/stephen-utils/date-time'
import { useSuspenseQuery } from '@repo/stephen-utils/react-query'
import { APP_CONFIG } from '@/constants/app-config'
import { githubContributionsService } from '@/services/common/github-contributions'
import { useId } from 'react'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function ContributionCell({ x, y, level, fills }: { x: number; y: number; level: number; fills: string[] }) {
	return (
		<rect
			x={x + 0.5}
			y={y + 0.5}
			width={10}
			height={10}
			fill={fills[level]}
			strokeWidth={0.7}
			className={level === 0 ? 'stroke-border/40' : 'stroke-brand'}
		/>
	)
}

export function GitHubContributionFallback() {
	return (
		<DailySkeleton className="flex h-40.5 w-full max-w-184.75 items-center justify-center">
			<Spinner />
		</DailySkeleton>
	)
}

export function GitHubContributionGraph({ year }: { year?: number }) {
	const reduce = useReducedMotion()
	const patternId = useId()
	const fills = [
		'var(--muted)',
		`url(#${patternId}-sparse)`,
		`url(#${patternId}-dense)`,
		'color-mix(in oklab, var(--brand) 55%, var(--background))',
		'var(--brand)',
	]
	const params = { username: APP_CONFIG.author.githubUserName, year }
	const { data } = useSuspenseQuery({
		queryKey: githubContributionsService.getContributions.key(params),
		queryFn: ({ signal }) => githubContributionsService.getContributions.get(params, { signal }),
		// The upstream API caches for an hour and limits bursts of requests.
		staleTime: 60 * 60 * 1000,
		retry: false,
	})
	const activities = data.contributions
	const offset = new Date(`${activities[0]!.date}T00:00:00Z`).getUTCDay()
	const width = Math.ceil((activities.length + offset) / 7) * 14 - 3
	const total = activities.reduce((sum, day) => sum + day.count, 0)

	return (
		<div className="mx-auto w-full max-w-184.75 space-y-2 py-2">
			<TooltipProvider>
				<div className="w-full overflow-x-auto px-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
					<svg
						role="img"
						aria-label={`${total} GitHub contributions ${year ? `in ${year}` : 'in the last year'}`}
						viewBox={`0 0 ${width} 119`}
						width={width}
						height={119}
						className="block text-muted-foreground"
					>
						<defs>
							<pattern id={`${patternId}-sparse`} width={5} height={5} patternUnits="userSpaceOnUse">
								<rect width={5} height={5} fill="var(--background)" />
								<path
									d="M-1 1L1-1M0 5L5 0M4 6L6 4"
									fill="none"
									stroke="var(--brand)"
									strokeWidth={1}
									strokeOpacity={0.55}
								/>
							</pattern>
							<pattern id={`${patternId}-dense`} width={3} height={3} patternUnits="userSpaceOnUse">
								<rect width={3} height={3} fill="var(--background)" />
								<path d="M-1 1L1-1M0 3L3 0M2 4L4 2" fill="none" stroke="var(--brand)" strokeWidth={1} />
							</pattern>
						</defs>
						{activities.map((activity, index) => {
							const column = Math.floor((index + offset) / 7)
							const row = (index + offset) % 7
							return (
								<g key={activity.date}>
									{activity.date.endsWith('-01') && (
										<text x={column * 14} y={12} className="fill-current font-sans text-[9px]">
											{months[Number(activity.date.slice(5, 7)) - 1]}
										</text>
									)}
									<Tooltip>
										<TooltipTrigger asChild>
											<motion.g
												tabIndex={0}
												aria-label={`${activity.count} contributions on ${activity.date}`}
												initial={reduce ? false : { scale: 0 }}
												whileInView={{ scale: 1 }}
												viewport={{ once: true }}
												transition={
													reduce
														? { duration: 0 }
														: {
																delay: (column * 7 + row) * 0.01,
																type: 'spring',
																stiffness: 300,
																damping: 10,
															}
												}
												style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
											>
												<ContributionCell
													x={column * 14}
													y={24 + row * 14}
													level={activity.level}
													fills={fills}
												/>
											</motion.g>
										</TooltipTrigger>
										<TooltipContent className="font-sans" sideOffset={0}>
											<p>
												{activity.count} contribution{activity.count === 1 ? '' : 's'} on{' '}
												{d(activity.date).format('DD.MM.YYYY')}
											</p>
										</TooltipContent>
									</Tooltip>
								</g>
							)
						})}
					</svg>
				</div>
			</TooltipProvider>
			<div className="flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] text-muted-foreground">
				<span>
					{total.toLocaleString('en-US')} contributions {year ? `in ${year}` : 'in the last year'} on{' '}
					<a
						className="font-medium underline underline-offset-4"
						href={`https://github.com/${APP_CONFIG.author.githubUserName}`}
						target="_blank"
						rel="noreferrer"
					>
						GitHub
					</a>
					.
				</span>
				<div className="flex items-center gap-1" aria-label="Contribution intensity: less to more">
					<span>Less</span>
					<svg width={67} height={11} aria-hidden="true">
						{fills.map((fill, index) => (
							<ContributionCell key={fill} x={index * 14} y={0} level={index} fills={fills} />
						))}
					</svg>
					<span>More</span>
				</div>
			</div>
		</div>
	)
}
