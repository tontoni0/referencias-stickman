// Escenas de "La alerta", temporada 2, parte 2: La puerta.
// Sigue sin pausa a la parte 1: Memo está afuera del 402. Lo mordieron en la azotea y se está transformando.
// Termina con una decisión para los comentarios: 🚪 le abres o 🔒 no le abres.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const TOCS = [0.25, 0.85, 1.45];                       // los tres golpes despacio, antes de la voz
const SNAP = M.voltea - 0.05;                           // la cabeza de Memo voltea de golpe
const CORTE = M.calla + 0.32;                           // la alerta se calla
const GOLPES = (() => { const g = []; for (let x = M.golpeaM - 0.15; x < INI.dilema - 0.3; x += 0.62) g.push(x); return g; })();

const PISO = 1400;
const pop = (el, t, t0, d = 0.3) => { const p = clamp((t - t0) / d); el.style.opacity = p; el.style.transform = `scale(${lerp(0.7, 1, ease.outBack(p))})`; };
// Cámara que pone el punto (qx, qy) en el centro a escala s, sin salirse del cuadro.
const foco = (t, s, qx, qy) => [t, s, clamp(-s * (qx - 540), -(s - 1) * 540, (s - 1) * 540), clamp(-s * (qy - 960), -(s - 1) * 960, (s - 1) * 960)];
const golpeDesde = (t, lista) => { const u = lista.filter(g => g <= t).pop(); return u === undefined ? 9 : t - u; };

// ---------- Piezas ----------
const vela = (x, y, t, s = 1) => {
  const fl = Math.sin(t * 17) * 4 + Math.sin(t * 11) * 3;
  return `<circle cx="${x}" cy="${y - 40 * s}" r="${260 * s}" fill="url(#luzCalida)"/>
    <rect x="${x - 17 * s}" y="${y}" width="${34 * s}" height="${110 * s}" fill="#efe6cf" stroke="${INK}" stroke-width="${5 * s}"/>
    <path d="M${x} ${y} q${-17 * s} ${-28 * s} 0 ${-(62 + fl) * s} q${17 * s} ${(34 + fl / 2) * s} 0 ${(62 + fl) * s} z" fill="#f3c46a" stroke="#c9792b" stroke-width="3"/>`;
};
const rosaDe = (x, y, r, o = {}) => rosa({ head: [x, y], r, neck: [x + 4, y + r * 1.05], hip: [x + 10, y + r * 3.4],
  legL: [[x - 10, y + r * 4.4], [x - 20, y + r * 5.4]], legR: [[x + 30, y + r * 4.4], [x + 40, y + r * 5.4]], footL: -1, footR: 1,
  armL: o.armL || [[x - r * 0.9, y + r * 2.2], [x - r * 1.0, y + r * 3.0]], armR: o.armR || [[x + r * 0.9, y + r * 2.2], [x + r * 1.0, y + r * 3.0]],
  brazosAlFrente: true, look: o.look || 0, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1 });
// Tú, de pie, pies en (x, y).
const tuDe = (x, y, r, o = {}) => `<g filter="url(#contorno)">${stick({ head: [x, y - r * 5.3], r, neck: [x, y - r * 4.2], hip: [x, y - r * 1.9],
  legL: [[x - r * 0.3, y - r * 0.95], [x - r * 0.38, y]], legR: [[x + r * 0.3, y - r * 0.95], [x + r * 0.38, y]], footL: -1, footR: 1,
  armL: o.armL || [[x - r * 0.75, y - r * 3.1], [x - r * 0.8, y - r * 2.2]], armR: o.armR || [[x + r * 0.75, y - r * 3.1], [x + r * 0.85, y - r * 2.2]],
  look: o.look || 0, lookY: o.lookY || 0, eyeScale: o.eyeScale || 1 })}</g>`;
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
// La lámpara en la mano de Memo, alumbrando hacia ang.
const lampara = (hx, hy, ang, largo = 900, op = 0.7) => `<polygon points="${hx},${hy} ${hx + Math.cos(ang - 0.22) * largo},${hy + Math.sin(ang - 0.22) * largo} ${hx + Math.cos(ang + 0.22) * largo},${hy + Math.sin(ang + 0.22) * largo}" fill="url(#haz)" opacity="${op}"/>
  <g transform="translate(${hx} ${hy}) rotate(${ang * 180 / Math.PI})" filter="url(#ink)"><rect x="-14" y="-14" width="58" height="28" rx="6" fill="#2a2d33" stroke="${INK}" stroke-width="5"/><circle cx="46" cy="0" r="15" fill="#fff6c8"/></g>`;

