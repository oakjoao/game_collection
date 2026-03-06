"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export interface CollectionGame {
  id: number;
  name: string;
  backgroundImage: string | null;
  platform: string;       // the RAWG platform name (e.g. "PlayStation 5")
  consoleName: string;    // our drawer name (e.g. "PS5")
  released: string | null;
  metacritic: number | null;
  genres: string[];
  addedAt: string;        // ISO date string
}

interface GameCollectionContextType {
  games: CollectionGame[];
  addGame: (game: CollectionGame) => void;
  removeGame: (id: number, consoleName: string) => void;
  getGamesByConsole: (consoleName: string) => CollectionGame[];
  isGameInCollection: (id: number, consoleName: string) => boolean;
}

const GameCollectionContext = createContext<GameCollectionContextType | null>(null);

const STORAGE_KEY = "game_collection";

function loadFromStorage(): CollectionGame[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage(games: CollectionGame[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

export function GameCollectionProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<CollectionGame[]>([]);

  // Load from localStorage after hydration to avoid SSR mismatch
  useEffect(() => {
    setGames(loadFromStorage());
  }, []);

  const addGame = useCallback((game: CollectionGame) => {
    setGames((prev) => {
      // Prevent duplicates (same game ID + same console)
      if (prev.some((g) => g.id === game.id && g.consoleName === game.consoleName)) {
        return prev;
      }
      const updated = [...prev, game];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeGame = useCallback((id: number, consoleName: string) => {
    setGames((prev) => {
      const updated = prev.filter((g) => !(g.id === id && g.consoleName === consoleName));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const getGamesByConsole = useCallback(
    (consoleName: string) => games.filter((g) => g.consoleName === consoleName),
    [games]
  );

  const isGameInCollection = useCallback(
    (id: number, consoleName: string) =>
      games.some((g) => g.id === id && g.consoleName === consoleName),
    [games]
  );

  return (
    <GameCollectionContext.Provider
      value={{ games, addGame, removeGame, getGamesByConsole, isGameInCollection }}
    >
      {children}
    </GameCollectionContext.Provider>
  );
}

export function useGameCollection() {
  const ctx = useContext(GameCollectionContext);
  if (!ctx) {
    throw new Error("useGameCollection must be used within GameCollectionProvider");
  }
  return ctx;
}
