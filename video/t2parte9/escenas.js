// Escenas de "La alerta", temporada 2, parte 9: Bajen al patio. Gana 🐕 en los comentarios de la parte 8: salvas a
// Chispa del poste. Memo entrega a Evelin en el estadio; unos guantes negros se la llevan con la consola y una bocina
// le dice "No evacuamos mordidos". A Memo se le van las pupilas. A medianoche el radio de Rosa anuncia la alerta de las
// 3:14; pitidos de Evelin: EL TABLERO VIEJO / HAY CURA. El gris de Chispa pasa la cadera. Rosa apaga la vela para salir
// y la escalera está llena. Decisión: 🪢 bajan por la ventana con el mecate o 🚪 por la escalera, entre ellos.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const PONE = M.pones + 0.6;            // los audífonos quedan puestos
const REJA = M.abre + 0.1;             // la reja del estadio se abre
const JALAN = M.guantes + 0.3;         // los guantes jalan a Evelin
const CIERRA = M.cierraM + 0.1;        // la reja se cierra
const PUPILAS = M.pupilas + 0.2;       // a Memo se le van las pupilas
const APAGA = M.apaga + 0.5;           // Rosa sopla la vela
const PUERTA = M.abrePuerta + 0.25;    // Rosa abre la puerta

// ---------- Clave Morse (como en la temporada 2, parte 1). mezcla.py usa la misma cuenta. ----------
const MORSE = { A: '.-', B: '-...', C: '-.-.', E: '.', H: '....', I: '..', J: '.---', L: '.-..', O: '---', R: '.-.', T: '-', U: '..-', V: '...-', Y: '-.--' };
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
const TABLERO = morse('EL TABLERO VIEJO', M.pitidosM + 0.75, M.viejo + 0.4);
const CURA = morse('HAY CURA', M.viejo + 0.6, M.cura + 0.75);

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

