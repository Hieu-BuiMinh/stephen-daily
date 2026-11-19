'use client'

import { Download } from 'lucide-react'
import { domToJpeg, domToPng, domToSvg, domToWebp } from 'modern-screenshot'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

import { Button } from '../../base/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../base/select'
import type { IHexagram } from './hexagram-origin'
import { Hexagram } from './hexagram-origin'

interface HexagramToImageProps extends IHexagram {
	width?: number
	padding?: number
}

type ExportFormat = 'png' | 'jpeg' | 'webp' | 'svg'
const exporters = { png: domToPng, jpeg: domToJpeg, webp: domToWebp, svg: domToSvg }

export function HexagramToImage({
	upper,
	lower,
	actives,
	showResultHexagram,
	showBranches,
	showElements,
	showHexagramName,
	showHiddenRelative,
	showIndex,
	showLabel,
	showOriginFamily,
	showQuestionerAndQuestion,
	showCreatures,
	showSixCreatures,
	showSixRelatives,
	width = 1200,
	padding = 50,
	animated = false,
	...rest
}: HexagramToImageProps) {
	const { resolvedTheme } = useTheme()
	const containerRef = useRef<HTMLDivElement>(null)
	const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png')
	const [exportedImage, setExportedImage] = useState<string | null>(null)

	useEffect(() => {
		let cancelled = false
		const autoExport = async () => {
			if (!containerRef.current) return

			try {
				const dataUrl = await domToPng(containerRef.current, {
					quality: 1,
					scale: 2,
					backgroundColor: getComputedStyle(containerRef.current).backgroundColor,
				})
				if (!cancelled) setExportedImage(dataUrl)
			} catch (err) {
				console.error('Auto export failed:', err)
			}
		}

		const timer = setTimeout(() => void autoExport(), 500)
		return () => {
			cancelled = true
			clearTimeout(timer)
		}
	}, [
		upper,
		lower,
		actives,
		showResultHexagram,
		showBranches,
		showElements,
		showHexagramName,
		showHiddenRelative,
		showIndex,
		showLabel,
		showOriginFamily,
		showQuestionerAndQuestion,
		showCreatures,
		showSixCreatures,
		showSixRelatives,
		resolvedTheme,
		width,
		padding,
	])

	const handleDownload = async () => {
		const element = containerRef.current
		if (!element) return

		try {
			const link = document.createElement('a')
			link.download = `hexagram-${upper}-${lower}.${selectedFormat === 'jpeg' ? 'jpg' : selectedFormat}`
			link.href = await exporters[selectedFormat](element, {
				quality: 1,
				scale: 2,
				backgroundColor: getComputedStyle(element).backgroundColor,
			})
			link.click()
		} catch (error) {
			console.error('Hexagram export failed:', error)
		}
	}

	return (
		<div className="">
			{/* Hidden container for rendering */}
			<div className="absolute opacity-0 -left-[9999px]">
				<div
					ref={containerRef}
					className="bg-background inline-block"
					style={{ width: `${width}px`, padding: `${padding}px` }}
				>
					<Hexagram
						upper={upper}
						lower={lower}
						actives={actives}
						showResultHexagram={showResultHexagram}
						showBranches={showBranches}
						showElements={showElements}
						showHexagramName={showHexagramName}
						showHiddenRelative={showHiddenRelative}
						showIndex={showIndex}
						showLabel={showLabel}
						showOriginFamily={showOriginFamily}
						showQuestionerAndQuestion={showQuestionerAndQuestion}
						showCreatures={showCreatures}
						showSixCreatures={showSixCreatures}
						showSixRelatives={showSixRelatives}
						animated={animated}
						{...rest}
					/>
				</div>
			</div>

			{/* Preview Image */}
			{exportedImage && (
				<div className="flex flex-col items-end gap-3">
					<img src={exportedImage} alt="Hexagram Preview" className="max-w-full h-auto" />

					{/* Controls */}
					<div className="flex items-center gap-3 flex-wrap">
						<Select
							value={selectedFormat}
							onValueChange={(value) => setSelectedFormat(value as ExportFormat)}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select format" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="png">PNG</SelectItem>
								<SelectItem value="jpeg">JPEG</SelectItem>
								<SelectItem value="webp">WebP</SelectItem>
							</SelectContent>
						</Select>

						<Button onClick={() => void handleDownload()} disabled={!exportedImage}>
							<Download className="size-4 shrink-0" />
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}

/*
USAGE:
<HexagramToImage
	upper={1}
	lower={5}
	actives={[1, 5]}
	showResultHexagram
	showElements
	showHexagramName
	showHiddenRelative
	showIndex
	showLabel
	showOriginFamily
	showQuestionerAndQuestion
	showSixCreatures
	showSixRelatives
	width={1200}
	padding={20}
/>

FEATURES:
- Auto-generates PNG preview on mount
- Select format: PNG, JPEG, WebP, SVG
- Download button
- Hidden render container (doesn't show Hexagram twice)
- Responsive to theme changes
*/
