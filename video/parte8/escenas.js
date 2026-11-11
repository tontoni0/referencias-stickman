// Escenas de "La alerta", parte 8: La primera noche. Final de temporada, versión 🐕 (ganó en la parte 7):
// entras al 402 con Chispa, Memo se queda arriba, Rosa revela el radio y la alerta suena sin que ella la toque.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const LLAVES_PISO = INI.patio + 0.45;   // el llavero pega en el patio
const CERILLO = INI.vela + 0.25;         // Rosa raspa el cerillo

const infEn = (x, y, h, cuerpo) => `<g transform="translate(${x} ${y}) scale(${h})">${cuerpo}</g>`;
const tuNoche = o => `<g filter="url(#contorno)">${stick(o)}</g>`;
const pop = (el, t, t0, d = 0.3) => { const p = clamp((t - t0) / d); el.style.opacity = p; el.style.transform = `scale(${lerp(0.7, 1, ease.outBack(p))})`; };
const PISO = 1450;

// La cocina del 402: pared, piso y la ventana con la cortina rosa. ventana: 0..1 qué tanto está cerrada la hoja de abajo.
function cocina(pre, rojo = false) {
  return `
    <rect width="1080" height="1920" fill="#2a2026"/>
    <g filter="url(#ink)">
      <rect x="-20" y="${PISO}" width="1120" height="500" fill="#1a130e" stroke="${INK}" stroke-width="8"/>
      <rect x="560" y="420" width="400" height="630" fill="url(#cielo)" stroke="${INK}" stroke-width="10"/>
      <path d="M560 1050 V880 h60 v-50 h70 v80 h60 v-120 h80 v100 h60 v-60 h70 V1050z" fill="#0d1320"/>
    </g>
    <g id="${pre}-afuera"></g>
    <g id="${pre}-hoja" filter="url(#ink)"></g>
    <g filter="url(#ink)">
      <rect x="560" y="420" width="400" height="630" fill="none" stroke="#9aa3ad" stroke-width="14"/>
      <path d="M540 410 H980 V500 Q900 525 820 500 Q740 525 660 500 Q600 515 540 500 Z" fill="#d8a7b5" stroke="${INK}" stroke-width="6"/>
      <path d="M540 500 H600 Q590 800 575 1060 H540 Z" fill="#d8a7b5" stroke="${INK}" stroke-width="6"/>
      <path d="M980 500 H925 Q935 800 945 1060 H980 Z" fill="#c995a6" stroke="${INK}" stroke-width="6"/>
      <rect x="530" y="1050" width="460" height="30" fill="#8a7f78" stroke="${INK}" stroke-width="7"/>
    </g>
    <g id="${pre}-cosas"></g>
    <rect id="${pre}-rojo" width="1080" height="1920" fill="${ROJO}" opacity="${rojo ? 0.15 : 0}"/>
    ${viñeta}`;
}
// La hoja de abajo de la ventana: sube (abierta) o baja (cerrada) y el seguro gira.
const hojaVentana = cierra => {
  const y = lerp(770, 1040, 1 - cierra), h = 1040 - y;
  return `<rect x="570" y="${y}" width="380" height="${Math.max(0, h)}" fill="rgba(160,190,220,.18)" stroke="#9aa3ad" stroke-width="10"/>
    <g transform="rotate(${-80 * (1 - cierra)} 760 ${y + 8})"><rect x="740" y="${y}" width="60" height="18" rx="6" fill="#c9a43a" stroke="${INK}" stroke-width="4"/></g>`;
};
const rosaDe = (x, y, r, o = {}) => rosa({ head: [x, y], r, neck: [x + 4, y + r * 1.05], hip: [x + 10, y + r * 3.4],
  legL: [[x - 10, y + r * 4.4], [x - 20, y + r * 5.4]], legR: [[x + 30, y + r * 4.4], [x + 40, y + r * 5.4]], footL: -1, footR: 1,
  armL: o.armL || [[x - r * 0.9, y + r * 2.2], [x - r * 1.0, y + r * 3.0]], armR: o.armR || [[x + r * 0.9, y + r * 2.2], [x + r * 1.0, y + r * 3.0]],
  brazosAlFrente: true, look: o.look || 0, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1 });
const vela = (x, y, t, s = 1) => {
  const fl = Math.sin(t * 17) * 4 + Math.sin(t * 11) * 3;
  return `<circle cx="${x}" cy="${y - 40 * s}" r="${260 * s}" fill="url(#luzCalida)"/>
    <rect x="${x - 17 * s}" y="${y}" width="${34 * s}" height="${110 * s}" fill="#efe6cf" stroke="${INK}" stroke-width="${5 * s}"/>
    <path d="M${x} ${y} q${-17 * s} ${-28 * s} 0 ${-(62 + fl) * s} q${17 * s} ${(34 + fl / 2) * s} 0 ${(62 + fl) * s} z" fill="#f3c46a" stroke="#c9792b" stroke-width="3"/>`;
};
// Tú de lado con Chispa en brazos (como en la parte 6): cuerpo, Chispa y los brazos encima.
const tuConChispa = (x, y, look, tiembla = 0) => {
  const r = 95, sh = [x + 10, y + 95 + r * 0.4];
  const brazo = (c, m) => linea([sh, c, m], r * 0.085) + punto(m[0], m[1], r * 0.1);
  return `<g filter="url(#contorno)">${stick({ head: [x, y], r, neck: [x + 10, y + 95], hip: [x + 20, y + 330],
    legL: [[x + 5, y + 435], [x - 20, y + 540]], legR: [[x + 45, y + 435], [x + 60, y + 540]], footL: -1, footR: 1, look, eyeScale: 1.2 })}
    <g transform="translate(${x + 120 + Math.sin(tiembla * 60) * 3 * (tiembla ? 1 : 0)} ${y + 175}) scale(0.55)">${perro('parada')}</g>
    ${brazo([x + 70, y + 200], [x + 150, y + 225])}${brazo([x + 60, y + 150], [x + 140, y + 165])}</g>`;
};