// ---------- 1. Ganó salvar a Chispa ----------
ESCENAS.gano = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="1040" r="800" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="ga-tit">GANÓ</div>
    <div class="opcion" id="ga-a" style="top:560px;font-size:70px;border-color:#e5a83b;box-shadow:0 0 40px rgba(229,168,59,.5)"><span class="emo">🐕</span><span class="txt">SALVAS A CHISPA</span></div>
    <div class="opcion" id="ga-b" style="top:900px;font-size:70px"><span class="emo">👩</span><span class="txt" style="text-decoration:line-through;text-decoration-color:#e0312b;text-decoration-thickness:10px">VAS POR EVELIN</span></div>
    <div class="decide-pie" id="ga-pie" style="top:1260px">LOS COMENTARIOS ELIGIERON</div>`,
  camara: { claves: [[0, 1.0, 0, 0], [FIN('gano'), 1.08, 0, 30]], origen: '540px 760px' },
  update(lt, dur, t) {
    pop($('#ga-tit'), t, 0.02, 0.25);
    pop($('#ga-a'), t, 0.1, 0.3);
    $('#ga-a').style.transform += ` scale(${1 + 0.035 * Math.sin(t * 8)})`;
    $('#ga-b').style.opacity = 0.35;
    $('#ga-pie').style.opacity = clamp((t - M.salvar - 0.2) / 0.3);
  },
};

// ---------- 2. Corres al poste, entre ellos. El ruido es gratis ----------
const POSTE_GENTE = (() => { const r = rng(52), g = []; for (let i = 0; i < 14; i++) g.push({ x: 650 + (i % 7) * 52 + (r() - 0.5) * 30, y: 1330 + Math.floor(i / 7) * 80 + r() * 30, s: 240 + r() * 50, l: (r() - 0.5) * 0.04 }); return g.sort((a, b) => a.y - b.y); })();
ESCENAS.corres = {
  html: lienzo(`${calle({ poste: 900 })}<g id="co-gente" filter="url(#ink)"></g><g id="co-chispa"></g><g id="co-tu"></g>${viñeta}`),
  camara: { claves: [[INI.corres, 1.0, 0, 0], [M.gratis - 0.2, 1.06, 0, 0], foco(FIN('corres'), 1.4, 700, 1320)] },
  update(lt, dur, t) {
    animaPoste($('#esc-corres'), t, true);
    $('#co-gente').innerHTML = POSTE_GENTE.map((p, i) => `<g transform="translate(${p.x + Math.sin(t * 3 + i) * 3} ${p.y}) scale(${p.s})">${infectadoQuieto(1, p.l, -0.06)}</g>`).join('');
    $('#co-chispa').innerHTML = chispa(760 + Math.sin(t * 40) * 3, 1470, 0.55, { g: 0.9, blancos: 1 }) + `<circle cx="772" cy="1450" r="${90 + 6 * Math.sin(t * 6)}" fill="none" stroke="${ROJO}" stroke-width="8"/>`;
    const x = lerp(60, 600, ease.inOut(clamp((t - INI.corres) / 2.6)));
    $('#co-tu').innerHTML = tuCorre(x, 1560, 64, t * 16);
  },
};

// ---------- 3. La agarras. Le pones los audífonos. Vuelve a ser Chispa ----------
ESCENAS.agarras = {
  html: lienzo(`<rect width="1080" height="1920" fill="#2b1d1f"/><circle cx="540" cy="900" r="800" fill="${ROJO}" opacity=".12"/><g id="ag-ondas"></g><g id="ag-cara"></g>${viñeta}`),
  camara: { claves: [[INI.agarras, 1.0, 0, 0], [PONE, 1.06, 0, 0], [FIN('agarras'), 1.0, 0, 0]] },
  update(lt, dur, t) {
    const baja = ease.outCubic(clamp((t - M.pones + 0.1) / (PONE - M.pones + 0.1)));
    const vuelve = clamp((t - M.vuelve + 0.2) / 0.5), calma = clamp((t - PONE) / 0.8);
    $('#ag-ondas').innerHTML = calma < 1 ? ondasLejos(t, 1250, 900, 1) + ondasLejos(t + 0.4, -170, 900, -1) : '';
    $('#ag-cara').innerHTML = `<g filter="url(#ink)"><g transform="translate(${540 + Math.sin(t * 45) * 5 * (1 - calma)} 900)">
      ${caraChispa({ sinCinta: true, ceno: vuelve < 0.3, orejasAtras: vuelve < 0.5, boca: lerp(0.5, 0, calma) })}${ojosBlancos(1 - vuelve)}
      <path d="M-560 1100 L-360 660 M560 1100 L360 660" stroke="${INK}" stroke-width="40" stroke-linecap="round"/>${punto(-360, 650, 50, INK)}${punto(360, 650, 50, INK)}
      <g transform="translate(0 ${lerp(-1000, 0, baja)})">${audifonosCara}${baja < 1 ? `<path d="M-320 160 L-480 -500 M320 160 L480 -500" stroke="${INK}" stroke-width="40" stroke-linecap="round"/>${punto(-320, 140, 44, INK)}${punto(320, 140, 44, INK)}` : ''}</g></g></g>`;
  },
};

// ---------- 4. A lo lejos, Memo arrastra a Evelin hacia el estadio ----------
ESCENAS.lejos = {
  html: lienzo(`<defs><linearGradient id="le-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2f5c"/><stop offset=".55" stop-color="#c0645a"/><stop offset="1" stop-color="#f0a35c"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#le-cielo)"/>
    <g filter="url(#ink)">
      <ellipse cx="540" cy="1010" rx="330" ry="70" fill="#2a2433" stroke="${INK}" stroke-width="8"/>
      <path d="M210 1010 Q220 900 540 890 Q860 900 870 1010" fill="#3a3346" stroke="${INK}" stroke-width="8"/><path d="M250 975 Q540 930 830 975 M290 945 Q540 905 790 945" fill="none" stroke="#4a4258" stroke-width="6"/>
      ${[260, 420, 660, 820].map(x => `<path d="M${x} 1000 L${x} 800" stroke="#2a2433" stroke-width="10"/><rect x="${x - 34}" y="770" width="68" height="34" fill="#fff6c8" stroke="${INK}" stroke-width="5"/>`).join('')}
      <path d="M-20 1080 L1100 1080 L1100 1980 L-20 1980 Z" fill="#3d4048"/>
      <path d="M-20 1980 L470 1080 L610 1080 L1100 1980 Z" fill="#4a4d56"/>
      <path d="M540 1080 L540 1980" stroke="#e9e2d6" stroke-width="14" stroke-dasharray="70 60"/>
      <path d="M-20 1080 L-20 600 L160 600 L160 1080 Z M920 1080 L920 650 L1100 650 L1100 1080 Z" fill="#2a2433" stroke="${INK}" stroke-width="8"/>
    </g>
    ${[260, 420, 660, 820].map(x => `<circle cx="${x}" cy="787" r="90" fill="#fff6c8" opacity=".25" filter="url(#blur10)"/>`).join('')}
    <g id="le-heli"></g><g id="le-ellos"></g><g id="le-tu"></g>${viñeta}`),
  camara: { claves: [[INI.lejos, 1.0, 0, 0], foco(M.estadio, 1.25, 540, 1050), foco(FIN('lejos'), 1.32, 540, 1040)] },
  update(lt, dur, t) {
    const hx = 760 - (t - INI.lejos) * 40;
    $('#le-heli').innerHTML = `<g transform="translate(${hx} ${720 + Math.sin(t * 2) * 6})" filter="url(#ink)"><ellipse rx="44" ry="18" fill="#141218"/><path d="M-44 0 L-100 -8" stroke="#141218" stroke-width="8"/>
      <path d="M${-60 + Math.sin(t * 60) * 20} -24 L${60 - Math.sin(t * 60) * 20} -24" stroke="#141218" stroke-width="5"/><circle cx="-100" cy="-8" r="6" fill="${Math.sin(t * 8) > 0 ? ROJO : '#3a0f0f'}"/></g>`;
    const k = clamp((t - INI.lejos) / 4), y = lerp(1330, 1200, k), s = lerp(1, 0.75, k);
    $('#le-ellos').innerHTML = `<g transform="translate(${lerp(560, 540, k)} ${y}) scale(${s})">${memoDe(30, 0, 20, { gris: 1, armR: [[40, -70], [-6, -66]] })}${evelinConsola(-20, 0, 19, { look: 6, eyeScale: 1.3 })}</g>`;
    $('#le-tu').innerHTML = tuConChispa(150, 1560, 80, t, { look: 16, lookY: -8 });
  },
};

// ---------- 5. Ahí se abre una reja. Unos guantes negros se llevan a Evelin. Y la consola ----------
ESCENAS.reja = {
  html: lienzo(`<g id="re-fondo"></g><g id="re-cosas"></g>${viñeta}`),
  camara: { claves: [[INI.reja, 1.0, 0, 0], [JALAN - 0.2, 1.0, 0, 0], foco(JALAN + 0.3, 1.2, 540, 1100), foco(M.consolaM + 0.3, 1.35, 520, 1100), foco(FIN('reja'), 1.25, 600, 1060)] },
  update(lt, dur, t) {
    const abre = ease.inOut(clamp((t - REJA) / 0.9));
    $('#re-fondo').innerHTML = estadioReja(t, abre);
    const jala = ease.inOut(clamp((t - JALAN) / 1.2)), quita = ease.inOut(clamp((t - M.consolaM) / 0.6));
    const ex = lerp(560, 540, jala), ey = lerp(1560, 1250, jala), es = lerp(1, 0.55, jala);
    const fuera = clamp((t - M.consolaM - 0.5) / 0.6), luz = 1 - 0.45 * jala;
    const ev = `<g opacity="${(1 - fuera) * luz + (1 - fuera) * 0.0}"><g transform="translate(${ex} ${ey}) scale(${es})">${evelinDe(0, 0, 88, { audifonos: 'no', look: 10, eyeScale: 1.45, brazosAlFrente: true,
      armL: [[-60, -280], [-20, -295]], armR: [[60, -280], [20, -295]] })}</g></g>`;
    const cx = lerp(ex, 600, quita), cy = lerp(ey - 88 * 3.25 * es, 860, quita);
    const cons = `<g opacity="${1 - clamp((t - M.consolaM - 0.4) / 0.4)}">${consola(cx, cy, 0.68 * lerp(es, 0.45, quita))}</g>`;
    const agarre = clamp((t - JALAN + 0.25) / 0.25);
    const hL = [lerp(330, ex - 50 * es, agarre), lerp(1180, ey - 88 * 3.7 * es, agarre)], hR = [lerp(750, ex + 50 * es, agarre), lerp(1180, ey - 88 * 3.7 * es, agarre)];
    const oL = [lerp(330, 450, jala), lerp(1180, 1120, jala)], oR = [lerp(750, 630, jala), lerp(1180, 1120, jala)];
    const manos = t > JALAN - 0.25 ? `<g opacity="${1 - fuera}">${guante(oL[0], oL[1], hL[0], hL[1])}${guante(oR[0], oR[1], hR[0], hR[1])}</g>` : '';
    const manoC = t > M.consolaM - 0.25 && t < M.consolaM + 0.8 ? `<g opacity="${1 - clamp((t - M.consolaM - 0.4) / 0.4)}">${guante(600, 760, cx + 24, cy)}</g>` : '';
    $('#re-cosas').innerHTML = memoDe(lerp(780, 740, jala), 1600, 92, { gris: 1, look: -10, armL: [[690, 1320], [lerp(620, 680, jala), lerp(1300, 1360, jala)]], armR: [[790, 1320], [830, 1390]] }) +
      ev + manos + cons + manoC;
  },
};

// ---------- 6. Memo estira el brazo gris. No evacuamos mordidos, dice una bocina ----------
ESCENAS.bocina = {
  html: lienzo(`${estadioReja(0, 1)}<g id="bo-memo"></g><g id="bo-ondas"></g>${viñeta}`),
  camara: { claves: [[INI.bocina, 1.0, 0, 0], foco(M.estira + 0.4, 1.25, 600, 1150), foco(M.noEvac - 0.1, 1.25, 600, 1150), foco(M.noEvac + 0.4, 1.4, 820, 720), foco(M.dice + 0.3, 1.4, 820, 720), foco(FIN('bocina'), 1.15, 680, 1000)] },
  update(lt, dur, t) {
    const estira = ease.outCubic(clamp((t - M.estira) / 0.6)), mira = t > M.noEvac - 0.1;
    $('#bo-memo').innerHTML = memoDe(780, 1600, 96, { gris: 1, look: mira ? 14 : -12, lookY: mira ? -14 : 0,
      armL: [[700, 1320], [690, 1400]], armR: [[lerp(830, 690, estira), lerp(1300, 1210, estira)], [lerp(840, 560, estira), lerp(1380, 1170, estira)]] });
    $('#bo-ondas').innerHTML = ondasBocina(t, t > M.noEvac - 0.05 && t < M.dice);
  },
};

// ---------- 7. La reja se cierra. A Memo se le van las pupilas. Ya no es Memo ----------
ESCENAS.cierra = {
  html: lienzo(`<g id="ci-a">${estadioReja(0, 1)}</g><g id="ci-memo"></g>
    <g id="ci-b" style="display:none"><rect width="1080" height="1920" fill="#14121a"/><circle cx="540" cy="900" r="700" fill="#e9eef7" opacity=".06"/><g id="ci-cara"></g>
      <g filter="url(#ink)">${[...Array(10)].map((_, i) => `<rect x="${-30 + i * 120}" y="-20" width="34" height="1960" fill="#3a3e46" stroke="${INK}" stroke-width="7"/>`).join('')}
        <rect x="-20" y="1240" width="1120" height="36" fill="#3a3e46" stroke="${INK}" stroke-width="7"/></g></g>${viñeta}`),
  fijo: `<div class="onomato" id="ci-clang" style="top:560px;left:120px;font-size:150px;opacity:0;transform:rotate(-6deg)">¡CLANG!</div>`,
  camara: { claves: [[INI.cierra, 1.0, 0, 0], [CIERRA + 0.6, 1.05, 0, 0], [CIERRA + 0.65, 1.0, 0, 0], [M.yaNo, 1.05, 0, 30], [FIN('cierra'), 1.18, 0, 80]] },
  update(lt, dur, t) {
    const cerca = t > CIERRA + 0.65;
    $('#ci-a').style.display = cerca ? 'none' : '';
    $('#ci-memo').style.display = cerca ? 'none' : '';
    $('#ci-b').style.display = cerca ? '' : 'none';
    if (!cerca) {
      const cierra = clamp((t - INI.cierra) / (CIERRA - INI.cierra));
      $('#ci-a').innerHTML = estadioReja(t, 1 - cierra * cierra);
      $('#ci-memo').innerHTML = memoDe(780, 1600, 96, { gris: 1, look: -12, armL: [[700, 1320], [690, 1400]], armR: [[690, 1210], [560, 1170]] });
      $('#ci-clang').style.opacity = t > CIERRA && t < CIERRA + 0.6 ? 1 : 0;
      sacude('cierra', t, CIERRA, 0.35, 14);
      return;
    }
    $('#ci-clang').style.opacity = 0;
    const blanco = t > PUPILAS, ya = ease.inOut(clamp((t - M.yaNo) / 0.6));
    const cx = 540, cy = lerp(900, 860, ya), r = 220;
    $('#ci-cara').innerHTML = `<g filter="url(#contorno)">${memo({ head: [cx, cy], r, neck: [cx + 10, cy + r * 1.1], hip: [cx + 20, cy + r * 3.3],
      look: 0, lookY: lerp(0, -40, ya), eyeScale: blanco ? 1.15 : 1, eyeFill: blanco ? '#f2f2f2' : undefined, sinBrillo: blanco, headFill: ya > 0.5 ? 'url(#headInfectado)' : undefined })}
      ${venas(cx, cy, r, 1)}${quijada(cx, cy, r)}</g>`;
  },
};

// ---------- 8. Tú y Chispa vuelven con Rosa ----------
ESCENAS.vuelven = {
  html: lienzo(`${cocinaRosa}<g id="vu-cosas"></g>${viñeta}`),
  camara: { claves: [[INI.vuelven, 1.06, 0, 0], [FIN('vuelven'), 1.0, 0, 0]] },
  update(lt, dur, t) {
    const abraza = ease.outCubic(clamp((t - INI.vuelven - 0.3) / 0.6));
    $('#vu-cosas').innerHTML = vela(940, 1200, t, 0.8) +
      `<g filter="url(#contorno)">${rosaDe(720, 1380 - 90 * 5.4, 90, { look: -14, lookY: 8,
        armL: [[650, 1380 - 90 * 2.9], [lerp(640, 560, abraza), lerp(1380 - 90 * 2.2, 1380 - 90 * 3.1, abraza)]], armR: [[790, 1380 - 90 * 2.9], [lerp(800, 600, abraza), lerp(1380 - 90 * 2.2, 1380 - 90 * 3.3, abraza)]] })}</g>` +
      tuConChispa(280, 1500, 84, t, { look: 14 });
  },
};

// ---------- 9. A medianoche, el radio de Rosa habla solo ----------
ESCENAS.radio = {
  html: lienzo(`${cocinaRosa}<g id="ra-cosas"></g>${viñeta}`),
  camara: { claves: [[INI.radio, 1.0, 0, 0], [M.habla - 0.2, 1.0, 0, 0], foco(FIN('radio'), 1.35, 540, 1000)] },
  update(lt, dur, t) {
    const on = t > M.habla - 0.3;
    $('#ra-cosas').innerHTML = relojDoce(210, 470, 1) +
      `<g filter="url(#ink)"><rect x="80" y="1180" width="920" height="40" fill="#6b4a2f" stroke="${INK}" stroke-width="8"/><path d="M140 1220 v260 M940 1220 v260" stroke="${INK}" stroke-width="16"/></g>` +
      radioViejo(540, 1010, t, on ? 1 : 0, 0.75) + (on ? estatica(540, 900, t, 4) : '') + vela(880, 1070, t, 0.6) +
      `<g filter="url(#contorno)">${rosaDe(200, 1500 - 70 * 5.4, 70, { look: 14, lookY: -4, eyeScale: on ? 1.3 : 1 })}</g>` +
      chispa(880, 1420, 0.6, { g: 1, audifonos: true, voltea: true });
  },
};

// ---------- 10. Hoy a las 3:14, bajen al punto de reunión. Orden y calma ----------
ESCENAS.orden = {
  html: lienzo(`<rect width="1080" height="1920" fill="#1d1519"/><circle cx="540" cy="760" r="900" fill="url(#luzCalida)" opacity=".5"/><g id="or-cosas"></g>${viñeta}`),
  camara: { claves: [[INI.orden, 1.0, 0, 0], [M.ordenM, 1.08, 0, 0], [FIN('orden'), 1.12, 0, 20]] },
  update(lt, dur, t) {
    const habla = t > M.hoy - 0.1 && t < M.mismo - 0.1;
    $('#or-cosas').innerHTML = libreta314(560, 1180, t > M.catorce) + radioViejo(470, 900, t, 1, 1.25) + (habla ? estatica(380, 780, t, 5) : '') +
      (habla && Math.sin(t * 20) > 0 ? `<circle cx="345" cy="900" r="160" fill="#fff" opacity=".05"/>` : '');
  },
};

// ---------- 11. Lo mismo que escribió Memo la primera noche ----------
ESCENAS.memo1 = {
  html: `<div class="chat">
    <div class="status"><span>3:14</span><span>▮▮▮ 41%</span></div>
    <div class="head"><span class="back">‹</span><div class="avatar">🏢</div>
      <div><div class="title">Vecinos Edificio C</div><div class="members">86 participantes</div></div></div>
    <div class="msgs">
      <div class="pill">LA PRIMERA NOCHE</div>
      <div class="msg" id="m1-msg"><div class="who" style="color:#e5a83b">Memo 101</div>bajen al punto de reunion. orden y calma 🙏<div class="t">3:14</div></div>
    </div></div>
    <div class="vhs" style="position:absolute;inset:0;background:rgba(40,20,20,.18)"></div>`,
  camara: { de: { s: 1.05, x: 0, y: 0 }, a: { s: 1.12, x: 0, y: 40 } },
  update(lt, dur, t) {
    $('#m1-msg').style.outline = t > M.escribio ? `${Math.sin(t * 8) > 0 ? 6 : 3}px solid #e0312b` : 'none';
    pop($('#m1-msg'), t, INI.memo1 + 0.05, 0.3);
  },
};