// La puerta del 402 vista de frente, desde adentro. Por debajo entra la luz de la lámpara.
function puertaDentro(pre) {
  return `
    <rect width="1080" height="1920" fill="#241d29"/>
    <g filter="url(#ink)">
      <rect x="-20" y="${PISO}" width="1120" height="540" fill="#1a141d" stroke="${INK}" stroke-width="8"/>
      <rect x="580" y="430" width="400" height="${PISO - 430}" fill="#2a1d14" stroke="${INK}" stroke-width="10"/>
    </g>
    <g id="${pre}-hoja" filter="url(#ink)"></g>
    <rect id="${pre}-raya" x="590" y="${PISO - 14}" width="380" height="16" fill="#fff6c8" opacity=".7"/>
    <g id="${pre}-pies"></g>
    <g id="${pre}-cosas"></g>
    ${viñeta}`;
}
const hojaDentro = sacude => `<g transform="translate(${sacude} 0)"><rect x="592" y="442" width="376" height="${PISO - 454}" fill="#5a4030" stroke="${INK}" stroke-width="8"/>
  <rect x="640" y="510" width="280" height="330" fill="none" stroke="#4a3428" stroke-width="8"/><rect x="640" y="900" width="280" height="420" fill="none" stroke="#4a3428" stroke-width="8"/>
  <circle cx="630" cy="960" r="16" fill="#c9a43a" stroke="${INK}" stroke-width="5"/>
  <circle cx="780" cy="640" r="14" fill="#c9a43a" stroke="${INK}" stroke-width="5"/><circle cx="780" cy="640" r="5" fill="#111"/>
  <rect x="610" y="740" width="40" height="70" rx="6" fill="#8d8f96" stroke="${INK}" stroke-width="5"/></g>`;

// Corte de la puerta: adentro del 402 (izquierda) y el pasillo (derecha).
function corte402(pre) {
  return `
    <rect width="1080" height="1920" fill="#08090d"/>
    <rect x="0" y="300" width="525" height="${PISO - 300}" fill="#2a1f24"/>
    <rect x="555" y="300" width="525" height="${PISO - 300}" fill="#10141c"/>
    <g id="${pre}-luzD"></g>
    <g filter="url(#ink)">
      <rect x="-20" y="${PISO}" width="545" height="540" fill="#33251a" stroke="${INK}" stroke-width="8"/>
      <rect x="555" y="${PISO}" width="545" height="540" fill="#1a1f2a" stroke="${INK}" stroke-width="8"/>
      <rect x="515" y="280" width="50" height="${820 - 280}" fill="#3a3e46" stroke="${INK}" stroke-width="8"/>
      <rect x="-20" y="280" width="1120" height="30" fill="#3a3e46" stroke="${INK}" stroke-width="8"/>
      <rect x="40" y="${PISO - 150}" width="150" height="150" fill="#4a3428" stroke="${INK}" stroke-width="7"/>
      <path d="M1000 ${PISO} L1000 900 M960 ${PISO} L960 1000 M1080 900 L940 1060" stroke="#2c313c" stroke-width="10" fill="none"/>
      <text x="800" y="420" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" fill="#5a6070">PASILLO · 4º PISO</text>
    </g>
    <g id="${pre}-puerta"></g>
    <g id="${pre}-dentro"></g>
    <g id="${pre}-afuera"></g>
    <rect id="${pre}-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`;
}
const puertaCorte = (sacude = 0) => `<g filter="url(#ink)" transform="translate(${sacude} 0)"><rect x="522" y="820" width="36" height="${PISO - 820}" fill="#5a4030" stroke="${INK}" stroke-width="7"/>
  <rect x="514" y="1080" width="12" height="40" fill="#c9a43a" stroke="${INK}" stroke-width="3"/><rect x="554" y="1080" width="12" height="40" fill="#c9a43a" stroke="${INK}" stroke-width="3"/></g>`;
// Adentro: tú, Rosa, Chispa y la vela. o.rosaLook, o.chispa ('gruñe' o 'parada').
function dentro402(t, o = {}) {
  return vela(115, PISO - 260, t, 0.7) +
    tuDe(170, PISO, 60, { look: 10, eyeScale: o.miedo ? 1.3 : 1 }) +
    `<g filter="url(#contorno)">${rosaDe(320, PISO - 60 * 5.4, 60, { look: o.rosaLook ?? 10, eyeScale: o.rosaOjos || 1,
      armL: [[262, PISO - 60 * 2.6], o.agarra ? [215, PISO - 60 * 3.1] : [255, PISO - 60 * 1.9]] })}</g>` +
    `<g filter="url(#ink)" transform="translate(${445 + (o.tiembla ? Math.sin(t * 50) * 3 : 0)} ${PISO - 96}) scale(0.8)">${perro(o.chispa || 'gruñe')}</g>` +
    `<rect x="380" y="${PISO - 8}" width="140" height="10" fill="#fff6c8" opacity=".5"/>`;
}

// ---------- 1. Tres golpes en la puerta. Despacio ----------
ESCENAS.golpes = {
  html: lienzo(puertaDentro('go')),
  fijo: `<div class="onomato" id="go-toc" style="top:520px;left:600px;font-size:150px;opacity:0">TOC</div>`,
  camara: { claves: [[0, 1.0, 0, 0], [TOCS[2] + 0.3, 1.05, -30, 0], [FIN('golpes'), 1.18, -80, -60]] },
  update(lt, dur, t) {
    const d = golpeDesde(t, TOCS);
    $('#go-hoja').innerHTML = hojaDentro(d < 0.15 ? Math.sin(t * 90) * 5 : 0);
    $('#go-raya').setAttribute('opacity', 0.55 + 0.25 * Math.sin(t * 2.3));
    $('#go-pies').innerHTML = [0, 1].map(k => `<rect x="${700 + k * 110}" y="${PISO - 14}" width="60" height="16" fill="#0c0e13"/>`).join('');
    $('#go-cosas').innerHTML = vela(150, 1150, t, 0.9) + `<g filter="url(#ink)" transform="translate(${370 + Math.sin(t * 50) * 2} ${PISO - 190}) scale(1.6)">${perro('gruñe')}</g>`;
    const toc = $('#go-toc'), k = TOCS.filter(g => g <= t).length - 1;
    toc.style.opacity = d < 0.4 ? 1 : 0;
    toc.style.left = [600, 700, 640][Math.max(0, k)] + 'px';
    toc.style.top = [520, 680, 840][Math.max(0, k)] + 'px';
    toc.style.transform = `rotate(${k % 2 ? 7 : -7}deg) scale(${lerp(1.4, 1, clamp(d / 0.12))})`;
  },
};

