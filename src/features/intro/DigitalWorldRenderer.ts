import type { MotionValue } from 'framer-motion';
import type { RefObject } from 'react';

type Point = readonly [number, number, number];
type ScreenPoint = readonly [number, number];
type Settings = {
  reducedMotion: boolean;
  active: boolean;
  variant: 'full' | 'short' | 'still';
};
type Building = {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  start: number;
  accent: boolean;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;
const smooth = (from: number, to: number, value: number) => {
  const p = clamp((value - from) / (to - from));
  return p * p * (3 - 2 * p);
};
const cubic = (p: number) => 1 - Math.pow(1 - clamp(p), 3);
const mixPoint = (a: Point, b: Point, p: number): Point => [
  lerp(a[0], b[0], p),
  lerp(a[1], b[1], p),
  lerp(a[2], b[2], p),
];
const length = (a: Point, b: Point) =>
  Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);

// Seeded geometry remains stable across frames, devices and route visits.
function makeCity() {
  let seed = 147;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const city: Building[] = [];
  for (let row = 0; row < 9; row++) {
    for (let side = -1; side <= 1; side += 2) {
      const z = 33 + row * 19 + random() * 8;
      city.push({
        x: side * (15 + random() * 10),
        z,
        width: 3.5 + random() * 5,
        depth: 5 + random() * 8,
        height: 7 + random() * 25,
        start: 0.38 + row * 0.021 + random() * 0.08,
        accent: row % 3 === 1,
      });
      city.push({
        x: side * (34 + random() * 21),
        z: z + 7,
        width: 5 + random() * 9,
        depth: 5 + random() * 12,
        height: 9 + random() * 35,
        start: 0.43 + row * 0.018 + random() * 0.08,
        accent: false,
      });
    }
  }
  // A few deliberately composed silhouettes make the skyline feel designed.
  city.push({
    x: 4,
    z: 85,
    width: 7,
    depth: 9,
    height: 44,
    start: 0.46,
    accent: true,
  });
  city.push({
    x: -9,
    z: 112,
    width: 5,
    depth: 7,
    height: 36,
    start: 0.5,
    accent: false,
  });
  return city.sort((a, b) => b.z - a.z);
}

const city = makeCity();
const trails: readonly Point[][] = [
  [
    [-45, 0.04, 61],
    [-13, 0.04, 61],
    [-13, 0.04, 85],
    [4, 0.04, 85],
    [4, 44, 85],
  ],
  [
    [-13, 0.04, 61],
    [15, 0.04, 61],
    [15, 0.04, 42],
    [25, 0.04, 42],
    [25, 19, 42],
  ],
  [
    [44, 0.05, 116],
    [19, 0.05, 116],
    [19, 0.05, 86],
    [4, 0.05, 86],
    [4, 44, 86],
  ],
  [
    [4, 0.05, 85],
    [4, 0.05, 49],
    [-9, 0.05, 49],
    [-9, 0.05, 28],
    [-46, 0.05, 28],
  ],
];

