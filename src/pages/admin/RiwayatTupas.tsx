import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Eye, Edit2, Trash2, X, Users, Building2, TrendingUp, ArrowUpDown, Mail, Briefcase, Hash } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";

type Pegawai = {
  id?: number;
  nama: string;
  nip: string;
  jabatan: string;
  departemen: string;
  email: string;
};

interface PopupState {
  open: boolean;
  mode: string;
  data: Pegawai | null;
}

type SortField = "nama" | "nip" | "jabatan" | "departemen" | "email" | null;
type SortOrder = "asc" | "desc";

export default function RiwayatTupas() {
  const [pegawai, setPegawai] = useState<Pegawai[]>([
    {
      id: 1,
      nama: "Ahmad Fauzi",
      nip: "198501012010011001",
      jabatan: "Kepala Bagian",
      departemen: "IT",
      email: "ahmad.fauzi@example.com"
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      nip: "199203152015012002",
      jabatan: "Staff Administrasi",
      departemen: "HR",
      email: "siti.nurhaliza@example.com"
    },
    {
      id: 3,
      nama: "Budi Santoso",
      nip: "198709202012011003",
      jabatan: "Developer",
      departemen: "IT",
      email: "budi.santoso@example.com"
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [popup, setPopup] = useState<PopupState>({
    open: false,
    mode: "",
    data: null,
  });
  const [formData, setFormData] = useState<Pegawai>({
    nama: "",
    nip: "",
    jabatan: "",
    departemen: "",
    email: "",
  });

  // Filter pegawai berdasarkan search
  const filteredPegawai = pegawai.filter(
    (p) =>
      p.nama.toLowerCase().includes(filter.toLowerCase()) ||
      p.nip.includes(filter) ||
      p.departemen.toLowerCase().includes(filter.toLowerCase())
  );

  // Sort pegawai
  const sortedPegawai = [...filteredPegawai].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle numeric sorting for NIP
    if (sortField === "nip") {
      const aNum = parseInt(aValue) || 0;
      const bNum = parseInt(bValue) || 0;
      return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
    }

    // Handle string sorting for other fields
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (sortOrder === "asc") {
      return aStr.localeCompare(bStr, "id-ID");
    } else {
      return bStr.localeCompare(aStr, "id-ID");
    }
  });

  // Handle column header click for sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Render sort indicator
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === "asc" ? 
      <span className="text-blue-600">↑</span> : 
      <span className="text-blue-600">↓</span>;
  };

  // Open Popup
  const openPopup = (mode: string, data: Pegawai | null = null) => {
    setFormData(
      data || {
        nama: "",
        nip: "",
        jabatan: "",
        departemen: "",
        email: "",
      }
    );
    setPopup({ open: true, mode, data });
  };

  // Close Popup
  const closePopup = () => {
    setPopup({ open: false, mode: "", data: null });
    setFormData({
      nama: "",
      nip: "",
      jabatan: "",
      departemen: "",
      email: "",
    });
  };

  // Handle Submit (Add/Edit)
  const handleSubmit = async () => {
    if (!formData.nama.trim() || !formData.nip.trim()) {
      alert("Nama dan NIP wajib diisi!");
      return;
    }

    try {
      if (popup.mode === "add") {
        setPegawai([...pegawai, { id: Date.now(), ...formData }]);
      } else if (popup.mode === "edit" && popup.data) {
        setPegawai(
          pegawai.map((p) => (p.id === popup.data?.id ? { ...p, ...formData } : p))
        );
      }
      closePopup();
    } catch (err: any) {
      console.error("Gagal menyimpan data", err);
      alert("Gagal menyimpan data");
    }
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    try {
      setPegawai(pegawai.filter((p) => p.id !== id));
      closePopup();
    } catch (err: any) {
      console.error("Gagal menghapus data", err);
      alert("Gagal menghapus data");
    }
  };

  // Handle Input Change
  const handleInputChange = (field: keyof Pegawai, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <MainLayout isAdmin={true}>
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Riwayat Tupas
              </h1>
              <p className="text-gray-600 text-sm mt-1">Kelola Riwayat secara lengkap</p>
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
                <p className="text-gray-600 text-sm font-medium mb-1">Total Pegawai</p>
                <p className="text-4xl font-bold text-blue-600">{pegawai.length}</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-2xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Departemen</p>
                <p className="text-4xl font-bold text-blue-600">
                  {new Set(pegawai.map((p) => p.departemen)).size}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-2xl">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
            onClick={() => openPopup("add")}
          >
            <div className="flex items-center justify-between h-full">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Tambah Pegawai</p>
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
                placeholder="Cari berdasarkan nama, NIP, atau departemen..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          )}

          {/* Table */}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th 
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("nama")}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Nama <SortIcon field="nama" />
                      </div>
                    </th>
                    <th 
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("nip")}
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        NIP <SortIcon field="nip" />
                      </div>
                    </th>
                    <th 
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("jabatan")}
                    >
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Jabatan <SortIcon field="jabatan" />
                      </div>
                    </th>
                    <th 
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("departemen")}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Departemen <SortIcon field="departemen" />
                      </div>
                    </th>
                    <th 
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email <SortIcon field="email" />
                      </div>
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {sortedPegawai.length > 0 ? (
                      sortedPegawai.map((p, index) => (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">
                                {p.nama.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-800">{p.nama}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                              {p.nip}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                              {p.jabatan}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium">
                              {p.departemen}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{p.email}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openPopup("view", p)}
                                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-all hover:scale-110"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openPopup("edit", p)}
                                className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-600 rounded-xl transition-all hover:scale-110"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openPopup("delete", p)}
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
                              <Users className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Tidak ada data pegawai</p>
                            <p className="text-gray-400 text-sm">Coba ubah filter pencarian Anda</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
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
                          <h2 className="text-2xl font-bold">Detail Pegawai</h2>
                        </div>
                        <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                          {popup.data.nama.charAt(0)}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
                        <p className="text-lg font-semibold text-gray-800">{popup.data.nama}</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-xs text-gray-500 mb-1">NIP</p>
                        <p className="font-mono font-semibold text-gray-800">{popup.data.nip}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Jabatan</p>
                          <p className="font-semibold text-gray-800">{popup.data.jabatan}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Departemen</p>
                          <p className="font-semibold text-gray-800">{popup.data.departemen}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-gray-700">{popup.data.email}</p>
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
                            {popup.mode === "add" ? "Tambah Pegawai" : "Edit Pegawai"}
                          </h2>
                        </div>
                        <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                          placeholder="Masukkan nama lengkap"
                          value={formData.nama}
                          onChange={(e) => handleInputChange("nama", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">NIP</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                          placeholder="Masukkan NIP"
                          value={formData.nip}
                          onChange={(e) => handleInputChange("nip", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                          placeholder="Masukkan jabatan"
                          value={formData.jabatan}
                          onChange={(e) => handleInputChange("jabatan", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Departemen</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                          placeholder="Masukkan departemen"
                          value={formData.departemen}
                          onChange={(e) => handleInputChange("departemen", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                          placeholder="contoh@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
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
                          <h2 className="text-2xl font-bold">Hapus Pegawai</h2>
                        </div>
                        <button onClick={closePopup} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                        <p className="text-gray-700 text-center">
                          Apakah Anda yakin ingin menghapus pegawai{" "}
                          <span className="font-bold text-red-600">{popup.data.nama}</span>?
                        </p>
                        <p className="text-gray-500 text-sm text-center mt-2">
                          Tindakan ini tidak dapat dibatalkan
                        </p>
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
      </div>
    </div>
    </MainLayout>
  );
}