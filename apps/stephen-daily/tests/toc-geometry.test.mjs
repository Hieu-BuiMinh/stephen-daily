import assert from 'node:assert/strict'
import test from 'node:test'
import { buildTocPath, findDistanceAtY, flattenToc } from '../views/topics/components/table-of-contents/geometry.ts'

test('TOC flattening preserves reading order, nesting, unique fragments and Vietnamese heading IDs', () => {
	const items = [
		{
			title: 'Bắt đầu',
			url: '#b%E1%BA%AFt-%C4%91%E1%BA%A7u',
			items: [{ title: 'Chi tiết', url: '#chi-tiết', items: [] }],
		},
		{ title: 'Bắt đầu', url: '#bắt-đầu-1', items: [] },
	]
	const before = structuredClone(items)
	assert.deepEqual(
		flattenToc(items).map(({ id, level }) => ({ id, level })),
		[
			{ id: 'bắt-đầu', level: 0 },
			{ id: 'chi-tiết', level: 1 },
			{ id: 'bắt-đầu-1', level: 0 },
		]
	)
	assert.deepEqual(items, before)
	assert.deepEqual(flattenToc([]), [])
})

test('the track curves into nested headings and back out, while same-level rows connect directly', () => {
	const nested = buildTocPath([
		{ id: 'first', x: 6, top: 6, bottom: 24 },
		{ id: 'nested', x: 16, top: 36, bottom: 72 },
		{ id: 'last', x: 6, top: 84, bottom: 102 },
	])
	assert.ok(nested.startsWith('M 6 6 L 6 24'))
	assert.ok(nested.endsWith('L 6 102'))
	assert.equal(nested.match(/ C /g).length, 2)
	assert.ok(nested.includes('16 36 L 16 72'))
	assert.ok(
		!buildTocPath([
			{ id: 'a', x: 6, top: 6, bottom: 24 },
			{ id: 'b', x: 6, top: 36, bottom: 54 },
		]).includes(' C ')
	)
	assert.equal(buildTocPath([]), '')
})

test('dot distance follows path geometry rather than assuming distance equals the Y coordinate', () => {
	const path = {
		getTotalLength: () => 100,
		getPointAtLength: (distance) => ({ y: distance ** 2 / 100 }),
	}
	for (const y of [0, 12, 50, 100]) {
		const distance = findDistanceAtY(path, y)
		assert.ok(Math.abs(path.getPointAtLength(distance).y - y) < 0.01)
	}
})
