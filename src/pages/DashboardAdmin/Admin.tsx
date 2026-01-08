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
  Space 
} from "antd";
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
  totalUsers: number;
  activeSessions: number;
  monthlyRevenue: number;
  conversionRate: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  joined: string;
  avatarColor: string;
}


const chartData = [50, 30, 60, 40, 70, 50, 45, 80, 60, 90, 75];

const tableData: UserData[] = [
  { id: "1", name: "User 1", email: "user1@example.com", status: "Inactive", joined: "22 days ago", avatarColor: "#4318FF" },
  { id: "2", name: "User 2", email: "user2@example.com", status: "Active", joined: "1 days ago", avatarColor: "#05cd99" },
  { id: "3", name: "User 3", email: "user3@example.com", status: "Active", joined: "5 days ago", avatarColor: "#FFB547" },
  { id: "4", name: "User 4", email: "user4@example.com", status: "Inactive", joined: "24 days ago", avatarColor: "#4318FF" },
  { id: "5", name: "User 5", email: "user5@example.com", status: "Active", joined: "18 days ago", avatarColor: "#05cd99" },
  
  { id: "6", name: "User 6", email: "user6@example.com", status: "Active", joined: "20 days ago", avatarColor: "#FFB547" },
];

export const DashboardAdmin: React.FC = () => {
  
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserData[]>(tableData);

  
  const columns: ColumnsType<UserData> = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
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
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`status-badge ${status === 'Active' ? 'status-active' : 'status-inactive'}`}>
          {status}
        </span>
      ),
    },
    {
      title: "JOINED",
      dataIndex: "joined",
      key: "joined",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "ACTIONS",
      key: "action",
      render: () => (
        <Button type="link" style={{ fontWeight: 600 }}>View</Button>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      
      {/* --- BAGIAN 1: STATS CARDS --- */}
      <Row gutter={[24, 24]}>
        {/* Card 1: Total Users */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: '20px' }} style={{ borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p className="stat-label">Total Users</p>
                <h3 className="stat-value">2,543</h3>
                <div className="stat-trend trend-up">
                  <ArrowUpOutlined /> <span>+12.5%</span>
                </div>
              </div>
              <div className="stat-card-icon" style={{ background: '#F4F7FE', color: '#4318FF' }}>
                <UserOutlined />
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 2: Active Sessions */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: '20px' }} style={{ borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p className="stat-label">Active Sessions</p>
                <h3 className="stat-value">847</h3>
                <div className="stat-trend trend-up">
                  <ArrowUpOutlined /> <span>+8.2%</span>
                </div>
              </div>
              <div className="stat-card-icon" style={{ background: '#F4F7FE', color: '#05cd99' }}>
                <RiseOutlined />
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 3: Monthly Revenue */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: '20px' }} style={{ borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p className="stat-label">Monthly Revenue</p>
                <h3 className="stat-value">$45,231</h3>
                <div className="stat-trend trend-up">
                  <ArrowUpOutlined /> <span>+23.1%</span>
                </div>
              </div>
              <div className="stat-card-icon" style={{ background: '#F4F7FE', color: '#9747FF' }}>
                <DollarOutlined />
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 4: Conversion Rate */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: '20px' }} style={{ borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p className="stat-label">Conversion Rate</p>
                <h3 className="stat-value">3.24%</h3>
                <div className="stat-trend trend-down">
                  <ArrowDownOutlined /> <span>-2.4%</span>
                </div>
              </div>
              <div className="stat-card-icon" style={{ background: '#FFF7E6', color: '#FFB547' }}>
                <BarChartOutlined />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* --- BAGIAN 2: CHART & QUICK STATS --- */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        
        {/* Left Side: Revenue Analytics (Visual CSS Chart) */}
        <Col xs={24} lg={16}>
          <Card 
            bordered={false} 
            className="chart-card" 
            style={{ borderRadius: '16px' }}
            title={<Title level={4} style={{ margin: 0, color: '#2b3674' }}>Revenue Analytics</Title>}
            extra={<Button type="link">View Details</Button>}
          >
            {/* Visualisasi Chart sederhana menggunakan CSS Flexbox */}
            <div className="bar-chart-container">
              {chartData.map((height, index) => (
                <div 
                  key={index} 
                  className="chart-bar" 
                  style={{ height: `${height}%` }} 
                />
              ))}
            </div>
          </Card>
        </Col>

        {/* Right Side: Quick Stats (Blue Card) */}
        <Col xs={24} lg={8}>
          <div className="quick-stats-card p-4" style={{ padding: '24px' }}>
            <Title level={4} style={{ color: 'white', marginTop: 0 }}>Quick Stats</Title>
            
            <div style={{ marginTop: '32px' }}>
              <div className="quick-stat-item">
                <div className="quick-stat-label">Daily Users</div>
                <div className="quick-stat-value">1,234</div>
              </div>
              
              <div className="quick-stat-item">
                <div className="quick-stat-label">Avg Duration</div>
                <div className="quick-stat-value">8m 42s</div>
              </div>
              
              <div className="quick-stat-item">
                <div className="quick-stat-label">Bounce Rate</div>
                <div className="quick-stat-value">42.3%</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* --- BAGIAN 3: TABLE --- */}
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card bordered={false} style={{ borderRadius: '16px' }}>
            <div className="table-header">
              <Title level={4} style={{ margin: 0, color: '#2b3674' }}>Recent Users</Title>
              <Button icon={<FilterOutlined />}>Status</Button>
            </div>
            
            <Table 
              columns={columns} 
              dataSource={data} 
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 5,
                position: ['bottomRight'],
                showSizeChanger: false,
                
                total: 500, 
                showTotal: (total, range) => `Menampilkan ${range[0]} - ${range[1]} dari ${total} data`,
                className: "custom-pagination"
              }}
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
};