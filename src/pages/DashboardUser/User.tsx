// list.tsx
import React from "react";
import { List, useTable, EditButton, DeleteButton, ShowButton } from "@refinedev/antd";
import { Table, Space, Tag, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

// Import file CSS biasa
import "../../styles/DashboardUser.css";

// Interface Data
interface IUserData {
  id: number;
  name: string;
  role: string;
  status: "active" | "inactive";
}

// --- DUMMY DATA ---
const dummyData: IUserData[] = [
  { id: 1, name: "Budi Santoso", role: "Admin", status: "active" },
  { id: 2, name: "Siti Aminah", role: "Staff", status: "active" },
  { id: 3, name: "Joko Anwar", role: "Intern", status: "inactive" },
];

export const DashboardUser: React.FC = () => {
  /**
   * TODO: PERSIAPAN FETCH API
   * 1. Hapus 'dataSource={dummyData}' di komponen <Table>
   * 2. Uncomment baris 'const { tableProps } ...' di bawah ini.
   * 3. Tambahkan {...tableProps} ke dalam komponen <Table>
   */

  // const { tableProps } = useTable<IUserData>({
  //   resource: "users",
  // });

  return (
    <div className="page-container">
      <List title="Data Pengguna USER">
        <div className="table-card">
          <Table
            // Gunakan dummyData dulu, nanti ganti {...tableProps}
            dataSource={dummyData}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          >
            <Table.Column 
                title="#" 
                dataIndex="id" 
                width={50} 
            />
            
            <Table.Column
              title="Nama Lengkap"
              dataIndex="name"
              render={(text) => (
                <Space>
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  {text}
                </Space>
              )}
            />

            <Table.Column 
                title="Jabatan" 
                dataIndex="role" 
            />

            <Table.Column
              title="Status"
              dataIndex="status"
              render={(value) => (
                <Tag color={value === "active" ? "green" : "volcano"}>
                  {value ? value.toUpperCase() : "-"}
                </Tag>
              )}
            />

            <Table.Column
              title="Aksi"
              dataIndex="actions"
              render={(_, record: IUserData) => (
                <Space>
                  <ShowButton hideText size="small" recordItemId={record.id} />
                  <EditButton hideText size="small" recordItemId={record.id} />
                  <DeleteButton hideText size="small" recordItemId={record.id} />
                </Space>
              )}
            />
          </Table>
        </div>
      </List>
    </div>
  );
};