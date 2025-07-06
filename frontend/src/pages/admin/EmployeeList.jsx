import React, { useState, useEffect } from 'react'
import axios from 'axios'
import EmployeeModal from '../components/EmployeeModal'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import EmployeeTableAdmin from '../components/EmployeeTable'

export default function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState({})
  const [photo, setPhoto] = useState(null)
  const [filterId, setFilterId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  const navigate = useNavigate()

  const fetchEmployees = async (employeeId, name) => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/admin/employee`
      const params = []
      if (employeeId) params.push(`employeeId=${employeeId}`)
      if (name) params.push(`name=${name}`)
      if (params.length) url += `?${params.join('&')}`
      const res = await axios.get(url, { headers })
      setEmployees(res.data.data)
      setCurrentPage(1)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleFilter = () => {
    const trimmed = filterId.trim()
    if (trimmed === '') {
      fetchEmployees()
    } else if (!isNaN(trimmed)) {
      fetchEmployees(trimmed, null)
    } else {
      fetchEmployees(null, trimmed)
    }
  }

  const openAddModal = () => {
    setEditData({})
    setPhoto(null)
    setShowModal(true)
  }

  const openEditModal = async (employeeId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/employee/?employeeId=${employeeId}`,
        { headers }
      )
      const data = res.data.data
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Employee not found')
      }
      const employee = data[0]
      setEditData(employee)
      setShowModal(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      Object.entries(editData).forEach(([key, val]) => {
        if (key !== 'employeeId') {
          formData.append(key, val)
        }
      })
      if (photo) formData.append('photo', photo)

      if (editData.employeeId) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/admin/employee/${editData.employeeId}`,
          formData,
          { headers }
        )
        alert('Employee updated!')
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/employee`,
          formData,
          { headers }
        )
        alert('Employee added!')
      }
      setShowModal(false)
      setEditData({})
      setPhoto(null)
      fetchEmployees()
    } catch (err) {
      console.error(err)
      alert('Save failed')
    }
  }

  const totalPages = Math.ceil(employees.length / itemsPerPage)

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

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
        <button className="btn btn-danger" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="card p-4 shadow">
        <h4 className="mb-4">Employee List</h4>
        <div className="mb-3 d-flex justify-content-between flex-wrap align-items-center">
          <div className="input-group" style={{ maxWidth: '400px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Filter by Employee ID or Name"
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
            />
            <button className="btn btn-secondary" onClick={handleFilter}>
              Search
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setFilterId('')
                fetchEmployees()
              }}
            >
              Reset
            </button>
          </div>
          <button
            className="btn btn-primary ms-auto mt-2 mt-md-0"
            onClick={openAddModal}
          >
            Add Employee
          </button>
        </div>

        <EmployeeTableAdmin
          employees={employees}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          handlePrev={handlePrev}
          handleNext={handleNext}
          totalPages={totalPages}
          navigate={navigate}
          openEditModal={openEditModal}
        />
      </div>

      <EmployeeModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        data={editData}
        setData={setEditData}
        photo={photo}
        setPhoto={setPhoto}
        context="admin"
        isEdit={!!editData.employeeId}
        profilePhoto={editData.photo}
      />
    </div>
  )
}
