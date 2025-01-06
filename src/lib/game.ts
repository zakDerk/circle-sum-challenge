export const generateLevel = (level: number) => {
  const size = Math.min(4 + Math.floor(level / 2), 8);
  const numbers: number[] = [];
  const targets: number[] = [];
  
  // Generate random numbers for the grid
  for (let i = 0; i < size * size; i++) {
    numbers.push(Math.floor(Math.random() * 9) + 1);
  }
  
  // Generate target sums
  const targetCount = Math.min(3 + Math.floor(level / 3), 6);
  for (let i = 0; i < targetCount; i++) {
    const target = Math.floor(Math.random() * (10 * level)) + (10 * level);
    targets.push(target);
  }
  
  return {
    size,
    numbers: numbers.map((value, index) => ({
      value,
      id: `cell-${index}`,
      position: {
        x: index % size,
        y: Math.floor(index / size),
      },
    })),
    targets,
  };
};