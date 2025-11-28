import React, { useState, useEffect } from "react";
import { Button, Card } from "flowbite-react";
import { motion } from "framer-motion";
import "flowbite";
import pegawaiAPI from "../../api/pegawai";
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

export default function DaftarPegawai() {
  const [pegawai, setPegawai] = useState<Pegawai[]>([]);
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

  // Fetch data pegawai
  const fetchPegawai = async () => {
    try {
      setLoading(true);
      const response = await pegawaiAPI.getAll();
      setPegawai(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error("Gagal memuat data pegawai", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // Filter pegawai berdasarkan search
  const filteredPegawai = pegawai.filter(
    (p) =>
      p.nama.toLowerCase().includes(filter.toLowerCase()) ||
      p.nip.includes(filter)
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
      // Toggle sort order jika kolom yang sama diklik
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set kolom baru dan reset ke ascending
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
        const response = await pegawaiAPI.create(formData);
        setPegawai([...pegawai, response.data]);
      } else if (popup.mode === "edit" && popup.data) {
        const response = await pegawaiAPI.update(popup.data.id!, formData);
        setPegawai(
          pegawai.map((p) => (p.id === popup.data?.id ? response.data : p))
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
      await pegawaiAPI.delete(id);
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
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">📋 Daftar Pegawai</h1>

        <Card className="shadow-lg rounded-2xl">
          <div>
            {/* Search Bar & Sort Info */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <input
                type="text"
                placeholder="Cari pegawai (nama atau NIP)..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-blue-100 rounded-2xl shadow p-4 text-center">
                <p className="text-sm text-gray-600">Total Pegawai</p>
                <p className="text-2xl font-bold text-blue-700">
                  {pegawai.length}
                </p>
              </Card>
              <Card className="bg-blue-100 rounded-2xl shadow p-4 text-center">
                <p className="text-sm text-gray-600">Departemen Berbeda</p>
                <p className="text-2xl font-bold text-blue-700">
                  {new Set(pegawai.map((p) => p.departemen)).size}
                </p>
              </Card>
              <Card className="bg-blue-100 rounded-2xl shadow p-4 text-center flex items-center justify-center">
                <Button
                  onClick={() => openPopup("add")}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-6 py-3"
                >
                  + Tambah Pegawai
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
                <table className="w-full text-left text-sm min-w-[900px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th 
                        className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-semibold"
                        onClick={() => handleSort("nama")}
                      >
                        Nama {renderSortIndicator("nama")}
                      </th>
                      <th 
                        className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-semibold"
                        onClick={() => handleSort("nip")}
                      >
                        NIP {renderSortIndicator("nip")}
                      </th>
                      <th 
                        className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-semibold"
                        onClick={() => handleSort("jabatan")}
                      >
                        Jabatan {renderSortIndicator("jabatan")}
                      </th>
                      <th 
                        className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-semibold"
                        onClick={() => handleSort("departemen")}
                      >
                        Departemen {renderSortIndicator("departemen")}
                      </th>
                      <th 
                        className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-semibold"
                        onClick={() => handleSort("email")}
                      >
                        Email {renderSortIndicator("email")}
                      </th>
                      <th className="p-3 font-semibold">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedPegawai.length > 0 ? (
                      sortedPegawai.map((p) => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-semibold">{p.nama}</td>
                          <td className="p-3">{p.nip}</td>
                          <td className="p-3">{p.jabatan}</td>
                          <td className="p-3">{p.departemen}</td>
                          <td className="p-3 text-xs">{p.email}</td>

                          <td className="p-3">
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                onClick={() => openPopup("view", p)}
                                size="xs"
                                className="bg-blue-300 hover:bg-blue-400 text-black rounded-xl"
                              >
                                View
                              </Button>
                              <Button
                                onClick={() => openPopup("edit", p)}
                                size="xs"
                                className="bg-yellow-300 hover:bg-yellow-400 text-black rounded-xl"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => openPopup("delete", p)}
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
                        <td colSpan={6} className="p-6 text-center text-gray-500">
                          Tidak ada data pegawai
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
              className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 my-8"
            >
              {/* VIEW MODE */}
              {popup.mode === "view" && popup.data && (
                <>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Detail Pegawai
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Nama:</strong> {popup.data.nama}
                    </p>
                    <p>
                      <strong>NIP:</strong> {popup.data.nip}
                    </p>
                    <p>
                      <strong>Jabatan:</strong> {popup.data.jabatan}
                    </p>
                    <p>
                      <strong>Departemen:</strong> {popup.data.departemen}
                    </p>
                    <p>
                      <strong>Email:</strong> {popup.data.email}
                    </p>
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
                    {popup.mode === "add" ? "➕ Tambah Pegawai" : "✏️ Edit Pegawai"}
                  </h2>

                  <div className="space-y-3">
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
                      placeholder="Departemen"
                      value={formData.departemen}
                      onChange={(e) => handleInputChange("departemen", e.target.value)}
                    />
                    <input
                      type="email"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
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
                    🗑️ Hapus Pegawai
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Yakin ingin menghapus{" "}
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
    </MainLayout>
  );
}