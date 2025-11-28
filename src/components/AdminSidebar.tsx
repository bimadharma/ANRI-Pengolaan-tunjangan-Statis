import { useAuth } from "../hooks/useAuth";
import { useNavigate, NavLink, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineClipboardList,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
  HiOutlineIdentification,
  HiX,
} from "react-icons/hi";


interface AdminSidebarProps {
  externalOpen?: boolean;
  setExternalOpen?: (value: boolean) => void;
}

export default function AdminSidebar({
  externalOpen,
  setExternalOpen,
}: AdminSidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  // sinkronisasi saat dibuka dari navbar
  useEffect(() => {
    if (externalOpen !== undefined) {
      setOpen(externalOpen);
    }
  }, [externalOpen]);

  const closeSidebar = () => {
    setOpen(false);
    setExternalOpen?.(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
  { label: "Home", to: "/admin", icon: <HiOutlineHome /> },
  { label: "Users", to: "/admin/users", icon: <HiOutlineUsers /> },
  { label: "Menu Master Data", to: "/admin/MenuMasterData", icon: <HiOutlineClipboardList /> },
  { label: "Jabatan Master", to: "/admin/jabatan", icon: <HiOutlineBriefcase /> },
  { label: "Unit Kerja Master", to: "/admin/UnitKerja", icon: <HiOutlineOfficeBuilding /> },
  { label: "Daftar Pegawai", to: "/admin/DaftarPegawai", icon: <HiOutlineIdentification /> },
  { label: "Settings", to: "/admin/settings", icon: <HiOutlineCog /> },
];


  return (
    <>
      {/* Overlay untuk mobile */}
      <div
        className={`fixed inset-0 bg-white z-30 transition-opacity duration-200 md:hidden ${
          externalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => (setExternalOpen ? setExternalOpen(false) : undefined)}
        aria-hidden={!externalOpen}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white text-slate:800 z-40 md:z-30 transform transition-transform duration-300 
          md:translate-x-0
          ${externalOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={false}
      >
        <div className="flex items-center justify-between p-4 border-slate-700 pt-13">
          <Link to="/admin" className="font-bold text-lg">
            MyApp
          </Link>

          {/* Close button only visible on mobile */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-1000"
            onClick={() =>
              setExternalOpen ? setExternalOpen(false) : undefined
            }
            aria-label="Close sidebar"
          >
            <HiX size={20} />
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {navItems.map((it) => {
            const active = location.pathname === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 ${
                  active ? "bg-gray-200" : ""
                }`}
                onClick={() =>
                  setExternalOpen ? setExternalOpen(false) : undefined
                }
              >
                <span className="text-lg">{it.icon}</span>
                <span className="text-sm">{it.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 border-slate-700">
          <small className="text-slate-400">v1.0</small>
        </div>
      </aside>
    </>
  );
}
