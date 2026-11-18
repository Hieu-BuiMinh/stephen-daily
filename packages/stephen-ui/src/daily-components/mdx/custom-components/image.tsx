import { cn } from '@repo/stephen-utils'
import { DailyBaseImage, type DailyBaseImageProps } from '../../image'

type MDXImageProps = Omit<DailyBaseImageProps, 'alt' | 'fill' | 'width' | 'height'> & {
	width: number
	height: number
	alt?: string
	caption?: string
	imageClassName?: string
	imgClassName?: string
}

export function MDXImage({
	alt = '',
	caption = alt,
	className,
	imageClassName,
	imgClassName,
	width,
	height,
	...props
}: MDXImageProps) {
	return (
		<figure className={cn('not-prose my-5 flex flex-col items-center gap-2', className)}>
			<div className="relative max-w-full overflow-hidden" style={{ width, aspectRatio: width / height }}>
				<DailyBaseImage
					unoptimized
					preview
					{...props}
					alt={alt}
					fill
					sizes={props.sizes ?? `(max-width: ${width}px) 100vw, ${width}px`}
					className={cn('object-cover', imgClassName ?? imageClassName)}
				/>
			</div>
			{caption && <figcaption className="text-center text-sm text-muted-foreground">{caption}</figcaption>}
		</figure>
	)
}
