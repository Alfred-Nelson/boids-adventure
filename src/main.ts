import Boid from "./boid";
import "./style.css";
import World from "./world";
import DebugControls from "./utils/debug-controls";

const debugControls = new DebugControls();

const world = new World(debugControls);
const flock: Boid[] = [];

for (let i = 0; i < 20; i++) {
  const boid = new Boid();
  flock.push(boid);
  world.render(boid);
}

world.beginSimulationLoop((deltaTime: number) => {
  for (const boid of flock) {
    const neighbors = world.getNeighbors(boid);
    boid.decideMovement(deltaTime, neighbors);
    world.render(boid);
  }
});
