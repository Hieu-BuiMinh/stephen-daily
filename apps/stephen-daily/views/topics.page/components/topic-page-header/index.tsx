import { DailyBaseImage } from '@repo/stephen-ui/daily-components'
import type { ReactNode } from 'react'

type TopicPageHeaderProps = {
	title: string
	description: string
	image?: { src?: string; alt?: string } | null
	subTexts?: readonly { label?: string; value: ReactNode }[]
	actions?: ReactNode
}

export function TopicPageHeader({ title, description, image = {}, subTexts = [], actions }: TopicPageHeaderProps) {
	return (
		<div className={image ? 'grid sm:grid-cols-2' : 'grid'}>
			<div className="flex min-w-0 flex-col justify-center">
				<header className="px-4 py-4 text-left sm:px-8 sm:py-6">
					<h1 className="font-yeseva text-2xl leading-tight tracking-tight sm:text-4xl">{title}</h1>
					{description && (
						<p className="mt-2 max-w-2xl font-playfair text-sm leading-relaxed text-muted-foreground italic">
							{description}
						</p>
					)}
					{actions && <div className="mt-2 flex flex-wrap items-center gap-3">{actions}</div>}
				</header>
				{subTexts.length > 0 && (
					<div className="grid gap-4 px-4 pb-4 font-playfair text-sm leading-snug sm:px-8 sm:pb-0 lg:grid-cols-3 lg:gap-5">
						{subTexts.map(({ label, value }, index) => (
							<div key={index} className="min-w-0">
								{label && <p className="mb-1 font-semibold">{label}</p>}
								<div>{value}</div>
							</div>
						))}
					</div>
				)}
			</div>
			{image && (
				<div className="relative aspect-3/2 min-w-0 overflow-hidden">
					<DailyBaseImage
						src={image.src ?? '/assets/images/hero/jim-rohn.png'}
						alt={image.alt ?? ''}
						fill
						unoptimized
						sizes="(min-width: 640px) 50vw, 100vw"
						className="object-contain"
						preview
					/>
				</div>
			)}
		</div>
	)
}
