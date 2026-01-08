import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { useForm } from "@refinedev/antd";
import { ComponentModal } from "../../../components/componentModal"; 

interface CreatePaymentProps {
    open: boolean;
    onClose: () => void;
    periodName: string; 
}

export const CreatePayment: React.FC<CreatePaymentProps> = ({ open, onClose, periodName }) => {
    const { formProps, formLoading } = useForm({
        action: "create",
        resource: "payments", 
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
            title={`Input Pembayaran - ${periodName}`}
            isOpen={open}
            onClose={onClose}
            onOk={handleOk}
            okText={formLoading ? "Menyimpan..." : "Simpan"}
        >
            <Form {...formProps} layout="vertical" style={{ marginTop: 20 }}>
                <Form.Item
                    label="Nama Pegawai"
                    name="nama"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Nama Lengkap" />
                </Form.Item>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item
                        label="NIP"
                        name="nip"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Nomor Induk" />
                    </Form.Item>
                    <Form.Item
                        label="Jabatan"
                        name="jabatan"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Jabatan" />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Nominal Pembayaran"
                    name="nominal"
                    rules={[{ required: true }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={value => value!.replace(/\Rp\s?|(\.*)/g, '')}
                    />
                </Form.Item>

                <Form.Item
                    label="Status Pembayaran"
                    name="status"
                    initialValue="pending"
                >
                    <Select>
                        <Select.Option value="paid">Lunas</Select.Option>
                        <Select.Option value="pending">Belum Lunas</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </ComponentModal>
    );
};