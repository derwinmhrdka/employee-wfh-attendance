import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Employee')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const endpoint =
      role === 'Employee'
        ? `${import.meta.env.VITE_API_URL}/auth/employee/login`
        : `${import.meta.env.VITE_API_URL}/auth/admin/login`

    try {
      const res = await axios.post(endpoint, { email, password })
      
      localStorage.setItem('token', res.data.data.token)

      if (role === 'Admin') {
        localStorage.setItem('name', res.data.data.user.name) 
        navigate('/dashboard-admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      console.error(err)
      if (err.response) {
         alert(err.response.data.message || 'Login failed.');
      } else {
        alert('Network error.');
      }
      setLoading(false)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Login as</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
