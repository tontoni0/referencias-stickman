// Escenas de "La alerta", temporada 2, parte 6: El centro de alerta. Ganó 🤫 en los comentarios de la parte 5:
// no te mueves. Te huelen y uno le muerde a Chispa la pata trasera. Huyes al centro de alerta; el registro de la
// primera noche; Memo llega gris hasta el cuello: "Ya somos dos". Decisión: 🤝 lo dejas venir o 🔐 lo encierras aquí.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const MORDIDA = M.muerdeM + 0.15;      // le muerden la pata a Chispa
const LUZ = M.luz - 0.05;              // sales a la luz
const BIP = M.tarjeta + 0.5;           // la tarjeta de Memo abre la puerta

const PISO = 1400;
const pop = (el, t, t0, d = 0.3) => { const p = clamp((t - t0) / d); el.style.opacity = p; el.style.transform = `scale(${lerp(0.7, 1, ease.outBack(p))})`; };
// Cámara que pone el punto (qx, qy) en el centro a escala s, sin salirse del cuadro.
const foco = (t, s, qx, qy) => [t, s, clamp(-s * (qx - 540), -(s - 1) * 540, (s - 1) * 540), clamp(-s * (qy - 960), -(s - 1) * 960, (s - 1) * 960)];
const golpeDesde = (t, lista) => { const u = lista.filter(g => g <= t).pop(); return u === undefined ? 9 : t - u; };



const rosaDe = (x, y, r, o = {}) => rosa({ head: [x, y], r, neck: [x + 4, y + r * 1.05], hip: [x + 10, y + r * 3.4],
  legL: [[x - 10, y + r * 4.4], [x - 20, y + r * 5.4]], legR: [[x + 30, y + r * 4.4], [x + 40, y + r * 5.4]], footL: -1, footR: 1,
  armL: o.armL || [[x - r * 0.9, y + r * 2.2], [x - r * 1.0, y + r * 3.0]], armR: o.armR || [[x + r * 0.9, y + r * 2.2], [x + r * 1.0, y + r * 3.0]],
  brazosAlFrente: true, look: o.look || 0, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1 });
// Tú, de pie, pies en (x, y).
const tuDe = (x, y, r, o = {}) => `<g filter="url(#contorno)">${stick({ head: [x, y - r * 5.3], r, neck: [x, y - r * 4.2], hip: [x, y - r * 1.9],
  legL: [[x - r * 0.3, y - r * 0.95], [x - r * 0.38, y]], legR: [[x + r * 0.3, y - r * 0.95], [x + r * 0.38, y]], footL: -1, footR: 1,
  armL: o.armL || [[x - r * 0.75, y - r * 3.1], [x - r * 0.8, y - r * 2.2]], armR: o.armR || [[x + r * 0.75, y - r * 3.1], [x + r * 0.85, y - r * 2.2]],
  look: o.look || 0, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1 })}</g>`;

// Tú corriendo de lado, pies en (x, y), hacia la derecha.
function tuCorre(x, y, r, fase) {
  const p = Math.sin(fase), q = Math.cos(fase), lean = r * 0.35;
  return `<g filter="url(#contorno)">${stick({ head: [x + lean, y - r * 5.1], r, neck: [x + lean * 0.8, y - r * 4.0], hip: [x, y - r * 1.9],
    legL: [[x + r * 0.5 * p, y - r * 0.95], [x + r * 0.9 * p - r * 0.1, y - Math.max(0, q) * r * 0.3]],
    legR: [[x - r * 0.5 * p, y - r * 0.95], [x - r * 0.9 * p - r * 0.1, y - Math.max(0, -q) * r * 0.3]], footL: 1, footR: 1,
    armL: [[x + lean - r * 0.6 * p, y - r * 3.1], [x + lean - r * 0.9 * p + r * 0.3, y - r * 2.6]],
    armR: [[x + lean + r * 0.6 * p, y - r * 3.1], [x + lean + r * 0.9 * p + r * 0.3, y - r * 2.6]], look: r * 0.12, lookY: 0 })}</g>`;
}
// Chispa corriendo chiquita (rebota).
const chispaCorre = (x, y, s, t) => `<g filter="url(#ink)" transform="translate(${x} ${y - Math.abs(Math.sin(t * 12)) * 14 * s}) scale(${s})">${perro('parada')}</g>`;


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
// Memo de pie, pies en (x, y). o.manoR: hacia dónde va su mano mordida. o.gris: venas en el cuello (0 a 1).
function memoDe(x, y, r, o = {}) {
  const head = [x + (o.dx || 0), y - r * 5.3], neck = [x, y - r * 4.2], hip = [x, y - r * 1.9];
  const sh = [neck[0], neck[1] + r * 0.4];
  const armL = o.armL || [[x - r * 0.75, y - r * 3.1], [x - r * 0.8, y - r * 2.2]];
  const armR = o.armR || [[x + r * 0.75, y - r * 3.1], [x + r * 0.85, y - r * 2.2]];
  return `<g filter="url(#contorno)">${memo({ head, r, neck, hip,
    legL: [[x - r * 0.3, y - r * 0.95], [x - r * 0.38, y]], legR: [[x + r * 0.3, y - r * 0.95], [x + r * 0.38, y]], footL: -1, footR: 1,
    armL, look: o.look || 0, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1, eyeFill: o.eyeFill, sinBrillo: !!o.eyeFill })}
    ${venas(head[0], head[1], r, o.gris || 0)}${brazoMordido(sh, armR[0], armR[1], r)}</g>`;
}

