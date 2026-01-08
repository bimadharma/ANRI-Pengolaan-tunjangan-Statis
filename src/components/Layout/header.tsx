import React from "react";
import { useGetIdentity } from "@refinedev/core";
import { Layout as AntdLayout, Typography, Avatar, Space, theme } from "antd";
import type { RefineThemedLayoutHeaderProps } from "@refinedev/antd";

export const ThemedHeader: React.FC<RefineThemedLayoutHeaderProps> = () => {
  const { token } = theme.useToken();
  const { data: user } = useGetIdentity();

  const shouldRenderHeader = user && (user.name || user.avatar);
  if (!shouldRenderHeader) return null;

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    position: "fixed",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 100,
  };

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Space size="middle">
          {user?.name && <Typography.Text strong>{user.name}</Typography.Text>}
          {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};
