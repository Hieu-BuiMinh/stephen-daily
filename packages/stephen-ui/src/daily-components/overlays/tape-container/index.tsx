'use client'

import NextImage from 'next/image'
import { useEffect, useState, type ComponentProps } from 'react'
import { cn } from '@repo/stephen-utils'

const tapePositions = {
	'top-left': [5, 2, -10],
	'top-center': [50, 0, -4],
	'top-right': [95, 2, 9],
	'bottom-left': [5, 98, 8],
	'bottom-center': [50, 100, 4],
	'bottom-right': [95, 98, -9],
} as const

const maskingFiles = Array.from(
	{ length: 100 },
	(_, index) => `maskings/${String(index + 1).padStart(2, '0')}.webp` as const
)
const transparentFiles = [
	1, 5, 17, 23, 32, 35, 36, 40, 41, 51, 55, 56, 64, 65, 72, 74, 77, 78, 79, 80, 82, 83, 84, 85, 87, 91, 93, 100,
].map((number) => `transparent/${String(number).padStart(2, '0')}.webp` as const)
const horizontalFiles = [
	3, 7, 9, 10, 11, 14, 15, 17, 22, 30, 32, 34, 35, 52, 59, 61, 65, 66, 67, 68, 72, 73, 77, 82, 86, 87, 91, 92, 94, 96,
	100,
].map((number) => `maskings/${String(number).padStart(2, '0')}.webp` as const)

const tapeCollections = {
	all: [...maskingFiles, ...transparentFiles],
	maskings: maskingFiles,
	transparent: transparentFiles,
	horizontal: horizontalFiles,
}

export type DailyTapeOptions = {
	seed?: number
	collection?: keyof typeof tapeCollections
	assetBaseUrl?: string
	pieces: readonly {
		position: keyof typeof tapePositions
		offsetX?: number
		offsetY?: number
		rotation?: number
		size?: number
		opacity?: number
		asset?: (typeof tapeCollections.all)[number]
	}[]
}

export function DailyTapeOverlay({
	seed,
	collection = 'transparent',
	assetBaseUrl = '/assets/images/textures/tapes',
	pieces,
}: DailyTapeOptions) {
	const [instanceSeed, setInstanceSeed] = useState<number>()

	useEffect(() => {
		if (seed !== undefined || instanceSeed !== undefined) return

		const frame = requestAnimationFrame(() => {
			setInstanceSeed(Math.floor(Math.random() * 0x100000000))
		})
		return () => cancelAnimationFrame(frame)
	}, [seed, instanceSeed])

	const resolvedSeed = seed ?? instanceSeed
	if (resolvedSeed === undefined) return null

	let randomState = resolvedSeed >>> 0
	const assets = [...tapeCollections[collection]]

	for (let i = assets.length - 1; i > 0; i--) {
		randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0
		const j = Math.floor((randomState / 0x100000000) * (i + 1))
		;[assets[i], assets[j]] = [assets[j]!, assets[i]!]
	}

	return pieces.map(({ position, offsetX = 0, offsetY = 0, rotation, size = 88, opacity = 1, asset }, index) => {
		const [left, top, angle] = tapePositions[position]
		const source = asset ?? assets[index % assets.length]

		return (
			<span
				key={index}
				aria-hidden="true"
				className="pointer-events-none absolute z-30 -translate-1/2"
				style={{
					left: `calc(${left}% + ${offsetX}px)`,
					top: `calc(${top}% + ${offsetY}px)`,
					rotate: `${rotation ?? angle}deg`,
					width: size,
					height: collection === 'horizontal' ? size / 2 : size,
					opacity,
				}}
			>
				<NextImage
					src={`${assetBaseUrl}/${source}`}
					alt=""
					fill
					sizes={`${size}px`}
					className="object-contain"
				/>
			</span>
		)
	})
}

export type DailyTapeContainerProps = ComponentProps<'div'> & {
	tape: DailyTapeOptions
}

export function DailyTapeContainer({ tape, className, children, ...props }: DailyTapeContainerProps) {
	return (
		<div {...props} className={cn('relative isolate w-fit max-w-full', className)}>
			{children}
			<DailyTapeOverlay {...tape} />
		</div>
	)
}
