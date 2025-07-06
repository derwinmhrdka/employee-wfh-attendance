import React, { useState } from 'react'

export default function AttendanceTable({ data, mode = 'employee' }) {
  const itemsPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage)

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const startIdx = (currentPage - 1) * itemsPerPage
  const currentData = data?.slice(startIdx, startIdx + itemsPerPage) || []

  return (
    <div className="table-responsive">
      <table
        className="table table-bordered align-middle"
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <thead
          className="text-center"
          style={{
            backgroundColor: '#d0e8f2',
          }}
        >
          <tr>
            {mode === 'admin' && (
              <th
                style={{
                  backgroundColor: '#d9eaf2',
                  textAlign: 'center',
                }}
              >
                ID - Name
              </th>
            )}
            <th
              style={{
                backgroundColor: '#d9eaf2',
                textAlign: 'center',
              }}
            >
              Date
            </th>
            <th
              style={{
                backgroundColor: '#d9eaf2',
                textAlign: 'center',
              }}
            >
              Clock In
            </th>
            <th
              style={{
                backgroundColor: '#d9eaf2',
                textAlign: 'center',
              }}
            >
              Clock Out
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((row, idx) => (
              <tr key={idx}>
                {mode === 'admin' && (
                  <td style={{ maxWidth: '200px', overflowWrap: 'break-word' }}>
                    00{row.employeeId || '-'} - {row.name || '-'}
                  </td>
                )}
                <td>{row.date ? row.date.split('T')[0] : '-'}</td>
                <td>
                  {row.clockIn || row.in_time
                    ? new Date(row.clockIn || row.in_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    : '-'}
                </td>
                <td>
                  {row.clockOut || row.out_time
                    ? new Date(row.clockOut || row.out_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    : '-'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={mode === 'admin' ? 4 : 3} className="text-center">
                No data
              </td>
            </tr>
          )}
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
    </div>
  )
}
