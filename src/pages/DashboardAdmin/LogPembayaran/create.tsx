import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { useForm } from "@refinedev/antd";
import { ComponentModal } from "../../../components/componentModal"; 

interface CreateLogProps {
    open: boolean;
    onClose: () => void;
}

export const CreateLogPembayaran: React.FC<CreateLogProps> = ({ open, onClose }) => {
    const { formProps, formLoading } = useForm({
        action: "create",
        resource: "log-pembayaran", 
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
            title="Tambah Data Pegawai"
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
                    label="Nama Lengkap"
                    name="nama"
                    rules={[{ required: true, message: "Wajib diisi" }]}
                >
                    <Input placeholder="Contoh: Ahmad Fauzi" />
                </Form.Item>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item
                        label="Posisi"
                        name="posisi"
                        rules={[{ required: true }]}
                    >
                         <Select placeholder="Pilih Posisi">
                            <Select.Option value="Product Manager">Product Manager</Select.Option>
                            <Select.Option value="Senior Developer">Senior Developer</Select.Option>
                            <Select.Option value="UI/UX Designer">UI/UX Designer</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Unit"
                        name="unit"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Ex: IT, Finance, HR" />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Nominal Pembayaran"
                    name="nominal"
                    rules={[{ required: true }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Rp 0"
                        formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={value => value!.replace(/\Rp\s?|(\.*)/g, '')}
                    />
                </Form.Item>
            </Form>
        </ComponentModal>
    );
};