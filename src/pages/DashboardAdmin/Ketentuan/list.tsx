import React, { useState } from "react";
import { Table, Button, Space, Tag, Tooltip, notification, Form, Tabs } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, BookOutlined, BankOutlined, IdcardOutlined, LineChartOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { ComponentModal } from "../../../components/componentModal";
import { CreateForm } from "./create";
import "../../../styles/ketentuan.css";



interface FaktorTanggungJawabData {
  key: string;
  kodeFaktor: string;
  jabatanTanggungJawab: string;
  nilaiFaktor: number;
  keterangan: string;
}

interface FaktorLamaKerjaData {
  key: string;
  rentangMasaKerja: string;
  nilaiFaktor: number;
  keterangan: string;
}

interface MappingTunjanganData {
  key: string;
  totalNilai: number;
  tingkatRisiko: string;
  besarTunjangan: number;
}

interface MetadataKetentuanData {
  key: string;
  tahunBerlaku: string;
  nomorRegulasi: string;
  tanggalBerlaku: string;
  statusKetentuan: "Aktif" | "Tidak Aktif";
}


interface UnitKerjaData {
  key: string;
  kodeUnit: string;
  namaUnit: string;
  levelOrganisasi: string;
  unitInduk: string;
  status: "Aktif" | "Nonaktif";
}


interface JabatanData {
  key: string;
  kodeJabatan: string;
  namaJabatan: string;
  jenisJabatan: "Struktural" | "Fungsional";
  golonganMinimal: string;
  faktorTanggungJawab: number;
  statusJabatan: "Aktif" | "Nonaktif";
}

const dummyFaktorTanggungJawab: FaktorTanggungJawabData[] = [
  { key: "1", kodeFaktor: "FT-001", jabatanTanggungJawab: "Kepala Arsip", nilaiFaktor: 2.5, keterangan: "Tanggung jawab penuh unit" },
  { key: "2", kodeFaktor: "FT-002", jabatanTanggungJawab: "Arsiparis Ahli Madya", nilaiFaktor: 2.0, keterangan: "Tanggung jawab supervisi" },
  { key: "3", kodeFaktor: "FT-003", jabatanTanggungJawab: "Arsiparis Ahli Muda", nilaiFaktor: 1.5, keterangan: "Tanggung jawab operasional" },
];

const dummyFaktorLamaKerja: FaktorLamaKerjaData[] = [
  { key: "1", rentangMasaKerja: "0-4 tahun", nilaiFaktor: 1.0, keterangan: "Masa kerja awal" },
  { key: "2", rentangMasaKerja: "5-8 tahun", nilaiFaktor: 1.25, keterangan: "Masa kerja menengah" },
  { key: "3", rentangMasaKerja: "9-12 tahun", nilaiFaktor: 1.5, keterangan: "Masa kerja senior" },
  { key: "4", rentangMasaKerja: "13+ tahun", nilaiFaktor: 2.0, keterangan: "Masa kerja sangat senior" },
];

const dummyMappingTunjangan: MappingTunjanganData[] = [
  { key: "1", totalNilai: 6.5, tingkatRisiko: "Sangat Tinggi", besarTunjangan: 5500000 },
  { key: "2", totalNilai: 5.5, tingkatRisiko: "Tinggi", besarTunjangan: 4500000 },
  { key: "3", totalNilai: 4.5, tingkatRisiko: "Sedang", besarTunjangan: 3500000 },
  { key: "4", totalNilai: 3.0, tingkatRisiko: "Rendah", besarTunjangan: 2500000 },
];

const dummyMetadataKetentuan: MetadataKetentuanData[] = [
  { key: "1", tahunBerlaku: "2026", nomorRegulasi: "PERKA-ANRI/01/2026", tanggalBerlaku: "01 Januari 2026", statusKetentuan: "Aktif" },
  { key: "2", tahunBerlaku: "2025", nomorRegulasi: "PERKA-ANRI/05/2025", tanggalBerlaku: "01 Juli 2025", statusKetentuan: "Tidak Aktif" },
];


