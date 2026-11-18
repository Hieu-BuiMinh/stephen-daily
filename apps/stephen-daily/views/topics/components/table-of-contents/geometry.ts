import type { ContentPost } from '../../data'

export type FlatTocItem = { id: string; title: string; url: string; level: number }
export type TocRow = { id: string; x: number; top: number; bottom: number }

export function flattenToc(items: ContentPost['toc'], level = 0): FlatTocItem[] {
	return items.flatMap((item) => [
		{ id: decodeURIComponent(item.url.slice(1)), title: item.title, url: item.url, level },
		...flattenToc(item.items, level + 1),
	])
}

export function buildTocPath(rows: TocRow[]): string {
	let path = ''
	let previous: TocRow | undefined

	for (const row of rows) {
		if (!previous) {
			path += `M ${row.x} ${row.top}`
		} else if (previous.x === row.x) {
			path += ` L ${row.x} ${row.top}`
		} else {
			const radius = Math.min(4, (row.top - previous.bottom) / 2)
			path += ` C ${previous.x} ${previous.bottom + radius} ${row.x} ${row.top - radius} ${row.x} ${row.top}`
		}
		path += ` L ${row.x} ${row.bottom}`
		previous = row
	}

	return path
}

export function findDistanceAtY(path: Pick<SVGPathElement, 'getTotalLength' | 'getPointAtLength'>, targetY: number) {
	let low = 0
	let high = path.getTotalLength()

	for (let iteration = 0; iteration < 15; iteration++) {
		const middle = (low + high) / 2
		if (path.getPointAtLength(middle).y < targetY) low = middle
		else high = middle
	}

	return (low + high) / 2
}
