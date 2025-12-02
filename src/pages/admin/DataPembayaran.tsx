import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Eye, Edit2, Trash2, DollarSign, CheckCircle, Filter, ArrowUpDown } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import AlertNotification, { Toast } from "../../components/AlertNotification";
import GenericModal, { ModalField } from "../../components/ModalPop";

interface TunjanganPengolahan {
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

interface PopupState {
  open: boolean;
  mode: "view" | "add" | "edit" | "delete";
  data: TunjanganPengolahan | null;
}

type SortKey = keyof TunjanganPengolahan;
type SortOrder = "asc" | "desc";

export default function DataPembayaran() {
  const [tunjanganData, setTunjanganData] = useState<TunjanganPengolahan[]>([
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
      status_pembayaran: "Sudah Dibayar"
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
      status_pembayaran: "Belum Dibayar"
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
      status_pembayaran: "Proses"
    },
  ]);

  const [search, setSearch] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [popup, setPopup] = useState<PopupState>({ open: false, mode: "view", data: null });
  const [formData, setFormData] = useState<Partial<TunjanganPengolahan>>({});
  
  // Toast Management
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: Toast["type"], message?: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    
    if (type !== "loading") {
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    }
    
    return id;
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Definisi fields untuk modal
  const modalFields: ModalField[] = [
    {
      name: "nama_pegawai",
      label: "Nama Pegawai",
      type: "text",
      placeholder: "Masukkan nama pegawai",
      required: true,
    },
    {
      name: "nip",
      label: "NIP",
      type: "text",
      placeholder: "198501012010011001",
      required: true,
    },
    {
      name: "jabatan",
      label: "Jabatan",
      type: "select",
      required: true,
      options: [
        { value: "Kepala Bidang", label: "Kepala Bidang" },
        { value: "Kepala Sub Bagian", label: "Kepala Sub Bagian" },
        { value: "Staff Pelaksana", label: "Staff Pelaksana" },
        { value: "Staff Administrasi", label: "Staff Administrasi" },
      ],
    },
    {
      name: "grade",
      label: "Grade",
      type: "select",
      required: true,
      options: [
        { value: "Grade 12", label: "Grade 12" },
        { value: "Grade 11", label: "Grade 11" },
        { value: "Grade 10", label: "Grade 10" },
        { value: "Grade 9", label: "Grade 9" },
        { value: "Grade 8", label: "Grade 8" },
        { value: "Grade 7", label: "Grade 7" },
      ],
    },
    {
      name: "unit_kerja",
      label: "Unit Kerja",
      type: "select",
      required: true,
      options: [
        { value: "Sekretariat Utama", label: "Sekretariat Utama" },
        { value: "Pusat Pengolahan Arsip", label: "Pusat Pengolahan Arsip" },
        { value: "Bidang Layanan Arsip", label: "Bidang Layanan Arsip" },
        { value: "Divisi Teknologi Informasi", label: "Divisi Teknologi Informasi" },
      ],
    },
    {
      name: "nominal_tunjangan",
      label: "Nominal Tunjangan",
      type: "number",
      placeholder: "5000000",
      required: true,
    },
    {
      name: "bulan_pembayaran",
      label: "Bulan Pembayaran",
      type: "select",
      required: true,
      options: [
        { value: "Januari", label: "Januari" },
        { value: "Februari", label: "Februari" },
        { value: "Maret", label: "Maret" },
        { value: "April", label: "April" },
        { value: "Mei", label: "Mei" },
        { value: "Juni", label: "Juni" },
        { value: "Juli", label: "Juli" },
        { value: "Agustus", label: "Agustus" },
        { value: "September", label: "September" },
        { value: "Oktober", label: "Oktober" },
        { value: "November", label: "November" },
        { value: "Desember", label: "Desember" },
      ],
    },
    {
      name: "tahun_pembayaran",
      label: "Tahun Pembayaran",
      type: "text",
      placeholder: "2024",
      required: true,
    },
    {
      name: "status_pembayaran",
      label: "Status Pembayaran",
      type: "select",
      required: true,
      options: [
        { value: "Belum Dibayar", label: "Belum Dibayar" },
        { value: "Proses", label: "Proses" },
        { value: "Sudah Dibayar", label: "Sudah Dibayar" },
      ],
    },
  ];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredData = tunjanganData
    .filter((item) => {
      const matchesSearch = 
        item.nama_pegawai.toLowerCase().includes(search.toLowerCase()) ||
        item.nip.toLowerCase().includes(search.toLowerCase()) ||
        item.jabatan.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus ? item.status_pembayaran === filterStatus : true;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === "asc" 
        ? (aValue > bValue ? 1 : -1)
        : (bValue > aValue ? 1 : -1);
    });

  const openPopup = (mode: PopupState["mode"], data: TunjanganPengolahan | null = null) => {
    setFormData(data || {});
    setPopup({ open: true, mode, data });
  };

  const closePopup = () => {
    setPopup({ open: false, mode: "view", data: null });
    setFormData({});
  };

