"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGameCollection } from "@/lib/game-collection-context";

const CONSOLE_NAMES = [
  "Switch",
  "Switch 2",
  "3DS",
  "DS",
  "PS Vita",
  "PS5",
  "Wii",
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent() {
  const { getGamesByConsole } = useGameCollection();

  return (
    <div className="p-3">
      {CONSOLE_NAMES.map((consoleName) => {
        const games = getGamesByConsole(consoleName);
        return (
          <Collapsible key={consoleName} className="mb-1">
            <CollapsibleTrigger
              className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm font-medium uppercase tracking-wider text-primary hover:text-foreground transition-colors rounded hover:bg-accent cursor-pointer group"
              style={{ fontFamily: "var(--font-ibm-plex)" }}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                style={{ width: "12px", height: "12px" }}
                className="text-primary/60 transition-transform duration-200 group-data-[state=open]:rotate-90"
              />
              <span>{consoleName}</span>
              <Badge variant="secondary" className="ml-auto text-xs font-normal">
                {games.length}
              </Badge>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="ml-4 border-l border-border">
                {games.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-muted-foreground italic">
                    No games added yet
                  </p>
                ) : (
                  games.map((game) => (
                    <div
                      key={`${game.id}-${game.consoleName}`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
                    >
                      {game.backgroundImage ? (
                        <img
                          src={game.backgroundImage}
                          alt={game.name}
                          className="w-5 h-5 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded bg-accent flex-shrink-0" />
                      )}
                      <span className="truncate">{game.name}</span>
                    </div>
                  ))
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden lg:block h-[calc(100vh-57px)] w-[300px] overflow-y-auto bg-card border-r border-border">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar — Sheet overlay */}
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="left" className="w-[300px] p-0 bg-card border-border">
          <SheetTitle className="sr-only">Console Navigation</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
