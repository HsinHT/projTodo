import React from 'react'

interface ProgressBarProps {
  completed: number
  total: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          完成進度
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {percentage}%
        </span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {completed} / {total} 項已完成
      </p>
    </div>
  )
}
