// frontend\src\context\TodoContext.ts
import { createContext } from 'react'
// 使用 'import type' 來引入型別
import type { Todo } from '../types'

// 這裡匯出介面，讓 Hook 檔案可以使用
export interface TodoContextType {
    todos: Todo[]
    addTodo: (title: string) => Promise<void>
    // 定義更新與刪除函式簽章
    updateTodoItem: (id: number, updates: { title: string, completed: boolean }) => Promise<void>
    deleteTodoItem: (id: number) => Promise<void>
    loading: boolean
}

// 匯出 Context 本體，以便 Hook 使用 useContext 存取
export const TodoContext = createContext<TodoContextType | undefined>(undefined)
