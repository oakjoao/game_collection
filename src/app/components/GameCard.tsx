"use client";

import { useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type CollectionGame } from "@/lib/game-collection-context";

interface GameCardProps {
  game: CollectionGame;
  onRemove: (id: number, consoleName: string) => void;
  onSelect: () => void;
}

export default function GameCard({ game, onRemove, onSelect }: GameCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const DEPTH = 6;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const wrapper = wrapperRef.current;
    const glare = glareRef.current;
    if (!wrapper || !glare) return;

    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    wrapper.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, transparent 50%)`;
    glare.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const wrapper = wrapperRef.current;
    const glare = glareRef.current;
    if (!wrapper || !glare) return;

    wrapper.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    glare.style.opacity = "0";
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="group aspect-[3/4] w-full cursor-pointer"
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.2s ease-out",
      }}
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Front face */}
      <Card
        className="relative overflow-hidden border-0 bg-card w-full h-full shadow-lg rounded-lg"
        style={{
          transformStyle: "preserve-3d",
          transform: `translateZ(${DEPTH}px)`,
        }}
      >
        {/* Cover image */}
        {game.backgroundImage ? (
          <img
            src={game.backgroundImage}
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-xs text-center px-2">
              {game.name}
            </span>
          </div>
        )}

        {/* Bottom gradient + game name */}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-8 pb-3 px-3 pointer-events-none">
          <p className="text-sm text-white font-bold truncate">{game.name}</p>
        </div>

        {/* Glare */}
        <div
          ref={glareRef}
          className="absolute inset-0 z-20 pointer-events-none rounded-lg"
          style={{ opacity: 0, transition: "opacity 0.2s ease-out" }}
        />

        {/* Hover overlay — on top of everything */}
        <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
          <div className="flex items-center justify-between mb-7">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {game.consoleName}
            </Badge>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(game.id, game.consoleName);
              }}
            >
              <FontAwesomeIcon icon={faTrash} style={{ width: "12px", height: "12px" }} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Right edge */}
      <div
        className="absolute top-0 right-0 h-full rounded-r-lg"
        style={{
          width: `${DEPTH * 2}px`,
          background: "linear-gradient(to right, #0d1520, #162232)",
          transform: `translateX(${DEPTH}px) rotateY(90deg)`,
          transformOrigin: "left center",
        }}
      />

      {/* Bottom edge */}
      <div
        className="absolute bottom-0 left-0 w-full rounded-b-lg"
        style={{
          height: `${DEPTH * 2}px`,
          background: "linear-gradient(to bottom, #0d1520, #162232)",
          transform: `translateY(${DEPTH}px) rotateX(-90deg)`,
          transformOrigin: "top center",
        }}
      />

      {/* Left edge */}
      <div
        className="absolute top-0 left-0 h-full rounded-l-lg"
        style={{
          width: `${DEPTH * 2}px`,
          background: "linear-gradient(to left, #0d1520, #1a2e42)",
          transform: `translateX(-${DEPTH}px) rotateY(-90deg)`,
          transformOrigin: "right center",
        }}
      />

      {/* Top edge */}
      <div
        className="absolute top-0 left-0 w-full rounded-t-lg"
        style={{
          height: `${DEPTH * 2}px`,
          background: "linear-gradient(to top, #0d1520, #1a2e42)",
          transform: `translateY(-${DEPTH}px) rotateX(90deg)`,
          transformOrigin: "bottom center",
        }}
      />
    </div>
  );
}
