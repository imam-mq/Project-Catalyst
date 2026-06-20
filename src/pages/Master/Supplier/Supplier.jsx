import { useState, useEffect } from 'react'
import MainLayout from '../../../components/Layout/MainLayout'
import DataTable from '../../../components/Table/DataTable'
import Modal from '../../../components/Modal/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'
import supplierApi from '../../../api/supplierApi'

const initialForm = {
    namaSuplier: '',
    kontak: '',
    alamat: '',
}

export default function Supplier() {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [deleteModal, setDeleteModal] = useState({ open: false, item: null })
    const [editItem, setEditItem] = useState(null)
    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
        const res = await supplierApi.getAll()
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
        setModalOpen(true)
    }

    const handleEdit = (item) => {
        setEditItem(item)
        setForm({
        namaSuplier: item.namaSuplier,
        kontak: item.kontak || '',
        alamat: item.alamat || '',
        })
        setErrors({})
        setModalOpen(true)
    }

    const validate = () => {
        const errs = {}
        if (!form.namaSuplier) errs.namaSuplier = 'Nama supplier wajib diisi'
        return errs
    }

    const handleSubmit = async () => {
        const errs = validate()
        if (Object.keys(errs).length > 0) {
        setErrors(errs)
        return
        }
        setSaving(true)
        try {
        if (editItem) {
            await supplierApi.update(editItem.idSuplier, form)
        } else {
            await supplierApi.create(form)
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
        await supplierApi.delete(deleteModal.item.idSuplier)
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
            key: 'nama',
            label: 'Nama Supplier',
            render: (row) => (
                <span className="font-medium text-slate-800">{row.namaSuplier}</span>
            )
        },
        {
            key: 'kontak',
            label: 'Kontak',
            render: (row) => (
                <span className="text-slate-600 text-sm">{row.kontak || '-'}</span>
            )
        },
        {
            key: 'alamat',
            label: 'Alamat',
            render: (row) => (
                <span className="text-slate-500 text-sm">{row.alamat || '-'}</span>
            )
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" icon="edit" onClick={() => handleEdit(row)}>
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-[#171c1f]">Master Supplier</h1>
                    <p className="text-sm text-slate-500">Kelola data supplier barang gudang</p>
                </div>
                <Button variant="primary" icon="add" onClick={handleAdd}>
                    Tambah Supplier
                </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                    { label: 'Total Supplier', value: data.length, icon: 'local_shipping', color: 'text-blue-600 bg-blue-50 border-blue-100' },
                    { label: 'Supplier Aktif', value: data.length, icon: 'check_circle', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                ].map(card => (
                    <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${card.color}`}>
                        <span className="material-symbols-outlined text-[22px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        {card.icon}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{card.label}</p>
                        <p className="text-3xl font-bold text-[#171c1f]">{card.value}</p>
                    </div>
                    </div>
                ))}
                </div>

                <Card>
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    searchPlaceholder="Cari nama supplier..."
                    emptyMessage="Belum ada data supplier"
                />
                </Card>
            </div>

            {/* Modal Tambah / Edit */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editItem ? 'Edit Supplier' : 'Tambah Supplier'}
                subtitle={editItem ? `Edit data ${editItem.namaSuplier}` : 'Isi form berikut'}
                footer={
                <>
                    <Button variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
                    <Button variant="primary" loading={saving} onClick={handleSubmit}>
                    {editItem ? 'Simpan Perubahan' : 'Tambah Supplier'}
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
                    label="Nama Supplier"
                    id="namaSuplier"
                    icon="store"
                    placeholder="Contoh: CV Maju Jaya"
                    value={form.namaSuplier}
                    onChange={(e) => setForm({ ...form, namaSuplier: e.target.value })}
                    error={errors.namaSuplier}
                    required
                />
                <Input
                    label="Kontak"
                    id="kontak"
                    icon="phone"
                    placeholder="Contoh: 0812-1234-5678"
                    value={form.kontak}
                    onChange={(e) => setForm({ ...form, kontak: e.target.value })}
                />
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Alamat</label>
                    <textarea
                    rows={3}
                    placeholder="Alamat lengkap supplier"
                    value={form.alamat}
                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#05162b]/20 focus:border-[#05162b] resize-none"
                    />
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
                    <Button variant="secondary" onClick={() => setDeleteModal({ open: false, item: null })}>
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
                    Yakin hapus supplier <span className="font-semibold">{deleteModal.item?.namaSuplier}</span>?
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
                </div>
            </Modal>
        </MainLayout>
    )

}