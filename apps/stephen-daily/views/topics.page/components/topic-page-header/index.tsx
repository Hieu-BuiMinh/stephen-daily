import { DailyBaseImage, SectionHeaderPrimary } from '@repo/stephen-ui/daily-components'
import type { ReactNode } from 'react'

type TopicPageHeaderProps = {
	title: string
	description: string
	imageSrc?: string
	actions?: ReactNode
}

export function TopicPageHeader({
	title,
	description,
	imageSrc = '/assets/images/fallback/01.png',
	actions,
}: TopicPageHeaderProps) {
	return (
		<div className="grid grid-cols-2">
			<SectionHeaderPrimary
				headingAs="h1"
				title={title}
				subtitle={description}
				actions={actions}
				className="items-start justify-center gap-2 px-4 py-4 text-left sm:px-8 sm:py-6"
				titleClassName="text-2xl text-wrap sm:text-4xl"
				subtitleClassName="mx-0 mt-2 text-sm"
			/>
			<div className="relative min-h-24 min-w-0 self-stretch overflow-hidden bg-muted sm:aspect-5/2">
				<DailyBaseImage src={imageSrc} alt="" fill unoptimized sizes="50vw" className="object-cover" />
			</div>
		</div>
	)
}