// Oscuridad con la luz del celular: un degradado radial que se mueve con la luz.
const oscuro = pre => `<defs><radialGradient id="${pre}-luz" gradientUnits="userSpaceOnUse" cx="540" cy="960" r="400">
    <stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".55" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity=".96"/></radialGradient></defs>
  <rect id="${pre}-negro" x="-400" y="-400" width="1880" height="2720" fill="url(#${pre}-luz)"/>`;
const luz = (pre, x, y, r) => { const g = $(`#${pre}-luz`); g.setAttribute('cx', x); g.setAttribute('cy', y); g.setAttribute('r', r); };
// Tú cargando a Chispa, pies en (x, y).
const tuConChispa = (x, y, r, t, o = {}) => tuDe(x, y, r, { look: o.look ?? 10, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1,
  armL: [[x + r * 0.5, y - r * 3.2], [x + r * 1.3, y - r * 3.0]], armR: [[x + r * 0.9, y - r * 3.4], [x + r * 1.5, y - r * 3.3]] }) +
  `<g filter="url(#ink)" transform="translate(${x + r * 1.35 + (o.tiembla ? Math.sin(t * 50) * 2 : 0)} ${y - r * 3.55}) scale(${r * 0.0065})">${perro('parada')}</g>`;
// El celular prendido en la mano (solo la pantalla).
const celu = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="70" fill="#9fd0ff" opacity=".25" filter="url(#blur10)"/>
  <rect x="-18" y="-30" width="36" height="60" rx="6" fill="#1b1e24" stroke="${INK}" stroke-width="4"/><rect x="-13" y="-24" width="26" height="46" rx="3" fill="#9fd0ff"/></g>`;
// El túnel de lado: bóveda, vías y durmientes.
function tunelLado(desde = 0) {
  let durm = '';
  for (let x = -40 - (desde % 90); x < 1120; x += 90) durm += `<rect x="${x}" y="1420" width="44" height="18" fill="#3a3129"/>`;
  return `<rect width="1080" height="1920" fill="#14171c"/>
    <g filter="url(#ink)">
      <path d="M-20 700 Q540 380 1100 700 L1100 1440 L-20 1440 Z" fill="#1d2129" stroke="${INK}" stroke-width="8"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${-20 + i * 230 - (desde % 230)} 600 L${-20 + i * 230 - (desde % 230)} 1440" stroke="#262b34" stroke-width="10"/>`).join('')}
      <rect x="-20" y="1440" width="1120" height="520" fill="#2a2520"/>${durm}
      <path d="M-20 1412 L1100 1412 M-20 1432 L1100 1432" stroke="#8a919b" stroke-width="7"/>
    </g>`;
}
// El andén: cientos de infectados quietos, en filas que se alejan.
const ANDEN = (() => { const r = rng(55), g = []; for (let f = 0; f < 9; f++) for (let i = 0; i < 9 + f * 2; i++) g.push({ f, x: (i + 0.5) / (9 + f * 2) * 1240 - 80 + (r() - 0.5) * 50, y: 1150 - f * 70 + (r() - 0.5) * 18, h: 330 * Math.pow(0.86, f), l: (r() - 0.5) * 0.03 }); return g.sort((a, b) => a.y - b.y); })();
const andenGente = t => ANDEN.map((p, i) => `<g transform="translate(${p.x + Math.sin(t * 1.3 + i) * 2} ${p.y}) scale(${p.h})">${infectadoQuieto(0, p.l, -0.035)}</g>`).join('');


// Chispa con la pata trasera mordida: gris con venas y dos marcas. g: qué tan arriba llega el gris (0 a 1).
function perroMordido(modo = 'parada', g = 1, marcas = true) {
  const k = clamp(g);
  const y0 = lerp(80, 10, k);
  return perro(modo) + linea([[-60, 30], [-70, 115]], 22, '#050608') + linea([[lerp(-68, -60, k), y0], [-70, 115]], 12, '#9aa0a8') +
    (k > 0.4 ? `<path d="M-62 ${y0} q-14 -10 -24 -26 M-60 ${y0 + 8} q10 -12 22 -18" stroke="#4a5059" stroke-width="5" fill="none" stroke-linecap="round"/>` : '') +
    (marcas ? `<circle cx="-66" cy="74" r="5" fill="#8a1f1b"/><circle cx="-62" cy="88" r="5" fill="#8a1f1b"/>` : '');
}
const tuConChispaG = (x, y, r, t, o = {}) => tuDe(x, y, r, { look: o.look ?? 10, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1,
  armL: [[x + r * 0.5, y - r * 3.2], [x + r * 1.3, y - r * 3.0]], armR: [[x + r * 0.9, y - r * 3.4], [x + r * 1.5, y - r * 3.3]] }) +
  `<g filter="url(#ink)" transform="translate(${x + r * 1.35 + (o.tiembla ? Math.sin(t * 50) * 2 : 0)} ${y - r * 3.55}) scale(${r * 0.0065})">${o.mordida === false ? perro('parada') : perroMordido('parada', o.g ?? 1)}</g>`;
// La tarjeta de acceso de Memo.
const tarjeta = (x, y, s = 1, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})" filter="url(#ink)">
  <rect x="-40" y="-26" width="80" height="52" rx="6" fill="#efe6cf" stroke="${INK}" stroke-width="5"/><rect x="-32" y="-16" width="24" height="28" fill="#9aa3ad"/>
  <rect x="-2" y="-14" width="34" height="6" fill="#6b7280"/><rect x="-2" y="-2" width="26" height="6" fill="#6b7280"/><rect x="-40" y="10" width="80" height="10" fill="${ROJO}"/></g>`;
