// Escenas de "La alerta", temporada 2, parte 7: La antena. Ganó 🔐 en los comentarios de la parte 6: encierras a
// Memo en la sala de control, pero tiene la tarjeta. En la azotea, Evelin te apunta con una llave de tuercas; Chispa la
// huele y la reconoce. El viento jala a Chispa (ojos blancos) y te tira una mordida; Evelin le pone sus audífonos y se
// calma. Por un radio, la Coordinación: "Tráenos a la operadora y te curamos." Es Memo, detrás del tinaco.
// Decisión: 🗣️ le cuentas a Evelin o 🤐 te lo callas.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const PORTAZO = M.encierrasM + 0.35;   // la puerta de la sala se cierra
const GOLPES = [M.golpea + 0.05, M.golpea + 0.45, M.vidrio + 0.05, M.vidrio + 0.45];  // Memo golpea el vidrio
const RAFAGA = M.sopla - 0.1;          // el viento sopla fuerte
const CLAC = M.mordidaM + 0.55;        // Chispa te tira la mordida (en la pausa después de "mordida")
const PONE = M.pone + 0.5;             // los audífonos quedan puestos
const TRUENA = M.truena - 0.1;         // el radio truena detrás del tinaco

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

// ---------- 1. Ganó lo encierras ----------
ESCENAS.gano = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="1040" r="800" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="ga-tit">GANÓ</div>
    <div class="opcion" id="ga-a" style="top:560px;font-size:66px"><span class="emo">🤝</span><span class="txt" style="text-decoration:line-through;text-decoration-color:#e0312b;text-decoration-thickness:10px">LO DEJAS VENIR</span></div>
    <div class="opcion" id="ga-b" style="top:900px;font-size:70px;border-color:#9fd0ff;box-shadow:0 0 40px rgba(159,208,255,.5)"><span class="emo">🔐</span><span class="txt">LO ENCIERRAS AQUÍ</span></div>
    <div class="decide-pie" id="ga-pie" style="top:1260px">LOS COMENTARIOS ELIGIERON</div>`,
  camara: { claves: [[0, 1.0, 0, 0], [FIN('gano'), 1.08, 0, -30]], origen: '540px 1030px' },
  update(lt, dur, t) {
    pop($('#ga-tit'), t, 0.02, 0.25);
    pop($('#ga-b'), t, 0.1, 0.3);
    $('#ga-b').style.transform += ` scale(${1 + 0.035 * Math.sin(t * 8)})`;
    $('#ga-a').style.opacity = 0.35;
    $('#ga-pie').style.opacity = clamp((t - M.candado - 0.3) / 0.3);
  },
};

// ---------- 2. Lo encierras en la sala de control. Memo golpea el vidrio. Pero tiene la tarjeta ----------
ESCENAS.encierras = {
  html: lienzo(`<defs><clipPath id="en-hueco"><rect x="300" y="410" width="480" height="1050"/></clipPath></defs>
    <rect width="1080" height="1920" fill="#23262c"/>
    <g filter="url(#ink)"><rect x="-20" y="1460" width="1120" height="520" fill="#14171c"/>
      <rect x="300" y="410" width="480" height="1050" fill="#0b1118"/>
      <rect x="330" y="250" width="420" height="100" rx="8" fill="#efe6cf" stroke="${INK}" stroke-width="6"/>
      <text x="540" y="318" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="44" fill="${INK}">SALA DE CONTROL</text>
      <rect x="810" y="880" width="70" height="110" rx="10" fill="#2a2d33" stroke="${INK}" stroke-width="6"/></g>
    <circle cx="540" cy="700" r="330" fill="#3fb8a8" opacity=".08"/>
    <g id="en-memo"></g>
    <g clip-path="url(#en-hueco)"><g id="en-puerta"></g></g>
    <rect x="300" y="410" width="480" height="1050" fill="none" stroke="${INK}" stroke-width="14" filter="url(#ink)"/>
    <circle id="en-led" cx="845" cy="915" r="15" fill="${ROJO}"/>
    <g id="en-tu"></g>${viñeta}`),
  fijo: `<div class="onomato" id="en-pam" style="top:560px;left:770px;font-size:120px;opacity:0;transform:rotate(-6deg)">¡PAM!</div>`,
  camara: { claves: [[INI.encierras, 1.0, 0, 0], [M.pero, 1.05, 0, 0], foco(M.tarjeta + 0.3, 1.55, 580, 740), foco(FIN('encierras'), 1.62, 580, 730)] },
  update(lt, dur, t) {
    const cierra = Math.pow(clamp((t - INI.encierras) / (PORTAZO - INI.encierras)), 3);
    const k = golpeDesde(t, GOLPES), pega = k < 0.14;
    const tiembla = pega ? Math.sin(t * 120) * 7 : 0;
    const blanco = t > M.vidrio && Math.sin(t * 9) > 0.8;
    const sube = clamp((t - M.tarjeta + 0.25) / 0.35);
    const manoY = t > M.golpea - 0.2 && t < M.tarjeta - 0.3 ? (pega ? 0 : -40) : 120;
    $('#en-memo').innerHTML = memoDe(540, 1100, 75, { look: 8, lookY: 2, gris: 1, eyeFill: blanco ? '#f2f2f2' : undefined,
      armL: [[455, 830 + manoY * 0.5], [430, 650 + manoY]], armR: [[630, 830], [lerp(655, 660, sube), lerp(650 + manoY, 830, sube)]] }) +
      (sube > 0 ? tarjeta(675, lerp(900, 790, ease.outCubic(sube)), 1.5, -8) : '');
    const dx = lerp(-480, 0, cierra) + tiembla;
    $('#en-puerta').innerHTML = `<g transform="translate(${dx} 0)" filter="url(#ink)">
      <path d="M300 410 H780 V1460 H300 Z M390 530 V900 H690 V530 Z" fill="#5a6070" fill-rule="evenodd" stroke="${INK}" stroke-width="10"/>
      <rect x="390" y="530" width="300" height="370" fill="#9fb3c8" opacity=".16"/>
      <path d="M420 560 L470 520 M440 640 L560 540 M600 880 L680 800" stroke="#fff" stroke-width="7" opacity=".35"/>
      ${pega ? `<circle cx="430" cy="650" r="34" fill="#fff" opacity=".18"/><circle cx="655" cy="650" r="34" fill="#fff" opacity=".18"/>` : ''}
      <rect x="720" y="900" width="22" height="200" rx="8" fill="#c9ccd2" stroke="${INK}" stroke-width="5"/></g>`;
    $('#en-led').setAttribute('opacity', t > M.tarjeta && Math.sin(t * 10) > 0 ? 0.35 : 1);
    $('#en-tu').innerHTML = tuDe(905, 1540, 62, { look: -12, lookY: -4, eyeScale: t > M.tarjeta ? 1.3 : 1,
      armL: [[860, 1310], [lerp(800, 860, cierra), lerp(1250, 1360, cierra)]], armR: [[950, 1310], [985, 1380]] }) +
      chispa(985, 1335, 0.42, { g: 0.65 });
    const p = $('#en-pam'); p.style.opacity = t > PORTAZO && t < PORTAZO + 0.7 ? 1 : 0;
    sacude('encierras', t, PORTAZO, 0.35, 16);
    if (pega) sacude('encierras', t, t - k, 0.14, 6);
  },
};

// ---------- 3. Subes a la azotea con Chispa. Viento. La antena ----------
ESCENAS.azotea = {
  html: lienzo(azotea('az') + viñeta),
  camara: { claves: [[INI.azotea, 1.0, 0, 0], [M.antena - 0.2, 1.04, 0, 0], foco(M.antena + 0.4, 1.55, 640, 420), foco(FIN('azotea'), 1.62, 640, 380)] },
  update(lt, dur, t) {
    parpadea('az', t);
    const x = lerp(170, 380, ease.inOut(clamp((t - INI.azotea) / 2.4)));
    $('#az-cosas').innerHTML = tuDe(x, 1500, 60, { look: 8, lookY: -10, armL: [[x + 30, 1310], [x + 78, 1320]], armR: [[x + 54, 1296], [x + 90, 1302]] }) +
      chispa(x + 81, 1287, 0.39, { g: 0.65 });
    $('#az-viento').innerHTML = viento(t, t > M.vientoM - 0.1 ? 0.9 : 0.4);
  },
};

// ---------- 4. Y alguien te apunta con una llave de tuercas ----------
ESCENAS.apunta = {
  html: lienzo(`${fondoCerca(1230)}
    <g filter="url(#ink)"><path d="M900 1300 L1030 0 M1060 1300 L1130 0" stroke="#7d848e" stroke-width="22"/>
      <rect x="720" y="640" width="400" height="660" rx="10" fill="#b8bcc4" stroke="${INK}" stroke-width="10"/>
      ${[0, 1, 2, 3, 4].map(i => `<path d="M780 ${700 + i * 36} h150" stroke="#80838b" stroke-width="9"/>`).join('')}
      <path d="M960 950 l40 72 h-80 z" fill="#e5a83b" stroke="${INK}" stroke-width="7"/></g>
    <g id="ap-tu"></g><g id="ap-brazo"></g><g id="ap-viento"></g>${viñeta}`),
  camara: { claves: [[INI.apunta, 1.0, 0, 0], [M.apuntaM, 1.0, 0, 0], foco(M.tuercas, 1.35, 480, 1080), foco(FIN('apunta'), 1.42, 470, 1080)] },
  update(lt, dur, t) {
    const sale = ease.outBack(clamp((t - M.apuntaM + 0.25) / 0.4));
    const hx = lerp(760, 630, sale), hy = 1110 + Math.sin(t * 34) * 3;
    $('#ap-tu').innerHTML = tuDe(250, 1500, 82, { look: t > M.apuntaM ? 14 : 4, lookY: 2, eyeScale: t > M.apuntaM ? 1.35 : 1,
      armL: [[190, 1250], [170, 1330]], armR: [[310, 1250], [330, 1330]] }) + chispa(110, 1440, 0.55, { g: 0.65 });
    $('#ap-brazo').innerHTML = sale > 0 ? `<g filter="url(#ink)"><path d="M722 1090 L${hx} ${hy}" stroke="${INK}" stroke-width="44" stroke-linecap="round"/>
      <path d="M722 1090 L${hx} ${hy}" stroke="#2f6f6a" stroke-width="30" stroke-linecap="round"/></g>${llave(hx, hy, 0.82, -84 + Math.sin(t * 30) * 2)}
      ${punto(hx, hy, 18, INK)}` : '';
    $('#ap-viento').innerHTML = viento(t, 0.4);
  },
};

// ---------- 5. Evelin. Audífonos al cuello. Una consola en la mano. ¿Quién eres? ----------
ESCENAS.evelin = {
  html: lienzo(`${fondoCerca(1230)}
    <g filter="url(#ink)"><rect x="820" y="640" width="400" height="680" rx="10" fill="#b8bcc4" stroke="${INK}" stroke-width="10"/>
      ${[0, 1, 2, 3, 4].map(i => `<path d="M870 ${700 + i * 36} h150" stroke="#80838b" stroke-width="9"/>`).join('')}</g>
    <g id="ev-evelin"></g><g id="ev-viento"></g>${viñeta}`),
  fijo: `<div class="presenta" id="ev-pre" style="top:130px"><div class="nombre">EVELIN</div><div class="cargo">LA NIETA DE ROSA</div></div>`,
  camara: { claves: [[INI.evelin, 1.0, 0, 0], [M.cuello - 0.2, 1.0, 0, 0], foco(M.cuello + 0.2, 1.5, 600, 1130), foco(M.consola + 0.2, 1.5, 720, 1290),
    foco(M.quien, 1.3, 600, 1030), foco(FIN('evelin'), 1.36, 590, 1010)] },
  update(lt, dur, t) {
    const x = lerp(760, 630, ease.outCubic(clamp((t - INI.evelin) / 0.6)));
    const r = 100, temb = Math.sin(t * 30) * 2;
    $('#ev-evelin').innerHTML = evelinDe(x, 1530, r, { look: -16, lookY: 0, eyeScale: t > M.quien ? 0.85 : 1,
      armL: [[x - 110, 1170], [x - 200, 1130]], armR: [[x + 80, 1240], [x + 60, 1300]] }) +
      llave(x - 200, 1130, 0.9, -86 + temb) + punto(x - 200, 1130, 15, INK) + consola(x + 70, 1310, 0.95, 8);
    pop($('#ev-pre'), t, INI.evelin + 0.1, 0.35);
    $('#ev-viento').innerHTML = viento(t, 0.4);
  },
};

// ---------- 6. Chispa la huele. Mueve la cola. Huele a la casa de Rosa ----------
ESCENAS.huele = {
  html: lienzo(`<defs><clipPath id="hu-clip"><circle cx="540" cy="560" r="290"/></clipPath></defs>
    ${fondoCerca(1060)}
    <g id="hu-cosas"></g>
    <g id="hu-recuerdo" opacity="0">
      <circle cx="590" cy="935" r="26" fill="#fff6e6" stroke="${INK}" stroke-width="6"/><circle cx="620" cy="1030" r="17" fill="#fff6e6" stroke="${INK}" stroke-width="5"/><circle cx="635" cy="1100" r="10" fill="#fff6e6" stroke="${INK}" stroke-width="4"/>
      <g clip-path="url(#hu-clip)"><rect x="200" y="200" width="700" height="700" fill="#5a3a26"/><circle cx="540" cy="560" r="300" fill="url(#luzCalida)"/>
        <g filter="url(#ink)"><rect x="700" y="560" width="26" height="70" fill="#f4ecd8" stroke="${INK}" stroke-width="5"/><path d="M713 560 q-12 -24 0 -40 q12 16 0 40" fill="#f3c46a"/></g>
        <g filter="url(#contorno)">${rosaDe(520, 520, 105, { look: 6, lookY: 6 })}</g></g>
      <circle cx="540" cy="560" r="290" fill="none" stroke="#fff6e6" stroke-width="14"/><circle cx="540" cy="560" r="290" fill="none" stroke="${INK}" stroke-width="6"/></g>
    <g id="hu-viento"></g>${viñeta}`),
  camara: { claves: [[INI.huele, 1.0, 0, 0], foco(M.cola, 1.25, 600, 1300), foco(M.huele2 - 0.1, 1.0, 540, 960), [FIN('huele'), 1.04, 0, 0]] },
  update(lt, dur, t) {
    const olfatea = t < M.cola + 0.2 ? Math.sin(t * 16) * 6 : 0, contenta = t > M.cola - 0.1;
    $('#hu-cosas').innerHTML = tuDe(160, 1560, 80, { look: 12, lookY: 6 }) +
      evelinDe(800, 1560, 90, { look: -14, lookY: 12, armL: [[720, 1230], [680, 1180]], armR: [[870, 1260], [860, 1330]] }) +
      llave(680, 1180, 0.8, -60) + punto(680, 1180, 14, INK) +
      chispa(540 + olfatea, 1460, 1.15, { g: 0.65, modo: contenta ? 'contenta' : 'parada', cola: contenta ? Math.sin(t * 20) * 22 : 0 }) +
      (t < M.cola + 0.3 ? `<path d="M${745 + olfatea} 1395 q14 -10 0 -22 M${762 + olfatea} 1405 q18 -14 0 -32" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" opacity="${Math.sin(t * 16) > 0 ? 0.9 : 0.3}"/>` : '');
    $('#hu-recuerdo').setAttribute('opacity', clamp((t - M.huele2 + 0.1) / 0.35));
    $('#hu-viento').innerHTML = viento(t, 0.35);
  },
};

