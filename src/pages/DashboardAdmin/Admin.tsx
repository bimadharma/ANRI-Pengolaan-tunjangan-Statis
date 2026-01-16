import React, { useState } from "react";
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Table, 
  Tag, 
  Avatar, 
  Button, 
  Space,
  Pagination 
} from "antd";
import { unitKerjaData } from "../../data/unitKerjaData";
import { 
  UserOutlined, 
  RiseOutlined, 
  DollarOutlined, 
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FilterOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";



import "../../styles/DashboardAdmin.css";

const { Title, Text } = Typography;



interface DashboardStats {
  totalPegawai: number;
  pegawaiSudahUpdate: number;
  pegawaiBelumUpdate: number;
  totalNilaiTunjangan: number;
}

interface PegawaiData {
  id: string;
  nip: string;
  nama: string;
  unitKerja: string;
  statusUpdate: "Sudah Update" | "Belum Update";
  masaKerja: number; // dalam tahun
  nilaiTunjangan: number;
  avatarColor: string;
}

interface ReminderKenaikan {
  id: string;
  nama: string;
  nip: string;
  masaKerja: number;
  tanggalKenaikan: string;
}

// Data Statistik Dashboard
const dashboardStats: DashboardStats = {
  totalPegawai: 782,
  pegawaiSudahUpdate: 356,
  pegawaiBelumUpdate: 131,
  totalNilaiTunjangan: 250000000, // dalam Rupiah
};

// Reminder Kenaikan Tunjangan (Masa Kerja Kelipatan 4 Tahun)
const reminderKenaikan: ReminderKenaikan[] = [
  { id: "1", nama: "Dr. Bambang Sutrisno, M.Si", nip: "196801051994031002", masaKerja: 32, tanggalKenaikan: "05 Maret 2026" },
  { id: "2", nama: "Dra. Siti Maemunah, M.A", nip: "197205122002122001", masaKerja: 24, tanggalKenaikan: "12 April 2026" },
  { id: "3", nama: "Ir. Andi Prasetyo, M.T", nip: "198003152006041003", masaKerja: 20, tanggalKenaikan: "15 Mei 2026" },
  { id: "4", nama: "Drs. Heru Widodo, M.Hum", nip: "198609202010091001", masaKerja: 16, tanggalKenaikan: "20 Juni 2026" },
];

// Data Pegawai untuk Tabel
const tablePegawaiData: PegawaiData[] = [
  { id: "1", nip: "196801051994031002", nama: "Dr. Bambang Sutrisno, M.Si", unitKerja: "Sekretariat Utama", statusUpdate: "Sudah Update", masaKerja: 32, nilaiTunjangan: 4850000, avatarColor: "#00509d" },
  { id: "2", nip: "197205122002122001", nama: "Dra. Siti Maemunah, M.A", unitKerja: "Deputi Pembinaan Kearsipan", statusUpdate: "Sudah Update", masaKerja: 24, nilaiTunjangan: 4650000, avatarColor: "#05cd99" },
  { id: "3", nip: "198003152006041003", nama: "Ir. Andi Prasetyo, M.T", unitKerja: "Deputi Konservasi Arsip", statusUpdate: "Belum Update", masaKerja: 20, nilaiTunjangan: 4350000, avatarColor: "#FFB547" },
  { id: "4", nip: "198609202010091001", nama: "Drs. Heru Widodo, M.Hum", unitKerja: "Deputi Informasi & Akses", statusUpdate: "Sudah Update", masaKerja: 16, nilaiTunjangan: 4150000, avatarColor: "#9747FF" },
  { id: "5", nip: "198905182011012002", nama: "Sri Rahayu, S.Sos, M.Si", unitKerja: "Deputi Pengembangan Arsip", statusUpdate: "Belum Update", masaKerja: 15, nilaiTunjangan: 3950000, avatarColor: "#FF6B6B" },
  { id: "6", nip: "199002252012041001", nama: "Agus Salim, S.Kom, M.T.I", unitKerja: "Pusat Arsip Swasta", statusUpdate: "Sudah Update", masaKerja: 14, nilaiTunjangan: 3850000, avatarColor: "#4ECDC4" },
  { id: "7", nip: "199108152013091002", nama: "Dwi Handayani, S.H, M.H", unitKerja: "Bagian Hukum", statusUpdate: "Belum Update", masaKerja: 13, nilaiTunjangan: 3750000, avatarColor: "#FFD93D" },
  { id: "8", nip: "199204182015062001", nama: "Rina Kusumawati, S.Sos", unitKerja: "Bagian Kepegawaian", statusUpdate: "Sudah Update", masaKerja: 11, nilaiTunjangan: 3550000, avatarColor: "#6BCB77" },
  { id: "9", nip: "199306222017031001", nama: "Muhammad Faisal, S.IP", unitKerja: "Inspektorat", statusUpdate: "Sudah Update", masaKerja: 9, nilaiTunjangan: 3350000, avatarColor: "#FF8C42" },
  { id: "10", nip: "199508102019042002", nama: "Laila Nurjanah, S.Psi", unitKerja: "Sekretariat Utama", statusUpdate: "Belum Update", masaKerja: 7, nilaiTunjangan: 3150000, avatarColor: "#00509d" },
];

export const DashboardAdmin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PegawaiData[]>(tablePegawaiData);
  const [chartPage, setChartPage] = useState(1);
  const unitsPerPage = 10;

  // Format Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Hitung persentase update
  const persenUpdate = ((dashboardStats.pegawaiSudahUpdate / dashboardStats.totalPegawai) * 100).toFixed(1);

  // Pagination untuk chart
  const totalChartPages = Math.ceil(unitKerjaData.length / unitsPerPage);
  const startIndex = (chartPage - 1) * unitsPerPage;
  const endIndex = startIndex + unitsPerPage;
  const currentUnits = unitKerjaData.slice(startIndex, endIndex);

  const handleChartPageChange = (page: number) => {
    setChartPage(page);
  };

  const columns: ColumnsType<PegawaiData> = [
    {
      title: "NIP",
      dataIndex: "nip",
      key: "nip",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "NAMA PEGAWAI",
      dataIndex: "nama",
      key: "nama",
      render: (text, record) => (
        <div className="user-name-wrapper">
          <Avatar 
            style={{ backgroundColor: record.avatarColor, verticalAlign: 'middle' }} 
            size="large"
          >
            {text.charAt(0)}
          </Avatar>
          <Text className="user-name-text">{text}</Text>
        </div>
      ),
    },
    {
      title: "UNIT KERJA",
      dataIndex: "unitKerja",
      key: "unitKerja",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "STATUS UPDATE",
      dataIndex: "statusUpdate",
      key: "statusUpdate",
      render: (status) => (
        <span className={`status-badge ${status === 'Sudah Update' ? 'status-active' : 'status-inactive'}`}>
          {status}
        </span>
      ),
    },
    {
      title: "MASA KERJA",
      dataIndex: "masaKerja",
      key: "masaKerja",
      render: (tahun) => <Text type="secondary">{tahun} tahun</Text>,
    },
    {
      title: "TUNJANGAN",
      dataIndex: "nilaiTunjangan",
      key: "nilaiTunjangan",
      render: (nilai) => <Text strong style={{ color: '#05cd99' }}>{formatRupiah(nilai)}</Text>,
    },
    {
      title: "ACTIONS",
      key: "action",
      render: () => (
        <Button type="link" style={{ fontWeight: 600, color: '#00509d' }}>Detail</Button>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      {/* --- BAGIAN 1: STATS CARDS --- */}
      <Row gutter={[24, 24]}>
        {/* Card 1: Total Pegawai ANRI */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: '20px' }} style={{ borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p className="stat-label">Total Pegawai ANRI</p>
                <h3 className="stat-value">{dashboardStats.totalPegawai.toLocaleString('id-ID')}</h3>
              </div>
              <div className="stat-card-icon" style={{ background: '#E8F4FF', color: '#00509d' }}>
                <UserOutlined />
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 2: Pegawai Sudah Update */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: '20px' }} style={{ borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p className="stat-label">Sudah Update Tunjangan PAS</p>
                <h3 className="stat-value">{dashboardStats.pegawaiSudahUpdate.toLocaleString('id-ID')}</h3>
              </div>
              <div className="stat-card-icon" style={{ background: '#E8FFF3', color: '#05cd99' }}>
                <RiseOutlined />
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 3: Pegawai Belum Update */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: '20px' }} style={{ borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p className="stat-label">Belum Update Tunjangan PAS</p>
                <h3 className="stat-value">{dashboardStats.pegawaiBelumUpdate.toLocaleString('id-ID')}</h3>
              </div>
              <div className="stat-card-icon" style={{ background: '#FFF7E6', color: '#FFB547' }}>
                <BarChartOutlined />
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 4: Total Nilai Tunjangan */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: '20px' }} style={{ borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p className="stat-label">Total Tunjangan PAS</p>
                <h3 className="stat-value" style={{ fontSize: '20px' }}>{formatRupiah(dashboardStats.totalNilaiTunjangan)}</h3>
              </div>
              <div className="stat-card-icon" style={{ background: '#F4F0FF', color: '#9747FF' }}>
                <DollarOutlined />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* --- BAGIAN 2: CHART & REMINDER --- */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        
        {/* Left Side: Grafik Pegawai per Unit Kerja (Column Chart) */}
        <Col xs={24} lg={16}>
          <Card 
            bordered={false} 
            className="chart-card" 
            style={{ borderRadius: '16px' }}
            title={<Title level={4} style={{ margin: 0, color: '#2b3674' }}>Jumlah Pegawai per Unit Kerja</Title>}
            // extra={<Button type="link">Lihat Detail</Button>}
          >
            {/* Column Chart menggunakan CSS */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'space-between',
              gap: '10px',
              height: '250px',
              padding: '20px 5px 10px',
            }}>
              {currentUnits.map((item, index) => {
                const maxValue = Math.max(...currentUnits.map(d => d.jumlahPegawai));
                const heightPercentage = (item.jumlahPegawai / maxValue) * 100;
                
                return (
                  <div 
                    key={index} 
                    title={item.unit} 
                    style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'flex-end',
                      height: '100%',
                      minWidth: '50px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 700, 
                      color: '#2b3674',
                      marginBottom: '8px',
                    }}>
                      {item.jumlahPegawai}
                    </div>
                    <div 
                      style={{ 
                        height: `${heightPercentage}%`,
                        backgroundColor: item.color,
                        width: '100%',
                        minWidth: '35px',
                        maxWidth: '55px',
                        borderRadius: '8px 8px 0 0',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      }} 
                    />
                    <div style={{ 
                      fontSize: '10px', 
                      color: '#a3aed0', 
                      textAlign: 'center', 
                      width: '100%',
                      maxWidth: '80px',
                      lineHeight: '1.3',
                      marginTop: '10px',
                      fontWeight: 600,
                      height: '42px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      wordBreak: 'break-word',
                    }}>
                      {item.unit}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Spacer untuk memberi ruang antara chart dan pagination */}
            <div style={{ height: '20px' }} />
            
            {/* Pagination untuk Chart */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '20px',
              paddingBottom: '10px'
            }}>
              <Pagination 
                current={chartPage}
                total={unitKerjaData.length}
                pageSize={unitsPerPage}
                onChange={handleChartPageChange}
                showSizeChanger={false}
                size="small"
                showTotal={(total, range) => `${range[0]}-${range[1]} dari ${total} unit`}
              />
            </div>
          </Card>
        </Col>

        {/* Right Side: Reminder Kenaikan Tunjangan */}
        <Col xs={24} lg={8}>
          <div className="quick-stats-card p-4" style={{ padding: '24px' }}>
            <Title level={4} style={{ color: 'white', marginTop: 0 }}>Reminder Kenaikan Tunjangan</Title>
            
            <div style={{ marginTop: '24px' }}>
              {reminderKenaikan.map((item) => (
                <div key={item.id} className="quick-stat-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <div className="quick-stat-label" style={{ fontSize: '13px', fontWeight: 600 }}>{item.nama}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '4px' }}>
                    NIP: {item.nip}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', marginTop: '6px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', marginRight: '8px' }}>
                      {item.masaKerja} tahun
                    </span>
                    <span style={{ fontSize: '11px' }}>
                      📅 {item.tanggalKenaikan}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* --- BAGIAN 3: TABLE --- */}
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card bordered={false} style={{ borderRadius: '16px' }}>
            <div className="table-header">
              <Title level={4} style={{ margin: 0, color: '#2b3674' }}>Data Pegawai Tunjangan PAS</Title>
              <Button icon={<FilterOutlined />}>Status Update</Button>
            </div>
            
            <Table 
              columns={columns} 
              dataSource={data} 
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 8,
                position: ['bottomRight'],
                showSizeChanger: false,
                total: dashboardStats.totalPegawai,
                showTotal: (total, range) => `Menampilkan ${range[0]} - ${range[1]} dari ${total} pegawai`,
                className: "custom-pagination"
              }}
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
};