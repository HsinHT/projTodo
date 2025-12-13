// frontend\src\components\Register.tsx

import React, { useState } from "react"
import { registerUser } from "../api/client"

interface RegisterProps {
    onSwitchToLogin: () => void // 註冊成功或點擊切換時呼叫
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // 前端基本驗證
        if (password !== confirmPassword) {
            setError("兩次輸入的密碼不一致")
            return
        }

        if (password.length < 8) {
            setError("密碼長度至少需 8 個字元")
            return
        }

        try {
            await registerUser(username, password)
            setSuccess(true)
            // 延遲 1.5 秒後自動跳轉到登入頁
            setTimeout(() => {
                onSwitchToLogin()
            }, 1500)
        } catch(err) {
            // 檢查 err 是否為標準 Error 物件的實例
            if (err instanceof Error) {
                setError(err.message)
            } else {
                // 如果拋出的不是 Error 物件 (極少見，但在 JS 中是可能的)，給一個預設訊息
                setError("註冊失敗")
            }
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-green-100 p-6 rounded shadow-md text-center">
                    <h2 className="text-xl font-bold text-green-700 mb-2">註冊成功！</h2>
                    <p>正為您跳轉至登入頁…</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4 text-center">
                    註冊帳號
                </h2>

                { error && <div className="bg-red-100 text-red-700 p-2 text-sm rounded mb-4">{error}</div> }

                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input
                        className="border p-2 rounded"
                        type="text"
                        placeholder="帳號"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="border p-2 rounded"
                        type="password"
                        placeholder="密碼"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        className="border p-2 rounded"
                        type="password"
                        placeholder="確認密碼"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition" type="submit">
                        註冊
                    </button>
                </form>

                <div className="mt-4 text-sm text-center text-gray-600">
                    已有帳號？
                    <button className="text-blue-500 underline ml-1" onClick={onSwitchToLogin}>
                        馬上登入
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Register
