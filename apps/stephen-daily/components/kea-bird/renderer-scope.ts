export function createRendererScope() {
	let disposed = false
	const listeners: (() => void)[] = []
	const timers = new Set<number>()
	const frames = new Set<number>()
	const observers = new Set<IntersectionObserver>()
	const canvases = new Set<HTMLCanvasElement>()
	const abort = new AbortController()

	function listen(
		target: EventTarget,
		type: string,
		callback: EventListenerOrEventListenerObject,
		options?: AddEventListenerOptions | boolean
	) {
		target.addEventListener(type, callback, options)
		listeners.push(() => target.removeEventListener(type, callback, options))
	}

	return {
		get disposed() {
			return disposed
		},
		signal: abort.signal,
		listen,
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: AddEventListenerOptions | boolean
		) {
			listen(window, type, callback, options)
		},
		setTimeout(callback: () => void, delay: number) {
			if (disposed) return 0
			const id = window.setTimeout(() => {
				timers.delete(id)
				callback()
			}, delay)
			timers.add(id)
			return id
		},
		clearTimeout(id: number) {
			window.clearTimeout(id)
			timers.delete(id)
		},
		requestAnimationFrame(callback: FrameRequestCallback) {
			if (disposed) return 0
			const id = window.requestAnimationFrame((time) => {
				frames.delete(id)
				callback(time)
			})
			frames.add(id)
			return id
		},
		cancelAnimationFrame(id: number) {
			window.cancelAnimationFrame(id)
			frames.delete(id)
		},
		IntersectionObserver: class extends window.IntersectionObserver {
			constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
				super(callback, options)
				observers.add(this)
			}
		},
		registerCanvas(canvas: HTMLCanvasElement) {
			canvases.add(canvas)
		},
		dispose() {
			if (disposed) return
			disposed = true
			abort.abort()
			listeners.forEach((remove) => remove())
			timers.forEach((id) => window.clearTimeout(id))
			frames.forEach((id) => window.cancelAnimationFrame(id))
			observers.forEach((observer) => observer.disconnect())
			canvases.forEach((canvas) => {
				canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext()
				canvas.remove()
			})
		},
	}
}
