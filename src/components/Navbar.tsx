import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { HiBars3, HiBell } from "react-icons/hi2";
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  onSidebarClick: () => void; // Function untuk buka sidebar layout
  isAdminPage: boolean;       // Untuk memunculkan tombol hamburger
}

export default function Navbar({ onSidebarClick, isAdminPage }: NavbarProps) {
  const { user, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Ambil data notifikasi dummy
  useEffect(() => {
    fetch("/data/notifications.json")
      .then((r) => r.json())
      .then((data: Array<{ read?: boolean }>) => {
        setUnreadCount(data.filter((n) => !n.read).length);
      })
      .catch(() => setUnreadCount(0));
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
        {/* Tombol Hamburger: Hanya muncul jika isAdminPage & di layar Mobile */}
        {isAdminPage && (
          <button 
            onClick={onSidebarClick} 
            className="p-2 rounded-md hover:bg-gray-100 text-slate-600 md:hidden focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <HiBars3 size={24} />
          </button>
        )}

        <Link to="/" className="text-xl font-bold text-slate-800 tracking-tight">
          MyApp
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifikasi & Login Logic sama seperti sebelumnya */}
        {user ? (
          <>
             <Link to="/notifications" className="relative p-2 rounded hover:bg-gray-100 text-slate-600">
               <HiBell className="w-6 h-6 text-yellow-500" />
               {unreadCount > 0 && (
                 <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                   {unreadCount}
                 </span>
               )}
             </Link>

             <div className="relative" ref={profileMenuRef}>
               <button 
                 onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                 className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 pr-3 transition-colors"
               >
                 <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
                    {user.name?.charAt(0).toUpperCase()}
                 </div>
                 <span className="hidden sm:block text-sm font-medium text-slate-700">{user.name}</span>
               </button>

               {/* Dropdown Profile */}
               {profileMenuOpen && (
                 <div className="absolute right-0 mt-5 w-48 bg-white rounded-lg shadow-lg py-1 animate-in fade-in zoom-in duration-200">
                   <div className="px-4 py-3 border-b border-gray-100">
                     <p className="text-sm font-medium text-gray-900">{user.name}</p>
                     <p className="text-xs text-gray-500 truncate">{user.email}</p>
                   </div>
                   <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileMenuOpen(false)}>Dashboard</Link>
                   <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileMenuOpen(false)}>Settings</Link>
                   <button
                     onClick={() => { logout(); setProfileMenuOpen(false); }}
                     className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                   >
                     Sign out
                   </button>
                 </div>
               )}
             </div>
          </>
        ) : (
          <Link to="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}