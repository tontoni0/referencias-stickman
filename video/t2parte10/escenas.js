// Escenas de "La alerta", temporada 2, parte 10: La última alerta. Final de la historia. Gana 🪢 en los comentarios
// de la parte 9: Rosa baja por la ventana con el mecate del tendedero. En el centro de alerta, el tablero viejo se opera
// entre dos: Rosa en el micrófono y tú en la señal. A las 3:14 suena la alerta de la Coordinación y la ciudad oye la voz
// de Rosa: "No bajen. Quédense en silencio. Esta alerta es mentira." Hay que mandarlos al estadio, donde está Evelin;
// pitidos: MANDALA ABUELA. Todos caminan al estadio. Amanece: Evelin vuelve con el suero, Chispa se cura, la placa suena
// y no viene nadie. Al final se pregunta de qué quieren la siguiente historia.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const SIRENA = M.suena - 0.05;          // suena la alerta de la Coordinación
const HABLA = M.hablaM - 0.1;           // Rosa toma el micrófono: la sirena se calla
const MANDA = M.mandaM + 0.45;          // Rosa manda la última alerta al estadio
const QUITA = M.quitas + 0.3;           // le quitas los audífonos a Chispa
const TIN = M.suenaPlaca - 0.55;        // la placa suena

// ---------- Clave Morse (como en la temporada 2, parte 1). mezcla.py usa la misma cuenta. ----------
const MORSE = { A: '.-', B: '-...', D: '-..', E: '.', L: '.-..', M: '--', N: '-.', U: '..-' };
function morse(texto, t0, t1) {
  const pasos = []; let u = 0; const finLetra = [];
  for (const c of texto) {
    if (c === ' ') { u += 4; finLetra.push(null); continue; }
    const code = MORSE[c];
    for (let i = 0; i < code.length; i++) { const d = code[i] === '.' ? 1 : 3; pasos.push({ u, d }); u += d + (i < code.length - 1 ? 1 : 0); }
    finLetra.push(u); u += 3;
  }
  const total = u - 3, k = (t1 - t0) / total;
  return { pitidos: pasos.map(p => ({ s: t0 + p.u * k, d: p.d * k })), letras: finLetra.map(f => f === null ? null : t0 + f * k) };
}
const MANDALA = morse('MANDALA ABUELA', M.pitaW + 0.5, M.abuela + 1.15);

const pop = (el, t, t0, d = 0.3) => { const p = clamp((t - t0) / d); el.style.opacity = p; el.style.transform = `scale(${lerp(0.7, 1, ease.outBack(p))})`; };
// Cámara que pone el punto (qx, qy) en el centro a escala s, sin salirse del cuadro.
const foco = (t, s, qx, qy) => [t, s, clamp(-s * (qx - 540), -(s - 1) * 540, (s - 1) * 540), clamp(-s * (qy - 960), -(s - 1) * 960, (s - 1) * 960)];
const golpeDesde = (t, lista) => { const u = lista.filter(g => g <= t).pop(); return u === undefined ? 9 : t - u; };
const sacude = (id, t, t0, d = 0.35, a = 14) => { if (t > t0 && t < t0 + d) $(`#esc-${id} .cam`).style.transform += ` translate(${Math.sin(t * 90) * a}px, ${Math.cos(t * 70) * a * 0.7}px)`; };

// Tú, de pie, pies en (x, y).
const tuDe = (x, y, r, o = {}) => `<g filter="url(#contorno)">${stick({ head: [x, y - r * 5.3], r, neck: [x, y - r * 4.2], hip: [x, y - r * 1.9],
  legL: [[x - r * 0.3, y - r * 0.95], [x - r * 0.38, y]], legR: [[x + r * 0.3, y - r * 0.95], [x + r * 0.38, y]], footL: -1, footR: 1,
  armL: o.armL || [[x - r * 0.75, y - r * 3.1], [x - r * 0.8, y - r * 2.2]], armR: o.armR || [[x + r * 0.75, y - r * 3.1], [x + r * 0.85, y - r * 2.2]],
  look: o.look || 0, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1 })}</g>`;
// Evelin de pie, pies en (x, y). o.audifonos: 'cuello' o 'no'.
const evelinDe = (x, y, r, o = {}) => `<g filter="url(#contorno)">${evelin({ head: [x + (o.dx || 0), y - r * 5.3], r, neck: [x, y - r * 4.2], hip: [x, y - r * 1.9],
  legL: [[x - r * 0.3, y - r * 0.95], [x - r * 0.38, y]], legR: [[x + r * 0.3, y - r * 0.95], [x + r * 0.38, y]], footL: -1, footR: 1,
  armL: o.armL || [[x - r * 0.75, y - r * 3.1], [x - r * 0.8, y - r * 2.2]], armR: o.armR || [[x + r * 0.75, y - r * 3.1], [x + r * 0.85, y - r * 2.2]],
  brazosAlFrente: !!o.brazosAlFrente, audifonos: o.audifonos || 'cuello', look: o.look || 0, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1 })}</g>`;
const rosaDe = (x, y, r, o = {}) => rosa({ head: [x, y], r, neck: [x + 4, y + r * 1.05], hip: [x + 10, y + r * 3.4],
  legL: [[x - 10, y + r * 4.4], [x - 20, y + r * 5.4]], legR: [[x + 30, y + r * 4.4], [x + 40, y + r * 5.4]], footL: -1, footR: 1,
  armL: o.armL || [[x - r * 0.9, y + r * 2.2], [x - r * 1.0, y + r * 3.0]], armR: o.armR || [[x + r * 0.9, y + r * 2.2], [x + r * 1.0, y + r * 3.0]],
  brazosAlFrente: true, look: o.look || 0, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1, headFill: o.headFill });

