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
      <table className="table table-bordered">
        <thead>
          <tr>
            {mode === 'admin' && <th>ID - Name</th>}
            <th>Date</th>
            <th>Clock In</th>
            <th>Clock Out</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((row, idx) => (
              <tr key={idx}>
                {mode === 'admin' && (
                  <td>00{row.employeeId || '-'} - {row.name || '-'}</td>
                )}
                <td>{row.date ? row.date.split('T')[0] : '-'}</td>
                <td>
                  {row.clockIn || row.in_time
                    ? new Date(row.clockIn || row.in_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </td>
                <td>
                  {row.clockOut || row.out_time
                    ? new Date(row.clockOut || row.out_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
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

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-outline-primary"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary"
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
