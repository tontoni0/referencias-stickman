// Escenas de "La alerta", temporada 2, parte 1: Evelin.
// Sigue sin pausa al final de la temporada 1. Se presenta a Evelin, la nieta de Rosa, y la clave del 3:14.

// ---------- Clave Morse: los pitidos del radio. mezcla.py usa la misma cuenta. ----------
const MORSE = { A: '.-', B: '-...', D: '-..', E: '.', F: '..-.', I: '..', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', Y: '-.--' };
// Regresa los pitidos [{s, d}] y cuándo termina cada letra, repartidos entre t0 y t1.
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
const VIVA = morse('ESTOY VIVA', INI.pita + 0.3, M.viva + 0.4);
const FUIYO = morse('FUI YO', INI.fuiyo + 0.3, M.fui + 0.35);
const PERDON = morse('PERDONAME ABUELA', M.fui + 0.55, INI.centro - 0.55);   // sigue pitando en la pausa después de "abuela"
const ZONA_EVELIN = INI.centro + 0.6;   // Evelin aprieta el botón de prueba (también en mezcla.py)

const infEn = (x, y, h, cuerpo) => `<g transform="translate(${x} ${y}) scale(${h})">${cuerpo}</g>`;
const pop = (el, t, t0, d = 0.3) => { const p = clamp((t - t0) / d); el.style.opacity = p; el.style.transform = `scale(${lerp(0.7, 1, ease.outBack(p))})`; };
const PISO = 1450;

// ---------- Piezas de la cocina de Rosa (como en la parte 8) ----------
const rosaDe = (x, y, r, o = {}) => rosa({ head: [x, y], r, neck: [x + 4, y + r * 1.05], hip: [x + 10, y + r * 3.4],
  legL: [[x - 10, y + r * 4.4], [x - 20, y + r * 5.4]], legR: [[x + 30, y + r * 4.4], [x + 40, y + r * 5.4]], footL: -1, footR: 1,
  armL: o.armL || [[x - r * 0.9, y + r * 2.2], [x - r * 1.0, y + r * 3.0]], armR: o.armR || [[x + r * 0.9, y + r * 2.2], [x + r * 1.0, y + r * 3.0]],
  brazosAlFrente: true, look: o.look || 0, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1, headFill: o.headFill });
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

// ---------- 1. Ustedes votaron por Memo. Casi. ----------
ESCENAS.votos = {
  html: `<div class="full" style="background:#0b0f17"></div>
    <div class="decide-tit" id="vo-tit" style="top:130px;font-size:120px">USTEDES VOTARON</div>
    ${[['🔑', 'MEMO · 101'], ['📱', 'LALO · 305'], ['👩', 'PATY · 203'], ['❓', 'ALGUIEN DE AFUERA']].map(([e, n], i) =>
      `<div class="opcion" id="vo-${i}" style="top:${400 + i * 205}px;height:175px;font-size:70px;${i ? 'opacity:.35' : 'border-color:#e5a83b;box-shadow:0 0 40px rgba(229,168,59,.5)'}"><span class="emo" style="font-size:96px">${e}</span><span class="txt">${n}</span></div>`).join('')}
    ${lienzo(`<g id="vo-sello" opacity="0"><rect x="560" y="370" width="420" height="190" rx="18" fill="none" stroke="${ROJO}" stroke-width="16"/>
      <text x="770" y="510" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="150" letter-spacing="10" fill="${ROJO}">CASI</text></g>`)}`,
  camara: { claves: [[0, 1.0, 0, 0], [M.casi, 1.0, 0, 0], [FIN('votos'), 1.12, -60, 90]], origen: '540px 700px' },
  update(lt, dur, t) {
    pop($('#vo-tit'), t, 0.02, 0.25);
    const s = clamp((t - M.casi + 0.05) / 0.18);
    const g = $('#vo-sello');
    g.setAttribute('opacity', s);
    g.setAttribute('transform', `rotate(-10 770 465) translate(770 465) scale(${lerp(1.8, 1, ease.outCubic(s))}) translate(-770 -465)`);
  },
};

// ---------- 2. La alerta sigue sonando. El radio se prende solo ----------
ESCENAS.radio = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#2a2026"/>
    <g filter="url(#ink)"><rect x="-20" y="1180" width="1120" height="760" fill="#4a3428" stroke="${INK}" stroke-width="9"/></g>
    <g id="ra-cosas"></g>
    <rect id="ra-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`),
  camara: { claves: [[INI.radio, 1.0, 0, 0], [M.prende, 1.05, 0, 0], [FIN('radio'), 1.3, -60, 60]], origen: '600px 1050px' },
  update(lt, dur, t) {
    const on = t > M.prende - 0.1;
    $('#ra-rojo').setAttribute('opacity', 0.1 + 0.14 * pulsoRojo(t));
    $('#ra-cosas').innerHTML = vela(170, 1080, t, 0.9) + (on ? estatica(720, 820, t) : '') + radioViejo(620, 1020, t, on ? 1 : 0, 1.3);
  },
};

