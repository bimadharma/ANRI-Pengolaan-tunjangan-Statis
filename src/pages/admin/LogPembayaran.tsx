"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Eye, Edit2, Trash2, Users, Briefcase, DollarSign, Mail, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import MainLayout from "../../components/layout/MainLayout"
import AlertNotification, { type Toast } from "../../components/AlertNotification"
import GenericModal, { type ModalField } from "../../components/ModalPop"
import Pagination from "../../components/pagination"
import { Loader2 } from "lucide-react"
import { useEmployees } from "../../hooks/useEmployees"
import { sanitizeMoney, formatSalary } from "../../utils/salary"
import type { Employee } from "../../types/employee"

// Konfigurasi Fields untuk Modal
const modalFields: ModalField[] = [
  { name: "name", label: "Nama Lengkap", type: "text", required: true, placeholder: "Masukkan nama lengkap" },
  { name: "position", label: "Posisi", type: "text", required: true, placeholder: "Masukkan posisi" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "contoh@email.com" },
  { name: "status", label: "Status", type: "select", required: true, options: [
      { value: "Aktif", label: "Aktif" }, { value: "Cuti", label: "Cuti" }, { value: "Non-Aktif", label: "Non-Aktif" }
    ] 
  },
  { name: "salary", label: "Gaji", type: "text", required: true, placeholder: "8.000.000" },
  { name: "startDate", label: "Tanggal Masuk", type: "date", required: true },
]

type SortColumn = "name" | "position" | "email" | "salary"

