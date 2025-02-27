import { useState } from "react";

const usePagination = <T,>(data: T[], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Lọc dữ liệu hiển thị theo trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return {
    currentData,
    currentPage,
    totalPages,
    setCurrentPage,
  };
};

export default usePagination;