// Brazo mordido: gris con contorno oscuro, venda con sangre. c = codo, m = mano.
function brazoMordido(sh, c, m, r) {
  const w = r * 0.085;
  const vx = (c[0] + m[0]) / 2, vy = (c[1] + m[1]) / 2, a = Math.atan2(m[1] - c[1], m[0] - c[0]) * 180 / Math.PI;
  return linea([sh, c, m], w * 1.9, '#050608') + linea([sh, c, m], w, '#9aa0a8') + punto(m[0], m[1], r * 0.13, '#9aa0a8') +
    `<circle cx="${m[0]}" cy="${m[1]}" r="${r * 0.13}" fill="none" stroke="#050608" stroke-width="${r * 0.04}"/>
    <g transform="translate(${vx} ${vy}) rotate(${a})"><rect x="${-r * 0.32}" y="${-r * 0.12}" width="${r * 0.64}" height="${r * 0.24}" rx="${r * 0.06}" fill="#eee6d8" stroke="${INK}" stroke-width="${r * 0.04}"/>
    <circle cx="${r * 0.04}" cy="0" r="${r * 0.08}" fill="#8a1f1b" opacity=".85"/></g>`;
}
// Venas grises que suben por el cuello hacia la cara. g: 0 a 1.
function venas(cx, cy, r, g) {
  if (g <= 0) return '';
  const largo = r * 1.1 * g;
  return `<g opacity="${0.4 + 0.6 * g}">${[[0.45, 0.85, -0.5], [0.15, 0.95, -0.2], [0.65, 0.65, -0.9]].map(([dx, dy, ang]) => {
    const x0 = cx + r * dx, y0 = cy + r * dy, x1 = x0 + Math.cos(ang - Math.PI / 2) * largo * 0.5, y1 = y0 - largo * 0.6;
    return `<path d="M${x0} ${y0} Q${x0 + r * 0.12} ${(y0 + y1) / 2} ${x1} ${y1} M${(x0 + x1) / 2} ${(y0 + y1) / 2} l${r * 0.14 * g} ${-r * 0.1 * g}" fill="none" stroke="#454b55" stroke-width="${r * 0.06}" stroke-linecap="round"/>`;
  }).join('')}</g>`;
}
// Lo gris que ya le llega a la quijada.
const quijada = (cx, cy, r) => `<path d="M${cx - r * 0.78} ${cy + r * 0.6} Q${cx} ${cy + r * 1.22} ${cx + r * 0.78} ${cy + r * 0.6} Q${cx} ${cy + r * 0.9} ${cx - r * 0.78} ${cy + r * 0.6} Z" fill="#9aa0a8" opacity=".9"/>`;
// Memo de pie, pies en (x, y). o.gris: venas en el cuello (0 a 1).
function memoDe(x, y, r, o = {}) {
  const head = [x + (o.dx || 0), y - r * 5.3], neck = [x, y - r * 4.2], hip = [x, y - r * 1.9];
  const sh = [neck[0], neck[1] + r * 0.4];
  const armL = o.armL || [[x - r * 0.75, y - r * 3.1], [x - r * 0.8, y - r * 2.2]];
  const armR = o.armR || [[x + r * 0.75, y - r * 3.1], [x + r * 0.85, y - r * 2.2]];
  return `<g filter="url(#contorno)">${memo({ head, r, neck, hip,
    legL: [[x - r * 0.3, y - r * 0.95], [x - r * 0.38, y]], legR: [[x + r * 0.3, y - r * 0.95], [x + r * 0.38, y]], footL: -1, footR: 1,
    armL, look: o.look || 0, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1, eyeFill: o.eyeFill, sinBrillo: !!o.eyeFill })}
    ${venas(head[0], head[1], r, o.gris || 0)}${quijada(head[0], head[1], r)}${brazoMordido(sh, armR[0], armR[1], r)}</g>`;
}
// La tarjeta de acceso de Memo.
const tarjeta = (x, y, s = 1, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})" filter="url(#ink)">
  <rect x="-40" y="-26" width="80" height="52" rx="6" fill="#efe6cf" stroke="${INK}" stroke-width="5"/><rect x="-32" y="-16" width="24" height="28" fill="#9aa3ad"/>
  <rect x="-2" y="-14" width="34" height="6" fill="#6b7280"/><rect x="-2" y="-2" width="26" height="6" fill="#6b7280"/><rect x="-40" y="10" width="80" height="10" fill="${ROJO}"/></g>`;

// Chispa de lado, mirando a la derecha. o.modo: 'parada' | 'contenta' | 'gruñe'; o.cola: grados de la cola;
// o.g: qué tan arriba llega el gris de la pata; o.blancos: ojos blancos (0 a 1); o.audifonos; o.voltea: mira a la izquierda.
function perroMordido(modo = 'parada', g = 1, marcas = true, cola = 0) {
  const k = clamp(g);
  const y0 = lerp(80, 10, k);
  return perro(modo, cola) + linea([[-60, 30], [-70, 115]], 22, '#050608') + linea([[lerp(-68, -60, k), y0], [-70, 115]], 12, '#9aa0a8') +
    (k > 0.4 ? `<path d="M-62 ${y0} q-14 -10 -24 -26 M-60 ${y0 + 8} q10 -12 22 -18" stroke="#4a5059" stroke-width="5" fill="none" stroke-linecap="round"/>` : '') +
    (marcas ? `<circle cx="-66" cy="74" r="5" fill="#8a1f1b"/><circle cx="-62" cy="88" r="5" fill="#8a1f1b"/>` : '');
}
const audifonosLado = `<path d="M50 -58 A42 50 0 0 1 128 -60" fill="none" stroke="${INK}" stroke-width="20"/><path d="M50 -58 A42 50 0 0 1 128 -60" fill="none" stroke="#2a2d33" stroke-width="11"/>
  <rect x="70" y="-74" width="34" height="44" rx="12" fill="#2a2d33" stroke="${INK}" stroke-width="5"/><circle cx="87" cy="-52" r="4" fill="#3fd06a" stroke="none"/>`;
function chispa(x, y, s, o = {}) {
  const b = o.blancos || 0;
  return `<g filter="url(#ink)" transform="translate(${x} ${y}) scale(${o.voltea ? -s : s} ${s})">${perroMordido(o.modo || 'parada', o.g ?? 0.65, true, o.cola || 0)}
    ${b > 0 ? `<circle cx="111" cy="-58" r="10" fill="#f2f2f2" stroke="${INK}" stroke-width="4" opacity="${b}"/>` : ''}${o.audifonos ? audifonosLado : ''}</g>`;
}
// Ojos blancos sobre caraChispa (sin pupila).
const ojosBlancos = p => p > 0 ? [-95, 95].map(x => `<circle cx="${x}" cy="-10" r="34" fill="#f2f2f2" stroke="${INK}" stroke-width="9" opacity="${p}"/>`).join('') : '';
// Audífonos de operadora sobre caraChispa.
const audifonosCara = `<g stroke-linejoin="round"><path d="M-318 40 A318 350 0 0 1 318 40" fill="none" stroke="${INK}" stroke-width="58"/>
  <path d="M-318 40 A318 350 0 0 1 318 40" fill="none" stroke="#2a2d33" stroke-width="40"/>
  ${[-1, 1].map(l => `<rect x="${l * 315 - 50}" y="-70" width="100" height="210" rx="38" fill="#2a2d33" stroke="${INK}" stroke-width="10"/>
    <rect x="${l * 315 - 30}" y="-40" width="60" height="150" rx="24" fill="#3a3e46"/>`).join('')}
  <circle cx="315" cy="0" r="9" fill="#3fd06a"/></g>`;
// Llave de tuercas. (x, y): donde la agarra la mano; la cabeza apunta hacia arriba antes de rotar.
const llave = (x, y, s = 1, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})" filter="url(#ink)">
  <rect x="-15" y="-205" width="30" height="230" rx="12" fill="#a7adb5" stroke="${INK}" stroke-width="7"/>
  <path d="M17 -282 L17 -236 L-17 -236 L-17 -282 A50 50 0 1 0 17 -282 Z" fill="#a7adb5" stroke="${INK}" stroke-width="7"/>
  <path d="M-5 -180 L-5 -20" stroke="#d9dee6" stroke-width="6"/></g>`;
// Consola portátil de Evelin.
const consola = (x, y, s = 1, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})" filter="url(#ink)">
  <path d="M40 -50 L58 -120" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><circle cx="58" cy="-122" r="8" fill="${ROJO}" stroke="${INK}" stroke-width="4"/>
  <rect x="-75" y="-55" width="150" height="105" rx="14" fill="#6b7280" stroke="${INK}" stroke-width="7"/>
  <rect x="-60" y="-40" width="80" height="50" rx="6" fill="#0e2a26" stroke="${INK}" stroke-width="4"/>
  <path d="M-52 -15 l12 -10 l12 14 l12 -18 l12 12 l12 -6" fill="none" stroke="#3fb8a8" stroke-width="4"/>
  <circle cx="48" cy="-15" r="14" fill="${ROJO}" stroke="${INK}" stroke-width="5"/>${[0, 1, 2].map(i => `<rect x="${-58 + i * 30}" y="22" width="22" height="14" rx="4" fill="#3a3e46"/>`).join('')}</g>`;
// Los audífonos sueltos, en las manos de Evelin.
const audifonosSueltos = (x, y, s = 1, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">
  <path d="M-60 20 A62 70 0 0 1 60 20" fill="none" stroke="${INK}" stroke-width="20"/><path d="M-60 20 A62 70 0 0 1 60 20" fill="none" stroke="#2a2d33" stroke-width="12"/>
  ${[-1, 1].map(l => `<rect x="${l * 60 - 18}" y="0" width="36" height="52" rx="14" fill="#2a2d33" stroke="${INK}" stroke-width="5"/>`).join('')}</g>`;
// El radio de la Coordinación.
const walkie = (x, y, s = 1, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})" filter="url(#ink)">
  <rect x="-90" y="-560" width="50" height="270" rx="22" fill="#1f2226" stroke="${INK}" stroke-width="8"/>
  <rect x="40" y="-330" width="40" height="40" rx="8" fill="#3a3e46" stroke="${INK}" stroke-width="6"/>
  <rect x="-150" y="-300" width="300" height="760" rx="44" fill="#1f2226" stroke="${INK}" stroke-width="10"/>
  ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="-105" y="${-220 + i * 36}" width="210" height="14" rx="7" fill="#0c0d10"/>`).join('')}
  <rect x="-120" y="40" width="240" height="120" rx="12" fill="#9fc79c" stroke="${INK}" stroke-width="7"/>
  <text x="0" y="88" text-anchor="middle" font-family="monospace" font-weight="700" font-size="26" fill="#1d3b2a">CANAL 3</text>
  <text x="0" y="132" text-anchor="middle" font-family="monospace" font-weight="700" font-size="25" fill="#1d3b2a">COORDINACIÓN</text>
  ${[0, 1, 2].map(f => [0, 1, 2].map(c => `<rect x="${-95 + c * 70}" y="${200 + f * 70}" width="50" height="44" rx="10" fill="#3a3e46" stroke="${INK}" stroke-width="4"/>`).join('')).join('')}
  <rect x="150" y="-120" width="28" height="180" rx="10" fill="#3a3e46" stroke="${INK}" stroke-width="6"/></g>`;

// El tinaco negro de la azotea. (x, y): centro de la base.
const tinaco = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#ink)">
  <path d="M-115 0 L-115 -270 Q-115 -320 -60 -330 L60 -330 Q115 -320 115 -270 L115 0 Z" fill="#202327" stroke="${INK}" stroke-width="9"/>
  ${[-230, -160, -90].map(y0 => `<path d="M-115 ${y0} Q0 ${y0 + 22} 115 ${y0}" fill="none" stroke="#33373d" stroke-width="8"/>`).join('')}
  <ellipse cx="0" cy="-332" rx="70" ry="18" fill="#2a2d33" stroke="${INK}" stroke-width="7"/><rect x="-40" y="-360" width="80" height="28" rx="8" fill="#2a2d33" stroke="${INK}" stroke-width="7"/>
  <path d="M-90 -290 Q-100 -150 -88 -30" fill="none" stroke="#3f444b" stroke-width="10" stroke-linecap="round"/></g>`;
// Rayas de viento que cruzan de izquierda a derecha. f: fuerza.
const RAYAS = (() => { const r = rng(71), g = []; for (let i = 0; i < 22; i++) g.push({ y: 80 + r() * 1700, l: 120 + r() * 260, v: 0.6 + r() * 0.8, o: r() }); return g; })();
const viento = (t, f = 1) => f <= 0 ? '' : RAYAS.map(p => { const x = ((t * p.v * 900 * (0.6 + f) + p.o * 1600) % 1600) - 300;
  return `<path d="M${x} ${p.y} q${p.l * 0.5} ${-14} ${p.l} 0" fill="none" stroke="#fff" stroke-width="${5 + 3 * f}" stroke-linecap="round" opacity="${0.18 + 0.32 * Math.min(f, 1.5)}"/>`; }).join('');

// La azotea del centro de alerta: cielo nublado, ciudad, pretil, la torre de la antena, el gabinete, la caseta y el tinaco.
const NUBES = `<g fill="#e9edf2" opacity=".55"><ellipse cx="220" cy="300" rx="260" ry="70"/><ellipse cx="330" cy="260" rx="160" ry="60"/>
  <ellipse cx="880" cy="520" rx="240" ry="60"/><ellipse cx="780" cy="490" rx="140" ry="50"/><ellipse cx="160" cy="760" rx="200" ry="50"/></g>`;
const CIUDAD = `<g fill="#a3adba" stroke="#8792a1" stroke-width="5">${[[0, 1080, 140], [130, 1020, 120], [240, 1110, 160], [390, 990, 110], [490, 1070, 150], [630, 1040, 130], [750, 1100, 170], [910, 1000, 170]]
  .map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${1260 - y}"/>`).join('')}</g>`;
function torre(cx, base, top) {
  const izq = y => lerp(cx - 130, cx - 22, (base - y) / (base - top)), der = y => lerp(cx + 130, cx + 22, (base - y) / (base - top));
  let s = `<path d="M${cx - 130} ${base} L${cx - 22} ${top} M${cx + 130} ${base} L${cx + 22} ${top}" stroke="#7d848e" stroke-width="16" fill="none"/>`;
  for (let i = 0; i < 7; i++) {
    const y1 = base - (base - top) * i / 7, y2 = base - (base - top) * (i + 1) / 7;
    s += `<path d="M${izq(y1)} ${y1} L${der(y2)} ${y2} M${der(y1)} ${y1} L${izq(y2)} ${y2} M${izq(y2)} ${y2} L${der(y2)} ${y2}" stroke="#8e959f" stroke-width="7" fill="none"/>`;
  }
  return s + `<rect x="${cx - 70}" y="${top + 160}" width="40" height="110" rx="6" fill="#d9dee6" stroke="${INK}" stroke-width="5"/>
    <rect x="${cx + 30}" y="${top + 230}" width="40" height="110" rx="6" fill="#d9dee6" stroke="${INK}" stroke-width="5"/>
    <path d="M${cx} ${top} L${cx} ${top - 60}" stroke="#7d848e" stroke-width="10"/>`;
}
const azotea = pre => `<rect width="1080" height="1920" fill="url(#ventanaDia)"/>${NUBES}
  <g filter="url(#ink)">${CIUDAD}
    <rect x="-20" y="1240" width="1120" height="70" fill="#a9abb1" stroke="${INK}" stroke-width="8"/>
    <rect x="-20" y="1310" width="1120" height="660" fill="#80838b"/>
    <path d="M-20 1500 L1100 1500 M-20 1720 L1100 1720 M300 1310 L200 1960 M700 1310 L820 1960" stroke="#73767e" stroke-width="5"/>
    ${torre(640, 1320, 190)}
    <rect x="540" y="1060" width="200" height="270" rx="8" fill="#b8bcc4" stroke="${INK}" stroke-width="8"/>
    ${[0, 1, 2, 3].map(i => `<path d="M565 ${1090 + i * 22} h70" stroke="#80838b" stroke-width="6"/>`).join('')}
    <path d="M690 1210 l22 40 h-44 z" fill="#e5a83b" stroke="${INK}" stroke-width="5"/>
    <rect x="20" y="880" width="290" height="450" fill="#a8a29a" stroke="${INK}" stroke-width="9"/>
    <rect x="0" y="860" width="330" height="40" fill="#8f897f" stroke="${INK}" stroke-width="8"/>
    <rect x="105" y="1040" width="130" height="290" fill="#14171c" stroke="${INK}" stroke-width="8"/>
  </g>
  ${tinaco(935, 1330, 0.85)}
  <circle id="${pre}-roja" cx="640" cy="122" r="17" fill="${ROJO}"/>
  <g id="${pre}-cosas"></g><g id="${pre}-viento"></g>`;
const parpadea = (pre, t) => $(`#${pre}-roja`).setAttribute('opacity', Math.sin(t * 6) > 0 ? 1 : 0.25);
// Fondo cercano: cielo, pretil y piso.
const fondoCerca = (horiz = 1150) => `<rect width="1080" height="1920" fill="url(#ventanaDia)"/>${NUBES}
  <g filter="url(#ink)"><g transform="translate(0 ${horiz - 1240})">${CIUDAD}</g>
    <rect x="-20" y="${horiz}" width="1120" height="70" fill="#a9abb1" stroke="${INK}" stroke-width="8"/>
    <rect x="-20" y="${horiz + 70}" width="1120" height="${1900 - horiz}" fill="#80838b"/></g>`;

// ---------- Piezas nuevas de esta parte ----------
// Pose de alguien corriendo de lado hacia la derecha, pies en (x, y).
function poseCorre(x, y, r, fase, o = {}) {
  const p = Math.sin(fase), q = Math.cos(fase), lean = r * 0.3;
  return { head: [x + lean, y - r * 5.1], r, neck: [x + lean * 0.8, y - r * 4.0], hip: [x, y - r * 1.9],
    legL: [[x + r * 0.5 * p, y - r * 0.95], [x + r * 0.9 * p - r * 0.1, y - Math.max(0, q) * r * 0.3]],
    legR: [[x - r * 0.5 * p, y - r * 0.95], [x - r * 0.9 * p - r * 0.1, y - Math.max(0, -q) * r * 0.3]], footL: 1, footR: 1,
    armL: o.armL || [[x + lean - r * 0.6 * p, y - r * 3.1], [x + lean - r * 0.9 * p + r * 0.3, y - r * 2.6]],
    armR: o.armR || [[x + lean + r * 0.6 * p, y - r * 3.1], [x + lean + r * 0.9 * p + r * 0.3, y - r * 2.6]], look: o.look ?? r * 0.12, lookY: o.lookY || 0 };
}
// Voltea un dibujo para que mire a la izquierda, sobre la vertical x.
const espejo = (x, s) => `<g transform="translate(${2 * x} 0) scale(-1 1)">${s}</g>`;
const tuCorre = (x, y, r, fase, o) => `<g filter="url(#contorno)">${stick(poseCorre(x, y, r, fase, o))}</g>`;
const evelinCorre = (x, y, r, fase, o) => `<g filter="url(#contorno)">${evelin({ ...poseCorre(x, y, r, fase, o), audifonos: 'no' })}</g>`;
// Memo corriendo con las manos arriba (finge que se rinde).
function memoCorre(x, y, r, fase, o = {}) {
  const lean = r * 0.3;
  const armL = [[x + lean - r * 1.0, y - r * 4.3], [x + lean - r * 1.2, y - r * 5.6]], armR = [[x + lean + r * 1.0, y - r * 4.3], [x + lean + r * 1.25, y - r * 5.6]];
  const P = poseCorre(x, y, r, fase, { armL, look: o.look ?? 4 });
  return `<g filter="url(#contorno)">${memo({ ...P, armR: undefined })}${venas(P.head[0], P.head[1], r, 1)}${quijada(P.head[0], P.head[1], r)}${brazoMordido([P.neck[0], P.neck[1] + r * 0.4], armR[0], armR[1], r)}</g>`;
}
const manosArriba = (x, y, r) => ({ armL: [[x - r * 1.05, y - r * 4.3], [x - r * 1.25, y - r * 5.7]], armR: [[x + r * 1.05, y - r * 4.3], [x + r * 1.3, y - r * 5.7]] });
// Chispa corriendo (rebota). o.voltea: hacia la izquierda.
const chispaCorre = (x, y, s, t, o = {}) => chispa(x, y - Math.abs(Math.sin(t * 12)) * 14 * s, s, { g: 0.75, ...o });
// Evelin con la consola apretada contra el pecho.
const evelinConsola = (x, y, r, o = {}) => evelinDe(x, y, r, { ...o, brazosAlFrente: true, audifonos: 'no',
  armL: [[x - r * 0.62, y - r * 3.1], [x - r * 0.12, y - r * 3.35]], armR: [[x + r * 0.62, y - r * 3.1], [x + r * 0.12, y - r * 3.35]] }) +
  consola(x, y - r * 3.25, r * 0.0078);

// Una avenida de día, de lado. o.poste: x del poste de la alerta.
const EDIFICIOS = [[-20, 290, 640, '#8d8a86'], [270, 230, 520, '#a39a8e'], [500, 300, 720, '#7c8088'], [800, 300, 600, '#9b8f80']];
function calle(o = {}) {
  return `<rect width="1080" height="1920" fill="url(#ventanaDia)"/>${NUBES}
    <g filter="url(#ink)">
      ${EDIFICIOS.map(([x, w, h, c]) => { const y = 1250 - h; let v = '';
        for (let f = 0; f < Math.floor((h - 90) / 150); f++) for (let k = 0; k < Math.floor((w - 40) / 90); k++) v += `<rect x="${x + 30 + k * 90}" y="${y + 50 + f * 150}" width="56" height="80" fill="#2a2d33" stroke="${INK}" stroke-width="5"/>`;
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${INK}" stroke-width="9"/>${v}`; }).join('')}
      <rect x="-20" y="1250" width="1120" height="70" fill="#a9abb1" stroke="${INK}" stroke-width="8"/>
      <rect x="-20" y="1320" width="1120" height="660" fill="#3d4048"/>
      ${[0, 1, 2, 3, 4].map(i => `<rect x="${i * 260 - 40}" y="1470" width="150" height="18" fill="#e9e2d6"/>`).join('')}
    </g>${o.poste ? poste(o.poste, 660, 0.9, 660) : ''}`;
}
// Bajo el puente: el paso a desnivel, oscuro, lleno de infectados quietos.
const BAJO = (() => { const r = rng(31), g = []; for (let f = 0; f < 5; f++) for (let i = 0; i < 6 + f * 2; i++) g.push({ x: (i + 0.5) / (6 + f * 2) * 1160 - 40 + (r() - 0.5) * 50, y: 1330 - f * 48 + (r() - 0.5) * 14, h: 330 * Math.pow(0.86, f), l: (r() - 0.5) * 0.03 }); return g.sort((a, b) => a.y - b.y); })();
const bajoGente = (t, quita = 0) => BAJO.map((p, i) => `<g transform="translate(${p.x + Math.sin(t * 1.3 + i) * 2 + quita * (300 + i * 9)} ${p.y}) scale(${p.h})">${infectadoQuieto(0, p.l, -0.035)}</g>`).join('');
const puente = `<rect width="1080" height="1920" fill="url(#ventanaDia)"/>${NUBES}
  <g filter="url(#ink)">
    <rect x="-20" y="680" width="1120" height="650" fill="#1f2228"/>
    <rect x="-20" y="420" width="1120" height="260" fill="#8d9097" stroke="${INK}" stroke-width="10"/>
    <rect x="-20" y="370" width="1120" height="50" fill="#a9abb1" stroke="${INK}" stroke-width="8"/>
    ${[...Array(12)].map((_, i) => `<rect x="${i * 100}" y="300" width="16" height="70" fill="#6f737b" stroke="${INK}" stroke-width="4"/>`).join('')}
    <rect x="-20" y="290" width="1120" height="20" fill="#6f737b" stroke="${INK}" stroke-width="5"/>
    <rect x="40" y="680" width="110" height="650" fill="#5f636b" stroke="${INK}" stroke-width="8"/>
    <rect x="930" y="680" width="110" height="650" fill="#5f636b" stroke="${INK}" stroke-width="8"/>
    <rect x="-20" y="1320" width="1120" height="660" fill="#3d4048"/>
    ${[0, 1, 2, 3, 4].map(i => `<rect x="${i * 260 - 40}" y="1470" width="150" height="18" fill="#e9e2d6"/>`).join('')}
  </g>`;
// Ondas rojas que llegan desde un lado (la alerta que suena lejos).
const ondasLejos = (t, x, y, dir = 1, n = 3) => [...Array(n)].map((_, k) => { const f = ((t * 1.4) + k / n) % 1;
  return `<path d="M${x - dir * f * 500} ${y - 160 - f * 120} q${-dir * (60 + f * 60)} ${160 + f * 120} 0 ${320 + f * 240}" fill="none" stroke="${ROJO}" stroke-width="12" stroke-linecap="round" opacity="${0.85 * (1 - f)}"/>`; }).join('');


// Vela, radio viejo, estática, libreta y lápiz (copia de la temporada 2, parte 1)
const vela = (x, y, t, s = 1) => {
  const fl = Math.sin(t * 17) * 4 + Math.sin(t * 11) * 3;
  return `<circle cx="${x}" cy="${y - 40 * s}" r="${260 * s}" fill="url(#luzCalida)"/>
    <rect x="${x - 17 * s}" y="${y}" width="${34 * s}" height="${110 * s}" fill="#efe6cf" stroke="${INK}" stroke-width="${5 * s}"/>
    <path d="M${x} ${y} q${-17 * s} ${-28 * s} 0 ${-(62 + fl) * s} q${17 * s} ${(34 + fl / 2) * s} 0 ${(62 + fl) * s} z" fill="#f3c46a" stroke="#c9792b" stroke-width="3"/>`;
};
const radioViejo = (x, y, t, prendido = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#ink)">
  <rect x="-230" y="-170" width="460" height="300" rx="34" fill="#6b4a2f" stroke="${INK}" stroke-width="9"/>
  <rect x="-200" y="-140" width="220" height="240" rx="18" fill="#3a2a1c" stroke="${INK}" stroke-width="6"/>
  ${[...Array(9)].map((_, i) => `<line x1="-190" y1="${-125 + i * 26}" x2="10" y2="${-125 + i * 26}" stroke="#2a1d13" stroke-width="7"/>`).join('')}
  <rect x="45" y="-140" width="160" height="90" rx="10" fill="${prendido ? '#ffcf7a' : '#d9c79a'}" stroke="${INK}" stroke-width="6"/>
  ${[0, 1, 2, 3, 4, 5].map(i => `<line x1="${60 + i * 26}" y1="-130" x2="${60 + i * 26}" y2="-112" stroke="${INK}" stroke-width="3"/>`).join('')}
  <line x1="${110 + Math.sin(t * (prendido ? 3.1 : 0.7)) * (prendido ? 40 : 6)}" y1="-136" x2="${110 + Math.sin(t * (prendido ? 3.1 : 0.7)) * (prendido ? 40 : 6)}" y2="-58" stroke="${ROJO}" stroke-width="5"/>
  <circle cx="85" cy="40" r="38" fill="#9aa3ad" stroke="${INK}" stroke-width="6"/><circle cx="170" cy="40" r="38" fill="#9aa3ad" stroke="${INK}" stroke-width="6"/>
  <line x1="85" y1="40" x2="85" y2="10" stroke="${INK}" stroke-width="6"/><line x1="170" y1="40" x2="190" y2="16" stroke="${INK}" stroke-width="6"/>
  <path d="M150 -170 L190 -420 L120 -470 L260 -470 L190 -420 M190 -470 L230 -640 L170 -680 L290 -680 L230 -640" fill="none" stroke="#b8bec6" stroke-width="8" stroke-linejoin="round"/>
  ${prendido ? `<circle cx="125" cy="-95" r="70" fill="#ffcf7a" opacity=".25" filter="url(#blur10)"/>` : ''}</g>`;
