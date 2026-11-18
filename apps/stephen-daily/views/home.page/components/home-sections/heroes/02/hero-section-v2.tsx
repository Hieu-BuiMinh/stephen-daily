import { NewsGrid } from '@repo/stephen-ui/daily-components'
import layout from '../hero-carousel/hero-carousel.module.css'
import styles from './hero-section-v2.module.css'

// Paste the Viet Nam Quoc Tu Google Maps URL here.
const MAP_URL = 'https://maps.app.goo.gl/kBUBH3kmRhQ6mvbG7'

function HeroSectionV2() {
	return (
		<NewsGrid>
			<NewsGrid.Section className={`col-start-1 col-end-13 ${layout.frame} ${styles.hero}`}>
				<div className={styles.poster}>
					<header className={styles.heading} data-hero-layer="text">
						<h1 className="font-yeseva">Stephen Daily</h1>
					</header>
					<svg aria-hidden="true" focusable="false" className={styles.maskDefinitions}>
						<defs>
							<mask
								id="hero-v2-sky-mask"
								maskUnits="userSpaceOnUse"
								x="0"
								y="0"
								width="100%"
								height="100%"
							>
								<text
									className={styles.title}
									x="50%"
									y="2%"
									textAnchor="middle"
									dominantBaseline="hanging"
									fill="white"
								>
									Stephen Daily
								</text>
								<rect className={styles.imageBody} width="100%" height="100%" fill="white" />
							</mask>
						</defs>
					</svg>
					<div aria-hidden="true" className={styles.artwork} data-hero-layer="background" />
					<div aria-hidden="true" className={styles.subBackground} />
					<div aria-hidden="true" className={styles.subject} data-hero-layer="subject" />
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
							Vietnam Quoc Tu
						</a>
					</p>
				</div>
				<div className={styles.description}>
					<p>
						A few steps in from the street, the traffic sounds softer. I like taking my time here and
						looking up at the tiled roofs.
					</p>
					<p>
						This is one of my favorite corners of Saigon. The city is still going about its day, and for a
						little while I can slow down.
					</p>
				</div>
				<div aria-hidden="true" className={styles.texture} data-hero-layer="texture" />
			</NewsGrid.Section>
		</NewsGrid>
	)
}

export default HeroSectionV2
