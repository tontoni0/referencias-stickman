// Escenas de "La alerta", parte 5: noche 3. La alerta suena otra vez a las 3:14 y Chispa aúlla.
// Esta parte no abre con flash-forward: empieza directo con la alerta sonando.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const SILLA = [M.silla + 0.1, M.nada1 - 0.15];   // la silla se arrastra
const LATA = M.lata + 0.55;                        // la lata pega en el piso
const LIBRE = M.calla + 0.5;                       // el último aullido sale por la ventana

// Cuenta regresiva de la alerta: segundos que faltan en el tiempo t de la narración.
const CUENTA = [[M.noventa, 90], [M.diez, 10], [M.cinco, 5], [M.tres, 3], [M.dos, 2], [M.calla, 0]];
function restante(t) {
  if (t <= CUENTA[0][0]) return 90;
  for (let i = 0; i < CUENTA.length - 1; i++) {
    const [a, va] = CUENTA[i], [b, vb] = CUENTA[i + 1];
    if (t < b) return lerp(va, vb, (t - a) / (b - a));
  }
  return 0;
}
const reloj = n => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
// Pone el tiempo en un letrero. Se pone rojo y late en los últimos 10 segundos.
function animaReloj(el, t) {
  const s = restante(t), n = Math.ceil(s - 1e-6);
  el.textContent = reloj(n);
  el.style.color = n <= 10 ? ROJO : '#fff';
  el.style.transform = `scale(${n <= 10 ? 1 + 0.18 * clamp(1 - (n - s) / 0.3) : 1})`;
  el.style.opacity = 1;
}

// Ondas de sonido a los lados de una cara (primer plano).
function ondasLado(cx, cy, t, sep, alto, vel = 1.4) {
  let s = '';
  for (const dir of [-1, 1]) for (let k = 0; k < 3; k++) {
    const f = (t * vel + k / 3) % 1, x = cx + dir * (sep + f * 240), R = alto * (0.6 + 0.6 * f);
    s += `<path d="M${x} ${cy - R} q${dir * R * 0.45} ${R} 0 ${2 * R}" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity="${(1 - f) * 0.85}"/>`;
  }
  return s;
}
// Ondas que salen del hocico en la dirección ang (grados).
function ondasFrente(x, y, ang, t, largo = 260) {
  let s = '';
  for (let k = 0; k < 3; k++) {
    const f = (t * 1.3 + k / 3) % 1, R = 40 + f * largo;
    const a1 = (ang - 32) * Math.PI / 180, a2 = (ang + 32) * Math.PI / 180;
    s += `<path d="M${x + R * Math.cos(a1)} ${y + R * Math.sin(a1)} A${R} ${R} 0 0 1 ${x + R * Math.cos(a2)} ${y + R * Math.sin(a2)}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="${(1 - f) * 0.9}"/>`;
  }
  return s;
}

// Chispa sentada de lado (perroSentada en lib/dibujo.js). (x, y) es el centro del cuerpo; las patas quedan en y + 118 s.
const chispaSentada = (x, y, s, aulla) => `<g filter="url(#contorno)"><g transform="translate(${x} ${y}) scale(${s})">${perroSentada(aulla)}</g></g>`;
// Punta del hocico de chispaSentada, para las ondas.
const hocicoSentada = (x, y, s, aulla) => {
  const a = -38 * aulla * Math.PI / 180;
  return [x + s * (62 + 79 * Math.cos(a) - 18 * Math.sin(a)), y + s * (-112 + 79 * Math.sin(a) + 18 * Math.cos(a))];
};
// Tú, con un borde claro para que se vea de noche.
const tuNoche = o => `<g filter="url(#contorno)">${stick(o)}</g>`;

// Cuarto de noche con la ventana y el poste de la esquina afuera.
const PISO = 1290;
function cuartoNoche(pre) {
  return `
    <rect width="1080" height="1920" fill="url(#paredNoche)"/>
    <g filter="url(#ink)">
      <rect x="120" y="380" width="840" height="780" fill="url(#cielo)"/>
      <circle cx="300" cy="520" r="170" fill="url(#luzLuna)"/><circle cx="300" cy="520" r="44" fill="#e9eef7" opacity=".85"/>
      <path d="M120 1160 V900 h90 v-70 h110 v130 h80 v-170 h120 v150 h90 v-90 h110 v110 h100 v-140 h120 V1160z" fill="#0d1320"/>
    </g>
    <g id="${pre}-poste">${poste(720, 600, 0.7, 800)}</g>
    <g filter="url(#ink)">
      <rect x="120" y="380" width="840" height="780" fill="none" stroke="#0a0e15" stroke-width="18"/>
      <line x1="540" y1="380" x2="540" y2="1160" stroke="#0a0e15" stroke-width="12"/>
      <rect x="100" y="1155" width="880" height="30" fill="#2c3240" stroke="${INK}" stroke-width="7"/>
      <rect x="-20" y="${PISO}" width="1120" height="700" fill="#33251a" stroke="${INK}" stroke-width="8"/>
      <path d="M0 1420 q300 30 600 0 t480 10 M0 1600 q260 -20 540 10 t540 -10" stroke="#2a1e15" stroke-width="5" fill="none"/>
    </g>
    <g id="${pre}-cosas" filter="url(#ink)"></g>
    <rect id="${pre}-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`;
}
const rojoCuarto = (pre, t, k = 0.12) => $(`#${pre}-rojo`).setAttribute('opacity', k * pulsoRojo(t));

