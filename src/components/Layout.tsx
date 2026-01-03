import { useState } from "react";
import { Layout as AntLayout, Menu, Dropdown, Avatar, Space, Typography } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = identity?.role === "admin";

  const menuItems = [
    {
      key: isAdmin ? "/admin" : "/user",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate(isAdmin ? "/admin" : "/user"),
    },
  ];

  const profileMenu = (
    <Menu
      items={[
        {
          key: "settings",
          icon: <SettingOutlined />,
          label: "Settings",
          onClick: () => {
            // Navigate to settings (bisa dibuat nanti)
            console.log("Settings clicked");
          },
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Logout",
          onClick: () => logout(),
        },
      ]}
    />
  );

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {collapsed ? "ES" : "E-Sitara"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <AntLayout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            {collapsed ? (
              <MenuUnfoldOutlined
                style={{ fontSize: 18, cursor: "pointer" }}
                onClick={() => setCollapsed(!collapsed)}
              />
            ) : (
              <MenuFoldOutlined
                style={{ fontSize: 18, cursor: "pointer" }}
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
          </div>
          <Dropdown overlay={profileMenu} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
              <div>
                <Text strong>{identity?.name || identity?.email}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {identity?.role?.toUpperCase()}
                </Text>
              </div>
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
