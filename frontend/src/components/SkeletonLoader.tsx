import React from 'react'

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-shimmer p-4 rounded-xl bg-gray-100 dark:bg-gray-800"
        >
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
