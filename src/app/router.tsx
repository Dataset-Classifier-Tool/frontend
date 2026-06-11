import { createBrowserRouter } from 'react-router-dom'

import Header from '../common/components/Header'
import HomePage from '../pages/home/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DatasetListPage from '../pages/dataset/DatasetListPage'
import UploadPage from '../pages/upload/UploadPage'
import PricingPage from '../pages/pricing/PricingPage'

function RootLayout() {
  return (
    <>
      <Header />
      <main className="main-container">
        <OutletWrapper />
      </main>
    </>
  )
}

import { Outlet } from 'react-router-dom'

function OutletWrapper() {
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
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
        element: <DatasetListPage />,
      },
      {
        path: 'upload',
        element: <UploadPage />,
      },
      {
        path: 'pricing',
        element: <PricingPage />,
      },
    ],
  },
])