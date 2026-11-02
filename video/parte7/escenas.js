// Escenas de "La alerta", parte 7: Las huellas. Ganó 🔦 en los comentarios de la parte 6:
// buscas a Chispa por tu cuenta. Memo te delata desde la azotea y las huellas llevan al 402.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const CLANG = M.barandal + 0.25;     // la lámpara de Memo pega en el barandal
const ABRE_502 = M.abre + 0.8;        // Memo abre la bodega 502

const infEn = (x, y, h, cuerpo) => `<g transform="translate(${x} ${y}) scale(${h})">${cuerpo}</g>`;
const tuNoche = o => `<g filter="url(#contorno)">${stick(o)}</g>`;
const pop = (el, t, t0, d = 0.3) => { const p = clamp((t - t0) / d); el.style.opacity = p; el.style.transform = `scale(${lerp(0.7, 1, ease.outBack(p))})`; };

// ---------- 1. Ganó la lámpara ----------
ESCENAS.gano = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="1040" r="800" fill="url(#luzLuna)" opacity=".14"/>`)}
    <div class="decide-tit" id="ga-tit">GANÓ</div>
    <div class="opcion" id="ga-a" style="top:560px"><span class="emo">🔑</span><span class="txt" style="text-decoration:line-through;text-decoration-color:#e0312b;text-decoration-thickness:10px">BAJAS CON MEMO</span></div>
    <div class="opcion" id="ga-b" style="top:900px;border-color:#9fd0ff;box-shadow:0 0 40px rgba(159,208,255,.5)"><span class="emo">🔦</span><span class="txt">BUSCAS A CHISPA</span></div>
    <div class="decide-pie" id="ga-pie" style="top:1260px">LOS COMENTARIOS ELIGIERON</div>`,
  camara: { claves: [[0, 1.0, 0, 0], [M.razon, 1.0, 0, 0], [FIN('gano'), 1.12, 0, -50]], origen: '540px 1030px' },
  update(lt, dur, t) {
    pop($('#ga-tit'), t, 0.02, 0.25);
    pop($('#ga-b'), t, 0.1, 0.3);
    $('#ga-b').style.transform += ` scale(${1 + 0.035 * Math.sin(t * 8)})`;
    $('#ga-a').style.opacity = 0.35;
    $('#ga-pie').style.opacity = clamp((t - M.razon) / 0.3);
  },
};

// ---------- 2. Las dos placas: la de la foto de Memo y la de Chispa ----------
const panelPlaca = (y, conCinta, etiqueta) => `
  <rect x="90" y="${y}" width="900" height="560" rx="34" fill="#2a2420"/>
  <svg x="90" y="${y}" width="900" height="560" viewBox="-450 280 900 560">
    <rect x="-450" y="280" width="900" height="560" fill="${conCinta ? '#3a3040' : '#2a2420'}"/>
    <circle cx="0" cy="560" r="420" fill="#fff6e0" opacity="${conCinta ? 0.05 : 0.14}"/>
    ${caraChispa({ sinCinta: !conCinta })}
  </svg>
  <rect x="90" y="${y}" width="900" height="560" rx="34" fill="none" stroke="#fff" stroke-width="9"/>
  <text x="130" y="${y + 78}" font-family="Oswald" font-weight="700" font-size="56" fill="#fff" stroke="#000" stroke-width="10" paint-order="stroke">${etiqueta}</text>`;
