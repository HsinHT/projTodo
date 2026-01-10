import React, { useState } from 'react'
import { registerUser } from '../api/client'
import { Input } from './Input'
import { Button } from './Button'

interface RegisterProps {
  onSwitchToLogin: () => void
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致')
      return
    }

    if (password.length < 8) {
      setError('密碼長度至少需 8 個字元')
      return
    }

    try {
      await registerUser(username, password)
      setSuccess(true)
      setTimeout(() => {
        onSwitchToLogin()
      }, 1500)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('註冊失敗')
      }
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
              註冊成功！
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              正為您跳轉至登入頁…
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            建立新帳號
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            填寫以下資訊開始使用
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

            <div>
              <Input
                id="password"
                type="password"
                label="密碼"
                placeholder="至少 8 個字元"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              {password && (
                <p className={`mt-1 text-xs ${password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {password.length}/8 字元
                </p>
              )}
            </div>

            <Input
              id="confirmPassword"
              type="password"
              label="確認密碼"
              placeholder="請再次輸入密碼"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="gradient"
              fullWidth
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400"
              disabled={!username || !password || !confirmPassword || password.length < 8 || password !== confirmPassword}
            >
              註冊
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              已有帳號？
              <button
                onClick={onSwitchToLogin}
                className="ml-1 text-green-600 dark:text-green-400 font-medium hover:underline focus-ring rounded"
              >
                馬上登入
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

export default Register
