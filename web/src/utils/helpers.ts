export function randomColor() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * (80 - 30 + 1) + 30);
  const l = Math.floor(Math.random() * (80 - 30 + 1) + 30);
  return `hsl(${h}deg, ${s}%, ${l}%)`;
}
