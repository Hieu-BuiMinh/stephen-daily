'use client'

import { useEffect, useState, type ComponentProps, type CSSProperties } from 'react'
import { cn } from '@repo/stephen-utils'

const noiseCount = 100

export type DailyNoiseOverlayProps = ComponentProps<'div'> & {
	noise?: {
		overlay?: number
		random?: boolean
		opacity?: number
		blendMode?: CSSProperties['mixBlendMode']
		assetBaseUrl?: string
	}
}

export function DailyNoiseOverlay({ noise, className, children, ...props }: DailyNoiseOverlayProps) {
	const {
		overlay = 1,
		random = false,
		opacity = 0.25,
		blendMode = 'soft-light',
		assetBaseUrl = '/assets/images/textures/noise/web',
	} = noise ?? {}
	const [randomOverlay, setRandomOverlay] = useState<number>()

	useEffect(() => {
		if (!random) return

		const frame = requestAnimationFrame(() => {
			setRandomOverlay(Math.floor(Math.random() * noiseCount) + 1)
		})
		return () => cancelAnimationFrame(frame)
	}, [random])

	const selected = random ? randomOverlay : overlay

	return (
		<div {...props} className={cn('relative w-fit max-w-full', className)}>
			{children}
			{/* A transparent wrapper lets the noise blend with the background behind it. */}
			{selected !== undefined && selected >= 1 && selected <= noiseCount && Number.isInteger(selected) && (
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] bg-cover bg-center"
					style={{
						backgroundImage: `url('${assetBaseUrl}/${String(selected).padStart(3, '0')}.webp')`,
						mixBlendMode: blendMode,
						opacity,
					}}
				/>
			)}
		</div>
	)
}
