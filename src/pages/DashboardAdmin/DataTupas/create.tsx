import React, { useEffect } from "react";
import { Form, Input, InputNumber } from "antd";
import { useForm } from "@refinedev/antd";
import { ComponentModal } from "../../../components/componentModal"; 

interface ICreateTupasProps {
    open: boolean;
    onClose: () => void;
}

export const CreateTupas: React.FC<ICreateTupasProps> = ({ open, onClose }) => {
    
    
    const { formProps, formLoading } = useForm({
        action: "create",
        resource: "tupas",
        redirect: false,
        onMutationSuccess: () => {
            onClose(); 
            formProps.form?.resetFields(); 
        },
    });

    
    useEffect(() => {
        if (open) {
            formProps.form?.resetFields();
        }
    }, [open, formProps.form]);

    const handleOk = () => {
        
        formProps.form?.submit();
    };

    return (
        <ComponentModal
            title="Tambah Data Tupas"
            isOpen={open}
            onClose={onClose}
            onOk={handleOk}
            okText={formLoading ? "Menyimpan..." : "Simpan"}
        >
            <Form 
                {...formProps} 
                layout="vertical"
                style={{ marginTop: "10px" }}
            >
                <Form.Item
                    label="Nama Pegawai"
                    name="nama"
                    rules={[{ required: true, message: "Nama wajib diisi" }]}
                >
                    <Input placeholder="Nama Lengkap" />
                </Form.Item>

                <Form.Item
                    label="NIP"
                    name="nip"
                    rules={[{ required: true, message: "NIP wajib diisi" }]}
                >
                    <Input placeholder="Nomor Induk Pegawai" type="number" />
                </Form.Item>

                <Form.Item
                    label="Jabatan"
                    name="jabatan"
                    rules={[{ required: true, message: "Jabatan wajib diisi" }]}
                >
                    <Input placeholder="Masukkan Jabatan" />
                </Form.Item>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Form.Item
                        label="Golongan"
                        name="golongan"
                        rules={[{ required: true, message: "Golongan wajib diisi" }]}
                    >
                        <Input placeholder="Ex: III/c" />
                    </Form.Item>
                    
                     <Form.Item
                        label="Periode"
                        name="periode"
                        initialValue="01/2024"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="MM/YYYY" />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Gaji Pokok"
                    name="gaji_pokok"
                    rules={[{ required: true, message: "Gaji Pokok wajib diisi" }]}
                >
                     <InputNumber 
                        style={{ width: "100%" }} 
                        placeholder="Rp 0"
                        formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={value => value!.replace(/\Rp\s?|(\.*)/g, '')}
                     />
                </Form.Item>
            </Form>
        </ComponentModal>
    );
};