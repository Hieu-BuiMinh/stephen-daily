'use client'

import type { ReactElement, ReactNode } from 'react'
import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuTrigger,
} from '@repo/stephen-ui/base/navigation-menu'

export type DailyNavItemData = { number: string; label: string } & (
	| { href: string; description: string }
	| { heading: string; imageSrc: string; items: { label: string; subtitle: string; href?: string }[] }
)

export type DailyNavItemProps = DailyNavItemData & {
	active?: boolean
	renderLink: (href: string, children: ReactNode) => ReactElement
	renderImage: (src: string, className: string) => ReactElement
}

const navItemClassName =
	'flex h-full w-full flex-col items-start justify-start gap-1 rounded-none bg-transparent px-3 py-3 text-left font-sans leading-tight transition-colors hover:bg-foreground/5 focus:bg-foreground/5 data-[active]:bg-foreground/5 data-[state=open]:bg-foreground/5 data-[state=open]:hover:bg-foreground/5 data-[state=open]:focus:bg-foreground/5 sm:px-4 [&_svg]:hidden'

const subnavItemClassName =
	'flex w-full flex-col items-start gap-1 rounded-none border-t border-foreground/20 px-0 py-2 text-left'

export function DailyNavItem(props: DailyNavItemProps) {
	const label = (
		<>
			<span className="text-[10px] font-semibold tracking-[0.16em] text-brand-text uppercase">{props.label}</span>
			<span className="hidden text-[10px] font-medium tracking-widest text-foreground uppercase sm:inline">
				{'heading' in props ? props.heading : props.description}
			</span>
			<span
				aria-hidden="true"
				className="hidden font-mono text-[9px] tracking-widest text-muted-foreground sm:inline"
			>
				{props.number}
			</span>
		</>
	)

	return (
		<NavigationMenuItem value={props.number} className="h-full min-w-0">
			{'href' in props ? (
				<NavigationMenuLink asChild active={props.active} className={navItemClassName}>
					{props.renderLink(props.href, label)}
				</NavigationMenuLink>
			) : (
				<>
					<NavigationMenuTrigger className={navItemClassName}>{label}</NavigationMenuTrigger>
					<NavigationMenuContent className="top-0 left-0 w-full p-0 pr-0 duration-300 data-[motion=from-end]:slide-in-from-right-2 data-[motion=from-start]:slide-in-from-left-2 data-[motion=to-end]:slide-out-to-right-2 data-[motion=to-start]:slide-out-to-left-2 motion-reduce:animate-none! md:w-full">
						<p className="px-4 pt-4 pb-2 font-sans text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
							{props.heading}
						</p>
						<div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 px-4 pt-1 pb-3 sm:grid-cols-[120px_minmax(0,1fr)]">
							<div className="relative min-h-0">
								{props.renderImage(props.imageSrc, 'h-full w-full border object-cover')}
							</div>
							<ul className="min-w-0">
								{props.items.map((item) => {
									const itemContent = (
										<>
											<span className="font-sans text-[13px] leading-tight font-bold uppercase">
												{item.label}
											</span>
											<span className="font-sans text-[11px] leading-snug font-normal text-muted-foreground">
												{item.subtitle}
											</span>
										</>
									)

									return (
										<li key={item.label}>
											{item.href ? (
												<NavigationMenuLink
													asChild
													className={`${subnavItemClassName} hover:border-brand hover:bg-transparent hover:text-brand-hover focus:border-brand focus:bg-transparent focus:text-brand-hover`}
												>
													{props.renderLink(item.href, itemContent)}
												</NavigationMenuLink>
											) : (
												<button
													type="button"
													disabled
													className={`${subnavItemClassName} text-foreground`}
												>
													{itemContent}
												</button>
											)}
										</li>
									)
								})}
							</ul>
						</div>
					</NavigationMenuContent>
				</>
			)}
		</NavigationMenuItem>
	)
}
