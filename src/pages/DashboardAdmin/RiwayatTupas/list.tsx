import React, { useState } from "react";
import { Table, Button, Space, Tooltip, Input, Tag, Drawer, Descriptions, Avatar } from "antd";
import { 
    HistoryOutlined,
    BankOutlined,
    SearchOutlined,
    EyeOutlined,
    FilePdfOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    FileTextOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";

import "../../../styles/riwayatTupas.css";


interface IRiwayatData {
    id: number;
    namaPegawai: string;
    nip: string;
    unitKerja: string;
    jenisSK: "Pemberian" | "Mutasi" | "Penghentian Sementara" | "Pemberhentian";
    nomorSK: string;
    tanggalSK: string;
    tmt: string;
    nominal: number;
    statusSK: "Aktif" | "Tidak Aktif" | "Revisi";
    fileSK: string; 
}

const DUMMY_DATA: IRiwayatData[] = [
    { 
        id: 1, 
        namaPegawai: "Dr. Bambang Sutrisno, M.Si", 
        nip: "196801051994031002", 
        unitKerja: "Sekretariat Utama",
        jenisSK: "Pemberian",
        nomorSK: "SK-ANRI/001/I/2026",
        tanggalSK: "02 Januari 2026",
        tmt: "01 Januari 2026",
        nominal: 5500000,
        statusSK: "Aktif",
        fileSK: "/dummy/sk-001.pdf"
    },
    { 
        id: 2, 
        namaPegawai: "Dra. Siti Maemunah, M.A", 
        nip: "197205122002122001", 
        unitKerja: "Deputi Pembinaan Kearsipan",
        jenisSK: "Pemberian",
        nomorSK: "SK-ANRI/002/I/2026",
        tanggalSK: "02 Januari 2026",
        tmt: "01 Januari 2026",
        nominal: 4500000,
        statusSK: "Aktif",
        fileSK: "/dummy/sk-002.pdf"
    },
    { 
        id: 3, 
        namaPegawai: "Ir. Andi Prasetyo, M.T", 
        nip: "198003152006041003", 
        unitKerja: "Deputi Konservasi Arsip",
        jenisSK: "Mutasi",
        nomorSK: "SK-ANRI/045/XII/2025",
        tanggalSK: "15 Desember 2025",
        tmt: "01 Januari 2026",
        nominal: 3500000,
        statusSK: "Aktif",
        fileSK: "/dummy/sk-045.pdf"
    },
    { 
        id: 4, 
        namaPegawai: "Drs. Heru Widodo, M.Hum", 
        nip: "198609202010091001", 
        unitKerja: "Deputi Informasi & Akses",
        jenisSK: "Pemberian",
        nomorSK: "SK-ANRI/003/I/2026",
        tanggalSK: "03 Januari 2026",
        tmt: "01 Januari 2026",
        nominal: 3000000,
        statusSK: "Aktif",
        fileSK: "/dummy/sk-003.pdf"
    },
    { 
        id: 5, 
        namaPegawai: "Sri Rahayu, S.Sos, M.Si", 
        nip: "198905182011012002", 
        unitKerja: "Inspektorat",
        jenisSK: "Penghentian Sementara",
        nomorSK: "SK-ANRI/089/XI/2025",
        tanggalSK: "20 November 2025",
        tmt: "01 Desember 2025",
        nominal: 0,
        statusSK: "Tidak Aktif",
        fileSK: "/dummy/sk-089.pdf"
    },
    { 
        id: 6, 
        namaPegawai: "Agus Salim, S.Kom, M.T.I", 
        nip: "199002252012041001", 
        unitKerja: "Pusat Arsip Swasta",
        jenisSK: "Pemberian",
        nomorSK: "SK-ANRI/004/I/2026",
        tanggalSK: "04 Januari 2026",
        tmt: "01 Januari 2026",
        nominal: 3850000,
        statusSK: "Revisi",
        fileSK: "/dummy/sk-004.pdf"
    },
    { 
        id: 7, 
        namaPegawai: "Dwi Handayani, S.H, M.H", 
        nip: "199108152013091002", 
        unitKerja: "Bagian Hukum",
        jenisSK: "Pemberhentian",
        nomorSK: "SK-ANRI/078/X/2025",
        tanggalSK: "31 Oktober 2025",
        tmt: "01 November 2025",
        nominal: 0,
        statusSK: "Tidak Aktif",
        fileSK: "/dummy/sk-078.pdf"
    },
];

export const RiwayatTupasList: React.FC = () => {
    const [selectedRecord, setSelectedRecord] = useState<IRiwayatData | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    const totalSK = DUMMY_DATA.length;
    const totalPegawai = new Set(DUMMY_DATA.map(item => item.nip)).size;
    const totalAktif = DUMMY_DATA.filter(item => item.statusSK === "Aktif").length;
    const totalNonAktif = DUMMY_DATA.filter(item => item.statusSK === "Tidak Aktif").length;

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    const getJenisSKColor = (jenis: string) => {
        switch (jenis) {
            case "Pemberian": return { bg: '#dcfce7', color: '#16a34a' };
            case "Mutasi": return { bg: '#dbeafe', color: '#2563eb' };
            case "Penghentian Sementara": return { bg: '#fef3c7', color: '#d97706' };
            case "Pemberhentian": return { bg: '#fee2e2', color: '#dc2626' };
            default: return { bg: '#f3f4f6', color: '#6b7280' };
        }
    };

    const getStatusSKColor = (status: string) => {
        switch (status) {
            case "Aktif": return { bg: '#dcfce7', color: '#16a34a' };
            case "Revisi": return { bg: '#fef3c7', color: '#d97706' };
            case "Tidak Aktif": return { bg: '#fee2e2', color: '#dc2626' };
            default: return { bg: '#f3f4f6', color: '#6b7280' };
        }
    };

    const handleViewDetail = (record: IRiwayatData) => {
        setSelectedRecord(record);
        setIsDrawerOpen(true);
    };

    return (
        <div className="rt-container">
            <div className="rt-header">
                <div style={{ background: '#00509d', borderRadius: 8, padding: 8, display: 'flex', marginRight: 8 }}>
                    <HistoryOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
                <div>
                    <h1 className="rt-title">Riwayat Tupas</h1>
                    <p className="rt-subtitle">Kelola Riwayat secara lengkap</p>
                </div>
            </div>

            <div className="rt-stats-grid">
                {/* Card 1: Total SK */}
                <div className="rt-stat-card">
                    <div className="rt-stat-info">
                        <label>Total SK</label>
                        <div className="value">{totalSK}</div>
                    </div>
                    <div className="rt-stat-icon">
                        <FileTextOutlined />
                    </div>
                </div>

                {/* Card 2: Total Pegawai */}
                <div className="rt-stat-card">
                    <div className="rt-stat-info">
                        <label>Total Pegawai</label>
                        <div className="value">{totalPegawai}</div>
                    </div>
                    <div className="rt-stat-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                        <TeamOutlined />
                    </div>
                </div>

                {/* Card 3: SK Aktif */}
                <div className="rt-stat-card">
                    <div className="rt-stat-info">
                        <label>SK Aktif</label>
                        <div className="value">{totalAktif}</div>
                    </div>
                    <div className="rt-stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
                        <CheckCircleOutlined />
                    </div>
                </div>

                {/* Card 4: SK Non-Aktif */}
                <div className="rt-stat-card">
                    <div className="rt-stat-info">
                        <label>SK Non-Aktif</label>
                        <div className="value">{totalNonAktif}</div>
                    </div>
                    <div className="rt-stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
                        <CloseCircleOutlined />
                    </div>
                </div>
            </div>

            {/* Filter Search */}
            <div style={{ marginBottom: 16 }}>
                 <Input 
                    prefix={<SearchOutlined style={{ color: '#9ca3af' }} />} 
                    placeholder="Cari nama atau NIP..." 
                    style={{ width: '100%', maxWidth: 400, borderRadius: 8, padding: '8px 12px' }} 
                />
            </div>

            {/* Tabel Data */}
            <div className="rt-table-card">
                <Table
                    dataSource={DUMMY_DATA}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1600 }}
                >
                    <Table.Column 
                        title="Nama Pegawai" 
                        dataIndex="namaPegawai"
                        width={220}
                        fixed="left"
                        sorter={(a: IRiwayatData, b: IRiwayatData) => a.namaPegawai.localeCompare(b.namaPegawai)}
                        render={(text) => (
                            <div className="rt-user-cell">
                                <Avatar className="rt-avatar">{text.charAt(0)}</Avatar>
                                <span className="rt-user-name">{text}</span>
                            </div>
                        )}
                    />
                    
                    <Table.Column 
                        title="NIP" 
                        dataIndex="nip"
                        width={160}
                        render={(text) => <span className="rt-nip-badge">{text}</span>}
                    />

                    <Table.Column 
                        title="Unit Kerja" 
                        dataIndex="unitKerja"
                        width={200}
                        sorter={(a: IRiwayatData, b: IRiwayatData) => a.unitKerja.localeCompare(b.unitKerja)}
                        render={(text) => (
                            <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>
                                {text}
                            </span>
                        )}
                    />

                    <Table.Column 
                        title="Jenis SK" 
                        dataIndex="jenisSK"
                        width={180}
                        filters={[
                            { text: 'Pemberian', value: 'Pemberian' },
                            { text: 'Mutasi', value: 'Mutasi' },
                            { text: 'Penghentian Sementara', value: 'Penghentian Sementara' },
                            { text: 'Pemberhentian', value: 'Pemberhentian' },
                        ]}
                        onFilter={(value, record: IRiwayatData) => record.jenisSK === value}
                        render={(text) => {
                            const colors = getJenisSKColor(text);
                            return (
                                <Tag color="default" style={{ background: colors.bg, color: colors.color, border: 'none', fontWeight: 500 }}>
                                    {text}
                                </Tag>
                            );
                        }}
                    />

                    <Table.Column 
                        title="Nomor SK" 
                        dataIndex="nomorSK"
                        width={160}
                    />

                    <Table.Column 
                        title="Tanggal SK" 
                        dataIndex="tanggalSK"
                        width={140}
                        sorter={(a: IRiwayatData, b: IRiwayatData) => a.tanggalSK.localeCompare(b.tanggalSK)}
                    />

                    <Table.Column 
                        title="TMT" 
                        dataIndex="tmt"
                        width={140}
                    />

                    <Table.Column 
                        title="Nominal" 
                        dataIndex="nominal"
                        width={150}
                        sorter={(a: IRiwayatData, b: IRiwayatData) => a.nominal - b.nominal}
                        render={(value) => <span style={{ fontWeight: 600 }}>{formatRupiah(value)}</span>}
                    />

                    <Table.Column 
                        title="Status SK" 
                        dataIndex="statusSK"
                        width={120}
                        filters={[
                            { text: 'Aktif', value: 'Aktif' },
                            { text: 'Revisi', value: 'Revisi' },
                            { text: 'Tidak Aktif', value: 'Tidak Aktif' },
                        ]}
                        onFilter={(value, record: IRiwayatData) => record.statusSK === value}
                        render={(text) => {
                            const colors = getStatusSKColor(text);
                            return (
                                <Tag color="default" style={{ background: colors.bg, color: colors.color, border: 'none', fontWeight: 500 }}>
                                    {text}
                                </Tag>
                            );
                        }}
                    />

                    <Table.Column 
                        title="Aksi"
                        width={120}
                        fixed="right"
                        render={(_, record: IRiwayatData) => (
                            <Space>
                                <Tooltip title="Lihat Detail">
                                    <Button 
                                        shape="circle" 
                                        icon={<EyeOutlined />} 
                                        size="small" 
                                        style={{ background: '#eff6ff', color: '#3b82f6', border: 'none' }}
                                        onClick={() => handleViewDetail(record)}
                                    />
                                </Tooltip>
                                <Tooltip title="Download PDF">
                                    <Button 
                                        shape="circle" 
                                        icon={<FilePdfOutlined />} 
                                        size="small" 
                                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none' }}
                                        onClick={() => window.open(record.fileSK, '_blank')}
                                    />
                                </Tooltip>
                            </Space>
                        )}
                    />
                </Table>
            </div>

            {/* Drawer Detail */}
            <Drawer
                title={<span style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>Detail Riwayat SK</span>}
                placement="right"
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                width={600}
            >
                {selectedRecord && (
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Nama Pegawai">
                            <strong>{selectedRecord.namaPegawai}</strong>
                        </Descriptions.Item>
                        <Descriptions.Item label="NIP">
                            {selectedRecord.nip}
                        </Descriptions.Item>
                        <Descriptions.Item label="Unit Kerja">
                            {selectedRecord.unitKerja}
                        </Descriptions.Item>
                        <Descriptions.Item label="Jenis SK">
                            <Tag 
                                color="default" 
                                style={{ 
                                    background: getJenisSKColor(selectedRecord.jenisSK).bg, 
                                    color: getJenisSKColor(selectedRecord.jenisSK).color, 
                                    border: 'none', 
                                    fontWeight: 500 
                                }}
                            >
                                {selectedRecord.jenisSK}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Nomor SK">
                            <strong>{selectedRecord.nomorSK}</strong>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tanggal SK">
                            {selectedRecord.tanggalSK}
                        </Descriptions.Item>
                        <Descriptions.Item label="TMT (Terhitung Mulai Tanggal)">
                            {selectedRecord.tmt}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nominal Tunjangan">
                            <span style={{ fontSize: 16, fontWeight: 600, color: '#16a34a' }}>
                                {formatRupiah(selectedRecord.nominal)}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Status SK">
                            <Tag 
                                color="default" 
                                style={{ 
                                    background: getStatusSKColor(selectedRecord.statusSK).bg, 
                                    color: getStatusSKColor(selectedRecord.statusSK).color, 
                                    border: 'none', 
                                    fontWeight: 500 
                                }}
                            >
                                {selectedRecord.statusSK}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="File SK">
                            <Button 
                                type="primary" 
                                icon={<FilePdfOutlined />} 
                                danger
                                onClick={() => window.open(selectedRecord.fileSK, '_blank')}
                            >
                                Download PDF
                            </Button>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Drawer>
        </div>
    );
};