import React, { useState, useEffect } from "react";
import { Button, Card } from "flowbite-react";
import { motion } from "framer-motion";
import "flowbite";

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
  const [sortField, setSortField] = useState<"nama" | "nip" | "golongan" | "totalTunjangan" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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
  const handleSort = (field: "nama" | "nip" | "golongan" | "totalTunjangan") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: "nama" | "nip" | "golongan" | "totalTunjangan" | null) => {
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
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">💰 Perhitungan Tunjangan PAS</h1>

        <Card className="shadow-lg rounded-2xl">
          <div>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Cari data tunjangan..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <Card className="bg-blue-100 rounded-2xl shadow p-4 text-center">
                <p className="text-sm text-gray-600">Total Data</p>
                <p className="text-2xl font-bold text-blue-700">{data.length}</p>
              </Card>
              <Card className="bg-green-100 rounded-2xl shadow p-4 text-center">
                <p className="text-sm text-gray-600">Gaji Pokok</p>
                <p className="text-xs font-bold text-green-700">{formatCurrency(totalGajiPokok)}</p>
              </Card>
              <Card className="bg-yellow-100 rounded-2xl shadow p-4 text-center">
                <p className="text-sm text-gray-600">Tunjangan</p>
                <p className="text-xs font-bold text-yellow-700">{formatCurrency(totalTunjangan)}</p>
              </Card>
              <Card className="bg-red-100 rounded-2xl shadow p-4 text-center">
                <p className="text-sm text-gray-600">Potongan</p>
                <p className="text-xs font-bold text-red-700">{formatCurrency(totalPotongan)}</p>
              </Card>
              <Card className="bg-purple-100 rounded-2xl shadow p-4 text-center flex items-center justify-center">
                <Button
                  onClick={() => openPopup("add")}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-6 py-3"
                >
                  + Tambah Data
                </Button>
              </Card>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Memuat data...</p>
              </div>
            )}

            {/* Responsive Table */}
            {!loading && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[1000px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3">No</th>
                      <th 
                        className="p-3 cursor-pointer hover:bg-gray-200 transition select-none"
                        onClick={() => handleSort("nama")}
                      >
                        Nama {renderSortIndicator("nama")}
                      </th>
                      <th className="p-3">NIP</th>
                      <th className="p-3">Jabatan</th>
                      <th 
                        className="p-3 cursor-pointer hover:bg-gray-200 transition select-none"
                        onClick={() => handleSort("golongan")}
                      >
                        Golongan {renderSortIndicator("golongan")}
                      </th>
                      <th className="p-3">Gaji Pokok</th>
                      <th className="p-3">Tunjangan</th>
                      <th className="p-3">Potongan</th>
                      <th 
                        className="p-3 cursor-pointer hover:bg-gray-200 transition select-none"
                        onClick={() => handleSort("totalTunjangan")}
                      >
                        Total {renderSortIndicator("totalTunjangan")}
                      </th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.length > 0 ? (
                      sortedData.map((item, idx) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{idx + 1}</td>
                          <td className="p-3 font-semibold">{item.nama}</td>
                          <td className="p-3">{item.nip}</td>
                          <td className="p-3">{item.jabatan}</td>
                          <td className="p-3 font-semibold">{item.golongan}</td>
                          <td className="p-3 text-xs">{formatCurrency(item.gajiPokok)}</td>
                          <td className="p-3 text-xs">{formatCurrency(item.tunjangan)}</td>
                          <td className="p-3 text-xs">{formatCurrency(item.potongan)}</td>
                          <td className="p-3 text-xs font-bold text-green-600">
                            {formatCurrency(item.totalTunjangan)}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                onClick={() => openPopup("view", item)}
                                size="xs"
                                className="bg-blue-300 hover:bg-blue-400 text-black rounded-xl"
                              >
                                View
                              </Button>
                              <Button
                                onClick={() => openPopup("edit", item)}
                                size="xs"
                                className="bg-yellow-300 hover:bg-yellow-400 text-black rounded-xl"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => openPopup("delete", item)}
                                size="xs"
                                className="bg-red-300 hover:bg-red-400 text-black rounded-xl"
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={11} className="p-6 text-center text-gray-500">
                          Tidak ada data tunjangan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        {/* Modal Popup */}
        {popup.open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white p-6 rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 my-8"
            >
              {/* VIEW MODE */}
              {popup.mode === "view" && popup.data && (
                <>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Detail Tunjangan PAS
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 font-semibold">Nama</p>
                      <p className="text-sm font-bold text-gray-800">{popup.data.nama}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 font-semibold">NIP</p>
                      <p className="text-sm font-bold text-gray-800">{popup.data.nip}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 font-semibold">Jabatan</p>
                      <p className="text-sm font-bold text-gray-800">{popup.data.jabatan}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 font-semibold">Golongan</p>
                      <p className="text-sm font-bold text-gray-800">{popup.data.golongan}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 font-semibold">Gaji Pokok</p>
                      <p className="text-sm font-bold text-blue-700">{formatCurrency(popup.data.gajiPokok)}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-xs text-yellow-600 font-semibold">Tunjangan</p>
                      <p className="text-sm font-bold text-yellow-700">{formatCurrency(popup.data.tunjangan)}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-xs text-red-600 font-semibold">Potongan</p>
                      <p className="text-sm font-bold text-red-700">{formatCurrency(popup.data.potongan)}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-600 font-semibold">Total</p>
                      <p className="text-sm font-bold text-green-700">{formatCurrency(popup.data.totalTunjangan)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 font-semibold">Bulan/Tahun</p>
                      <p className="text-sm font-bold text-gray-800">
                        {popup.data.bulan}/{popup.data.tahun}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={closePopup}
                    className="mt-6 w-full bg-gray-800 hover:bg-gray-900 text-white rounded-xl py-2"
                  >
                    Tutup
                  </Button>
                </>
              )}

              {/* ADD & EDIT MODE */}
              {(popup.mode === "add" || popup.mode === "edit") && (
                <>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {popup.mode === "add" ? "Tambah Data Tunjangan" : "Edit Data Tunjangan"}
                  </h2>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Nama"
                      value={formData.nama}
                      onChange={(e) => handleInputChange("nama", e.target.value)}
                    />
                    <input
                      type="text"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="NIP"
                      value={formData.nip}
                      onChange={(e) => handleInputChange("nip", e.target.value)}
                    />
                    <input
                      type="text"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Jabatan"
                      value={formData.jabatan}
                      onChange={(e) => handleInputChange("jabatan", e.target.value)}
                    />
                    <input
                      type="text"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Golongan"
                      value={formData.golongan}
                      onChange={(e) => handleInputChange("golongan", e.target.value)}
                    />
                    <input
                      type="number"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Gaji Pokok"
                      value={formData.gajiPokok}
                      onChange={(e) => handleInputChange("gajiPokok", Number(e.target.value))}
                    />
                    <input
                      type="number"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Tunjangan"
                      value={formData.tunjangan}
                      onChange={(e) => handleInputChange("tunjangan", Number(e.target.value))}
                    />
                    <input
                      type="number"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Potongan"
                      value={formData.potongan}
                      onChange={(e) => handleInputChange("potongan", Number(e.target.value))}
                    />
                    <div className="bg-green-50 border border-green-200 p-3 rounded-xl">
                      <p className="text-xs text-green-600 font-semibold mb-1">Total Tunjangan (Otomatis)</p>
                      <p className="text-lg font-bold text-green-700">{formatCurrency(calculateTotal())}</p>
                    </div>
                    <select
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      value={formData.bulan}
                      onChange={(e) => handleInputChange("bulan", e.target.value)}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                          {new Date(2024, i).toLocaleString("id-ID", { month: "long" })}
                        </option>
                      ))}
                    </select>
                    <select
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                    <select
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Non-Aktif">Non-Aktif</option>
                      <option value="Cuti">Cuti</option>
                    </select>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full mt-6 mb-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2"
                  >
                    Simpan
                  </Button>

                  <Button
                    onClick={closePopup}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl py-2"
                  >
                    Batal
                  </Button>
                </>
              )}

              {/* DELETE MODE */}
              {popup.mode === "delete" && popup.data && (
                <>
                  <h2 className="text-2xl font-semibold mb-4 text-red-600">
                    Hapus Data Tunjangan
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Yakin ingin menghapus tunjangan{" "}
                    <strong>{popup.data.nama}</strong>?
                  </p>

                  <Button
                    onClick={() => handleDelete(popup.data!.id!)}
                    className="w-full mb-3 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2"
                  >
                    Hapus
                  </Button>

                  <Button
                    onClick={closePopup}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl py-2"
                  >
                    Batal
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}