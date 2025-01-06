import React from "react";

interface Props {
  level: number;
}

export const GameLevel: React.FC<Props> = ({ level }) => {
  return (
    <div className="text-2xl font-bold text-game-text mb-4">
      Level {level}
    </div>
  );
};