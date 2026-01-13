import React from "react";
import { Typography } from "antd";

type AppTitleProps = {
  collapsed?: boolean;
};

export const AppTitle: React.FC<AppTitleProps> = ({ collapsed }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* LOGO */}
      <img
        src="ANRI.png"   
        alt="Logo"
        style={{
          width: 32,
          height: 32,
          objectFit: "contain",
        }}
      />

      {/* TEXT */}
      {!collapsed && (
        <Typography.Text
          strong
          style={{
            fontSize: 16,
            whiteSpace: "nowrap",
          }}
        >
          SITARA
        </Typography.Text>
      )}
    </div>
  );
};