// ---------- 7. Evelin baja la llave. Te mandó mi abuela ----------
ESCENAS.baja = {
  html: lienzo(`${fondoCerca(1000)}<g filter="url(#ink)"><path d="M880 1080 L1040 0 M1060 1080 L1160 0" stroke="#7d848e" stroke-width="22"/></g>
    <g id="ba-cosas"></g><g id="ba-viento"></g>${viñeta}`),
  camara: { claves: [[INI.baja, 1.0, 0, 0], [FIN('baja'), 1.1, 0, 40]] },
  update(lt, dur, t) {
    const b = ease.inOut(clamp((t - M.bajaM) / 0.7)), x = 640;
    const mira = t > M.mando - 0.1;
    $('#ba-cosas').innerHTML = evelinDe(x, 1820, 125, { look: mira ? -18 : lerp(-16, -10, b), lookY: mira ? 0 : lerp(0, 16, b),
      armL: [[lerp(x - 140, x - 100, b), lerp(1270, 1380, b)], [lerp(x - 260, x - 130, b), lerp(1230, 1520, b)]], armR: [[x + 100, 1380], [x + 120, 1510]] }) +
      llave(lerp(x - 260, x - 130, b), lerp(1230, 1520, b), 1.0, lerp(-86, -178, b)) + punto(lerp(x - 260, x - 130, b), lerp(1230, 1520, b), 18, INK) +
      chispa(250, 1470, 0.95, { g: 0.65, modo: 'contenta', cola: Math.sin(t * 20) * 22 });
    $('#ba-viento').innerHTML = viento(t, 0.35);
  },
};

