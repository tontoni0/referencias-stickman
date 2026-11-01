// Piezas comunes para escribir escenas. Se carga después de tl.js y antes de escenas.js.

const M = TL.marcas;
const INI = Object.fromEntries(TL.escenas.map(e => [e.id, e.inicio]));
const FIN = id => {
  const i = TL.escenas.findIndex(e => e.id === id);
  return i + 1 < TL.escenas.length ? TL.escenas[i + 1].inicio : TL.duracion;
};
const lienzo = c => `<svg class="lienzo" width="1080" height="1920" viewBox="0 0 1080 1920">${c}</svg>`;
const viñeta = `<rect width="1080" height="1920" fill="url(#vignette)"/>`;
const pulsoRojo = lt => 0.5 + 0.5 * Math.sin(2 * Math.PI * 1.1 * lt);

// Poste de la alerta con sus bocinas. (x, y) es la punta del poste.
function poste(x, y, s = 1, largo = 600) {
  const b = (dx, dy, dir) => `<polygon points="${x + dir * 22 * s},${y + dy * s} ${x + dir * 120 * s},${y + (dy - 32) * s} ${x + dir * 120 * s},${y + (dy + 68) * s} ${x + dir * 22 * s},${y + (dy + 38) * s}" fill="#c9ccd2" stroke="${INK}" stroke-width="${6 * s}" stroke-linejoin="round"/>`;
  const onda = (dir, k) => `<path class="onda" data-k="${k}" d="M${x + dir * (140 + k * 40) * s} ${y + (-10 - k * 18) * s} q${dir * (30 + k * 10) * s} ${(70 + k * 18) * s} 0 ${(140 + k * 36) * s}" fill="none" stroke="${ROJO}" stroke-width="${7 * s}" stroke-linecap="round"/>`;
  return `<g filter="url(#ink)">
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + largo * s}" stroke="${INK}" stroke-width="${26 * s}"/>
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + largo * s}" stroke="#5b616b" stroke-width="${16 * s}"/>
    ${b(0, 20, 1)}${b(0, 20, -1)}${b(0, 160, 1)}${b(0, 160, -1)}
    <rect x="${x - 26 * s}" y="${y - 10 * s}" width="${52 * s}" height="${250 * s}" rx="${8 * s}" fill="#8b919a" stroke="${INK}" stroke-width="${6 * s}"/>
    <circle cx="${x}" cy="${y - 34 * s}" r="${18 * s}" fill="${ROJO}" stroke="${INK}" stroke-width="${5 * s}" class="foco"/>
  </g>
  ${[0, 1, 2].map(k => onda(1, k) + onda(-1, k)).join('')}`;
}

function animaPoste(raiz, lt, encendido = true) {
  raiz.querySelectorAll('.onda').forEach(o => {
    const k = +o.dataset.k;
    const f = (lt * 1.6 - k * 0.33) % 1;
    o.style.opacity = encendido ? (f < 0 ? 0 : 0.9 * (1 - Math.abs(f * 2 - 1))) : 0;
  });
  raiz.querySelectorAll('.foco').forEach(f => f.style.opacity = encendido ? 0.4 + 0.6 * pulsoRojo(lt) : 0.3);
}


// Revela un elemento de izquierda a derecha, como si se escribiera a mano.
function escribe(el, t, inicio, dur) {
  const p = clamp((t - inicio) / dur);
  el.style.clipPath = `inset(-30% ${100 - p * 100}% -30% -5%)`;
}

// Subrayado rojo a mano que se dibuja solo (pathLength=1).
const subrayado = (id, d) => `<svg class="lienzo" width="1080" height="1920"><path id="${id}" d="${d}" pathLength="1" fill="none" stroke="#c62828" stroke-width="12" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1"/></svg>`;
const trazo = (el, t, inicio, dur) => el.setAttribute('stroke-dashoffset', 1 - clamp((t - inicio) / dur));

const TINTA = '#1d3a8a';

// Hoja de cuaderno con renglones que se escriben solos.
// renglones: [{id, texto, top, left, size, peso, rot, roja}]
function hoja(renglones, extra = '') {
  return `<div class="cuaderno"></div>${renglones.map(r =>
    `<div class="tinta${r.roja ? ' roja' : ''}" id="${r.id}" style="top:${r.top}px;left:${r.left || 180}px;font-size:${r.size}px;font-weight:${r.peso || 600};transform:rotate(${r.rot || -1}deg)">${r.texto}</div>`).join('')}${extra}`;
}

// Dibujitos de inventario a pluma azul: agua, lata, hueso, pila, foco.
const ic = c => `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="${TINTA}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${c}</svg>`;
const iconos = {
  agua: ic(`<rect x="44" y="8" width="32" height="12" rx="3"/><path d="M50 20 v10 M70 20 v10"/><rect x="24" y="30" width="72" height="80" rx="16"/><path d="M28 66 q16 -8 32 0 t32 0" stroke-width="5"/>`),
  lata: ic(`<ellipse cx="60" cy="26" rx="32" ry="10"/><path d="M28 26 v66 q32 18 64 0 v-66"/><path d="M28 50 q32 14 64 0 M28 72 q32 14 64 0"/>`),
  hueso: ic(`<circle cx="24" cy="42" r="14"/><circle cx="24" cy="74" r="14"/><circle cx="96" cy="42" r="14"/><circle cx="96" cy="74" r="14"/><path d="M34 50 h52 M34 66 h52"/>`),
  pila: ic(`<rect x="16" y="36" width="80" height="48" rx="8"/><rect x="96" y="50" width="10" height="20" rx="3"/><rect x="24" y="44" width="30" height="32" fill="${TINTA}" stroke="none"/>`),
  foco: ic(`<path d="M60 14 a30 30 0 0 1 18 54 v14 h-36 v-14 a30 30 0 0 1 18 -54z"/><path d="M46 92 h28 M48 104 h24"/><path d="M14 14 l92 92 M106 14 l-92 92" stroke="#c62828" stroke-width="7"/>`),
};

const ESCENAS = {};
