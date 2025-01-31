import { useEffect, useState } from "react";

export const App = () => {
  type ToolType = "line" | "arrow" | "";
  type Dot = { x: number; y: number };
  const [globalDots, setGlobalDots] = useState<Dot[]>([]);
  const [dots, setDots] = useState<Dot[]>([]);
  const [tempDot, setTempDot] = useState<Dot>();
  const [toolType, setToolType] = useState<ToolType>("");
  const [status, setStatus] = useState<"start" | "started" | "">("");

  const onClick = () => {
    setToolType("line");
    setStatus("start");
  };

  console.log(globalDots);

  useEffect(() => {
    if (toolType === "line") {
      if (status === "start") {
        document.documentElement.onclick = (event: MouseEvent) => {
          if (event.target instanceof HTMLButtonElement) return;
          setDots((prevDots) => {
            const newDots = (prevDots ?? []).concat([
              { x: event.x, y: event.y },
            ]);
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
      setGlobalDots((prevGlobal) => prevGlobal.concat(dots));
      setTempDot(null);
      setDots(null);
      setStatus("");
    }
  }, [status, dots]);

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    console.log({ globalDots, dots });
    if (globalDots?.length) {
      ctx.beginPath();
      ctx.moveTo(globalDots[0].x, globalDots[0].y);
      for (let i = 1; i < globalDots.length; i++) {
        const dot = globalDots[i];
        ctx.lineTo(dot.x, dot.y);
      }
      ctx.stroke();
    }
    if (dots?.length) {
      ctx.beginPath();
      ctx.moveTo(dots[0].x, dots[0].y);
      for (let i = 1; i < dots.length; i++) {
        const dot = dots[i];
        ctx.lineTo(dot.x, dot.y);
      }
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