// ---------- 1. Ganó Chispa ----------
ESCENAS.gano = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="1040" r="800" fill="url(#luzCalida)" opacity=".18"/>`)}
    <div class="decide-tit" id="ga-tit">GANÓ</div>
    <div class="opcion" id="ga-a" style="top:560px;font-size:74px;border-color:#e5a83b;box-shadow:0 0 40px rgba(229,168,59,.5)"><span class="emo">🐕</span><span class="txt">ENTRAS CON CHISPA</span></div>
    <div class="opcion" id="ga-b" style="top:900px;font-size:74px"><span class="emo">🔑</span><span class="txt" style="text-decoration:line-through;text-decoration-color:#e0312b;text-decoration-thickness:10px">SUBES POR MEMO</span></div>
    <div class="decide-pie" id="ga-pie" style="top:1260px">LOS COMENTARIOS ELIGIERON</div>`,
  camara: { claves: [[0, 1.0, 0, 0], [FIN('gano'), 1.08, 0, 30]], origen: '540px 760px' },
  update(lt, dur, t) {
    pop($('#ga-tit'), t, 0.02, 0.25);
    pop($('#ga-a'), t, 0.1, 0.3);
    $('#ga-a').style.transform += ` scale(${1 + 0.035 * Math.sin(t * 8)})`;
    $('#ga-b').style.opacity = 0.35;
    $('#ga-pie').style.opacity = clamp((t - 0.6) / 0.3);
  },
};

// ---------- 2. Rosa te jala hacia adentro y cierra la ventana ----------
ESCENAS.entras = {
  html: lienzo(cocina('en')),
  camara: { claves: [[INI.entras, 1.15, -80, 60], [M.cierraV, 1.1, -60, 40], [FIN('entras'), 1.18, -100, 30]] },
  update(lt, dur, t) {
    const cae = ease.inOut(clamp((t - INI.entras - 0.6) / 0.8));
    const cierra = ease.inOut(clamp((t - M.cierraV + 0.1) / 0.6));
    $('#en-hoja').innerHTML = hojaVentana(cierra);
    let s = '';
    if (cae < 1) {
      // en el marco de la ventana, agachado, con la mano de Rosa en tu muñeca
      const x = lerp(760, 520, cae), y = lerp(860, 1180, cae);
      s += tuNoche({ head: [x, y], r: 80, neck: [x - 10, y + 80], hip: [x + 40, y + 230], legL: [[x + 120, y + 180], [x + 140, y + 270]], legR: [[x + 90, y + 230], [x + 60, y + 280]],
        armL: [[x - 80, y + 120], [x - 150, y + 110]], armR: [[x - 60, y + 160], [x - 110, y + 200]], look: -20, eyeScale: 1.4 });
    } else {
      s += tuNoche({ head: [460, 1150], r: 85, neck: [470, 1235], hip: [500, 1380], legL: [[580, 1400], [600, PISO]], legR: [[440, 1420], [400, PISO]],
        armL: [[400, 1300], [380, 1390]], armR: [[560, 1290], [620, 1340]], look: 24, lookY: -10, eyeScale: 1.3 });
    }
    s += `<g filter="url(#ink)">${rosaDe(860, 860, 80, { armL: [[790, 1000], [lerp(700, 790, cierra), lerp(980, 1000, cierra)]], look: -22 })}</g>`;
    $('#en-cosas').innerHTML = s;
  },
};

