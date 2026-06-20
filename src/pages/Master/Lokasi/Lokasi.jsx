import { useState, useEffect } from 'react'
import MainLayout from '../../../components/Layout/MainLayout'
import DataTable from '../../../components/Table/DataTable'
import Modal from '../../../components/Modal/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'
import lokasiApi from '../../../api/lokasiApi'


const initialForm = {
  kodeLokasi: '',
  namaRak: '',
  zona: '',
  kapasitas: '',
}

export default function Lokasi() {
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
        const res = await lokasiApi.getAll()
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
        kodeLokasi: item.kodeLokasi,
        namaRak: item.namaRak || '',
        zona: item.zona || '',
        kapasitas: item.kapasitas || '',
        })
        setErrors({})
        setModalOpen(true)
    }

    const validate = () => {
        const errs = {}
        if (!form.kodeLokasi) errs.kodeLokasi = 'Kode lokasi wajib diisi'
        if (!form.namaRak) errs.namaRak = 'Nama rak wajib diisi'
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
        const payload = {
            ...form,
            kapasitas: form.kapasitas ? parseInt(form.kapasitas) : null
        }
        if (editItem) {
            await lokasiApi.update(editItem.idLokasiGudang, payload)
        } else {
            await lokasiApi.create(payload)
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
        await lokasiApi.delete(deleteModal.item.idLokasiGudang)
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
            key: 'kode',
            label: 'Kode Lokasi',
            render: (row) => (
                <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                {row.kodeLokasi}
                </span>
            )
        },
        {
            key: 'namaRak',
            label: 'Nama Rak',
            render: (row) => (
                <span className="font-medium text-slate-800">{row.namaRak}</span>
            )
        },
        {
            key: 'zona',
            label: 'Zona',
            render: (row) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                Zona {row.zona || '-'}
                </span>
            )
        },
        {
            key: 'kapasitas',
            label: 'Kapasitas',
            render: (row) => (
                <span className="text-slate-600 text-sm">
                {row.kapasitas ? `${row.kapasitas} unit` : '-'}
                </span>
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
                        <h1 className="text-3xl font-bold tracking-tight text-[#171c1f]">Lokasi Gudang</h1>
                        <p className="text-sm text-slate-500">Kelola data rak dan zona penyimpanan</p>
                    </div>
                    <Button variant="primary" icon="add" onClick={handleAdd}>
                        Tambah Lokasi
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                        { label: 'Total Lokasi', value: data.length, icon: 'warehouse', color: 'text-blue-600 bg-blue-50 border-blue-100' },
                        { label: 'Total Zona', value: [...new Set(data.map(d => d.zona).filter(Boolean))].length, icon: 'grid_view', color: 'text-purple-600 bg-purple-50 border-purple-100' },
                        { label: 'Total Kapasitas', value: data.reduce((a, b) => a + (b.kapasitas || 0), 0), icon: 'inventory', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
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
                        searchPlaceholder="Cari kode atau nama rak"
                        emptyMessage="Belum ada data lokasi"
                    />
                </Card>
            </div>

            <Modal
                open={modalOpen} // Props di sini
                onClose={() => setModalOpen(false)}
                title={editItem ? 'Edit Lokasi' : 'Tambah Lokasi'}
                subtitle={editItem ? `Edit data ${editItem.namaRak}` : 'Isi form berikut'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
                        <Button variant="primary" loading={saving} onClick={handleSubmit}>
                            {editItem ? 'Simpan Perubahan' : 'Tambah Lokasi'}
                        </Button>
                    </>
                }
            >
                {/* Isi form di dalam sini */}
                <div className="space-y-4">
                    {errors.global && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                            {errors.global}
                        </div>
                    )}

                    <Input
                        label="Kode Lokasi"
                        id="kodeLokasi"
                        icon="qr_code"
                        placeholder="Contoh: R-A1-01"
                        value={form.kodeLokasi}
                        onChange={(e) => setForm({ ...form, kodeLokasi: e.target.value })}
                        error={errors.kodeLokasi}
                        required
                        disabled={!!editItem}
                    />

                    <Input
                        label="Nama Rak"
                        id="namaRak"
                        icon="shelves"
                        placeholder="Contoh: Rak A1 Slot 01"
                        value={form.namaRak}
                        onChange={(e) => setForm({ ...form, namaRak: e.target.value })}
                        error={errors.namaRak}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Zona"
                            id="zona"
                            icon="grid_view"
                            placeholder="Contoh: A, B, C"
                            value={form.zona}
                            onChange={(e) => setForm({ ...form, zona: e.target.value })}
                        />
                        <Input
                            label="Kapasitas"
                            id="kapasitas"
                            icon="inventory"
                            type="number"
                            min="0"
                            placeholder="Contoh: 200"
                            value={form.kapasitas}
                            onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
                        />
                    </div>
                </div>
            </Modal>

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
                        Yakin hapus lokasi <span className="font-semibold">{deleteModal.item?.namaRak}</span>?
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Tindakan ini tidak dapat dibatalkan.</p>
                    </div>
                </div>
            </Modal>
        </MainLayout>   
    )
}