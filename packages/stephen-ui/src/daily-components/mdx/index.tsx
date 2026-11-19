import Link from 'next/link'
import type { ComponentType, JSX, JSXElementConstructor } from 'react'
import * as runtime from 'react/jsx-runtime'
import type { Body } from 'stephen-contents/types'
import { Bagua, FiveElementsDiagram, Hexagram, Tetragram, YinYang } from '../../i-ching-components'
import { GridRow } from '../grids/grid-row'
import { GridRowStriped } from '../grids/grid-row-striped'
import { GridSeparator } from '../grids/grid-separator'
import { MdxAvatarCardStack, MdxCardStack } from './custom-components/image/image-card-stack'
import { MdxSVGIcons } from '../icons'
import { MdxCodeBlock } from './custom-components/code-block'
import { MdxHeading } from './custom-components/heading'
import { MdxImage } from './custom-components/image'
import { MdxRoughMark, MdxRoughMarkGroup } from './custom-components/rough'
import { MdxTable } from './custom-components/table'
import { MdxVideo } from './custom-components/video'

type MDXComponents = {
	[name: string]: JSXElementConstructor<never> | keyof JSX.IntrinsicElements | MDXComponents | undefined
} & {
	[Tag in keyof JSX.IntrinsicElements]?:
		JSXElementConstructor<JSX.IntrinsicElements[Tag]> | keyof JSX.IntrinsicElements
}

const defaultComponents = {
	h2: (props: React.ComponentPropsWithoutRef<'h2'>) => <MdxHeading as="h2" {...props} />,
	h3: (props: React.ComponentPropsWithoutRef<'h3'>) => <MdxHeading as="h3" {...props} />,
	h4: (props: React.ComponentPropsWithoutRef<'h4'>) => <MdxHeading as="h4" {...props} />,
	h5: (props: React.ComponentPropsWithoutRef<'h5'>) => <MdxHeading as="h5" {...props} />,
	h6: (props: React.ComponentPropsWithoutRef<'h6'>) => <MdxHeading as="h6" {...props} />,
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
	MdxImage,
	MdxCodeBlock,
	MdxTable,
	MdxSVGIcons,
	MdxCardStack,
	MdxAvatarCardStack,
	MdxVideoZoom: MdxVideo,
	MdxGridRow: GridRow,
	MdxGridRowStriped: GridRowStriped,
	MdxGridSeparator: GridSeparator,

	// mark
	MdxRoughMark,
	MdxRoughMarkGroup,

	// i-ching
	MdxFiveElementsDiagram: FiveElementsDiagram,
	MdxYinYang: YinYang,
	MdxTetragram: Tetragram,
	MdxBagua: Bagua,
	MdxHexagram: Hexagram,
} satisfies MDXComponents

export type MDXContentProps = {
	code: Body
	components?: MDXComponents
}

export function MDXContent({ code, components }: MDXContentProps) {
	if (!code) return <p className="py-5">This article is being updated.</p>

	// eslint-disable-next-line @typescript-eslint/no-implied-eval
	const evaluate = new Function(code) as (runtime: typeof import('react/jsx-runtime')) => {
		default: ComponentType<{ components?: MDXComponents }>
	}
	const Content = evaluate(runtime).default
	return <Content components={{ ...defaultComponents, ...components }} />
}
