import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Todo, Priority, Tag } from '../types'

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: number, data: Partial<Todo>) => void
  onDelete: (id: number) => void
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
}

const tagColors: Record<Tag, string> = {
  work: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  personal: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  shopping: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  health: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
}

const priorityLabels: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低'
}

const tagLabels: Record<Tag, string> = {
  work: '工作',
  personal: '個人',
  shopping: '購物',
  health: '健康',
  other: '其他'
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [isHovered, setIsHovered] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleToggle = () => {
    onUpdate(todo.id, { completed: !todo.completed })
  }

  const handleDelete = () => {
    if (confirm('確定要刪除嗎？')) {
      onDelete(todo.id)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditTitle(todo.title)
  }

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      onUpdate(todo.id, { title: editTitle })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditTitle(todo.title)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative p-4 rounded-xl border-2 transition-all duration-300
        ${todo.completed
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover-elevation hover:border-blue-300 dark:hover:border-blue-600'
        }
        ${isEditing ? 'ring-2 ring-blue-500' : ''}
        ${isDragging ? 'opacity-50 shadow-2xl' : ''}
      `}
    >
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all"
            aria-label="編輯任務標題"
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors focus-ring"
            aria-label="儲存"
          >
            儲存
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors focus-ring"
            aria-label="取消"
          >
            取消
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <button
            {...listeners}
            className="mt-1 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing transition-colors"
            aria-label="拖曳以重新排序"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>

          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            className={`checkbox-custom mt-1 ${todo.completed ? 'checked' : ''}`}
            aria-label={`標記 ${todo.title} 為${todo.completed ? '未完成' : '已完成'}`}
          />

          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium text-base cursor-pointer transition-all ${
                todo.completed
                  ? 'text-gray-400 dark:text-gray-500 line-through'
                  : 'text-gray-900 dark:text-white'
              }`}
              onClick={handleToggle}
            >
              {todo.title}
            </h3>

            <div className="flex flex-wrap gap-2 mt-2">
              {todo.priority && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityColors[todo.priority]}`}>
                  {priorityLabels[todo.priority]}
                </span>
              )}
              {todo.tags?.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full cursor-pointer transition-opacity hover:opacity-80 ${tagColors[tag]}`}
                >
                  {tagLabels[tag]}
                </span>
              ))}
            </div>
          </div>

          <div className={`flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isHovered ? 'opacity-100' : ''}`}>
            <button
              onClick={handleEdit}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors focus-ring"
              aria-label="編輯"
              title="編輯"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus-ring"
              aria-label="刪除"
              title="刪除"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {todo.completed && !isEditing && (
        <div className="absolute inset-0 rounded-xl border-2 border-green-300 dark:border-green-600 pointer-events-none animate-scale-in" />
      )}
    </div>
  )
}
