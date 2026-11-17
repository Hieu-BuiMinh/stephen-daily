# Stephen Utils

```text
src/
  axios/        # Axios instance and API response types
  date-time/    # Configured Day.js and date/time helpers
  react-query/  # TanStack Query client entry
  class-names/  # Class name merging
  index.ts      # Shared server-safe exports
```

Use `@repo/stephen-utils/axios`, `/date-time`, `/react-query`, or `/class-names`.
The previous `/api`, `/api-types`, and `/date` paths remain supported through
package export aliases.

## HTTP client

```ts
import { commonRequest, isAxiosError, type TApiResponse, type TApiListResponse } from '@repo/stephen-utils/axios'

type Post = { id: number; title: string }

const response = await commonRequest.get<TApiResponse<Post>>('/api/posts/1')
const post = response.data.data

const listResponse = await commonRequest.get<TApiListResponse<Post>>('/api/posts')
const posts = listResponse.data.data.data
```

`commonRequest` is built with `AxiosBuilder` and is a shared Axios instance with a 30-second timeout and an
`Accept: application/json` header. It preserves Axios responses and errors.
No base URL, authentication, redirects, notifications, or response unwrapping
are imposed. Use a relative app API path, a full URL, or a request-level `baseURL`.

Use the native `commonRequest.interceptors` API to register interceptors when the
application needs them. Pass user-specific tokens in request headers rather than
mutating shared instance defaults on the server.

### Create another instance

```ts
import { AxiosBuilder } from '@repo/stephen-utils/axios'

const builder = new AxiosBuilder({ timeout: 30_000 })
	.setBaseUrl('/api')
	.setHeaders({ Accept: 'application/json' })
	.addRequestInterceptor((config) => {
		config.headers.set('X-Client', 'stephen-daily')
		return config
	})

const api = builder.build()
const response = await api.get<Post>('/posts/1')

// Or call typed HTTP methods directly on the builder.
const created = await builder.post<Post, { title: string }>({
	url: '/posts',
	data: { title: 'Example' },
})
```

Each `new AxiosBuilder(config?)` owns a separate `axios.create(config)` instance.
Repeated `build()` calls on the same builder return that same instance. Fluent
methods return `this`, so subclasses retain their own methods in a chain.
The protected, readonly `instance` is available to subclasses.

Configuration methods: `setBaseUrl`, `setTimeout`, `setHeaders`, and `setToken`.
Interceptor methods: `addRequestInterceptor`, `addResponseInterceptor`, and
`addResponseErrorInterceptor`; every call registers another interceptor.
`setHeaders` merges common headers case-insensitively without dropping existing
headers. `setToken` explicitly sets a bearer token; it does not retrieve or refresh one.

`get`, `post`, `put`, `patch`, and `delete` on the builder accept `{ url, config }`,
plus `data` for body methods. They return the original typed Axios response.
After `build()`, use native Axios signatures such as `api.get(url, config)`.
All interceptor types preserve the response envelope; do not unwrap `.data`
globally and claim that the result is still an `AxiosResponse<T>`.

Run `pnpm --filter @repo/stephen-utils test` to verify instance isolation, headers,
interceptors, HTTP forwarding, error recovery, and cancellation.

`TApiResponse` and `TApiListResponse` model the supplied response examples;
they are not validated backend contracts. The list type retains the example's
nested `data.data` structure and assumes pagination URLs can be `string | null`.
Only use these types with endpoints that actually return this format. Other APIs
should use their own response types.

## TanStack Query

React exports are available separately, keeping the root utils entry usable from
server modules:

```tsx
'use client'

import { useQuery } from '@repo/stephen-utils/react-query'
import { commonRequest, type TApiResponse } from '@repo/stephen-utils/axios'

type Post = { id: number; title: string }

function PostTitle({ id }: { id: number }) {
	const query = useQuery({
		queryKey: ['post', id],
		queryFn: async ({ signal }) => {
			const response = await commonRequest.get<TApiResponse<Post>>(`/api/posts/${id}`, { signal })
			return response.data.data
		},
	})

	if (query.isPending) return <p>Loading…</p>
	if (query.isError) return <p>Unable to load the post.</p>
	return <h2>{query.data.title}</h2>
}
```

The example paths illustrate usage; they are not implemented endpoints.
`stephen-daily` already mounts `QueryClientProvider` in `AppProvider`, with one
stable client per provider instance. Other apps must mount their own provider.
TanStack Query defaults are retained; existing fetch calls are unchanged.
