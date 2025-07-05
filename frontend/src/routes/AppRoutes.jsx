import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/employee/DashboardEmployee";
import AttendanceSummary from "../pages/employee/AttendanceSummary";
import DashboardAdmin from '../pages/admin/DashboardAdmin'
import EmployeeListAdmin from "../pages/admin/EmployeeList";
import EmployeeAttendanceAdmin from "../pages/admin/EmployeeAttendance";
import EmployeeLogs from '../pages/admin/EmployeeLogs'



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/attendance-summary" element={<AttendanceSummary />} />

      <Route path="/dashboard-admin" element={<DashboardAdmin />} />
      <Route path="/admin/employees" element={<EmployeeListAdmin />} />
      <Route path="/admin/attendance" element={<EmployeeAttendanceAdmin />} />
      <Route path="/admin/:employeeId/logs" element={<EmployeeLogs />} />


    </Routes>
  );
}