// El patio desde tu ventana, de noche y sin luz. El poste de la alerta está en la esquina derecha.
const POSTE_PATIO = [860, 1020];
function patioArriba(pre) {
  let ventanas = '';
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++)
    ventanas += `<rect x="${60 + i * 170}" y="${70 + j * 120}" width="90" height="85" fill="#0f141d" stroke="#0a0d13" stroke-width="6"/>`;
  return `
    <rect width="1080" height="1920" fill="#1a202c"/>
    <g filter="url(#ink)">
      <rect x="-10" y="0" width="1100" height="560" fill="#1c2230" stroke="${INK}" stroke-width="8"/>
      ${ventanas}
      <rect x="-10" y="540" width="1100" height="40" fill="#141923"/>
      <rect x="-10" y="580" width="1100" height="1400" fill="#2a3140"/>
    </g>
    <g stroke="#232a37" stroke-width="4">${[720, 880, 1060, 1260, 1480, 1720].map(y => `<line x1="0" y1="${y}" x2="1080" y2="${y}"/>`).join('')}${[180, 400, 620, 840].map(x => `<line x1="${x}" y1="580" x2="${x}" y2="1920"/>`).join('')}</g>
    <ellipse cx="420" cy="1150" rx="520" ry="320" fill="url(#luzLuna)" opacity=".35"/>
    <g filter="url(#ink)">
      <rect x="30" y="1320" width="280" height="120" fill="#2b261f" stroke="${INK}" stroke-width="7"/>
      <circle cx="90" cy="1310" r="50" fill="#1a2f23" stroke="${INK}" stroke-width="6"/><circle cx="170" cy="1295" r="60" fill="#1e3a29" stroke="${INK}" stroke-width="6"/><circle cx="250" cy="1312" r="48" fill="#1a2f23" stroke="${INK}" stroke-width="6"/>
      <path d="M470 1335 q30 -22 70 -6 q14 12 -6 22 q-40 10 -64 -16z" fill="#d88aa6" stroke="${INK}" stroke-width="5"/>
      <path d="M492 1330 q18 -4 30 6" fill="none" stroke="${INK}" stroke-width="4"/>
    </g>
    <g id="${pre}-poste">${poste(POSTE_PATIO[0], 600, 0.6, 700)}</g>
    <g id="${pre}-gente" filter="url(#ink)"></g>
    <rect id="${pre}-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`;
}
const altoEn = y => lerp(150, 235, clamp((y - 900) / 560));
const infEn = (x, y, h, cuerpo) => `<g transform="translate(${x} ${y}) scale(${h})">${cuerpo}</g>`;

// Los del patio: dónde empiezan y a qué lugar del poste llegan.
const patioGente = (() => {
  const r = rng(31), g = [];
  for (let k = 0; k < 16; k++) g.push({ x0: 70 + r() * 580, y0: 900 + r() * 500,
    tx: POSTE_PATIO[0] + (r() - 0.5) * 300, ty: 950 + r() * 150, d: r() * 0.8, ph: r() * 6 });
  return g;
})();
function posInf(p, t) {
  const tc = M.corren + p.d * 0.9, T = Math.hypot(p.tx - p.x0, p.ty - p.y0) / 620;
  const u = clamp((t - tc) / T);
  return { x: lerp(p.x0, p.tx, u), y: lerp(p.y0, p.ty, u), corre: u > 0 && u < 1, llego: u >= 1, desde: t - tc - T };
}
// En el poste: brazos arriba y empujones.
const enElPoste = (p, x, y, t, u = 1) => infEn(x + Math.sin(t * 7 + p.ph) * 5 * u, y, altoEn(y), infectadoQuieto(u, 0.01, -0.02 * u));
function dibujaPatio(t) {
  return patioGente.map(p => ({ p, ...posInf(p, t) })).sort((a, b) => a.y - b.y).map(o => {
    if (o.corre) return infEn(o.x, o.y, altoEn(o.y), infectadoLado((t - M.corren) * 15 + o.p.ph));
    if (o.llego) return enElPoste(o.p, o.x, o.y, t, ease.outCubic(clamp(o.desde / 0.4)));
    return infEn(o.x + Math.sin(t * 1.5 + o.p.ph) * 2, o.y, altoEn(o.y), infectadoQuieto(0, 0.04, 0));
  }).join('');
}

// El montón alrededor del poste visto desde tu ventana: cabezas desde arriba.
const monton = (() => {
  const r = rng(77), g = [];
  for (let i = 0; i < 26; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r());
    g.push({ x: 540 + Math.cos(a) * d * 360, y: 1010 + Math.sin(a) * d * 270, s: 0.85 + r() * 0.35, d: r() * 0.7, ph: r() * 6, i });
  }
  return g.sort((a, b) => a.y - b.y);
})();
function montonArriba(pre) {
  let rejilla = '';
  for (let y = 340; y < 2000; y += 130) rejilla += `<line x1="0" y1="${y}" x2="1080" y2="${y}"/>`;
  for (let x = 0; x < 1100; x += 150) rejilla += `<line x1="${x}" y1="300" x2="${x}" y2="1920"/>`;
  return `
    <rect width="1080" height="1920" fill="#2f3440"/>
    <g stroke="#282c37" stroke-width="4">${rejilla}</g>
    <rect width="1080" height="300" fill="#3b3530"/>
    <rect y="260" width="1080" height="40" fill="#2a2520"/>
    <ellipse cx="540" cy="1050" rx="560" ry="420" fill="url(#luzLuna)" opacity=".25"/>
    <g id="${pre}-poste">${poste(540, 420, 0.55, 640)}</g>
    <g id="${pre}-gente" filter="url(#ink)">${monton.map(p => {
      const vx = 540 - p.x, vy = 560 - p.y, n = Math.hypot(vx, vy) || 1, ux = vx / n, uy = vy / n;
      const brazo = l => { const a = [l * 42, 28], b = [l * 30 + ux * 125, 22 + uy * 125];
        return linea([a, b], 22, '#050608') + linea([a, b], 13, '#8a9099') + punto(b[0], b[1], 15, '#050608') + punto(b[0], b[1], 10, '#8a9099'); };
      return `<g class="cab" data-i="${p.i}" transform="translate(${p.x} ${p.y}) scale(${p.s})">
      <ellipse cx="6" cy="44" rx="56" ry="30" fill="#000" opacity=".25"/>
      <ellipse cx="0" cy="36" rx="54" ry="27" fill="#3d4048" stroke="${INK}" stroke-width="5"/>
      <g class="brazos">${brazo(-1)}${brazo(1)}</g>
      <circle cx="0" cy="0" r="38" fill="url(#headInfectadoOscuro)" stroke="${INK}" stroke-width="6"/>
      <g class="ojos"><ellipse cx="-13" cy="-2" rx="6.5" ry="10" fill="#f2f2f2"/><ellipse cx="13" cy="-2" rx="6.5" ry="10" fill="#f2f2f2"/></g></g>`;
    }).join('')}</g>
    ${viñeta}`;
}
// giro 0: miran al poste (de espaldas a ti). giro 1: la cara hacia tu ventana.
function animaMonton(pre, t, desde, brazos) {
  if (!this.cache) this.cache = {};
  const gs = this.cache[pre] || (this.cache[pre] = [...document.querySelectorAll(`#${pre}-gente .cab`)]);
  gs.forEach(g => {
    const p = monton.find(m => m.i === +g.dataset.i);
    const giro = desde === null ? 0 : ease.outCubic(clamp((t - desde - p.d * 0.6) / 0.35));
    const ojos = g.querySelector('.ojos');
    ojos.setAttribute('transform', `translate(0 ${-(1 - giro) * 26}) scale(1 ${0.2 + 0.8 * giro})`);
    ojos.style.opacity = giro;
    ojos.style.filter = giro > 0.9 ? 'drop-shadow(0 0 7px #fff)' : '';
    const b = g.querySelector('.brazos');
    b.style.opacity = brazos;
    b.setAttribute('transform', `rotate(${Math.sin(t * 8 + p.ph) * 7})`);
  });
}

