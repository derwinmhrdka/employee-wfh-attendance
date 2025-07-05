import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function EmployeeLogs() {
  const { employeeId } = useParams()
  const navigate = useNavigate()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ State pagination
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
        setCurrentPage(1) // Reset ke page 1 setiap fetch baru
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
  const currentLogs = logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="container mt-4">
      <h4>Log Activity - Employee {employeeId}</h4>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-nowrap">
            <thead className="table-light text-center">
              <tr>
                <th style={{ backgroundColor: '#d9d9d9' }}>Changed At</th>
                <th style={{ backgroundColor: '#d9d9d9' }}>Changed Field</th>
                <th style={{ backgroundColor: '#d9d9d9' }}>Old Value</th>
                <th style={{ backgroundColor: '#d9d9d9' }}>New Value</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        maxWidth: '200px',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        padding: '0.75rem',
                      }}
                    >
                      {log.updatedAt}
                    </td>
                    <td
                      style={{
                        maxWidth: '150px',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        padding: '0.75rem',
                      }}
                    >
                      {log.changedField || '-'}
                    </td>
                    <td
                      style={{
                        maxWidth: '200px',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        padding: '0.75rem',
                      }}
                    >
                      {log.oldValue || '-'}
                    </td>
                    <td
                      style={{
                        maxWidth: '200px',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        padding: '0.75rem',
                      }}
                    >
                      {log.newValue || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ✅ Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <small>
                Page {currentPage} of {totalPages}
              </small>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      <button className="btn btn-danger mt-3" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  )
}
