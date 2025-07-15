import type Vector from "./vector";

export interface WorldObject {
  position: Vector;
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface FlockingObject extends WorldObject {
  decideMovement(deltaTime: number, neighbors: WorldObject[]): void;
}
