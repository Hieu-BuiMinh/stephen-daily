'use client'

import { cn } from '@repo/stephen-utils'
import { LinkIcon, Play } from 'lucide-react'
import { useState, type ComponentPropsWithRef } from 'react'
import { DailyButton } from '../../../button'
import { DailyBaseImage } from '../../../image'
import { DailyModal, DailyModalContent, DailyModalTitle, DailyModalTrigger } from '../../../modal'
import { useVideoThumbnail } from './use-video-thumbnail'
import { Video } from './video'

type MdxVideoProps = ComponentPropsWithRef<typeof Video> & {
	previewImage?: string
	previewImageClassName?: string
	videoClassName?: string
	description?: string
	open?: boolean
	allowSharing?: boolean
	onOpenChangeCallback?: (open: boolean) => void
}

export function MdxVideo({
	src,
	width,
	height,
	previewImage,
	poster: videoPoster,
	previewImageClassName,
	videoClassName,
	description,
	open: initiallyOpen,
	allowSharing,
	onOpenChangeCallback,
	className,
	style,
	onClick,
	...videoProps
}: MdxVideoProps) {
	const [open, setOpen] = useState(initiallyOpen ?? false)
	const explicitPoster = previewImage || videoPoster
	const thumbnailUrl = useVideoThumbnail(explicitPoster ? '' : src)
	const poster = explicitPoster || thumbnailUrl

	return (
		<DailyModal
			open={open}
			onOpenChange={(value) => {
				setOpen(value)
				onOpenChangeCallback?.(value)
			}}
		>
			<DailyModalTrigger asChild>
				<button
					type="button"
					aria-label={description ? `Play video: ${description}` : 'Play video'}
					className={cn(
						'recessed-panel not-prose group relative isolate my-4 block max-w-full cursor-pointer overflow-hidden rounded-none bg-neutral-900 bg-clip-padding text-white focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
						className
					)}
					style={{ ...style, width, height: 'auto', maxWidth: '100%', aspectRatio: width / height }}
				>
					{poster && (
						<DailyBaseImage
							key={poster}
							src={poster}
							alt=""
							fill
							sizes={`(max-width: ${width}px) 100vw, ${width}px`}
							unoptimized
							className={cn('object-cover', previewImageClassName)}
						/>
					)}
					<span
						aria-hidden="true"
						className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-black/10"
					/>
					<Play
						aria-hidden="true"
						className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 fill-white/25 drop-shadow-sm transition-transform group-hover:scale-110 motion-reduce:transition-none"
					/>
					{description && (
						<span className="absolute inset-x-3 bottom-3 text-left text-sm font-semibold italic">
							{description}
						</span>
					)}
				</button>
			</DailyModalTrigger>
			<DailyModalContent
				aria-describedby={undefined}
				showCloseButton={false}
				overlayClassName="bg-black/65 backdrop-blur-sm"
				className="w-fit max-w-[calc(100%-2rem)] overflow-hidden rounded-xl border-white/30 bg-black p-0 shadow-2xl sm:max-w-[calc(100%-2rem)]"
			>
				<DailyModalTitle className="sr-only">{description || 'Video player'}</DailyModalTitle>
				{allowSharing && (
					<DailyButton
						iconOnly
						icon={<LinkIcon />}
						className="absolute top-4 left-4 z-10 rounded-md border-white/25 bg-black/65 text-white shadow-md hover:bg-black/85"
						onAction={() => navigator.clipboard.writeText(window.location.href)}
						successLabel="Link copied"
					>
						Copy video link
					</DailyButton>
				)}
				<Video
					{...videoProps}
					src={src}
					width={width}
					height={height}
					poster={poster ?? undefined}
					controlsList={videoProps.controlsList ?? 'nofullscreen'}
					className={cn(
						'block max-h-[min(80svh,42rem)] w-auto max-w-full rounded-none object-contain shadow-none',
						videoClassName
					)}
					onClick={
						onClick ??
						((event) => {
							const video = event.currentTarget
							if (video.paused) void video.play().catch(() => {})
							else video.pause()
						})
					}
				/>
			</DailyModalContent>
		</DailyModal>
	)
}
