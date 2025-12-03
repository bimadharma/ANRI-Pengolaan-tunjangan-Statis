import React from 'react';
import {
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Download,
  ChevronRight,
  Award,
  FileCheck,
} from 'lucide-react';

// Helper
const formatCurrency = (v: number | string) =>
  typeof v === 'number'
    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v)
    : v;

// Types
type StatCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
};

type HistoryItemProps = {
  date: string;
  title: string;
  amount: string | number;
  status: 'approved' | 'pending' | 'rejected';
};

// Reusable components
const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
  const colorClasses: Record<NonNullable<StatCardProps['color']>, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {typeof value === 'number' ? formatCurrency(value) : value}
          </h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const HistoryItem: React.FC<HistoryItemProps> = ({ date, title, amount, status }) => {
  const statusConfig: Record<HistoryItemProps['status'], { color: string; bg: string; icon: React.ComponentType<{ className?: string }>; text: string }> = {
    approved: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle, text: 'Disetujui' },
    pending: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock, text: 'Proses' },
    rejected: { color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle, text: 'Ditolak' },
  };

  const { color, bg, icon: StatusIcon, text } = statusConfig[status];

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className={`p-2 rounded-lg ${bg}`}>
          <StatusIcon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">{typeof amount === 'number' ? formatCurrency(amount) : amount}</p>
        <p className={`text-xs ${color}`}>{text}</p>
      </div>
    </div>
  );
};

const DashboardPAS: React.FC = () => {
  // Data dummy
  const userData = {
    name: 'Dr. Budi Santoso, S.S., M.Hum',
    nip: '196505121990031001',
    position: 'Arsiparis Ahli Madya',
    unit: 'Direktorat Pengolahan Arsip Statis',
  };

  const stats = {
    totalTunjangan: 'Rp 4.850.000',
    bulanIni: 'Rp 4.850.000',
    dokumenDiproses: 127,
    pengajuanAktif: 1,
  };

  const riwayat: HistoryItemProps[] = [
    { date: 'November 2024', title: 'Tunjangan PAS Bulan November', amount: 'Rp 4.850.000', status: 'approved' },
    { date: 'Oktober 2024', title: 'Tunjangan PAS Bulan Oktober', amount: 'Rp 4.850.000', status: 'approved' },
    { date: 'September 2024', title: 'Tunjangan PAS Bulan September', amount: 'Rp 4.650.000', status: 'approved' },
    { date: 'Agustus 2024', title: 'Tunjangan PAS Bulan Agustus', amount: 'Rp 4.650.000', status: 'approved' },
  ];

  const komponenTunjangan = [
    { name: 'Tunjangan Kinerja Arsiparis', amount: 'Rp 3.500.000' },
    { name: 'Tunjangan Struktural', amount: 'Rp 850.000' },
    { name: 'Tunjangan Fungsional', amount: 'Rp 500.000' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                <p className="text-gray-600">NIP: {userData.nip}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">{userData.position}</span>
                  <span className="text-sm text-gray-600">{userData.unit}</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Unduh Slip
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={DollarSign} title="Total Tunjangan" value={stats.totalTunjangan} subtitle="Tahun 2024" color="blue" />
          <StatCard icon={TrendingUp} title="Bulan Ini" value={stats.bulanIni} subtitle="Desember 2024" color="green" />
          <StatCard icon={FileText} title="Dokumen Diproses" value={stats.dokumenDiproses} subtitle="Tahun ini" color="purple" />
          <StatCard icon={Clock} title="Pengajuan Aktif" value={stats.pengajuanAktif} subtitle="Sedang diproses" color="orange" />
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Riwayat Tunjangan */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Riwayat Tunjangan
              </h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                Lihat Semua
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {riwayat.map((item, index) => (
                <HistoryItem key={index} {...item} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Komponen Tunjangan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Komponen Tunjangan
              </h2>
              <div className="space-y-3">
                {komponenTunjangan.map((item, index) => (
                  <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="font-semibold text-gray-900">{item.amount}</span>
                  </div>
                ))}
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-blue-600 text-lg">{stats.bulanIni}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Aksi Cepat
              </h2>
              <div className="space-y-3">
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg p-3 text-left transition-all">
                  <p className="font-medium">Ajukan Tunjangan</p>
                  <p className="text-xs text-blue-100">Submit pengajuan baru</p>
                </button>
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg p-3 text-left transition-all">
                  <p className="font-medium">Verifikasi Dokumen</p>
                  <p className="text-xs text-blue-100">Cek status dokumen</p>
                </button>
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg p-3 text-left transition-all">
                  <p className="font-medium">Laporan Kinerja</p>
                  <p className="text-xs text-blue-100">Lihat laporan bulan ini</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPAS;