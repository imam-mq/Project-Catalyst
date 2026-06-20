import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const menuByRole = {
  admin: [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    {
      label: 'Data Master',
      icon: 'database',
      children: [
        { label: 'Barang', icon: 'inventory_2', path: '/master/barang' },
        { label: 'Supplier', icon: 'local_shipping', path: '/master/supplier' },
        { label: 'Lokasi Gudang', icon: 'warehouse', path: '/master/lokasi' },
      ]
    },
    { label: 'Barang Masuk', icon: 'login', path: '/barang-masuk' },
    { label: 'Barang Keluar', icon: 'logout', path: '/barang-keluar' },
    { label: 'Log Aktivitas', icon: 'history_edu', path: '/log' },
    { label: 'Manajemen User', icon: 'group', path: '/users' },
  ],
  staf: [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'Barang Masuk', icon: 'login', path: '/barang-masuk' },
    { label: 'Barang Keluar', icon: 'logout', path: '/barang-keluar' },
  ],
  kepala: [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'Barang Keluar', icon: 'logout', path: '/barang-keluar' },
    { label: 'Log Aktivitas', icon: 'history_edu', path: '/log' },
  ]
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState({})

  const menus = menuByRole[user?.role] || []

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }))
  }

  
  const isActive = (path) => location.pathname === path
  const isParentActive = (children) => children?.some(child => location.pathname === child.path)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  
  const getUserInitials = () => {
    if (!user?.username) return 'A1'
    return user.username.slice(0, 2).toUpperCase()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#05162b] flex flex-col z-50 border-r border-white/5">
      
     
      <div className="px-6 py-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-[#fc7c1f] text-2xl font-bold">
          inventory_2
        </span>
        <span className="text-2xl font-bold text-white tracking-tight">
          LogiTrack
        </span>
      </div>

      {/* NAVIGATION ITEMS */}
      <nav className="flex-1 px-2 mt-4 space-y-1 overflow-y-auto">
        {menus.map((menu) => (
          <div key={menu.label}>
            {menu.children ? (
              <>
                <button
                  onClick={() => toggleMenu(menu.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all group duration-200
                    ${isParentActive(menu.children)
                      ? 'bg-white/10 text-white border-l-4 border-[#fc7c1f] pl-3' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-[20px] ${isParentActive(menu.children) ? 'text-[#fc7c1f]' : 'group-hover:text-white'}`}>
                      {menu.icon}
                    </span>
                    <span>{menu.label}</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px]">
                    {openMenus[menu.label] || isParentActive(menu.children) ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {/* Submenu Area */}
                {(openMenus[menu.label] || isParentActive(menu.children)) && (
                  <div className="mt-1 mb-2 ml-4 bg-black/15 rounded-lg overflow-hidden border-l border-white/10">
                    {menu.children.map((child) => (
                      <button
                        key={child.path}
                        onClick={() => navigate(child.path)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-all
                          ${isActive(child.path)
                            ? 'bg-white/10 text-white font-semibold'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {child.icon}
                        </span>
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              
              <button
                onClick={() => navigate(menu.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all group rounded-lg duration-200
                  ${isActive(menu.path)
                    ? 'bg-white/10 text-white border-l-4 border-[#fc7c1f] pl-3 font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive(menu.path) ? 'text-[#fc7c1f]' : 'group-hover:text-white'}`}>
                  {menu.icon}
                </span>
                {menu.label}
              </button>
            )}
          </div>
        ))}
      </nav>

      
      <div className="p-4 border-t border-white/10 space-y-4 bg-black/10">
        <div className="flex items-center gap-3">
          {/* Avatar Bulat Oranye */}
          <div className="h-10 w-10 rounded-full bg-[#fc7c1f] flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {getUserInitials()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate capitalize">
              {user?.username || 'Admin01'}
            </span>
            <span className="text-xs text-white/50 capitalize truncate">
              {user?.role || 'Super Admin'}
            </span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#ba1a1a]/10 hover:bg-[#ba1a1a]/20 text-[#ba1a1a] font-semibold text-sm rounded-xl transition-all cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}