/** Small projected line engine; no WebGL dependency, asset loading or React frame renders. */
export function createDigitalWorld(
  canvas: HTMLCanvasElement,
  progress: MotionValue<number>,
  scrollProgress: MotionValue<number>,
  settings: RefObject<Settings>
) {
  let context: CanvasRenderingContext2D | null;
  try {
    context = canvas.getContext('2d', { alpha: false });
  } catch {
    return () => {};
  }
  if (!context) return () => {};
  const ctx = context;
  let width = 0,
    height = 0,
    dpr = 1;
  let visible = !document.hidden,
    intersecting = true,
    disposed = false;
  let frame = 0,
    previousFrame = 0;
  let pointerX = 0,
    pointerY = 0,
    targetX = 0,
    targetY = 0;
  const compact = () =>
    width < 760 || (navigator.hardwareConcurrency || 8) <= 4;
  let centerX = 0,
    horizon = 0,
    focal = 0,
    cameraY = 0,
    cameraZ = 0,
    cameraX = 0,
    verticalScale = 1;

  function project(point: Point): ScreenPoint | null {
    const depth = point[2] - cameraZ;
    if (depth <= 2) return null;
    return [
      centerX + ((point[0] - cameraX) * focal) / depth,
      horizon + ((cameraY - point[1]) * focal * verticalScale) / depth,
    ];
  }

  function stroke(
    a: Point,
    b: Point,
    color: string,
    opacity: number,
    thickness = 0.75,
    glow = false
  ) {
    if (opacity < 0.004) return;
    const A = project(a),
      B = project(b);
    if (!A || !B) return;
    ctx.beginPath();
    ctx.moveTo(A[0], A[1]);
    ctx.lineTo(B[0], B[1]);
    if (glow && !compact()) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity * 0.08;
      ctx.lineWidth = 7;
      ctx.stroke();
      ctx.globalAlpha = opacity * 0.13;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = thickness;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function face(points: Point[], fill: string, opacity: number) {
    const projected = points.map(project);
    if (projected.some((point) => !point)) return;
    ctx.beginPath();
    projected.forEach((point, i) => {
      if (!point) return;
      if (i === 0) ctx.moveTo(point[0], point[1]);
      else ctx.lineTo(point[0], point[1]);
    });
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.globalAlpha = opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawBuilding(
    building: Building,
    p: number,
    settle: number,
    index: number
  ) {
    const grown = smooth(building.start, building.start + 0.18, p);
    if (grown === 0) return;
    const { x, z, width: w, depth: d, height: h, accent } = building;
    const top = h * cubic(grown);
    const fog = Math.exp(-(z - cameraZ) / 190);
    const near = clamp((z - cameraZ - 12) / 24);
    const illumination = fog * near * lerp(0.7, 0.3, settle);
    const a: Point = [x, 0, z],
      b: Point = [x + w, 0, z],
      c: Point = [x + w, 0, z + d],
      e: Point = [x, 0, z + d];
    const A: Point = [x, top, z],
      B: Point = [x + w, top, z],
      C: Point = [x + w, top, z + d],
      E: Point = [x, top, z + d];
    const surface = smooth(0.55, 0.98, grown) * illumination;
    face([a, b, B, A], accent ? '#12252c' : '#101a21', surface * 0.7);
    face([b, c, C, B], '#10202a', surface * 0.45);
    face([A, B, C, E], '#19313b', surface * 0.42);
    const edge = accent ? '#377585' : '#305160';
    const edges: [Point, Point][] = [
      [a, A],
      [b, B],
      [c, C],
      [A, B],
      [B, C],
      [C, E],
      [E, A],
      [a, b],
      [b, c],
    ];
    for (const [from, to] of edges)
      stroke(from, to, edge, illumination, accent ? 0.9 : 0.7);
    // The travelling cap and corner edges are the recent construction; old geometry stays dim.
    const activeEdge = Math.sin(grown * Math.PI) * fog * 0.9;
    if (activeEdge > 0.03) {
      stroke(A, B, '#67dcf2', activeEdge, 1.05, true);
      stroke(B, C, '#67dcf2', activeEdge * 0.8, 0.9);
      stroke([x, top * 0.75, z], A, '#4bcbe5', activeEdge * 0.65, 0.8);
    }
    if (!compact() || index % 2 === 0) {
      const floors = Math.min(6, Math.floor(h / 5));
      for (let floor = 1; floor < floors; floor++) {
        const y = (h * floor) / floors;
        if (y > top) continue;
        stroke([x, y, z], [x + w, y, z], edge, illumination * 0.35, 0.55);
        if (accent)
          stroke(
            [x + w, y, z],
            [x + w, y, z + d],
            edge,
            illumination * 0.25,
            0.5
          );
      }
    }
  }

  function drawGate(p: number, settle: number) {
    const growth = smooth(0.45, 0.7, p);
    if (!growth) return;
    // A deliberately empty gateway gives the environment a destination and a sense of scale.
    const opacity = lerp(0.58, 0.2, settle) * growth;
    const top = 32 * cubic(growth);
    const z = 105;
    const edges: [Point, Point][] = [
      [
        [-10, 0, z],
        [-10, top, z],
      ],
      [
        [10, 0, z],
        [10, top, z],
      ],
      [
        [-10, top, z],
        [10, top, z],
      ],
      [
        [-10, 0, z + 5],
        [-10, top, z + 5],
      ],
      [
        [10, 0, z + 5],
        [10, top, z + 5],
      ],
      [
        [-10, top, z + 5],
        [10, top, z + 5],
      ],
      [
        [-10, top, z],
        [-10, top, z + 5],
      ],
      [
        [10, top, z],
        [10, top, z + 5],
      ],
    ];
    for (const [a, b] of edges) stroke(a, b, '#3b879a', opacity, 1);
    const sweep = smooth(0.52, 0.72, p);
    if (sweep > 0 && sweep < 1) {
      stroke(
        [-10, top, z],
        [lerp(-10, 10, sweep), top, z],
        '#8deafa',
        Math.sin(sweep * Math.PI) * 0.9,
        1.2,
        true
      );
    }
  }

  function drawTrail(
    path: readonly Point[],
    head: number,
    alpha: number,
    tail = 0.18
  ) {
    if (head < 0 || head > 1 + tail || alpha <= 0) return;
    const sizes = path.slice(1).map((point, i) => length(path[i], point));
    const total = sizes.reduce((sum, size) => sum + size, 0);
    let offset = 0;
    sizes.forEach((size, i) => {
      const start = offset / total,
        end = (offset + size) / total;
      offset += size;
      const from = Math.max(start, head - tail),
        to = Math.min(end, head);
      if (to <= from) return;
      const a = mixPoint(path[i], path[i + 1], (from - start) / (end - start));
      const b = mixPoint(path[i], path[i + 1], (to - start) / (end - start));
      const intensity = alpha * (0.25 + 0.75 * ((to - (head - tail)) / tail));
      stroke(a, b, '#64e0f4', intensity, 1.15, true);
      if (head >= start && head <= end) {
        const screen = project(b);
        if (!screen) return;
        ctx.fillStyle = '#c3f7ff';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(screen[0], screen[1], 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
  }

  function draw(now: number) {
    if (!width || !height || !settings.current) return;
    const { reducedMotion, variant } = settings.current;
    const raw = clamp(progress.get());
    const p =
      reducedMotion || variant === 'still'
        ? 1
        : variant === 'short'
          ? lerp(0.18, 1, cubic(raw))
          : raw;
    const scroll = reducedMotion ? 0 : clamp(scrollProgress.get());
    const settled = smooth(0.76, 1, p);
    const moving = smooth(0.24, 0.84, p);
    const desktop = width >= 760;
    pointerX = lerp(pointerX, targetX, 0.055);
    pointerY = lerp(pointerY, targetY, 0.055);
    const shift = desktop ? 0.71 : 0.61;
    centerX =
      width * lerp(0.5, shift, settled) +
      (reducedMotion ? 0 : pointerX * 4 * settled);
    horizon =
      height * (lerp(0.55, 0.52, settled) - scroll * 0.11) +
      (reducedMotion ? 0 : pointerY * 2);
    focal = Math.min(width * 0.76, height * 1.08) * lerp(0.9, 1.1, moving);
    cameraY = lerp(8.6, 9.8, moving) + scroll * 6;
    cameraZ = lerp(-36, 8, moving);
    cameraX = reducedMotion ? 0 : pointerX * 0.35 * settled;
    verticalScale = lerp(1, 0.84, settled) - scroll * 0.35;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#080b0e';
    ctx.fillRect(0, 0, width, height);

    const horizonFormation = smooth(0.16, 0.25, p);
    if (horizonFormation > 0) {
      const halo = ctx.createRadialGradient(
        centerX,
        horizon,
        0,
        centerX,
        horizon,
        Math.max(width * 0.42, height * 0.45)
      );
      halo.addColorStop(0, `rgba(17,66,82,${0.12 * horizonFormation})`);
      halo.addColorStop(0.4, `rgba(12,37,48,${0.1 * horizonFormation})`);
      halo.addColorStop(1, 'rgba(8,11,14,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);
      const half = width * 0.65 * cubic(horizonFormation);
      const horizonGradient = ctx.createLinearGradient(
        centerX - half,
        horizon,
        centerX + half,
        horizon
      );
      horizonGradient.addColorStop(0, 'rgba(53,166,200,0)');
      horizonGradient.addColorStop(
        0.4,
        `rgba(76,188,215,${lerp(0.6, 0.18, settled) * horizonFormation})`
      );
      horizonGradient.addColorStop(
        0.6,
        `rgba(76,188,215,${lerp(0.6, 0.18, settled) * horizonFormation})`
      );
      horizonGradient.addColorStop(1, 'rgba(53,166,200,0)');
      ctx.strokeStyle = horizonGradient;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(centerX - half, horizon);
      ctx.lineTo(centerX + half, horizon);
      ctx.stroke();
    }

    if (p > 0.23) {
      const gridAlpha = lerp(0.3, 0.17, settled) * (1 - scroll * 0.2);
      const divisions = compact() ? 13 : 23;
      for (let i = 0; i < divisions; i++) {
        const x = (i - (divisions - 1) / 2) * 8;
        const delay = Math.abs(i - (divisions - 1) / 2) * 0.003;
        const reveal = smooth(0.24 + delay, 0.45 + delay, p);
        if (!reveal) continue;
        const endZ = lerp(310, 14, cubic(reveal));
        stroke([x, 0, 310], [x, 0, endZ], '#2b5867', gridAlpha, 0.6);
        if (reveal < 1)
          stroke(
            [x, 0, endZ + 12],
            [x, 0, endZ],
            '#62d4eb',
            Math.sin(reveal * Math.PI) * 0.7,
            0.9,
            true
          );
      }
      const depths = [19, 25, 33, 44, 58, 76, 99, 127, 162, 205, 260, 330, 420];
      depths.forEach((z, i) => {
        const reveal = smooth(
          0.33 + (depths.length - i) * 0.009,
          0.43 + (depths.length - i) * 0.009,
          p
        );
        if (!reveal) return;
        const extent = lerp(0, 120, cubic(reveal));
        const opacity = gridAlpha * Math.exp(-(z - cameraZ) / 250);
        stroke([-extent, 0, z], [extent, 0, z], '#315968', opacity, 0.6);
        if (reveal < 1) {
          stroke(
            [-extent, 0, z],
            [-extent * 0.8, 0, z],
            '#4fc8e3',
            Math.sin(reveal * Math.PI) * 0.55,
            0.9
          );
          stroke(
            [extent * 0.8, 0, z],
            [extent, 0, z],
            '#4fc8e3',
            Math.sin(reveal * Math.PI) * 0.55,
            0.9
          );
        }
      });
      for (let i = 0; i < city.length; i++)
        if (!compact() || i % 3 !== 0) drawBuilding(city[i], p, settled, i);
      drawGate(p, settled);
      if (!reducedMotion) {
        if (p < 0.94) {
          drawTrail(trails[0], (p - 0.39) / 0.25, 0.85, 0.16);
          drawTrail(trails[1], (p - 0.49) / 0.23, 0.7, 0.18);
          drawTrail(trails[2], (p - 0.55) / 0.24, 0.8, 0.16);
          drawTrail(trails[3], (p - 0.72) / 0.22, 0.9, 0.22);
        } else {
          const cycle = (now / 1000) % 14;
          if (cycle < 2.1) drawTrail(trails[0], cycle / 1.7, 0.45, 0.12);
          if (cycle > 0.5 && cycle < 2.4)
            drawTrail(trails[1], (cycle - 0.5) / 1.6, 0.35, 0.13);
        }
      }
    }

    // The information stream crosses the view and becomes the hero's construction guide.
    const crossing = smooth(0.81, 0.94, p);
    if (crossing > 0 && crossing < 1) {
      const y = height * lerp(0.64, 0.77, crossing),
        x = lerp(-width * 0.1, width * 1.3, cubic(crossing));
      const trail = ctx.createLinearGradient(
        Math.max(-width * 0.2, x - width * 0.4),
        y,
        x + 1,
        y
      );
      trail.addColorStop(0, 'rgba(76,210,238,0)');
      trail.addColorStop(0.94, 'rgba(76,210,238,.35)');
      trail.addColorStop(1, 'rgba(176,244,255,.9)');
      ctx.strokeStyle = trail;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x - width * 0.4, y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    if (p < 0.28 && p > 0.065) {
      const pointArrival = smooth(0.065, 0.1, p);
      const pulse = Math.sin(clamp((p - 0.08) / 0.09) * Math.PI);
      const y = height * lerp(0.6, 0.55, smooth(0.11, 0.18, p));
      const pointAlpha = pointArrival * (1 - smooth(0.19, 0.28, p));
      const glow = ctx.createRadialGradient(
        width * 0.5,
        y,
        0,
        width * 0.5,
        y,
        8 + pulse * 12
      );
      glow.addColorStop(0, `rgba(100,221,246,${pointAlpha * 0.38})`);
      glow.addColorStop(1, 'rgba(53,166,200,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(width * 0.5, y, 8 + pulse * 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(172,244,255,${pointAlpha})`;
      ctx.beginPath();
      ctx.arc(width * 0.5, y, 1.1 + pulse * 0.65, 0, Math.PI * 2);
      ctx.fill();
      const stem = smooth(0.105, 0.18, p);
      if (stem) {
        ctx.strokeStyle = `rgba(72,202,230,${pointAlpha * 0.7})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(width * 0.5, height * 0.6);
        ctx.lineTo(width * 0.5, lerp(height * 0.6, horizon, stem));
        ctx.stroke();
      }
    }

    // A dark reading zone grows naturally as the scene aligns with the real hero layout.
    if (settled > 0) {
      const reading = ctx.createLinearGradient(0, 0, width, 0);
      reading.addColorStop(0, `rgba(8,11,14,${settled * 0.97})`);
      reading.addColorStop(
        desktop ? 0.32 : 0.1,
        `rgba(8,11,14,${settled * 0.87})`
      );
      reading.addColorStop(
        desktop ? 0.6 : 0.65,
        `rgba(8,11,14,${settled * 0.2})`
      );
      reading.addColorStop(1, 'rgba(8,11,14,0)');
      ctx.fillStyle = reading;
      ctx.fillRect(0, 0, width, height);
    }
    const bottom = ctx.createLinearGradient(0, height * 0.76, 0, height);
    bottom.addColorStop(0, 'rgba(8,11,14,0)');
    bottom.addColorStop(1, 'rgba(8,11,14,.65)');
    ctx.fillStyle = bottom;
    ctx.fillRect(0, height * 0.76, width, height * 0.24);

    // A physical gateway unfolds into the exact rails of the HTML page shell.
    // Its last drawn edges meet the real borders as those borders become visible.
    const alignment = smooth(0.79, 1, p);
    if (desktop && alignment > 0 && alignment < 1) {
      const gutter = width <= 900 ? 24 : Math.max(48, (width - 1240) / 2);
      const structure: Point[] = [
        [-10, 32, 105],
        [10, 32, 105],
        [10, 0, 105],
        [-10, 0, 105],
      ];
      const rails: ScreenPoint[] = [
        [gutter, 0],
        [width - gutter, 0],
        [width - gutter, height - 1],
        [gutter, height - 1],
      ];
      const corners = structure.map((point, index) => {
        const screen = project(point);
        if (!screen) return rails[index];
        return [
          lerp(screen[0], rails[index][0], alignment),
          lerp(screen[1], rails[index][1], alignment),
        ] as ScreenPoint;
      });
      ctx.strokeStyle = '#4b9bb0';
      ctx.lineWidth = 0.65;
      ctx.globalAlpha = Math.sin(alignment * Math.PI) * 0.3;
      ctx.beginPath();
      corners.forEach((point, index) =>
        index ? ctx.lineTo(point[0], point[1]) : ctx.moveTo(point[0], point[1])
      );
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function tick(now: number) {
    frame = 0;
    if (disposed || !visible || !intersecting) return;
    const config = settings.current;
    const fps = config?.active && !compact() ? 60 : compact() ? 24 : 30;
    if (now - previousFrame > 1000 / fps) {
      previousFrame = now;
      draw(now);
    }
    if (!config?.reducedMotion) frame = requestAnimationFrame(tick);
  }
  function requestDraw() {
    if (disposed || !visible || !intersecting) return;
    if (settings.current?.reducedMotion) {
      draw(performance.now());
      return;
    }
    if (!frame) frame = requestAnimationFrame(tick);
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(
      window.devicePixelRatio || 1,
      compact() ? 1.25 : 1.5,
      Math.sqrt(4_000_000 / Math.max(1, width * height))
    );
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    draw(performance.now());
    requestDraw();
  }
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || settings.current?.reducedMotion)
      return;
    targetX = clamp(event.clientX / window.innerWidth) * 2 - 1;
    targetY = clamp(event.clientY / window.innerHeight) * 2 - 1;
  };
  const onVisibility = () => {
    visible = !document.hidden;
    if (!visible) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else requestDraw();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      intersecting = entry.isIntersecting;
      if (!intersecting) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else requestDraw();
    },
    { rootMargin: '100px' }
  );
  intersectionObserver.observe(canvas);
  const unwatchProgress = progress.on('change', requestDraw);
  const unwatchScroll = scrollProgress.on('change', requestDraw);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pointermove', onPointer, { passive: true });
  resize();
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    unwatchProgress();
    unwatchScroll();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pointermove', onPointer);
  };
}
