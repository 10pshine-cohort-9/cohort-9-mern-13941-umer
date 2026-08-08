import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post('/api/auth/signup', {
        name,
        email,
        password
      })
      
      if (response.status === 201) {
        navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again....')
    }
  }

  return (
    <div className="main-auth">
      <div className="auth-box">
        <h2>Create Account</h2>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="auth-btn">Sign Up</button>

        </form>

        <p className="auth-end">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup