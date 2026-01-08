import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import { Table, Button, Space, Tooltip, Tag } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, LineChartOutlined, CheckCircleOutlined, PlusOutlined, SafetyCertificateFilled } from "@ant-design/icons";

import { CreateTupas } from "./create";
import "../../../styles/dataTupas.css"; 


interface ITupasData {
  id: number;
  nama: string;
  nip: string;
  jabatan: string;
  golongan: string;
  gaji_pokok: number;
  tunjangan: number;
  potongan: number;
  total: number;
  status: "Aktif" | "Nonaktif";
  periode: string;
}


const DUMMY_DATA: ITupasData[] = [
  {
    id: 1,
    nama: "Budi Santoso",
    nip: "19850315198603001",
    jabatan: "Kepala Bagian",
    golongan: "III/c",
    gaji_pokok: 5000000,
    tunjangan: 1500000,
    potongan: 250000,
    total: 6250000,
    status: "Aktif",
    periode: "01/2024",
  },
  {
    id: 2,
    nama: "Sinta Dewi",
    nip: "19880422199003002",
    jabatan: "Staf Administrasi",
    golongan: "II/c",
    gaji_pokok: 3500000,
    tunjangan: 1000000,
    potongan: 150000,
    total: 4350000,
    status: "Aktif",
    periode: "01/2024",
  },
];

export const TupasList: React.FC = () => {
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  
  
  
  const { tableProps } = useTable<ITupasData>({
    resource: "tupas",
    syncWithLocation: true,
  });

  
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  
  const totalData = DUMMY_DATA.length;
  const totalGajiPokok = DUMMY_DATA.reduce((acc, curr) => acc + curr.gaji_pokok, 0);

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
            <div className="stat-label">Total Data</div>
            <div className="stat-value">{totalData}</div>
          </div>
          <div className="stat-icon-box icon-blue">
            <LineChartOutlined />
          </div>
        </div>

        {/* Card 2: Total Gaji Pokok */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Gaji Pokok</div>
            <div className="stat-value green">{formatRupiah(totalGajiPokok)}</div>
          </div>
          <div className="stat-icon-box icon-green">
            <CheckCircleOutlined />
          </div>
        </div>

        {/* Card 3: Tombol Tambah Data (Dibuat seperti Card) */}
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
          {...tableProps}
          dataSource={DUMMY_DATA} 
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: true }}
        >
          <Table.Column
            dataIndex="nama"
            title="Nama"
            sorter={(a: ITupasData, b: ITupasData) => a.nama.localeCompare(b.nama)}
            render={(value, record: ITupasData) => (
              <div>
                <div style={{ fontWeight: "bold" }}>{value}</div>
              </div>
            )}
          />
          <Table.Column dataIndex="nip" title="NIP" />
          <Table.Column dataIndex="jabatan" title="Jabatan" />
          <Table.Column dataIndex="golongan" title="Golongan" />
          <Table.Column dataIndex="gaji_pokok" title="Gaji Pokok" sorter={(a: ITupasData, b: ITupasData) => a.gaji_pokok - b.gaji_pokok} render={(value) => formatRupiah(value)} />
          <Table.Column dataIndex="tunjangan" title="Tunjangan" render={(value) => formatRupiah(value)} />
          <Table.Column dataIndex="potongan" title="Potongan" render={(value) => formatRupiah(value)} />
          <Table.Column dataIndex="total" title="Total" render={(value) => <span style={{ color: "#059669", fontWeight: "bold" }}>{formatRupiah(value)}</span>} />
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value) => (
              <span className={`status-badge ${value === "Aktif" ? "status-active" : ""}`}>
                <CheckCircleOutlined /> {value}
              </span>
            )}
          />
          <Table.Column dataIndex="periode" title="Periode" />
          <Table.Column
            title="Aksi"
            key="action"
            align="center"
            render={(_, record: ITupasData) => (
              <Space size={8} className="action-btn-group">
                <Tooltip title="Lihat">
                  <Button icon={<EyeOutlined />} className="action-btn action-view" />
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

      {/* Modal Component */}
      <CreateTupas open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};
