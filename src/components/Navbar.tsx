import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { HiBars3, HiEllipsisVertical } from "react-icons/hi2";
import { useState, useRef, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isAdminPage = location.pathname.startsWith("/admin");

  // Tutup menu profile saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 w-full bg-white text-slate-800 p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Tombol buka sidebar di mobile */}
          {isAdminPage && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded hover:bg-gray-100 transition-colors md:hidden"
              aria-label="Open sidebar"
            >
              <HiBars3 size={24} />
            </button>
          )}

          <div className="font-bold text-xl text-slate-800">
            {!isAdminPage ? (
              <Link to="/">MyApp</Link>
            ) : (
              <Link to="/admin" className="hidden md:inline">
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {!user && (
            <Link
              to="/login"
              className="text-slate-600 hover:text-slate-800"
            >
              Login
            </Link>
          )}

          {user && (
            <div className="relative" ref={profileMenuRef}>
              {/* Profile Icon Button */}
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Profile menu"
                aria-expanded={profileMenuOpen}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm text-slate-700">
                  {user.name}
                </span>
                
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in duration-200 border border-gray-200">
                  {/* User Info */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm font-semibold text-slate-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition-colors text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar untuk admin: desktop selalu tampil, mobile buka/tutup */}
      {isAdminPage && (
        <AdminSidebar
          externalOpen={sidebarOpen}
          setExternalOpen={setSidebarOpen}
        />
      )}
    </>
  );
}
