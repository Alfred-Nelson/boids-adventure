/**
 * handles 3 tasks:
 * 1. Pause/Play
 * 2. Show/Hide QuadTree
 * 3. Display FPS
 */
export default class DebugControls {
  private pauseButton: HTMLButtonElement | null = null;
  private boundaryLinesButton: HTMLButtonElement | null = null;
  private fpsDisplay: HTMLDivElement | null = null;
  private isPaused = false;
  private showBoundaryLines = false;

  // FPS tracking
  private frameCount = 0;
  private lastFpsUpdate = 0;
  private currentFps = 0;

  private setupPauseButton(): void {
    this.pauseButton = document.createElement("button");
    this.pauseButton.textContent = "⏸️ Pause";
    this.pauseButton.className = "primary-btn";
    this.pauseButton.id = "debug-pause-btn";

    this.pauseButton.addEventListener("click", () => {
      this.togglePause();
    });

    document.body.appendChild(this.pauseButton);

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        this.togglePause();
      }
    });
  }

  private setupBoundaryLinesButton(): void {
    this.boundaryLinesButton = document.createElement("button");
    this.boundaryLinesButton.textContent = "🗺️ Show QuadTree";
    this.boundaryLinesButton.className = "primary-btn";
    this.boundaryLinesButton.id = "debug-boundary-lines-btn";

    this.boundaryLinesButton.addEventListener("click", () => {
      this.toggleBoundaryLines();
    });

    document.body.appendChild(this.boundaryLinesButton);

    document.addEventListener("keydown", (e) => {
      console.log(e.code, e.metaKey, e.target);
      if (e.code === "KeyB" && e.metaKey && e.target === document.body) {
        e.preventDefault();
        this.toggleBoundaryLines();
      }
    });
  }

  private setupFpsDisplay(): void {
    this.fpsDisplay = document.createElement("div");
    this.fpsDisplay.textContent = "FPS: --";
    this.fpsDisplay.id = "debug-fps-display";
    document.body.appendChild(this.fpsDisplay);
  }

  setupDebugControls(): void {
    this.setupPauseButton();
    this.setupBoundaryLinesButton();
    this.setupFpsDisplay();
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;

    if (this.pauseButton) {
      this.pauseButton.textContent = this.isPaused ? "▶️ Play" : "⏸️ Pause";
    }
  }

  private toggleBoundaryLines(): void {
    this.showBoundaryLines = !this.showBoundaryLines;

    if (this.boundaryLinesButton) {
      this.boundaryLinesButton.textContent = this.showBoundaryLines
        ? "🗺️ Hide QuadTree"
        : "🗺️ Show QuadTree";
    }
  }

  private updateFpsDisplay(): void {
    if (this.fpsDisplay) {
      this.fpsDisplay.textContent = `FPS: ${this.currentFps}`;
    }
  }

  getPaused(): boolean {
    return this.isPaused;
  }

  getShowBoundaryLines(): boolean {
    return this.showBoundaryLines;
  }

  public recordFrame(): void {
    this.frameCount++;
    const now = performance.now();

    if (now - this.lastFpsUpdate >= 1000) {
      this.currentFps = this.frameCount;
      this.updateFpsDisplay();
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
  }

  destroy(): void {
    if (this.pauseButton) {
      this.pauseButton.remove();
      this.pauseButton = null;
    }
    if (this.boundaryLinesButton) {
      this.boundaryLinesButton.remove();
      this.boundaryLinesButton = null;
    }
    if (this.fpsDisplay) {
      this.fpsDisplay.remove();
      this.fpsDisplay = null;
    }
  }
}
