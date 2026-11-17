import { AxiosBuilder } from './axios-builder'

export const commonRequest = new AxiosBuilder({
	timeout: 30_000,
	headers: {
		Accept: 'application/json',
	},
}).build()

export { AxiosBuilder }
export { isAxiosError } from 'axios'
export type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
export type { TApiResponse, TApiListResponse } from './types'
