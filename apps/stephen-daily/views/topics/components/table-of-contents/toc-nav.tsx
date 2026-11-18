'use client'

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Text } from 'lucide-react'
import { cn } from '@repo/stephen-utils'
import type { ContentPost } from '../../data'
import { buildTocPath, findDistanceAtY, flattenToc, type TocRow } from './geometry'

type Track = {
	path: string
	width: number
	height: number
	rows: (TocRow & { startDistance: number; endDistance: number })[]
}

export function TableOfContentsNav({ items }: { items: ContentPost['toc'] }) {
	const navRef = useRef<HTMLElement>(null)
	const listRef = useRef<HTMLOListElement>(null)
	const maskId = useId()
	const gradientId = useId()
	const flatItems = useMemo(() => flattenToc(items), [items])
	const [track, setTrack] = useState<Track | null>(null)
	const [active, setActive] = useState<{ ids: string[]; leadingId: string | undefined; direction: 'up' | 'down' }>({
		ids: [],
		leadingId: undefined,
		direction: 'down',
	})

	useLayoutEffect(() => {
		const list = listRef.current
		if (!list) return
		let frame = 0

		const measure = () => {
			if (list.clientWidth === 0) return
			const rows = flatItems.map((item, index) => {
				const element = list.children.item(index) as HTMLLIElement
				const styles = getComputedStyle(element)
				return {
					id: item.id,
					x: item.level * 10 + 6,
					top: element.offsetTop + parseFloat(styles.paddingTop),
					bottom: element.offsetTop + element.offsetHeight - parseFloat(styles.paddingBottom),
				}
			})
			const path = buildTocPath(rows)
			const measuredPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
			measuredPath.setAttribute('d', path)

			// Distances depend on layout, so measure them on resize rather than on every scroll.
			setTrack({
				path,
				width: Math.max(...rows.map((row) => row.x)) + 6,
				height: list.offsetHeight,
				rows: rows.map((row) => ({
					...row,
					startDistance: findDistanceAtY(measuredPath, row.top),
					endDistance: findDistanceAtY(measuredPath, row.bottom),
				})),
			})
		}
		const scheduleMeasure = () => {
			cancelAnimationFrame(frame)
			frame = requestAnimationFrame(measure)
		}

		const observer = new ResizeObserver(scheduleMeasure)
		observer.observe(list)
		scheduleMeasure()
		return () => {
			observer.disconnect()
			cancelAnimationFrame(frame)
		}
	}, [flatItems])

	useEffect(() => {
		const nav = navRef.current
		const root = nav?.closest<HTMLElement>('[data-page-scroll]')
		if (!nav || !root) return
		const navbar = root.querySelector<HTMLElement>('[data-navbar-visible]')
		const body = nav.closest('article')?.querySelector('[data-mdx-body]')
		const headings = flatItems.flatMap((item) => {
			const element = document.getElementById(item.id)
			return element ? [{ id: item.id, element }] : []
		})
		let previousScrollTop = root.scrollTop
		let direction: 'up' | 'down' = 'down'
		let frame = 0

		const update = () => {
			if (root.scrollTop !== previousScrollTop) {
				direction = root.scrollTop > previousScrollTop ? 'down' : 'up'
				previousScrollTop = root.scrollTop
			}
			const rootTop = root.getBoundingClientRect().top
			const start = rootTop + (navbar?.dataset.navbarVisible === 'true' ? navbar.offsetHeight + 32 : 16)
			const end = rootTop + root.clientHeight * 0.7
			const positions = headings.map((heading) => ({
				...heading,
				top: heading.element.getBoundingClientRect().top,
			}))
			let currentIndex = -1
			positions.forEach((heading, index) => {
				if (heading.top <= start + 1) currentIndex = index
			})
			const ids = positions
				.filter((heading, index) => index === currentIndex || (heading.top > start && heading.top <= end))
				.map((heading) => heading.id)
			const leadingId = direction === 'down' ? ids.at(-1) : ids[0]

			setActive((previous) =>
				previous.leadingId === leadingId &&
				previous.direction === direction &&
				previous.ids.length === ids.length &&
				previous.ids.every((id, index) => id === ids[index])
					? previous
					: { ids, leadingId, direction }
			)
		}
		const scheduleUpdate = () => {
			cancelAnimationFrame(frame)
			frame = requestAnimationFrame(update)
		}
		const resizeObserver = new ResizeObserver(scheduleUpdate)
		resizeObserver.observe(root)
		if (body) resizeObserver.observe(body)
		const visibilityObserver = new MutationObserver(scheduleUpdate)
		if (navbar) {
			resizeObserver.observe(navbar)
			visibilityObserver.observe(navbar, { attributes: true, attributeFilter: ['data-navbar-visible'] })
		}
		root.addEventListener('scroll', scheduleUpdate, { passive: true })
		scheduleUpdate()

		return () => {
			root.removeEventListener('scroll', scheduleUpdate)
			resizeObserver.disconnect()
			visibilityObserver.disconnect()
			cancelAnimationFrame(frame)
		}
	}, [flatItems])

	const activeRows = track?.rows.filter((row) => active.ids.includes(row.id)) ?? []
	const leadingRow = track?.rows.find((row) => row.id === active.leadingId)
	const highlightTop = activeRows[0]?.top
	const highlightBottom = activeRows.at(-1)?.bottom

	return (
		<nav ref={navRef} aria-label="Table of contents" className="flex min-h-0 flex-col gap-3">
			<h2 className="flex shrink-0 items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
				<Text aria-hidden="true" size={14} />
				On this page
			</h2>
			<div className="min-h-0 overflow-y-auto overscroll-contain pr-3 scrollbar-none [&::-webkit-scrollbar]:hidden">
				<div className="relative">
					{track && (
						<svg
							aria-hidden="true"
							className="pointer-events-none absolute top-0 left-0 overflow-visible text-brand"
							width={track.width}
							height={track.height}
						>
							<defs>
								<mask
									id={maskId}
									maskUnits="userSpaceOnUse"
									x="0"
									y="0"
									width={track.width}
									height={track.height}
								>
									<path
										d={track.path}
										fill="none"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</mask>
								<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
									<stop offset="0" stopColor="currentColor" stopOpacity="0" />
									<stop offset="0.2" stopColor="currentColor" />
									<stop offset="0.8" stopColor="currentColor" />
									<stop offset="1" stopColor="currentColor" stopOpacity="0" />
								</linearGradient>
							</defs>
							<path
								d={track.path}
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-muted-foreground/25"
							/>
							{highlightTop !== undefined && highlightBottom !== undefined && (
								<g mask={`url(#${maskId})`}>
									<rect
										x="0"
										y={highlightTop}
										width={track.width}
										height={highlightBottom - highlightTop}
										fill={`url(#${gradientId})`}
										className="transition-all duration-300 motion-reduce:transition-none"
									/>
								</g>
							)}
						</svg>
					)}
					{track && leadingRow && (
						<span
							aria-hidden="true"
							className="pointer-events-none absolute top-0 left-0 z-10 size-1 rounded-full bg-brand transition-[offset-distance] duration-300 ease-in-out motion-reduce:transition-none"
							style={{
								offsetPath: `path('${track.path}')`,
								offsetDistance: `${active.direction === 'down' ? leadingRow.endDistance : leadingRow.startDistance}px`,
								offsetRotate: '0deg',
								offsetAnchor: 'center',
							}}
						/>
					)}
					<ol ref={listRef} className="relative">
						{flatItems.map((item) => (
							<li key={item.url} className="py-1.5" style={{ paddingLeft: item.level * 10 + 22 }}>
								<a
									href={item.url}
									aria-current={item.id === active.leadingId ? 'location' : undefined}
									className={cn(
										'block text-xs leading-relaxed text-muted-foreground no-underline transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
										active.ids.includes(item.id) && 'font-semibold text-brand-text'
									)}
								>
									{item.title}
								</a>
							</li>
						))}
					</ol>
				</div>
			</div>
		</nav>
	)
}
