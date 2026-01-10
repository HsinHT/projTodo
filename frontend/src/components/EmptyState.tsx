import React from 'react'

interface EmptyStateProps {
  onAddTodo: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddTodo }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-24 h-24 mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        還沒有待辦事項
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        新增你的第一個待辦事項，開始規劃你的工作與生活吧！
      </p>
      
      <button
        onClick={onAddTodo}
        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 focus-ring"
      >
        新增待辦事項
      </button>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="w-10 h-10 mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            設定優先級
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            使用高、中、低優先級來管理任務重要性
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="w-10 h-10 mb-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            新增標籤
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            使用標籤將任務分類，更容易管理
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="w-10 h-10 mb-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            追蹤進度
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            查看完成進度，保持工作效率
          </p>
        </div>
      </div>
    </div>
  )
}
