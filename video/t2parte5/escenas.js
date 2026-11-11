// Escenas de "La alerta", temporada 2, parte 5: El metro. Ganó 🏚️ en los comentarios de la parte 4:
// bajas por los escombros del edificio donde encontraste a Chispa. La losa cede y caes al túnel. En el andén hay
// cientos de infectados quietos. La cinta de la placa se despegó en la caída y la placa suena una vez.
// Decisión: 🏃 corres por el túnel o 🤫 no te mueves.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const CRAC = M.cede + 0.35;        // la losa truena y cede
const GOLPE = M.caes + 0.85;       // caes a las vías
const TIN = M.unavez - 0.75;       // la placa suena
const GIRAN = M.giran - 0.1;       // las cabezas giran

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

// Escombros: losas inclinadas, varillas y polvo.
function escombros(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#ink)">
    <path d="M-420 0 L-340 -260 L-120 -340 L60 -300 L240 -420 L420 -180 L460 0 Z" fill="#7d776c" stroke="${INK}" stroke-width="9"/>
    <rect x="-360" y="-300" width="320" height="60" fill="#9a9385" stroke="${INK}" stroke-width="7" transform="rotate(-14 -200 -270)"/>
    <rect x="40" y="-380" width="300" height="56" fill="#9a9385" stroke="${INK}" stroke-width="7" transform="rotate(22 190 -350)"/>
    <rect x="-140" y="-200" width="260" height="50" fill="#8b8477" stroke="${INK}" stroke-width="7" transform="rotate(8 -10 -175)"/>
    ${[[-260, -330, -300, -440], [120, -420, 160, -540], [300, -300, 380, -380], [-60, -340, -40, -450]].map(([a, b, c, d]) => `<path d="M${a} ${b} L${c} ${d}" stroke="#5b4a3a" stroke-width="7" stroke-linecap="round"/>`).join('')}
    ${[[-300, -120], [-80, -60], [180, -120], [330, -60]].map(([a, b]) => `<rect x="${a}" y="${b}" width="70" height="44" fill="#121722" stroke="${INK}" stroke-width="5" transform="rotate(12 ${a} ${b})"/>`).join('')}
  </g>`;
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

// ---------- 1. Ganaron los escombros ----------
ESCENAS.gano = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="1040" r="800" fill="url(#luzCalida)" opacity=".1"/>`)}
    <div class="decide-tit" id="ga-tit">GANÓ</div>
    <div class="opcion" id="ga-a" style="top:560px;font-size:70px"><span class="emo">🚇</span><span class="txt" style="text-decoration:line-through;text-decoration-color:#e0312b;text-decoration-thickness:10px">POR EL METRO</span></div>
    <div class="opcion" id="ga-b" style="top:900px;font-size:70px;border-color:#9fd0ff;box-shadow:0 0 40px rgba(159,208,255,.5)"><span class="emo">🏚️</span><span class="txt">POR LOS ESCOMBROS</span></div>
    <div class="decide-pie" id="ga-pie" style="top:1260px">LOS COMENTARIOS ELIGIERON</div>`,
  camara: { claves: [[0, 1.0, 0, 0], [M.bajas, 1.0, 0, 0], [FIN('gano'), 1.12, 0, -50]], origen: '540px 1030px' },
  update(lt, dur, t) {
    pop($('#ga-tit'), t, 0.02, 0.25);
    pop($('#ga-b'), t, 0.1, 0.3);
    $('#ga-b').style.transform += ` scale(${1 + 0.035 * Math.sin(t * 8)})`;
    $('#ga-a').style.opacity = 0.35;
    $('#ga-pie').style.opacity = clamp((t - M.bajas + 0.2) / 0.3);
  },
};

// ---------- 2. El mismo edificio donde encontraste a Chispa. Lo reconoce ----------
ESCENAS.reconoce = {
  html: lienzo(`<rect width="1080" height="1920" fill="url(#ventanaDia)"/>
    ${escombros(600, 1360, 1.15)}
    <g filter="url(#ink)"><rect x="-20" y="1360" width="1120" height="600" fill="#6b6f78" stroke="${INK}" stroke-width="8"/></g>
    <g id="rc-recuerdo"></g><g id="rc-tu"></g>${viñeta}`),
  camara: { claves: [[INI.reconoce, 1.0, 0, 0], foco(M.quieta, 1.3, 300, 1150), foco(FIN('reconoce'), 1.35, 330, 1120)] },
  update(lt, dur, t) {
    const quieta = t > M.quieta;
    $('#rc-tu').innerHTML = tuConChispa(220, 1500, 62, t, { look: 16, tiembla: !quieta });
    // un destello del recuerdo sobre los escombros
    const r = clamp((t - M.reconoce + 0.1) / 0.4) * (1 - clamp((t - M.reconoce - 1.4) / 0.4));
    $('#rc-recuerdo').innerHTML = r > 0 ? `<g opacity="${r}" style="filter:sepia(.8)"><circle cx="620" cy="1080" r="210" fill="#c9b48c" stroke="#efe6cf" stroke-width="10"/>
      <rect x="470" y="1040" width="300" height="50" fill="#9a9385" stroke="${INK}" stroke-width="6" transform="rotate(-30 470 1065)"/>
      <ellipse cx="620" cy="1150" rx="120" ry="40" fill="#2a2520"/><g filter="url(#ink)" transform="translate(620 1150) scale(0.4)">${perroSentada(1)}</g></g>` : '';
  },
};

// ---------- 3. El sótano partido. Abajo, el túnel ----------
ESCENAS.sotano = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14110e"/>
    <g filter="url(#ink)">
      <rect x="-20" y="520" width="1120" height="560" fill="#3a332b" stroke="${INK}" stroke-width="8"/>
      <path d="M200 520 L260 300 L360 520 M700 520 L760 260 L880 520" fill="#5a5146" stroke="${INK}" stroke-width="7"/>
      <path d="M-20 1080 L420 1080 L470 1140 L540 1100 L610 1160 L660 1080 L1100 1080 L1100 1160 L-20 1160 Z" fill="#4a4136" stroke="${INK}" stroke-width="8"/>
      <rect x="-20" y="1160" width="1120" height="800" fill="#0b0d11"/>
      <path d="M-20 1460 L1100 1460 M-20 1480 L1100 1480" stroke="#4a4f58" stroke-width="7"/>
    </g>
    <path d="M430 1100 L470 1150 L540 1120 L610 1170 L650 1100" fill="#000" stroke="#000" stroke-width="20"/>
    <circle cx="300" cy="420" r="200" fill="#efe6cf" opacity=".12"/><circle cx="800" cy="400" r="200" fill="#efe6cf" opacity=".12"/>
    <g id="so-tu"></g>${viñeta}`),
  camara: { claves: [[INI.sotano, 1.0, 0, -100], [M.abajo, 1.0, 0, -100], foco(M.abajo + 0.8, 1.3, 540, 1250), foco(FIN('sotano'), 1.35, 540, 1260)] },
  update(lt, dur, t) {
    $('#so-tu').innerHTML = tuConChispa(250, 1080, 58, t, { look: 18, lookY: 14 });
  },
};

