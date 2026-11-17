'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@repo/stephen-utils'
import styles from './kea-bird.module.css'
import { mountKeaBody } from './kea-body.js'
import { mountKea3D } from './kea3d.js'

const assets = '/assets/images/textures/kea-bird'

export default function KeaBird({ className }: { className?: string }) {
	const containerRef = useRef<HTMLButtonElement>(null)
	const bodyRef = useRef<ReturnType<typeof mountKeaBody>>(undefined)
	const [error, setError] = useState('')

	useEffect(() => {
		const container = containerRef.current
		if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		let active = true
		let head: ReturnType<typeof mountKea3D>
		const onFail = (reason: string) => {
			if (active) setError(reason)
		}
		const body = mountKeaBody(container, {
			body: `${assets}/body.webp`,
			feathers: `${assets}/body-feathers.png`,
			cells: `${assets}/body-cells.png`,
			meta: '/experiments/kea-bird/assets/body.json',
			onFail,
		})
		async function mountHead() {
			const bodyReady = body
				? await body.ready.then(
						() => true,
						() => false
					)
				: false
			if (!active) return
			if (bodyReady) bodyRef.current = body
			head = mountKea3D(container!, {
				plate: `${assets}/${bodyReady ? 'plate-bare.webp' : 'plate.webp'}`,
				head: `${assets}/head.webp`,
				fill: `${assets}/head-fill.webp`,
				solid: `${assets}/head-solid.webp`,
				neck: `${assets}/neck.webp`,
				onFail,
			})
		}
		void mountHead()
		return () => {
			active = false
			bodyRef.current = undefined
			head?.destroy()
			body?.destroy()
			const painting = container.querySelector<HTMLImageElement>('.c-kea__painting')
			if (painting) painting.src = `${assets}/painting.webp`
		}
	}, [])

	return (
		<div className={cn('relative aspect-square w-full max-w-125 drop-shadow-md', className)}>
			<div className={styles.stamp}>
				<div className="size-full border-2 border-[#9e9784]/90 border-dashed p-2">
					<button
						ref={containerRef}
						type="button"
						aria-label="Kea parrot following your cursor. Click to ruffle its feathers."
						onClick={() => bodyRef.current?.ruffle()}
						className="relative block size-full cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4"
					>
						{/* The renderer replaces this image with its matching headless plate. */}
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							className="c-kea__painting block size-full"
							src={`${assets}/painting.webp`}
							width={2048}
							height={2048}
							alt="Kea parrot perched on a bamboo branch"
						/>
					</button>
				</div>
			</div>
			{error && (
				<span role="status" className="absolute right-8 bottom-8 left-8 text-center text-xs text-[#686e60]">
					Interactive animation is unavailable.
				</span>
			)}
		</div>
	)
}