  const validateForm = (): boolean => {
    for (const field of modalFields) {
      if (field.required && !formData[field.name as keyof TunjanganPengolahan]?.toString().trim()) {
        addToast("error", `${field.label} harus diisi!`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const loadingId = addToast("loading", "Menyimpan data...");

    setTimeout(() => {
      removeToast(loadingId);
      
      if (popup.mode === "add") {
        setTunjanganData([...tunjanganData, { id: Date.now(), ...formData } as TunjanganPengolahan]);
        addToast("success", "Data tunjangan berhasil ditambahkan!");
      } else if (popup.mode === "edit" && popup.data) {
        setTunjanganData(tunjanganData.map((item) =>
          item.id === popup.data?.id ? { ...item, ...formData } : item
        ));
        addToast("success", "Data tunjangan berhasil diperbarui!");
      }
      
      closePopup();
    }, 1000);
  };

  const handleDelete = () => {
    if (popup.data) {
      const loadingId = addToast("loading", "Menghapus data...");

      setTimeout(() => {
        removeToast(loadingId);
        
        setTunjanganData(tunjanganData.filter((item) => item.id !== popup.data?.id));
        addToast("success", "Data tunjangan berhasil dihapus!");
        closePopup();
      }, 1000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sudah Dibayar":
        return "bg-green-100 text-green-700 border-green-200";
      case "Proses":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Belum Dibayar":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalTunjangan = tunjanganData.reduce((sum, item) => sum + item.nominal_tunjangan, 0);
  const sudahDibayar = tunjanganData.filter(item => item.status_pembayaran === "Sudah Dibayar").length;

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === "asc" ? 
      <span className="text-blue-600">↑</span> : 
      <span className="text-blue-600">↓</span>;
  };

  return (
    <MainLayout isAdmin={true}>
      {/* Toast Notifications */}
      <AlertNotification toasts={toasts} removeToast={removeToast} />

      {/* Generic Modal */}
      <GenericModal
        isOpen={popup.open}
        mode={popup.mode}
        title={{
          view: "Detail Tunjangan Pengolahan",
          add: "Tambah Tunjangan Pengolahan",
          edit: "Edit Tunjangan Pengolahan",
          delete: "Hapus Tunjangan Pengolahan",
        }}
        fields={modalFields}
        data={formData}
        onClose={closePopup}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        deleteMessage={`Apakah Anda yakin ingin menghapus data tunjangan untuk "${popup.data?.nama_pegawai}"?`}
      />

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
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Tunjangan Pengolahan
                </h1>
                <p className="text-gray-600 text-sm mt-1">Kelola data pembayaran tunjangan pengolahan pegawai</p>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Data</p>
                  <p className="text-4xl font-bold text-blue-600">{tunjanganData.length}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-2xl">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Sudah Dibayar</p>
                  <p className="text-4xl font-bold text-green-600">{sudahDibayar}</p>
                </div>
                <div className="p-4 bg-green-100 rounded-2xl">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex flex-col">
                <p className="text-gray-600 text-sm font-medium mb-1">Total Tunjangan</p>
                <p className="text-xl font-bold text-blue-600">{formatRupiah(totalTunjangan)}</p>
              </div>
            </div>

            <div 
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
              onClick={() => openPopup("add")}
            >
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Tambah Data</p>
                  <p className="text-white text-lg font-semibold">Klik di sini</p>
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
                    placeholder="Cari berdasarkan nama, NIP, atau jabatan..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all bg-white appearance-none min-w-[200px]"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">Semua Status</option>
                    <option value="Belum Dibayar">Belum Dibayar</option>
                    <option value="Proses">Proses</option>
                    <option value="Sudah Dibayar">Sudah Dibayar</option>
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
                      onClick={() => handleSort("nama_pegawai")}
                    >
                      <div className="flex items-center gap-2">
                        Nama Pegawai <SortIcon column="nama_pegawai" />
                      </div>
                    </th>
                    <th 
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("nip")}
                    >
                      <div className="flex items-center gap-2">
                        NIP <SortIcon column="nip" />
                      </div>
                    </th>
                    <th 
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("jabatan")}
                    >
                      <div className="flex items-center gap-2">
                        Jabatan <SortIcon column="jabatan" />
                      </div>
                    </th>
                    <th 
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("nominal_tunjangan")}
                    >
                      <div className="flex items-center gap-2">
                        Nominal <SortIcon column="nominal_tunjangan" />
                      </div>
                    </th>
                    <th 
                      className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none"
                      onClick={() => handleSort("status_pembayaran")}
                    >
                      <div className="flex items-center gap-2">
                        Status <SortIcon column="status_pembayaran" />
                      </div>
                    </th>
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
                            <div>
                              <p className="font-medium text-gray-800">{item.nama_pegawai}</p>
                              <p className="text-xs text-gray-500">{item.unit_kerja}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                              {item.nip}
                            </span>
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
                              <p className="text-xs text-gray-500">{item.bulan_pembayaran} {item.tahun_pembayaran}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center border ${getStatusColor(item.status_pembayaran)}`}>
                              {item.status_pembayaran}
                            </span>
                          </td>
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
                              <DollarSign className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Tidak ada data tunjangan pengolahan</p>
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
        </div>
      </div>
    </MainLayout>
  );
}