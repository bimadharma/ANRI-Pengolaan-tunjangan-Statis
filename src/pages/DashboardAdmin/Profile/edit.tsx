import React, { useEffect } from "react";
import { Form, Input, Select } from "antd";
import { useForm } from "@refinedev/antd";
import { ComponentModal } from "../../../components/componentModal";  

interface EditProfileProps {
    open: boolean;
    onClose: () => void;
    initialData?: any; 
}

export const EditProfile: React.FC<EditProfileProps> = ({ open, onClose, initialData }) => {
    const { formProps, formLoading } = useForm({
        action: "edit", 
        resource: "users",
        id: initialData?.id, 
        redirect: false,
        onMutationSuccess: () => {
            onClose();
        },
    });

    
    useEffect(() => {
        if (open && initialData) {
            formProps.form?.setFieldsValue(initialData);
        }
    }, [open, initialData, formProps.form]);

    const handleOk = () => {
        formProps.form?.submit();
    };

    return (
        <ComponentModal
            title="Edit Profil"
            isOpen={open}
            onClose={onClose}
            onOk={handleOk}
            okText={formLoading ? "Menyimpan..." : "Simpan Perubahan"}
        >
            <Form 
                {...formProps} 
                layout="vertical" 
                style={{ marginTop: 20 }}
                initialValues={initialData}
            >
                <Form.Item
                    label="Nama Lengkap"
                    name="nama"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Nama Lengkap Anda" />
                </Form.Item>

                <Form.Item
                    label="Jabatan"
                    name="jabatan"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Posisi / Jabatan" />
                </Form.Item>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item
                        label="Unit Kerja"
                        name="unit"
                        rules={[{ required: true }]}
                    >
                         <Select placeholder="Pilih Unit">
                            <Select.Option value="IT">IT Development</Select.Option>
                            <Select.Option value="HR">Human Resource</Select.Option>
                            <Select.Option value="Finance">Finance</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Lokasi"
                        name="lokasi"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Kota / Lokasi Kantor" />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true }]}
                >
                    <Select placeholder="Pilih Role">
                        <Select.Option value="user">User</Select.Option>
                        <Select.Option value="admin">Admin</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </ComponentModal>
    );
};