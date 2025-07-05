import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaEye, FaEdit } from 'react-icons/fa'
import EmployeeModal from '../components/EmployeeModal'
import { useNavigate } from 'react-router-dom'


export default function EmployeeListAdmin() {
  const [employees, setEmployees] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState({})
  const [photo, setPhoto] = useState(null)
  const [filterId, setFilterId] = useState('')

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const navigate = useNavigate()

  const fetchEmployees = async (employeeId) => {
    try {
      const url = employeeId
        ? `${import.meta.env.VITE_API_URL}/admin/employee?employeeId=${employeeId}`
        : `${import.meta.env.VITE_API_URL}/admin/employee`

      const res = await axios.get(url, { headers })
      setEmployees(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleFilter = () => {
    if (filterId.trim() === '') {
      fetchEmployees()
    } else {
      fetchEmployees(filterId)
    }
  }

  const openAddModal = () => {
    setEditData({})
    setPhoto(null)
    setShowModal(true)
  }

  const openEditModal = async (employeeId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/employee/?employeeId=${employeeId}`, { headers })
      const data = res.data.data;

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Employee not found');
      }

      const employee = data[0];
      setEditData(employee);

      setShowModal(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      Object.entries(editData).forEach(([key, val]) => formData.append(key, val))
      if (photo) formData.append('photo', photo)

      if (editData.employeeId) {
        await axios.patch(`${import.meta.env.VITE_API_URL}/admin/employee/${editData.employeeId}`, formData, { headers })
        alert('Employee updated!')
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/employee`, formData, { headers })
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login' // Ganti sesuai route login kamu
  }

  const handleBack = () => {
    window.history.back()
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

      <div className="d-flex justify-content-between mb-3">
        <h4>Employee List</h4>
        <div>
          <button className="btn btn-primary" onClick={openAddModal}>
            Add Employee
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            placeholder="Filter by Employee ID"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={handleFilter}>
            Search
          </button>
          <button className="btn btn-outline-secondary" onClick={() => { setFilterId(''); fetchEmployees(); }}>
            Reset
          </button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID - Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.employeeId}>
              <td>00{emp.employeeId} - {emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.position}</td>
              <td>{emp.phone}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-info me-2"
                  onClick={() => navigate(`/admin/${emp.employeeId}/logs`)}
                >
                  <FaEye />
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openEditModal(emp.employeeId)}
                >
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
      />
    </div>
  )
}
