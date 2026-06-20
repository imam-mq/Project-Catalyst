import MainLayout from '../../components/Layout/MainLayout'
import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  const summaryCards = [
    { 
      label: 'Total Barang', 
      value: '1,284', 
      icon: 'inventory_2', 
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      badge: '+12% vs bln lalu',
      badgeColor: 'text-green-600 bg-green-50',
      badgeIcon: 'trending_up'
    },
    { 
      label: 'Barang Masuk', 
      value: '312', 
      icon: 'login', 
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: 'Hari ini',
      badgeColor: 'text-slate-600 bg-slate-100',
      badgeIcon: 'calendar_today'
    },
    { 
      label: 'Barang Keluar', 
      value: '156', 
      icon: 'logout', 
      color: 'bg-orange-50 text-orange-600 border-orange-100',
      badge: 'Hari ini',
      badgeColor: 'text-slate-600 bg-slate-100',
      badgeIcon: 'calendar_today'
    },
    { 
      label: 'Pending Approval', 
      value: '24', 
      icon: 'history_edu', 
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'Butuh tindakan',
      badgeColor: 'text-red-600 bg-red-50',
      badgeIcon: 'priority_high'
    },
  ]

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-200">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#171c1f]">Dashboard</h1>
            <p className="text-sm text-slate-500">
              Selamat datang kembali, <span className="font-semibold text-[#05162b] capitalize">{user?.username || 'Admin01'}</span>
            </p>
          </div>
        
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button className="h-10 px-4 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium text-slate-700 shadow-sm cursor-pointer flex items-center gap-2 active:scale-95">
              <span className="material-symbols-outlined text-[18px]">help</span>
              <span>Bantuan</span>
            </button>
            <button className="h-10 w-10 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all text-slate-700 shadow-sm cursor-pointer flex items-center justify-center active:scale-95">
              <span className="material-symbols-outlined text-[18px]">translate</span>
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {card.label}
                  </span>
                  <h3 className="text-3xl font-bold text-[#171c1f] tracking-tight">
                    {card.value}
                  </h3>
                </div>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${card.color} shadow-sm`}>
                  <span className="material-symbols-outlined text-[22px]">
                    {card.icon}
                  </span>
                </div>
              </div>
              
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center">
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${card.badgeColor}`}>
                  {card.badgeIcon && (
                    <span className="material-symbols-outlined text-xs">{card.badgeIcon}</span>
                  )}
                  <span>{card.badge}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl min-h-[420px] flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-sm">
          {/* Pola latar belakang geometris netral */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#05162b 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center max-w-sm text-center space-y-4">
            <div className="h-20 w-20 bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center rounded-2xl shadow-sm">
              <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                link_off
              </span>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#171c1f]">Integrasi API Belum Terhubung</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Panel pemantauan aktivitas pergudangan real-time akan aktif setelah konfigurasi endpoint API LogiTrack selesai dipetakan.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full pt-2">
              <button className="flex-1 bg-[#05162b] text-white text-xs font-semibold h-10 px-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95">
                <span className="material-symbols-outlined text-base">settings_ethernet</span>
                Hubungkan API
              </button>
              <button className="flex-1 bg-slate-100 text-slate-700 text-xs font-semibold h-10 px-4 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95">
                <span className="material-symbols-outlined text-base">menu_book</span>
                Dokumentasi
              </button>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-amber-800 tracking-wider uppercase">Memperbarui Alur Data</span>
          </div>
        </section>

        {/* FOOTER SYSTEM */}
        <footer className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-400 text-xs">
          <p>© 2026 LogiTrack Inc. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex gap-4 font-medium text-slate-500">
            <a className="hover:text-[#05162b] transition-colors" href="#">Privasi</a>
            <a className="hover:text-[#05162b] transition-colors" href="#">Ketentuan</a>
            <a className="hover:text-[#05162b] transition-colors" href="#">Pusat Bantuan</a>
          </div>
        </footer>

      </div>
    </MainLayout>
  )
}