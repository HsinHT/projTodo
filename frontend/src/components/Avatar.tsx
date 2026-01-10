import React from 'react'

export interface AvatarProps {
  displayName: string
  avatar?: string
  size?: number
}

const COLORS = [
  'from-blue-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-green-500 to-teal-600',
  'from-yellow-500 to-orange-600',
  'from-indigo-500 to-blue-600',
  'from-red-500 to-pink-600',
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

export const Avatar: React.FC<AvatarProps> = ({ displayName, avatar, size = 40 }) => {
  const avatarColor = getAvatarColor(displayName)

  if (avatar?.startsWith('https://')) {
    return (
      <img
        src={avatar}
        alt={displayName}
        className="rounded-full object-cover border-2 border-white dark:border-gray-700"
        style={{ width: size, height: size }}
      />
    )
  }

  if (avatar?.length === 2) {
    return (
      <div
        className={`rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {avatar}
      </div>
    )
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-br ${avatar || avatarColor} flex items-center justify-center text-white font-bold`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {displayName.charAt(0).toUpperCase()}
    </div>
  )
}
