import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

export default function DashboardAdmin() {
  const navigate = useNavigate()
  const adminName = localStorage.getItem('name') || 'Admin'

  return (
    <div
      className="container-fluid vh-100"
      style={{
        background: 'linear-gradient(135deg, #d0e8f2 0%, #ffffff 100%)',
        padding: '2rem',
      }}
    >
      <Header />

      <div className="mb-4">
        <h5>Hi, {adminName}</h5>
      </div>

      <div
        className="card p-4 text-center mx-auto shadow"
        style={{ maxWidth: '600px' }}
      >
        <h6 className="mb-4 card-title">Dashboard Admin</h6>
        <div className="d-grid gap-3 mx-auto" style={{ width: '60%' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/admin/attendance')}
          >
            Employee Attendance
          </button>
          <button
            className="btn btn-light border"
            onClick={() => navigate('/admin/employees')}
          >
            Employee List
          </button>
        </div>
      </div>
    </div>
  )
}
