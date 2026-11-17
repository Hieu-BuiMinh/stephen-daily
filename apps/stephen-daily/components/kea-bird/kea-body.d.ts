export function mountKeaBody(
	container: HTMLElement,
	options: {
		body: string
		feathers: string
		cells: string
		meta: string
		onFail: (reason: string) => void
	}
): { ready: Promise<void>; ruffle(): void; destroy(): void } | undefined
