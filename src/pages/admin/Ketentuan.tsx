"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, Plus, Edit2, Trash2, Eye, Briefcase, Building2, BookOpen, TrendingUp,
  Filter, ArrowUpDown, Check
} from "lucide-react"

import Pagination from "../../components/pagination"
import AlertNotification, { type Toast } from "../../components/AlertNotification"
import GenericModal, { type ModalField } from "../../components/ModalPop"

// --- TIPE DATA ---

interface UnitItem {
  id: number
  kode: string
  nama_unit: string
  lokasi: string
}

interface JabatanItem {
  id: number
  nama_jabatan: string
  grade: number
}

interface KetentuanItem {
  id: number
  jabatan_id: number
  jabatan_nama: string
  masa_kerja_min: number
  paragraf_ketentuan: string
  nominal: number
}

// --- DUMMY DATA ---
const INITIAL_UNITS: UnitItem[] = [
  { id: 1, kode: "UK-001", nama_unit: "Pusat Pengolahan Arsip", lokasi: "Gedung A" },
  { id: 2, kode: "UK-002", nama_unit: "Sekretariat Utama", lokasi: "Gedung B" },
]

const INITIAL_POSITIONS: JabatanItem[] = [
  { id: 1, nama_jabatan: "Arsiparis Ahli Pertama", grade: 8 },
  { id: 2, nama_jabatan: "Arsiparis Ahli Muda", grade: 9 },
  { id: 3, nama_jabatan: "Arsiparis Ahli Madya", grade: 11 },
]

const INITIAL_RULES: KetentuanItem[] = [
  { id: 1, jabatan_id: 1, jabatan_nama: "Arsiparis Ahli Pertama", masa_kerja_min: 2, paragraf_ketentuan: "Pasal 5 Ayat 1 (Masa kerja minimal terpenuhi)", nominal: 5400000 },
  { id: 2, jabatan_id: 3, jabatan_nama: "Arsiparis Ahli Madya", masa_kerja_min: 10, paragraf_ketentuan: "Pasal 7 Ayat 2 (Keahlian khusus)", nominal: 8500000 },
]

