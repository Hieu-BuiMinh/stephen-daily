/**
 * Adapted from: https://github.com/fuma-nama/fumadocs/blob/82c273917280f63da95687852135f89a08593e71/packages/ui/src/components/heading.tsx
 */
import { cn } from '@repo/stephen-utils'
import { LinkIcon } from 'lucide-react'

type Types = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingProps<T extends Types> = Omit<React.ComponentPropsWithoutRef<T>, 'as'> & {
	as?: T
}

const Heading = <T extends Types = 'h1'>(props: HeadingProps<T>) => {
	const { as, className, children, id, ...rest } = props
	const Component = as ?? 'h1'

	return (
		<Component className={cn('relative', className)} id={id} {...rest}>
			<span className="not-prose group flex items-start gap-2">
				{as === 'h2' && <HashTag className="size-4 mt-1.5 opacity-80 shrink-0" />}
				{children}
				{id && (
					<a
						href={`#${encodeURIComponent(id)}`}
						aria-label="Link to section"
						className="ml-2 mt-1.5 shrink-0 text-muted-foreground opacity-0 transition-opacity after:absolute after:inset-0 group-hover:opacity-100 focus-visible:opacity-100"
					>
						<LinkIcon aria-hidden="true" className="size-4" />
					</a>
				)}
			</span>
		</Component>
	)
}

export default Heading

const HashTag = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg {...props} width="41" height="38" viewBox="0 0 41 38" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M16.8694 2.52136L9.30717 35.2912M6.0108 11.344H37.5205M30.7339 2.52136L23.1716 35.2912M2.52051 26.4686H34.0303"
				stroke="currentColor"
				strokeWidth="5.04152"
				strokeLinecap="round"
			/>
		</svg>
	)
}
