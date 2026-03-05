"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

interface GameGridHeaderProps {
  totalGames: number;
}

export default function GameGridHeader({ totalGames }: GameGridHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-[#c7d5e0]">
        All Games{" "}
        <span className="text-[#8f98a0] font-normal">({totalGames})</span>
      </h2>
      <button className="flex items-center justify-center w-7 h-7 rounded bg-[#2a3a4a] hover:bg-[#3d4f5f] text-[#8f98a0] hover:text-white transition-colors">
        <FontAwesomeIcon icon={faFilter} style={{ width: "14px", height: "14px" }} />
      </button>
    </div>
  );
}
