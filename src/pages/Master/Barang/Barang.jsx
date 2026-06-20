import { useState, useEffect } from 'react'
import MainLayout from '../../../components/Layout/MainLayout'
import DataTable from '../../../components/Table/DataTable'
import Modal from '../../../components/Modal/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Badge from '../../../components/ui/Badge'
import Card from '../../../components/ui/Card'
import barangApi from '../../../api/barangApi'
import supplierApi from '../../../api/supplierApi'

const initialForm = {
  kodeBarang: '',
  namaBarang: '',
  kategori: '',
  satuan: '',
  stokMinimum: '',
  stokSekarang: '',
  idSuplier: '',
}

export default function Barang() {
  const [data, setData] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null })
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Load data barang & supplier
  const loadData = async () => {
    setLoading(true)
    try {
      const [barangRes, supplierRes] = await Promise.all([
        barangApi.getAll(),
        supplierApi.getAll()
      ])
      setData(barangRes.data)
      setSuppliers(supplierRes.data)
    } catch (err) {
      console.error('Gagal memuat data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Trigger Tambah
  const handleAdd = () => {
    setEditItem(null)
    setForm(initialForm)
    setErrors({})
    setModalOpen(true)
  }

  // Trigger Edit 
    const handleEdit = (item) => {
        setEditItem(item)
        setForm({
            kodeBarang: item.kodeBarang,
            namaBarang: item.namaBarang,
            kategori: item.kategori || '',
            satuan: item.satuan || '',
            stokMinimum: item.stokMinimum || '',
            stokSekarang: item.stokSekarang || 0,  // ✅ tambah
            idSuplier: item.idSuplier || '',
        })
        setErrors({})
        setModalOpen(true)
    }

  // Validasi form front-end
  const validate = () => {
    const errs = {}
    if (!form.kodeBarang) errs.kodeBarang = 'Kode barang wajib diisi'
    if (!form.namaBarang) errs.namaBarang = 'Nama barang wajib diisi'
    if (!form.satuan) errs.satuan = 'Satuan wajib diisi'
    if (!form.stokMinimum) errs.stokMinimum = 'Stok minimum wajib diisi'
    if (!form.idSuplier) errs.idSuplier = 'Supplier wajib dipilih'
    return errs
  }

  // Submit Form (Create / Update)
  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...form,
        stokMinimum: parseInt(form.stokMinimum),
        stokSekarang: parseInt(form.stokSekarang) || 0,
        idSuplier: parseInt(form.idSuplier),
      }

      if (editItem) {
        await barangApi.update(editItem.idBarang, payload)
      } else {
        await barangApi.create(payload)
      }

      setModalOpen(false)
      loadData()
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menyimpan data'
      setErrors({ global: msg })
    } finally {
      setSaving(false)
    }
  }

  // Hapus Data
  const handleDelete = async () => {
    try {
      await barangApi.delete(deleteModal.item.idBarang)
      setDeleteModal({ open: false, item: null })
      loadData()
    } catch (err) {
      console.error('Gagal hapus:', err)
    }
  }

  // Definisi Kolom Tabel
  const columns = [
    {
      key: 'no',
      label: 'No',
      render: (row) => (
        <span className="text-slate-400 text-xs">
            {data.indexOf(row) + 1}
        </span>
      )
    },
    {
      key: 'kodeBarang',
      label: 'Kode',
      accessor: 'kodeBarang',
      render: (row) => (
        <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
          {row.kodeBarang}
        </span>
      )
    },
    { key: 'namaBarang', label: 'Nama Barang', accessor: 'namaBarang' },
    { key: 'kategori', label: 'Kategori', accessor: 'kategori' },
    { key: 'satuan', label: 'Satuan', accessor: 'satuan' },
    {
      key: 'stok',
      label: 'Stok',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">{row.stokSekarang}</span>
            {row.stokSekarang > 0 && row.stokSekarang <= row.stokMinimum && (
                <Badge label="Low Stock" variant="danger" icon="warning" />
            )}
        </div>
      )
    },
    {
      key: 'stokMinimum',
      label: 'Min. Stok',
      render: (row) => (
        <span className="text-slate-500 text-xs">{row.stokMinimum}</span>
      )
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (row) => (
        <span className="text-slate-600 text-xs">{row.namaSuplier || '-'}</span>
      )
    },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon="edit"
            onClick={() => handleEdit(row)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon="delete"
            onClick={() => setDeleteModal({ open: true, item: row })}
          >
            Hapus
          </Button>
        </div>
      )
    }
  ]

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#171c1f]">Master Barang</h1>
            <p className="text-sm text-slate-500">
              Kelola data master barang gudang
            </p>
          </div>
          <Button
            variant="primary"
            icon="add"
            onClick={handleAdd}
          >
            Tambah Barang
          </Button>
        </div>

        {/* Summary Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Total Barang', value: data.length, icon: 'inventory_2', color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { label: 'Low Stock', value: data.filter(d => d.stokSekarang > 0 && d.stokSekarang <= d.stokMinimum).length, icon: 'warning', color: 'text-red-600 bg-red-50 border-red-100' },
            { label: 'Total Stok', value: data.reduce((a, b) => a + (b.stokSekarang || 0), 0), icon: 'widgets', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { label: 'Supplier', value: suppliers.length, icon: 'local_shipping', color: 'text-purple-600 bg-purple-50 border-purple-100' },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${card.color} shadow-sm`}>
                <span 
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {card.icon}
                </span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{card.label}</p>
                <p className="text-3xl font-bold text-[#171c1f] tracking-tight">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Datatable Wrapper */}
        <Card className="shadow-sm border-slate-200 rounded-2xl">
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            searchPlaceholder="Cari kode atau nama barang..."
            emptyMessage="Belum ada data barang"
          />
        </Card>
      </div>

      {/* Modal Tambah / Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Barang' : 'Tambah Barang Baru'}
        subtitle={editItem ? `Edit data ${editItem.namaBarang}` : 'Isi form berikut untuk menambah barang'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" loading={saving} onClick={handleSubmit}>
              {editItem ? 'Simpan Perubahan' : 'Tambah Barang'}
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

          <Input
            label="Kode Barang"
            id="kodeBarang"
            icon="qr_code"
            placeholder="Contoh: BRG-001"
            value={form.kodeBarang}
            onChange={(e) => setForm({ ...form, kodeBarang: e.target.value })}
            error={errors.kodeBarang}
            required
            disabled={!!editItem}
          />

          <Input
            label="Nama Barang"
            id="namaBarang"
            icon="inventory_2"
            placeholder="Contoh: Kardus Ukuran M"
            value={form.namaBarang}
            onChange={(e) => setForm({ ...form, namaBarang: e.target.value })}
            error={errors.namaBarang}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Kategori"
              id="kategori"
              icon="category"
              placeholder="Contoh: Packaging"
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
            />
            <Input
              label="Satuan"
              id="satuan"
              icon="straighten"
              placeholder="Contoh: pcs, kg, roll"
              value={form.satuan}
              onChange={(e) => setForm({ ...form, satuan: e.target.value })}
              error={errors.satuan}
              required
            />
          </div>

          <Input
            label="Stok Minimum"
            id="stokMinimum"
            icon="production_quantity_limits"
            type="number"
            min="0"
            placeholder="Contoh: 50"
            value={form.stokMinimum}
            onChange={(e) => setForm({ ...form, stokMinimum: e.target.value })}
            error={errors.stokMinimum}
            required
          />
            {editItem && (
                <Input
                    label="Stok Sekarang"
                    id="stokSekarang"
                    icon="inventory"
                    type="number"
                    min="0"
                    placeholder="Jumlah stok saat ini"
                    value={form.stokSekarang}
                    onChange={(e) => setForm({ ...form, stokSekarang: e.target.value })}
                />
            )}

          {/* Dropdown Supplier Layout Style */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">
              Supplier <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={form.idSuplier}
                onChange={(e) => setForm({ ...form, idSuplier: e.target.value })}
                className={`w-full h-10 pl-3 pr-10 border rounded-xl text-sm text-slate-800 bg-white appearance-none
                  focus:outline-none focus:ring-2 focus:ring-[#05162b]/20 focus:border-[#05162b] transition-all
                  ${errors.idSuplier ? 'border-red-400' : 'border-slate-300'}`}
              >
                <option value="">-- Pilih Supplier --</option>
                {suppliers.map(s => (
                  <option key={s.idSuplier} value={s.idSuplier}>
                    {s.namaSuplier}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
              </div>
            </div>
            {errors.idSuplier && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.idSuplier}
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        title="Konfirmasi Hapus"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ open: false, item: null })}
            >
              Batal
            </Button>
            <Button variant="danger" icon="delete" onClick={handleDelete}>
              Ya, Hapus
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-red-600 text-[20px]">warning</span>
          </div>
          <div>
            <p className="text-sm text-slate-700">
              Yakin ingin menghapus barang{' '}
              <span className="font-semibold">{deleteModal.item?.namaBarang}</span>?
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