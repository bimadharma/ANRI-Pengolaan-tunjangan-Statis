import React, { useState } from "react";
import { Layout, Card, Typography, Form, Input, Button, Space, App as AntApp } from "antd";
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLogin } from "@refinedev/core";
import "../styles/login.css";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Login: React.FC = () => {
  const { message, notification } = AntApp.useApp();
  const navigate = useNavigate();
  const { mutateAsync: login } = useLogin();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values: { identifier: string; password: string }) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const hideMessage = message.loading("Memeriksa kredensial...", 0);

    try {
      const { data } = await axios.get("http://localhost:3001/users", {
        params: {
          q: values.identifier,
        },
      });

      const user = data.find(
        (item: any) =>
          (item.email === values.identifier || item.username === values.identifier) &&
          item.password === values.password
      );

      if (!user) {
        notification.error({
          message: "Login gagal",
          description: "Email/username atau password tidak sesuai.",
        });
        return;
      }

      await login({
        email: user.email || user.username,
        role: user.role || "user",
        name: user.name || user.email || user.username,
        redirectPath: "/dashboard",
      });

      sessionStorage.setItem("loginSuccess", "true");

      notification.success({
        message: "Login berhasil",
        description: `Halo ${user.name || user.email}, Anda masuk sebagai ${user.role || "user"}.`,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      notification.error({
        message: "Login gagal",
        description: "Terjadi kesalahan pada server. Silakan coba lagi.",
      });
    } finally {
      hideMessage();
      setIsSubmitting(false);
    }
  };

  return (
    <Layout className="login-layout">
      <Content style={{ padding: "20px" }}>
        <Card className="login-card" bordered={false}>
          
          <div className="login-header">
            <div className="logo-container">
              <img src="/ANRI.png" alt="Logo ANRI" className="app-logo" />
            </div>
            <Title level={3} style={{ color: "#0050b3", marginBottom: 8 }}>
            <span style={{ color: "#00509d", fontSize: "36px", fontWeight:"bold" }}>SITARA</span>
            </Title>
            <Text type="secondary">  
             Sistem Tunjangan Arsip Statis
            </Text>
          </div>

          <Form
            layout="vertical"
            size="large"
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="identifier"
              rules={[{ required: true, message: "Mohon masukkan Email atau Username" }]}
              className="custom-input"
            >
              <Input
                prefix={<UserOutlined style={{ color: "#00509d" }} />}
                placeholder="Email atau Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Mohon masukkan Password" }]}
              className="custom-input"
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#00509d" }} />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: "24px" }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
                className="btn-gradient"
              >
                Masuk Sekarang
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/")}
                style={{ color: "#8c8c8c" }}
              >
                Kembali ke Beranda
              </Button>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
