import React, { useState } from "react";
import { Table, Button, Space, Tooltip, Input, Tag, Drawer, Descriptions } from "antd";
import { FileTextOutlined, LineChartOutlined, SearchOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

import { CreateLogPerubahan } from "./create";
import { VerifikasiModal } from "./verifikasi";
import "../../../styles/LogPerubahan.css";


interface ILogData {
  id: number;
  tanggalProses: string;
  namaPegawai: string;
  nip: string;
  nomorSPM: string;
  nominal: number;
  status: "Berhasil" | "Gagal";
  keterangan: string;
}

const DUMMY_DATA: ILogData[] = [
  { 
    id: 1, 
    tanggalProses: "10 Januari 2026, 09:15:23", 
    namaPegawai: "Dr. Bambang Sutrisno, M.Si", 
    nip: "196801051994031002",
    nomorSPM: "SPM-2026/01/0001",
    nominal: 5500000, 
    status: "Berhasil",
    keterangan: "berhasil dibayar"
  },
  { 
    id: 2, 
    tanggalProses: "10 Januari 2026, 09:18:45", 
    namaPegawai: "Dra. Siti Maemunah, M.A", 
    nip: "197205122002122001",
    nomorSPM: "SPM-2026/01/0002",
    nominal: 4500000, 
    status: "Berhasil",
    keterangan: "berhasil dibayar"
  },
  { 
    id: 3, 
    tanggalProses: "10 Januari 2026, 09:22:10", 
    namaPegawai: "Ir. Andi Prasetyo, M.T", 
    nip: "198003152006041003",
    nomorSPM: "SPM-2026/01/0003",
    nominal: 3500000, 
    status: "Gagal",
    keterangan: "Gagal dibayar"
  },
  { 
    id: 4, 
    tanggalProses: "10 Januari 2026, 10:05:32", 
    namaPegawai: "Drs. Heru Widodo, M.Hum", 
    nip: "198609202010091001",
    nomorSPM: "SPM-2026/01/0004",
    nominal: 3000000, 
    status: "Berhasil",
    keterangan: "berhasil dibayar"
  },
  { 
    id: 5, 
    tanggalProses: "10 Januari 2026, 10:12:55", 
    namaPegawai: "Sri Rahayu, S.Sos, M.Si", 
    nip: "198905182011012002",
    nomorSPM: "SPM-2026/01/0005",
    nominal: 2500000, 
    status: "Berhasil",
    keterangan: "berhasil dibayar"
  },
  { 
    id: 6, 
    tanggalProses: "10 Januari 2026, 10:18:20", 
    namaPegawai: "Agus Salim, S.Kom, M.T.I", 
    nip: "199002252012041001",
    nomorSPM: "SPM-2026/01/0006",
    nominal: 3850000, 
    status: "Gagal",
    keterangan: "Gagal dibayar"
  },
  { 
    id: 7, 
    tanggalProses: "10 Januari 2026, 11:05:45", 
    namaPegawai: "Dwi Handayani, S.H, M.H", 
    nip: "199108152013091002",
    nomorSPM: "SPM-2026/01/0007",
    nominal: 3750000, 
    status: "Berhasil",
    keterangan: "berhasil dibayar"
  },
  { 
    id: 8, 
    tanggalProses: "10 Januari 2026, 11:15:10", 
    namaPegawai: "Rina Kusumawati, S.Sos", 
    nip: "199204182015062001",
    nomorSPM: "SPM-2026/01/0008",
    nominal: 3550000, 
    status: "Berhasil",
    keterangan: "berhasil dibayar"
  },
  { 
    id: 9, 
    tanggalProses: "11 Januari 2026, 08:30:15", 
    namaPegawai: "Muhammad Faisal, S.IP", 
    nip: "199306222017031001",
    nomorSPM: "SPM-2026/01/0009",
    nominal: 3350000, 
    status: "Berhasil",
    keterangan: "berhasil dibayar"
  },
  { 
    id: 10, 
    tanggalProses: "11 Januari 2026, 08:45:30", 
    namaPegawai: "Laila Nurjanah, S.Psi", 
    nip: "199508102019042002",
    nomorSPM: "SPM-2026/01/0010",
    nominal: 3150000, 
    status: "Gagal",
    keterangan: "Gagal dibayar"
  },
];

export const LogPerubahanList: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ILogData | null>(null);
  const [verifikasiModalOpen, setVerifikasiModalOpen] = useState(false);
  const [verifikasiRecord, setVerifikasiRecord] = useState<ILogData | null>(null);

  const formatRupiah = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  const handleViewDetail = (record: ILogData) => {
    setSelectedRecord(record);
    setDetailDrawerOpen(true);
  };

  const handleVerifikasi = (record: ILogData) => {
    setVerifikasiRecord(record);
    setVerifikasiModalOpen(true);
  };

  const totalLog = DUMMY_DATA.length;
  const totalBerhasil = DUMMY_DATA.filter(item => item.status === "Berhasil").length;
  const totalGagal = DUMMY_DATA.filter(item => item.status === "Gagal").length;
  const totalNominalBerhasil = DUMMY_DATA.filter(item => item.status === "Berhasil").reduce((acc, curr) => acc + curr.nominal, 0);

  return (
    <div className="log-container">
      <div className="log-header">
        <h1 className="log-title">
          <div style={{ background: "#00509d", borderRadius: 8, padding: 8, display: "flex", marginRight: 8 }}>
            <FileTextOutlined style={{ color: "white", fontSize: 20 }} />
          </div>
          Log Perubahan
        </h1>
        <p className="log-subtitle">Histori Proses Perubahan Tunjangan PAS</p>
      </div>

      {/* Statistik Cards di atas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Card 1: Total Log */}
        <div className="stat-card-side">
          <div className="stat-content">
            <label>Total Log</label>
            <h2>{totalLog}</h2>
            <span style={{ fontSize: 10, color: "#9ca3af" }}>Total transaksi</span>
          </div>
          <div className="stat-icon bg-blue-light">
            <FileTextOutlined />
          </div>
        </div>

        {/* Card 2: Berhasil */}
        <div className="stat-card-side">
          <div className="stat-content">
            <label>Berhasil</label>
            <h2 style={{ color: "#059669" }}>{totalBerhasil}</h2>
            <span style={{ fontSize: 10, color: "#9ca3af" }}>Perubahan sukses</span>
          </div>
          <div className="stat-icon bg-green-light">
            <CheckCircleOutlined />
          </div>
        </div>

        {/* Card 3: Gagal */}
        <div className="stat-card-side">
          <div className="stat-content">
            <label>Gagal</label>
            <h2 style={{ color: "#dc2626" }}>{totalGagal}</h2>
            <span style={{ fontSize: 10, color: "#9ca3af" }}>Perubahan gagal</span>
          </div>
          <div className="stat-icon" style={{ background: "#fee2e2", color: "#dc2626" }}>
            <CloseCircleOutlined />
          </div>
        </div>

        {/* Card 4: Total Nominal Berhasil */}
        <div className="stat-card-side">
          <div className="stat-content">
            <label>Total Dibayarkan</label>
            <h2 className="green" style={{ fontSize: "16px" }}>{formatRupiah(totalNominalBerhasil)}</h2>
            <span style={{ fontSize: 10, color: "#9ca3af" }}>Nominal berhasil</span>
          </div>
          <div className="stat-icon bg-green-light">
            <LineChartOutlined />
          </div>
        </div>
      </div>

      {/* Search Bar */}
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

      {/* Tabel dengan scroll horizontal */}
      <div className="table-card-log">
        <Table 
          dataSource={DUMMY_DATA} 
          rowKey="id" 
          pagination={{ pageSize: 10, showSizeChanger: true }} 
          scroll={{ x: 1400 }}
        >
              <Table.Column
                title="Tanggal Proses"
                dataIndex="tanggalProses"
                width={180}
                sorter={(a: ILogData, b: ILogData) => new Date(a.tanggalProses).getTime() - new Date(b.tanggalProses).getTime()}
                render={(text) => (
                  <div style={{ fontSize: "12px" }}>
                    <div style={{ fontWeight: "500", color: "#1f2937" }}>{text.split(", ")[0]}</div>
                    <div style={{ color: "#6b7280" }}>{text.split(", ")[1]}</div>
                  </div>
                )}
              />

              <Table.Column
                title="Nama Pegawai"
                dataIndex="namaPegawai"
                width={200}
                sorter={(a: ILogData, b: ILogData) => a.namaPegawai.localeCompare(b.namaPegawai)}
                render={(text) => <strong>{text}</strong>}
              />

              <Table.Column 
                title="NIP" 
                dataIndex="nip" 
                width={160}
              />

              <Table.Column 
                title="Nomor SPM" 
                dataIndex="nomorSPM" 
                width={160}
                render={(text) => <span style={{ fontFamily: "monospace", fontSize: "12px" }}>{text}</span>}
              />

              <Table.Column 
                title="Nominal" 
                dataIndex="nominal" 
                width={150}
                sorter={(a: ILogData, b: ILogData) => a.nominal - b.nominal} 
                render={(val) => <span style={{ color: "#059669", fontWeight: "bold" }}>{formatRupiah(val)}</span>}
              />

              <Table.Column 
                title="Status" 
                dataIndex="status" 
                width={120}
                filters={[
                  { text: "Berhasil", value: "Berhasil" },
                  { text: "Gagal", value: "Gagal" },
                ]}
                onFilter={(value, record: ILogData) => record.status === value}
                render={(val) => (
                  <Tag 
                    icon={val === "Berhasil" ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    color={val === "Berhasil" ? "success" : "error"}
                  >
                    {val}
                  </Tag>
                )}
              />

              <Table.Column 
                title="Keterangan" 
                dataIndex="keterangan" 
                width={250}
                ellipsis
                render={(text) => (
                  <Tooltip title={text}>
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>{text}</span>
                  </Tooltip>
                )}
              />

              <Table.Column
                title="Aksi"
                key="action"
                align="center"
                width={120}
                fixed="right"
                render={(_, record: ILogData) => (
                  <Space size="small">
                    <Tooltip title="Detail">
                      <Button 
                        icon={<EyeOutlined />} 
                        className="action-btn action-view" 
                        onClick={() => handleViewDetail(record)}
                      />
                    </Tooltip>
                    <Tooltip title={record.status === "Berhasil" ? "Verifikasi & Upload SK" : "Hanya tersedia untuk status Berhasil"}>
                      <Button 
                        icon={<SafetyCertificateOutlined />} 
                        className="action-btn"
                        disabled={record.status !== "Berhasil"}
                        style={{ 
                          background: record.status === "Berhasil" ? "#52c41a" : "#f5f5f5", 
                          borderColor: record.status === "Berhasil" ? "#52c41a" : "#d9d9d9",
                          color: record.status === "Berhasil" ? "white" : "#bfbfbf",
                          cursor: record.status === "Berhasil" ? "pointer" : "not-allowed"
                        }}
                        onClick={() => record.status === "Berhasil" && handleVerifikasi(record)}
                      />
                    </Tooltip>
                  </Space>
                )}
              />
            </Table>
          </div>

      <Drawer
        title={<span style={{ fontSize: "18px", fontWeight: "bold" }}>Detail Log Perubahan</span>}
        placement="right"
        width={600}
        onClose={() => setDetailDrawerOpen(false)}
        open={detailDrawerOpen}
      >
        {selectedRecord && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Tanggal Proses">
              <strong>{selectedRecord.tanggalProses}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Nama Pegawai">
              <strong>{selectedRecord.namaPegawai}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="NIP">{selectedRecord.nip}</Descriptions.Item>
            <Descriptions.Item label="Nomor SPM">
              <span style={{ fontFamily: "monospace" }}>{selectedRecord.nomorSPM}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Nominal">
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "#059669" }}>
                {formatRupiah(selectedRecord.nominal)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag 
                icon={selectedRecord.status === "Berhasil" ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                color={selectedRecord.status === "Berhasil" ? "success" : "error"}
                style={{ fontSize: "14px", padding: "4px 12px" }}
              >
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Keterangan">
              <span style={{ color: "#6b7280" }}>{selectedRecord.keterangan}</span>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
      
      <CreateLogPerubahan open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      
      {/* Modal Verifikasi */}
      <VerifikasiModal 
        open={verifikasiModalOpen} 
        onClose={() => setVerifikasiModalOpen(false)}
        record={verifikasiRecord}
      />
    </div>
  );
};