// La sala de control abandonada.
const ZONAS = (() => { const r = rng(22), z = []; for (let f = 0; f < 6; f++) for (let c = 0; c < 7; c++) z.push({ x: 170 + c * 108 + (r() - 0.5) * 16, y: 300 + f * 86 + (r() - 0.5) * 12, w: 90 + r() * 14, h: 70 + r() * 10 }); return z; })();
function salaVacia(pre, pantalla = true) {
  return `<rect width="1080" height="1920" fill="#0a0e15"/>
    <g filter="url(#ink)">
      <rect x="120" y="240" width="880" height="560" rx="14" fill="#0b1118" stroke="#2c3a48" stroke-width="10"/>
      ${ZONAS.map(z => `<rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="8" fill="#111a22" stroke="#1f2b35" stroke-width="4"/>`).join('')}
      ${[0, 1, 2].map(i => `<rect x="${110 + i * 300}" y="880" width="260" height="190" rx="10" fill="${pantalla && i === 1 ? '#0e2a26' : '#0b1118'}" stroke="#2c3a48" stroke-width="8"/>`).join('')}
      <rect x="-20" y="1140" width="1120" height="60" fill="#3a3e46" stroke="${INK}" stroke-width="8"/>
      <rect x="-20" y="1200" width="1120" height="760" fill="#14171c"/>
      <path d="M150 1450 L260 1380 L300 1420 L190 1490 Z M820 1500 L940 1470 L950 1520 L830 1550 Z" fill="#e9e2d6" opacity=".7"/>
      <path d="M640 1420 l60 -90 l40 20 l-30 60 z" fill="#2a2d33" stroke="${INK}" stroke-width="6"/><circle cx="700" cy="1440" r="18" fill="#2a2d33" stroke="${INK}" stroke-width="5"/>
    </g>
    ${pantalla ? `<circle cx="540" cy="975" r="260" fill="#3fb8a8" opacity=".14"/><g id="${pre}-txt"></g>` : ''}`;
}

// ---------- 1. Ganó no moverte ----------
ESCENAS.gano = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="1040" r="800" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="ga-tit">GANÓ</div>
    <div class="opcion" id="ga-a" style="top:560px;font-size:66px"><span class="emo">🏃</span><span class="txt" style="text-decoration:line-through;text-decoration-color:#e0312b;text-decoration-thickness:10px">CORRES POR EL TÚNEL</span></div>
    <div class="opcion" id="ga-b" style="top:900px;font-size:70px;border-color:#9fd0ff;box-shadow:0 0 40px rgba(159,208,255,.5)"><span class="emo">🤫</span><span class="txt">NO TE MUEVES</span></div>
    <div class="decide-pie" id="ga-pie" style="top:1260px">LOS COMENTARIOS ELIGIERON</div>`,
  camara: { claves: [[0, 1.0, 0, 0], [M.piedra, 1.0, 0, 0], [FIN('gano'), 1.12, 0, -50]], origen: '540px 1030px' },
  update(lt, dur, t) {
    pop($('#ga-tit'), t, 0.02, 0.25);
    pop($('#ga-b'), t, 0.1, 0.3);
    $('#ga-b').style.transform += ` scale(${1 + 0.035 * Math.sin(t * 8)})`;
    $('#ga-a').style.opacity = 0.35;
    $('#ga-pie').style.opacity = clamp((t - M.piedra + 0.2) / 0.3);
  },
};

// ---------- 2. Se acercan. Te rozan. Te huelen. Uno pega la cara a Chispa ----------
ESCENAS.rozan = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14171c"/>
    <g filter="url(#ink)"><rect x="-20" y="1150" width="1120" height="800" fill="#3d4048"/></g>
    <g id="ro-fondo" filter="url(#ink)" opacity=".7"></g><g id="ro-tu"></g><g id="ro-cerca" filter="url(#ink)"></g>${oscuro('ro')}`),
  camara: { claves: [[INI.rozan, 1.0, 0, 0], foco(M.cara, 1.35, 600, 1100), foco(FIN('rozan'), 1.45, 620, 1100)] },
  update(lt, dur, t) {
    $('#ro-fondo').innerHTML = andenGente(t);
    $('#ro-tu').innerHTML = tuConChispaG(500, 1500, 70, t, { look: -4, lookY: -6, eyeScale: 1.25, mordida: false });
    // tres pasan cerca; uno se inclina hacia Chispa
    const pega = ease.inOut(clamp((t - M.cara + 0.3) / 0.8));
    $('#ro-cerca').innerHTML = [[lerp(150, 260, clamp((t - INI.rozan) / 3)), 1520, 520, 0.03], [lerp(980, 860, clamp((t - INI.rozan) / 3)), 1520, 540, -0.03]].map(([x, y, h, l]) =>
      `<g transform="translate(${x} ${y}) scale(${h})">${infectadoQuieto(0, l, -0.02)}</g>`).join('') +
      `<g transform="translate(${lerp(820, 720, pega)} 1530) rotate(${lerp(0, -18, pega)} 0 -300) scale(560)">${infectadoQuieto(0, -0.04, 0.02)}</g>`;
    luz('ro', 600, 1150, 460);
  },
};

