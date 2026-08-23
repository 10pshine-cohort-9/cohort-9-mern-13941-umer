import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Navbar.css'

function Navbar({ currentView, setView, handleExport, handleImportClick }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }
  
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span>💡</span> 
          <span className="logo-text">Shine Notes</span>
        </div>
      </div>
      
      <ul className="sidebar-menu">
        <li>
          <button type="button" className={`nav-btn ${currentView === 'all' ? 'active' : ''}`} onClick={() => setView('all')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span>All Notes</span>
          </button>
        </li>
        <li>
          <button type="button" className={`nav-btn ${currentView === 'pinned' ? 'active' : ''}`} onClick={() => setView('pinned')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.1 4.96a2.08 2.08 0 0 0-2.88 0l-1.92 1.92-5.71-1.39-1.94 1.94 3.75 5.56-6.17 6.17 1.41 1.42 6.17-6.17 5.56 3.75 1.94-1.94-1.39-5.71 1.92-1.92a2.08 2.08 0 0 0 0-2.88z"></path></svg>
            <span>Pinned Notes</span>
          </button>
        </li>
        <li>
          <button type="button" className={`nav-btn ${currentView === 'profile' ? 'active' : ''}`} onClick={() => setView('profile')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>My Profile</span>
          </button>
        </li>
      </ul>

      <div className="sidebar-tools">
        <button type="button" className="tool-btn" onClick={handleExport}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Export Data</span>
        </button>
        <button type="button" className="tool-btn" onClick={handleImportClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          <span>Import Data</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <button type="button" className="logout-btn" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

Navbar.propTypes = {
  currentView: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  handleExport: PropTypes.func.isRequired,
  handleImportClick: PropTypes.func.isRequired
}

export default Navbar