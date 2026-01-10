import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Toast, { type ToastType } from './Toast'

interface SettingsProps {
  onClose: () => void
}

const AVATAR_COLORS = [
  'from-blue-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-green-500 to-teal-600',
  'from-yellow-500 to-orange-600',
  'from-indigo-500 to-blue-600',
  'from-red-500 to-pink-600',
]

const AVATAR_EMOJIS = ['😊', '🎉', '🚀', '💪', '🌟', '🎨', '🎯', '🔥', '💎', '🌈']

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { user, updateUser } = useAuth()
  const [displayName, setDisplayName] = useState(user?.display_name || user?.username || '')
  const [selectedEmoji, setSelectedEmoji] = useState(user?.avatar?.length === 2 ? user.avatar : AVATAR_EMOJIS[0])
  const [selectedColor, setSelectedColor] = useState(() => {
    if (user?.avatar?.startsWith('https://')) return ''
    const match = user?.avatar?.match(/from-([a-z]+)-500/)
    return match?.[1] ? `from-${match[1]}-500` : AVATAR_COLORS[0]
  })
  const [avatarType, setAvatarType] = useState<'emoji' | 'gradient' | 'url'>(
    user?.avatar?.startsWith('https://') ? 'url' : (user?.avatar?.length === 2 ? 'emoji' : 'gradient')
  )
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.startsWith('https://') ? user.avatar : '')
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    setDisplayName(user?.display_name || user?.username || '')
    if (user?.avatar?.startsWith('https://')) {
      setAvatarType('url')
      setAvatarUrl(user.avatar)
      setImageError(false)
      setImageLoaded(false)
    } else if (user?.avatar?.length === 2) {
      setAvatarType('emoji')
      setSelectedEmoji(user.avatar)
      setImageError(false)
      setImageLoaded(false)
    } else if (user?.avatar) {
      setAvatarType('gradient')
      setSelectedColor(user.avatar)
      setImageError(false)
      setImageLoaded(false)
    }
  }, [user])

  useEffect(() => {
    if (avatarType === 'url' && avatarUrl) {
      setImageError(false)
      setImageLoaded(false)
    }
  }, [avatarUrl, avatarType])

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let finalAvatar: string | undefined
      
      if (avatarType === 'url' && avatarUrl) {
        finalAvatar = avatarUrl
      } else if (avatarType === 'emoji') {
        finalAvatar = selectedEmoji
      } else if (avatarType === 'gradient') {
        finalAvatar = selectedColor
      }

      await updateUser({
        display_name: displayName || user?.username,
        avatar: finalAvatar
      })
      
      showToast('success', '設置已保存')
      setTimeout(() => onClose(), 1000)
    } catch (error) {
      console.error('Failed to update user:', error)
      showToast('error', '保存失敗')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              個人設置
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              暱稱
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="輸入您的暱稱"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              頭像類型
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setAvatarType('emoji')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  avatarType === 'emoji'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                表情符號
              </button>
              <button
                onClick={() => setAvatarType('gradient')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  avatarType === 'gradient'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                漸變顏色
              </button>
              <button
                onClick={() => setAvatarType('url')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  avatarType === 'url'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                圖片網址
              </button>
            </div>
          </div>

          {avatarType === 'emoji' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                選擇表情符號
              </label>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-12 h-12 text-2xl rounded-lg transition-all ${
                      selectedEmoji === emoji
                        ? 'bg-blue-500 text-white scale-110'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {avatarType === 'gradient' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                選擇漸變顏色
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-12 rounded-lg transition-all ${
                      selectedColor === color
                        ? 'ring-4 ring-blue-500 ring-offset-2 scale-105'
                        : 'hover:scale-105'
                    } bg-gradient-to-br ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {avatarType === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                圖片網址
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              {avatarUrl && imageError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  ⚠️ 圖片無法加載，請檢查網址是否正確
                </p>
              )}
            </div>
          )}

          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              預覽
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {avatarType === 'url' && avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-600"
                  onLoad={() => {
                    setImageLoaded(true)
                    setImageError(false)
                  }}
                  onError={() => {
                    setImageError(true)
                    setImageLoaded(false)
                  }}
                />
              ) : (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                  avatarType === 'emoji'
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                    : 'bg-gradient-to-br text-white ' + selectedColor
                }`}>
                  {avatarType === 'emoji' ? selectedEmoji : displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {displayName || user?.username}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {avatarType === 'emoji' && '表情符號頭像'}
                  {avatarType === 'gradient' && '漸變色頭像'}
                  {avatarType === 'url' && !imageLoaded && !imageError && '等待圖片加載...'}
                  {avatarType === 'url' && imageLoaded && '自定義圖片'}
                  {avatarType === 'url' && imageError && '圖片加載失敗'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={saving}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
