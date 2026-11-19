'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import { Children, useRef, useState, type ReactNode } from 'react'
import { Button } from '../../../../base/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../base/tabs'

type MdxCodeBlockProps = {
	children: ReactNode
	labels?: string[]
	fileName?: string
}

export function MdxCodeBlock({ children, labels, fileName }: MdxCodeBlockProps) {
	const [activeTab, setActiveTab] = useState('0')
	const [copiedTab, setCopiedTab] = useState<string>()
	const activePanel = useRef<HTMLDivElement>(null)
	const panels = Children.toArray(children).filter((child) => typeof child !== 'string' || child.trim())

	async function copyCode() {
		const code = activePanel.current?.querySelector('pre code')
		if (!code) return

		try {
			await navigator.clipboard.writeText(code.textContent ?? '')
			setCopiedTab(activeTab)
		} catch {
			setCopiedTab(undefined)
		}
	}

	return (
		<Tabs
			value={activeTab}
			onValueChange={(value) => {
				setActiveTab(value)
				setCopiedTab(undefined)
			}}
			className="code-block not-prose my-6 min-w-0 gap-0 overflow-hidden rounded-2xl border border-border bg-muted p-1"
		>
			<div className="relative flex min-w-0 items-center gap-2 px-2">
				{labels && panels.length > 1 && (
					<div className="code-block-tab-rail flex min-w-0 self-stretch overflow-x-auto overflow-y-hidden scrollbar-none before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-border">
						<TabsList
							variant="line"
							aria-label={fileName ?? 'Code examples'}
							className="group-data-[orientation=horizontal]/tabs:h-full py-0"
						>
							{labels.map((label, index) => (
								<TabsTrigger
									key={label}
									value={String(index)}
									className="code-block-tab h-full border-0 px-2.5 text-xs after:rounded-full after:bg-brand-text group-data-[orientation=horizontal]/tabs:after:bottom-0 data-[state=active]:text-brand-text"
								>
									{label}
								</TabsTrigger>
							))}
						</TabsList>
					</div>
				)}
				{fileName && (
					<span className="min-w-0 truncate px-1 font-mono text-xs font-semibold text-foreground">
						{fileName}
					</span>
				)}
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="my-1 ml-auto size-8 shrink-0"
					aria-label={copiedTab === activeTab ? 'Code copied' : 'Copy code'}
					onClick={() => void copyCode()}
				>
					{copiedTab === activeTab ? <CheckIcon /> : <CopyIcon />}
				</Button>
			</div>
			{panels.map((panel, index) => {
				const value = String(index)
				return (
					<TabsContent key={value} value={value} className="min-w-0 px-0.5 pt-2 pb-0.5">
						<div ref={activeTab === value ? activePanel : null}>{panel}</div>
					</TabsContent>
				)
			})}
		</Tabs>
	)
}
