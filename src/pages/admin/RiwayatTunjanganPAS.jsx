// ...existing code...
import React, { useState } from "react";
import { Button, Card } from "flowbite-react";
import { motion } from "framer-motion";
import "flowbite";
import MainLayout from "../../components/layout/MainLayout";

/**
 * RiwayatTunjanganPAS.jsx
 * - Tabel riwayat tunjangan PAS dengan fitur CRUD (mock data)
 * - Responsive: desktop table, tablet compact table, mobile cards
 * - Styling mengikuti pola jabatan.tsx (Tailwind + Flowbite)
 */

function sampleData() {
  return [
    {
      id: 1,
      nama: "Budi Santoso",
      nip: "19850315198603001",
      jabatan: "Kepala Bagian",
      golongan: "III/c",
      gajiPokok: 5000000,
      tunjangan: 1500000,
      potongan: 250000,
      total: 6250000,
      bulan: "01",
      tahun: "2024",
      status: "Aktif",
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
      total: 4350000,
      bulan: "01",
      tahun: "2024",
      status: "Aktif",
    },
  ];
}

export default function RiwayatTunjanganPAS() {
  const [items, setItems] = useState(sampleData());
  const [filter, setFilter] = useState("");
  const [popup, setPopup] = useState({ open: false, mode: "", data: null });
  const [form, setForm] = useState({
    id: null,
    nama: "",
    nip: "",
    jabatan: "",
    golongan: "",
    gajiPokok: 0,
    tunjangan: 0,
    potongan: 0,
    bulan: "01",
    tahun: new Date().getFullYear().toString(),
    status: "Aktif",
  });

  const formatCurrency = (v) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

  const openAdd = () => {
    setForm({
      id: null,
      nama: "",
      nip: "",
      jabatan: "",
      golongan: "",
      gajiPokok: 0,
      tunjangan: 0,
      potongan: 0,
      bulan: "01",
      tahun: new Date().getFullYear().toString(),
      status: "Aktif",
    });
    setPopup({ open: true, mode: "add", data: null });
  };

  const openEdit = (it) => {
    setForm({ ...it });
    setPopup({ open: true, mode: "edit", data: it });
  };

  const openView = (it) => {
    setForm({ ...it });
    setPopup({ open: true, mode: "view", data: it });
  };

  const openDelete = (it) => {
    setForm({ ...it });
    setPopup({ open: true, mode: "delete", data: it });
  };

  const closePopup = () => setPopup({ open: false, mode: "", data: null });

  const handleSave = () => {
    // basic validation
    if (!form.nama || !form.nip) {
      alert("Nama dan NIP wajib diisi");
      return;
    }
    const total = Number(form.gajiPokok || 0) + Number(form.tunjangan || 0) - Number(form.potongan || 0);

    if (popup.mode === "add") {
      const newItem = { ...form, id: Date.now(), total };
      setItems((s) => [newItem, ...s]);
    } else if (popup.mode === "edit") {
      setItems((s) => s.map((x) => (x.id === form.id ? { ...form, total } : x)));
    }
    closePopup();
  };

  const handleDeleteConfirm = () => {
    if (!form.id) return;
    setItems((s) => s.filter((x) => x.id !== form.id));
    closePopup();
  };

  const filtered = items.filter(
    (it) =>
      it.nama.toLowerCase().includes(filter.toLowerCase()) ||
      it.nip.includes(filter) ||
      it.jabatan.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <MainLayout isAdmin={true}>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Riwayat Tunjangan PAS</h1>

        <Card className="shadow rounded-2xl">
          <div className="mb-4 flex flex-col sm:flex-row gap-3 justify-between items-start">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Cari nama, NIP atau jabatan..."
              className="border rounded-xl px-4 py-2 w-full sm:w-80 focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 rounded-2xl">
                + Tambah
              </Button>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[1000px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">NIP</th>
                  <th className="p-3">Jabatan</th>
                  <th className="p-3">Golongan</th>
                  <th className="p-3">Gaji Pokok</th>
                  <th className="p-3">Tunjangan</th>
                  <th className="p-3">Potongan</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Bulan/Tahun</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? (
                  filtered.map((it, idx) => (
                    <tr key={it.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3 font-semibold">{it.nama}</td>
                      <td className="p-3">{it.nip}</td>
                      <td className="p-3">{it.jabatan}</td>
                      <td className="p-3">{it.golongan}</td>
                      <td className="p-3">{formatCurrency(it.gajiPokok)}</td>
                      <td className="p-3">{formatCurrency(it.tunjangan)}</td>
                      <td className="p-3">{formatCurrency(it.potongan)}</td>
                      <td className="p-3 font-bold text-green-600">{formatCurrency(it.total)}</td>
                      <td className="p-3">{it.bulan}/{it.tahun}</td>
                      <td className="p-3">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => openView(it)} className="px-3 py-1 bg-blue-300 rounded-full text-sm">View</button>
                          <button onClick={() => openEdit(it)} className="px-3 py-1 bg-yellow-300 rounded-full text-sm">Edit</button>
                          <button onClick={() => openDelete(it)} className="px-3 py-1 bg-red-300 rounded-full text-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="p-6 text-center text-gray-500">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tablet compact table */}
          <div className="hidden md:block lg:hidden overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">No</th>
                  <th className="p-2">Nama</th>
                  <th className="p-2">Total</th>
                  <th className="p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it, idx) => (
                  <tr key={it.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2 font-semibold">{it.nama}</td>
                    <td className="p-2 font-bold text-green-600">{formatCurrency(it.total)}</td>
                    <td className="p-2">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => openView(it)} className="px-2 py-1 bg-blue-300 rounded-full text-xs">V</button>
                        <button onClick={() => openEdit(it)} className="px-2 py-1 bg-yellow-300 rounded-full text-xs">E</button>
                        <button onClick={() => openDelete(it)} className="px-2 py-1 bg-red-300 rounded-full text-xs">D</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((it, idx) => (
              <Card key={it.id} className="p-3 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{it.nama}</p>
                    <p className="text-xs text-gray-500">NIP: {it.nip}</p>
                    <p className="text-xs text-gray-500">Gol: {it.golongan}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">{it.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-gray-600">Gaji</p>
                    <p className="font-medium">{formatCurrency(it.gajiPokok)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tunjangan</p>
                    <p className="font-medium">{formatCurrency(it.tunjangan)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Potongan</p>
                    <p className="font-medium">{formatCurrency(it.potongan)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="font-bold text-green-700">{formatCurrency(it.total)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openView(it)} className="flex-1 px-3 py-2 bg-blue-300 rounded-full text-xs">View</button>
                  <button onClick={() => openEdit(it)} className="flex-1 px-3 py-2 bg-yellow-300 rounded-full text-xs">Edit</button>
                  <button onClick={() => openDelete(it)} className="flex-1 px-3 py-2 bg-red-300 rounded-full text-xs">Delete</button>
                </div>
              </Card>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-500">Belum ada riwayat tunjangan</div>
            )}
          </div>
        </Card>

        {/* Modal */}
        {popup.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.15 }} className="bg-white w-full max-w-xl rounded-2xl p-4 sm:p-6 shadow-lg">
              {popup.mode === "view" && form && (
                <>
                  <h2 className="text-xl font-semibold mb-3">Detail Riwayat</h2>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><p className="text-gray-500">Nama</p><p className="font-medium">{form.nama}</p></div>
                    <div><p className="text-gray-500">NIP</p><p className="font-medium">{form.nip}</p></div>
                    <div><p className="text-gray-500">Jabatan</p><p className="font-medium">{form.jabatan}</p></div>
                    <div><p className="text-gray-500">Golongan</p><p className="font-medium">{form.golongan}</p></div>
                    <div><p className="text-gray-500">Gaji Pokok</p><p className="font-medium">{formatCurrency(form.gajiPokok)}</p></div>
                    <div><p className="text-gray-500">Tunjangan</p><p className="font-medium">{formatCurrency(form.tunjangan)}</p></div>
                    <div><p className="text-gray-500">Potongan</p><p className="font-medium">{formatCurrency(form.potongan)}</p></div>
                    <div><p className="text-gray-500">Total</p><p className="font-bold text-green-700">{formatCurrency(form.total)}</p></div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button onClick={closePopup} className="flex-1 bg-gray-200 text-gray-800">Tutup</Button>
                  </div>
                </>
              )}

              {(popup.mode === "add" || popup.mode === "edit") && (
                <>
                  <h2 className="text-xl font-semibold mb-3">{popup.mode === "add" ? "Tambah Riwayat" : "Edit Riwayat"}</h2>
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    <input className="w-full border rounded-xl px-3 py-2" placeholder="Nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
                    <input className="w-full border rounded-xl px-3 py-2" placeholder="NIP" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input className="w-full border rounded-xl px-3 py-2" placeholder="Jabatan" value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} />
                      <input className="w-full border rounded-xl px-3 py-2" placeholder="Golongan" value={form.golongan} onChange={(e) => setForm({ ...form, golongan: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input type="number" className="w-full border rounded-xl px-3 py-2" placeholder="Gaji Pokok" value={form.gajiPokok} onChange={(e) => setForm({ ...form, gajiPokok: Number(e.target.value) })} />
                      <input type="number" className="w-full border rounded-xl px-3 py-2" placeholder="Tunjangan" value={form.tunjangan} onChange={(e) => setForm({ ...form, tunjangan: Number(e.target.value) })} />
                      <input type="number" className="w-full border rounded-xl px-3 py-2" placeholder="Potongan" value={form.potongan} onChange={(e) => setForm({ ...form, potongan: Number(e.target.value) })} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select value={form.bulan} onChange={(e) => setForm({ ...form, bulan: e.target.value })} className="border rounded-xl px-3 py-2">
                        {Array.from({ length: 12 }).map((_, i) => <option key={i} value={String(i + 1).padStart(2, "0")}>{new Date(0, i).toLocaleString("id-ID", { month: "short" })}</option>)}
                      </select>
                      <input className="border rounded-xl px-3 py-2" value={form.tahun} onChange={(e) => setForm({ ...form, tahun: e.target.value })} />
                    </div>

                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border rounded-xl px-3 py-2">
                      <option>Aktif</option>
                      <option>Non-Aktif</option>
                      <option>Cuti</option>
                    </select>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button onClick={handleSave} className="flex-1 bg-blue-600">Simpan</Button>
                    <Button onClick={closePopup} className="flex-1 bg-gray-200 text-gray-800">Batal</Button>
                  </div>
                </>
              )}

              {popup.mode === "delete" && (
                <>
                  <h2 className="text-xl font-semibold mb-3 text-red-600">Hapus Riwayat</h2>
                  <p className="text-sm text-gray-700">Yakin hapus riwayat untuk <strong>{form.nama}</strong>?</p>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={handleDeleteConfirm} className="flex-1 bg-red-600">Hapus</Button>
                    <Button onClick={closePopup} className="flex-1 bg-gray-200 text-gray-800">Batal</Button>
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
// ...existing code...