// ---------- 3. Se agacha a la pata que cuelga de tus brazos. La muerde ----------
ESCENAS.muerde = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14171c"/><g id="mu-cosas"></g><rect id="mu-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${oscuro('mu')}`),
  camara: { claves: [[INI.muerde, 1.0, 0, 0], [MORDIDA, 1.1, 0, -40], [FIN('muerde'), 1.18, 0, -60]] },
  update(lt, dur, t) {
    const baja = ease.inOut(clamp((t - M.agacha) / (MORDIDA - M.agacha)));
    const mordio = t > MORDIDA;
    // Chispa grande, de lado, sostenida por tu brazo; la pata trasera cuelga
    $('#mu-cosas').innerHTML = `<g filter="url(#ink)" transform="translate(${560 + (mordio ? Math.sin(t * 50) * 6 : 0)} 880) scale(2.8)">${mordio ? perroMordido('parada', clamp((t - MORDIDA) / 2) * 0.3) : perro('parada')}</g>
      <path d="M1100 1030 L760 980" stroke="${INK}" stroke-width="70" stroke-linecap="round"/><path d="M1100 1030 L760 980" stroke="#e9e2d6" stroke-width="50" stroke-linecap="round"/>
      <g transform="translate(${lerp(-150, 330, baja)} ${lerp(700, 1080, baja)})"><circle r="130" fill="url(#headInfectado)" stroke="#15171b" stroke-width="12"/>
        <ellipse cx="40" cy="-10" rx="16" ry="26" fill="#f4f4f4"/><ellipse cx="90" cy="-10" rx="16" ry="26" fill="#f4f4f4"/></g>`;
    $('#mu-rojo').setAttribute('opacity', mordio && t < MORDIDA + 0.5 ? 0.5 * (1 - (t - MORDIDA) / 0.5) : 0);
    luz('mu', 520, 1050, 620);
    if (mordio && t < MORDIDA + 0.3) $('#esc-muerde .cam').style.transform += ` translate(${Math.sin(lt * 90) * 12}px, ${Math.cos(lt * 70) * 8}px)`;
  },
};

// ---------- 4. Chispa chilla. El túnel entero se te viene encima ----------
const VIENEN = (() => { const r = rng(14), g = []; for (let i = 0; i < 24; i++) g.push({ x: r() * 1080, z: r(), ph: r() * 6 }); return g.sort((a, b) => a.z - b.z); })();
ESCENAS.chilla = {
  html: lienzo(`<g id="ch-cara"><rect width="1080" height="1920" fill="#241d29"/><g id="ch-chispa" filter="url(#ink)"></g><g id="ch-ondas"></g>${viñeta}</g>
    <g id="ch-tunel" style="display:none"><rect width="1080" height="1920" fill="#0b0d11"/><g filter="url(#ink)"><path d="M-20 1300 L440 1000 L640 1000 L1100 1300 L1100 1960 L-20 1960 Z" fill="#2a2520"/></g><g id="ch-vienen" filter="url(#ink)"></g>${oscuro('ch')}</g>`),
  camara: { claves: [[INI.chilla, 1.0, 0, 0], [FIN('chilla'), 1.1, 0, 0]] },
  update(lt, dur, t) {
    const tunel = t > M.tunel - 0.1;
    $('#ch-cara').style.display = tunel ? 'none' : '';
    $('#ch-tunel').style.display = tunel ? '' : 'none';
    if (!tunel) {
      $('#ch-chispa').innerHTML = `<g transform="translate(540 960) rotate(${Math.sin(t * 30) * 4}) scale(1.05)">${caraChispa({ aullido: 0.9, parpadeo: true })}</g>`;
      const d = t - INI.chilla;
      $('#ch-ondas').innerHTML = [0, 1, 2].map(k => { const f = ((d * 1.4) + k / 3) % 1; return `<circle cx="540" cy="1100" r="${200 + f * 700}" fill="none" stroke="#fff" stroke-width="8" opacity="${0.6 * (1 - f)}"/>`; }).join('');
      return;
    }
    const k = clamp((t - M.tunel + 0.1) / (FIN('chilla') - M.tunel));
    $('#ch-vienen').innerHTML = VIENEN.map(p => { const z = clamp(p.z * 0.6 + k * 0.9), s = lerp(80, 1100, z * z), x = lerp(540, p.x, z), y = lerp(1000, 2000, z * z);
      return `<g transform="translate(${x} ${y}) scale(${s})">${infectadoQuieto(1, 0, 0.02)}</g>`; }).join('');
    luz('ch', 540, 1100, lerp(400, 900, k));
  },
};

// ---------- 5. Corres. Una escalera de emergencia. Una puerta. Luz ----------
ESCENAS.corres = {
  html: lienzo(`<g id="co-mundo"></g><g id="co-cosas"></g>${oscuro('co')}<rect id="co-blanco" width="1080" height="1920" fill="#fff" opacity="0"/>`),
  camara: { claves: [[INI.corres, 1.0, 0, 0], [FIN('corres'), 1.05, 0, 0]] },
  update(lt, dur, t) {
    const avanza = (t - INI.corres) * 520;
    const esc = t > M.escalera - 0.1, pta = t > M.puerta - 0.1;
    $('#co-mundo').innerHTML = tunelLado(avanza) + (esc ? `<g filter="url(#ink)"><rect x="760" y="420" width="40" height="1020" fill="#e5a83b" stroke="${INK}" stroke-width="6"/><rect x="900" y="420" width="40" height="1020" fill="#e5a83b" stroke="${INK}" stroke-width="6"/>
      ${[...Array(12)].map((_, i) => `<rect x="800" y="${470 + i * 80}" width="100" height="16" fill="#e5a83b" stroke="${INK}" stroke-width="4"/>`).join('')}
      <rect x="770" y="300" width="160" height="80" rx="8" fill="#2f9e5a" stroke="${INK}" stroke-width="6"/><text x="850" y="355" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" fill="#fff">SALIDA</text></g>` : '');
    const sube = esc ? clamp((t - M.escalera) / (M.puerta - M.escalera)) : 0;
    const inf = esc ? '' : `<g filter="url(#ink)">${[0, 1, 2, 3].map(i => `<g transform="translate(${lerp(-200, 260, ((t - INI.corres) * 0.3 + i * 0.07) % 1) - i * 90} 1440) scale(300)">${infectadoLado(t * 10 + i)}</g>`).join('')}</g>`;
    $('#co-cosas').innerHTML = inf + (esc ? `<g transform="translate(850 ${lerp(1440, 520, sube)})">${tuConChispaG(0, 0, 55, t, { look: 0, lookY: -14, g: 0.2 })}</g>`
      : `<g>${tuCorre(560, 1440, 62, t * 16)}<g filter="url(#ink)" transform="translate(640 1210) scale(0.42)">${perroMordido('parada', 0.2)}</g></g>`);
    luz('co', esc ? 850 : 600, esc ? lerp(1100, 500, sube) : 1200, 520);
    $('#co-blanco').setAttribute('opacity', t > LUZ ? clamp((t - LUZ) / 0.25) * (1 - clamp((t - LUZ - 0.5) / 0.6)) : 0);
  },
};

