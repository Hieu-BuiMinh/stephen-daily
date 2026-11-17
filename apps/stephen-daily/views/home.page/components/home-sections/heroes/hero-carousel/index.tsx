'use client'

import { useEffect, useState } from 'react'
import HeroSectionV1 from '../01/hero-section-v1'
import HeroSectionV2 from '../02/hero-section-v2'
import styles from './hero-carousel.module.css'

const SLIDE_DURATION = 30_000

function HeroCarousel() {
	const [activeSlide, setActiveSlide] = useState(0)

	useEffect(() => {
		const timeout = window.setTimeout(() => {
			setActiveSlide((slide) => (slide + 1) % 2)
		}, SLIDE_DURATION)

		return () => window.clearTimeout(timeout)
	}, [activeSlide])

	return (
		<div className="relative" role="region" aria-roledescription="carousel" aria-label="Stephen Daily highlights">
			{activeSlide === 0 ? <HeroSectionV1 /> : <HeroSectionV2 />}
			<div className={styles.controls} role="group" aria-label="Choose hero slide">
				{[0, 1].map((slide) => (
					<button
						key={slide}
						type="button"
						className={styles.dotButton}
						aria-label={`Show slide ${slide + 1}`}
						aria-current={activeSlide === slide}
						onClick={() => setActiveSlide(slide)}
					>
						<span className={styles.dot} aria-hidden="true">
							{activeSlide === slide && (
								<span
									className={styles.progress}
									style={{ animationDuration: `${SLIDE_DURATION}ms` }}
								/>
							)}
						</span>
					</button>
				))}
			</div>
		</div>
	)
}

export default HeroCarousel
