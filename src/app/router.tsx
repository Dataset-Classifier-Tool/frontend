import {Outlet, createBrowserRouter} from 'react-router-dom'

import Header from '../common/components/Header'
import ProtectedRoute from '../common/components/ProtectedRoute'

import HomePage from '../pages/home/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DatasetListPage from '../pages/dataset/DatasetListPage'
import UploadPage from '../pages/upload/UploadPage'
import PricingPage from '../pages/pricing/PricingPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import OAuthCallbackPage from '../pages/oauth/OAuthCallbackPage'

function RootLayout() {
    return (
        <>
            <Header/>
            <main className="main-container">
                <Outlet/>
            </main>
        </>
    )
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout/>,
        children: [
            {index: true, element: <HomePage/>},
            {path: 'login', element: <LoginPage/>},
            {path: 'register', element: <RegisterPage/>},
            {
                path: 'datasets',
                element: (
                    <ProtectedRoute>
                        <DatasetListPage/>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'oauth/callback',
                element: <OAuthCallbackPage/>,
            },
            {
                path: 'upload',
                element: (
                    <ProtectedRoute>
                        <UploadPage/>
                    </ProtectedRoute>
                ),
            },
            {path: 'pricing', element: <PricingPage/>},
            {
                path: 'admin/users',
                element: (
                    <ProtectedRoute>
                        <AdminUsersPage/>
                    </ProtectedRoute>
                ),
            },
        ],
    },
])