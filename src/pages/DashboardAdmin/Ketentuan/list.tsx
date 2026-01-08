import React, { useState } from "react";
import { Table, Button, Space, Tag, Tooltip, notification, Form } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, BookOutlined, BankOutlined, IdcardOutlined, LineChartOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { ComponentModal } from "../../../components/componentModal";
import { CreateForm } from "./create";
import "../../../styles/ketentuan.css";


interface KetentuanData {
  key: string;
  jabatan: string;
  masaKerja: string;
  penjelasan: string;
  nominal: number;
}

interface UnitData {
  key: string;
  kode: string;
  namaUnit: string;
  lokasi: string;
}

interface JabatanData {
  key: string;
  namaJabatan: string;
  grade: string;
}


const dummyKetentuan: KetentuanData[] = [
  {
    key: "1",
    jabatan: "Arsiparis Ahli Pertama",
    masaKerja: "2 Tahun",
    penjelasan: "Pasal 5 Ayat 1 (Masa kerja minimal terpenuhi)",
    nominal: 5400000,
  },
  {
    key: "2",
    jabatan: "Arsiparis Ahli Madya",
    masaKerja: "10 Tahun",
    penjelasan: "Pasal 7 Ayat 2 (Keahlian khusus)",
    nominal: 8500000,
  },
];

const dummyUnit: UnitData[] = [
  { key: "1", kode: "UK-001", namaUnit: "Pusat Pengolahan Arsip", lokasi: "Gedung A" },
  { key: "2", kode: "UK-002", namaUnit: "Sekretariat Utama", lokasi: "Gedung B" },
];

const dummyJabatan: JabatanData[] = [
  { key: "1", namaJabatan: "Arsiparis Ahli Pertama", grade: "Grade 8" },
  { key: "2", namaJabatan: "Arsiparis Ahli Muda", grade: "Grade 9" },
  { key: "3", namaJabatan: "Arsiparis Ahli Madya", grade: "Grade 11" },
];

export const KetentuanList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ketentuan" | "unit" | "jabatan">("ketentuan");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  
  const columnsKetentuan: ColumnsType<KetentuanData> = [
    {
      title: "Jabatan (Ref)",
      dataIndex: "jabatan",
      key: "jabatan",
      sorter: (a, b) => a.jabatan.localeCompare(b.jabatan),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Masa Kerja Min",
      dataIndex: "masaKerja",
      key: "masaKerja",
      sorter: (a, b) => a.masaKerja.localeCompare(b.masaKerja),
      render: (text) => <Tag color="default">{text}</Tag>,
    },
    {
      title: "Paragraf Penjelasan",
      dataIndex: "penjelasan",
      key: "penjelasan",
      render: (text) => <span style={{ color: "#595959", fontStyle: "italic" }}>{text}</span>,
    },
    {
      title: "Nominal",
      dataIndex: "nominal",
      key: "nominal",
      sorter: (a, b) => a.nominal - b.nominal,
      render: (value) => <span style={{ color: "#389e0d", fontWeight: "bold" }}>Rp {value.toLocaleString("id-ID")}</span>,
    },
    {
      title: "AKSI",
      key: "action",
      align: "center",
      render: () => (
        <Space size={8} className="action-btn-group">
          <Tooltip title="Detail">
            <Button icon={<EyeOutlined />} className="action-btn action-view" />
          </Tooltip>

          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} className="action-btn action-edit" />
          </Tooltip>

          <Tooltip title="Hapus">
            <Button icon={<DeleteOutlined />} className="action-btn action-delete" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  
  const columnsUnit: ColumnsType<UnitData> = [
    {
      title: "Kode",
      dataIndex: "kode",
      key: "kode",
      sorter: (a, b) => a.kode.localeCompare(b.kode),
      render: (text) => <span style={{ color: "#1677ff" }}>{text}</span>,
    },
    {
      title: "Nama Unit",
      dataIndex: "namaUnit",
      key: "namaUnit",
      sorter: (a, b) => a.namaUnit.localeCompare(b.namaUnit),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Lokasi",
      dataIndex: "lokasi",
      key: "lokasi",
      sorter: (a, b) => a.lokasi.localeCompare(b.lokasi),
      render: (text) => <span style={{ color: "#595959" }}>{text}</span>,
    },
    {
      title: "AKSI",
      key: "action",
      align: "center",
      render: () => (
        <Space size={8} className="action-btn-group">
          <Tooltip title="Detail">
            <Button icon={<EyeOutlined />} className="action-btn action-view" />
          </Tooltip>

          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} className="action-btn action-edit" />
          </Tooltip>

          <Tooltip title="Hapus">
            <Button icon={<DeleteOutlined />} className="action-btn action-delete" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  
  const columnsJabatan: ColumnsType<JabatanData> = [
    {
      title: "Nama Jabatan",
      dataIndex: "namaJabatan",
      key: "namaJabatan",
      sorter: (a, b) => a.namaJabatan.localeCompare(b.namaJabatan),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      sorter: (a, b) => a.grade.localeCompare(b.grade),
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "AKSI",
      key: "action",
      align: "center",
      render: () => (
        <Space size={8} className="action-btn-group">
          <Tooltip title="Detail">
            <Button icon={<EyeOutlined />} className="action-btn action-view" />
          </Tooltip>

          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} className="action-btn action-edit" />
          </Tooltip>

          <Tooltip title="Hapus">
            <Button icon={<DeleteOutlined />} className="action-btn action-delete" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form Values:", values);
        api.success({
          message: "Berhasil Menambahkan Data",
          description: `Data baru telah berhasil ditambahkan ke tabel ${activeTab === "ketentuan" ? "Ketentuan Tunjangan" : activeTab === "unit" ? "Unit Kerja" : "Master Jabatan"}.`,
          placement: "topRight",
        });
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      {contextHolder}

      {/* Header */}
      <div className="page-header">
        <div className="page-title-wrapper">
        <div className="page-title">
          <div style={{ background: "#1677ff", borderRadius: 8, padding: 8, display: "flex" }}>
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
        <button className={`tab-pill ${activeTab === "unit" ? "active" : ""}`} onClick={() => setActiveTab("unit")}>
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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ borderRadius: "6px", height: "40px", padding: "0 20px" }}>
            Tambah Data
          </Button>
        </div>

        {activeTab === "ketentuan" && <Table columns={columnsKetentuan} dataSource={dummyKetentuan} pagination={{ pageSize: 5 }} rowKey="key" />}
        {activeTab === "unit" && <Table columns={columnsUnit} dataSource={dummyUnit} pagination={{ pageSize: 5 }} rowKey="key" />}
        {activeTab === "jabatan" && <Table columns={columnsJabatan} dataSource={dummyJabatan} pagination={{ pageSize: 5 }} rowKey="key" />}
      </div>

      <ComponentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onOk={handleOk} title={`Tambah Data ${activeTab === "ketentuan" ? "Ketentuan Tunjangan" : activeTab === "unit" ? "Unit Kerja" : "Jabatan"}`}>
        <CreateForm activeTab={activeTab} form={form} />
      </ComponentModal>
    </div>
  );
};