// ---------- 2. Rosa se asoma por la mirilla. Es Memo ----------
ESCENAS.mirilla = {
  html: lienzo(`<rect width="1080" height="1920" fill="#000"/>
    <defs><clipPath id="mi-clip"><circle cx="540" cy="860" r="420"/></clipPath>
      <radialGradient id="mi-ojo" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".95"/></radialGradient></defs>
    <g clip-path="url(#mi-clip)"><rect x="100" y="420" width="880" height="880" fill="#0e121a"/><g id="mi-memo"></g>
      <circle cx="540" cy="860" r="420" fill="url(#mi-ojo)"/></g>
    <circle cx="540" cy="860" r="420" fill="none" stroke="#1a1d22" stroke-width="24"/>`),
  camara: { claves: [[INI.mirilla, 1.0, 0, 0], [M.memoM, 1.0, 0, 0], [M.memoM + 0.25, 1.12, 0, 90], [FIN('mirilla'), 1.16, 0, 100]] },
  update(lt, dur, t) {
    // Memo de cerca, con la lámpara debajo de la cara; se acerca a la mirilla
    const acerca = ease.inOut(clamp((t - INI.mirilla) / 2.2));
    const s = lerp(0.9, 1.15, acerca);
    $('#mi-memo').innerHTML = `<g transform="translate(540 860) scale(${s}) translate(-540 -860)">
      <circle cx="540" cy="1250" r="420" fill="url(#luzCalida)" opacity=".6"/>
      ${memoDe(540, 1780, 195, { look: 0, lookY: -8, eyeScale: 1.1, armL: [[400, 1230], [470, 1080]], armR: [[700, 1230], [760, 1330]] })}
      <circle cx="490" cy="1050" r="95" fill="#fff6c8" opacity=".55" filter="url(#blur10)"/></g>`;
  },
};

// ---------- 3. El brazo vendado y la piel gris hasta la muñeca ----------
ESCENAS.brazo = {
  html: lienzo(`<rect width="1080" height="1920" fill="#0e121a"/>
    <circle cx="540" cy="900" r="700" fill="url(#luzCalida)" opacity=".35"/>
    <g id="br-brazo" filter="url(#ink)"></g>${viñeta}`),
  camara: { claves: [foco(INI.brazo, 1.05, 640, 820), foco(M.muneca, 1.18, 330, 1180), foco(FIN('brazo'), 1.22, 300, 1220)] },
  update(lt, dur, t) {
    // antebrazo grande en diagonal: del codo (arriba a la derecha) a la mano (abajo a la izquierda)
    const g = ease.inOut(clamp((t - M.gris + 0.2) / (M.muneca - M.gris + 0.4)));
    const tiembla = Math.sin(t * 40) * 3;
    const venasBrazo = [...Array(6)].map((_, i) => {
      const u = 0.32 + i * 0.07 * g * 1.5, x = lerp(860, 240, u), y = lerp(380, 1340, u);
      return u < 0.32 + 0.5 * g ? `<path d="M${x} ${y} q${-40 + i * 9} ${30 + i * 4} ${-70 + i * 12} ${10 + i * 15} M${x - 20} ${y + 10} l${-30} ${50}" stroke="#4a5059" stroke-width="7" fill="none" stroke-linecap="round"/>` : '';
    }).join('');
    $('#br-brazo').innerHTML = `<g transform="translate(${tiembla} 0)">
      <defs><linearGradient id="br-piel" x1="860" y1="380" x2="240" y2="1340" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#e9e2d6"/><stop offset="${0.3}" stop-color="#e9e2d6"/><stop offset="${0.34}" stop-color="#9aa0a8"/>
        <stop offset="${lerp(0.36, 0.97, g)}" stop-color="#9aa0a8"/><stop offset="${lerp(0.42, 1, g)}" stop-color="#e9e2d6"/><stop offset="1" stop-color="#e9e2d6"/></linearGradient></defs>
      <path d="M1000 260 L860 330 L210 1290 Q180 1380 260 1400 L330 1390 L940 470 Z" fill="url(#br-piel)" stroke="${INK}" stroke-width="12"/>
      ${[[-0.2, 150], [0.05, 175], [0.3, 165], [0.55, 135]].map(([da, L]) => { const a = 2.14 + da, x0 = 215, y0 = 1385;
        const x1 = x0 + Math.cos(a) * L, y1 = y0 + Math.sin(a) * L;
        return `<path d="M${x0} ${y0} L${x1} ${y1}" stroke="${INK}" stroke-width="58" stroke-linecap="round"/><path d="M${x0} ${y0} L${x1} ${y1}" stroke="#9aa0a8" stroke-width="38" stroke-linecap="round"/>`; }).join('')}
      <path d="M270 1380 L345 1430" stroke="${INK}" stroke-width="58" stroke-linecap="round"/><path d="M270 1380 L345 1430" stroke="#9aa0a8" stroke-width="38" stroke-linecap="round"/>
      <ellipse cx="235" cy="1355" rx="95" ry="70" fill="#9aa0a8" stroke="${INK}" stroke-width="10" transform="rotate(-56 235 1355)"/>
      ${venasBrazo}
      <path d="M760 420 L900 515 L780 700 L640 600 Z" fill="#eee6d8" stroke="${INK}" stroke-width="9"/>
      <path d="M700 520 l150 100 M725 480 l150 100 M675 560 l140 95" stroke="#d6cbb6" stroke-width="6"/>
      <ellipse cx="770" cy="560" rx="60" ry="42" fill="#8a1f1b" opacity=".8" transform="rotate(34 770 560)"/>
      <path d="M690 470 l-30 -40 M860 600 l40 40" stroke="#eee6d8" stroke-width="12" stroke-linecap="round"/>
      ${t > M.muneca - 0.1 ? `<ellipse cx="300" cy="1270" rx="${150 * clamp((t - M.muneca + 0.1) / 0.25)}" ry="${80 * clamp((t - M.muneca + 0.1) / 0.25)}" fill="none" stroke="${ROJO}" stroke-width="12" transform="rotate(-34 300 1270)"/>` : ''}</g>`;
  },
};