// ---------- 3. Chispa se te echa encima y te lame la cara. La placa con cinta no suena ----------
ESCENAS.lame = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#2a2026"/>
    <circle cx="540" cy="900" r="760" fill="url(#luzCalida)" opacity=".75"/>
    <rect y="1480" width="1080" height="440" fill="#1a130e"/>
    <g id="la-todo" filter="url(#ink)"></g>
    <circle id="la-brillo" cx="879" cy="1244" r="70" fill="#fff" opacity="0" filter="url(#blur10)"/>
    ${viñeta}`),
  camara: { claves: [[INI.lame, 1.0, 0, 0], [M.placa - 0.1, 1.08, 0, -20], [M.placa + 0.7, 1.6, -320, -440], [FIN('lame'), 1.65, -320, -470]] },
  update(lt, dur, t) {
    const lame = t > M.lameM - 0.3 ? 0.5 + 0.5 * Math.sin((t - M.lameM) * 8) : 0;
    const salta = ease.outBack(clamp((t - INI.lame) / 0.45));
    let s = `<g transform="translate(${Math.sin(t * 9) * 2} 0)">${paliacate(330, 900, 230)}${cabeza(330, 900, 230, { look: 40, eyeScale: lame > 0.6 ? 1.1 : 1.3, lookY: -6 })}</g>`;
    s += `<g transform="translate(${lerp(1100, 700, salta)} 860) rotate(-25) scale(0.7)">${caraChispa({ lengua: 0.35 + 0.65 * lame, parpadeo: lame > 0.5 })}</g>`;
    if (lame > 0.3) s += `<path d="M560 980 q30 -20 20 -60 M590 1010 q40 -10 40 -50" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/>`;
    $('#la-todo').innerHTML = s;
    $('#la-brillo').setAttribute('opacity', t > M.placa ? 0.35 + 0.25 * Math.sin((t - M.placa) * 6) : 0);
  },
};

// ---------- 4. Arriba se apagan los gritos. El llavero pasa cayendo frente a la ventana (en cámara lenta) ----------
const llavero = (x, y, ang, s = 1) => `<g transform="translate(${x} ${y}) rotate(${ang}) scale(${s})">
  <circle cx="0" cy="0" r="44" fill="none" stroke="#b8bec6" stroke-width="10"/>
  ${[-30, -8, 16, 38].map((a, i) => `<g transform="rotate(${a})"><rect x="-9" y="40" width="18" height="${i === 2 ? 150 : 120}" rx="5" fill="#c9a43a" stroke="${INK}" stroke-width="4"/>
    <path d="M9 ${i === 2 ? 160 : 130} h18 v12 h-10 v10 h12 v12 h-20" fill="#c9a43a" stroke="${INK}" stroke-width="3"/></g>`).join('')}
  <g transform="rotate(16) translate(14 190) rotate(10)"><rect x="-10" y="0" width="170" height="70" rx="8" fill="#efe6cf" stroke="${INK}" stroke-width="5"/>
    <text x="75" y="50" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="50" fill="${TINTA}">TIENDA</text></g></g>`;
ESCENAS.cae = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#2a2026"/>
    <g filter="url(#ink)"><rect x="140" y="260" width="800" height="1060" fill="url(#cielo)" stroke="${INK}" stroke-width="12"/>
      <path d="M140 1320 V1000 h120 v-80 h140 v120 h120 v-200 h160 v170 h140 v-90 h120 V1320z" fill="#0d1320"/></g>
    <g id="ca-llaves" filter="url(#ink)"></g>
    <g filter="url(#ink)"><rect x="140" y="260" width="800" height="1060" fill="none" stroke="#9aa3ad" stroke-width="18"/>
      <line x1="540" y1="260" x2="540" y2="1320" stroke="#9aa3ad" stroke-width="12"/>
      <path d="M120 250 H960 V370 Q850 400 740 370 Q630 400 520 370 Q410 400 300 370 Q210 390 120 370 Z" fill="#d8a7b5" stroke="${INK}" stroke-width="6"/></g>
    <g filter="url(#contorno)"><g filter="url(#ink)">
      <circle cx="260" cy="1470" r="150" fill="url(#headShade)" stroke="${INK}" stroke-width="10"/>
      <path d="M190 1600 L260 1640 L330 1600 L260 1700 Z" fill="#c8282e" stroke="${INK}" stroke-width="6"/>
      <circle cx="840" cy="1490" r="95" fill="#6e4325" stroke="${INK}" stroke-width="9"/>
      <path d="M805 1405 l16 -80 l36 72 z" fill="#5a361d" stroke="${INK}" stroke-width="7"/><path d="M895 1425 q55 -18 62 26 q-26 -6 -54 4 z" fill="#5a361d" stroke="${INK}" stroke-width="7"/>
    </g></g>
    ${viñeta}`),
  camara: { claves: [[INI.cae, 1.0, 0, 0], [M.cayendo, 1.04, 0, 20], [M.llavero + 0.4, 1.16, 0, 40], [FIN('cae'), 1.2, 0, 50]], origen: '540px 800px' },
  update(lt, dur, t) {
    const p = clamp((t - M.cayendo - 0.15) / (M.llavero + 0.5 - M.cayendo));
    const y = lerp(-300, 1500, p), ang = p * 540;
    $('#ca-llaves').innerHTML = p > 0 && p < 1 ? `${[1, 2, 3].map(k => `<line x1="${560 + k * 8}" y1="${y - 160 - k * 60}" x2="${560 + k * 8}" y2="${y - 380 - k * 60}" stroke="#fff" stroke-width="5" opacity=".3"/>`).join('')}${llavero(560, y, ang, 1.4)}` : '';
  },
};