// ---------- 3. Rosa se queda blanca ----------
ESCENAS.blanca = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#14111a"/>
    <circle cx="540" cy="900" r="900" fill="#9fb3d9" opacity=".12"/>
    <g id="bl-rosa" filter="url(#ink)"></g>
    <rect id="bl-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`),
  camara: { claves: [[INI.blanca, 1.0, 0, 0], [M.persona, 1.1, 0, 40], [FIN('blanca'), 1.26, 0, 80]], origen: '540px 820px' },
  update(lt, dur, t) {
    const abre = ease.outCubic(clamp((t - M.persona + 0.1) / 0.3));
    const tiembla = Math.sin(t * 40) * 2;
    $('#bl-rosa').innerHTML = `<g transform="translate(${tiembla} 0)">${rosaDe(540, 800, 250, { look: -10, lookY: 6, eyeScale: lerp(1.05, 1.45, abre), headFill: '#e8eef6',
      armL: [[360, 1400], [350, 1700]], armR: [[720, 1400], [730, 1700]] })}
      <path d="M${720} ${700} q-12 40 4 70 q14 -26 -4 -70z" fill="#bfe0ff" stroke="${INK}" stroke-width="5"/></g>`;
    $('#bl-rojo').setAttribute('opacity', 0.05 + 0.08 * pulsoRojo(t));
  },
};

// ---------- 4. Evelin. Su nieta. Operadora de noche en el centro de alerta ----------
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
ESCENAS.evelin = {
  html: lienzo(salaControl('ev')),
  fijo: `<div class="presenta" id="ev-pre" style="top:130px"><div class="nombre">EVELIN</div><div class="cargo" id="ev-cargo">NIETA DE ROSA<br>OPERADORA DE NOCHE</div></div>`,
  camara: { claves: [[INI.evelin, 1.0, 0, 0], [FIN('evelin'), 1.15, -20, -40]], origen: '540px 1150px' },
  update(lt, dur, t) {
    $('#ev-evelin').innerHTML = `<g filter="url(#contorno)">${evelin({ head: [540, 950], r: 125, neck: [545, 1075], hip: [550, 1380],
      armL: [[430, 1120], [470, 1150]], armR: [[720, 1090], [690, 975]], brazosAlFrente: true, audifonos: 'puestos', look: 8, lookY: -4 })}</g>`;
    $('#ev-boton').innerHTML = `<circle cx="770" cy="1172" r="26" fill="${ROJO}" stroke="${INK}" stroke-width="6"/>`;
    pop($('#ev-pre'), t, INI.evelin + 0.05, 0.35);
    $('#ev-cargo').style.opacity = clamp((t - M.nieta) / 0.3);
    document.querySelectorAll('#esc-evelin .ev-zona').forEach(z => z.setAttribute('fill', '#1d3b4a'));
  },
};

