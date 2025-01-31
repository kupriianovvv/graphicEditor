import { useEffect, useState } from "react";

export const App = () => {
  type ToolType = "line" | "arrow" | "";
  type Dot = { x: number; y: number };
  const [globalDots, setGlobalDots] = useState<Dot[]>([]);
  const [dots, setDots] = useState<Dot[]>([]);
  const [tempDot, setTempDot] = useState<Dot>();
  const [toolType, setToolType] = useState<ToolType>("");
  const [status, setStatus] = useState<"start" | "started" | "">("");

  console.log(dots, globalDots);
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
            const newDots = (prevDots ?? []).concat([
              { x: event.x, y: event.y },
            ]);
            console.log({ newDots });
            return newDots;
          });
          setStatus("started");
        };
      }
      if (status === "started") {
        document.documentElement.onmousemove = (event: MouseEvent) => {
          setTempDot({ x: event.x, y: event.y });
        };
        document.documentElement.onkeydown = (event: KeyboardEvent) => {
          if (event.key === "Enter") {
            setStatus("finished");
            document.documentElement.onmousemove = null;
            document.documentElement.onclick = null;
          }
        };
      }
    }
  }, [toolType, status]);

  useEffect(() => {
    if (status === "finished") {
      setGlobalDots(dots);
      setTempDot(null);
      setDots(null);
      setStatus("");
    }
  }, [status, dots]);

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;

    const allDots = globalDots.concat(dots ?? []);
    if (allDots.length < 1) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(allDots[0].x, allDots[0].y);
    for (let i = 1; i < allDots.length; i++) {
      const dot = allDots[i];
      ctx.lineTo(dot.x, dot.y);
    }
    if (tempDot) {
      ctx.lineTo(tempDot?.x, tempDot?.y);
    }
    ctx.stroke();
  }, [dots, tempDot, globalDots]);
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