// ---------- 5. El llavero cae al patio, entre ellos ----------
const monton = (() => {
  const r = rng(77), g = [];
  for (let i = 0; i < 24; i++) {
    const a = r() * Math.PI * 2, d = 0.35 + Math.sqrt(r()) * 0.75;
    g.push({ x: 540 + Math.cos(a) * d * 420, y: 1000 + Math.sin(a) * d * 330, s: 0.85 + r() * 0.35, d: r() * 0.5, i });
  }
  return g.sort((a, b) => a.y - b.y);
})();
ESCENAS.patio = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#2f3440"/>
    <g stroke="#282c37" stroke-width="4">${[...Array(13)].map((_, k) => `<line x1="0" y1="${340 + k * 130}" x2="1080" y2="${340 + k * 130}"/>`).join('')}${[...Array(8)].map((_, k) => `<line x1="${k * 150}" y1="300" x2="${k * 150}" y2="1920"/>`).join('')}</g>
    <rect width="1080" height="300" fill="#3b3530"/>
    <ellipse cx="540" cy="1000" rx="560" ry="420" fill="url(#luzLuna)" opacity=".25"/>
    <g id="pa-llaves" filter="url(#ink)"></g>
    <g id="pa-gente" filter="url(#ink)"></g>
    ${viñeta}`),
  camara: { claves: [[INI.patio, 1.0, 0, 0], [LLAVES_PISO, 1.05, 0, 0], [M.entre, 1.35, 0, -40], [FIN('patio'), 1.42, 0, -50]], origen: '540px 1000px' },
  update(lt, dur, t) {
    const c = clamp((t - INI.patio) / (LLAVES_PISO - INI.patio));
    const s = lerp(3.2, 0.62, ease.inOut(c)), rebota = t > LLAVES_PISO ? Math.abs(Math.sin((t - LLAVES_PISO) * 12)) * 18 * Math.exp(-(t - LLAVES_PISO) * 5) : 0;
    $('#pa-llaves').innerHTML = llavero(540, 990 - rebota, 20 + c * 200, s);
    $('#pa-gente').innerHTML = monton.map(p => {
      const giro = ease.outCubic(clamp((t - LLAVES_PISO - 0.1 - p.d) / 0.35));
      const ax = (540 - p.x), ay = (1000 - p.y), n = Math.hypot(ax, ay) || 1;
      const ox = ax / n * 12 * giro, oy = ay / n * 12 * giro;
      return `<g transform="translate(${p.x} ${p.y}) scale(${p.s})"><ellipse cx="0" cy="36" rx="54" ry="27" fill="#3d4048" stroke="${INK}" stroke-width="5"/>
        <circle r="38" fill="url(#headInfectadoOscuro)" stroke="${INK}" stroke-width="6"/>
        <g opacity="${giro}" style="filter:drop-shadow(0 0 6px #fff)"><ellipse cx="${-11 + ox}" cy="${-2 + oy}" rx="6" ry="9" fill="#f2f2f2"/><ellipse cx="${11 + ox}" cy="${-2 + oy}" rx="6" ry="9" fill="#f2f2f2"/></g></g>`;
    }).join('');
  },
};

// ---------- 6 y 7. Rosa prende una vela: su cara. "Llegó por mi ventana, corazón. Igual que tu botella." ----------
ESCENAS.vela = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#08070a"/>
    <g id="ve-luz"></g>
    <g id="ve-rosa" filter="url(#ink)"></g>
    <g id="ve-vela"></g>
    ${viñeta}`),
  camara: { claves: [[INI.vela, 1.05, 0, 0], [M.cara, 1.12, 0, 40], [FIN('vela'), 1.22, 0, 60]], origen: '540px 900px' },
  update(lt, dur, t) {
    const prende = t > CERILLO ? clamp((t - CERILLO) / 0.6) : 0;
    const flash = t > CERILLO ? Math.exp(-(t - CERILLO) * 6) : 0;
    $('#ve-luz').innerHTML = `<circle cx="660" cy="1150" r="${900 * prende + 200 * flash}" fill="url(#luzCalida)" opacity="${0.4 + 0.6 * prende}"/>`;
    $('#ve-rosa').innerHTML = `<g opacity="${0.15 + 0.85 * prende}">${rosaDe(460, 760, 220, { look: 30, lookY: 10, eyeScale: 1.1,
      armL: [[300, 1400], [320, 1600]], armR: [[650, 1300], [680, 1180]] })}
      ${[[412, 755], [500, 755]].map(([x, y]) => `<path d="M${x + 20} ${y - 10} q-6 -10 0 -22 q6 12 0 22z" fill="#f3c46a" opacity="${0.8 * prende}"/>`).join('')}</g>`;
    $('#ve-vela').innerHTML = (prende > 0 ? vela(690, 1180, t, 1.1) : '') +
      (t > CERILLO - 0.3 && t < CERILLO + 0.8 ? `<line x1="680" y1="1170" x2="${700 + 30 * (1 - prende)}" y2="1100" stroke="#8a603f" stroke-width="8"/><circle cx="${700 + 30 * (1 - prende)}" cy="1095" r="${12 + 20 * flash}" fill="#ffd27a"/>` : '');
  },
};