const dummyUnitKerja: UnitKerjaData[] = [
  { key: "1", kodeUnit: "UK-001", namaUnit: "Sekretariat Utama", levelOrganisasi: "Eselon I", unitInduk: "-", status: "Aktif" },
  { key: "2", kodeUnit: "UK-002", namaUnit: "Deputi Pembinaan Kearsipan", levelOrganisasi: "Eselon I", unitInduk: "-", status: "Aktif" },
  { key: "3", kodeUnit: "UK-003", namaUnit: "Deputi Konservasi Arsip", levelOrganisasi: "Eselon I", unitInduk: "-", status: "Aktif" },
  { key: "4", kodeUnit: "UK-004", namaUnit: "Bagian Kepegawaian", levelOrganisasi: "Eselon II", unitInduk: "Sekretariat Utama", status: "Aktif" },
  { key: "5", kodeUnit: "UK-005", namaUnit: "Bagian Hukum", levelOrganisasi: "Eselon II", unitInduk: "Sekretariat Utama", status: "Aktif" },
];


const dummyJabatan: JabatanData[] = [
  { key: "1", kodeJabatan: "JB-001", namaJabatan: "Kepala Arsip Nasional", jenisJabatan: "Struktural", golonganMinimal: "IV/c", faktorTanggungJawab: 3.0, statusJabatan: "Aktif" },
  { key: "2", kodeJabatan: "JB-002", namaJabatan: "Arsiparis Ahli Utama", jenisJabatan: "Fungsional", golonganMinimal: "IV/d", faktorTanggungJawab: 2.8, statusJabatan: "Aktif" },
  { key: "3", kodeJabatan: "JB-003", namaJabatan: "Arsiparis Ahli Madya", jenisJabatan: "Fungsional", golonganMinimal: "IV/a", faktorTanggungJawab: 2.5, statusJabatan: "Aktif" },
  { key: "4", kodeJabatan: "JB-004", namaJabatan: "Arsiparis Ahli Muda", jenisJabatan: "Fungsional", golonganMinimal: "III/c", faktorTanggungJawab: 2.0, statusJabatan: "Aktif" },
  { key: "5", kodeJabatan: "JB-005", namaJabatan: "Kepala Bagian", jenisJabatan: "Struktural", golonganMinimal: "III/d", faktorTanggungJawab: 2.3, statusJabatan: "Aktif" },
];

