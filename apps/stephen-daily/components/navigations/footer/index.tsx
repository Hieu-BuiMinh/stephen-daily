import Link from 'next/link'
import Signature from '@/components/signature'
import { APP_CONFIG } from '@/constants/app-config'
import { GridRow, GridSeparator } from '@repo/stephen-ui/daily-components'

const navigation = [
	{
		title: 'Blog',
		links: [
			{ label: 'Dev blog', href: '/blog' },
			{ label: 'Documentation', href: '/docs' },
			{ label: 'Guestbook', href: '/guestbook' },
		],
	},
	{
		title: 'About',
		links: [
			{ label: 'About me', href: '/about' },
			{ label: 'My journey', href: '/journey' },
		],
	},
	{
		title: 'Explore',
		links: [
			{ label: 'Tags', href: '/tags' },
			{ label: 'Quotes', href: '/quotes' },
			{ label: 'Album', href: '/album' },
			{ label: 'Other topics', href: '/topics' },
			{ label: 'Analytics', href: '/analytics' },
		],
	},
	{
		title: 'Tools',
		links: [
			{ label: 'I-Ching divination', href: '/tools/i-ching' },
			{ label: 'Lunar date & time', href: '/tools/lunar-calendar' },
		],
	},
]

const socialLinks = [
	{ label: 'GitHub', href: `https://github.com/${APP_CONFIG.author.githubUserName}` },
	{ label: 'X', href: `https://x.com/${APP_CONFIG.author.twitterUserName}` },
	{ label: 'LinkedIn', href: `https://www.linkedin.com/in/${APP_CONFIG.author.linkedinUserName}/` },
	{ label: 'Resume', href: APP_CONFIG.author.resume },
]

const linkClassName =
	'w-fit underline-offset-4 transition-colors hover:text-brand-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand'

export default function AppFooter() {
	return (
		<footer className="mx-auto w-full max-w-7xl border-x border-b-none border-border font-sans">
			<GridSeparator />
			<div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-border px-4 py-4 sm:px-6">
				<Link href="/" className={`font-yeseva text-xl ${linkClassName}`}>
					{APP_CONFIG.site.name}
				</Link>
				<p className="font-playfair text-sm text-muted-foreground italic">
					&quot;You become what you think about&quot;
				</p>
			</div>

			<nav aria-label="Footer" className="grid grid-cols-2 lg:grid-cols-4">
				{navigation.map((group) => (
					<div
						key={group.title}
						className="min-w-0 border-b border-border px-4 py-5 odd:border-r sm:px-6 lg:not-last:border-r"
					>
						<h2 className="mb-4 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
							{group.title}
						</h2>
						<ul className="space-y-2 font-mono text-xs leading-relaxed sm:text-sm">
							{group.links.map((link) => (
								<li key={link.href}>
									<Link href={link.href} prefetch={false} className={linkClassName}>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</nav>

			<div className="grid border-b border-border md:grid-cols-2">
				<div className="flex flex-col items-start border-b border-border px-4 py-5 sm:px-6 md:border-r md:border-b-0">
					<p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
						From the editor
					</p>
					<p className="font-playfair text-xl font-semibold">A little code. A little life.</p>
					<p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
						I’m Stephen, a front-end developer and the person behind this journal. Thanks for stopping by
						and spending a little of your day here.
					</p>
					<ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
						{socialLinks.map((link) => (
							<li key={link.label}>
								<a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</div>
				<div className="px-4 py-5 sm:px-6">
					<p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">Signed by</p>
					<div className="flex h-36 items-center">
						<Signature
							aria-hidden="true"
							stroke="currentColor"
							className="w-52 max-w-full resize-none text-brand-text shadow-none sm:w-56"
						/>
					</div>
					<p className="border-t border-border pt-2 font-mono text-xs uppercase">{APP_CONFIG.author.name}</p>
				</div>
			</div>

			<div className="px-4 py-6 sm:px-6">
				<GridRow borderX className="mx-auto max-w-xl px-4 py-4 text-center sm:px-6 dot-grid">
					<p className="mb-2 font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
						A note to myself
					</p>
					<h2 className="font-playfair text-lg font-semibold">Thank me for choosing to keep going.</h2>
					<p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
						There is still a lot I don’t know. I’m grateful for what this path has taught me, and I hope to
						keep learning, stay patient, and take the next small step.
					</p>
				</GridRow>
			</div>
			<div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-[10px] text-muted-foreground sm:px-6">
				<p>
					&copy; {new Date().getFullYear()} {APP_CONFIG.site.name}
				</p>
				<p>Made with ❤️ in Vietnam</p>
			</div>
		</footer>
	)
}
