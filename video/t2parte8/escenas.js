// Escenas de "La alerta", temporada 2, parte 8: Noventa segundos. Ganó 🗣️ en los comentarios de la parte 7: le
// cuentas a Evelin que Memo está detrás del tinaco. Memo se rinde (finge). Evelin cuenta la primera noche: su prueba y
// la Coordinación. El plan: alertas de 90 segundos zona por zona hasta Rosa. Bajo el puente, Chispa aúlla y se los
// lleva. En la última zona Memo agarra a Evelin y se la lleva con la consola; la alerta jala a Chispa al poste.
// Decisión: 🐕 salvas a Chispa o 👩 vas por Evelin.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const PRUEBA = M.prueba + 0.1;          // recuerdo: Evelin aprieta el botón de prueba
const TODAS = M.tomo;                   // recuerdo: todas las zonas se prenden
const ALERTA1 = M.primeraM - 0.1;       // primera alerta de la consola
const AULLIDO = M.aullaM - 0.05;        // Chispa aúlla bajo el puente
const BOTON = M.boton + 0.25;           // Evelin aprieta el botón de la última zona
const ALERTA2 = M.suena - 0.05;         // la última alerta empieza a sonar
const AGARRA = M.agarraM + 0.1;         // Memo agarra a Evelin por detrás
const OJOS = M.ojos + 0.1;              // a Chispa se le ponen los ojos blancos

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
  armL: [[x - r * 0.9, y + r * 2.2], [x - r * 1.0, y + r * 3.0]], armR: [[x + r * 0.9, y + r * 2.2], [x + r * 1.0, y + r * 3.0]],
  brazosAlFrente: true, look: o.look || 0, lookY: o.lookY || 0 });

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

// Sala de control y mapa de zonas (copia de la temporada 2, parte 1)
const mapaZonas = (() => {
  const r = rng(22), z = [];
  for (let f = 0; f < 6; f++) for (let c = 0; c < 7; c++) z.push({ x: 170 + c * 108 + (r() - 0.5) * 16, y: 300 + f * 86 + (r() - 0.5) * 12, w: 90 + r() * 14, h: 70 + r() * 10, d: Math.hypot(c - 4, f - 3) });
  return z;
})();
const ZONA_C = mapaZonas.findIndex(z => z.d === 0);
function salaControl(pre) {
  return `
    <rect width="1080" height="1920" fill="#0a0e15"/>
    <g filter="url(#ink)">
      <rect x="120" y="240" width="880" height="560" rx="14" fill="#0e1a24" stroke="#2c3a48" stroke-width="10"/>
      ${mapaZonas.map((z, i) => `<rect class="${pre}-zona" data-i="${i}" x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="8" fill="#1d3b4a" stroke="#2f6f6a" stroke-width="4"/>`).join('')}
      ${[0, 1].map(i => `<rect x="${60 + i * 700}" y="860" width="260" height="200" rx="10" fill="#0e1a24" stroke="#2c3a48" stroke-width="8"/>
        <path d="M${80 + i * 700} ${990} l44 -30 l44 20 l44 -50 l44 40 l44 -20" fill="none" stroke="#3fb8a8" stroke-width="5"/>`).join('')}
    </g>
    <circle cx="560" cy="700" r="700" fill="#3fb8a8" opacity=".07"/>
    <g id="${pre}-evelin"></g>
    <g filter="url(#ink)">
      <polygon points="-20,1140 1100,1140 1100,1200 -20,1200" fill="#3a3e46" stroke="${INK}" stroke-width="8"/>
      <rect x="-20" y="1200" width="1120" height="130" fill="#24272d" stroke="${INK}" stroke-width="8"/>
      <rect x="-20" y="1330" width="1120" height="700" fill="#14171c"/>
      ${[0, 1, 2, 3].map(i => `<circle cx="${120 + i * 60}" cy="1170" r="12" fill="${i === 1 ? '#3fb8a8' : '#5a5f69'}" stroke="${INK}" stroke-width="4"/>`).join('')}
      <rect x="620" y="1222" width="300" height="86" rx="8" fill="#d9dee6" stroke="${INK}" stroke-width="5"/>
      <text x="770" y="1258" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="30" fill="${INK}">PRUEBA · ZONA</text>
      <text x="770" y="1294" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="30" fill="${INK}">U.H. EDIFICIO C</text>
    </g>
    <g id="${pre}-boton"></g>
    ${viñeta}`;
}

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

