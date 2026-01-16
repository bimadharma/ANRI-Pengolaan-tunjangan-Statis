import React, { useState } from "react";
import { Modal, Button, Upload, message, Space, Card, Typography, Divider, Alert } from "antd";
import { 
  UploadOutlined, 
  FilePdfOutlined, 
  DownloadOutlined, 
  CheckCircleOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { Title, Text, Paragraph } = Typography;

interface VerifikasiModalProps {
  open: boolean;
  onClose: () => void;
  record: {
    id: number;
    namaPegawai: string;
    nip: string;
    nomorSPM: string;
    nominal: number;
    tanggalProses: string;
  } | null;
}

export const VerifikasiModal: React.FC<VerifikasiModalProps> = ({ open, onClose, record }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const formatRupiah = (val: number) => 
    new Intl.NumberFormat("id-ID", { 
      style: "currency", 
      currency: "IDR", 
      minimumFractionDigits: 0 
    }).format(val);

  // Handle generate template SK
  const handleGenerateTemplate = () => {
    message.success("Template SK berhasil di-generate!");
    // Logic untuk generate template SK (misalnya download file template)
    const link = document.createElement('a');
    link.href = '#'; // Ganti dengan URL template
    link.download = `Template_SK_${record?.nip}.pdf`;
    // link.click();
  };

  // Handle upload SK
  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      // Validasi file PDF
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        message.error('Hanya file PDF yang diperbolehkan!');
        return false;
      }
      
      // Validasi ukuran file (maksimal 5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File harus lebih kecil dari 5MB!');
        return false;
      }

      setFileList([file]);
      return false; // Prevent auto upload
    },
    fileList,
    accept: '.pdf',
  };

  const handleUpload = () => {
    if (fileList.length === 0) {
      message.warning('Silakan pilih file SK terlebih dahulu!');
      return;
    }

    setUploading(true);
    
    // Simulasi upload
    setTimeout(() => {
      setUploading(false);
      message.success('SK berhasil di-upload!');
      setFileList([]);
      onClose();
    }, 2000);

    // Logic untuk upload file SK ke server
    // const formData = new FormData();
    // formData.append('file', fileList[0] as any);
    // formData.append('id', record?.id.toString() || '');
    // API call here...
  };

  const handleCancel = () => {
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 24 }} />
          <span style={{ fontSize: 18, fontWeight: 600 }}>Verifikasi Pembayaran</span>
        </Space>
      }
      open={open}
      onCancel={handleCancel}
      width={700}
      footer={null}
    >
      {record && (
        <>
          {/* Info Pegawai */}
          <Card 
            size="small" 
            style={{ 
              marginBottom: 24, 
              background: "#f0f9ff",
              border: "1px solid #bae0ff"
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size={2}>
              <Text strong style={{ fontSize: 16, color: "#00509d" }}>
                {record.namaPegawai}
              </Text>
              <Space split={<Divider type="vertical" />}>
                <Text type="secondary">NIP: {record.nip}</Text>
                <Text type="secondary">SPM: {record.nomorSPM}</Text>
              </Space>
              <Text strong style={{ fontSize: 18, color: "#059669" }}>
                {formatRupiah(record.nominal)}
              </Text>
            </Space>
          </Card>

          {/* Alert Info */}
          <Alert
            message="Informasi"
            description="Untuk pegawai yang berhasil dibayar, admin harus generate template SK dan melakukan upload SK yang sudah ditandatangani."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          {/* Section Generate Template */}
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>
              <DownloadOutlined style={{ marginRight: 8 }} />
              1. Generate Template SK
            </Title>
            <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 12 }}>
              Klik tombol di bawah untuk men-generate template SK berdasarkan data pegawai.
            </Paragraph>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              onClick={handleGenerateTemplate}
              style={{ 
                background: "#1890ff",
                borderRadius: 8,
                fontWeight: 500
              }}
            >
              Generate Template SK
            </Button>
          </div>

          <Divider />

          {/* Section Upload SK */}
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>
              <UploadOutlined style={{ marginRight: 8 }} />
              2. Upload SK yang Sudah Ditandatangani
            </Title>
            <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 12 }}>
              Setelah template SK ditandatangani, upload file PDF SK di sini.
            </Paragraph>
            
            <Upload {...uploadProps} maxCount={1}>
              <Button 
                icon={<FilePdfOutlined />} 
                size="large"
                style={{ borderRadius: 8 }}
              >
                Pilih File SK (PDF)
              </Button>
            </Upload>

            {fileList.length > 0 && (
              <Alert
                message={`File terpilih: ${fileList[0].name}`}
                type="success"
                showIcon
                style={{ marginTop: 12 }}
              />
            )}
          </div>

          <Divider />

          {/* Footer Buttons */}
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              size="large"
              style={{ borderRadius: 8 }}
            >
              Kembali
            </Button>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              loading={uploading}
              onClick={handleUpload}
              disabled={fileList.length === 0}
              size="large"
              style={{ 
                background: "#52c41a",
                borderColor: "#52c41a",
                borderRadius: 8,
                fontWeight: 500
              }}
            >
              {uploading ? 'Mengupload...' : 'Upload SK'}
            </Button>
          </Space>
        </>
      )}
    </Modal>
  );
};
