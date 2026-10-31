// Piezas de dibujo compartidas por todas las partes de la serie.
// Cada función regresa un string SVG. Las coordenadas son del lienzo de 1080x1920.

const INK = '#111';
const ROJO = '#e0312b';

const defsSVG = `
<svg width="0" height="0" style="position:absolute">
  <defs>
    <radialGradient id="headShade" cx="0.45" cy="0.35" r="0.75">
      <stop offset="0.55" stop-color="#ffffff"/><stop offset="1" stop-color="#b9c0cc"/>
    </radialGradient>
    <radialGradient id="headInfectado" cx="0.45" cy="0.35" r="0.75">
      <stop offset="0.4" stop-color="#9aa0a8"/><stop offset="1" stop-color="#5d636b"/>
    </radialGradient>
    <radialGradient id="headInfectadoOscuro" cx="0.45" cy="0.35" r="0.75">
      <stop offset="0.35" stop-color="#6b7079"/><stop offset="1" stop-color="#2e3237"/>
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.48" r="0.75">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".78"/>
    </radialGradient>
    <radialGradient id="luzCalida"><stop offset="0" stop-color="#f3c46a" stop-opacity=".55"/><stop offset="1" stop-color="#f3c46a" stop-opacity="0"/></radialGradient>
    <radialGradient id="luzLuna"><stop offset="0" stop-color="#e9eef7" stop-opacity=".55"/><stop offset="1" stop-color="#e9eef7" stop-opacity="0"/></radialGradient>
    <linearGradient id="paredNoche" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1c2638"/><stop offset="1" stop-color="#121a28"/>
    </linearGradient>
    <linearGradient id="paredDia" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#34445e"/><stop offset="1" stop-color="#232f44"/>
    </linearGradient>
    <linearGradient id="ventanaDia" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b3c3d9"/><stop offset="1" stop-color="#7f93b0"/>
    </linearGradient>
    <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#26385e"/><stop offset="1" stop-color="#121c36"/>
    </linearGradient>
    <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence id="inkNoise" type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/>
      <feDisplacementMap in="SourceGraphic" scale="5"/>
    </filter>
    <filter id="blur10" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="10"/></filter>
    <pattern id="paisley" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="9" cy="9" r="4" fill="#fff" opacity=".9"/>
      <path d="M24 22 q8 -2 6 8 q-5 3 -8 -2z" fill="none" stroke="#fff" stroke-width="2.5" opacity=".9"/>
    </pattern>
  </defs>
</svg>`;

const pt = p => p.join(',');

function linea(puntos, w, color = INK) {
  return `<polyline points="${puntos.map(pt).join(' ')}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function punto(x, y, r, fill = INK) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
}

// Cabeza blanca con dos ojos ovalados. look/lookY mueven la mirada.
function cabeza(cx, cy, r, o = {}) {
  const look = o.look || 0, lookY = o.lookY || 0, es = o.eyeScale || 1;
  const fill = o.headFill || 'url(#headShade)';
  const eyeFill = o.eyeFill || INK;
  const ex = r * 0.2, erx = r * 0.09 * es, ery = r * 0.165 * es;
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${o.ink || INK}" stroke-width="${r * 0.08}"/>`;
  s += `<g class="ojos">`;
  if (o.ojosBrillan) for (const x of [cx - ex + look, cx + ex + look])
    s += `<ellipse cx="${x}" cy="${cy - r * 0.02 + lookY}" rx="${erx * 2.4}" ry="${ery * 1.7}" fill="#fff" opacity=".55" filter="url(#blur10)"/>`;
  for (const x of [cx - ex + look, cx + ex + look]) {
    s += `<ellipse cx="${x}" cy="${cy - r * 0.02 + lookY}" rx="${erx}" ry="${ery}" fill="${eyeFill}"/>`;
    if (!o.sinBrillo) s += punto(x + erx * 0.3, cy - r * 0.02 + lookY - ery * 0.4, erx * 0.32, '#fff');
  }
  return s + `</g>`;
}