// ---------- 4. Pisas una losa. Y la losa cede ----------
ESCENAS.cede = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14110e"/>
    <g id="ce-losa"></g><g id="ce-pie" filter="url(#ink)"></g>${viñeta}`),
  fijo: `<div class="onomato" id="ce-crac" style="top:520px;left:300px;font-size:160px;opacity:0">¡CRAC!</div>`,
  camara: { claves: [[INI.cede, 1.0, 0, 0], [CRAC, 1.08, 0, 0], [FIN('cede'), 1.0, 0, 60]] },
  update(lt, dur, t) {
    const g = clamp((t - M.pisas - 0.4) / (CRAC - M.pisas - 0.4)), cae = clamp((t - CRAC - 0.4) / 0.8);
    let grietas = '';
    if (g > 0) { const r = rng(4); for (let k = 0; k < 7; k++) { let a = k / 7 * Math.PI * 2 + r(), x = 540, y = 1150, d = `M540 1150`; for (let s = 0; s < 4 * g; s++) { x += Math.cos(a) * 70; y += Math.sin(a) * 40; a += (r() - 0.5) * 0.8; d += ` L${x} ${y}`; } grietas += `<path d="${d}" stroke="#111" stroke-width="9" fill="none"/>`; } }
    const tiembla = t > M.pisas + 0.4 && t < CRAC + 0.4 ? Math.sin(t * 60) * 4 * g : 0;
    $('#ce-losa').innerHTML = `<g transform="translate(${tiembla} ${cae * cae * 900}) rotate(${cae * 18} 540 1150)" filter="url(#ink)">
      <polygon points="120,1000 960,980 1000,1300 80,1320" fill="#6b6458" stroke="${INK}" stroke-width="10"/>${grietas}</g>`;
    $('#ce-pie').innerHTML = `<g transform="translate(${tiembla} ${cae * cae * 900})"><path d="M520 400 L540 1060" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>
      <path d="M470 1080 Q470 1040 520 1040 L660 1040 Q700 1050 690 1100 L480 1100 Z" fill="#2a2d33" stroke="${INK}" stroke-width="8"/></g>`;
    const c = $('#ce-crac'); c.style.opacity = t > CRAC && t < CRAC + 0.7 ? 1 : 0;
    c.style.transform = `rotate(-8deg) scale(${lerp(1.4, 1, clamp((t - CRAC) / 0.12))})`;
    if (t > CRAC && t < CRAC + 0.3) $('#esc-cede .cam').style.transform += ` translate(${Math.sin(lt * 90) * 10}px, 0)`;
  },
};

// ---------- 5. Caes. Con todo y piedras. El ruido rebota por el túnel ----------
const PIEDRAS = (() => { const r = rng(17), g = []; for (let i = 0; i < 16; i++) g.push({ x: 200 + r() * 680, d: r() * 0.4, s: 20 + r() * 40, a: r() * 90 }); return g; })();
ESCENAS.caes = {
  html: lienzo(`${tunelLado(0)}<g id="ca-cosas"></g><g id="ca-ondas"></g>${oscuro('ca')}`),
  fijo: `<div class="onomato" id="ca-pum" style="top:820px;left:320px;font-size:170px;opacity:0">¡PUM!</div>`,
  camara: { claves: [[INI.caes, 1.0, 0, 0], [GOLPE, 1.0, 0, 0], [M.rebota, 1.0, 0, 0], [FIN('caes'), 1.06, 0, -40]] },
  update(lt, dur, t) {
    const k = clamp((t - INI.caes) / (GOLPE - INI.caes)), y = lerp(200, 1420, k * k);
    $('#ca-cosas').innerHTML = PIEDRAS.map(p => { const kk = clamp((t - INI.caes - p.d) / (GOLPE - INI.caes)); const py = Math.min(1430, lerp(100, 1460, kk * kk));
      return `<rect x="${p.x}" y="${py - p.s}" width="${p.s * 1.4}" height="${p.s}" fill="#7d776c" stroke="${INK}" stroke-width="5" transform="rotate(${p.a + kk * 200} ${p.x} ${py})"/>`; }).join('') +
      (k < 1 ? `<g transform="rotate(${k * 160} 540 ${y - 200})">${tuConChispa(540, y, 55, t)}</g>`
        : `<g filter="url(#contorno)">${stick({ head: [430, 1350], r: 55, neck: [480, 1380], hip: [640, 1410], legL: [[720, 1380], [800, 1420]], legR: [[700, 1420], [790, 1430]], armL: [[520, 1330], [560, 1300]], armR: [[540, 1400], [600, 1380]], look: 6, lookY: -8, eyeScale: 1.3 })}</g>
          <g filter="url(#ink)" transform="translate(580 1310) scale(0.4)">${perro('parada')}</g>`);
    let ondas = '';
    for (const t0 of [GOLPE, M.rebota]) if (t > t0 && t < t0 + 2.2) { const d = t - t0; for (const dir of [-1, 1]) ondas += `<path d="M${540 + dir * (60 + d * 600)} 1000 q${dir * 60} 200 0 400" fill="none" stroke="#fff" stroke-width="${8 - d * 3}" opacity="${0.8 * (1 - d / 2.2)}"/>`; }
    $('#ca-ondas').innerHTML = ondas;
    luz('ca', 540, Math.min(y, 1350), k < 1 ? 900 : lerp(900, 420, clamp((t - GOLPE) / 1.0)));
    const p = $('#ca-pum'); p.style.opacity = t > GOLPE && t < GOLPE + 0.5 ? 1 : 0;
    p.style.transform = `rotate(-6deg) scale(${lerp(1.5, 1, clamp((t - GOLPE) / 0.12))})`;
    if (t > GOLPE && t < GOLPE + 0.35) $('#esc-caes .cam').style.transform += ` translate(${Math.sin(lt * 80) * 14}px, ${Math.cos(lt * 70) * 10}px)`;
  },
};

// ---------- 6. Silencio. Chispa sigue en tus brazos ----------
ESCENAS.silencio = {
  html: lienzo(`${tunelLado(0)}<g id="si-cosas"></g>${oscuro('si')}<g id="si-celu"></g>`),
  camara: { claves: [[INI.silencio, 1.0, 0, 0], foco(M.sigue, 1.35, 560, 1250), foco(FIN('silencio'), 1.45, 560, 1250)] },
  update(lt, dur, t) {
    $('#si-cosas').innerHTML = `<g filter="url(#contorno)">${stick({ head: [470, 1180], r: 60, neck: [480, 1250], hip: [500, 1400], legL: [[600, 1380], [700, 1420]], legR: [[590, 1420], [690, 1430]], armL: [[540, 1300], [600, 1290]], armR: [[400, 1320], [380, 1250]], look: 14, lookY: 6 })}</g>
      <g filter="url(#ink)" transform="translate(${560 + Math.sin(t * 50) * 1.5} 1300) scale(0.45)">${perro('parada')}</g>
      <circle cx="606" cy="1272" r="5" fill="#fff" opacity="${0.6 + 0.4 * Math.sin(t * 3)}"/>`;
    $('#si-celu').innerHTML = celu(380, 1240, 1.1) + `<text x="380" y="1246" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="16" fill="#1b1e24">9%</text>`;
    luz('si', 480, 1260, 360 + 10 * Math.sin(t * 2));
  },
};

// ---------- 7. Aquí abajo no hay postes. Ninguna alerta te va a salvar ----------
ESCENAS.sinpostes = {
  html: lienzo(`${tunelLado(0)}<g id="sp-poste" opacity="0">${poste(540, 760, 0.9, 560)}</g><g id="sp-x"></g>${oscuro('sp')}`),
  camara: { claves: [[INI.sinpostes, 1.0, 0, 0], [FIN('sinpostes'), 1.08, 0, -40]] },
  update(lt, dur, t) {
    document.querySelectorAll('#esc-sinpostes .onda').forEach(o => o.setAttribute('opacity', 0));
    const a = clamp((t - M.postes + 0.1) / 0.4), x = clamp((t - M.ninguna) / 0.3);
    $('#sp-poste').setAttribute('opacity', 0.35 * a);
    $('#sp-x').innerHTML = x > 0 ? `<g transform="translate(540 1000) scale(${lerp(1.6, 1, ease.outCubic(x))})" opacity="${x}"><path d="M-220 -260 L220 260 M220 -260 L-220 260" stroke="${ROJO}" stroke-width="40" stroke-linecap="round"/></g>` : '';
    luz('sp', 540, 1000, 700);
  },
};

// ---------- 8. El único ruido es el que tú haces ----------
ESCENAS.ruido = {
  html: lienzo(`${tunelLado(0)}<g id="ru-cosas"></g>${oscuro('ru')}`),
  camara: { claves: [[INI.ruido, 1.2, 0, -200], [FIN('ruido'), 1.25, 0, -220]] },
  update(lt, dur, t) {
    const paso = M.haces - 0.1;
    $('#ru-cosas').innerHTML = tuConChispa(500, 1440, 60, t, { look: 12 }) +
      (t > paso ? [0, 1, 2].map(k => { const d = t - paso - k * 0.25; return d > 0 && d < 1.6 ? `<ellipse cx="520" cy="1440" rx="${40 + d * 500}" ry="${12 + d * 120}" fill="none" stroke="#fff" stroke-width="5" opacity="${0.7 * (1 - d / 1.6)}"/>` : ''; }).join('') : '');
    luz('ru', 520, 1250, 380);
  },
};

// ---------- 9. Caminas por las vías, a oscuras, hasta el andén ----------
ESCENAS.vias = {
  html: lienzo(`<g id="vi-mundo"></g>${oscuro('vi')}<g id="vi-tu"></g>`),
  camara: { claves: [[INI.vias, 1.0, 0, 0], [FIN('vias'), 1.05, 0, -30]] },
  update(lt, dur, t) {
    const avanza = (t - INI.vias) * 120;
    const borde = 1300 - avanza * 1.4;
    $('#vi-mundo').innerHTML = tunelLado(avanza) + `<g filter="url(#ink)"><rect x="${borde}" y="1180" width="1200" height="260" fill="#3d4048" stroke="${INK}" stroke-width="8"/>
      <rect x="${borde}" y="1180" width="1200" height="20" fill="#e5a83b"/></g>`;
    const pa = Math.sin(t * 6);
    $('#vi-tu').innerHTML = tuConChispa(380, 1440 - Math.abs(pa) * 6, 60, t, { look: 16 }) + celu(470, 1240, 0.9);
    luz('vi', 640, 1260, 420);
  },
};

// ---------- 10. Y ahí están. Cientos. Parados, con la cara hacia arriba ----------
ESCENAS.anden = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14171c"/>
    <g filter="url(#ink)"><rect x="-20" y="380" width="1120" height="1100" fill="#1d2129"/><rect x="-20" y="1150" width="1120" height="800" fill="#3d4048" stroke="${INK}" stroke-width="8"/></g>
    <g id="an-gente" filter="url(#ink)"></g>${oscuro('an')}`),
  camara: { claves: [[INI.anden, 1.5, 0, -300], [M.cientos - 0.1, 1.5, 0, -300], [M.cientos + 0.6, 1.0, 0, 0], [FIN('anden'), 1.04, 0, -20]] },
  update(lt, dur, t) {
    $('#an-gente').innerHTML = andenGente(t);
    // la luz barre el andén y se abre con "cientos"
    const x = 540 + Math.sin((t - INI.anden) * 1.2) * 300, abre = clamp((t - M.cientos) / 0.8);
    luz('an', x, 1000, lerp(330, 1200, abre));
  },
};

