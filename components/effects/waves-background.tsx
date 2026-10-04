'use client';

import { useEffect, useRef } from 'react';

class Grad {
  constructor(
    public x: number,
    public y: number,
    public z: number
  ) {}
  dot2(x: number, y: number) {
    return this.x * x + this.y * y;
  }
}

class Noise {
  grad3: Grad[];
  p: number[];
  perm: number[];
  gradP: Grad[];

  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1, 1, 0),
      new Grad(-1, 1, 0),
      new Grad(1, -1, 0),
      new Grad(-1, -1, 0),
      new Grad(1, 0, 1),
      new Grad(-1, 0, 1),
      new Grad(1, 0, -1),
      new Grad(-1, 0, -1),
      new Grad(0, 1, 1),
      new Grad(0, -1, 1),
      new Grad(0, 1, -1),
      new Grad(0, -1, -1)
    ];
    this.p = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37,
      240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
      33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146,
      158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
      63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100,
      109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
      59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153,
      101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246,
      97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49,
      192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
      222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
    ];
    this.perm = new Array(512);
    this.gradP = new Array(512);
    this.seed(seed);
  }

  seed(seed: number) {
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;
    for (let i = 0; i < 256; i++) {
      const v = i & 1 ? this.p[i]! ^ (seed & 255) : this.p[i]! ^ ((seed >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12]!;
    }
  }

  fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
  }

  perlin2(x: number, y: number) {
    let X = Math.floor(x);
    let Y = Math.floor(y);
    x -= X;
    y -= Y;
    X &= 255;
    Y &= 255;
    const n00 = this.gradP[X + this.perm[Y]!]!.dot2(x, y);
    const n01 = this.gradP[X + this.perm[Y + 1]!]!.dot2(x, y - 1);
    const n10 = this.gradP[X + 1 + this.perm[Y]!]!.dot2(x - 1, y);
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]!]!.dot2(x - 1, y - 1);
    const u = this.fade(x);
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
  }
}

interface WavesBackgroundProps {
  lineColor?: string;
  backgroundColor?: string;
  className?: string;
}

/** Adapted from react-bits Waves — ocean line mesh background */
export function WavesBackground({
  lineColor = 'rgba(56, 189, 248, 0.18)',
  backgroundColor = 'transparent',
  className = ''
}: WavesBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current!;
    const containerEl = containerRef.current!;
    const context = canvasEl.getContext('2d');
    if (!context) return;
    const drawCtx: CanvasRenderingContext2D = context;

    const noise = new Noise(Math.random());
    let bounding = { width: 0, height: 0, left: 0, top: 0 };
    let lines: Array<
      Array<{
        x: number;
        y: number;
        wave: { x: number; y: number };
        cursor: { x: number; y: number; vx: number; vy: number };
      }>
    > = [];
    let frameId = 0;
    const mouse = { x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false };
    const config = {
      lineColor,
      waveSpeedX: 0.0125,
      waveSpeedY: 0.005,
      waveAmpX: 28,
      waveAmpY: 14,
      friction: 0.925,
      tension: 0.005,
      maxCursorMove: 80,
      xGap: 12,
      yGap: 28
    };

    function setSize() {
      bounding = containerEl.getBoundingClientRect();
      canvasEl.width = bounding.width;
      canvasEl.height = bounding.height;
    }

    function setLines() {
      const { width, height } = bounding;
      lines = [];
      const oWidth = width + 200;
      const oHeight = height + 30;
      const totalLines = Math.ceil(oWidth / config.xGap);
      const totalPoints = Math.ceil(oHeight / config.yGap);
      const xStart = (width - config.xGap * totalLines) / 2;
      const yStart = (height - config.yGap * totalPoints) / 2;
      for (let i = 0; i <= totalLines; i++) {
        const pts = [];
        for (let j = 0; j <= totalPoints; j++) {
          pts.push({
            x: xStart + config.xGap * i,
            y: yStart + config.yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 }
          });
        }
        lines.push(pts);
      }
    }

    function moved(
      point: (typeof lines)[0][0],
      withCursor = true
    ) {
      const x = point.x + point.wave.x + (withCursor ? point.cursor.x : 0);
      const y = point.y + point.wave.y + (withCursor ? point.cursor.y : 0);
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    }

    function tick(t: number) {
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;
      const dx = mouse.x - mouse.lx;
      const dy = mouse.y - mouse.ly;
      const d = Math.hypot(dx, dy);
      mouse.v = d;
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs = Math.min(100, mouse.vs);
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.a = Math.atan2(dy, dx);

      lines.forEach((pts) => {
        pts.forEach((p) => {
          const move =
            noise.perlin2((p.x + t * config.waveSpeedX) * 0.002, (p.y + t * config.waveSpeedY) * 0.0015) * 12;
          p.wave.x = Math.cos(move) * config.waveAmpX;
          p.wave.y = Math.sin(move) * config.waveAmpY;
          const dist = Math.hypot(p.x - mouse.sx, p.y - mouse.sy);
          const l = Math.max(175, mouse.vs);
          if (dist < l) {
            const s = 1 - dist / l;
            const f = Math.cos(dist * 0.001) * s;
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
          }
          p.cursor.vx += (0 - p.cursor.x) * config.tension;
          p.cursor.vy += (0 - p.cursor.y) * config.tension;
          p.cursor.vx *= config.friction;
          p.cursor.vy *= config.friction;
          p.cursor.x += p.cursor.vx * 2;
          p.cursor.y += p.cursor.vy * 2;
          p.cursor.x = Math.min(config.maxCursorMove, Math.max(-config.maxCursorMove, p.cursor.x));
          p.cursor.y = Math.min(config.maxCursorMove, Math.max(-config.maxCursorMove, p.cursor.y));
        });
      });

      drawCtx.clearRect(0, 0, bounding.width, bounding.height);
      drawCtx.beginPath();
      drawCtx.strokeStyle = config.lineColor;
      lines.forEach((points) => {
        let p1 = moved(points[0]!, false);
        drawCtx.moveTo(p1.x, p1.y);
        points.forEach((p, idx) => {
          const isLast = idx === points.length - 1;
          p1 = moved(p, !isLast);
          const p2 = moved(points[idx + 1] || points[points.length - 1]!, !isLast);
          drawCtx.lineTo(p1.x, p1.y);
          if (isLast) drawCtx.moveTo(p2.x, p2.y);
        });
      });
      drawCtx.stroke();
      frameId = requestAnimationFrame(tick);
    }

    function updateMouse(x: number, y: number) {
      mouse.x = x - bounding.left;
      mouse.y = y - bounding.top;
      if (!mouse.set) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.set = true;
      }
    }

    const onResize = () => {
      setSize();
      setLines();
    };
    const onMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);

    setSize();
    setLines();
    frameId = requestAnimationFrame(tick);
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [lineColor]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ backgroundColor }}
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
