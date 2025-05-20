import { Routes, Route,Navigate } from 'react-router-dom'
import Login from './Login'
import Dashboard from './dashboard'

export default function App() {
  return (
    <div className='w-full h-full'>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}