// Fachada del edificio C de noche, vista desde el patio. Tu ventana (502) arriba a la izquierda.
function fachadaNoche(pre) {
  let v = '';
  for (let f = 0; f < 5; f++) for (let c = 0; c < 3; c++) {
    const x = 130 + c * 310, y = 430 + f * 200, tuya = f === 0 && c === 0;
    v += `<rect x="${x}" y="${y}" width="200" height="130" fill="${tuya ? '#2c3a58' : '#121722'}" stroke="${INK}" stroke-width="7"/>`;
    if (f === 1 && c === 0) v += `<path d="M${x + 6} ${y + 6} h188 v40 q-12 14 -24 0 q-12 14 -24 0 q-12 14 -24 0 q-12 14 -24 0 q-12 14 -24 0 q-12 14 -24 0 q-12 14 -24 0 q-11 14 -20 0z" fill="#d8a7b5" opacity=".55"/>`;
    v += `<line x1="${x + 100}" y1="${y}" x2="${x + 100}" y2="${y + 130}" stroke="#2a2f3a" stroke-width="6"/>`;
  }
  const lejos = [[860, 1500], [905, 1490], [950, 1505], [1000, 1495], [1040, 1510], [930, 1525]];
  return `
    <rect width="1080" height="1920" fill="url(#cielo)"/>
    <circle cx="880" cy="230" r="220" fill="url(#luzLuna)"/><circle cx="880" cy="230" r="62" fill="#e9eef7"/>
    <g filter="url(#ink)">
      <rect x="60" y="380" width="960" height="1040" fill="#2f323c" stroke="${INK}" stroke-width="10"/>
      <rect x="40" y="360" width="1000" height="30" fill="#3d414c" stroke="${INK}" stroke-width="7"/>
      ${v}
      ${cabeza(195, 520, 17, { look: 4, sinBrillo: true })}
      <circle cx="262" cy="535" r="15" fill="#6e4325" stroke="${INK}" stroke-width="4"/><path d="M252 524 l4 -14 l8 12z" fill="#5a361d"/>
      <rect x="-20" y="1420" width="1120" height="520" fill="#1a1f2a" stroke="${INK}" stroke-width="8"/>
    </g>
    ${poste(990, 1180, 0.35, 900)}
    <g filter="url(#ink)">${lejos.map(([x, y]) => infEn(x, y, 95, infectadoQuieto(0, 0, -0.02))).join('')}</g>
    <g id="${pre}-onda"></g>
    ${viñeta}`;
}
// El aullido flota desde tu ventana como una onda blanca.
function ondaAullido(t, t0) {
  const p = ease.outCubic(clamp((t - t0) / 2.6)), L = 760 * p;
  const o = clamp((t - t0) / 0.3) * lerp(1, 0.4, clamp((t - t0 - 1.8) / 3));
  let pts = [];
  for (let dx = 0; dx <= L; dx += 8) pts.push([330 + dx, 480 - dx * 0.3 + Math.sin(dx / 34 - t * 7) * 26 * (1 - dx / 1000)]);
  if (pts.length < 2) return '';
  return `<g opacity="${o}"><polyline points="${pts.map(pt).join(' ')}" fill="none" stroke="#fff" stroke-width="26" opacity=".25" filter="url(#blur10)"/>
    <polyline points="${pts.map(pt).join(' ')}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/></g>`;
}

// Silla de lado, con el respaldo a la izquierda. ang la inclina sobre la pata de atrás.
const silla = (cx, ang = 0) => {
  const d = (pts, w) => linea(pts, w + 9, INK) + linea(pts, w, '#7a5236');
  return `<g transform="rotate(${ang} ${cx - 90} ${PISO})">
    ${d([[cx - 90, PISO], [cx - 90, PISO - 220], [cx - 104, PISO - 480]], 14)}${d([[cx + 90, PISO], [cx + 90, PISO - 220]], 14)}
    ${d([[cx - 100, PISO - 340], [cx - 30, PISO - 345]], 12)}${d([[cx - 102, PISO - 420], [cx - 30, PISO - 425]], 12)}
    <rect x="${cx - 112}" y="${PISO - 238}" width="226" height="30" rx="6" fill="#8a603f" stroke="${INK}" stroke-width="8"/></g>`;
};
const lata = (x, y, ang) => `<g transform="translate(${x} ${y}) rotate(${ang})">
  <rect x="-34" y="-50" width="68" height="100" rx="8" fill="#b9c0c9" stroke="${INK}" stroke-width="7"/>
  <rect x="-34" y="-22" width="68" height="44" fill="#c0392b" stroke="${INK}" stroke-width="5"/>
  <ellipse cx="0" cy="-50" rx="34" ry="9" fill="#d5dae0" stroke="${INK}" stroke-width="5"/></g>`;

// ===================== ESCENAS =====================

// 1. 3:14. El celular en el piso, la alerta sonando por la ventana y Chispa con las orejas paradas.
ESCENAS.noche = {
  html: lienzo(cuartoNoche('no')),
  fijo: `<div class="recuerdo" id="no-tit" style="top:140px">Noche 3</div>`,
  camara: { claves: [[0, 2.2, -640, -860], [0.9, 2.2, -640, -860], [M.suena, 1.0, 0, 0], [FIN('noche'), 1.12, -40, -60]] },
  update(lt, dur, t) {
    animaPoste($('#esc-noche'), t, true);
    rojoCuarto('no', t, 0.16);
    const brillo = 0.75 + 0.25 * pulsoRojo(t);
    $('#no-cosas').innerHTML = chispaSentada(560, PISO - 112, 0.95, 0.15) +
      `<rect x="720" y="${PISO + 8}" width="240" height="70" rx="12" fill="#0b0f17" stroke="${INK}" stroke-width="7"/>
      <rect x="732" y="${PISO + 17}" width="216" height="52" rx="8" fill="#1d3866" opacity="${brillo}"/>
      <text x="840" y="${PISO + 60}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="46" fill="#fff">3:14</text>`;
    $('#no-tit').style.opacity = clamp((t - 0.3) / 0.4);
  },
};

