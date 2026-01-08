import React, { useState } from "react";
import { Table, Button, Space, Tooltip, DatePicker, Modal } from "antd";
import { PlusOutlined, ArrowLeftOutlined, WalletOutlined, CalendarOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
  nama: string;
  nip: string;
  jabatan: string;
  nominal: number;
  status: "paid" | "pending";
}


const DUMMY_PERIODS: IPeriod[] = [
  { id: "1", month: "Januari", year: "2026", totalEmployee: 45, paidCount: 40, unpaidCount: 5 },
  { id: "2", month: "Desember", year: "2025", totalEmployee: 44, paidCount: 44, unpaidCount: 0 },
  { id: "3", month: "November", year: "2025", totalEmployee: 42, paidCount: 40, unpaidCount: 2 },
];

const DUMMY_DETAILS: IPaymentDetail[] = [
  { id: "101", nama: "Bima Sakti", nip: "199001", jabatan: "Developer", nominal: 8500000, status: "paid" },
  { id: "102", nama: "Siti Aminah", nip: "199002", jabatan: "HRD", nominal: 7000000, status: "pending" },
  { id: "103", nama: "Joko Anwar", nip: "199003", jabatan: "Manager", nominal: 12000000, status: "paid" },
  
];

export const PembayaranList: React.FC = () => {
  
  const [selectedPeriod, setSelectedPeriod] = useState<IPeriod | null>(null);

  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);

  
  const formatRupiah = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  
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
          <Table dataSource={DUMMY_DETAILS} rowKey="id" pagination={{ pageSize: 5 }}>
            <Table.Column title="Nama Pegawai" dataIndex="nama" sorter={(a: IPaymentDetail, b: IPaymentDetail) => a.nama.localeCompare(b.nama)} />
            <Table.Column title="NIP" dataIndex="nip" />
            <Table.Column title="Jabatan" dataIndex="jabatan" />
            <Table.Column title="Nominal" dataIndex="nominal" sorter={(a: IPaymentDetail, b: IPaymentDetail) => a.nominal - b.nominal} render={(val) => formatRupiah(val)} />
            <Table.Column title="Status" dataIndex="status" render={(val) => <span className={`status-badge ${val === "paid" ? "status-paid" : "status-pending"}`}>{val === "paid" ? "Lunas" : "Belum Lunas"}</span>} />
            <Table.Column
              title="Aksi"
              key="action"
              align="center"
              render={() => (
                <Space size={8} className="action-btn-group">
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

        {/* Modal Create Data Pegawai (Imported) */}
        <CreatePayment open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} periodName={`${selectedPeriod.month} ${selectedPeriod.year}`} />
      </>
    );
  };

  return <div className="pembayaran-container">{selectedPeriod ? renderDetailTable() : renderPeriodGrid()}</div>;
};
