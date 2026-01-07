import React, { useState } from "react";
import { Layout, Card, Typography, Form, Input, Button, Space, App as AntApp } from "antd";
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLogin } from "@refinedev/core";
import "../styles/login.css";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

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
      <Content className="login-content">
        <Card className="login-card" bordered={false}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div className="login-header">
              <Title level={2}>Selamat Datang</Title>
              <Paragraph>
                Silakan login untuk melanjutkan ke sistem SITARA
              </Paragraph>
            </div>

            <Form layout="vertical" size="large" onFinish={onFinish}>
              <Form.Item
                name="identifier"
                label="Email atau Username"
                rules={[{ required: true, message: "Email atau username wajib diisi" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Masukkan email atau username"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Password wajib diisi" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Masukkan password"
                />
              </Form.Item>

              <Button type="primary" htmlType="submit" block loading={isSubmitting} disabled={isSubmitting}>
                Login
              </Button>

              <Button
                type="link"
                block
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/")}
              >
                Kembali ke Beranda
              </Button>
            </Form>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
