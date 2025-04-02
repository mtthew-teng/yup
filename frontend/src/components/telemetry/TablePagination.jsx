import React, { useState, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// Create a PaginationButton component
const PaginationButton = ({ children, onClick, disabled, isLeft }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center ${isLeft ? 'rounded-l-md' : 'rounded-r-md'} px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-offset-0 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

const TablePagination = ({ page, totalPages, total, dataLength, setPage }) => {
  const [jumpInput, setJumpInput] = useState(page.toString());

  useEffect(() => {
    if (jumpInput !== page.toString()) {
      setJumpInput(page.toString());
    }
  }, [page]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleJump = (value) => {
    setJumpInput(value);
  
    if (value.trim() === "") {
      setPage(1);
      return;
    }
  
    const num = parseInt(value);
    if (!isNaN(num)) {
      if (num < 1) {
        setPage(1);
      } else if (num > totalPages) {
        setPage(totalPages);
      } else {
        setPage(num);
      }
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      {/* Mobile pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={page === 1}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={page === totalPages}
          className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{dataLength > 0 ? (page - 1) * 20 + 1 : 0}</span> to{" "}
          <span className="font-medium">{Math.min(page * 20, total)}</span> of{" "}
          <span className="font-medium">{total}</span> results
        </p>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
          <PaginationButton 
            onClick={handlePrevious} 
            disabled={page === 1}
            isLeft={true}
          >
            <span className="sr-only">Previous</span>
            <IoChevronBack />
          </PaginationButton>
          
          <span
            aria-current="page"
            className="z-10 inline-flex items-center bg-indigo-600 px-2 py-2 text-sm font-semibold text-white focus:outline-offset-0"
          >
            <input
              type="number"
              value={jumpInput}
              onChange={(e) => handleJump(e.target.value)}
              onBlur={() => setJumpInput(page.toString())}
              min={1}
              max={totalPages}
              className="w-8 text-center bg-indigo-600 text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </span>

          <PaginationButton 
            onClick={handleNext} 
            disabled={page === totalPages}
            isLeft={false}
          >
            <span className="sr-only">Next</span>
            <IoChevronForward />
          </PaginationButton>
        </nav>
      </div>
    </div>
  );
};

export default TablePagination;