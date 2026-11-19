'use client'

import { cn } from '@repo/stephen-utils'
import { forwardRef, useEffect, useRef } from 'react'

type TVideoProps = {
	src: string
	width: number
	height: number
} & React.ComponentPropsWithoutRef<'video'>

const Video = forwardRef<HTMLVideoElement, TVideoProps>((props, ref) => {
	const { src, width, height, controls = true, className, ...rest } = props

	const videoRef = useRef<HTMLVideoElement>(null)

	const combinedRef = ref || videoRef

	useEffect(() => {
		if (combinedRef && 'current' in combinedRef && combinedRef.current) {
			combinedRef.current.volume = 0.5
			combinedRef.current.autoplay = true
		}
	}, [combinedRef])

	return (
		// eslint-disable-next-line jsx-a11y/media-has-caption -- Caption tracks are supplied as children by the MDX author.
		<video
			className={cn('rounded-lg shadow-lg', className)}
			loop
			ref={combinedRef}
			src={src}
			controls={controls}
			width={width}
			height={height}
			{...rest}
		/>
	)
})

Video.displayName = 'Video'

export { Video }