// ---------- 4. En la azotea, lo mordieron (recuerdo de hace un rato) ----------
const AZ_INF = [[300, 1250, 330, -1], [820, 1240, 340, 1], [180, 1330, 300, -1], [930, 1330, 300, 1], [560, 1180, 260, 1]];
ESCENAS.azotea = {
  html: lienzo(`<rect width="1080" height="1920" fill="url(#cielo)"/>
    <circle cx="840" cy="330" r="220" fill="url(#luzLuna)"/><circle cx="840" cy="330" r="58" fill="#e9eef7"/>
    <g filter="url(#ink)"><rect x="-20" y="1300" width="1120" height="660" fill="#3d3a40" stroke="${INK}" stroke-width="8"/>
      <rect x="40" y="1020" width="150" height="280" rx="18" fill="#15171c" stroke="${INK}" stroke-width="7"/></g>
    <g id="az-cosas"></g>
    <rect id="az-flash" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${viñeta}`),
  fijo: `<div class="recuerdo" style="top:150px;color:#d9e4ff">La azotea · hace un rato</div>`,
  camara: { claves: [[INI.azotea, 1.0, 0, 0], [M.mordieron, 1.12, 0, -80], [FIN('azotea'), 1.2, 0, -110]] },
  update(lt, dur, t) {
    const muerde = clamp((t - M.mordieron) / 0.2);
    $('#az-flash').setAttribute('opacity', t > M.mordieron && t < M.mordieron + 0.5 ? 0.45 * (1 - (t - M.mordieron) / 0.5) : 0);
    const memo1 = memoDe(560, 1440, 62, { look: -14, lookY: -10, eyeScale: 1.5, armL: [[480, 1180], [430, 1080]], armR: [[640, 1190], [lerp(700, 680, muerde), lerp(1100, 1140, muerde)]] });
    $('#az-cosas').innerHTML = lampara(470, 1420, -0.2, 500, 0.5) + memo1 + `<g filter="url(#ink)">${AZ_INF.map(([x, y, h, dir], i) =>
      `<g transform="translate(${x + Math.sin(t * 3 + i) * 10} ${y + 120}) scale(${dir * h} ${h})">${infectadoQuieto(0.85, 0.03, 0.01)}</g>`).join('')}</g>`;
  },
};

// ---------- 5. Abre, Rosa. Sé por qué sonó en toda la ciudad. Y sé dónde está tu nieta ----------
ESCENAS.abre = {
  html: lienzo(corte402('ab')),
  camara: { claves: [foco(INI.abre, 1.55, 790, 1100), foco(M.ciudad, 1.55, 760, 1100), foco(M.nieta - 0.2, 1.0, 540, 960), foco(FIN('abre'), 1.05, 520, 980)] },
  update(lt, dur, t) {
    $('#ab-puerta').innerHTML = puertaCorte();
    $('#ab-dentro').innerHTML = dentro402(t, { rosaLook: t > M.nieta ? 14 : 8, rosaOjos: t > M.nieta ? 1.4 : 1 });
    const pega = Math.sin(t * 2) * 6;
    $('#ab-afuera').innerHTML = lampara(700, PISO - 150, 1.9, 380, 0.55) +
      memoDe(690, PISO, 66, { dx: -40 + pega, look: -18, lookY: 4, armL: [[640, PISO - 200], [700, PISO - 150]], armR: [[620, PISO - 260], [570, PISO - 330]], gris: 0.1 }) +
      (Math.floor(t * 3) % 2 ? `<text x="560" y="${PISO - 380}" font-family="Caveat" font-weight="700" font-size="60" fill="#c9ccd2" opacity=".8">sss</text>` : '');
    $('#ab-luzD').innerHTML = `<polygon points="555,${PISO} 380,${PISO} 555,${PISO - 30}" fill="#fff6c8" opacity=".25"/>`;
  },
};