ESCENAS.placa = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#0b0f17"/>
    <g id="pl-memo">${panelPlaca(240, false, 'LA FOTO DE MEMO')}</g>
    <g id="pl-chispa">${panelPlaca(880, true, 'CHISPA, DESDE EL DÍA 1')}</g>
    <circle id="pl-circulo" cx="540" cy="1205" r="150" pathLength="1" fill="none" stroke="${ROJO}" stroke-width="14" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-80 540 1205)"/>
    <g id="pl-sello" opacity="0" transform="translate(540 520) rotate(-12)">
      <rect x="-330" y="-80" width="660" height="160" rx="16" fill="none" stroke="${ROJO}" stroke-width="14"/>
      <text x="0" y="48" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="128" letter-spacing="6" fill="${ROJO}">FOTO VIEJA</text></g>
    <path id="pl-x1" d="M140 290 L940 750" pathLength="1" stroke="${ROJO}" stroke-width="22" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1"/>
    <path id="pl-x2" d="M940 290 L140 750" pathLength="1" stroke="${ROJO}" stroke-width="22" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1"/>
    ${viñeta}`),
  camara: { claves: [[INI.placa, 1.0, 0, 0], [M.vieja, 1.04, 0, 0], [FIN('placa'), 1.1, 0, 30]] },
  update(lt, dur, t) {
    const entra = ease.outCubic(clamp((t - INI.placa - 0.4) / 0.4));
    $('#pl-chispa').setAttribute('transform', `translate(${(1 - entra) * 1100} 0)`);
    trazo($('#pl-circulo'), t, M.cinta + 0.4, 0.5);
    const s = clamp((t - M.vieja) / 0.2);
    $('#pl-sello').setAttribute('opacity', s);
    $('#pl-sello').setAttribute('transform', `translate(540 520) rotate(-12) scale(${lerp(1.6, 1, ease.outCubic(s))})`);
    trazo($('#pl-x1'), t, M.mintio, 0.2);
    trazo($('#pl-x2'), t, M.mintio + 0.2, 0.2);
    $('#pl-memo').setAttribute('opacity', t > M.mintio ? 0.55 : 1);
  },
};

// ---------- 3, 4 y 5. La azotea: Memo sube, te escondes, abre tu bodega ----------
const tinaco = (x, y) => `<rect x="${x - 75}" y="${y - 200}" width="150" height="200" rx="18" fill="#15171c" stroke="${INK}" stroke-width="7"/>
  <ellipse cx="${x}" cy="${y - 200}" rx="75" ry="19" fill="#22252c" stroke="${INK}" stroke-width="6"/>
  ${[0.3, 0.55, 0.8].map(k => `<path d="M${x - 75} ${y - 200 * k} q75 14 150 0" fill="none" stroke="#2b2e36" stroke-width="5"/>`).join('')}`;
const BOD = [[480, '501'], [650, '502'], [820, '503']];
// Memo con la lámpara. Pies en (x, y). ang: hacia dónde alumbra (radianes). paso: 0..1 para caminar.
function memoLampara(x, y, ang, paso = 0, r = 62) {
  const p = Math.sin(paso * Math.PI * 2) * (paso ? 1 : 0);
  const sh = [x, y - 262 + r * 0.4], hx = x + Math.cos(ang) * 115, hy = y - 225 + Math.sin(ang) * 115;
  const haz = `<polygon points="${hx},${hy} ${hx + Math.cos(ang - 0.2) * 1100},${hy + Math.sin(ang - 0.2) * 1100} ${hx + Math.cos(ang + 0.2) * 1100},${hy + Math.sin(ang + 0.2) * 1100}" fill="url(#haz)" opacity=".75"/>`;
  return haz + `<g filter="url(#contorno)">${memo({ head: [x, y - 330], r, neck: [x, y - 262], hip: [x, y - 120],
    legL: [[x - 20 + 25 * p, y - 60], [x - 25 + 40 * p, y]], legR: [[x + 20 - 25 * p, y - 60], [x + 25 - 40 * p, y]], footL: -1, footR: 1,
    armL: [[x - 45, y - 190], [x - 40 - 15 * p, y - 130]], look: Math.cos(ang) * 14, lookY: Math.sin(ang) * 10 })}
    ${linea([sh, [x + Math.cos(ang) * 60, y - 215 + Math.sin(ang) * 50], [hx, hy]], r * 0.085)}
    <g transform="translate(${hx} ${hy}) rotate(${ang * 180 / Math.PI})"><rect x="-10" y="-13" width="56" height="26" rx="6" fill="#2a2d33" stroke="${INK}" stroke-width="5"/><circle cx="48" cy="0" r="14" fill="#fff6c8"/></g></g>`;
}
const defsHaz = '';   // el degradado del haz de la lámpara (#haz) está en defsSVG de lib/dibujo.js
function azotea7(pre) {
  return `${defsHaz}
    <rect width="1080" height="1920" fill="url(#cielo)"/>
    <circle cx="200" cy="300" r="240" fill="url(#luzLuna)"/><circle cx="200" cy="300" r="64" fill="#e9eef7"/>
    <g filter="url(#ink)">
      <rect x="-20" y="1010" width="1120" height="340" fill="#3d3a40" stroke="${INK}" stroke-width="7"/>
      <path d="M-20 760 Q300 820 560 770 M-20 690 Q300 750 560 700" fill="none" stroke="#9aa3ad" stroke-width="4"/>
      <path d="M150 724 Q250 740 350 730 L340 930 Q250 950 160 925 Z" fill="#e8e4da" stroke="${INK}" stroke-width="5"/>
      ${BOD.map(([x, n]) => `<rect x="${x - 85}" y="700" width="170" height="320" fill="#5a5560" stroke="${INK}" stroke-width="7"/>
        <rect x="${x - 95}" y="680" width="190" height="26" fill="#47434c" stroke="${INK}" stroke-width="6"/>
        <text x="${x}" y="770" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" fill="#d9dee6">${n}</text>
        ${n === '502' ? '' : `<rect x="${x - 50}" y="790" width="100" height="230" fill="#3a2a20" stroke="${INK}" stroke-width="6"/>`}`).join('')}
      <rect x="950" y="620" width="170" height="400" fill="#4b4650" stroke="${INK}" stroke-width="7"/><rect x="940" y="600" width="190" height="26" fill="#3d3942" stroke="${INK}" stroke-width="6"/>
      <rect x="975" y="790" width="80" height="230" fill="#07080b"/>
      <rect x="-20" y="1350" width="1120" height="70" fill="#5e5960" stroke="${INK}" stroke-width="7"/>
      <rect x="-20" y="1420" width="1120" height="520" fill="#0b0d12"/>
      <line x1="380" y1="1250" x2="380" y2="1940" stroke="#7d838c" stroke-width="12"/><line x1="470" y1="1250" x2="470" y2="1940" stroke="#7d838c" stroke-width="12"/>
      ${[1290, 1380, 1470, 1560, 1650, 1740, 1830].map(y => `<line x1="380" y1="${y}" x2="470" y2="${y}" stroke="#7d838c" stroke-width="9"/>`).join('')}
    </g>
    <g id="${pre}-b502"></g>
    <g id="${pre}-caseta"></g>
    <g id="${pre}-tu"></g>
    <g id="${pre}-memo"></g>
    <g filter="url(#ink)">${tinaco(150, 1230)}${tinaco(320, 1240)}</g>
    ${viñeta}`;
}
// Puertas: la de la caseta (abre 0..1) y la de la bodega 502 (abre 0..1, adentro vacío y alumbrado).
const puertaCaseta = abre => `<rect x="${975 + 80 * abre * 0.85}" y="790" width="${80 * (1 - abre * 0.85)}" height="230" fill="#3a2a20" stroke="${INK}" stroke-width="6"/>`;
const puerta502 = (abre, luz = 0) => `<rect x="600" y="790" width="100" height="230" fill="#07080b"/>
  ${luz > 0 ? `<rect x="600" y="790" width="100" height="230" fill="#fff6c8" opacity="${0.35 * luz}"/><rect x="612" y="930" width="40" height="90" fill="#15130f" opacity="${luz}"/>` : ''}
  <rect x="${600 + 100 * abre * 0.85}" y="790" width="${100 * (1 - abre * 0.85)}" height="230" fill="#3a2a20" stroke="${INK}" stroke-width="6"/>`;

ESCENAS.azotea = {
  html: lienzo(azotea7('az')),
  camara: { claves: [[INI.azotea, 1.0, 0, 0], [M.lampara, 1.08, -60, -20], [M.memoA - 0.3, 1.15, -80, -40], [M.memoA + 0.3, 1.4, -185, -150], [FIN('azotea'), 1.45, -185, -160]] },
  update(lt, dur, t) {
    const abre = ease.inOut(clamp((t - M.rechina) / 0.9));
    $('#az-caseta').innerHTML = puertaCaseta(abre);
    $('#az-b502').innerHTML = puerta502(0);
    const sale = ease.outCubic(clamp((t - M.lampara + 0.2) / 1.2));
    const ang = Math.PI * (0.95 + 0.12 * Math.sin(t * 1.6));
    $('#az-memo').innerHTML = t > M.lampara - 0.4 ? memoLampara(lerp(1050, 960, sale), 1150, ang, sale < 1 ? t * 1.5 : 0) +
      (t > M.llavero ? `<circle cx="${lerp(1050, 960, sale) + 22}" cy="${1150 - 110}" r="${10 + 6 * Math.abs(Math.sin(t * 12))}" fill="#ffe08a" opacity=".85"/>` : '') : '';
    $('#az-tu').innerHTML = '';
  },
};

ESCENAS.tinacos = {
  html: lienzo(azotea7('ti')),
  camara: { claves: [[INI.tinacos, 1.1, 40, -40], [M.escondes + 0.6, 1.1, 120, -40], [FIN('tinacos'), 1.1, 40, -40]] },
  update(lt, dur, t) {
    $('#ti-caseta').innerHTML = puertaCaseta(1);
    // sales agachado de la 502 y corres a los tinacos mientras Memo alumbra hacia el otro lado
    const sal = clamp((t - INI.tinacos - 0.2) / 0.5), va = ease.inOut(clamp((t - INI.tinacos - 0.5) / (M.escondes + 0.5 - INI.tinacos)));
    $('#ti-b502').innerHTML = puerta502(t < M.escondes + 0.8 ? Math.min(sal, 1 - clamp((t - M.escondes - 0.4) / 0.4)) * 0.8 : 0);
    const x = lerp(650, 230, va), y = lerp(1030, 1180, va), v = Math.sin(t * 13);
    $('#ti-tu').innerHTML = va < 1 ? tuNoche({ head: [x - 20, y - 230], r: 66, neck: [x - 10, y - 166], hip: [x + 20, y - 70],
      legL: [[x - 30 * v + 20, y - 30], [x - 50 * v, y]], legR: [[x + 30 * v + 20, y - 30], [x + 50 * v, y]], armL: [[x - 50, y - 120], [x - 70, y - 70]], armR: [[x + 20, y - 120], [x + 10, y - 60]],
      look: -16, eyeScale: 1.35 }) : '';
    const camina = ease.inOut(clamp((t - M.escondes - 0.2) / (FIN('tinacos') - M.escondes)));
    const ang = va < 1 ? 0.15 + 0.1 * Math.sin(t * 2) : Math.PI * 0.85;
    $('#ti-memo').innerHTML = memoLampara(lerp(960, 760, camina), 1150, ang, camina > 0 && camina < 1 ? t * 1.6 : 0);
  },
};

// Bodega 502 de cerca: la llave, la puerta, adentro vacío. Tú te asomas atrás del tinaco.
ESCENAS.abre = {
  html: lienzo(`${defsHaz}
    <rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)">
      <rect x="-20" y="1450" width="1120" height="500" fill="#3d3a40" stroke="${INK}" stroke-width="7"/>
      <rect x="160" y="250" width="760" height="1200" fill="#5a5560" stroke="${INK}" stroke-width="9"/>
      <rect x="140" y="220" width="800" height="44" fill="#47434c" stroke="${INK}" stroke-width="7"/>
      <text x="540" y="380" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="90" fill="#d9dee6">502</text>
      <rect x="330" y="460" width="420" height="990" fill="#07080b"/>
    </g>
    <g id="ab-dentro" opacity="0" filter="url(#ink)">
      <rect x="330" y="460" width="420" height="990" fill="#fff6c8" opacity=".22"/>
      <rect x="360" y="1100" width="160" height="350" fill="#2a2420" stroke="${INK}" stroke-width="6"/><rect x="380" y="980" width="120" height="120" fill="#2e2822" stroke="${INK}" stroke-width="6"/>
      <line x1="700" y1="1450" x2="650" y2="760" stroke="#5a4a3a" stroke-width="14"/>
    </g>
    <g id="ab-puerta" filter="url(#ink)"></g>
    <g id="ab-memo"></g>
    <g filter="url(#ink)">${tinaco(60, 1600)}</g>
    <g id="ab-tu"></g>
    ${viñeta}`),
  camara: { claves: [[INI.abre, 1.0, 0, 0], [ABRE_502, 1.05, 0, 0], [M.vacia, 1.25, 40, 40], [FIN('abre'), 1.3, 40, 50]], origen: '540px 950px' },
  update(lt, dur, t) {
    const abre = ease.inOut(clamp((t - ABRE_502) / 0.6));
    const w = 420 * (1 - 0.85 * abre);
    $('#ab-puerta').innerHTML = `<rect x="${330 + 420 - w}" y="460" width="${w}" height="990" fill="#3a2a20" stroke="${INK}" stroke-width="8"/>
      <circle cx="${330 + 420 - w + 40 * (1 - abre)}" cy="960" r="18" fill="#c9a43a" stroke="${INK}" stroke-width="5"/>`;
    $('#ab-dentro').setAttribute('opacity', abre);
    // la llave entra y gira
    const gira = ease.inOut(clamp((t - M.abre - 0.1) / 0.5)) * 90;
    $('#ab-memo').innerHTML = (abre < 0.5 ? `<g transform="translate(${370 + 10} 960) rotate(${gira})"><rect x="-6" y="-46" width="12" height="46" fill="#c9a43a" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="-56" r="16" fill="none" stroke="#c9a43a" stroke-width="7"/></g>` : '') +
      memoLampara(960, 1700, abre > 0.3 ? Math.PI * 1.1 : Math.PI * 0.95, 0, 95);
    // tu cabeza, asomada detrás del tinaco
    const asoma = Math.sin(t * 2) * 6;
    $('#ab-tu').innerHTML = `<g filter="url(#contorno)">${cabeza(150 + asoma, 1360, 58, { look: 18, eyeScale: 1.45 })}</g>`;
  },
};

// ---------- 6 y 7. La orilla: pelitos y huellas en la cornisa ----------
ESCENAS.orilla = {
  html: lienzo(`${defsHaz}
    <rect width="1080" height="1920" fill="#06080c"/>
    <g filter="url(#ink)">
      <polygon points="-40,600 1120,600 900,1920 180,1920" fill="#4b4550" stroke="${INK}" stroke-width="7"/>
      <polygon points="250,700 520,700 500,950 270,950" fill="#0b0d12" stroke="#9aa3ad" stroke-width="8"/>
      <polygon points="80,1030 1000,1030 990,1070 90,1070" fill="#8a7f78" stroke="${INK}" stroke-width="6"/>
      <polygon points="300,1170 500,1170 490,1360 310,1360" fill="#2a1f22" stroke="#9aa3ad" stroke-width="7"/>
      <polygon points="300,1170 500,1170 497,1230 303,1230" fill="#d8a7b5" opacity=".7"/>
      <rect x="-40" y="460" width="1160" height="160" fill="#5e5960" stroke="${INK}" stroke-width="8"/>
    </g>
    <g id="or-luz"></g>
    <g id="or-tu"></g>
    ${viñeta}`),
  camara: { claves: [[INI.orilla, 1.0, 0, -40], [FIN('orilla'), 1.2, 0, -200]], origen: '540px 1050px' },
  update(lt, dur, t) {
    const sube = ease.outCubic(clamp((t - INI.orilla) / 0.6));
    const cy = 560 - 90 * sube;
    $('#or-tu').innerHTML = `<g filter="url(#contorno)"><path d="M470 ${cy + 95} L540 ${cy + 125} L610 ${cy + 95} L540 ${cy + 190} Z" fill="#c8282e" stroke="${INK}" stroke-width="7"/>
      <circle cx="540" cy="${cy}" r="110" fill="url(#headShade)" stroke="${INK}" stroke-width="9"/>
      <path d="M520 ${cy + 105} l-40 -10 l8 30 z M560 ${cy + 105} l40 -10 l-8 30 z" fill="#c8282e" stroke="${INK}" stroke-width="5"/>
      ${linea([[440, 640], [410, 600]], 12)}${linea([[640, 640], [670, 600]], 12)}${punto(405, 596, 26)}${punto(675, 596, 26)}</g>`;
    const a = 1.3 + 0.5 * Math.sin(t * 1.3);
    $('#or-luz').innerHTML = `<polygon points="900,-20 ${900 + Math.cos(a - 0.25) * 1400},${-20 + Math.sin(a - 0.25) * 1400} ${900 + Math.cos(a + 0.25) * 1400},${-20 + Math.sin(a + 0.25) * 1400}" fill="#fff6c8" opacity=".12"/>`;
  },
};

const HUELLAS = [...Array(9)].map((_, i) => ({ x: 360 + i * 120, y: 1010 + (i % 2 ? 26 : -22) }));
const huella = (x, y, s = 1, op = 1) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(90)" opacity="${op}" fill="#d9d2c4">
  <ellipse cx="0" cy="8" rx="17" ry="14"/>${[[-17, -12], [-6, -20], [6, -20], [17, -12]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="6" ry="8"/>`).join('')}</g>`;
ESCENAS.pelos = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#06080c"/>
    <rect y="1150" width="1080" height="770" fill="#0a0c11"/>
    <g filter="url(#ink)">
      <polygon points="-40,820 1120,820 1120,1130 -40,1130" fill="#8a7f78" stroke="${INK}" stroke-width="8"/>
      <polygon points="-40,1130 1120,1130 1120,1230 -40,1230" fill="#5e5049" stroke="${INK}" stroke-width="7"/>
      <rect x="-40" y="-20" width="1160" height="840" fill="#4b4550" stroke="${INK}" stroke-width="8"/>
      <path d="M150 900 l40 30 l-10 40 l50 20 M700 870 l30 50 l60 10 M420 1080 l50 -20" stroke="#6d635c" stroke-width="5" fill="none"/>
    </g>
    ${[...Array(60)].map((_, i) => `<circle cx="${(i * 97) % 1080}" cy="${840 + (i * 53) % 280}" r="${2 + (i % 3)}" fill="#6d635c"/>`).join('')}
    <g id="pe-pelos"></g>
    <g id="pe-huellas"></g>
    ${viñeta}`),
  camara: { claves: [[INI.pelos, 1.3, 260, 0], [M.pelitos + 0.4, 1.45, 340, -20], [M.huellas, 1.2, 120, 0], [M.paso, 1.15, -60, 0], [FIN('pelos'), 1.2, -100, 0]], origen: '540px 1000px' },
  update(lt, dur, t) {
    const p = clamp((t - M.pelitos + 0.1) / 0.4);
    $('#pe-pelos').innerHTML = p > 0 ? [[230, 958], [250, 948], [270, 962], [244, 975], [262, 940]].map(([x, y], i) =>
      `<path d="M${x} ${y} q${10 + i * 3} -${20 + Math.sin(t * 3 + i) * 4} ${22 + i * 2} -${26 + i}" stroke="#6e4325" stroke-width="7" stroke-linecap="round" fill="none" opacity="${p}"/>`).join('') : '';
    $('#pe-huellas').innerHTML = HUELLAS.map((h, i) => huella(h.x, h.y, 1, clamp((t - M.huellas - i * 0.18) / 0.15))).join('');
  },
};

