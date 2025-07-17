import type { WorldEntity } from "../components/world-entities";

class Region {
  x: number;
  y: number;
  width: number;
  height: number;
  objects: WorldEntity[] = [];

  constructor({
    x,
    y,
    width,
    height,
    objects = [],
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    objects?: WorldEntity[];
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    for (let object of objects) {
      this.checkBoundaryAndInsert(object);
    }
  }

  checkBoundaryAndInsert(object: WorldEntity) {
    const isInsideTheRegion =
      object.position.x >= this.x &&
      object.position.x < this.x + this.width &&
      object.position.y >= this.y &&
      object.position.y < this.y + this.height;
    if (isInsideTheRegion) {
      this.objects.push(object);
    }
  }
}

/**
 * here quadtree itelf is a region that has a smart way to divide itself into 4 regions
 */
class QuadTree {
  topLeft: QuadTree | null = null;
  topRight: QuadTree | null = null;
  bottomLeft: QuadTree | null = null;
  bottomRight: QuadTree | null = null;
  currentRegion: Region;
  maxObjects: number;
  isDivided: boolean = false;

  constructor({
    x,
    y,
    width,
    height,
    maxObjects,
    objects = [],
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    maxObjects: number;
    objects?: WorldEntity[];
  }) {
    this.maxObjects = maxObjects;
    this.currentRegion = new Region({ x, y, width, height });
    for (let object of objects || []) {
      this.insert(object);
    }
  }

  private checkIsDivided(): this is QuadTree & {
    topLeft: QuadTree;
    topRight: QuadTree;
    bottomLeft: QuadTree;
    bottomRight: QuadTree;
  } {
    return this.isDivided;
  }

  // this assertion makes any place that uses divide will have quadrants after divide being called.
  divide(): asserts this is QuadTree & {
    topLeft: QuadTree;
    topRight: QuadTree;
    bottomLeft: QuadTree;
    bottomRight: QuadTree;
  } {
    const curReg = this.currentRegion;
    this.topLeft = new QuadTree({
      x: curReg.x,
      y: curReg.y,
      width: curReg.width / 2,
      height: curReg.height / 2,
      maxObjects: this.maxObjects,
      objects: curReg.objects,
    });
    this.topRight = new QuadTree({
      x: curReg.x + curReg.width / 2,
      y: curReg.y,
      width: curReg.width / 2,
      height: curReg.height / 2,
      maxObjects: this.maxObjects,
      objects: curReg.objects,
    });
    this.bottomLeft = new QuadTree({
      x: curReg.x,
      y: curReg.y + curReg.height / 2,
      width: curReg.width / 2,
      height: curReg.height / 2,
      maxObjects: this.maxObjects,
      objects: curReg.objects,
    });
    this.bottomRight = new QuadTree({
      x: curReg.x + curReg.width / 2,
      y: curReg.y + curReg.height / 2,
      width: curReg.width / 2,
      height: curReg.height / 2,
      maxObjects: this.maxObjects,
      objects: curReg.objects,
    });
    this.isDivided = true;
  }

  insert(object: WorldEntity) {
    if (!this.isDivided) {
      if (this.currentRegion.objects.length < this.maxObjects) {
        this.currentRegion.checkBoundaryAndInsert(object);
      } else {
        this.divide();
        this.insert(object);
      }
    } else if (this.checkIsDivided()) {
      this.topLeft.insert(object);
      this.topRight.insert(object);
      this.bottomLeft.insert(object);
      this.bottomRight.insert(object);
    }
  }

  queryRegion(object: WorldEntity) {
    if (this.checkIsDivided()) {
      this.topLeft.queryRegion(object);
      this.topRight.queryRegion(object);
      this.bottomLeft.queryRegion(object);
      this.bottomRight.queryRegion(object);
    } else {
      return this.currentRegion;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "white";
    ctx.strokeRect(
      this.currentRegion.x,
      this.currentRegion.y,
      this.currentRegion.width,
      this.currentRegion.height
    );
    if (this.checkIsDivided()) {
      this.topLeft.draw(ctx);
      this.topRight.draw(ctx);
      this.bottomLeft.draw(ctx);
      this.bottomRight.draw(ctx);
    }
  }
}

export default QuadTree;
