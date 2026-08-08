import { useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <h2 className="logo">10P Shine Notes Application</h2>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </nav>
  )
}

export default Navbar