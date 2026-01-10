export type Priority = 'high' | 'medium' | 'low'
export type Tag = 'work' | 'personal' | 'shopping' | 'health' | 'other'

export interface Todo {
    id: number
    title: string
    description?: string
    completed: boolean
    order: number
    priority?: Priority
    tags?: Tag[]
}

export interface User {
    username: string
    display_name?: string
    avatar?: string
}