const botella2L = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-40 0 Q-50 -40 -48 -150 Q-48 -190 -20 -215 L-20 -250 L20 -250 L20 -215 Q48 -190 48 -150 Q50 -40 40 0 Z" fill="rgba(190,215,250,.25)" stroke="${INK}" stroke-width="6"/>
  <path d="M-46 0 Q-50 -40 -48 -110 L48 -110 Q50 -40 46 0 Z" fill="rgba(110,160,225,.5)"/>
  <rect x="-24" y="-275" width="48" height="28" rx="6" fill="#2f6fd6" stroke="${INK}" stroke-width="5"/>
  <path d="M-24 -262 q-50 20 -40 120 M24 -262 q30 30 26 90" fill="none" stroke="#d9c9a0" stroke-width="9"/>
  <rect x="-48" y="-160" width="96" height="40" fill="#e0e4ea" opacity=".8"/></g>`;
ESCENAS.botella = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#2a2026"/>
    <circle cx="560" cy="1050" r="820" fill="url(#luzCalida)" opacity=".85"/>
    <g filter="url(#ink)">
      <rect y="${PISO}" width="1080" height="500" fill="#1a130e"/>
      <rect x="620" y="900" width="420" height="26" fill="#5a4030" stroke="${INK}" stroke-width="6"/>
      ${botella2L(830, 898, 1.1)}
      <rect x="430" y="1180" width="320" height="30" fill="#5a4030" stroke="${INK}" stroke-width="6"/><line x1="460" y1="1210" x2="460" y2="${PISO}" stroke="#4a3428" stroke-width="18"/><line x1="720" y1="1210" x2="720" y2="${PISO}" stroke="#4a3428" stroke-width="18"/>
    </g>
    <g id="bo-cosas"></g>
    ${viñeta}`),
  camara: { claves: [[INI.botella, 1.05, 100, 0], [M.botella - 0.3, 1.05, 100, 0], [M.botella + 0.3, 1.45, -300, 100], [FIN('botella'), 1.5, -310, 110]] },
  update(lt, dur, t) {
    $('#bo-cosas').innerHTML = vela(600, 1080, t, 0.9) +
      `<g filter="url(#ink)">${rosaDe(280, 760, 110, { look: 26, lookY: 6, armL: [[200, 1010], [190, 1120]], armR: [[370, 1000], [430, 1060]] })}</g>` +
      `<g filter="url(#contorno)"><g transform="translate(560 ${PISO - 118 * 0.8}) scale(0.8)">${perroSentada(0)}</g></g>`;
  },
};

// ---------- 8 y 9. La mesa: el radio con antena de ganchos y la libreta con 3:14 muchas veces ----------
const radioViejo = (x, y, t, prendido = 0) => `<g transform="translate(${x} ${y})" filter="url(#ink)">
  <rect x="-230" y="-170" width="460" height="300" rx="34" fill="#6b4a2f" stroke="${INK}" stroke-width="9"/>
  <rect x="-200" y="-140" width="220" height="240" rx="18" fill="#3a2a1c" stroke="${INK}" stroke-width="6"/>
  ${[...Array(9)].map((_, i) => `<line x1="-190" y1="${-125 + i * 26}" x2="10" y2="${-125 + i * 26}" stroke="#2a1d13" stroke-width="7"/>`).join('')}
  <rect x="45" y="-140" width="160" height="90" rx="10" fill="${prendido ? '#ffcf7a' : '#d9c79a'}" stroke="${INK}" stroke-width="6"/>
  ${[0, 1, 2, 3, 4, 5].map(i => `<line x1="${60 + i * 26}" y1="-130" x2="${60 + i * 26}" y2="-112" stroke="${INK}" stroke-width="3"/>`).join('')}
  <line x1="${110 + Math.sin(t * 0.7) * 6}" y1="-136" x2="${110 + Math.sin(t * 0.7) * 6}" y2="-58" stroke="${ROJO}" stroke-width="5"/>
  <circle cx="85" cy="40" r="38" fill="#9aa3ad" stroke="${INK}" stroke-width="6"/><circle cx="170" cy="40" r="38" fill="#9aa3ad" stroke="${INK}" stroke-width="6"/>
  <line x1="85" y1="40" x2="85" y2="10" stroke="${INK}" stroke-width="6"/><line x1="170" y1="40" x2="190" y2="16" stroke="${INK}" stroke-width="6"/>
  <path d="M150 -170 L190 -420 L120 -470 L260 -470 L190 -420 M190 -470 L230 -640 L170 -680 L290 -680 L230 -640" fill="none" stroke="#b8bec6" stroke-width="8" stroke-linejoin="round"/>
  <path d="M190 -470 q-6 -14 4 -22 M230 -680 q-6 -14 4 -22" fill="none" stroke="#b8bec6" stroke-width="6"/></g>`;
