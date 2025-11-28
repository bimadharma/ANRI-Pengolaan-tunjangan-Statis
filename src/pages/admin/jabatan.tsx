import { useState } from "react";
import { Button, Card } from "flowbite-react";
import { motion } from "framer-motion";
import "flowbite";
import MainLayout from "../../components/layout/MainLayout";

// Interface untuk tipe data
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
  const [employees, setEmployees] = useState<Employee[]>(
    [
      {
        id: 1,
        name: "Budi",
        position: "Developer",
        email: "budi@example.com",
        status: "Aktif",
        salary: "8.000.000",
        startDate: "2021-05-10",
      },
      {
        id: 2,
        name: "Sinta",
        position: "Designer",
        email: "sinta@example.com",
        status: "Cuti",
        salary: "7.500.000",
        startDate: "2022-01-18",
      },
    ]
  );

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
    e.name.toLowerCase().includes(filter.toLowerCase())
  );

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

  return (
    <MainLayout isAdmin={true}>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Jabatan Pegawai</h1>

        <Card className="shadow-lg rounded-2xl">
          <div>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Cari pegawai..."
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
                  {employees.length}
                </p>
              </Card>
              <Card className="bg-blue-100 rounded-2xl shadow p-4 text-center">
                <p className="text-sm text-gray-600">Jabatan Berbeda</p>
                <p className="text-2xl font-bold text-blue-700">
                  {new Set(employees.map((e) => e.position)).size}
                </p>
              </Card>
              <Card className="bg-blue-100 rounded-2xl shadow p-4 text-center flex items-center justify-center">
                <Button
                  onClick={() => openPopup("add")}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-6 py-3"
                >
                  Tambah Pegawai
                </Button>
              </Card>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[900px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Nama</th>
                    <th className="p-3">Posisi</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Gaji</th>
                    <th className="p-3">Tanggal Masuk</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((emp) => (
                      <tr key={emp.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{emp.name}</td>
                        <td className="p-3">{emp.position}</td>
                        <td className="p-3">{emp.email}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              emp.status === "Aktif"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="p-3">Rp {emp.salary}</td>
                        <td className="p-3">{emp.startDate}</td>

                        <td className="p-3">
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              onClick={() => openPopup("view", emp)}
                              size="xs"
                              className="bg-blue-300 hover:bg-blue-400 text-black rounded-xl"
                            >
                              View
                            </Button>
                            <Button
                              onClick={() => openPopup("edit", emp)}
                              size="xs"
                              className="bg-yellow-300 hover:bg-yellow-400 text-black rounded-xl"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => openPopup("delete", emp)}
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
                      <td colSpan={7} className="p-6 text-center text-gray-500">
                        Tidak ada data pegawai
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                      <strong>Nama:</strong> {popup.data.name}
                    </p>
                    <p>
                      <strong>Posisi:</strong> {popup.data.position}
                    </p>
                    <p>
                      <strong>Email:</strong> {popup.data.email}
                    </p>
                    <p>
                      <strong>Status:</strong> {popup.data.status}
                    </p>
                    <p>
                      <strong>Gaji:</strong> Rp {popup.data.salary}
                    </p>
                    <p>
                      <strong>Tanggal Masuk:</strong> {popup.data.startDate}
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
                    {popup.mode === "add" ? "Tambah Pegawai" : "Edit Pegawai"}
                  </h2>

                  <div className="space-y-3">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Nama"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                    <input
                      type="text"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Posisi"
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                    />
                    <input
                      type="email"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                    <select
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                    >
                      <option value="">Pilih Status</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Cuti">Cuti</option>
                      <option value="Non-Aktif">Non-Aktif</option>
                    </select>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Gaji (contoh: 8.000.000)"
                      value={formData.salary}
                      onChange={(e) => handleInputChange("salary", e.target.value)}
                    />
                    <input
                      type="date"
                      className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Tanggal Masuk"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
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
                    Hapus Pegawai
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Yakin ingin menghapus{" "}
                    <strong>{popup.data.name}</strong>?
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
