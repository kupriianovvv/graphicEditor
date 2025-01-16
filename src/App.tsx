export const App = () => {
  return (
    <main>
      <canvas
        // TODO: window.onresize
        width={document.documentElement.clientWidth}
        height={document.documentElement.clientHeight}
        id="c"
      ></canvas>
    </main>
  );
};
