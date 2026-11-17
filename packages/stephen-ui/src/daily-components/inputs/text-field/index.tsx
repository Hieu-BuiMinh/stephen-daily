'use client'

import { useId, type ComponentProps } from 'react'
import { cn } from 'cn'

import { Input } from '@repo/stephen-ui/base/input'
import { Label } from '@repo/stephen-ui/base/label'

export type TextFieldProps = ComponentProps<typeof Input> & {
	label?: string
	helperText?: string
	error?: string
	containerClassName?: string
}

export function TextField({
	id,
	label,
	helperText,
	error,
	className,
	containerClassName,
	'aria-invalid': ariaInvalid,
	'aria-describedby': ariaDescribedBy,
	...props
}: TextFieldProps) {
	const generatedId = useId()
	const fieldId = id ?? `${generatedId}-field`
	const hintId = `${fieldId}-hint`
	const errorId = `${fieldId}-error`
	const invalid = Boolean(error) || ariaInvalid === true || ariaInvalid === 'true'
	const describedBy = [ariaDescribedBy, helperText ? hintId : undefined, error ? errorId : undefined]
		.filter(Boolean)
		.join(' ')

	return (
		<div className={cn('w-full', containerClassName)}>
			{label && (
				<Label
					htmlFor={fieldId}
					className="block text-[13px] leading-normal font-medium text-stone-700 dark:text-stone-200"
				>
					{label}
				</Label>
			)}
			<div className={cn('relative', label && 'mt-1.5')}>
				<Input
					id={fieldId}
					aria-invalid={invalid ? true : ariaInvalid}
					aria-describedby={describedBy || undefined}
					className={cn(
						'h-10 w-full rounded-[10px] border-2 py-2 pl-3 pr-9 text-[13px] text-stone-700 outline-none transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-stone-400 focus-visible:outline-none disabled:opacity-50 md:text-[13px] dark:text-stone-200 dark:placeholder:text-stone-500',
						'focus-visible:ring-0',
						invalid
							? 'border-red-500 bg-white shadow-none aria-invalid:border-red-500 focus-visible:border-red-500 dark:border-red-400 dark:bg-[#1D1D1A] dark:aria-invalid:border-red-400 dark:focus-visible:border-red-400'
							: 'border-stone-200 bg-stone-100/70 shadow-[inset_0_1px_2px_rgba(28,25,23,0.07)] focus:border-[#4568FF] focus:bg-white focus:shadow-none focus-visible:border-[#4568FF] dark:border-white/[0.08] dark:bg-[#1D1D1A] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.45)] dark:focus:border-[#93B0FF] dark:focus:bg-[#252522] dark:focus-visible:border-[#93B0FF]',
						className
					)}
					{...props}
				/>
				{invalid && (
					<span
						className="pointer-events-none absolute top-1/2 right-3 grid size-3.5 -translate-y-1/2 place-items-center text-red-700 dark:text-red-400"
						aria-hidden="true"
					>
						<svg viewBox="0 0 12 12" width="14" height="14" fill="none">
							<path d="M6 2v4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
							<rect x="5.15" y="8.4" width="1.7" height="1.7" rx="0.5" fill="currentColor" />
						</svg>
					</span>
				)}
			</div>
			<div className="relative mt-1.5 grid h-4">
				<p
					aria-hidden="true"
					className={cn(
						'col-start-1 row-start-1 line-clamp-1 text-[11.5px] leading-4 text-stone-500 transition-[opacity,transform] duration-150 motion-reduce:transition-none dark:text-stone-400',
						error ? 'translate-y-[3px] opacity-0' : 'translate-y-0 opacity-100'
					)}
				>
					{helperText}
				</p>
				<p
					aria-hidden="true"
					className={cn(
						'col-start-1 row-start-1 line-clamp-1 text-[11.5px] leading-4 text-red-700 transition-[opacity,transform] duration-150 motion-reduce:transition-none dark:text-red-400',
						error ? 'translate-y-0 opacity-100' : 'translate-y-[3px] opacity-0'
					)}
				>
					{error}
				</p>
				{helperText && (
					<span id={hintId} className="sr-only">
						{helperText}
					</span>
				)}
				<span id={errorId} role="status" aria-live="polite" aria-atomic="true" className="sr-only">
					{error}
				</span>
			</div>
		</div>
	)
}
