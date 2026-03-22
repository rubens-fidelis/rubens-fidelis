/**
 * bg-diagram.js
 * Animated architecture-diagram parallax background.
 *
 * Three layers of component boxes (far / mid / near) float at different depths.
 * Each layer responds to cursor movement and page scroll at different rates,
 * creating a parallax depth effect. Boxes are connected by nearest-neighbour
 * lines, styled to resemble a software architecture diagram.
 */

// ─── Config ──────────────────────────────────────────────────────────────────

const ACCENT = '91,155,213'; // matches --accent-rgb in style.css

/**
 * Layer definitions — tune alpha / speed values here without touching logic.
 *
 * @property {number}   count        Base node density (nodes per viewport height — scales with page length)
 * @property {number[]} wRange       [min, max] box width in px
 * @property {number[]} hRange       [min, max] box height in px
 * @property {number}   alpha        Base opacity for boxes and edges
 * @property {number}   mouseSpeed   Parallax strength for cursor movement
 * @property {number}   scrollSpeed  Parallax strength for scroll position
 * @property {number}   fontSize     Label font size (0 = no labels)
 * @property {number}   knn          Nearest neighbours each node connects to
 * @property {number}   edgeAlpha    Edge opacity multiplier (applied to alpha)
 * @property {number[]} dash         Canvas line-dash pattern ([] = solid)
 */
const LAYERS = [
  // Far — most transparent, slowest, dashed edges
  {
    count: 40, wRange: [18, 30], hRange: [10, 16],
    alpha: 0.25, mouseSpeed: 0.006, scrollSpeed: 0.05,
    fontSize: 0,   knn: 2, edgeAlpha: 0.65, dash: [3, 6],
  },
  // Mid
  {
    count: 25, wRange: [26, 44], hRange: [13, 21],
    alpha: 0.30, mouseSpeed: 0.017, scrollSpeed: 0.13,
    fontSize: 0,   knn: 3, edgeAlpha: 0.70, dash: [3, 4],
  },
  // Near — solid edges, micro-labels
  {
    count: 15,  wRange: [36, 56], hRange: [16, 26],
    alpha: 0.35, mouseSpeed: 0.034, scrollSpeed: 0.25,
    fontSize: 5.5, knn: 3, edgeAlpha: 0.75, dash: [],
  },
];

const NODE_LABELS = [
  'svc', 'api', 'db', 'queue', 'cache', 'auth',
  'gw', 'cdn', 'broker', 'store', 'worker', 'proxy',
  'mesh', 'repo', 'bus', 'handler', 'router', 'emitter',
];

// ─── Canvas setup ─────────────────────────────────────────────────────────────

const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

// ─── Input state ──────────────────────────────────────────────────────────────

const mouse   = { x: 0, y: 0 };
const tMouse  = { x: 0, y: 0 }; // raw target, smoothed into mouse each frame
let scrollY   = 0;
let tScrollY  = 0;

function onMouseMove(e) {
  tMouse.x = e.clientX - W / 2;
  tMouse.y = e.clientY - H / 2;
}

function onTouchMove(e) {
  tMouse.x = e.touches[0].clientX - W / 2;
  tMouse.y = e.touches[0].clientY - H / 2;
}

function onScroll() {
  tScrollY = window.scrollY;
}

// ─── Edge builder ─────────────────────────────────────────────────────────────

/**
 * Returns deduplicated edges connecting each node to its k nearest neighbours.
 * Guarantees every node has at least k connections regardless of density.
 *
 * @param {{ x: number, y: number }[]} nodes
 * @param {number} k
 * @returns {[number, number][]} pairs of node indices
 */
