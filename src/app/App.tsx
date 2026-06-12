import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAuthStore } from '../stores/authStore'

function App() {
  const loadMe = useAuthStore((state) => state.loadMe)

  useEffect(() => {
    loadMe()
  }, [loadMe])

  return <RouterProvider router={router} />
}

export default App