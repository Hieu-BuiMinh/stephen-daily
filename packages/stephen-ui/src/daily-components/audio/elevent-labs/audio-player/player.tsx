/**
 * primitives (MIT License)
 * Copyright (c) elevenlabs.io: https://ui.elevenlabs.io/blocks
 * Source:
 *  - https://ui.elevenlabs.io/blocks
 *  - https://v0.app/chat/open-in-v0-ENkTLjoKpy2
 *
 * Modified by: Stephen
 */

'use client'

import { Slider as SliderPrimitive } from 'radix-ui'
import { cn } from '@repo/stephen-utils'
import type { buttonVariants } from '../../../../base/button'
import { Button } from '../../../../base/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../../../base/dropdown-menu'
import type { VariantProps } from 'class-variance-authority'
import { Check, PauseIcon, PlayIcon, Settings } from 'lucide-react'
import type { ComponentProps, HTMLProps, ReactNode, RefObject } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

export function formatTime(seconds: number) {
	const hrs = Math.floor(seconds / 3600)
	const mins = Math.floor((seconds % 3600) / 60)
	const secs = Math.floor(seconds % 60)

	const formattedMins = mins < 10 ? `0${mins}` : mins
	const formattedSecs = secs < 10 ? `0${secs}` : secs

	return hrs > 0 ? `${hrs}:${formattedMins}:${formattedSecs}` : `${mins}:${formattedSecs}`
}

interface AudioPlayerItem<TData = unknown> {
	id: string | number
	src: string
	data?: TData
}

interface AudioPlayerApi<TData = unknown> {
	ref: RefObject<HTMLAudioElement | null>
	activeItem: AudioPlayerItem<TData> | null
	duration: number | undefined
	error: MediaError | null
	isPlaying: boolean
	isBuffering: boolean
	playbackRate: number
	isItemActive: (id: string | number | null) => boolean
	setActiveItem: (item: AudioPlayerItem<TData> | null) => Promise<void>
	play: (item?: AudioPlayerItem<TData> | null) => Promise<void>
	pause: () => void
	seek: (time: number) => void
	setPlaybackRate: (rate: number) => void
	setVolume: (volume: number, muted: boolean) => void
}

const AudioPlayerContext = createContext<AudioPlayerApi<unknown> | null>(null)

export function useAudioPlayer<TData = unknown>(): AudioPlayerApi<TData> {
	const api = useContext(AudioPlayerContext) as AudioPlayerApi<TData> | null
	if (!api) {
		throw new Error('useAudioPlayer cannot be called outside of AudioPlayerProvider')
	}
	return api
}

const AudioPlayerTimeContext = createContext<number | null>(null)

export const useAudioPlayerTime = () => {
	const time = useContext(AudioPlayerTimeContext)
	if (time === null) {
		throw new Error('useAudioPlayerTime cannot be called outside of AudioPlayerProvider')
	}
	return time
}