// ---------- 6. Rosa te agarra del brazo. No le abras, corazón ----------
ESCENAS.rosa = {
  html: lienzo(`<rect width="1080" height="1920" fill="#241a1f"/>
    <circle cx="300" cy="900" r="800" fill="url(#luzCalida)" opacity=".7"/>
    <g id="ro-cosas"></g>${viñeta}`),
  camara: { claves: [[INI.rosa, 1.0, 0, 0], [M.noabras, 1.08, 40, 40], [FIN('rosa'), 1.15, 60, 60]] },
  update(lt, dur, t) {
    const no = t > M.noabras - 0.1 ? Math.sin((t - M.noabras) * 14) * 16 * Math.max(0, 1 - (t - M.noabras) / 1.2) : 0;
    const agarra = ease.outCubic(clamp((t - INI.rosa - 0.2) / 0.4));
    $('#ro-cosas').innerHTML = `<g filter="url(#ink)">${vela(120, 1200, t, 0.8)}</g>` +
      tuDe(880, 1700, 120, { look: -16, eyeScale: 1.2, armL: [[760, 1250], [720, 1400]] }) +
      `<g filter="url(#contorno)">${rosaDe(430 + no * 0.3, 720, 150, { look: 22 + no, lookY: 4, eyeScale: 1.15,
        armR: [[600, 1110], [lerp(650, 735, agarra), lerp(1180, 1330, agarra)]], armL: [[300, 1100], [290, 1250]] })}</g>` +
      (agarra > 0.9 ? `<ellipse cx="735" cy="1330" rx="34" ry="24" fill="#e9e2d6" stroke="${INK}" stroke-width="6"/>` : '');
  },
};

// ---------- 7. Chispa gruñe. La cabeza de Memo voltea de golpe hacia el ruido. Como ellos ----------
ESCENAS.grune = {
  html: lienzo(`<g id="gr-cara"><rect width="1080" height="1920" fill="#241d29"/>
      <g transform="translate(540 900) scale(1.1)" filter="url(#ink)" id="gr-chispa"></g>${viñeta}</g>
    <g id="gr-corte" style="display:none">${corte402('gc')}</g>`),
  camara: { claves: [[INI.grune, 1.0, 0, 0], [M.voltea - 0.62, 1.1, 0, 0], foco(M.voltea - 0.6, 1.7, 720, 1010), foco(SNAP + 0.1, 1.85, 700, 1000), foco(M.ellos - 0.1, 1.85, 700, 1000), foco(M.ellos + 0.2, 1.4, 760, 1050), foco(FIN('grune'), 1.45, 760, 1050)] },
  update(lt, dur, t) {
    const corte = t > M.voltea - 0.6;
    $('#gr-cara').style.display = corte ? 'none' : '';
    $('#gr-corte').style.display = corte ? '' : 'none';
    if (!corte) { $('#gr-chispa').innerHTML = caraChispa({ boca: 0.75 + 0.2 * Math.sin(t * 30), ceno: true }); return; }
    $('#gc-puerta').innerHTML = puertaCorte();
    $('#gc-dentro').innerHTML = dentro402(t, { tiembla: true, miedo: t > SNAP });
    // antes del golpe mira al frente; luego la cabeza da un tirón hacia la puerta (el ruido)
    const v = ease.outCubic(clamp((t - SNAP) / 0.08));
    const blanco = t > SNAP && t < SNAP + 0.35;
    const lineas = t > SNAP && t < SNAP + 0.3 ? `<path d="M740 ${PISO - 420} q-50 -20 -90 0 M750 ${PISO - 380} q-60 -10 -100 10 M745 ${PISO - 340} q-50 0 -90 20" stroke="#fff" stroke-width="6" fill="none" opacity="${1 - (t - SNAP) / 0.3}"/>` : '';
    $('#gc-afuera').innerHTML = lampara(700, PISO - 150, 1.9, 380, 0.55) +
      memoDe(720, PISO, 66, { dx: lerp(8, -34, v), look: lerp(16, -26, v), lookY: lerp(-4, 2, v), eyeScale: blanco ? 1.25 : 1, eyeFill: blanco ? '#f2f2f2' : undefined,
        armL: [[660, PISO - 200], [700, PISO - 150]], gris: 0.15 }) + lineas +
      (t > M.ellos - 0.1 ? `<g opacity="${0.45 * clamp((t - M.ellos + 0.1) / 0.3)}" filter="url(#ink)"><g transform="translate(900 ${PISO}) scale(-360 360)">${infectadoQuieto(0, 0.04, 0)}</g></g>
        <text x="900" y="${PISO - 420}" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="56" fill="#c9ccd2" opacity="${clamp((t - M.ellos) / 0.3)}">como ellos</text>` : '');
  },
};

