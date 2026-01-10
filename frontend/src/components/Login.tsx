import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Input } from './Input'
import { Button } from './Button'

interface LoginProps {
  onSwitchToRegister: () => void
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
    } catch (error) {
      console.error(error)
      setError('登入失敗，請檢查帳號密碼')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            歡迎回來
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            登入您的帳號開始使用
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl animate-scale-in">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm animate-slide-in">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              id="username"
              type="text"
              label="帳號"
              placeholder="請輸入帳號"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />

            <Input
              id="password"
              type="password"
              label="密碼"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="gradient"
              fullWidth
              disabled={!username || !password}
            >
              登入
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              還沒有帳號？
              <button
                onClick={onSwitchToRegister}
                className="ml-1 text-blue-600 dark:text-blue-400 font-medium hover:underline focus-ring rounded"
              >
                註冊新帳號
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© 2025 Todo List. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
