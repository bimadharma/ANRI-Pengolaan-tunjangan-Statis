import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { HiBars3, HiBell, HiCog, HiUser, HiArrowRightOnRectangle } from "react-icons/hi2"; // Icon tambahan biar cantik
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  onSidebarClick?: () => void; 
  isAdminPage?: boolean;       // Menandakan ini layout Admin
  isUserPage?: boolean;        // Menandakan ini layout User Dashboard biasa
}

export default function Navbar({ onSidebarClick, isAdminPage = false, isUserPage = false }: NavbarProps) {
  const { user, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Ambil data notifikasi dummy
  useEffect(() => {
    let isMounted = true; 
    fetch("/data/notifications.json")
      .then((r) => r.json())
      .then((data: Array<{ read?: boolean }>) => {
        if (isMounted) setUnreadCount(data.filter((n) => !n.read).length);
      })
      .catch(() => {
        if (isMounted) setUnreadCount(0);
      });
      
    return () => { isMounted = false; };
  }, []);

  // Klik luar untuk tutup profile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white text-slate-800 border-b border-gray-200 h-16 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* LOGIC PERBAIKAN: Tombol Hamburger muncul jika ada function onSidebarClick DAN (di halaman admin atau user dashboard) */}
        {(isAdminPage || isUserPage) && onSidebarClick && (
          <button 
            onClick={onSidebarClick} 
            className="p-2 rounded-md hover:bg-gray-100 text-slate-600 md:hidden focus:outline-none transition-colors"
            aria-label="Toggle Sidebar"
          >
            <HiBars3 size={24} />
          </button>
        )}

        <Link to="/" className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          {/* Opsional: Ganti Text Berdasarkan Halaman */}
          {isAdminPage ? "Admin Panel" : "MyApp"}
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {user ? (
          <>
             {/* Icon Notifikasi */}
             <Link to="/notifications" className="relative p-2 rounded-full hover:bg-gray-100 text-slate-600 transition-colors">
               <HiBell className="w-6 h-6 text-slate-600 hover:text-blue-600" />
               {unreadCount > 0 && (
                 <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                   {unreadCount}
                 </span>
               )}
             </Link>

             {/* Profile Dropdown */}
             <div className="relative" ref={profileMenuRef}>
               <button 
                 onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                 className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 pr-3 transition-colors border border-transparent hover:border-gray-200"
               >
                 <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shadow-sm text-sm">
                    {/* Fallback jika user.name null */}
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                 </div>
                 <span className="hidden sm:block text-sm font-medium text-slate-700">
                    {user.name || "User"}
                 </span>
               </button>

               {/* Dropdown Content */}
               {profileMenuOpen && (
                 <div className="absolute right-0 mt-5 w-56 bg-white rounded-lg shadow-xl py-1 animate-in fade-in zoom-in duration-200 origin-top-right">
                   
                   <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                     <p className="text-sm font-medium text-gray-900">{user.name}</p>
                     <p className="text-xs text-gray-500 truncate">{user.email}</p>
                     {/* Badge Role */}
                     <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {isAdminPage ? 'Administrator' : 'Member'}
                     </span>
                   </div>

                   <div className="py-1">
                     <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileMenuOpen(false)}>
                        <HiUser className="w-4 h-4 text-gray-400" /> Dashboard Utama
                     </Link>

                     {/* LOGIC PERBAIKAN: Menu berbeda tergantung halaman admin/user */}
                     {isAdminPage ? (
                        <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileMenuOpen(false)}>
                          <HiCog className="w-4 h-4 text-gray-400" /> Admin Settings
                        </Link>
                     ) : (
                        <Link to="/user/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileMenuOpen(false)}>
                          <HiUser className="w-4 h-4 text-gray-400" /> My Profile
                        </Link>
                     )}
                   </div>

                   <div className="border-t border-gray-100 py-1">
                     <button
                       onClick={() => { logout(); setProfileMenuOpen(false); }}
                       className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                     >
                       <HiArrowRightOnRectangle className="w-4 h-4" /> Sign out
                     </button>
                   </div>
                 </div>
               )}
             </div>
          </>
        ) : (
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}