'use client'

import { TextField, type TextFieldProps } from '../inputs/text-field'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

export type RHFTextFieldProps<TFieldValues extends FieldValues> = Omit<
	TextFieldProps,
	'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'ref'
> & {
	control: Control<TFieldValues>
	name: FieldPath<TFieldValues>
}

export function RHFTextField<TFieldValues extends FieldValues>({
	control,
	name,
	disabled,
	...props
}: RHFTextFieldProps<TFieldValues>) {
	return (
		<Controller
			control={control}
			name={name}
			disabled={disabled}
			render={({ field, fieldState }) => (
				<TextField
					{...props}
					{...field}
					error={fieldState.error?.message ?? props.error}
					aria-invalid={fieldState.invalid || props['aria-invalid']}
				/>
			)}
		/>
	)
}
