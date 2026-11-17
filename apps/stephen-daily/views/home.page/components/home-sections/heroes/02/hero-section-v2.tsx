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
					<div aria-hidden="true" className={styles.subject} data-hero-layer="subject" />
				</div>
				<div className={styles.artworkLabel}>
					<p className="italic">A SLOWER LOOK</p>
					<p>
						<a
							href={MAP_URL || undefined}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							Việt Nam Quốc Tự
						</a>
					</p>
				</div>
				<div className={styles.description}>
					<p>A little stillness. A different perspective. Something worth keeping.</p>
					<p>Small discoveries from familiar streets and everyday life.</p>
				</div>
				<div aria-hidden="true" className={styles.texture} data-hero-layer="texture" />
			</NewsGrid.Section>
		</NewsGrid>
	)
}

export default HeroSectionV2
