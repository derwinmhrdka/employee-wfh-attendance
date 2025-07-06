import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Header() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/auth/logout`
      await axios.post(url, {}, { headers })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('name')
      navigate('/login')
    }
  }

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="mb-0 card-title">WHATT</h2>
        <p className="mb-0" style={{ color: '#2b6cb0' }}>
          WFH Attendance Tracker
        </p>
      </div>
      <div className="text-end">
        <p className="mb-0">{formattedDate}</p>
        <p className="mb-0">{formattedTime}</p>
        <button className="btn btn-secondary mt-2" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}
