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
          width: 45,
          height: 45,
          objectFit: "contain",
        }}
      />

      {/* TEXT */}
      {!collapsed && (
        <Typography.Text
          style={{
            fontSize: 18,
            fontWeight: 700,
            whiteSpace: "nowrap",
            color: "#0096C9",
          }}
        >
          SITARA
        </Typography.Text>
      )}
    </div>
  );
};
