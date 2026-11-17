import 'dayjs/locale/vi.js'
import 'dayjs/locale/en.js'
import 'dayjs/locale/id.js'
import 'dayjs/locale/zh-cn.js'

import dayjs, { type Dayjs, type OpUnitType } from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import duration from 'dayjs/plugin/duration.js'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(weekOfYear)
dayjs.extend(duration)

export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh'

dayjs.locale('en')
dayjs.tz.setDefault(DEFAULT_TIMEZONE)

export type DateInput = string | number | Date | Dayjs | null | undefined
export type { Dayjs, OpUnitType }

export const d = dayjs
export { dayjs }

export const setLocale = (locale: string) => dayjs.locale(locale)

// setDefault only affects dayjs.tz(); convert explicitly to avoid the server's local timezone.
export function formatDate(input: DateInput, format = 'MM/DD/YYYY', tz = DEFAULT_TIMEZONE): string {
	if (input == null) return ''
	const date = dayjs(input)
	return date.isValid() ? date.tz(tz).format(format) : ''
}

export function formatTime(input: DateInput, format = 'HH:mm', tz = DEFAULT_TIMEZONE): string {
	return formatDate(input, format, tz)
}

export function formatDateTime(input: DateInput, format = 'MM/DD/YYYY HH:mm', tz = DEFAULT_TIMEZONE): string {
	return formatDate(input, format, tz)
}

export function parseAndFormat(
	input: string,
	parseFormat: string,
	outputFormat = 'MM/DD/YYYY',
	tz = DEFAULT_TIMEZONE
): string {
	const date = dayjs(input, parseFormat, true)
	return date.isValid() ? date.tz(tz).format(outputFormat) : ''
}

export function fromNow(input: DateInput): string {
	if (input == null) return ''
	const date = dayjs(input)
	return date.isValid() ? date.fromNow() : ''
}

export function toISO(input: DateInput): string {
	if (input == null) return ''
	const date = dayjs(input)
	return date.isValid() ? date.toISOString() : ''
}

export function clampTo(
	input: DateInput,
	unit: OpUnitType,
	edge: 'start' | 'end' = 'start',
	tz = DEFAULT_TIMEZONE
): Dayjs | null {
	if (input == null) return null
	const date = dayjs(input)
	if (!date.isValid()) return null
	return edge === 'start' ? date.tz(tz).startOf(unit) : date.tz(tz).endOf(unit)
}

export function parse(input: string, parseFormat?: string, tz = DEFAULT_TIMEZONE): Dayjs | null {
	const date = parseFormat ? dayjs(input, parseFormat, true) : dayjs(input)
	return date.isValid() ? date.tz(tz) : null
}

export default dayjs
