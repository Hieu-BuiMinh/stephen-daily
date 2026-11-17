export type TApiResponse<T> = {
	status: string
	code: number
	message: string
	data: T
}

export type TApiListResponse<T> = TApiResponse<{
	status: string
	code: number
	message: string
	current_page: number
	data: T[]
	first_page_url: string
	from: number
	last_page: number
	last_page_url: string
	links: {
		url?: string | null
		label: string
		active: boolean
	}[]
	next_page_url: string | null
	path: string
	per_page: number
	prev_page_url: string | null
	to: number
	total: number
}>
