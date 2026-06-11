import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

function Header() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        Dataset Classifier Tool
      </Link>

      <nav className="nav">
        <Link to="/datasets">Datasets</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/pricing">Pricing</Link>
      </nav>

      <div className="auth-links">
        {isAuthenticated ? (
          <>
            <span className="user-badge">
              {user?.nickname ?? 'User'}
            </span>
            <button
              type="button"
              className="text-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="primary-link">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header