// Estática que sale del radio.
const estatica = (x, y, t, n = 4) => [...Array(n)].map((_, k) => {
  const f = (t * 1.6 + k / n) % 1, R = 80 + f * 380;
  let d = `M${x - R} ${y}`;
  for (let i = 1; i <= 12; i++) d += ` L${x - R + i * (2 * R / 12)} ${y - Math.sqrt(Math.max(0, R * R - Math.pow(-R + i * (2 * R / 12), 2))) * 0.35 + (i % 2 ? -10 : 10)}`;
  return `<path d="${d}" fill="none" stroke="#fff" stroke-width="5" opacity="${(1 - f) * 0.6}"/>`;
}).join('');
function radioYLibreta(pre) {
  return `
    <rect width="1080" height="1920" fill="#1d1519"/>
    <circle cx="540" cy="700" r="900" fill="url(#luzCalida)" opacity=".55"/>
    <g id="${pre}-radio"></g>
    <g id="${pre}-morse"></g>
    <g filter="url(#ink)" transform="rotate(-2 540 1180)">
      <rect x="110" y="900" width="860" height="560" fill="#f6f3ea" stroke="${INK}" stroke-width="7"/>
      ${[...Array(12)].map((_, i) => `<line x1="110" y1="${940 + i * 44}" x2="970" y2="${940 + i * 44}" stroke="#b8cde4" stroke-width="2"/>`).join('')}
      ${[...Array(20)].map((_, i) => `<line x1="${150 + i * 44}" y1="900" x2="${150 + i * 44}" y2="1460" stroke="#b8cde4" stroke-width="2"/>`).join('')}
      <line x1="200" y1="900" x2="200" y2="1460" stroke="#e06a6a" stroke-width="3"/>
    </g>
    <g id="${pre}-letras" transform="rotate(-2 540 1180)"></g>
    <g id="${pre}-mano" filter="url(#ink)"></g>
    ${viñeta}`;
}
const morseVisual = (m, t, y) => {
  // los pitidos que ya sonaron, como puntos y rayas
  let x = 140, s = '';
  for (const p of m.pitidos) {
    if (p.s > t) break;
    const w = p.d > (m.pitidos[0].d * 2) ? 46 : 16;
    s += `<rect x="${x}" y="${y}" width="${w}" height="16" rx="8" fill="${ROJO}"/>`;
    x += w + 12; if (x > 960) x = 140;
  }
  return s;
};
const anchoLetra = (c, size) => size * (c === ' ' ? 0.35 : c === 'M' || c === 'W' ? 0.7 : c === 'I' ? 0.32 : c === 'J' ? 0.4 : 0.52);
const letrasEscritas = (texto, letras, t, x0, y0, size, color = TINTA, temblor = false) => {
  let s = '', x = x0;
  [...texto].forEach((c, i) => {
    const w = anchoLetra(c, size);
    if (c !== ' ' && letras[i] !== null && t >= letras[i]) s += `<text x="${x}" y="${y0 + (temblor ? Math.sin(i * 2.3) * 6 : 0)}" font-family="Caveat" font-weight="700" font-size="${size}" fill="${color}"${temblor ? ' filter="url(#tiembla)"' : ''}>${c}</text>`;
    x += w;
  });
  return s;
};
// Dónde está la punta del lápiz: al final de la última letra escrita. lineas: [{texto, letras, x0, y0, size}]
function puntaLapiz(lineas, t) {
  let punta = { x: lineas[0].x0, y: lineas[0].y0 }, ultima = -Infinity, fin = -Infinity;
  for (const L of lineas) {
    let x = L.x0;
    [...L.texto].forEach((c, i) => {
      x += anchoLetra(c, L.size);
      if (c === ' ' || L.letras[i] === null) return;
      fin = Math.max(fin, L.letras[i]);
      if (t >= L.letras[i] && L.letras[i] > ultima) { ultima = L.letras[i]; punta = { x, y: L.y0 }; }
    });
  }
  const fuera = ease.inOut(clamp((t - fin - 0.1) / 0.45));
  return { x: punta.x + 40 + fuera * 420, y: punta.y + 10 + fuera * 380 };
}
const escribeLineas = (lineas, t, temblor) => lineas.map(L => letrasEscritas(L.texto, L.letras, t, L.x0, L.y0, L.size, L.color || TINTA, temblor)).join('');
const manoLapiz = (x, y, t) => `<g transform="translate(${x + Math.sin(t * 30) * 3} ${y})">
  <path d="M-30 -10 L140 -170" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M-30 -10 L140 -170" stroke="#e5c07a" stroke-width="12" stroke-linecap="round"/>
  <path d="M-40 0 L-28 -12" stroke="#333" stroke-width="10" stroke-linecap="round"/>
  <ellipse cx="80" cy="-60" rx="80" ry="60" fill="#e9e2d6" stroke="${INK}" stroke-width="7"/>
  <path d="M140 -30 L360 60 L330 140 L110 40 Z" fill="#8d8f96" stroke="${INK}" stroke-width="7"/></g>`;