// ---------- 6. Estás en el centro de alerta ----------
ESCENAS.centro = {
  html: lienzo(`<rect width="1080" height="1920" fill="url(#ventanaDia)"/>
    <g filter="url(#ink)">
      <path d="M700 520 L760 120 L820 520 M720 380 L800 380 M730 260 L790 260 M700 520 L820 520" stroke="#6b7280" stroke-width="12" fill="none"/>
      <circle cx="760" cy="112" r="16" fill="${ROJO}"/>
      <rect x="120" y="520" width="840" height="900" fill="#b8b2a6" stroke="${INK}" stroke-width="10"/>
      ${[0, 1, 2].map(f => [0, 1, 2, 3].map(c => `<rect x="${170 + c * 200}" y="${720 + f * 170}" width="140" height="110" fill="#5a6070" stroke="${INK}" stroke-width="6"/>`).join('')).join('')}
      <rect x="220" y="560" width="640" height="110" fill="#efe6cf" stroke="${INK}" stroke-width="7"/>
      <text x="540" y="638" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="64" fill="${INK}">CENTRO DE ALERTA</text>
      <rect x="-20" y="1420" width="1120" height="560" fill="#6b6f78" stroke="${INK}" stroke-width="8"/>
      <rect x="420" y="1230" width="240" height="190" fill="#1b1e24" stroke="${INK}" stroke-width="7"/>
    </g>
    <g id="ce-tu"></g>${viñeta}`),
  camara: { claves: [[INI.centro, 1.0, 0, 0], [FIN('centro'), 1.08, 0, -30]] },
  update(lt, dur, t) {
    $('#ce-tu').innerHTML = tuConChispaG(540, 1520, 52, t, { look: 0, lookY: -16, g: 0.35, tiembla: true });
    document.querySelector('#esc-centro circle[fill="' + ROJO + '"]')?.setAttribute('opacity', Math.sin(t * 6) > 0 ? 1 : 0.3);
  },
};

