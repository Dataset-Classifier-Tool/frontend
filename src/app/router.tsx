import { createBrowserRouter } from 'react-router-dom'

import App from './App'

import ProtectedRoute from '../common/components/ProtectedRoute'

import HomePage from '../pages/home/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DatasetListPage from '../pages/dataset/DatasetListPage'
import DatasetDetailPage from '../pages/dataset/DatasetDetailPage'
import UploadPage from '../pages/upload/UploadPage'
import PricingPage from '../pages/pricing/PricingPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import OAuthCallbackPage from '../pages/oauth/OAuthCallbackPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'datasets',
        element: (
          <ProtectedRoute>
            <DatasetListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'datasets/:datasetId',
        element: (
          <ProtectedRoute>
            <DatasetDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'upload',
        element: (
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'pricing',
        element: <PricingPage />,
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'oauth/callback',
        element: <OAuthCallbackPage />,
      },
    ],
  },
])