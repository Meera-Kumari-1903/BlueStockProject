// deterministic random generator
// SAME seed => SAME puzzle everyday

export function seededRandom(seed: number) {
  let value = seed % 2147483647;

  if (value <= 0) value += 2147483646;

  return function () {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}
