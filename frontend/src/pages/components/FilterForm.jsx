import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AttendanceTable from './AttendanceTable'

export default function FilterForm({
  mode = 'employee',
  title = 'Attendance',
  endpoint,
}) {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

  const toDateString = (date) => {
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - offset * 60 * 1000)
    return localDate.toISOString().split('T')[0]
  }

  const [dateFrom, setDateFrom] = useState(toDateString(firstDay))
  const [dateTo, setDateTo] = useState(toDateString(today))
  const [employeeId, setEmployeeId] = useState('')
  const [attendanceList, setAttendanceList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const apiEndpoint =
        endpoint ||
        (mode === 'admin'
          ? `${import.meta.env.VITE_API_URL}/admin/attendance`
          : `${import.meta.env.VITE_API_URL}/employee/attendance-summary`)

      const params = {
        ...(mode === 'admin' && employeeId && { employeeId }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      }

      const res = await axios.get(apiEndpoint, { headers, params })

      const data =
        mode === 'employee' 
        ? res.data.data.summary 
        : res.data.data?.data || res.data.data; 

      setAttendanceList(data)
    } catch (err) {
      console.error(err)
      alert('Failed to fetch attendance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-danger" onClick={() => window.history.back()}>
          Back
        </button>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h3 className="mb-3">{title}</h3>

      <div className="mb-3 d-flex align-items-center flex-wrap">
        {mode === 'admin' && (
          <>
            <label className="fw-bold me-2">Employee ID</label>
            <input
              type="number"
              className="form-control me-3"
              style={{ maxWidth: '150px' }}
              placeholder="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </>
        )}

        <label className="fw-bold me-2">Date</label>
        <input
          type="date"
          className="form-control me-2"
          style={{ maxWidth: '200px' }}
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <span className="me-2">-</span>
        <input
          type="date"
          className="form-control me-2"
          style={{ maxWidth: '200px' }}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        <button className="btn btn-primary me-2" onClick={fetchAttendance}>
          Search
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            setDateFrom(toDateString(firstDay))
            setDateTo(toDateString(today))
            setEmployeeId('')
            fetchAttendance()
          }}
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <AttendanceTable data={attendanceList} mode={mode} />
      )}
    </div>
  )
}
