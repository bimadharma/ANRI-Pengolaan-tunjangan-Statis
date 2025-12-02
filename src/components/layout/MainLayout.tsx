import React from "react";
import Navbar from "../Navbar";

type Props = {
  children: React.ReactNode;
  isAdmin?: boolean;
};

export default function MainLayout({ children, isAdmin = false }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
       <main className="pt-20 md:pl-64">
        {children}
      </main>
    </div>
  );
}