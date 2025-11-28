import React, { useState, useEffect } from "react";
import { Button, Card } from "flowbite-react";
import { motion } from "framer-motion";
import "flowbite";
import MainLayout from "../../components/layout/MainLayout";

// Interface untuk Tunjangan PAS
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

type SortField = "nama" | "nip" | "golongan" | "totalTunjangan" | "bulan" | null;
type SortOrder = "asc" | "desc";

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
      totalTunjangan: 6250000,
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
      totalTunjangan: 4350000,
      status: "Aktif",
      bulan: "01",
      tahun: "2024",
      createdAt: "2024-01-16",
    },
    {
      id: 3,
      nama: "Ahmad Riyadi",
      nip: "19900510199501003",
      jabatan: "Teknisi",
      golongan: "II/b",
      gajiPokok: 3000000,
      tunjangan: 800000,
      potongan: 120000,
      totalTunjangan: 3680000,
      status: "Aktif",
      bulan: "01",
      tahun: "2024",
      createdAt: "2024-01-17",
    },
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

  // Filter data berdasarkan search
  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(filter.toLowerCase()) ||
      item.nip.includes(filter) ||
      item.jabatan.toLowerCase().includes(filter.toLowerCase())
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle numeric sorting
    if (sortField === "totalTunjangan") {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Handle string sorting
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
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <span className="text-gray-400 ml-1">⇅</span>;
    }
    return <span className="text-blue-600 ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate total tunjangan
  const calculateTotal = () => {
    return formData.gajiPokok + formData.tunjangan - formData.potongan;
  };

  // Open Popup
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

  // Close Popup
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

  // Handle Submit (Add/Edit)
  const handleSubmit = () => {
    if (!formData.nama.trim() || !formData.nip.trim()) {
      alert("Nama dan NIP wajib diisi!");
      return;
    }

    const totalTunjangan = calculateTotal();
    const newData = { ...formData, totalTunjangan };

    try {
      if (popup.mode === "add") {
        setData([
          ...data,
          {
            id: Date.now(),
            ...newData,
            createdAt: new Date().toISOString().split("T")[0],
          },
        ]);
      } else if (popup.mode === "edit" && popup.data) {
        setData(
          data.map((item) =>
            item.id === popup.data?.id ? { ...item, ...newData } : item
          )
        );
      }
      closePopup();
    } catch (err: any) {
      console.error("Gagal menyimpan data", err);
      alert("Gagal menyimpan data");
    }
  };

  // Handle Delete
  const handleDelete = (id: number) => {
    try {
      setData(data.filter((item) => item.id !== id));
      closePopup();
    } catch (err: any) {
      console.error("Gagal menghapus data", err);
      alert("Gagal menghapus data");
    }
  };

  // Handle Input Change
  const handleInputChange = (field: keyof TunjanganPAS, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  // Calculate Statistics
  const totalGajiPokok = data.reduce((sum, item) => sum + item.gajiPokok, 0);
  const totalTunjangan = data.reduce((sum, item) => sum + item.tunjangan, 0);
  const totalPotongan = data.reduce((sum, item) => sum + item.potongan, 0);
  const grandTotal = data.reduce((sum, item) => sum + item.totalTunjangan, 0);

  return (
    <MainLayout isAdmin={true}>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600">
            💰 Perhitungan Tunjangan PAS
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Kelola data tunjangan pegawai dengan mudah
          </p>
        </div>

        <Card className="shadow-lg rounded-2xl">
          <div className="w-full">
            {/* Search Bar & Button */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="Cari data..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 w-full sm:flex-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <Button
                onClick={() => openPopup("add")}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 text-sm sm:text-base font-semibold w-full sm:w-auto"
              >
                + Tambah
              </Button>
            </div>

            {/* Statistics Cards - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Card className="bg-blue-100 rounded-xl sm:rounded-2xl shadow p-2 sm:p-4 text-center">
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">Total Data</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-700 mt-1">{data.length}</p>
              </Card>
              <Card className="bg-green-100 rounded-xl sm:rounded-2xl shadow p-2 sm:p-4 text-center">
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">Gaji Pokok</p>
                <p className="text-xs sm:text-sm font-bold text-green-700 mt-1">{formatCurrency(totalGajiPokok)}</p>
              </Card>
              <Card className="bg-yellow-100 rounded-xl sm:rounded-2xl shadow p-2 sm:p-4 text-center">
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">Tunjangan</p>
                <p className="text-xs sm:text-sm font-bold text-yellow-700 mt-1">{formatCurrency(totalTunjangan)}</p>
              </Card>
              <Card className="bg-red-100 rounded-xl sm:rounded-2xl shadow p-2 sm:p-4 text-center">
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">Potongan</p>
                <p className="text-xs sm:text-sm font-bold text-red-700 mt-1">{formatCurrency(totalPotongan)}</p>
              </Card>
              <Card className="bg-purple-100 rounded-xl sm:rounded-2xl shadow p-2 sm:p-4 text-center col-span-2 sm:col-span-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-1">Grand Total</p>
                  <p className="text-xs sm:text-sm font-bold text-purple-700">{formatCurrency(grandTotal)}</p>
                </div>
              </Card>
            </div>

            {/* Sort Info */}
            {sortField && (
              <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 bg-blue-50 px-3 sm:px-4 py-2 rounded-lg flex-wrap">
                <span className="font-semibold">Urutkan: <strong>{sortField}</strong></span>
                <span className="text-blue-600 font-semibold">{sortOrder === "asc" ? "↑" : "↓"}</span>
                <Button
                  onClick={() => setSortField(null)}
                  size="xs"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-xs ml-auto"
                >
                  Reset
                </Button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Memuat data...</p>
              </div>
            )}

            {/* Desktop Table View (lg and up) */}
            {!loading && sortedData.length > 0 && (
              <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="p-2 sm:p-3 font-semibold">No</th>
                      <th 
                        className="p-2 sm:p-3 cursor-pointer hover:bg-gray-200 transition select-none font-semibold"
                        onClick={() => handleSort("nama")}
                      >
                        Nama {renderSortIndicator("nama")}
                      </th>
                      <th className="p-2 sm:p-3 font-semibold">NIP</th>
                      <th className="p-2 sm:p-3 font-semibold">Jabatan</th>
                      <th 
                        className="p-2 sm:p-3 cursor-pointer hover:bg-gray-200 transition select-none font-semibold"
                        onClick={() => handleSort("golongan")}
                      >
                        Golongan {renderSortIndicator("golongan")}
                      </th>
                      <th className="p-2 sm:p-3 font-semibold">Gaji</th>
                      <th className="p-2 sm:p-3 font-semibold">Tunj.</th>
                      <th className="p-2 sm:p-3 font-semibold">Pot.</th>
                      <th 
                        className="p-2 sm:p-3 cursor-pointer hover:bg-gray-200 transition select-none font-semibold"
                        onClick={() => handleSort("totalTunjangan")}
                      >
                        Total {renderSortIndicator("totalTunjangan")}
                      </th>
                      <th className="p-2 sm:p-3 font-semibold">Status</th>
                      <th className="p-2 sm:p-3 font-semibold text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((item, idx) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-2 sm:p-3 text-gray-700 text-xs">{idx + 1}</td>
                        <td className="p-2 sm:p-3 font-semibold text-gray-800 text-xs">{item.nama}</td>
                        <td className="p-2 sm:p-3 text-gray-700 text-xs">{item.nip}</td>
                        <td className="p-2 sm:p-3 text-gray-700 text-xs">{item.jabatan}</td>
                        <td className="p-2 sm:p-3 text-gray-700 font-semibold text-xs">{item.golongan}</td>
                        <td className="p-2 sm:p-3 text-gray-700 text-xs">{formatCurrency(item.gajiPokok)}</td>
                        <td className="p-2 sm:p-3 text-gray-700 text-xs">{formatCurrency(item.tunjangan)}</td>
                        <td className="p-2 sm:p-3 text-gray-700 text-xs">{formatCurrency(item.potongan)}</td>
                        <td className="p-2 sm:p-3 text-gray-800 font-bold text-green-600 text-xs">
                          {formatCurrency(item.totalTunjangan)}
                        </td>
                        <td className="p-2 sm:p-3">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 inline-block">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3">
                          <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                            <button
                              onClick={() => openPopup("view", item)}
                              className="px-2 sm:px-3 py-1 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-full text-xs transition duration-200 transform hover:scale-105"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openPopup("edit", item)}
                              className="px-2 sm:px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-full text-xs transition duration-200 transform hover:scale-105"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openPopup("delete", item)}
                              className="px-2 sm:px-3 py-1 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-full text-xs transition duration-200 transform hover:scale-105"
                            >
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tablet View (md and sm) */}
            {!loading && sortedData.length > 0 && (
              <div className="hidden md:block lg:hidden overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="p-2 font-semibold">No</th>
                      <th className="p-2 font-semibold">Nama</th>
                      <th className="p-2 font-semibold">NIP</th>
                      <th className="p-2 font-semibold">Golongan</th>
                      <th className="p-2 font-semibold">Total</th>
                      <th className="p-2 font-semibold text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((item, idx) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-2 text-gray-700">{idx + 1}</td>
                        <td className="p-2 font-semibold text-gray-800">{item.nama}</td>
                        <td className="p-2 text-gray-700">{item.nip}</td>
                        <td className="p-2 text-gray-700 font-semibold">{item.golongan}</td>
                        <td className="p-2 text-green-600 font-bold">{formatCurrency(item.totalTunjangan)}</td>
                        <td className="p-2">
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={() => openPopup("view", item)}
                              className="px-2 py-1 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-full text-xs transition"
                            >
                              V
                            </button>
                            <button
                              onClick={() => openPopup("edit", item)}
                              className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-full text-xs transition"
                            >
                              E
                            </button>
                            <button
                              onClick={() => openPopup("delete", item)}
                              className="px-2 py-1 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-full text-xs transition"
                            >
                              D
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile Card View (sm and below) */}
            {!loading && sortedData.length > 0 && (
              <div className="md:hidden space-y-2 sm:space-y-3">
                {sortedData.map((item, idx) => (
                  <Card key={item.id} className="p-3 sm:p-4 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-gray-800">#{idx + 1}</p>
                        <p className="text-sm sm:text-base font-bold text-gray-800 mt-1 truncate">{item.nama}</p>
                        <p className="text-xs text-gray-500 mt-0.5">NIP: {item.nip}</p>
                        <p className="text-xs text-gray-500">Gol: {item.golongan}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap ml-2 flex-shrink-0">
                        {item.status}
                      </span>
                    </div>

                    <div className="space-y-1 sm:space-y-2 text-xs mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                      <div className="grid grid-cols-2 gap-1 sm:gap-2">
                        <div>
                          <p className="font-semibold text-gray-600">Jabatan:</p>
                          <p className="text-gray-700 text-xs">{item.jabatan}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Gaji Pokok:</p>
                          <p className="text-gray-700 text-xs">{formatCurrency(item.gajiPokok)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1 sm:gap-2">
                        <div>
                          <p className="font-semibold text-gray-600">Tunjangan:</p>
                          <p className="text-gray-700 text-xs">{formatCurrency(item.tunjangan)}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Potongan:</p>
                          <p className="text-gray-700 text-xs">{formatCurrency(item.potongan)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-green-600">Total Tunjangan:</p>
                        <p className="text-green-700 font-bold text-sm">{formatCurrency(item.totalTunjangan)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 sm:gap-1">
                      <button
                        onClick={() => openPopup("view", item)}
                        className="flex-1 px-2 py-2 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-full text-xs transition"
                      >
                        👁️ V
                      </button>
                      <button
                        onClick={() => openPopup("edit", item)}
                        className="flex-1 px-2 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-full text-xs transition"
                      >
                        ✏️ E
                      </button>
                      <button
                        onClick={() => openPopup("delete", item)}
                        className="flex-1 px-2 py-2 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-full text-xs transition"
                      >
                        🗑️ D
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && sortedData.length === 0 && data.length > 0 && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-sm sm:text-lg">
                  📭 Tidak ada hasil pencarian
                </p>
              </div>
            )}

            {!loading && data.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-sm sm:text-lg font-semibold">
                  📭 Belum ada data
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">
                  Klik tombol "Tambah Data" untuk memulai
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Modal Popup */}
        {popup.open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 my-4 sm:my-8"
            >
              {/* VIEW MODE */}
              {popup.mode === "view" && popup.data && (
                <>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
                    Detail Tunjangan
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 text-gray-700 mb-4 sm:mb-6 max-h-96 overflow-y-auto">
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-xs text-gray-500 font-semibold">Nama</p>
                      <p className="text-sm sm:text-base font-bold text-gray-800 mt-1">{popup.data.nama}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-xs text-gray-500 font-semibold">NIP</p>
                      <p className="text-sm sm:text-base font-bold text-gray-800 mt-1">{popup.data.nip}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-xs text-gray-500 font-semibold">Jabatan</p>
                      <p className="text-sm sm:text-base font-bold text-gray-800 mt-1">{popup.data.jabatan}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-xs text-gray-500 font-semibold">Golongan</p>
                      <p className="text-sm sm:text-base font-bold text-gray-800 mt-1">{popup.data.golongan}</p>
                    </div>
                    <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-xs text-blue-600 font-semibold">Gaji Pokok</p>
                      <p className="text-sm sm:text-base font-bold text-blue-700 mt-1">{formatCurrency(popup.data.gajiPokok)}</p>
                    </div>
                    <div className="bg-yellow-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-xs text-yellow-600 font-semibold">Tunjangan</p>
                      <p className="text-sm sm:text-base font-bold text-yellow-700 mt-1">{formatCurrency(popup.data.tunjangan)}</p>
                    </div>
                    <div className="bg-red-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-xs text-red-600 font-semibold">Potongan</p>
                      <p className="text-sm sm:text-base font-bold text-red-700 mt-1">{formatCurrency(popup.data.potongan)}</p>
                    </div>
                    <div className="bg-green-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-xs text-green-600 font-semibold">Total</p>
                      <p className="text-sm sm:text-base font-bold text-green-700 mt-1">{formatCurrency(popup.data.totalTunjangan)}</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-xs text-gray-500 font-semibold">Bulan/Tahun</p>
                      <p className="text-sm sm:text-base font-bold text-gray-800 mt-1">
                        {popup.data.bulan}/{popup.data.tahun}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={closePopup}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-xl py-2 text-sm sm:text-base"
                  >
                    Tutup
                  </Button>
                </>
              )}

              {/* ADD & EDIT MODE */}
              {(popup.mode === "add" || popup.mode === "edit") && (
                <>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
                    {popup.mode === "add" ? "Tambah Data" : "Edit Data"}
                  </h2>

                  <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto mb-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        Nama <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="border border-gray-300 rounded-xl px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="Nama"
                        value={formData.nama}
                        onChange={(e) => handleInputChange("nama", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        NIP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="border border-gray-300 rounded-xl px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="NIP"
                        value={formData.nip}
                        onChange={(e) => handleInputChange("nip", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                          Jabatan
                        </label>
                        <input
                          type="text"
                          className="border border-gray-300 rounded-xl px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          placeholder="Jabatan"
                          value={formData.jabatan}
                          onChange={(e) => handleInputChange("jabatan", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                          Golongan
                        </label>
                        <input
                          type="text"
                          className="border border-gray-300 rounded-xl px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          placeholder="III/c"
                          value={formData.golongan}
                          onChange={(e) => handleInputChange("golongan", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                          Gaji Pokok
                        </label>
                        <input
                          type="number"
                          className="border border-gray-300 rounded-xl px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          placeholder="0"
                          value={formData.gajiPokok}
                          onChange={(e) => handleInputChange("gajiPokok", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                          Tunjangan
                        </label>
                        <input
                          type="number"
                          className="border border-gray-300 rounded-xl px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          placeholder="0"
                          value={formData.tunjangan}
                          onChange={(e) => handleInputChange("tunjangan", Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                          Potongan
                        </label>
                        <input
                          type="number"
                          className="border border-gray-300 rounded-xl px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          placeholder="0"
                          value={formData.potongan}
                          onChange={(e) => handleInputChange("potongan", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                          Total (Auto)
                        </label>
                        <div className="border border-gray-300 rounded-xl px-3 py-2 w-full bg-green-50 text-green-700 font-bold text-sm">
                          {formatCurrency(calculateTotal())}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                          Bulan
                        </label>
                        <select
                          className="border border-gray-300 rounded-xl px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          value={formData.bulan}
                          onChange={(e) => handleInputChange("bulan", e.target.value)}
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                              {new Date(2024, i).toLocaleString("id-ID", { month: "short" })}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                          Tahun
                        </label>
                        <select
                          className="border border-gray-300 rounded-xl px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          value={formData.tahun}
                          onChange={(e) => handleInputChange("tahun", e.target.value)}
                        >
                          {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            return (
                              <option key={year} value={String(year)}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        className="border border-gray-300 rounded-xl px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={formData.status}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Non-Aktif">Non-Aktif</option>
                        <option value="Cuti">Cuti</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 text-sm sm:text-base"
                    >
                      Simpan
                    </Button>

                    <Button
                      onClick={closePopup}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl py-2 text-sm sm:text-base"
                    >
                      Batal
                    </Button>
                  </div>
                </>
              )}

              {/* DELETE MODE */}
              {popup.mode === "delete" && popup.data && (
                <>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-red-600">
                    Hapus Data
                  </h2>
                  <p className="text-gray-700 mb-6 text-sm">
                    Yakin hapus tunjangan <strong>{popup.data.nama}</strong>?
                  </p>

                  <div className="flex gap-2 sm:gap-3">
                    <Button
                      onClick={() => handleDelete(popup.data!.id!)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 text-sm sm:text-base"
                    >
                      Hapus
                    </Button>

                    <Button
                      onClick={closePopup}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl py-2 text-sm sm:text-base"
                    >
                      Batal
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}