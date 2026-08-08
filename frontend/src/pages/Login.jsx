import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      })

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token)
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    }
  }

  return (
    <div className="main-auth">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="auth-btn">Login</button>
        </form>

        <p className="auth-end">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login