"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui/card";

interface AddGameCardProps {
  onClick: () => void;
}

export default function AddGameCard({ onClick }: AddGameCardProps) {
  return (
    <Card
      onClick={onClick}
      className="group flex flex-col items-center justify-center border-2 border-dashed border-border bg-transparent aspect-[3/4] w-full hover:border-primary hover:bg-card/50 transition-all duration-200 cursor-pointer shadow-none"
    >
      <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
        <div className="relative">
          <FontAwesomeIcon icon={faGamepad} style={{ width: "40px", height: "40px" }} />
          <FontAwesomeIcon
            icon={faPlus}
            style={{ width: "16px", height: "16px" }}
            className="absolute -top-1 -right-2 bg-background rounded-full p-0.5"
          />
        </div>
        <span className="text-sm font-medium">add your game</span>
      </div>
    </Card>
  );
}
