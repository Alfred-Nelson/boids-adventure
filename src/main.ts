import "./style.css";
import { World } from "./components/world";
import DebugControls from "./utils/debug-controls";
import { MobileEntity } from "./components/world-entities";
import { FishFactory } from "./fishes";

const debugControls = new DebugControls();

const world = new World({ debugControls });
const fishes: MobileEntity[] = [];

for (let i = 0; i < 500; i++) {
  const fishFactory = new FishFactory(world);
  const fish = fishFactory.createFish("guppy");
  fishes.push(fish);
  world.render(fish);
}

world.beginSimulationLoop((deltaTime: number) => {
  for (const fish of fishes) {
    const neighbors = world
      .getNeighbors(fish)
      .filter((each) => each instanceof MobileEntity);
    fish.decideMovement(deltaTime, neighbors);
    world.render(fish);
  }
});
