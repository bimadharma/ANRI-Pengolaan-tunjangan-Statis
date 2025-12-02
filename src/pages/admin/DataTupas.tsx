"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Eye, Edit2, Trash2, TrendingUp, CheckCircle } from "lucide-react"
import Pagination from "../../components/pagination"
import MainLayout from "../../components/layout/MainLayout"
import AlertNotification, { type Toast } from "../../components/AlertNotification"
import GenericModal, { type ModalField } from "../../components/ModalPop"

// --- Types & Constants ---
type TupasItem = {
  id: number; nama: string; nip: string; jabatan: string; golongan: string;
  gajiPokok: number; tunjangan: number; potongan: number; total: number;
  bulan: string; tahun: string; status: string
}

const modalFields: ModalField[] = [
  { name: "nama", label: "Nama Pegawai", type: "text", required: true, placeholder: "Nama Lengkap" },
  { name: "nip", label: "NIP", type: "text", required: true, placeholder: "Nomor Induk Pegawai" },
  { name: "jabatan", label: "Jabatan", type: "text", required: true },
  { name: "golongan", label: "Golongan", type: "text", required: true, placeholder: "Ex: III/c" },
  { name: "gajiPokok", label: "Gaji Pokok", type: "number", required: true },
  { name: "tunjangan", label: "Tunjangan", type: "number", required: true },
  { name: "potongan", label: "Potongan", type: "number", required: true },
  { name: "bulan", label: "Bulan", type: "select", options: Array.from({length: 12}, (_, i) => ({ value: String(i+1).padStart(2,'0'), label: new Date(0, i).toLocaleString('id-ID', {month:'long'}) })), required: true },
  { name: "tahun", label: "Tahun", type: "text", required: true, placeholder: "2024" },
  { name: "status", label: "Status", type: "select", options: [{value: "Aktif", label: "Aktif"}, {value: "Cuti", label: "Cuti"}, {value: "Non-Aktif", label: "Non-Aktif"}], required: true },
]

