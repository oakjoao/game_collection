"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

interface GameGridHeaderProps {
  totalGames: number;
}

export default function GameGridHeader({ totalGames }: GameGridHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
        All Games{" "}
        <span className="text-muted-foreground font-normal">({totalGames})</span>
      </h2>
      <Button variant="secondary" size="icon-xs">
        <FontAwesomeIcon icon={faFilter} style={{ width: "14px", height: "14px" }} />
      </Button>
    </div>
  );
}
