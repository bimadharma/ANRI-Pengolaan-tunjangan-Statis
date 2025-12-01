import axios from "axios";

// Dummy data pegawai
const dummyPegawai = [
  {
    id: 1,
    nama: "Ahmad Wijaya",
    nip: "198501151010001",
    jabatan: "Kepala Bagian",
    departemen: "Pengolahan Data",
    email: "ahmad.wijaya@anri.go.id",
  },
  {
    id: 2,
    nama: "Siti Nurhaliza",
    nip: "198602202020002",
    jabatan: "Analis Data",
    departemen: "Pengolahan Data",
    email: "siti.nurhaliza@anri.go.id",
  },
  {
    id: 3,
    nama: "Budi Santoso",
    nip: "198703153030003",
    jabatan: "Operator",
    departemen: "Administrasi",
    email: "budi.santoso@anri.go.id",
  },
  {
    id: 4,
    nama: "Dewi Lestari",
    nip: "198804164040004",
    jabatan: "Supervisor",
    departemen: "Pengolahan Data",
    email: "dewi.lestari@anri.go.id",
  },
];

// Simulasi database in-memory
// eslint-disable-next-line prefer-const
let pegawaiData = [...dummyPegawai];
let nextId = 5;

// API instance
const pegawaiAPI = {
  // Get semua pegawai
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: pegawaiData });
      }, 500);
    });
  },

  // Get pegawai by ID
  getById: async (id: number) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const pegawai = pegawaiData.find((p) => p.id === id);
        if (pegawai) {
          resolve({ data: pegawai });
        } else {
          reject({ response: { data: { message: "Pegawai tidak ditemukan" } } });
        }
      }, 300);
    });
  },

  // Create pegawai
  create: async (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPegawai = { id: nextId++, ...data };
        pegawaiData.push(newPegawai);
        resolve({ data: newPegawai });
      }, 500);
    });
  },

  // Update pegawai
  update: async (id: number, data: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = pegawaiData.findIndex((p) => p.id === id);
        if (index !== -1) {
          pegawaiData[index] = { ...pegawaiData[index], ...data };
          resolve({ data: pegawaiData[index] });
        } else {
          reject({ response: { data: { message: "Pegawai tidak ditemukan" } } });
        }
      }, 500);
    });
  },

  // Delete pegawai
  delete: async (id: number) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = pegawaiData.findIndex((p) => p.id === id);
        if (index !== -1) {
          pegawaiData.splice(index, 1);
          resolve({ data: { message: "Pegawai berhasil dihapus" } });
        } else {
          reject({ response: { data: { message: "Pegawai tidak ditemukan" } } });
        }
      }, 500);
    });
  },
};

export default pegawaiAPI;