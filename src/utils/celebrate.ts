import confetti from "canvas-confetti";

export function celebrateDownload() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
    scalar: 1,
    shapes: [
      {
        type: "path",
        // rounded capsule / sprinkle shape
        path: "M2 0 H10 A2 2 0 0 1 12 2 V4 A2 2 0 0 1 10 6 H2 A2 2 0 0 1 0 4 V2 A2 2 0 0 1 2 0 Z",
        matrix: [1, 0, 0, 1, 0, 0],
      },
    ],
    colors: [
      "#f59e0b", // amber
      "#ec4899", // pink
      "#22c55e", // green
      "#3b82f6", // blue
      "#a855f7", // purple
    ],
    gravity: 0.8,
    ticks: 200,
  });
}
