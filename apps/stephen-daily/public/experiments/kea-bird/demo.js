/* global window, document, MutationObserver */

const container = document.querySelector('.c-kea')
const status = document.querySelector('#status')
const startButton = document.querySelector('#start')
const ruffleButton = document.querySelector('#ruffle')

async function start() {
	startButton.hidden = true
	status.textContent = 'Đang tải renderer…'
	const body = window.mountKeaBody(container, {
		body: '/assets/images/textures/kea-bird/body.webp',
		feathers: '/assets/images/textures/kea-bird/body-feathers.png',
		cells: '/assets/images/textures/kea-bird/body-cells.png',
		meta: './assets/body.json',
		onFail: (reason) => {
			status.textContent = `Thân chim chưa render được: ${reason}`
		},
	})
	const bodyReady = body
		? await body.ready.then(
				() => true,
				() => false
			)
		: false
	if (bodyReady) {
		ruffleButton.disabled = false
		ruffleButton.addEventListener('click', () => body.ruffle())
	}

	const observer = new MutationObserver(() => {
		const head = container.querySelector('.c-kea3d__canvas')
		if (head && head.style.visibility !== 'hidden') {
			status.textContent = bodyReady
				? 'Đã sẵn sàng · Đầu 3D + lông tương tác'
				: 'Đã sẵn sàng · Đầu 3D + thân tĩnh'
			observer.disconnect()
		}
	})
	observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] })
	window.mountKea3D(container, {
		plate: bodyReady
			? '/assets/images/textures/kea-bird/plate-bare.webp'
			: '/assets/images/textures/kea-bird/plate.webp',
		head: '/assets/images/textures/kea-bird/head.webp',
		fill: '/assets/images/textures/kea-bird/head-fill.webp',
		solid: '/assets/images/textures/kea-bird/head-solid.webp',
		neck: '/assets/images/textures/kea-bird/neck.webp',
		onFail: (reason) => {
			observer.disconnect()
			status.textContent = `Giữ ảnh tĩnh vì WebGL chưa khởi tạo được: ${reason}`
		},
	})
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
	status.textContent = 'Đang dùng ảnh tĩnh theo cài đặt giảm chuyển động của bạn.'
	startButton.hidden = false
	startButton.addEventListener('click', start, { once: true })
} else {
	void start()
}
