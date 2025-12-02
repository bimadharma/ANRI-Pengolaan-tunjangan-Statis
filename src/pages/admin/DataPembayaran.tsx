"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Eye, Edit2, Trash2, DollarSign, CheckCircle, Filter, ArrowUpDown } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import AlertNotification, { type Toast } from "../../components/AlertNotification";
import GenericModal, { type ModalField } from "../../components/ModalPop";
import Pagination from "../../components/pagination";

// --- Types & Constants ---
interface Tunjangan {
  id: number;
  nama_pegawai: string;
  nip: string;
  jabatan: string;
  grade: string;
  unit_kerja: string;
  nominal_tunjangan: number;
  bulan_pembayaran: string;
  tahun_pembayaran: string;
  status_pembayaran: string;
}
type PopupMode = "view" | "add" | "edit" | "delete";

const modalFields: ModalField[] = [
  { name: "nama_pegawai", label: "Nama Pegawai", type: "text", required: true, placeholder: "Nama pegawai" },
  { name: "nip", label: "NIP", type: "text", required: true, placeholder: "1985..." },
  { name: "jabatan", label: "Jabatan", type: "select", required: true, options: ["Kepala Bidang", "Kepala Sub Bagian", "Staff Pelaksana", "Staff Administrasi"].map((v) => ({ value: v, label: v })) },
  { name: "grade", label: "Grade", type: "select", required: true, options: [12, 11, 10, 9, 8, 7].map((v) => ({ value: `Grade ${v}`, label: `Grade ${v}` })) },
  { name: "unit_kerja", label: "Unit Kerja", type: "select", required: true, options: ["Sekretariat Utama", "Pusat Pengolahan Arsip", "Bidang Layanan Arsip", "Divisi Teknologi Informasi"].map((v) => ({ value: v, label: v })) },
  { name: "nominal_tunjangan", label: "Nominal", type: "number", required: true, placeholder: "5000000" },
  {
    name: "bulan_pembayaran",
    label: "Bulan",
    type: "select",
    required: true,
    options: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((v) => ({ value: v, label: v })),
  },
  { name: "tahun_pembayaran", label: "Tahun", type: "text", required: true, placeholder: "2024" },
  { name: "status_pembayaran", label: "Status", type: "select", required: true, options: ["Belum Dibayar", "Proses", "Sudah Dibayar"].map((v) => ({ value: v, label: v })) },
];

