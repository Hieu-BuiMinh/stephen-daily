'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { DailyNavigation, DailyNavItem, type DailyNavItemData } from '@repo/stephen-ui/daily-components'

const keepSubnavOpen = false

const navItems: DailyNavItemData[] = [
	{ number: '01', label: 'About', description: 'Meet Stephen', href: '/about' },
	{
		number: '02',
		label: 'Project',
		heading: 'Selected work',
		imageSrc: '/assets/images/fallback/01.png',
		items: [
			{
				label: 'Web Development',
				subtitle: 'A selection of websites and web applications.',
				href: '/topics/projects',
			},
			{ label: 'UI Experiments', subtitle: 'Exploring interfaces, motion, and small interactions.' },
			{ label: 'Open Source', subtitle: 'Tools and contributions shared with the community.' },
		],
	},
	{
		number: '03',
		label: 'Blog',
		heading: 'From the journal',
		imageSrc: '/assets/images/fallback/01.png',
		items: [
			{ label: 'Engineering', subtitle: 'Notes on building software and solving problems.', href: '/topics/dev' },
			{ label: 'Reading Notes', subtitle: 'Books, ideas, and lessons from reading.', href: '/topics/books' },
			{ label: 'Personal Stories', subtitle: 'Lessons and observations along the way.', href: '/topics/others' },
		],
	},
	{
		number: '04',
		label: 'More',
		heading: 'Explore the daily',
		imageSrc: '/assets/images/fallback/01.png',
		items: [
			{ label: 'Front Page', subtitle: 'Return to the latest edition of Stephen Daily.', href: '/' },
			{ label: 'Topics', subtitle: 'Explore articles, guides, projects, and retrospectives.', href: '/topics' },
			{ label: 'About', subtitle: 'Meet Stephen and discover the story behind the work.', href: '/about' },
			{ label: 'Contact', subtitle: 'Start a conversation or discuss a collaboration.' },
		],
	},
]

function NavCenterSection() {
	const pathname = usePathname()
	const [openItem, setOpenItem] = useState(keepSubnavOpen ? '02' : '')

	return (
		<DailyNavigation
			value={openItem}
			onValueChange={(value) => {
				if (value || !keepSubnavOpen) setOpenItem(value)
			}}
		>
			{navItems.map((item) => (
				<DailyNavItem
					key={item.number}
					{...item}
					active={'href' in item && pathname === item.href}
					renderLink={(href, children) => <Link href={href}>{children}</Link>}
					renderImage={(src, className) => (
						<Image src={src} alt="" fill sizes="(min-width: 640px) 120px, 96px" className={className} />
					)}
				/>
			))}
		</DailyNavigation>
	)
}

export default NavCenterSection
