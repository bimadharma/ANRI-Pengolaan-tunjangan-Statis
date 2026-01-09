import React, { useContext } from "react";
import {
  type TreeMenuItem,
  useTranslate,
  CanAccess,
  useIsExistAuthentication,
  useMenu,
  useLink,
} from "@refinedev/core";
import { ThemedTitle, useThemedLayoutContext } from "@refinedev/antd";
import {
  UnorderedListOutlined,
  BarsOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Grid,
  Drawer,
  Button,
  theme,
  ConfigProvider,
} from "antd";
import type { RefineThemedLayoutSiderProps } from "@refinedev/antd";
import type { CSSProperties } from "react";

import "../../styles/Layout.css";

const drawerButtonStyles: CSSProperties = {
  borderStartStartRadius: 0,
  borderEndStartRadius: 0,
  position: "fixed",
  top: 64,
  zIndex: 999,
};

export const ThemedSider: React.FC<RefineThemedLayoutSiderProps> = ({
  Title: TitleFromProps,
  render,
  meta,
  fixed = true, 
  siderItemsAreCollapsed = true,
}) => {
  const { token } = theme.useToken();
  const {
    siderCollapsed,
    setSiderCollapsed,
    mobileSiderOpen,
    setMobileSiderOpen,
  } = useThemedLayoutContext();

  const isExistAuthentication = useIsExistAuthentication();
  const direction = useContext(ConfigProvider.ConfigContext)?.direction;
  const Link = useLink();
  const translate = useTranslate();
  const { menuItems, selectedKey, defaultOpenKeys } = useMenu({ meta });
  const breakpoint = Grid.useBreakpoint();

  const isMobile =
    typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;

  const RenderToTitle = TitleFromProps ?? ThemedTitle;

  const renderTreeView = (tree: TreeMenuItem[], selectedKey?: string) => {
    return tree.map((item: TreeMenuItem) => {
      const { key, name, children, meta, list } = item;
      const label = item?.label ?? meta?.label ?? name;
      const icon = meta?.icon;

      if (children.length > 0) {
        return (
          <CanAccess
            key={item.key}
            resource={name}
            action="list"
            params={{
              resource: item,
            }}
          >
            <Menu.SubMenu
              key={item.key}
              icon={icon ?? <UnorderedListOutlined />}
              title={label}
            >
              {renderTreeView(children, selectedKey)}
            </Menu.SubMenu>
          </CanAccess>
        );
      }
      const isSelected = key === selectedKey;
      const isRoute = !(meta?.parent !== undefined && children.length === 0);

      return (
        <CanAccess
          key={item.key}
          resource={name}
          action="list"
          params={{
            resource: item,
          }}
        >
          <Menu.Item
            key={item.key}
            icon={icon ?? (isRoute && <UnorderedListOutlined />)}
          >
            <Link to={list ?? ""}>
              {label}
            </Link>
            {!siderCollapsed && isSelected && (
              <div className="ant-menu-tree-arrow" />
            )}
          </Menu.Item>
        </CanAccess>
      );
    });
  };

  const defaultExpandMenuItems = (() => {
    if (siderItemsAreCollapsed) return [];

    return menuItems.map(({ key }) => key);
  })();

  const items = renderTreeView(menuItems, selectedKey);

  const renderSider = () => {
    if (render) {
      return render({
        items,
        collapsed: siderCollapsed,
        logout: undefined
      });
    }
    return [...items].filter(Boolean);
  };

  const renderMenu = () => {
    return (
      <Menu
        className="custom-menu"
        selectedKeys={selectedKey ? [selectedKey] : []}
        defaultOpenKeys={[...defaultOpenKeys, ...defaultExpandMenuItems]}
        mode="inline"
        style={{
          
          borderRight: "none",
          overflowY: "auto", 
          overflowX: "hidden", 
          height: "calc(100vh - 64px - 48px)", 
          
        }}
        onClick={() => {
          setMobileSiderOpen(false);
        }}
      >
        {renderSider()}
      </Menu>
    );
  };

  const renderDrawerSider = () => {
    return (
      <>
        <Drawer
          open={mobileSiderOpen}
          onClose={() => setMobileSiderOpen(false)}
          placement={direction === "rtl" ? "right" : "left"}
          closable={false}
          width={240}
          styles={{
            body: {
              padding: 0,
            },
          }}
          maskClosable={true}
        >
          <Layout>
            <Layout.Sider
              className="custom-sider"
              width={240}
              style={{
                height: "100vh",
                overflow: "hidden",
              }}
            >
              <div
                className={`sider-logo-container ${
                  siderCollapsed ? "collapsed" : ""
                }`}
              >
                <RenderToTitle collapsed={false} />
              </div>
              {renderMenu()}
            </Layout.Sider>
          </Layout>
        </Drawer>
        <Button
          style={drawerButtonStyles}
          size="large"
          onClick={() => setMobileSiderOpen(true)}
          icon={<BarsOutlined />}
        />
      </>
    );
  };

  if (isMobile) {
    return renderDrawerSider();
  }

  
  const siderStyles: React.CSSProperties = {
    
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh", 
    zIndex: 999,
  };
  

  const renderClosingIcons = () => {
    const iconProps = { style: { color: token.colorPrimary } };
    const OpenIcon = direction === "rtl" ? RightOutlined : LeftOutlined;
    const CollapsedIcon = direction === "rtl" ? LeftOutlined : RightOutlined;
    const IconComponent = siderCollapsed ? CollapsedIcon : OpenIcon;

    return <IconComponent />;
  };

  return (
    <>

      <div
        style={{
          width: siderCollapsed ? "80px" : "240px",
          height: "100vh", 
          transition: "all 0.2s",
          flexShrink: 0, 
        }}
      />

      <Layout.Sider
        className="custom-sider"
        style={siderStyles}
        collapsible
        collapsed={siderCollapsed}
        onCollapse={(collapsed, type) => {
          if (type === "clickTrigger") {
            setSiderCollapsed(collapsed);
          }
        }}
        collapsedWidth={80}
        width={240}
        breakpoint="lg"
        trigger={
          <Button
            type="text"
            className="custom-trigger-btn"
            style={{
              borderRadius: 0,
              height: "48px", 
              width: "100%",
            }}
          >
            {renderClosingIcons()}
          </Button>
        }
      >
        <div
          className={`sider-logo-container ${
            siderCollapsed ? "collapsed" : ""
          }`}
          style={{ height: "64px" }}
        >
          <RenderToTitle collapsed={siderCollapsed} />
        </div>
        {renderMenu()}
      </Layout.Sider>
    </>
  );
};