/* eslint-disable import-x/no-named-as-default */
import StephenLogo from '@/components/logos/stephen-logo'
import dayjs, { DEFAULT_TIMEZONE, formatDate } from '@repo/stephen-utils/date-time'
import { APP_CONFIG } from '@/constants/app-config'
import Link from 'next/link'

function NavLeftSection({ editionDate }: { editionDate: string }) {
	const today = dayjs(editionDate).tz(DEFAULT_TIMEZONE).locale(APP_CONFIG.site.locale)

	return (
		<div className="flex flex-col gap-1 text-xs relative md:border-r border-dashed h-full md:pr-2">
			<div className="flex gap-1 items-start">
				<Link href="/" aria-label="Stephen Daily home" className="block size-7 shrink-0">
					<StephenLogo className="size-7" variant="neutral" />
				</Link>
				<div className="hidden md:block space-y-1 text-[10px] leading-snug tracking-wide text-foreground sm:text-xs">
					<span className="font-playfair font-bold text-base">Stephen Good News</span>
					<p className="mt-2">Edition {APP_CONFIG.version}</p>
					<p>
						<time dateTime={today.format('YYYY-MM-DD')}>{formatDate(today, 'dddd, MMMM D, YYYY')}</time>
					</p>
				</div>
			</div>
		</div>
	)
}

export default NavLeftSection
