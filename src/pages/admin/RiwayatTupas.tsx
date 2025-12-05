"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Eye, Edit2, Trash2, Users, Building2, ArrowUpDown, Mail, Briefcase, Hash, Filter, Check, ChevronDown, X } from "lucide-react"
import Pagination from "../../components/pagination"
import AlertNotification, { type Toast } from "../../components/AlertNotification"
import GenericModal, { type ModalField } from "../../components/ModalPop"

// --- Types & Configs ---
type Pegawai = { id?: number; nama: string; nip: string; jabatan: string; departemen: string; email: string }

const modalFields: ModalField[] = [
  { name: "nama", label: "Nama Lengkap", type: "text", required: true, placeholder: "Masukkan nama lengkap" },
  { name: "nip", label: "NIP", type: "text", required: true, placeholder: "Masukkan NIP" },
  { name: "jabatan", label: "Jabatan", type: "text", required: true, placeholder: "Masukkan jabatan" },
  { name: "departemen", label: "Departemen", type: "text", required: true, placeholder: "Masukkan departemen" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "contoh@email.com" },
]

export default function RiwayatTupas() {
  // --- State ---
  const [pegawai, setPegawai] = useState<Pegawai[]>([
    { id: 1, nama: "Ahmad Fauzi", nip: "198501012010011001", jabatan: "Kepala Bagian", departemen: "IT", email: "ahmad.fauzi@example.com" },
    { id: 2, nama: "Siti Nurhaliza", nip: "199203152015012002", jabatan: "Staff Administrasi", departemen: "HR", email: "siti.nurhaliza@example.com" },
    { id: 3, nama: "Budi Santoso", nip: "198709202012011003", jabatan: "Developer", departemen: "IT", email: "budi.santoso@example.com" },
    { id: 4, nama: "Dewi Lestari", nip: "199105102014012004", jabatan: "Manager", departemen: "Finance", email: "dewi.lestari@example.com" },
    { id: 5, nama: "Eko Prasetyo", nip: "198812252013011005", jabatan: "Supervisor", departemen: "Operations", email: "eko.prasetyo@example.com" },
    { id: 6, nama: "Fitri Handayani", nip: "199406182016012006", jabatan: "Analyst", departemen: "IT", email: "fitri.handayani@example.com" },
    { id: 7, nama: "Gunawan Wijaya", nip: "198603072011011007", jabatan: "Coordinator", departemen: "Marketing", email: "gunawan.wijaya@example.com" },
  ])
  
  // 1. UPDATE: departemen menjadi array string[] untuk multi-select
  const [params, setParams] = useState({ 
    filter: "", 
    departemen: [] as string[], 
    sort: null as keyof Pegawai | null, 
    order: "asc" as "asc" | "desc", 
    page: 1 
  })

  // State untuk toggle visibility dropdown filter
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [popup, setPopup] = useState<{ open: boolean; mode: "view" | "add" | "edit" | "delete"; data: Pegawai | null }>({ open: false, mode: "view", data: null })
  const [formData, setFormData] = useState<Partial<Pegawai>>({})
  const [toasts, setToasts] = useState<Toast[]>([])

  // --- Logic Helpers ---
  const pushToast = (type: Toast["type"], message: string) => {
    const id = Date.now(); setToasts(p => [...p, { id, type, message }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000)
  }

  const uniqueDepartemen = useMemo(() => {
    return Array.from(new Set(pegawai.map(p => p.departemen))).sort()
  }, [pegawai])

  // 2. UPDATE: Logika filtering array
  const processedData = useMemo(() => {
    const q = params.filter.toLowerCase()
    return pegawai
      .filter(p => {
        const matchesSearch = p.nama.toLowerCase().includes(q) || p.nip.includes(q)
        // Jika array kosong (tidak ada yg dicentang), anggap pilih semua. Jika ada isi, cek apakah termasuk.
        const matchesDept = params.departemen.length === 0 || params.departemen.includes(p.departemen)
        return matchesSearch && matchesDept
      })
      .sort((a, b) => {
        if (!params.sort) return 0
        const [xA, xB] = [a[params.sort], b[params.sort]]
        const val = params.sort === "nip" ? Number(xA) - Number(xB) : String(xA).localeCompare(String(xB))
        return (params.order === "asc" ? 1 : -1) * val
      })
  }, [pegawai, params.filter, params.departemen, params.sort, params.order])

  const paginated = processedData.slice((params.page - 1) * 5, params.page * 5)
  const handleSort = (key: keyof Pegawai) => setParams(p => ({ ...p, sort: key, order: p.sort === key && p.order === "asc" ? "desc" : "asc" }))
  const openModal = (mode: any, data: Pegawai | null = null) => { setFormData(data || {}); setPopup({ open: true, mode, data }) }

  // 3. NEW: Handler untuk checkbox toggle
  const toggleDepartemen = (dept: string) => {
    setParams(prev => {
      const isSelected = prev.departemen.includes(dept)
      const newDepts = isSelected
        ? prev.departemen.filter(d => d !== dept) // Hapus jika sudah ada
        : [...prev.departemen, dept] // Tambah jika belum ada
      return { ...prev, departemen: newDepts, page: 1 }
    })
  }

  // --- Actions ---
  const handleSubmit = (submittedData?: any) => {
    if (!submittedData?.nama?.trim() || !submittedData?.nip?.trim()) {
      return pushToast("error", "Nama dan NIP wajib diisi!")
    }
    if (popup.mode === "add") {
      setPegawai(p => [...p, { ...submittedData, id: Date.now() } as Pegawai])
      pushToast("success", "Pegawai berhasil ditambahkan")
    } else if (popup.mode === "edit") {
      setPegawai(p => p.map(item => item.id === popup.data?.id ? { ...item, ...submittedData } as Pegawai : item))
      pushToast("success", "Data pegawai diperbarui")
    }
    setPopup(p => ({ ...p, open: false }))
  }

  const handleDelete = () => {
    setPegawai(p => p.filter(item => item.id !== popup.data?.id))
    pushToast("success", "Pegawai berhasil dihapus")
    setPopup(p => ({ ...p, open: false }))
  }

  const columns = [
    { key: "nama", label: "Nama", icon: Users }, { key: "nip", label: "NIP", icon: Hash },
    { key: "jabatan", label: "Jabatan", icon: Briefcase }, { key: "departemen", label: "Departemen", icon: Building2 },
    { key: "email", label: "Email", icon: Mail }
  ] as const

  return (
    <>
      <AlertNotification toasts={toasts} removeToast={(id) => setToasts(p => p.filter(t => t.id !== id))} />
      
      <GenericModal
        isOpen={popup.open}
        mode={popup.mode}
        title={{ view: "Detail Pegawai", add: "Tambah Pegawai", edit: "Edit Pegawai", delete: "Hapus Pegawai" }}
        data={formData}
        fields={modalFields}
        onClose={() => setPopup(p => ({ ...p, open: false }))}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        deleteMessage={`Apakah Anda yakin ingin menghapus pegawai ${popup.data?.nama}?`}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header & Stats Cards */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg"><Users className="w-8 h-8 text-white" /></div>
            <div><h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Riwayat Tupas</h1><p className="text-gray-600 text-sm mt-1">Kelola Riwayat secara lengkap</p></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow flex justify-between items-center"><div><p className="text-gray-600 text-sm font-medium mb-1">Total Pegawai</p><p className="text-4xl font-bold text-blue-600">{pegawai.length}</p></div><div className="p-4 bg-blue-100 rounded-2xl"><Users className="w-8 h-8 text-blue-600" /></div></div>
            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow flex justify-between items-center"><div><p className="text-gray-600 text-sm font-medium mb-1">Total Departemen</p><p className="text-4xl font-bold text-blue-600">{uniqueDepartemen.length}</p></div><div className="p-4 bg-blue-100 rounded-2xl"><Building2 className="w-8 h-8 text-blue-600" /></div></div>
            <div onClick={() => openModal("add")} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer flex justify-between items-center"><div><p className="text-blue-100 text-sm font-medium mb-1">Tambah Pegawai</p><p className="text-white text-lg font-semibold">Klik untuk menambah</p></div><div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm"><Plus className="w-8 h-8 text-white" /></div></div>
          </motion.div>

          {/* Table Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-visible"> 
            {/* Note: overflow-visible agar dropdown tidak terpotong */}
            
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col md:flex-row gap-4">
              
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Cari nama atau NIP..." 
                  value={params.filter} 
                  onChange={e => setParams(p => ({ ...p, filter: e.target.value, page: 1 }))} 
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none transition-all bg-white" 
                />
              </div>

              {/* 4. UPDATE: Custom Checkbox Dropdown */}
              <div className="relative md:w-72">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-2xl transition-all bg-white ${isFilterOpen ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <div className="flex items-center gap-2 text-gray-700">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="truncate">
                      {params.departemen.length === 0 
                        ? "Semua Departemen" 
                        : `${params.departemen.length} Dipilih`}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                      <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter Departemen</span>
                        {params.departemen.length > 0 && (
                          <button onClick={() => setParams(p => ({...p, departemen: [], page: 1}))} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                            <X className="w-3 h-3" /> Reset
                          </button>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                        {uniqueDepartemen.map(dept => {
                          const isSelected = params.departemen.includes(dept)
                          return (
                            <div 
                              key={dept}
                              onClick={() => toggleDepartemen(dept)}
                              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'}`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="font-medium">{dept}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    {columns.map(c => (
                      <th key={c.key} className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none" onClick={() => handleSort(c.key as keyof Pegawai)}>
                        <div className="flex items-center gap-2"><c.icon className="w-4 h-4" /> {c.label} {params.sort === c.key ? <span className="text-blue-600">{params.order === "asc" ? "↑" : "↓"}</span> : <ArrowUpDown className="w-4 h-4 text-gray-400" />}</div>
                      </th>
                    ))}
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginated.length > 0 ? paginated.map((p, i) => (
                      <motion.tr key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                        <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">{p.nama.charAt(0)}</div><span className="font-medium text-gray-800">{p.nama}</span></div></td>
                        <td className="p-4"><span className="font-mono text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">{p.nip}</span></td>
                        <td className="p-4"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">{p.jabatan}</span></td>
                        <td className="p-4"><span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium">{p.departemen}</span></td>
                        <td className="p-4 text-sm text-gray-600">{p.email}</td>
                        <td className="p-4"><div className="flex gap-2">
                          <button onClick={() => openModal("view", p)} className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:scale-110 transition-all"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => openModal("edit", p)} className="p-2 bg-amber-100 text-amber-600 rounded-xl hover:scale-110 transition-all"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => openModal("delete", p)} className="p-2 bg-red-100 text-red-600 rounded-xl hover:scale-110 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div></td>
                      </motion.tr>
                    )) : <tr><td colSpan={6} className="p-12 text-center text-gray-500">Tidak ada data pegawai yang cocok</td></tr>}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {processedData.length > 0 && <Pagination currentPage={params.page} totalPages={Math.ceil(processedData.length / 5)} totalItems={processedData.length} startIndex={(params.page - 1) * 5} endIndex={Math.min(params.page * 5, processedData.length)} onPageChange={p => setParams(prev => ({ ...prev, page: p }))} onPrevious={() => setParams(prev => ({ ...prev, page: prev.page - 1 }))} onNext={() => setParams(prev => ({ ...prev, page: prev.page + 1 }))} />}
          </motion.div>
        </div>
      </div>
    </>
  )
}