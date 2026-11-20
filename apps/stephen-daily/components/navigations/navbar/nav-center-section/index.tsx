'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { DailyNavigation, DailyNavItem, type DailyNavItemData } from '@repo/stephen-ui/daily-components'

const keepSubnavOpen = false

const navItems: DailyNavItemData[] = [
	{ number: '01', label: 'About', description: 'Meet Stephen', href: '/about' },
	{ number: '02', label: 'Projects', description: 'Selected work', href: '/projects' },
	{
		number: '03',
		label: 'Blog',
		heading: 'From the journal',
		imageSrc: '/assets/images/fallback/02.png',
		items: [
			{ label: 'Posts', subtitle: 'Notes on building software and solving problems.', href: '/topics/dev' },
			{ label: 'Tags', subtitle: 'Find posts by topic.' },
			{ label: 'Documents', subtitle: 'Technical notes and reference material.' },
			{ label: 'Books', subtitle: 'Books, ideas, and lessons from reading.', href: '/topics/books' },
		],
	},
	{
		number: '04',
		label: 'More',
		heading: 'Explore the daily',
		itemsLayout: 'grid',
		items: [
			{ label: 'Guestbook', subtitle: 'Leave a message.' },
			{ label: 'Testimonial', subtitle: 'Words from people I’ve worked with.' },
			{
				label: 'Other Topics',
				subtitle: 'Personal stories and notes beyond development.',
				href: '/topics/others',
			},
			{ label: 'Retrospective', subtitle: 'Looking back on my journey.' },
			{ label: 'Year Recap', subtitle: 'Reflections on the past year.', href: '/topics/others/year-recap' },
			{ label: 'Album', subtitle: 'An archive of moments worth keeping.' },
			{ label: 'Short Spark', subtitle: 'Videos worth sharing.' },
			{ label: 'Overview', subtitle: 'How this website came to be.' },
			{ label: 'Front Page', subtitle: 'Return to the latest edition of Stephen Daily.', href: '/' },
			{ label: 'Topics', subtitle: 'Explore engineering, reading notes, and personal stories.', href: '/topics' },
		],
	},
]

function NavCenterSection() {
	const pathname = usePathname()
	const [openItem, setOpenItem] = useState(keepSubnavOpen ? '03' : '')

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
