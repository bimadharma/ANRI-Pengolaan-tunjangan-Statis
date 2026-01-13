import React, { useState } from "react";
import { Table, Button, Space, Tooltip, DatePicker, Modal, Tag, Drawer, Descriptions } from "antd";
import { PlusOutlined, ArrowLeftOutlined, WalletOutlined, CalendarOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { CreatePayment } from "./create";
import "../../../styles/dataPembayaran.css";


interface IPeriod {
  id: string;
  month: string;
  year: string;
  totalEmployee: number;
  paidCount: number;
  unpaidCount: number;
}

interface IPaymentDetail {
  id: string;
  namaPegawai: string;
  nip: string;
  unitKerja: string;
  nomorSK: string;
  tanggalSK: string;
  tmtBerlaku: string;
  besarTunjangan: number;
  statusPembayaran: "Siap Bayar" | "Tertunda";
}


const DUMMY_PERIODS: IPeriod[] = [
  { id: "1", month: "Januari", year: "2026", totalEmployee: 45, paidCount: 38, unpaidCount: 7 },
  { id: "2", month: "Desember", year: "2025", totalEmployee: 44, paidCount: 44, unpaidCount: 0 },
  { id: "3", month: "November", year: "2025", totalEmployee: 42, paidCount: 40, unpaidCount: 2 },
];

const DUMMY_DETAILS: IPaymentDetail[] = [
  { 
    id: "101", 
    namaPegawai: "Dr. Bambang Sutrisno, M.Si", 
    nip: "196801051994031002", 
    unitKerja: "Sekretariat Utama",
    nomorSK: "SK-ANRI/001/I/2026",
    tanggalSK: "02 Januari 2026",
    tmtBerlaku: "01 Januari 2026",
    besarTunjangan: 5500000, 
    statusPembayaran: "Siap Bayar" 
  },
  { 
    id: "102", 
    namaPegawai: "Dra. Siti Maemunah, M.A", 
    nip: "197205122002122001", 
    unitKerja: "Deputi Pembinaan Kearsipan",
    nomorSK: "SK-ANRI/002/I/2026",
    tanggalSK: "02 Januari 2026",
    tmtBerlaku: "01 Januari 2026",
    besarTunjangan: 4500000, 
    statusPembayaran: "Siap Bayar" 
  },
  { 
    id: "103", 
    namaPegawai: "Ir. Andi Prasetyo, M.T", 
    nip: "198003152006041003", 
    unitKerja: "Deputi Konservasi Arsip",
    nomorSK: "SK-ANRI/003/I/2026",
    tanggalSK: "03 Januari 2026",
    tmtBerlaku: "01 Januari 2026",
    besarTunjangan: 3500000, 
    statusPembayaran: "Tertunda" 
  },
  { 
    id: "104", 
    namaPegawai: "Drs. Heru Widodo, M.Hum", 
    nip: "198609202010091001", 
    unitKerja: "Deputi Informasi & Akses",
    nomorSK: "SK-ANRI/004/I/2026",
    tanggalSK: "03 Januari 2026",
    tmtBerlaku: "01 Januari 2026",
    besarTunjangan: 3000000, 
    statusPembayaran: "Siap Bayar" 
  },
  { 
    id: "105", 
    namaPegawai: "Sri Rahayu, S.Sos, M.Si", 
    nip: "198905182011012002", 
    unitKerja: "Inspektorat",
    nomorSK: "SK-ANRI/005/I/2026",
    tanggalSK: "04 Januari 2026",
    tmtBerlaku: "01 Januari 2026",
    besarTunjangan: 2500000, 
    statusPembayaran: "Siap Bayar" 
  },
  { 
    id: "106", 
    namaPegawai: "Agus Salim, S.Kom, M.T.I", 
    nip: "199002252012041001", 
    unitKerja: "Pusat Arsip Swasta",
    nomorSK: "SK-ANRI/006/I/2026",
    tanggalSK: "04 Januari 2026",
    tmtBerlaku: "01 Januari 2026",
    besarTunjangan: 3850000, 
    statusPembayaran: "Tertunda" 
  },
  { 
    id: "107", 
    namaPegawai: "Dwi Handayani, S.H, M.H", 
    nip: "199108152013091002", 
    unitKerja: "Bagian Hukum",
    nomorSK: "SK-ANRI/007/I/2026",
    tanggalSK: "05 Januari 2026",
    tmtBerlaku: "01 Januari 2026",
    besarTunjangan: 3750000, 
    statusPembayaran: "Siap Bayar" 
  },
];

export const PembayaranList: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<IPeriod | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IPaymentDetail | null>(null);

  const formatRupiah = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  const handleViewDetail = (record: IPaymentDetail) => {
    setSelectedRecord(record);
    setDetailDrawerOpen(true);
  };

  
  const renderPeriodGrid = () => (
    <>
      <div className="page-header">
        <div className="page-title-wrapper">
        <h1 className="page-title">
          <CalendarOutlined style={{ color: "#1677ff" }} /> Data Pembayaran
        </h1>
        <p className="pembayaran-subtitle">Kelola riwayat tunjangan pegawai</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsPeriodModalOpen(true)} style={{ background: "#4338ca" }}>
          Buat Periode Baru
        </Button>
      </div>

      <div className="period-grid">
        {DUMMY_PERIODS.map((period) => (
          <div key={period.id} className="period-card" onClick={() => setSelectedPeriod(period)}>
            <div className="period-month">{period.month}</div>
            <div className="period-year">{period.year}</div>

            <div className="period-stats">
              <div className="stat-item">
                <span className="stat-label">Pegawai</span>
                <span className="stat-val">{period.totalEmployee}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Lunas</span>
                <span className="stat-val lunas">{period.paidCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Belum</span>
                <span className="stat-val belum">{period.unpaidCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Simpel untuk buat Periode Baru */}
      <Modal
        title="Buat Periode Baru"
        open={isPeriodModalOpen}
        onCancel={() => setIsPeriodModalOpen(false)}
        onOk={() => {
          
          setIsPeriodModalOpen(false);
        }}
        okText="Buat"
        cancelText="Batal"
      >
        <div style={{ padding: "20px 0" }}>
          <p>Pilih Bulan dan Tahun untuk periode baru:</p>
          <DatePicker picker="month" style={{ width: "100%" }} />
          <p style={{ marginTop: 10, fontSize: 12, color: "#666" }}>*Akan membuat tabel kosong untuk periode ini.</p>
        </div>
      </Modal>
    </>
  );

  
  const renderDetailTable = () => {
    if (!selectedPeriod) return null;

    return (
      <>
        <div className="back-btn" onClick={() => setSelectedPeriod(null)}>
          <ArrowLeftOutlined /> Kembali ke Daftar Periode
        </div>

        <div className="page-header">
          <h1 className="page-title">
            <WalletOutlined />
            Detail {selectedPeriod.month} {selectedPeriod.year}
          </h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)} style={{ background: "#4338ca" }}>
            Tambah Data
          </Button>
        </div>

        <div className="table-card">
          <Table dataSource={DUMMY_DETAILS} rowKey="id" pagination={{ pageSize: 10, showSizeChanger: true }} scroll={{ x: 1400 }}>
            <Table.Column 
              title="Nama Pegawai" 
              dataIndex="namaPegawai" 
              width={200}
              fixed="left"
              sorter={(a: IPaymentDetail, b: IPaymentDetail) => a.namaPegawai.localeCompare(b.namaPegawai)} 
              render={(value) => <strong>{value}</strong>}
            />
            <Table.Column 
              title="NIP" 
              dataIndex="nip" 
              width={160}
            />
            <Table.Column 
              title="Unit Kerja" 
              dataIndex="unitKerja" 
              width={180}
              render={(value) => <Tag color="blue">{value}</Tag>}
            />
            <Table.Column 
              title="Nomor SK Tunjangan PAS" 
              dataIndex="nomorSK" 
              width={180}
              render={(value) => <span style={{ fontFamily: "monospace", fontSize: "12px" }}>{value}</span>}
            />
            <Table.Column 
              title="Tanggal SK" 
              dataIndex="tanggalSK" 
              width={130}
            />
            <Table.Column 
              title="TMT Berlaku" 
              dataIndex="tmtBerlaku" 
              width={130}
            />
            <Table.Column 
              title="Besar Tunjangan PAS" 
              dataIndex="besarTunjangan" 
              width={160}
              sorter={(a: IPaymentDetail, b: IPaymentDetail) => a.besarTunjangan - b.besarTunjangan} 
              render={(val) => <span style={{ color: "#059669", fontWeight: "bold" }}>{formatRupiah(val)}</span>}
            />
            <Table.Column 
              title="Status Pembayaran" 
              dataIndex="statusPembayaran" 
              width={140}
              render={(val) => (
                <Tag color={val === "Siap Bayar" ? "green" : "orange"}>
                  {val}
                </Tag>
              )} 
            />
            <Table.Column
              title="Aksi"
              key="action"
              align="center"
              width={120}
              fixed="right"
              render={(_, record: IPaymentDetail) => (
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
          title={<span style={{ fontSize: "18px", fontWeight: "bold" }}>Detail Pembayaran Tunjangan PAS</span>}
          placement="right"
          width={600}
          onClose={() => setDetailDrawerOpen(false)}
          open={detailDrawerOpen}
        >
          {selectedRecord && (
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Nama Pegawai">
                <strong>{selectedRecord.namaPegawai}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="NIP">{selectedRecord.nip}</Descriptions.Item>
              <Descriptions.Item label="Unit Kerja">
                <Tag color="blue">{selectedRecord.unitKerja}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Nomor SK Tunjangan PAS">
                <span style={{ fontFamily: "monospace" }}>{selectedRecord.nomorSK}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Tanggal SK">{selectedRecord.tanggalSK}</Descriptions.Item>
              <Descriptions.Item label="TMT Berlaku">{selectedRecord.tmtBerlaku}</Descriptions.Item>
              <Descriptions.Item label="Besar Tunjangan PAS">
                <span style={{ fontSize: "20px", fontWeight: "bold", color: "#059669" }}>
                  {formatRupiah(selectedRecord.besarTunjangan)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Status Pembayaran">
                <Tag color={selectedRecord.statusPembayaran === "Siap Bayar" ? "green" : "orange"} style={{ fontSize: "14px", padding: "4px 12px" }}>
                  {selectedRecord.statusPembayaran}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Drawer>

        {/* Modal Create Data Pegawai (Imported) */}
        <CreatePayment open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} periodName={`${selectedPeriod.month} ${selectedPeriod.year}`} />
      </>
    );
  };

  return <div className="pembayaran-container">{selectedPeriod ? renderDetailTable() : renderPeriodGrid()}</div>;
};
