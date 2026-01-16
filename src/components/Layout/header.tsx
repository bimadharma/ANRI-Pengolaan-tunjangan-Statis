import React from "react";
import {
  useGetIdentity,
  useLogout,
} from "@refinedev/core";
import {
  Layout as AntdLayout,
  Typography,
  Avatar,
  Space,
  theme,
  Dropdown,
  Grid,
} from "antd";
import type { RefineThemedLayoutHeaderProps } from "@refinedev/antd";
import {
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

const { useBreakpoint } = Grid;

export const ThemedHeader: React.FC<RefineThemedLayoutHeaderProps> = () => {
  const { token } = theme.useToken();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const { data: user } = useGetIdentity();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  if (!user) return null;

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div style={{ padding: "8px 12px", minWidth: 220 }}>
          <Space align="start">
            <Avatar
              size={40}
              src={user?.avatar}
              icon={!user?.avatar && <UserOutlined />}
               style={{ background: "linear-gradient(135deg, #002347 0%, #00509d 100%)" }}
            />
            <div>
              <Typography.Text strong>
                {user?.name}
              </Typography.Text>
              <br />
              <Typography.Text
                type="secondary"
                style={{ fontSize: 12 }}
              >
                {user?.email}
              </Typography.Text>
            </div>
          </Space>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "settings",
      onClick: () => navigate("/settings"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Keluar",
      danger: true,
      onClick: () => logout(),
    },
  ];

  return (
    <AntdLayout.Header
      style={{
        background: token.colorBgElevated,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: isMobile ? "0 16px" : "0 24px",
        height: 64,
        position: "fixed",
        insetInline: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
        placement="bottomRight"
        arrow
      >
        <Space
          size={12}
          style={{
            cursor: "pointer",
            padding: isMobile ? 6 : "6px 12px",
            borderRadius: 8,
            transition: "background 0.2s",
          }}
        >
          <Avatar
            src={user?.avatar}
            icon={!user?.avatar && <UserOutlined />}
            size={isMobile ? 32 : 35}
            style={{ background: "linear-gradient(135deg, #002347 0%, #00509d 100%)" }}
          />

          {/* Nama hanya muncul di desktop */}
          {!isMobile && (
            <Typography.Text strong>
              {user?.name}
            </Typography.Text>
          )}
        </Space>
      </Dropdown>
    </AntdLayout.Header>
  );
};