// ---------- 8. El viento sopla fuerte. Chispa voltea hacia el ruido ----------
const PAPELES = (() => { const r = rng(9), g = []; for (let i = 0; i < 7; i++) g.push({ y: 500 + r() * 1000, v: 0.8 + r() * 0.7, o: r(), g: r() * 6 }); return g; })();
ESCENAS.viento = {
  html: lienzo(azotea('vi') + `<g id="vi-papeles"></g>` + viñeta),
  camara: { claves: [[INI.viento, 1.0, 0, 0], [M.voltea - 0.2, 1.0, 0, 0], foco(M.voltea + 0.3, 1.9, 560, 1430), foco(FIN('viento'), 2.05, 560, 1420)] },
  update(lt, dur, t) {
    parpadea('vi', t);
    const f = t > RAFAGA ? lerp(0.4, 1.6, clamp((t - RAFAGA) / 0.6)) : 0.4;
    const voltea = t > M.voltea + 0.1;
    $('#vi-cosas').innerHTML = tuDe(330, 1520, 62, { look: 8, lookY: 6 }) +
      evelinDe(800, 1520, 62, { look: -10, lookY: 6, armL: [[745, 1330], [735, 1385]] }) + llave(735, 1385, 0.5, 178) +
      chispa(560, 1470, 0.62, { g: 0.7, voltea, modo: voltea ? 'parada' : 'contenta', cola: voltea ? 0 : Math.sin(t * 20) * 22 });
    $('#vi-viento').innerHTML = viento(t, f);
    $('#vi-papeles').innerHTML = t > RAFAGA ? PAPELES.map(p => { const x = ((t - RAFAGA) * p.v * 900 + p.o * 400) % 1500 - 200;
      return `<rect x="${x}" y="${p.y + Math.sin(t * 3 + p.g) * 60}" width="70" height="90" fill="#f4f1e8" stroke="${INK}" stroke-width="4" transform="rotate(${t * 200 + p.g * 60} ${x + 35} ${p.y})"/>`; }).join('') : '';
    if (t > RAFAGA) $('#esc-viento .cam').style.transform += ` translate(${Math.sin(t * 40) * 3}px, 0)`;
  },
};

