import { useState, useEffect } from 'react'
import axios from 'axios'
import './ProfileModal.css'

function ProfileModal({ isOpen, onClose }) {
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('token')
      axios.get('/api/users/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setProfileData(res.data)
        })
        .catch(() => {
          console.error("Could not load profile")
        })
    }
  }, [isOpen])


  if (!isOpen) return null
  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <h3>User Profile</h3>
        
        {profileData ? (
          <div className="profile-details">
            <p><strong>Name:</strong> {profileData.name}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Account ID:</strong> {profileData.id}</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}

        <button className="btn-close-profile" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default ProfileModal