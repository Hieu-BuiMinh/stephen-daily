import type { ComponentProps, ReactNode } from 'react'

export type HeaderContentProps = Omit<ComponentProps<'header'>, 'title' | 'children'> & {
	title: ReactNode
	subtitle?: ReactNode
	eyebrow?: ReactNode
	actions?: ReactNode
	headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	titleId?: string
	titleClassName?: string
	subtitleClassName?: string
}