// Paliacate rojo, amarrado al cuello. (cx, cy, r) son los de la cabeza.
function paliacate(cx, cy, r) {
  const k = r / 122;
  const P = (x, y) => `${cx + x * k} ${cy + y * k}`;
  const forma = `M${P(-60, 114)} Q${P(0, 140)} ${P(62, 114)} L${P(12, 214)} Z`;
  return `<path d="${forma}" fill="#c8282e" stroke="${INK}" stroke-width="${7 * k}" stroke-linejoin="round"/>
    <path d="${forma}" fill="url(#paisley)"/>
    <path d="M${P(38, 122)} l${30 * k} ${34 * k} l${-8 * k} ${6 * k} z M${P(38, 122)} l${40 * k} ${16 * k} l${-4 * k} ${9 * k} z" fill="#c8282e" stroke="${INK}" stroke-width="${5 * k}" stroke-linejoin="round"/>`;
}

// Stickman completo a partir de sus articulaciones.
// o = { head:[x,y], r, neck, hip, armL:[codo, mano], armR, legL:[rodilla, pie], legR,
//       footL, footR (dirección del pie: 1 o -1), look, lookY, eyeScale,
//       paliacate (true por omisión), headFill, eyeFill, ink, sinBrillo }
//       gris (color de relleno para extremidades con contorno, para que se vean en lo oscuro),
//       antesCabeza / despuesCabeza (SVG extra: chongo, rebozo, lentes) }
function stick(o) {
  const r = o.r, w = r * 0.085, ink = o.ink || INK;
  const L = pts => o.gris ? linea(pts, w * 1.9, '#050608') + linea(pts, w, o.gris) : linea(pts, w, ink);
  let s = '';
  const pierna = (lg, dir) => {
    if (!lg) return;
    s += L([o.hip, lg[0], lg[1]]);
    if (dir) s += L([lg[1], [lg[1][0] + dir * r * 0.24, lg[1][1] + r * 0.02]]);
  };
  pierna(o.legL, o.footL);
  pierna(o.legR, o.footR);
  s += L([o.neck, o.hip]);
  const brazo = a => {
    if (!a) return;
    s += L([[o.neck[0], o.neck[1] + r * 0.4], a[0], a[1]]);
    if (!o.sinManos) s += punto(a[1][0], a[1][1], r * 0.1, o.gris || ink);
  };
  if (!o.brazosAlFrente) { brazo(o.armL); brazo(o.armR); }
  if (o.paliacate !== false) s += paliacate(o.head[0], o.head[1], r);
  s += o.antesCabeza || '';
  s += cabeza(o.head[0], o.head[1], r, o);
  s += o.despuesCabeza || '';
  if (o.brazosAlFrente) { brazo(o.armL); brazo(o.armR); }
  return s;
}

