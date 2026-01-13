import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import { Table, Button, Space, Tooltip, Tag, Descriptions, Drawer } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, LineChartOutlined, CheckCircleOutlined, PlusOutlined, SafetyCertificateFilled } from "@ant-design/icons";

import { CreateTupas } from "./create";
import "../../../styles/dataTupas.css"; 


interface ITupasData {
  id: number;
  
  unitKerja: string;
  nama: string;
  nip: string;
  pangkatGolongan: string;
  jabatan: string;
  tanggalMulaiKerja: string;
  masaKerjaTerbaru: string; 
  
  
  faktorRisikoLama: number;
  faktorRisikoBaru: number;
  faktorTanggungJawabLama: number;
  faktorTanggungJawabBaru: number;
  faktorLamaKerjaLama: number;
  faktorLamaKerjaBaru: number;
  nilaiTunjanganLama: number;
  nilaiTunjanganBaru: number;
  tingkatRisiko: string;
  besarTunjangan: number;
  terbilang: string;
  
  status: "Aktif" | "Nonaktif";
  periode: string;
}


const terbilang = (angka: number): string => {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  
  if (angka < 12) return bilangan[angka];
  if (angka < 20) return terbilang(angka - 10) + ' Belas';
  if (angka < 100) return bilangan[Math.floor(angka / 10)] + ' Puluh ' + terbilang(angka % 10);
  if (angka < 200) return 'Seratus ' + terbilang(angka - 100);
  if (angka < 1000) return bilangan[Math.floor(angka / 100)] + ' Ratus ' + terbilang(angka % 100);
  if (angka < 2000) return 'Seribu ' + terbilang(angka - 1000);
  if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + ' Ribu ' + terbilang(angka % 1000);
  if (angka < 1000000000) return terbilang(Math.floor(angka / 1000000)) + ' Juta ' + terbilang(angka % 1000000);
  
  return angka.toString();
};

