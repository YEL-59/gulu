import React from "react";
import { ArrowRight } from "lucide-react";

function PageButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm transition-colors ${
        active
          ? "bg-accent-500 text-white border-accent-500"
          : "bg-white text-gray-700 border-gray-300 hover:border-accent-500"
      }`}
    >
      {children}
    </button>
  );
}

export default function Pagination({ currentPage, totalPages, onPageChange, className = "" }) {
  if (totalPages <= 1) return null;

  const maxVisible = 6;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className={`flex items-center justify-center gap-4 ${className}`} aria-label="Pagination">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="text-accent-500 hover:text-accent-600 transition-colors"
        aria-label="Previous page"
      >
        <ArrowRight className="h-5 w-5 rotate-180" />
      </button>

      <div className="flex items-center gap-3">
        {pages.map((p) => (
          <PageButton key={p} active={p === currentPage} onClick={() => onPageChange(p)}>
            {String(p).padStart(2, "0")}
          </PageButton>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="text-accent-500 hover:text-accent-600 transition-colors"
        aria-label="Next page"
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </nav>
  );
}