import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Dashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])


  
  return (
    <div>
      <Navbar/>
      
      <div>
        <h1>Welcome to your Dashboard!</h1>
        <br/>

        <p style={{ color: 'green' }}>Succesessfully Logged In.</p>
        <br />

    <p style={{ color : 'brown' }}>Notes wil be avalible here soon</p>


      </div>
    </div>
  )
}

export default Dashboard