const DUMMY_DATA: ITupasData[] = [
  {
    id: 1,
    
    unitKerja: "Sekretariat Utama",
    nama: "Dr. Bambang Sutrisno, M.Si",
    nip: "196801051994031002",
    pangkatGolongan: "Pembina Utama Muda / IV/c",
    jabatan: "Kepala Bagian Kepegawaian",
    tanggalMulaiKerja: "05 Maret 1994",
    masaKerjaTerbaru: "32 tahun 0 bulan",
    
    
    faktorRisikoLama: 2.5,
    faktorRisikoBaru: 3.0,
    faktorTanggungJawabLama: 2.0,
    faktorTanggungJawabBaru: 2.5,
    faktorLamaKerjaLama: 1.75,
    faktorLamaKerjaBaru: 2.0,
    nilaiTunjanganLama: 6.25,
    nilaiTunjanganBaru: 7.5,
    tingkatRisiko: "Sangat Tinggi",
    besarTunjangan: 5500000,
    terbilang: "Lima Juta Lima Ratus Ribu Rupiah",
    
    status: "Aktif",
    periode: "01/2026",
  },
  {
    id: 2,
    unitKerja: "Deputi Pembinaan Kearsipan",
    nama: "Dra. Siti Maemunah, M.A",
    nip: "197205122002122001",
    pangkatGolongan: "Pembina Tk.I / IV/b",
    jabatan: "Arsiparis Ahli Madya",
    tanggalMulaiKerja: "12 Mei 2002",
    masaKerjaTerbaru: "24 tahun 8 bulan",
    
    faktorRisikoLama: 2.0,
    faktorRisikoBaru: 2.5,
    faktorTanggungJawabLama: 1.5,
    faktorTanggungJawabBaru: 2.0,
    faktorLamaKerjaLama: 1.5,
    faktorLamaKerjaBaru: 1.75,
    nilaiTunjanganLama: 5.0,
    nilaiTunjanganBaru: 6.25,
    tingkatRisiko: "Tinggi",
    besarTunjangan: 4500000,
    terbilang: "Empat Juta Lima Ratus Ribu Rupiah",
    
    status: "Aktif",
    periode: "01/2026",
  },
  {
    id: 3,
    unitKerja: "Deputi Konservasi Arsip",
    nama: "Ir. Andi Prasetyo, M.T",
    nip: "198003152006041003",
    pangkatGolongan: "Penata Tk.I / III/d",
    jabatan: "Arsiparis Ahli Muda",
    tanggalMulaiKerja: "15 Maret 2006",
    masaKerjaTerbaru: "20 tahun 10 bulan",
    
    faktorRisikoLama: 1.5,
    faktorRisikoBaru: 2.0,
    faktorTanggungJawabLama: 1.0,
    faktorTanggungJawabBaru: 1.5,
    faktorLamaKerjaLama: 1.25,
    faktorLamaKerjaBaru: 1.5,
    nilaiTunjanganLama: 3.75,
    nilaiTunjanganBaru: 5.0,
    tingkatRisiko: "Sedang",
    besarTunjangan: 3500000,
    terbilang: "Tiga Juta Lima Ratus Ribu Rupiah",
    
    status: "Aktif",
    periode: "01/2026",
  },
  {
    id: 4,
    unitKerja: "Deputi Informasi & Akses",
    nama: "Drs. Heru Widodo, M.Hum",
    nip: "198609202010091001",
    pangkatGolongan: "Penata / III/c",
    jabatan: "Arsiparis Ahli Pertama",
    tanggalMulaiKerja: "20 September 2010",
    masaKerjaTerbaru: "16 tahun 4 bulan",
    
    faktorRisikoLama: 1.0,
    faktorRisikoBaru: 1.5,
    faktorTanggungJawabLama: 1.0,
    faktorTanggungJawabBaru: 1.0,
    faktorLamaKerjaLama: 1.25,
    faktorLamaKerjaBaru: 1.5,
    nilaiTunjanganLama: 3.25,
    nilaiTunjanganBaru: 4.0,
    tingkatRisiko: "Sedang",
    besarTunjangan: 3000000,
    terbilang: "Tiga Juta Rupiah",
    
    status: "Aktif",
    periode: "01/2026",
  },
  {
    id: 5,
    unitKerja: "Inspektorat",
    nama: "Sri Rahayu, S.Sos, M.Si",
    nip: "198905182011012002",
    pangkatGolongan: "Penata Muda Tk.I / III/b",
    jabatan: "Auditor",
    tanggalMulaiKerja: "18 Mei 2011",
    masaKerjaTerbaru: "15 tahun 8 bulan",
    
    faktorRisikoLama: 1.0,
    faktorRisikoBaru: 1.0,
    faktorTanggungJawabLama: 1.5,
    faktorTanggungJawabBaru: 1.5,
    faktorLamaKerjaLama: 1.25,
    faktorLamaKerjaBaru: 1.5,
    nilaiTunjanganLama: 3.75,
    nilaiTunjanganBaru: 4.0,
    tingkatRisiko: "Rendah",
    besarTunjangan: 2500000,
    terbilang: "Dua Juta Lima Ratus Ribu Rupiah",
    
    status: "Aktif",
    periode: "01/2026",
  },
];

