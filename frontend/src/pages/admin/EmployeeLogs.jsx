import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function EmployeeLogs() {
  const { employeeId } = useParams()
  const navigate = useNavigate()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/logs/${employeeId}`, { headers })
        setLogs(res.data.data || [])
      } catch (err) {
        console.error(err)
        alert('Failed to fetch logs')
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [employeeId])

  return (
    <div className="container mt-4">
      <h4>Log Activity - Employee {employeeId}</h4>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered table-dark table-striped">
          <thead>
            <tr>
              <th>Changed At</th>
              <th>Changed Field</th>
              <th>Old Value</th>
              <th>New Value</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.updatedAt}</td>
                <td>{log.changedField || '-'}</td>
                <td>{log.oldValue}</td>
                <td>{log.newValue}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">No logs found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <button className="btn btn-danger" onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}