// ---------- 8 a 11. La fachada de noche: bajas, Memo te alumbra, las cabezas voltean, las manos ----------
const CORNISA = 1100;
const lejos = (() => { const r = rng(57); return [...Array(10)].map(() => ({ x: 60 + r() * 900, y: 1800 + r() * 100, s: 0.7 + r() * 0.4 })).sort((a, b) => a.y - b.y); })();
function fachadaNoche(pre) {
  return `${defsHaz}
    <defs><linearGradient id="${pre}-vacio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2232"/><stop offset="1" stop-color="#090b10"/></linearGradient>
      <linearGradient id="${pre}-sombra" x1="0" y1="0" x2="1" y2="0"><stop offset="0.84" stop-color="#000" stop-opacity="0"/><stop offset="0.97" stop-color="#000" stop-opacity=".98"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#${pre}-vacio)"/>
    <g filter="url(#ink)">
      <rect x="-20" y="-20" width="1120" height="1780" fill="#4b4550" stroke="${INK}" stroke-width="8"/>
      <rect x="100" y="560" width="360" height="540" fill="#0b0d12" stroke="${INK}" stroke-width="8"/>
      <rect x="100" y="560" width="360" height="540" fill="none" stroke="#9aa3ad" stroke-width="10"/>
      <rect x="100" y="1290" width="360" height="410" fill="#2a1f22" stroke="${INK}" stroke-width="8"/>
      <rect x="100" y="1290" width="360" height="410" fill="url(#luzCalida)"/>
      <path d="M106 1296 h348 v130 q-22 24 -44 0 q-22 24 -44 0 q-22 24 -44 0 q-22 24 -44 0 q-22 24 -44 0 q-22 24 -44 0 q-22 24 -44 0 q-21 24 -40 0 z" fill="#d8a7b5" opacity=".75"/>
      <rect x="100" y="1290" width="360" height="410" fill="none" stroke="#9aa3ad" stroke-width="10"/>
      <rect x="80" y="1700" width="400" height="24" fill="#8a7f78" stroke="${INK}" stroke-width="6"/>
      <rect x="975" y="-20" width="36" height="1780" fill="#5d636b" stroke="${INK}" stroke-width="6"/>
      <rect x="-20" y="${CORNISA}" width="1120" height="24" fill="#8a7f78" stroke="${INK}" stroke-width="6"/>
      <rect x="-20" y="${CORNISA + 24}" width="1120" height="22" fill="#5e5049" stroke="${INK}" stroke-width="5"/>
      <line x1="770" y1="-20" x2="770" y2="${CORNISA}" stroke="#7d838c" stroke-width="12"/><line x1="850" y1="-20" x2="850" y2="${CORNISA}" stroke="#7d838c" stroke-width="12"/>
      ${[60, 160, 260, 360, 460, 560, 660, 760, 860, 960, 1060].map(y => `<line x1="770" y1="${y}" x2="850" y2="${y}" stroke="#7d838c" stroke-width="9"/>`).join('')}
    </g>
    <rect x="-20" y="${CORNISA + 46}" width="1120" height="26" fill="#000" opacity=".25"/>
    ${[880, 930, 980, 1030].map((x, i) => huella(x, CORNISA - 6 + (i % 2 ? 4 : -4), 0.55, 0.8)).join('')}
    <g filter="url(#ink)">${lejos.map(p => `<g transform="translate(${p.x} ${p.y}) scale(${p.s})"><circle r="14" fill="url(#headInfectadoOscuro)" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="-5" cy="-1" rx="2.7" ry="4" fill="#f2f2f2"/><ellipse cx="5" cy="-1" rx="2.7" ry="4" fill="#f2f2f2"/></g>`).join('')}</g>
    <g id="${pre}-luz"></g>
    <g id="${pre}-mano" filter="url(#ink)"></g>
    <g id="${pre}-tu"></g>
    <rect width="1080" height="1920" fill="url(#${pre}-sombra)"/>
    ${viñeta}`;
}
// Tú bajando por la escalerita (b: 0 arriba, 1 en la cornisa) o caminando de lado sobre la cornisa.
const tuEscalera = (b, t) => {
  const y = lerp(650, CORNISA, b), x = 810, m = Math.sin(t * 9) * 30 * (b < 1 ? 1 : 0);
  return tuNoche({ head: [x, y - 330], r: 70, neck: [x, y - 260], hip: [x, y - 120], legL: [[x - 30, y - 60 + m * 0.5], [x - 38, y + m * 0.3]], legR: [[x + 30, y - 60 - m * 0.5], [x + 38, y - m * 0.3]],
    armL: [[x - 50, y - 300], [x - 40, y - 380 - m]], armR: [[x + 50, y - 300], [x + 40, y - 380 + m]], lookY: 14, eyeScale: 1.3 });
};
const tuCorriendo = (x, t, rapido = 1) => {
  const y = CORNISA, v = Math.sin(t * 14 * rapido);
  return tuNoche({ head: [x + 12, y - 330], r: 70, neck: [x + 8, y - 260], hip: [x, y - 120],
    legL: [[x + 30 * v, y - 60], [x + 50 * v - 10, y]], legR: [[x - 30 * v, y - 60], [x - 50 * v - 10, y]], footL: 1, footR: 1,
    armL: [[x - 40 * v, y - 200], [x - 60 * v, y - 150]], armR: [[x + 40 * v, y - 200], [x + 60 * v, y - 150]], look: 24, eyeScale: 1.45 });
};
// Brazos grises que salen por tu ventana hacia la derecha. k: 0..1 cuánto salen.
const brazoVentana = (y0, k, t, alcance, i) => {
  if (k <= 0) return '';
  const hx = 440 + alcance * k + Math.sin(t * 8 + i) * 12 * k, hy = y0 + Math.sin(t * 6 + i) * 14;
  const pts = [[360, y0 - 20], [420 + alcance * 0.3 * k, y0], [hx, hy]];
  return linea(pts, 44, '#050608') + linea(pts, 28, '#9aa0a8') + `<g transform="translate(${hx} ${hy})"><circle r="32" fill="#9aa0a8" stroke="#050608" stroke-width="7"/>
    ${[-20, -5, 10, 25].map((dy, j) => linea([[18, dy], [58 + Math.sin(t * 10 + i + j) * 10, dy - 4]], 15, '#050608') + linea([[18, dy], [58 + Math.sin(t * 10 + i + j) * 10, dy - 4]], 8, '#9aa0a8')).join('')}</g>`;
};
const luzDeArriba = (x, t, op = 0.25) => `<polygon points="${x - 40},-40 ${x + 40},-40 ${x + 220 + Math.sin(t * 2) * 30},${CORNISA + 40} ${x - 220 + Math.sin(t * 2) * 30},${CORNISA + 40}" fill="#fff6c8" opacity="${op}"/>`;

