import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router'
import { ToastProvider } from './common/ui'

import './styles/variables.css'
import './styles/global.css'
import './styles/layout.css'
import './styles/ui.css'
import './styles/forms.css'
import './styles/auth.css'
import './styles/home.css'
import './styles/dataset.css'
import './styles/modal.css'
import './styles/upload.css'
import './styles/admin.css'
import './styles/pricing.css'
import './styles/feedback.css'
import './styles/not-found.css'
import './styles/animations.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>,
)