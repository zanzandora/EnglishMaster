import React from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const getPageNumbers = (totalPages: number, currentPage: number) => {
  // If total pages <= 5, show all pages
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If current page is among first 3 pages
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }

  // If current page is among last 3 pages
  if (currentPage >= totalPages - 2) {
    return [
      1,
      '...',
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // If current page is in the middle
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const pageNumbers = getPageNumbers(totalPages, currentPage);

  return (
    <div className='p-4 flex items-center justify-between text-gray-500'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Prev
      </button>

      {/* Desktop: Dải trang */}
      <div className='hidden sm:flex items-center gap-2 text-sm mx-2'>
        {pageNumbers.map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className='px-2'>
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`px-2 rounded-sm ${
                page === currentPage ? 'bg-blue-500 text-white' : ''
              }`}
              onClick={() => onPageChange(Number(page))}
              disabled={page === currentPage}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Mobile: Chỉ số trang */}
      <span className='block sm:hidden text-base font-medium min-w-[60px] text-center mx-2'>
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
