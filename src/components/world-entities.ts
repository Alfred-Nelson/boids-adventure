import Vector from "../utils/vector";
import type { MovementStrategy } from "./movements";

interface WorldEntity {
  position: Vector;
  draw(ctx: CanvasRenderingContext2D): void;
}

type MobileEntityConstructorArgs = {
  movementStrategies: MovementStrategy[];
};

abstract class MobileEntity implements WorldEntity {
  speed = 300;
  position = new Vector({ x: 0, y: 0 });
  velocity = new Vector({ x: 0, y: 0 });
  angle = 0;
  movementStrategies: MovementStrategy[] = [];

  /**
   * Does 3 things:
   * 1. Sets the position of the entity
   * 2. Sets the velocity of the entity
   * 3. Sets the movement strategies of the entity
   */
  constructor({ movementStrategies }: MobileEntityConstructorArgs) {
    const randomX = 50 + Math.random() * (window.innerWidth - 100);
    const randomY = 50 + Math.random() * (window.innerHeight - 100);
    this.position = new Vector({ x: randomX, y: randomY });

    this.angle = Math.random() * 2 * Math.PI;
    const vx = this.speed * Math.cos(this.angle);
    const vy = this.speed * Math.sin(this.angle);
    this.velocity = new Vector({ x: vx, y: vy });

    this.movementStrategies = movementStrategies;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;

  /**
   * Applies the movement strategies to the entity
   * 1. Gets the velocity from the movement strategies
   * 2. Adds the velocity to the entity's velocity
   * 3. Calculates the angle of the entity
   * 4. Updates the entity's position based on the calculated velocity
   */
  decideMovement(deltaTime: number, neighbors: MobileEntity[]) {
    for (const movementStrategy of this.movementStrategies) {
      const movementArgs = { object: this, neighbors };
      const velocity = movementStrategy.getVelocity(movementArgs);
      if (velocity) {
        this.velocity.add(velocity);
      }
    }

    this.velocity.normalize().scale(this.speed);
    this.angle = this.velocity.getAngle();

    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }
}

/**
 * Boid is a mobile entity that follows the flocking behavior
 * flocking behaviour created by craig reynolds
 * https://vanhunteradams.com/Pico/Animal_Movement/Boids-algorithm.html
 */
abstract class Boid extends MobileEntity {
  constructor({ movementStrategies }: MobileEntityConstructorArgs) {
    super({ movementStrategies });
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
}

export { MobileEntity, Boid, type WorldEntity };
