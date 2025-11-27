import React from "react";

export default function Home() {
  const ICONS: Record<string, React.ReactNode> = {
    archive: (
      <svg aria-hidden="true" className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M9 11h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    building: (
      <svg aria-hidden="true" className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7h1M8 11h1M8 15h1M12 7h1M12 11h1M12 15h1M16 7h1M16 11h1M16 15h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    shieldCheck: (
      <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l7 3v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.5 12.5l1.8 1.8 3.2-3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bolt: (
      <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h7l-1 8L21 10h-7l-1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    graphUp: (
      <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    eye: (
      <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </svg>
    ),
    hdd: (
      <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    personCheck: (
      <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 20c1.5-3 6-4 9-4s7.5 1 9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 9l2 2 4-4" transform="translate(-6)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    alert: (
      <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94A2 2 0 0 0 22.18 18L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
    ),
    cloudSync: (
      <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M20 16.58A5 5 0 0 0 18 7a6 6 0 0 0-11.32 1.13" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 16l2 2 2-2M8 8l-2-2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    money: (
      <svg aria-hidden="true" className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    folderCheck: (
      <svg aria-hidden="true" className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 15l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    chart: (
      <svg aria-hidden="true" className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 14v-4M12 18v-8M17 11v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    gear: (
      <svg aria-hidden="true" className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.95l.05.05a2 2 0 0 1-2.83 2.83l-.05-.05a1.8 1.8 0 0 0-1.95-.36 1.8 1.8 0 0 0-1 1.63V22a2 2 0 0 1-4 0v-.03a1.8 1.8 0 0 0-1-1.63 1.8 1.8 0 0 0-.36-1.95l-.05-.05A2 2 0 0 1 2.25 18.1l.05-.05a1.8 1.8 0 0 0 .36-1.95 1.8 1.8 0 0 0-1.63-1H2a2 2 0 0 1 0-4h.03a1.8 1.8 0 0 0 1.63-1 1.8 1.8 0 0 0-.36-1.95L3.25 4.4A2 2 0 0 1 6.08 1.57l.05.05a1.8 1.8 0 0 0 1.95.36h.03A1.8 1.8 0 0 0 10 2.5V2a2 2 0 0 1 4 0v.03c.34.08.66.25.95.48.32.25.68.46 1.06.62l.05.02a2 2 0 0 1 1.07 2.67l-.05.12a1.8 1.8 0 0 0 .36 1.95z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  };

  const benefits = [
    { title: 'Peningkatan Efisiensi', desc: 'Otomatisasi proses administratif mengurangi waktu pemrosesan', color: 'from-sky-500 to-sky-600', icon: 'graphUp' },
    { title: 'Transparansi Penuh', desc: 'Akses real-time ke semua data dan laporan', color: 'from-green-400 to-green-500', icon: 'eye' },
    { title: 'Manajemen Data Terpusat', desc: 'Semua informasi arsip dan tunjangan tersimpan aman', color: 'from-indigo-500 to-indigo-600', icon: 'hdd' },
    { title: 'Akses Kontrol Terukur', desc: 'Sistem permission yang fleksibel', color: 'from-yellow-300 to-yellow-400', icon: 'personCheck' },
    { title: 'Audit Trail Lengkap', desc: 'Pencatatan menyeluruh setiap aktivitas', color: 'from-red-500 to-red-600', icon: 'alert' },
    { title: 'Sinkronisasi Cloud', desc: 'Akses dari mana saja dengan sinkronisasi otomatis', color: 'from-gray-400 to-gray-500', icon: 'cloudSync' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-r from-sky-600 to-indigo-700 text-white py-24">
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-3 bg-white/10 px-3 py-1 rounded-full text-sm mb-4">
                  <span className="bg-white/20 p-2 rounded-md">{ICONS.archive}</span>
                  <span>Arsip Nasional Republik Indonesia (ANRI)</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-sm">
                  Tunjangan PAS
                </h1>

                <p className="mt-4 text-lg sm:text-xl text-sky-100 max-w-prose">
                  Aplikasi pengurusan tunjangan dan pengelolaan arsip statis untuk Arsip Nasional Republik Indonesia — efisien, transparan, dan terpercaya.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="px-6 py-3 bg-white text-sky-700 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition">
                    Mulai Sekarang
                  </button>
                  <button className="px-6 py-3 border border-white/30 text-white rounded-lg bg-white/5 hover:bg-white/10 transition">
                    Pelajari Lebih Lanjut
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-white/6 rounded-xl p-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      {ICONS.money}
                    </div>
                    <div className="text-sm text-sky-100">Perhitungan tunjangan otomatis</div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="rounded-3xl bg-white/6 backdrop-blur-md p-6 shadow-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-white/80">Dashboard Preview</div>
                      <div className="text-xs text-white/60">Live</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-white/5 to-white/8 rounded-lg p-3">
                        <div className="text-white/90 text-sm">Tunjangan Bulanan</div>
                        <div className="mt-2 text-2xl font-bold">Rp 3.450.000</div>
                      </div>
                      <div className="bg-gradient-to-br from-white/5 to-white/8 rounded-lg p-3">
                        <div className="text-white/90 text-sm">Arsip Terverifikasi</div>
                        <div className="mt-2 text-2xl font-bold">1.284</div>
                      </div>
                      <div className="col-span-2 bg-gradient-to-br from-white/5 to-white/8 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-white/90 text-sm">Kinerja Sistem</div>
                          <div className="text-xs text-white/60">Stabil</div>
                        </div>
                        <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: '78%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-white/5 blur-3xl" aria-hidden />
                  <div className="absolute -top-6 -right-8 w-24 h-24 rounded-full bg-white/3 blur-2xl" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="flex justify-center lg:justify-start">
                <div className="w-72 h-72 rounded-xl bg-gradient-to-br from-white to-slate-100 flex items-center justify-center shadow-lg">
                  <div className="text-sky-700">
                    {ICONS.building}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-3">Tentang Tunjangan PAS</h2>
                <p className="text-slate-600 mb-3 leading-relaxed">
                  Tunjangan PAS adalah platform terintegrasi yang dikembangkan khusus untuk Arsip Nasional Republik Indonesia (ANRI) guna memfasilitasi pengurusan tunjangan dan pengelolaan arsip statis secara digital.
                </p>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Antarmuka modern dan proses otomatis memastikan administrasi berjalan lancar, cepat, dan transparan.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-tr from-sky-100 to-sky-200 text-sky-700">
                        {ICONS.shieldCheck}
                      </span>
                      <div>
                        <h5 className="font-semibold">Aman & Terpercaya</h5>
                        <p className="text-sm text-slate-500">Enkripsi data dan kontrol akses terpusat</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-tr from-yellow-100 to-yellow-200 text-yellow-700">
                        {ICONS.bolt}
                      </span>
                      <div>
                        <h5 className="font-semibold">Cepat & Efisien</h5>
                        <p className="text-sm text-slate-500">Otomatisasi proses administratif</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="py-16 bg-slate-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold">Manfaat Utama</h2>
              <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Tingkatkan produktivitas dan transparansi pengelolaan tunjangan dan arsip dengan fitur yang dirancang khusus untuk ANRI.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <div key={b.title} className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-white bg-gradient-to-tr ${b.color} shrink-0`}>
                      {/* use icon by key */}
                      {ICONS[b.icon]}
                    </div>
                    <div>
                      <h5 className="font-semibold text-lg">{b.title}</h5>
                      <p className="text-sm text-slate-500 mt-1">{b.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold">Layanan Kami</h2>
              <p className="text-slate-500 mt-2">Fitur lengkap untuk mendukung operasional ANRI</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-2xl shadow-sm flex gap-4 hover:shadow-lg transition transform hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-sky-100 to-sky-200 text-sky-700 text-2xl">
                  {ICONS.money}
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Manajemen Tunjangan</h5>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                    <li>Pencatatan dan verifikasi tunjangan</li>
                    <li>Perhitungan otomatis potongan dan pajak</li>
                    <li>Laporan detail per pegawai</li>
                    <li>Integrasi sistem payroll</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm flex gap-4 hover:shadow-lg transition transform hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 text-2xl">
                  {ICONS.folderCheck}
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Pengelolaan Arsip Statis</h5>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                    <li>Katalogisasi arsip digital</li>
                    <li>Sistem pencarian canggih</li>
                    <li>Backup otomatis dan recovery</li>
                    <li>Kontrol versi dokumen</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm flex gap-4 hover:shadow-lg transition transform hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-green-100 to-green-200 text-green-600 text-2xl">
                  {ICONS.chart}
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Pelaporan & Analytics</h5>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                    <li>Dashboard real-time</li>
                    <li>Export laporan PDF/Excel</li>
                    <li>Analytics dan visualisasi data</li>
                    <li>Scheduled report otomatis</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm flex gap-4 hover:shadow-lg transition transform hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 text-2xl">
                  {ICONS.gear}
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Administrasi Sistem</h5>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                    <li>Manajemen user dan role</li>
                    <li>Konfigurasi sistem fleksibel</li>
                    <li>Log aktivitas lengkap</li>
                    <li>Backup dan maintenance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
