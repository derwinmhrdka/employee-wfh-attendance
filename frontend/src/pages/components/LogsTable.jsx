import React from 'react'

export default function LogsTable({
  logs,
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage
}) {
  const startIdx = (currentPage - 1) * itemsPerPage
  const currentLogs = logs.slice(startIdx, startIdx + itemsPerPage)

  return (
    <>
      <div className="table-responsive">
        <table
          className="table table-bordered align-middle text-nowrap"
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
              <th style={{ backgroundColor: '#d9eaf2' }}>Changed At</th>
              <th style={{ backgroundColor: '#d9eaf2' }}>Changed Field</th>
              <th style={{ backgroundColor: '#d9eaf2' }}>Old Value</th>
              <th style={{ backgroundColor: '#d9eaf2' }}>New Value</th>
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
      </div>

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
            onClick={() => setCurrentPage((prev) =>
              prev < totalPages ? prev + 1 : prev
            )}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}
