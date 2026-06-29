import { createBrowserRouter } from 'react-router-dom'

import AppLayout from '../common/layout/AppLayout'
import ProtectedRoute from '../common/shared/ProtectedRoute'

import HomePage from '../pages/home/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import OAuthCallbackPage from '../pages/oauth/OAuthCallbackPage'
import DatasetListPage from '../pages/dataset/DatasetListPage'
import DatasetDetailPage from '../pages/dataset/DatasetDetailPage'
import UploadPage from '../pages/upload/UploadPage'
import PricingPage from '../pages/pricing/PricingPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import NotFoundPage from '../pages/notFound/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
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
        path: 'oauth/callback',
        element: <OAuthCallbackPage />,
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
        path: 'datasets/:id',
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
          <ProtectedRoute requireAdmin>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])