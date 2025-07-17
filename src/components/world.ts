import QuadTree from "../utils/quadtree";
import type DebugControls from "../utils/debug-controls";
import { MobileEntity, type WorldEntity } from "./world-entities";

class World {
  ctx: CanvasRenderingContext2D | null = null;
  currentQuadTree: QuadTree | null = null;
  quadTreeUnderConstruction: QuadTree | null = null;
  private debugControls: DebugControls | null = null;

  constructor({ debugControls }: { debugControls?: DebugControls } = {}) {
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
      width: canvas.width,
      height: canvas.height,
      maxObjects: 5,
    });
  }

  render(entity: WorldEntity) {
    if (this.ctx) {
      entity.draw(this.ctx);
      if (entity instanceof MobileEntity) {
        this.quadTreeUnderConstruction?.insert(entity);
      }
    }
  }

  getNeighbors(entity: WorldEntity) {
    return this.currentQuadTree?.queryRegion(entity)?.objects || [];
  }

  beginSimulationLoop(renderFn: (deltaTime: number) => void) {
    let startTime: number;

    function simulation(this: World, timestamp: number) {
      this.debugControls?.recordFrame();

      const isPaused = this.debugControls?.getPaused() || false;

      // have to run the reqAnimFrame else play logic cannot be handled
      // because after playing who would run the simulation
      if (isPaused) {
        startTime = timestamp;
        requestAnimationFrame(simulation.bind(this));
        return;
      }

      if (!startTime) startTime = timestamp;
      const deltaTime = Math.min((timestamp - startTime) / 1000, 0.3);
      startTime = timestamp;

      const canvasWidth = this.ctx?.canvas.width!;
      const canvasHeight = this.ctx?.canvas.height!;

      this.currentQuadTree = this.quadTreeUnderConstruction;
      this.quadTreeUnderConstruction = new QuadTree({
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight,
        maxObjects: 5,
      });

      this.ctx?.clearRect(0, 0, canvasWidth, canvasHeight);

      renderFn(deltaTime);

      if (this.debugControls?.getShowBoundaryLines()) {
        this.quadTreeUnderConstruction?.draw(this.ctx!);
      }

      requestAnimationFrame(simulation.bind(this));
    }

    requestAnimationFrame(simulation.bind(this));
  }
}

export { World };
