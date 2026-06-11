import { Link } from 'react-router-dom'

function Header() {
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
        <Link to="/login">Login</Link>
        <Link to="/register" className="primary-link">
          Register
        </Link>
      </div>
    </header>
  )
}

export default Header