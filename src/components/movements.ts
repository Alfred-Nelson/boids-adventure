import type { WorldEntity } from "./world-entities";
import Vector from "../utils/vector";
import type { BoundaryType } from "../utils/types";

//*********************************************
//*************** TYPES START *****************
//*********************************************

type MovementStrategyArgs = {
  object: WorldEntity;
  neighbors: WorldEntity[];
};

interface MovementStrategy {
  getVelocity(args: Partial<MovementStrategyArgs>): Vector | undefined;
}

type ValidatedEdgeAvoidance = {
  boundaryOffset: number;
  boundary: BoundaryType;
  maxForce: number;
};

//*********************************************
//*************** TYPES END *******************
//*********************************************

//*********************************************
//*************** MOVEMENTS START *************
//*********************************************
class EdgeAvoidanceStrategy implements MovementStrategy {
  boundaryOffset = 100;
  boundary: BoundaryType | null = null;
  maxForce = 200;

  setBoundary(boundary: BoundaryType) {
    this.boundary = boundary;
    return this;
  }

  setBoundaryOffset(boundaryOffset: number = 100) {
    this.boundaryOffset = boundaryOffset;
    return this;
  }

  setMaxForce(maxForce: number = 200) {
    this.maxForce = maxForce;
    return this;
  }

  private validateArgs(): asserts this is this & ValidatedEdgeAvoidance {
    if (!this.boundaryOffset || !this.boundary) {
      throw new Error("Boundary is not set");
    }
    if (!this.maxForce) {
      throw new Error("Max force is not set");
    }
    if (!this.boundary) {
      throw new Error("Boundary is not set");
    }
  }

  private getIntensity(distance: number) {
    let intensity = (this.boundaryOffset - distance) / this.boundaryOffset;
    intensity = Math.max(0, intensity);
    return intensity;
  }

  getVelocity({ object }: MovementStrategyArgs) {
    try {
      this.validateArgs();
      let forceX = 0;
      let forceY = 0;
      const isLeftBoundary = object.position.x < this.boundaryOffset;
      const isTopBoundary = object.position.y < this.boundaryOffset;
      const isRightBoundary =
        object.position.x > window.innerWidth - this.boundaryOffset;
      const isBottomBoundary =
        object.position.y > window.innerHeight - this.boundaryOffset;

      if (isLeftBoundary) {
        const distance = object.position.x;
        const intensity = this.getIntensity(distance);
        forceX = intensity * intensity * this.maxForce;
      }

      if (isRightBoundary) {
        const distance = window.innerWidth - object.position.x;
        const intensity = this.getIntensity(distance);
        forceX = -intensity * intensity * this.maxForce;
      }

      if (isTopBoundary) {
        const distance = object.position.y;
        const intensity = this.getIntensity(distance);
        forceY = intensity * intensity * this.maxForce;
      }

      if (isBottomBoundary) {
        const distance = window.innerHeight - object.position.y;
        const intensity = this.getIntensity(distance);
        forceY = -intensity * intensity * this.maxForce;
      }

      return new Vector({ x: forceX, y: forceY });
    } catch (e) {
      console.error(e);
    }
  }
}
//*********************************************
//*************** MOVEMENTS END ***************
//*********************************************

export { EdgeAvoidanceStrategy, type MovementStrategy };
