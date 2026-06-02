import { cn } from "@/lib/utils"

interface SkeletonProps { className?: string }

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton rounded-lg", className)} />
}

export function PropertyCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <Skeleton className="h-48 sm:h-56 lg:h-64 w-full rounded-none" />
      <div className="p-4 sm:p-5 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-3 sm:gap-4 pt-2">
          <Skeleton className="h-4 w-12 sm:w-16" />
          <Skeleton className="h-4 w-12 sm:w-16" />
          <Skeleton className="h-4 w-12 sm:w-16" />
        </div>
        <Skeleton className="h-9 w-full rounded-xl mt-2" />
      </div>
    </div>
  )
}

export function VehicleCardSkeleton() {
  return <PropertyCardSkeleton />
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 sm:gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5">
            <Skeleton className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg mb-2 sm:mb-3" />
            <Skeleton className="h-5 sm:h-7 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <Skeleton className="h-5 w-32 mb-4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 sm:space-y-6">
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <Skeleton className="h-5 w-28 mb-4" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
