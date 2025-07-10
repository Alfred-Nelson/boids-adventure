// shows an object in the world
export interface WorldObject {
  draw(ctx: CanvasRenderingContext2D): void;
  decideMovement(deltaTime: number): void;
}
