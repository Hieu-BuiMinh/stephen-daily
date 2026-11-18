import { NewsGrid } from '@repo/stephen-ui/daily-components'
import type { CSSProperties } from 'react'
import styles from '../01/hero-section-v1.module.css'
import layout from '../hero-carousel/hero-carousel.module.css'
import localStyles from './hero-section-v3.module.css'

const artwork = {
	'--hero-background-image': "url('/assets/images/hero/03/hero-bg-v3.png')",
	'--hero-subject-image': "url('/assets/images/hero/03/saigon%20notre-dame-basilica.png')",
} as CSSProperties

const places: { name: string; mapUrl?: string }[] = [
	{ name: 'Saigon Notre-Dame Cathedral' },
	{ name: 'Nguyen Van Binh Book Street' },
]

export default function HeroSectionV3() {
	return (
		<NewsGrid>
			<NewsGrid.Section className={`col-start-1 col-end-13 ${layout.frame} ${styles.hero}`} style={artwork}>
				<div className={styles.poster}>
					<header className={styles.heading} data-hero-layer="text">
						<h1 className={styles.title}>Stephen Daily</h1>
					</header>
					<div
						aria-hidden="true"
						className={`${styles.artwork} ${localStyles.background}`}
						data-hero-layer="background"
					/>
					<div aria-hidden="true" className={localStyles.bubble} />
					<div aria-hidden="true" className={styles.subject} data-hero-layer="subject" />
					<div aria-hidden="true" className={styles.texture} data-hero-layer="texture" />
					<div className={localStyles.details}>
						<div className={localStyles.description}>
							<p>
								The cathedral was close to my university. Those two towers still take me back to my
								student days.
							</p>
							<p>
								Just around the corner is Book Street. I think of the two places as one small piece of
								those years.
							</p>
						</div>
						<div className={localStyles.places}>
							<p className={styles.artworkCity}>Saigon, Vietnam</p>
							{places.map(({ name, mapUrl }) => (
								<p key={name}>
									{mapUrl ? (
										<a
											href={mapUrl}
											target="_blank"
											rel="noopener noreferrer"
											className={styles.artworkLink}
										>
											{name}
										</a>
									) : (
										<span className={styles.artworkLink}>{name}</span>
									)}
								</p>
							))}
						</div>
					</div>
				</div>
			</NewsGrid.Section>
		</NewsGrid>
	)
}