// ---------- 8. Memo se tapa la cara. Todavía soy yo. Todavía ----------
ESCENAS.tapa = {
  html: lienzo(`<rect width="1080" height="1920" fill="#0d1018"/>
    <circle cx="540" cy="1300" r="700" fill="url(#luzCalida)" opacity=".35"/>
    <g id="ta-memo"></g>${viñeta}`),
  camara: { claves: [[INI.tapa, 1.0, 0, 0], [M.todavia2, 1.1, 0, 60], [FIN('tapa'), 1.2, 0, 90]] },
  update(lt, dur, t) {
    const g = lerp(0.2, 1, ease.inOut(clamp((t - INI.tapa) / (FIN('tapa') - INI.tapa))));
    const tiembla = Math.sin(t * 45) * 4;
    const ojoBlanco = t > M.todavia2 && Math.sin(t * 20) > -0.2;
    const cx = 540 + tiembla, cy = 820, r = 180;
    // la cara, con un ojo que se asoma entre los dedos y a veces se pone blanco
    $('#ta-memo').innerHTML = `<g filter="url(#contorno)">
      ${memo({ head: [cx, cy], r, neck: [540, 1010], hip: [545, 1500], armL: [[300, 1250], [380, 900]], look: -10, lookY: 0, eyeFill: ojoBlanco ? '#f2f2f2' : undefined, sinBrillo: ojoBlanco })}
      ${venas(cx, cy, r, g)}
      <g filter="url(#ink)">
        <path d="M${cx - 190} ${cy + 20} q20 -110 120 -110 l30 0 q20 60 -10 120 l-140 60z" fill="#e9e2d6" stroke="${INK}" stroke-width="10"/>
        ${[0, 1, 2].map(i => `<path d="M${cx - 160 + i * 40} ${cy - 85} l${10 + i * 6} -70" stroke="${INK}" stroke-width="28" stroke-linecap="round"/><path d="M${cx - 160 + i * 40} ${cy - 85} l${10 + i * 6} -70" stroke="#e9e2d6" stroke-width="16" stroke-linecap="round"/>`).join('')}
      </g>
      ${brazoMordido([560, 1060], [780, 1220], [cx + 90, cy + 90], 180)}
      <g filter="url(#ink)"><path d="M${cx + 10} ${cy + 30} q80 -40 160 0 q10 60 -40 90 l-120 10z" fill="#9aa0a8" stroke="#050608" stroke-width="10"/>
        ${[0, 1, 2].map(i => `<path d="M${cx + 60 + i * 38} ${cy + 10} l${6 + i * 8} -60" stroke="#050608" stroke-width="28" stroke-linecap="round"/><path d="M${cx + 60 + i * 38} ${cy + 10} l${6 + i * 8} -60" stroke="#9aa0a8" stroke-width="16" stroke-linecap="round"/>`).join('')}</g></g>`;
  },
};

// ---------- 9. Entonces, la alerta se calla ----------
const CA_INF = (() => { const r = rng(31), g = []; for (let i = 0; i < 22; i++) g.push({ x: 140 + r() * 800, y: 1230 + r() * 260, h: 300 + r() * 90, ph: r() * 6, d: r() > 0.5 ? 1 : -1 }); return g.sort((a, b) => a.y - b.y); })();
ESCENAS.calla = {
  html: lienzo(`<rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)"><rect x="-20" y="1250" width="1120" height="700" fill="#1f2430" stroke="${INK}" stroke-width="8"/></g>
    <g id="ca-poste">${poste(560, 520, 1.15, 760)}</g>
    <g id="ca-gente" filter="url(#ink)"></g>
    <rect id="ca-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${viñeta}`),
  camara: { claves: [[INI.calla, 1.0, 0, 40], [CORTE, 1.05, 0, 40], [CORTE + 0.15, 1.12, 0, 0], [FIN('calla'), 1.2, 0, -60]] },
  update(lt, dur, t) {
    const suena = t < CORTE;
    $('#ca-rojo').setAttribute('opacity', suena ? 0.08 + 0.14 * pulsoRojo(t) : 0);
    document.querySelectorAll('#esc-calla .onda').forEach(o => o.setAttribute('opacity', suena ? (Math.sin(t * 8 - o.dataset.k) > 0 ? 1 : 0.2) : 0));
    document.querySelectorAll('#esc-calla .foco').forEach(f => f.style.opacity = suena ? 0.4 + 0.6 * pulsoRojo(t) : 0.15);
    // con la alerta, brazos arriba; al callarse, bajan los brazos y voltean hacia el edificio (izquierda)
    const baja = ease.inOut(clamp((t - CORTE - 0.2) / 0.8)), voltea = ease.inOut(clamp((t - CORTE - 0.6) / 0.6));
    $('#ca-gente').innerHTML = CA_INF.map(p => `<g transform="translate(${p.x + (suena ? Math.sin(t * 6 + p.ph) * 6 : 0)} ${p.y + 120}) scale(${p.h})">${infectadoQuieto(lerp(1, 0.1, baja), lerp(0, -0.045, voltea), lerp(-0.03, 0, baja))}</g>`).join('');
  },
};

// ---------- 10. En el silencio se oyen pasos. Muchos. Vienen de los postes ----------
const PA_INF = (() => { const r = rng(57), g = []; for (let i = 0; i < 30; i++) g.push({ x0: 650 + r() * 1700, y: 1180 + r() * 300, h: 190 + r() * 90, v: 160 + r() * 80, ph: r() * 6 }); return g.sort((a, b) => a.y - b.y); })();
ESCENAS.pasos = {
  html: lienzo(`<rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)">
      <rect x="-20" y="520" width="420" height="760" fill="#2f323c" stroke="${INK}" stroke-width="10"/>
      ${[0, 1, 2].map(f => [0, 1].map(c => `<rect x="${40 + c * 180}" y="${640 + f * 150}" width="130" height="120" fill="#121722" stroke="${INK}" stroke-width="6"/>`).join('')).join('')}
      <rect x="250" y="1100" width="150" height="180" fill="#0a0c10" stroke="${INK}" stroke-width="7"/>
      <path d="M260 1110 l40 60 l-20 40 M380 1120 l-30 50 l20 50" stroke="#9fb3d9" stroke-width="5" fill="none"/>
      <text x="210" y="600" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="60" fill="#c9ccd2" opacity=".5">EDIFICIO C</text>
      <rect x="-20" y="1280" width="1120" height="700" fill="#1f2430" stroke="${INK}" stroke-width="8"/>
    </g>
    <g id="pa-gente" filter="url(#ink)"></g>${viñeta}`),
  camara: { claves: [foco(INI.pasos, 1.35, 760, 1180), foco(M.muchos - 0.1, 1.35, 700, 1180), [M.muchos + 0.4, 1.0, 0, 0], [FIN('pasos'), 1.05, 30, -30]] },
  update(lt, dur, t) {
    const dt = t - INI.pasos;
    $('#pa-gente').innerHTML = PA_INF.map(p => {
      const x = p.x0 - dt * p.v;
      return x > -200 && x < 1250 ? `<g transform="translate(${x} ${p.y + 110}) scale(${-p.h} ${p.h})">${infectadoLado(t * 5 + p.ph)}</g>` : '';
    }).join('');
  },
};