ESCENAS.mesa = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#1d1519"/>
    <circle cx="420" cy="1100" r="900" fill="url(#luzCalida)" opacity=".8"/>
    <g filter="url(#ink)"><rect x="-20" y="1180" width="1120" height="760" fill="#4a3428" stroke="${INK}" stroke-width="9"/>
      <path d="M0 1260 q300 20 600 0 t480 10 M0 1420 q260 -14 540 8 t540 -8" stroke="#3a2a1c" stroke-width="6" fill="none"/></g>
    <g id="me-cosas"></g>
    ${viñeta}`),
  camara: { claves: [[INI.mesa, 1.25, 220, 60], [M.radio, 1.15, -60, 80], [FIN('mesa'), 1.05, -40, 160]], origen: '540px 1000px' },
  update(lt, dur, t) {
    $('#me-cosas').innerHTML = vela(180, 1080, t, 1.0) + radioViejo(640, 1100, t) +
      `<path d="M${400} 1300 l40 -12 l300 10 l-40 14 z" fill="#efe6cf" stroke="${INK}" stroke-width="5" opacity=".9"/>`;
  },
};

// La libreta: 3:14 escrito muchas veces, a mano, con tinta azul. Uno encerrado en rojo.
const LIBRETA = (() => {
  const r = rng(314), l = [];
  for (let f = 0; f < 9; f++) for (let c = 0; c < 3; c++) l.push({ x: 170 + c * 290 + (r() - 0.5) * 30, y: 300 + f * 130 + (r() - 0.5) * 14, g: (r() - 0.5) * 8, k: f * 3 + c });
  return l;
})();
ESCENAS.libreta = {
  html: `<div class="cuaderno"></div>
    ${LIBRETA.map(p => `<div class="tinta" id="li-${p.k}" style="top:${p.y}px;left:${p.x}px;font-size:110px;font-weight:600;transform:rotate(${p.g}deg)">3:14</div>`).join('')}
    ${lienzo(`<ellipse id="li-circulo" cx="560" cy="1022" rx="170" ry="80" pathLength="1" fill="none" stroke="${ROJO}" stroke-width="12" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-6 560 1022)"/>`)}`,
  camara: { claves: [[INI.libreta, 1.0, 0, 0], [M.tres - 0.2, 1.06, 0, 0], [M.tres + 0.5, 1.6, -30, 30], [FIN('libreta'), 1.65, -30, 30]], origen: '560px 1022px' },
  update(lt, dur, t) {
    const d = (M.tres - 0.3 - INI.libreta) / LIBRETA.length;
    LIBRETA.forEach(p => escribe($('#li-' + p.k), t, INI.libreta + 0.1 + p.k * d, 0.35));
    trazo($('#li-circulo'), t, M.tres, 0.5);
  },
};

// ---------- 10. "Trabajé treinta años en el sistema de la alerta": foto vieja y su mano en la perilla ----------
ESCENAS.treinta = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#1d1519"/>
    <circle cx="540" cy="1000" r="900" fill="url(#luzCalida)" opacity=".5"/>
    <g id="tr-foto" filter="url(#ink)">
      <g transform="rotate(-4 540 820)">
        <rect x="150" y="300" width="780" height="1060" fill="#efe6cf" stroke="${INK}" stroke-width="7"/>
        <g style="filter:sepia(1) contrast(1.1)">
          <rect x="190" y="340" width="700" height="860" fill="#3a3a44"/>
          <rect x="230" y="380" width="620" height="300" fill="#22252c" stroke="#111" stroke-width="6"/>
          ${[...Array(5)].map((_, f) => [...Array(9)].map((_, c) => `<circle cx="${270 + c * 66}" cy="${420 + f * 52}" r="12" fill="${(f + c) % 4 ? '#5d636b' : '#e0312b'}"/>`).join('')).join('')}
          <rect x="230" y="700" width="620" height="60" fill="#5d636b" stroke="#111" stroke-width="5"/>
          ${rosaDe(540, 880, 90, { look: 0, armL: [[440, 1060], [400, 1000]], armR: [[640, 1060], [690, 1000]] })}
        </g>
        <text x="540" y="1300" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="70" fill="${TINTA}">Centro de alerta, 1995</text>
      </g>
    </g>
    <g id="tr-mano" opacity="0"></g>
    ${viñeta}`),
  camara: { claves: [[INI.treinta, 1.0, 0, 0], [M.sonar - 0.2, 1.1, 0, -20], [M.sonar, 1.0, 0, 0], [FIN('treinta'), 1.1, 0, -20]] },
  update(lt, dur, t) {
    const mano = t > M.sonar - 0.2;
    $('#tr-foto').style.display = mano ? 'none' : '';
    const g = $('#tr-mano');
    g.setAttribute('opacity', mano ? 1 : 0);
    if (mano) {
      const gira = ease.inOut(clamp((t - M.sonar) / 0.8)) * 70;
      const PIEL = '#e9e2d6';
      g.innerHTML = `<rect width="1080" height="1920" fill="#1d1519"/><circle cx="540" cy="900" r="800" fill="url(#luzCalida)" opacity=".6"/>
        <g filter="url(#ink)"><rect x="140" y="600" width="800" height="700" rx="60" fill="#6b4a2f" stroke="${INK}" stroke-width="12"/>
        <g transform="rotate(${gira} 540 950)"><circle cx="540" cy="950" r="190" fill="#9aa3ad" stroke="${INK}" stroke-width="12"/><line x1="540" y1="950" x2="540" y2="790" stroke="${INK}" stroke-width="16"/></g>
        <path d="M200 1500 L430 1130 L520 1180 L330 1560 Z" fill="#8d8f96" stroke="${INK}" stroke-width="9"/>
        ${[0, 1, 2].map(i => `<rect x="${470 + i * 50}" y="${930 + i * 10}" width="40" height="150" rx="20" fill="${PIEL}" stroke="${INK}" stroke-width="7" transform="rotate(${-10 + gira * 0.3} 540 950)"/>`).join('')}
        <ellipse cx="490" cy="1120" rx="95" ry="70" fill="${PIEL}" stroke="${INK}" stroke-width="8"/></g>`;
    }
  },
};

