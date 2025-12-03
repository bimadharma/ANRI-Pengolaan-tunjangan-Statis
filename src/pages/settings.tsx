import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Mail,
  Key,
  Save,
  Edit2,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

export default function SettingsMenu() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    bio: 'Software Developer | Tech Enthusiast'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Simpan data ke backend
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Pengaturan Akun
              </h1>
              <p className="text-gray-600 text-sm mt-1">Kelola informasi profil Anda</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 transform hover:scale-[1.01] transition-transform duration-300">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-indigo-600 shadow-xl flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end mb-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profil
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-5 h-5" />
                    Simpan
                  </button>
                </div>
              )}
            </div>

            {/* Profile Fields */}
            <div className="space-y-6">
              {/* Name */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isEditing
                      ? 'border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  } outline-none text-gray-800 font-medium`}
                />
              </div>

              {/* Email */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isEditing
                      ? 'border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-white'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  } outline-none text-gray-800 font-medium`}
                />
              </div>

              {/* Phone */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 text-purple-500" />
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isEditing
                      ? 'border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  } outline-none text-gray-800 font-medium`}
                />
              </div>

              {/* Location */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-pink-500" />
                  Lokasi
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isEditing
                      ? 'border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 bg-white'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  } outline-none text-gray-800 font-medium`}
                />
              </div>

              {/* Bio */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Edit2 className="w-4 h-4 text-teal-500" />
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all resize-none ${
                    isEditing
                      ? 'border-teal-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 bg-white'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  } outline-none text-gray-800 font-medium`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}