ESCENAS.bajas = {
  html: lienzo(fachadaNoche('ba')),
  camara: { claves: [[INI.bajas, 1.3, -160, 120], [M.sigues, 1.3, -170, -60], [FIN('bajas'), 1.32, -180, -80]] },
  update(lt, dur, t) {
    const b = ease.inOut(clamp((t - INI.bajas) / (M.sigues - INI.bajas)));
    const camina = ease.inOut(clamp((t - M.sigues) / (FIN('bajas') - M.sigues)));
    $('#ba-tu').innerHTML = b < 1 ? tuEscalera(b, t) : tuCorriendo(lerp(810, 900, camina), t, 0.5);
    $('#ba-luz').innerHTML = `<polygon points="980,-40 1040,-40 ${700 + Math.sin(t * 1.4) * 220},${CORNISA} ${400 + Math.sin(t * 1.4) * 220},${CORNISA}" fill="#fff6c8" opacity=".09"/>`;
  },
};

// Desde la cornisa, viendo hacia arriba: Memo se asoma, te alumbra y golpea el barandal.
ESCENAS.alumbra = {
  html: lienzo(`${defsHaz}
    <defs><linearGradient id="al-cono" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8" stop-opacity=".8"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)">
      <polygon points="-200,1920 1280,1920 900,420 180,420" fill="#4b4550" stroke="${INK}" stroke-width="8"/>
      <polygon points="300,1500 520,1500 505,1120 330,1120" fill="#0b0d12" stroke="#9aa3ad" stroke-width="8"/>
    </g>
    <g id="al-memo"></g>
    <g filter="url(#ink)">
      <polygon points="150,420 930,420 950,540 130,540" fill="#5e5960" stroke="${INK}" stroke-width="8"/>
      <line x1="140" y1="420" x2="940" y2="420" stroke="#9aa3ad" stroke-width="14"/>
      ${[200, 330, 460, 590, 720, 850].map(x => `<line x1="${x}" y1="420" x2="${x}" y2="480" stroke="#9aa3ad" stroke-width="10"/>`).join('')}
    </g>
    <g id="al-brazo"></g>
    <rect id="al-flash" width="1080" height="1920" fill="#fff6c8" opacity="0"/>
    ${viñeta}`),
  fijo: `<div class="onomato" id="al-clang" style="top:170px;left:520px;font-size:150px;opacity:0">¡CLANG!</div>`,
  camara: { claves: [[INI.alumbra, 1.0, 0, 120], [M.alumbraM, 1.15, 0, 180], [M.golpea, 1.15, 0, 180], [FIN('alumbra'), 1.25, 0, 220]], origen: '540px 500px' },
  update(lt, dur, t) {
    const asoma = ease.outCubic(clamp((t - INI.alumbra) / 0.6));
    $('#al-memo').innerHTML = `<g filter="url(#contorno)">${memo({ head: [540, lerp(480, 340, asoma)], r: 85, neck: [540, lerp(560, 420, asoma)], hip: [540, 470], look: 0, lookY: 22, eyeScale: 1.1 })}</g>`;
    // brazo con la lámpara: alumbra hacia abajo; en "golpea" sube y pega en el barandal
    const sube = t > M.golpea - 0.1 && t < CLANG ? ease.inOut(clamp((t - M.golpea + 0.1) / (CLANG - M.golpea + 0.1))) : 0;
    const pega = t >= CLANG ? Math.exp(-(t - CLANG) * 8) : 0;
    const hx = 680, hy = lerp(500, 300, sube) + 120 * pega;
    const on = t > M.alumbraM - 0.3;
    const cono = on ? `<polygon points="${hx - 10},${hy + 30} ${hx + 10},${hy + 30} ${hx + 520 + Math.sin(t * 9) * 40 * pega},1920 ${hx - 640 + Math.sin(t * 9) * 40 * pega},1920" fill="url(#al-cono)" opacity="${0.75 - 0.4 * sube}"/>` : '';
    $('#al-brazo').innerHTML = cono + `<g filter="url(#contorno)">${linea([[600, 470], [650, 440], [hx, hy]], 85 * 0.085)}
      <g transform="translate(${hx} ${hy}) rotate(${90 - 70 * sube})"><rect x="-13" y="-10" width="26" height="56" rx="6" fill="#2a2d33" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="48" r="15" fill="#fff6c8"/></g></g>`;
    $('#al-flash').setAttribute('opacity', on ? 0.25 * clamp(1 - (t - M.alumbraM + 0.3) / 0.4) : 0);
    const c = $('#al-clang'), dc = t - CLANG;
    c.style.opacity = dc > 0 && dc < 0.9 ? 1 : 0;
    c.style.transform = `rotate(-8deg) scale(${lerp(1.5, 1, clamp(dc / 0.12))})`;
    if (dc > 0 && dc < 0.4) $('#esc-alumbra .cam').style.transform += ` translate(${Math.sin(lt * 90) * 14}px, ${Math.cos(lt * 80) * 10}px)`;
  },
};

