import Boid from "./boid";
import "./style.css";
import World from "./world";

const world = new World();
const flock: Boid[] = [];

for (let i = 0; i < 50; i++) {
  const boid = new Boid();
  flock.push(boid);
  world.render(boid);
}

world.beginSimulationLoop(
  (deltaTime: number, ctx: CanvasRenderingContext2D | null) => {
    for (const boid of flock) {
      boid.decideMovement(deltaTime);
      boid.draw(ctx!);
    }
  }
);
