import type { ComponentProps } from 'react'
import { Skeleton } from '@repo/stephen-ui/base/skeleton'
import { cn } from '@repo/stephen-utils'

export type DailySkeletonProps = ComponentProps<typeof Skeleton>

export function DailySkeleton({ className, ...props }: DailySkeletonProps) {
	return <Skeleton {...props} data-slot="daily-skeleton" className={cn('rounded-none', className)} />
}
