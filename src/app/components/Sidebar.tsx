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

function SidebarContent() {
  return (
    <div className="p-3">
      {CONSOLES.map((console) => (
        <Collapsible key={console.name} className="mb-1">
          <CollapsibleTrigger
            className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm font-medium uppercase tracking-wider text-primary hover:text-foreground transition-colors rounded hover:bg-accent cursor-pointer group"
            style={{ fontFamily: "var(--font-ibm-plex)" }}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{ width: "12px", height: "12px" }}
              className="text-primary/60 transition-transform duration-200 group-data-[state=open]:rotate-90"
            />
            <span>{console.name}</span>
            <Badge variant="secondary" className="ml-auto text-xs font-normal">
              {console.games.length}
            </Badge>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="ml-4 border-l border-border">
              {console.games.length === 0 ? (
                <p className="px-4 py-3 text-xs text-muted-foreground italic">
                  No games added yet
                </p>
              ) : (
                console.games.map((game, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
                  >
                    <div className="w-5 h-5 rounded bg-accent flex-shrink-0" />
                    <span className="truncate">{String(game)}</span>
                  </div>
                ))
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
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
