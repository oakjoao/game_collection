"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faBars } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[57px] items-center gap-3 bg-[#171a21] px-3 border-b border-border">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="lg:hidden text-muted-foreground hover:text-foreground"
        aria-label="Toggle sidebar"
      >
        <FontAwesomeIcon icon={faBars} style={{ width: "20px", height: "20px" }} />
      </Button>

      {/* Navigation tabs */}
      <nav className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="border-primary/40 bg-primary/20 text-foreground hover:bg-primary/30"
        >
          Home
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          Collections
        </Button>
      </nav>

      {/* Search bar */}
      <div className="flex-1 max-w-[623px] ml-4 relative">
        <Input
          type="text"
          placeholder="Search..."
          className="h-[41px] bg-[#316282]/30 border-border text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/50"
        />
        <FontAwesomeIcon
          icon={faSearch}
          style={{ width: "16px", height: "16px" }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>

      {/* Filter button (placeholder for later) */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden sm:flex text-muted-foreground hover:text-foreground"
      >
        <FontAwesomeIcon icon={faFilter} style={{ width: "16px", height: "16px" }} />
      </Button>
    </header>
  );
}
