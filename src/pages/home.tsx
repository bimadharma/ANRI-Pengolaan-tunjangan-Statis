import React from "react";
import { Layout, Row, Col, Card, Typography } from "antd";
import { DatabaseOutlined, SafetyOutlined, ThunderboltOutlined, EyeOutlined, CloudSyncOutlined, BarChartOutlined, FolderOpenOutlined, SettingOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import { Navbar } from "../components/Navbar";
import "../styles/home.css";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const benefits = [
  {
    title: "Pengajuan Digital",
    desc: "Pengisian dan pengajuan tunjangan dilakukan secara online dan terstruktur.",
    icon: <BarChartOutlined />,
  },
  {
    title: "Transparansi Proses",
    desc: "Pegawai dapat memantau status pengajuan tunjangan secara real-time.",
    icon: <EyeOutlined />,
  },
  {
    title: "Data Terpusat",
    desc: "Seluruh data tunjangan dan arsip statis tersimpan aman dan terintegrasi.",
    icon: <DatabaseOutlined />,
  },
  {
    title: "Keamanan Sistem",
    desc: "Pengelolaan hak akses dan audit aktivitas pengguna.",
    icon: <SafetyOutlined />,
  },
  {
    title: "Akses Fleksibel",
    desc: "Sistem berbasis cloud yang dapat diakses sesuai kewenangan.",
    icon: <CloudSyncOutlined />,
  },
  {
    title: "Kinerja Andal",
    desc: "Mendukung operasional tunjangan secara stabil dan berkelanjutan.",
    icon: <ThunderboltOutlined />,
  },
];

const services = [
  {
    title: "Manajemen Tunjangan",
    icon: <MoneyCollectOutlined />,
    items: ["Pengisian data tunjangan pegawai", "Pengajuan tunjangan arsip statis", "Cetak dokumen dan surat tunjangan"],
  },
  {
    title: "Pengelolaan Arsip Statis",
    icon: <FolderOpenOutlined />,
    items: ["Pendataan arsip statis pegawai", "Integrasi dengan dokumen tunjangan", "Penyimpanan arsip digital"],
  },
  {
    title: "Pelaporan & Monitoring",
    icon: <BarChartOutlined />,
    items: ["Rekap pengajuan tunjangan", "Laporan periodik", "Export dokumen resmi"],
  },
  {
    title: "Administrasi Sistem",
    icon: <SettingOutlined />,
    items: ["Manajemen pengguna dan role", "Validasi dan verifikasi data", "Log aktivitas sistem"],
  },
];

const Home: React.FC = () => {
  return (
    <Layout>
      <Navbar />

      <Content>
        <section className="home-hero">
          <Row justify="center">
            <Col xs={24} md={18} lg={14}>
              <div className="hero-content">
                <Title className="hero-title">SITARA</Title>

                <Paragraph className="hero-desc">
                  <strong>Sistem Tunjangan & Arsip Statis ANRI</strong> adalah aplikasi digital yang dirancang untuk mendukung pengelolaan tunjangan pegawai di lingkungan Arsip Nasional Republik Indonesia.
                </Paragraph>

                <Paragraph className="hero-desc">
                  Melalui SITARA, pegawai dapat <b>mengisi</b>, <b>mengajukan</b>,<b> memantau</b>, dan <b>mencetak</b> tunjangan pengelolaan arsip statis secara lebih cepat, transparan, dan terdokumentasi.
                </Paragraph>
              </div>
            </Col>
          </Row>
        </section>

        <section className="home-section">
          <Title level={2} className="section-title">
            Manfaat SITARA
          </Title>

          <Row gutter={[24, 24]} className="fade-up">
            {benefits.map((item) => (
              <Col xs={24} sm={12} md={8} key={item.title}>
                <Card hoverable className="benefit-card">
                  <div className="icon">{item.icon}</div>
                  <Title level={4}>{item.title}</Title>
                  <Paragraph>{item.desc}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <section className="home-section alt">
          <Title level={2} className="section-title">
            Layanan Utama
          </Title>

          <Row gutter={[24, 24]} className="fade-up">
            {services.map((service) => (
              <Col xs={24} md={12} key={service.title}>
                <Card hoverable className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <div>
                    <Title level={4}>{service.title}</Title>
                    <ul>
                      {service.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Content>
    </Layout>
  );
};

export default Home;
