import { Outlet } from 'react-router-dom'

import Header from '../common/components/Header'

function App() {
  return (
    <div className="app-shell">
      <Header />

      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}

export default App