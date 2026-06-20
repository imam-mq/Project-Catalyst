import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import warehouseImg from "../../assets/warehouse.png"

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/login', { username, password })
      const { token, idUser, role } = res.data

      login({ idUser, username, role }, token)

      if (role === 'admin' || role === 'kepala') navigate('/dashboard')
      else if (role === 'staf') navigate('/barang-masuk')

    } catch (err) {
      setError(err.response?.data?.message || 'Username atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#f6fafe] text-[#171c1f]">
      
      {/* SISI KIRI: Hero Image (60% Lebar Screen Desktop) */}
      <section className="hidden lg:block lg:w-3/5 h-full relative overflow-hidden bg-[#1b2b41]">
        <img 
          alt="LogiTrack WMS Warehouse" 
          className="w-full h-full object-cover opacity-90 scale-105 hover:scale-100 transition-transform duration-[10000ms] ease-out" 
          src={warehouseImg}
        />
        {/* Overlay Efek Degradasi Warna Gelap */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05162b]/40 to-transparent"></div>
        
        {/* Branding Badge di Kiri Bawah */}
        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div className="w-10 h-10 bg-[#05162b] flex items-center justify-center rounded">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
          </div>
          <div>
            <p className="text-base text-white font-bold leading-tight">LogiTrack WMS</p>
            <p className="text-xs text-white/70">Efficiency Redefined.</p>
          </div>
        </div>
      </section>

      {/* SISI KANAN: Form Area (40% Lebar Screen Desktop) */}
      <section className="w-full lg:w-2/5 h-full bg-white flex flex-col items-center justify-center px-6 lg:px-12 relative">
        
        {/* Mobile Header (Hanya muncul di Layar HP) */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#05162b] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
          <span className="text-xl text-[#05162b] font-bold">LogiTrack WMS</span>
        </div>

        {/* Kontainer Utama Form */}
        <div className="w-full max-w-[440px] space-y-6">
          
          {/* Header Judul */}
          <header className="space-y-2">
            <div className="hidden lg:flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#05162b] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              <span className="text-2xl text-[#05162b] font-extrabold tracking-tight">LogiTrack WMS</span>
            </div>
            <h1 className="text-2xl lg:text-3xl text-[#05162b] font-bold tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-sm lg:text-base text-[#44474d]">
              Silakan masuk ke akun Anda untuk mengelola inventaris.
            </p>
          </header>

          {/* Alert Jika Password Salah */}
          {error && (
            <div className="p-3 bg-[#ffdad6] text-[#93000a] rounded-lg text-sm flex items-center gap-2 font-medium border border-[#ba1a1a]/20">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {error}
            </div>
          )}

          {/* Form Tag */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Field Username */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#171c1f]" htmlFor="username">Email atau Username</label>
              <div className="relative group rounded-lg border border-[#c4c6cd] overflow-hidden focus-within:border-[#05162b] focus-within:ring-2 focus-within:ring-[#05162b]/10 transition-all duration-200">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#44474d] group-focus-within:text-[#05162b] transition-colors">person</span>
                <input 
                  className="w-full h-12 pl-11 pr-4 bg-[#f6fafe] text-[#171c1f] text-sm border-none focus:ring-0 outline-none" 
                  id="username" 
                  placeholder="nama@perusahaan.id" 
                  required 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Field Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#171c1f]" htmlFor="password">Password</label>
              <div className="relative group rounded-lg border border-[#c4c6cd] overflow-hidden focus-within:border-[#05162b] focus-within:ring-2 focus-within:ring-[#05162b]/10 transition-all duration-200">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#44474d] group-focus-within:text-[#05162b] transition-colors">lock</span>
                <input 
                  className="w-full h-12 pl-11 pr-10 bg-[#f6fafe] text-[#171c1f] text-sm border-none focus:ring-0 outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#44474d] hover:text-[#05162b] transition-colors" 
                  onClick={() => setShowPassword(!showPassword)} 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Pilihan Ingat saya / Lupa Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input className="w-4 h-4 rounded border-[#c4c6cd] text-[#05162b] focus:ring-[#05162b]/20 cursor-pointer" type="checkbox" />
                <span className="text-xs text-[#44474d] group-hover:text-[#171c1f] transition-colors">Ingat Saya</span>
              </label>
              <a className="text-xs text-[#05162b] font-bold hover:underline" href="#">Lupa Password?</a>
            </div>

            {/* Tombol Masuk */}
            <button 
              className="w-full h-12 bg-[#05162b] text-white font-semibold rounded-xl hover:bg-[#05162b]/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-[20px]">sync</span> 
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Sistem
                  <span className="material-symbols-outlined text-[20px]">login</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Hubungi Admin */}
          <div className="pt-4 border-t border-[#eaeef2]">
            <p className="text-xs text-[#44474d] text-center">
              Butuh bantuan? <a className="text-[#05162b] font-bold hover:underline" href="#">Hubungi Admin</a>
            </p>
          </div>
        </div>

        {/* Hak Cipta bawah */}
        <footer className="absolute bottom-4 left-0 w-full text-center text-[10px] text-[#44474d]/60 uppercase tracking-widest">
          © 2026 LogiTrack Systems Inc. All rights reserved.
        </footer>
      </section>
    </main>
  )
}