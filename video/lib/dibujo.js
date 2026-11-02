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
    <linearGradient id="haz" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff6c8" stop-opacity=".9"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/>
    </linearGradient>
    <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence id="inkNoise" type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/>
      <feDisplacementMap in="SourceGraphic" scale="5"/>
    </filter>
    <filter id="tiembla" x="-5%" y="-20%" width="110%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="3"/>
      <feDisplacementMap in="SourceGraphic" scale="7"/>
    </filter>
    <filter id="blur10" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="contorno" x="-10%" y="-10%" width="120%" height="120%">
      <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="d"/>
      <feFlood flood-color="#9db0d4" flood-opacity=".7"/>
      <feComposite in2="d" operator="in" result="borde"/>
      <feMerge><feMergeNode in="borde"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
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

// Memo, el administrador: bigote, chaleco y llavero. Mismos parámetros que stick().
function memo(o) {
  const [cx, cy] = o.head, r = o.r, [nx, ny] = o.neck, [hx, hy] = o.hip, look = o.look || 0;
  const bigote = `<path d="M${cx + look - r * 0.42} ${cy + r * 0.32} Q${cx + look - r * 0.2} ${cy + r * 0.12} ${cx + look} ${cy + r * 0.26} Q${cx + look + r * 0.2} ${cy + r * 0.12} ${cx + look + r * 0.42} ${cy + r * 0.32} Q${cx + look + r * 0.2} ${cy + r * 0.42} ${cx + look} ${cy + r * 0.34} Q${cx + look - r * 0.2} ${cy + r * 0.42} ${cx + look - r * 0.42} ${cy + r * 0.32} Z" fill="${INK}"/>`;
  const chaleco = `<path d="M${nx - r * 0.55} ${ny + r * 0.2} L${nx - r * 0.12} ${ny + r * 0.1} L${nx} ${ny + r * 0.9} L${nx + r * 0.12} ${ny + r * 0.1} L${nx + r * 0.55} ${ny + r * 0.2} L${hx + r * 0.5} ${hy - r * 0.15} L${hx - r * 0.5} ${hy - r * 0.15} Z"
      fill="#c8b48e" stroke="${INK}" stroke-width="${r * 0.07}" stroke-linejoin="round"/>
    <rect x="${nx - r * 0.42}" y="${(ny + hy) / 2}" width="${r * 0.3}" height="${r * 0.22}" fill="none" stroke="${INK}" stroke-width="${r * 0.05}"/>
    <rect x="${nx + r * 0.12}" y="${(ny + hy) / 2}" width="${r * 0.3}" height="${r * 0.22}" fill="none" stroke="${INK}" stroke-width="${r * 0.05}"/>`;
  const llaves = `<circle cx="${hx + r * 0.35}" cy="${hy + r * 0.15}" r="${r * 0.16}" fill="none" stroke="#b8bec6" stroke-width="${r * 0.06}"/>
    ${[-0.1, 0.05, 0.2].map(d => linea([[hx + r * (0.35 + d), hy + r * 0.3], [hx + r * (0.35 + d * 1.6), hy + r * 0.62]], r * 0.07, '#c9a43a')).join('')}`;
  return stick({ ...o, paliacate: false, antesCabeza: chaleco + llaves, despuesCabeza: bigote });
}

// Infectado parado, quieto. Mismos parámetros que stick().
function infectado(o) {
  return stick({ ...o, paliacate: false, headFill: 'url(#headInfectado)', eyeFill: '#f2f2f2', sinBrillo: true, gris: o.gris || '#8a9099' });
}