// ---------- 11. "La de hace rato fui yo": recuerdo en rojo del poste sonando y el patio vaciándose ----------
ESCENAS.rato = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)"><rect y="1250" width="1080" height="700" fill="#2a3140"/></g>
    <g id="ra-poste">${poste(820, 420, 1.0, 900)}</g>
    <g id="ra-gente" filter="url(#ink)"></g>
    ${viñeta}`),
  fijo: `<div class="recuerdo" style="top:150px;color:#ffd9d9">Hace rato</div>`,
  camara: { de: { s: 1.05, x: 0, y: 0 }, a: { s: 1.15, x: -40, y: -20 } },
  update(lt, dur, t) {
    $('#esc-rato .cam').style.filter = 'sepia(1) hue-rotate(-50deg) saturate(3) contrast(1.1) brightness(.85)';
    animaPoste($('#esc-rato'), t, true);
    let g = '';
    for (let k = 0; k < 9; k++) {
      const x = ((t * 420 + k * 170) % 1300) - 200, y = 1330 + (k % 3) * 120, h = 200 + (k % 3) * 40;
      g += `<g transform="translate(${x} ${y}) scale(${h})">${infectadoLado(t * 15 + k)}</g>`;
    }
    $('#ra-gente').innerHTML = g;
  },
};

// ---------- 12. Le das las gracias. Rosa no sonríe ----------
ESCENAS.gracias = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#2a2026"/>
    <circle cx="540" cy="1000" r="820" fill="url(#luzCalida)" opacity=".7"/>
    <g filter="url(#ink)"><rect y="${PISO}" width="1080" height="500" fill="#1a130e"/>
      <rect x="440" y="1180" width="220" height="26" fill="#5a4030" stroke="${INK}" stroke-width="6"/><line x1="470" y1="1206" x2="470" y2="${PISO}" stroke="#4a3428" stroke-width="16"/><line x1="630" y1="1206" x2="630" y2="${PISO}" stroke="#4a3428" stroke-width="16"/></g>
    <g id="gr-cosas"></g>
    ${viñeta}`),
  camara: { claves: [[INI.gracias, 1.0, 0, 0], [M.nosonrie, 1.08, -60, 0], [FIN('gracias'), 1.3, -230, 40]] },
  update(lt, dur, t) {
    const no = ease.inOut(clamp((t - M.nosonrie) / 0.5));
    $('#gr-cosas').innerHTML = vela(550, 1080, t, 0.9) + tuConChispa(220, 900, 24) +
      `<g filter="url(#ink)">${rosaDe(840, 880, 95, { look: lerp(-24, 18, no), lookY: lerp(0, 10, no), armL: [[760, 1110], [750, 1200]], armR: [[920, 1110], [930, 1200]] })}</g>`;
  },
};

// ---------- 13. "La primera noche... yo no la activé" ----------
ESCENAS.primera = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#120d10"/>
    <g id="pr-luz"></g>
    <g id="pr-rosa" filter="url(#ink)"></g>
    ${viñeta}`),
  camara: { claves: [[INI.primera, 1.0, 0, 0], [M.noactive - 0.1, 1.1, 0, 30], [M.noactive + 0.3, 1.32, 0, 90], [FIN('primera'), 1.36, 0, 100]], origen: '540px 820px' },
  update(lt, dur, t) {
    const mira = ease.inOut(clamp((t - M.noactive + 0.2) / 0.3));
    const fl = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 7);
    $('#pr-luz').innerHTML = `<circle cx="760" cy="1250" r="${850 * fl}" fill="url(#luzCalida)" opacity=".85"/>`;
    $('#pr-rosa').innerHTML = rosaDe(520, 800, 250, { look: lerp(-60, 0, mira), lookY: lerp(-10, 6, mira), eyeScale: lerp(1, 1.35, mira),
      armL: [[340, 1400], [330, 1700]], armR: [[700, 1400], [710, 1700]] });
  },
};

// ---------- 14. La alerta empieza a sonar. Rosa no ha tocado el radio ----------
ESCENAS.suena = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#2a2026"/>
    <g filter="url(#ink)">
      <rect x="-20" y="${PISO}" width="1120" height="500" fill="#1a130e" stroke="${INK}" stroke-width="8"/>
      <rect x="120" y="380" width="520" height="560" fill="url(#cielo)" stroke="${INK}" stroke-width="10"/>
    </g>
    <g id="su-poste">${poste(420, 520, 0.55, 800)}</g>
    <g filter="url(#ink)"><rect x="120" y="380" width="520" height="560" fill="none" stroke="#9aa3ad" stroke-width="14"/>
      <path d="M100 370 H660 V450 Q560 475 460 450 Q360 475 260 450 Q180 465 100 450 Z" fill="#d8a7b5" stroke="${INK}" stroke-width="6"/>
      <rect x="560" y="1180" width="480" height="26" fill="#5a4030" stroke="${INK}" stroke-width="6"/></g>
    <g id="su-cosas"></g>
    <rect id="su-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`),
  camara: { claves: [[INI.suena, 1.0, 0, 0], [M.notocado - 0.1, 1.05, 0, 0], [M.notocado + 0.5, 1.35, -200, -100], [FIN('suena'), 1.4, -210, -110]] },
  update(lt, dur, t) {
    const on = t > M.suenaM - 0.4;
    animaPoste($('#esc-suena'), t, on);
    $('#su-rojo').setAttribute('opacity', on ? 0.1 + 0.16 * pulsoRojo(t) : 0);
    const manos = ease.outCubic(clamp((t - M.suenaM) / 0.4));
    $('#su-cosas').innerHTML = radioViejo(820, 1060, t, on ? 1 : 0).replace('translate(820 1060)', 'translate(820 1060) scale(0.7)') +
      `<g filter="url(#ink)">${rosaDe(760, 760, 85, { look: 18, lookY: 4, eyeScale: 1.4,
        armL: [[690, lerp(980, 860, manos)], [lerp(680, 640, manos), lerp(1060, 780, manos)]], armR: [[830, lerp(980, 860, manos)], [lerp(860, 900, manos), lerp(1060, 780, manos)]] })}</g>` +
      tuConChispa(200, 900, 30, on ? t : 0);
  },
};