// ---------- 11. Pasas entre ellos sin respirar ----------
ESCENAS.pasas = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14171c"/><g filter="url(#ink)"><rect x="-20" y="1450" width="1120" height="500" fill="#3d4048"/></g>
    <g id="pa-atras" filter="url(#ink)"></g><g id="pa-tu"></g><g id="pa-frente" filter="url(#ink)"></g>${oscuro('pa')}`),
  camara: { claves: [[INI.pasas, 1.0, 0, 0], [FIN('pasas'), 1.08, 0, -40]] },
  update(lt, dur, t) {
    const px = lerp(260, 560, clamp((t - INI.pasas) / (FIN('pasas') - INI.pasas)));
    $('#pa-atras').innerHTML = [[120, 1450, 900], [480, 1430, 860], [860, 1450, 920]].map(([x, y, h], i) => `<g transform="translate(${x} ${y}) scale(${h})">${infectadoQuieto(0, 0.01 * (i - 1), -0.035)}</g>`).join('');
    $('#pa-tu').innerHTML = tuConChispa(px, 1500 - Math.abs(Math.sin(t * 4)) * 8, 70, t, { look: 6, lookY: -10, eyeScale: 1.25, tiembla: true });
    $('#pa-frente').innerHTML = [[-60, 1960, 1500], [1100, 1960, 1500]].map(([x, y, h]) => `<g transform="translate(${x} ${y}) scale(${h})">${infectadoQuieto(0, 0, -0.035)}</g>`).join('');
    luz('pa', px + 60, 1200, 520);
  },
};

// ---------- 12. La cinta de la placa se despegó en la caída ----------
ESCENAS.cinta = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14171c"/><g id="ci-cara" filter="url(#ink)"></g><g id="ci-mano" filter="url(#ink)"></g>${oscuro('ci')}`),
  camara: { claves: [[INI.cinta, 1.0, 0, 0], foco(M.cintaM, 1.0, 540, 960), foco(M.cintaM + 0.6, 1.8, 540, 1310), foco(FIN('cinta'), 1.9, 540, 1320)] },
  update(lt, dur, t) {
    const suelta = t > M.dedos - 0.2;
    $('#ci-cara').innerHTML = `<g transform="translate(540 760) scale(1.0)">${caraChispa({ sinCinta: suelta, parpadeo: false })}</g>`;
    // tus dedos con el pedazo de cinta
    const sube = clamp((t - M.dedos + 0.2) / 0.6);
    $('#ci-mano').innerHTML = suelta ? `<g transform="translate(${lerp(760, 700, sube)} ${lerp(1460, 1360, sube)}) rotate(-20)">
      <path d="M0 0 L240 160" stroke="${INK}" stroke-width="90" stroke-linecap="round"/><path d="M0 0 L240 160" stroke="#e9e2d6" stroke-width="66" stroke-linecap="round"/>
      <path d="M-30 -10 L-110 -40 M-20 20 L-100 30" stroke="${INK}" stroke-width="40" stroke-linecap="round"/><path d="M-30 -10 L-110 -40 M-20 20 L-100 30" stroke="#e9e2d6" stroke-width="24" stroke-linecap="round"/>
      <path d="M-100 -30 q-40 30 -20 80 q30 20 50 -10 z" fill="#c9ccd2" stroke="${INK}" stroke-width="5" opacity=".95"/></g>` : '';
    luz('ci', 540, 1100, 620);
  },
};

