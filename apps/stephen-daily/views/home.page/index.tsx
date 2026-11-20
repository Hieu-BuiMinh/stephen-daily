import PageViewContainer from '@/components/containers/page-view-container'
import KeaBird from '@/components/kea-bird'
import GithubContributionSection from '@/views/home.page/components/home-sections/github-contribution-section'
import HeroCarousel from '@/views/home.page/components/home-sections/heroes/hero-carousel'
import LatestArticlesSection from '@/views/home.page/components/home-sections/latest-articles-section'
import { GridRow, GridSeparator } from '@repo/stephen-ui/daily-components'

function StephenDailyHomePageView() {
	return (
		<PageViewContainer>
			<HeroCarousel />
			<GridSeparator className="mt-0" />
			<GridRow className="flex justify-end px-4 py-6 sm:px-6 sm:py-8">
				<KeaBird className="size-44 shrink-0 rotate-3 sm:size-56 md:size-64 lg:size-72" />
			</GridRow>

			<GridSeparator />
			<LatestArticlesSection />
			<GridSeparator />
			<GithubContributionSection />
			<GridSeparator />
		</PageViewContainer>
	)
}

export default StephenDailyHomePageView
