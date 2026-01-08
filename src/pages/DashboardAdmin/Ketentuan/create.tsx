import React from "react";
import { Form, Input, InputNumber, Select } from "antd";

type TabType = "ketentuan" | "unit" | "jabatan";

interface CreateFormProps {
    activeTab: TabType;
    form: any; 
}

export const CreateForm: React.FC<CreateFormProps> = ({ activeTab, form }) => {

    if (activeTab === "ketentuan") {
        return (
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Jabatan (Ref)"
                    name="jabatan"
                    rules={[{ required: true, message: "Harap pilih jabatan" }]}
                >
                    <Select placeholder="Pilih Jabatan">
                        <Select.Option value="Arsiparis Ahli Pertama">Arsiparis Ahli Pertama</Select.Option>
                        <Select.Option value="Arsiparis Ahli Muda">Arsiparis Ahli Muda</Select.Option>
                        <Select.Option value="Arsiparis Ahli Madya">Arsiparis Ahli Madya</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Masa Kerja Min (Tahun)"
                    name="masa_kerja"
                    rules={[{ required: true, message: "Harap isi masa kerja" }]}
                >
                    <InputNumber style={{ width: "100%" }} min={0} placeholder="Contoh: 2" />
                </Form.Item>
                <Form.Item
                    label="Paragraf Penjelasan"
                    name="penjelasan"
                    rules={[{ required: true, message: "Harap isi penjelasan" }]}
                >
                    <Input.TextArea rows={3} placeholder="Contoh: Pasal 5 Ayat 1..." />
                </Form.Item>
                <Form.Item
                    label="Nominal (Rp)"
                    name="nominal"
                    rules={[{ required: true, message: "Harap isi nominal" }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        parser={(value) => value!.replace(/Rp\s?|(\.*)/g, "")}
                    />
                </Form.Item>
            </Form>
        );
    }

    if (activeTab === "unit") {
        return (
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Kode Unit"
                    name="kode"
                    rules={[{ required: true, message: "Harap isi kode unit" }]}
                >
                    <Input placeholder="Contoh: UK-001" />
                </Form.Item>
                <Form.Item
                    label="Nama Unit"
                    name="nama_unit"
                    rules={[{ required: true, message: "Harap isi nama unit" }]}
                >
                    <Input placeholder="Contoh: Pusat Pengolahan Arsip" />
                </Form.Item>
                <Form.Item
                    label="Lokasi"
                    name="lokasi"
                    rules={[{ required: true, message: "Harap isi lokasi" }]}
                >
                    <Input placeholder="Contoh: Gedung A" />
                </Form.Item>
            </Form>
        );
    }

    if (activeTab === "jabatan") {
        return (
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Nama Jabatan"
                    name="nama_jabatan"
                    rules={[{ required: true, message: "Harap isi nama jabatan" }]}
                >
                    <Input placeholder="Contoh: Arsiparis Ahli Pertama" />
                </Form.Item>
                <Form.Item
                    label="Grade"
                    name="grade"
                    rules={[{ required: true, message: "Harap pilih grade" }]}
                >
                    <Select placeholder="Pilih Grade">
                        <Select.Option value="Grade 8">Grade 8</Select.Option>
                        <Select.Option value="Grade 9">Grade 9</Select.Option>
                        <Select.Option value="Grade 11">Grade 11</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        );
    }

    return null;
};