// ---------- Piezas nuevas de esta parte ----------
// Tú cargando a Chispa (con audífonos), pies en (x, y).
const tuConChispa = (x, y, r, t, o = {}) => tuDe(x, y, r, { look: o.look ?? 8, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1,
  armL: [[x + r * 0.5, y - r * 3.17], [x + r * 1.3, y - r * 3.0]], armR: [[x + r * 0.9, y - r * 3.4], [x + r * 1.5, y - r * 3.3]] }) +
  chispa(x + r * 1.35 + (o.tiembla ? Math.sin(t * 50) * 2 : 0), y - r * 3.55, r * 0.0065, { g: 0.85, audifonos: true });
// El gris que ya pasó la cadera, sobre la Chispa de lado.
const grisCadera = `<path d="M-90 -16 Q-74 -48 -36 -42 Q-18 -10 -34 28 Q-62 46 -88 22 Z" fill="#9aa0a8" opacity=".95"/>
  <path d="M-36 -30 q14 -4 26 -16 M-30 0 q16 0 30 -8 M-40 22 q12 8 26 6" fill="none" stroke="#4a5059" stroke-width="5" stroke-linecap="round"/>`;
const chispaCadera = (x, y, s, t) => `<g filter="url(#ink)" transform="translate(${x + Math.sin(t * 45) * 3} ${y}) scale(${s})">${perroMordido('parada', 1, true)}${grisCadera}${audifonosLado}</g>`;
// Brazo con guante negro que sale de lo oscuro. (x0, y0): hombro escondido; (x1, y1): la mano.
const guante = (x0, y0, x1, y1) => `<g filter="url(#ink)"><path d="M${x0} ${y0} L${x1} ${y1}" stroke="#050608" stroke-width="44" stroke-linecap="round"/>
  <path d="M${x0} ${y0} L${x1} ${y1}" stroke="#16181d" stroke-width="30" stroke-linecap="round"/>
  <circle cx="${x1}" cy="${y1}" r="30" fill="#0b0c0f" stroke="#050608" stroke-width="6"/><path d="M${x1 - 12} ${y1 - 14} q10 -6 20 0" stroke="#3a3e46" stroke-width="4" fill="none"/></g>`;
// La reja del estadio: un muro con letrero, el emblema de la Coordinación, la bocina y una reja corrediza. abre: 0 a 1.
function estadioReja(t, abre) {
  const dx = abre * 380;
  return `<rect width="1080" height="1920" fill="#1c1a24"/>
    <g filter="url(#ink)">
      <rect x="-20" y="300" width="1120" height="1120" fill="#5f636b" stroke="${INK}" stroke-width="10"/>
      ${[...Array(9)].map((_, i) => `<path d="M-20 ${360 + i * 120} H1100" stroke="#565a62" stroke-width="5"/>`).join('')}
      <rect x="300" y="700" width="480" height="720" fill="#08090c" stroke="${INK}" stroke-width="10"/>
      <rect x="250" y="440" width="580" height="130" rx="10" fill="#2a2d33" stroke="${INK}" stroke-width="8"/>
      <text x="540" y="532" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="84" letter-spacing="10" fill="#d9dee6">ESTADIO</text>
      <circle cx="540" cy="640" r="44" fill="#e9e2d6" stroke="${INK}" stroke-width="7"/><path d="M558 618 a28 28 0 1 0 0 44" fill="none" stroke="${ROJO}" stroke-width="10"/>
      <rect x="-20" y="1420" width="1120" height="560" fill="#2a2d33" stroke="${INK}" stroke-width="8"/>
      <path d="M840 640 l90 -50 v150 l-90 -50 z" fill="#8d9097" stroke="${INK}" stroke-width="6"/><rect x="810" y="655" width="34" height="70" fill="#6f737b" stroke="${INK}" stroke-width="5"/>
    </g>
    <circle cx="540" cy="1000" r="${200 + 60 * abre}" fill="#e9eef7" opacity="${0.08 + 0.1 * abre}" filter="url(#blur10)"/>
    <g id="es-dentro"></g>
    <g filter="url(#ink)" transform="translate(${dx} 0)">
      <rect x="300" y="700" width="480" height="24" fill="#3a3e46" stroke="${INK}" stroke-width="5"/>
      ${[...Array(9)].map((_, i) => `<rect x="${318 + i * 54}" y="700" width="16" height="720" fill="#3a3e46" stroke="${INK}" stroke-width="5"/>`).join('')}
      <rect x="300" y="1060" width="480" height="20" fill="#3a3e46" stroke="${INK}" stroke-width="5"/>
    </g>`;
}
const ondasBocina = (t, on) => on ? [0, 1, 2].map(k => { const f = ((t * 1.8) + k / 3) % 1;
  return `<path d="M${945 + f * 100} ${590 - f * 70} q${40 + f * 30} ${75 + f * 70} 0 ${150 + f * 140}" fill="none" stroke="#fff" stroke-width="8" opacity="${0.85 * (1 - f)}"/>`; }).join('') : '';
// La cocina de Rosa de noche, con la vela. fria: 0 (vela prendida) a 1 (apagada, luz de luna).
const cocinaRosa = `<rect width="1080" height="1920" fill="#2e221d"/>
  <g filter="url(#ink)"><rect x="-20" y="1380" width="1120" height="600" fill="#3a2a1f" stroke="${INK}" stroke-width="8"/>
    <rect x="660" y="300" width="300" height="360" fill="#1a2233" stroke="${INK}" stroke-width="10"/><path d="M810 300 v360 M660 480 h300" stroke="${INK}" stroke-width="7"/>
    <path d="M662 302 h296 v60 q-20 20 -37 0 q-20 20 -37 0 q-20 20 -37 0 q-20 20 -37 0 q-20 20 -37 0 q-20 20 -37 0 q-20 20 -37 0 q-20 20 -37 0z" fill="#d8a7b5" opacity=".9"/></g>`;
