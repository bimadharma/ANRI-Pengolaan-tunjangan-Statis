"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Eye, Edit2, Trash2, X, Building2, CheckCircle, Filter, ArrowUpDown } from "lucide-react"
import MainLayout from "../../components/layout/MainLayout"
import Pagination from "../../components/pagination"

interface UnitKerja {
  id: number
  nama_unit_kerja: string
  eselon: string
  kode_unit: string
}

interface PopupState {
  open: boolean
  mode: string
  data: UnitKerja | null
}

interface FormData {
  nama_unit_kerja: string
  eselon: string
  kode_unit: string
}

type SortKey = keyof UnitKerja
type SortOrder = "asc" | "desc"

export default function DataPembayaran() {
  const [unitKerja, setUnitKerja] = useState<UnitKerja[]>([
    { id: 1, nama_unit_kerja: "Sekretariat Utama", eselon: "Eselon I", kode_unit: "SU-01" },
    { id: 2, nama_unit_kerja: "Pusat Pengolahan Arsip", eselon: "Eselon II", kode_unit: "PPA-02" },
    { id: 3, nama_unit_kerja: "Bidang Layanan Arsip", eselon: "Eselon III", kode_unit: "BLA-05" },
    { id: 4, nama_unit_kerja: "Divisi Teknologi Informasi", eselon: "Eselon II", kode_unit: "DTI-03" },
    { id: 5, nama_unit_kerja: "Bagian Keuangan", eselon: "Eselon III", kode_unit: "BK-06" },
    { id: 6, nama_unit_kerja: "Sub Bagian SDM", eselon: "Eselon IV", kode_unit: "SBSDM-07" },
    { id: 7, nama_unit_kerja: "Pusat Data dan Informasi", eselon: "Eselon II", kode_unit: "PDI-08" },
  ])

  const [search, setSearch] = useState<string>("")
  const [filterEselon, setFilterEselon] = useState<string>("")
  const [sortKey, setSortKey] = useState<SortKey>("id")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [popup, setPopup] = useState<PopupState>({ open: false, mode: "", data: null })
  const [formData, setFormData] = useState<FormData>({
    nama_unit_kerja: "",
    eselon: "",
    kode_unit: "",
  })

  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 5

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const filteredData = unitKerja
    .filter((u) => {
      const matchesSearch =
        u.nama_unit_kerja.toLowerCase().includes(search.toLowerCase()) ||
        u.kode_unit.toLowerCase().includes(search.toLowerCase())
      const matchesEselon = filterEselon ? u.eselon === filterEselon : true
      return matchesSearch && matchesEselon
    })
    .sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : bValue > aValue ? 1 : -1
    })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterEselon])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const openPopup = (mode: string, data: UnitKerja | null = null) => {
    setFormData(
      data || {
        nama_unit_kerja: "",
        eselon: "",
        kode_unit: "",
      },
    )
    setPopup({ open: true, mode, data })
  }

  const closePopup = () => {
    setPopup({ open: false, mode: "", data: null })
    setFormData({ nama_unit_kerja: "", eselon: "", kode_unit: "" })
  }

  const handleSubmit = () => {
    if (!formData.nama_unit_kerja.trim()) {
      alert("Nama Data Pembayaran harus diisi!")
      return
    }
    if (!formData.eselon) {
      alert("Eselon harus dipilih!")
      return
    }
    if (!formData.kode_unit.trim()) {
      alert("Kode Unit harus diisi!")
      return
    }

    if (popup.mode === "add") {
      setUnitKerja([...unitKerja, { id: Date.now(), ...formData }])
    } else if (popup.mode === "edit" && popup.data) {
      setUnitKerja(unitKerja.map((u) => (u.id === popup.data?.id ? { ...u, ...formData } : u)))
    }
    closePopup()
  }

  const handleDelete = (id: number) => {
    setUnitKerja(unitKerja.filter((u) => u.id !== id))
    closePopup()
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const getEselonColor = (eselon: string) => {
    switch (eselon) {
      case "Eselon I":
        return "bg-red-100 text-red-700 border-red-200"
      case "Eselon II":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "Eselon III":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Eselon IV":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-blue-100 text-blue-700 border-blue-200"
    }
  }

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />
    }
    return sortOrder === "asc" ? <span className="text-blue-600">↑</span> : <span className="text-blue-600">↓</span>
  }

  return (
    <MainLayout isAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Data Pembayaran
                </h1>
                <p className="text-gray-600 text-sm mt-1">Kelola data Data Pembayaran dan eselon</p>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Data Pembayaran</p>
                  <p className="text-4xl font-bold text-blue-600">{unitKerja.length}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-2xl">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Data Ditampilkan</p>
                  <p className="text-4xl font-bold text-blue-600">{filteredData.length}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-2xl">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
              onClick={() => openPopup("add")}
            >
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Tambah Data Pembayaran</p>
                  <p className="text-white text-lg font-semibold">Klik untuk menambah</p>
                </div>
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Plus className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Search & Filter Bar */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama atau kode unit..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all bg-white appearance-none"
                    value={filterEselon}
                    onChange={(e) => setFilterEselon(e.target.value)}
                  >
                    <option value="">Semua Eselon</option>
                    <option value="Eselon I">Eselon I</option>
                    <option value="Eselon II">Eselon II</option>
                    <option value="Eselon III">Eselon III</option>
                    <option value="Eselon IV">Eselon IV</option>
                    <option value="Non-Eselon">Non-Eselon</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center gap-2">
                        ID <SortIcon column="id" />
                      </div>
                    </th>
                    <th
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("nama_unit_kerja")}
                    >
                      <div className="flex items-center gap-2">
                        Nama Data Pembayaran <SortIcon column="nama_unit_kerja" />
                      </div>
                    </th>
                    <th
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("eselon")}
                    >
                      <div className="flex items-center gap-2">
                        Eselon <SortIcon column="eselon" />
                      </div>
                    </th>
                    <th
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("kode_unit")}
                    >
                      <div className="flex items-center gap-2">
                        Kode Unit <SortIcon column="kode_unit" />
                      </div>
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((u, index) => (
                        <motion.tr
                          key={u.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                        >
                          <td className="p-4">
                            <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                              {u.id}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-gray-800">{u.nama_unit_kerja}</td>
                          <td className="p-4">
                            <span
                              className={`px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 border ${getEselonColor(u.eselon)}`}
                            >
                              {u.eselon}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-sm text-gray-700 bg-blue-50 px-3 py-1 rounded-lg">
                              {u.kode_unit}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openPopup("view", u)}
                                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-all hover:scale-110"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openPopup("edit", u)}
                                className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-600 rounded-xl transition-all hover:scale-110"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openPopup("delete", u)}
                                className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all hover:scale-110"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <Building2 className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Tidak ada data Data Pembayaran</p>
                            <p className="text-gray-400 text-sm">Coba ubah filter pencarian Anda</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredData.length}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={handlePageChange}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            )}
          </motion.div>

          {/* Modal Popup */}
          <AnimatePresence>
            {popup.open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={closePopup}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* VIEW MODE */}
                  {popup.mode === "view" && popup.data && (
                    <>
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                              <Eye className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Detail Data Pembayaran</h2>
                          </div>
                          <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-gray-500 mb-1">ID</p>
                          <p className="text-lg font-semibold text-gray-800">{popup.data.id}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Nama Data Pembayaran</p>
                          <p className="text-lg font-semibold text-gray-800">{popup.data.nama_unit_kerja}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Eselon</p>
                          <p className="text-gray-700">{popup.data.eselon}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Kode Unit</p>
                          <p className="font-mono font-semibold text-gray-800">{popup.data.kode_unit}</p>
                        </div>
                        <button
                          onClick={closePopup}
                          className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-2xl font-medium transition-colors mt-2"
                        >
                          Tutup
                        </button>
                      </div>
                    </>
                  )}

                  {/* ADD & EDIT MODE */}
                  {(popup.mode === "add" || popup.mode === "edit") && (
                    <>
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                              {popup.mode === "add" ? <Plus className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}
                            </div>
                            <h2 className="text-2xl font-bold">
                              {popup.mode === "add" ? "Tambah Data Pembayaran" : "Edit Data Pembayaran"}
                            </h2>
                          </div>
                          <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Data Pembayaran <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                            placeholder="Masukkan nama Data Pembayaran"
                            value={formData.nama_unit_kerja}
                            onChange={(e) => handleInputChange("nama_unit_kerja", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Eselon <span className="text-red-500">*</span>
                          </label>
                          <select
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                            value={formData.eselon}
                            onChange={(e) => handleInputChange("eselon", e.target.value)}
                          >
                            <option value="">Pilih Eselon</option>
                            <option value="Eselon I">Eselon I</option>
                            <option value="Eselon II">Eselon II</option>
                            <option value="Eselon III">Eselon III</option>
                            <option value="Eselon IV">Eselon IV</option>
                            <option value="Non-Eselon">Non-Eselon</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kode Unit <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                            placeholder="SU-01"
                            value={formData.kode_unit}
                            onChange={(e) => handleInputChange("kode_unit", e.target.value)}
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={handleSubmit}
                            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-medium transition-all hover:shadow-lg"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={closePopup}
                            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-medium transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* DELETE MODE */}
                  {popup.mode === "delete" && popup.data && (
                    <>
                      <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                              <Trash2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Hapus Data Pembayaran</h2>
                          </div>
                          <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                          <p className="text-gray-700 text-center">
                            Apakah Anda yakin ingin menghapus Data Pembayaran{" "}
                            <span className="font-bold text-red-600">{popup.data.nama_unit_kerja}</span>?
                          </p>
                          <p className="text-gray-500 text-sm text-center mt-2">Tindakan ini tidak dapat dibatalkan</p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleDelete(popup.data!.id)}
                            className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-2xl font-medium transition-all hover:shadow-lg"
                          >
                            Ya, Hapus
                          </button>
                          <button
                            onClick={closePopup}
                            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-medium transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  )
}