export default function DataTupas() {
  // --- State ---
  const [items, setItems] = useState<TupasItem[]>([
    { id: 1, nama: "Budi Santoso", nip: "19850315198603001", jabatan: "Kepala Bagian", golongan: "III/c", gajiPokok: 5000000, tunjangan: 1500000, potongan: 250000, total: 6250000, bulan: "01", tahun: "2024", status: "Aktif" },
    { id: 2, nama: "Sinta Dewi", nip: "19880422199003002", jabatan: "Staf Administrasi", golongan: "II/c", gajiPokok: 3500000, tunjangan: 1000000, potongan: 150000, total: 4350000, bulan: "01", tahun: "2024", status: "Aktif" },
  ])
  const [params, setParams] = useState({ filter: "", page: 1 })
  const [popup, setPopup] = useState<{ open: boolean; mode: "add"|"edit"|"view"|"delete"; data: TupasItem | null }>({ open: false, mode: "view", data: null })
  const [formData, setFormData] = useState<Partial<TupasItem>>({})
  const [toasts, setToasts] = useState<Toast[]>([])

  // --- Helpers & Logic ---
  const pushToast = (type: Toast["type"], message: string) => {
    const id = Date.now(); setToasts(p => [...p, { id, type, message }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000)
  }

  const formatCurrency = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v)

  const { filteredData, stats } = useMemo(() => {
    const filtered = items.filter(it => it.nama.toLowerCase().includes(params.filter.toLowerCase()) || it.nip.includes(params.filter) || it.jabatan.toLowerCase().includes(params.filter.toLowerCase()))
    return {
      filteredData: filtered,
      stats: {
        total: items.length,
        gaji: items.reduce((s, it) => s + (it.gajiPokok || 0), 0)
      }
    }
  }, [items, params.filter])

  const paginated = filteredData.slice((params.page - 1) * 5, params.page * 5)
  const openModal = (mode: any, data: TupasItem | null = null) => { 
    setFormData(data || { bulan: "01", tahun: new Date().getFullYear().toString(), status: "Aktif" }); 
    setPopup({ open: true, mode, data }) 
  }

  // --- FIX START: Changed handleSave to accept submittedData ---
  const handleSave = (submittedData: any) => {
    // Gunakan submittedData, BUKAN formData
    if (!submittedData.nama || !submittedData.nip) return pushToast("error", "Nama dan NIP wajib diisi")
    
    // Hitung total otomatis dari submittedData
    const total = Number(submittedData.gajiPokok || 0) + Number(submittedData.tunjangan || 0) - Number(submittedData.potongan || 0)
    const payload = { ...submittedData, total } as TupasItem

    if (popup.mode === "add") {
      setItems(s => [{ ...payload, id: Date.now() }, ...s])
      pushToast("success", "Data berhasil ditambahkan")
    } else if (popup.mode === "edit") {
      setItems(s => s.map(x => x.id === popup.data?.id ? { ...payload, id: x.id } : x))
      pushToast("success", "Data berhasil diperbarui")
    }
    setPopup(p => ({ ...p, open: false }))
  }
  // --- FIX END ---

  const handleDelete = () => {
    setItems(s => s.filter(x => x.id !== popup.data?.id))
    pushToast("success", "Data berhasil dihapus")
    setPopup(p => ({ ...p, open: false }))
  }

  return (
    <MainLayout>
      <AlertNotification toasts={toasts} removeToast={(id) => setToasts(p => p.filter(t => t.id !== id))} />
      
      <GenericModal 
        isOpen={popup.open} mode={popup.mode} data={formData} fields={modalFields}
        title={{ add: "Tambah Data Tupas", edit: "Edit Data Tupas", view: "Detail Data Tupas", delete: "Hapus Data" }}
        onClose={() => setPopup(p => ({ ...p, open: false }))} onSubmit={handleSave} onDelete={handleDelete}
        deleteMessage={`Yakin ingin menghapus data ${popup.data?.nama}?`}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg"><TrendingUp className="w-8 h-8 text-white" /></div>
            <div><h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Data Tunjangan PAS</h1><p className="text-gray-600 text-sm mt-1">Kelola riwayat tunjangan pegawai</p></div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-3xl shadow-lg p-6 flex justify-between items-center"><div><p className="text-gray-600 text-sm font-medium mb-1">Total Data</p><p className="text-4xl font-bold text-blue-600">{stats.total}</p></div><div className="p-4 bg-blue-100 rounded-2xl"><TrendingUp className="w-8 h-8 text-blue-600" /></div></div>
            <div className="bg-white rounded-3xl shadow-lg p-6 flex justify-between items-center"><div><p className="text-gray-600 text-sm font-medium mb-1">Total Gaji Pokok</p><p className="text-2xl font-bold text-green-600">{formatCurrency(stats.gaji)}</p></div><div className="p-4 bg-green-100 rounded-2xl"><CheckCircle className="w-8 h-8 text-green-600" /></div></div>
            <div onClick={() => openModal("add")} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg p-6 cursor-pointer hover:scale-105 transition-all flex justify-between items-center"><div><p className="text-blue-100 text-sm font-medium mb-1">Tambah Data</p><p className="text-white text-lg font-semibold">Klik disini</p></div><div className="p-4 bg-white/20 rounded-2xl"><Plus className="w-8 h-8 text-white" /></div></div>
          </motion.div>

          {/* Main Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input value={params.filter} onChange={(e) => setParams(p => ({ ...p, filter: e.target.value, page: 1 }))} placeholder="Cari nama, NIP atau jabatan..." className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    {["Nama", "NIP", "Jabatan", "Golongan", "Gaji Pokok", "Tunjangan", "Potongan", "Total", "Status", "Periode", "Aksi"].map(h => <th key={h} className="p-4 text-left text-sm font-semibold text-gray-700">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginated.length > 0 ? paginated.map((it, idx) => (
                      <motion.tr key={it.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: idx * 0.05 }} className="border-b border-gray-100 hover:bg-blue-50/50">
                        <td className="p-4 font-medium text-gray-800">{it.nama}</td>
                        <td className="p-4 text-sm text-gray-700">{it.nip}</td>
                        <td className="p-4 text-sm text-gray-700">{it.jabatan}</td>
                        <td className="p-4 text-sm text-gray-700">{it.golongan}</td>
                        <td className="p-4 text-sm text-gray-700">{formatCurrency(it.gajiPokok)}</td>
                        <td className="p-4 text-sm text-gray-700">{formatCurrency(it.tunjangan)}</td>
                        <td className="p-4 text-sm text-gray-700">{formatCurrency(it.potongan)}</td>
                        <td className="p-4 text-sm font-bold text-green-600">{formatCurrency(it.total)}</td>
                        <td className="p-4"><span className={`px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${it.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{it.status === "Aktif" && <CheckCircle className="w-3 h-3" />}{it.status}</span></td>
                        <td className="p-4 text-sm text-gray-600">{it.bulan}/{it.tahun}</td>
                        <td className="p-4"><div className="flex gap-2">
                          <button onClick={() => openModal("view", it)} className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:scale-110"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => openModal("edit", it)} className="p-2 bg-amber-100 text-amber-600 rounded-xl hover:scale-110"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => openModal("delete", it)} className="p-2 bg-red-100 text-red-600 rounded-xl hover:scale-110"><Trash2 className="w-4 h-4" /></button>
                        </div></td>
                      </motion.tr>
                    )) : <tr><td colSpan={11} className="p-12 text-center text-gray-500">Tidak ada data ditemukan</td></tr>}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {filteredData.length > 0 && <Pagination currentPage={params.page} totalPages={Math.ceil(filteredData.length / 5)} totalItems={filteredData.length} startIndex={(params.page - 1) * 5} endIndex={Math.min(params.page * 5, filteredData.length)} onPageChange={p => setParams(prev => ({...prev, page: p}))} onPrevious={() => setParams(prev => ({...prev, page: prev.page - 1}))} onNext={() => setParams(prev => ({...prev, page: prev.page + 1}))} />}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}