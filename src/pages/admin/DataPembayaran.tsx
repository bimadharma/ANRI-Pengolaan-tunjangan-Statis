"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  DollarSign,
  CheckCircle,
  Filter,
  ArrowUpDown,
  Calendar,
  Users,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
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

interface PeriodSummary {
  id: string;
  bulan: string;
  tahun: string;
  total_pegawai: number;
  total_nominal: number;
  status_summary: {
    lunas: number;
    proses: number;
    belum: number;
  };
}

type PopupMode = "view" | "add" | "edit" | "delete";
type ViewMode = "list_periode" | "list_detail";

// Field Dasar (Statis)
const baseModalFields: ModalField[] = [
  { name: "nama_pegawai", label: "Nama Pegawai", type: "text", required: true, placeholder: "Nama pegawai" },
  { name: "nip", label: "NIP", type: "text", required: true, placeholder: "1985..." },
  {
    name: "jabatan",
    label: "Jabatan",
    type: "select",
    required: true,
    options: ["Kepala Bidang", "Kepala Sub Bagian", "Staff Pelaksana", "Staff Administrasi"].map((v) => ({
      value: v,
      label: v,
    })),
  },
  {
    name: "grade",
    label: "Grade",
    type: "select",
    required: true,
    options: [12, 11, 10, 9, 8, 7].map((v) => ({ value: `Grade ${v}`, label: `Grade ${v}` })),
  },
  {
    name: "unit_kerja",
    label: "Unit Kerja",
    type: "select",
    required: true,
    options: ["Sekretariat Utama", "Pusat Pengolahan Arsip", "Bidang Layanan Arsip", "Divisi Teknologi Informasi"].map(
      (v) => ({ value: v, label: v })
    ),
  },
  { name: "nominal_tunjangan", label: "Nominal", type: "number", required: true, placeholder: "5000000" },
  // Bulan dan Tahun akan dimanipulasi di dalam komponen
  {
    name: "bulan_pembayaran",
    label: "Bulan",
    type: "select",
    required: true,
    options: [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ].map((v) => ({ value: v, label: v })),
  },
  { name: "tahun_pembayaran", label: "Tahun", type: "text", required: true, placeholder: "2024" },
  {
    name: "status_pembayaran",
    label: "Status",
    type: "select",
    required: true,
    options: ["Belum Dibayar", "Proses", "Sudah Dibayar"].map((v) => ({ value: v, label: v })),
  },
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
  ]);

  const [viewMode, setViewMode] = useState<ViewMode>("list_periode");
  const [selectedPeriod, setSelectedPeriod] = useState<{ bulan: string; tahun: string } | null>(null);

  const [params, setParams] = useState({
    search: "",
    filter: "",
    sortKey: "id" as keyof Tunjangan,
    sortOrder: "asc" as "asc" | "desc",
    page: 1,
  });
  const [popup, setPopup] = useState<{ open: boolean; mode: PopupMode; data: Tunjangan | null }>({
    open: false,
    mode: "view",
    data: null,
  });
  const [formData, setFormData] = useState<Partial<Tunjangan>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- Logic for Dynamic Modal Fields ---
  // Inilah logika inti untuk membedakan form di Periode vs Detail
  const activeModalFields = useMemo(() => {
    return baseModalFields.map((field) => {
        // Jika kita sedang di Detail View (Lihat Tabel), dan fieldnya Bulan/Tahun
        if (viewMode === "list_detail" && selectedPeriod && (field.name === "bulan_pembayaran" || field.name === "tahun_pembayaran")) {
            // Ubah tipe jadi 'text' biasa dan disable agar tidak bisa diganti (Read Only)
            // Atau Anda bisa menambahkan properti `disabled: true` jika GenericModal mendukungnya
            // Di sini kita asumsikan GenericModal merender input standard, kita kirim props tambahan jika perlu
            // Untuk amannya, kita tetap pakai type aslinya tapi kita akan handle di props (jika modal support)
            // Atau cukup biarkan user melihat bahwa ini sudah terisi.
            return { ...field, disabled: true, placeholder: field.name === "bulan_pembayaran" ? selectedPeriod.bulan : selectedPeriod.tahun };
        }
        return field;
    });
  }, [viewMode, selectedPeriod]);

  // --- Logic Helpers ---
  const addToast = (type: Toast["type"], message?: string) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, message }]);
    if (type !== "loading") setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
    return id;
  };

  const handleSort = (key: keyof Tunjangan) =>
    setParams((p) => ({
      ...p,
      sortKey: key,
      sortOrder: p.sortKey === key && p.sortOrder === "asc" ? "desc" : "asc",
    }));

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  // Grouping Logic
  const periodData = useMemo(() => {
    const groups: { [key: string]: PeriodSummary } = {};
    data.forEach((item) => {
      const key = `${item.bulan_pembayaran}-${item.tahun_pembayaran}`;
      if (!groups[key]) {
        groups[key] = {
          id: key,
          bulan: item.bulan_pembayaran,
          tahun: item.tahun_pembayaran,
          total_pegawai: 0,
          total_nominal: 0,
          status_summary: { lunas: 0, proses: 0, belum: 0 },
        };
      }
      groups[key].total_pegawai += 1;
      groups[key].total_nominal += item.nominal_tunjangan;
      if (item.status_pembayaran === "Sudah Dibayar") groups[key].status_summary.lunas += 1;
      else if (item.status_pembayaran === "Proses") groups[key].status_summary.proses += 1;
      else groups[key].status_summary.belum += 1;
    });
    return Object.values(groups);
  }, [data]);

  // Filter Logic Detail
  const filteredDetailData = useMemo(() => {
    if (!selectedPeriod) return [];
    return data
      .filter(
        (item) =>
          item.bulan_pembayaran === selectedPeriod.bulan &&
          item.tahun_pembayaran === selectedPeriod.tahun &&
          (item.nama_pegawai.toLowerCase().includes(params.search.toLowerCase()) ||
            item.nip.includes(params.search)) &&
          (params.filter ? item.status_pembayaran === params.filter : true)
      )
      .sort((a, b) => {
        const [aVal, bVal] = [a[params.sortKey], b[params.sortKey]];
        return (params.sortOrder === "asc" ? 1 : -1) * (aVal > bVal ? 1 : bVal > aVal ? -1 : 0);
      });
  }, [data, params, selectedPeriod]);

  const paginated = filteredDetailData.slice((params.page - 1) * 5, params.page * 5);
  
  // Reset page saat filter berubah
  useEffect(() => setParams((p) => ({ ...p, page: 1 })), [params.search, params.filter, selectedPeriod]);


  // --- HANDLER BUTTON TAMBAH ---
  const handleOpenAdd = () => {
    if (viewMode === "list_detail" && selectedPeriod) {
        // KASUS 2: Di dalam tabel detail -> Tambah Pegawai untuk periode ini
        // Kita pre-fill form dengan bulan & tahun yang sedang aktif
        setFormData({
            bulan_pembayaran: selectedPeriod.bulan,
            tahun_pembayaran: selectedPeriod.tahun
        });
        setPopup({ open: true, mode: "add", data: null });
    } else {
        // KASUS 1: Di list periode -> Tambah Periode Baru (Data Kosong)
        setFormData({});
        setPopup({ open: true, mode: "add", data: null });
    }
  };

  const handleSubmit = (submittedData?: any) => {
    if (popup.mode !== "delete") {
      if (!submittedData) return;
      // Jika mode list_detail, pastikan bulan/tahun tetap konsisten dari state selectedPeriod
      // meskipun form field disabled, kita pastikan data yang disave benar
      let finalData = { ...submittedData };

      if(viewMode === "list_detail" && selectedPeriod && popup.mode === "add") {
          finalData.bulan_pembayaran = selectedPeriod.bulan;
          finalData.tahun_pembayaran = selectedPeriod.tahun;
      }

      if (activeModalFields.some((f) => f.required && !finalData[f.name as keyof Tunjangan]?.toString().trim())) {
        return addToast("error", "Semua field wajib diisi!");
      }
      
      const loadId = addToast("loading", "Menyimpan data...");
      setTimeout(() => {
        setToasts((p) => p.filter((t) => t.id !== loadId));
        if (popup.mode === "add") {
            setData((p) => [...p, { id: Date.now(), ...finalData } as Tunjangan]);
        } else if (popup.mode === "edit") {
            setData((p) => p.map((i) => (i.id === popup.data?.id ? ({ ...i, ...finalData } as Tunjangan) : i)));
        } 
        addToast("success", "Berhasil disimpan!");
        setPopup({ ...popup, open: false });
        setFormData({});
      }, 800);
      return;
    }
    
    // Logic Delete
    setData((p) => p.filter((i) => i.id !== popup.data?.id));
    addToast("success", "Data dihapus!");
    setPopup({ ...popup, open: false });
  };

  const columnsDetail = [
    { key: "nama_pegawai", label: "Nama Pegawai" },
    { key: "nip", label: "NIP" },
    { key: "jabatan", label: "Jabatan" },
    { key: "nominal_tunjangan", label: "Nominal" },
    { key: "status_pembayaran", label: "Status" },
  ];

  return (
    <>
      <AlertNotification toasts={toasts} removeToast={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
      
      {/* MODAL DINAMIS 
        Kita passing 'activeModalFields' yang sudah disesuaikan logic-nya di atas
      */}
      <GenericModal
        isOpen={popup.open}
        mode={popup.mode}
        // Judul Modal Berubah Sesuai Konteks
        title={{ 
            view: "Detail Data", 
            add: viewMode === "list_periode" ? "Buat Periode Baru" : "Tambah Pegawai", // <--- LABEL MODAL BERUBAH
            edit: "Edit Data", 
            delete: "Hapus Data" 
        }}
        fields={activeModalFields} // <--- FIELD DINAMIS
        data={formData}
        onClose={() => setPopup({ ...popup, open: false })}
        onSubmit={handleSubmit}
        onDelete={handleSubmit}
        deleteMessage={`Hapus data "${popup.data?.nama_pegawai}"?`}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Area */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                {viewMode === "list_detail" && (
                    <button 
                        onClick={() => { setViewMode("list_periode"); setSelectedPeriod(null); }}
                        className="p-2 rounded-xl bg-white text-gray-600 hover:text-blue-600 shadow-sm hover:shadow-md transition-all"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                )}
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                    <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {viewMode === "list_periode" ? "Periode Pembayaran" : `Detail: ${selectedPeriod?.bulan} ${selectedPeriod?.tahun}`}
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        {viewMode === "list_periode" ? "Pilih periode untuk melihat detail" : "Kelola data pegawai pada periode ini"}
                    </p>
                </div>
            </div>

            {/* TOMBOL TAMBAH DINAMIS */}
            <button
                onClick={handleOpenAdd}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">
                    {/* LABEL TOMBOL BERUBAH DISINI */}
                    {viewMode === "list_periode" ? "Buat Periode Baru" : "Tambah Pegawai"}
                </span>
            </button>
          </motion.div>

          {/* === TAMPILAN 1: LIST PERIODE (LABEL LIST) === */}
          <AnimatePresence mode="wait">
            {viewMode === "list_periode" && (
              <motion.div
                key="periode-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Stats Summary (Opsional) */}
                <div className="col-span-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-wrap gap-8 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><Calendar className="w-6 h-6"/></div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Periode</p>
                            <p className="text-2xl font-bold text-gray-800">{periodData.length}</p>
                        </div>
                    </div>
                    <div className="hidden md:block w-px bg-gray-200 h-12"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-xl text-green-600"><DollarSign className="w-6 h-6"/></div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Disalurkan</p>
                            <p className="text-2xl font-bold text-gray-800">{formatRupiah(data.reduce((a,b) => a + b.nominal_tunjangan, 0))}</p>
                        </div>
                    </div>
                </div>

                {periodData.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    onClick={() => { setSelectedPeriod({ bulan: item.bulan, tahun: item.tahun }); setViewMode("list_detail"); setParams(p => ({ ...p, search: "", filter: "" })); }}
                    className="group bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Calendar className="w-24 h-24 text-blue-600 transform rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{item.bulan}</h3>
                                <p className="text-gray-500 font-medium">{item.tahun}</p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <ChevronRight className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500 flex items-center gap-2 text-sm"><Users className="w-4 h-4"/> Pegawai</span>
                                <span className="font-semibold text-gray-800">{item.total_pegawai} Orang</span>
                            </div>
                            <div className="pt-2 flex gap-2">
                                {item.status_summary.lunas > 0 && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{item.status_summary.lunas} Lunas</span>}
                                {item.status_summary.proses > 0 && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">{item.status_summary.proses} Proses</span>}
                                {item.status_summary.belum > 0 && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">{item.status_summary.belum} Belum</span>}
                            </div>
                        </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* === TAMPILAN 2: LIST DETAIL (ISIAN TABEL) === */}
          <AnimatePresence mode="wait">
            {viewMode === "list_detail" && (
              <motion.div
                key="detail-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
              >
                {/* Search & Filter Bar */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Cari pegawai..."
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
                      {["Belum Dibayar", "Proses", "Sudah Dibayar"].map((o) => (<option key={o} value={o}>{o}</option>))}
                    </select>
                  </div>
                </div>

                {/* Tabel */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        {columnsDetail.map((c) => (
                          <th key={c.key} className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none" onClick={() => handleSort(c.key as keyof Tunjangan)}>
                            <div className="flex items-center gap-2">
                              {c.label}
                              {params.sortKey === c.key ? params.sortOrder === "asc" ? "↑" : "↓" : <ArrowUpDown className="w-4 h-4 text-gray-400" />}
                            </div>
                          </th>
                        ))}
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                        {paginated.length > 0 ? paginated.map((item, idx) => (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                                <td className="p-4">
                                    <p className="font-medium text-gray-800">{item.nama_pegawai}</p>
                                    <p className="text-xs text-gray-500">{item.unit_kerja}</p>
                                </td>
                                <td className="p-4 font-mono text-sm">{item.nip}</td>
                                <td className="p-4 text-sm">{item.jabatan}</td>
                                <td className="p-4 font-semibold text-blue-600">{formatRupiah(item.nominal_tunjangan)}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        item.status_pembayaran === "Sudah Dibayar" ? "bg-green-100 text-green-700" :
                                        item.status_pembayaran === "Proses" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                                    }`}>{item.status_pembayaran}</span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => { setFormData(item); setPopup({ open: true, mode: "edit", data: item }); }} className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                                    <button onClick={() => { setPopup({ open: true, mode: "delete", data: item }); }} className="p-2 bg-red-100 text-red-600 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={6} className="p-12 text-center text-gray-400">Belum ada data pegawai di periode ini.</td></tr>
                        )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination (Tampilkan hanya jika ada data) */}
                {filteredDetailData.length > 0 && (
                     <Pagination
                        currentPage={params.page}
                        totalPages={Math.ceil(filteredDetailData.length / 5)}
                        totalItems={filteredDetailData.length}
                        startIndex={(params.page - 1) * 5}
                        endIndex={Math.min(params.page * 5, filteredDetailData.length)}
                        onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
                        onPrevious={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
                        onNext={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
                    />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}