export default function LogPembayaran() {
  const { employees, setEmployees, loading, error } = useEmployees()
  const [params, setParams] = useState({ filter: "", sortBy: "name" as SortColumn, sortDir: "asc" as "asc" | "desc", page: 1 })
  const [toasts, setToasts] = useState<Toast[]>([])
  
  // State Modal yang disederhanakan
  const [popup, setPopup] = useState<{ open: boolean; mode: "view" | "add" | "edit" | "delete"; data: Employee | null }>({ open: false, mode: "view", data: null })
  const [formData, setFormData] = useState<Partial<Employee>>({})

  // Helper Toast
  const pushToast = (type: Toast["type"], message?: string) => {
    const id = Date.now(); setToasts(p => [...p, { id, type, message }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 5000)
  }

  // Logic Filtering & Sorting (Memoized)
  const processedData = useMemo(() => {
    const q = params.filter.toLowerCase()
    return employees
      .filter(e => e.name.toLowerCase().includes(q) || e.position.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || formatSalary(e.salary).includes(q))
      .sort((a, b) => {
        let x: any = a[params.sortBy], y: any = b[params.sortBy]
        if (params.sortBy === "salary") { x = sanitizeMoney(a.salary); y = sanitizeMoney(b.salary) }
        else { x = x.toLowerCase(); y = y.toLowerCase() }
        return (params.sortDir === "asc" ? 1 : -1) * (x < y ? -1 : x > y ? 1 : 0)
      })
  }, [employees, params.filter, params.sortBy, params.sortDir])

  // Pagination Logic
  const itemsPerPage = 5
  const paginated = processedData.slice((params.page - 1) * itemsPerPage, params.page * itemsPerPage)
  const totalPages = Math.ceil(processedData.length / itemsPerPage)

  useEffect(() => setParams(p => ({ ...p, page: 1 })), [params.filter])
  useEffect(() => { if (error) pushToast("error", "Gagal memuat data") }, [error])

  // Handlers
  const handleSort = (col: SortColumn) => setParams(p => ({ ...p, sortBy: col, sortDir: p.sortBy === col && p.sortDir === "asc" ? "desc" : "asc" }))
  const openPopup = (mode: any, data: Employee | null = null) => { setFormData(data || {}); setPopup({ open: true, mode, data }) }
  
  const handleSubmit = (submittedData?: any) => {
    
    // 2. Validasi menggunakan data yang baru dikirim (submittedData), bukan formData lama
    if (!submittedData?.name || !submittedData?.position) {
      return pushToast("warning", "Data tidak lengkap");
    }
    
    if (popup.mode === "add") {
      // 3. Gunakan submittedData untuk menambah data
      setEmployees(prev => [
        ...prev, 
        { ...submittedData, id: Math.max(...prev.map(e => e.id), 0) + 1 } as Employee
      ]);
    } else if (popup.mode === "edit" && popup.data) {
      // 4. Gunakan submittedData untuk update data
      setEmployees(prev => 
        prev.map(e => e.id === popup.data!.id ? { ...e, ...submittedData } as Employee : e)
      );
    }
    
    pushToast("success"); 
    setPopup(p => ({ ...p, open: false }));
  }

  const handleDelete = () => {
    if (popup.data) {
      setEmployees(prev => prev.filter(e => e.id !== popup.data!.id))
      pushToast("success"); setPopup(p => ({ ...p, open: false }))
    }
  }

  const SortIcon = ({ col }: { col: SortColumn }) => params.sortBy !== col ? <ArrowUpDown className="w-4 h-4 text-gray-400" /> : params.sortDir === "asc" ? <ArrowUp className="w-4 h-4 text-blue-600" /> : <ArrowDown className="w-4 h-4 text-blue-600" />

  if (loading) return <MainLayout><div className="fixed inset-0 flex items-center justify-center bg-blue-50"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div></MainLayout>

  return (
    <MainLayout>
      <AlertNotification toasts={toasts} removeToast={(id) => setToasts(p => p.filter(t => t.id !== id))} />
      
      {/* Generic Modal Implementation */}
      <GenericModal 
        isOpen={popup.open}
        mode={popup.mode}
        title={{ view: "Detail Pegawai", add: "Tambah Pegawai", edit: "Edit Pegawai", delete: "Hapus Pegawai" }}
        data={formData}
        fields={modalFields}
        onClose={() => setPopup(p => ({ ...p, open: false }))}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        deleteMessage={`Apakah Anda yakin ingin menghapus pegawai ${popup.data?.name}?`}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg"><Users className="w-8 h-8 text-white" /></div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Log Pembayaran</h1>
              <p className="text-gray-600 text-sm mt-1">Kelola Log Pembayaran</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Table Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-9 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Cari data..." value={params.filter} onChange={e => setParams(p => ({ ...p, filter: e.target.value }))} className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none transition-all" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      {[
                        { key: "name", label: "Nama", icon: Users },
                        { key: "position", label: "Posisi", icon: Briefcase },
                        { key: "email", label: "Email", icon: Mail },
                        { key: "salary", label: "Nominal", icon: DollarSign }
                      ].map((h) => (
                        <th key={h.key} className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer select-none" onClick={() => handleSort(h.key as SortColumn)}>
                          <div className="flex items-center gap-2"><h.icon className="w-4 h-4" /> {h.label} <SortIcon col={h.key as SortColumn} /></div>
                        </th>
                      ))}
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {paginated.length > 0 ? paginated.map((emp, index) => (
                        <motion.tr key={emp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                          <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">{emp.name.charAt(0)}</div><span className="font-medium text-gray-800">{emp.name}</span></div></td>
                          <td className="p-4"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">{emp.position}</span></td>
                          <td className="p-4 text-sm text-gray-600">{emp.email}</td>
                          <td className="p-4"><span className="font-semibold text-green-600">Rp {formatSalary(emp.salary)}</span></td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button onClick={() => openPopup("view", emp)} className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:scale-110 transition-all"><Eye className="w-4 h-4" /></button>
                              <button onClick={() => openPopup("edit", emp)} className="p-2 bg-amber-100 text-amber-600 rounded-xl hover:scale-110 transition-all"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => openPopup("delete", emp)} className="p-2 bg-red-100 text-red-600 rounded-xl hover:scale-110 transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </motion.tr>
                      )) : (
                        <tr><td colSpan={5} className="p-12 text-center text-gray-500"><Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />Tidak ada data ditemukan</td></tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              {processedData.length > 0 && <Pagination currentPage={params.page} totalPages={totalPages} totalItems={processedData.length} startIndex={(params.page - 1) * itemsPerPage} endIndex={Math.min(params.page * itemsPerPage, processedData.length)} onPageChange={p => setParams(prev => ({...prev, page: p}))} onPrevious={() => setParams(prev => ({...prev, page: prev.page - 1}))} onNext={() => setParams(prev => ({...prev, page: prev.page + 1}))} />}
            </motion.div>

            {/* Sidebar Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-3 space-y-6">
              {[
                { label: "Total Pegawai", val: employees.length, icon: Users, color: "blue" },
                { label: "Total Nominal", val: `Rp ${new Intl.NumberFormat("id-ID").format(employees.reduce((sum, emp) => sum + sanitizeMoney(emp.salary), 0))}`, icon: TrendingUp, color: "green", sub: "Akumulasi gaji pegawai" }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start">
                    <div><p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p><p className={`text-${stat.color === 'green' ? '2xl' : '4xl'} font-bold text-${stat.color}-600`}>{stat.val}</p>{stat.sub && <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>}</div>
                    <div className={`p-4 bg-${stat.color}-100 rounded-2xl`}><stat.icon className={`w-8 h-8 text-${stat.color}-600`} /></div>
                  </div>
                </div>
              ))}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg p-6 hover:scale-105 transition-all cursor-pointer flex justify-between items-center" onClick={() => openPopup("add")}>
                <div><p className="text-blue-100 text-sm font-medium mb-1">Tambah Pegawai</p><p className="text-white text-lg font-semibold">Klik di sini</p></div>
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm"><Plus className="w-8 h-8 text-white" /></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}