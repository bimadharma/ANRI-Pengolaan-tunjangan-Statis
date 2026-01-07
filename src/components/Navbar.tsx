import { Layout, Button, Space } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <Header
      style={{
        padding: "0 24px",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#1890ff",
        }}
      >
        E-Sitara
      </div>
      <Space>
        <Button
          type="primary"
          icon={<LoginOutlined />}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Space>
    </Header>
  );
};
