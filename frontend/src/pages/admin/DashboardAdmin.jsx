import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function DashboardAdmin() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const adminName = localStorage.getItem('name') || 'Admin'

  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const formattedTime = today.toLocaleTimeString()

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-2 text-end">
        <button className="btn btn-secondary mb-2" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-2 px-2">
        <h5 className="mb-0">Hi, {adminName}</h5>
        <p className="mb-0">{formattedDate} {formattedTime}</p>
      </div>

      <div className="card p-4 text-center mx-auto" style={{ width: '60%', marginTop: '50px' }}>
        <h6 className="mb-3">Dashboard Admin</h6>
        <div className="d-grid gap-3 mx-auto" style={{ width: '60%'}}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/admin/attendance')}
          >
            Employee Attendance
          </button>
          <button
            className="btn btn-light border"
            onClick={() => navigate('/admin/employees')}
          >
            Employee List
          </button>
        </div>
      </div>
    </div>
  )
}