// ---------- 5. La clave: Rosa y Evelin niña, hace 15 años ----------
ESCENAS.clave = {
  html: `${lienzo(`
    <g id="cl-mesa">
      <rect width="1080" height="1920" fill="#3a2a22"/>
      <circle cx="540" cy="900" r="900" fill="url(#luzCalida)" opacity=".9"/>
      <g filter="url(#ink)">
        <rect y="1060" width="1080" height="900" fill="#2e2119"/>
        ${rosaDe(320, 700, 125, { look: 30, lookY: 24, armL: [[230, 1010], [330, 1130]], armR: [[430, 990], [500, 1120]] })}
        ${evelin({ head: [770, 830], r: 92, neck: [772, 920], hip: [778, 1220], armL: [[690, 1040], [640, 1135]], armR: [[850, 1040], [820, 1130]], nina: true, look: -22, lookY: 22 })}
        <polygon points="60,1110 1020,1110 1080,1230 0,1230" fill="#7a5537" stroke="${INK}" stroke-width="9"/>
        <rect x="0" y="1230" width="1080" height="90" fill="#4a3428" stroke="${INK}" stroke-width="9"/>
        <polygon points="390,1126 700,1120 716,1196 374,1204" fill="#f6f3ea" stroke="${INK}" stroke-width="6"/>
        <text x="545" y="1188" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="70" fill="${TINTA}" transform="rotate(-1 545 1170)">3:14</text>
        <line x1="640" y1="1135" x2="700" y2="1070" stroke="#e5c07a" stroke-width="10" stroke-linecap="round"/>
      </g>
    </g>`)}
    <div id="cl-hoja" style="display:none">
      <div class="cuaderno"></div>
      <div class="tinta" id="cl-1" style="top:420px;left:190px;font-size:250px;font-weight:700;transform:rotate(-4deg)">3:14</div>
      <div class="tinta" id="cl-2" style="top:720px;left:220px;font-size:120px;font-weight:600;transform:rotate(-2deg)">= peligro</div>
      <div class="tinta roja" id="cl-3" style="top:930px;left:170px;font-size:140px;font-weight:700;transform:rotate(-3deg)">¡la otra</div>
      <div class="tinta roja" id="cl-4" style="top:1110px;left:230px;font-size:140px;font-weight:700;transform:rotate(-3deg)">se esconde!</div>
    </div>`,
  fijo: `<div class="recuerdo" id="cl-tit" style="top:130px">Hace 15 años</div>`,
  camara: { claves: [[INI.clave, 1.05, 0, 0], [M.tres - 0.5, 1.15, 0, -60], [M.tres - 0.45, 1.0, 0, 0], [FIN('clave'), 1.08, 0, -30]] },
  update(lt, dur, t) {
    const hoja = t > M.tres - 0.45;
    $('#cl-mesa').style.display = hoja ? 'none' : '';
    $('#cl-hoja').style.display = hoja ? '' : 'none';
    $('#esc-clave .cam').style.filter = hoja ? '' : 'sepia(.55) saturate(1.1)';
    escribe($('#cl-1'), t, M.tres - 0.4, 0.6);
    escribe($('#cl-2'), t, M.tres + 0.3, 0.5);
    escribe($('#cl-3'), t, M.esconde, 0.5);
    escribe($('#cl-4'), t, M.esconde + 0.75, 0.55);
    $('#cl-tit').style.opacity = hoja ? 0 : 1;
  },
};

// ---------- 6. La primera noche: todos bajan al patio. Rosa no ----------
const vecR = rng(8);
const VECINOS = [...Array(14)].map((_, i) => ({ x0: -900 + i * 100 + vecR() * 60, y: 1400 + vecR() * 90, c: ['#7aa6d8', '#d88aa6', '#8fc79a', '#e0c070', '#b39ddb', '#ef9a7a'][i % 6], v: 170 + vecR() * 60, ph: vecR() * 6 }));
function fachadaC() {
  let v = '';
  for (let f = 0; f < 5; f++) for (let c = 0; c < 3; c++) {
    const x = 130 + c * 310, y = 400 + f * 190;
    v += `<rect x="${x}" y="${y}" width="200" height="130" fill="${f === 1 && c === 0 ? '#2a1f22' : '#121722'}" stroke="${INK}" stroke-width="7"/>
      <line x1="${x + 100}" y1="${y}" x2="${x + 100}" y2="${y + 130}" stroke="#2a2f3a" stroke-width="6"/>`;
  }
  return `<rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)"><rect x="60" y="350" width="960" height="1000" fill="#2f323c" stroke="${INK}" stroke-width="10"/>${v}
      <rect x="-20" y="1340" width="1120" height="600" fill="#1a1f2a" stroke="${INK}" stroke-width="8"/></g>`;
}
ESCENAS.primera = {
  html: lienzo(`${fachadaC()}
    <g id="pr-402"></g>
    <g id="pr-gente" filter="url(#ink)"></g>
    <rect id="pr-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`),
  fijo: `<div class="recuerdo" style="top:130px;color:#ffd9d9">La primera noche</div>`,
  camara: { claves: [[INI.primera, 1.0, 0, 0], [M.bajaron + 0.4, 1.05, 0, -30], [M.rosano - 0.1, 1.05, 0, -30], [M.rosano + 0.5, 2.2, 640, 600], [FIN('primera'), 2.3, 660, 620]] },
  update(lt, dur, t) {
    $('#pr-rojo').setAttribute('opacity', 0.08 + 0.12 * pulsoRojo(t));
    // la ventana del 402: luz de vela que se apaga y Rosa que se agacha detrás de la cortina
    const apaga = ease.inOut(clamp((t - M.rosano) / 0.5)), agacha = ease.inOut(clamp((t - M.rosano - 0.2) / 0.6));
    $('#pr-402').innerHTML = `<rect x="134" y="594" width="192" height="122" fill="url(#luzCalida)" opacity="${1 - apaga}"/>
      <g filter="url(#ink)" clip-path="inset(0)"><svg x="134" y="594" width="192" height="122" viewBox="134 594 192 122">
        ${rosaDe(230, lerp(650, 740, agacha), 38, { look: -6, lookY: 6 })}</svg>
      <path d="M136 596 h188 v34 q-12 12 -23 0 q-12 12 -23 0 q-12 12 -23 0 q-12 12 -23 0 q-12 12 -23 0 q-12 12 -23 0 q-12 12 -23 0 q-12 12 -23 0z" fill="#d8a7b5" opacity=".85"/></g>`;
    $('#pr-gente').innerHTML = VECINOS.map(p => {
      const x = p.x0 + (t - INI.primera) * p.v, paso = Math.abs(Math.sin(t * 8 + p.ph)) * 6;
      return x < 1150 && x > -100 ? vecino(x, p.y - paso, 175, p.c, { look: 8 }) : '';
    }).join('');
  },
};

