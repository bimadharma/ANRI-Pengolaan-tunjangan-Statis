import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// GANTI: Gunakan hook dari Refine
import { useLogout } from "@refinedev/core"; 

import Navbar from "../Navbar"; 


import { HiOutlineHome, HiX } from "react-icons/hi";
import { HiArrowRightOnRectangle } from "react-icons/hi2";


interface UserLayoutProps {
  children: React.ReactNode;
  isUser?: boolean; 
}

export default function UserLayout({ children, isUser = false }: UserLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // --- LOGIC BARU REFINE ---
  const { mutate: logout } = useLogout();
  const location = useLocation();

  // Menu User
  const navItems = [
    { label: "Dashboard", to: "/user", icon: <HiOutlineHome /> },
    // Anda bisa menambahkan menu lain di sini, misal: Profile
    // { label: "My Profile", to: "/user/profile", icon: <HiOutlineUser /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Navbar */}
      <Navbar onSidebarClick={() => setSidebarOpen(true)} isUserPage={isUser} />

      {/* 2. Sidebar Section (Hanya render jika isUser = true) */}
      {isUser && (
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
      {/* pt-16 (4rem) menyesuaikan tinggi navbar. ml-64 menyesuaikan lebar sidebar */}
      <main className={`flex-1 transition-all duration-300 pt-16 ${isUser ? "md:ml-64" : ""}`}>
        <div className="p-6">
            {children}
        </div>
      </main>
    </div>
  );
}