function knnEdges(nodes, k) {
  const edges = [];
  const seen  = new Set();

  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, k)
      .forEach(({ j }) => {
        const key = i < j ? `${i}:${j}` : `${j}:${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([i, j]);
        }
      });
  });

  return edges;
}

// ─── Layer builder ────────────────────────────────────────────────────────────

/**
 * Builds a layer by distributing nodes across the full scrollable document,
 * not just the visible viewport. Each layer's virtual height is calculated
 * from how far it actually travels during a full page scroll:
 *
 *   virtualH = (maxScroll × scrollSpeed) + viewportH
 *
 * This ensures nodes are visible at every scroll position. Node count scales
 * proportionally so density stays consistent regardless of page length.
 *
 * @param {object} def  One entry from LAYERS
 * @returns {object}    Layer definition merged with { nodes, edges }
 */
function buildLayer(def) {
  const pad       = 80;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - H);
  const virtualH  = maxScroll * def.scrollSpeed + H;
  const count     = Math.round(def.count * (virtualH / H));

  const nodes = Array.from({ length: count }, (_, i) => ({
    x:     pad + Math.random() * (W - pad * 2),
    y:     Math.random() * virtualH,
    w:     def.wRange[0] + Math.random() * (def.wRange[1] - def.wRange[0]),
    h:     def.hRange[0] + Math.random() * (def.hRange[1] - def.hRange[0]),
    label: NODE_LABELS[i % NODE_LABELS.length],
    phase: Math.random() * Math.PI * 2, // per-node ambient oscillation offset
  }));

  return { ...def, nodes, edges: knnEdges(nodes, def.knn) };
}

let layers = [];

function rebuildLayers() {
  layers = LAYERS.map(buildLayer);
}

// ─── Draw utilities ───────────────────────────────────────────────────────────

/**
 * Draws four L-shaped corner ticks around a rectangle, giving it a
 * technical-drawing / blueprint bracket feel.
 */
function drawCornerTicks(x, y, w, h, alpha) {
  const TICK = 4;
  ctx.strokeStyle = `rgba(${ACCENT},${Math.min(1, alpha * 1.8)})`;
  ctx.lineWidth   = 1;

  [
    [x,     y,     +1, +1],
    [x + w, y,     -1, +1],
    [x,     y + h, +1, -1],
    [x + w, y + h, -1, -1],
  ].forEach(([cx, cy, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(cx + sx * TICK, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + sy * TICK);
    ctx.stroke();
  });
}

// ─── Animation loop ───────────────────────────────────────────────────────────

let t = 0; // global time for ambient oscillation

function draw() {
  ctx.clearRect(0, 0, W, H);
  t += 0.004;

  // Smooth inputs toward their targets
  mouse.x += (tMouse.x - mouse.x) * 0.06;
  mouse.y += (tMouse.y - mouse.y) * 0.06;
  scrollY  += (tScrollY - scrollY) * 0.08;

  layers.forEach(layer => {
    // Parallax offsets for this layer
    const ox = mouse.x * layer.mouseSpeed * 22;
    const oy = mouse.y * layer.mouseSpeed * 16 - scrollY * layer.scrollSpeed;

    // ── 1. Connection lines (drawn first, behind boxes) ──────────────────
    ctx.setLineDash(layer.dash);
    ctx.lineWidth = 0.8;

    layer.edges.forEach(([i, j]) => {
      const a = layer.nodes[i];
      const b = layer.nodes[j];

      ctx.beginPath();
      ctx.strokeStyle = `rgba(${ACCENT},${layer.alpha * layer.edgeAlpha})`;
      ctx.moveTo(a.x + ox, a.y + oy);
      ctx.lineTo(b.x + ox, b.y + oy);
      ctx.stroke();
    });

    ctx.setLineDash([]);

    // ── 2. Component boxes (drawn on top, terminate lines cleanly) ────────
    layer.nodes.forEach(node => {
      // Subtle per-node ambient drift
      const bx = node.x + ox + Math.sin(t * 0.5  + node.phase) * 0.4;
      const by = node.y + oy + Math.cos(t * 0.45 + node.phase) * 0.3;
      const rx = bx - node.w / 2;
      const ry = by - node.h / 2;

      // Dark fill so lines visually terminate at the box edge
      ctx.fillStyle = 'rgba(10,11,13,0)';
      ctx.fillRect(rx, ry, node.w, node.h);

      // Box border
      ctx.strokeStyle = `rgba(${ACCENT},${layer.alpha})`;
      ctx.lineWidth   = 0.9;
      ctx.strokeRect(rx, ry, node.w, node.h);

      // Corner ticks
      drawCornerTicks(rx, ry, node.w, node.h, layer.alpha);

      // Micro-label (near layer only)
      if (layer.fontSize > 0) {
        ctx.font         = `${layer.fontSize}px 'JetBrains Mono', monospace`;
        ctx.fillStyle    = `rgba(${ACCENT},${layer.alpha * 1.25})`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, bx, by);
      }
    });
  });

  requestAnimationFrame(draw);
}

// ─── Initialise ───────────────────────────────────────────────────────────────

resizeCanvas();
rebuildLayers();
draw();

window.addEventListener('resize',    () => { resizeCanvas(); rebuildLayers(); });
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('touchmove', onTouchMove, { passive: true });
window.addEventListener('scroll',    onScroll,    { passive: true });