// ---------- 7 y 8. La pata de atrás ya está gris. En una pata, la mordida tarda días ----------
ESCENAS.pata = {
  html: lienzo(`<rect width="1080" height="1920" fill="#2a2d33"/><circle cx="540" cy="900" r="700" fill="#9fb3c8" opacity=".15"/>
    <g id="pa-chispa"></g><g id="pa-circ"></g>${viñeta}`),
  camara: { claves: [[INI.pata, 1.0, 0, 0], foco(M.gris, 1.0, 540, 960), foco(M.gris + 0.5, 1.55, 380, 1120), foco(FIN('pata'), 1.6, 370, 1130)] },
  update(lt, dur, t) {
    const g = lerp(0.35, 0.6, clamp((t - INI.pata) / 3));
    $('#pa-chispa').innerHTML = `<g filter="url(#ink)" transform="translate(${560 + Math.sin(t * 45) * 4} 900) scale(3.3)">${perroMordido('parada', g)}</g>`;
    $('#pa-circ').innerHTML = t > M.gris - 0.1 ? `<circle cx="345" cy="1150" r="${170 + 10 * Math.sin(t * 5)}" fill="none" stroke="${ROJO}" stroke-width="10" opacity=".85"/>` : '';
  },
};
ESCENAS.dias = {
  html: lienzo(`<rect width="1080" height="1920" fill="#1b1e24"/>
    <g filter="url(#ink)" opacity=".5"><circle cx="540" cy="620" r="240" fill="#efe6cf" stroke="${INK}" stroke-width="12"/>
      ${[...Array(12)].map((_, i) => { const a = i / 12 * Math.PI * 2; return `<line x1="${540 + Math.sin(a) * 200}" y1="${620 - Math.cos(a) * 200}" x2="${540 + Math.sin(a) * 225}" y2="${620 - Math.cos(a) * 225}" stroke="${INK}" stroke-width="8"/>`; }).join('')}</g>
    <g id="di-manecillas" filter="url(#ink)" opacity=".5"></g>
    <g id="di-chispa"></g>${viñeta}`),
  fijo: `<div class="tinta" id="di-txt" style="top:1250px;left:0;width:1080px;text-align:center;font-size:140px;color:#e9e2d6;opacity:0">días</div>`,
  camara: { claves: [[INI.dias, 1.0, 0, 0], [M.dias2, 1.05, 0, 0], [FIN('dias'), 1.15, 0, 60]] },
  update(lt, dur, t) {
    const a = (t - INI.dias) * 4, ah = (t - INI.dias) * 0.4;
    $('#di-manecillas').innerHTML = `<line x1="540" y1="620" x2="${540 + Math.sin(ah) * 120}" y2="${620 - Math.cos(ah) * 120}" stroke="${INK}" stroke-width="18" stroke-linecap="round"/>
      <line x1="540" y1="620" x2="${540 + Math.sin(a) * 180}" y2="${620 - Math.cos(a) * 180}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`;
    $('#di-chispa').innerHTML = `<g filter="url(#ink)" transform="translate(${540 + Math.sin(t * 40) * 3} 1080) scale(2.2)">${perroMordido('parada', 0.6)}</g>`;
    $('#di-txt').style.opacity = clamp((t - M.tarda - 0.4) / 0.3);
  },
};

// ---------- 9. La sala de control. Una pantalla sigue prendida ----------
ESCENAS.sala = {
  html: lienzo(`${salaVacia('sa')}<g id="sa-tu"></g>${viñeta}`),
  camara: { claves: [[INI.sala, 1.0, 0, 0], [M.pantalla, 1.0, 0, 0], foco(FIN('sala'), 1.5, 540, 980)] },
  update(lt, dur, t) {
    $('#sa-txt').innerHTML = `<text x="540" y="960" text-anchor="middle" font-family="monospace" font-weight="700" font-size="22" fill="#3fb8a8">REGISTRO · NOCHE 0</text>
      <rect x="${440 + (Math.floor(t * 2) % 2) * 0}" y="990" width="18" height="26" fill="#3fb8a8" opacity="${Math.floor(t * 2.5) % 2 ? 1 : 0}"/>`;
    $('#sa-tu').innerHTML = tuConChispaG(200, 1560, 60, t, { look: 18, lookY: -6, g: 0.45 });
  },
};

// ---------- 10 y 11. El registro de la primera noche ----------
const pantallaRegistro = pre => `<div class="full" style="background:#05100e"></div>
  <div style="position:absolute;inset:120px 60px;border:10px solid #2c3a48;border-radius:24px;background:#071a17;box-shadow:inset 0 0 120px rgba(63,184,168,.25)"></div>
  <div style="position:absolute;top:220px;left:110px;font-family:monospace;font-weight:700;font-size:44px;color:#3fb8a8">REGISTRO DEL SISTEMA</div>
  ${[[`${pre}-a1`, '03:14:02', 420, '#9fe0d4'], [`${pre}-a2`, 'PRUEBA · ZONA U.H. EDIFICIO C', 500, '#9fe0d4'], [`${pre}-a3`, 'USUARIO: EVELIN', 580, ROJO],
     [`${pre}-b1`, '03:14:05', 780, '#9fe0d4'], [`${pre}-b2`, 'TODAS LAS ZONAS', 860, '#9fe0d4'], [`${pre}-b3`, 'USUARIO: COORDINACIÓN', 940, ROJO]].map(([id, txt, top, color]) =>
    `<div id="${id}" style="position:absolute;top:${top}px;left:100px;font-family:monospace;font-weight:700;font-size:46px;color:${color};white-space:nowrap">${txt}</div>`).join('')}`;
