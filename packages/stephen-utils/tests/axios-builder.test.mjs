import assert from 'node:assert/strict'
import test from 'node:test'
import { AxiosError, isCancel } from 'axios'
import { AxiosBuilder } from '../src/axios/axios-builder.ts'

function response(config, data = { ok: true }) {
	return { status: 200, statusText: 'OK', headers: {}, config, data }
}

test('builders isolate defaults, headers, and interceptors; build retains instance identity', async () => {
	const first = new AxiosBuilder({ timeout: 1234 })
		.setBaseUrl('https://example.test')
		.setTimeout(5000)
		.setHeaders({ 'X-Client': 'first' })
		.setHeaders({ 'x-client': 'updated' })
		.setToken('first-token')
		.addRequestInterceptor((config) => {
			config.headers.set('X-Interceptor', 'first')
			return config
		})
	const second = new AxiosBuilder()
	assert.equal(first.build(), first.build())
	assert.notEqual(first.build(), second.build())
	assert.equal(first.build().defaults.baseURL, 'https://example.test')
	assert.equal(first.build().defaults.timeout, 5000)
	assert.equal(second.build().defaults.timeout, 0)
	for (const [builder, expected] of [
		[first, true],
		[second, false],
	]) {
		await builder.get({
			url: '/test',
			config: {
				adapter: async (config) => {
					assert.equal(config.headers.has('Authorization'), expected)
					assert.equal(config.headers.has('X-Interceptor'), expected)
					if (expected) {
						assert.equal(config.headers.get('x-client'), 'updated')
						assert.equal(config.headers.get('Authorization'), 'Bearer first-token')
					}
					return response(config)
				},
			},
		})
	}
})

test('request headers override defaults and do not alter subsequent requests', async () => {
	const builder = new AxiosBuilder().setToken('default')
	for (const token of ['request', 'default']) {
		await builder.get({
			url: '/test',
			config: {
				...(token === 'request' && { headers: { Authorization: 'Bearer request' } }),
				adapter: async (config) => {
					assert.equal(config.headers.get('Authorization'), `Bearer ${token}`)
					return response(config)
				},
			},
		})
	}
})

test('HTTP methods forward URLs, payloads, and per-request config without unwrapping responses', async () => {
	const builder = new AxiosBuilder().addResponseInterceptor((result) => {
		result.headers['X-Response'] = 'processed'
		return result
	})
	for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
		const data = { title: 'Example' }
		const result = await builder[method]({
			url: '/posts',
			...(['post', 'put', 'patch'].includes(method) && { data }),
			config: {
				params: { page: 2 },
				adapter: async (config) => {
					assert.equal(config.method, method)
					assert.equal(config.url, '/posts')
					assert.deepEqual(config.params, { page: 2 })
					if (['post', 'put', 'patch'].includes(method)) assert.deepEqual(JSON.parse(config.data), data)
					return response(config, { id: 1 })
				},
			},
		})
		assert.equal(result.status, 200)
		assert.deepEqual(result.data, { id: 1 })
		assert.equal(result.headers['X-Response'], 'processed')
	}
})

test('async request interceptors run and response error interceptors can recover or rethrow', async () => {
	const error = new AxiosError('Unauthorized', 'ERR_BAD_REQUEST')
	const rejected = new AxiosBuilder().addResponseErrorInterceptor((caught) => {
		assert.equal(caught, error)
		return Promise.reject(caught)
	})
	await assert.rejects(
		rejected.get({
			url: '/test',
			config: {
				adapter: async () => {
					throw error
				},
			},
		}),
		(caught) => caught === error
	)
	const recovered = new AxiosBuilder()
		.addRequestInterceptor(async (config) => {
			config.headers.set('X-Async', 'yes')
			return config
		})
		.addResponseErrorInterceptor((caught) => {
			assert.equal(caught, error)
			return response({}, { recovered: true })
		})
	const result = await recovered.get({
		url: '/test',
		config: {
			adapter: async (config) => {
				assert.equal(config.headers.get('X-Async'), 'yes')
				throw error
			},
		},
	})
	assert.deepEqual(result.data, { recovered: true })
})

test('AbortSignal cancellation remains available', async () => {
	const controller = new AbortController()
	controller.abort()
	await assert.rejects(new AxiosBuilder().get({ url: '/test', config: { signal: controller.signal } }), isCancel)
})
