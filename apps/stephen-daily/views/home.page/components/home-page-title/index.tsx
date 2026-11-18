import { NewsGrid } from '@repo/stephen-ui/daily-components'

async function HomePageTitle() {
	return (
		<NewsGrid>
			<NewsGrid.Section className="col-start-1 col-end-13">
				<header className="mx-auto w-full px-5 py-6 text-center sm:px-8 sm:py-8">
					<div className="flex flex-col items-center gap-4 py-3 sm:gap-5 relative">
						<span className="absolute top-0 left-0 text-xl text-muted-foreground font-bold font-mono max-sm:hidden">
							No.01
						</span>
						<p className="flex w-full max-w-xl items-center gap-3 font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border sm:gap-5 sm:text-[11px] sm:tracking-[0.3em]">
							&quot;You become what you think about&quot;
						</p>
						<h1 className="font-yeseva text-[clamp(1.75rem,7.5vw,6.5rem)] leading-[1.1] font-normal tracking-[-0.04em] text-brand-text">
							STEPHEN DAILY
						</h1>
					</div>
				</header>
			</NewsGrid.Section>
		</NewsGrid>
	)
}

export default HomePageTitle