// ---------- 12. Luego, pitidos. Rosa escribe: el tablero viejo. Hay cura ----------
ESCENAS.pitidos = {
  html: lienzo(radioYLibreta('pi')),
  camara: { claves: [[INI.pitidos, 1.0, 0, 120], [M.escribe, 1.0, 0, 0], [M.hay, 1.08, 0, -80], [FIN('pitidos'), 1.14, 0, -120]], origen: '540px 1100px' },
  update(lt, dur, t) {
    const msg = t < CURA.pitidos[0].s - 0.05 ? TABLERO : CURA;
    const sonando = [...TABLERO.pitidos, ...CURA.pitidos].some(p => t >= p.s && t < p.s + p.d);
    $('#pi-radio').innerHTML = radioViejo(540, 560, t, 1, 0.9) + `<circle cx="652" cy="474" r="${sonando ? 34 : 14}" fill="${ROJO}" opacity="${sonando ? 1 : 0.4}"/>`;
    $('#pi-morse').innerHTML = morseVisual(msg, t, 800);
    const L = [{ texto: 'EL TABLERO', letras: TABLERO.letras.slice(0, 10), x0: 220, y0: 1040, size: 130 },
      { texto: 'VIEJO', letras: TABLERO.letras.slice(11), x0: 260, y0: 1190, size: 130 },
      { texto: 'HAY CURA', letras: CURA.letras, x0: 240, y0: 1390, size: 165, color: ROJO }];
    const sub = clamp((t - M.cura - 0.6) / 0.3);
    $('#pi-letras').innerHTML = escribeLineas(L, t, false) +
      (sub > 0 ? `<path d="M240 1425 q300 -18 620 4" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - sub}" stroke="${ROJO}" stroke-width="14" fill="none" stroke-linecap="round"/>` : '');
    const p = puntaLapiz(L, t);
    $('#pi-mano').innerHTML = manoLapiz(p.x, p.y, t);
  },
};

