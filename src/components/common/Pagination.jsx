import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

// ─── Utility ────────────────────────────────────────────────────────────────

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Generate page numbers array with ellipsis markers ("...")
 * e.g. [1, "...", 4, 5, 6, "...", 20]
 */
function getPageRange(current, total, siblings = 1) {
  const totalPageNumbers = siblings * 2 + 5; // first + last + current + 2*siblings + 2*ellipsis

  if (total <= totalPageNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 2;

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from(
      { length: 3 + 2 * siblings },
      (_, i) => i + 1
    );
    return [...leftRange, "...", total];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: 3 + 2 * siblings },
      (_, i) => total - (3 + 2 * siblings) + i + 1
    );
    return [1, "...", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i
  );
  return [1, "...", ...middleRange, "...", total];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PageButton({ page, isActive, onClick, disabled, children }) {
  return (
    <button
      onClick={() => !disabled && onClick(page)}
      disabled={disabled}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative inline-flex items-center justify-center min-w-[36px] h-9 px-2 text-sm font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500",
        isActive
          ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
          : disabled
          ? "text-gray-300 border-gray-100 cursor-not-allowed bg-white"
          : "text-gray-600 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 cursor-pointer"
      )}
    >
      {children ?? page}
    </button>
  );
}

function NavButton({ onClick, disabled, icon: Icon, label, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500",
        disabled
          ? "text-gray-300 border-gray-100 cursor-not-allowed bg-white"
          : "text-gray-600 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 cursor-pointer"
      )}
    >
      <Icon size={15} />
    </button>
  );
}

// ─── Main Pagination Component ───────────────────────────────────────────────

/*
 * @param {object}   props
 * @param {number}   props.currentPage      - Current active page (1-indexed)
 * @param {number}   props.totalItems       - Total number of records
 * @param {number}   [props.pageSize=10]    - Items per page
 * @param {number[]} [props.pageSizeOptions]- Dropdown options for page size
 * @param {function} props.onPageChange     - (page: number) => void
 * @param {function} [props.onPageSizeChange] - (size: number) => void
 * @param {boolean}  [props.showPageSize]   - Show per-page selector
 * @param {boolean}  [props.showInfo]       - Show "Showing X–Y of Z" text
 * @param {boolean}  [props.showFirstLast]  - Show first/last jump buttons
 * @param {boolean}  [props.showJumpTo]     - Show "Go to page" input
 * @param {number}   [props.siblingCount=1] - Pages shown around current
 * @param {string}   [props.className]      - Extra wrapper classes
 * @param {string}   [props.size]           - "sm" | "md" (default "md")
 */
export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  showPageSize = true,
  showInfo = true,
  showFirstLast = true,
  showJumpTo = false,
  siblingCount = 1,
  className = "",
  size = "md",
}) {
  const [jumpValue, setJumpValue] = useState("");

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pages = getPageRange(currentPage, totalPages, siblingCount);

  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  const goTo = (page) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    if (clamped !== currentPage) onPageChange?.(clamped);
  };

  const handleJump = (e) => {
    if (e.key === "Enter") {
      const parsed = parseInt(jumpValue, 10);
      if (!isNaN(parsed)) goTo(parsed);
      setJumpValue("");
    }
  };

  if (totalItems === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 py-3 px-1",
        size === "sm" ? "text-xs" : "text-sm",
        className
      )}
    >
      {/* Left – info + page size */}
      <div className="flex items-center gap-4">
        {showInfo && (
          <p className="text-gray-500 whitespace-nowrap">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {from}–{to}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">{totalItems}</span>
          </p>
        )}

        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 whitespace-nowrap">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 pr-7 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors hover:border-gray-300"
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right – navigation */}
      <div className="flex items-center gap-1.5">
        {/* First */}
        {showFirstLast && (
          <NavButton
            onClick={() => goTo(1)}
            disabled={currentPage === 1}
            icon={ChevronsLeft}
            label="First page"
            title="First page"
          />
        )}

        {/* Prev */}
        <NavButton
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          icon={ChevronLeft}
          label="Previous page"
          title="Previous page"
        />

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`dots-${i}`}
              className="inline-flex items-center justify-center w-9 h-9 text-gray-400"
            >
              <MoreHorizontal size={15} />
            </span>
          ) : (
            <PageButton
              key={p}
              page={p}
              isActive={p === currentPage}
              onClick={goTo}
            />
          )
        )}

        {/* Next */}
        <NavButton
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={ChevronRight}
          label="Next page"
          title="Next page"
        />

        {/* Last */}
        {showFirstLast && (
          <NavButton
            onClick={() => goTo(totalPages)}
            disabled={currentPage === totalPages}
            icon={ChevronsRight}
            label="Last page"
            title="Last page"
          />
        )}

        {/* Jump to page */}
        {showJumpTo && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-gray-500 whitespace-nowrap">Go to</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={handleJump}
              placeholder="—"
              className="w-14 h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-center text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}


/* 

const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [total, setTotal] = useState(0);

<Pagination
  currentPage={page}
  totalItems={total}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
  showJumpTo
/>

*/