// ---------- 1. Ganó contarle a Evelin ----------
ESCENAS.gano = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="1040" r="800" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="ga-tit">GANÓ</div>
    <div class="opcion" id="ga-a" style="top:560px;font-size:66px;border-color:#e5a83b;box-shadow:0 0 40px rgba(229,168,59,.5)"><span class="emo">🗣️</span><span class="txt">LE CUENTAS A EVELIN</span></div>
    <div class="opcion" id="ga-b" style="top:900px;font-size:70px"><span class="emo">🤐</span><span class="txt" style="text-decoration:line-through;text-decoration-color:#e0312b;text-decoration-thickness:10px">TE LO CALLAS</span></div>
    <div class="decide-pie" id="ga-pie" style="top:1260px">LOS COMENTARIOS ELIGIERON</div>`,
  camara: { claves: [[0, 1.0, 0, 0], [FIN('gano'), 1.08, 0, 30]], origen: '540px 760px' },
  update(lt, dur, t) {
    pop($('#ga-tit'), t, 0.02, 0.25);
    pop($('#ga-a'), t, 0.1, 0.3);
    $('#ga-a').style.transform += ` scale(${1 + 0.035 * Math.sin(t * 8)})`;
    $('#ga-b').style.opacity = 0.35;
    $('#ga-pie').style.opacity = clamp((t - M.contarle - 0.2) / 0.3);
  },
};

// ---------- 2. Memo está detrás del tinaco, le dices. Evelin aprieta la consola ----------
ESCENAS.cuentas = {
  html: lienzo(`${fondoCerca(1150)}${tinaco(1010, 1330, 1.15)}<g id="cu-cosas"></g><g id="cu-viento"></g>${viñeta}`),
  camara: { claves: [[INI.cuentas, 1.0, 0, 0], [M.aprieta - 0.2, 1.04, 0, 0], foco(M.aprieta + 0.4, 1.3, 640, 1180), foco(FIN('cuentas'), 1.36, 650, 1170)] },
  update(lt, dur, t) {
    const y = 1560, r = 92, apunta = clamp((t - M.tinaco + 0.3) / 0.3), mira = t > M.ledices + 0.2;
    const abraza = ease.outCubic(clamp((t - M.aprieta + 0.1) / 0.35));
    $('#cu-cosas').innerHTML = tuDe(320, y, r, { look: 14, lookY: 0,
      armR: [[320 + r * 0.8, y - r * lerp(3.2, 3.9, apunta)], [320 + r * lerp(0.9, 1.7, apunta), y - r * lerp(2.3, 4.3, apunta)]] }) +
      (t < M.ledices + 0.3 ? `<path d="M${320 + r * 1.1} ${y - r * 5.5} q30 -10 40 -40 M${320 + r * 1.2} ${y - r * 5.1} q40 -6 60 -30" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity="${Math.sin(t * 9) > 0 ? 0.8 : 0.3}"/>` : '') +
      (abraza > 0 ? evelinConsola(660, y, r, { look: mira ? 18 : -12, eyeScale: lerp(1, 1.3, abraza) })
        : evelinDe(660, y, r, { look: mira ? 18 : -12, armL: [[660 - r * 0.8, y - r * 3.1], [660 - r * 0.85, y - r * 2.2]], armR: [[660 + r * 0.7, y - r * 3.0], [660 + r * 0.55, y - r * 2.6]] }) + consola(660 + r * 0.5, y - r * 2.5, 0.6, 10)) +
      chispa(130, 1450, 0.75, { g: 0.75, modo: 'contenta', cola: Math.sin(t * 6) * 8, audifonos: true });
    $('#cu-viento').innerHTML = viento(t, 0.35);
  },
};

// ---------- 3. Memo sale con las manos arriba. Me rindo. Llévenme con ustedes ----------
ESCENAS.rinde = {
  html: lienzo(`${fondoCerca(1150)}<g id="ri-memo"></g>${tinaco(900, 1360, 1.35)}<g id="ri-viento"></g>${viñeta}`),
  camara: { claves: [[INI.rinde, 1.0, 0, 0], [M.manos, 1.0, 0, 0], foco(M.rindo, 1.35, 620, 1060), foco(FIN('rinde'), 1.42, 600, 1050)] },
  update(lt, dur, t) {
    const sale = ease.inOut(clamp((t - INI.rinde) / 1.1)), x = lerp(860, 600, sale), y = 1560, r = 100;
    const blanco = Math.sin(t * 6) > 0.92;
    $('#ri-memo').innerHTML = memoDe(x, y, r, { gris: 1, look: lerp(10, -6, sale), lookY: 2, eyeFill: blanco ? '#f2f2f2' : undefined, ...manosArriba(x, y, r) }) +
      walkie(x + r * 0.55, y - r * 1.7, 0.12, 8);
    $('#ri-viento').innerHTML = viento(t, 0.35);
  },
};

// ---------- 4. Evelin no le cree. Pero te cuenta la primera noche ----------
ESCENAS.nocree = {
  html: lienzo(`${fondoCerca(1150)}<g id="nc-cosas"></g><rect id="nc-sepia" width="1080" height="1920" fill="#2a1d14" opacity="0"/>${viñeta}`),
  camara: { claves: [[INI.nocree, 1.0, 0, 0], [FIN('nocree'), 1.08, 0, 40]] },
  update(lt, dur, t) {
    const cuenta = t > M.cuenta - 0.1;
    $('#nc-cosas').innerHTML = memoDe(990, 1500, 62, { gris: 1, look: -8, ...manosArriba(990, 1500, 62) }) +
      evelinConsola(500, 1660, 122, { look: cuenta ? -16 : 18, lookY: cuenta ? 4 : 0, eyeScale: cuenta ? 1 : 0.75 });
    $('#nc-sepia').setAttribute('opacity', clamp((t - FIN('nocree') + 0.6) / 0.6) * 0.85);
  },
};

// ---------- 5 y 6. Recuerdo: la prueba de Evelin y la Coordinación ----------
const zc = mapaZonas[ZONA_C];
ESCENAS.prueba = {
  html: lienzo(salaControl('pr')),
  fijo: `<div class="recuerdo" style="top:110px;color:#ffd9d9">La primera noche · 3:14</div>`,
  camara: { claves: [[INI.prueba, 1.3, -60, -40], [PRUEBA + 0.25, 1.32, -70, -50], [PRUEBA + 1.0, 1.0, 0, 0], [M.solo, 1.0, 0, 0], foco(M.abuela, 1.6, zc.x + zc.w / 2, zc.y + zc.h / 2), foco(FIN('prueba'), 1.7, zc.x + zc.w / 2, zc.y + zc.h / 2)], origen: '540px 1100px' },
  update(lt, dur, t) {
    document.querySelectorAll('#esc-prueba .pr-zona').forEach((el, i) => el.setAttribute('fill', i === ZONA_C && t > PRUEBA ? (Math.sin(t * 9) > 0 ? ROJO : '#8a1f1b') : '#1d3b4a'));
    const baja = ease.inOut(clamp((t - INI.prueba - 0.05) / (PRUEBA - INI.prueba - 0.05)));
    $('#pr-evelin').innerHTML = `<g filter="url(#contorno)">${evelin({ head: [540, 950], r: 125, neck: [545, 1075], hip: [550, 1380],
      armL: [[430, 1120], [470, 1150]], armR: [[lerp(700, 720, baja), 1100], [lerp(760, 772, baja), lerp(1080, 1150, baja)]], brazosAlFrente: true,
      audifonos: 'puestos', look: 14, lookY: 14 })}</g>`;
    const pulsa = t > PRUEBA - 0.05 && t < PRUEBA + 0.3;
    $('#pr-boton').innerHTML = `<g filter="url(#ink)"><ellipse cx="770" cy="${pulsa ? 1178 : 1172}" rx="30" ry="${pulsa ? 16 : 24}" fill="${t > PRUEBA ? ROJO : '#8a1f1b'}" stroke="${INK}" stroke-width="6"/></g>` +
      (t > PRUEBA && t < PRUEBA + 0.5 ? `<circle cx="770" cy="1172" r="${40 + (t - PRUEBA) * 200}" fill="none" stroke="${ROJO}" stroke-width="8" opacity="${1 - (t - PRUEBA) * 2}"/>` : '');
  },
};
ESCENAS.sistema = {
  html: lienzo(salaControl('si')),
  fijo: `<div class="recuerdo" style="top:110px;color:#ffd9d9">3:14 y 5 segundos</div>`,
  camara: { claves: [[INI.sistema, 1.0, 0, 0], [TODAS - 0.2, 1.0, 0, 0], [TODAS + 0.3, 1.06, 0, 20], foco(M.coord + 0.2, 1.3, 540, 620), foco(FIN('sistema'), 1.36, 540, 620)], origen: '540px 1100px' },
  update(lt, dur, t) {
    document.querySelectorAll('#esc-sistema .si-zona').forEach((el, i) => {
      const z = mapaZonas[i], on = i === ZONA_C || t > TODAS - 0.3 + z.d * 0.12;
      el.setAttribute('fill', on ? (Math.sin(t * 9 + z.d) > 0 ? ROJO : '#8a1f1b') : '#1d3b4a');
    });
    const miedo = ease.outCubic(clamp((t - TODAS) / 0.4));
    $('#si-evelin').innerHTML = `<g filter="url(#contorno)">${evelin({ head: [540, 950], r: 125, neck: [545, 1075], hip: [550, 1380],
      armL: [[lerp(430, 360, miedo), lerp(1120, 1040, miedo)], [lerp(470, 420, miedo), lerp(1150, 930, miedo)]],
      armR: [[lerp(720, 720, miedo), lerp(1100, 1040, miedo)], [lerp(772, 660, miedo), lerp(1150, 930, miedo)]], brazosAlFrente: true,
      audifonos: 'puestos', look: lerp(14, 0, miedo), lookY: lerp(14, -4, miedo), eyeScale: lerp(1, 1.5, miedo) })}</g>`;
    const banner = t > TODAS - 0.1, usuario = t > M.coord - 0.1;
    $('#si-boton').innerHTML = `<g filter="url(#ink)"><ellipse cx="770" cy="1172" rx="30" ry="24" fill="${ROJO}" stroke="${INK}" stroke-width="6"/></g>` +
      (banner ? `<g opacity="${clamp((t - TODAS + 0.1) / 0.15)}"><rect x="160" y="420" width="760" height="${usuario ? 230 : 130}" rx="14" fill="#0b0f17" stroke="${ROJO}" stroke-width="${Math.sin(t * 10) > 0 ? 10 : 4}"/>
        <text x="540" y="513" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="86" letter-spacing="4" fill="#fff">TODAS LAS ZONAS</text>
        ${usuario ? `<text x="540" y="610" text-anchor="middle" font-family="monospace" font-weight="700" font-size="46" fill="${ROJO}">USUARIO: COORDINACIÓN</text>` : ''}</g>` : '');
  },
};

// ---------- 7. Querían a todos en los patios. Y las avenidas vacías ----------
const MANZANAS = (() => { const g = []; for (let f = 0; f < 5; f++) for (let c = 0; c < 3; c++) g.push({ x: 60 + c * 340, y: 250 + f * 300, w: 280, h: 240 }); return g; })();
const GENTE = (() => { const r = rng(5), g = []; MANZANAS.forEach(m => { for (let i = 0; i < 9; i++) g.push({ x: m.x + 70 + r() * (m.w - 140), y: m.y + 70 + r() * (m.h - 140), c: ['#f4f1e8', '#e5a83b', '#9fd0ff', '#f2a6b5'][i % 4] }); }); return g; })();
const ELLOS = (() => { const r = rng(8), g = []; for (let i = 0; i < 46; i++) { const m = MANZANAS[Math.floor(r() * MANZANAS.length)], vertical = r() > 0.5;
  const sx = vertical ? (r() > 0.5 ? m.x - 30 : m.x + m.w + 30) : m.x + r() * m.w, sy = vertical ? m.y + r() * m.h : (r() > 0.5 ? m.y - 30 : m.y + m.h + 30);
  g.push({ sx, sy, tx: m.x + m.w / 2 + (r() - 0.5) * 120, ty: m.y + m.h / 2 + (r() - 0.5) * 90, d: r() * 0.5 }); } return g; })();
ESCENAS.patios = {
  html: lienzo(`<rect width="1080" height="1920" fill="#151a24"/>
    <g id="pa-avenidas"></g>
    <g filter="url(#ink)">${MANZANAS.map(m => `<rect x="${m.x}" y="${m.y}" width="${m.w}" height="${m.h}" rx="6" fill="#2a2f3a" stroke="${INK}" stroke-width="7"/>
      <rect x="${m.x + 48}" y="${m.y + 48}" width="${m.w - 96}" height="${m.h - 96}" fill="#4a5162" stroke="${INK}" stroke-width="5"/>
      <rect x="${m.x + m.w / 2 - 22}" y="${m.y + m.h - 50}" width="44" height="50" fill="#4a5162"/>`).join('')}</g>
    ${GENTE.map(p => `<circle cx="${p.x}" cy="${p.y}" r="9" fill="${p.c}" stroke="${INK}" stroke-width="3"/>`).join('')}
    <g id="pa-ellos"></g>${viñeta}`),
  fijo: `<div class="recuerdo" style="top:90px;color:#ffd9d9;font-size:100px">La primera noche</div>`,
  camara: { claves: [[INI.patios, 1.15, 0, 0], [FIN('patios'), 1.0, 0, 0]] },
  update(lt, dur, t) {
    const k0 = INI.patios + 0.2, k1 = M.avenidas;
    $('#pa-ellos').innerHTML = ELLOS.map(p => { const k = ease.inOut(clamp((t - k0 - p.d) / (k1 - k0 - 0.3)));
      return `<circle cx="${lerp(p.sx, p.tx, k)}" cy="${lerp(p.sy, p.ty, k)}" r="16" fill="#c3c8cf" stroke="#050608" stroke-width="5"/>`; }).join('');
    const brilla = t > M.avenidas - 0.1 ? 0.5 + 0.5 * Math.sin(t * 7) : 0;
    $('#pa-avenidas').innerHTML = brilla > 0 ? [370, 710].map(x => `<rect x="${x}" y="200" width="30" height="1560" fill="none" stroke="${ROJO}" stroke-width="6" opacity="${0.3 + 0.6 * brilla}"/>`).join('') +
      [520, 820, 1120, 1420].map(y => `<rect x="40" y="${y}" width="1000" height="30" fill="none" stroke="${ROJO}" stroke-width="6" opacity="${0.3 + 0.6 * brilla}"/>`).join('') : '';
  },
};

// ---------- 8. El plan: alertas de 90 segundos, zona por zona, hasta llegar con Rosa ----------
const PLAN_RUTA = 'M300 1410 Q300 1260 420 1170 T700 930 Q760 820 660 700 T720 470';
ESCENAS.plan = {
  html: hoja([{ id: 'pl-tit', texto: 'EL PLAN', top: 170, size: 170, peso: 700, rot: -2 }],
    `<svg class="lienzo" width="1080" height="1920" viewBox="0 0 1080 1920" style="font-family:Caveat;font-weight:700">
      <path id="pl-ruta" d="${PLAN_RUTA}" pathLength="1" fill="none" stroke="${TINTA}" stroke-width="9" stroke-dasharray="0.02 0.015" stroke-dashoffset="0" stroke-linecap="round" opacity="0"/>
      <g id="pl-centro" opacity="0"><rect x="180" y="1410" width="240" height="90" rx="10" fill="none" stroke="${TINTA}" stroke-width="7"/><text x="300" y="1475" text-anchor="middle" font-size="64" fill="${TINTA}">CENTRO</text></g>
      <g id="pl-z1" opacity="0"><circle cx="420" cy="1170" r="70" fill="none" stroke="${TINTA}" stroke-width="7"/><text x="420" y="1195" text-anchor="middle" font-size="80" fill="${TINTA}">1</text><text x="520" y="1190" font-size="64" fill="#c62828">90 s</text></g>
      <g id="pl-pu" opacity="0"><path d="M610 860 l120 60 M590 900 l120 60" stroke="${TINTA}" stroke-width="7"/><text x="760" y="930" font-size="58" fill="${TINTA}">puente</text></g>
      <g id="pl-z2" opacity="0"><circle cx="660" cy="700" r="70" fill="none" stroke="${TINTA}" stroke-width="7"/><text x="660" y="725" text-anchor="middle" font-size="80" fill="${TINTA}">2</text><text x="420" y="720" font-size="64" fill="#c62828">90 s</text></g>
      <g id="pl-rosa" opacity="0"><path d="M640 470 l80 -70 l80 70 v90 h-160 z" fill="none" stroke="${TINTA}" stroke-width="7"/><text x="720" y="610" text-anchor="middle" font-size="70" fill="#c62828">ROSA</text></g>
    </svg>`),
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.04, x: 0, y: -10 } },
  update(lt, dur, t) {
    escribe($('#pl-tit'), t, INI.plan + 0.05, 0.5);
    const ve = (id, t0) => $(id).setAttribute('opacity', clamp((t - t0) / 0.3));
    ve('#pl-centro', INI.plan + 0.4); ve('#pl-z1', M.noventa); ve('#pl-z2', M.noventa + 0.5); ve('#pl-pu', M.zona + 0.3); ve('#pl-rosa', M.rosa - 0.1);
    const p = clamp((t - M.zona) / (M.rosa - M.zona + 0.2));
    const ruta = $('#pl-ruta'); ruta.setAttribute('opacity', p > 0 ? 1 : 0);
    ruta.style.clipPath = `inset(${(1 - p) * 100}% 0 0 0)`;
  },
};

// ---------- 9. Primera alerta. Corren al poste. Ustedes pasan ----------
const CORREN = (() => { const r = rng(17), g = []; for (let i = 0; i < 9; i++) g.push({ x0: -150 - r() * 500, v: 380 + r() * 160, y: 1380 + r() * 90, s: 260 + r() * 60, ph: r() * 6 }); return g.sort((a, b) => a.y - b.y); })();
ESCENAS.primera = {
  html: lienzo(`${calle({ poste: 900 })}<g id="pm-ellos"></g><g id="pm-grupo"></g>${viñeta}`),
  camara: { claves: [[INI.primera, 1.0, 0, 0], [FIN('primera'), 1.06, 0, 20]] },
  update(lt, dur, t) {
    animaPoste($('#esc-primera'), t, t > ALERTA1);
    const d = Math.max(0, t - ALERTA1);
    $('#pm-ellos').innerHTML = `<g filter="url(#ink)">${CORREN.map((p, i) => { const x = Math.min(880 - i * 28, p.x0 + d * p.v);
      return `<g transform="translate(${x} ${p.y}) scale(${p.s})">${x < 870 - i * 28 ? infectadoLado(t * 10 + p.ph) : infectadoQuieto(1, 0, -0.03)}</g>`; }).join('')}</g>`;
    const g = clamp((t - M.pasan + 0.6) / 2.2), gx = lerp(760, 120, g), f = t * 14;
    $('#pm-grupo').innerHTML = t > M.pasan - 0.6 ? espejo(gx, tuCorre(gx, 1530, 52, f) + evelinCorre(gx + 120, 1530, 50, f + 1) + chispaCorre(gx - 70, 1480, 0.5, t, { audifonos: true }) + memoCorre(gx + 250, 1530, 54, f + 2)) : '';
  },
};

// ---------- 10. Bajo el puente no hay poste. Y está lleno ----------
ESCENAS.puente = {
  html: lienzo(`${puente}<g id="pu-gente" filter="url(#ink)"></g><g id="pu-grupo"></g>${viñeta}`),
  camara: { claves: [[INI.puente, 1.0, 0, 0], [M.lleno - 0.2, 1.0, 0, 0], foco(M.lleno + 0.4, 1.35, 600, 1100), foco(FIN('puente'), 1.4, 600, 1100)] },
  update(lt, dur, t) {
    $('#pu-gente').innerHTML = bajoGente(t);
    $('#pu-grupo').innerHTML = tuDe(150, 1600, 58, { look: 12, lookY: -4, eyeScale: 1.2 }) + evelinConsola(290, 1600, 56, { look: 12 }) +
      chispa(70, 1560, 0.5, { g: 0.75, audifonos: true }) + memoDe(420, 1600, 60, { gris: 1, look: 6, ...manosArriba(420, 1600, 60) });
  },
};

// ---------- 11. Le quitas los audífonos a Chispa. Aúlla. Y se los lleva ----------
ESCENAS.aulla = {
  html: lienzo(`<rect width="1080" height="1920" fill="#1f2228"/><circle cx="540" cy="900" r="760" fill="#9fb3c8" opacity=".08"/><g id="au-cara"></g><g id="au-ondas"></g>${viñeta}`),
  camara: { claves: [[INI.aulla, 1.0, 0, 0], [AULLIDO, 1.04, 0, 0], [FIN('aulla'), 1.14, 0, 40]] },
  update(lt, dur, t) {
    const q = ease.inOut(clamp((t - M.quitas - 0.1) / 0.7)), aulla = t > AULLIDO;
    const y = lerp(0, -1100, q);
    $('#au-cara').innerHTML = `<g filter="url(#ink)"><g transform="translate(540 940) rotate(${aulla ? Math.sin(t * 20) * 2 : 0})">
      ${caraChispa({ sinCinta: true, aullido: aulla ? 0.85 + 0.1 * Math.sin(t * 6) : 0, parpadeo: aulla })}
      <g transform="translate(0 ${y})">${audifonosCara}<path d="M-320 160 L-480 640 M320 160 L480 640" stroke="${INK}" stroke-width="40" stroke-linecap="round"/>${punto(-320, 140, 44, INK)}${punto(320, 140, 44, INK)}</g></g></g>`;
    const d = t - AULLIDO;
    $('#au-ondas').innerHTML = aulla ? [0, 1, 2].map(k => { const f = ((d * 1.3) + k / 3) % 1; return `<circle cx="540" cy="1180" r="${220 + f * 700}" fill="none" stroke="#fff" stroke-width="8" opacity="${0.6 * (1 - f)}"/>`; }).join('') : '';
  },
};

// ---------- 12. Es más rápida que ellos. Regresa ----------
const TRAS = (() => { const r = rng(23), g = []; for (let i = 0; i < 10; i++) g.push({ dx: -150 - i * 60 - r() * 40, y: 1360 + r() * 110, s: 250 + r() * 60, ph: r() * 6 }); return g.sort((a, b) => a.y - b.y); })();
ESCENAS.regresa = {
  html: lienzo(`${calle()}<g id="re-ellos"></g><g id="re-chispa"></g><g id="re-tu"></g>${viñeta}`),
  camara: { claves: [[INI.regresa, 1.0, 0, 0], [FIN('regresa'), 1.05, 0, 20]] },
  update(lt, dur, t) {
    const vuelta = M.regresaM - 0.25, d = t - INI.regresa;
    const cx = t < vuelta ? 260 + d * 1100 : lerp(1150, 330, clamp((t - vuelta) / 1.1));
    $('#re-ellos').innerHTML = `<g filter="url(#ink)">${TRAS.map(p => { const x = 100 + d * 800 + p.dx;
      return `<g transform="translate(${x} ${p.y}) scale(${p.s})">${infectadoLado(t * 10 + p.ph)}</g>`; }).join('')}</g>`;
    $('#re-chispa').innerHTML = chispaCorre(cx, t > vuelta ? 1520 : 1450, 0.7, t, { voltea: t > vuelta, modo: t > vuelta ? 'contenta' : 'parada', cola: Math.sin(t * 20) * 20 });
    $('#re-tu').innerHTML = tuDe(130, 1640, 60, { look: 12, armL: [[95, 1440], [60, 1390]], armR: [[175, 1440], [220, 1470]] });
  },
};

// ---------- 13. Última zona. Evelin aprieta el botón. La alerta suena ----------
function consolaGrande(t) {
  const pulsa = t > BOTON - 0.08 && t < BOTON + 0.25, on = t > ALERTA2;
  const seg = on ? Math.max(0, 90 - Math.floor(t - ALERTA2)) : 90, txt = `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, '0')}`;
  const dedo = ease.inOut(clamp((t - BOTON + 0.45) / 0.4));
  return `<g filter="url(#ink)"><g transform="translate(540 1000) scale(4.2)">
    <path d="M40 -50 L58 -120" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="58" cy="-122" r="6" fill="${on && Math.sin(t * 12) > 0 ? '#ff5a4f' : ROJO}" stroke="${INK}" stroke-width="2.5"/>
    <rect x="-75" y="-55" width="150" height="105" rx="14" fill="#6b7280" stroke="${INK}" stroke-width="4"/>
    <rect x="-60" y="-40" width="80" height="50" rx="6" fill="${on ? '#3a0f0f' : '#0e2a26'}" stroke="${INK}" stroke-width="2.5"/>
    <text x="-20" y="-22" text-anchor="middle" font-family="monospace" font-weight="700" font-size="11" fill="${on ? '#ff8a80' : '#3fb8a8'}">ZONA 2</text>
    <text x="-20" y="2" text-anchor="middle" font-family="monospace" font-weight="700" font-size="17" fill="${on ? '#ff8a80' : '#3fb8a8'}">${txt}</text>
    <circle cx="48" cy="-15" r="${pulsa ? 12 : 14}" fill="${pulsa || on ? ROJO : '#8a1f1b'}" stroke="${INK}" stroke-width="3"/>
    ${[0, 1, 2].map(i => `<rect x="${-58 + i * 30}" y="22" width="22" height="14" rx="4" fill="#3a3e46"/>`).join('')}
    <path d="M-90 110 L-78 20" stroke="#2f6f6a" stroke-width="16" stroke-linecap="round"/><circle cx="-78" cy="18" r="10" fill="${INK}"/>
    <path d="M110 110 L${lerp(90, 62, dedo)} ${lerp(30, -5, dedo)}" stroke="#2f6f6a" stroke-width="16" stroke-linecap="round"/>
    <circle cx="${lerp(90, 54, dedo)}" cy="${lerp(25, -12, dedo)}" r="10" fill="${INK}"/></g></g>`;
}
ESCENAS.ultima = {
  html: lienzo(`${calle()}<rect width="1080" height="1920" fill="#0b0f17" opacity=".55"/><rect id="ul-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/><g id="ul-ondas"></g><g id="ul-consola"></g>${viñeta}`),
  camara: { claves: [[INI.ultima, 1.0, 0, 0], [BOTON, 1.1, -60, 40], [FIN('ultima'), 1.0, 0, 0]] },
  update(lt, dur, t) {
    $('#ul-consola').innerHTML = consolaGrande(t);
    const on = t > ALERTA2;
    $('#ul-rojo').setAttribute('opacity', on ? 0.12 + 0.12 * Math.max(0, Math.sin(t * 9)) : 0);
    $('#ul-ondas').innerHTML = on ? [0, 1, 2].map(k => { const f = ((t - ALERTA2) * 1.4 + k / 3) % 1; return `<circle cx="785" cy="490" r="${60 + f * 600}" fill="none" stroke="${ROJO}" stroke-width="10" opacity="${0.8 * (1 - f)}"/>`; }).join('') : '';
  },
};

