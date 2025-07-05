import { useEffect, useState } from 'react'
import axios from 'axios'
import EmployeeModal from '../components/EmployeeModal'

export default function DashboardEmployeePage() {
  const [profile, setProfile] = useState(null)
  const [attendance, setAttendance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    position: '',
    phone: '',
    oldPassword: '',
    newPassword: ''
  })

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      const headers = { Authorization: `Bearer ${token}` }

      const [profileRes, attendanceRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/employee/profile`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/employee/attendance`, { headers }),
      ])

      setProfile(profileRes.data.data)
      setAttendance(attendanceRes.data.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, 
    })
  }


  const formatTime = (timeString) => {
    if (!timeString) return '-'
    const d = new Date(timeString)
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const openModal = () => {
    setEditData({
      name: profile?.name || '',
      email: profile?.email || '',
      position: profile?.position || '',
      phone: profile?.phone || '',
      oldPassword: '',
      newPassword: '',
    })
    setPhoto(null)
    setShowModal(true)
  }

  const closeModal = () => setShowModal(false)

  const handleSave = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    const formData = new FormData()
    formData.append('phone', editData.phone)
    if (photo) formData.append('photo', photo)
    if (editData.oldPassword && editData.newPassword) {
      formData.append('oldPassword', editData.oldPassword)
      formData.append('newPassword', editData.newPassword)
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/employee/profile`,
        formData,
        { headers }
      )
      alert('Profile updated')
      closeModal()
      fetchData()
    } catch (err) {
      console.error(err)
      alert('Update failed: ' + (err.response?.data?.message || 'An error occurred'))
    }
  }

  const handleAttendance = async () => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    const type = attendance?.clockIn ? 'clock_out' : 'clock_in'

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/employee/attendance`,
        { type },
        { headers }
      )
      alert(`${type === 'clock_in' ? 'Clock In' : 'Clock Out'} successful`)
      fetchData()
    } catch (err) {
      console.error(err)
      alert(`Failed to ${type}: ` + (err.response?.data?.message || 'An error occurred'))
    }
  }

  if (loading) return <div className="container mt-5">Loading...</div>

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-2 text-end">
        <button className="btn btn-secondary mb-2" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-2 px-2">
        <h5 className="mb-0">Hi, {profile?.name}</h5>
        <p className="mb-0">{formatDateTime(currentTime)}</p>
      </div>

      {/* Card Profile & Attendance */}
      <div className="row d-flex align-items-start">
        <div className="col-md-6 mb-4 px-3">
          <div className="card h-100">
            <div className="card-header">Employee Profile</div>
            <div className="card-body text-center">
              <div className="mb-3 d-flex justify-content-center">
                  <img
                    src={
                      profile?.photo
                        ? `${import.meta.env.VITE_BASE_URL}/uploads/profile/${profile.photo}`
                        : `${import.meta.env.VITE_BASE_URL}/uploads/profile/default.png`
                    }
                    alt="Employee"
                    className="rounded-circle border border-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
              <h5>{profile?.name}</h5>
              <p>{profile?.email}</p>
              <hr />
              <div className="d-flex justify-content-between mt-3">
                <span><strong>Position</strong></span>
                <span>{profile?.position}</span>
              </div>
              <div className="d-flex justify-content-between mt-2 mb-4">
                <span><strong>Phone</strong></span>
                <span>{profile?.phone}</span>
              </div>
              <div>
                <button className="btn btn-primary w-100 mb-2" onClick={openModal}>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="col-md-6 mb-4 px-3">
          <div className="card h-100">
            <div className="card-header">Today's Attendance</div>
            <div className="card-body">
              <div className="row text-center mb-5">
                <div className="col">
                  <strong>Clock In</strong>
                  <div>{formatTime(attendance?.clockIn)}</div>
                </div>
                <div className="col">
                  <strong>Clock Out</strong>
                  <div>{formatTime(attendance?.clockOut)}</div>
                </div>
              </div>
              <button className="btn btn-primary w-100 mb-2"
                onClick={handleAttendance}
                disabled={attendance?.clockIn && attendance?.clockOut}>
                {attendance?.clockIn
                  ? attendance?.clockOut
                    ? 'Clock In' : 'Clock Out'
                  : 'Clock In'}
              </button>
              <button className="btn btn-outline-primary w-100"
                onClick={() => window.location.href = '/attendance-summary'}>
                Attendance Summary
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Reusable */}
      <EmployeeModal
        show={showModal}
        onClose={closeModal}
        onSave={handleSave}
        data={editData}
        setData={setEditData}
        photo={photo}
        profilePhoto={profile?.photo}
        setPhoto={setPhoto}
        context="employee"
        isEdit = {true}
      />
    </div>
  )
}
