import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// GANTI: Gunakan hook dari Refine, bukan useAuth lama
import { useLogout, useMenu } from "@refinedev/core"; 

// Sesuaikan path import Navbar (turun satu folder dari components/layout)
import Navbar from "../Navbar"; 

import { HiOutlineHome, HiOutlineDocumentText, HiOutlineClipboardList, HiOutlineCreditCard, HiOutlineDocumentReport, HiOutlineClock, HiOutlineCog, HiX } from "react-icons/hi";

interface AdminLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean; 
}

export default function AdminLayout({ children, isAdmin = false }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // --- LOGIC BARU REFINE ---
  useLogout(); // Hook logout bawaan Refine
  const location = useLocation();

  // Menu statis (bisa juga menggunakan hook useMenu() dari Refine jika mendefinisikan resources di App.tsx)
  const navItems = [
    { label: "Home", to: "/admin", icon: <HiOutlineHome /> },
    { label: "Ketentuan", to: "/admin/Ketentuan", icon: <HiOutlineDocumentText /> },
    { label: "Data Tupas", to: "/admin/DataTupas", icon: <HiOutlineClipboardList /> },
    { label: "Data Pembayaran", to: "/admin/DataPembayaran", icon: <HiOutlineCreditCard /> },
    { label: "Log Pembayaran", to: "/admin/LogPembayaran", icon: <HiOutlineDocumentReport /> },
    { label: "Riwayat Tupas", to: "/admin/RiwayatTupas", icon: <HiOutlineClock /> },
    { label: "Settings", to: "/admin/settings", icon: <HiOutlineCog /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Navbar */}
      <Navbar onSidebarClick={() => setSidebarOpen(true)} isAdminPage={isAdmin} />

      {/* 2. Sidebar Section */}
      {isAdmin && (
        <>
          {/* Mobile Overlay */}
          <div
            className={`fixed inset-0 bg-gray-900/50 z-30 transition-opacity duration-200 md:hidden ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar Panel */}
          <aside
            className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out 
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0 md:top-16 md:h-[calc(100vh-4rem)] md:z-30`}
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header (Mobile Only) */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
                <span className="font-bold text-lg text-slate-800">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-100 text-slate-600">
                  <HiX size={24} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-gray-100 hover:text-slate-900"}`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer Sidebar */}
              <div className="p-4 border-t border-gray-200">

                <div className="bg-gray-50 rounded p-3 text-center">
                  <p className="text-xs text-gray-500">App Version 1.0</p>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* 3. Main Content Wrapper */}
      {/* padding top 16 (4rem) agar tidak tertutup navbar */}
      <main className={`flex-1 transition-all duration-300 pt-16 ${isAdmin ? "md:ml-64" : ""}`}>
        <div className="">
            {children}
        </div>
      </main>
    </div>
  );
}