// ---------- 14. Memo ya no tiene las manos arriba. La agarra por detrás. Se lleva las dos ----------
ESCENAS.agarra = {
  html: lienzo(`${calle({ poste: 1010 })}<g id="ag-cosas"></g>${viñeta}`),
  camara: { claves: [[INI.agarra, 1.0, 0, 0], [AGARRA - 0.2, 1.0, 0, 0], foco(AGARRA + 0.3, 1.25, 470, 1200), foco(M.suelta + 0.2, 1.5, 500, 1230), foco(M.seLleva + 0.3, 1.1, 420, 1150), [FIN('agarra'), 1.05, 40, 0]] },
  update(lt, dur, t) {
    animaPoste($('#esc-agarra'), t, true);
    const y = 1560, re = 88, rm = 95;
    const baja = ease.inOut(clamp((t - M.yaNo) / 0.5)), acerca = ease.inOut(clamp((t - M.yaNo - 0.2) / (AGARRA - M.yaNo - 0.2)));
    const lleva = ease.inOut(clamp((t - M.seLleva + 0.2) / 2.4)), ex = 560 - lleva * 420, mx = lerp(200, ex - 140, acerca);
    const agarrada = t > AGARRA;
    const blanco = Math.sin(t * 7) > 0.85;
    let memoSvg;
    if (!agarrada) {
      const arriba = manosArriba(mx, y, rm);
      memoSvg = memoDe(mx, y, rm, { gris: 1, look: 12, eyeFill: blanco ? '#f2f2f2' : undefined,
        armL: [arriba.armL[0], [lerp(arriba.armL[1][0], mx + rm * 1.2, baja), lerp(arriba.armL[1][1], y - rm * 3.4, baja)]],
        armR: [arriba.armR[0], [lerp(arriba.armR[1][0], mx + rm * 1.4, baja), lerp(arriba.armR[1][1], y - rm * 3.6, baja)]] });
    } else {
      memoSvg = memoDe(mx, y, rm, { gris: 1, dx: -10, look: 14, lookY: 4, eyeFill: blanco ? '#f2f2f2' : undefined, armR: [[mx + rm * 0.5, y - rm * 3.2], [mx + rm * 0.6, y - rm * 3.0]] });
    }
    const evSvg = evelinConsola(ex, y, re, { look: agarrada ? -6 : -16, lookY: agarrada ? -6 : 0, eyeScale: agarrada ? 1.45 : 1 });
    const brazo = agarrada ? `<g filter="url(#contorno)">${brazoMordido([mx + rm * 0.2, y - rm * 4.2 + rm * 0.4], [ex - re * 0.55, y - re * 3.45], [ex + re * 0.65, y - re * 3.7], rm)}</g>` : '';
    $('#ag-cosas').innerHTML = memoSvg + evSvg + brazo +
      tuDe(880, 1600, 66, { look: agarrada ? -14 : -6, eyeScale: agarrada ? 1.35 : 1, armL: [[830, 1390], [790, 1440]] }) + audifonosSueltos(785, 1435, 0.75, -20) +
      chispa(980, 1540, 0.6, { g: 0.8, modo: 'parada' });
  },
};