// ---------- 13. Chispa tiembla. El gris ya le pasó la cadera ----------
ESCENAS.gris = {
  html: lienzo(`${cocinaRosa}<circle cx="540" cy="1000" r="700" fill="url(#luzCalida)" opacity=".7"/><g id="gr-chispa"></g><g id="gr-circ"></g>${viñeta}`),
  camara: { claves: [[INI.gris, 1.0, 0, 0], foco(M.grisM, 1.0, 540, 960), foco(M.cadera + 0.2, 1.4, 400, 1040), foco(FIN('gris'), 1.45, 390, 1040)] },
  update(lt, dur, t) {
    $('#gr-chispa').innerHTML = chispaCadera(560, 1060, 2.9, t);
    $('#gr-circ').innerHTML = t > M.grisM - 0.1 ? `<circle cx="${560 - 60 * 2.9}" cy="1060" r="${190 + 10 * Math.sin(t * 5)}" fill="none" stroke="${ROJO}" stroke-width="10" opacity=".85"/>` : '';
  },
};

// ---------- 14. Rosa apaga la vela. Por primera vez, va a salir ----------
ESCENAS.vela = {
  html: lienzo(`${cocinaRosa}<g id="ve-luz"></g><g id="ve-cosas"></g><rect id="ve-noche" width="1080" height="1920" fill="#0b1830" opacity="0"/>${viñeta}`),
  camara: { claves: [[INI.vela, 1.0, 0, 0], foco(APAGA, 1.3, 600, 1000), [M.primeraVez, 1.05, 0, 0], [FIN('vela'), 1.1, 0, 30]] },
  update(lt, dur, t) {
    const prendida = t < APAGA, sopla = t > APAGA - 0.4 && t < APAGA + 0.2;
    const humo = clamp((t - APAGA) / 1.2);
    $('#ve-cosas').innerHTML = (prendida ? vela(760, 1050, t, 1.1) : `<rect x="741" y="1050" width="38" height="121" fill="#efe6cf" stroke="${INK}" stroke-width="5"/>
      <path d="M760 1050 q-20 -60 10 -120 t-10 -120" fill="none" stroke="#c9ccd2" stroke-width="6" opacity="${0.8 * (1 - humo)}"/>`) +
      `<g filter="url(#contorno)">${rosaDe(500, 1700 - 120 * 5.4, 120, { look: t > M.primeraVez ? 0 : 16, lookY: t > M.primeraVez ? 0 : 4, eyeScale: t > M.primeraVez ? 0.85 : 1,
        armL: [[400, 1700 - 120 * 2.6], [380, 1700 - 120 * 1.9]], armR: [[600, 1700 - 120 * 2.6], [640, 1700 - 120 * 2.0]] })}</g>` +
      (sopla ? `<path d="M620 ${1700 - 120 * 5.2} q50 -6 100 10 M620 ${1700 - 120 * 5.0} q60 4 110 26" fill="none" stroke="#fff" stroke-width="6" opacity=".7"/>` : '');
    $('#ve-noche').setAttribute('opacity', prendida ? 0 : 0.45);
  },
};

