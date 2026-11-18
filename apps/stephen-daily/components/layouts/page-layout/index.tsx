'use client'

import AppNavbar from '@/components/navigations/navbar'
import AppFooter from '@/components/navigations/footer'
import { useRef, type PropsWithChildren } from 'react'

function PageLayout({ children, editionDate }: PropsWithChildren<{ editionDate: string }>) {
	const scrollContainer = useRef<HTMLDivElement>(null)

	return (
		<div
			ref={scrollContainer}
			data-page-scroll
			className="group/page-layout bg-global h-svh w-full overflow-auto scrollbar-none [--navbar-height:5rem] motion-safe:has-[[data-mdx-body]]:scroll-smooth [&::-webkit-scrollbar]:hidden"
		>
			<div className="flex flex-col overflow-x-clip">
				<AppNavbar scrollContainer={scrollContainer} editionDate={editionDate} />
				{children}
				<AppFooter />
			</div>
		</div>
	)
}

export default PageLayout
