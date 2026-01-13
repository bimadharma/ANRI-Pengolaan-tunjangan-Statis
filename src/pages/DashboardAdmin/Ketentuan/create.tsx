import React from "react";
import { Form, Input, InputNumber, Select } from "antd";

type TabType = "ketentuan" | "unitKerja" | "jabatan";

interface CreateFormProps {
    activeTab: TabType;
    subTab?: string;
    form: any; 
}

export const CreateForm: React.FC<CreateFormProps> = ({ activeTab, subTab, form }) => {

    
    if (activeTab === "ketentuan") {
        
        if (subTab === "faktorRisiko") {
            return (
                <Form form={form} layout="vertical">
                    <Form.Item label="Kode Risiko" name="kodeRisiko" rules={[{ required: true, message: "Harap isi kode risiko" }]}>
                        <Input placeholder="Contoh: FR-001" />
                    </Form.Item>
                    <Form.Item label="Kategori Risiko" name="kategoriRisiko" rules={[{ required: true, message: "Harap pilih kategori" }]}>
                        <Select placeholder="Pilih Kategori">
                            <Select.Option value="Tinggi">Tinggi</Select.Option>
                            <Select.Option value="Sedang">Sedang</Select.Option>
                            <Select.Option value="Rendah">Rendah</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Deskripsi" name="deskripsi" rules={[{ required: true, message: "Harap isi deskripsi" }]}>
                        <Input.TextArea rows={3} placeholder="Deskripsi risiko..." />
                    </Form.Item>
                    <Form.Item label="Nilai Faktor" name="nilaiFaktor" rules={[{ required: true, message: "Harap isi nilai faktor" }]}>
                        <InputNumber style={{ width: "100%" }} min={0} max={5} step={0.1} placeholder="Contoh: 3.0" />
                    </Form.Item>
                    <Form.Item label="Status" name="status" rules={[{ required: true, message: "Harap pilih status" }]}>
                        <Select placeholder="Pilih Status">
                            <Select.Option value="Aktif">Aktif</Select.Option>
                            <Select.Option value="Tidak Aktif">Tidak Aktif</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            );
        }

        
        if (subTab === "faktorTanggungJawab") {
            return (
                <Form form={form} layout="vertical">
                    <Form.Item label="Kode Faktor" name="kodeFaktor" rules={[{ required: true, message: "Harap isi kode faktor" }]}>
                        <Input placeholder="Contoh: FT-001" />
                    </Form.Item>
                    <Form.Item label="Jabatan Tanggung Jawab" name="jabatanTanggungJawab" rules={[{ required: true, message: "Harap pilih jabatan" }]}>
                        <Select placeholder="Pilih Jabatan">
                            <Select.Option value="Kepala Arsip">Kepala Arsip</Select.Option>
                            <Select.Option value="Arsiparis Ahli Madya">Arsiparis Ahli Madya</Select.Option>
                            <Select.Option value="Arsiparis Ahli Muda">Arsiparis Ahli Muda</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Nilai Faktor" name="nilaiFaktor" rules={[{ required: true, message: "Harap isi nilai faktor" }]}>
                        <InputNumber style={{ width: "100%" }} min={0} max={5} step={0.1} placeholder="Contoh: 2.5" />
                    </Form.Item>
                    <Form.Item label="Keterangan" name="keterangan" rules={[{ required: true, message: "Harap isi keterangan" }]}>
                        <Input.TextArea rows={2} placeholder="Keterangan tanggung jawab..." />
                    </Form.Item>
                </Form>
            );
        }

        
        if (subTab === "faktorLamaKerja") {
            return (
                <Form form={form} layout="vertical">
                    <Form.Item label="Rentang Masa Kerja" name="rentangMasaKerja" rules={[{ required: true, message: "Harap isi rentang masa kerja" }]}>
                        <Input placeholder="Contoh: 0-4 tahun" />
                    </Form.Item>
                    <Form.Item label="Nilai Faktor" name="nilaiFaktor" rules={[{ required: true, message: "Harap isi nilai faktor" }]}>
                        <InputNumber style={{ width: "100%" }} min={0} max={5} step={0.25} placeholder="Contoh: 1.25" />
                    </Form.Item>
                    <Form.Item label="Keterangan" name="keterangan" rules={[{ required: true, message: "Harap isi keterangan" }]}>
                        <Input placeholder="Contoh: Masa kerja menengah" />
                    </Form.Item>
                </Form>
            );
        }

        
        if (subTab === "mappingTunjangan") {
            return (
                <Form form={form} layout="vertical">
                    <Form.Item label="Total Nilai" name="totalNilai" rules={[{ required: true, message: "Harap isi total nilai" }]}>
                        <InputNumber style={{ width: "100%" }} min={0} max={20} step={0.5} placeholder="Contoh: 6.5" />
                    </Form.Item>
                    <Form.Item label="Tingkat Risiko" name="tingkatRisiko" rules={[{ required: true, message: "Harap pilih tingkat risiko" }]}>
                        <Select placeholder="Pilih Tingkat Risiko">
                            <Select.Option value="Sangat Tinggi">Sangat Tinggi</Select.Option>
                            <Select.Option value="Tinggi">Tinggi</Select.Option>
                            <Select.Option value="Sedang">Sedang</Select.Option>
                            <Select.Option value="Rendah">Rendah</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Besar Tunjangan (Rp)" name="besarTunjangan" rules={[{ required: true, message: "Harap isi besar tunjangan" }]}>
                        <InputNumber
                            style={{ width: "100%" }}
                            min={0}
                            formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                            parser={(value) => (parseInt(value!.replace(/Rp\s?|(\.*)/g, ""), 10) || 0) as any}
                            placeholder="Contoh: 5500000"
                        />
                    </Form.Item>
                </Form>
            );
        }

        
        if (subTab === "metadata") {
            return (
                <Form form={form} layout="vertical">
                    <Form.Item label="Tahun Berlaku" name="tahunBerlaku" rules={[{ required: true, message: "Harap isi tahun berlaku" }]}>
                        <Input placeholder="Contoh: 2026" />
                    </Form.Item>
                    <Form.Item label="Nomor Regulasi" name="nomorRegulasi" rules={[{ required: true, message: "Harap isi nomor regulasi" }]}>
                        <Input placeholder="Contoh: PERKA-ANRI/01/2026" />
                    </Form.Item>
                    <Form.Item label="Tanggal Berlaku" name="tanggalBerlaku" rules={[{ required: true, message: "Harap isi tanggal berlaku" }]}>
                        <Input placeholder="Contoh: 01 Januari 2026" />
                    </Form.Item>
                    <Form.Item label="Status Ketentuan" name="statusKetentuan" rules={[{ required: true, message: "Harap pilih status" }]}>
                        <Select placeholder="Pilih Status">
                            <Select.Option value="Aktif">Aktif</Select.Option>
                            <Select.Option value="Tidak Aktif">Tidak Aktif</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            );
        }
    }

    
    if (activeTab === "unitKerja") {
        return (
            <Form form={form} layout="vertical">
                <Form.Item label="Kode Unit Kerja" name="kodeUnit" rules={[{ required: true, message: "Harap isi kode unit" }]}>
                    <Input placeholder="Contoh: UK-001" />
                </Form.Item>
                <Form.Item label="Nama Unit Kerja" name="namaUnit" rules={[{ required: true, message: "Harap isi nama unit" }]}>
                    <Input placeholder="Contoh: Sekretariat Utama" />
                </Form.Item>
                <Form.Item label="Level Organisasi" name="levelOrganisasi" rules={[{ required: true, message: "Harap pilih level" }]}>
                    <Select placeholder="Pilih Level">
                        <Select.Option value="Eselon I">Eselon I</Select.Option>
                        <Select.Option value="Eselon II">Eselon II</Select.Option>
                        <Select.Option value="Eselon III">Eselon III</Select.Option>
                        <Select.Option value="Eselon IV">Eselon IV</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Unit Induk (Parent)" name="unitInduk" rules={[{ required: true, message: "Harap isi unit induk" }]}>
                    <Select placeholder="Pilih Unit Induk" allowClear>
                        <Select.Option value="-">-</Select.Option>
                        <Select.Option value="Sekretariat Utama">Sekretariat Utama</Select.Option>
                        <Select.Option value="Deputi Pembinaan Kearsipan">Deputi Pembinaan Kearsipan</Select.Option>
                        <Select.Option value="Deputi Konservasi Arsip">Deputi Konservasi Arsip</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Status" name="status" rules={[{ required: true, message: "Harap pilih status" }]}>
                    <Select placeholder="Pilih Status">
                        <Select.Option value="Aktif">Aktif</Select.Option>
                        <Select.Option value="Nonaktif">Nonaktif</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        );
    }

    
    if (activeTab === "jabatan") {
        return (
            <Form form={form} layout="vertical">
                <Form.Item label="Kode Jabatan" name="kodeJabatan" rules={[{ required: true, message: "Harap isi kode jabatan" }]}>
                    <Input placeholder="Contoh: JB-001" />
                </Form.Item>
                <Form.Item label="Nama Jabatan" name="namaJabatan" rules={[{ required: true, message: "Harap isi nama jabatan" }]}>
                    <Input placeholder="Contoh: Arsiparis Ahli Madya" />
                </Form.Item>
                <Form.Item label="Jenis Jabatan" name="jenisJabatan" rules={[{ required: true, message: "Harap pilih jenis jabatan" }]}>
                    <Select placeholder="Pilih Jenis">
                        <Select.Option value="Struktural">Struktural</Select.Option>
                        <Select.Option value="Fungsional">Fungsional</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Golongan Minimal" name="golonganMinimal" rules={[{ required: true, message: "Harap pilih golongan" }]}>
                    <Select placeholder="Pilih Golongan">
                        <Select.Option value="I/a">I/a</Select.Option>
                        <Select.Option value="I/b">I/b</Select.Option>
                        <Select.Option value="II/a">II/a</Select.Option>
                        <Select.Option value="II/b">II/b</Select.Option>
                        <Select.Option value="III/a">III/a</Select.Option>
                        <Select.Option value="III/b">III/b</Select.Option>
                        <Select.Option value="III/c">III/c</Select.Option>
                        <Select.Option value="III/d">III/d</Select.Option>
                        <Select.Option value="IV/a">IV/a</Select.Option>
                        <Select.Option value="IV/b">IV/b</Select.Option>
                        <Select.Option value="IV/c">IV/c</Select.Option>
                        <Select.Option value="IV/d">IV/d</Select.Option>
                        <Select.Option value="IV/e">IV/e</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Faktor Tanggung Jawab" name="faktorTanggungJawab" rules={[{ required: true, message: "Harap isi faktor tanggung jawab" }]}>
                    <InputNumber style={{ width: "100%" }} min={0} max={5} step={0.1} placeholder="Contoh: 2.5" />
                </Form.Item>
                <Form.Item label="Status Jabatan" name="statusJabatan" rules={[{ required: true, message: "Harap pilih status" }]}>
                    <Select placeholder="Pilih Status">
                        <Select.Option value="Aktif">Aktif</Select.Option>
                        <Select.Option value="Nonaktif">Nonaktif</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        );
    }

    return null;
};