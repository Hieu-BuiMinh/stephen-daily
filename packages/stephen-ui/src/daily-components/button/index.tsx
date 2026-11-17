'use client'

import {
	Children,
	cloneElement,
	useEffect,
	useRef,
	useState,
	type ComponentProps,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, Check, LoaderCircle } from 'lucide-react'
import { motion, useReducedMotion } from '@repo/stephen-ui/motion'
import { Button } from '@repo/stephen-ui/base/button'
import { cn } from '@repo/stephen-ui/lib/utils'

const MotionButton = motion.create(Button)
const pressTransition = { type: 'spring', stiffness: 520, damping: 34, mass: 0.45 } as const
const fadeTransition = { type: 'spring', stiffness: 260, damping: 34, mass: 0.8 } as const

const dailyButtonVariants = cva(
	'relative inline-flex h-[var(--daily-button-height)] touch-manipulation select-none items-center justify-center gap-1.5 rounded-none border py-0 font-mono font-medium normal-case tracking-wide shadow-none outline-none transition-colors duration-150 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50',
	{
		variants: {
			variant: {
				default:
					'border-foreground bg-[var(--button-surface)] text-[var(--button-text)] hover:bg-[var(--button-surface-hover)]',
				secondary:
					'border-border bg-secondary text-secondary-foreground hover:border-foreground/50 hover:bg-secondary/80',
				outline:
					'border-foreground/50 bg-transparent text-foreground hover:border-foreground hover:bg-secondary',
				ghost: 'border-transparent bg-transparent text-foreground shadow-none hover:bg-secondary',
				link: 'border-transparent bg-transparent text-foreground shadow-none underline-offset-4 hover:bg-transparent hover:underline',
				destructive: 'border-destructive bg-destructive text-white hover:bg-destructive/90',
				error: 'border-destructive bg-destructive/10 text-destructive hover:bg-destructive/15',
			},
			size: {
				sm: '[--daily-button-height:28px] px-2.5 text-[11px]',
				md: '[--daily-button-height:32px] px-3 text-xs',
				lg: '[--daily-button-height:40px] px-4 text-[13px]',
				xl: '[--daily-button-height:48px] px-5 text-sm',
			},
			iconOnly: {
				true: 'w-[var(--daily-button-height)] px-0',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
			iconOnly: false,
		},
	}
)

type ActionStatus = 'idle' | 'pending' | 'success' | 'error'

export type DailyButtonProps = Omit<ComponentProps<typeof MotionButton>, 'variant' | 'size' | 'onError' | 'children'> &
	VariantProps<typeof dailyButtonVariants> & {
		children?: ReactNode
		icon?: ReactNode
		loading?: boolean
		onAction?: () => unknown
		pendingLabel?: ReactNode
		successLabel?: ReactNode
		errorLabel?: ReactNode
		resetAfter?: number
		onError?: (error: unknown) => void
	}

function DailyButton({
	className,
	variant = 'default',
	size = 'md',
	iconOnly = false,
	icon,
	children,
	asChild = false,
	loading = false,
	disabled = false,
	type = 'button',
	onClick,
	onAction,
	pendingLabel,
	successLabel = 'Done',
	errorLabel = 'Try again',
	resetAfter = 1400,
	onError,
	...props
}: DailyButtonProps) {
	const [status, setStatus] = useState<ActionStatus>('idle')
	const inFlight = useRef(false)
	const mounted = useRef(true)
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
	const reducedMotion = useReducedMotion()
	const pending = loading || status === 'pending'
	const currentStatus = pending ? 'pending' : status
	const child = asChild ? (Children.only(children) as ReactElement<{ children: ReactNode }>) : null
	const label = child ? child.props.children : children

	useEffect(() => {
		mounted.current = true
		return () => {
			mounted.current = false
			clearTimeout(timer.current)
		}
	}, [])

	async function handleClick(event: MouseEvent<HTMLButtonElement>) {
		if (pending || disabled || inFlight.current) {
			event.preventDefault()
			return
		}

		onClick?.(event)
		if (event.defaultPrevented || !onAction) return

		event.preventDefault()
		clearTimeout(timer.current)
		inFlight.current = true
		setStatus('pending')

		try {
			await onAction()
			if (mounted.current) setStatus('success')
		} catch (error) {
			if (mounted.current) {
				setStatus('error')
				onError?.(error)
			}
		} finally {
			inFlight.current = false
			if (mounted.current) {
				timer.current = setTimeout(() => setStatus('idle'), resetAfter)
			}
		}
	}

	const faces = [
		{ key: 'idle', label, icon, tone: '' },
		{
			key: 'pending',
			label: pendingLabel ?? label,
			icon: (
				<LoaderCircle
					className={currentStatus === 'pending' ? 'animate-spin motion-reduce:animate-none' : undefined}
				/>
			),
			tone: 'opacity-70',
		},
		{ key: 'success', label: successLabel, icon: <Check />, tone: 'text-[var(--button-success)]' },
		{ key: 'error', label: errorLabel, icon: <AlertCircle />, tone: 'text-[var(--button-error)]' },
	] as const
	const activeFace = faces.find((face) => face.key === currentStatus)!
	const content = (
		<>
			<span aria-hidden="true" className="grid place-items-center">
				{(onAction ? faces : [activeFace]).map((face) => (
					<motion.span
						key={face.key}
						initial={false}
						animate={
							face.key === currentStatus
								? { opacity: 1, y: 0, filter: 'blur(0px)' }
								: { opacity: 0, y: 3, filter: 'blur(3px)' }
						}
						transition={reducedMotion ? { duration: 0 } : fadeTransition}
						className="col-start-1 row-start-1 flex items-center justify-center gap-1.5 whitespace-nowrap"
					>
						<span className={cn('flex items-center gap-1.5', variant === 'default' && face.tone)}>
							{face.icon && <span className="flex shrink-0 [&_svg]:size-3.5">{face.icon}</span>}
							{!iconOnly && face.label}
						</span>
					</motion.span>
				))}
			</span>
			<span className="sr-only">{activeFace.label}</span>
		</>
	)

	return (
		<>
			<MotionButton
				{...props}
				type={type}
				asChild={asChild}
				variant="default"
				data-variant={variant}
				data-size={size}
				data-status={currentStatus}
				disabled={disabled || pending}
				aria-busy={pending || undefined}
				aria-disabled={disabled || pending || undefined}
				whileTap={disabled || pending || reducedMotion ? undefined : { y: 1 }}
				transition={pressTransition}
				onClick={(event) => {
					void handleClick(event)
				}}
				className={cn(dailyButtonVariants({ variant, size, iconOnly }), className)}
			>
				{child ? cloneElement(child, undefined, content) : content}
			</MotionButton>
			<span role="status" className="sr-only">
				{status === 'success' ? successLabel : status === 'error' ? errorLabel : ''}
			</span>
		</>
	)
}

export { DailyButton, dailyButtonVariants }

/*
Usage (the calling component provides the example functions and state):

import { DailyButton } from '@repo/stephen-ui/daily-components'
import { Save, Search } from 'lucide-react'

1. Defaults: variant="default", size="md", type="button".
   <DailyButton onClick={openDialog}>Open dialog</DailyButton>

2. Variants: default | secondary | outline | ghost | link | destructive | error.
   <DailyButton variant="outline">Cancel</DailyButton>
   <DailyButton variant="destructive" onClick={deleteItem}>Delete</DailyButton>
   <DailyButton variant="error">Failed</DailyButton>
   variant="error" changes appearance only; onAction manages async error state.

3. Sizes: sm (28px) | md (32px) | lg (40px) | xl (48px).
   <DailyButton size="lg" icon={<Save />}>Save changes</DailyButton>

4. Icon-only: pass the icon prop and provide an accessible name with aria-label.
   <DailyButton iconOnly icon={<Search />} aria-label="Search" />

5. Async actions manage loading, success/error, and reset automatically (default: 1400ms).
   <DailyButton
     onAction={saveData}
     pendingLabel="Saving"
     successLabel="Saved"
     errorLabel="Try again"
     resetAfter={2000}
     onError={reportError}
   >
     Save changes
   </DailyButton>
   saveData must return the operation's Promise and throw/reject on failure.
   onClick does not enable loading automatically; use onAction for this state flow.
   When both are provided, onClick runs first; event.preventDefault() skips onAction.

6. Externally controlled loading (does not automatically transition to success/error).
   <DailyButton loading={isSaving} pendingLabel="Saving" onClick={save}>Save</DailyButton>
   <DailyButton disabled>Unavailable</DailyButton>
   The button is disabled while loading or while onAction is pending.

7. Form submission: pass type="submit" explicitly; the default is type="button".
   <DailyButton type="submit" loading={isSubmitting}>Submit</DailyButton>
   Do not combine onAction with native form submission: onAction calls preventDefault().

8. Render a link with asChild; provide exactly one child element.
   <DailyButton asChild variant="link">
     <a href="/about">About</a>
   </DailyButton>

9. Custom styling and refs use the standard props.
   <DailyButton ref={buttonRef} className="w-full">Continue</DailyButton>
*/
