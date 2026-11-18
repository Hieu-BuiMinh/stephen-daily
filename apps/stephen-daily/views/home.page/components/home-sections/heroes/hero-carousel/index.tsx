'use client'

import { useEffect, useState } from 'react'
import HeroSectionV1 from '../01/hero-section-v1'
import HeroSectionV2 from '../02/hero-section-v2'
import HeroSectionV3 from '../03/hero-section-v3'
import styles from './hero-carousel.module.css'

const SLIDE_DURATION = 30_000
const slides = [HeroSectionV1, HeroSectionV2, HeroSectionV3]

function HeroCarousel() {
	const [activeSlide, setActiveSlide] = useState(0)
	const ActiveHero = slides[activeSlide]!

	useEffect(() => {
		const timeout = window.setTimeout(() => {
			setActiveSlide((slide) => (slide + 1) % slides.length)
		}, SLIDE_DURATION)

		return () => window.clearTimeout(timeout)
	}, [activeSlide])

	return (
		<div className="relative" role="region" aria-roledescription="carousel" aria-label="Stephen Daily highlights">
			<svg aria-hidden="true" className="absolute size-0">
				<filter id="hero-subject-outline" colorInterpolationFilters="sRGB">
					<feMorphology in="SourceAlpha" operator="dilate" radius="5" result="expanded" />
					<feFlood floodColor="#fffdf5" />
					<feComposite in2="expanded" operator="in" result="outline" />
					<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7" result="noise" />
					<feDisplacementMap
						in="outline"
						in2="noise"
						scale="5"
						xChannelSelector="R"
						yChannelSelector="G"
						result="roughOutline"
					/>
					<feComposite in="SourceGraphic" in2="roughOutline" operator="over" />
				</filter>
			</svg>
			<ActiveHero />
			<div className={styles.controls} role="group" aria-label="Choose hero slide">
				{slides.map((Hero, slide) => (
					<button
						key={Hero.name}
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
