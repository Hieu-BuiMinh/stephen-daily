// https://useplanes.com/components/retro-music-player

'use client'

import { cn } from '@repo/stephen-utils'
import { Pause, Play, Volume, Volume1, Volume2, VolumeX } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useId, useMemo, useRef, useState } from 'react'

import { Button } from '../../../base/button'
import { Slider } from '../../../base/slider'
import {
	AudioPlayerProvider,
	formatTime,
	useAudioPlayer,
	useAudioPlayerTime,
} from '../elevent-labs/audio-player/player'

type RetroMusicPlayerProps = { source?: string; cover?: string; className?: string }

function RetroMusicPlayer({ source, ...props }: RetroMusicPlayerProps) {
	return (
		<AudioPlayerProvider key={source}>
			<RetroMusicPlayerControls source={source} {...props} />
		</AudioPlayerProvider>
	)
}

function RetroMusicPlayerControls({ source, cover, className }: RetroMusicPlayerProps) {
	const player = useAudioPlayer()
	const time = useAudioPlayerTime()
	const { setVolume: setAudioVolume, setActiveItem } = player
	const [volume, setVolume] = useState(0.5)
	const [muted, setMuted] = useState(false)
	const [peaks, setPeaks] = useState<Float32Array | null>()
	const waveformRef = useRef<HTMLDivElement>(null)
	const [waveformWidth, setWaveformWidth] = useState(0)
	const [hoverPosition, setHoverPosition] = useState<number | null>(null)
	const noiseId = useId()
	const outlineId = `${noiseId}-outline`
	const waveformFillId = `${noiseId}-waveform`
	const outlineSeed = Array.from(noiseId).reduce((seed, character) => seed * 31 + character.charCodeAt(0), 7) >>> 0
	const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.34 ? Volume : volume < 0.67 ? Volume1 : Volume2
	const duration = player.duration && Number.isFinite(player.duration) ? player.duration : 0
	const position = Math.min(time, duration)
	const playedPercent = duration > 0 ? (position / duration) * 100 : 0
	const bars = useMemo(() => {
		if (!peaks || waveformWidth <= 0) return null

		const count = Math.max(1, Math.floor((waveformWidth + 1) / 3))
		return Array.from({ length: count }, (_, index) => {
			const start = Math.floor((index * peaks.length) / count)
			const end = Math.max(start + 1, Math.floor(((index + 1) * peaks.length) / count))
			let level = 0
			for (let bucket = start; bucket < end; bucket++) {
				level = Math.max(level, peaks[bucket]!)
			}
			const height = Math.max(2, level * 40)
			return <rect key={index} x={index * 3} y={40 - height} width={2} height={height} rx={1} />
		})
	}, [peaks, waveformWidth])
	const waveformLoading = Boolean(source) && peaks !== null && !bars

	useEffect(() => {
		const element = waveformRef.current
		if (!element) return

		const observer = new ResizeObserver(([entry]) => {
			if (entry) setWaveformWidth(entry.contentRect.width)
		})
		observer.observe(element)
		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		if (source) void setActiveItem({ id: source, src: source }).catch(console.error)
	}, [source, setActiveItem])

	useEffect(() => {
		setAudioVolume(volume, muted)
	}, [setAudioVolume, volume, muted])

	useEffect(() => {
		if (!source) return
		const request = new AbortController()
		let context: AudioContext | undefined

		async function loadWaveform(url: string) {
			try {
				const response = await fetch(url, { signal: request.signal })
				if (!response.ok) {
					if (!request.signal.aborted) setPeaks(null)
					return
				}
				if (request.signal.aborted) return
				context = new AudioContext()
				const buffer = await context.decodeAudioData(await response.arrayBuffer())
				const values = new Float32Array(512)
				let loudest = 0
				for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
					const samples = buffer.getChannelData(channel)
					for (let index = 0; index < values.length; index++) {
						const start = Math.floor((index * samples.length) / values.length)
						const end = Math.floor(((index + 1) * samples.length) / values.length)
						let peak = values[index]!
						for (let sample = start; sample < end; sample++) {
							peak = Math.max(peak, Math.abs(samples[sample]!))
						}
						values[index] = peak
						loudest = Math.max(loudest, peak)
					}
				}
				if (!request.signal.aborted) setPeaks(loudest > 0 ? values.map((peak) => peak / loudest) : values)
			} catch {
				if (!request.signal.aborted) setPeaks(null)
			}
		}
		void loadWaveform(source)

		return () => {
			request.abort()
			void context?.close()
		}
	}, [source])

	return (
		<div className={cn('relative isolate w-full min-w-0 p-1', className)}>
			<svg aria-hidden="true" focusable="false" className="pointer-events-none absolute size-0">
				<defs>
					<filter
						id={outlineId}
						x="-20%"
						y="-20%"
						width="140%"
						height="140%"
						colorInterpolationFilters="sRGB"
					>
						<feMorphology in="SourceAlpha" operator="dilate" radius="10" result="expanded" />
						<feFlood floodColor="#fff" className="dark:[flood-color:var(--color-neutral-500)]" />
						<feComposite in2="expanded" operator="in" result="outline" />
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.035 0.045"
							numOctaves="3"
							seed={(outlineSeed % 997) + 1}
							result="noise"
						/>
						<feDisplacementMap
							in="outline"
							in2="noise"
							scale="16"
							xChannelSelector="R"
							yChannelSelector="G"
						/>
						<feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.22" />
					</filter>
				</defs>
			</svg>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-1 -z-10 hidden rounded-2xl bg-muted lg:block"
				style={{ filter: `url(#${outlineId})` }}
			/>
			<div className="relative isolate flex w-full min-w-0 flex-col gap-3 rounded-2xl border border-border bg-muted p-2">
				<div className="recessed-panel relative flex shrink-0 items-center justify-center overflow-hidden border-border! after:pointer-events-none after:absolute after:inset-0 after:z-5 after:rounded-[inherit] after:shadow-[inset_0_2px_6px_rgb(0_0_0/25%)] lg:h-50 lg:border-b-0! dark:after:shadow-[inset_0_3px_9px_rgb(0_0_0/55%)]">
					<Image
						className="hidden size-full object-cover brightness-110 contrast-125 grayscale lg:block"
						src={cover || '/assets/images/fallback/02.png'}
						width={370}
						height={370}
						alt=""
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 z-5 hidden mix-blend-multiply lg:block"
						style={{
							backgroundImage:
								'radial-gradient(circle, rgb(0 0 0 / 50%) 0.65px, transparent 0.95px), radial-gradient(ellipse, transparent 50%, rgb(0 0 0 / 26%))',
							backgroundSize: '3px 3px, 100% 100%',
						}}
					/>

					<div className="flex w-full items-center justify-between gap-2 px-2 py-1.5 font-mono text-xs lg:absolute lg:inset-x-0 lg:bottom-0 lg:z-6 lg:bg-linear-to-t lg:from-black/90 lg:to-transparent lg:p-3 lg:text-white">
						<span className="flex items-center gap-1.5">
							<span className="relative flex size-1.5 shrink-0">
								{player.isPlaying && (
									<span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75 motion-reduce:animate-none" />
								)}
								<span
									className={cn(
										'relative inline-flex size-full rounded-full',
										player.isPlaying ? 'bg-green-500' : 'bg-red-500'
									)}
								/>
							</span>
							{player.isPlaying ? 'Playing' : 'Paused'}
						</span>
						<span className="shrink-0 tabular-nums">{formatTime(time)}</span>
					</div>
				</div>
				<div className="recessed-panel dot-grid border-border! px-2.5 py-2 focus-within:ring-1 focus-within:ring-brand">
					<div
						ref={waveformRef}
						aria-busy={waveformLoading}
						className="relative flex h-10 items-center"
						onPointerMove={(event) => {
							if (waveformLoading || !duration || event.pointerType === 'touch') return
							const { left, width } = event.currentTarget.getBoundingClientRect()
							setHoverPosition(Math.max(0, Math.min(1, (event.clientX - left) / width)))
						}}
						onPointerLeave={() => setHoverPosition(null)}
					>
						{waveformLoading && (
							<svg
								aria-hidden="true"
								viewBox="0 0 120 40"
								preserveAspectRatio="none"
								className="pointer-events-none absolute inset-0 size-full animate-pulse fill-muted-foreground/45 motion-reduce:animate-none"
							>
								{Array.from({ length: 30 }, (_, index) => {
									const height = 8 + ((index * 17) % 21)
									return (
										<rect
											key={index}
											x={index * 4}
											y={40 - height}
											width={2}
											height={height}
											rx={1}
										/>
									)
								})}
							</svg>
						)}
						{bars && (
							<svg
								aria-hidden="true"
								className="pointer-events-none absolute inset-0 size-full"
								viewBox={`0 0 ${waveformWidth} 40`}
								preserveAspectRatio="none"
							>
								<defs>
									<linearGradient
										id={waveformFillId}
										gradientUnits="userSpaceOnUse"
										x2={waveformWidth}
										y2={0}
									>
										<stop
											offset={`${playedPercent}%`}
											stopColor="#171717"
											className="dark:[stop-color:var(--foreground)]"
										/>
										<stop
											offset={`${playedPercent}%`}
											stopColor="#71717a"
											className="dark:[stop-color:var(--muted-foreground)]"
										/>
									</linearGradient>
								</defs>
								<g fill={`url(#${waveformFillId})`}>{bars}</g>
							</svg>
						)}
						{bars && duration > 0 && (
							<span
								aria-hidden="true"
								className="pointer-events-none absolute inset-y-0 w-px bg-brand-text"
								style={{ left: `${playedPercent}%` }}
							/>
						)}
						{hoverPosition !== null && duration > 0 && (
							<span
								aria-hidden="true"
								className="pointer-events-none absolute -top-4 z-10 -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 font-mono text-[10px] leading-none tabular-nums text-background"
								style={{ left: `clamp(1.25rem, ${hoverPosition * 100}%, calc(100% - 1.25rem))` }}
							>
								{formatTime(hoverPosition * duration)}
							</span>
						)}
						<Slider
							aria-label="Audio position"
							aria-valuetext={`${formatTime(position)} of ${formatTime(duration)}`}
							disabled={duration === 0}
							max={duration || 1}
							step={0.1}
							value={[position]}
							onValueChange={([value]) => {
								if (value !== undefined) player.seek(value)
							}}
							className={cn(
								'h-full cursor-pointer',
								waveformLoading
									? 'invisible'
									: bars
										? '**:data-[slot=slider-thumb]:opacity-0 **:data-[slot=slider-track]:opacity-0'
										: '**:data-[slot=slider-track]:bg-foreground/20'
							)}
						/>
					</div>
				</div>

				<div
					aria-hidden="true"
					className="relative z-1 grid grid-cols-[repeat(30,4px)] justify-center gap-1 overflow-hidden"
				>
					{Array.from({ length: 90 }, (_, index) => (
						<div
							key={index}
							className="aspect-square rounded-full bg-[#070707]"
							style={{
								boxShadow: '0 -0.5px 0 rgba(255, 255, 255, 0.07), 0 0 0 0.5px rgba(40, 40, 40, 0.5)',
							}}
						/>
					))}
				</div>

				<div className="flex items-center gap-3 lg:gap-4">
					<Button
						type="button"
						variant="default"
						size="icon"
						className="size-11 touch-manipulation lg:size-9"
						aria-label={player.isPlaying ? 'Pause' : 'Play'}
						disabled={!source}
						onClick={() => {
							if (player.isPlaying) player.pause()
							else if (source) void player.play().catch(console.error)
						}}
					>
						{player.isPlaying ? <Pause /> : <Play />}
					</Button>
					<div className="flex min-w-0 flex-1 items-center gap-2">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-8 rounded-full bg-foreground/5 hover:bg-foreground/10 [&_svg]:size-3.5"
							aria-label={muted ? 'Unmute' : 'Mute'}
							onClick={() => setMuted(!muted)}
						>
							<VolumeIcon />
						</Button>
						<Slider
							aria-label="Volume"
							max={1}
							step={0.01}
							value={[muted ? 0 : volume]}
							onValueChange={([value]) => {
								if (value === undefined) return
								setVolume(value)
								setMuted(false)
							}}
							className="h-8 min-w-0 flex-1 **:data-[slot=slider-range]:bg-foreground **:data-[slot=slider-thumb]:border-border **:data-[slot=slider-thumb]:bg-background **:data-[slot=slider-track]:h-1 **:data-[slot=slider-track]:bg-foreground/15"
						/>
						<span className="w-8 shrink-0 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
							{Math.round((muted ? 0 : volume) * 100)}%
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export { RetroMusicPlayer }