// ---------- 15. Chispa todavía no trae los audífonos. La alerta la jala ----------
ESCENAS.jala = {
  html: lienzo(`${calle()}<rect width="1080" height="1920" fill="#2b1d1f" opacity=".35"/><g id="ja-ondas"></g><g id="ja-cosas"></g>${viñeta}`),
  camara: { claves: [[INI.jala, 1.0, 0, 0], [M.jalaM, 1.1, -40, 0], [FIN('jala'), 1.25, -120, 20]] },
  update(lt, dur, t) {
    const jala = ease.inOut(clamp((t - M.jalaM) / 0.6));
    $('#ja-ondas').innerHTML = ondasLejos(t, 1200, 1100, 1);
    const cx = 560 + jala * 160 + Math.sin(t * 40) * 3;
    $('#ja-cosas').innerHTML = tuDe(220, 1530, 82, { look: 14, eyeScale: 1.25, armR: [[290, 1260], [lerp(370, 330, jala), lerp(1310, 1290, jala)]] }) +
      audifonosSueltos(lerp(400, 360, jala), 1300, 0.95, -10) +
      `<g transform="rotate(${jala * 8} ${cx} 1380)">${chispa(cx, 1380, 1.25, { g: 0.85, modo: 'parada', blancos: clamp((t - M.jalaM - 0.3) / 0.4) * 0.6 })}</g>`;
  },
};

