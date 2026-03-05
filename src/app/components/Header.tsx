"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faBars } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[57px] items-center gap-3 bg-[#171a21] px-3 border-b border-[#2a3a4a]">
      {/* Mobile hamburger */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded text-[#b8b6b4] hover:text-white hover:bg-[#2a3a4a] transition-colors"
        aria-label="Toggle sidebar"
      >
        <FontAwesomeIcon icon={faBars} style={{ width: "20px", height: "20px" }} />
      </button>

      {/* Navigation tabs */}
      <nav className="flex items-center gap-1">
        <button className="px-4 py-2 rounded text-sm font-medium text-white bg-[#67c1f5]/20 border border-[#67c1f5]/40 transition-colors">
          Home
        </button>
        <button className="px-4 py-2 rounded text-sm font-medium text-[#b8b6b4] hover:text-white hover:bg-[#2a3a4a] transition-colors">
          Collections
        </button>
      </nav>

      {/* Search bar */}
      <div className="flex-1 max-w-[623px] ml-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-[41px] rounded bg-[#316282]/30 border border-[#2a3a4a] px-4 pr-10 text-sm text-[#c7d5e0] placeholder-[#8f98a0] outline-none focus:border-[#67c1f5] transition-colors"
          />
          <FontAwesomeIcon
            icon={faSearch}
            style={{ width: "16px", height: "16px" }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f98a0]"
          />
        </div>
      </div>

      {/* Filter button (placeholder for later) */}
      <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded text-sm text-[#8f98a0] hover:text-white hover:bg-[#2a3a4a] transition-colors">
        <FontAwesomeIcon icon={faFilter} style={{ width: "16px", height: "16px" }} />
      </button>
    </header>
  );
}
