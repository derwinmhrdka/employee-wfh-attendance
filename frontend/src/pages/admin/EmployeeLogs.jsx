import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import LogsTable from '../components/LogsTable'

export default function EmployeeLogs() {
  const { employeeId } = useParams()
  const navigate = useNavigate()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/logs/${employeeId}`,
          { headers }
        )

        setLogs(res.data.data || [])
        setCurrentPage(1)
      } catch (err) {
        console.error(err)
        alert('Failed to fetch logs')
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [employeeId])

  const totalPages = Math.ceil(logs.length / itemsPerPage)

  return (
    <div
      className="container-fluid vh-100"
      style={{
        background: 'linear-gradient(135deg, #d0e8f2 0%, #ffffff 100%)',
        padding: '2rem',
      }}
    >
      <Header />

      <div>
        <button className="btn btn-danger mt-0" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="card p-4 shadow mt-3">
        <h4 className="mb-4">Log Activity - Employee {employeeId}</h4>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <LogsTable
            logs={logs}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
    </div>
  )
}
