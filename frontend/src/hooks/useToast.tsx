import React, { useState, useCallback } from 'react'
import Toast, { type ToastType } from '../components/Toast'

interface UseToastReturn {
  toast: { type: ToastType; message: string } | null
  showToast: (type: ToastType, message: string) => void
  ToastComponent: React.FC
}

export const useToast = (): UseToastReturn => {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const ToastComponent = () => {
    return toast ? <Toast toastType={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null
  }

  return { toast, showToast, ToastComponent }
}
