import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  targets: number[];
  completed: number[];
}

export const TargetNumbers: React.FC<Props> = ({ targets, completed }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-6">
      {targets.map((target, index) => (
        <div
          key={index}
          className={cn(
            "px-4 py-2 rounded-full text-lg font-semibold transition-colors",
            completed.includes(target)
              ? "bg-game-complete text-white"
              : "bg-game-target text-white"
          )}
        >
          {target}
        </div>
      ))}
    </div>
  );
};