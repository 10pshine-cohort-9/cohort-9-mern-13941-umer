import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileModal from './ProfileModal'
import './Navbar.css'

function Navbar() {
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }
  
  return (
    <nav className="navbar">
      <h2 className="logo">10P Shine Notes Application</h2>
      <div>
        <button className="logout-btn" onClick={() => setShowProfile(true)} style={{ marginRight: '10px' }}>Profile</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </nav>
  )
}

export default Navbar