// Tu departamento visto por la ventana: quietos con la cara hacia arriba; luego voltean hacia ti.
const adentro = [{ x: 260, h: 620, d: 0.0 }, { x: 470, h: 700, d: 0.25 }, { x: 690, h: 650, d: 0.1 }, { x: 880, h: 560, d: 0.35 }, { x: 380, h: 480, d: 0.5 }].sort((a, b) => a.h - b.h);
ESCENAS.voltean = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#0b0d12"/>
    <g filter="url(#ink)">
      <rect x="0" y="1480" width="1080" height="440" fill="#1a130e"/>
      <rect x="760" y="560" width="200" height="900" fill="#07080b" stroke="#2b2119" stroke-width="10"/>
      <g transform="translate(150 1440) rotate(-80)"><rect x="-10" y="-120" width="220" height="24" fill="#4a3428"/></g>
    </g>
    <g id="vo-gente" filter="url(#ink)"></g>
    <g id="vo-brillo"></g>
    <polygon points="0,0 380,0 80,1920 0,1920" fill="#fff6c8" opacity=".06"/>
    <g filter="url(#ink)">
      <path d="M0 0 H1080 V1920 H0 Z M70 90 V1830 H1010 V90 Z" fill-rule="evenodd" fill="#9aa3ad" stroke="${INK}" stroke-width="8"/>
      <line x1="540" y1="90" x2="540" y2="1830" stroke="#9aa3ad" stroke-width="22"/>
    </g>
    <path d="M140 240 l200 -120 M160 420 l380 -230" stroke="#fff" stroke-width="10" opacity=".12"/>
    ${viñeta}`),
  camara: { claves: [[INI.voltean, 1.0, 0, 0], [M.cabezas, 1.06, 0, 20], [FIN('voltean'), 1.2, 0, 60]], origen: '540px 900px' },
  update(lt, dur, t) {
    let g = '', b = '';
    for (const p of adentro) {
      const giro = ease.outCubic(clamp((t - M.cabezas + 0.1 - p.d) / 0.3));
      const x = p.x + Math.sin(t * 0.7 + p.h) * 4, y = 1520 + (p.h - 560) * 0.15;
      g += infEn(x, y, p.h, infectadoQuieto(0, 0, lerp(-0.035, 0, giro)));
      if (giro > 0.5) for (const dx of [-0.035, 0.035]) b += `<ellipse cx="${x + dx * p.h}" cy="${y - 0.865 * p.h}" rx="${0.03 * p.h}" ry="${0.04 * p.h}" fill="#fff" opacity="${0.7 * giro}" filter="url(#blur10)"/>`;
    }
    $('#vo-gente').innerHTML = g;
    $('#vo-brillo').innerHTML = b;
  },
};

ESCENAS.manos = {
  html: lienzo(fachadaNoche('ma')),
  camara: { claves: [[INI.manos, 1.3, 120, -170], [M.corres, 1.3, -40, -180], [FIN('manos'), 1.32, -170, -190]] },
  update(lt, dur, t) {
    const k = i => ease.outBack(clamp((t - INI.manos - 0.1 - i * 0.25) / 0.4));
    $('#ma-mano').innerHTML = brazoVentana(720, k(0), t, 260, 0) + brazoVentana(880, k(1), t, 330, 1) + brazoVentana(1040, k(2), t, 400 + 60 * clamp((t - M.corres) / 0.5), 2);
    const corre = ease.inOut(clamp((t - M.corres + 0.3) / (FIN('manos') - M.corres + 0.3)));
    $('#ma-tu').innerHTML = tuCorriendo(lerp(760, 1060, corre), t, corre > 0 ? 1 : 0.2);
    $('#ma-luz').innerHTML = luzDeArriba(lerp(760, 1000, corre), t, 0.16);
  },
};

// ---------- 12 y 13. La esquina y la jaula del gas hasta la ventana del 402 ----------
ESCENAS.esquina = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#090b10"/>
    <g filter="url(#ink)">
      <rect x="-20" y="-20" width="660" height="1780" fill="#4b4550" stroke="${INK}" stroke-width="8"/>
      <polygon points="640,-20 1100,120 1100,1700 640,1760" fill="#2f2b34" stroke="${INK}" stroke-width="8"/>
      <rect x="-20" y="${CORNISA}" width="660" height="24" fill="#8a7f78" stroke="${INK}" stroke-width="6"/>
      <polygon points="640,${CORNISA} 1100,${CORNISA + 60} 1100,${CORNISA + 84} 640,${CORNISA + 24}" fill="#6e655f" stroke="${INK}" stroke-width="6"/>
      <rect x="620" y="-20" width="40" height="1780" fill="#5d636b" stroke="${INK}" stroke-width="6"/>
      <polygon points="800,1300 1000,1326 1000,1560 800,1540" fill="#2a1f22" stroke="#9aa3ad" stroke-width="7"/>
      <polygon points="800,1300 1000,1326 1000,1560 800,1540" fill="url(#luzCalida)"/>
    </g>
    ${[[420, 0], [500, 1], [580, 0], [700, 1], [790, 0], [880, 1]].map(([x, i], j) => huella(x, x < 640 ? CORNISA - 6 + (i ? 5 : -5) : CORNISA + (x - 640) * 0.13 - 2 + (i ? 4 : -4), 0.6, 0.85)).join('')}
    <g id="es-tu"></g>
    ${viñeta}`),
  camara: { claves: [[INI.esquina, 1.2, 60, -150], [M.esquinaM, 1.35, -60, -210], [FIN('esquina'), 1.4, -100, -220]] },
  update(lt, dur, t) {
    const x = lerp(380, 560, ease.inOut(clamp((t - INI.esquina) / 1.4)));
    $('#es-tu').innerHTML = tuNoche({ head: [x + 10, CORNISA - 330], r: 70, neck: [x + 8, CORNISA - 260], hip: [x, CORNISA - 120],
      legL: [[x - 25, CORNISA - 60], [x - 35, CORNISA]], legR: [[x + 25, CORNISA - 60], [x + 40, CORNISA]], footL: -1, footR: 1,
      armL: [[x - 60, CORNISA - 200], [x - 70, CORNISA - 140]], armR: [[x + 60, CORNISA - 220], [x + 90, CORNISA - 260]], look: 28, eyeScale: 1.4 });
  },
};

