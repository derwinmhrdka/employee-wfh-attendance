import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import EmployeeModal from '../components/EmployeeModal'
import Header from '../components/Header'

export default function DashboardEmployeePage() {
  const [profile, setProfile] = useState(null)
  const [attendance, setAttendance] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

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
      if (!token) throw new Error('No token found')

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
  }, [])

  const formatTime = (timeString) => {
    if (!timeString) return '-'
    const d = new Date(timeString)
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const handleAttendance = async () => {
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

  if (loading) return <div className="container mt-5">Loading...</div>

  return (
    <div
      className="container-fluid vh-100"
      style={{
        background: 'linear-gradient(135deg, #d0e8f2 0%, #ffffff 100%)',
        padding: '2rem',
      }}
    >
      <Header />

      <div className="mb-4">
        <h5>Hi, {profile?.name}</h5>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div
              className="card-header"
              style={{
                fontWeight: '600',
                fontSize: '1rem',
                backgroundColor: '#c6eaf7',
              }}
            >
              Employee Profile
            </div>
            <div className="card-body text-center">
              <div className="mb-3 d-flex justify-content-center">
                <img
                  src={
                    profile?.photo
                      ? `${import.meta.env.VITE_BASE_URL}/uploads/profile/${profile.photo}`
                      : `${import.meta.env.VITE_BASE_URL}/uploads/profile/default.png`
                  }
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = `${import.meta.env.VITE_BASE_URL}/uploads/profile/default.png`
                  }}
                  alt="Employee"
                  className="rounded-circle border border-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              <h5>{profile?.name}</h5>
              <p>{profile?.email}</p>
              <hr />
              <div className="d-flex justify-content-between">
                <span><strong>Position</strong></span>
                <span>{profile?.position}</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span><strong>Phone</strong></span>
                <span>{profile?.phone}</span>
              </div>
              <button className="btn btn-primary w-100 mb-2" onClick={openModal}>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div
              className="card-header"
              style={{
                fontWeight: '600',
                fontSize: '1rem',
                backgroundColor: '#c6eaf7',
              }}
            >
              Today's Attendance
            </div>
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
              <button
                className="btn btn-primary w-100 mb-2"
                onClick={handleAttendance}
                disabled={attendance?.clockIn && attendance?.clockOut}
              >
                {attendance?.clockIn
                  ? attendance?.clockOut
                    ? 'Clock In'
                    : 'Clock Out'
                  : 'Clock In'}
              </button>
              <button
                className="btn btn-light border w-100"
                onClick={() => window.location.href = '/attendance-summary'}
              >
                Attendance Summary
              </button>
            </div>
          </div>
        </div>
      </div>

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
        isEdit={true}
      />
    </div>
  )
}
