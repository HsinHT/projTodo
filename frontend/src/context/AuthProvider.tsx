// frontend\src\context\AuthProvider.tsx

import React, { useState } from "react"
import { AuthContext } from "./AuthContext"
import { loginUser } from "../api/client"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 傳入一個函式給 useState
    // React 只會在組件初次建立時執行這個函式一次
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("token")
    })

    const login = async (username: string, password: string) => {
        try {
            const data = await loginUser(username, password)
            const accessToken = data.access_token
            setToken(accessToken)
            localStorage.setItem("token", accessToken)
        } catch(error) {
            console.error("Login failed", error)
            throw error // 拋出錯誤讓 UI 處理
        }
    }

    const logout = () => {
        setToken(null)
        localStorage.removeItem("token")
    }

    return (
        <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}