const jaulaGas = `<g filter="url(#ink)">
  <rect x="520" y="760" width="340" height="270" fill="#1c1f26" stroke="${INK}" stroke-width="8"/>
  ${[0, 1].map(i => `<rect x="${570 + i * 140}" y="800" width="100" height="220" rx="40" fill="#5f7fa8" stroke="${INK}" stroke-width="6"/><rect x="${600 + i * 140}" y="784" width="40" height="24" rx="6" fill="#9aa3ad" stroke="${INK}" stroke-width="5"/>`).join('')}
  ${[540, 590, 640, 690, 740, 790, 840].map(x => `<line x1="${x}" y1="760" x2="${x}" y2="1030" stroke="#9aa3ad" stroke-width="7"/>`).join('')}
  <rect x="520" y="760" width="340" height="270" fill="none" stroke="#9aa3ad" stroke-width="10"/></g>`;
ESCENAS.jaula = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#090b10"/>
    <g filter="url(#ink)">
      <rect x="-20" y="-20" width="1120" height="1780" fill="#2f2b34" stroke="${INK}" stroke-width="8"/>
      <rect x="-20" y="620" width="1120" height="24" fill="#8a7f78" stroke="${INK}" stroke-width="6"/>
      <rect x="-20" y="644" width="1120" height="20" fill="#5e5049" stroke="${INK}" stroke-width="5"/>
      <rect x="560" y="1110" width="420" height="330" fill="#2a1f22" stroke="${INK}" stroke-width="8"/>
      <rect x="560" y="1110" width="420" height="330" fill="url(#luzCalida)"/>
      <path d="M566 1116 h408 v100 q-25 22 -51 0 q-25 22 -51 0 q-25 22 -51 0 q-25 22 -51 0 q-25 22 -51 0 q-25 22 -51 0 q-25 22 -51 0 q-25 22 -51 0 z" fill="#d8a7b5" opacity=".8"/>
      <rect x="560" y="1110" width="420" height="330" fill="none" stroke="#9aa3ad" stroke-width="10"/>
      <rect x="540" y="1440" width="460" height="22" fill="#8a7f78" stroke="${INK}" stroke-width="6"/>
    </g>
    ${jaulaGas}
    ${[[120, 0], [210, 1], [300, 0], [390, 1], [480, 0]].map(([x, i]) => huella(x, 612 + (i ? 4 : -4), 0.6, 0.85)).join('')}
    <g id="ja-huellas"></g>
    <g id="ja-tu"></g>
    ${viñeta}`),
  camara: { claves: [[INI.jaula, 1.15, 160, 120], [M.hasta - 0.3, 1.15, 40, 0], [M.hasta + 0.6, 1.3, -60, -140], [FIN('jaula'), 1.32, -70, -150]] },
  update(lt, dur, t) {
    const marcas = [[560, 752], [650, 748], [740, 752], [800, 1100], [860, 1432], [930, 1432]];
    $('#ja-huellas').innerHTML = marcas.map(([x, y], i) => huella(x, y, 0.6, clamp((t - INI.jaula - 0.3 - i * 0.35) / 0.2))).join('');
    // bajas de la cornisa a la jaula
    const b = ease.inOut(clamp((t - M.jaula) / 1.4));
    const x = lerp(380, 640, b), y = lerp(612, 752, b);
    $('#ja-tu').innerHTML = tuNoche({ head: [x, y - 300 + 40 * b], r: 66, neck: [x + 4, y - 236 + 40 * b], hip: [x + 10, y - 110 + 20 * b],
      legL: [[x - 40, y - 50], [x - 30, y]], legR: [[x + 40, y - 50], [x + 30, y]], armL: [[x - 50, y - 180], [x - 70, y - 120]], armR: [[x + 60, y - 170], [x + 100, y - 100]],
      lookY: 18, look: 10, eyeScale: 1.3 });
  },
};

// ---------- 14. La cortina del 402 se mueve; una mano arrugada te hace señas ----------
ESCENAS.cortina = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#090b10"/>
    <g filter="url(#ink)">
      <rect x="-20" y="-20" width="1120" height="1960" fill="#2f2b34"/>
      <rect x="100" y="300" width="880" height="1060" fill="#2a1f22" stroke="${INK}" stroke-width="10"/>
    </g>
    <circle cx="540" cy="880" r="520" fill="url(#luzCalida)"/>
    <g id="co-vela" filter="url(#ink)"><rect x="700" y="1080" width="34" height="110" fill="#efe6cf" stroke="${INK}" stroke-width="5"/></g>
    <path id="co-llama" d="" fill="#f3c46a" stroke="#c9792b" stroke-width="3"/>
    <g id="co-cortina" filter="url(#ink)"></g>
    <g id="co-mano" filter="url(#ink)"></g>
    <g filter="url(#ink)"><rect x="100" y="300" width="880" height="1060" fill="none" stroke="#9aa3ad" stroke-width="16"/>
      <rect x="70" y="1360" width="940" height="40" fill="#8a7f78" stroke="${INK}" stroke-width="7"/></g>
    ${viñeta}`),
  camara: { claves: [[INI.cortina, 1.0, 0, 0], [M.mano, 1.08, 0, 0], [FIN('cortina'), 1.22, -40, -40]], origen: '540px 900px' },
  update(lt, dur, t) {
    const fl = Math.sin(t * 17) * 4 + Math.sin(t * 11) * 3;
    $('#co-llama').setAttribute('d', `M717 1080 q-17 -28 0 -${62 + fl} q17 ${34 + fl / 2} 0 ${62 + fl} z`);
    const abre = ease.inOut(clamp((t - INI.cortina - 0.2) / 0.9)), ola = Math.sin(t * 3) * 12;
    let c = `<path d="M110 310 H970 V440 Q850 470 730 440 Q610 470 490 440 Q370 470 250 440 Q180 455 110 440 Z" fill="#d8a7b5" stroke="${INK}" stroke-width="6"/>`;
    const w = lerp(400, 150, abre);
    c += `<path d="M110 440 H${110 + w} Q${90 + w + ola} 900 ${110 + w * 0.8} 1350 H110 Z" fill="#d8a7b5" stroke="${INK}" stroke-width="6"/>`;
    c += `<path d="M970 440 H${970 - w * 0.9} Q${990 - w * 0.9 - ola} 900 ${970 - w * 0.7} 1350 H970 Z" fill="#c995a6" stroke="${INK}" stroke-width="6"/>`;
    $('#co-cortina').innerHTML = c;
    // la mano: sale de atrás de la cortina izquierda y hace señas (los dedos se doblan)
    const sale = ease.outCubic(clamp((t - M.mano + 0.2) / 0.5));
    const dobla = t > M.mano ? 0.5 + 0.5 * Math.sin((t - M.mano) * 7) : 0;
    const hx = lerp(120, 380, sale), hy = 860;
    const PIEL = '#e9e2d6';
    $('#co-mano').innerHTML = sale > 0 ? `
      <path d="M${hx - 260} ${hy + 40} L${hx - 40} ${hy + 20} L${hx - 40} ${hy + 110} L${hx - 260} ${hy + 140} Z" fill="#8d8f96" stroke="${INK}" stroke-width="7"/>
      ${[...Array(5)].map((_, i) => linea([[hx - 70 - i * 30, hy + 120], [hx - 70 - i * 30, hy + 150]], 4)).join('')}
      <ellipse cx="${hx + 20}" cy="${hy + 65}" rx="80" ry="64" fill="${PIEL}" stroke="${INK}" stroke-width="7"/>
      <path d="M${hx - 10} ${hy + 50} q20 10 40 0 M${hx} ${hy + 80} q20 8 36 -2" stroke="#b9ad9a" stroke-width="4" fill="none"/>
      ${[-40, -13, 14, 41].map((dy, i) => {
        const L = 95 - Math.abs(dy) * 0.6, a = -0.1 + dobla * (1.6 + i * 0.1);
        const x1 = hx + 85, y1 = hy + 65 + dy * 0.9, x2 = x1 + Math.cos(a) * L * 0.55, y2 = y1 + Math.sin(a) * L * 0.55, x3 = x2 + Math.cos(a * 1.8) * L * 0.45, y3 = y2 + Math.sin(a * 1.8) * L * 0.45;
        return linea([[x1, y1], [x2, y2], [x3, y3]], 30, INK) + linea([[x1, y1], [x2, y2], [x3, y3]], 20, PIEL);
      }).join('')}
      ${linea([[hx + 10, hy + 10], [hx + 50, hy - 30]], 30, INK)}${linea([[hx + 10, hy + 10], [hx + 50, hy - 30]], 20, PIEL)}` : '';
  },
};