// ---------- 16. Ojos blancos. Corre al poste. Entre ellos ----------
const ESTAMPIDA = (() => { const r = rng(41), g = []; for (let i = 0; i < 16; i++) g.push({ x0: 60 + r() * 520, v: 420 + r() * 200, y: 1340 + r() * 140, s: 240 + r() * 70, ph: r() * 6 }); return g.sort((a, b) => a.y - b.y); })();
ESCENAS.entre = {
  html: lienzo(`<g id="en-a"><rect width="1080" height="1920" fill="#2b1d1f"/><circle cx="540" cy="900" r="800" fill="${ROJO}" opacity=".14"/><g id="en-cara"></g><g id="en-ondas"></g></g>
    <g id="en-b" style="display:none">${calle({ poste: 960 })}<g id="en-ellos"></g><g id="en-chispa"></g><g id="en-memo"></g></g>${viñeta}`),
  camara: { claves: [[INI.entre, 1.0, 0, 0], [M.correPoste - 0.15, 1.1, 0, 40], [M.correPoste - 0.1, 1.0, 0, 0], [FIN('entre'), 1.06, 0, 30]] },
  update(lt, dur, t) {
    const ancho = t > M.correPoste - 0.1;
    $('#en-a').style.display = ancho ? 'none' : '';
    $('#en-b').style.display = ancho ? '' : 'none';
    if (!ancho) {
      const p = clamp((t - OJOS) / 0.3);
      $('#en-cara').innerHTML = `<g filter="url(#ink)"><g transform="translate(${540 + Math.sin(t * 45) * 4} 900)">${caraChispa({ sinCinta: true, ceno: p > 0.3, orejasAtras: p > 0.5 })}${ojosBlancos(p)}</g></g>`;
      $('#en-ondas').innerHTML = ondasLejos(t, 1200, 900, 1) + ondasLejos(t + 0.35, -120, 900, -1);
      return;
    }
    animaPoste($('#esc-entre'), t, true);
    const d = t - (M.correPoste - 0.1);
    $('#en-ellos').innerHTML = `<g filter="url(#ink)">${ESTAMPIDA.map((p, i) => { const x = Math.min(930 - (i % 6) * 30, p.x0 + d * p.v);
      return `<g transform="translate(${x} ${p.y}) scale(${p.s})">${x < 920 - (i % 6) * 30 ? infectadoLado(t * 10 + p.ph) : infectadoQuieto(1, 0, -0.03)}</g>`; }).join('')}</g>`;
    const chx = Math.min(860, 420 + d * 330);
    $('#en-chispa').innerHTML = chispaCorre(chx, 1450, 0.6, t, { blancos: 1 }) + `<circle cx="${chx + 10}" cy="1430" r="${95 + 6 * Math.sin(t * 6)}" fill="none" stroke="${ROJO}" stroke-width="8"/>`;
    const mx = 260 - d * 120;
    $('#en-memo').innerHTML = espejo(mx, memoDe(mx, 1640, 70, { gris: 1, look: 10, armR: [[mx + 40, 1400], [mx + 110, 1380]] }) + evelinConsola(mx + 90, 1660, 64, { look: 14, eyeScale: 1.4 }));
  },
};

