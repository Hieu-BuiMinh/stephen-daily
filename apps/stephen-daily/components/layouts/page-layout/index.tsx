'use client'

import AppNavbar from '@/components/navigations/navbar'
import AppFooter from '@/components/navigations/footer'
import { useRef, type PropsWithChildren } from 'react'

function PageLayout({ children, editionDate }: PropsWithChildren<{ editionDate: string }>) {
	const scrollContainer = useRef<HTMLDivElement>(null)

	return (
		<div
			ref={scrollContainer}
			className="bg-global h-svh w-full overflow-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
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
