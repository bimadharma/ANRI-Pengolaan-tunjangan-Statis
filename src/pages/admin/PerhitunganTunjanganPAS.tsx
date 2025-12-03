import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface TunjanganPAS {
  id?: number;
  nama: string;
  nip: string;
  jabatan: string;
  golongan: string;
  gajiPokok: number;
  tunjangan: number;
  potongan: number;
  totalTunjangan: number;
  status: string;
  bulan: string;
  tahun: string;
  createdAt?: string;
}

interface PopupState {
  open: boolean;
  mode: string;
  data: TunjanganPAS | null;
}

export default function PerhitunganTunjanganPAS() {
  const [data, setData] = useState<TunjanganPAS[]>([
    {
      id: 1,
      nama: "Budi Santoso",
      nip: "19850315198603001",
      jabatan: "Kepala Bagian",
      golongan: "III/c",
      gajiPokok: 5000000,
      tunjangan: 1500000,
      potongan: 250000,
      totalTunjangan: 5000000 + 1500000 - 250000,
      status: "Aktif",
      bulan: "01",
      tahun: "2024",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      nama: "Sinta Dewi",
      nip: "19880422199003002",
      jabatan: "Staf Administrasi",
      golongan: "II/c",
      gajiPokok: 3500000,
      tunjangan: 1000000,
      potongan: 150000,
      totalTunjangan: 3500000 + 1000000 - 150000,
      status: "Aktif",
      bulan: "01",
      tahun: "2024",
      createdAt: "2024-01-16",
    },
  ]);

  const [filter, setFilter] = useState<string>("");
  const [popup, setPopup] = useState<PopupState>({ open: false, mode: "", data: null });
  const [formData, setFormData] = useState<TunjanganPAS>({
    nama: "",
    nip: "",
    jabatan: "",
    golongan: "",
    gajiPokok: 0,
    tunjangan: 0,
    potongan: 0,
    totalTunjangan: 0,
    status: "Aktif",
    bulan: "01",
    tahun: new Date().getFullYear().toString(),
  });

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

  const filteredData = data.filter(
    (d) =>
      d.nama.toLowerCase().includes(filter.toLowerCase()) ||
      d.nip.includes(filter) ||
      d.jabatan.toLowerCase().includes(filter.toLowerCase())
  );

  const openPopup = (mode: string, item: TunjanganPAS | null = null) => {
    setFormData(
      item || {
        nama: "",
        nip: "",
        jabatan: "",
        golongan: "",
        gajiPokok: 0,
        tunjangan: 0,
        potongan: 0,
        totalTunjangan: 0,
        status: "Aktif",
        bulan: "01",
        tahun: new Date().getFullYear().toString(),
      }
    );
    setPopup({ open: true, mode, data: item });
  };

  const closePopup = () => {
    setPopup({ open: false, mode: "", data: null });
    setFormData({
      nama: "",
      nip: "",
      jabatan: "",
      golongan: "",
      gajiPokok: 0,
      tunjangan: 0,
      potongan: 0,
      totalTunjangan: 0,
      status: "Aktif",
      bulan: "01",
      tahun: new Date().getFullYear().toString(),
    });
  };

  const handleInputChange = (field: keyof TunjanganPAS, value: any) => {
    const updated = { ...formData, [field]: value };
    if (field === "gajiPokok" || field === "tunjangan" || field === "potongan") {
      const g = Number(updated.gajiPokok || 0);
      const t = Number(updated.tunjangan || 0);
      const p = Number(updated.potongan || 0);
      updated.totalTunjangan = g + t - p;
    }
    setFormData(updated);
  };

  const handleSubmit = () => {
    if (!formData.nama.trim() || !formData.nip.trim()) {
      alert("Nama dan NIP wajib diisi!");
      return;
    }
    if (popup.mode === "add") {
      setData([
        {
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString().split("T")[0],
        },
        ...data,
      ]);
    } else if (popup.mode === "edit" && popup.data) {
      setData(data.map((d) => (d.id === popup.data!.id ? { ...d, ...formData } : d)));
    }
    closePopup();
  };

  const handleDelete = (id?: number) => {
    if (!id) return;
    setData(data.filter((d) => d.id !== id));
    closePopup();
  };

  const totalGaji = data.reduce((s, it) => s + (it.gajiPokok || 0), 0);
  const totalTunjangan = data.reduce((s, it) => s + (it.tunjangan || 0), 0);
  const totalPotongan = data.reduce((s, it) => s + (it.potongan || 0), 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Perhitungan Tunjangan PAS
                </h1>
                <p className="text-gray-600 text-sm mt-1">Kelola perhitungan dan riwayat tunjangan PAS</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Data</p>
                  <p className="text-4xl font-bold text-blue-600">{data.length}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-2xl">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Gaji Pokok</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalGaji)}</p>
                </div>
                <div className="p-4 bg-green-100 rounded-2xl">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer" onClick={() => openPopup("add")}>
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Tambah Perhitungan</p>
                  <p className="text-white text-lg font-semibold">Klik untuk menambah</p>
                </div>
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Plus className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Cari nama, NIP atau jabatan..." value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Nama</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">NIP</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Jabatan</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Golongan</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Gaji Pokok</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Tunjangan</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Potongan</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Bulan/Tahun</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, idx) => (
                      <motion.tr key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: idx * 0.03 }} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                        <td className="p-4 font-medium text-gray-800">{item.nama}</td>
                        <td className="p-4 text-sm text-gray-700">{item.nip}</td>
                        <td className="p-4 text-sm text-gray-700">{item.jabatan}</td>
                        <td className="p-4 text-sm text-gray-700">{item.golongan}</td>
                        <td className="p-4 text-sm text-gray-700">{formatCurrency(item.gajiPokok)}</td>
                        <td className="p-4 text-sm text-gray-700">{formatCurrency(item.tunjangan)}</td>
                        <td className="p-4 text-sm text-gray-700">{formatCurrency(item.potongan)}</td>
                        <td className="p-4 text-sm font-bold text-green-600">{formatCurrency(item.totalTunjangan)}</td>
                        <td className="p-4">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${item.status === "Aktif" ? "bg-green-100 text-green-700 border border-green-200" : "bg-yellow-100 text-yellow-700 border border-yellow-200"}`}>
                            {item.status === "Aktif" && <CheckCircle className="w-3 h-3" />}
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{item.bulan}/{item.tahun}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => openPopup("view", item)} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-all hover:scale-110" title="View"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => openPopup("edit", item)} className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-600 rounded-xl transition-all hover:scale-110" title="Edit"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => openPopup("delete", item)} className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all hover:scale-110" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <TrendingUp className="w-12 h-12 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">Tidak ada perhitungan tunjangan</p>
                          <p className="text-gray-400 text-sm">Coba ubah kata kunci pencarian</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          <AnimatePresence>
            {popup.open && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closePopup}>
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", duration: 0.45 }} className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  {popup.mode === "view" && popup.data && (
                    <>
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                              <Eye className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Detail Perhitungan</h2>
                          </div>
                          <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="bg-gray-50 rounded-2xl p-4"><p className="text-xs text-gray-500 mb-1">Nama</p><p className="text-lg font-semibold text-gray-800">{popup.data.nama}</p></div>
                        <div className="bg-gray-50 rounded-2xl p-4"><p className="text-xs text-gray-500 mb-1">NIP</p><p className="text-lg font-semibold text-gray-800">{popup.data.nip}</p></div>
                        <div className="bg-gray-50 rounded-2xl p-4"><p className="text-xs text-gray-500 mb-1">Jabatan</p><p className="text-lg font-semibold text-gray-800">{popup.data.jabatan}</p></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-2xl p-4"><p className="text-xs text-gray-500 mb-1">Gaji Pokok</p><p className="font-semibold">{formatCurrency(popup.data.gajiPokok)}</p></div>
                          <div className="bg-gray-50 rounded-2xl p-4"><p className="text-xs text-gray-500 mb-1">Tunjangan</p><p className="font-semibold">{formatCurrency(popup.data.tunjangan)}</p></div>
                        </div>
                        <button onClick={closePopup} className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-2xl font-medium transition-colors mt-2">Tutup</button>
                      </div>
                    </>
                  )}

                  {(popup.mode === "add" || popup.mode === "edit") && (
                    <>
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">{popup.mode === "add" ? <Plus className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}</div>
                            <h2 className="text-2xl font-bold">{popup.mode === "add" ? "Tambah Perhitungan" : "Edit Perhitungan"}</h2>
                          </div>
                          <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                          <input type="text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400" value={formData.nama} onChange={(e) => handleInputChange("nama", e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">NIP</label>
                          <input type="text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400" value={formData.nip} onChange={(e) => handleInputChange("nip", e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input type="text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl" placeholder="Jabatan" value={formData.jabatan} onChange={(e) => handleInputChange("jabatan", e.target.value)} />
                          <input type="text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl" placeholder="Golongan" value={formData.golongan} onChange={(e) => handleInputChange("golongan", e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input type="number" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl" placeholder="Gaji Pokok" value={formData.gajiPokok} onChange={(e) => handleInputChange("gajiPokok", Number(e.target.value))} />
                          <input type="number" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl" placeholder="Tunjangan" value={formData.tunjangan} onChange={(e) => handleInputChange("tunjangan", Number(e.target.value))} />
                          <input type="number" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl" placeholder="Potongan" value={formData.potongan} onChange={(e) => handleInputChange("potongan", Number(e.target.value))} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <select value={formData.bulan} onChange={(e) => handleInputChange("bulan", e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl">
                            {Array.from({ length: 12 }).map((_, i) => <option key={i} value={String(i + 1).padStart(2, "0")}>{new Date(0, i).toLocaleString("id-ID", { month: "short" })}</option>)}
                          </select>
                          <input className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl" value={formData.tahun} onChange={(e) => handleInputChange("tahun", e.target.value)} />
                        </div>
                        <div>
                          <select value={formData.status} onChange={(e) => handleInputChange("status", e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl">
                            <option value="Aktif">Aktif</option>
                            <option value="Non-Aktif">Non-Aktif</option>
                            <option value="Cuti">Cuti</option>
                          </select>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button onClick={handleSubmit} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-medium transition-all hover:shadow-lg">Simpan</button>
                          <button onClick={closePopup} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-medium transition-colors">Batal</button>
                        </div>
                      </div>
                    </>
                  )}

                  {popup.mode === "delete" && popup.data && (
                    <>
                      <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><Trash2 className="w-6 h-6" /></div>
                            <h2 className="text-2xl font-bold">Hapus Perhitungan</h2>
                          </div>
                          <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                          <p className="text-gray-700 text-center">Apakah Anda yakin ingin menghapus perhitungan <span className="font-bold text-red-600">{popup.data.nama}</span>?</p>
                          <p className="text-gray-500 text-sm text-center mt-2">Tindakan ini tidak dapat dibatalkan</p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => handleDelete(popup.data!.id)} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-2xl font-medium transition-all hover:shadow-lg">Ya, Hapus</button>
                          <button onClick={closePopup} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-medium transition-colors">Batal</button>
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
    </>
  );
}