'use client'

import { useEffect, useRef, useState, type ComponentProps, type ElementType, type ReactNode } from 'react'
import { RoughNotation, RoughNotationGroup } from 'react-rough-notation'

type AnnotationProps = ComponentProps<typeof RoughNotation>
export type MdxRoughMarkType = AnnotationProps['type']
export type MdxRoughMarkProps = Omit<AnnotationProps, 'type' | 'customElement' | 'getAnnotationObject'> & {
	type?: MdxRoughMarkType
	triggerOnView?: boolean
	triggerOnce?: boolean
	viewportMargin?: string
	viewportThreshold?: number
	as?: ElementType<{ className?: string; children?: ReactNode }>
	className?: string
}

export function MdxRoughMark({
	children,
	type = 'underline',
	show = true,
	color = 'var(--color-sky-600)',
	animationDelay = 300,
	triggerOnView = true,
	triggerOnce = true,
	viewportMargin = '0px 0px -10% 0px',
	viewportThreshold = 0.1,
	as: Comp = 'span',
	className,
	...annotationProps
}: MdxRoughMarkProps) {
	const wrapperRef = useRef<HTMLSpanElement>(null)
	const [inView, setInView] = useState(false)

	useEffect(() => {
		const el = wrapperRef.current
		if (!triggerOnView || !el) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry) return

				const visible = entry.isIntersecting && entry.intersectionRatio >= viewportThreshold
				setInView(visible)
				if (visible && triggerOnce) observer.disconnect()
			},
			{
				root: null,
				rootMargin: viewportMargin,
				threshold: viewportThreshold,
			}
		)

		observer.observe(el)

		return () => {
			observer.disconnect()
		}
	}, [triggerOnView, triggerOnce, viewportMargin, viewportThreshold])

	return (
		<RoughNotation
			{...annotationProps}
			type={type}
			show={show && (!triggerOnView || inView)}
			color={color}
			animationDelay={animationDelay}
		>
			<span ref={wrapperRef}>
				<Comp className={className}>{children}</Comp>
			</span>
		</RoughNotation>
	)
}

export type MdxRoughMarkGroupProps = ComponentProps<typeof RoughNotationGroup>

export function MdxRoughMarkGroup({ children, show = true }: MdxRoughMarkGroupProps) {
	return <RoughNotationGroup show={show}>{children}</RoughNotationGroup>
}