// ---------- 9. Los ojos blancos ----------
ESCENAS.ojos = {
  html: lienzo(`<rect width="1080" height="1920" fill="#2b1d1f"/><circle cx="540" cy="900" r="800" fill="${ROJO}" opacity=".12"/><g id="oj-cara"></g><g id="oj-viento"></g>${viñeta}`),
  camara: { claves: [[INI.ojos, 1.0, 0, 0], [FIN('ojos'), 1.12, 0, 60]] },
  update(lt, dur, t) {
    const p = clamp((t - M.ojosM - 0.1) / 0.35);
    $('#oj-cara').innerHTML = `<g filter="url(#ink)" transform="translate(${540 + Math.sin(t * 45) * 4} 880) scale(1.02)">${caraChispa({ sinCinta: true, ceno: p > 0.3, orejasAtras: p > 0.5 })}${ojosBlancos(p)}</g>`;
    $('#oj-viento').innerHTML = viento(t, 1.2);
  },
};

// ---------- 10. Te tira una mordida ----------
ESCENAS.mordida = {
  html: lienzo(`<rect width="1080" height="1920" fill="#2b1d1f"/><g id="mo-cara"></g><g id="mo-mano"></g><rect id="mo-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${viñeta}`),
  fijo: `<div class="onomato" id="mo-clac" style="top:240px;left:330px;font-size:190px;opacity:0;color:#fff;transform:rotate(-5deg)">¡CLAC!</div>`,
  camara: { claves: [[INI.mordida, 1.0, 0, 0], [FIN('mordida'), 1.08, 0, 0]] },
  update(lt, dur, t) {
    const abre = clamp((t - INI.mordida) / 0.5), salta = t > CLAC ? Math.exp(-(t - CLAC) * 5) : clamp((t - CLAC + 0.15) / 0.15);
    const boca = t > CLAC && t < CLAC + 0.12 ? 0.1 : lerp(0.3, 1, abre);
    $('#mo-cara').innerHTML = `<g filter="url(#ink)" transform="translate(540 ${900 + salta * 80}) scale(${1 + salta * 0.45})">${caraChispa({ sinCinta: true, ceno: true, orejasAtras: true, boca })}${ojosBlancos(1)}</g>`;
    const quita = clamp((t - CLAC + 0.05) / 0.2), mx = lerp(760, 1080, quita), my = lerp(1250, 1500, quita);
    $('#mo-mano').innerHTML = `<g filter="url(#ink)"><path d="M1200 1700 L${mx} ${my}" stroke="${INK}" stroke-width="40" stroke-linecap="round"/>${punto(mx, my, 46, INK)}</g>`;
    $('#mo-rojo').setAttribute('opacity', t > CLAC && t < CLAC + 0.4 ? 0.45 * (1 - (t - CLAC) / 0.4) : 0);
    $('#mo-clac').style.opacity = t > CLAC && t < CLAC + 0.9 ? 1 : 0;
    sacude('mordida', t, CLAC, 0.4, 18);
  },
};

