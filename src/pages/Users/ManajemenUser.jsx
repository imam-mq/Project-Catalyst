import { useState, useEffect } from 'react'
import MainLayout from '../../components/Layout/MainLayout'
import DataTable from '../../components/Table/DataTable'
import Modal from '../../components/Modal/Modal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import api from '../../api/axios'

const initialForm = {
  nama: '',
  username: '',
  password: '',
  role: 'staf',
}

const roleConfig = {
  admin:  { label: 'Admin',        variant: 'danger' },
  staf:   { label: 'Staf Lapangan', variant: 'success' },
  kepala: { label: 'Kepala Gudang', variant: 'info' },
}

export default function ManajemenUser() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null })
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users')
      setData(res.data)
    } catch (err) {
      console.error('Gagal memuat data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleAdd = () => {
    setEditItem(null)
    setForm(initialForm)
    setErrors({})
    setShowPassword(false)
    setModalOpen(true)
  }

  const handleEdit = (item) => {
    setEditItem(item)
    setForm({
      nama: item.username,
      username: item.username,
      password: '',
      role: item.role,
    })
    setErrors({})
    setShowPassword(false)
    setModalOpen(true)
  }

  const validate = () => {
    const errs = {}
    if (!form.username) errs.username = 'Username wajib diisi'
    if (!editItem && !form.password) errs.password = 'Password wajib diisi'
    if (!form.role) errs.role = 'Role wajib dipilih'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSaving(true)
    try {
      if (editItem) {
        const payload = { role: form.role }
        if (form.password) payload.password = form.password
        await api.put(`/users/${editItem.idUser}`, payload)
      } else {
        await api.post('/users', {
          nama: form.username,
          username: form.username,
          password: form.password,
          role: form.role,
        })
      }
      setModalOpen(false)
      loadData()
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Gagal menyimpan data' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteModal.item.idUser}`)
      setDeleteModal({ open: false, item: null })
      loadData()
    } catch (err) {
      console.error('Gagal hapus:', err)
    }
  }

  const columns = [
    {
      key: 'no',
      label: 'No',
      render: (row) => (
        <span className="text-slate-400 text-xs">{data.indexOf(row) + 1}</span>
      )
    },
    {
      key: 'avatar',
      label: '',
      render: (row) => (
        <div className="w-8 h-8 rounded-full bg-[#fc7c1f] flex items-center justify-center text-white font-bold text-xs">
          {row.username?.slice(0, 2).toUpperCase()}
        </div>
      )
    },
    {
      key: 'username',
      label: 'Username',
      render: (row) => (
        <span className="font-medium text-slate-800">{row.username}</span>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => {
        const cfg = roleConfig[row.role] || { label: row.role, variant: 'default' }
        return <Badge label={cfg.label} variant={cfg.variant} />
      }
    },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon="edit"
            onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" icon="delete"
            onClick={() => setDeleteModal({ open: true, item: row })}>
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
            <h1 className="text-3xl font-bold tracking-tight text-[#171c1f]">
              Manajemen User
            </h1>
            <p className="text-sm text-slate-500">
              Kelola akun pengguna sistem
            </p>
          </div>
          <Button variant="primary" icon="person_add" onClick={handleAdd}>
            Tambah User
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Total User', value: data.length, icon: 'group', color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { label: 'Admin', value: data.filter(d => d.role === 'admin').length, icon: 'shield', color: 'text-red-600 bg-red-50 border-red-100' },
            { label: 'Staf', value: data.filter(d => d.role === 'staf').length, icon: 'badge', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          ].map(card => (
            <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${card.color}`}>
                <span className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>
                  {card.icon}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-[#171c1f]">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabel */}
        <Card>
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            searchPlaceholder="Cari username..."
            emptyMessage="Belum ada data user"
          />
        </Card>
      </div>

      {/* Modal Tambah / Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit User' : 'Tambah User Baru'}
        subtitle={editItem ? `Edit akun ${editItem.username}` : 'Buat akun pengguna baru'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" loading={saving} onClick={handleSubmit}>
              {editItem ? 'Simpan Perubahan' : 'Tambah User'}
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
            label="Username"
            id="username"
            icon="person"
            placeholder="Contoh: staf02"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            error={errors.username}
            required
            disabled={!!editItem}
          />

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Password {!editItem && <span className="text-red-500">*</span>}
              {editItem && <span className="text-slate-400 font-normal"> (kosongkan jika tidak diubah)</span>}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={editItem ? 'Kosongkan jika tidak diubah' : 'Masukkan password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full h-10 pl-9 pr-10 border rounded-xl text-sm focus:outline-none
                  focus:ring-2 focus:ring-[#05162b]/20 focus:border-[#05162b] transition-all
                  ${errors.password ? 'border-red-400' : 'border-slate-300'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Dropdown Role */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full h-10 pl-3 pr-10 border border-slate-300 rounded-xl text-sm bg-white
                appearance-none focus:outline-none focus:ring-2 focus:ring-[#05162b]/20 focus:border-[#05162b]"
            >
              <option value="admin">Admin</option>
              <option value="staf">Staf Lapangan</option>
              <option value="kepala">Kepala Gudang</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal Hapus */}
      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        title="Konfirmasi Hapus"
        size="sm"
        footer={
          <>
            <Button variant="secondary"
              onClick={() => setDeleteModal({ open: false, item: null })}>
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
              Yakin hapus akun{' '}
              <span className="font-semibold">{deleteModal.item?.username}</span>?
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