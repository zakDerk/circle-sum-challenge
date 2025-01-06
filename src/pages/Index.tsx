import React, { useState, useCallback } from "react";
import { NumberGrid } from "@/components/NumberGrid";
import { TargetNumbers } from "@/components/TargetNumbers";
import { GameLevel } from "@/components/GameLevel";
import { generateLevel } from "@/lib/game";
import { toast } from "sonner";

const Index = () => {
  const [level, setLevel] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [gameState, setGameState] = useState(() => generateLevel(1));

  const handleSum = useCallback(
    (sum: number) => {
      if (gameState.targets.includes(sum) && !completed.includes(sum)) {
        setCompleted((prev) => [...prev, sum]);
        toast.success(`Found ${sum}!`);

        if (completed.length + 1 === gameState.targets.length) {
          toast.success("Level Complete!");
          setTimeout(() => {
            const nextLevel = level + 1;
            setLevel(nextLevel);
            setCompleted([]);
            setGameState(generateLevel(nextLevel));
          }, 1000);
        }
      }
    },
    [gameState.targets, completed, level]
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <GameLevel level={level} />
        <TargetNumbers targets={gameState.targets} completed={completed} />
        <div className="flex justify-center">
          <NumberGrid
            numbers={gameState.numbers}
            size={gameState.size}
            onSum={handleSum}
            onComplete={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;