export default function DataPembayaran() {
  // --- State ---
  const [data, setData] = useState<Tunjangan[]>([
    {
      id: 1,
      nama_pegawai: "Dr. Ahmad Sudrajat, M.Si",
      nip: "198501012010011001",
      jabatan: "Kepala Bidang",
      grade: "Grade 12",
      unit_kerja: "Sekretariat Utama",
      nominal_tunjangan: 5000000,
      bulan_pembayaran: "Desember",
      tahun_pembayaran: "2024",
      status_pembayaran: "Sudah Dibayar",
    },
    {
      id: 2,
      nama_pegawai: "Siti Nurhaliza, S.Sos",
      nip: "199203152015022001",
      jabatan: "Kepala Sub Bagian",
      grade: "Grade 10",
      unit_kerja: "Pusat Pengolahan Arsip",
      nominal_tunjangan: 3500000,
      bulan_pembayaran: "Desember",
      tahun_pembayaran: "2024",
      status_pembayaran: "Belum Dibayar",
    },
    {
      id: 3,
      nama_pegawai: "Budi Santoso, S.Kom",
      nip: "199807202018011002",
      jabatan: "Staff Pelaksana",
      grade: "Grade 7",
      unit_kerja: "Bidang Layanan Arsip",
      nominal_tunjangan: 2000000,
      bulan_pembayaran: "Desember",
      tahun_pembayaran: "2024",
      status_pembayaran: "Proses",
    },
  ]);
  const [params, setParams] = useState({ search: "", filter: "", sortKey: "id" as keyof Tunjangan, sortOrder: "asc" as "asc" | "desc", page: 1 });
  const [popup, setPopup] = useState<{ open: boolean; mode: PopupMode; data: Tunjangan | null }>({ open: false, mode: "view", data: null });
  const [formData, setFormData] = useState<Partial<Tunjangan>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- Logic & Helpers ---
  const addToast = (type: Toast["type"], message?: string) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, message }]);
    if (type !== "loading") setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
    return id;
  };

  const handleSort = (key: keyof Tunjangan) => setParams((p) => ({ ...p, sortKey: key, sortOrder: p.sortKey === key && p.sortOrder === "asc" ? "desc" : "asc" }));
  const formatRupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const filteredData = useMemo(
    () =>
      data
        .filter(
          (item) =>
            (item.nama_pegawai.toLowerCase().includes(params.search.toLowerCase()) || item.nip.includes(params.search) || item.jabatan.toLowerCase().includes(params.search.toLowerCase())) &&
            (params.filter ? item.status_pembayaran === params.filter : true)
        )
        .sort((a, b) => {
          const [aVal, bVal] = [a[params.sortKey], b[params.sortKey]];
          return (params.sortOrder === "asc" ? 1 : -1) * (aVal > bVal ? 1 : bVal > aVal ? -1 : 0);
        }),
    [data, params]
  );

  const paginated = filteredData.slice((params.page - 1) * 5, params.page * 5);
  useEffect(() => setParams((p) => ({ ...p, page: 1 })), [params.search, params.filter]);

  // Tambahkan '?' agar parameter ini bersifat opsional (tidak wajib diisi saat delete)
  const handleSubmit = (submittedData?: any) => {
    
    // Validasi hanya dijalankan jika BUKAN mode delete
    if (popup.mode !== "delete") {
        // Kita pastikan submittedData ada sebelum mengecek field
        if (!submittedData) return; 

        if (modalFields.some((f) => f.required && !submittedData[f.name as keyof Tunjangan]?.toString().trim())) {
            return addToast("error", "Semua field wajib diisi!");
        }
    }

    const loadId = addToast("loading", "Menyimpan data...");
    
    setTimeout(() => {
      setToasts((p) => p.filter((t) => t.id !== loadId));
      
      if (popup.mode === "add" && submittedData) {
        setData((p) => [...p, { id: Date.now(), ...submittedData } as Tunjangan]);
      } 
      else if (popup.mode === "edit" && submittedData) {
        setData((p) => 
          p.map((i) => (i.id === popup.data?.id ? ({ ...i, ...submittedData } as Tunjangan) : i))
        );
      } 
      else if (popup.mode === "delete") {
        // Mode delete tidak membutuhkan submittedData, dia pakai popup.data
        setData((p) => p.filter((i) => i.id !== popup.data?.id));
      }

      addToast("success", `Data berhasil ${popup.mode === "delete" ? "dihapus" : popup.mode === "add" ? "ditambahkan" : "diperbarui"}!`);
      setPopup({ open: false, mode: "view", data: null });
      setFormData({});
    }, 1000);
  };

  // --- Render Configs ---
  const stats = [
    { label: "Total Data", val: data.length, icon: DollarSign, color: "blue" },
    { label: "Sudah Dibayar", val: data.filter((i) => i.status_pembayaran === "Sudah Dibayar").length, icon: CheckCircle, color: "green" },
    {
      label: "Total Tunjangan",
      val: formatRupiah(data.reduce((s, i) => s + i.nominal_tunjangan, 0)),
      color: "blue",
    },
  ];
  const columns = [
    { key: "nama_pegawai", label: "Nama Pegawai" },
    { key: "nip", label: "NIP" },
    { key: "jabatan", label: "Jabatan" },
    { key: "nominal_tunjangan", label: "Nominal" },
    { key: "status_pembayaran", label: "Status" },
  ];
  const actions = [
    { mode: "view", color: "blue", Icon: Eye },
    { mode: "edit", color: "amber", Icon: Edit2 },
    { mode: "delete", color: "red", Icon: Trash2 },
  ];

  return (
    <MainLayout isAdmin={true}>
      <AlertNotification toasts={toasts} removeToast={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
      <GenericModal
        isOpen={popup.open}
        mode={popup.mode}
        title={{ view: "Detail", add: "Tambah", edit: "Edit", delete: "Hapus" }}
        fields={modalFields}
        data={formData}
        onClose={() => setPopup({ ...popup, open: false })}
        onSubmit={handleSubmit}
        onDelete={handleSubmit}
        deleteMessage={`Hapus data "${popup.data?.nama_pegawai}"?`}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Tunjangan Pengolahan</h1>
              <p className="text-gray-600 text-sm mt-1">Kelola data pembayaran tunjangan</p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{s.label}</p>
                  <p className={`text-${s.val === stats[2].val ? "xl" : "4xl"} font-bold text-${s.color}-600`}>{s.val}</p>
                </div>
                <div className={`p-4 bg-${s.color}-100 rounded-2xl`}>{s.icon && <s.icon className={`w-8 h-8 text-${s.color}-600`} />}</div>
              </div>
            ))}
            <div
              onClick={() => {
                setFormData({});
                setPopup({ open: true, mode: "add", data: null });
              }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer flex items-center justify-between"
            >
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Tambah Data</p>
                <p className="text-white text-lg font-semibold">Klik di sini</p>
              </div>
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Main Table Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={params.search}
                  onChange={(e) => setParams((p) => ({ ...p, search: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none bg-white appearance-none min-w-[200px]"
                  value={params.filter}
                  onChange={(e) => setParams((p) => ({ ...p, filter: e.target.value }))}
                >
                  <option value="">Semua Status</option>
                  {["Belum Dibayar", "Proses", "Sudah Dibayar"].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    {columns.map((c) => (
                      <th key={c.key} className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none" onClick={() => handleSort(c.key as keyof Tunjangan)}>
                        <div className="flex items-center gap-2">
                          {c.label} {params.sortKey === c.key ? params.sortOrder === "asc" ? <span className="text-blue-600">↑</span> : <span className="text-blue-600">↓</span> : <ArrowUpDown className="w-4 h-4 text-gray-400" />}
                        </div>
                      </th>
                    ))}
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginated.length > 0 ? (
                      paginated.map((item, idx) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                        >
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-800">{item.nama_pegawai}</p>
                              <p className="text-xs text-gray-500">{item.unit_kerja}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg">{item.nip}</span>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-700">{item.jabatan}</p>
                              <p className="text-xs text-gray-500">{item.grade}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-semibold text-blue-600">{formatRupiah(item.nominal_tunjangan)}</p>
                              <p className="text-xs text-gray-500">
                                {item.bulan_pembayaran} {item.tahun_pembayaran}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center justify-center rounded-full text-xs font-semibold px-4 py-2 border ${
                                item.status_pembayaran === "Sudah Dibayar"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : item.status_pembayaran === "Proses"
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                  : "bg-red-100 text-red-700 border-red-200"
                              }`}
                            >
                              {item.status_pembayaran}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex gap-2">
                              {actions.map((act) => (
                                <button
                                  key={act.mode}
                                  onClick={() => {
                                    setFormData(item);
                                    setPopup({ open: true, mode: act.mode as PopupMode, data: item });
                                  }}
                                  className={`p-2 bg-${act.color}-100 hover:bg-${act.color}-200 text-${act.color}-600 rounded-xl transition-all hover:scale-110`}
                                >
                                  <act.Icon className="w-4 h-4" />
                                </button>
                              ))}
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-gray-500">
                          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          Tidak ada data ditemukan.
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {filteredData.length > 0 && (
              <Pagination
                currentPage={params.page}
                totalPages={Math.ceil(filteredData.length / 5)}
                totalItems={filteredData.length}
                startIndex={(params.page - 1) * 5}
                endIndex={Math.min(params.page * 5, filteredData.length)}
                onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
                onPrevious={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
                onNext={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
              />
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
