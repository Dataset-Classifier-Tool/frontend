import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

type Toast = {
  id: number
  type: ToastType
  message: string
}

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = Date.now()

      setToasts((prevToasts) => [
        ...prevToasts,
        {
          id,
          type,
          message,
        },
      ])

      window.setTimeout(() => {
        removeToast(id)
      }, 3000)
    },
    [removeToast],
  )

  const value = useMemo(
    () => ({
      showToast,
      removeToast,
    }),
    [showToast, removeToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '!'}
              {toast.type === 'warning' && '⚠'}
              {toast.type === 'info' && 'i'}
            </span>

            <p>{toast.message}</p>

            <button
              type="button"
              className="toast-close"
              onClick={() => removeToast(toast.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast는 ToastProvider 내부에서만 사용할 수 있습니다.')
  }

  return context
}