// Doña Rosa: chongo gris, lentes redondos y rebozo. Mismos parámetros que stick().
function rosa(o) {
  const [cx, cy] = o.head, r = o.r, [nx, ny] = o.neck, look = o.look || 0;
  const chongo = `<circle cx="${cx - r * 0.35}" cy="${cy - r * 0.85}" r="${r * 0.36}" fill="#b8bcc4" stroke="${INK}" stroke-width="${r * 0.07}"/>`;
  const rebozo = `<path d="M${nx - r * 0.95} ${ny + r * 0.15} Q${nx} ${ny - r * 0.1} ${nx + r * 0.95} ${ny + r * 0.15} L${nx + r * 0.75} ${ny + r * 1.55} Q${nx} ${ny + r * 1.95} ${nx - r * 0.75} ${ny + r * 1.55} Z"
      fill="#8d8f96" stroke="${INK}" stroke-width="${r * 0.07}" stroke-linejoin="round"/>
    <path d="M${nx - r * 0.85} ${ny + r * 0.55} Q${nx} ${ny + r * 0.75} ${nx + r * 0.85} ${ny + r * 0.55} M${nx - r * 0.8} ${ny + r * 0.95} Q${nx} ${ny + r * 1.15} ${nx + r * 0.8} ${ny + r * 0.95}" fill="none" stroke="#6b6d74" stroke-width="${r * 0.06}"/>
    ${[...Array(9)].map((_, i) => { const x = nx - r * 0.7 + i * r * 0.175, y = ny + r * 1.6 + Math.sin(i / 8 * Math.PI) * r * 0.32; return linea([[x, y], [x, y + r * 0.22]], r * 0.04); }).join('')}`;
  const pelo = `<path d="M${cx - r * 0.93} ${cy - r * 0.35} A${r} ${r} 0 0 1 ${cx + r * 0.93} ${cy - r * 0.35} Q${cx + r * 0.3} ${cy - r * 0.55} ${cx - r * 0.1} ${cy - r * 0.42} Q${cx - r * 0.5} ${cy - r * 0.55} ${cx - r * 0.93} ${cy - r * 0.35} Z" fill="#b8bcc4" stroke="${INK}" stroke-width="${r * 0.07}"/>`;
  const ex = r * 0.2;
  const lentes = [cx - ex + look, cx + ex + look].map(x => `<circle cx="${x}" cy="${cy - r * 0.02}" r="${r * 0.2}" fill="none" stroke="${INK}" stroke-width="${r * 0.05}"/>`).join('')
    + linea([[cx - ex + look + r * 0.2, cy - r * 0.04], [cx + ex + look - r * 0.2, cy - r * 0.04]], r * 0.05);
  return stick({ ...o, paliacate: false, antesCabeza: chongo + rebozo, despuesCabeza: pelo + lentes });
}

// Infectado parado, quieto. Mismos parámetros que stick().
function infectado(o) {
  return stick({ ...o, paliacate: false, headFill: 'url(#headInfectado)', eyeFill: '#f2f2f2', sinBrillo: true, gris: o.gris || '#8a9099' });
}

// Chispa. Dibujada con el centro del cuerpo en (0,0), mirando a la derecha.
// modo: 'gruñe' (de pie, enseña los dientes), 'echada' (acostada, alerta).
function perro(modo = 'gruñe') {
  const C = '#6e4325', OSC = '#5a361d', HOC = '#7d4f2d';
  let s = `<g stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">`;
  if (modo === 'gruñe') {
    s += `<path d="M-85 -20 q-40 -50 -10 -90" fill="none"/>`;
    s += linea([[-60, 30], [-70, 115]], 7) + linea([[-30, 35], [-25, 118]], 7) + linea([[35, 35], [27, 118]], 7) + linea([[63, 30], [75, 116]], 7);
    s += `<ellipse cx="0" cy="0" rx="92" ry="48" fill="${C}"/>`;
    s += `<path d="M-65 -42 l12 -20 l12 18 l12 -20 l12 18 l12 -20 l12 18 l12 -20 l12 18" fill="none" stroke-width="6"/>`;
  } else {
    s += `<path d="M-88 10 q-50 10 -60 -30" fill="none"/>`;
    s += `<ellipse cx="0" cy="8" rx="95" ry="40" fill="${C}"/>`;
    s += linea([[40, 34], [115, 44]], 7) + linea([[52, 40], [125, 52]], 7);
  }
  s += `<circle cx="90" cy="-50" r="46" fill="${C}"/>`;
  s += `<path d="M95 -90 l14 -58 l22 50 z" fill="${OSC}"/>`;
  s += `<path d="M63 -84 q-30 -10 -34 26 q18 -6 30 -12 z" fill="${OSC}"/>`;
  s += `<path d="M117 -50 q48 -6 52 22 q-6 22 -50 20 z" fill="${HOC}"/>`;
  if (modo === 'gruñe') {
    s += `<path d="M131 -22 l8 -10 l8 10 l8 -10 l8 10" fill="#fff" stroke-width="3"/>`;
    s += `<path d="M103 -68 l16 6" stroke-width="5"/>`;
  }
  s += punto(167, -42, 7) + punto(111, -58, 5);
  s += `<path d="M50 -25 q30 20 62 6" fill="none" stroke="#2f6fd6" stroke-width="14"/>`;
  s += `<circle cx="81" cy="0" r="11" fill="#9aa3ad" stroke-width="4"/>`;
  return s + `</g>`;
}

