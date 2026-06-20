import { useState, useEffect } from 'react'
import MainLayout from '../../components/Layout/MainLayout'
import DataTable from '../../components/Table/DataTable'
import Modal from '../../components/Modal/Modal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import barangMasukApi from '../../api/barangMasukApi'
import barangApi from '../../api/barangApi'
import supplierApi from '../../api/supplierApi'
import lokasiApi from '../../api/lokasiApi'
import { useAuth } from '../../context/AuthContext'

const initialForm = {
  idBarang: '',
  idSuplier: '',
  idLokasiGudang: '',
  noDokumen: '',
  qty: '',
  tanggalMasuk: new Date().toISOString().split('T')[0],
  status: 'diterima',
  keterangan: '',
}

export default function BarangMasuk() {
    const { user } = useAuth()
    const [data, setData] = useState([])
    const [barangList, setBarangList] = useState([])
    const [supplierList, setSupplierList] = useState([])
    const [lokasiList, setLokasiList] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            const [bmRes, barangRes, supplierRes, lokasiRes] = await Promise.all([
            barangMasukApi.getAll(),
            barangApi.getAll(),
            supplierApi.getAll(),
            lokasiApi.getAll(),
        ])
        setData(bmRes.data)
        setBarangList(barangRes.data)
        setSupplierList(supplierRes.data)
        setLokasiList(lokasiRes.data)
        } catch (err) {
            console.error('Gagal memuat data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    const handleAdd = () => {
        setForm(initialForm)
        setErrors({})
        setModalOpen(true)
    }

    const validate = () => {
        const errs = {}
        if (!form.idBarang) errs.idBarang = 'Barang wajib dipilih'
        if (!form.idSuplier) errs.idSuplier = 'Supplier wajib dipilih'
        if (!form.idLokasiGudang) errs.idLokasiGudang = 'Lokasi wajib dipilih'
        if (!form.noDokumen) errs.noDokumen = 'No dokumen wajib diisi'
        if (!form.qty || parseInt(form.qty) < 1) errs.qty = 'Qty minimal 1'
        if (!form.tanggalMasuk) errs.tanggalMasuk = 'Tanggal wajib diisi'
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
            idBarang: parseInt(form.idBarang),
            idSuplier: parseInt(form.idSuplier),
            idLokasiGudang: parseInt(form.idLokasiGudang),
            idUser: user.idUser,
            qty: parseInt(form.qty),
        }
        await barangMasukApi.create(payload)
        setModalOpen(false)
        loadData()
        } catch (err) {
        const msg = err.response?.data?.message || 'Gagal menyimpan data'
        setErrors({ global: msg })
        } finally {
        setSaving(false)
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
            key: 'noDokumen',
            label: 'No Dokumen',
            render: (row) => (
                <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                {row.noDokumen}
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
            key: 'supplier',
            label: 'Supplier',
            render: (row) => (
                <span className="text-slate-600 text-sm">{row.namaSuplier}</span>
            )
            },
            {
            key: 'lokasi',
            label: 'Lokasi',
            render: (row) => (
                <div>
                <p className="text-slate-700 text-sm">{row.namaRak}</p>
                <p className="text-xs text-slate-400">{row.kodeLokasiGudang}</p>
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
            key: 'tanggal',
            label: 'Tanggal',
            render: (row) => (
                <span className="text-slate-600 text-sm">{row.tanggalMasuk}</span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <Badge
                label={row.status}
                variant={row.status === 'diterima' ? 'success' : 'danger'}
                />
            )
            },
            {
            key: 'dicatat',
            label: 'Dicatat Oleh',
            render: (row) => (
                <span className="text-slate-500 text-xs capitalize">{row.usernameUser}</span>
            )
        },
    ]


    return (
        <MainLayout>
            <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-[#171c1f]">
                        Barang Masuk
                        </h1>
                        <p className="text-sm text-slate-500">
                        Pencatatan penerimaan barang dari supplier
                        </p>
                    </div>
                    <Button variant="primary" icon="add" onClick={handleAdd}>
                        Catat Barang Masuk
                    </Button>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                        {
                        label: 'Total Transaksi',
                        value: data.length,
                        icon: 'receipt_long',
                        color: 'text-blue-600 bg-blue-50 border-blue-100'
                        },
                        {
                        label: 'Diterima',
                        value: data.filter(d => d.status === 'diterima').length,
                        icon: 'check_circle',
                        color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
                        },
                        {
                        label: 'Retur',
                        value: data.filter(d => d.status === 'retur').length,
                        icon: 'assignment_return',
                        color: 'text-red-600 bg-red-50 border-red-100'
                        },
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
                    searchPlaceholder="Cari no dokumen atau nama barang..."
                    emptyMessage="Belum ada data barang masuk"
                />
                </Card>
            </div>

            {/* Modal Catat Barang Masuk */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Catat Barang Masuk"
                subtitle="Isi form penerimaan barang dari supplier"
                size="lg"
                footer={
                <>
                    <Button variant="secondary" onClick={() => setModalOpen(false)}>
                    Batal
                    </Button>
                    <Button variant="primary" loading={saving} onClick={handleSubmit}>
                    Simpan
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

                <div className="grid grid-cols-2 gap-4">
                    <Input
                    label="No Dokumen"
                    id="noDokumen"
                    icon="receipt"
                    placeholder="Contoh: BM-20260527-001"
                    value={form.noDokumen}
                    onChange={(e) => setForm({ ...form, noDokumen: e.target.value })}
                    error={errors.noDokumen}
                    required
                    />
                    <Input
                    label="Tanggal Masuk"
                    id="tanggalMasuk"
                    type="date"
                    value={form.tanggalMasuk}
                    onChange={(e) => setForm({ ...form, tanggalMasuk: e.target.value })}
                    error={errors.tanggalMasuk}
                    required
                    />
                </div>

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
                        {b.kodeBarang} — {b.namaBarang}
                        </option>
                    ))}
                    </select>
                    {errors.idBarang && (
                    <p className="text-xs text-red-500">{errors.idBarang}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Dropdown Supplier */}
                    <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                        Supplier <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={form.idSuplier}
                        onChange={(e) => setForm({ ...form, idSuplier: e.target.value })}
                        className={`w-full h-10 pl-3 pr-10 border rounded-xl text-sm bg-white appearance-none
                        focus:outline-none focus:ring-2 focus:ring-[#05162b]/20 focus:border-[#05162b]
                        ${errors.idSuplier ? 'border-red-400' : 'border-slate-300'}`}
                    >
                        <option value="">-- Pilih Supplier --</option>
                        {supplierList.map(s => (
                        <option key={s.idSuplier} value={s.idSuplier}>
                            {s.namaSuplier}
                        </option>
                        ))}
                    </select>
                    {errors.idSuplier && (
                        <p className="text-xs text-red-500">{errors.idSuplier}</p>
                    )}
                    </div>

                    {/* Dropdown Lokasi */}
                    <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                        Lokasi Gudang <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={form.idLokasiGudang}
                        onChange={(e) => setForm({ ...form, idLokasiGudang: e.target.value })}
                        className={`w-full h-10 pl-3 pr-10 border rounded-xl text-sm bg-white appearance-none
                        focus:outline-none focus:ring-2 focus:ring-[#05162b]/20 focus:border-[#05162b]
                        ${errors.idLokasiGudang ? 'border-red-400' : 'border-slate-300'}`}
                    >
                        <option value="">-- Pilih Lokasi --</option>
                        {lokasiList.map(l => (
                        <option key={l.idLokasiGudang} value={l.idLokasiGudang}>
                            {l.kodeLokasi} — {l.namaRak}
                        </option>
                        ))}
                    </select>
                    {errors.idLokasiGudang && (
                        <p className="text-xs text-red-500">{errors.idLokasiGudang}</p>
                    )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                    label="Qty"
                    id="qty"
                    icon="numbers"
                    type="number"
                    min="1"
                    placeholder="Jumlah barang"
                    value={form.qty}
                    onChange={(e) => setForm({ ...form, qty: e.target.value })}
                    error={errors.qty}
                    required
                    />

                    {/* Status */}
                    <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Status</label>
                    <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full h-10 pl-3 pr-10 border border-slate-300 rounded-xl text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#05162b]/20"
                    >
                        <option value="diterima">Diterima</option>
                        <option value="retur">Retur</option>
                    </select>
                    </div>
                </div>

                <Input
                    label="Keterangan"
                    id="keterangan"
                    icon="notes"
                    placeholder="Catatan tambahan (opsional)"
                    value={form.keterangan}
                    onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                />
                </div>
            </Modal>
        </MainLayout>
    )

       

}