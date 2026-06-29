import { Outlet } from 'react-router-dom'

import Header from './Header'
import PageContainer from './PageContainer'
import Sidebar from './Sidebar'

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