import React, { useState } from "react";
import { Table, Button, Space, Tooltip, Avatar, Input } from "antd";
import { 
    TeamOutlined, 
    BankOutlined, 
    PlusOutlined, 
    SearchOutlined,
    EyeOutlined, 
    EditOutlined, 
    DeleteOutlined,
    HistoryOutlined
} from "@ant-design/icons";

import { CreateRiwayatTupas } from "./create";
import "../../../styles/riwayatTupas.css";


interface IRiwayatData {
    id: number;
    nama: string;
    nip: string;
    jabatan: string;
    unit: string;
    tanggal: string;
}

const DUMMY_DATA: IRiwayatData[] = [
    { id: 1, nama: "Ahmad Fauzi", nip: "198501012010011001", jabatan: "Kepala Bagian", unit: "IT", tanggal: "2024-01-15" },
    { id: 2, nama: "Siti Nurhaliza", nip: "199203152015012002", jabatan: "Staff Administrasi", unit: "HR", tanggal: "2024-01-10" },
    { id: 3, nama: "Budi Santoso", nip: "198709202012011003", jabatan: "Developer", unit: "IT", tanggal: "2024-01-12" },
    { id: 4, nama: "Dewi Lestari", nip: "199105102014012004", jabatan: "Manager", unit: "Finance", tanggal: "2024-01-05" },
    { id: 5, nama: "Eko Prasetyo", nip: "198812252013011005", jabatan: "Supervisor", unit: "Operations", tanggal: "2024-01-08" },
];

export const RiwayatTupasList: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    
    const totalPegawai = DUMMY_DATA.length;
    
    const totalUnit = new Set(DUMMY_DATA.map(item => item.unit)).size;

    return (
        <div className="rt-container">
            {/* Header */}
            <div className="rt-header">
                <div style={{ background: '#e0e7ff', padding: 8, borderRadius: 8, color: '#4338ca' }}>
                    <HistoryOutlined style={{ fontSize: 24 }} />
                </div>
                <div>
                    <h1 className="rt-title">Riwayat Tupas</h1>
                    <p className="rt-subtitle">Kelola Riwayat secara lengkap</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="rt-stats-grid">
                {/* Card 1: Total Pegawai */}
                <div className="rt-stat-card">
                    <div className="rt-stat-info">
                        <label>Total Pegawai</label>
                        <div className="value">{totalPegawai}</div>
                    </div>
                    <div className="rt-stat-icon">
                        <TeamOutlined />
                    </div>
                </div>

                {/* Card 2: Total Unit */}
                <div className="rt-stat-card">
                    <div className="rt-stat-info">
                        <label>Total Unit</label>
                        <div className="value">{totalUnit}</div>
                    </div>
                    <div className="rt-stat-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                        <BankOutlined />
                    </div>
                </div>

                {/* Button Create Besar */}
                <div 
                    className="rt-btn-create" 
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <div className="rt-btn-text">
                        <span>Tambah Pegawai</span>
                        <h3>Klik untuk menambah</h3>
                    </div>
                    <div className="rt-btn-icon">
                        <PlusOutlined />
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
                    pagination={{ pageSize: 5 }}
                >
                    <Table.Column 
                        title="Nama" 
                        dataIndex="nama"
                        sorter={(a: IRiwayatData, b: IRiwayatData) => a.nama.localeCompare(b.nama)}
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
                        render={(text) => <span className="rt-nip-badge">{text}</span>}
                    />

                    <Table.Column 
                        title="Jabatan" 
                        dataIndex="jabatan"
                        sorter={(a: IRiwayatData, b: IRiwayatData) => a.jabatan.localeCompare(b.jabatan)}
                        render={(text) => (
                            <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>
                                {text}
                            </span>
                        )}
                    />

                    <Table.Column 
                        title="Unit" 
                        dataIndex="unit"
                        sorter={(a: IRiwayatData, b: IRiwayatData) => a.unit.localeCompare(b.unit)}
                        render={(text) => <span className="rt-unit-badge">{text}</span>}
                    />

                    <Table.Column 
                        title="Tanggal" 
                        dataIndex="tanggal" 
                        sorter={(a: IRiwayatData, b: IRiwayatData) => a.tanggal.localeCompare(b.tanggal)}
                    />

                    <Table.Column 
                        title="Aksi"
                        render={() => (
                            <Space>
                                <Tooltip title="View">
                                    <Button shape="circle" icon={<EyeOutlined />} size="small" style={{ background: '#eff6ff', color: '#3b82f6', border: 'none' }} />
                                </Tooltip>
                                <Tooltip title="Edit">
                                    <Button shape="circle" icon={<EditOutlined />} size="small" style={{ background: '#fef3c7', color: '#d97706', border: 'none' }} />
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <Button shape="circle" icon={<DeleteOutlined />} size="small" style={{ background: '#fee2e2', color: '#ef4444', border: 'none' }} />
                                </Tooltip>
                            </Space>
                        )}
                    />
                </Table>
            </div>

            {/* Modal Create */}
            <CreateRiwayatTupas 
                open={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
        </div>
    );
};