// ---------- 11. Evelin se quita los audífonos y se los pone a Chispa ----------
ESCENAS.audifonos = {
  html: lienzo(`<g id="au-a">${fondoCerca(1050)}<g id="au-evelin"></g></g>
    <g id="au-b" style="display:none"><rect width="1080" height="1920" fill="#2b1d1f"/><g id="au-cara"></g></g>${viñeta}`),
  camara: { claves: [foco(INI.audifonos, 1.2, 520, 1250), foco(M.pone - 0.15, 1.3, 480, 1270), [M.pone - 0.1, 1.0, 0, 0], [FIN('audifonos'), 1.06, 0, 0]] },
  update(lt, dur, t) {
    const cerca = t > M.pone - 0.1;
    $('#au-a').style.display = cerca ? 'none' : '';
    $('#au-b').style.display = cerca ? '' : 'none';
    if (!cerca) {
      const q = ease.inOut(clamp((t - M.quita) / 0.8)), x = 700, r = 115, pie = 1720;
      const ax = lerp(x, x - 210, q), ay = lerp(pie - r * 5.3 + r * 1.2, pie - r * 3.0, q);
      $('#au-evelin').innerHTML = evelinDe(x, pie, r, { audifonos: 'no', look: -16, lookY: 10, brazosAlFrente: true,
        armL: [[x - 100, pie - r * 3.0], [ax - 62, ay + 30]], armR: [[x + 90, pie - r * 2.9], [ax + 62, ay + 30]] }) +
        audifonosSueltos(ax, ay - 20, 1.1) + chispa(250, 1440, 1.2, { g: 0.7, modo: 'gruñe', blancos: 1 });
      return;
    }
    const baja = ease.outCubic(clamp((t - M.pone + 0.1) / (PONE - M.pone + 0.1)));
    const calma = clamp((t - PONE - 0.2) / 0.9);
    const y = lerp(-900, 0, baja);
    $('#au-cara').innerHTML = `<g filter="url(#ink)" transform="translate(${540 + (calma < 1 ? Math.sin(t * 45) * 4 * (1 - calma) : 0)} 900)">
      ${caraChispa({ sinCinta: true, ceno: true, orejasAtras: true, boca: lerp(0.6, 0, calma) })}${ojosBlancos(1)}
      <g transform="translate(0 ${y})">${audifonosCara}${baja < 1 ? `<path d="M-320 160 L-470 600 M320 160 L470 600" stroke="#2f6f6a" stroke-width="56" stroke-linecap="round"/>${punto(-320, 140, 40, INK)}${punto(320, 140, 40, INK)}` : ''}</g></g>`;
  },
};