// ---------- 15 a 18. La decisión: Chispa adentro, Memo arriba, las llaves de la comida, Rosa en la ventana ----------
// La ventana del 402 de cerca, como en la escena de la cortina.
function ventana402(pre) {
  return `
    <rect width="1080" height="1920" fill="#090b10"/>
    <g filter="url(#ink)">
      <rect x="-20" y="-20" width="1120" height="1960" fill="#2f2b34"/>
      <rect x="100" y="300" width="880" height="1060" fill="#2a1f22" stroke="${INK}" stroke-width="10"/>
    </g>
    <circle cx="540" cy="880" r="520" fill="url(#luzCalida)"/>
    <g filter="url(#ink)"><rect x="700" y="1080" width="34" height="110" fill="#efe6cf" stroke="${INK}" stroke-width="5"/></g>
    <path id="${pre}-llama" d="" fill="#f3c46a" stroke="#c9792b" stroke-width="3"/>
    <g id="${pre}-atras" filter="url(#ink)"></g>
    <g filter="url(#ink)">
      <path d="M110 310 H970 V440 Q850 470 730 440 Q610 470 490 440 Q370 470 250 440 Q180 455 110 440 Z" fill="#d8a7b5" stroke="${INK}" stroke-width="6"/>
      <path d="M110 440 H260 Q250 900 230 1350 H110 Z" fill="#d8a7b5" stroke="${INK}" stroke-width="6"/>
      <path d="M970 440 H835 Q850 900 865 1350 H970 Z" fill="#c995a6" stroke="${INK}" stroke-width="6"/>
    </g>
    <g id="${pre}-frente" filter="url(#ink)"></g>
    <g filter="url(#ink)"><rect x="100" y="300" width="880" height="1060" fill="none" stroke="#9aa3ad" stroke-width="16"/>
      <rect x="70" y="1360" width="940" height="40" fill="#8a7f78" stroke="${INK}" stroke-width="7"/></g>
    ${viñeta}`;
}
const llama402 = (pre, t) => { const fl = Math.sin(t * 17) * 4 + Math.sin(t * 11) * 3; $(`#${pre}-llama`).setAttribute('d', `M717 1080 q-17 -28 0 -${62 + fl} q17 ${34 + fl / 2} 0 ${62 + fl} z`); };
// Mano de Rosa (arrugada, con la orilla del rebozo). (hx, hy) es la palma. dobla 0..1 cierra los dedos.
const manoRosa = (hx, hy, dobla, ang = 0) => {
  const PIEL = '#e9e2d6';
  return `<g transform="rotate(${ang} ${hx} ${hy})">
    <path d="M${hx - 260} ${hy - 25} L${hx - 40} ${hy - 45} L${hx - 40} ${hy + 45} L${hx - 260} ${hy + 75} Z" fill="#8d8f96" stroke="${INK}" stroke-width="7"/>
    ${[...Array(5)].map((_, i) => linea([[hx - 70 - i * 30, hy + 55], [hx - 70 - i * 30, hy + 85]], 4)).join('')}
    <ellipse cx="${hx + 20}" cy="${hy}" rx="80" ry="64" fill="${PIEL}" stroke="${INK}" stroke-width="7"/>
    <path d="M${hx - 10} ${hy - 15} q20 10 40 0 M${hx} ${hy + 15} q20 8 36 -2" stroke="#b9ad9a" stroke-width="4" fill="none"/>
    ${[-40, -13, 14, 41].map((dy, i) => {
      const L = 95 - Math.abs(dy) * 0.6, a = -0.1 + dobla * (1.6 + i * 0.1);
      const x1 = hx + 85, y1 = hy + dy * 0.9, x2 = x1 + Math.cos(a) * L * 0.55, y2 = y1 + Math.sin(a) * L * 0.55, x3 = x2 + Math.cos(a * 1.8) * L * 0.45, y3 = y2 + Math.sin(a * 1.8) * L * 0.45;
      return linea([[x1, y1], [x2, y2], [x3, y3]], 30, INK) + linea([[x1, y1], [x2, y2], [x3, y3]], 20, PIEL);
    }).join('')}
    ${linea([[hx + 10, hy - 55], [hx + 50, hy - 95]], 30, INK)}${linea([[hx + 10, hy - 55], [hx + 50, hy - 95]], 20, PIEL)}</g>`;
};

// Detrás de la cortina se asoma una cola café que se mueve: Chispa.
ESCENAS.cola = {
  html: lienzo(ventana402('cl')),
  camara: { claves: [[INI.cola, 1.0, 0, 0], [M.chispaC, 1.25, -170, -120], [FIN('cola'), 1.32, -180, -140]], origen: '540px 900px' },
  update(lt, dur, t) {
    llama402('cl', t);
    const sale = ease.outCubic(clamp((t - INI.cola - 0.3) / 0.6)), mueve = Math.sin(t * 11) * 22 * sale;
    // la cola sale de atrás de la cortina derecha y se menea: una cola peluda que se angosta
    const L = 270 * sale, ang = -1.15 + Math.sin(t * 11) * 0.38 * sale;
    const cx = 850, cy = 1330, ex = cx - Math.cos(ang) * L, ey = cy + Math.sin(ang) * L;
    const mx = cx - Math.cos(ang) * L * 0.55 + 45, my = cy + Math.sin(ang) * L * 0.55;
    $('#cl-atras').innerHTML = sale > 0 ? `<path d="M${cx - 46} ${cy} Q${mx - 40} ${my} ${ex} ${ey} Q${mx + 40} ${my + 10} ${cx + 46} ${cy} Z" fill="#6e4325" stroke="${INK}" stroke-width="8"/>
      <path d="M${ex} ${ey} l14 -14 M${ex} ${ey} l18 6 M${ex} ${ey} l4 18" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <path d="M${(cx + mx) / 2} ${(cy + my) / 2 - 30} l-10 -18 M${mx} ${my - 26} l-12 -16" stroke="#5a361d" stroke-width="6" stroke-linecap="round"/>` : '';
    $('#cl-frente').innerHTML = manoRosa(380, 860, 0.5 + 0.5 * Math.sin((t - INI.cola) * 7));
  },
};