// ---------- 15. Abre la puerta. El radio los trajo. La escalera está llena ----------
ESCENAS.puerta = {
  html: lienzo(`${edificioCorte}<g id="pu-ondas"></g><g id="pu-gente" filter="url(#ink)"></g><g id="pu-puerta"></g>${viñeta}`),
  camara: { claves: [[INI.puerta, 1.6, 140, 560], [PUERTA + 0.4, 1.6, 140, 560], [M.trajo, 1.0, 0, 0], [M.llena - 0.2, 1.0, 0, 0], foco(M.llena + 0.5, 1.3, 760, 1100), [FIN('puerta'), 1.34, -260, 0]] },
  update(lt, dur, t) {
    const y4 = BASE - ALTO * 3, abre = ease.inOut(clamp((t - PUERTA) / 0.6));
    $('#pu-puerta').innerHTML = `<g filter="url(#ink)"><rect x="470" y="${y4 - 190}" width="${110 * (1 - abre * 0.65)}" height="176" fill="#5a4030" stroke="${INK}" stroke-width="6"/></g>` +
      (abre > 0.2 ? `<svg x="470" y="${y4 - 190}" width="110" height="176" viewBox="470 ${y4 - 190} 110 176"><g filter="url(#contorno)">${rosaDe(552, y4 - 150, 26, { look: 6, lookY: 6, eyeScale: 1.3 })}</g></svg>` : '');
    const d = t - (M.trajo - 0.2);
    $('#pu-ondas').innerHTML = d > 0 && d < 2.2 ? [0, 1, 2].map(k => { const f = ((d * 1.2) + k / 3) % 1; return `<circle cx="525" cy="${y4 - 100}" r="${40 + f * 600}" fill="none" stroke="#ffcf7a" stroke-width="7" opacity="${0.5 * (1 - f) * (1 - d / 2.2)}"/>`; }).join('') : '';
    $('#pu-gente').innerHTML = LLENA.map(p => `<g transform="translate(${xEsc(p.u) + p.dx} ${yEsc(p.u) + Math.sin(t * 1.4 + p.ph) * 2}) scale(130)">${infectadoQuieto(0, p.l, -0.06)}</g>`).join('');
  },
};

