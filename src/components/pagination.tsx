"use client"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onPrevious: () => void
  onNext: () => void
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onPrevious,
  onNext,
}: PaginationProps) {

  // --- LOGIKA PEMANGKASAN HALAMAN (ELLIPSIS) ---
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    
    // Jika total halaman sedikit (<= 7), tampilkan semua
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Jika halaman banyak, gunakan logika "..."
    // Selalu tampilkan halaman pertama
    pages.push(1);

    // Kasus 1: User ada di awal (halaman 1-4)
    if (currentPage <= 4) {
      pages.push(2, 3, 4, 5, "...", totalPages);
    } 
    // Kasus 2: User ada di akhir (halaman terakhir - 3)
    else if (currentPage >= totalPages - 3) {
      pages.push("...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } 
    // Kasus 3: User ada di tengah-tengah
    else {
      pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* BAGIAN KIRI: INFO TEXT */}
      <div className="text-sm text-gray-600 text-center md:text-left w-full md:w-auto">
        Menampilkan <span className="font-semibold text-gray-900">{startIndex + 1}</span> - <span className="font-semibold text-gray-900">{Math.min(endIndex, totalItems)}</span> dari <span className="font-semibold text-gray-900">{totalItems}</span> data
      </div>

      {/* BAGIAN KANAN: TOMBOL NAVIGASI */}
      <div className="flex items-center gap-2">
        
        {/* Tombol Previous */}
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className={`p-2.5 rounded-xl border border-gray-200 transition-all active:scale-95 ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent"
              : "bg-white text-gray-600 hover:bg-white hover:border-blue-300 hover:text-blue-600 shadow-sm"
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* List Angka (Disembunyikan di Mobile "hidden sm:flex") */}
        <div className="hidden sm:flex items-center gap-1.5">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-400">
                  <MoreHorizontal className="w-5 h-5" />
                </span>
              );
            }

            return (
              <button
                key={index}
                onClick={() => onPageChange(page as number)}
                className={`w-10 h-10 rounded-xl font-medium text-sm transition-all active:scale-95 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Tampilan Khusus Mobile (Pengganti angka) */}
        <div className="sm:hidden flex items-center px-4 font-medium text-sm text-gray-700 bg-white border border-gray-200 rounded-xl h-10 shadow-sm">
          {currentPage} / {totalPages}
        </div>

        {/* Tombol Next */}
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`p-2.5 rounded-xl border border-gray-200 transition-all active:scale-95 ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent"
              : "bg-white text-gray-600 hover:bg-white hover:border-blue-300 hover:text-blue-600 shadow-sm"
          }`}
          title="Next Page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}