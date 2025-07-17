import {
  EdgeAvoidanceStrategy,
  type MovementStrategy,
} from "./components/movements";
import type { World } from "./components/world";
import { Boid } from "./components/world-entities";

class FishFactory {
  worldRef: World;

  constructor(worldRef: World) {
    this.worldRef = worldRef;
  }

  getEdgeAvoidanceStrategy() {
    const boundary = {
      x: 0,
      y: 0,
      width: this.worldRef.ctx?.canvas.width || 0,
      height: this.worldRef.ctx?.canvas.height || 0,
    };
    return new EdgeAvoidanceStrategy().setBoundary(boundary);
  }

  createFish(fishType: string) {
    switch (fishType) {
      case "guppy": {
        const EdgeAvoidanceStrategy =
          this.getEdgeAvoidanceStrategy().setMaxForce(200);
        return new Guppy({ movementStrategies: [EdgeAvoidanceStrategy] });
      }
      default:
        throw new Error(`Fish type ${fishType} not found`);
    }
  }
}

class Guppy extends Boid {
  constructor({
    movementStrategies,
  }: {
    movementStrategies: MovementStrategy[];
  }) {
    super({ movementStrategies });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle + Math.PI);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(20, 6);
    ctx.lineTo(20, -6);
    ctx.closePath();
    ctx.fillStyle = "#e8e5c3";
    ctx.fill();

    ctx.restore();
  }
}

export { FishFactory, Guppy };