// ---------- 12. Silencio. Chispa vuelve a ser Chispa ----------
ESCENAS.silencio = {
  html: lienzo(`<rect id="si-fondo" width="1080" height="1920" fill="#2b1d1f"/><circle cx="540" cy="900" r="760" fill="#9fb3c8" opacity=".1"/><g id="si-cara"></g><g id="si-mano"></g>${viñeta}`),
  camara: { claves: [[INI.silencio, 1.14, 0, 0], [FIN('silencio'), 1.0, 0, 0]], origen: '540px 900px' },
  update(lt, dur, t) {
    const vuelve = clamp((t - M.vuelve + 0.2) / 0.6), orejas = t > M.silencioM + 0.5;
    const lame = t > M.vuelve + 0.3 && t < M.vuelve + 1.0 ? Math.sin((t - M.vuelve - 0.3) / 0.7 * Math.PI) * 0.45 : 0;
    $('#si-fondo').setAttribute('fill', vuelve > 0.5 ? '#1e2733' : '#2b1d1f');
    $('#si-cara').innerHTML = `<g filter="url(#ink)" transform="translate(540 900)">${caraChispa({ sinCinta: true, ceno: vuelve < 0.3, orejasAtras: !orejas, lengua: lame })}${ojosBlancos(1 - vuelve)}${audifonosCara}</g>`;
    const px = 690 + Math.sin(t * 2.5) * 30, py = 650 - Math.cos(t * 2.5) * 10;
    $('#si-mano').innerHTML = t > M.silencioM + 0.3 ? `<g filter="url(#ink)"><path d="M1150 300 L${px} ${py}" stroke="${INK}" stroke-width="66" stroke-linecap="round"/>
      <path d="M1150 300 L${px} ${py}" stroke="#2f6f6a" stroke-width="50" stroke-linecap="round"/>${punto(px, py + 10, 40, INK)}</g>` : '';
  },
};

// ---------- 13. Regla 5: a los mordidos los jala el ruido. Sin ruido, se calman ----------
const icAudifonos = ic(`<path d="M20 70 a40 44 0 0 1 80 0"/><rect x="10" y="60" width="24" height="40" rx="9"/><rect x="86" y="60" width="24" height="40" rx="9"/>`);
ESCENAS.regla = {
  html: hoja([
    { id: 'r5-tit', texto: 'REGLA 5', top: 300, size: 210, peso: 700, rot: -2 },
    { id: 'r5-a', texto: 'A los mordidos', top: 600, size: 124 },
    { id: 'r5-b', texto: 'los jala el ruido.', top: 740, size: 124 },
    { id: 'r5-c', texto: 'Sin ruido,', top: 920, size: 140, peso: 700, roja: true },
    { id: 'r5-d', texto: 'se calman.', top: 1060, size: 150, peso: 700, roja: true, rot: -3 },
  ], `<div id="r5-ic" style="position:absolute;top:1220px;left:640px;transform:scale(2.2) rotate(-6deg);transform-origin:0 0;opacity:0">${icAudifonos}</div>` +
    subrayado('r5-sub', 'M190 1250 q150 -18 300 4 t140 -8')),
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.05, x: 0, y: -10 } },
  update(lt, dur, t) {
    escribe($('#r5-tit'), t, INI.regla + 0.05, 0.6);
    escribe($('#r5-a'), t, M.mordidos, 0.7);
    escribe($('#r5-b'), t, M.jala - 0.1, 0.8);
    escribe($('#r5-c'), t, M.sinRuido, 0.5);
    escribe($('#r5-d'), t, M.calman - 0.1, 0.5);
    trazo($('#r5-sub'), t, M.calman + 0.5, 0.4);
    $('#r5-ic').style.opacity = clamp((t - M.calman - 0.6) / 0.3);
  },
};

