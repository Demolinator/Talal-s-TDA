/**
 * Loading State for Dashboard Home Page
 *
 * Displays skeleton screens while dashboard data is being fetched.
 */
export default function DashboardLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Welcome Message Skeleton */}
      <div className="mb-8">
        <div className="mb-2 h-8 w-64 animate-pulse rounded-md bg-gray-200" />
        <div className="h-4 w-96 animate-pulse rounded-md bg-gray-100" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-2 h-4 w-24 animate-pulse rounded-md bg-gray-200" />
            <div className="h-8 w-16 animate-pulse rounded-md bg-gray-300" />
          </div>
        ))}
      </div>

      {/* Recent Tasks Section Skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
        <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
      </div>

      {/* Task List Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 animate-pulse rounded border-2 border-gray-300" />
              <div className="flex-1">
                <div className="mb-2 h-5 w-3/4 animate-pulse rounded-md bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded-md bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
