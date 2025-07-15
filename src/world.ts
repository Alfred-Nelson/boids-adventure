import QuadTree from "./utils/quadtree";
import type { WorldObject } from "./utils/types";
import type DebugControls from "./utils/debug-controls";

class World {
  ctx: CanvasRenderingContext2D | null = null;
  currentQuadTree: QuadTree | null = null;
  quadTreeUnderConstruction: QuadTree | null = null;
  private debugControls: DebugControls | null = null;

  constructor(debugControls?: DebugControls) {
    this.debugControls = debugControls || null;
    this.debugControls?.setupDebugControls();

    const canvas = document.createElement("canvas");
    canvas.id = "world";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.backgroundColor = "#00113ada";

    document.querySelector("#app")?.appendChild(canvas);

    this.ctx = canvas.getContext("2d");

    this.quadTreeUnderConstruction = new QuadTree({
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      maxObjects: 5,
    });
  }

  render(object: WorldObject) {
    if (this.ctx) {
      object.draw(this.ctx);
      this.quadTreeUnderConstruction?.insert(object);
    }
  }

  getNeighbors(object: WorldObject) {
    return this.currentQuadTree?.queryRegion(object)?.objects || [];
  }

  beginSimulationLoop(renderFn: (deltaTime: number) => void) {
    let startTime: number;

    function simulation(this: World, timestamp: number) {
      this.debugControls?.recordFrame();

      const isPaused = this.debugControls?.getPaused() || false;

      if (isPaused) {
        startTime = timestamp;
        requestAnimationFrame(simulation.bind(this));
        return;
      }

      if (!startTime) startTime = timestamp;
      const deltaTime = Math.min((timestamp - startTime) / 1000, 0.3);
      startTime = timestamp;

      this.currentQuadTree = this.quadTreeUnderConstruction;
      this.quadTreeUnderConstruction = new QuadTree({
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        maxObjects: 5,
      });

      this.ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);

      renderFn(deltaTime);

      if (this.debugControls?.getShowBoundaryLines()) {
        this.quadTreeUnderConstruction?.draw(this.ctx!);
      }

      requestAnimationFrame(simulation.bind(this));
    }

    requestAnimationFrame(simulation.bind(this));
  }
}

export default World;