// 2. Chispa levanta la cabeza y aúlla.
ESCENAS.aullido = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#paredNoche)"/>
    <circle cx="540" cy="700" r="800" fill="url(#luzLuna)" opacity=".35"/>
    <g id="au-ondas"></g>
    <g id="au-cara" filter="url(#ink)"></g>
    <rect id="au-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`),
  fijo: `<div class="onomato" id="au-txt" style="top:200px;left:0;width:100%;text-align:center;font-size:170px;opacity:0">AUUUUU</div>`,
  camara: { claves: [[INI.aullido, 1.0, 0, 0], [M.aullar, 1.05, 0, 20], [FIN('aullido'), 1.18, 0, 40]], origen: '540px 1100px' },
  update(lt, dur, t) {
    const sube = ease.inOut(clamp((t - INI.aullido - 0.2) / 0.7));
    const au = t > M.aullar - 0.15 ? ease.outCubic(clamp((t - M.aullar + 0.15) / 0.35)) * (0.85 + 0.15 * Math.sin(t * 6)) : 0;
    $('#au-cara').innerHTML = `<g transform="translate(540 960) rotate(${-18 * sube}) scale(0.95)">${caraChispa({ aullido: au, parpadeo: au > 0.3 })}</g>`;
    $('#au-ondas').innerHTML = au > 0.3 ? ondasLado(540, 1060, t, 300, 120) : '';
    $('#au-rojo').setAttribute('opacity', 0.12 * pulsoRojo(t));
    const tx = $('#au-txt');
    tx.style.opacity = au > 0.3 ? 1 : 0;
    escribe(tx, t, M.aullar, 0.8);
    tx.style.transform = `rotate(-4deg) translateY(${Math.sin(t * 9) * 6}px)`;
  },
};

// 3. El vaso de agua no se mueve. No tiembla. Otra vez.
ESCENAS.notiembla = {
  html: lienzo(`
    <defs><linearGradient id="nt-pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2334"/><stop offset="1" stop-color="#10161f"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#nt-pared)"/>
    <polygon points="0,300 420,1180 0,1180" fill="#c9d6f0" opacity=".05"/>
    <g filter="url(#ink)">
      <rect x="-10" y="1180" width="1100" height="760" fill="#33251a" stroke="${INK}" stroke-width="8"/>
      <path d="M0 1300 q300 30 600 0 t480 10 M0 1460 q260 -20 540 10 t540 -10" stroke="#2a1e15" stroke-width="5" fill="none"/>
      <ellipse cx="560" cy="1176" rx="175" ry="22" fill="#000" opacity=".35"/>
      <path d="M390 640 L420 1160 L660 1160 L690 640" fill="rgba(190,215,250,0.07)" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
      <polygon points="405,900 675,900 660,1152 420,1152" fill="rgba(110,160,225,0.38)"/>
      <ellipse cx="540" cy="900" rx="135" ry="15" fill="rgba(175,210,245,0.55)" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="540" cy="1160" rx="120" ry="14" fill="rgba(190,215,250,0.15)" stroke="${INK}" stroke-width="6"/>
      <ellipse cx="540" cy="640" rx="150" ry="20" fill="none" stroke="${INK}" stroke-width="7"/>
      <line x1="425" y1="690" x2="448" y2="1120" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".3"/>
      <line id="nt-reflejo" x1="652" y1="700" x2="640" y2="1100" stroke="${ROJO}" stroke-width="12" stroke-linecap="round" opacity="0"/>
    </g>
    <rect id="nt-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`),
  camara: { claves: [[INI.notiembla, 1.0, 0, 0], [M.otravez, 1.12, 0, 30], [FIN('notiembla'), 1.3, 0, 50]], origen: '540px 900px' },
  update(lt, dur, t) {
    $('#nt-rojo').setAttribute('opacity', 0.16 * pulsoRojo(t));
    $('#nt-reflejo').setAttribute('opacity', 0.6 * pulsoRojo(t));
  },
};

// 4. Te lanzas a taparle el hocico.
ESCENAS.lanzas = {
  html: lienzo(cuartoNoche('la')),
  camara: { claves: [[INI.lanzas, 1.0, 0, 0], [M.hocico + 0.1, 1.15, -60, -70], [FIN('lanzas'), 1.2, -70, -80]] },
  update(lt, dur, t) {
    animaPoste($('#esc-lanzas'), t, true);
    rojoCuarto('la', t);
    const p = ease.outCubic(clamp((t - INI.lanzas) / (M.hocico + 0.1 - INI.lanzas)));
    const tapado = p >= 1, aulla = tapado ? 0 : 0.9 + 0.1 * Math.sin(t * 6);
    const [sx, sy] = hocicoSentada(680, PISO - 118, 1, aulla);
    // estocada: entras deslizándote desde la izquierda con los brazos por delante
    const hx = 605 + lerp(-560, 0, p), hy = 907 + Math.sin(p * Math.PI) * -30;
    let lineas = '';
    if (p < 0.97) for (let k = 0; k < 6; k++) lineas += `<line x1="${hx - 380 - k * 30}" y1="${950 + k * 50}" x2="${hx - 640 - k * 30}" y2="${950 + k * 50}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="${0.6 * (1 - p)}"/>`;
    const tu = tuNoche({ head: [hx, hy], r: 95, neck: [hx - 50, hy + 90], hip: [hx - 240, hy + 250],
      armL: [[hx + 90, hy + 110], [hx + 200, hy + 165]], armR: [[hx + 40, hy + 200], [hx + 150, hy + 240]],
      legL: [[hx - 380, hy + 300], [hx - 520, PISO]], legR: [[hx - 130, hy + 330], [hx - 160, PISO]], footL: -1, footR: 1,
      look: 30, lookY: 10, eyeScale: 1.35 });
    const mmm = tapado ? [-1, 1].map(l => { const f = (t * 2.5) % 1; return `<path d="M${805 + l * (70 + f * 30)} 1040 q${l * 14} 28 0 56" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="${0.6 * (1 - f)}"/>`; }).join('') : '';
    $('#la-cosas').innerHTML = lineas + chispaSentada(680, PISO - 118, 1, aulla) + (tapado ? mmm : ondasFrente(sx, sy, -33, t)) + tu;
    if (tapado && t < M.hocico + 0.45) {
      const k = 1 - (t - M.hocico - 0.1) / 0.35;
      $('#esc-lanzas .cam').style.transform += ` translate(${Math.sin(lt * 80) * 14 * k}px, ${Math.cos(lt * 70) * 10 * k}px)`;
    }
  },
};

