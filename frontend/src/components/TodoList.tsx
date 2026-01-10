import React, { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TodoItem } from './TodoItem'
import { AddTodoForm } from './AddTodoForm'
import { ProgressBar } from './ProgressBar'
import { EmptyState } from './EmptyState'
import { SkeletonLoader } from './SkeletonLoader'
import { TodoFilter } from './TodoFilter'
import { useToast } from '../hooks/useToast'
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
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all')
  const { toast, showToast, ToastComponent } = useToast()

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

  const handleClearCompleted = () => {
    todos.filter(t => t.completed).forEach(t => onDeleteTodo(t.id))
    showToast('success', '已完成任務已刪除')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        const hasCompleted = todos.some(t => t.completed)
        if (hasCompleted && confirm('確定要刪除所有已完成的任務嗎？')) {
          handleClearCompleted()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [todos, handleClearCompleted])

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
      <ToastComponent />

      <ProgressBar completed={completedCount} total={todos.length} />

      <AddTodoForm onAdd={handleAddTodo} />

      {todos.length === 0 ? (
        <EmptyState onAddTodo={() => {
          const input = document.querySelector('input[type="text"]') as HTMLInputElement | null
          input?.focus()
        }} />
      ) : (
        <>
          <TodoFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            totalCount={todos.length}
            completedCount={completedCount}
            onClearCompleted={handleClearCompleted}
          />

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