export function AudioPlayerProvider<TData = unknown>({ children }: { children: ReactNode }) {
	const audioRef = useRef<HTMLAudioElement>(null)
	const itemRef = useRef<AudioPlayerItem<TData> | null>(null)
	const playPromiseRef = useRef<Promise<void> | null>(null)
	const [isBuffering, setIsBuffering] = useState(false)
	const [time, setTime] = useState<number>(0)
	const [duration, setDuration] = useState<number | undefined>(undefined)
	const [error, setError] = useState<MediaError | null>(null)
	const [activeItem, _setActiveItem] = useState<AudioPlayerItem<TData> | null>(null)
	const [paused, setPaused] = useState(true)
	const [playbackRate, setPlaybackRateState] = useState<number>(1)

	// Keep the Promise contract so callers can catch failures from the media element.
	// eslint-disable-next-line @typescript-eslint/require-await
	const setActiveItem = useCallback(async (item: AudioPlayerItem<TData> | null) => {
		if (!audioRef.current) return

		if (item?.id === itemRef.current?.id) {
			return
		}
		itemRef.current = item
		const currentRate = audioRef.current.playbackRate
		audioRef.current.pause()
		audioRef.current.currentTime = 0
		if (item === null) {
			audioRef.current.removeAttribute('src')
		} else {
			audioRef.current.src = item.src
		}
		audioRef.current.load()
		audioRef.current.playbackRate = currentRate
	}, [])

	const play = useCallback(
		async (item?: AudioPlayerItem<TData> | null) => {
			if (!audioRef.current) return

			if (playPromiseRef.current) {
				try {
					await playPromiseRef.current
				} catch (error) {
					console.error('Play promise error:', error)
				}
			}

			if (item === undefined) {
				const playPromise = audioRef.current.play()
				playPromiseRef.current = playPromise
				return playPromise
			}
			if (item?.id === activeItem?.id) {
				const playPromise = audioRef.current.play()
				playPromiseRef.current = playPromise
				return playPromise
			}

			itemRef.current = item
			const currentRate = audioRef.current.playbackRate
			if (!audioRef.current.paused) {
				audioRef.current.pause()
			}
			audioRef.current.currentTime = 0
			if (item === null) {
				audioRef.current.removeAttribute('src')
			} else {
				audioRef.current.src = item.src
			}
			audioRef.current.load()
			audioRef.current.playbackRate = currentRate
			const playPromise = audioRef.current.play()
			playPromiseRef.current = playPromise
			return playPromise
		},
		[activeItem]
	)

	const pause = useCallback(() => {
		const audio = audioRef.current
		if (!audio) return

		const pendingPlayback = playPromiseRef.current
		const pauseAudio = () => {
			if (audioRef.current !== audio || playPromiseRef.current !== pendingPlayback) return
			audio.pause()
			playPromiseRef.current = null
		}
		if (pendingPlayback) void pendingPlayback.catch(console.error).then(pauseAudio)
		else pauseAudio()
	}, [])

	const seek = useCallback((time: number) => {
		if (!audioRef.current) return
		audioRef.current.currentTime = time
	}, [])

	const setPlaybackRate = useCallback((rate: number) => {
		if (!audioRef.current) return
		audioRef.current.playbackRate = rate
		setPlaybackRateState(rate)
	}, [])

	const setVolume = useCallback((volume: number, muted: boolean) => {
		if (!audioRef.current) return
		audioRef.current.volume = volume
		audioRef.current.muted = muted
	}, [])

	const isItemActive = useCallback(
		(id: string | number | null) => {
			return activeItem?.id === id
		},
		[activeItem]
	)

	useAnimationFrame(() => {
		const audio = audioRef.current
		if (audio) {
			_setActiveItem(itemRef.current)
			setIsBuffering(audio.readyState < audio.HAVE_FUTURE_DATA && audio.networkState === audio.NETWORK_LOADING)
			setTime(audio.currentTime)
			setDuration(Number.isFinite(audio.duration) ? audio.duration : undefined)
			setPaused(audio.paused)
			setError(audio.error)
			setPlaybackRateState(audio.playbackRate)
		}
	})

	const isPlaying = !paused

	const api = useMemo<AudioPlayerApi<TData>>(
		() => ({
			ref: audioRef,
			duration,
			error,
			isPlaying,
			isBuffering,
			activeItem,
			playbackRate,
			isItemActive,
			setActiveItem,
			play,
			pause,
			seek,
			setPlaybackRate,
			setVolume,
		}),
		[
			audioRef,
			duration,
			error,
			isPlaying,
			isBuffering,
			activeItem,
			playbackRate,
			isItemActive,
			setActiveItem,
			play,
			pause,
			seek,
			setPlaybackRate,
			setVolume,
		]
	)

	return (
		<AudioPlayerContext.Provider value={api as AudioPlayerApi<unknown>}>
			<AudioPlayerTimeContext.Provider value={time}>
				{/* The provider owns a hidden media element; the calling UI supplies the controls. */}
				{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
				<audio ref={audioRef} className="hidden" crossOrigin="anonymous" />
				{children}
			</AudioPlayerTimeContext.Provider>
		</AudioPlayerContext.Provider>
	)
}

export const AudioPlayerProgress = ({
	...otherProps
}: Omit<ComponentProps<typeof SliderPrimitive.Root>, 'min' | 'max' | 'value'>) => {
	const player = useAudioPlayer()
	const time = useAudioPlayerTime()
	const wasPlayingRef = useRef(false)

	return (
		<SliderPrimitive.Root
			{...otherProps}
			value={[time]}
			onValueChange={(vals) => {
				player.seek(vals[0] || 0)
				otherProps.onValueChange?.(vals)
			}}
			min={0}
			max={player.duration ?? 0}
			step={otherProps.step || 0.25}
			onPointerDown={(e) => {
				wasPlayingRef.current = player.isPlaying
				player.pause()
				otherProps.onPointerDown?.(e)
			}}
			onPointerUp={(e) => {
				if (wasPlayingRef.current) {
					void player.play().catch(console.error)
				}
				otherProps.onPointerUp?.(e)
			}}
			className={cn(
				'group/player relative flex h-4 touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
				otherProps.className
			)}
			onKeyDown={(e) => {
				if (e.key === ' ') {
					e.preventDefault()
					if (!player.isPlaying) {
						void player.play().catch(console.error)
					} else {
						player.pause()
					}
				}
				otherProps.onKeyDown?.(e)
			}}
			disabled={
				player.duration === undefined || !Number.isFinite(player.duration) || Number.isNaN(player.duration)
			}
		>
			<SliderPrimitive.Track className="bg-foreground/10 relative h-1 w-full grow overflow-hidden rounded-full">
				<SliderPrimitive.Range className="bg-primary absolute h-full" />
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb
				className="relative flex h-0 w-0 items-center justify-center opacity-0 group-hover/player:opacity-100 focus-visible:opacity-100 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
				data-slot="slider-thumb"
			>
				<div className="bg-foreground absolute size-3 rounded-full" />
			</SliderPrimitive.Thumb>
		</SliderPrimitive.Root>
	)
}

export const AudioPlayerTime = ({ className, ...otherProps }: HTMLProps<HTMLSpanElement>) => {
	const time = useAudioPlayerTime()
	return (
		<span {...otherProps} className={cn('text-muted-foreground text-sm tabular-nums', className)}>
			{formatTime(time)}
		</span>
	)
}

export const AudioPlayerDuration = ({ className, ...otherProps }: HTMLProps<HTMLSpanElement>) => {
	const player = useAudioPlayer()
	return (
		<span {...otherProps} className={cn('text-muted-foreground text-sm tabular-nums', className)}>
			{player.duration !== null && player.duration !== undefined && !Number.isNaN(player.duration)
				? formatTime(player.duration)
				: '--:--'}
		</span>
	)
}

interface SpinnerProps {
	className?: string
}

function Spinner({ className }: SpinnerProps) {
	return (
		<div
			className={cn('border-muted border-t-foreground size-3.5 animate-spin rounded-full border-2', className)}
			role="status"
			aria-label="Loading"
		>
			<span className="sr-only">Loading...</span>
		</div>
	)
}

interface PlayButtonProps extends React.ComponentProps<typeof Button> {
	playing: boolean
	onPlayingChange: (playing: boolean) => void
	loading?: boolean
	onClick?: React.MouseEventHandler<HTMLButtonElement>
	className?: string
}

const PlayButton = ({ playing, onPlayingChange, className, onClick, loading, ...otherProps }: PlayButtonProps) => {
	return (
		<Button
			{...otherProps}
			onClick={(e) => {
				onPlayingChange(!playing)
				onClick?.(e)
			}}
			className={cn('relative', className)}
			aria-label={playing ? 'Pause' : 'Play'}
			type="button"
		>
			{playing ? (
				<PauseIcon className={cn('size-4', loading && 'opacity-0')} aria-hidden="true" />
			) : (
				<PlayIcon className={cn('size-4', loading && 'opacity-0')} aria-hidden="true" />
			)}
			{loading && (
				<div className="absolute inset-0 flex items-center justify-center rounded-[inherit] backdrop-blur-xs">
					<Spinner />
				</div>
			)}
		</Button>
	)
}

export interface AudioPlayerButtonProps<TData = unknown> extends React.ComponentProps<typeof Button> {
	item?: AudioPlayerItem<TData>
}

export function AudioPlayerButton<TData = unknown>({ item, ...otherProps }: AudioPlayerButtonProps<TData>) {
	const player = useAudioPlayer<TData>()

	if (!item) {
		return (
			<PlayButton
				{...otherProps}
				playing={player.isPlaying}
				onPlayingChange={(shouldPlay) => {
					if (shouldPlay) {
						void player.play().catch(console.error)
					} else {
						player.pause()
					}
				}}
				loading={player.isBuffering && player.isPlaying}
			/>
		)
	}

	return (
		<PlayButton
			{...otherProps}
			playing={player.isItemActive(item.id) && player.isPlaying}
			onPlayingChange={(shouldPlay) => {
				if (shouldPlay) {
					void player.play(item).catch(console.error)
				} else {
					player.pause()
				}
			}}
			loading={player.isItemActive(item.id) && player.isBuffering && player.isPlaying}
		/>
	)
}

type Callback = (delta: number) => void

function useAnimationFrame(callback: Callback) {
	const requestRef = useRef<number | null>(null)
	const previousTimeRef = useRef<number | null>(null)
	const callbackRef = useRef<Callback>(callback)

	useEffect(() => {
		callbackRef.current = callback
	}, [callback])

	useEffect(() => {
		const animate = (time: number) => {
			if (previousTimeRef.current !== null) {
				const delta = time - previousTimeRef.current
				callbackRef.current(delta)
			}
			previousTimeRef.current = time
			requestRef.current = requestAnimationFrame(animate)
		}

		requestRef.current = requestAnimationFrame(animate)

		return () => {
			if (requestRef.current) cancelAnimationFrame(requestRef.current)
			previousTimeRef.current = null
		}
	}, [])
}

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const

export interface AudioPlayerSpeedProps extends React.ComponentProps<typeof Button> {
	speeds?: readonly number[]
	variant?: VariantProps<typeof buttonVariants>['variant']
	size?: VariantProps<typeof buttonVariants>['size']
	className?: string
}

export function AudioPlayerSpeed({
	speeds = PLAYBACK_SPEEDS,
	className,
	variant = 'ghost',
	size = 'icon',
	...props
}: AudioPlayerSpeedProps) {
	const player = useAudioPlayer()
	const currentSpeed = player.playbackRate

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={variant} size={size} className={cn(className)} aria-label="Playback speed" {...props}>
					<Settings className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-30">
				{speeds.map((speed) => (
					<DropdownMenuItem
						key={speed}
						onClick={() => player.setPlaybackRate(speed)}
						className="flex items-center justify-between"
					>
						<span className={speed === 1 ? '' : 'font-mono'}>{speed === 1 ? 'Normal' : `${speed}x`}</span>
						{currentSpeed === speed && <Check className="size-4" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export interface AudioPlayerSpeedButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	speeds?: readonly number[]
}

export function AudioPlayerSpeedButtonGroup({
	speeds = [0.5, 1, 1.5, 2],
	className,
	...props
}: AudioPlayerSpeedButtonGroupProps) {
	const player = useAudioPlayer()
	const currentSpeed = player.playbackRate

	return (
		<div
			className={cn('flex items-center gap-1', className)}
			role="group"
			aria-label="Playback speed controls"
			{...props}
		>
			{speeds.map((speed) => (
				<Button
					key={speed}
					variant={currentSpeed === speed ? 'default' : 'outline'}
					size="sm"
					onClick={() => player.setPlaybackRate(speed)}
					className="min-w-12.5 font-mono text-xs"
				>
					{speed}x
				</Button>
			))}
		</div>
	)
}

export const exampleTracks = [
	{
		id: '0',
		name: 'II - 00',
		url: 'https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/00.mp3',
	},
	{
		id: '1',
		name: 'II - 01',
		url: 'https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/01.mp3',
	},
	{
		id: '2',
		name: 'II - 02',
		url: 'https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/02.mp3',
	},
	{
		id: '3',
		name: 'II - 03',
		url: 'https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/03.mp3',
	},
	{
		id: '4',
		name: 'II - 04',
		url: 'https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/04.mp3',
	},
	{
		id: '5',
		name: 'II - 05',
		url: 'https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/05.mp3',
	},
	{
		id: '6',
		name: 'II - 06',
		url: 'https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/06.mp3',
	},
	{
		id: '7',
		name: 'II - 07',
		url: 'https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/07.mp3',
	},
	{
		id: '8',
		name: 'II - 08',
		url: 'https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/08.mp3',
	},
	{
		id: '9',
		name: 'II - 09',
		url: 'https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/09.mp3',
	},
]