// 5. Allá abajo nadie voltea a tu ventana. Todos corren al poste de la esquina.
ESCENAS.esquina = {
  html: lienzo(patioArriba('es')),
  camara: { claves: [[INI.esquina, 1.25, 120, -40], [M.corren, 1.18, 60, -40], [M.poste, 1.3, -160, -90], [FIN('esquina'), 1.38, -170, -110]] },
  update(lt, dur, t) {
    animaPoste($('#esc-esquina'), t, true);
    $('#es-gente').innerHTML = dibujaPatio(t);
    $('#es-rojo').setAttribute('opacity', 0.06 * pulsoRojo(t));
  },
};

// 6. Se amontonan debajo de las bocinas, se empujan y estiran los brazos. Vistos por la espalda.
const montonCerca = (() => {
  const r = rng(44), g = [];
  [{ y: 1080, r: 46, n: 9 }, { y: 1220, r: 60, n: 7 }, { y: 1390, r: 78, n: 6 }].forEach((f, j) => {
    for (let k = 0; k < f.n; k++) g.push({ x: (k + 0.5 + (r() - 0.5) * 0.5) * 1080 / f.n, y: f.y + (r() - 0.5) * 30, r: f.r, ph: r() * 6, d: r(), j });
  });
  return g;
})();
function espalda(p, t) {
  const R = p.r, emp = t > M.empujan - 0.2 ? 1 : 0.35;
  const x = p.x + Math.sin(t * (5 + p.j) + p.ph) * R * 0.3 * emp, y = p.y + Math.abs(Math.sin(t * 6 + p.ph)) * R * 0.08 * emp;
  const u = ease.outCubic(clamp((t - M.estiran + 0.1 - p.d * 0.5) / 0.5));
  const osc = ['#2b2e34', '#3a3d44', '#4a4d55'][p.j];
  const doble = pts => linea(pts, R * 0.36, '#050608') + linea(pts, R * 0.22, ['#5d636b', '#737980', '#8a9099'][p.j]);
  let s = `<path d="M${x - R * 1.35} ${y + R * 1.4} Q${x} ${y + R * 0.9} ${x + R * 1.35} ${y + R * 1.4} L${x + R * 1.5} ${y + R * 7} L${x - R * 1.5} ${y + R * 7} Z" fill="${osc}" stroke="#050608" stroke-width="${R * 0.12}"/>`;
  for (const l of [-1, 1]) {
    const mueve = Math.sin(t * 9 + p.ph + l) * R * 0.25 * u;
    const codo = [lerp(x + l * R * 1.6, x + l * R * 1.25, u), lerp(y + R * 2.9, y - R * 0.5, u)];
    const mano = [lerp(x + l * R * 1.45, x + l * R * 0.85 + mueve, u), lerp(y + R * 4.1, y - R * 2.1, u)];
    s += doble([[x + l * R * 1.1, y + R * 1.45], codo, mano]) + punto(mano[0], mano[1], R * 0.2, '#050608');
  }
  s += `<circle cx="${x}" cy="${y}" r="${R}" fill="url(#headInfectadoOscuro)" stroke="#050608" stroke-width="${R * 0.1}"/>`;
  s += `<path d="M${x - R * 0.5} ${y - R * 0.6} q${R * 0.3} ${R * 0.2} ${R * 0.5} ${R * 0.05}" fill="none" stroke="#23262b" stroke-width="${R * 0.08}"/>`;
  return s;
}
ESCENAS.amontonan = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)"><path d="M-20 1200 V820 h140 v-90 h170 v140 h120 v-200 h160 v170 h140 v-110 h160 v160 h150 V1200z" fill="#0d1320" stroke="${INK}" stroke-width="6"/></g>
    <circle cx="540" cy="200" r="300" fill="${ROJO}" opacity=".18" filter="url(#blur10)" id="am-halo"/>
    <g id="am-poste">${poste(540, 230, 1.4, 1400)}</g>
    <g id="am-gente" filter="url(#ink)"></g>
    ${viñeta}`),
  camara: { claves: [[INI.amontonan, 1.0, 0, 0], [M.empujan, 1.1, 0, 40], [M.estiran, 1.2, 0, 150], [FIN('amontonan'), 1.26, 0, 180]], origen: '540px 900px' },
  update(lt, dur, t) {
    animaPoste($('#esc-amontonan'), t, true);
    $('#am-halo').setAttribute('opacity', 0.1 + 0.15 * pulsoRojo(t));
    $('#am-gente').innerHTML = montonCerca.map(p => espalda(p, t)).join('');
  },
};

// 7. El patio queda vacío por primera vez en tres días.
ESCENAS.vacio = {
  html: lienzo(patioArriba('va')),
  camara: { claves: [[INI.vacio, 1.22, 40, -40], [FIN('vacio'), 1.0, 0, 0]] },
  update(lt, dur, t) {
    animaPoste($('#esc-vacio'), t, true);
    $('#va-gente').innerHTML = patioGente.slice().sort((a, b) => a.ty - b.ty).map(p => enElPoste(p, p.tx, p.ty, t)).join('') +
      [0, 1, 2].map(k => { const x = ((t * (90 + k * 30) + k * 400) % 1300) - 100, y = 1150 + k * 120 + Math.sin(t * 3 + k) * 20;
        return `<rect x="${x}" y="${y}" width="34" height="24" fill="#c9c3b5" stroke="${INK}" stroke-width="3" transform="rotate(${t * 140 + k * 60} ${x + 17} ${y + 12})"/>`; }).join('');
    $('#va-rojo').setAttribute('opacity', 0.05 * pulsoRojo(t));
  },
};

// 8. Chispa sigue aullando y nadie la escucha. Tú, junto a ella, viendo hacia afuera.
ESCENAS.nadie = {
  html: lienzo(cuartoNoche('na')),
  camara: { claves: [[INI.nadie, 1.05, 0, 0], [M.escucha, 1.15, -40, 60], [FIN('nadie'), 1.2, -60, 80]] },
  update(lt, dur, t) {
    animaPoste($('#esc-nadie'), t, true);
    rojoCuarto('na', t);
    const [sx, sy] = hocicoSentada(680, PISO - 130, 1.1, 1);
    const respira = Math.sin(t * 2.2) * 3;
    $('#na-cosas').innerHTML = chispaSentada(680, PISO - 130, 1.1, 0.95 + 0.05 * Math.sin(t * 5)) + ondasFrente(sx, sy, -33, t, 420) +
      tuNoche({ head: [330, 950 + respira], r: 95, neck: [335, 1050 + respira], hip: [370, 1220],
        armL: [[500, 1110], [620, 1150]], armR: [[300, 1150], [290, 1230]],
        legL: [[480, 1230], [470, PISO]], legR: [[300, 1260], [210, PISO]], footL: -1, footR: -1, look: 30, lookY: -8, eyeScale: 1.2 });
  },
};

// 9. Tomas el tiempo: 90 segundos.
ESCENAS.cronometro = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#0b0f17"/>
    <rect id="cr-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    <g filter="url(#ink)" transform="rotate(-4 540 880)">
      <rect x="290" y="330" width="500" height="1070" rx="60" fill="#0b0f17" stroke="#3a4150" stroke-width="10"/>
      <rect x="312" y="360" width="456" height="1010" rx="40" fill="#10161f"/>
      <text x="350" y="420" font-family="Oswald" font-weight="600" font-size="32" fill="#e9edef">3:15</text>
      <text x="730" y="420" text-anchor="end" font-family="Oswald" font-weight="600" font-size="32" fill="#e9edef">▮▯▯ 19%</text>
      <text x="540" y="530" text-anchor="middle" font-family="Oswald" font-weight="600" font-size="46" letter-spacing="3" fill="#8696a0">TEMPORIZADOR</text>
      <circle cx="540" cy="820" r="190" fill="none" stroke="#2a3942" stroke-width="22"/>
      <circle id="cr-anillo" cx="540" cy="820" r="190" fill="none" stroke="${ROJO}" stroke-width="22" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" transform="rotate(-90 540 820)"/>
      <text id="cr-num" x="540" y="865" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="130" fill="#fff">1:30</text>
      <circle id="cr-boton" cx="540" cy="1170" r="86" fill="#1e9b4b" stroke="${INK}" stroke-width="6"/>
      <text id="cr-bt" x="540" y="1184" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="38" fill="#fff">INICIAR</text>
      ${[760, 850, 940, 1030].map(y => `<rect x="250" y="${y}" width="70" height="66" rx="30" fill="${INK}"/>`).join('')}
      <g id="cr-pulgar"></g>
    </g>
    ${viñeta}`),
  camara: { claves: [[INI.cronometro, 1.0, 0, 0], [M.noventa, 1.08, 0, 20], [FIN('cronometro'), 1.15, 0, 30]], origen: '540px 850px' },
  update(lt, dur, t) {
    const s = restante(t), n = Math.ceil(s - 1e-6), corre = t >= M.noventa;
    $('#cr-num').textContent = reloj(n);
    $('#cr-anillo').setAttribute('stroke-dashoffset', 1 - s / 90);
    $('#cr-boton').setAttribute('fill', corre ? ROJO : '#1e9b4b');
    $('#cr-bt').textContent = corre ? 'DETENER' : 'INICIAR';
    const ida = ease.outCubic(clamp((t - M.noventa + 0.55) / 0.35)), vuelta = ease.inOut(clamp((t - M.noventa - 0.1) / 0.4));
    const k = ida - vuelta, px = lerp(900, 560, k), py = lerp(1500, 1190, k);
    $('#cr-pulgar').innerHTML = k > 0.01 ? `<path d="M1100 1600 L${px + 40} ${py + 40}" stroke="${INK}" stroke-width="90" stroke-linecap="round"/><ellipse cx="${px}" cy="${py}" rx="62" ry="54" fill="${INK}"/>` : '';
    $('#cr-rojo').setAttribute('opacity', 0.08 * pulsoRojo(t));
  },
};

