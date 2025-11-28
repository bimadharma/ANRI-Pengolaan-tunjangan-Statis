import { useState } from "react";
import { Button } from "flowbite-react";
import { motion } from "framer-motion";
import MainLayout from "../../components/layout/MainLayout";

// Interface untuk tipe data
interface UnitKerja {
  id: number;
  nama_unit_kerja: string;
  eselon: string;
  kode_unit: string;
}

interface PopupState {
  open: boolean;
  mode: string;
  data: UnitKerja | null;
}

interface FormData {
  nama_unit_kerja: string;
  eselon: string;
  kode_unit: string;
}

type SortKey = keyof UnitKerja;
type SortOrder = "asc" | "desc";

export default function UnitKerjaPage() {
  const [unitKerja, setUnitKerja] = useState<UnitKerja[]>([
    { id: 1, nama_unit_kerja: "Sekretariat Utama", eselon: "Eselon I", kode_unit: "SU-01" },
    { id: 2, nama_unit_kerja: "Pusat Pengolahan Arsip", eselon: "Eselon II", kode_unit: "PPA-02" },
    { id: 3, nama_unit_kerja: "Bidang Layanan Arsip", eselon: "Eselon III", kode_unit: "BLA-05" }
  ]);

  const [search, setSearch] = useState<string>("");
  const [filterEselon, setFilterEselon] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [popup, setPopup] = useState<PopupState>({ open: false, mode: "", data: null });
  const [formData, setFormData] = useState<FormData>({
    nama_unit_kerja: "",
    eselon: "",
    kode_unit: ""
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredData = unitKerja
    .filter((u) => {
      const matchesSearch = u.nama_unit_kerja.toLowerCase().includes(search.toLowerCase()) ||
                           u.kode_unit.toLowerCase().includes(search.toLowerCase());
      const matchesEselon = filterEselon ? u.eselon === filterEselon : true;
      return matchesSearch && matchesEselon;
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

  const openPopup = (mode: string, data: UnitKerja | null = null) => {
    setFormData(data || {
      nama_unit_kerja: "",
      eselon: "",
      kode_unit: ""
    });
    setPopup({ open: true, mode, data });
  };

  const closePopup = () => {
    setPopup({ open: false, mode: "", data: null });
    setFormData({ nama_unit_kerja: "", eselon: "", kode_unit: "" });
  };

  const handleSubmit = () => {
    // Validasi form
    if (!formData.nama_unit_kerja.trim()) {
      alert("Nama Unit Kerja harus diisi!");
      return;
    }
    if (!formData.eselon) {
      alert("Eselon harus dipilih!");
      return;
    }
    if (!formData.kode_unit.trim()) {
      alert("Kode Unit harus diisi!");
      return;
    }

    if (popup.mode === "add") {
      setUnitKerja([...unitKerja, { id: Date.now(), ...formData }]);
    } else if (popup.mode === "edit" && popup.data) {
      setUnitKerja(unitKerja.map((u) =>
        u.id === popup.data?.id ? { ...u, ...formData } : u
      ));
    }
    closePopup();
  };

  const handleDelete = (id: number) => {
    setUnitKerja(unitKerja.filter((u) => u.id !== id));
    closePopup();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) {
      return <span className="text-gray-400">⇅</span>;
    }
    return sortOrder === "asc" ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <MainLayout isAdmin={true}>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Unit Kerja</h1>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          {/* Search & Filter Bar */}
          <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                placeholder="Cari unit kerja atau kode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />

              <select
                className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={filterEselon}
                onChange={(e) => setFilterEselon(e.target.value)}
              >
                <option value="">Semua Eselon</option>
                <option value="Eselon I">Eselon I</option>
                <option value="Eselon II">Eselon II</option>
                <option value="Eselon III">Eselon III</option>
                <option value="Eselon IV">Eselon IV</option>
                <option value="Non-Eselon">Non-Eselon</option>
              </select>
            </div>

            <Button
              onClick={() => openPopup("add")}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 py-2"
            >
              + Tambah Data
            </Button>
          </div>

          {/* Statistics */}
          <div className="mb-4 text-sm text-gray-600">
            Menampilkan <strong>{filteredData.length}</strong> dari <strong>{unitKerja.length}</strong> data
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead className="bg-gray-100">
                <tr>
                  <th 
                    className="p-3 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-2">
                      ID <SortIcon column="id" />
                    </div>
                  </th>
                  <th 
                    className="p-3 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort("nama_unit_kerja")}
                  >
                    <div className="flex items-center gap-2">
                      Nama Unit Kerja <SortIcon column="nama_unit_kerja" />
                    </div>
                  </th>
                  <th 
                    className="p-3 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort("eselon")}
                  >
                    <div className="flex items-center gap-2">
                      Eselon <SortIcon column="eselon" />
                    </div>
                  </th>
                  <th 
                    className="p-3 cursor-pointer hover:bg-gray-200 select-none"
                    onClick={() => handleSort("kode_unit")}
                  >
                    <div className="flex items-center gap-2">
                      Kode Unit <SortIcon column="kode_unit" />
                    </div>
                  </th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{u.id}</td>
                      <td className="p-3">{u.nama_unit_kerja}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          u.eselon === "Eselon I" ? "bg-red-100 text-red-700" :
                          u.eselon === "Eselon II" ? "bg-orange-100 text-orange-700" :
                          u.eselon === "Eselon III" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {u.eselon}
                        </span>
                      </td>
                      <td className="p-3">{u.kode_unit}</td>
                      <td className="p-3">
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            onClick={() => openPopup("view", u)}
                            size="xs"
                            className="bg-blue-300 hover:bg-blue-400 text-black rounded-xl"
                          >
                            View
                          </Button>
                          <Button
                            onClick={() => openPopup("edit", u)}
                            size="xs"
                            className="bg-yellow-300 hover:bg-yellow-400 text-black rounded-xl"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => openPopup("delete", u)}
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
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      Tidak ada data unit kerja
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Detail Unit Kerja</h2>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>ID:</strong> {popup.data.id}</p>
                    <p><strong>Nama Unit Kerja:</strong> {popup.data.nama_unit_kerja}</p>
                    <p><strong>Eselon:</strong> {popup.data.eselon}</p>
                    <p><strong>Kode Unit:</strong> {popup.data.kode_unit}</p>
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
                    {popup.mode === "add" ? "Tambah Unit Kerja" : "Edit Unit Kerja"}
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Unit Kerja <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="Nama Unit Kerja"
                        value={formData.nama_unit_kerja}
                        onChange={(e) => handleInputChange("nama_unit_kerja", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Eselon <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={formData.eselon}
                        onChange={(e) => handleInputChange("eselon", e.target.value)}
                      >
                        <option value="">Pilih Eselon</option>
                        <option value="Eselon I">Eselon I</option>
                        <option value="Eselon II">Eselon II</option>
                        <option value="Eselon III">Eselon III</option>
                        <option value="Eselon IV">Eselon IV</option>
                        <option value="Non-Eselon">Non-Eselon</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kode Unit <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="Kode Unit (contoh: SU-01)"
                        value={formData.kode_unit}
                        onChange={(e) => handleInputChange("kode_unit", e.target.value)}
                      />
                    </div>
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
                  <h2 className="text-2xl font-semibold mb-4 text-red-600">Hapus Unit Kerja</h2>
                  <p className="text-gray-700 mb-6">
                    Yakin ingin menghapus <strong>{popup.data.nama_unit_kerja}</strong>?
                  </p>

                  <Button
                    onClick={() => handleDelete(popup.data!.id)}
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
