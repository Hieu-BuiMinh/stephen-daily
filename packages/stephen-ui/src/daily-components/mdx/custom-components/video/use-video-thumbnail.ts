'use client'

import { ALL_FORMATS, CanvasSink, Input, UrlSource } from 'mediabunny'
import { useEffect, useState } from 'react'

/**
 * Hook to generate a thumbnail from a video URL using mediabunny.
 * @param videoUrl The remote URL of the video file.
 * @param timestamp The time in seconds to extract the frame from (default: 1.5s).
 * @returns The generated thumbnail URL for the current source.
 */
export function useVideoThumbnail(videoUrl: string, timestamp: number = 1.5) {
	const [thumbnail, setThumbnail] = useState<{ source: string; timestamp: number; url: string } | null>(null)

	useEffect(() => {
		if (!videoUrl) return

		let isMounted = true
		let currentObjectUrl: string | null = null

		let input: Input | undefined

		const generate = async () => {
			try {
				input = new Input({ formats: ALL_FORMATS, source: new UrlSource(videoUrl) })
				const videoTrack = await input.getPrimaryVideoTrack()
				if (!videoTrack) {
					throw new Error('No video track found')
				}

				// 3. Ensure the browser can decode this track (WebCodecs)
				const decodable = await videoTrack.canDecode()
				if (!decodable) {
					throw new Error('WebCodecs: Video track not decodable in this browser')
				}

				// 4. Create a CanvasSink to extract frames
				// We limit width to 400px for the thumbnail to optimize performance.
				const sink = new CanvasSink(videoTrack, { width: 400 })

				// 5. Extract the canvas at the given timestamp
				const firstTimestamp = await videoTrack.getFirstTimestamp()
				const result = await sink.getCanvas(Math.max(timestamp, firstTimestamp))

				if (!isMounted) return

				if (!result || !result.canvas) {
					throw new Error('No frame found at the given timestamp')
				}

				// 6. Convert the canvas to a Blob URL for display
				// Support both HTMLCanvasElement (toBlob) and OffscreenCanvas (convertToBlob)
				const canvas = result.canvas
				let blob: Blob | null = null

				if ('toBlob' in canvas) {
					blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.8))
				} else if ('convertToBlob' in canvas) {
					blob = await canvas.convertToBlob({
						type: 'image/webp',
						quality: 0.8,
					})
				}

				if (blob && isMounted) {
					currentObjectUrl = URL.createObjectURL(blob)
					setThumbnail({ source: videoUrl, timestamp, url: currentObjectUrl })
				}
			} catch (err) {
				if (isMounted) {
					console.error(`[useVideoThumbnail] Failed for ${videoUrl}:`, err)
				}
			}
		}

		void generate()

		// Cleanup: revoke the object URL to avoid memory leaks
		return () => {
			isMounted = false
			input?.dispose()
			if (currentObjectUrl) {
				URL.revokeObjectURL(currentObjectUrl)
				setThumbnail((current) => (current?.url === currentObjectUrl ? null : current))
			}
		}
	}, [videoUrl, timestamp])

	return thumbnail?.source === videoUrl && thumbnail.timestamp === timestamp ? thumbnail.url : null
}
