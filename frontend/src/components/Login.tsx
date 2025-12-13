// frontend\src\components\Login.tsx

import React, { useState } from "react"
import { useAuth } from "../hooks/useAuth"

interface LoginProps {
    onSwitchToRegister: () => void
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
    const { login } = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        try {
            await login(username, password)
        } catch(error) {
            console.error(error)
            setError("登入失敗，請檢查帳號密碼")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4 text-center">登入系統</h2>
                { error && <p className="text-red-500 text-sm mb-2">{error}</p> }
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                        className="border p-2 rounded"
                        type="text"
                        placeholder="帳號"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="border p-2 rounded"
                        type="password"
                        placeholder="密碼"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600" type="submit">
                        登入
                    </button>
                </form>
                <div className="mt-4 text-sm text-center text-gray-600">
                    還沒有帳號？
                    <button className="text-bule-500 underlin ml-1" onClick={onSwitchToRegister}>
                        註冊新帳號
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
