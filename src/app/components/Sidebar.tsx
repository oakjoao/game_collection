"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const CONSOLES = [
  { name: "Nintendo", games: [] },
  { name: "PS5", games: [] },
  { name: "PS4", games: [] },
  { name: "PS3", games: [] },
  { name: "Xbox Series X", games: [] },
  { name: "Xbox One", games: [] },
  { name: "Xbox 360", games: [] },
  { name: "PC", games: [] },
  { name: "Steam Deck", games: [] },
  { name: "Vita", games: [] },
  { name: "3DS", games: [] },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedConsoles, setExpandedConsoles] = useState<Set<string>>(new Set());

  const toggleConsole = (consoleName: string) => {
    setExpandedConsoles((prev) => {
      const next = new Set(prev);
      if (next.has(consoleName)) {
        next.delete(consoleName);
      } else {
        next.add(consoleName);
      }
      return next;
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-[57px] left-0 z-50 h-[calc(100vh-57px)] w-[300px] overflow-y-auto
          bg-[#1a2332] border-r border-[#2a3a4a] transition-transform duration-300
          lg:static lg:translate-x-0 lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-3">
          {CONSOLES.map((console) => {
            const isExpanded = expandedConsoles.has(console.name);
            return (
              <div key={console.name} className="mb-1">
                <button
                  onClick={() => toggleConsole(console.name)}
                  className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm font-medium uppercase tracking-wider text-[#67c1f5] hover:text-white transition-colors rounded hover:bg-[#2a3a4a]" style={{ fontFamily: 'var(--font-ibm-plex)' }}
                >
                  <FontAwesomeIcon
                    icon={isExpanded ? faChevronDown : faChevronRight}
                    style={{ width: "12px", height: "12px" }}
                    className="text-[#67c1f5]/60"
                  />
                  <span>{console.name}</span>
                  <span className="ml-auto text-xs text-[#8f98a0] font-normal normal-case">
                    {console.games.length}
                  </span>
                </button>

                {isExpanded && (
                  <div className="ml-4 border-l border-[#2a3a4a]">
                    {console.games.length === 0 ? (
                      <p className="px-4 py-3 text-xs text-[#8f98a0] italic">
                        No games added yet
                      </p>
                    ) : (
                      console.games.map((game, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-[#c7d5e0] hover:bg-[#2a3a4a] hover:text-white cursor-pointer transition-colors"
                        >
                          <div className="w-5 h-5 rounded bg-[#2a3a4a] flex-shrink-0" />
                          <span className="truncate">{String(game)}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
