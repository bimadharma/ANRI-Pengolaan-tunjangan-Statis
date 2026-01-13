import React, { useState } from "react";
import { 
    UserOutlined, 
    IdcardOutlined, 
    BankOutlined, 
    EnvironmentOutlined,
    EditOutlined
} from "@ant-design/icons";

import { EditProfile } from "./edit"; 
import "../../../styles/profile.css";


const CURRENT_USER = {
    id: 1,
    nama: "John Doe",
    jabatan: "Senior Frontend Developer",
    unit: "IT",
    lokasi: "Jakarta, Indonesia",
    role: "user"
};

export const UserProfile: React.FC = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const [userData, setUserData] = useState(CURRENT_USER);
    const [role, setRole] = useState<string>(CURRENT_USER.role);

    const handleEditClose = () => {
        setIsEditModalOpen(false);
    };

    return (
        <div className="profile-container">
            {/* Header Halaman */}
            <div className="profile-header-page">
                <h1 className="profile-title">
                    Pengaturan Akun
                </h1>
                <p className="profile-subtitle">Kelola informasi profil Anda</p>
            </div>

            {/* Card Profil */}
            <div className="profile-card">
                {/* 1. Banner Gradient */}
                <div className="profile-banner"></div>

                {/* 2. Avatar & Tombol Edit */}
                <div className="profile-mid-section">
                    <div className="avatar-wrapper">
                        <div className="profile-avatar">
                            <UserOutlined />
                        </div>
                    </div>
                    
                    <button 
                        className="btn-edit-profile"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        <EditOutlined /> Edit Profil
                    </button>
                </div>

                {/* 3. Informasi User (Read Only View) */}
                <div className="profile-info-section">
                    
                    {/* Nama Lengkap */}
                    <div className="info-group">
                        <div className="info-label">
                            <UserOutlined /> Nama Lengkap
                        </div>
                        <div className="info-value-box">
                            {userData.nama}
                        </div>
                    </div>

                    {/* Jabatan */}
                    <div className="info-group">
                        <div className="info-label">
                            <IdcardOutlined /> Jabatan
                        </div>
                        <div className="info-value-box">
                            {userData.jabatan}
                        </div>
                    </div>

                    {/* Unit & Lokasi (Grid 2 Kolom) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div className="info-group">
                            <div className="info-label">
                                <BankOutlined /> Unit Kerja
                            </div>
                            <div className="info-value-box">
                                {userData.unit}
                            </div>
                        </div>

                        <div className="info-group">
                            <div className="info-label">
                                <EnvironmentOutlined /> Lokasi
                            </div>
                            <div className="info-value-box">
                                {userData.lokasi}
                            </div>
                        </div>
                    </div>

                    {/* Role */}
                    <div className="info-group">
                        <div className="info-label">
                            <UserOutlined /> Role
                        </div>
                        <div className="info-value-box">
                            <span style={{ 
                                display: 'inline-block',
                                background: role === 'admin' ? '#fee2e2' : '#dcfce7',
                                color: role === 'admin' ? '#dc2626' : '#16a34a',
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontWeight: 600,
                                textTransform: 'capitalize'
                            }}>
                                {role}
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Edit */}
            <EditProfile 
                open={isEditModalOpen} 
                onClose={handleEditClose}
                initialData={userData}
            />
        </div>
    );
};