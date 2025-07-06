import React from 'react'

export default function EmployeeTable({
  employees,
  currentPage,
  itemsPerPage,
  handlePrev,
  handleNext,
  totalPages,
  navigate,
  openEditModal
}) {
  const startIdx = (currentPage - 1) * itemsPerPage
  const currentData = employees.slice(startIdx, startIdx + itemsPerPage)

  return (
    <>
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
              <th
                style={{
                  backgroundColor: '#d9eaf2',
                  textAlign: 'center',
                }}
              >
                ID - Name
              </th>
              <th
                style={{
                  backgroundColor: '#d9eaf2',
                  textAlign: 'center',
                }}
              >
                Email
              </th>
              <th
                style={{
                  backgroundColor: '#d9eaf2',
                  textAlign: 'center',
                }}
              >
                Position
              </th>
              <th
                style={{
                  backgroundColor: '#d9eaf2',
                  textAlign: 'center',
                }}
              >
                Phone
              </th>
              <th
                style={{
                  backgroundColor: '#d9eaf2',
                  textAlign: 'center',
                }}
              >
                Actions
              </th>
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
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openEditModal(emp.employeeId)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </>
  )
}