// Arriba, Memo grita en la orilla de la azotea. Detrás de él, cabezas y brazos grises.
ESCENAS.grita = {
  html: lienzo(`
    <defs><linearGradient id="gr-cono" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8" stop-opacity=".7"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)"><polygon points="-200,1920 1280,1920 900,420 180,420" fill="#4b4550" stroke="${INK}" stroke-width="8"/></g>
    <g id="gr-detras" filter="url(#ink)"></g>
    <g id="gr-memo"></g>
    <g filter="url(#ink)">
      <polygon points="150,420 930,420 950,540 130,540" fill="#5e5960" stroke="${INK}" stroke-width="8"/>
      <line x1="140" y1="420" x2="940" y2="420" stroke="#9aa3ad" stroke-width="14"/>
      ${[200, 330, 460, 590, 720, 850].map(x => `<line x1="${x}" y1="420" x2="${x}" y2="480" stroke="#9aa3ad" stroke-width="10"/>`).join('')}
    </g>
    <g id="gr-luz"></g>
    ${viñeta}`),
  fijo: `<div class="onomato" id="gr-grito" style="top:110px;left:120px;font-size:120px;opacity:0">¡AYÚDAME!</div>`,
  camara: { claves: [[INI.grita, 1.1, 0, 180], [M.golpeM, 1.15, 0, 200], [FIN('grita'), 1.3, 0, 240]], origen: '540px 500px' },
  update(lt, dur, t) {
    const tiembla = Math.sin(t * 40) * 5;
    $('#gr-memo').innerHTML = `<g filter="url(#contorno)">${memo({ head: [540 + tiembla, 340], r: 85, neck: [540, 420], hip: [540, 470], look: -20 * Math.sin(t * 3), lookY: -6, eyeScale: 1.6 })}</g>`;
    const llegan = ease.outCubic(clamp((t - M.golpeM + 0.2) / 1.0));
    let d = '';
    [[300, 0], [760, 0.2], [430, 0.4], [650, 0.3]].forEach(([x, dl], i) => {
      const k = ease.outCubic(clamp((t - M.golpeM + 0.3 - dl) / 0.6));
      if (k <= 0) return;
      const y = 380 - 60 * k;
      d += `<circle cx="${x}" cy="${y}" r="58" fill="url(#headInfectado)" stroke="#050608" stroke-width="7"/>
        <ellipse cx="${x - 20}" cy="${y}" rx="8" ry="13" fill="#f2f2f2"/><ellipse cx="${x + 20}" cy="${y}" rx="8" ry="13" fill="#f2f2f2"/>
        ${linea([[x + 30, y + 40], [x + 90 * (x < 540 ? 1 : -1), y + 10 + Math.sin(t * 9 + i) * 15], [540 + (x < 540 ? -70 : 70), 400]], 28, '#050608')}
        ${linea([[x + 30, y + 40], [x + 90 * (x < 540 ? 1 : -1), y + 10 + Math.sin(t * 9 + i) * 15], [540 + (x < 540 ? -70 : 70), 400]], 16, '#9aa0a8')}`;
    });
    $('#gr-detras').innerHTML = d;
    const a = Math.PI / 2 + Math.sin(t * 7) * 0.7;
    $('#gr-luz').innerHTML = `<polygon points="680,480 ${680 + Math.cos(a - 0.2) * 1600},${480 + Math.sin(a - 0.2) * 1600} ${680 + Math.cos(a + 0.2) * 1600},${480 + Math.sin(a + 0.2) * 1600}" fill="url(#gr-cono)" opacity=".5"/>`;
    const g = $('#gr-grito');
    g.style.opacity = t > INI.grita + 0.2 ? 1 : 0;
    g.style.transform = `rotate(-6deg) translate(${Math.sin(t * 50) * 6}px, 0)`;
  },
};

// Las llaves de Memo: la de la tienda. Sin él, no hay comida. Ni croquetas: el plato de Chispa vacío.
ESCENAS.llaves = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#0b0f17"/>
    <circle cx="540" cy="620" r="520" fill="url(#luzLuna)" opacity=".3"/>
    <g id="ll-llavero" filter="url(#ink)"></g>
    <g filter="url(#ink)">
      <rect y="1250" width="1080" height="700" fill="#1a130e"/>
      <ellipse cx="540" cy="1420" rx="250" ry="70" fill="#2f6fd6" stroke="${INK}" stroke-width="9"/>
      <ellipse cx="540" cy="1400" rx="190" ry="44" fill="#1d4a99" stroke="${INK}" stroke-width="6"/>
      <text x="540" y="1480" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="64" fill="#fff">Chispa</text>
      <circle cx="610" cy="1398" r="9" fill="#8a603f"/>
    </g>
    ${viñeta}`),
  camara: { claves: [[INI.llaves, 1.3, 0, 330], [M.comida - 0.2, 1.25, 0, 300], [M.croquetas, 1.2, 0, -300], [FIN('llaves'), 1.25, 0, -330]], origen: '540px 960px' },
  update(lt, dur, t) {
    const a = Math.sin(t * 2.4) * 8;
    const llave = (i, txt) => `<g transform="rotate(${-30 + i * 22} 540 420)"><rect x="530" y="430" width="22" height="200" rx="6" fill="#c9a43a" stroke="${INK}" stroke-width="5"/>
      <path d="M552 590 h22 v14 h-12 v12 h14 v14 h-24" fill="#c9a43a" stroke="${INK}" stroke-width="4"/>${txt}</g>`;
    $('#ll-llavero').innerHTML = `<g transform="rotate(${a} 540 300)">
      <line x1="540" y1="-20" x2="540" y2="350" stroke="#9aa3ad" stroke-width="8"/>
      <circle cx="540" cy="400" r="58" fill="none" stroke="#b8bec6" stroke-width="12"/>
      ${llave(0, '')}${llave(1, '')}${llave(3, '')}
      ${llave(2, `<g transform="translate(560 640) rotate(12)"><rect x="-10" y="0" width="190" height="80" rx="8" fill="#efe6cf" stroke="${INK}" stroke-width="5"/>
        <text x="85" y="56" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="56" fill="${TINTA}">TIENDA</text></g>`)}</g>`;
  },
};

// La mano de Rosa en la manija de la ventana. Si entras, cierra y no vuelve a abrir.
ESCENAS.cierra = {
  html: lienzo(ventana402('ci')),
  camara: { claves: [[INI.cierra, 1.0, 0, 0], [M.noabre, 1.18, 60, 40], [FIN('cierra'), 1.25, 70, 50]], origen: '540px 900px' },
  update(lt, dur, t) {
    llama402('ci', t);
    const asoma = Math.sin(t * 1.5) * 6;
    $('#ci-atras').innerHTML = `<g transform="translate(${asoma} 0)"><circle cx="860" cy="1000" r="70" fill="#6e4325" stroke="${INK}" stroke-width="8"/>
      <path d="M835 940 l22 -80 l34 70 z" fill="#5a361d" stroke="${INK}" stroke-width="7"/>
      <path d="M800 1010 q-50 4 -54 30 q8 22 54 18 z" fill="#7d4f2d" stroke="${INK}" stroke-width="7"/>
      <circle cx="752" cy="1026" r="10" fill="${INK}"/><circle cx="820" cy="985" r="9" fill="${INK}"/><circle cx="823" cy="982" r="3" fill="#fff"/></g>`;
    const baja = ease.inOut(clamp((t - M.noabre) / 0.6));
    $('#ci-frente').innerHTML = `<rect x="470" y="780" width="70" height="26" rx="8" fill="#9aa3ad" stroke="${INK}" stroke-width="5" transform="rotate(${-40 * baja} 480 793)"/>` +
      manoRosa(470, 800 + 40 * baja, 0.85, -10);
  },
};

// La decisión para los comentarios.
ESCENAS.decide = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="960" r="900" fill="url(#luzLuna)" opacity=".12"/>`)}
    <div class="decide-tit" id="de-tit">¿QUÉ HACES?</div>
    <div class="opcion" id="de-a" style="top:560px;font-size:74px"><span class="emo">🐕</span><span class="txt">ENTRAS CON CHISPA</span></div>
    <div class="opcion" id="de-b" style="top:900px;font-size:74px"><span class="emo">🔑</span><span class="txt">SUBES POR MEMO</span></div>
    <div class="decide-com" id="de-com">COMENTA <span class="emo">🐕</span> O <span class="emo">🔑</span></div>
    <div class="decide-pie" id="de-pie">EL FINAL LO ELIGEN USTEDES</div>`,
  update(lt, dur, t) {
    pop($('#de-tit'), t, INI.decide);
    pop($('#de-a'), t, INI.decide + 0.15);
    pop($('#de-b'), t, M.subes - 0.1);
    pop($('#de-com'), t, M.comentaM);
    $('#de-pie').style.opacity = clamp((t - M.comentaM - 0.6) / 0.3);
    const a = t < M.subes - 0.1, b = t >= M.subes - 0.1 && t < M.comentaM;
    $('#de-a').style.borderColor = a ? '#e5a83b' : '#fff';
    $('#de-b').style.borderColor = b ? '#9fd0ff' : '#fff';
    if (a) $('#de-a').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
    if (b) $('#de-b').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
  },
};
