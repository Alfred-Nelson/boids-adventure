class Boid {
  speed = 150;
  position = { x: 0, y: 0 };
  velocity = { x: 0, y: 0 };
  angle = 0;

  constructor() {
    const randomX = 50 + Math.random() * (window.innerWidth - 100);
    const randomY = 50 + Math.random() * (window.innerHeight - 100);
    this.position = { x: randomX, y: randomY };
    this.angle = Math.random() * 2 * Math.PI;
    this.velocity = {
      x: this.speed * Math.cos(this.angle),
      y: this.speed * Math.sin(this.angle),
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle + Math.PI);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(15, 4);
    ctx.lineTo(15, -4);
    ctx.closePath();
    ctx.fillStyle = "#e8e5c3";
    ctx.fill();

    ctx.restore();
  }

  getBoundaryAvoidanceVelocity() {}

  decideMovement(deltaTime: number) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    if (this.position.x < 0 || this.position.x > window.innerWidth) {
      this.velocity.x = -this.velocity.x;
      this.angle = Math.atan2(this.velocity.y, this.velocity.x);
    }

    if (this.position.y < 0 || this.position.y > window.innerHeight) {
      this.velocity.y = -this.velocity.y;
      this.angle = Math.atan2(this.velocity.y, this.velocity.x);
    }
  }
}

export default Boid;
