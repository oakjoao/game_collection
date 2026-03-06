"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faBars, faTimes, faFileExport } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CONSOLE_NAMES = [
  "Switch",
  "Switch 2",
  "3DS",
  "DS",
  "PS Vita",
  "PS5",
  "Wii",
];

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedConsoles: string[];
  onToggleConsole: (console: string) => void;
  onClearConsoles: () => void;
  onExportCsv: () => void;
}

export default function Header({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  selectedConsoles,
  onToggleConsole,
  onClearConsoles,
  onExportCsv,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#171a21] border-b border-border">
      <div className="flex h-[57px] items-center">
        {/* Left section — matches sidebar width */}
        <div className="flex items-center gap-1 px-3 lg:w-[300px] lg:flex-shrink-0 lg:border-r lg:border-border">
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
        </div>

        {/* Right section — matches main content area padding */}
        <div className="flex items-center gap-3 flex-1 px-4 sm:px-6">
          <div className="flex-1 max-w-[623px] relative">
            <Input
              type="text"
              placeholder="Search your collection..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-[41px] bg-[#316282]/30 border-border text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/50"
            />
            <FontAwesomeIcon
              icon={faSearch}
              style={{ width: "16px", height: "16px" }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Filter button with popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`hidden sm:flex text-muted-foreground hover:text-foreground relative ${
                  selectedConsoles.length > 0 ? "text-primary" : ""
                }`}
              >
                <FontAwesomeIcon icon={faFilter} style={{ width: "16px", height: "16px" }} />
                {selectedConsoles.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                    {selectedConsoles.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-56 p-2 bg-card border-border"
            >
              <div className="flex items-center justify-between px-2 pb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Filter by Console
                </span>
                {selectedConsoles.length > 0 && (
                  <button
                    onClick={onClearConsoles}
                    className="text-xs text-primary hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-0.5">
                {CONSOLE_NAMES.map((name) => {
                  const isSelected = selectedConsoles.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => onToggleConsole(name)}
                      className={`flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-primary/20 text-primary"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/50"
                        }`}
                      >
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground" />
                          </svg>
                        )}
                      </div>
                      {name}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* Export CSV button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex text-muted-foreground hover:text-foreground"
            onClick={onExportCsv}
            title="Export as CSV"
          >
            <FontAwesomeIcon icon={faFileExport} style={{ width: "16px", height: "16px" }} />
          </Button>
        </div>
      </div>

      {/* Active filter chips bar */}
      {selectedConsoles.length > 0 && (
        <div className="flex items-center gap-2 px-4 sm:px-6 pb-2 lg:pl-[312px] flex-wrap">
          <span className="text-xs text-muted-foreground mr-1">Filters:</span>
          {selectedConsoles.map((name) => (
            <Badge
              key={name}
              variant="secondary"
              className="bg-primary/20 text-primary border-primary/30 gap-1 cursor-pointer hover:bg-primary/30 pr-1.5"
              onClick={() => onToggleConsole(name)}
            >
              {name}
              <FontAwesomeIcon icon={faTimes} style={{ width: "10px", height: "10px" }} />
            </Badge>
          ))}
          <button
            onClick={onClearConsoles}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </header>
  );
}
