import React, { useState } from 'react';
import { 
  Eye, 
  FileEdit, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import AlertNotification, { type Toast } from "../../components/AlertNotification"
import GenericModal, { type ModalField } from "../../components/ModalPop"

// Mock data
const mockTupasData = {
  id: 1,
  pegawaiNama: "Ahmad Budiman",
  nip: "198501012010011001",
  jabatan: "Kepala Seksi Perencanaan",
  golongan: "III/c",
  nilaiTupas: 5500000,
  nilaiSebelumnya: 5200000,
  selisih: 300000,
  status: "Disetujui",
  tanggalPerhitungan: "2024-12-01",
  keterangan: "Penyesuaian berdasarkan kinerja Q4 2024",
  riwayatRevisi: [
    {
      id: 1,
      periode: "November 2024",
      nilaiTupas: 5500000,
      selisih: 300000,
      status: "Disetujui",
      tanggalPengajuan: "2024-11-15",
      alasan: "Kenaikan berkala"
    },
    {
      id: 2,
      periode: "Oktober 2024",
      nilaiTupas: 5200000,
      selisih: 0,
      status: "Disetujui",
      tanggalPengajuan: "2024-10-01",
      alasan: "-"
    },
    {
      id: 3,
      periode: "September 2024",
      nilaiTupas: 5000000,
      selisih: -200000,
      status: "Pending",
      tanggalPengajuan: "2024-09-10",
      alasan: "Penyesuaian data kepegawaian"
    }
  ]
};

const TupasUserPage = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add' as 'view' | 'add' | 'edit',
    data: null as any
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [data] = useState(mockTupasData);

  const addToast = (type: Toast['type'], message?: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    
    if (type !== 'loading') {
      setTimeout(() => removeToast(id), 3000);
    }
    
    return id;
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'Disetujui':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Disetujui
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const revisionFields: ModalField[] = [
    {
      name: 'alasan',
      label: 'Alasan Pengajuan Revisi',
      type: 'textarea',
      placeholder: 'Jelaskan alasan pengajuan revisi data TUPAS Anda...',
      required: true
    }
  ];

  const detailFields: ModalField[] = [
    {
      name: 'periode',
      label: 'Periode',
      type: 'text',
      readOnly: true
    },
    {
      name: 'nilaiTupas',
      label: 'Nilai TUPAS',
      type: 'text',
      readOnly: true
    },
    {
      name: 'selisih',
      label: 'Selisih',
      type: 'text',
      readOnly: true
    },
    {
      name: 'status',
      label: 'Status',
      type: 'text',
      readOnly: true
    },
    {
      name: 'tanggalPengajuan',
      label: 'Tanggal Pengajuan',
      type: 'text',
      readOnly: true
    },
    {
      name: 'alasan',
      label: 'Alasan/Keterangan',
      type: 'textarea',
      readOnly: true
    }
  ];

  const handleOpenRevisionModal = () => {
    setModalState({
      isOpen: true,
      mode: 'add',
      data: {}
    });
  };

  const handleViewDetail = (item: any) => {
    const formattedData = {
      ...item,
      nilaiTupas: formatRupiah(item.nilaiTupas),
      selisih: `${item.selisih >= 0 ? '+' : ''}${formatRupiah(item.selisih)}`
    };
    
    setModalState({
      isOpen: true,
      mode: 'view',
      data: formattedData
    });
  };

  const handleSubmitRevision = (_formData: any) => {
    const loadingId = addToast('loading', 'Mengirim pengajuan revisi...');
    
    setTimeout(() => {
      removeToast(loadingId);
      addToast('success', 'Pengajuan revisi berhasil dikirim!');
      setModalState({ isOpen: false, mode: 'add', data: null });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <AlertNotification toasts={toasts} removeToast={removeToast} />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data TUPAS (Saya)</h1>
          <p className="text-gray-600">Tunjangan Pengolahan Pegawai - Informasi dan Status</p>
        </div>

        {/* Informasi Pegawai */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            Informasi Pegawai
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nama Pegawai</label>
              <p className="text-gray-900 font-medium">{data.pegawaiNama}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">NIP</label>
              <p className="text-gray-900 font-medium">{data.nip}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Jabatan</label>
              <p className="text-gray-900 font-medium">{data.jabatan}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Golongan</label>
              <p className="text-gray-900 font-medium">{data.golongan}</p>
            </div>
          </div>
        </div>

        {/* Nilai TUPAS Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Nilai TUPAS Saat Ini */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              {getStatusBadge(data.status)}
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Nilai TUPAS Saat Ini</h3>
            <p className="text-2xl font-bold text-gray-900">{formatRupiah(data.nilaiTupas)}</p>
            <p className="text-xs text-gray-500 mt-2">Per {data.tanggalPerhitungan}</p>
          </div>

          {/* Nilai Sebelumnya */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Nilai Sebelumnya</h3>
            <p className="text-2xl font-bold text-gray-900">{formatRupiah(data.nilaiSebelumnya)}</p>
          </div>

          {/* Selisih */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${data.selisih >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <TrendingUp className={`w-6 h-6 ${data.selisih >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Selisih Perhitungan</h3>
            <p className={`text-2xl font-bold ${data.selisih >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.selisih >= 0 ? '+' : ''}{formatRupiah(data.selisih)}
            </p>
          </div>
        </div>

        {/* Detail dan Keterangan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Keterangan
          </h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-gray-700">{data.keterangan}</p>
          </div>
        </div>

        {/* Tabel Riwayat TUPAS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Riwayat TUPAS</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Periode</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nilai TUPAS</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Selisih</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.riwayatRevisi.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900">{item.periode}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {formatRupiah(item.nilaiTupas)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`font-medium ${item.selisih >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.selisih >= 0 ? '+' : ''}{formatRupiah(item.selisih)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <button
                        onClick={() => handleViewDetail(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tombol Ajukan Revisi */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Perlu Revisi Data?</h3>
              <p className="text-sm text-gray-600">Ajukan perubahan data TUPAS jika ada ketidaksesuaian</p>
            </div>
            <button
              onClick={handleOpenRevisionModal}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FileEdit className="w-5 h-5" />
              Ajukan Revisi
            </button>
          </div>
        </div>
      </div>

      {/* Modal Ajukan Revisi */}
      <GenericModal
        isOpen={modalState.isOpen && modalState.mode === 'add'}
        mode="add"
        title={{
          add: "Ajukan Revisi Data TUPAS"
        }}
        fields={revisionFields}
        data={modalState.data}
        onClose={() => setModalState({ isOpen: false, mode: 'add', data: null })}
        onSubmit={handleSubmitRevision}
      />

      {/* Modal Detail */}
      <GenericModal
        isOpen={modalState.isOpen && modalState.mode === 'view'}
        mode="view"
        title={{
          view: "Detail Riwayat TUPAS"
        }}
        fields={detailFields}
        data={modalState.data}
        onClose={() => setModalState({ isOpen: false, mode: 'view', data: null })}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default TupasUserPage;