const teclea = (el, t, t0, d) => { const p = clamp((t - t0) / d); el.style.clipPath = `inset(-20% ${100 - p * 100}% -20% -2%)`; };
ESCENAS.registro = {
  html: pantallaRegistro('r1'),
  camara: { claves: [[INI.registro, 1.0, 0, 0], [FIN('registro'), 1.06, 0, 40]] },
  update(lt, dur, t) {
    teclea($('#r1-a1'), t, M.dos - 0.6, 0.5); teclea($('#r1-a2'), t, M.prueba - 0.1, 0.9); teclea($('#r1-a3'), t, M.usuario1, 0.6);
    ['#r1-b1', '#r1-b2', '#r1-b3'].forEach(s => $(s).style.opacity = 0);
    $('#r1-a3').style.opacity = t > M.usuario1 + 0.8 && Math.sin(t * 8) < -0.5 ? 0.4 : 1;
  },
};
ESCENAS.registro2 = {
  html: pantallaRegistro('r2'),
  camara: { claves: [[INI.registro2, 1.06, 0, 40], [M.usuario2, 1.06, 0, 0], [FIN('registro2'), 1.2, 0, -120]] },
  update(lt, dur, t) {
    teclea($('#r2-b1'), t, M.cinco - 0.6, 0.5); teclea($('#r2-b2'), t, M.todas - 0.1, 0.6); teclea($('#r2-b3'), t, M.usuario2, 0.8);
    $('#r2-b3').style.opacity = t > M.usuario2 + 1 ? (Math.sin(t * 8) > -0.3 ? 1 : 0.35) : 1;
    $('#r2-b3').style.transform = t > M.usuario2 + 1 ? `scale(${1 + 0.03 * Math.sin(t * 8)})` : '';
    $('#r2-b3').style.transformOrigin = 'left center';
  },
};

// ---------- 12. Detrás de ti, una tarjeta abre la puerta ----------
ESCENAS.bip = {
  html: lienzo(`<rect width="1080" height="1920" fill="#0a0e15"/>
    <g filter="url(#ink)">
      <rect x="300" y="500" width="420" height="900" fill="#1b1e24" stroke="${INK}" stroke-width="10"/>
      <rect x="760" y="900" width="70" height="110" rx="10" fill="#2a2d33" stroke="${INK}" stroke-width="6"/>
      <rect x="-20" y="1400" width="1120" height="560" fill="#14171c"/>
    </g>
    <g id="bi-puerta"></g><g id="bi-luz"></g><g id="bi-tu"></g>${viñeta}`),
  fijo: `<div class="onomato" id="bi-bip" style="top:760px;left:700px;font-size:100px;opacity:0;color:#7dff9a">BIP</div>`,
  camara: { claves: [[INI.bip, 1.0, 0, 0], foco(BIP - 0.2, 1.3, 700, 950), foco(BIP + 0.4, 1.0, 540, 960), [FIN('bip'), 1.05, 0, -20]] },
  update(lt, dur, t) {
    const verde = t > BIP, abre = ease.inOut(clamp((t - BIP - 0.2) / 0.8));
    $('#bi-puerta').innerHTML = `<rect x="300" y="500" width="${420 * (1 - abre * 0.85)}" height="900" fill="#5a6070" stroke="${INK}" stroke-width="10" filter="url(#ink)"/>
      <circle cx="795" cy="935" r="16" fill="${verde ? '#3fd06a' : ROJO}"/>${verde ? `<circle cx="795" cy="935" r="50" fill="#3fd06a" opacity=".3" filter="url(#blur10)"/>` : ''}
      ${!verde ? tarjeta(lerp(980, 820, clamp((t - BIP + 0.8) / 0.6)), 960, 0.9, -10) : ''}`;
    $('#bi-luz').innerHTML = abre > 0 ? `<polygon points="${300 + 420 * (1 - abre * 0.85)},500 720,500 900,1960 ${300 + 420 * (1 - abre * 0.85) - 200},1960" fill="#fff6c8" opacity="${0.12 * abre}"/>
      <g opacity="${abre}" filter="url(#contorno)">${memoDe(560, 1400, 80, { look: 10, lookY: 6, gris: 1, eyeFill: '#0a0c10' })}</g>` : '';
    $('#bi-tu').innerHTML = `<g opacity=".95">${tuConChispaG(220, 1700, 70, t, { look: lerp(-6, 14, clamp((t - BIP) / 0.3)), eyeScale: t > BIP ? 1.35 : 1, g: 0.5 })}</g>`;
    const b = $('#bi-bip'); b.style.opacity = t > BIP && t < BIP + 0.6 ? 1 : 0;
  },
};

// ---------- 13. Memo. Gris hasta el cuello ----------
ESCENAS.memo = {
  html: lienzo(`<rect width="1080" height="1920" fill="#0d1018"/><circle cx="540" cy="900" r="700" fill="#fff6c8" opacity=".08"/><g id="me-memo"></g>${viñeta}`),
  camara: { claves: [[INI.memo, 1.0, 0, 0], foco(M.cuello, 1.0, 540, 960), foco(FIN('memo'), 1.35, 540, 780)] },
  update(lt, dur, t) {
    const blanco = Math.sin(t * 7) > 0.85;
    $('#me-memo').innerHTML = `<g filter="url(#contorno)">${memoDe(540, 1560, 150, { look: 0, lookY: 4, gris: 1, eyeFill: blanco ? '#f2f2f2' : undefined,
      armL: [[400, 1080], [380, 960]], armR: [[700, 1100], [760, 1200]] })}
      <path d="M505 905 q35 14 70 0 l-4 70 q-31 12 -62 0 z" fill="#9aa0a8" stroke="#050608" stroke-width="6"/></g>
      ${tarjeta(380, 930, 1.3, -15)}`;
  },
};

