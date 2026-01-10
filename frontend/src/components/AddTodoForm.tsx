import React, { useState } from 'react'
import type { Priority, Tag } from '../types'

interface AddTodoFormProps {
  onAdd: (title: string, priority?: Priority, tags?: Tag[]) => void
}

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'low', label: '低優先級' },
  { value: 'medium', label: '中優先級' },
  { value: 'high', label: '高優先級' }
]

const tagOptions: { value: Tag; label: string }[] = [
  { value: 'work', label: '工作' },
  { value: 'personal', label: '個人' },
  { value: 'shopping', label: '購物' },
  { value: 'health', label: '健康' },
  { value: 'other', label: '其他' }
]

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [showOptions, setShowOptions] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim(), priority, selectedTags)
      setTitle('')
      setPriority('medium')
      setSelectedTags([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  const toggleTag = (tag: Tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="新增待辦事項... (Ctrl+Enter 快速提交)"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all"
              aria-label="任務標題"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={`px-4 py-3 rounded-xl font-medium transition-all ${
              showOptions
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-label={`${showOptions ? '收起' : '展開'}選項`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showOptions ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed disabled:shadow-none focus-ring"
          >
            新增
          </button>
        </div>

        {showOptions && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                優先級
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all"
                aria-label="選擇優先級"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                標籤
              </label>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleTag(option.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      selectedTags.includes(option.value)
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label={`${selectedTags.includes(option.value) ? '移除' : '新增'} ${option.label} 標籤`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