// Reloj de pared en las doce.
const relojDoce = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#ink)"><circle r="90" fill="#efe6cf" stroke="${INK}" stroke-width="9"/>
  ${[...Array(12)].map((_, i) => { const a = i / 12 * Math.PI * 2; return `<line x1="${Math.sin(a) * 70}" y1="${-Math.cos(a) * 70}" x2="${Math.sin(a) * 82}" y2="${-Math.cos(a) * 82}" stroke="${INK}" stroke-width="5"/>`; }).join('')}
  <line x1="0" y1="0" x2="0" y2="-48" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><line x1="4" y1="0" x2="0" y2="-70" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>`;
// La libreta de Rosa con "3:14" escrito muchas veces.
const libreta314 = (x, y, rojo = false) => `<g transform="translate(${x} ${y}) rotate(-6)"><rect x="0" y="0" width="330" height="420" fill="#f6f3ea" stroke="${INK}" stroke-width="6" filter="url(#ink)"/>
  ${[...Array(7)].map((_, i) => `<text x="${24 + (i % 2) * 150}" y="${70 + Math.floor(i / 2) * 95}" font-family="Caveat" font-weight="700" font-size="66" fill="${rojo && i === 6 ? ROJO : TINTA}">3:14</text>`).join('')}</g>`;
// La escalera del Edificio C de lado (como en la temporada 2, parte 2): pisos de 300 px, planta baja en BASE.
const ALTO = 300, BASE = 1480;
const xEsc = u => { const f = u - Math.floor(u); return f < 0.5 ? 640 + 300 * (f / 0.5) : 940 - 300 * ((f - 0.5) / 0.5); };
const yEsc = u => BASE - ALTO * u;
const LLENA = (() => { const r = rng(19), g = []; for (let i = 0; i < 30; i++) g.push({ u: 0.06 + i * 0.096 + (r() - 0.5) * 0.03, dx: (r() - 0.5) * 30, l: (r() - 0.5) * 0.03, ph: r() * 6 }); return g; })();
const edificioCorte = `<rect width="1080" height="1920" fill="#0b0f17"/>
  <g filter="url(#ink)">
    <rect x="80" y="${BASE - ALTO * 5}" width="920" height="${ALTO * 5}" fill="#141a25" stroke="${INK}" stroke-width="10"/>
    ${[0, 1, 2, 3, 4].map(k => { const y = BASE - ALTO * k;
      return `<rect x="80" y="${y - 14}" width="920" height="14" fill="#2c313c"/>
      <polyline points="640,${y} 940,${y - ALTO / 2} 640,${y - ALTO}" fill="none" stroke="#3a3f4a" stroke-width="12"/>
      <rect x="470" y="${y - 190}" width="110" height="176" fill="${k === 3 ? '#1a1410' : '#2a2018'}" stroke="${INK}" stroke-width="6"/>
      <text x="525" y="${y - 200}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="34" fill="#9aa0a8">${k ? (k + 1) + '02' : 'PB'}</text>`; }).join('')}
    <rect x="80" y="${BASE}" width="920" height="480" fill="#1a1f2a"/>
  </g>`;


// ---------- Piezas nuevas de esta parte ----------
// La fachada del Edificio C con su luz. cielo: id del degradado del cielo; luzVentanas: 0 a 1.
function fachada(cielo, luzVentanas = 0, dia = false) {
  let v = '';
  for (let f = 0; f < 5; f++) for (let c = 0; c < 3; c++) {
    const x = 130 + c * 310, y = 400 + f * 190;
    v += `<rect x="${x}" y="${y}" width="200" height="130" fill="${dia ? '#8fa3b8' : '#121722'}" stroke="${INK}" stroke-width="7"/>
      <rect x="${x}" y="${y}" width="200" height="130" fill="#ffcf7a" opacity="${luzVentanas * (0.5 + 0.5 * ((f * 3 + c) % 2))}"/>
      <line x1="${x + 100}" y1="${y}" x2="${x + 100}" y2="${y + 130}" stroke="#2a2f3a" stroke-width="6"/>`;
  }
  return `<rect width="1080" height="1920" fill="url(#${cielo})"/>
    <g filter="url(#ink)"><rect x="60" y="350" width="960" height="1000" fill="${dia ? '#9a958c' : '#2f323c'}" stroke="${INK}" stroke-width="10"/>${v}
      <rect x="-20" y="1340" width="1120" height="600" fill="${dia ? '#8a8d94' : '#1a1f2a'}" stroke="${INK}" stroke-width="8"/></g>`;
}
// Vecinos asomados en las ventanas de la fachada. k: 0 a 1 (qué tanto se asoman).
const VENTANAS_VECINOS = [[0, 0, '#e5a83b'], [0, 2, '#9fd0ff'], [2, 1, '#f2a6b5'], [3, 0, '#8fd18f'], [4, 2, '#e5a83b'], [2, 2, '#9fd0ff'], [4, 0, '#f2a6b5']];
const vecinosVentanas = k => VENTANAS_VECINOS.map(([f, c, color]) => { const x = 130 + c * 310, y = 400 + f * 190;
  return `<svg x="${x}" y="${y}" width="200" height="130" viewBox="${x} ${y} 200 130">${vecino(x + 100, y + 130 + lerp(110, 0, k), 150, color, { look: 4 })}</svg>`; }).join('');
// El tablero viejo del centro de alerta (1995). lamp(i) da el color de cada foco; palanca: 0 a 1.
const LAMPARAS = (() => { const g = []; for (let f = 0; f < 4; f++) for (let c = 0; c < 6; c++) g.push({ x: 180 + c * 90, y: 800 + f * 80 }); return g; })();
const ESTADIO_L = { x: 660, y: 760 };
function tableroViejo(t, o = {}) {
  const lamp = o.lamp || (() => '#3a3f2e'), pal = o.palanca || 0;
  return `<g filter="url(#ink)">
    <rect x="60" y="640" width="960" height="600" rx="16" fill="#7d7a62" stroke="${INK}" stroke-width="10"/>
    <rect x="300" y="660" width="480" height="56" rx="8" fill="#efe6cf" stroke="${INK}" stroke-width="5"/>
    <text x="540" y="701" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="32" letter-spacing="3" fill="${INK}">SISTEMA DE ALERTA · 1995</text>
    <rect x="120" y="740" width="640" height="360" rx="10" fill="#1c2a22" stroke="${INK}" stroke-width="7"/>
    ${LAMPARAS.map((l, i) => `<circle cx="${l.x}" cy="${l.y}" r="22" fill="${lamp(i)}" stroke="${INK}" stroke-width="5"/>`).join('')}
    <circle cx="${ESTADIO_L.x}" cy="${ESTADIO_L.y + 120}" r="40" fill="${o.estadio || '#3a3f2e'}" stroke="${INK}" stroke-width="6"/>
    <text x="${ESTADIO_L.x}" y="${ESTADIO_L.y + 196}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="30" fill="#efe6cf">ESTADIO</text>
    ${[0, 1].map(k => `<circle cx="880" cy="${800 + k * 130}" r="52" fill="#efe6cf" stroke="${INK}" stroke-width="6"/>
      <line x1="880" y1="${800 + k * 130}" x2="${880 + Math.sin(t * (2 + k) + k) * 36}" y2="${800 + k * 130 - 34}" stroke="${ROJO}" stroke-width="5"/>`).join('')}
    <rect x="820" y="1060" width="120" height="150" rx="10" fill="#5a5845" stroke="${INK}" stroke-width="6"/>
    <g transform="rotate(${lerp(-30, 30, pal)} 880 1170)"><rect x="872" y="1040" width="16" height="130" fill="#c9ccd2" stroke="${INK}" stroke-width="5"/><circle cx="880" cy="1040" r="26" fill="${ROJO}" stroke="${INK}" stroke-width="6"/></g>
    <text x="880" y="1235" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="28" fill="#efe6cf">SEÑAL</text>
    <rect x="40" y="1240" width="1000" height="44" fill="#4a4838" stroke="${INK}" stroke-width="7"/>
  </g>`;
}
// El micrófono de pie del tablero. (x, y): la cabeza del micrófono.
const microfono = (x, y, piso = 1560) => `<g filter="url(#ink)"><path d="M${x} ${y + 40} L${x + 10} ${piso}" stroke="#2a2d33" stroke-width="12"/>
  <rect x="${x - 50}" y="${piso - 12}" width="120" height="14" rx="6" fill="#2a2d33"/>
  <rect x="${x - 34}" y="${y - 54}" width="68" height="100" rx="34" fill="#c9ccd2" stroke="${INK}" stroke-width="7"/>
  ${[0, 1, 2, 3].map(i => `<line x1="${x - 28}" y1="${y - 30 + i * 20}" x2="${x + 28}" y2="${y - 30 + i * 20}" stroke="#8d9097" stroke-width="5"/>`).join('')}</g>`;
// El frasco del suero, con el emblema de la Coordinación.
const frasco = (x, y, s = 1, brillo = 0) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#ink)">
  ${brillo > 0 ? `<circle r="90" fill="#bff3e6" opacity="${0.35 * brillo}" filter="url(#blur10)"/>` : ''}
  <rect x="-22" y="-74" width="44" height="22" rx="5" fill="#2a2d33" stroke="${INK}" stroke-width="5"/>
  <rect x="-34" y="-54" width="68" height="110" rx="14" fill="#e9f6f3" stroke="${INK}" stroke-width="6" opacity=".95"/>
  <rect x="-28" y="-14" width="56" height="64" rx="10" fill="#4fc3a1"/>
  <rect x="-34" y="-36" width="68" height="26" fill="#efe6cf" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-23" r="9" fill="none" stroke="${ROJO}" stroke-width="4"/></g>`;
// La pata gris y el gris de la cadera sobre la Chispa de lado (como en la parte 9), con opacidad.
const grisPata = op => op <= 0 ? '' : `<g opacity="${op}">${linea([[-60, 30], [-70, 115]], 22, '#050608')}${linea([[-60, 10], [-70, 115]], 12, '#9aa0a8')}
  <path d="M-62 10 q-14 -10 -24 -26 M-60 18 q10 -12 22 -18" stroke="#4a5059" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="-66" cy="74" r="5" fill="#8a1f1b"/><circle cx="-62" cy="88" r="5" fill="#8a1f1b"/>${grisCadera}</g>`;
const chispaCura = (x, y, s, t, k, o = {}) => `<g filter="url(#ink)" transform="translate(${x} ${y}) scale(${s})">${perro(k >= 1 ? 'contenta' : 'parada', k >= 1 ? Math.sin(t * 20) * 22 : 0)}${grisPata(1 - k)}${o.audifonos ? audifonosLado : ''}</g>`;
// Un helicóptero chiquito con su luz.
const heli = (x, y, s, t) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#ink)"><ellipse rx="44" ry="18" fill="#141218"/><path d="M-44 0 L-100 -8" stroke="#141218" stroke-width="8"/>
  <path d="M${-60 + Math.sin(t * 60) * 20} -24 L${60 - Math.sin(t * 60) * 20} -24" stroke="#141218" stroke-width="5"/><circle cx="-100" cy="-8" r="6" fill="${Math.sin(t * 8) > 0 ? ROJO : '#3a0f0f'}"/></g>`;
// Ondas blancas de voz que salen de un poste (la voz de Rosa en vez de la sirena).
const ondasVoz = (t, x, y, s = 1) => [0, 1, 2].map(k => { const f = ((t * 1.3) + k / 3) % 1;
  return [-1, 1].map(d => `<path d="M${x + d * (60 + f * 160) * s} ${y - (50 + f * 60) * s} q${d * 40 * s} ${(60 + f * 60) * s} 0 ${(120 + f * 120) * s}" fill="none" stroke="#fff6c8" stroke-width="${8 * s}" stroke-linecap="round" opacity="${0.85 * (1 - f)}"/>`).join(''); }).join('');

// Degradados del cielo de esta parte (en cada escena que los usa).
// Cada escena usa su propio id: un degradado repetido en una escena oculta no se ve (trampa 2 de CLAUDE.md).
const CIELO_NOCHE = id => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b16"/><stop offset="1" stop-color="#1a2440"/></linearGradient></defs>`;
const CIELO_ALBA = id => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d7fb8"/><stop offset=".55" stop-color="#f2a37a"/><stop offset="1" stop-color="#ffd59a"/></linearGradient></defs>`;

