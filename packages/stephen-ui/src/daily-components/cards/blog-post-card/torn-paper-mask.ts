export function createTornPaperMask(key: string) {
	let seed = 2166136261
	for (const character of key) {
		seed = Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0
	}

	// A stable seed keeps the server and client contours identical.
	function next() {
		seed = (Math.imul(1664525, seed) + 1013904223) >>> 0
		return seed / 4294967296
	}

	const points = [[6, 7]]
	for (let x = 14; x < 990; x += 8 + Math.floor(next() * 14)) {
		points.push([x, 2 + Math.floor(next() * 9)])
	}
	points.push([994, 6])
	for (let y = 15; y < 590; y += 8 + Math.floor(next() * 13)) {
		points.push([990 + Math.floor(next() * 9), y])
	}
	points.push([993, 594])
	for (let x = 985; x > 8; x -= 8 + Math.floor(next() * 14)) {
		points.push([x, 590 + Math.floor(next() * 9)])
	}
	points.push([5, 593])
	for (let y = 582; y > 8; y -= 8 + Math.floor(next() * 13)) {
		points.push([2 + Math.floor(next() * 9), y])
	}

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" preserveAspectRatio="none"><path fill="white" d="M${points.map((point) => point.join(' ')).join('L')}Z"/></svg>`
	return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