// 10. Pruebas: arrastras una silla. Nada. Tiras una lata. Nada.
ESCENAS.prueba = {
  html: lienzo(`<g id="pr-a">${cuartoNoche('pr')}</g><g id="pr-b" style="display:none">${montonArriba('pm')}</g>`),
  fijo: `<div class="reloj-mini" id="pr-reloj">1:30</div>
    <div class="onomato" id="pr-rrr" style="top:1300px;left:430px;font-size:120px;opacity:0">RRRRRR</div>
    <div class="onomato" id="pr-clank" style="top:1000px;left:520px;font-size:150px;opacity:0">¡CLANK!</div>
    <div class="full" id="pr-negro" style="background:#000;opacity:0"></div>`,
  camara: { de: { s: 1.0, x: 0, y: 0 }, a: { s: 1.04, x: 0, y: 0 } },
  update(lt, dur, t) {
    animaReloj($('#pr-reloj'), t);
    // fases: cuarto (silla), montón (nada), cuarto (lata), montón (nada)
    const enMonton = (t >= M.nada1 - 0.1 && t < M.lata - 0.25) || t >= M.nada2 - 0.1;
    $('#pr-a').style.display = enMonton ? 'none' : '';
    $('#pr-b').style.display = enMonton ? '' : 'none';
    const cortes = [M.nada1 - 0.1, M.lata - 0.25, M.nada2 - 0.1];
    $('#pr-negro').style.opacity = Math.max(0, ...cortes.map(c => t >= c ? clamp(1 - (t - c) / 0.1) : 0));
    const esc = $('#esc-prueba');
    animaPoste(esc, t, true);
    if (enMonton) { animaMonton.call(ESCENAS.prueba, 'pm', t, null, 1); }
    else {
      rojoCuarto('pr', t);
      const arr = ease.inOut(clamp((t - SILLA[0]) / (SILLA[1] - SILLA[0])));
      const cx = lerp(760, 520, arr), jala = arr > 0 && arr < 1;
      const x = cx - 250 + (jala ? Math.sin(t * 30) * 4 : 0);
      let s = `<path d="M${cx + 90} ${PISO + 6} L760 ${PISO + 6} M${cx - 90} ${PISO + 6} L590 ${PISO + 6}" stroke="#1a120c" stroke-width="5" opacity="${arr > 0 ? 0.8 : 0}"/>`;
      s += silla(cx, jala ? -6 : 0);
      s += tuNoche({ head: [x - 40, 860], r: 92, neck: [x - 26, 965], hip: [x + 10, 1130],
        armL: [[x + 110, 1010], [cx - 100, 950]], armR: [[x + 100, 1040], [cx - 96, 1000]],
        legL: [[x + 60, 1210], [x + 90, PISO]], legR: [[x - 50, 1200], [x - 70, PISO]], footL: 1, footR: -1, look: 18, eyeScale: 1.15 });
      // la lata: cae desde tu mano, rebota y rueda
      const tl = t - (LATA - 0.33);
      if (t > M.lata - 0.25) {
        const g = 2 * (PISO - 50 - 640) / (0.33 * 0.33);
        let ly, lx = 640, la = 0;
        if (tl < 0) ly = 640;
        else if (tl < 0.33) { ly = 640 + 0.5 * g * tl * tl; la = tl * 200; }
        else { const b = tl - 0.33; ly = PISO - 50 - Math.max(0, 260 * b - 0.5 * g * b * b); lx = 640 + 260 * b; la = 66 + 400 * b; }
        s += lata(lx, ly, Math.min(la, 90));
        const mano = t < LATA - 0.33 ? 1 : clamp(1 - (t - LATA + 0.33) / 0.3);
        s += `<path d="M1100 380 L${lerp(1100, 700, mano)} ${lerp(380, 600, mano)}" stroke="${INK}" stroke-width="36" stroke-linecap="round"/><circle cx="${lerp(1100, 700, mano)}" cy="${lerp(380, 600, mano)}" r="${44 * mano}" fill="${INK}"/>`;
      }
      $('#pr-cosas').innerHTML = s;
    }
    const rrr = $('#pr-rrr'), ra = t > SILLA[0] && t < SILLA[1] && !enMonton;
    rrr.style.opacity = ra ? 1 : 0;
    rrr.style.transform = `translate(${Math.sin(t * 40) * 6}px, ${Math.cos(t * 35) * 4}px)`;
    escribe(rrr, t, SILLA[0], 0.8);
    const ck = $('#pr-clank'), cp = clamp((t - LATA) / 0.15);
    ck.style.opacity = t > LATA && t < M.nada2 - 0.1 ? 1 : 0;
    ck.style.transform = `rotate(-8deg) scale(${lerp(1.5, 1, ease.outCubic(cp))})`;
  },
};