// Infectado visto de frente, corriendo. Pies en (0,0), altura 1 (se escala por fuera).
function infectadoCorriendo(fase) {
  const p = Math.sin(fase), w = 0.026, ink = '#15171b', gris = '#9aa0a8';
  const liftL = Math.max(0, p) * 0.14, liftR = Math.max(0, -p) * 0.14;
  // cada extremidad va dos veces: contorno oscuro y relleno gris, para que se vea de noche
  const doble = pts => linea(pts, w * 1.9, '#050608') + linea(pts, w, gris);
  let s = '';
  s += doble([[0, -0.42], [-0.07, -0.22 - liftL], [-0.08, -liftL]]);
  s += doble([[0, -0.42], [0.07, -0.22 - liftR], [0.08, -liftR]]);
  s += doble([[0, -0.75], [0, -0.42]]);
  s += doble([[0, -0.68], [-0.17, -0.6 + 0.04 * p], [-0.2, -0.7 + 0.05 * p]]);
  s += doble([[0, -0.68], [0.17, -0.6 - 0.04 * p], [0.2, -0.7 - 0.05 * p]]);
  s += `<path d="M-0.06 -0.7 L0.07 -0.7 L0.06 -0.52 L0.02 -0.56 L-0.01 -0.5 L-0.05 -0.55 Z" fill="#4a4033" opacity=".9"/>`;
  s += `<circle cx="0" cy="-0.86" r="0.11" fill="url(#headInfectado)" stroke="${ink}" stroke-width="${w}"/>`;
  s += `<ellipse cx="-0.035" cy="-0.865" rx="0.016" ry="0.026" fill="#f4f4f4"/><ellipse cx="0.035" cy="-0.865" rx="0.016" ry="0.026" fill="#f4f4f4"/>`;
  return s;
}

// Vecino chiquito en pijama, para multitudes. Pies en (x, y).
function vecino(x, y, h, color, o = {}) {
  const r = h * 0.13, w = Math.max(3, h * 0.03);
  const hy = y - h + r;
  let s = '';
  s += linea([[x, y - h * 0.42], [x - h * 0.07, y]], w) + linea([[x, y - h * 0.42], [x + h * 0.07, y]], w);
  s += `<path d="M${x - h * 0.11} ${y - h * 0.74} L${x + h * 0.11} ${y - h * 0.74} L${x + h * 0.09} ${y - h * 0.4} L${x - h * 0.09} ${y - h * 0.4} Z" fill="${color}" stroke="${INK}" stroke-width="${w * 0.8}"/>`;
  s += linea([[x - h * 0.1, y - h * 0.72], [x - h * 0.15, y - h * 0.48]], w) + linea([[x + h * 0.1, y - h * 0.72], [x + h * 0.15, y - h * 0.48]], w);
  if (o.celular) s += `<rect x="${x + h * 0.12}" y="${y - h * 0.58}" width="${h * 0.06}" height="${h * 0.1}" fill="#9fd0ff" class="cel"/>`;
  s += cabeza(x, hy, r, { look: o.look || 0, lookY: o.lookY || 0, sinBrillo: true });
  return s;
}

const ease = {
  outCubic: t => 1 - Math.pow(1 - t, 3),
  outBack: t => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  inOut: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
};
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

// Generador pseudoaleatorio con semilla, para que cada render salga igual.
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
