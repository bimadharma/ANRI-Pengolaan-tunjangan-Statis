import React, { useState } from "react";
import { 
    UserOutlined, 
    IdcardOutlined, 
    BankOutlined, 
    EnvironmentOutlined,
    SettingFilled,
    EditOutlined
} from "@ant-design/icons";

import { EditProfile } from "./edit"; 
import "../../../styles/profile.css";


const CURRENT_USER = {
    id: 1,
    nama: "John Doe",
    jabatan: "Senior Frontend Developer",
    unit: "IT",
    lokasi: "Jakarta, Indonesia"
};

export const UserProfile: React.FC = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    
    const [userData, setUserData] = useState(CURRENT_USER);

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

                </div>
            </div>

            {/* Modal Edit */}
            <EditProfile 
                open={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)}
                initialData={userData}
            />
        </div>
    );
};