// ---------- 14. Detrás del tinaco, un radio truena ----------
ESCENAS.radio = {
  html: lienzo(`${fondoCerca(1100)}${tinaco(700, 1500, 1.7)}<g id="ra-antena"></g><g id="ra-ondas"></g>${viñeta}`),
  fijo: `<div class="onomato" id="ra-ksh" style="top:420px;left:90px;font-size:130px;opacity:0;transform:rotate(-8deg)">KSSHH</div>`,
  camara: { claves: [[INI.radio, 1.0, 0, 0], [FIN('radio'), 1.15, 60, 20]] },
  update(lt, dur, t) {
    const on = t > TRUENA;
    $('#ra-antena').innerHTML = `<g filter="url(#ink)"><rect x="486" y="${on ? 830 : 900}" width="22" height="120" rx="9" fill="#1f2226" stroke="${INK}" stroke-width="5"/></g>`;
    $('#ra-ondas').innerHTML = on ? [0, 1, 2].map(k => { const f = ((t - TRUENA) * 2 + k / 3) % 1;
      return `<path d="M${470 - f * 260} ${700 - f * 120} l-30 40 l30 30 l-30 40" fill="none" stroke="#fff" stroke-width="10" opacity="${0.9 * (1 - f)}"/>`; }).join('') : '';
    $('#ra-ksh').style.opacity = on ? (Math.sin(t * 30) > -0.3 ? 1 : 0.5) : 0;
    $('#ra-ksh').style.transform = `rotate(-8deg) translate(${Math.sin(t * 60) * 5}px, 0)`;
  },
};

// ---------- 15. Tráenos a la operadora, dice una voz. Y te curamos ----------
const RADIO1 = [M.traenos - 0.05, M.diceVoz - 0.1], RADIO2 = [M.yTe - 0.05, M.esMemo - 0.15];
ESCENAS.voz = {
  html: lienzo(`<rect width="1080" height="1920" fill="#1b1e24"/><circle cx="540" cy="900" r="760" fill="#9fb3c8" opacity=".08"/>
    ${walkie(500, 760, 1.0, -6)}<circle id="vo-led" cx="560" cy="460" r="14" fill="${ROJO}"/><g id="vo-ondas"></g>
    <g filter="url(#ink)"><path d="M1150 1500 L790 1180" stroke="#050608" stroke-width="120" stroke-linecap="round"/><path d="M1150 1500 L790 1180" stroke="#9aa0a8" stroke-width="96" stroke-linecap="round"/>
      ${[0, 1, 2, 3].map(i => `<rect x="560" y="${880 + i * 70}" width="230" height="58" rx="28" fill="#9aa0a8" stroke="#050608" stroke-width="8"/>`).join('')}
      <rect x="610" y="640" width="70" height="180" rx="32" fill="#9aa0a8" stroke="#050608" stroke-width="8" transform="rotate(14 645 730)"/>
      <path d="M700 890 q30 60 -10 120 M720 990 q20 50 -20 90" stroke="#4a5059" stroke-width="7" fill="none"/>
      <g transform="translate(960 1360) rotate(40)"><rect x="-110" y="-46" width="220" height="92" rx="20" fill="#eee6d8" stroke="${INK}" stroke-width="8"/><circle cx="10" cy="0" r="30" fill="#8a1f1b" opacity=".85"/></g></g>${viñeta}`),
  camara: { claves: [[INI.voz, 1.0, 0, 0], [M.curamos, 1.08, 0, 30], [FIN('voz'), 1.2, 60, 140]] },
  update(lt, dur, t) {
    const habla = (t > RADIO1[0] && t < RADIO1[1]) || (t > RADIO2[0] && t < RADIO2[1]);
    $('#vo-led').setAttribute('opacity', habla && Math.sin(t * 14) > -0.2 ? 1 : 0.25);
    $('#vo-ondas').innerHTML = habla ? [0, 1, 2].map(k => { const f = ((t * 2.4) + k / 3) % 1;
      return `<path d="M${200 - f * 120} ${560 - f * 40} q-60 100 0 200" fill="none" stroke="#fff" stroke-width="9" opacity="${0.8 * (1 - f)}"/>`; }).join('') : '';
  },
};

