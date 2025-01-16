import { useEffect, useState } from "react";

export const App = () => {
  type ToolType = "line" | "arrow" | "";
  type Dot = { x: number; y: number };
  const [dots, setDots] = useState<Dot[]>([]);
  const [toolType, setToolType] = useState<ToolType>("");

  const onClick = () => {
    setToolType("line");
  };

  useEffect(() => {
    if (dots.length === 0 || dots.length === 1) return;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(dots[0].x, dots[0].y);
    for (let i = 1; i < dots.length; i++) {
      ctx.lineTo(dots[i].x, dots[i].y);
    }
    ctx.stroke();
  }, [dots]);
  useEffect(() => {
    if (toolType === "line") {
      const dots: Dot[] = [];
      document.documentElement.onclick = (event: MouseEvent) => {
        if (event.target instanceof HTMLButtonElement) return;
        console.log("clicked!");
        dots.push({ x: event.x, y: event.y });
        console.log(dots);
      };
      document.documentElement.onkeydown = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          setDots(dots);
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
