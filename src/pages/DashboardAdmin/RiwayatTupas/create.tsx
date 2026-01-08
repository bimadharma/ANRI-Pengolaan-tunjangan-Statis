import React, { useEffect } from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { useForm } from "@refinedev/antd";
import { ComponentModal } from "../../../components/componentModal"; 

interface CreateRiwayatProps {
    open: boolean;
    onClose: () => void;
}

export const CreateRiwayatTupas: React.FC<CreateRiwayatProps> = ({ open, onClose }) => {
    const { formProps, formLoading } = useForm({
        action: "create",
        resource: "riwayat-tupas", 
        redirect: false,
        onMutationSuccess: () => {
            onClose();
            formProps.form?.resetFields();
        },
    });

    useEffect(() => {
        if (open) formProps.form?.resetFields();
    }, [open, formProps.form]);

    const handleOk = () => {
        formProps.form?.submit();
    };

    return (
        <ComponentModal
            title="Tambah Riwayat Tupas"
            isOpen={open}
            onClose={onClose}
            onOk={handleOk}
            okText={formLoading ? "Menyimpan..." : "Simpan"}
        >
            <Form 
                {...formProps} 
                layout="vertical" 
                style={{ marginTop: 20 }}
            >
                <Form.Item
                    label="Nama Pegawai"
                    name="nama"
                    rules={[{ required: true, message: 'Nama wajib diisi' }]}
                >
                    <Input placeholder="Nama Lengkap" />
                </Form.Item>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item
                        label="NIP"
                        name="nip"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Nomor Induk Pegawai" />
                    </Form.Item>

                    <Form.Item
                        label="Jabatan"
                        name="jabatan"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Ex: Kepala Bagian" />
                    </Form.Item>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item
                        label="Unit Kerja"
                        name="unit"
                        rules={[{ required: true }]}
                    >
                        <Select placeholder="Pilih Unit">
                            <Select.Option value="IT">IT</Select.Option>
                            <Select.Option value="HR">HR</Select.Option>
                            <Select.Option value="Finance">Finance</Select.Option>
                            <Select.Option value="Operations">Operations</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Tanggal Riwayat"
                        name="tanggal"
                        rules={[{ required: true }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                </div>
            </Form>
        </ComponentModal>
    );
};