import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './app/router'

import './styles/global.css'
import './styles/layout.css'
import './styles/buttons.css'
import './styles/forms.css'
import './styles/dataset.css'
import './styles/labeling.css'
import './styles/modal.css'
import './styles/admin.css'
import './styles/pricing.css'
import './styles/patch.css'
import './styles/premium.css'
import './styles/dark-theme.css'
import './styles/admin-upload-modern.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)