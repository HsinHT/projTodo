import React from 'react'

type FilterType = 'all' | 'active' | 'completed'

interface TodoFilterProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  totalCount: number
  completedCount: number
  onClearCompleted: () => void
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  activeFilter,
  onFilterChange,
  totalCount,
  completedCount,
  onClearCompleted
}) => {
  const activeCount = totalCount - completedCount

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          全部 ({totalCount})
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeFilter === 'active'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          進行中 ({activeCount})
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeFilter === 'completed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          已完成 ({completedCount})
        </button>
      </div>

      {completedCount > 0 && (
        <button
          onClick={() => {
            if (confirm('確定要刪除所有已完成的任務嗎？')) {
              onClearCompleted()
            }
          }}
          className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus-ring"
          aria-label="刪除所有已完成任務"
        >
          清除已完成
        </button>
      )}
    </div>
  )
}
