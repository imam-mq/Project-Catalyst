import { useState, useEffect } from 'react'
import MainLayout from '../../components/Layout/MainLayout'
import DataTable from '../../components/Table/DataTable'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import logApi from '../../api/logApi'
import { useAuth } from '../../context/AuthContext'

const aksiConfig = {
  CATAT_BARANG_MASUK:      { label: 'Barang Masuk',  variant: 'success', icon: 'move_to_inbox' },
  AJUKAN_BARANG_KELUAR:    { label: 'Ajukan Keluar', variant: 'info',    icon: 'outbox' },
  APPROVE_BARANG_KELUAR:   { label: 'Disetujui',     variant: 'success', icon: 'check_circle' },
  TOLAK_BARANG_KELUAR:     { label: 'Ditolak',       variant: 'danger',  icon: 'cancel' },
  KONFIRMASI_BARANG_KELUAR:{ label: 'Konfirmasi',    variant: 'info',    icon: 'done_all' },
}

export default function LogAktivitas() {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterAksi, setFilterAksi] = useState('')

  const isAdmin = user?.role === 'admin'
  const isKepala = user?.role === 'kepala'

  const loadData = async () => {
    setLoading(true)
    try {
      // admin & kepala lihat semua, staf hanya lihat miliknya
      const idUser = (!isAdmin && !isKepala) ? user.idUser : undefined
      const res = await logApi.getAll(idUser)
      setData(res.data)
    } catch (err) {
      console.error('Gagal memuat log:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const filteredData = filterAksi
    ? data.filter(d => d.aksi === filterAksi)
    : data

  const formatDateTime = (str) => {
    if (!str) return '-'
    const d = new Date(str)
    return d.toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const columns = [
    {
      key: 'no',
      label: 'No',
      render: (row) => (
        <span className="text-slate-400 text-xs">{filteredData.indexOf(row) + 1}</span>
      )
    },
    {
      key: 'waktu',
      label: 'Waktu',
      render: (row) => (
        <span className="text-slate-600 text-xs whitespace-nowrap">
          {formatDateTime(row.createdAt)}
        </span>
      )
    },
    {
      key: 'user',
      label: 'User',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800 text-sm capitalize">{row.usernameUser}</p>
          <p className="text-xs text-slate-400 capitalize">{row.roleUser}</p>
        </div>
      )
    },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (row) => {
        const cfg = aksiConfig[row.aksi]
        if (cfg) {
          return (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-slate-500">
                {cfg.icon}
              </span>
              <Badge label={cfg.label} variant={cfg.variant} />
            </div>
          )
        }
        return (
          <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
            {row.aksi}
          </span>
        )
      }
    },
    {
      key: 'keterangan',
      label: 'Keterangan',
      render: (row) => (
        <span className="text-slate-600 text-sm">{row.keterangan || '-'}</span>
      )
    },
  ]

  const uniqueAksi = [...new Set(data.map(d => d.aksi))]

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#171c1f]">Log Aktivitas</h1>
            <p className="text-sm text-slate-500">
              {isAdmin || isKepala
                ? 'Rekam jejak semua aktivitas pengguna sistem'
                : 'Riwayat aktivitas kamu di sistem'}
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Log', value: data.length, icon: 'history', color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { label: 'Barang Masuk', value: data.filter(d => d.aksi === 'CATAT_BARANG_MASUK').length, icon: 'move_to_inbox', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { label: 'Barang Keluar', value: data.filter(d => d.aksi === 'KONFIRMASI_BARANG_KELUAR').length, icon: 'outbox', color: 'text-orange-600 bg-orange-50 border-orange-100' },
            { label: 'Approval', value: data.filter(d => ['APPROVE_BARANG_KELUAR', 'TOLAK_BARANG_KELUAR'].includes(d.aksi)).length, icon: 'gavel', color: 'text-purple-600 bg-purple-50 border-purple-100' },
          ].map(card => (
            <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${card.color}`}>
                <span className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>
                  {card.icon}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{card.label}</p>
                <p className="text-2xl font-bold text-[#171c1f]">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter aksi */}
        {(isAdmin || isKepala) && uniqueAksi.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Filter:</span>
            <button
              onClick={() => setFilterAksi('')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                ${filterAksi === '' ? 'bg-[#05162b] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Semua
            </button>
            {uniqueAksi.map(aksi => {
              const cfg = aksiConfig[aksi]
              return (
                <button
                  key={aksi}
                  onClick={() => setFilterAksi(aksi)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                    ${filterAksi === aksi ? 'bg-[#05162b] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {cfg?.label || aksi}
                </button>
              )
            })}
          </div>
        )}

        {/* Tabel */}
        <Card>
          <DataTable
            columns={columns}
            data={filteredData}
            loading={loading}
            searchPlaceholder="Cari user atau keterangan..."
            emptyMessage="Belum ada log aktivitas"
          />
        </Card>
      </div>
    </MainLayout>
  )
}