// ---------- 1. Ganó el mecate ----------
ESCENAS.gano = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="1040" r="800" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="ga-tit">GANÓ</div>
    <div class="opcion" id="ga-a" style="top:560px;font-size:66px;border-color:#e5a83b;box-shadow:0 0 40px rgba(229,168,59,.5)"><span class="emo">🪢</span><span class="txt">POR LA VENTANA, CON EL MECATE</span></div>
    <div class="opcion" id="ga-b" style="top:900px;font-size:66px"><span class="emo">🚪</span><span class="txt" style="text-decoration:line-through;text-decoration-color:#e0312b;text-decoration-thickness:10px">POR LA ESCALERA, ENTRE ELLOS</span></div>
    <div class="decide-pie" id="ga-pie" style="top:1260px">LOS COMENTARIOS ELIGIERON</div>`,
  camara: { claves: [[0, 1.0, 0, 0], [FIN('gano'), 1.08, 0, 30]], origen: '540px 760px' },
  update(lt, dur, t) {
    pop($('#ga-tit'), t, 0.02, 0.25);
    pop($('#ga-a'), t, 0.1, 0.3);
    $('#ga-a').style.transform += ` scale(${1 + 0.035 * Math.sin(t * 8)})`;
    $('#ga-b').style.opacity = 0.35;
    $('#ga-pie').style.opacity = clamp((t - M.mecateM - 0.2) / 0.3);
  },
};

// ---------- 2. Rosa baja primero por la ventana, con el mecate del tendedero ----------
ESCENAS.mecate = {
  html: lienzo(`${CIELO_NOCHE('cn1')}${fachada('cn1')}<ellipse cx="300" cy="600" rx="420" ry="300" fill="url(#luzLuna)" opacity=".35"/>
    <g id="me-escalera"></g><g filter="url(#ink)"><path d="M230 720 L236 1345" stroke="#e9e2d6" stroke-width="7"/></g><g id="me-rosa"></g><g id="me-arriba"></g>${viñeta}`),
  camara: { claves: [[INI.mecate, 1.5, 300, 300], [M.ventana, 1.5, 300, 280], [M.tendedero, 1.25, 180, 0], [FIN('mecate'), 1.2, 160, -40]] },
  update(lt, dur, t) {
    // en las ventanas de la escalera, ellos con la cara hacia arriba
    $('#me-escalera').innerHTML = [1, 2, 3, 4].map(f => { const x = 750, y = 400 + f * 190;
      return `<svg x="${x}" y="${y}" width="200" height="130" viewBox="${x} ${y} 200 130">${[0, 1, 2].map(k => `<g transform="translate(${x + 40 + k * 60} ${y + 150}) scale(140)">${infectadoQuieto(0, 0, -0.06)}</g>`).join('')}</svg>`; }).join('');
    const baja = ease.inOut(clamp((t - M.baja - 0.2) / (FIN('mecate') - M.baja + 0.4))), y = lerp(690, 1170, baja), r = 32;
    $('#me-rosa').innerHTML = `<g filter="url(#contorno)">${rosaDe(258, y, r, { look: -4, lookY: 8, armL: [[236, y + r * 0.9], [236, y - r * 0.6]], armR: [[262, y + r * 1.2], [240, y - r * 0.2]] })}</g>`;
    $('#me-arriba').innerHTML = `<svg x="130" y="590" width="200" height="130" viewBox="130 590 200 130">${tuDe(200, 760, 24, { look: 4, lookY: 10 })}${chispa(268, 690, 0.22, { g: 1, audifonos: true })}</svg>`;
  },
};

// ---------- 3. Por calles oscuras, en silencio, llegan al centro de alerta ----------
const CALLE_QUIETOS = [[120, 1330, 250], [380, 1350, 260], [640, 1320, 240], [960, 1345, 255], [820, 1300, 220]];
ESCENAS.calles = {
  html: lienzo(`${calle()}<rect width="1080" height="1920" fill="#060a18" opacity=".62"/>
    <g filter="url(#ink)"><path d="M930 750 L980 300 L1030 750 M945 600 L1015 600 M955 460 L1005 460" stroke="#4a5059" stroke-width="10" fill="none"/></g>
    <circle id="ca-roja" cx="980" cy="290" r="14" fill="${ROJO}"/>
    <g id="ca-ellos" filter="url(#ink)"></g><g id="ca-grupo"></g>${viñeta}`),
  camara: { claves: [[INI.calles, 1.0, 0, 0], [M.llegan, 1.04, 0, 0], foco(FIN('calles'), 1.35, 860, 700)] },
  update(lt, dur, t) {
    $('#ca-roja').setAttribute('opacity', Math.sin(t * 6) > 0 ? 1 : 0.25);
    $('#ca-ellos').innerHTML = CALLE_QUIETOS.map(([x, y, s], i) => `<g transform="translate(${x + Math.sin(t + i) * 2} ${y}) scale(${s})">${infectadoQuieto(0, 0, -0.06)}</g>`).join('');
    const x = lerp(80, 560, clamp((t - INI.calles) / 4.4)), bob = Math.abs(Math.sin(t * 5)) * 6;
    $('#ca-grupo').innerHTML = `<g transform="translate(0 ${-bob})"><g filter="url(#contorno)">${rosaDe(x + 210, 1520 - 60 * 5.4, 60, { look: 10, lookY: 4 })}</g>${tuConChispa(x, 1530, 62, t, { look: 10 })}</g>`;
  },
};

// ---------- 4. El tablero viejo. Se opera entre dos, corazón. Yo en el micrófono. Tú en la señal ----------
ESCENAS.tablero = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14110f"/><circle cx="540" cy="900" r="760" fill="url(#luzCalida)" opacity=".55"/><g id="ta-tablero"></g><g id="ta-cosas"></g>${viñeta}`),
  camara: { claves: [[INI.tablero, 1.0, 0, 0], [M.opera, 1.04, 0, 0], foco(M.microfono, 1.35, 300, 1180), foco(M.senal - 0.1, 1.35, 300, 1180), foco(M.senal + 0.4, 1.35, 830, 1250), foco(FIN('tablero'), 1.38, 830, 1250)] },
  update(lt, dur, t) {
    $('#ta-tablero').innerHTML = tableroViejo(t, { lamp: i => Math.sin(t * 2 + i) > 0.6 ? '#7d8a4a' : '#3a3f2e' });
    const mira = t > M.senal - 0.2;
    $('#ta-cosas').innerHTML = microfono(360, 1070) + `<g filter="url(#contorno)">${rosaDe(240, 1090, 85, { look: mira ? 16 : 6, lookY: 0,
      armR: [[320, 1090 + 85 * 2.0], [355, 1090 + 85 * 1.5]] })}</g>` +
      tuDe(790, 1560, 80, { look: -8, armR: [[850, 1300], [878, 1170]] }) + chispa(640, 1490, 0.6, { g: 1, audifonos: true, modo: 'parada' });
  },
};