// ---------- 13. La placa suena. Una sola vez ----------
ESCENAS.suena = {
  html: lienzo(`<rect width="1080" height="1920" fill="#08090c"/><g id="su-placa"></g>${oscuro('su')}`),
  fijo: `<div class="onomato" id="su-tin" style="top:540px;left:0;width:1080px;text-align:center;font-size:140px;opacity:0;-webkit-text-stroke:6px #000">tin</div>`,
  camara: { claves: [[INI.suena, 1.2, 0, 0], [TIN, 1.2, 0, 0], [TIN + 0.1, 1.3, 0, 0], [FIN('suena'), 1.0, 0, 0]] },
  update(lt, dur, t) {
    const ang = Math.sin((t - INI.suena) * 4) * 22 * Math.max(0, 1 - (t - TIN - 0.3) / 2);
    const brillo = t > TIN && t < TIN + 1.2 ? 1 - (t - TIN) / 1.2 : 0;
    $('#su-placa').innerHTML = `<g transform="translate(540 760)" filter="url(#ink)">
      <path d="M-420 -40 Q0 60 420 -40 L420 30 Q0 130 -420 30 Z" fill="#3a6fd8" stroke="${INK}" stroke-width="10"/>
      <circle cx="0" cy="70" r="34" fill="none" stroke="#b8bec6" stroke-width="12"/>
      <g transform="rotate(${ang} 0 70)"><circle cx="0" cy="210" r="110" fill="#c9ccd2" stroke="${INK}" stroke-width="10"/><circle cx="-30" cy="180" r="24" fill="#fff" opacity=".7"/>
        <text x="0" y="230" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="56" fill="#6b7280">CHISPA</text></g>
      ${brillo > 0 ? [0, 1, 2].map(k => `<circle cx="0" cy="210" r="${130 + (1 - brillo) * 400 + k * 50}" fill="none" stroke="#fff" stroke-width="6" opacity="${brillo * (1 - k * 0.3)}"/>`).join('') : ''}</g>`;
    const tin = $('#su-tin'); tin.style.opacity = brillo > 0.3 ? 1 : brillo / 0.3;
    luz('su', 540, 970, t > TIN ? lerp(520, 340, clamp((t - TIN - 0.6) / 1.5)) : 520);
  },
};

