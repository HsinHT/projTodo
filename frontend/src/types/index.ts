// frontend\src\types\index.ts

export interface Todo {
    id: number
    title: string
    description?: string
    completed: boolean
}

export interface User {
    username: string
}