// ---------- 7. El radio pita: Rosa escribe ESTOY VIVA ----------
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
const anchoLetra = (c, size) => size * (c === ' ' ? 0.35 : c === 'M' || c === 'W' ? 0.7 : c === 'I' ? 0.32 : 0.52);
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
ESCENAS.pita = {
  html: lienzo(radioYLibreta('pi')),
  camara: { claves: [[INI.pita, 1.0, 0, 120], [M.letra, 1.0, 0, 0], [M.viva, 1.15, 0, -150], [FIN('pita'), 1.18, 0, -160]], origen: '540px 1100px' },
  update(lt, dur, t) {
    const sonando = VIVA.pitidos.some(p => t >= p.s && t < p.s + p.d);
    $('#pi-radio').innerHTML = radioViejo(540, 560, t, 1, 0.9) + `<circle cx="652" cy="474" r="${sonando ? 34 : 14}" fill="${ROJO}" opacity="${sonando ? 1 : 0.4}"/>`;
    $('#pi-morse').innerHTML = morseVisual(VIVA, t, 800);
    const LV = [{ texto: 'ESTOY', letras: VIVA.letras.slice(0, 5), x0: 260, y0: 1150, size: 200 },
      { texto: 'VIVA', letras: VIVA.letras.slice(6), x0: 330, y0: 1370, size: 200 }];
    const sub = clamp((t - M.viva - 0.5) / 0.3);
    $('#pi-letras').innerHTML = escribeLineas(LV, t, false) +
      (sub > 0 ? `<path d="M310 1405 q230 -18 470 4" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - sub}" stroke="${ROJO}" stroke-width="14" fill="none" stroke-linecap="round"/>` : '');
    const pl = puntaLapiz(LV, t);
    $('#pi-mano').innerHTML = manoLapiz(pl.x, pl.y, t);
  },
};