// ---------- 14. Y cientos de cabezas giran hacia ti ----------
const MONTON = (() => { const r = rng(88), g = []; for (let i = 0; i < 150; i++) { const x = 20 + r() * 1040, y = 200 + r() * 1300; if (Math.hypot(x - 540, y - 1300) < 170) continue; g.push({ x, y, s: 0.55 + r() * 0.3, d: Math.hypot(x - 540, y - 1300) / 1300 }); } return g.sort((a, b) => a.y - b.y); })();
ESCENAS.giran = {
  html: lienzo(`<rect width="1080" height="1920" fill="#2f3440"/><g id="gi-gente"></g><g id="gi-tu"></g><rect id="gi-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${oscuro('gi')}`),
  camara: { claves: [[INI.giran, 1.25, 0, 0], [GIRAN, 1.25, 0, 0], [GIRAN + 0.8, 1.0, 0, 0], [FIN('giran'), 1.04, 0, -20]], origen: '540px 1100px' },
  update(lt, dur, t) {
    $('#gi-gente').innerHTML = MONTON.map(p => {
      const k = ease.outCubic(clamp((t - GIRAN - p.d * 0.5) / 0.25));
      const dx = (540 - p.x), dy = (1300 - p.y), n = Math.hypot(dx, dy) || 1;
      const ex = lerp(0, dx / n * 12, k), ey = lerp(-10, dy / n * 12, k);
      return `<g transform="translate(${p.x} ${p.y}) scale(${p.s})">
        <ellipse cx="6" cy="44" rx="56" ry="30" fill="#000" opacity=".25"/><ellipse cx="0" cy="36" rx="54" ry="27" fill="#3d4048" stroke="${INK}" stroke-width="5"/>
        <circle cx="0" cy="0" r="38" fill="url(#headInfectadoOscuro)" stroke="${INK}" stroke-width="6"/>
        <g style="filter:drop-shadow(0 0 7px #fff)"><ellipse cx="${-13 + ex}" cy="${ey}" rx="6.5" ry="10" fill="#f2f2f2"/><ellipse cx="${13 + ex}" cy="${ey}" rx="6.5" ry="10" fill="#f2f2f2"/></g></g>`;
    }).join('');
    $('#gi-tu').innerHTML = `<g transform="translate(540 1300)"><circle r="46" fill="url(#headShade)" stroke="${INK}" stroke-width="6"/><path d="M-30 30 L30 30 L0 70 Z" fill="#c8282e" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="60" cy="10" rx="40" ry="26" fill="#6e4325" stroke="${INK}" stroke-width="5"/></g>`;
    $('#gi-rojo').setAttribute('opacity', t > GIRAN ? 0.35 * clamp(1 - (t - GIRAN) / 0.5) : 0);
    luz('gi', 540, 1100, t > GIRAN ? lerp(500, 1400, clamp((t - GIRAN) / 0.6)) : 500);
    if (t > GIRAN && t < GIRAN + 0.4) $('#esc-giran .cam').style.transform += ` translate(${Math.sin(lt * 70) * 9}px, ${Math.cos(lt * 61) * 7}px)`;
  },
};

