"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AddGameCard() {
  return (
    <button className="group flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#3d4f5f] bg-transparent aspect-[191/281] w-full hover:border-[#67c1f5] hover:bg-[#1a2332]/50 transition-all duration-200 cursor-pointer">
      <div className="flex flex-col items-center gap-3 text-[#8f98a0] group-hover:text-[#67c1f5] transition-colors">
        <div className="relative">
          <FontAwesomeIcon icon={faGamepad} style={{ width: "40px", height: "40px" }} />
          <FontAwesomeIcon
            icon={faPlus}
            style={{ width: "16px", height: "16px" }}
            className="absolute -top-1 -right-2 bg-[#1b2838] rounded-full p-0.5"
          />
        </div>
        <span className="text-sm font-medium">add your game</span>
      </div>
    </button>
  );
}
