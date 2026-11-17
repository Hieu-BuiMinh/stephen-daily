import axios, {
	AxiosHeaders,
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type CreateAxiosDefaults,
	type InternalAxiosRequestConfig,
	type RawAxiosRequestHeaders,
} from 'axios'

type RequestOptions<D = unknown> = {
	url: string
	config?: AxiosRequestConfig<D>
}

type BodyRequestOptions<D> = RequestOptions<D> & { data?: D }

type RequestInterceptor = (
	config: InternalAxiosRequestConfig<unknown>
) => InternalAxiosRequestConfig<unknown> | Promise<InternalAxiosRequestConfig<unknown>>

type ResponseInterceptor = (
	response: AxiosResponse<unknown, unknown>
) => AxiosResponse<unknown, unknown> | Promise<AxiosResponse<unknown, unknown>>

type ResponseErrorInterceptor = (
	error: unknown
) => AxiosResponse<unknown, unknown> | Promise<AxiosResponse<unknown, unknown>>

export class AxiosBuilder {
	protected readonly instance: AxiosInstance

	constructor(config?: CreateAxiosDefaults<unknown>) {
		this.instance = axios.create(config)
	}

	setBaseUrl(baseURL: string) {
		this.instance.defaults.baseURL = baseURL
		return this
	}

	setTimeout(timeout: number) {
		this.instance.defaults.timeout = timeout
		return this
	}

	setHeaders(headers: RawAxiosRequestHeaders) {
		const commonHeaders = new AxiosHeaders()
		for (const [name, value] of Object.entries({ ...this.instance.defaults.headers.common, ...headers })) {
			commonHeaders.set(name, value)
		}
		this.instance.defaults.headers.common = commonHeaders
		return this
	}

	setToken(token: string) {
		return this.setHeaders({ Authorization: `Bearer ${token}` })
	}

	addRequestInterceptor(interceptor: RequestInterceptor) {
		this.instance.interceptors.request.use(interceptor)
		return this
	}

	addResponseInterceptor(interceptor: ResponseInterceptor) {
		this.instance.interceptors.response.use(interceptor)
		return this
	}

	addResponseErrorInterceptor(interceptor: ResponseErrorInterceptor) {
		this.instance.interceptors.response.use(undefined, interceptor)
		return this
	}

	get<T>({ url, config }: RequestOptions): Promise<AxiosResponse<T, unknown>> {
		return this.instance.get<T, AxiosResponse<T, unknown>>(url, config)
	}

	post<T, D = unknown>({ url, data, config }: BodyRequestOptions<D>): Promise<AxiosResponse<T, D>> {
		return this.instance.post<T, AxiosResponse<T, D>, D>(url, data, config)
	}

	put<T, D = unknown>({ url, data, config }: BodyRequestOptions<D>): Promise<AxiosResponse<T, D>> {
		return this.instance.put<T, AxiosResponse<T, D>, D>(url, data, config)
	}

	patch<T, D = unknown>({ url, data, config }: BodyRequestOptions<D>): Promise<AxiosResponse<T, D>> {
		return this.instance.patch<T, AxiosResponse<T, D>, D>(url, data, config)
	}

	delete<T>({ url, config }: RequestOptions): Promise<AxiosResponse<T, unknown>> {
		return this.instance.delete<T, AxiosResponse<T, unknown>>(url, config)
	}

	build(): AxiosInstance {
		return this.instance
	}
}
