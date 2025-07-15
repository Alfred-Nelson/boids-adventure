import Vector from "./utils/vector";
import type { FlockingObject, WorldObject } from "./utils/types";

class Boid implements FlockingObject {
  speed = 300;
  position = new Vector({ x: 0, y: 0 });
  velocity = new Vector({ x: 0, y: 0 });
  angle = 0;

  constructor() {
    const randomX = 50 + Math.random() * (window.innerWidth - 100);
    const randomY = 50 + Math.random() * (window.innerHeight - 100);
    this.position = new Vector({ x: randomX, y: randomY });
    this.angle = Math.random() * 2 * Math.PI;
    this.velocity = new Vector({
      x: this.speed * Math.cos(this.angle),
      y: this.speed * Math.sin(this.angle),
    });
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

  private getSmoothBoundaryAvoidanceForce() {
    const boundary = 100;
    const maxForce = 200;
    let forceX = 0;
    let forceY = 0;
    const isRightBoundary = this.position.x > window.innerWidth - boundary;
    const isLeftBoundary = this.position.x < boundary;
    const isTopBoundary = this.position.y < boundary;
    const isBottomBoundary = this.position.y > window.innerHeight - boundary;

    if (isLeftBoundary) {
      const distance = this.position.x;
      const intensity = Math.max(0, (boundary - distance) / boundary);
      forceX = intensity * intensity * maxForce;
    }

    if (isRightBoundary) {
      const distance = window.innerWidth - this.position.x;
      const intensity = Math.max(0, (boundary - distance) / boundary);
      forceX = -intensity * intensity * maxForce;
    }

    if (isTopBoundary) {
      const distance = this.position.y;
      const intensity = Math.max(0, (boundary - distance) / boundary);
      forceY = intensity * intensity * maxForce;
    }

    if (isBottomBoundary) {
      const distance = window.innerHeight - this.position.y;
      const intensity = Math.max(0, (boundary - distance) / boundary);
      forceY = -intensity * intensity * maxForce;
    }

    return new Vector({ x: forceX, y: forceY });
  }

  decideMovement(deltaTime: number, neighbors: WorldObject[]) {
    const boundaryForce = this.getSmoothBoundaryAvoidanceForce();
    this.velocity.add(boundaryForce);

    this.velocity.normalize().scale(this.speed);
    this.angle = this.velocity.getAngle();

    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }
}

export default Boid;