// ---------- 16. ¿Bajan por la ventana con el mecate, o por la escalera, entre ellos? ----------
ESCENAS.decide = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="960" r="900" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="de-tit" style="font-size:112px">¿POR DÓNDE BAJAN?</div>
    <div class="opcion" id="de-a" style="top:560px;font-size:66px"><span class="emo">🪢</span><span class="txt">POR LA VENTANA, CON EL MECATE</span></div>
    <div class="opcion" id="de-b" style="top:900px;font-size:66px"><span class="emo">🚪</span><span class="txt">POR LA ESCALERA, ENTRE ELLOS</span></div>
    <div class="decide-com" id="de-com">COMENTA <span class="emo">🪢</span> O <span class="emo">🚪</span></div>
    <div class="decide-pie" id="de-pie">GANA LO QUE MÁS COMENTEN</div>`,
  update(lt, dur, t) {
    pop($('#de-tit'), t, INI.decide);
    pop($('#de-a'), t, M.ventana - 0.1);
    pop($('#de-b'), t, M.escalera2 - 0.1);
    pop($('#de-com'), t, M.comenta - 0.1);
    $('#de-pie').style.opacity = clamp((t - M.comenta - 0.6) / 0.3);
    const a = t >= M.ventana - 0.1 && t < M.escalera2 - 0.1, b = t >= M.escalera2 - 0.1 && t < M.comenta - 0.1;
    $('#de-a').style.borderColor = a ? '#e5a83b' : '#fff';
    $('#de-b').style.borderColor = b ? '#9fd0ff' : '#fff';
    if (a) $('#de-a').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
    if (b) $('#de-b').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
  },
};
