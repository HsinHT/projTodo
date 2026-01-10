// frontend\src\context\AuthProvider.tsx

import React, { useState, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import { loginUser, getCurrentUser, updateUser as updateUserApi } from "../api/client"
import type { User } from "../types"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("token")
    })
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (token) {
            getCurrentUser()
                .then(data => setUser(data))
                .catch(error => {
                    console.error("Failed to get current user", error)
                    if (error.message === "Failed to get current user") {
                        setToken(null)
                        localStorage.removeItem("token")
                    }
                })
        }
    }, [token])

    const login = async (username: string, password: string) => {
        try {
            const data = await loginUser(username, password)
            const accessToken = data.access_token
            setToken(accessToken)
            localStorage.setItem("token", accessToken)
            const userData = await getCurrentUser()
            setUser(userData)
        } catch(error) {
            console.error("Login failed", error)
            throw error
        }
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem("token")
    }

    const updateUser = async (userUpdate: { display_name?: string, avatar?: string }) => {
        try {
            const updatedUser = await updateUserApi(userUpdate)
            setUser(updatedUser)
        } catch(error) {
            console.error("Failed to update user", error)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ token, isAuthenticated: !!token, user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}