// 11. Diez segundos. Chispa no se calla.
ESCENAS.diez = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#paredNoche)"/>
    <g id="di-ondas"></g>
    <g id="di-cara" filter="url(#ink)"></g>
    <rect id="di-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`),
  fijo: `<div class="reloj-grande" id="di-reloj">0:10</div>`,
  camara: { claves: [[INI.diez, 1.0, 0, 0], [M.nocalla, 1.12, 0, -20], [FIN('diez'), 1.25, 0, -40]], origen: '540px 1100px' },
  update(lt, dur, t) {
    animaReloj($('#di-reloj'), t);
    const au = 0.85 + 0.15 * Math.sin(t * 5);
    $('#di-cara').innerHTML = `<g transform="translate(540 1030) rotate(${-12 + Math.sin(t * 3) * 3}) scale(1.08)">${caraChispa({ aullido: au, parpadeo: true })}</g>`;
    $('#di-ondas').innerHTML = ondasLado(540, 1150, t, 330, 140, 1.8);
    $('#di-rojo').setAttribute('opacity', 0.1 + 0.14 * pulsoRojo(t));
  },
};

// 12. Cinco. Le tapas el hocico. Se retuerce. Tres. Dos.
ESCENAS.cinco = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#paredNoche)"/>
    <g id="ci-cara" filter="url(#ink)"></g>
    <rect id="ci-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`),
  fijo: `<div class="reloj-grande" id="ci-reloj">0:05</div>`,
  camara: { claves: [[INI.cinco, 1.05, 0, -20], [M.tapas, 1.12, 0, -30], [M.retuerce, 1.2, 0, -40], [FIN('cinco'), 1.32, 0, -60]], origen: '540px 1050px' },
  update(lt, dur, t) {
    animaReloj($('#ci-reloj'), t);
    const llega = ease.outCubic(clamp((t - M.tapas + 0.2) / 0.25)), tapado = llega >= 1;
    const fuerte = t > M.retuerce - 0.1 ? 1 : tapado ? 0.35 : 0;
    const rot = -10 + (Math.sin(t * 14) * 9 + Math.sin(t * 8.7) * 6) * fuerte;
    const jx = Math.sin(t * 11) * 25 * fuerte, jy = Math.cos(t * 9) * 15 * fuerte;
    const hx = lerp(-700, 0, llega), hy = lerp(900, 200, llega);
    let mano = '';
    if (llega > 0) {
      mano = `<path d="M${hx - 120} ${hy + 80} L-900 1400" stroke="${INK}" stroke-width="120" stroke-linecap="round"/>
        <ellipse cx="${hx}" cy="${hy}" rx="190" ry="125" fill="${INK}"/>
        ${[-135, -45, 45, 135].map(d => `<circle cx="${hx + d}" cy="${hy - 95}" r="48" fill="${INK}"/>`).join('')}
        <ellipse cx="${hx + 195}" cy="${hy + 30}" rx="52" ry="70" fill="${INK}"/>`;
      if (tapado) mano += [-1, 1].map(l => { const f = (t * 2.5) % 1; return `<path d="M${l * (240 + f * 60)} ${hy - 40} q${l * 24} 40 0 80" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="${0.6 * (1 - f)}"/>`; }).join('');
    }
    const au = tapado ? 0.5 : 0.85 + 0.15 * Math.sin(t * 5);
    $('#ci-cara').innerHTML = `<g transform="translate(${540 + jx} ${940 + jy}) rotate(${rot}) scale(0.92)">${caraChispa({ aullido: au, parpadeo: true, orejasAtras: tapado })}${mano}</g>`;
    const latido = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2.6)), 8);
    $('#ci-rojo').setAttribute('opacity', 0.1 + 0.1 * pulsoRojo(t) + 0.12 * latido);
  },
};

