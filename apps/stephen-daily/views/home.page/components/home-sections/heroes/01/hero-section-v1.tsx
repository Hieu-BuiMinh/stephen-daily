import { NewsGrid } from '@repo/stephen-ui/daily-components'
import layout from '../hero-carousel/hero-carousel.module.css'
import styles from './hero-section-v1.module.css'

// Paste the Bitexco Google Maps URL here.
const MAP_URL = 'https://maps.app.goo.gl/QhkkP7oNmvcCK9LQA'

function HeroSectionV1() {
	return (
		<NewsGrid>
			<NewsGrid.Section className={`col-start-1 col-end-13 ${layout.frame} ${styles.hero}`}>
				<div className={styles.poster}>
					<header className={styles.heading} data-hero-layer="text">
						<h1 className={styles.title}>Stephen Daily</h1>
					</header>
					<div className={styles.description}>
						<p>
							I love this city in the little moments: coffee on a low stool, a sudden shower, the streets
							lighting up again.
						</p>
						<p>
							From here, the streets I know by heart look a little different. I could sit up there and
							watch the city for hours.
						</p>
					</div>
					<div className={styles.artworkLabel}>
						<p className={styles.artworkCity}>Saigon, Vietnam</p>
						<p>
							<a
								href={MAP_URL || undefined}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.artworkLink}
							>
								Bitexco Tower
							</a>
						</p>
					</div>
					<div aria-hidden="true" className={styles.artwork} data-hero-layer="background" />
					<div aria-hidden="true" className={styles.subject} data-hero-layer="subject" />
					<div aria-hidden="true" className={styles.texture} data-hero-layer="texture" />
				</div>
			</NewsGrid.Section>
		</NewsGrid>
	)
}

export default HeroSectionV1
