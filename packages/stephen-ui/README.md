# @repo/stephen-ui

Shared UI package for Stephen Daily and other workspace apps.

## Component workflow

1. Inspect the relevant primitive in `src/base` and its consumers before editing.
2. Reuse primitives from `src/base` to build app-styled components in `src/daily-components`.
3. Apply product styles in the composed component. Keep the primitive's API and behavior intact.
4. Use `cn` to merge classes, with the consumer's `className` last so it can override defaults.
5. Forward native props, event handlers, accessibility attributes, and refs through the primitive.
6. Export each new Daily component and its public types from `src/daily-components/index.ts`. Apps import from `@repo/stephen-ui/daily-components`; individual Daily components do not need package exports.
7. Verify formatting, shared ESLint rules, TypeScript, and consuming app builds.

Keep state and validation in the consuming form unless the component has an explicit behavioral requirement.
Do not hardcode IDs copied from rendered DOM. Labels and hint/error elements must use IDs belonging to the actual form instance.
Add `'use client'` when the component itself needs client-side hooks or browser behavior.

## Structure

```text
src/
  base/                                  # shadcn primitives
  daily-components/
    index.ts                             # Public exports for all Daily components
    inputs/text-field/index.tsx           # Daily-styled Input
    rhf-inputs/index.tsx                  # React Hook Form bindings for Daily inputs
    welcome-card.tsx                      # Composition of base Card and Button
  hooks/                                 # Shared UI hooks
  lib/                                   # UI helpers
  styles/base.css                        # Tailwind, theme variables, shared tokens
```

Use package imports such as `@repo/stephen-ui/base/input` inside compositions.
Avoid `@/…` in shared source: consuming apps can resolve that alias to their own files.

## TextField

`TextField` composes the shadcn `Input` with the input styling supplied from
[interior.dev Inline Validation](https://www.interior.dev/docs/inline-validation).
It includes the rounded inset appearance, blue focus border, and light/dark palettes.
Explicit overrides remove the primitive's focus ring and keep the font at 13px on desktop.

### Saved style reference: interior.dev Inline Validation

Use this local reference for the current input styling instead of reopening the source page.
The values below reflect the supplied input and our `TextField` implementation.
Revisit the source only when intentionally updating the design or adding its validation interactions.

| Property           | Light                                                | Dark                                           |
| ------------------ | ---------------------------------------------------- | ---------------------------------------------- |
| Dimensions         | `h-10 w-full`, 10px radius, 2px border               | Same                                           |
| Padding            | `py-2 pl-3 pr-9` (space reserved for a status icon)  | Same                                           |
| Typography         | 13px, `text-stone-700`, `placeholder:text-stone-400` | `text-stone-200`, `placeholder:text-stone-500` |
| Default border     | `border-stone-200`                                   | `border-white/[0.08]`                          |
| Default background | `bg-stone-100/70`                                    | `bg-[#1D1D1A]`                                 |
| Inset shadow       | `inset 0 1px 2px rgba(28,25,23,0.07)`                | `inset 0 1px 2px rgba(0,0,0,0.45)`             |
| Focus border       | `#4568FF`                                            | `#93B0FF`                                      |
| Focus background   | White                                                | `#252522`                                      |
| Transition         | Background, border color, box shadow; 150ms          | Same                                           |
| Disabled           | `opacity-50`                                         | Same                                           |

The reference uses `focus:shadow-none`. Preserve its dark shadow classes as supplied.
When composing the shadcn Input, also apply these overrides:

```text
md:text-[13px]
focus-visible:border-[#4568FF]
focus-visible:ring-0
dark:focus-visible:border-[#93B0FF]
```

These prevent shadcn's desktop font size, focus border, and focus ring from overriding this design.
Keep these styles in `daily-components/inputs/text-field/index.tsx`; do not restyle `base/input.tsx` globally.
`TextField` also renders the reference's label, helper/error text, and error icon.
The invalid palette uses `border-red-500 bg-white` and `dark:border-red-400 dark:bg-[#1D1D1A]`.
Labels use 13px medium text; messages use 11.5px text with a 16px line height.
The message row always reserves 16px and crossfades helper/error text without moving the form.
The component generates stable IDs for its label and descriptions, preserves external `aria-describedby`,
and announces errors through a polite live region. It does not run validation or debounce input.

```tsx
import { TextField } from '@repo/stephen-ui/daily-components'

;<TextField
	label="Work email"
	id="work-email"
	name="email"
	type="email"
	placeholder="you@work.com"
	autoComplete="email"
	helperText="Only used to send the invite."
	error="That is not a complete email address."
/>
```

Props match the base Input, including `ref`, `value`, `defaultValue`, `onChange`, `disabled`,
`aria-invalid`, and `className`. Additional props: `label`, `helperText`, `error`, and `containerClassName`.
`className` styles the input; `containerClassName` styles the complete field wrapper.
The parent owns validation and supplies the error message. A non-empty error activates the invalid state.

## React Hook Form inputs

`react-hook-form` is already a dependency of this package. `RHFTextField` connects
`TextField` to a typed `control` and field `name` using `Controller`.
It forwards the field's value, change/blur handlers, ref, and disabled state, and displays
the field error from React Hook Form automatically. An explicit `error` prop is used when RHF has no message.
Initialize values in `useForm({ defaultValues })`; the form owns validation.

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { RHFTextField } from '@repo/stephen-ui/daily-components'

export function EmailForm() {
	const { control } = useForm<{ email: string }>({
		defaultValues: { email: '' },
	})

	return (
		<RHFTextField
			control={control}
			name="email"
			label="Work email"
			type="email"
			helperText="Only used to send the invite."
			placeholder="you@work.com"
		/>
	)
}
```

The consuming app should declare `react-hook-form` as a dependency when importing `useForm`.
No `FormProvider` is needed when passing `control` explicitly.

## Styles in an app

Import shared CSS once in the app's global stylesheet:

```css
@import '@repo/stephen-ui/styles.css';
@source '../';
```

Use `export { default } from '@repo/stephen-ui/postcss.config'` in the app's PostCSS config.
Include `@repo/stephen-ui` in the Next.js `transpilePackages` list. Apply `.dark` to enable dark styles.
Shared variables belong in `src/styles/base.css`; app-specific overrides follow the shared CSS import.
Place global spacing resets inside `@layer base`. An unlayered `* { padding: 0; margin: 0 }`
overrides Tailwind utilities and removes input padding and field spacing.

## Adding shadcn primitives

```sh
pnpm dlx shadcn@latest add <component> --cwd packages/stephen-ui --yes
```

Review generated changes before overwriting existing primitives. Normalize generated imports to package paths.
Some upstream components have documented line-level lint exceptions; do not disable shared rules across the package.

## Checks

From the workspace root:

```sh
pnpm format:check
pnpm lint
pnpm check-types
pnpm build
```