// ---------- 11. Memo golpea la puerta. Ábreme. Ya vienen ----------
ESCENAS.golpea = {
  html: lienzo(corte402('gp')),
  fijo: `<div class="onomato" id="gp-pum" style="top:520px;left:600px;font-size:150px;opacity:0">¡PUM!</div>`,
  camara: { claves: [foco(INI.golpea, 1.3, 620, 1030), foco(M.yavienen, 1.3, 600, 1030), foco(FIN('golpea'), 1.4, 600, 1040)] },
  update(lt, dur, t) {
    const d = golpeDesde(t, GOLPES), k = GOLPES.filter(g => g <= t).length;
    const golpe = d < 0.12;
    $('#gp-puerta').innerHTML = puertaCorte(golpe ? -4 : 0);
    $('#gp-dentro').innerHTML = dentro402(t, { tiembla: true, miedo: true, rosaLook: 20, rosaOjos: 1.3 });
    const brazo = golpe ? [[640, PISO - 260], [575, PISO - 300]] : [[660, PISO - 250], [620, PISO - 330]];
    $('#gp-afuera').innerHTML = lampara(780, PISO - 40, 2.6, 300, 0.4) +
      memoDe(690, PISO, 66, { dx: -26, look: -24, lookY: 0, eyeScale: 1.3, armL: [[740, PISO - 160], [780, PISO - 40]], armR: brazo, gris: 0.3 });
    const pum = $('#gp-pum');
    pum.style.opacity = d < 0.3 ? 1 : 0;
    pum.style.left = (k % 2 ? 520 : 640) + 'px';
    pum.style.top = (k % 2 ? 560 : 700) + 'px';
    pum.style.transform = `rotate(${k % 2 ? 8 : -8}deg) scale(${lerp(1.4, 1, clamp(d / 0.1))})`;
    if (golpe) $('#esc-golpea .cam').style.transform += ` translate(${Math.sin(lt * 90) * 8}px, 0)`;
  },
};