// ---------- 8. La lámpara de Memo baja por la escalera ----------
const PISO_ALTO = 640, Y0 = 1500;
const escalonesP = (x0, y0, x1, y1, n) => {
  const dx = (x1 - x0) / n, dy = (y1 - y0) / n;
  let p = `${x0},${y0}`;
  for (let i = 0; i < n; i++) p += ` ${x0 + dx * i},${y0 + dy * (i + 1)} ${x0 + dx * (i + 1)},${y0 + dy * (i + 1)}`;
  return p + ` ${x1},${y1 + 46} ${x0},${y0 + 46}`;
};
function cubo() {
  let s = '';
  for (let k = 2; k <= 6; k++) {
    const Y = Y0 - k * PISO_ALTO;
    s += `<rect x="0" y="${Y - PISO_ALTO}" width="1080" height="${PISO_ALTO}" fill="${k % 2 ? '#0f131b' : '#0d1118'}"/>
      <text x="230" y="${Y - 330}" font-family="Oswald" font-weight="700" font-size="190" fill="#c9ccd2" opacity=".18">${k < 6 ? k : ''}</text>
      <polygon points="${escalonesP(900, Y - 320, 120, Y - 640, 10)}" fill="#171b24" stroke="${INK}" stroke-width="5"/>
      <rect x="900" y="${Y - 320}" width="180" height="30" fill="#20242d" stroke="${INK}" stroke-width="5"/>
      <polygon points="${escalonesP(120, Y, 900, Y - 320, 10)}" fill="#22272f" stroke="${INK}" stroke-width="5"/>
      <rect x="-10" y="${Y}" width="140" height="34" fill="#2c313c" stroke="${INK}" stroke-width="5"/>
      <rect x="10" y="${Y - 230}" width="96" height="230" fill="#3a2a20" stroke="${INK}" stroke-width="6"/>
      <rect x="22" y="${Y - 205}" width="72" height="34" rx="5" fill="#d9dee6" stroke="${INK}" stroke-width="4"/><text x="58" y="${Y - 178}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="${k < 6 ? 26 : 18}" fill="${INK}">${k < 6 ? k + '02' : 'AZOTEA'}</text>
      ${k === 4 ? `<rect x="106" y="${Y - 30}" width="14" height="30" fill="#ffcf7a" opacity=".8"/>` : ''}`;
  }
  return s;
}
const yEsc = u => Y0 - PISO_ALTO * u;
const xEsc = u => { const f = u - Math.floor(u); return f < 0.5 ? 120 + 780 * (f / 0.5) : 900 - 780 * ((f - 0.5) / 0.5); };
ESCENAS.lampara = {
  html: lienzo(`<g id="la-mundo"><g filter="url(#ink)">${cubo()}</g><g id="la-luz"></g></g>${viñeta}`),
  camara: { de: { s: 1.0, x: 0, y: 0 }, a: { s: 1.08, x: 0, y: 0 } },
  update(lt, dur, t) {
    // baja del 5 al 4: el camino de la escalera recorrido al revés
    const u = lerp(5.1, 4.05, ease.inOut(clamp((t - INI.lampara - 0.3) / (M.luz + 0.4 - INI.lampara))));
    $('#la-mundo').setAttribute('transform', `translate(0 ${PISO_ALTO * u - 380})`);
    const x = xEsc(u), y = yEsc(u), f = u - Math.floor(u), dir = f < 0.5 ? -1 : 1;
    const a = Math.PI / 2 + dir * 0.6;
    $('#la-luz').innerHTML = `<polygon points="${x},${y - 230} ${x + Math.cos(a - 0.3) * 700},${y - 230 + Math.sin(a - 0.3) * 700} ${x + Math.cos(a + 0.3) * 700},${y - 230 + Math.sin(a + 0.3) * 700}" fill="url(#haz)" opacity=".5"/>
      <g filter="url(#contorno)"><g transform="translate(${x} ${y}) scale(${-dir * 230} 230)">${infectadoLado(t * 6).replace(/#9aa0a8/g, '#0a0c10').replace(/url\(#headInfectado\)/g, '#0a0c10').replace(/#f4f4f4/g, '#0a0c10')}</g></g>
      <circle cx="${x}" cy="${y - 230}" r="22" fill="#fff6c8"/><circle cx="${x}" cy="${y - 230}" r="70" fill="#fff6c8" opacity=".3" filter="url(#blur10)"/>`;
  },
};

