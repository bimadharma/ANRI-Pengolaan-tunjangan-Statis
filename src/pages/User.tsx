import { Layout } from "../components/Layout";
import { Card, Row, Col, Statistic } from "antd";
import { FileOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

export default function User() {
  return (
    <Layout>
      <div>
        <h1>User Dashboard</h1>
        <p>Selamat datang di dashboard User!</p>
        
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="My Documents"
                value={12}
                prefix={<FileOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Completed"
                value={8}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Pending"
                value={4}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
