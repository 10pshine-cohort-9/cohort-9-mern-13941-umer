import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post('/api/auth/login', { email, password })
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
        <div className="auth-sidebar">
          <div className="sidebar-brand">
            <span className="sidebar-brand-logo">💡</span>
            <span className="sidebar-brand-text">Shine Notes</span>
          </div>
          <p className="sidebar-tagline">Welcome back to your workspace. Stay productive and keep your important notes right at your fingertips.</p>
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Sign In</h2>
          </div>
          
          {error && <div className="error-msg">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="input-group full">
              <label>Email Address</label>
              <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="input-group full">
              <label>Password</label>
              <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>

            <button type="submit" className="auth-btn">Log In</button>
          </form>

          <div className="auth-end">
            New to Shine Notes? <Link to="/signup">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login