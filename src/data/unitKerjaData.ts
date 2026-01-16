export interface UnitKerjaData {
  unit: string;
  jumlahPegawai: number;
  color: string;
}

// Data Unit Kerja ANRI dengan Jumlah Pegawai
export const unitKerjaData: UnitKerjaData[] = [
  { unit: "Kepala Arsip Nasional Republik Indonesia", jumlahPegawai: 1, color: "#00509d" },
  { unit: "Deputi Bidang Penyelamatan, Pelestarian, dan Pelindungan Arsip", jumlahPegawai: 3, color: "#05cd99" },
  { unit: "Deputi Bidang Sistem dan Informasi Kearsipan Nasional", jumlahPegawai: 2, color: "#FFB547" },
  { unit: "Deputi Bidang Tata Kelola Kearsipan Nasional", jumlahPegawai: 4, color: "#9747FF" },
  { unit: "Sekretariat Utama", jumlahPegawai: 3, color: "#FF6B6B" },
  { unit: "Biro Hukum, Kerja Sama, dan Hubungan Masyarakat", jumlahPegawai: 39, color: "#4ECDC4" },
  { unit: "Biro Kepegawaian dan Umum", jumlahPegawai: 81, color: "#FFD93D" },
  { unit: "Biro Manajemen Kinerja, Keuangan, dan Organisasi", jumlahPegawai: 58, color: "#6BCB77" },
  { unit: "Direktorat Informasi Kearsipan", jumlahPegawai: 18, color: "#FF8C42" },
  { unit: "Direktorat Kearsipan Daerah I", jumlahPegawai: 22, color: "#A78BFA" },
  { unit: "Direktorat Kearsipan Daerah II", jumlahPegawai: 25, color: "#34D399" },
  { unit: "Direktorat Kearsipan Pusat", jumlahPegawai: 22, color: "#FBBF24" },
  { unit: "Direktorat Layanan dan Pemanfaatan Arsip", jumlahPegawai: 61, color: "#F472B6" },
  { unit: "Direktorat Pelestarian dan Pelindungan Arsip", jumlahPegawai: 70, color: "#00509d" },
  { unit: "Direktorat Pengolahan Arsip", jumlahPegawai: 61, color: "#FB923C" },
  { unit: "Direktorat Penyelamatan Arsip", jumlahPegawai: 21, color: "#A855F7" },
  { unit: "Direktorat SDM Kearsipan dan Sertifikasi", jumlahPegawai: 16, color: "#10B981" },
  { unit: "Direktorat Sistem Kearsipan", jumlahPegawai: 13, color: "#EF4444" },
  { unit: "Direktorat Teknologi Informasi Kearsipan", jumlahPegawai: 20, color: "#8B5CF6" },
  { unit: "Inspektorat", jumlahPegawai: 21, color: "#14B8A6" },
  { unit: "Pusat Data, Informasi, dan Jasa Teknis Kearsipan", jumlahPegawai: 47, color: "#F59E0B" },
  { unit: "Pusat Pelatihan Sumber Daya Manusia", jumlahPegawai: 24, color: "#EC4899" },
  { unit: "Pusat Pengawasan dan Akreditasi Kearsipan", jumlahPegawai: 34, color: "#00509d" },
  { unit: "Pusat Studi Arsip Statis Kepresidenan", jumlahPegawai: 16, color: "#06B6D4" },
  { unit: "Bagian Perlengkapan, Kearsipan, Tata Usaha, dan Layanan Pengadaan", jumlahPegawai: 11, color: "#84CC16" },
  { unit: "Balai Arsip Statis dan Tsunami", jumlahPegawai: 31, color: "#F97316" },
  { unit: "Subbagian Rumah Tangga dan Pengamanan", jumlahPegawai: 23, color: "#D946EF" },
  { unit: "Subbagian Tata Usaha dan Umum Balai Arsip Statis dan Tsunami", jumlahPegawai: 4, color: "#0EA5E9" },
  { unit: "Subbagian Tata Usaha Deputi Bidang Penyelamatan, Pelestarian, dan Pelindungan Arsip", jumlahPegawai: 3, color: "#22C55E" },
  { unit: "Subbagian Tata Usaha Deputi Bidang Sistem dan Informasi Kearsipan Nasional", jumlahPegawai: 4, color: "#EAB308" },
  { unit: "Subbagian Tata Usaha Deputi Bidang Tata Kelola Kearsipan Nasional", jumlahPegawai: 3, color: "#DC2626" },
  { unit: "Subbagian Tata Usaha Inspektorat", jumlahPegawai: 1, color: "#7C3AED" },
  { unit: "Subbagian Tata Usaha Kepala dan Sekretariat Utama", jumlahPegawai: 2, color: "#059669" },
  { unit: "Subbagian Umum Pusat Data, Informasi, dan Jasa Teknis Kearsipan", jumlahPegawai: 6, color: "#D97706" },
  { unit: "Subbagian Umum Pusat Pelatihan Sumber Daya Manusia", jumlahPegawai: 8, color: "#DB2777" },
  { unit: "Subbagian Umum Pusat Pengawasan dan Akreditasi Kearsipan", jumlahPegawai: 2, color: "#00509d" },
  { unit: "Subbagian Umum Pusat Studi Arsip Statis Kepresidenan", jumlahPegawai: 2, color: "#0891B2" },
];

// Hitung total pegawai
export const totalPegawaiFromUnits = unitKerjaData.reduce((sum, unit) => sum + unit.jumlahPegawai, 0);
