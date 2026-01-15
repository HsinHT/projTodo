// frontend\src\context\TodoProvider.tsx
import { useEffect, useState } from 'react'
// 使用 'import type' 來引入型別
import type { Todo, Priority } from '../types'
import { createTodo, getTodos, updateTodo, deleteTodo, reorderTodos } from '../api/client'
import { TodoContext } from './TodoContext'

const isValidPriority = (value: string): value is Priority => {
    return ['high', 'medium', 'low'].includes(value)
}

const convertApiTodo = (apiTodo: any): Todo => ({
    ...apiTodo,
    priority: apiTodo.priority && isValidPriority(apiTodo.priority) ? apiTodo.priority as Priority : undefined
})

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 初始狀態直接設為 true，避免在 useEffect 裡立刻 setState 造成二次渲染
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(true)

    // 初始載入
    useEffect(() => {
        getTodos()
            .then((data) => {
                // 將 todos 依照 order 排序並轉換類型
                const sortedTodos = [...data].sort((a, b) => a.order - b.order)
                setTodos(sortedTodos.map(convertApiTodo))
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
            // 樂觀更新或重新抓取，轉換類型
            setTodos((prev) => [ ...prev, convertApiTodo(newTodo) ])
        } catch(error) {
            console.error("Failed to create todo", error)
        }
    }

    // 更新邏輯
    const updateTodoItem = async (id: number, updates: Partial<Todo>) => {
        try {
            // 先呼叫後端
            // 將變變命名為 updatedTodo，避免與函式名稱衝突
            const updatedTodo = await updateTodo(id, updates)
            // 轉換類型後更新狀態
            setTodos((prev) => prev.map(todo => todo.id === id ? convertApiTodo(updatedTodo) : todo))
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

    // 重新排序邏輯
    const reorderTodoItem = async (oldIndex: number, newIndex: number) => {
        try {
            // 更新本地狀態 (樂觀更新)
            setTodos((prev) => {
                const newTodos = [...prev]
                const [removed] = newTodos.splice(oldIndex, 1)
                newTodos.splice(newIndex, 0, removed)

                // 更新每個 todo 的 order 值
                const updatedTodos = newTodos.map((todo, index) => ({
                    ...todo,
                    order: index
                }))

                // 呼叫後端 API 更新排序
                reorderTodos(updatedTodos.map((todo) => ({ id: todo.id, order: todo.order })))
                    .catch((error) => {
                        console.error("Failed to reorder todos", error)
                        // 如果失敗，回復原始順序
                        setTodos(prev)
                    })

                return updatedTodos
            })
        } catch(error) {
            console.error("Failed to reorder todo", error)
        }
    }

    return (
        <TodoContext.Provider value={{ todos, addTodo, updateTodoItem, deleteTodoItem, reorderTodoItem, loading }}>
            {children}
        </TodoContext.Provider>
    )
}
