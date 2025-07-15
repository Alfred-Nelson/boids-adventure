class Vector {
  x: number;
  y: number;
  z?: number = undefined;

  constructor({ x, y, z = undefined }: { x: number; y: number; z?: number }) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(vector: Vector) {
    this.x += vector.x;
    this.y += vector.y;

    const AzIsNum = Number.isInteger(vector.z);
    const BzIsNum = Number.isInteger(this.z);

    if (AzIsNum && BzIsNum) {
      this.z = (this.z || 0) + (vector.z || 0);
    } else if (!AzIsNum && !BzIsNum) {
    } else {
      throw new Error("Vectors must have the same number of dimensions");
    }

    return this;
  }

  normalize() {
    const sqr_x = this.x ** 2;
    const sqr_y = this.y ** 2;
    const sqr_z = this.z ? this.z ** 2 : 0;
    const length = Math.sqrt(sqr_x + sqr_y + sqr_z);
    this.x /= length;
    this.y /= length;
    if (this.z !== undefined) {
      this.z /= length;
    }

    return this;
  }

  /**
   * Scale the vector by a scalar. also known as scalar multiplication
   */
  scale(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    if (this.z !== undefined) {
      this.z *= scalar;
    }

    return this;
  }

  toCrossedProduct(vector: Vector) {
    if (this.z !== undefined && vector.z !== undefined) {
      const x = this.y * vector.z - this.z * vector.y;
      const y = this.z * vector.x - this.x * vector.z;
      const z = this.x * vector.y - this.y * vector.x;
      return new Vector({ x, y, z });
    } else if (this.z === undefined && vector.z === undefined) {
      return this.x * vector.y - this.y * vector.x;
    } else {
      throw new Error("Vectors must have the same number of dimensions");
    }
  }

  toDottedProduct(vector: Vector) {
    const AzIsNum = Number.isInteger(this.z);
    const BzIsNum = Number.isInteger(vector.z);

    if ((AzIsNum && BzIsNum) || (!AzIsNum && !BzIsNum)) {
      throw new Error("Vectors must have the same number of dimensions");
    }

    return (
      this.x * vector.x + this.y * vector.y + (this.z || 0) * (vector.z || 0)
    );
  }

  toNormalized(): Vector {
    const vector = new Vector({ x: this.x, y: this.y, z: this.z });
    return vector.normalize();
  }

  getAngle() {
    if (this.z === undefined) {
      return Math.atan2(this.y, this.x);
    } else if (this.z !== undefined) {
      // TODO: Implement 3D angle calculation
      return 0;
    } else {
      throw new Error("Vectors must have the same number of dimensions");
    }
  }
}

export default Vector;
