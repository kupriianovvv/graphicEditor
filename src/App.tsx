import { useEffect, useState } from "react";

export const App = () => {
  type ToolType = "line" | "arrow" | "";
  type Dot = { x: number; y: number };
  const [dots, setDots] = useState<Dot[]>([]);
  const [toolType, setToolType] = useState<ToolType>("");

  const isBeginning = dots.length === 1;
  const lastDotIndex = dots.length - 1;

  const onClick = () => {
    setToolType("line");
  };

  useEffect(() => {
    if (dots.length === 0) return;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    if (isBeginning) {
      ctx.beginPath();
      ctx.moveTo(dots[0].x, dots[0].y);
      return;
    }
    const startDot = dots[lastDotIndex - 1];
    const endDot = dots[lastDotIndex];
    ctx.beginPath();
    ctx.moveTo(startDot.x, startDot.y);
    ctx.lineTo(endDot.x, endDot.y);
    ctx.stroke();
  }, [dots, lastDotIndex, isBeginning]);

  useEffect(() => {
    if (toolType === "line") {
      const dots: Dot[] = [];
      document.documentElement.onclick = (event: MouseEvent) => {
        if (event.target instanceof HTMLButtonElement) return;
        dots.push({ x: event.x, y: event.y });
        setDots([...dots]);
      };
      document.documentElement.onkeydown = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          setToolType("");
        }
      };
    }

    return () => {
      document.documentElement.onclick = null;
    };
  }, [toolType]);
  return (
    <main>
      <canvas
        // TODO: window.onresize
        width={document.documentElement.clientWidth}
        height={document.documentElement.clientHeight}
        id="canvas"
      ></canvas>
      <button
        style={{ position: "absolute", top: "10px", left: "100px" }}
        onClick={onClick}
      >
        Нарисовать палку
      </button>
    </main>
  );
};
