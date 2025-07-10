import type { WorldObject } from "./utils/types";

class World {
  ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    const canvas = document.createElement("canvas");
    canvas.id = "world";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.backgroundColor = "#00113ada";

    document.querySelector("#app")?.appendChild(canvas);

    this.ctx = canvas.getContext("2d");
  }

  render(object: WorldObject) {
    if (this.ctx) {
      object.draw(this.ctx);
    }
  }

  beginSimulationLoop(
    renderFn: (deltaTime: number, ctx: CanvasRenderingContext2D | null) => void
  ) {
    let startTime: number;

    function simulation(this: World, timestamp: number) {
      if (!startTime) startTime = timestamp;
      const deltaTime = Math.min((timestamp - startTime) / 1000, 0.3);
      startTime = timestamp;

      this.ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);

      renderFn(deltaTime, this.ctx);

      requestAnimationFrame(simulation.bind(this));
    }

    requestAnimationFrame(simulation.bind(this));
  }
}

export default World;
