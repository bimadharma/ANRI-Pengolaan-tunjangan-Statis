import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Eye, Edit2, Trash2, X, Users, Briefcase, DollarSign, Calendar, Mail, UserCheck, TrendingUp } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";


interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  status: string;
  salary: string;
  startDate: string;
}

interface PopupState {
  open: boolean;
  mode: string;
  data: Employee | null;
}

interface FormData {
  name: string;
  position: string;
  email: string;
  status: string;
  salary: string;
  startDate: string;
}

export default function EmployeeTablePage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "Budi Santoso",
      position: "Senior Developer",
      email: "budi@example.com",
      status: "Aktif",
      salary: "8.000.000",
      startDate: "2021-05-10",
    },
    {
      id: 2,
      name: "Sinta Dewi",
      position: "UI/UX Designer",
      email: "sinta@example.com",
      status: "Cuti",
      salary: "7.500.000",
      startDate: "2022-01-18",
    },
    {
      id: 3,
      name: "Ahmad Fauzi",
      position: "Product Manager",
      email: "ahmad@example.com",
      status: "Aktif",
      salary: "12.000.000",
      startDate: "2020-03-15",
    },
  ]);

  const [filter, setFilter] = useState<string>("");
  const [popup, setPopup] = useState<PopupState>({
    open: false,
    mode: "",
    data: null,
  });
  const [formData, setFormData] = useState<FormData>({
    name: "",
    position: "",
    email: "",
    status: "",
    salary: "",
    startDate: "",
  });

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(filter.toLowerCase()) ||
    e.position.toLowerCase().includes(filter.toLowerCase())
  );

  const totalSalary = employees.reduce((sum, emp) => {
    const salary = parseInt(emp.salary.replace(/\./g, ''));
    return sum + salary;
  }, 0);

  const openPopup = (mode: string, data: Employee | null = null) => {
    setFormData(
      data || {
        name: "",
        position: "",
        email: "",
        status: "",
        salary: "",
        startDate: "",
      }
    );
    setPopup({ open: true, mode, data });
  };

  const closePopup = () => {
    setPopup({ open: false, mode: "", data: null });
    setFormData({
      name: "",
      position: "",
      email: "",
      status: "",
      salary: "",
      startDate: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.position.trim()) {
      alert("Nama dan Posisi wajib diisi!");
      return;
    }

    if (popup.mode === "add") {
      setEmployees([...employees, { id: Date.now(), ...formData }]);
    } else if (popup.mode === "edit" && popup.data) {
      setEmployees(
        employees.map((e) =>
          e.id === popup.data?.id ? { ...e, ...formData } : e
        )
      );
    }
    closePopup();
  };

  const handleDelete = (id: number) => {
    setEmployees(employees.filter((e) => e.id !== id));
    closePopup();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-700 border-green-200";
      case "Cuti":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Non-Aktif":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatSalary = (salary: string) => {
    return new Intl.NumberFormat('id-ID').format(parseInt(salary.replace(/\./g, '')));
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
                Manajemen Pegawai
              </h1>
              <p className="text-gray-600 text-sm mt-1">Kelola data pegawai dan jabatan</p>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Pegawai</p>
                <p className="text-4xl font-bold text-blue-600">{employees.length}</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-2xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Jabatan</p>
                <p className="text-4xl font-bold text-blue-600">
                  {new Set(employees.map((e) => e.position)).size}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-2xl">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Status Aktif</p>
                <p className="text-4xl font-bold text-blue-600">
                  {employees.filter((e) => e.status === "Aktif").length}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-2xl">
                <UserCheck className="w-8 h-8 text-blue-600" />
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
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari pegawai berdasarkan nama atau posisi..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-200">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Total Gaji</p>
                  <p className="text-sm font-bold text-gray-800">
                    Rp {formatSalary(totalSalary.toString())}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Nama
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Posisi
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Gaji
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Tanggal Masuk
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {filtered.length > 0 ? (
                    filtered.map((emp, index) => (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">
                              {emp.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-800">{emp.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                            {emp.position}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{emp.email}</td>
                        <td className="p-4">
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 border ${getStatusColor(emp.status)}`}
                          >
                            {emp.status === "Aktif" && <UserCheck className="w-3 h-3" />}
                            {emp.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-green-600">
                            Rp {formatSalary(emp.salary)}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{emp.startDate}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openPopup("view", emp)}
                              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-all hover:scale-110"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openPopup("edit", emp)}
                              className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-600 rounded-xl transition-all hover:scale-110"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openPopup("delete", emp)}
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
                      <td colSpan={7} className="p-12 text-center">
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
                          {popup.data.name.charAt(0)}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
                        <p className="text-lg font-semibold text-gray-800">{popup.data.name}</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Posisi</p>
                        <p className="text-lg font-semibold text-gray-800">{popup.data.position}</p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-gray-700">{popup.data.email}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <p className="font-semibold text-gray-800">{popup.data.status}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs text-gray-500 mb-1">Gaji</p>
                          <p className="font-semibold text-green-600">Rp {formatSalary(popup.data.salary)}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Tanggal Masuk</p>
                        <p className="font-semibold text-gray-800">{popup.data.startDate}</p>
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
                    <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all"
                          placeholder="Masukkan nama lengkap"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Posisi</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 focus:outline-none transition-all"
                          placeholder="Masukkan posisi"
                          value={formData.position}
                          onChange={(e) => handleInputChange("position", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 focus:outline-none transition-all"
                          placeholder="contoh@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 focus:outline-none transition-all"
                          value={formData.status}
                          onChange={(e) => handleInputChange("status", e.target.value)}
                        >
                          <option value="">Pilih Status</option>
                          <option value="Aktif">Aktif</option>
                          <option value="Cuti">Cuti</option>
                          <option value="Non-Aktif">Non-Aktif</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gaji</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 focus:outline-none transition-all"
                          placeholder="8.000.000"
                          value={formData.salary}
                          onChange={(e) => handleInputChange("salary", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Masuk</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 focus:outline-none transition-all"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange("startDate", e.target.value)}
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
                          <span className="font-bold text-red-600">{popup.data.name}</span>?
                        </p>
                        <p className="text-gray-500 text-sm text-center mt-2">
                          Tindakan ini tidak dapat dibatalkan
                        </p>
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
  );
}