// ---------- 16. Es Memo. Ya salió. Y nadie lo vio más que tú ----------
ESCENAS.memo = {
  html: lienzo(`${fondoCerca(1100)}<g id="me-memo"></g>${tinaco(780, 1430, 1.25)}<g id="me-dedo"></g><g id="me-evelin"></g>${viñeta}`),
  camara: { claves: [[INI.memo, 1.0, 0, 0], [M.salio, 1.0, 0, 0], foco(M.nadie + 0.2, 1.55, 610, 1010), foco(M.masQueTu + 0.2, 1.95, 600, 1000), foco(FIN('memo'), 2.0, 600, 995)] },
  update(lt, dur, t) {
    const asoma = ease.outCubic(clamp((t - INI.memo) / 0.6)), cx = lerp(700, 605, asoma), cy = 990, r = 80;
    const blanco = Math.sin(t * 7) > 0.88;
    const mira = t > M.nadie;
    $('#me-memo').innerHTML = `<g filter="url(#contorno)">${memo({ head: [cx, cy], r, neck: [cx + 10, cy + r * 1.1], hip: [cx + 20, cy + r * 3.3],
      look: mira ? 0 : -14, lookY: mira ? 0 : 6, eyeFill: blanco ? '#f2f2f2' : undefined, sinBrillo: blanco })}${venas(cx, cy, r, 1)}${quijada(cx, cy, r)}</g>` +
      walkie(cx - 125, cy + 40, 0.22, -10) +
      `<g filter="url(#ink)">${linea([[cx - 60, cy + 200], [cx - 120, cy + 110]], r * 0.17, '#050608')}${linea([[cx - 60, cy + 200], [cx - 120, cy + 110]], r * 0.09, '#9aa0a8')}${punto(cx - 122, cy + 108, r * 0.15, '#9aa0a8')}</g>`;
    const dedo = clamp((t - M.masQueTu + 0.15) / 0.3);
    const dy = lerp(110, 0, ease.outCubic(dedo));
    $('#me-dedo').innerHTML = dedo > 0 ? `<g filter="url(#ink)" opacity="${dedo}">${linea([[cx - 70, cy + 260], [cx - 14, cy + 112 + dy]], r * 0.085)}
      ${punto(cx - 12, cy + 104 + dy, r * 0.15)}${linea([[cx - 10, cy + 100 + dy], [cx - 10, cy + 8 + dy]], r * 0.075)}</g>` : '';
    // Evelin y Chispa, de espaldas al tinaco
    $('#me-evelin').innerHTML = `<g filter="url(#contorno)">${evelin({ head: [300, 1215], r: 80, neck: [304, 1299], hip: [310, 1470],
      legL: [[250, 1440], [255, 1555]], legR: [[365, 1450], [360, 1555]], footL: -1, footR: 1, armL: [[245, 1380], [195, 1445]], armR: [[340, 1390], [235, 1455]],
      brazosAlFrente: true, audifonos: 'no', look: -16, lookY: 16 })}</g>` + chispa(130, 1530, 0.62, { g: 0.7, modo: 'contenta', cola: Math.sin(t * 6) * 10, audifonos: true });
  },
};

// ---------- 17. ¿Le cuentas a Evelin, o te lo callas? ----------
ESCENAS.decide = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="960" r="900" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="de-tit">¿QUÉ HACES?</div>
    <div class="opcion" id="de-a" style="top:560px;font-size:66px"><span class="emo">🗣️</span><span class="txt">LE CUENTAS A EVELIN</span></div>
    <div class="opcion" id="de-b" style="top:900px;font-size:70px"><span class="emo">🤐</span><span class="txt">TE LO CALLAS</span></div>
    <div class="decide-com" id="de-com">COMENTA <span class="emo">🗣️</span> O <span class="emo">🤐</span></div>
    <div class="decide-pie" id="de-pie">GANA LO QUE MÁS COMENTEN</div>`,
  update(lt, dur, t) {
    pop($('#de-tit'), t, INI.decide);
    pop($('#de-a'), t, M.cuentas - 0.1);
    pop($('#de-b'), t, M.callas - 0.1);
    pop($('#de-com'), t, M.comenta - 0.1);
    $('#de-pie').style.opacity = clamp((t - M.comenta - 0.6) / 0.3);
    const a = t >= M.cuentas - 0.1 && t < M.callas - 0.1, b = t >= M.callas - 0.1 && t < M.comenta - 0.1;
    $('#de-a').style.borderColor = a ? '#e5a83b' : '#fff';
    $('#de-b').style.borderColor = b ? '#9fd0ff' : '#fff';
    if (a) $('#de-a').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
    if (b) $('#de-b').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
  },
};
