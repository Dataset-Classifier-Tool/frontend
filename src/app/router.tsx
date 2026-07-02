import { createBrowserRouter } from 'react-router-dom'

import AppLayout from '../common/layout/AppLayout'
import ProtectedRoute from '../common/shared/ProtectedRoute'

import HomePage from '../pages/home/HomePage'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import OAuthCallbackPage from '../pages/oauth/OAuthCallbackPage'

import DashboardPage from '../pages/dashboard/DashboardPage'

import DatasetListPage from '../pages/dataset/DatasetListPage'
import DatasetDetailPage from '../pages/dataset/DatasetDetailPage'

import UploadPage from '../pages/upload/UploadPage'

import LabelingPage from '../pages/labeling/LabelingPage'

import PricingPage from '../pages/pricing/PricingPage'

import AdminUsersPage from '../pages/admin/AdminUsersPage'

import NotFoundPage from '../pages/notFound/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      /*
      ==========================================
      Home
      ==========================================
      */

      {
        index: true,
        element: <HomePage />,
      },

      /*
      ==========================================
      Auth
      ==========================================
      */

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

      /*
      ==========================================
      Dashboard
      ==========================================
      */

      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },

      /*
      ==========================================
      Dataset
      ==========================================
      */

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

      /*
      ==========================================
      Upload
      ==========================================
      */

      {
        path: 'upload',
        element: (
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        ),
      },

      /*
      ==========================================
      Labeling Workspace
      ==========================================
      */

      {
        path: 'labeling',
        element: (
          <ProtectedRoute>
            <LabelingPage />
          </ProtectedRoute>
        ),
      },

      /*
      ==========================================
      Membership
      ==========================================
      */

      {
        path: 'pricing',
        element: <PricingPage />,
      },

      /*
      ==========================================
      Admin
      ==========================================
      */

      {
        path: 'admin/users',
        element: (
          <ProtectedRoute requireAdmin>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },

      /*
      ==========================================
      404
      ==========================================
      */

      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])