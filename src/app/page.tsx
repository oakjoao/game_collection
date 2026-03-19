"use client";

import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import GameGridHeader from "./components/GameGridHeader";
import AddGameCard from "./components/AddGameCard";
import GameCard from "./components/GameCard";
import GameDetail from "./components/GameDetail";
import AddGameDialog from "./components/AddGameDialog";
import { GameCollectionProvider, useGameCollection } from "@/lib/game-collection-context";

function HomeContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConsoles, setSelectedConsoles] = useState<string[]>([]);
  const { games, removeGame } = useGameCollection();

  const toggleConsole = (consoleName: string) => {
    setSelectedConsoles((prev) =>
      prev.includes(consoleName)
        ? prev.filter((c) => c !== consoleName)
        : [...prev, consoleName]
    );
  };

  const clearConsoles = () => setSelectedConsoles([]);

  const exportCsv = () => {
    const rows = [["Console", "Game"]];
    const sorted = [...games].sort((a, b) => a.consoleName.localeCompare(b.consoleName) || a.name.localeCompare(b.name));
    for (const game of sorted) {
      rows.push([game.consoleName, game.name]);
    }
    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "game_collection.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(games, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "game_collection.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch = searchQuery.trim()
      ? game.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesConsole =
      selectedConsoles.length > 0
        ? selectedConsoles.includes(game.consoleName)
        : true;
    return matchesSearch && matchesConsole;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedConsoles={selectedConsoles}
        onToggleConsole={toggleConsole}
        onClearConsoles={clearConsoles}
        onExportCsv={exportCsv}
        onExportJson={exportJson}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSelectGame={(id) => setSelectedGameId(id)} />

        <main className="flex-1 overflow-y-auto bg-background">
          {selectedGameId ? (
            <GameDetail
              gameId={selectedGameId}
              onBack={() => setSelectedGameId(null)}
            />
          ) : (
            <>
              <GameGridHeader totalGames={filteredGames.length} />

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3 px-4 pb-6 sm:px-6">
                {!searchQuery.trim() && selectedConsoles.length === 0 && (
                  <AddGameCard onClick={() => setDialogOpen(true)} />
                )}
                {filteredGames.map((game) => (
                  <GameCard
                    key={`${game.id}-${game.consoleName}`}
                    game={game}
                    onRemove={removeGame}
                    onSelect={() => setSelectedGameId(game.id)}
                  />
                ))}
                {filteredGames.length === 0 && (searchQuery.trim() || selectedConsoles.length > 0) && (
                  <div className="col-span-full flex items-center justify-center py-12">
                    <p className="text-muted-foreground text-sm">
                      No games match your filters
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <AddGameDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

export default function Home() {
  return (
    <GameCollectionProvider>
      <HomeContent />
    </GameCollectionProvider>
  );
}
