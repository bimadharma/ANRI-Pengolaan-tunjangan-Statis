import React from "react";
import { Layout, Row, Col, Card, Typography } from "antd";
import {
  DatabaseOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  CloudSyncOutlined,
  BarChartOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { Navbar } from "../components/Navbar";
import "../styles/home.css";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const benefits = [
  {
    title: "Monitoring Terpadu",
    desc: "Dashboard SITARA menyajikan ringkasan data tunjangan, progres pembaruan, serta kondisi terkini pengelolaan Tunjangan Arsip Statis.",
    icon: <BarChartOutlined />,
  },
  {
    title: "Transparansi Data",
    desc: "Seluruh proses penghitungan dan pembayaran tunjangan tercatat dan dapat ditelusuri secara sistematis.",
    icon: <EyeOutlined />,
  },
  {
    title: "Data Terpusat",
    desc: "Data pegawai, ketentuan, hasil perhitungan, dan riwayat pembayaran tersimpan dalam satu sistem terintegrasi.",
    icon: <DatabaseOutlined />,
  },
  {
    title: "Keamanan & Hak Akses",
    desc: "Pengelolaan peran pengguna dan pembatasan akses memastikan keamanan data dan kewenangan penggunaan sistem.",
    icon: <SafetyOutlined />,
  },
  {
    title: "Efisiensi Proses",
    desc: "Penghitungan Tunjangan Arsip Statis dilakukan secara otomatis berdasarkan ketentuan yang berlaku.",
    icon: <CloudSyncOutlined />,
  },
  {
    title: "Keandalan Sistem",
    desc: "SITARA mendukung operasional pengelolaan tunjangan secara stabil, terdokumentasi, dan berkelanjutan.",
    icon: <ThunderboltOutlined />,
  },
];

const services = [
  {
    title: "Dashboard & Monitoring",
    icon: <BarChartOutlined />,
    items: [
      "Ringkasan kondisi Tunjangan Arsip Statis",
      "Grafik sebaran pegawai per unit kerja",
      "Pengingat kenaikan tunjangan berdasarkan masa kerja",
    ],
  },
  {
    title: "Ketentuan & Master Data",
    icon: <FolderOpenOutlined />,
    items: [
      "Pengelolaan ketentuan penghitungan tunjangan",
      "Master unit kerja dan struktur organisasi",
      "Master jabatan dan faktor tanggung jawab",
    ],
  },
  {
    title: "Penghitungan Tunjangan (Data Tupas)",
    icon: <MoneyCollectOutlined />,
    items: [
      "Pengelolaan data pegawai penerima tunjangan",
      "Perhitungan otomatis nilai faktor dan tunjangan",
      "Perbandingan tunjangan lama dan tunjangan baru",
    ],
  },
  {
    title: "Pembayaran & Riwayat",
    icon: <SettingOutlined />,
    items: [
      "Data tunjangan siap dibayarkan",
      "Log pembayaran dan audit trail",
      "Riwayat SK dan pembayaran Tunjangan Arsip Statis",
    ],
  },
];

const Home: React.FC = () => {
  return (
    <Layout>
      <Navbar />

      <Content>
        {/* HERO SECTION */}
        <section className="home-hero">
          <Row justify="center">
            <Col xs={24} md={18} lg={14}>
              <div className="hero-content">
                <Title className="hero-title">SITARA</Title>

                <Paragraph className="hero-desc">
                  <strong>Sistem Informasi Tunjangan Arsip Statis</strong> adalah aplikasi yang dirancang untuk mendukung pengelolaan, penghitungan, dan monitoring Tunjangan Pengelolaan Arsip Statis secara terintegrasi.
                </Paragraph>

                <Paragraph className="hero-desc">
                  SITARA membantu administrator dan pengelola dalam <b>menetapkan ketentuan</b>, <b>menghitung tunjangan</b>, <b>memantau pembayaran</b>, serta <b>menyimpan riwayat tunjangan</b> secara akurat dan terdokumentasi.
                </Paragraph>
              </div>
            </Col>
          </Row>
        </section>

        {/* BENEFITS */}
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

        {/* SERVICES */}
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