// ---------- 15. Arriba, en la azotea, una lámpara se vuelve a prender ----------
ESCENAS.lampara = {
  html: lienzo(`
    <defs><linearGradient id="lp-cono" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8" stop-opacity=".75"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)">
      <polygon points="-200,1920 1280,1920 900,420 180,420" fill="#3b363f" stroke="${INK}" stroke-width="8"/>
      <polygon points="300,1500 520,1500 505,1120 330,1120" fill="#0b0d12" stroke="#9aa3ad" stroke-width="8"/>
      <polygon points="150,420 930,420 950,540 130,540" fill="#4e4a52" stroke="${INK}" stroke-width="8"/>
      <line x1="140" y1="420" x2="940" y2="420" stroke="#9aa3ad" stroke-width="14"/>
      ${[200, 330, 460, 590, 720, 850].map(x => `<line x1="${x}" y1="420" x2="${x}" y2="480" stroke="#9aa3ad" stroke-width="10"/>`).join('')}
    </g>
    <g id="lp-luz"></g>
    <rect id="lp-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`),
  camara: { claves: [[INI.lampara, 1.0, 0, 120], [M.prende, 1.1, 0, 160], [FIN('lampara'), 1.3, 0, 240]], origen: '540px 500px' },
  update(lt, dur, t) {
    $('#lp-rojo').setAttribute('opacity', 0.08 + 0.14 * pulsoRojo(t));
    const on = t > M.prende + 0.1, a = Math.PI / 2 + 0.25 * Math.sin(t * 1.4);
    const parpadeo = t > M.prende + 0.1 && t < M.prende + 0.5 ? (Math.sin(t * 60) > 0 ? 1 : 0.2) : 1;
    $('#lp-luz').innerHTML = on ? `<polygon points="640,470 ${640 + Math.cos(a - 0.2) * 1700},${470 + Math.sin(a - 0.2) * 1700} ${640 + Math.cos(a + 0.2) * 1700},${470 + Math.sin(a + 0.2) * 1700}" fill="url(#lp-cono)" opacity="${0.6 * parpadeo}"/>
      <circle cx="640" cy="470" r="30" fill="#fff6c8" opacity="${parpadeo}"/><circle cx="640" cy="470" r="90" fill="#fff6c8" opacity="${0.3 * parpadeo}" filter="url(#blur10)"/>` : '';
  },
};

// ---------- 16. Tarjeta de sospechosos. Temporada 2 ----------
ESCENAS.sospechosos = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<rect id="so-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>`)}
    <div class="decide-tit" id="so-tit" style="top:110px;font-size:96px;line-height:1.05">¿QUIÉN ACTIVÓ<br>LA ALERTA LA<br>PRIMERA NOCHE?</div>
    ${[['🔑', 'MEMO · 101'], ['📱', 'LALO · 305'], ['👩', 'PATY · 203'], ['❓', 'ALGUIEN DE AFUERA']].map(([e, n], i) =>
      `<div class="opcion" id="so-${i}" style="top:${470 + i * 205}px;height:175px;font-size:70px"><span class="emo" style="font-size:96px">${e}</span><span class="txt">${n}</span></div>`).join('')}
    <div class="decide-com" id="so-com" style="top:1310px;font-size:90px">COMENTA TU SOSPECHOSO</div>
    <div class="p2b" id="so-temp" style="top:1530px;font-size:130px">TEMPORADA 2</div>`,
  update(lt, dur, t) {
    $('#so-rojo').setAttribute('opacity', 0.05 + 0.1 * pulsoRojo(t));
    pop($('#so-tit'), t, INI.sospechosos);
    [0, 1, 2, 3].forEach(i => pop($('#so-' + i), t, INI.sospechosos + 0.4 + i * 0.35));
    pop($('#so-com'), t, M.sospechoso - 0.3);
    pop($('#so-temp'), t, M.temporada - 0.1, 0.4);
  },
};
