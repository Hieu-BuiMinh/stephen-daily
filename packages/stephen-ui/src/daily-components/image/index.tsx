'use client'

import NextImage from 'next/image'
import { ImageOff } from 'lucide-react'
import { useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@repo/stephen-utils'
import {
	DailyModal,
	DailyModalContent,
	DailyModalHeader,
	DailyModalTitle,
	DailyModalBody,
	DailyModalTrigger,
} from '../modal'
import { DailySkeleton } from '../skeleton'

export type DailyBaseImageProps = ComponentProps<typeof NextImage> & {
	fallbackSrc?: ComponentProps<typeof NextImage>['src']
	containerClassName?: string
	preview?: boolean
	previewTitle?: ReactNode
	modalProps?: Omit<ComponentProps<typeof DailyModalContent>, 'children'>
}

type ImageStatus = 'loading' | 'loaded' | 'fallback-loading' | 'fallback-loaded' | 'failed'

function ImageContent({
	src,
	alt,
	fallbackSrc = '/assets/images/fallback/01.png',
	containerClassName,
	className,
	preview = false,
	previewTitle = alt || 'Image preview',
	modalProps,
	onLoad,
	onError,
	...props
}: DailyBaseImageProps) {
	const [status, setStatus] = useState<ImageStatus>('loading')
	const [open, setOpen] = useState(false)
	const loading = status === 'loading' || status === 'fallback-loading'
	const failed = status === 'fallback-loading' || status === 'fallback-loaded' || status === 'failed'
	const canPreview = status === 'loaded'
	const staticImage = typeof src === 'string' ? undefined : 'default' in src ? src.default : src

	const image = (
		<NextImage
			{...props}
			key={failed ? 'fallback' : 'original'}
			src={failed ? fallbackSrc : src}
			alt={alt}
			width={props.width ?? (!props.fill ? staticImage?.width : undefined)}
			height={props.height ?? (!props.fill ? staticImage?.height : undefined)}
			preload={failed ? false : props.preload}
			priority={failed ? false : props.priority}
			overrideSrc={failed ? undefined : props.overrideSrc}
			placeholder={failed ? 'empty' : props.placeholder}
			unoptimized={failed ? true : props.unoptimized}
			className={cn(
				'block transition-[filter,opacity] duration-300 motion-reduce:transition-none',
				!props.fill && 'h-auto max-w-full',
				loading && 'opacity-40 blur-sm',
				status === 'failed' && 'invisible',
				className
			)}
			onLoad={(event) => {
				setStatus(failed ? 'fallback-loaded' : 'loaded')
				onLoad?.(event)
			}}
			onError={(event) => {
				setStatus(failed ? 'failed' : 'fallback-loading')
				setOpen(false)
				onError?.(event)
			}}
		/>
	)

	return (
		<div
			data-slot="base-image"
			data-state={status}
			aria-busy={loading}
			className={cn(
				'relative inline-block max-w-full align-middle',
				props.fill && 'absolute inset-0 block size-full',
				containerClassName
			)}
		>
			{preview ? (
				<DailyModal open={open && canPreview} onOpenChange={setOpen}>
					<DailyModalTrigger asChild>
						<button
							type="button"
							disabled={!canPreview}
							aria-label={alt ? `View image: ${alt}` : 'View image'}
							className="block size-full cursor-zoom-in border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default"
						>
							{image}
						</button>
					</DailyModalTrigger>
					<DailyModalContent
						aria-describedby={undefined}
						{...modalProps}
						className={cn('sm:max-w-5xl', modalProps?.className)}
					>
						<DailyModalHeader>
							<DailyModalTitle className="truncate text-base sm:text-lg">{previewTitle}</DailyModalTitle>
						</DailyModalHeader>
						<DailyModalBody className="p-2">
							<div className="relative h-[75svh] min-h-0">
								<NextImage
									src={src}
									alt={alt}
									fill
									sizes="(min-width: 1024px) 1024px, 100vw"
									loader={props.loader}
									quality={props.quality}
									unoptimized={props.unoptimized}
									className="object-contain"
									onError={() => {
										setStatus('fallback-loading')
										setOpen(false)
									}}
								/>
							</div>
						</DailyModalBody>
					</DailyModalContent>
				</DailyModal>
			) : (
				image
			)}
			{loading && (
				<DailySkeleton
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 opacity-60 motion-reduce:animate-none"
				/>
			)}
			{status === 'failed' && (
				<span
					role="img"
					aria-label={alt ? `${alt} unavailable` : 'Image unavailable'}
					className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground"
				>
					<ImageOff aria-hidden="true" className="size-6" />
				</span>
			)}
		</div>
	)
}

export function DailyBaseImage(props: DailyBaseImageProps) {
	const source =
		typeof props.src === 'string' ? props.src : 'default' in props.src ? props.src.default.src : props.src.src

	return <ImageContent key={source} {...props} />
}

export default DailyBaseImage
