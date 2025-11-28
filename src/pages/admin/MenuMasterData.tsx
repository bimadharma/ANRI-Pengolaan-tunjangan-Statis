import React, { useState, useEffect } from "react";
import { Button, Card } from "flowbite-react";
import { motion } from "framer-motion";
import "flowbite";
import MainLayout from "../../components/layout/MainLayout";

// Interface untuk Master Data (Generic)
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

export default function MenuMasterData() {
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

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("");
  const [popup, setPopup] = useState<PopupState>({
    open: false,
    mode: "",
    data: null,
  });
  const [formData, setFormData] = useState<MasterDataItem>({
    kode: "",
    nama: "",
    deskripsi: "",
    status: "Aktif",
  });

  // Filter data berdasarkan search
  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(filter.toLowerCase()) ||
      item.kode.toLowerCase().includes(filter.toLowerCase())
  );

  // Open Popup
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

  // Close Popup
  const closePopup = () => {
    setPopup({ open: false, mode: "", data: null });
    setFormData({
      kode: "",
      nama: "",
      deskripsi: "",
      status: "Aktif",
    });
  };

  // Handle Submit (Add/Edit)
  const handleSubmit = () => {
    if (!formData.kode.trim() || !formData.nama.trim()) {
      alert("Kode dan Nama wajib diisi!");
      return;
    }

    try {
      if (popup.mode === "add") {
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
          data.map((item) =>
            item.id === popup.data?.id ? { ...item, ...formData } : item
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
  const handleInputChange = (field: keyof MasterDataItem, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <MainLayout isAdmin={true}>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">📊 Master Data</h1>

        <Card className="shadow-lg rounded-2xl">
          <div>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Cari data master..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-blue-100 rounded-2xl shadow p-4 text-center">
                <p className="text-sm text-gray-600">Total Data</p>
                <p className="text-2xl font-bold text-blue-700">
                  {data.length}
                </p>
              </Card>
              <Card className="bg-blue-100 rounded-2xl shadow p-4 text-center">
                <p className="text-sm text-gray-600">Status Aktif</p>
                <p className="text-2xl font-bold text-blue-700">
                  {data.filter((d) => d.status === "Aktif").length}
                </p>
              </Card>
              <Card className="bg-blue-100 rounded-2xl shadow p-4 text-center flex items-center justify-center">
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
                <table className="w-full text-left text-sm min-w-[900px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3">Kode</th>
                      <th className="p-3">Nama</th>
                      <th className="p-3">Deskripsi</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Dibuat</th>
                      <th className="p-3">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-semibold">{item.kode}</td>
                          <td className="p-3">{item.nama}</td>
                          <td className="p-3 text-xs">{item.deskripsi}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                item.status === "Aktif"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-xs">{item.createdAt}</td>

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
                        <td colSpan={6} className="p-6 text-center text-gray-500">
                          Tidak ada data master
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
                    Detail Data
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Kode:</strong> {popup.data.kode}
                    </p>
                    <p>
                      <strong>Nama:</strong> {popup.data.nama}
                    </p>
                    <p>
                      <strong>Deskripsi:</strong> {popup.data.deskripsi}
                    </p>
                    <p>
                      <strong>Status:</strong> {popup.data.status}
                    </p>
                    <p>
                      <strong>Dibuat:</strong> {popup.data.createdAt}
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
                    {popup.mode === "add" ? "Tambah Data" : "Edit Data"}
                  </h2>

                  <div className="space-y-3">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Kode"
                      value={formData.kode}
                      onChange={(e) =>
                        handleInputChange("kode", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Nama"
                      value={formData.nama}
                      onChange={(e) =>
                        handleInputChange("nama", e.target.value)
                      }
                    />
                    <textarea
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Deskripsi"
                      rows={3}
                      value={formData.deskripsi}
                      onChange={(e) =>
                        handleInputChange("deskripsi", e.target.value)
                      }
                    />
                    <select
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                    >
                      <option value="">Pilih Status</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Non-Aktif">Non-Aktif</option>
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
                    Hapus Data
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