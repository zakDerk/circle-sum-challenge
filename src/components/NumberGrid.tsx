import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
}

interface NumberCell {
  value: number;
  id: string;
  position: Point;
}

interface Props {
  numbers: NumberCell[];
  onSum: (sum: number) => void;
  onComplete: () => void;
  size: number;
}

export const NumberGrid: React.FC<Props> = ({ numbers, onSum, onComplete, size }) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState<string[]>([]);
  const [currentSum, setCurrentSum] = useState(0);
  const [lines, setLines] = useState<Point[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef<Point>({ x: 0, y: 0 });

  const getCellCenter = (id: string): Point => {
    const cell = document.getElementById(id);
    if (!cell || !gridRef.current) return { x: 0, y: 0 };

    const rect = cell.getBoundingClientRect();
    const gridRect = gridRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - gridRect.left,
      y: rect.top + rect.height / 2 - gridRect.top,
    };
  };

  const handleStart = (id: string, event: React.MouseEvent) => {
    if (event.type !== 'mousedown') return; // Only allow mouse interactions
    
    event.preventDefault();
    const cell = numbers.find((n) => n.id === id);
    if (!cell) return;

    setConnecting(true);
    setConnected([id]);
    setCurrentSum(cell.value);
    const pos = getCellCenter(id);
    setLines([pos]);
    lastPosition.current = pos;
  };

  const handleMove = (event: React.MouseEvent) => {
    if (!connecting || !gridRef.current) return;

    event.preventDefault();
    const gridRect = gridRef.current.getBoundingClientRect();
    const currentPosition = {
      x: event.clientX - gridRect.left,
      y: event.clientY - gridRect.top,
    };

    setLines((prev) => [...prev.slice(0, -1), currentPosition]);
  };

  const handleEnterCell = (id: string) => {
    if (!connecting || connected.includes(id)) return;

    const cell = numbers.find((n) => n.id === id);
    if (!cell) return;

    const lastCell = numbers.find((n) => n.id === connected[connected.length - 1]);
    if (!lastCell) return;

    const dx = Math.abs(cell.position.x - lastCell.position.x);
    const dy = Math.abs(cell.position.y - lastCell.position.y);
    if (dx <= 1 && dy <= 1) {
      setConnected((prev) => [...prev, id]);
      setCurrentSum((prev) => prev + cell.value);
      const pos = getCellCenter(id);
      setLines((prev) => [...prev, pos]);
      lastPosition.current = pos;
    }
  };

  const handleEnd = () => {
    if (!connecting) return;
    setConnecting(false);
    onSum(currentSum);
    setConnected([]);
    setCurrentSum(0);
    setLines([]);
  };

  return (
    <div
      ref={gridRef}
      className="relative w-full aspect-square max-w-[400px] bg-game-bg rounded-lg p-3 touch-none select-none"
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onMouseMove={handleMove}
    >
      <div
        className="grid gap-2 h-full"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
        }}
      >
        {numbers.map((number) => (
          <div
            key={number.id}
            id={number.id}
            className={cn(
              "relative flex items-center justify-center w-full aspect-square rounded-full bg-game-circle border-2 border-game-border shadow-sm transition-colors text-sm",
              connected.includes(number.id) && "bg-game-connection text-white"
            )}
            onMouseDown={(e) => handleStart(number.id, e)}
            onMouseEnter={() => handleEnterCell(number.id)}
          >
            <span className="font-semibold">{number.value}</span>
          </div>
        ))}
      </div>
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      >
        {lines.length > 1 &&
          lines.slice(1).map((point, i) => (
            <line
              key={i}
              x1={lines[i].x}
              y1={lines[i].y}
              x2={point.x}
              y2={point.y}
              stroke="#339af0"
              strokeWidth="2"
            />
          ))}
      </svg>
      {connecting && currentSum > 0 && (
        <div
          className="absolute text-lg font-bold text-game-connection animate-connection-pulse pointer-events-none"
          style={{
            left: `${lastPosition.current.x}px`,
            top: `${lastPosition.current.y - 30}px`,
          }}
        >
          {currentSum}
        </div>
      )}
    </div>
  );
};