'use client'

import NavCenterSection from '@/components/navigations/navbar/nav-center-section'
import NavLeftSection from '@/components/navigations/navbar/nav-left-section'
import NavRightSection from '@/components/navigations/navbar/nav-right-section'
import { Separator } from '@repo/stephen-ui/base/separator'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from '@repo/stephen-ui/motion'
import { useEffect, useRef, useState, type RefObject } from 'react'

function AppNavbar({
	scrollContainer,
	editionDate,
}: {
	scrollContainer: RefObject<HTMLDivElement | null>
	editionDate: string
}) {
	const [isVisible, setIsVisible] = useState(true)
	const navbarRef = useRef<HTMLElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto')
	const reducedMotion = useReducedMotion()
	const { scrollY } = useScroll({ container: scrollContainer })

	useEffect(() => {
		const content = contentRef.current
		const navbar = navbarRef.current
		const container = scrollContainer.current
		if (!content || !navbar || !container) return

		const observer = new ResizeObserver(() => {
			setContentHeight(content.offsetHeight)
			container.style.setProperty('--navbar-height', `${navbar.offsetHeight}px`)
		})
		observer.observe(content)
		observer.observe(navbar)
		return () => observer.disconnect()
	}, [scrollContainer])

	useMotionValueEvent(scrollY, 'change', (latest) => {
		// Expanding the navigation can change scroll through browser scroll anchoring.
		if (navbarRef.current?.matches(':hover, :focus-within')) return

		const previous = scrollY.getPrevious() ?? 0
		setIsVisible(latest <= previous || latest <= 150)
	})

	return (
		<motion.nav
			ref={navbarRef}
			data-navbar-visible={isVisible}
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: isVisible ? 0 : '-100%' }}
			transition={{ duration: 0.6, ease: 'easeOut', y: { duration: 0.3, ease: 'easeInOut' } }}
			className="bg-global sticky top-0 z-50 min-h-20 w-full border-b-4"
		>
			<motion.div
				initial={false}
				animate={{ height: contentHeight }}
				transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
				className="overflow-hidden"
			>
				<div
					ref={contentRef}
					className="grid w-full grid-cols-[auto_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,1fr)] items-start gap-5 px-5 py-3 max-w-9xl mx-auto"
				>
					<NavLeftSection editionDate={editionDate} />
					<NavCenterSection />
					<NavRightSection />
				</div>
			</motion.div>

			<Separator className="border-border absolute bottom-1" />
		</motion.nav>
	)
}

export default AppNavbar