// ---------- 9. Chispa le gruñe a la puerta ----------
ESCENAS.grune = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#241d29"/>
    <circle cx="200" cy="1100" r="600" fill="url(#luzCalida)" opacity=".5"/>
    <g filter="url(#ink)">
      <rect x="-20" y="1440" width="1120" height="500" fill="#1a141d" stroke="${INK}" stroke-width="8"/>
      <rect x="600" y="500" width="380" height="925" fill="#4a3428" stroke="${INK}" stroke-width="10"/>
      <circle cx="645" cy="980" r="16" fill="#c9a43a" stroke="${INK}" stroke-width="5"/>
    </g>
    <rect id="gr-raya" x="600" y="1425" width="380" height="16" fill="#fff6c8" opacity="0"/>
    <g id="gr-pies"></g>
    <g id="gr-chispa" filter="url(#ink)"></g>
    ${viñeta}`),
  camara: { claves: [[INI.grune, 1.1, 120, -120], [FIN('grune'), 1.3, 60, -220]] },
  update(lt, dur, t) {
    $('#gr-raya').setAttribute('opacity', 0.5 + 0.4 * Math.abs(Math.sin(t * 3)));
    $('#gr-pies').innerHTML = [0, 1].map(k => `<rect x="${720 + k * 90 + Math.sin(t * 2 + k) * 20}" y="1425" width="50" height="16" fill="#0c0e13"/>`).join('');
    const tiembla = Math.sin(t * 50) * 3;
    $('#gr-chispa').innerHTML = `<g transform="translate(${370 + tiembla} 1262) scale(1.6)">${perro('gruñe')}</g>`;
  },
};

// ---------- 10. FUI YO. PERDÓNAME, ABUELA ----------
ESCENAS.fuiyo = {
  html: lienzo(radioYLibreta('fu')),
  camara: { claves: [[INI.fuiyo, 1.0, 0, 0], [M.fui, 1.1, 0, -120], [M.perdon + 0.6, 1.25, 0, -220], [FIN('fuiyo'), 1.3, 0, -230]], origen: '540px 1150px' },
  update(lt, dur, t) {
    const todos = [...FUIYO.pitidos, ...PERDON.pitidos];
    const sonando = todos.some(p => t >= p.s && t < p.s + p.d);
    $('#fu-radio').innerHTML = radioViejo(540, 560, t, 1, 0.9) + `<circle cx="652" cy="474" r="${sonando ? 34 : 14}" fill="${ROJO}" opacity="${sonando ? 1 : 0.4}"/>`;
    $('#fu-morse').innerHTML = morseVisual({ pitidos: todos }, t, 800);
    const lagrima = t > M.perdon + 1.1 ? clamp((t - M.perdon - 1.1) / 0.4) : 0;
    const LF = [{ texto: 'FUI YO', letras: FUIYO.letras, x0: 230, y0: 1080, size: 170, color: ROJO },
      { texto: 'PERDONAME', letras: PERDON.letras.slice(0, 9), x0: 230, y0: 1260, size: 130 },
      { texto: 'ABUELA', letras: PERDON.letras.slice(10), x0: 230, y0: 1410, size: 130 }];
    $('#fu-letras').innerHTML = escribeLineas(LF, t, true) +
      (lagrima > 0 ? `<ellipse cx="720" cy="${1290 + 120 * Math.min(1, lagrima * 1.5)}" rx="${18 + 30 * Math.max(0, lagrima - 0.66) * 3}" ry="${26 - 10 * Math.max(0, lagrima - 0.66) * 3}" fill="#8fb5e8" opacity=".8"/>` : '');
    const pl = puntaLapiz(LF, t);
    $('#fu-mano').innerHTML = manoLapiz(pl.x, pl.y, t * 2.5);
  },
};

// ---------- 11. La primera noche en el centro de alerta: una zona, luego todas ----------
ESCENAS.centro = {
  html: lienzo(salaControl('ce')),
  fijo: `<div class="recuerdo" style="top:110px;color:#ffd9d9">La primera noche · 3:14</div>`,
  // de cerca cuando aprieta el botón; luego se abre para ver el mapa
  camara: { claves: [[INI.centro, 1.3, -60, -40], [ZONA_EVELIN + 0.25, 1.32, -70, -50], [ZONA_EVELIN + 1.1, 1.0, 0, 0], [M.toda - 0.3, 1.0, 0, 0], [M.toda + 0.2, 1.06, 0, 20], [FIN('centro'), 1.1, 0, 30]], origen: '540px 1100px' },
  update(lt, dur, t) {
    const zonas = document.querySelectorAll('#esc-centro .ce-zona');
    zonas.forEach((el, i) => {
      const z = mapaZonas[i];
      const on = i === ZONA_C ? t > ZONA_EVELIN : t > M.toda - 0.4 + z.d * 0.12;
      el.setAttribute('fill', on ? (Math.sin(t * 9 + z.d) > 0 ? ROJO : '#8a1f1b') : '#1d3b4a');
    });
    // la mano baja al botón, lo aprieta y se queda; con "toda la ciudad" se lleva las manos a la cabeza
    const baja = ease.inOut(clamp((t - INI.centro - 0.05) / (ZONA_EVELIN - INI.centro - 0.05)));
    const miedo = ease.outCubic(clamp((t - M.toda) / 0.4));
    const manoR = [lerp(lerp(760, 772, baja), 660, miedo), lerp(lerp(1080, 1150, baja), 930, miedo)];
    const codoR = [lerp(700, 720, miedo), lerp(1100, 1040, miedo)];
    $('#ce-evelin').innerHTML = `<g filter="url(#contorno)">${evelin({ head: [540, 950], r: 125, neck: [545, 1075], hip: [550, 1380],
      armL: [[lerp(430, 360, miedo), lerp(1120, 1040, miedo)], [lerp(470, 420, miedo), lerp(1150, 930, miedo)]],
      armR: [codoR, manoR], brazosAlFrente: true,
      audifonos: 'puestos', look: lerp(14, 0, miedo), lookY: lerp(14, -4, miedo), eyeScale: lerp(1, 1.5, miedo) })}</g>`;
    const pulsa = t > ZONA_EVELIN - 0.05 && t < ZONA_EVELIN + 0.3;
    const banner = t > M.toda - 0.1;
    $('#ce-boton').innerHTML = `<g filter="url(#ink)"><ellipse cx="770" cy="${pulsa ? 1178 : 1172}" rx="30" ry="${pulsa ? 16 : 24}" fill="${t > ZONA_EVELIN ? ROJO : '#8a1f1b'}" stroke="${INK}" stroke-width="6"/></g>` +
      (t > ZONA_EVELIN && t < ZONA_EVELIN + 0.5 ? `<circle cx="770" cy="1172" r="${40 + (t - ZONA_EVELIN) * 200}" fill="none" stroke="${ROJO}" stroke-width="8" opacity="${1 - (t - ZONA_EVELIN) * 2}"/>` : '') +
      (banner ? `<g opacity="${clamp((t - M.toda + 0.1) / 0.15)}"><rect x="160" y="455" width="760" height="130" rx="14" fill="#0b0f17" stroke="${ROJO}" stroke-width="${Math.sin(t * 10) > 0 ? 10 : 4}"/>
        <text x="540" y="548" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="86" letter-spacing="4" fill="#fff">TODAS LAS ZONAS</text></g>` : '');
  },
};

// ---------- 12. ¿Quién hizo que sonara para todos? ----------
ESCENAS.pregunta = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<rect id="pg-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
      <g id="pg-sombra" filter="url(#ink)" opacity="0"></g>`)}
    <div class="decide-tit" id="pg-tit" style="top:180px;font-size:110px;line-height:1.05">¿QUIÉN HIZO<br>QUE SONARA<br>PARA TODOS?</div>
    <div class="decide-com" id="pg-com" style="top:1180px;font-size:96px">COMENTA TU TEORÍA</div>
    <div class="p2" id="pg-p2" style="top:1380px;font-size:170px">PARTE 2 <span>→</span></div>`,
  update(lt, dur, t) {
    $('#pg-rojo').setAttribute('opacity', 0.04 + 0.08 * pulsoRojo(t));
    pop($('#pg-tit'), t, INI.pregunta);
    const s = clamp((t - INI.pregunta - 0.6) / 0.6);
    $('#pg-sombra').setAttribute('opacity', s * 0.9);
    $('#pg-sombra').innerHTML = `<g transform="translate(540 1110)">${stick({ head: [0, -380], r: 70, neck: [0, -310], hip: [0, -170], legL: [[-20, -90], [-30, 0]], legR: [[20, -90], [30, 0]],
      armL: [[-40, -250], [-50, -180]], armR: [[50, -260], [90, -300]], paliacate: false, headFill: '#0a0c10', eyeFill: '#0a0c10', sinBrillo: true, gris: '#0a0c10' })}
      <rect x="80" y="-330" width="34" height="56" rx="6" fill="#9fd0ff"/><circle cx="97" cy="-302" r="40" fill="#9fd0ff" opacity=".25" filter="url(#blur10)"/></g>`;
    pop($('#pg-com'), t, M.comenta - 0.2);
    $('#pg-p2').style.opacity = clamp((t - M.comenta - 0.8) / 0.3);
  },
};