// ---------- 14. Mira la pata de Chispa y se ríe. Ya somos dos ----------
ESCENAS.somos = {
  html: lienzo(`<rect width="1080" height="1920" fill="#0d1018"/><circle cx="540" cy="900" r="700" fill="#fff6c8" opacity=".06"/><g id="so-cosas"></g>${viñeta}`),
  fijo: `<div class="tinta" id="so-je" style="top:520px;left:140px;font-size:110px;color:#c9ccd2;opacity:0">je, je</div>`,
  camara: { claves: [[INI.somos, 1.0, 0, 0], [M.somos, 1.05, 0, 0], [FIN('somos'), 1.1, 0, 20]] },
  update(lt, dur, t) {
    const rie = t > M.rie - 0.1 && t < M.somos + 0.3, sacude = rie ? Math.sin(t * 30) * 6 : 0;
    $('#so-cosas').innerHTML = `<g transform="translate(0 ${sacude})">${memoDe(300, 1500, 85, { look: 14, lookY: 14, gris: 1, eyeScale: rie ? 0.7 : 1, armR: [[380, 1150], [440, 1230]] })}</g>` +
      tuConChispaG(720, 1500, 85, t, { look: -10, eyeScale: 1.2, g: 0.55 }) +
      (t > M.somos - 0.1 ? `<circle cx="440" cy="1200" r="${90 + 6 * Math.sin(t * 5)}" fill="none" stroke="${ROJO}" stroke-width="9"/>
        <circle cx="${720 + 85 * 1.35 - 70 * 85 * 0.0065}" cy="${1500 - 85 * 3.55 + 80 * 85 * 0.0065}" r="${70 + 6 * Math.sin(t * 5)}" fill="none" stroke="${ROJO}" stroke-width="9"/>
        <path d="M530 1200 Q650 1300 ${720 + 85 * 1.35 - 70 * 85 * 0.0065 - 70} ${1500 - 85 * 3.55 + 80 * 85 * 0.0065}" fill="none" stroke="${ROJO}" stroke-width="6" stroke-dasharray="18 14"/>` : '');
    $('#so-je').style.opacity = rie ? 1 : 0;
    $('#so-je').style.transform = `rotate(-8deg) translateY(${Math.sin(t * 20) * 4}px)`;
  },
};

// ---------- 15. Yo sé llegar a la antena, dice ----------
ESCENAS.antena = {
  html: lienzo(`<rect width="1080" height="1920" fill="#0d1018"/>
    <g filter="url(#ink)"><rect x="560" y="80" width="440" height="420" fill="url(#ventanaDia)" stroke="${INK}" stroke-width="12"/>
      <path d="M720 500 L780 140 L840 500 M740 380 L820 380 M750 260 L810 260" stroke="#6b7280" stroke-width="12" fill="none"/>
      <path d="M560 290 L1000 290 M780 80 L780 500" stroke="${INK}" stroke-width="8"/></g>
    <circle id="an-roja" cx="780" cy="132" r="16" fill="${ROJO}"/>
    <g id="an-memo"></g>${viñeta}`),
  camara: { claves: [[INI.antena, 1.0, 0, 120], [M.antenaM, 1.0, 0, 120], [FIN('antena'), 1.12, -40, 220]] },
  update(lt, dur, t) {
    $('#an-roja').setAttribute('opacity', Math.sin(t * 6) > 0 ? 1 : 0.25);
    const sube = ease.outCubic(clamp((t - M.yose + 0.1) / 0.5));
    $('#an-memo').innerHTML = memoDe(400, 1640, 120, { look: lerp(0, 18, sube), lookY: lerp(0, -18, sube), gris: 1,
      armR: [[lerp(530, 560, sube), lerp(1250, 1000, sube)], [lerp(560, 660, sube), lerp(1340, 820, sube)]] });
  },
};

// ---------- 16. ¿Lo dejas venir, o lo encierras aquí? ----------
ESCENAS.decide = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="960" r="900" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="de-tit">¿QUÉ HACES?</div>
    <div class="opcion" id="de-a" style="top:560px;font-size:70px"><span class="emo">🤝</span><span class="txt">LO DEJAS VENIR</span></div>
    <div class="opcion" id="de-b" style="top:900px;font-size:70px"><span class="emo">🔐</span><span class="txt">LO ENCIERRAS AQUÍ</span></div>
    <div class="decide-com" id="de-com">COMENTA <span class="emo">🤝</span> O <span class="emo">🔐</span></div>
    <div class="decide-pie" id="de-pie">GANA LO QUE MÁS COMENTEN</div>`,
  update(lt, dur, t) {
    pop($('#de-tit'), t, INI.decide);
    pop($('#de-a'), t, M.dejas - 0.1);
    pop($('#de-b'), t, M.encierras - 0.1);
    pop($('#de-com'), t, M.comenta - 0.1);
    $('#de-pie').style.opacity = clamp((t - M.comenta - 0.6) / 0.3);
    const a = t >= M.dejas - 0.1 && t < M.encierras - 0.1, b = t >= M.encierras - 0.1 && t < M.comenta - 0.1;
    $('#de-a').style.borderColor = a ? '#e5a83b' : '#fff';
    $('#de-b').style.borderColor = b ? '#9fd0ff' : '#fff';
    if (a) $('#de-a').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
    if (b) $('#de-b').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
  },
};