// 13. La alerta se calla. El último aullido de Chispa flota en el silencio.
ESCENAS.silencio = {
  html: lienzo(`
    <g id="si-a">
      <rect width="1080" height="1920" fill="url(#cielo)"/>
      <g filter="url(#ink)"><path d="M-20 1920 V1240 h160 v-90 h170 v140 h140 v-200 h160 v170 h140 v-110 h170 v160 h140 V1920z" fill="#0d1320" stroke="${INK}" stroke-width="6"/></g>
      <g id="si-poste">${poste(540, 560, 1.5, 1000)}</g>
      <rect id="si-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
      ${viñeta}
    </g>
    <g id="si-b" style="display:none">${fachadaNoche('sb')}</g>`),
  fijo: `<div class="reloj-grande" id="si-reloj">0:01</div><div class="full" id="si-negro" style="background:#000;opacity:0"></div>`,
  camara: { claves: [[INI.silencio, 1.0, 0, 0], [LIBRE - 0.01, 1.06, 0, -20], [LIBRE, 1.15, 80, 140], [FIN('silencio'), 1.02, 0, 10]] },
  update(lt, dur, t) {
    const suena = t < M.calla;
    animaPoste($('#si-a'), t, suena);
    $('#si-rojo').setAttribute('opacity', suena ? 0.14 * pulsoRojo(t) : 0);
    const r = $('#si-reloj');
    animaReloj(r, t);
    r.style.opacity = t < M.calla ? 1 : clamp(1 - (t - M.calla - 0.25) / 0.2);
    const b = t >= LIBRE;
    $('#si-a').style.display = b ? 'none' : '';
    $('#si-b').style.display = b ? '' : 'none';
    $('#si-negro').style.opacity = b ? clamp(1 - (t - LIBRE) / 0.15) : 0;
    animaPoste($('#si-b'), t, false);
    if (b) $('#sb-onda').innerHTML = ondaAullido(t, LIBRE);
  },
};

// 14. Abajo, todas las cabezas giran hacia tu edificio.
ESCENAS.giran = {
  html: lienzo(montonArriba('gi')),
  camara: { claves: [[INI.giran, 1.0, 0, 0], [M.giran, 1.04, 0, 0], [M.edificio, 1.28, 0, -60], [FIN('giran'), 1.38, 0, -80]], origen: '540px 1000px' },
  update(lt, dur, t) {
    animaPoste($('#esc-giran'), t, false);
    animaMonton.call(ESCENAS.giran, 'gi', t, M.giran - 0.35, 0);
  },
};

// 15. Regla 4.
ESCENAS.regla4 = {
  html: hoja([
    { id: 'r4-tit', texto: 'REGLA 4', top: 300, size: 210, peso: 700, rot: -2 },
    { id: 'r4-a', texto: 'Mientras suena', top: 600, size: 124 },
    { id: 'r4-b', texto: 'la alerta,', top: 740, size: 124 },
    { id: 'r4-c', texto: 'el ruido es', top: 880, size: 124 },
    { id: 'r4-d', texto: 'GRATIS.', top: 1010, size: 140, peso: 700 },
    { id: 'r4-e', texto: 'Cuando se calla,', top: 1190, size: 124, roja: true },
    { id: 'r4-f', texto: 'SE PAGA.', top: 1320, size: 150, peso: 700, roja: true, rot: -3 },
  ], subrayado('r4-sub', 'M190 1500 q150 -18 300 4 t280 -8')),
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.05, x: 0, y: -10 } },
  update(lt, dur, t) {
    escribe($('#r4-tit'), t, INI.regla4 + 0.05, 0.6);
    escribe($('#r4-a'), t, M.mientras, 0.7);
    escribe($('#r4-b'), t, M.mientras + 0.85, 0.5);
    escribe($('#r4-c'), t, M.gratis - 0.6, 0.5);
    escribe($('#r4-d'), t, M.gratis + 0.15, 0.4);
    escribe($('#r4-e'), t, M.paga - 1.08, 0.7);
    escribe($('#r4-f'), t, M.paga, 0.45);
    trazo($('#r4-sub'), t, M.paga + 0.5, 0.4);
  },
};

// 16. Memo te escribe a las 3:17.
ESCENAS.memo = {
  html: chatPrivado('mm', 'Memo 101', '🔑', '3:17', '19%',
    `<div class="pill">AYER</div><div class="msg"><div class="who" style="color:#e5a83b">Memo 101</div>te cambio comida x un garrafon 👍<div class="t">10:02</div></div>`,
    [{ texto: 'mañana a las 3:14 bajo a la tienda de don chucho', hora: '3:17', color: '#e5a83b' },
     { texto: '90 segundos. vienes o te mueres de hambre?', hora: '3:17', color: '#e5a83b', borde: '#e0312b' }]),
  camara: { de: { s: 1.12, x: 0, y: 40 }, a: { s: 1.18, x: 0, y: 50 }, origen: '40px 600px' },
  update(lt, dur, t) { animaMensajes('mm', t, [INI.memo + 0.3, M.memo]); },
};

// 17. Cierre: parte 6.
ESCENAS.parte6 = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<g filter="url(#ink)" id="p6-mono"></g>`)}
    <div class="p2" id="p6-txt">PARTE 6 <span>→</span></div>
    <div class="p2b" id="p6-sig">SÍGUEME</div>`,
  update(lt) {
    const ola = Math.sin(lt * 9) * 28;
    $('#p6-mono').innerHTML = stick({ head: [540, 470], r: 110, neck: [540, 580], hip: [540, 830],
      legL: [[515, 950], [500, 1060]], legR: [[565, 950], [580, 1060]], footL: -1, footR: 1,
      armL: [[495, 730], [470, 830]], armR: [[630, 600], [680 + ola, 470]], look: 0 }) +
      `<g transform="translate(760 1000) scale(-0.7 0.7)">${perro('echada')}</g>`;
    $('#p6-txt').style.transform = `scale(${lerp(0.6, 1, ease.outBack(clamp(lt / 0.35)))})`;
    $('#p6-sig').style.opacity = clamp((lt - 0.3) / 0.25);
  },
};
