import { useState } from 'react'
import { TodoProvider } from './context/TodoProvider'
import { useTodos } from './hooks/useTodos'
import { AuthProvider } from './context/AuthProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { useAuth } from './hooks/useAuth'
import Login from './components/Login'
import Register from './components/Register'
import { TodoList } from './components/TodoList'
import { Header } from './components/Header'
import type { Todo } from './types'

const TodoListApp = () => {
  const { todos, addTodo, updateTodoItem, deleteTodoItem, reorderTodoItem, loading } = useTodos()
  const { logout } = useAuth()

  const handleAddTodo = (title: string) => {
    addTodo(title)
  }

  const handleUpdateTodo = (id: number, data: Partial<Todo>) => {
    updateTodoItem(id, data)
  }

  const handleDeleteTodo = (id: number) => {
    deleteTodoItem(id)
  }

  const handleReorderTodo = (oldIndex: number, newIndex: number) => {
    reorderTodoItem(oldIndex, newIndex)
  }

  return (
    <>
      <Header onLogout={logout} />
      <TodoList
        todos={todos}
        loading={loading}
        onAddTodo={handleAddTodo}
        onUpdateTodo={handleUpdateTodo}
        onDeleteTodo={handleDeleteTodo}
        onReorderTodo={handleReorderTodo}
      />
    </>
  )
}

const AppContent = () => {
  const { isAuthenticated } = useAuth()
  const [isRegistering, setIsRegistering] = useState(false)

  if (isAuthenticated) {
    return (
      <TodoProvider>
        <TodoListApp />
      </TodoProvider>
    )
  }

  if (isRegistering) {
    return <Register onSwitchToLogin={() => setIsRegistering(false)} />
  }

  return <Login onSwitchToRegister={() => setIsRegistering(true)} />
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <AppContent />
        </div>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
