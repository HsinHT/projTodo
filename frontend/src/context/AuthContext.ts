// frontend\src\context\AuthContext.ts

import { createContext } from "react"
import type { User } from "../types"

export interface AuthContextType {
    token: string | null
    isAuthenticated: boolean
    user: User | null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    updateUser: (userUpdate: { display_name?: string, avatar?: string }) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
