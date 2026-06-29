import { Outlet } from 'react-router-dom'

import Header from './Header.tsx'
import PageContainer from './PageContainer.tsx'
import Sidebar from './Sidebar.tsx'

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app-main">
        <Header />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
    </div>
  )
}

export default AppLayout