// ---------- 15. ¿Corres por el túnel, o no te mueves? ----------
ESCENAS.decide = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="960" r="900" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="de-tit">¿QUÉ HACES?</div>
    <div class="opcion" id="de-a" style="top:560px;font-size:70px"><span class="emo">🏃</span><span class="txt">CORRES POR EL TÚNEL</span></div>
    <div class="opcion" id="de-b" style="top:900px;font-size:70px"><span class="emo">🤫</span><span class="txt">NO TE MUEVES</span></div>
    <div class="decide-com" id="de-com">COMENTA <span class="emo">🏃</span> O <span class="emo">🤫</span></div>
    <div class="decide-pie" id="de-pie">GANA LO QUE MÁS COMENTEN</div>`,
  update(lt, dur, t) {
    pop($('#de-tit'), t, INI.decide);
    pop($('#de-a'), t, M.corres - 0.1);
    pop($('#de-b'), t, M.mueves - 0.1);
    pop($('#de-com'), t, M.comenta - 0.1);
    $('#de-pie').style.opacity = clamp((t - M.comenta - 0.6) / 0.3);
    const a = t >= M.corres - 0.1 && t < M.mueves - 0.1, b = t >= M.mueves - 0.1 && t < M.comenta - 0.1;
    $('#de-a').style.borderColor = a ? '#e5a83b' : '#fff';
    $('#de-b').style.borderColor = b ? '#9fd0ff' : '#fff';
    if (a) $('#de-a').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
    if (b) $('#de-b').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
  },
};
