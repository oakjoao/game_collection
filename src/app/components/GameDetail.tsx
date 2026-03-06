"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faStar,
  faClock,
  faTrophy,
  faGlobe,
  faCalendar,
  faBuilding,
  faCode,
  faGamepad,
  faTag,
  faShieldAlt,
  faStore,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { faReddit } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getGameDetails,
  getGameScreenshots,
  type RawgGameDetails,
  type RawgScreenshot,
} from "@/lib/rawg";

interface GameDetailProps {
  gameId: number;
  onBack: () => void;
}

export default function GameDetail({ gameId, onBack }: GameDetailProps) {
  const [game, setGame] = useState<RawgGameDetails | null>(null);
  const [screenshots, setScreenshots] = useState<RawgScreenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Try reading from local cache first
        const cacheRes = await fetch(`/api/game-cache/${gameId}`);
        if (cacheRes.ok) {
          const cached = await cacheRes.json();
          setGame(cached.details);
          setScreenshots(cached.screenshots);
          setLoading(false);
          return;
        }

        // Cache miss — fetch from RAWG API
        const [gameData, screenshotData] = await Promise.all([
          getGameDetails(gameId),
          getGameScreenshots(gameId),
        ]);
        setGame(gameData);
        setScreenshots(screenshotData);

        // Save to cache for next time
        fetch(`/api/game-cache/${gameId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ details: gameData, screenshots: screenshotData }),
        }).catch(() => {});
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load game");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [gameId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground text-lg">Loading game details...</div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-destructive text-lg">{error || "Game not found"}</div>
        <Button variant="ghost" onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ width: "14px", height: "14px" }} className="mr-2" />
          Back to catalogue
        </Button>
      </div>
    );
  }

  const releaseDate = game.released
    ? new Date(game.released).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div>
      {/* Hero section */}
      <div className="relative w-full h-[350px]">
        {game.background_image && (
          <img
            src={game.background_image}
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
            onClick={onBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} style={{ width: "14px", height: "14px" }} className="mr-2" />
            Back
          </Button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {game.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {game.genres.map((g) => (
              <Badge key={g.id} variant="secondary" className="text-sm">
                {g.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {game.metacritic && (
                <Card className="p-4 bg-card border-border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Metacritic</div>
                  <div className={`text-2xl font-bold ${
                    game.metacritic >= 75 ? "text-green-400" :
                    game.metacritic >= 50 ? "text-yellow-400" : "text-red-400"
                  }`}>
                    {game.metacritic}
                  </div>
                </Card>
              )}

              <Card className="p-4 bg-card border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Rating</div>
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faStar} style={{ width: "16px", height: "16px" }} className="text-yellow-400" />
                  <span className="text-2xl font-bold text-foreground">{game.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">/ 5</span>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Playtime</div>
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faClock} style={{ width: "16px", height: "16px" }} className="text-primary" />
                  <span className="text-2xl font-bold text-foreground">{game.playtime}</span>
                  <span className="text-sm text-muted-foreground">hrs</span>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Achievements</div>
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faTrophy} style={{ width: "16px", height: "16px" }} className="text-amber-400" />
                  <span className="text-2xl font-bold text-foreground">{game.achievements_count}</span>
                </div>
              </Card>
            </div>

            {/* Description */}
            {game.description_raw && (
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {game.description_raw}
                </p>
              </section>
            )}

            {/* Ratings breakdown */}
            {game.ratings && game.ratings.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  Ratings
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({game.ratings_count} total)
                  </span>
                </h2>
                <div className="space-y-2">
                  {game.ratings.map((r) => (
                    <div key={r.id} className="flex items-center gap-3">
                      <span className="text-sm text-foreground w-28 capitalize">{r.title}</span>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            r.title === "exceptional" ? "bg-green-500" :
                            r.title === "recommended" ? "bg-blue-500" :
                            r.title === "meh" ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${r.percent}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-16 text-right">
                        {r.percent.toFixed(0)}% ({r.count})
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">Screenshots</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {screenshots.map((s) => (
                    <div key={s.id} className="rounded-lg overflow-hidden">
                      <img
                        src={s.image}
                        alt="Screenshot"
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            {game.tags && game.tags.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTag} style={{ width: "16px", height: "16px" }} className="text-muted-foreground" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column - Sidebar info */}
          <div className="space-y-6">
            {/* Details card */}
            <Card className="p-5 bg-card border-border space-y-4">
              <h3 className="text-lg font-bold text-foreground">Details</h3>
              <Separator />

              <DetailRow
                icon={faCalendar}
                label="Release Date"
                value={releaseDate}
              />

              {game.developers && game.developers.length > 0 && (
                <DetailRow
                  icon={faCode}
                  label="Developers"
                  value={game.developers.map((d) => d.name).join(", ")}
                />
              )}

              {game.publishers && game.publishers.length > 0 && (
                <DetailRow
                  icon={faBuilding}
                  label="Publishers"
                  value={game.publishers.map((p) => p.name).join(", ")}
                />
              )}

              {game.esrb_rating && (
                <DetailRow
                  icon={faShieldAlt}
                  label="ESRB"
                  value={game.esrb_rating.name}
                />
              )}

              <DetailRow
                icon={faComment}
                label="Reviews"
                value={String(game.reviews_count)}
              />
            </Card>

            {/* Platforms card */}
            <Card className="p-5 bg-card border-border space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faGamepad} style={{ width: "18px", height: "18px" }} className="text-muted-foreground" />
                Platforms
              </h3>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {game.platforms.map((p) => (
                  <Badge key={p.platform.id} variant="secondary" className="text-xs">
                    {p.platform.name}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Stores card */}
            {game.stores && game.stores.length > 0 && (
              <Card className="p-5 bg-card border-border space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FontAwesomeIcon icon={faStore} style={{ width: "18px", height: "18px" }} className="text-muted-foreground" />
                  Where to Buy
                </h3>
                <Separator />
                <div className="space-y-2">
                  {game.stores.map((s) => (
                    <a
                      key={s.id}
                      href={s.url || `https://${s.store.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                      {s.store.name}
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Links card */}
            {(game.website || game.reddit_url) && (
              <Card className="p-5 bg-card border-border space-y-4">
                <h3 className="text-lg font-bold text-foreground">Links</h3>
                <Separator />
                <div className="space-y-2">
                  {game.website && (
                    <a
                      href={game.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                      <FontAwesomeIcon icon={faGlobe} style={{ width: "14px", height: "14px" }} />
                      Official Website
                    </a>
                  )}
                  {game.reddit_url && (
                    <a
                      href={game.reddit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                      <FontAwesomeIcon icon={faReddit} style={{ width: "14px", height: "14px" }} />
                      Reddit Community
                    </a>
                  )}
                </div>
              </Card>
            )}

            {/* Last updated */}
            {game.updated && (
              <p className="text-xs text-muted-foreground text-center">
                Last updated: {new Date(game.updated).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: typeof faCalendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <FontAwesomeIcon
        icon={icon}
        style={{ width: "14px", height: "14px" }}
        className="text-muted-foreground mt-0.5"
      />
      <div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}
