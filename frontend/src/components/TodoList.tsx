import React, { useState, useEffect, useCallback } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TodoItem } from './TodoItem'
import { AddTodoForm } from './AddTodoForm'
import { ProgressBar } from './ProgressBar'
import { EmptyState } from './EmptyState'
import { SkeletonLoader } from './SkeletonLoader'
import Toast, { type ToastType } from './Toast'
import type { Todo, Priority, Tag } from '../types'

interface TodoListProps {
  todos: Todo[]
  loading: boolean
  onAddTodo: (title: string, priority?: Priority, tags?: Tag[]) => void
  onUpdateTodo: (id: number, data: Partial<Todo>) => void
  onDeleteTodo: (id: number) => void
  onReorderTodo: (oldIndex: number, newIndex: number) => void
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onReorderTodo
}) => {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const completedCount = todos.filter(t => t.completed).length
  const filteredTodos = todos.filter(todo => {
    if (activeFilter === 'active') return !todo.completed
    if (activeFilter === 'completed') return todo.completed
    return true
  })

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        const hasCompleted = todos.some(t => t.completed)
        if (hasCompleted && confirm('確定要刪除所有已完成的任務嗎？')) {
          todos.filter(t => t.completed).forEach(t => onDeleteTodo(t.id))
          showToast('success', '已完成任務已刪除')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [todos, onDeleteTodo, showToast])

  const handleAddTodo = (title: string, priority?: Priority, tags?: Tag[]) => {
    onAddTodo(title, priority, tags)
    showToast('success', '待辦事項已新增')
  }

  const handleUpdateTodo = (id: number, data: Partial<Todo>) => {
    onUpdateTodo(id, data)
    if (data.completed !== undefined && data.completed) {
      showToast('success', '任務已完成！')
    }
  }

  const handleDeleteTodo = (id: number) => {
    onDeleteTodo(id)
    showToast('success', '待辦事項已刪除')
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id)
      const newIndex = todos.findIndex((todo) => todo.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderTodo(oldIndex, newIndex)
      }
    }
  }

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <ProgressBar completed={completedCount} total={todos.length} />

      <AddTodoForm onAdd={handleAddTodo} />

      {todos.length === 0 ? (
        <EmptyState onAddTodo={() => {
          const input = document.querySelector('input[type="text"]') as HTMLInputElement | null
          input?.focus()
        }} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                全部 ({todos.length})
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === 'active'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                進行中 ({todos.filter(t => !t.completed).length})
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
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
                    todos.filter(t => t.completed).forEach(t => handleDeleteTodo(t.id))
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus-ring"
                aria-label="刪除所有已完成任務"
              >
                清除已完成
              </button>
            )}
          </div>

          {activeFilter === 'all' ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {filteredTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onUpdate={handleUpdateTodo}
                      onDelete={handleDeleteTodo}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="space-y-3">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>
                    {activeFilter === 'active' && '沒有進行中的任務'}
                    {activeFilter === 'completed' && '沒有已完成的任務'}
                  </p>
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={handleUpdateTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))
              )}
            </div>
          )}

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>快捷鍵: Ctrl+Enter 新增任務 • Ctrl+Shift+D 刪除已完成任務 • 拖曳可重新排序</p>
          </div>
        </>
      )}
    </div>
  )
}