// ---------- 12. Cada golpe se oye en todo el edificio ----------
const ALTO = 300, BASE = 1480;   // pisos de 300 px; planta baja en BASE
const ED_INF = (() => { const r = rng(9), g = []; for (let i = 0; i < 9; i++) g.push({ u: r() * 1.4, v: 0.35 + r() * 0.25, ph: r() * 6 }); return g; })();
const xEsc = u => { const f = u - Math.floor(u); return f < 0.5 ? 640 + 300 * (f / 0.5) : 940 - 300 * ((f - 0.5) / 0.5); };
const yEsc = u => BASE - ALTO * u;
ESCENAS.edificio = {
  html: lienzo(`<rect width="1080" height="1920" fill="#0b0f17"/>
    <g filter="url(#ink)">
      <rect x="80" y="${BASE - ALTO * 5}" width="920" height="${ALTO * 5}" fill="#141a25" stroke="${INK}" stroke-width="10"/>
      ${[0, 1, 2, 3, 4].map(k => { const y = BASE - ALTO * k;
        return `<rect x="80" y="${y - 14}" width="920" height="14" fill="#2c313c"/>
        <polyline points="640,${y} 940,${y - ALTO / 2} 640,${y - ALTO}" fill="none" stroke="#3a3f4a" stroke-width="12"/>
        <rect x="${k ? 470 : 470}" y="${y - 190}" width="110" height="176" fill="${k === 3 ? '#5a4030' : '#2a2018'}" stroke="${INK}" stroke-width="6"/>
        <text x="525" y="${y - 200}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="34" fill="#9aa0a8">${k ? (k + 1) + '02' : 'PB'}</text>`; }).join('')}
      <rect x="80" y="${BASE}" width="920" height="480" fill="#1a1f2a"/>
    </g>
    <g id="ed-ondas"></g><g id="ed-memo"></g><g id="ed-inf" filter="url(#ink)"></g>${viñeta}`),
  camara: { claves: [[INI.edificio, 1.0, 0, 0], [FIN('edificio'), 1.08, 0, 60]] },
  update(lt, dur, t) {
    const y4 = BASE - ALTO * 3;
    let ondas = '';
    for (const g of GOLPES) if (t > g && t < g + 1.6) { const d = t - g; ondas += `<circle cx="580" cy="${y4 - 100}" r="${40 + d * 700}" fill="none" stroke="#fff" stroke-width="${8 - d * 4}" opacity="${0.7 * (1 - d / 1.6)}"/>`; }
    $('#ed-ondas').innerHTML = ondas;
    $('#ed-memo').innerHTML = memoDe(620, y4, 28, { dx: -10, look: -8, armR: [[600, y4 - 110], [584, y4 - 130]], gris: 0.3 });
    // los infectados entran y suben la escalera hacia el ruido
    $('#ed-inf').innerHTML = ED_INF.map(p => {
      const u = p.u + (t - INI.edificio) * p.v, f = u - Math.floor(u), dir = f < 0.5 ? 1 : -1;
      return u < 2.9 ? `<g transform="translate(${xEsc(u)} ${yEsc(u)}) scale(${dir * 110} 110)">${infectadoLado(t * 6 + p.ph)}</g>` : '';
    }).join('');
  },
};

// ---------- 13. Si le abres... Si no le abres... ----------
ESCENAS.dilema = {
  html: lienzo(`<rect width="1080" height="1920" fill="#0b0f17"/>
    <g id="di-a"><rect x="40" y="170" width="1000" height="660" rx="24" fill="#2a1f24" stroke="#e5a83b" stroke-width="10"/>
      <circle cx="300" cy="500" r="500" fill="url(#luzCalida)" opacity=".5"/><g id="di-a-cosas"></g></g>
    <g id="di-b"><rect x="40" y="870" width="1000" height="660" rx="24" fill="#10141c" stroke="#9fd0ff" stroke-width="10"/><g id="di-b-cosas"></g></g>`),
  fijo: `<div class="onomato" id="di-ta" style="top:190px;left:80px;font-size:72px">🚪 SI LE ABRES</div>
    <div class="onomato" id="di-tb" style="top:890px;left:80px;font-size:72px">🔒 SI NO</div>`,
  camara: { claves: [[INI.dilema, 1.0, 0, 0], [FIN('dilema'), 1.04, 0, 0]] },
  update(lt, dur, t) {
    const a = clamp((t - INI.dilema) / 0.3), b = clamp((t - M.sino + 0.1) / 0.3);
    $('#di-a').setAttribute('opacity', a); $('#di-ta').style.opacity = a;
    $('#di-b').setAttribute('opacity', lerp(0.25, 1, b)); $('#di-tb').style.opacity = lerp(0.25, 1, b);
    $('#di-b-cosas').style.opacity = b;
    // adentro: Memo en la cocina de Rosa, su mano gris cerca de Chispa
    const acerca = ease.inOut(clamp((t - M.mordido + 0.2) / 1.2));
    $('#di-a-cosas').innerHTML = `<g transform="translate(0 -40)">${vela(140, 560, t, 0.6)}
      ${memoDe(620, 790, 52, { look: -16, lookY: 8, gris: 0.5, armR: [[560, 620], [lerp(540, 470, acerca), lerp(690, 730, acerca)]] })}
      <g filter="url(#ink)" transform="translate(360 735) scale(0.6)">${perro('parada')}</g>
      ${rosaDe(860, 520, 48, { look: -14, eyeScale: 1.3 })}</g>`;
    // afuera: Memo se va con su celular prendido; atrás, ellos
    const va = clamp((t - M.afuera) / 3);
    $('#di-b-cosas').innerHTML = `<g clip-path="inset(0)"><svg x="40" y="870" width="1000" height="660" viewBox="40 870 1000 660">
      ${memoDe(lerp(560, 860, va), 1460, 52, { look: 12, gris: 0.5, armL: [[lerp(520, 820, va), 1300], [lerp(560, 860, va), 1240]] })}
      <rect x="${lerp(548, 848, va)}" y="1210" width="26" height="40" rx="4" fill="#9fd0ff"/><circle cx="${lerp(561, 861, va)}" cy="1230" r="40" fill="#9fd0ff" opacity=".3" filter="url(#blur10)"/>
      <g filter="url(#ink)">${[120, 230, 330].map((x, i) => `<g transform="translate(${x + Math.sin(t * 3 + i) * 8 + va * 120} 1470) scale(${-230} 230)">${infectadoLado(t * 5 + i)}</g>`).join('')}</g></svg></g>`;
  },
};

// ---------- 14. ¿Le abres? Puerta o candado. Comenta ----------
ESCENAS.decide = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="960" r="900" fill="url(#luzCalida)" opacity=".1"/>`)}
    <div class="decide-tit" id="de-tit">¿LE ABRES?</div>
    <div class="opcion" id="de-a" style="top:560px;font-size:74px"><span class="emo">🚪</span><span class="txt">SÍ, LE ABRO</span></div>
    <div class="opcion" id="de-b" style="top:900px;font-size:74px"><span class="emo">🔒</span><span class="txt">NO LE ABRO</span></div>
    <div class="decide-com" id="de-com">COMENTA <span class="emo">🚪</span> O <span class="emo">🔒</span></div>
    <div class="decide-pie" id="de-pie">GANA LO QUE MÁS COMENTEN</div>`,
  update(lt, dur, t) {
    pop($('#de-tit'), t, INI.decide);
    pop($('#de-a'), t, M.puerta - 0.1);
    pop($('#de-b'), t, M.candado - 0.1);
    pop($('#de-com'), t, M.comenta - 0.1);
    $('#de-pie').style.opacity = clamp((t - M.comenta - 0.6) / 0.3);
    const a = t >= M.puerta - 0.1 && t < M.candado - 0.1, b = t >= M.candado - 0.1 && t < M.comenta - 0.1;
    $('#de-a').style.borderColor = a ? '#e5a83b' : '#fff';
    $('#de-b').style.borderColor = b ? '#9fd0ff' : '#fff';
    if (a) $('#de-a').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
    if (b) $('#de-b').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
  },
};
