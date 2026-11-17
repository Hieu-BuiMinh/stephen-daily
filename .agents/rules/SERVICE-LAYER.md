---
name: Service Layer & Query Key Rule
description: Mandatory service, DTO, and TanStack Query conventions for Stephen Daily.
---

# Service Layer & Query Keys

## Scope

Apply these rules when adding or modifying API requests, service modules, DTOs,
or TanStack Query queries and mutations in `apps/stephen-daily`.
Keep unrelated code unchanged; this rule does not authorize a broad migration.

## Service location

All app service modules belong in:

```text
apps/stephen-daily/services/
└── common/
    └── <module>/
        ├── index.ts
        ├── <module>-req.dto.ts
        └── <module>-res.dto.ts
```

- Use only the `common` group. Do not introduce `admin`, `customer`, or `user` groups.
- Name modules by their actual domain, such as `weather` or `posts`, using kebab-case.
- Do not infer user roles or folder structure from API version prefixes.
- Keep actual endpoint paths and versions unchanged.
- Put app endpoints and DTOs in the app, not in `packages/stephen-utils`.
- Shared Axios infrastructure belongs in `packages/stephen-utils/src/axios`.
- Use the shared `AxiosBuilder` class when an additional configured instance is
  required. Create it once in an app API configuration module, then reuse it in
  services. Do not create a builder per render or per request.
- Create request/response DTO files only when that module needs those types;
  do not create empty files or speculative services.

## Module responsibilities

### `index.ts`

- Export the module's service object, such as `weatherService`.
- Define operation methods and their query/mutation keys together.
- Call APIs through `commonRequest` from `@repo/stephen-utils/axios`.
- Use Axios directly through this instance; do not add another `Api` wrapper,
  builder, or Axios instance for individual service modules.
- Return `response.data` with the endpoint's actual response type.
- Preserve Axios errors and cancellation. Do not swallow errors or return fake data.
- Keep UI state, hooks, toasts, routing, and permission prompts out of services.

### `<module>-req.dto.ts`

Define request bodies, query parameters, and path parameter types from the actual
endpoint contract. Transport options such as `AbortSignal` are not API payload fields.

### `<module>-res.dto.ts`

Define endpoint response models. Verify fields against API documentation, responses,
schemas, or backend code. Do not invent optional fields, fallbacks, or response envelopes.

Use `TApiResponse<T>` or `TApiListResponse<T>` from `@repo/stephen-utils/axios`
only when the endpoint actually returns that structure. Third-party APIs, including
Open-Meteo, use their own response DTOs.

Do not use `any`. Keep domain DTOs out of view/component files. Extract shared DTOs
only after there is demonstrated reuse; do not create a global DTO layer in advance.

## Operation shape

Each service operation groups its key with the relevant HTTP method:

```ts
export const exampleService = {
	getExample: {
		key: (params: ExampleRequest) => ['common', 'example', 'get_example', params] as const,
		get: async (params: ExampleRequest, options?: { signal?: AbortSignal }) => {
			// Call the verified endpoint through commonRequest and return response.data.
		},
	},
}
```

This shape is illustrative. Implement only the methods required by an actual
endpoint: `get`, `post`, `put`, `patch`, or `delete`.

## Query key conventions

- Define keys in the service, never inline in components or hooks.
- Use readonly arrays with a shared namespace:
  `['common', '<module>', '<operation>', ...requestInputs] as const`.
- Use snake_case for fixed string segments, such as `get_current_weather`.
- Include every request input that changes the returned data: IDs, filters, search,
  pagination, coordinates, locale, and other endpoint-specific inputs when applicable.
- Parameter objects, numbers, and booleans are allowed; keys are not limited to
  arrays of strings. Keep values serializable and deterministic.
- Do not put tokens, secrets, functions, signals, or unrelated UI state in keys.
- Normalize inputs only when the API contract requires it, and use the same inputs
  for the key and request. Do not introduce speculative transformations.
- Use service keys for fetching, prefetching, cache reads/writes, and invalidation.
- Mutations define their mutation key in the service too. Invalidate the relevant
  read operation's key after success when that mutation changes cached data.

## Example: current weather

This example uses the existing Open-Meteo integration. It documents the structure;
creating this rule does not migrate the current widget.

`apps/stephen-daily/services/common/weather/weather-req.dto.ts`:

```ts
export type CurrentWeatherRequest = {
	latitude: number
	longitude: number
}
```

`apps/stephen-daily/services/common/weather/weather-res.dto.ts`:

```ts
export type CurrentWeatherResponse = {
	current: {
		temperature_2m: number
		weather_code: number
		is_day: number
	}
}
```

`apps/stephen-daily/services/common/weather/index.ts`:

```ts
import { commonRequest } from '@repo/stephen-utils/axios'
import type { CurrentWeatherRequest } from './weather-req.dto'
import type { CurrentWeatherResponse } from './weather-res.dto'

export const weatherService = {
	getCurrentWeather: {
		key: (params: CurrentWeatherRequest) => ['common', 'weather', 'get_current_weather', params] as const,
		get: async (params: CurrentWeatherRequest, options?: { signal?: AbortSignal }) => {
			const response = await commonRequest.get<CurrentWeatherResponse>('https://api.open-meteo.com/v1/forecast', {
				params: {
					...params,
					current: 'temperature_2m,weather_code,is_day',
					timezone: 'auto',
				},
				signal: options?.signal,
			})
			return response.data
		},
	},
}
```

## TanStack Query usage

Import React Query APIs from `@repo/stephen-utils/react-query` in client components
or existing client hooks. `stephen-daily` already mounts `QueryClientProvider`.

```tsx
import { useQuery } from '@repo/stephen-utils/react-query'
import { weatherService } from '@/services/common/weather'

const params = { latitude: 10.8231, longitude: 106.6297 }

const query = useQuery({
	queryKey: weatherService.getCurrentWeather.key(params),
	queryFn: ({ signal }) => weatherService.getCurrentWeather.get(params, { signal }),
})
```

- Components handle presentation, loading/errors, events, and browser permissions.
- Services handle requests; components must not call HTTP endpoints directly.
- Pass TanStack Query's signal through the service to Axios for cancellable reads.
- Server-side code may call the same service directly without React hooks.
- Do not attach user-specific credentials to the shared Axios instance's defaults
  on the server. Pass request-specific headers where an actual auth contract requires them.
- Do not add auth refresh, redirects, global error toasts, or retries without a
  verified requirement. Preserve existing query defaults unless the task changes them.
- Do not create custom hooks solely to wrap one `useQuery` call.

## Review checklist

Verify module location, actual request/response contracts, service-owned keys,
complete cache inputs, typed responses, cancellation, and preservation of behavior.
Reject inline HTTP calls in newly added/modified view code, hardcoded query keys,
`any`, invented API contracts, and unnecessary wrappers or role-based folders.
