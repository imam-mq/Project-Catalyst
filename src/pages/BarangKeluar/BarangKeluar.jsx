import { useState, useEffect } from 'react'
import MainLayout from '../../components/Layout/MainLayout'
import DataTable from '../../components/Table/DataTable'
import Modal from '../../components/Modal/Modal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import barangKeluarApi from '../../api/barangKeluarApi'
import barangApi from '../../api/barangApi'
import { useAuth } from '../../context/AuthContext'

const initialForm = {
  idBarang: '',
  qty: '',
  tujuan: '',
  tanggalKeluar: new Date().toISOString().split('T')[0],
}

const statusConfig = {
  pending:     { label: 'Pending',     variant: 'warning' },
  disetujui:   { label: 'Disetujui',   variant: 'info' },
  ditolak:     { label: 'Ditolak',     variant: 'danger' },
  selesai:     { label: 'Selesai',     variant: 'success' },
  dibatalkan:  { label: 'Dibatalkan',  variant: 'default' },
}

export default function BarangKeluar() {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [barangList, setBarangList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [approvalModal, setApprovalModal] = useState({ open: false, item: null })
  const [batalModal, setBatalModal] = useState({ open: false, item: null })
  const [konfirmasiModal, setKonfirmasiModal] = useState({ open: false, item: null })
  const [tolakModal, setTolakModal] = useState({ open: false, item: null })
  const [alasanTolak, setAlasanTolak] = useState('')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('semua')

  const isStaf = user?.role === 'staf'
  const isKepala = user?.role === 'kepala'
  const isAdmin = user?.role === 'admin'

  const loadData = async () => {
    setLoading(true)
    try {
      const [bkRes, barangRes] = await Promise.all([
        barangKeluarApi.getAll(),
        barangApi.getAll(),
      ])
      setData(bkRes.data)
      setBarangList(barangRes.data)
    } catch (err) {
      console.error('Gagal memuat data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const filteredData = activeTab === 'semua'
    ? data
    : data.filter(d => d.status === activeTab)

  const validate = () => {
    const errs = {}
    if (!form.idBarang) errs.idBarang = 'Barang wajib dipilih'
    if (!form.qty || parseInt(form.qty) < 1) errs.qty = 'Qty minimal 1'
    if (!form.tujuan) errs.tujuan = 'Tujuan wajib diisi'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSaving(true)
    try {
      const payload = {
        ...form,
        idBarang: parseInt(form.idBarang),
        qty: parseInt(form.qty),
      }
      await barangKeluarApi.create(payload, user.idUser)
      setModalOpen(false)
      setForm(initialForm)
      loadData()
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Gagal menyimpan' })
    } finally {
      setSaving(false)
    }
  }

  const handleApprove = async () => {
    setSaving(true)
    try {
      await barangKeluarApi.approve(approvalModal.item.idBarangKeluar, {
        aksi: 'disetujui',
        idKepala: String(user.idUser),
      })
      setApprovalModal({ open: false, item: null })
      loadData()
    } catch (err) {
      console.error('Gagal approve:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleTolak = async () => {
    setSaving(true)
    try {
      await barangKeluarApi.approve(tolakModal.item.idBarangKeluar, {
        aksi: 'ditolak',
        idKepala: String(user.idUser),
        alasanTolak,
      })
      setTolakModal({ open: false, item: null })
      setAlasanTolak('')
      loadData()
    } catch (err) {
      console.error('Gagal tolak:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleKonfirmasi = async () => {
    setSaving(true)
    try {
      await barangKeluarApi.konfirmasi(konfirmasiModal.item.idBarangKeluar)
      setKonfirmasiModal({ open: false, item: null })
      loadData()
    } catch (err) {
      console.error('Gagal konfirmasi:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleBatal = async () => {
    try {
      await barangKeluarApi.batal(batalModal.item.idBarangKeluar)
      setBatalModal({ open: false, item: null })
      loadData()
    } catch (err) {
      console.error('Gagal batal:', err)
    }
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
      key: 'noPermintaan',
      label: 'No Permintaan',
      render: (row) => (
        <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
          {row.noPermintaan}
        </span>
      )
    },
    {
      key: 'barang',
      label: 'Barang',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800 text-sm">{row.namaBarang}</p>
          <p className="text-xs text-slate-400">{row.kodeBarang}</p>
        </div>
      )
    },
    {
      key: 'qty',
      label: 'Qty',
      render: (row) => (
        <span className="font-bold text-slate-800">{row.qty}</span>
      )
    },
    {
      key: 'tujuan',
      label: 'Tujuan',
      render: (row) => (
        <span className="text-slate-600 text-sm">{row.tujuan || '-'}</span>
      )
    },
    {
      key: 'pengaju',
      label: 'Pengaju',
      render: (row) => (
        <span className="text-slate-500 text-xs capitalize">{row.usernameUser}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const cfg = statusConfig[row.status] || statusConfig.pending
        return <Badge label={cfg.label} variant={cfg.variant} />
      }
    },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-1 flex-wrap">

          {/* Kepala: approve / tolak kalau pending */}
          {isKepala && row.status === 'pending' && (
            <>
              <Button variant="success" size="sm" icon="check_circle"
                onClick={() => setApprovalModal({ open: true, item: row })}>
                Setujui
              </Button>
              <Button variant="danger" size="sm" icon="cancel"
                onClick={() => { setTolakModal({ open: true, item: row }); setAlasanTolak('') }}>
                Tolak
              </Button>
            </>
          )}

          {/* Staf: konfirmasi kalau disetujui */}
          {(isStaf || isAdmin) && row.status === 'disetujui' && (
            <Button variant="primary" size="sm" icon="done_all"
              onClick={() => setKonfirmasiModal({ open: true, item: row })}>
              Konfirmasi
            </Button>
          )}

          {/* Staf: batalkan kalau masih pending */}
          {(isStaf || isAdmin) && row.status === 'pending' && (
            <Button variant="secondary" size="sm" icon="close"
              onClick={() => setBatalModal({ open: true, item: row })}>
              Batal
            </Button>
          )}

          {/* Tampilkan alasan tolak */}
          {row.status === 'ditolak' && row.alasanTolak && (
            <span className="text-xs text-red-500 italic">
              {row.alasanTolak}
            </span>
          )}
        </div>
      )
    }
  ]

  const tabs = [
    { key: 'semua', label: 'Semua', count: data.length },
    { key: 'pending', label: 'Pending', count: data.filter(d => d.status === 'pending').length },
    { key: 'disetujui', label: 'Disetujui', count: data.filter(d => d.status === 'disetujui').length },
    { key: 'selesai', label: 'Selesai', count: data.filter(d => d.status === 'selesai').length },
    { key: 'ditolak', label: 'Ditolak', count: data.filter(d => d.status === 'ditolak').length },
  ]

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#171c1f]">Barang Keluar</h1>
            <p className="text-sm text-slate-500">
              {isKepala
                ? 'Review dan setujui permintaan pengeluaran barang'
                : 'Ajukan permintaan pengeluaran barang'}
            </p>
          </div>
          {(isStaf || isAdmin) && (
            <Button variant="primary" icon="add"
              onClick={() => { setForm(initialForm); setErrors({}); setModalOpen(true) }}>
              Ajukan Permintaan
            </Button>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: data.length, icon: 'receipt_long', color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { label: 'Pending', value: data.filter(d => d.status === 'pending').length, icon: 'pending', color: 'text-amber-600 bg-amber-50 border-amber-100' },
            { label: 'Disetujui', value: data.filter(d => d.status === 'disetujui').length, icon: 'check_circle', color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { label: 'Selesai', value: data.filter(d => d.status === 'selesai').length, icon: 'task_alt', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
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

        {/* Tabs filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.key
                  ? 'bg-white text-[#05162b] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                ${activeTab === tab.key ? 'bg-[#05162b] text-white' : 'bg-slate-200 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tabel */}
        <Card>
          <DataTable
            columns={columns}
            data={filteredData}
            loading={loading}
            searchPlaceholder="Cari no permintaan atau nama barang..."
            emptyMessage="Belum ada data barang keluar"
          />
        </Card>
      </div>

      {/* Modal Ajukan Permintaan */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Ajukan Permintaan Barang Keluar"
        subtitle="Isi form permintaan pengeluaran barang"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button variant="primary" loading={saving} onClick={handleSubmit}>
              Ajukan Permintaan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {errors.global && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {errors.global}
            </div>
          )}

          {/* Dropdown Barang */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Barang <span className="text-red-500">*</span>
            </label>
            <select
              value={form.idBarang}
              onChange={(e) => setForm({ ...form, idBarang: e.target.value })}
              className={`w-full h-10 pl-3 pr-10 border rounded-xl text-sm bg-white appearance-none
                focus:outline-none focus:ring-2 focus:ring-[#05162b]/20 focus:border-[#05162b]
                ${errors.idBarang ? 'border-red-400' : 'border-slate-300'}`}
            >
              <option value="">-- Pilih Barang --</option>
              {barangList.map(b => (
                <option key={b.idBarang} value={b.idBarang}>
                  {b.kodeBarang} — {b.namaBarang} (Stok: {b.stokSekarang})
                </option>
              ))}
            </select>
            {errors.idBarang && (
              <p className="text-xs text-red-500">{errors.idBarang}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Qty"
              id="qty"
              icon="numbers"
              type="number"
              min="1"
              placeholder="Jumlah"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: e.target.value })}
              error={errors.qty}
              required
            />
            <Input
              label="Tanggal Keluar"
              id="tanggalKeluar"
              type="date"
              value={form.tanggalKeluar}
              onChange={(e) => setForm({ ...form, tanggalKeluar: e.target.value })}
            />
          </div>

          <Input
            label="Tujuan"
            id="tujuan"
            icon="place"
            placeholder="Contoh: Divisi Produksi"
            value={form.tujuan}
            onChange={(e) => setForm({ ...form, tujuan: e.target.value })}
            error={errors.tujuan}
            required
          />
        </div>
      </Modal>

      {/* Modal Setujui */}
      <Modal
        open={approvalModal.open}
        onClose={() => setApprovalModal({ open: false, item: null })}
        title="Konfirmasi Persetujuan"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setApprovalModal({ open: false, item: null })}>
              Batal
            </Button>
            <Button variant="success" icon="check_circle" loading={saving} onClick={handleApprove}>
              Ya, Setujui
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
          </div>
          <div>
            <p className="text-sm text-slate-700">
              Setujui permintaan{' '}
              <span className="font-semibold">{approvalModal.item?.noPermintaan}</span>?
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Barang: {approvalModal.item?.namaBarang} — Qty: {approvalModal.item?.qty}
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal Tolak */}
      <Modal
        open={tolakModal.open}
        onClose={() => setTolakModal({ open: false, item: null })}
        title="Tolak Permintaan"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setTolakModal({ open: false, item: null })}>
              Batal
            </Button>
            <Button variant="danger" icon="cancel" loading={saving} onClick={handleTolak}>
              Ya, Tolak
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-red-600 text-[20px]">cancel</span>
            </div>
            <div>
              <p className="text-sm text-slate-700">
                Tolak permintaan{' '}
                <span className="font-semibold">{tolakModal.item?.noPermintaan}</span>?
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Barang: {tolakModal.item?.namaBarang} — Qty: {tolakModal.item?.qty}
              </p>
            </div>
          </div>
          <Input
            label="Alasan Penolakan"
            id="alasanTolak"
            icon="comment"
            placeholder="Isi alasan penolakan..."
            value={alasanTolak}
            onChange={(e) => setAlasanTolak(e.target.value)}
          />
        </div>
      </Modal>

      {/* Modal Konfirmasi Pengambilan */}
      <Modal
        open={konfirmasiModal.open}
        onClose={() => setKonfirmasiModal({ open: false, item: null })}
        title="Konfirmasi Pengambilan"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setKonfirmasiModal({ open: false, item: null })}>
              Batal
            </Button>
            <Button variant="primary" icon="done_all" loading={saving} onClick={handleKonfirmasi}>
              Ya, Konfirmasi
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">done_all</span>
          </div>
          <div>
            <p className="text-sm text-slate-700">
              Konfirmasi pengambilan barang{' '}
              <span className="font-semibold">{konfirmasiModal.item?.namaBarang}</span>?
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Qty: {konfirmasiModal.item?.qty} — Stok akan berkurang otomatis.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal Batalkan */}
      <Modal
        open={batalModal.open}
        onClose={() => setBatalModal({ open: false, item: null })}
        title="Batalkan Permintaan"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setBatalModal({ open: false, item: null })}>
              Kembali
            </Button>
            <Button variant="danger" icon="close" onClick={handleBatal}>
              Ya, Batalkan
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-slate-600 text-[20px]">close</span>
          </div>
          <div>
            <p className="text-sm text-slate-700">
              Batalkan permintaan{' '}
              <span className="font-semibold">{batalModal.item?.noPermintaan}</span>?
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>
      </Modal>

    </MainLayout>
  )
}