export const TupasList: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ITupasData | null>(null);

  // Matikan fetch karena masih pakai dummy data
  // const { tableProps } = useTable<ITupasData>({
  //   resource: "tupas",
  //   syncWithLocation: true,
  // });

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleViewDetail = (record: ITupasData) => {
    setSelectedRecord(record);
    setDetailDrawerOpen(true);
  };

  const totalData = DUMMY_DATA.length;
  const totalTunjangan = DUMMY_DATA.reduce((acc, curr) => acc + curr.besarTunjangan, 0);
  const avgTunjangan = totalTunjangan / totalData;

  return (
    <div className="tupas-container">
      {/* Header Title */}
      <div className="tupas-header">
        <h1 className="tupas-title">
          <SafetyCertificateFilled style={{ color: "#1677ff" }} />
          Data Tunjangan PAS
        </h1>
        <p className="tupas-subtitle">Kelola riwayat tunjangan pegawai</p>
      </div>

      {/* Statistik Cards & Button Action */}
      <div className="stats-grid">
        {/* Card 1: Total Data */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Pegawai</div>
            <div className="stat-value">{totalData}</div>
          </div>
          <div className="stat-icon-box icon-blue">
            <LineChartOutlined />
          </div>
        </div>

        {/* Card 2: Total Tunjangan */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Tunjangan</div>
            <div className="stat-value green" style={{ fontSize: "18px" }}>{formatRupiah(totalTunjangan)}</div>
          </div>
          <div className="stat-icon-box icon-green">
            <CheckCircleOutlined />
          </div>
        </div>

        {/* Card 3: Rata-rata Tunjangan */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Rata-rata Tunjangan</div>
            <div className="stat-value" style={{ color: "#9747FF", fontSize: "18px" }}>{formatRupiah(avgTunjangan)}</div>
          </div>
          <div className="stat-icon-box" style={{ background: "#F4F0FF", color: "#9747FF" }}>
            <LineChartOutlined />
          </div>
        </div>

        {/* Card 4: Tombol Tambah Data */}
        <div className="add-data-card" onClick={() => setIsCreateModalOpen(true)}>
          <div>
            <div style={{ fontSize: "12px", opacity: 0.9 }}>Tambah Data</div>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>Klik disini</div>
          </div>
          <div className="add-btn-circle">
            <PlusOutlined />
          </div>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="custom-table-card">
        <Table
          dataSource={DUMMY_DATA} 
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1800 }}
        >
          <Table.Column
            dataIndex="unitKerja"
            title="Unit Kerja"
            width={180}
            fixed="left"
            render={(value) => <Tag color="blue">{value}</Tag>}
          />
          <Table.Column
            dataIndex="nama"
            title="Nama"
            width={200}
            fixed="left"
            sorter={(a: ITupasData, b: ITupasData) => a.nama.localeCompare(b.nama)}
            render={(value) => <strong>{value}</strong>}
          />
          <Table.Column 
            dataIndex="nip" 
            title="NIP" 
            width={160}
          />
          <Table.Column 
            dataIndex="pangkatGolongan" 
            title="Pangkat / Golongan" 
            width={200}
            render={(value) => <span style={{ fontSize: "12px" }}>{value}</span>}
          />
          <Table.Column 
            dataIndex="jabatan" 
            title="Jabatan" 
            width={180}
          />
          <Table.Column 
            dataIndex="masaKerjaTerbaru" 
            title="Masa Kerja" 
            width={130}
            render={(value) => <Tag color="cyan">{value}</Tag>}
          />
          <Table.Column 
            dataIndex="nilaiTunjanganBaru" 
            title="Nilai Tunjangan" 
            width={120}
            align="center"
            render={(value) => <Tag color="orange" style={{ fontSize: "13px", fontWeight: "bold" }}>{value}</Tag>}
          />
          <Table.Column 
            dataIndex="tingkatRisiko" 
            title="Tingkat Risiko" 
            width={140}
            render={(value) => {
              const color = value === "Sangat Tinggi" ? "red" : value === "Tinggi" ? "orange" : value === "Sedang" ? "blue" : "green";
              return <Tag color={color}>{value}</Tag>;
            }}
          />
          <Table.Column 
            dataIndex="besarTunjangan" 
            title="Besar Tunjangan" 
            width={150}
            sorter={(a: ITupasData, b: ITupasData) => a.besarTunjangan - b.besarTunjangan}
            render={(value) => <span style={{ color: "#059669", fontWeight: "bold" }}>{formatRupiah(value)}</span>}
          />
          <Table.Column
            dataIndex="status"
            title="Status"
            width={100}
            render={(value) => (
              <span className={`status-badge ${value === "Aktif" ? "status-active" : ""}`}>
                <CheckCircleOutlined /> {value}
              </span>
            )}
          />
          <Table.Column 
            dataIndex="periode" 
            title="Periode" 
            width={90}
          />
          <Table.Column
            title="Aksi"
            key="action"
            align="center"
            width={120}
            fixed="right"
            render={(_, record: ITupasData) => (
              <Space size={8} className="action-btn-group">
                <Tooltip title="Detail">
                  <Button 
                    icon={<EyeOutlined />} 
                    className="action-btn action-view" 
                    onClick={() => handleViewDetail(record)}
                  />
                </Tooltip>

                <Tooltip title="Edit">
                  <Button icon={<EditOutlined />} className="action-btn action-edit" />
                </Tooltip>

                <Tooltip title="Hapus">
                  <Button icon={<DeleteOutlined />} className="action-btn action-delete" />
                </Tooltip>
              </Space>
            )}
          />
        </Table>
      </div>

      {/* Drawer Detail */}
      <Drawer
        title={<span style={{ fontSize: "18px", fontWeight: "bold" }}>Detail Tunjangan PAS</span>}
        placement="right"
        width={720}
        onClose={() => setDetailDrawerOpen(false)}
        open={detailDrawerOpen}
      >
        {selectedRecord && (
          <div>
            <Descriptions title="Data Pegawai" bordered column={1} size="small" style={{ marginBottom: "24px" }}>
              <Descriptions.Item label="Unit Kerja">{selectedRecord.unitKerja}</Descriptions.Item>
              <Descriptions.Item label="Nama">{selectedRecord.nama}</Descriptions.Item>
              <Descriptions.Item label="NIP">{selectedRecord.nip}</Descriptions.Item>
              <Descriptions.Item label="Pangkat / Golongan">{selectedRecord.pangkatGolongan}</Descriptions.Item>
              <Descriptions.Item label="Jabatan">{selectedRecord.jabatan}</Descriptions.Item>
              <Descriptions.Item label="Tanggal Mulai Kerja">{selectedRecord.tanggalMulaiKerja}</Descriptions.Item>
              <Descriptions.Item label="Masa Kerja Terbaru">{selectedRecord.masaKerjaTerbaru}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="Data Penghitungan Tunjangan PAS" bordered column={2} size="small">
              
              <Descriptions.Item label="Faktor Tanggung Jawab (Lama)" span={1}>
                <Tag color="blue">{selectedRecord.faktorTanggungJawabLama}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Faktor Tanggung Jawab (Baru)" span={1}>
                <Tag color="green">{selectedRecord.faktorTanggungJawabBaru}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Faktor Lama Kerja (Lama)" span={1}>
                <Tag color="blue">{selectedRecord.faktorLamaKerjaLama}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Faktor Lama Kerja (Baru)" span={1}>
                <Tag color="green">{selectedRecord.faktorLamaKerjaBaru}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Nilai Tunjangan PAS (Lama)" span={1}>
                <Tag color="orange" style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {selectedRecord.nilaiTunjanganLama}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Nilai Tunjangan PAS (Baru)" span={1}>
                <Tag color="red" style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {selectedRecord.nilaiTunjanganBaru}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Tingkat Risiko" span={2}>
                <Tag color={selectedRecord.tingkatRisiko === "Sangat Tinggi" ? "red" : selectedRecord.tingkatRisiko === "Tinggi" ? "orange" : "blue"}>
                  {selectedRecord.tingkatRisiko}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Besar Tunjangan" span={2}>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#059669" }}>
                  {formatRupiah(selectedRecord.besarTunjangan)}
                </span>
              </Descriptions.Item>
              
              <Descriptions.Item label="Terbilang" span={2}>
                <span style={{ fontStyle: "italic", color: "#595959" }}>
                  {selectedRecord.terbilang}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>

      {/* Modal Component */}
      <CreateTupas open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};
