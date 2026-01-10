import React from 'react'

type ButtonVariant = 'primary' | 'gradient' | 'outline' | 'text'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
}

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white',
  outline: 'bg-transparent border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
  text: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={props.disabled || false}
      className={`
        px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none focus-ring
        ${fullWidth ? 'w-full' : ''}
        ${buttonStyles[variant]}
        ${variant === 'gradient' && 'disabled:from-gray-300 disabled:to-gray-400'}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