export const KetentuanList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ketentuan" | "unitKerja" | "jabatan">("ketentuan");
  const [subTab, setSubTab] = useState<string>("faktorTanggungJawab");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const columnsFaktorTanggungJawab: ColumnsType<FaktorTanggungJawabData> = [
    { title: "Kode Faktor", dataIndex: "kodeFaktor", key: "kodeFaktor", render: (text) => <Tag color="purple">{text}</Tag> },
    { title: "Jabatan Tanggung Jawab", dataIndex: "jabatanTanggungJawab", key: "jabatanTanggungJawab", render: (text) => <strong>{text}</strong> },
    { title: "Nilai Faktor", dataIndex: "nilaiFaktor", key: "nilaiFaktor", render: (value) => <Tag color="orange">{value}</Tag> },
    { title: "Keterangan", dataIndex: "keterangan", key: "keterangan" },
    {
      title: "AKSI", key: "action", align: "center",
      render: () => (
        <Space size={8} className="action-btn-group">
          <Tooltip title="Edit"><Button icon={<EditOutlined />} className="action-btn action-edit" /></Tooltip>
          <Tooltip title="Hapus"><Button icon={<DeleteOutlined />} className="action-btn action-delete" /></Tooltip>
        </Space>
      ),
    },
  ];

  const columnsFaktorLamaKerja: ColumnsType<FaktorLamaKerjaData> = [
    { title: "Rentang Masa Kerja", dataIndex: "rentangMasaKerja", key: "rentangMasaKerja", render: (text) => <Tag color="cyan">{text}</Tag> },
    { title: "Nilai Faktor", dataIndex: "nilaiFaktor", key: "nilaiFaktor", render: (value) => <Tag color="orange">{value}</Tag> },
    { title: "Keterangan", dataIndex: "keterangan", key: "keterangan" },
    {
      title: "AKSI", key: "action", align: "center",
      render: () => (
        <Space size={8} className="action-btn-group">
          <Tooltip title="Edit"><Button icon={<EditOutlined />} className="action-btn action-edit" /></Tooltip>
          <Tooltip title="Hapus"><Button icon={<DeleteOutlined />} className="action-btn action-delete" /></Tooltip>
        </Space>
      ),
    },
  ];

  const columnsMappingTunjangan: ColumnsType<MappingTunjanganData> = [
    { title: "Total Nilai", dataIndex: "totalNilai", key: "totalNilai", render: (value) => <Tag color="#00509d">{value}</Tag> },
    { title: "Tingkat Risiko", dataIndex: "tingkatRisiko", key: "tingkatRisiko", render: (text) => <strong>{text}</strong> },
    { title: "Besar Tunjangan", dataIndex: "besarTunjangan", key: "besarTunjangan", render: (value) => <span style={{ color: "#389e0d", fontWeight: "bold" }}>Rp {value.toLocaleString("id-ID")}</span> },
    {
      title: "AKSI", key: "action", align: "center",
      render: () => (
        <Space size={8} className="action-btn-group">
          <Tooltip title="Edit"><Button icon={<EditOutlined />} className="action-btn action-edit" /></Tooltip>
          <Tooltip title="Hapus"><Button icon={<DeleteOutlined />} className="action-btn action-delete" /></Tooltip>
        </Space>
      ),
    },
  ];

  const columnsMetadataKetentuan: ColumnsType<MetadataKetentuanData> = [
    { title: "Tahun Berlaku", dataIndex: "tahunBerlaku", key: "tahunBerlaku", render: (text) => <Tag color="#00509d">{text}</Tag> },
    { title: "Nomor Regulasi", dataIndex: "nomorRegulasi", key: "nomorRegulasi", render: (text) => <strong>{text}</strong> },
    { title: "Tanggal Berlaku", dataIndex: "tanggalBerlaku", key: "tanggalBerlaku" },
    { title: "Status", dataIndex: "statusKetentuan", key: "statusKetentuan", render: (status) => <Tag color={status === "Aktif" ? "green" : "red"}>{status}</Tag> },
    {
      title: "AKSI", key: "action", align: "center",
      render: () => (
        <Space size={8} className="action-btn-group">
          <Tooltip title="Detail"><Button icon={<EyeOutlined />} className="action-btn action-view" /></Tooltip>
          <Tooltip title="Edit"><Button icon={<EditOutlined />} className="action-btn action-edit" /></Tooltip>
        </Space>
      ),
    },
  ];

  
  const columnsUnitKerja: ColumnsType<UnitKerjaData> = [
    { title: "Kode Unit", dataIndex: "kodeUnit", key: "kodeUnit", render: (text) => <Tag color="#00509d">{text}</Tag> },
    { title: "Nama Unit Kerja", dataIndex: "namaUnit", key: "namaUnit", render: (text) => <strong>{text}</strong> },
    { title: "Level Organisasi", dataIndex: "levelOrganisasi", key: "levelOrganisasi", render: (text) => <Tag color="purple">{text}</Tag> },
    { title: "Unit Induk", dataIndex: "unitInduk", key: "unitInduk" },
    { title: "Status", dataIndex: "status", key: "status", render: (status) => <Tag color={status === "Aktif" ? "green" : "red"}>{status}</Tag> },
    {
      title: "AKSI", key: "action", align: "center",
      render: () => (
        <Space size={8} className="action-btn-group">
          <Tooltip title="Edit"><Button icon={<EditOutlined />} className="action-btn action-edit" /></Tooltip>
          <Tooltip title="Hapus"><Button icon={<DeleteOutlined />} className="action-btn action-delete" /></Tooltip>
        </Space>
      ),
    },
  ];

  
  const columnsJabatan: ColumnsType<JabatanData> = [
    { title: "Kode Jabatan", dataIndex: "kodeJabatan", key: "kodeJabatan", render: (text) => <Tag color="#00509d">{text}</Tag> },
    { title: "Nama Jabatan", dataIndex: "namaJabatan", key: "namaJabatan", render: (text) => <strong>{text}</strong> },
    { title: "Jenis Jabatan", dataIndex: "jenisJabatan", key: "jenisJabatan", render: (text) => <Tag color={text === "Struktural" ? "gold" : "cyan"}>{text}</Tag> },
    { title: "Golongan Minimal", dataIndex: "golonganMinimal", key: "golonganMinimal" },
    { title: "Faktor Tanggung Jawab", dataIndex: "faktorTanggungJawab", key: "faktorTanggungJawab", render: (value) => <Tag color="orange">{value}</Tag> },
    { title: "Status", dataIndex: "statusJabatan", key: "statusJabatan", render: (status) => <Tag color={status === "Aktif" ? "green" : "red"}>{status}</Tag> },
    {
      title: "AKSI", key: "action", align: "center",
      render: () => (
        <Space size={8} className="action-btn-group">
          <Tooltip title="Edit"><Button icon={<EditOutlined />} className="action-btn action-edit" /></Tooltip>
          <Tooltip title="Hapus"><Button icon={<DeleteOutlined />} className="action-btn action-delete" /></Tooltip>
        </Space>
      ),
    },
  ];

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form Values:", values);
        const tabName = activeTab === "ketentuan" 
          ? `Ketentuan Tunjangan - ${subTab}` 
          : activeTab === "unitKerja" 
            ? "Master Unit Kerja" 
            : "Master Jabatan";
        
        api.success({
          message: "Berhasil Menambahkan Data",
          description: `Data baru telah berhasil ditambahkan ke ${tabName}.`,
          placement: "topRight",
        });
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  
  const renderKetentuanTable = () => {
    const tabItems: Array<{ key: string; label: string; columns: ColumnsType<any>; data: any[] }> = [
      { key: "faktorTanggungJawab", label: "Faktor Tanggung Jawab", columns: columnsFaktorTanggungJawab, data: dummyFaktorTanggungJawab },
      { key: "faktorLamaKerja", label: "Faktor Lama Kerja", columns: columnsFaktorLamaKerja, data: dummyFaktorLamaKerja },
      { key: "mappingTunjangan", label: "Mapping Nilai Tunjangan", columns: columnsMappingTunjangan, data: dummyMappingTunjangan },
      { key: "metadata", label: "Metadata Ketentuan", columns: columnsMetadataKetentuan, data: dummyMetadataKetentuan },
    ];

    return (
      <Tabs 
        activeKey={subTab} 
        onChange={setSubTab}
        items={tabItems.map(item => ({
          key: item.key,
          label: item.label,
          children: <Table columns={item.columns as ColumnsType<any>} dataSource={item.data} pagination={{ pageSize: 5 }} rowKey="key" />
        }))}
      />
    );
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      {contextHolder}

      {/* Header */}
      <div className="page-header">
        <div className="page-title-wrapper">
        <div className="page-title">
          <div style={{ background: "#00509d", borderRadius: 8, padding: 8, display: "flex" }}>
            <LineChartOutlined style={{ color: "white", fontSize: 20 }} />
          </div>
          Data Ketentuan
        </div>
        <div className="page-subtitle">Kelola ketentuan tunjangan pegawai</div>
        </div>
      </div>

      {/* Custom Filter Tabs */}
      <div className="custom-tabs-container">
        <button className={`tab-pill ${activeTab === "ketentuan" ? "active" : ""}`} onClick={() => setActiveTab("ketentuan")}>
          <BookOutlined /> Ketentuan Tunjangan
        </button>
        <button className={`tab-pill ${activeTab === "unitKerja" ? "active" : ""}`} onClick={() => setActiveTab("unitKerja")}>
          <BankOutlined /> Master Unit Kerja
        </button>
        <button className={`tab-pill ${activeTab === "jabatan" ? "active" : ""}`} onClick={() => setActiveTab("jabatan")}>
          <IdcardOutlined /> Master Jabatan
        </button>
      </div>

      <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ width: "300px" }}>
            <div style={{ color: "#bfbfbf", fontStyle: "italic", display: "none" }}>Cari data...</div>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ background: "#00509d", borderRadius: "6px", height: "40px", padding: "0 20px" }}>
            Tambah Data
          </Button>
        </div>

        {activeTab === "ketentuan" && renderKetentuanTable()}
        {activeTab === "unitKerja" && <Table columns={columnsUnitKerja} dataSource={dummyUnitKerja} pagination={{ pageSize: 8 }} rowKey="key" />}
        {activeTab === "jabatan" && <Table columns={columnsJabatan} dataSource={dummyJabatan} pagination={{ pageSize: 8 }} rowKey="key" />}
      </div>

      <ComponentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onOk={handleOk} 
        title={`Tambah Data ${activeTab === "ketentuan" ? `Ketentuan - ${subTab}` : activeTab === "unitKerja" ? "Unit Kerja" : "Jabatan"}`}
      >
        <CreateForm activeTab={activeTab} subTab={subTab} form={form} />
      </ComponentModal>
    </div>
  );
};