// Chispa. Dibujada con el centro del cuerpo en (0,0), mirando a la derecha.
// modo: 'gruñe' (de pie, enseña los dientes), 'parada' (de pie, con miedo, cola entre las patas),
//       'echada' (acostada, alerta).
function perro(modo = 'gruñe') {
  const C = '#6e4325', OSC = '#5a361d', HOC = '#7d4f2d';
  let s = `<g stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">`;
  if (modo === 'gruñe' || modo === 'parada') {
    s += modo === 'gruñe' ? `<path d="M-85 -20 q-40 -50 -10 -90" fill="none"/>` : `<path d="M-85 0 q-20 40 10 70" fill="none"/>`;
    s += linea([[-60, 30], [-70, 115]], 7) + linea([[-30, 35], [-25, 118]], 7) + linea([[35, 35], [27, 118]], 7) + linea([[63, 30], [75, 116]], 7);
    s += `<ellipse cx="0" cy="0" rx="92" ry="48" fill="${C}"/>`;
    if (modo === 'gruñe') s += `<path d="M-65 -42 l12 -20 l12 18 l12 -20 l12 18 l12 -20 l12 18 l12 -20 l12 18" fill="none" stroke-width="6"/>`;
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

// Chispa sentada, de lado, mirando a la derecha. Centro del cuerpo en (0,0) y patas en y=118, como perro().
// aulla: 0..1 levanta la cabeza; desde 0.2 abre el hocico y cierra los ojos.
function perroSentada(aulla = 0) {
  const C = '#6e4325', OSC = '#5a361d', HOC = '#7d4f2d';
  let s = `<g stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">`;
  s += `<path d="M-70 110 q-50 8 -100 -12" fill="none"/>`;
  s += linea([[30, 0], [34, 118]], 7) + linea([[58, -8], [64, 118]], 7);
  s += `<ellipse cx="-8" cy="10" rx="86" ry="44" fill="${C}" transform="rotate(-52 -8 10)"/>`;
  s += `<ellipse cx="-42" cy="74" rx="58" ry="44" fill="${C}"/>`;
  s += `<path d="M-20 118 q30 -4 52 0" fill="none" stroke-width="10"/>`;
  s += `<path d="M22 -70 q28 22 64 2" fill="none" stroke="#2f6fd6" stroke-width="14"/>`;
  s += `<circle cx="56" cy="-50" r="11" fill="#9aa3ad" stroke-width="4"/>`;
  s += `<g transform="translate(62 -112) rotate(${-38 * aulla})">`;
  s += `<circle cx="0" cy="0" r="46" fill="${C}"/>`;
  s += `<path d="M5 -40 l14 -58 l22 50 z" fill="${OSC}"/>`;
  s += `<path d="M-27 -34 q-30 -10 -34 26 q18 -6 30 -12 z" fill="${OSC}"/>`;
  s += `<path d="M27 0 q48 -6 52 22 q-6 22 -50 20 z" fill="${HOC}"/>`;
  if (aulla > 0.2) s += `<ellipse cx="64" cy="36" rx="${6 + 6 * aulla}" ry="${7 + 9 * aulla}" fill="#1e0b0b" stroke-width="4"/>`;
  s += punto(77, 8, 7) + (aulla > 0.2 ? `<path d="M13 -8 q8 6 16 0" fill="none" stroke-width="4"/>` : punto(21, -8, 5));
  return s + `</g></g>`;
}

// Cara de Chispa de frente, en primer plano, con collar y placa encintada. Centro de la cabeza en (0,0), radio 290.
// o = { boca: 0..1 (abre para gruñir o ladrar), aullido: 0..1 (boca redonda, sin colmillos), lengua: 0..1 (lame),
//       ceno, orejasAtras, parpadeo, sinCinta (placa sin cinta, como antes del día 1) }
function caraChispa(o = {}) {
  const C = '#6e4325', OSC = '#5a361d', HOC = '#7d4f2d', b = o.boca || 0, l = o.lengua || 0;
  let s = `<g stroke="${INK}" stroke-linejoin="round" stroke-linecap="round">`;
  s += `<path d="M-450 1320 C-420 700 -300 300 0 280 C300 300 420 700 450 1320 Z" fill="${C}" stroke-width="10"/>`;
  if (o.orejasAtras) {
    s += `<path d="M-180 -210 L-360 -150 L-150 -120 Z" fill="${OSC}" stroke-width="10"/>`;
    s += `<path d="M180 -210 L360 -150 L150 -120 Z" fill="${OSC}" stroke-width="10"/>`;
  } else {
    s += `<path d="M-210 -180 L-290 -450 L-70 -270 Z" fill="${OSC}" stroke-width="10"/>`;
    s += `<path d="M200 -270 Q360 -300 390 -80 Q310 -130 240 -130 Z" fill="${OSC}" stroke-width="10"/>`;
  }
  s += `<circle cx="0" cy="0" r="290" fill="${C}" stroke-width="10"/>`;
  if (o.ceno) s += `<path d="M-150 -75 l95 35 M150 -75 l-95 35" fill="none" stroke-width="14"/>`;
  for (const x of [-95, 95]) {
    s += o.parpadeo ? `<path d="M${x - 28} -10 q28 16 56 0" fill="none" stroke-width="10"/>`
      : punto(x, -10, 26) + punto(x + 8, -20, 8, '#fff');
  }
  s += `<ellipse cx="0" cy="160" rx="130" ry="92" fill="${HOC}" stroke-width="9"/>`;
  if (b > 0) {
    // boca abierta debajo del hocico, con colmillos arriba y abajo
    const ancho = 80 + 40 * b, fondo = 228 + 330 * b, baja = 228 + 165 * b;
    s += `<path d="M${-ancho} 228 Q0 250 ${ancho} 228 Q0 ${fondo} ${-ancho} 228 Z" fill="#5a1414" stroke-width="8"/>`;
    for (let i = 0; i < 4; i++) {
      const x = -ancho * 0.6 + i * ancho * 0.4;
      s += `<path d="M${x - 13} 236 l13 ${30 * b} l13 ${-30 * b} Z" fill="#fff" stroke-width="3"/>`;
    }
    s += `<path d="M${-ancho * 0.45 - 13} ${baja + 4} l13 ${-26 * b} l13 ${26 * b} Z M${ancho * 0.45 - 13} ${baja + 4} l13 ${-26 * b} l13 ${26 * b} Z" fill="#fff" stroke-width="3"/>`;
  } else if (o.aullido > 0) {
    const a = o.aullido, cy = 238 + 40 * a, rx = 38 + 22 * a, ry = 24 + 52 * a;
    s += `<ellipse cx="0" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1e0b0b" stroke-width="9"/>`;
    s += `<ellipse cx="0" cy="${cy + ry * 0.55}" rx="${rx * 0.55}" ry="${ry * 0.3}" fill="#c75a6a" stroke="none"/>`;
  } else {
    s += `<path d="M0 142 v40 M-40 200 q40 22 80 0" fill="none" stroke-width="8"/>`;
  }
  if (l > 0) s += `<path d="M-52 215 Q-10 ${215 + 300 * l} 52 215 Z" fill="#e06b7a" stroke-width="7"/><path d="M0 225 v${120 * l}" stroke="#b84a5a" stroke-width="5"/>`;
  s += `<ellipse cx="0" cy="112" rx="42" ry="30" fill="${INK}" stroke="none"/>`;
  s += `<path d="M-370 360 Q0 450 370 360 L365 440 Q0 530 -365 440 Z" fill="#2f6fd6" stroke-width="9"/>`;
  s += `<g class="placa"><circle cx="0" cy="505" r="22" fill="none" stroke-width="14"/><circle cx="0" cy="505" r="22" fill="none" stroke="#b8bec6" stroke-width="7"/>
    <circle cx="0" cy="605" r="78" fill="#9aa3ad" stroke-width="9"/>
    ${o.sinCinta ? `<path d="M-40 560 a62 62 0 0 1 72 -2" fill="none" stroke="#fff" stroke-width="10" opacity=".85"/><circle cx="34" cy="578" r="9" fill="#fff"/>`
    : `<path d="M-92 562 L100 550 L94 566 L106 582 L98 598 L110 614 L102 632 L114 650 L-88 662 L-80 646 L-94 630 L-84 614 L-96 596 L-86 580 Z" fill="#a7a69b" stroke-width="6"/>
    <path d="M-70 590 L80 582 M-70 630 L80 622" stroke="#c9c8bc" stroke-width="6"/>`}</g>`;
  return s + `</g>`;
}

// Paloma. Patas en (0,0), mirando a la derecha. aleteo: 0 (alas cerradas) a 1 (alas arriba).
function paloma(aleteo = 0) {
  const G = '#8f96a3', OSC = '#6f7682';
  let s = `<g stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">`;
  s += linea([[-8, -14], [-12, 0]], 5, '#c46a6a') + linea([[8, -14], [10, 0]], 5, '#c46a6a');
  s += `<path d="M-55 -50 L-100 -38 L-55 -28 Z" fill="${OSC}"/>`;
  s += `<ellipse cx="-5" cy="-42" rx="55" ry="30" fill="${G}"/>`;
  if (aleteo > 0) {
    const a = 90 * aleteo;
    s += `<path d="M-10 -58 Q-40 ${-60 - a} -95 ${-50 - a * 1.1} Q-50 ${-40 - a * 0.3} 5 -48 Z" fill="${OSC}"/>`;
    s += `<path d="M0 -58 Q20 ${-60 - a} 50 ${-55 - a * 1.2} Q30 ${-45 - a * 0.4} 10 -48 Z" fill="${G}"/>`;
  } else {
    s += `<path d="M-45 -55 Q0 -72 30 -46 Q0 -28 -45 -40 Z" fill="${OSC}"/>`;
  }
  s += `<path d="M26 -58 q14 -10 24 4" fill="none" stroke="#5f9e8a" stroke-width="10"/>`;
  s += `<circle cx="40" cy="-78" r="20" fill="${OSC}"/>`;
  s += `<path d="M58 -80 l18 4 l-18 6 Z" fill="#d9cfc0"/>`;
  s += punto(46, -83, 5, '#e07b2b') + punto(46, -83, 2.4);
  return s + `</g>`;
}

// Infectado visto de lado, corriendo hacia la derecha. Pies en (0,0), altura 1 (se escala por fuera).
function infectadoLado(fase) {
  const p = Math.sin(fase), q = Math.cos(fase), w = 0.03, gris = '#9aa0a8';
  const doble = pts => linea(pts, w * 1.9, '#050608') + linea(pts, w, gris);
  const cad = [0.06, -0.44], cue = [0.16, -0.76];
  let s = '';
  s += doble([cad, [0.06 + 0.16 * p, -0.24], [0.02 + 0.24 * p, -0.02 + 0.06 * Math.max(0, -q)]]);
  s += doble([cad, [0.06 - 0.16 * p, -0.24], [0.02 - 0.24 * p, -0.02 + 0.06 * Math.max(0, q)]]);
  s += doble([cad, cue]);
  s += doble([[0.15, -0.7], [0.34, -0.66 - 0.04 * p], [0.48, -0.7 - 0.05 * p]]);
  s += doble([[0.15, -0.7], [0.3, -0.6 + 0.04 * p], [0.44, -0.62 + 0.05 * p]]);
  s += `<path d="M0.08 -0.7 L0.2 -0.74 L0.17 -0.52 L0.12 -0.56 L0.08 -0.5 Z" fill="#4a4033" opacity=".9"/>`;
  s += `<circle cx="0.24" cy="-0.86" r="0.11" fill="url(#headInfectado)" stroke="#15171b" stroke-width="${w}"/>`;
  s += `<ellipse cx="0.29" cy="-0.865" rx="0.016" ry="0.026" fill="#f4f4f4"/><ellipse cx="0.32" cy="-0.865" rx="0.014" ry="0.024" fill="#f4f4f4"/>`;
  return s;
}

// Infectado de frente, parado. Pies en (0,0), altura 1 (se escala por fuera).
// brazos: 0 (abajo) a 1 (estirados hacia arriba). look y lookY mueven los ojos, en unidades de la altura.
function infectadoQuieto(brazos = 0, look = 0, lookY = 0) {
  const w = 0.026, gris = '#9aa0a8', u = brazos;
  const doble = pts => linea(pts, w * 1.9, '#050608') + linea(pts, w, gris);
  let s = '';
  s += doble([[0, -0.42], [-0.06, -0.22], [-0.07, 0]]);
  s += doble([[0, -0.42], [0.06, -0.22], [0.07, 0]]);
  s += doble([[0, -0.75], [0, -0.42]]);
  for (const l of [-1, 1]) s += doble([[0, -0.68], [l * lerp(0.13, 0.12, u), lerp(-0.5, -0.9, u)], [l * lerp(0.15, 0.08, u), lerp(-0.34, -1.1, u)]]);
  s += `<path d="M-0.06 -0.7 L0.07 -0.7 L0.06 -0.52 L0.02 -0.56 L-0.01 -0.5 L-0.05 -0.55 Z" fill="#4a4033" opacity=".9"/>`;
  s += `<circle cx="0" cy="-0.86" r="0.11" fill="url(#headInfectado)" stroke="#15171b" stroke-width="${w}"/>`;
  s += `<ellipse cx="${-0.035 + look}" cy="${-0.865 + lookY}" rx="0.016" ry="0.026" fill="#f4f4f4"/><ellipse cx="${0.035 + look}" cy="${-0.865 + lookY}" rx="0.016" ry="0.026" fill="#f4f4f4"/>`;
  return s;
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
