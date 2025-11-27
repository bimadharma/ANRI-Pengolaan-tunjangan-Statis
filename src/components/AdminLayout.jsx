import { useState } from "react";
import Navbar from "./Navbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar setSidebarOpen={setSidebarOpen} />
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* main content */}
      <main className="md:ml-64 p-4">{children}</main>
    </>
  );
}
