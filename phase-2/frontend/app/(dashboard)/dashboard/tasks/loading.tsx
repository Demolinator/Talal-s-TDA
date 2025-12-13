/**
 * Loading State for Tasks Page
 *
 * Displays skeleton screens while tasks are being fetched.
 * Uses Suspense boundary to provide smooth loading experience.
 */
export default function TasksLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
        <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200" />
      </div>

      {/* Filters Skeleton */}
      <div className="mb-6 flex gap-4">
        <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
        <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
        <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200" />
      </div>

      {/* Task Cards Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <TaskCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

/**
 * Task Card Skeleton Component
 *
 * Reusable skeleton component that mimics the layout of a task card.
 */
function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Card Header */}
      <div className="mb-3 flex items-start justify-between">
        {/* Checkbox Skeleton */}
        <div className="h-5 w-5 animate-pulse rounded border-2 border-gray-300" />

        {/* Actions Skeleton */}
        <div className="flex gap-2">
          <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
          <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="mb-2 h-6 w-3/4 animate-pulse rounded-md bg-gray-200" />

      {/* Description Skeleton */}
      <div className="mb-3 space-y-2">
        <div className="h-4 w-full animate-pulse rounded-md bg-gray-100" />
        <div className="h-4 w-5/6 animate-pulse rounded-md bg-gray-100" />
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="h-3 w-24 animate-pulse rounded-md bg-gray-200" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
