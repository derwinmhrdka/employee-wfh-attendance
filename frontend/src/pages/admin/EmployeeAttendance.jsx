import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import FilterForm from '../components/FilterForm'

export default function EmployeeAttendance() {
  const navigate = useNavigate()

  return (
    <div
      className="container-fluid vh-100"
      style={{
        background: 'linear-gradient(135deg, #d0e8f2 0%, #ffffff 100%)',
        padding: '2rem',
      }}
    >
      <Header />

      <div className="mb-3">
        <button
          className="btn btn-danger"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <FilterForm mode="admin" title="Employee Attendance Records" />
    </div>
  )
}
