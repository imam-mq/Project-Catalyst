import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Barang from './pages/Master/Barang/Barang'
import BarangMasuk from './pages/BarangMasuk/BarangMasuk'
import Supplier from './pages/Master/Supplier/Supplier'
import Lokasi from './pages/Master/Lokasi/Lokasi'
import BarangKeluar from './pages/BarangKeluar/BarangKeluar'
import LogAktivitas from './pages/Log/LogAktivitas'
import ManajemenUser from './pages/Users/ManajemenUser'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Protected semua role bisa akses */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Protected — admin & staf */}
          <Route path="/barang-masuk" element={
            <ProtectedRoute allowedRoles={['admin', 'staf']}>
              <BarangMasuk />
            </ProtectedRoute>
          } />

          <Route path="/barang-keluar" element={
            <ProtectedRoute allowedRoles={['admin', 'staf', 'kepala']}>
              <BarangKeluar />
            </ProtectedRoute>
          } />

          {/* Protected — admin only */}
          <Route path="/master/barang" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Barang />
            </ProtectedRoute>
          } />

          <Route path="/master/supplier" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Supplier />
            </ProtectedRoute>
          } />

          <Route path="/master/lokasi" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Lokasi />
            </ProtectedRoute>
          } />

          <Route path="/log" element={
            <ProtectedRoute allowedRoles={['admin', 'kepala']}>
              <LogAktivitas />
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManajemenUser />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App