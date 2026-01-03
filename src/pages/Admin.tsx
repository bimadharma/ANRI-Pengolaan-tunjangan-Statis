import { Layout } from "../components/Layout";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, FileOutlined, ShoppingOutlined } from "@ant-design/icons";

export default function Admin() {
  return (
    <Layout>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Selamat datang di dashboard Admin!</p>
        
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Users"
                value={150}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Orders"
                value={234}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Documents"
                value={89}
                prefix={<FileOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
