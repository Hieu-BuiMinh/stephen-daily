export function mountKea3D(
	container: HTMLElement,
	options: {
		plate: string
		head: string
		fill: string
		solid: string
		neck: string
		onFail: (reason: string) => void
	}
): { destroy(): void } | undefined
