import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Eye, Edit2, Trash2, X, Database, CheckCircle } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";

interface MasterDataItem {
  id?: number;
  kode: string;
  nama: string;
  deskripsi: string;
  status: string;
  createdAt?: string;
}

interface PopupState {
  open: boolean;
  mode: string;
  data: MasterDataItem | null;
}

export default function Ketentuan() {
  const [data, setData] = useState<MasterDataItem[]>([
    {
      id: 1,
      kode: "DEP001",
      nama: "Departemen IT",
      deskripsi: "Bagian Teknologi Informasi",
      status: "Aktif",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      kode: "DEP002",
      nama: "Departemen HR",
      deskripsi: "Bagian Sumber Daya Manusia",
      status: "Aktif",
      createdAt: "2024-01-16",
    },
    {
      id: 3,
      kode: "DEP003",
      nama: "Departemen Keuangan",
      deskripsi: "Bagian Keuangan",
      status: "Non-Aktif",
      createdAt: "2024-01-17",
    },
  ]);

  const [filter, setFilter] = useState<string>("");
  const [popup, setPopup] = useState<PopupState>({ open: false, mode: "", data: null });
  const [formData, setFormData] = useState<MasterDataItem>({
    kode: "",
    nama: "",
    deskripsi: "",
    status: "Aktif",
  });

  // alert / toast state
  const [alert, setAlert] = useState<{ open: boolean; message: string; variant: "success" | "error" | "info" }>({
    open: false,
    message: "",
    variant: "success",
  });

  const showAlert = (message: string, variant: "success" | "error" | "info" = "success", duration = 3000) => {
    setAlert({ open: true, message, variant });
    window.setTimeout(() => setAlert((s) => ({ ...s, open: false })), duration);
  };

  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(filter.toLowerCase()) ||
      item.kode.toLowerCase().includes(filter.toLowerCase())
  );

  const openPopup = (mode: string, item: MasterDataItem | null = null) => {
    setFormData(
      item || {
        kode: "",
        nama: "",
        deskripsi: "",
        status: "Aktif",
      }
    );
    setPopup({ open: true, mode, data: item });
  };

  const closePopup = () => {
    setPopup({ open: false, mode: "", data: null });
    setFormData({
      kode: "",
      nama: "",
      deskripsi: "",
      status: "Aktif",
    });
  };

  const handleSubmit = () => {
    if (!formData.kode.trim() || !formData.nama.trim()) {
      showAlert("Kode dan Nama wajib diisi!", "error");
      return;
    }

    const isAdd = popup.mode === "add";

    if (isAdd) {
      setData([
        ...data,
        {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
    } else if (popup.mode === "edit" && popup.data) {
      setData(
        data.map((item) => (item.id === popup.data?.id ? { ...item, ...formData } : item))
      );
    }

    closePopup();
    showAlert(isAdd ? "Data berhasil ditambahkan" : "Data berhasil diperbarui", "success");
  };

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
    closePopup();
    showAlert("Data berhasil dihapus", "success");
  };

  const handleInputChange = (field: keyof MasterDataItem, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <MainLayout isAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Master Data
                </h1>
                <p className="text-gray-600 text-sm mt-1">Kelola data master Anda dengan mudah</p>
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
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Data</p>
                  <p className="text-4xl font-bold text-blue-600">{data.length}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-2xl">
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Status Aktif</p>
                  <p className="text-4xl font-bold text-green-600">
                    {data.filter((d) => d.status === "Aktif").length}
                  </p>
                </div>
                <div className="p-4 bg-green-100 rounded-2xl">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
              onClick={() => openPopup("add")}
            >
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Tambah Data Baru</p>
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
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama atau kode..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Kode</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Nama</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Deskripsi</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Dibuat</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                        >
                          <td className="p-4">
                            <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                              {item.kode}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-gray-800">{item.nama}</td>
                          <td className="p-4 text-sm text-gray-600">{item.deskripsi}</td>
                          <td className="p-4">
                            <span
                              className={`px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                                item.status === "Aktif"
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              }`}
                            >
                              {item.status === "Aktif" && <CheckCircle className="w-3 h-3" />}
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{item.createdAt}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openPopup("view", item)}
                                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-all hover:scale-110"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openPopup("edit", item)}
                                className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-600 rounded-xl transition-all hover:scale-110"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openPopup("delete", item)}
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
                        <td colSpan={6} className="p-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <Database className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Tidak ada data master</p>
                            <p className="text-gray-400 text-sm">Coba ubah filter pencarian Anda</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
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
                            <h2 className="text-2xl font-bold">Detail Data</h2>
                          </div>
                          <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Kode</p>
                          <p className="text-lg font-semibold text-gray-800">{popup.data.kode}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Nama</p>
                          <p className="text-lg font-semibold text-gray-800">{popup.data.nama}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Deskripsi</p>
                          <p className="text-gray-700">{popup.data.deskripsi}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <p className="font-semibold text-gray-800">{popup.data.status}</p>
                          </div>
                          <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Dibuat</p>
                            <p className="font-semibold text-gray-800">{popup.data.createdAt}</p>
                          </div>
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
                            <h2 className="text-2xl font-bold">{popup.mode === "add" ? "Tambah Data" : "Edit Data"}</h2>
                          </div>
                          <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Kode</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                            placeholder="Masukkan kode"
                            value={formData.kode}
                            onChange={(e) => handleInputChange("kode", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                            placeholder="Masukkan nama"
                            value={formData.nama}
                            onChange={(e) => handleInputChange("nama", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                          <textarea
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all resize-none"
                            placeholder="Masukkan deskripsi"
                            rows={3}
                            value={formData.deskripsi}
                            onChange={(e) => handleInputChange("deskripsi", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <select
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                            value={formData.status}
                            onChange={(e) => handleInputChange("status", e.target.value)}
                          >
                            <option value="">Pilih Status</option>
                            <option value="Aktif">Aktif</option>
                            <option value="Non-Aktif">Non-Aktif</option>
                          </select>
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
                            <h2 className="text-2xl font-bold">Hapus Data</h2>
                          </div>
                          <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                          <p className="text-gray-700 text-center">
                            Apakah Anda yakin ingin menghapus data{" "}
                            <span className="font-bold text-red-600">{popup.data.nama}</span>?
                          </p>
                          <p className="text-gray-500 text-sm text-center mt-2">Tindakan ini tidak dapat dibatalkan</p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleDelete(popup.data!.id!)}
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

          {/* Alert / Toast */}
          <AnimatePresence>
            {alert.open && (
              <motion.div
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 200 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="fixed right-6 top-6 z-50"
              >
                <div
                  className={`max-w-sm px-4 py-3 rounded-2xl shadow-lg text-white flex items-center gap-3 ${
                    alert.variant === "success" ? "bg-green-600" : alert.variant === "error" ? "bg-red-600" : "bg-blue-600"
                  }`}
                >
                  <div className="font-medium">{alert.message}</div>
                  <button
                    onClick={() => setAlert((s) => ({ ...s, open: false }))}
                    className="ml-2 bg-white/20 px-2 py-1 rounded-md hover:bg-white/30"
                    aria-label="Close alert"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}