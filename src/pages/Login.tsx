import { useEffect } from "react";
import { Card, Form, Input, Button, App } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useLogin } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const { mutate: login } = useLogin();
  const navigate = useNavigate();
  const { notification } = App.useApp();

  useEffect(() => {
    // Cek apakah sudah login
    const auth = localStorage.getItem("auth");
    if (auth) {
      const user = JSON.parse(auth);
      const redirectTo = user.role === "admin" ? "/admin" : "/user";
      navigate(redirectTo, { replace: true });
    }
  }, [navigate]);

  const onFinish = async (values: any) => {
    try {
      console.log("Login attempt with:", values);
      
      // Ambil semua users
      const res = await axios.get("http://localhost:3001/users");
      console.log("Users from API:", res.data);
      
      // Cari user yang cocok dengan email dan password
      const user = res.data.find(
        (u: any) => u.email === values.email && u.password === values.password
      );

      console.log("Found user:", user);

      if (!user) {
        console.log("No user found - showing error notification");
        notification.error({
          message: "Login Gagal",
          description: "Email atau password yang Anda masukkan salah. Silakan coba lagi.",
          placement: "topRight",
          duration: 4,
        });
        return;
      }

      console.log("Login successful - showing success notification");
      notification.success({
        message: "Login Berhasil",
        description: `Selamat datang, ${user.name}!`,
        placement: "topRight",
        duration: 3,
      });

      login({
        email: user.email,
        role: user.role,
        name: user.name,
        redirectPath: user.role === "admin" ? "/admin" : "/user",
      });
    } catch (error) {
      console.error("Login error:", error);
      notification.error({
        message: "Login Gagal",
        description: "Terjadi kesalahan saat mencoba login. Silakan coba lagi.",
        placement: "topRight",
        duration: 4,
      });
    }
  };

  return (
    <Card title="Login" style={{ maxWidth: 400, margin: "120px auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email tidak boleh kosong!" },
            { type: "email", message: "Format email tidak valid!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Masukkan email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Password tidak boleh kosong!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Masukkan password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form>
    </Card>
  );
}