// ---------- 5. 3:14. Suena la alerta de la Coordinación ----------
ESCENAS.sirena = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14110f"/><rect id="si-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/><g id="si-tablero"></g><g id="si-cosas"></g>${viñeta}`),
  fijo: `<div class="onomato" id="si-hora" style="top:200px;left:0;width:1080px;text-align:center;font-size:230px;color:${ROJO};opacity:0">3:14</div>`,
  camara: { claves: [[INI.sirena, 1.0, 0, 0], [SIRENA, 1.0, 0, 0], foco(SIRENA + 0.6, 1.3, 440, 920), foco(FIN('sirena'), 1.35, 440, 920)] },
  update(lt, dur, t) {
    const on = t > SIRENA;
    $('#si-tablero').innerHTML = tableroViejo(t, { lamp: i => on ? (Math.sin(t * 9 + i * 0.7) > 0 ? ROJO : '#8a1f1b') : '#3a3f2e', estadio: on && Math.sin(t * 9) > 0 ? ROJO : '#3a3f2e' });
    $('#si-rojo').setAttribute('opacity', on ? 0.08 + 0.1 * pulsoRojo(t) : 0);
    $('#si-cosas').innerHTML = microfono(360, 1070) + `<g filter="url(#contorno)">${rosaDe(240, 1090, 85, { look: 10, lookY: -10, eyeScale: on ? 1.3 : 1 })}</g>` + tuDe(790, 1560, 80, { look: -6, lookY: -10, eyeScale: on ? 1.3 : 1 });
    $('#si-hora').style.opacity = t > M.catorce - 0.1 && t < SIRENA + 0.4 ? 1 : 0;
  },
};

// ---------- 6. Rosa habla. Y la ciudad oye su voz en vez de la sirena ----------
const CIUDAD_POSTES = [[180, 1150], [560, 1100], [900, 1170]];
ESCENAS.habla = {
  html: lienzo(`<g id="hb-a"><rect width="1080" height="1920" fill="#14110f"/><circle cx="540" cy="900" r="760" fill="url(#luzCalida)" opacity=".5"/><g id="hb-rosa"></g></g>
    <g id="hb-b" style="display:none">${CIELO_NOCHE('cn2')}<rect width="1080" height="1920" fill="url(#cn2)"/>
      <g filter="url(#ink)">${[[0, 700, 300, '#22283a'], [280, 820, 260, '#1c2232'], [520, 640, 300, '#22283a'], [800, 780, 300, '#1c2232']].map(([x, y, w, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${1400 - y}" fill="${c}" stroke="${INK}" stroke-width="8"/>`).join('')}
        <rect x="-20" y="1400" width="1120" height="560" fill="#1a1f2a"/></g>
      <g id="hb-ventanas"></g>${CIUDAD_POSTES.map(([x, y]) => poste(x, y, 0.55, 500)).join('')}<g id="hb-ondas"></g></g>${viñeta}`),
  camara: { claves: [[INI.habla, 1.25, -60, 80], [M.ciudad - 0.15, 1.3, -60, 80], [M.ciudad - 0.1, 1.0, 0, 0], [FIN('habla'), 1.06, 0, 20]] },
  update(lt, dur, t) {
    const ciudad = t > M.ciudad - 0.1;
    $('#hb-a').style.display = ciudad ? 'none' : '';
    $('#hb-b').style.display = ciudad ? '' : 'none';
    if (!ciudad) {
      const toma = ease.outCubic(clamp((t - HABLA) / 0.4));
      $('#hb-rosa').innerHTML = microfono(lerp(700, 640, toma), 900, 1900) + `<g filter="url(#contorno)">${rosaDe(430, 820, 140, { look: 18, lookY: 4,
        armR: [[560, 820 + 140 * 2.1], [lerp(600, 610, toma), lerp(820 + 140 * 2.6, 960, toma)]] })}</g>`;
      return;
    }
    document.querySelectorAll('#esc-habla .foco').forEach(f => f.style.opacity = 0.3);
    document.querySelectorAll('#esc-habla .onda').forEach(o => o.style.opacity = 0);
    $('#hb-ondas').innerHTML = CIUDAD_POSTES.map(([x, y]) => ondasVoz(t, x, y + 30, 0.7)).join('');
    const prende = clamp((t - M.ciudad) / 1.2);
    $('#hb-ventanas').innerHTML = [[60, 760], [180, 900], [340, 880], [600, 700], [700, 860], [880, 840], [960, 980], [400, 1040]].map(([x, y], i) =>
      `<rect x="${x}" y="${y}" width="70" height="60" fill="${prende > i / 8 ? '#ffcf7a' : '#121722'}" stroke="${INK}" stroke-width="5"/>`).join('');
  },
};

// ---------- 7. No bajen. Quédense en silencio. Esta alerta es mentira ----------
ESCENAS.nobajen = {
  html: lienzo(`${CIELO_NOCHE('cn3')}${fachada('cn3', 1)}<g id="nb-vecinos"></g><g id="nb-cortinas"></g>${poste(900, 1050, 0.75, 420)}<g id="nb-ondas"></g>${viñeta}`),
  camara: { claves: [[INI.nobajen, 1.0, 0, 0], [FIN('nobajen'), 1.08, 0, 30]] },
  update(lt, dur, t) {
    document.querySelectorAll('#esc-nobajen .onda').forEach(o => o.style.opacity = 0);
    $('#nb-ondas').innerHTML = ondasVoz(t, 900, 1080, 0.9);
    $('#nb-vecinos').innerHTML = vecinosVentanas(1);
    const cierra = ease.inOut(clamp((t - M.quedense) / 0.8));
    $('#nb-cortinas').innerHTML = VENTANAS_VECINOS.map(([f, c], i) => { const x = 130 + c * 310, y = 400 + f * 190, k = clamp(cierra * 1.4 - i * 0.06);
      return `<rect x="${x}" y="${y}" width="${100 * k}" height="130" fill="#c98a9a" opacity=".95"/><rect x="${x + 200 - 100 * k}" y="${y}" width="${100 * k}" height="130" fill="#c98a9a" opacity=".95"/>`; }).join('');
  },
};

// ---------- 8. Pero ellos ya corren a los postes ----------
const CORREN_N = (() => { const r = rng(61), g = []; for (let i = 0; i < 14; i++) g.push({ x0: -200 + r() * 700, v: 420 + r() * 200, y: 1340 + r() * 140, s: 240 + r() * 70, ph: r() * 6 }); return g.sort((a, b) => a.y - b.y); })();
ESCENAS.postes = {
  html: lienzo(`${calle({ poste: 900 })}<rect width="1080" height="1920" fill="#060a18" opacity=".55"/><g id="po-ondas"></g><g id="po-ellos" filter="url(#ink)"></g>${viñeta}`),
  camara: { claves: [[INI.postes, 1.0, 0, 0], [FIN('postes'), 1.1, 60, 40]] },
  update(lt, dur, t) {
    document.querySelectorAll('#esc-postes .onda').forEach(o => o.style.opacity = 0);
    $('#po-ondas').innerHTML = ondasVoz(t, 900, 700, 0.9);
    const d = t - INI.postes;
    $('#po-ellos').innerHTML = CORREN_N.map((p, i) => { const x = Math.min(880 - (i % 6) * 30, p.x0 + d * p.v);
      return `<g transform="translate(${x} ${p.y}) scale(${p.s})">${x < 870 - (i % 6) * 30 ? infectadoLado(t * 10 + p.ph) : infectadoQuieto(1, 0, -0.06)}</g>`; }).join('');
  },
};

// ---------- 9. Hay que mandarlos a una sola zona: el estadio. Donde está Evelin ----------
ESCENAS.estadio = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14110f"/><circle cx="540" cy="900" r="760" fill="url(#luzCalida)" opacity=".45"/><g id="es-tablero"></g>
    <g id="es-evelin" opacity="0"><circle cx="760" cy="440" r="230" fill="#0b0d12" stroke="#fff6e6" stroke-width="12"/>
      <svg x="530" y="210" width="460" height="460" viewBox="530 210 460 460"><g filter="url(#ink)">${[0, 1, 2, 3].map(i => `<path d="M520 ${470 + i * 60} Q760 ${430 + i * 60} 1000 ${470 + i * 60}" stroke="#2a2d36" stroke-width="22" fill="none"/>`).join('')}</g>
        <g filter="url(#contorno)">${evelin({ head: [760, 470], r: 62, neck: [764, 535], hip: [770, 650], legL: [[740, 640], [730, 700]], legR: [[800, 640], [810, 700]], footL: -1, footR: 1,
          armL: [[730, 590], [745, 520]], armR: [[800, 590], [790, 620]], brazosAlFrente: true, audifonos: 'no', look: 0, lookY: 4 })}
          <path d="M752 492 v34" stroke="${INK}" stroke-width="7" stroke-linecap="round"/></g></svg></g>${viñeta}`),
  camara: { claves: [[INI.estadio, 1.0, 0, 0], foco(M.zona, 1.2, 460, 930), foco(M.estadio1 + 0.3, 1.5, 660, 900), foco(M.dondeEvelin, 1.2, 660, 760), [FIN('estadio'), 1.15, -120, 160]] },
  update(lt, dur, t) {
    const marca = t > M.estadio1 - 0.1 && Math.sin(t * 7) > 0;
    $('#es-tablero').innerHTML = tableroViejo(t, { lamp: i => (Math.sin(t * 9 + i * 0.7) > 0 ? '#8a1f1b' : '#5a1414'), estadio: marca ? '#ffcf7a' : '#3a3f2e' }) +
      (t > M.estadio1 - 0.1 ? `<circle cx="${ESTADIO_L.x}" cy="${ESTADIO_L.y + 120}" r="${70 + 6 * Math.sin(t * 6)}" fill="none" stroke="#ffcf7a" stroke-width="8"/>` : '');
    $('#es-evelin').setAttribute('opacity', clamp((t - M.dondeEvelin + 0.1) / 0.35));
  },
};

// ---------- 10. A Rosa le tiembla la mano ----------
ESCENAS.mano = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14110f"/><circle cx="540" cy="1000" r="700" fill="url(#luzCalida)" opacity=".5"/>
    <g filter="url(#ink)"><rect x="200" y="1100" width="680" height="320" rx="20" fill="#7d7a62" stroke="${INK}" stroke-width="10"/>
      <circle cx="540" cy="1240" r="110" fill="#8a1f1b" stroke="${INK}" stroke-width="10"/><circle cx="540" cy="1240" r="80" fill="${ROJO}" stroke="${INK}" stroke-width="6"/>
      <rect x="400" y="1370" width="280" height="40" fill="#efe6cf" stroke="${INK}" stroke-width="4"/><text x="540" y="1400" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="32" fill="${INK}">ESTADIO</text></g>
    <g id="mn-mano"></g>${viñeta}`),
  camara: { claves: [[INI.mano, 1.0, 0, 0], [FIN('mano'), 1.12, 0, 40]] },
  update(lt, dur, t) {
    const tx = Math.sin(t * 38) * 9, ty = Math.cos(t * 31) * 6;
    $('#mn-mano').innerHTML = `<g filter="url(#ink)" transform="translate(${tx} ${ty})">
      <path d="M1000 640 L700 900" stroke="${INK}" stroke-width="150" stroke-linecap="round"/><path d="M1000 640 L700 900" stroke="#8d8f96" stroke-width="124" stroke-linecap="round"/>
      ${[...Array(8)].map((_, i) => linea([[720 + i * 30, 960 - i * 26], [730 + i * 30, 1000 - i * 26]], 6, '#6b6d74')).join('')}
      <ellipse cx="610" cy="990" rx="110" ry="80" fill="#e9d8c4" stroke="${INK}" stroke-width="8"/>
      <path d="M540 1010 q-20 50 -10 100 M575 1030 q-10 50 0 90 M615 1035 q0 45 10 80" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M540 1010 q-20 50 -10 100 M575 1030 q-10 50 0 90 M615 1035 q0 45 10 80" stroke="#e9d8c4" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M570 960 q20 10 40 0 M600 990 q20 10 40 0" stroke="#b9a48c" stroke-width="4" fill="none"/></g>`;
  },
};

// ---------- 11. El radio pita: MANDALA ABUELA ----------
ESCENAS.pita = {
  html: lienzo(radioYLibreta('pi')),
  camara: { claves: [[INI.pita, 1.0, 0, 120], [M.pitaW + 0.5, 1.0, 0, 0], [M.abuela, 1.1, 0, -100], [FIN('pita'), 1.14, 0, -120]], origen: '540px 1100px' },
  update(lt, dur, t) {
    const sonando = MANDALA.pitidos.some(p => t >= p.s && t < p.s + p.d);
    $('#pi-radio').innerHTML = radioViejo(540, 560, t, 1, 0.9) + `<circle cx="652" cy="474" r="${sonando ? 34 : 14}" fill="${ROJO}" opacity="${sonando ? 1 : 0.4}"/>`;
    $('#pi-morse').innerHTML = morseVisual(MANDALA, t, 800);
    const L = [{ texto: 'MANDALA', letras: MANDALA.letras.slice(0, 7), x0: 230, y0: 1100, size: 170 },
      { texto: 'ABUELA', letras: MANDALA.letras.slice(8), x0: 260, y0: 1330, size: 170, color: ROJO }];
    $('#pi-letras').innerHTML = escribeLineas(L, t, true);
    const p = puntaLapiz(L, t);
    $('#pi-mano').innerHTML = manoLapiz(p.x + Math.sin(t * 40) * 4, p.y, t);
  },
};

// ---------- 12. Rosa la manda ----------
ESCENAS.manda = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14110f"/><rect id="ma-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/><g id="ma-tablero"></g><g id="ma-rosa"></g>${viñeta}`),
  fijo: `<div class="onomato" id="ma-zona" style="top:300px;left:0;width:1080px;text-align:center;font-size:120px;opacity:0;color:#fff">ZONA: ESTADIO</div>`,
  camara: { claves: [[INI.manda, 1.25, 0, -60], [MANDA, 1.25, 0, -60], [FIN('manda'), 1.12, 0, -20]] },
  update(lt, dur, t) {
    const on = t > MANDA;
    $('#ma-tablero').innerHTML = tableroViejo(t, { lamp: () => '#2a2d22', estadio: on ? (Math.sin(t * 10) > -0.3 ? ROJO : '#8a1f1b') : '#3a3f2e', palanca: on ? 1 : clamp((t - MANDA + 0.3) / 0.3) });
    $('#ma-rojo').setAttribute('opacity', on ? 0.1 + 0.12 * pulsoRojo(t) : 0);
    $('#ma-rosa').innerHTML = `<g filter="url(#contorno)">${rosaDe(700, 1300, 70, { look: 12, lookY: -8, armR: [[770, 1300 + 70 * 1.6], [lerp(880, 900, on ? 1 : 0), lerp(1060, 1100, on ? 1 : 0)]] })}</g>`;
    $('#ma-zona').style.opacity = on ? 1 : 0;
    sacude('manda', t, MANDA, 0.35, 12);
  },
};

// ---------- 13. Todos caminan al estadio. Memo entre ellos. Los helicópteros huyen ----------
const CAMINAN = (() => { const r = rng(77), g = []; for (let i = 0; i < 26; i++) g.push({ x: r() * 1080, z: r(), ph: r() * 6 }); return g; })();
ESCENAS.caminan = {
  html: lienzo(`${CIELO_NOCHE('cn4')}<rect width="1080" height="1920" fill="url(#cn4)"/>
    <g filter="url(#ink)"><ellipse cx="540" cy="1010" rx="330" ry="70" fill="#1c1a24" stroke="${INK}" stroke-width="8"/>
      <path d="M210 1010 Q220 900 540 890 Q860 900 870 1010" fill="#2a2433" stroke="${INK}" stroke-width="8"/>
      ${[260, 420, 660, 820].map(x => `<path d="M${x} 1000 L${x} 800" stroke="#1c1a24" stroke-width="10"/><rect x="${x - 34}" y="770" width="68" height="34" fill="#fff6c8" stroke="${INK}" stroke-width="5"/>`).join('')}
      <path d="M-20 1080 L1100 1080 L1100 1980 L-20 1980 Z" fill="#232733"/><path d="M-20 1980 L470 1080 L610 1080 L1100 1980 Z" fill="#2c303c"/></g>
    <g id="cm-ondas"></g><g id="cm-helis"></g><g id="cm-ellos" filter="url(#ink)"></g><g id="cm-memo"></g>${viñeta}`),
  camara: { claves: [[INI.caminan, 1.0, 0, 0], foco(M.memo, 1.0, 540, 960), foco(M.memo + 0.5, 1.45, 520, 1420), foco(M.helis - 0.1, 1.45, 520, 1420), foco(M.helis + 0.4, 1.2, 540, 820), [FIN('caminan'), 1.15, 0, 140]] },
  update(lt, dur, t) {
    $('#cm-ondas').innerHTML = [0, 1, 2].map(k => { const f = ((t * 1.2) + k / 3) % 1; return `<ellipse cx="540" cy="950" rx="${200 + f * 600}" ry="${60 + f * 180}" fill="none" stroke="${ROJO}" stroke-width="8" opacity="${0.7 * (1 - f)}"/>`; }).join('');
    const d = t - INI.caminan;
    $('#cm-ellos').innerHTML = CAMINAN.map(p => { const z = clamp(1 - ((p.z + d * 0.12) % 1)), s = lerp(60, 380, z * z), x = lerp(540, p.x, z), y = lerp(1090, 1960, z * z);
      return `<g transform="translate(${x + Math.sin(t * 3 + p.ph) * 4} ${y}) scale(${s})">${infectadoQuieto(0, 0, -0.06)}</g>`; }).join('');
    const mz = lerp(0.62, 0.5, clamp(d / 5)), ms = lerp(60, 380, mz * mz), my = lerp(1090, 1960, mz * mz);
    $('#cm-memo').innerHTML = `<g filter="url(#contorno)">${memo({ head: [520, my - ms * 0.95], r: ms * 0.13, neck: [522, my - ms * 0.8], hip: [524, my - ms * 0.4],
      legL: [[510, my - ms * 0.2], [506, my]], legR: [[536, my - ms * 0.2], [540, my]], footL: -1, footR: 1, armL: [[500, my - ms * 0.6], [496, my - ms * 0.42]], armR: [[546, my - ms * 0.6], [550, my - ms * 0.42]],
      look: 0, lookY: -ms * 0.03, eyeFill: '#f2f2f2', sinBrillo: true, headFill: 'url(#headInfectado)' })}</g>`;
    const huye = clamp((t - M.helis) / 2.5);
    $('#cm-helis').innerHTML = heli(lerp(380, -200, huye), lerp(620, 300, huye), lerp(1, 0.5, huye), t) + heli(lerp(720, 1300, huye), lerp(560, 260, huye), lerp(0.9, 0.45, huye), t + 1);
  },
};

// ---------- 14. Amanece. Los vecinos se asoman ----------
ESCENAS.amanece = {
  html: lienzo(`${CIELO_ALBA('al1')}${fachada('al1', 0, true)}<circle cx="900" cy="300" r="120" fill="#fff1c9" opacity=".9"/><circle cx="900" cy="300" r="260" fill="#fff1c9" opacity=".25"/>
    <g id="am-vecinos"></g>
    <g filter="url(#ink)"><path d="M470 1440 q30 -22 70 -6 q14 12 -6 22 q-40 10 -64 -16z" fill="#d88aa6" stroke="${INK}" stroke-width="5"/></g>${viñeta}`),
  camara: { claves: [[INI.amanece, 1.1, 0, 60], [FIN('amanece'), 1.0, 0, 0]] },
  update(lt, dur, t) {
    $('#am-vecinos').innerHTML = vecinosVentanas(ease.outCubic(clamp((t - M.vecinos + 0.1) / 0.8)));
  },
};

// ---------- 15. Evelin entra al patio. Se escondió en silencio. Trae un frasco del suero ----------
ESCENAS.evelin = {
  html: lienzo(`${CIELO_ALBA('al2')}${fachada('al2', 0, true)}<rect width="1080" height="1920" fill="#fff1c9" opacity=".12"/><g id="ev-cosas"></g>${viñeta}`),
  camara: { claves: [[INI.evelin, 1.0, 0, 0], [M.frasco - 0.2, 1.0, 0, 0], foco(M.frasco + 0.4, 1.5, 480, 1150), foco(FIN('evelin'), 1.55, 480, 1140)] },
  update(lt, dur, t) {
    const x = lerp(-80, 380, ease.outCubic(clamp((t - INI.evelin) / 2.2))), alza = ease.outCubic(clamp((t - M.frasco + 0.2) / 0.5));
    $('#ev-cosas').innerHTML = evelinDe(x, 1560, 82, { audifonos: 'no', look: 14, lookY: 2,
      armR: [[x + 70, 1560 - 82 * 3.1], [x + lerp(60, 150, alza), lerp(1560 - 82 * 2.3, 1560 - 82 * 4.4, alza)]] }) +
      frasco(x + lerp(70, 160, alza), lerp(1560 - 82 * 2.3, 1560 - 82 * 4.4, alza) - 10, 0.8, alza) +
      `<g filter="url(#contorno)">${rosaDe(800, 1560 - 80 * 5.4, 80, { look: -16, lookY: 4, eyeScale: 1.3 })}</g>` + tuConChispa(640, 1600, 70, t, { look: -12 });
  },
};

// ---------- 16. Rosa y Evelin se abrazan ----------
ESCENAS.abrazo = {
  html: lienzo(`${CIELO_ALBA('al3')}${fachada('al3', 0, true)}<circle cx="540" cy="1100" r="700" fill="#fff1c9" opacity=".3"/><g id="ab-cosas"></g>${viñeta}`),
  camara: { claves: [[INI.abrazo, 1.2, 0, -120], [FIN('abrazo'), 1.3, 0, -140]] },
  update(lt, dur, t) {
    const ey = 1600, ry = 1600;
    $('#ab-cosas').innerHTML = `<g filter="url(#contorno)">${evelin({ head: [470, ey - 100 * 5.3], r: 100, neck: [478, ey - 100 * 4.2], hip: [480, ey - 100 * 1.9],
        legL: [[455, ey - 95], [445, ey]], legR: [[505, ey - 95], [510, ey]], footL: -1, footR: 1, armL: [[420, ey - 100 * 3.1], [430, ey - 100 * 2.4]], armR: [[560, ey - 100 * 3.6], [700, ey - 100 * 3.8]],
        brazosAlFrente: true, audifonos: 'no', look: 18, lookY: 6, dx: 10 })}</g>` +
      `<g filter="url(#contorno)">${rosaDe(640, ry - 95 * 5.4, 95, { look: -18, lookY: 8, armL: [[560, ry - 95 * 3.0], [420, ry - 95 * 3.5]], armR: [[720, ry - 95 * 3.0], [730, ry - 95 * 2.4]] })}</g>`;
  },
};

// ---------- 17. Evelin le pone el suero a Chispa. El gris se retira de su pata ----------
const BRILLOS = (() => { const r = rng(12), g = []; for (let i = 0; i < 12; i++) g.push({ x: -120 + r() * 160, y: -60 + r() * 180, ph: r() * 6 }); return g; })();
ESCENAS.suero = {
  html: lienzo(`${CIELO_ALBA('al4')}<rect width="1080" height="1920" fill="url(#al4)"/><rect x="-20" y="1250" width="1120" height="700" fill="#8a8d94"/><circle cx="540" cy="1000" r="700" fill="#fff1c9" opacity=".25"/><g id="su-cosas"></g>${viñeta}`),
  camara: { claves: [[INI.suero, 1.0, 0, 0], foco(M.retira - 0.3, 1.15, 500, 1050), foco(FIN('suero'), 1.22, 480, 1060)] },
  update(lt, dur, t) {
    const k = ease.inOut(clamp((t - M.retira + 0.2) / 1.6)), gota = clamp((t - M.pone) / 0.6);
    $('#su-cosas').innerHTML = chispaCura(460, 1150, 2.5, t, k, { audifonos: true }) +
      `<g filter="url(#ink)"><path d="M1150 600 L${lerp(1000, 950, gota)} ${lerp(780, 880, gota)}" stroke="${INK}" stroke-width="60" stroke-linecap="round"/><path d="M1150 600 L${lerp(1000, 950, gota)} ${lerp(780, 880, gota)}" stroke="#2f6f6a" stroke-width="44" stroke-linecap="round"/></g>` +
      frasco(lerp(960, 900, gota), lerp(820, 920, gota), 1.0, 0.6) +
      (k > 0 && k < 1 ? BRILLOS.map(b => `<circle cx="${460 + (b.x - 60) * 2.5}" cy="${1150 + b.y * 1.4}" r="${6 + 6 * Math.sin(t * 8 + b.ph)}" fill="#fff" opacity="${0.8 * Math.sin(k * Math.PI)}"/>`).join('') : '');
  },
};

// ---------- 18. Le quitas los audífonos. Le mueves la placa. Suena ----------
ESCENAS.placa = {
  html: lienzo(`${CIELO_ALBA('al5')}<rect width="1080" height="1920" fill="url(#al5)"/><circle cx="540" cy="900" r="760" fill="#fff1c9" opacity=".3"/><g id="pl-cara"></g>${viñeta}`),
  fijo: `<div class="onomato" id="pl-tin" style="top:1180px;left:640px;font-size:110px;opacity:0;transform:rotate(-8deg)">tin</div>`,
  camara: { claves: [[INI.placa, 1.0, 0, 0], [M.mueves - 0.2, 1.0, 0, 0], foco(M.mueves + 0.3, 1.45, 540, 1350), foco(FIN('placa'), 1.5, 540, 1350)] },
  update(lt, dur, t) {
    const sube = ease.inOut(clamp((t - QUITA) / 0.8));
    const orejas = t > QUITA + 0.5;
    const columpio = t > TIN - 0.1 ? Math.sin((t - TIN) * 9) * 18 * Math.exp(-(t - TIN) * 1.2) : 0;
    $('#pl-cara').innerHTML = `<g filter="url(#ink)"><g transform="translate(540 900)">${caraChispa({ sinCinta: true, lengua: t > TIN + 0.8 ? 0.35 : 0 })}
      ${sube < 1 ? `<g transform="translate(0 ${lerp(0, -1100, sube)})">${audifonosCara}<path d="M-320 160 L-480 640 M320 160 L480 640" stroke="${INK}" stroke-width="40" stroke-linecap="round"/>${punto(-320, 140, 44, INK)}${punto(320, 140, 44, INK)}</g>` : ''}
      ${t > M.mueves - 0.1 && t < TIN + 0.5 ? `<path d="M260 900 L60 620" stroke="${INK}" stroke-width="40" stroke-linecap="round"/>${punto(50, 600, 34, INK)}` : ''}</g></g>`;
    const pl = document.querySelector('#esc-placa .placa');
    if (pl) pl.setAttribute('transform', `rotate(${columpio} 0 505)`);
    $('#pl-tin').style.opacity = t > TIN && t < TIN + 1.0 ? 1 - (t - TIN) : 0;
  },
};

// ---------- 19. Y no viene nadie ----------
ESCENAS.nadie = {
  html: lienzo(`${CIELO_ALBA('al6')}${fachada('al6', 0, true)}<circle cx="900" cy="300" r="120" fill="#fff1c9" opacity=".9"/><circle cx="540" cy="1300" r="800" fill="#fff1c9" opacity=".18"/><g id="na-cosas"></g>${viñeta}`),
  camara: { claves: [[INI.nadie, 1.35, 0, -240], [FIN('nadie'), 1.0, 0, 0]] },
  update(lt, dur, t) {
    $('#na-cosas').innerHTML = `<g filter="url(#contorno)">${rosaDe(760, 1560 - 74 * 5.4, 74, { look: -8, lookY: 6 })}</g>` +
      evelinDe(620, 1560, 72, { audifonos: 'no', look: -6, lookY: 6 }) + tuDe(330, 1560, 74, { look: 10, lookY: 10 }) +
      chispaCura(470, 1500, 0.7, t, 1);
  },
};

// ---------- 20. Aquí termina La alerta. ¿De qué quieren la siguiente historia? ----------
ESCENAS.fin = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="760" r="900" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="fi-tit" style="top:110px;font-size:200px">FIN</div>
    <div id="fi-sub" style="position:absolute;top:350px;width:100%;text-align:center;font-family:Oswald;font-weight:600;font-size:64px;letter-spacing:6px;color:#c9ccd2">LA ALERTA</div>
    <div id="fi-preg" style="position:absolute;top:500px;left:60px;right:60px;text-align:center;font-family:Oswald;font-weight:700;font-size:84px;line-height:1.05;color:#fff">¿DE QUÉ QUIEREN LA SIGUIENTE HISTORIA?</div>
    <div class="opcion" id="fi-a" style="top:760px;height:210px;font-size:70px"><span class="emo">👻</span><span class="txt">FANTASMAS</span></div>
    <div class="opcion" id="fi-b" style="top:1000px;height:210px;font-size:70px"><span class="emo">🛸</span><span class="txt">OVNIS</span></div>
    <div class="opcion" id="fi-c" style="top:1240px;height:210px;font-size:70px"><span class="emo">🔪</span><span class="txt">UN ASESINO</span></div>
    <div class="decide-com" id="fi-com" style="top:1500px">COMENTA TU IDEA</div>`,
  update(lt, dur, t) {
    pop($('#fi-tit'), t, INI.fin + 0.05, 0.4);
    $('#fi-sub').style.opacity = clamp((t - INI.fin - 0.4) / 0.4);
    pop($('#fi-preg'), t, M.siguiente - 0.6);
    pop($('#fi-a'), t, M.siguiente + 0.3);
    pop($('#fi-b'), t, M.siguiente + 0.6);
    pop($('#fi-c'), t, M.siguiente + 0.9);
    pop($('#fi-com'), t, M.comenta - 0.1);
  },
};
