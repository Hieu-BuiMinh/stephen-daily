'use client'

import { useState } from 'react'
import { useQuery } from '@repo/stephen-utils/react-query'
import { weatherService } from '@/services/common/weather'
import {
	Cloud,
	CloudDrizzle,
	CloudFog,
	CloudLightning,
	CloudRain,
	CloudSnow,
	CloudSun,
	LocateFixed,
	Moon,
	Sun,
} from 'lucide-react'

function describeWeather(code: number, isDay: number) {
	if (code === 0) return { label: isDay ? 'Clear sky' : 'Clear night', Icon: isDay ? Sun : Moon }
	if (code <= 2) return { label: 'Partly cloudy', Icon: CloudSun }
	if (code === 3) return { label: 'Overcast', Icon: Cloud }
	if (code <= 48) return { label: 'Fog', Icon: CloudFog }
	if (code <= 57) return { label: 'Drizzle', Icon: CloudDrizzle }
	if (code <= 67 || (code >= 80 && code <= 82)) return { label: 'Rain', Icon: CloudRain }
	if (code <= 86) return { label: 'Snow', Icon: CloudSnow }
	return { label: 'Thunderstorm', Icon: CloudLightning }
}

function NavbarWeather() {
	const [location, setLocation] = useState({ latitude: 10.8231, longitude: 106.6297, name: 'Ho Chi Minh City' })
	const [locationError, setLocationError] = useState('')
	const [locating, setLocating] = useState(false)
	const params = { latitude: location.latitude, longitude: location.longitude }

	function handleLocationClick() {
		setLocationError('')
		if (!navigator.geolocation) {
			setLocationError('Your browser does not support geolocation.')
			return
		}
		setLocating(true)
		navigator.geolocation.getCurrentPosition(
			({ coords }) => {
				setLocating(false)
				if (coords.latitude === params.latitude && coords.longitude === params.longitude) {
					void weatherQuery.refetch()
				}
				setLocation({ latitude: coords.latitude, longitude: coords.longitude, name: 'Your location' })
			},
			(error) => {
				setLocating(false)
				setLocationError(
					error.code === error.PERMISSION_DENIED
						? 'Location permission denied.'
						: 'Unable to get your location. Please try again.'
				)
			},
			{ enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
		)
	}

	const weatherQuery = useQuery({
		queryKey: weatherService.getCurrentWeather.key(params),
		queryFn: ({ signal }) => weatherService.getCurrentWeather.get(params, { signal }),
		// Keep the existing immediate error state and explicit retry button.
		retry: false,
	})
	const loading = weatherQuery.isPending || (weatherQuery.isError && weatherQuery.isFetching)

	const description = weatherQuery.isSuccess
		? describeWeather(weatherQuery.data.current.weather_code, weatherQuery.data.current.is_day)
		: null
	const Icon = description?.Icon

	return (
		<div className="min-w-0 space-y-1">
			<p className="font-playfair text-[10px] font-semibold">Today&apos;s weather</p>
			<p className="font-playfair text-sm leading-tight sm:text-base">{location.name}</p>
			<div aria-live="polite" className="text-[11px] text-muted-foreground">
				{locationError && <p>{locationError}</p>}
				{loading && <p>Loading weather…</p>}
				{weatherQuery.isError && !weatherQuery.isFetching && (
					<button
						type="button"
						onClick={() => void weatherQuery.refetch()}
						className="underline underline-offset-2"
					>
						Unable to load · Retry
					</button>
				)}
				{weatherQuery.isSuccess && Icon && (
					<p className="flex flex-wrap items-center gap-x-2 gap-y-1">
						<span>{description.label}</span>
						<Icon aria-hidden="true" className="size-4 shrink-0" />
						<span className="border-l pl-2 font-mono text-foreground">
							{Math.round(weatherQuery.data.current.temperature_2m)}°C
						</span>
					</p>
				)}
			</div>
			<button
				type="button"
				onClick={handleLocationClick}
				disabled={locating || weatherQuery.isFetching}
				className="inline-flex items-center gap-1 text-[10px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
			>
				<LocateFixed aria-hidden="true" className="size-3 shrink-0" />
				{locating ? 'Locating…' : 'Use my location'}
			</button>
		</div>
	)
}

export default NavbarWeather
