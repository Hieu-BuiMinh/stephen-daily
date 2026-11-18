import Link from 'next/link'
import type { ComponentType } from 'react'
import * as runtime from 'react/jsx-runtime'
import type { Body, MDXComponents } from 'stephen-contents/types'
import Heading from './custom-components/heading'
import { MDXImage } from './custom-components/image'

const defaultComponents = {
	h2: (props: React.ComponentPropsWithoutRef<'h2'>) => <Heading as="h2" {...props} />,
	h3: (props: React.ComponentPropsWithoutRef<'h3'>) => <Heading as="h3" {...props} />,
	h4: (props: React.ComponentPropsWithoutRef<'h4'>) => <Heading as="h4" {...props} />,
	h5: (props: React.ComponentPropsWithoutRef<'h5'>) => <Heading as="h5" {...props} />,
	h6: (props: React.ComponentPropsWithoutRef<'h6'>) => <Heading as="h6" {...props} />,
	hr: () => <hr className="w-full h-px border-t border-dashed border-foreground/60 dark:border-border" />,
	a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
		const { children, href, ...rest } = props

		if (!href) {
			return (
				<span className="font-medium text-brand hover:text-foreground" {...rest}>
					{children}
				</span>
			)
		}

		return (
			<Link className="font-medium text-brand hover:text-foreground" href={href} {...rest}>
				{children}
			</Link>
		)
	},
	Image: MDXImage,
} satisfies MDXComponents

export type MDXContentProps = {
	code: Body
	components?: MDXComponents
}

export function MDXContent({ code, components }: MDXContentProps) {
	if (!code) return <p className="py-5">This article is being updated.</p>

	// Velite emits a function body; only evaluate MDX compiled from this repository.
	// eslint-disable-next-line @typescript-eslint/no-implied-eval
	const evaluate = new Function(code) as (runtime: typeof import('react/jsx-runtime')) => {
		default: ComponentType<{ components?: MDXComponents }>
	}
	const Content = evaluate(runtime).default
	return <Content components={{ ...defaultComponents, ...components }} />
}
