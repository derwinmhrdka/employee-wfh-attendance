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

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const navigate = useNavigate()

  const fetchEmployees = async (employeeId, name) => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/admin/employee`;

      const params = [];
      if (employeeId) params.push(`employeeId=${employeeId}`);
      if (name) params.push(`name=${name}`);
      if (params.length) url += `?${params.join('&')}`;

      const res = await axios.get(url, { headers });
      setEmployees(res.data.data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleFilter = () => {
    const trimmed = filterId.trim();

    if (trimmed === '') {
      fetchEmployees();
    } else if (!isNaN(trimmed)) {
      fetchEmployees(trimmed, null);
    } else {
      fetchEmployees(null, trimmed);
    }
  };

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
      Object.entries(editData).forEach(([key, val]) => {
        if (key !== 'employeeId') {
          formData.append(key, val);
        }
      });
      
      if (photo) formData.append('photo', photo)

      console.log('Sending FormData:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

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
    window.location.href = '/login'
  }

  const totalPages = Math.ceil(employees.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const currentData = employees.slice(startIdx, startIdx + itemsPerPage)

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
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

      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h4>Employee List</h4>
      </div>

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

        <button className="btn btn-primary ms-auto mt-2 mt-md-0" onClick={openAddModal}>
          Add Employee
        </button>
      </div>


      <table className="table table-bordered align-middle">
        <thead className="table-light text-center">
          <tr>
            <th style={{ backgroundColor: '#d9d9d9' }}>ID - Name</th>
            <th style={{ backgroundColor: '#d9d9d9' }}>Email</th>
            <th style={{ backgroundColor: '#d9d9d9' }}>Position</th>
            <th style={{ backgroundColor: '#d9d9d9' }}>Phone</th>
            <th style={{ backgroundColor: '#d9d9d9' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((emp) => (
            <tr key={emp.employeeId}>
              <td style={{ maxWidth: '200px', wordBreak: 'break-word' }}>
                00{emp.employeeId} - {emp.name}
              </td>
              <td style={{ maxWidth: '200px', wordBreak: 'break-word' }}>
                {emp.email}
              </td>
              <td style={{ maxWidth: '150px', wordBreak: 'break-word' }}>
                {emp.position}
              </td>
              <td style={{ maxWidth: '120px', wordBreak: 'break-word' }}>
                {emp.phone}
              </td>
              <td
                style={{
                  maxWidth: '100px',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}
              >
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <button
                    className="btn btn-sm btn-outline-info"
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <small>
            Page {currentPage} of {totalPages}
          </small>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

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
