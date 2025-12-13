// frontend\src\context\TodoProvider.tsx
import { useEffect, useState } from 'react'
// 使用 'import type' 來引入型別
import type { Todo } from '../types'
import { createTodo, getTodos, updateTodo, deleteTodo } from '../api/client'
import { TodoContext } from './TodoContext'

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 初始狀態直接設為 true，避免在 useEffect 裡立刻 setState 造成二次渲染
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(true)

    // 初始載入
    useEffect(() => {
        getTodos()
            .then((data) => {
                setTodos(data)
            })
            .catch((err) => {
                console.error("Failed to fetch todos", err)
            })
            .finally(() => {
                // 不管成功或失敗，最後都將 loading 設為 false
                setLoading(false)
            })
    }, [])

    const addTodo = async (title: string) => {
        try {
            const newTodo = await createTodo(title)
            // 樂觀更新或重新抓取
            setTodos((prev) => [ ...prev, newTodo ])
        } catch(error) {
            console.error("Failed to create todo", error)
        }
    }

    // 更新邏輯
    const updateTodoItem = async (id: number, updates: { title: string, completed: boolean }) => {
        try {
            // 先呼叫後端
            // 將變變命名為 updatedTodo，避免與函式名稱衝突
            const updatedTodo = await updateTodo(id, updates)
            // 現在 updatedTodo 是正確的 Todo 物件，型別錯誤消失
            setTodos((prev) => prev.map(todo => todo.id === id ? updatedTodo : todo))
        } catch(error) {
            console.error("Failed to update todo", error)
        }
    }

    // 刪除邏輯
    const deleteTodoItem = async (id: number) => {
        try {
            await deleteTodo(id)
            // 更新本地狀態 (透過 filter 移除)
            setTodos((prev) => prev.filter(todo => todo.id !== id))
        } catch(error) {
            console.error("Failed to delete todo", error)
        }
    }

    return (
        <TodoContext.Provider value={{ todos, addTodo, updateTodoItem, deleteTodoItem, loading }}>
            {children}
        </TodoContext.Provider>
    )
}