export default function PengaturanDataPage() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<"unit" | "jabatan" | "ketentuan">("ketentuan")
  
  // Data State
  const [units, setUnits] = useState<UnitItem[]>(INITIAL_UNITS)
  const [positions, setPositions] = useState<JabatanItem[]>(INITIAL_POSITIONS)
  const [rules, setRules] = useState<KetentuanItem[]>(INITIAL_RULES)

  // UI State
  const [search, setSearch] = useState("")
  const [filterColumn, setFilterColumn] = useState<string>("") 
  const [filterValue, setFilterValue] = useState("")           
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [popup, setPopup] = useState<{ open: boolean; mode: "view" | "add" | "edit" | "delete"; data: any | null }>({ 
    open: false, mode: "add", data: null 
  })
  const [toasts, setToasts] = useState<Toast[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" }>({ key: null, direction: "asc" })

  const itemsPerPage = 5

  // --- HELPERS ---
  const addToast = (type: Toast["type"], message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
    return id
  }

  const formatRupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  // --- CONFIGURATION ---
  
  // 1. Modal Fields Configuration
  const modalFields: ModalField[] = useMemo(() => {
    switch (activeTab) {
      case "unit":
        return [
          { name: "kode", label: "Kode Unit", type: "text", required: true, placeholder: "Contoh: UK-001" },
          { name: "nama_unit", label: "Nama Unit", type: "text", required: true, placeholder: "Nama Unit Kerja" },
          { name: "lokasi", label: "Lokasi", type: "text", required: true, placeholder: "Gedung/Lantai" },
        ]
      case "jabatan":
        return [
          { name: "nama_jabatan", label: "Nama Jabatan", type: "text", required: true, placeholder: "Contoh: Arsiparis Ahli Muda" },
          { name: "grade", label: "Grade/Kelas", type: "number", required: true, placeholder: "8" },
        ]
      case "ketentuan":
        return [
          { 
            name: "jabatan_id", 
            label: "Pilih Jabatan", 
            type: "select", 
            required: true, 
            options: positions.map(p => ({ label: p.nama_jabatan, value: String(p.id) })) 
          },
          { name: "masa_kerja_min", label: "Masa Kerja Min (Tahun)", type: "number", required: true, placeholder: "0" },
          { name: "nominal", label: "Nominal Tunjangan", type: "number", required: true, placeholder: "Rp..." },
          { name: "paragraf_ketentuan", label: "Paragraf Penjelasan", type: "textarea", required: true, placeholder: "Sesuai Pasal..." },
        ]
      default: 
        return []
    }
  }, [activeTab, positions])

  // 2. Table Headers Configuration
  const columnDefs = useMemo(() => {
    switch (activeTab) {
      case "unit": return [
        { key: "kode", label: "Kode" },
        { key: "nama_unit", label: "Nama Unit" },
        { key: "lokasi", label: "Lokasi" },
      ]
      case "jabatan": return [
        { key: "nama_jabatan", label: "Nama Jabatan" },
        { key: "grade", label: "Grade" },
      ]
      case "ketentuan": return [
        { key: "jabatan_nama", label: "Jabatan (Ref)" },
        { key: "masa_kerja_min", label: "Masa Kerja Min" },
        { key: "paragraf_ketentuan", label: "Paragraf Penjelasan" },
        { key: "nominal", label: "Nominal" },
      ]
      default: return []
    }
  }, [activeTab])

  useEffect(() => {
    if (columnDefs.length) {
      setFilterColumn(columnDefs[0].key)
      setFilterValue("")
    }
    setSelectedFilters([]) 
    setSortConfig({ key: null, direction: "asc" })
  }, [activeTab, columnDefs])

  // Helper: available filter options per tab
  const filterOptions = useMemo(() => {
    if (activeTab === "ketentuan") {
      return Array.from(new Set(rules.map(r => r.jabatan_nama))).sort()
    }
    if (activeTab === "unit") {
      return Array.from(new Set(units.map(u => u.lokasi))).sort()
    }
    return Array.from(new Set(positions.map(p => String(p.grade)))).sort((a, b) => Number(a) - Number(b))
  }, [activeTab, rules, units, positions])

  const toggleFilterValue = (val: string) => {
    setSelectedFilters(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    )
  }

  // --- LOGIC ---

  // Filtering - PERBAIKAN: Menggunakan explicit type casting <any[]> untuk menghindari konflik union type
  const filteredData = useMemo<any[]>(() => {
    const s = search.toLowerCase()
    let base: any[] = []

    if (activeTab === "unit") {
        base = units.filter(i => i.nama_unit.toLowerCase().includes(s) || i.kode.toLowerCase().includes(s))
    } else if (activeTab === "jabatan") {
        base = positions.filter(i => i.nama_jabatan.toLowerCase().includes(s))
    } else {
        base = rules.filter(i => i.jabatan_nama.toLowerCase().includes(s) || i.paragraf_ketentuan.toLowerCase().includes(s))
    }

    if (selectedFilters.length > 0) {
      const key = activeTab === "unit" ? "lokasi" : activeTab === "jabatan" ? "grade" : "jabatan_nama"
      base = base.filter((item: any) => selectedFilters.includes(String(item[key])))
    }
    return base
  }, [activeTab, units, positions, rules, search, selectedFilters])

  // Sorting - PERBAIKAN: Menggunakan explicit type casting <any[]>
  const sortedData = useMemo<any[]>(() => {
    if (!sortConfig.key) return filteredData
    const dir = sortConfig.direction === "asc" ? 1 : -1
    return [...filteredData].sort((a: any, b: any) => {
      const va = a[sortConfig.key!]
      const vb = b[sortConfig.key!]
      if (va == null || vb == null) return 0
      if (!isNaN(Number(va)) && !isNaN(Number(vb))) return (Number(va) - Number(vb)) * dir
      return String(va).localeCompare(String(vb)) * dir
    })
  }, [filteredData, sortConfig])

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const toggleSort = (key: string) => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    )
  }

  // CRUD Operations
  const handleSubmit = (formData: any) => {
    if (popup.mode === 'view') {
        setPopup({ ...popup, open: false })
        return
    }

    const loadId = addToast("loading", "Menyimpan data...")
    
    setTimeout(() => {
      setToasts(p => p.filter(t => t.id !== loadId))
      
      const isAdd = popup.mode === "add"
      const id = isAdd ? Date.now() : popup.data.id
      
      const processedData = { ...formData }
      if (processedData.grade) processedData.grade = parseInt(processedData.grade)
      if (processedData.jabatan_id) processedData.jabatan_id = parseInt(processedData.jabatan_id)
      if (processedData.masa_kerja_min) processedData.masa_kerja_min = parseInt(processedData.masa_kerja_min)
      if (processedData.nominal) processedData.nominal = parseInt(processedData.nominal)

      if (activeTab === "unit") {
        if (isAdd) setUnits(p => [...p, { ...processedData, id }])
        else setUnits(p => p.map(i => i.id === id ? { ...processedData, id } : i))
      } 
      else if (activeTab === "jabatan") {
        if (isAdd) setPositions(p => [...p, { ...processedData, id }])
        else setPositions(p => p.map(i => i.id === id ? { ...processedData, id } : i))
      } 
      else if (activeTab === "ketentuan") {
        const selectedJob = positions.find(p => p.id === processedData.jabatan_id)
        const finalData = { ...processedData, id, jabatan_nama: selectedJob?.nama_jabatan || "-" }

        if (isAdd) setRules(p => [...p, finalData])
        else setRules(p => p.map(i => i.id === id ? finalData : i))
      }

      addToast("success", `Data berhasil ${isAdd ? 'ditambahkan' : 'diperbarui'}`)
      setPopup({ ...popup, open: false })
    }, 500)
  }

  const handleDelete = () => {
    const id = popup.data.id
    if (activeTab === "unit") setUnits(p => p.filter(i => i.id !== id))
    else if (activeTab === "jabatan") setPositions(p => p.filter(i => i.id !== id))
    else setRules(p => p.filter(i => i.id !== id))
    
    addToast("success", "Data berhasil dihapus")
    setPopup({ ...popup, open: false })
  }

  return (
    <>
      <AlertNotification toasts={toasts} removeToast={(id) => setToasts(p => p.filter(t => t.id !== id))} />

      <GenericModal 
        isOpen={popup.open}
        mode={popup.mode}
        title={{
          view: "Detail Data",
          add: `Tambah Data ${activeTab === 'unit' ? 'Unit' : activeTab === 'jabatan' ? 'Jabatan' : 'Ketentuan'}`,
          edit: "Edit Data",
          delete: "Hapus Data"
        }}
        fields={modalFields}
        data={popup.data}
        onClose={() => setPopup({ ...popup, open: false })}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        deleteMessage="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg"><TrendingUp className="w-8 h-8 text-white" /></div>
            <div><h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Data Tunjangan PAS</h1><p className="text-gray-600 text-sm mt-1">Kelola riwayat tunjangan pegawai</p></div>
          </motion.div>

          <div className="flex flex-wrap gap-4 mb-6">
            {[
              { id: "ketentuan", label: "Ketentuan Tunjangan", icon: BookOpen },
              { id: "unit", label: "Master Unit Kerja", icon: Building2 },
              { id: "jabatan", label: "Master Jabatan", icon: Briefcase },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSearch(""); setFilterValue(""); setCurrentPage(1) }}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
                  activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105" 
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4 bg-gray-50/50">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Cari di ${activeTab}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(o => !o)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                  >
                    <Filter className="w-4 h-4" /> Filter
                    {selectedFilters.length > 0 && (
                      <span className="ml-1 text-xs text-blue-600">({selectedFilters.length})</span>
                    )}
                  </button>
                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-3 z-20">
                      <p className="text-xs text-gray-500">
                        {activeTab === "ketentuan" && "Filter Jabatan"}
                        {activeTab === "unit" && "Filter Lokasi"}
                        {activeTab === "jabatan" && "Filter Grade"}
                      </p>
                      <div className="max-h-56 overflow-y-auto space-y-2">
                        {filterOptions.length === 0 && (
                          <p className="text-sm text-gray-400">Tidak ada opsi filter.</p>
                        )}
                        {filterOptions.map((opt) => {
                          const checked = selectedFilters.includes(opt)
                          return (
                            <button
                              key={opt}
                              onClick={() => toggleFilterValue(opt)}
                              className="w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg hover:bg-gray-50"
                            >
                              <span className="text-gray-800">{opt}</span>
                              <span
                                className={`w-5 h-5 flex items-center justify-center rounded border ${
                                  checked ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300 text-transparent"
                                }`}
                              >
                                <Check className="w-4 h-4" />
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => setSelectedFilters([])}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Reset filter
                        </button>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setPopup({ open: true, mode: "add", data: null })}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md shadow-blue-100"
                >
                  <Plus className="w-5 h-5" /> Tambah Data
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <tr>
                    {columnDefs.map((col) => (
                      <th key={col.key} className="p-5 text-left">
                        <button
                          className="inline-flex items-center gap-1 font-semibold"
                          onClick={() => toggleSort(col.key)}
                        >
                          {col.label}
                          <ArrowUpDown className="w-4 h-4 text-gray-400" />
                          {sortConfig.key === col.key && (
                            <span className="text-[10px] text-blue-600">{sortConfig.direction}</span>
                          )}
                        </button>
                      </th>
                    ))}
                    <th className="p-5 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence mode="wait">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item: any) => (
                        <motion.tr 
                          key={item.id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="hover:bg-blue-50/30 transition-colors"
                        >
                          {activeTab === "unit" && (
                            <>
                              <td className="p-5 font-mono text-sm text-blue-600 bg-blue-50/30 w-32 rounded-r-xl">{item.kode}</td>
                              <td className="p-5 font-medium text-gray-800">{item.nama_unit}</td>
                              <td className="p-5 text-gray-600">{item.lokasi}</td>
                            </>
                          )}
                          {activeTab === "jabatan" && (
                            <>
                              <td className="p-5 font-medium text-gray-800">{item.nama_jabatan}</td>
                              <td className="p-5"><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-bold text-xs">Grade {item.grade}</span></td>
                            </>
                          )}
                          {activeTab === "ketentuan" && (
                            <>
                              <td className="p-5 font-medium text-gray-800">{item.jabatan_nama}</td>
                              <td className="p-5"><span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">{item.masa_kerja_min} Tahun</span></td>
                              <td className="p-5 text-gray-600 text-sm italic max-w-xs truncate">{item.paragraf_ketentuan}</td>
                              <td className="p-5 font-bold text-green-600">{formatRupiah(item.nominal)}</td>
                            </>
                          )}
                          
                          {/* ACTION BUTTONS */}
                          <td className="p-5">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => setPopup({ open: true, mode: "view", data: item })} 
                                className="p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg"
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4"/>
                              </button>

                              <button 
                                onClick={() => setPopup({ open: true, mode: "edit", data: item })} 
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4"/>
                              </button>
                              
                              <button 
                                onClick={() => setPopup({ open: true, mode: "delete", data: item })} 
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4"/>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr><td colSpan={columnDefs.length + 1} className="p-12 text-center text-gray-400">Tidak ada data ditemukan.</td></tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {sortedData.length > 0 && (
              <Pagination 
                currentPage={currentPage} totalPages={totalPages} totalItems={sortedData.length}
                startIndex={(currentPage-1)*itemsPerPage} endIndex={Math.min(currentPage*itemsPerPage, sortedData.length)}
                onPageChange={setCurrentPage} onPrevious={()=>setCurrentPage(c=>c-1)} onNext={()=>setCurrentPage(c=>c+1)}
              />
            )}
          </motion.div>
        </div>
      </div>
    </>
  )
}