import React, { useState } from "react";
import { Table, Button, Space, Tooltip, Avatar, Input } from "antd";
import { TeamOutlined, LineChartOutlined, PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

import { CreateLogPembayaran } from "./create";
import "../../../styles/LogPembayaran.css";


interface ILogData {
  id: number;
  nama: string;
  posisi: string;
  unit: string; 
  nominal: number;
}

const DUMMY_DATA: ILogData[] = [
  { id: 1, nama: "Ahmad Fauzi", posisi: "Product Manager", unit: "Product Team", nominal: 12000000 },
  { id: 2, nama: "Budi Santoso", posisi: "Senior Developer", unit: "Engineering", nominal: 8000000 },
  { id: 3, nama: "Sinta Dewi", posisi: "UI/UX Designer", unit: "Design Team", nominal: 7500000 },
  { id: 4, nama: "Rina Wijaya", posisi: "QA Engineer", unit: "Engineering", nominal: 6500000 },
];

export const LogPembayaranList: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  
  const formatRupiah = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  
  const totalPegawai = DUMMY_DATA.length;
  const totalNominal = DUMMY_DATA.reduce((acc, curr) => acc + curr.nominal, 0);

  return (
    <div className="log-container">
      {/* Header Judul */}
      <div className="log-header">
        <h1 className="log-title">
          <div style={{ background: "#3b82f6", borderRadius: 8, padding: 6, display: "flex" }}>
            <TeamOutlined style={{ color: "white", fontSize: 20 }} />
          </div>
          Log Pembayaran
        </h1>
        <p className="log-subtitle">Kelola Log Pembayaran Pegawai</p>
      </div>

      {/* Layout Grid: Kiri Tabel, Kanan Sidebar */}
      <div className="log-layout">
        {/* --- KOLOM KIRI: TABEL UTAMA --- */}
        <div className="left-content">
          {/* Search Bar (Optional, visual only sesuai gambar) */}
          <Input
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            placeholder="Cari data..."
            style={{
              marginBottom: 20,
              borderRadius: 8,
              padding: "10px 12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          />

          <div className="table-card-log">
            <Table dataSource={DUMMY_DATA} rowKey="id" pagination={{ pageSize: 5 }}>
              <Table.Column
                title="Nama"
                dataIndex="nama"
                sorter={(a: ILogData, b: ILogData) => a.nama.localeCompare(b.nama)}
                render={(text) => (
                  <div className="user-info">
                    <Avatar className="user-avatar" icon={<UserOutlined />}>
                      {text.charAt(0)}
                    </Avatar>
                    <span className="user-name">{text}</span>
                  </div>
                )}
              />

              <Table.Column title="Posisi" dataIndex="posisi" sorter={(a: ILogData, b: ILogData) => a.posisi.localeCompare(b.posisi)} render={(text) => <span className="position-badge">{text}</span>} />

              <Table.Column title="Unit" dataIndex="unit" sorter={(a: ILogData, b: ILogData) => a.unit.localeCompare(b.unit)} render={(text) => <span style={{ color: "#6b7280" }}>{text}</span>} />

              <Table.Column title="Nominal" dataIndex="nominal" sorter={(a: ILogData, b: ILogData) => a.nominal - b.nominal} render={(val) => <span style={{ color: "#059669", fontWeight: "bold" }}>{formatRupiah(val)}</span>} />

              <Table.Column
                title="Aksi"
                key="action"
                align="center"
                render={() => (
                  <Space size={8} className="action-btn-group">
                    <Tooltip title="View">
                      <Button icon={<EyeOutlined />} className="action-btn action-view" />
                    </Tooltip>

                    <Tooltip title="Edit">
                      <Button icon={<EditOutlined />} className="action-btn action-edit" />
                    </Tooltip>

                    <Tooltip title="Delete">
                      <Button icon={<DeleteOutlined />} className="action-btn action-delete" />
                    </Tooltip>
                  </Space>
                )}
              />
            </Table>
          </div>
        </div>

        {/* --- KOLOM KANAN: SIDEBAR STATISTIK & BUTTON --- */}
        <div className="sidebar-wrapper">
          {/* Card 1: Total Pegawai */}
          <div className="stat-card-side">
            <div className="stat-content">
              <label>Total Pegawai</label>
              <h2>{totalPegawai}</h2>
            </div>
            <div className="stat-icon bg-blue-light">
              <TeamOutlined />
            </div>
          </div>

          {/* Card 2: Total Nominal */}
          <div className="stat-card-side">
            <div className="stat-content">
              <label>Total Nominal</label>
              <h2 className="green">{formatRupiah(totalNominal)}</h2>
              <span style={{ fontSize: 10, color: "#9ca3af" }}>Akumulasi gaji pegawai</span>
            </div>
            <div className="stat-icon bg-green-light">
              <LineChartOutlined />
            </div>
          </div>

          {/* Button Create Besar */}
          <div className="btn-create-gradient" onClick={() => setIsCreateModalOpen(true)}>
            <div>
              <div className="btn-label">Tambah Pegawai</div>
              <div className="btn-action-text">Klik di sini</div>
            </div>
            <div className="btn-icon-box">
              <PlusOutlined />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Create */}
      <CreateLogPembayaran open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};
