// frontend\src\App.tsx
import React, { useState } from 'react'
import { TodoProvider } from './context/TodoProvider'
import { AuthProvider } from './context/AuthProvider'
import { useAuth } from './hooks/useAuth'
import { useTodos } from './hooks/useTodos'
import Login from './components/Login'
import Register from './components/Register'
import type { Todo } from './types'

// 子元件：單個 Todo 項目 (處理顯示/編輯/刪除)
const TodoItem = ({ todo }: { todo: Todo }) => {
  const { updateTodoItem, deleteTodoItem } = useTodos()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)

  // 切換完成狀態
  const handleToggle = () => {
    updateTodoItem(todo.id, { title: todo.title, completed: !todo.completed })
  }

  // 刪除
  const handleDelete = () => {
    if (confirm("確定要刪除嗎？")) {
      deleteTodoItem(todo.id)
    }
  }

  // 開始編輯
  const handleEdit = () => {
    setIsEditing(true)
    setEditTitle(todo.title)
  }

  // 儲存編輯
  const handleSave = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      updateTodoItem(todo.id, { title: editTitle, completed: todo.completed })
    }

    setIsEditing(false)
  }

  // 取消編輯
  const handleCancel = () => {
    setIsEditing(false)
    setEditTitle(todo.title)
  }

  return (
    <li className={`border p-3 rounded shadow-sm flex items-center justify-between bg-white ${todo.completed ? 'bg-gray-500' : '' }`}>
      {
        isEditing ? (
          // 編輯模式
          <div className='flex flex-1 gap-2'>
            <input
              className='border p-1 flex-1 rounded'
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
            />
            <button className='text-green-600 font-bold px-2 hover:bg-green-50 rounded' onClick={handleSave}>
              儲存
            </button>
            <button className='text-gray-500 px-2 hover:bg-gray-100 rounded' onClick={handleCancel}>
              取消
            </button>
          </div>
        ) : (
          // 顯示模式
          <>
            <div className='flex items-center gap-3 flex-1 overflow-hidden'>
              <input
                className='w-5 h-5 cursor-pointer accent-blue-500'
                type='checkbox'
                checked={todo.completed}
                onChange={handleToggle}
              />
              <span
                className={`truncate cursor-pointer select-none ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800' }`}
                onClick={handleToggle}
              >
                { todo.title }
              </span>
            </div>

            <div className='flex gap-2 ml-2'>
              <button
                className='text-sm bg-yellow-100 text-yellow-700 px-3 rounded hover:bg-yellow-200 transition'
                onClick={handleEdit}
              >
                編輯
              </button>
              <button
                className='text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition'
                onClick={handleDelete}
              >
                刪除
              </button>
            </div>
          </>
        )
      }
    </li>
  )
}

// TodoList 主介面 (登入後顯示)
const TodoListApp = () => {
  const {todos, addTodo, loading} = useTodos()
  const { logout } = useAuth()
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      addTodo(input)
      setInput("")
    }
  }

  if (loading) return <div className="p-4">載入中...</div>

  return (
    <div className='p-4 max-w-md mx-auto'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Todo List</h1>
        <button className='text-sm text-red-500 underline' onClick={logout}>登出</button>
      </div>

      <form className='flex gap-2 mb-4' onSubmit={handleSubmit}>
        <input
          className='border border-gray-300 p-3 flex-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='新增待辦事項...'
        />
        <button
          className='bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 shadow-md transition transform active:scale-95'
          type='submit'
        >
          新增
        </button>
      </form>

      <ul className='space-y-3'>
        {
          todos.length === 0 ? (
            <p className='text-center text-gray-400 mt-10'>目前沒有任務，試著新增一個吧！</p>
          ) : (
            todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))
          )
        }
      </ul>
    </div>
  )
}

// 主要的內容切換邏輯
const AppContent = () => {
  const { isAuthenticated } = useAuth()
  // 管理目前是否在註冊頁面
  const [isRegistering, setIsRegistering] = useState(false)

  // 如果已登入，顯示 Todo App
  if (isAuthenticated) {
    return (
      <TodoProvider>
        <TodoListApp />
      </TodoProvider>
    )
  }

  // 如果未登入，判斷要顯示註冊或登入頁
  if (isRegistering) {
    return <Register onSwitchToLogin={() => setIsRegistering(false)} />
  }

  return <Login onSwitchToRegister={() => setIsRegistering(true)} />
}

function App() {
  return (
    // 最外層包 AuthProvider，讓整個 App 都能存取登入狀態
    <AuthProvider>
      {/* 增加背景色讓介面更好看 */}
      <div className="min-h-screen bg-gray-50 py-10">
        <AppContent />
      </div>
    </AuthProvider>
  )
}

export default App