// ---------- 17. ¿Salvas a Chispa, o vas por Evelin? ----------
ESCENAS.decide = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="960" r="900" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="de-tit">¿QUÉ HACES?</div>
    <div class="opcion" id="de-a" style="top:560px;font-size:70px"><span class="emo">🐕</span><span class="txt">SALVAS A CHISPA</span></div>
    <div class="opcion" id="de-b" style="top:900px;font-size:70px"><span class="emo">👩</span><span class="txt">VAS POR EVELIN</span></div>
    <div class="decide-com" id="de-com">COMENTA <span class="emo">🐕</span> O <span class="emo">👩</span></div>
    <div class="decide-pie" id="de-pie">GANA LO QUE MÁS COMENTEN</div>`,
  update(lt, dur, t) {
    pop($('#de-tit'), t, INI.decide);
    pop($('#de-a'), t, M.salvas - 0.1);
    pop($('#de-b'), t, M.vas - 0.1);
    pop($('#de-com'), t, M.comenta - 0.1);
    $('#de-pie').style.opacity = clamp((t - M.comenta - 0.6) / 0.3);
    const a = t >= M.salvas - 0.1 && t < M.vas - 0.1, b = t >= M.vas - 0.1 && t < M.comenta - 0.1;
    $('#de-a').style.borderColor = a ? '#e5a83b' : '#fff';
    $('#de-b').style.borderColor = b ? '#9fd0ff' : '#fff';
    if (a) $('#de-a').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
    if (b) $('#de-b').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
  },
};
