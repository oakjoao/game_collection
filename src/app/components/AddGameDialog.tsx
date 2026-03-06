"use client";

import { useState, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";
import { searchGames, getGameDetails, getGameScreenshots, mapPlatformToConsole, type RawgGame } from "@/lib/rawg";
import { useGameCollection, type CollectionGame } from "@/lib/game-collection-context";

const MY_CONSOLES = [
  "Switch",
  "Switch 2",
  "3DS",
  "DS",
  "PS Vita",
  "PS5",
  "Wii",
];

interface AddGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddGameDialog({ open, onOpenChange }: AddGameDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedGame, setSelectedGame] = useState<RawgGame | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addGame, isGameInCollection } = useGameCollection();

  const doSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await searchGames(searchQuery);
      setResults(data.results);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedGame(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 400);
  };

  const handleAddToConsole = async (game: RawgGame, consoleName: string) => {
    const newGame: CollectionGame = {
      id: game.id,
      name: game.name,
      backgroundImage: game.background_image,
      platform: consoleName,
      consoleName,
      released: game.released,
      metacritic: game.metacritic,
      genres: game.genres.map((g) => g.name),
      addedAt: new Date().toISOString(),
    };

    addGame(newGame);

    // Fetch full details + screenshots and cache them as a JSON file
    try {
      const [details, screenshots] = await Promise.all([
        getGameDetails(game.id),
        getGameScreenshots(game.id),
      ]);
      await fetch(`/api/game-cache/${game.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ details, screenshots }),
      });
    } catch (err) {
      console.error("Failed to cache game data:", err);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSearched(false);
      setSelectedGame(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-[600px] max-h-[85vh] !flex !flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0">
          <DialogTitle className="text-foreground text-lg">Add a Game</DialogTitle>
        </DialogHeader>

        {/* Search input */}
        <div className="px-6 relative flex-shrink-0">
          <Input
            placeholder="Search for a game..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
            autoFocus
          />
          <FontAwesomeIcon
            icon={loading ? faSpinner : faSearch}
            style={{ width: "16px", height: "16px" }}
            className={`absolute right-9 top-1/2 -translate-y-1/2 text-muted-foreground ${loading ? "animate-spin" : ""}`}
          />
        </div>

        {/* Results or platform picker */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 mt-2">
          {selectedGame ? (
            /* Platform selection view */
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                {selectedGame.background_image && (
                  <img
                    src={selectedGame.background_image}
                    alt={selectedGame.name}
                    className="w-24 h-32 object-cover rounded-md flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="text-foreground font-semibold text-base truncate">
                    {selectedGame.name}
                  </h3>
                  {selectedGame.released && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {new Date(selectedGame.released).getFullYear()}
                    </p>
                  )}
                  {selectedGame.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedGame.genres.slice(0, 3).map((g) => (
                        <Badge key={g.id} variant="secondary" className="text-xs">
                          {g.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-border" />

              <div>
                <p className="text-sm font-medium text-foreground mb-3">
                  Add to which console?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MY_CONSOLES.map((consoleName) => {
                      const alreadyAdded = isGameInCollection(selectedGame.id, consoleName);

                      return (
                        <Button
                          key={consoleName}
                          variant={alreadyAdded ? "secondary" : "outline"}
                          className={`justify-start gap-2 h-auto py-3 px-4 ${
                            alreadyAdded
                              ? "text-primary border-primary/30"
                              : "text-foreground hover:border-primary hover:text-primary"
                          }`}
                          disabled={alreadyAdded}
                          onClick={() => handleAddToConsole(selectedGame, consoleName)}
                        >
                          <FontAwesomeIcon
                            icon={alreadyAdded ? faCheck : faPlus}
                            style={{ width: "14px", height: "14px" }}
                          />
                          <div className="text-left">
                            <div className="text-sm font-medium">{consoleName}</div>
                          </div>
                        </Button>
                      );
                    })}
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => setSelectedGame(null)}
              >
                ← Back to results
              </Button>
            </div>
          ) : (
            /* Search results list */
            <div className="space-y-1 pt-2">
              {loading && results.length === 0 && (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    style={{ width: "24px", height: "24px" }}
                    className="animate-spin"
                  />
                </div>
              )}

              {!loading && searched && results.length === 0 && (
                <p className="text-center py-12 text-muted-foreground text-sm">
                  No games found. Try a different search.
                </p>
              )}

              {!searched && !loading && (
                <p className="text-center py-12 text-muted-foreground text-sm">
                  Start typing to search for games.
                </p>
              )}

              {results.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-left hover:bg-accent transition-colors cursor-pointer"
                >
                  {game.background_image ? (
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="w-12 h-16 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-16 rounded bg-muted flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {game.name}
                    </p>
                    {game.released && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(game.released).getFullYear()}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {game.platforms?.slice(0, 4).map((p) => (
                        <Badge
                          key={p.platform.id}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {p.platform.name}
                        </Badge>
                      ))}
                      {game.platforms?.length > 4 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          +{game.platforms.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {game.metacritic && (
                    <Badge
                      variant="outline"
                      className={`text-xs flex-shrink-0 ${
                        game.metacritic >= 75
                          ? "border-green-500 text-green-400"
                          : game.metacritic >= 50
                          ? "border-yellow-500 text-yellow-400"
                          : "border-red-500 text-red-400"
                      }`}
                    >
                      {game.metacritic}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
