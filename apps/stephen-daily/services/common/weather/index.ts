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
