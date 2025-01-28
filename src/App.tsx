import { useEffect, useState } from "react";

export const App = () => {
  type ToolType = "line" | "arrow" | "";
  type Dot = { x: number; y: number };
  const [dots, setDots] = useState<Dot[]>([]);
  const [tempDots, setTempDots] = useState<Dot[]>([]);
  const [toolType, setToolType] = useState<ToolType>("");
  const [status, setStatus] = useState<"start" | "started" | "">("");

  const onClick = () => {
    setToolType("line");
    setStatus("start");
  };

  useEffect(() => {
    if (toolType === "line") {
      if (status === "start") {
        document.documentElement.onclick = (event: MouseEvent) => {
          if (event.target instanceof HTMLButtonElement) return;
          setDots((prevDots) => {
            const newDots = prevDots.concat([{ x: event.x, y: event.y }]);
            setTempDots(newDots);
            return newDots;
          });
          setStatus("started");
          console.log("click");
        };
      }
      if (status === "started") {
        const currLength = dots.length;
        document.documentElement.onmousemove = (event: MouseEvent) => {
          setTempDots((prevDots) => {
            const newDots = [...prevDots];
            newDots[currLength] = { x: event.x, y: event.y };
            return newDots;
          });
        };
      }
    }
  }, [toolType, dots, status]);

  useEffect(() => {
    if (tempDots.length <= 1) return;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(tempDots[0].x, tempDots[0].y);
    for (let i = 1; i < tempDots.length; i++) {
      const dot = tempDots[i];
      ctx.lineTo(dot.x, dot.y);
      ctx.stroke();
    }
  }, [tempDots]);
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
