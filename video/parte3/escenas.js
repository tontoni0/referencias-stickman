// Escenas de "La alerta", parte 3: el mecate. Abre con el momento más tenso (gancho),
// se rebobina y cuenta cómo se llegó ahí. Los tiempos salen de tl.js.

const MECATE = '#d9c9a0';
const P = [440, 562];           // donde tus manos sostienen el mecate
const LARGO = 520;              // largo del mecate cuando la botella llega al 402
const VIDRIO = 332;             // cara exterior del vidrio del 402

// Botella de 2 litros colgada de la tapa en (x, y), girada ang grados. brillo mueve el reflejo (gira sobre sí misma).
function botella(x, y, ang, brillo = 0, s = 1, letrero = '') {
  const hl = Math.sin(brillo) * 22;
  return `<g transform="translate(${x} ${y}) rotate(${ang}) scale(${s})">
    <rect x="-13" y="0" width="26" height="20" rx="4" fill="#2f6fd6" stroke="${INK}" stroke-width="5"/>
    <path d="M-12 20 L-12 34 Q-44 52 -44 92 L-44 170 Q-44 186 -28 186 L28 186 Q44 186 44 170 L44 92 Q44 52 12 34 L12 20 Z" fill="rgba(175,210,240,0.55)" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M-41 100 L41 100 L41 170 Q41 182 28 182 L-28 182 Q-41 182 -41 170 Z" fill="rgba(80,135,205,0.55)"/>
    <rect x="-44" y="118" width="88" height="34" fill="#f2efe6" stroke="${INK}" stroke-width="4"/>
    ${letrero ? `<text x="0" y="145" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="24" fill="${TINTA}">${letrero}</text>` : ''}
    <line x1="${-20 + hl}" y1="62" x2="${-20 + hl}" y2="112" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".6"/>
  </g>`;
}

// Mecate con una pequeña panza, de (x1,y1) a (x2,y2).
const mecate = (x1, y1, x2, y2, panza = 10) => {
  const mx = (x1 + x2) / 2 + panza, my = (y1 + y2) / 2;
  const d = `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${MECATE}" stroke-width="5" stroke-linecap="round"/>`;
};

// Distancia entre la botella y el vidrio para un ángulo (grados, negativo = hacia la pared).
const hueco = a => { const t = -a * Math.PI / 180; return P[0] - (LARGO + 170) * Math.sin(t) - 44 * Math.cos(t) - VIDRIO; };
// Ángulo en el que la botella queda a 3 px del vidrio.
const CASI = (() => { let lo = 0, hi = 15; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; hueco(-m) > 3 ? lo = m : hi = m; } return -lo; })();

// La botella cuelga del mecate: regresa el SVG de mecate + botella para un ángulo y un largo.
function colgando(ang, largo = LARGO, brillo = 0) {
  const a = ang * Math.PI / 180;
  const cx = P[0] + largo * Math.sin(a), cy = P[1] + largo * Math.cos(a);
  return mecate(P[0], P[1], cx, cy, 6) + botella(cx, cy, -ang, brillo);
}

// Fachada vista de costado: tu ventana (502) arriba, la de Rosa (402) abajo, el patio con los infectados al fondo.
const multitudLado = (() => {
  const r = rng(31);
  let s = '';
  const gente = [...Array(14)].map(() => ({ x: 400 + r() * 660, y: 1890 + r() * 26, h: 0.9 + r() * 0.3 })).sort((a, b) => a.y - b.y);
  for (const g of gente) {
    const k = 19 * g.h;
    s += infectado({ head: [g.x, g.y - k * 8.6], r: k, neck: [g.x, g.y - k * 7.6], hip: [g.x, g.y - k * 4.4],
      legL: [[g.x - k * 0.3, g.y - k * 2.2], [g.x - k * 0.6, g.y]], legR: [[g.x + k * 0.3, g.y - k * 2.2], [g.x + k * 0.6, g.y]],
      armL: [[g.x - k * 1.4, g.y - k * 5.6], [g.x - k * 1.6, g.y - k * 4]], armR: [[g.x + k * 1.4, g.y - k * 5.6], [g.x + k * 1.6, g.y - k * 4]],
      lookY: -k * 0.35, gris: '#7d838c' });
  }
  return s;
})();

function fachada(pre, extra = '') {
  return `
    <defs><linearGradient id="${pre}-aire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6b3c6"/><stop offset="1" stop-color="#66738a"/></linearGradient></defs>
    <rect width="1080" height="2200" fill="url(#${pre}-aire)"/>
    <g fill="#8794aa" opacity=".7">
      <rect x="700" y="420" width="380" height="1500"/><rect x="760" y="380" width="40" height="40"/><rect x="900" y="380" width="40" height="40"/>
      ${[...Array(9)].map((_, j) => [0, 1, 2].map(i => `<rect x="${730 + i * 115}" y="${470 + j * 150}" width="60" height="70" fill="#76839a"/>`).join('')).join('')}
    </g>
    <rect y="1880" width="1080" height="320" fill="#4b5160"/>
    <g filter="url(#ink)">
      <rect x="-20" y="-20" width="350" height="1920" fill="#9c8676" stroke="${INK}" stroke-width="8"/>
      <rect x="190" y="250" width="140" height="350" fill="#1a2130" stroke="${INK}" stroke-width="7"/>
      <rect x="230" y="900" width="100" height="370" fill="#2a2430" stroke="${INK}" stroke-width="7"/>
      <path d="M232 905 h96 v120 q-12 20 -24 0 q-12 20 -24 0 q-12 20 -24 0 q-12 20 -24 0 z" fill="#d8a7b5" stroke="${INK}" stroke-width="4" opacity=".9"/>
      <rect x="250" y="1430" width="80" height="230" fill="#2a2f3a" stroke="${INK}" stroke-width="7"/>
      <rect x="170" y="600" width="200" height="30" fill="#c4b8a8" stroke="${INK}" stroke-width="7"/>
      <rect x="210" y="1270" width="160" height="24" fill="#c4b8a8" stroke="${INK}" stroke-width="7"/>
      <rect x="230" y="1660" width="140" height="20" fill="#c4b8a8" stroke="${INK}" stroke-width="6"/>
      <line x1="0" y1="740" x2="330" y2="740" stroke="#8a7466" stroke-width="10"/><line x1="0" y1="1360" x2="330" y2="1360" stroke="#8a7466" stroke-width="10"/>
    </g>
    <g id="${pre}-vidrio">
      <rect x="318" y="900" width="14" height="370" fill="#bcd0e6" stroke="${INK}" stroke-width="5"/>
      <line x1="325" y1="930" x2="325" y2="1010" stroke="#fff" stroke-width="4" opacity=".8"/>
    </g>
    <g filter="url(#ink)">${multitudLado}</g>
    <g filter="url(#ink)" id="${pre}-tu">${stick({ head: [392, 470], r: 62, neck: [362, 525], hip: [250, 620], paliacate: true,
      armL: [[405, 540], [438, 558]], armR: [[420, 565], [446, 572]], look: 14, lookY: 18 })}</g>
    <g id="${pre}-colgado"></g>
    ${extra}`;
}

// Ángulo de la botella que se balancea cada vez más hasta quedar a 3 px del vidrio en tCasi.
function vaiven(lt, tCasi, inicioAmp = 2) {
  const w = 2 * Math.PI * 0.55;
  const fase = -Math.PI / 2 - w * tCasi;
  if (lt >= tCasi) return CASI + Math.sin(lt * 31) * 0.15;
  const amp = lerp(inicioAmp, -CASI, clamp(lt / tCasi));
  return amp * Math.sin(w * lt + fase);
}

// Vista desde tu ventana hacia abajo: el patio con los infectados mirando hacia arriba.
const multitudArriba = (() => {
  const r = rng(91);
  const g = [];
  for (let k = 0; k < 20; k++) g.push({ x: 140 + r() * 800, y: 780 + r() * 700, s: 0.85 + r() * 0.35 });
  return g.sort((a, b) => a.y - b.y);
})();
function vistaAbajo(pre) {
  let rejilla = '';
  for (let y = 300; y < 2000; y += 130) rejilla += `<line x1="0" y1="${y}" x2="1080" y2="${y}"/>`;
  for (let x = 0; x < 1100; x += 150) rejilla += `<line x1="${x}" y1="300" x2="${x}" y2="1920"/>`;
  return `
    <rect width="1080" height="1920" fill="#474d5b"/>
    <g stroke="#3f4552" stroke-width="4">${rejilla}</g>
    <rect width="1080" height="300" fill="#7d6a5e"/>
    <rect y="260" width="1080" height="40" fill="#5d4f46"/>
    ${[0, 1].map(i => `<rect x="${330 + i * 260}" y="${70 + i * 8}" width="160" height="${60 - i * 20}" fill="#2a2430" stroke="${INK}" stroke-width="5"/>`).join('')}
    <g id="${pre}-gente" filter="url(#ink)">${multitudArriba.map((p, i) => `<g class="cab" data-i="${i}" transform="translate(${p.x} ${p.y}) scale(${p.s})">
      <ellipse cx="6" cy="44" rx="56" ry="30" fill="#000" opacity=".25"/>
      <ellipse cx="0" cy="36" rx="54" ry="27" fill="#3d4048" stroke="${INK}" stroke-width="5"/>
      <circle cx="0" cy="0" r="38" fill="url(#headInfectadoOscuro)" stroke="${INK}" stroke-width="6"/>
      <g class="ojos"><ellipse cx="-13" cy="-2" rx="6.5" ry="10" fill="#f2f2f2"/><ellipse cx="13" cy="-2" rx="6.5" ry="10" fill="#f2f2f2"/></g>
    </g>`).join('')}</g>
    <g id="${pre}-colgado"></g>
    ${viñeta}`;
}
const colgandoArriba = (lt, mov = 1) => {
  const x = 540 + Math.sin(lt * 1.7) * 18 * mov, y = 300;
  return mecate(540, -10, x, y, 4) + `<g filter="url(#ink)">${botella(x, y, Math.sin(lt * 1.7) * -3 * mov, lt * 2 * mov, 1.5)}</g>`;
};

// 1. GANCHO en tres tomas: la botella junto al vidrio, los veinte mirando hacia arriba,
// y otra vez el vidrio, a 3 px. Ahí se congela.
ESCENAS.gancho = {
  html: lienzo(fachada('ga') + viñeta),
  camara: { claves: [[0, 1.75, 250, -410], [FIN('gancho'), 1.55, 220, -330]] },
  update(lt) {
    $('#ga-colgado').innerHTML = colgando(Math.sin(lt * 3.4) * 3.2 - 1.5, LARGO, lt * 3);
  },
};

ESCENAS.ganchoAbajo = {
  html: lienzo(vistaAbajo('gb')),
  camara: { de: { s: 1.0, x: 0, y: 0 }, a: { s: 1.35, x: 0, y: -260 }, origen: '540px 1100px' },
  update(lt) {
    $('#gb-colgado').innerHTML = colgandoArriba(lt + 2);
    document.querySelectorAll('#gb-gente .ojos').forEach(o => o.style.filter = 'drop-shadow(0 0 10px #fff)');
  },
};

ESCENAS.ganchoVidrio = {
  html: lienzo(fachada('gv') + viñeta),
  fijo: `<div class="full" id="gv-flash" style="background:#fff;opacity:0"></div>`,
  camara: { claves: [[INI.ganchoVidrio, 1.5, 200, -300], [FIN('ganchoVidrio') - 0.75, 1.95, 400, -410], [FIN('ganchoVidrio'), 2.0, 405, -415]] },
  update(lt, dur, t) {
    const congela = FIN('ganchoVidrio') - 0.75;
    const ltc = Math.min(lt, congela - INI.ganchoVidrio);
    $('#gv-colgado').innerHTML = colgando(vaiven(ltc, congela - INI.ganchoVidrio - 0.05, 4), LARGO, ltc * 3);
    document.querySelector('#esc-ganchoVidrio .cam').style.filter = t > congela ? 'grayscale(.75) contrast(1.25)' : '';
    $('#gv-flash').style.opacity = t > congela ? 0.7 * clamp(1 - (t - congela) / 0.25) : 0;
  },
};

// 2. Rebobinado tipo VHS: "10 minutos antes".
ESCENAS.rebobina = {
  html: lienzo(fachada('re') + viñeta),
  fijo: `<div class="full" id="re-ruido"></div>
     <div class="full" style="background:repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 3px, transparent 3px 7px)"></div>
     <div class="vhs" style="top:110px;left:70px">◀◀ REW</div>
     <div class="vhs grande" id="re-txt">10 MINUTOS ANTES</div>`,
  camara: { de: { s: 1.15, x: 0, y: 40 }, a: { s: 1.05, x: 0, y: 0 } },
  update(lt, dur) {
    const p = ease.inOut(clamp(lt / dur));
    $('#re-colgado').innerHTML = colgando(Math.sin(lt * 40) * 6 * (1 - p), lerp(LARGO, 40, p), -lt * 20);
    document.querySelector('#esc-rebobina .cam').style.filter = `saturate(.35) contrast(1.3) hue-rotate(${Math.sin(lt * 9) * 12}deg)`;
    document.querySelector('#esc-rebobina .cam').style.transform += ` translateX(${Math.sin(lt * 70) * 8}px)`;
    const r = rng(Math.floor(lt * 30) + 1);
    $('#re-ruido').innerHTML = [...Array(5)].map(() => `<div style="position:absolute;left:0;right:0;top:${r() * 1920}px;height:${6 + r() * 30}px;background:rgba(255,255,255,${0.12 + r() * 0.25})"></div>`).join('');
    $('#re-txt').style.opacity = lt > 0.15 ? 1 : 0;
  },
};

// 3. Día 2: corte del edificio. Rosa sin agua, la escalera tomada.
ESCENAS.dia2 = {
  html: `${lienzo(corteEdificio('d2', `
      <g id="d2-mas" opacity="0">
        ${infectado({ head: [842, 905], r: 20, neck: [842, 925], hip: [842, 972], legL: [[838, 996], [834, 1020]], legR: [[846, 996], [850, 1020]], armL: [[830, 955], [828, 975]], armR: [[854, 955], [856, 975]], look: -5 })}
        ${infectado({ head: [822, 1246], r: 22, neck: [822, 1268], hip: [822, 1318], legL: [[818, 1342], [814, 1364]], legR: [[826, 1342], [830, 1364]], armL: [[808, 1302], [806, 1326]], armR: [[836, 1302], [838, 1326]], look: -6 })}
      </g>
      <g id="d2-garrafon" opacity="0">
        <rect x="585" y="1350" width="70" height="95" rx="14" fill="none" stroke="${ROJO}" stroke-width="6"/>
        <rect x="605" y="1330" width="30" height="20" rx="4" fill="none" stroke="${ROJO}" stroke-width="5"/>
        <text x="620" y="1320" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="54" fill="${ROJO}">0 L</text>
      </g>
      <path id="d2-x1" d="M740 900 L990 1440" pathLength="1" stroke="${ROJO}" stroke-width="18" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1"/>
      <path id="d2-x2" d="M990 900 L740 1440" pathLength="1" stroke="${ROJO}" stroke-width="18" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1"/>`) + viñeta)}`,
  fijo: `<div class="dia-titulo" id="d2-tit" style="top:40px;font-size:200px">Día 2</div>`,
  camara: { claves: [
    [INI.dia2, 1.02, 0, 60], [M.sinagua, 1.15, 40, -80],
    [M.escalera, 1.15, 40, -80], [M.escalera + 0.8, 1.3, -280, -170], [FIN('dia2'), 1.32, -290, -175],
  ] },
  update(lt, dur, t) {
    escribe($('#d2-tit'), t, INI.dia2 + 0.05, 0.6);
    $('#d2-garrafon').setAttribute('opacity', clamp((t - M.sinagua) / 0.3));
    const vis = clamp((t - M.escalera) / 0.4);
    $('#d2-inf').setAttribute('opacity', vis);
    $('#d2-mas').setAttribute('opacity', vis);
    $('#d2-x1').setAttribute('stroke-dashoffset', 1 - clamp((t - M.escalera - 0.5) / 0.3));
    $('#d2-x2').setAttribute('stroke-dashoffset', 1 - clamp((t - M.escalera - 0.75) / 0.3));
  },
};

// 4. El mecate del tendedero.
(() => {
  const camisa = `<path d="M-60 0 L-20 -6 Q0 14 20 -6 L60 0 L84 40 L56 52 L52 150 L-52 150 L-56 52 L-84 40 Z" fill="#5d86c4" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  const calcetin = `<path d="M-16 0 h32 v90 q0 30 -30 30 h-30 q-10 -24 14 -28 l14 -2 z" fill="#ecebe6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  const toalla = `<rect x="-55" y="0" width="110" height="140" rx="6" fill="#d97a5b" stroke="${INK}" stroke-width="6"/><path d="M-55 110 h110" stroke="#f2d0b8" stroke-width="8"/>`;
  const pinza = x => `<rect x="${x - 6}" y="-16" width="12" height="30" rx="3" fill="#c9a06a" stroke="${INK}" stroke-width="3"/>`;
  const ropa = [[300, 708, camisa], [610, 726, calcetin], [810, 718, toalla]];
  ESCENAS.mecate = {
    html: `${lienzo(`
      <rect width="1080" height="1920" fill="url(#paredDia)"/>
      <rect y="1600" width="1080" height="320" fill="#1a2130"/>
      <g filter="url(#ink)">
        <rect x="140" y="340" width="800" height="660" fill="url(#ventanaDia)" stroke="#0e1219" stroke-width="16"/>
        <line x1="540" y1="340" x2="540" y2="1000" stroke="#0e1219" stroke-width="12"/>
        <circle cx="90" cy="640" r="12" fill="#5b616b" stroke="${INK}" stroke-width="4"/><circle cx="990" cy="680" r="12" fill="#5b616b" stroke="${INK}" stroke-width="4"/>
        <g id="me-cuerda"><path d="M90 640 Q540 790 990 680" fill="none" stroke="${INK}" stroke-width="13"/><path d="M90 640 Q540 790 990 680" fill="none" stroke="${MECATE}" stroke-width="7"/></g>
        <g id="me-ropa">${ropa.map(([x, y, f], i) => `<g class="prenda" data-i="${i}" transform="translate(${x} ${y})">${f}${pinza(-30)}${pinza(30)}</g>`).join('')}</g>
        ${stick({ head: [860, 990], r: 100, neck: [860, 1090], hip: [860, 1350], legL: [[845, 1480], [835, 1600]], legR: [[875, 1480], [885, 1600]], footL: -1, footR: 1,
          armL: [[900, 880], [948, 722]], armR: [[935, 860], [978, 690]], look: 18, lookY: -22 })}
        <g transform="translate(260 1560) scale(0.8)">${perro('echada')}</g>
      </g>
      ${viñeta}`)}
      <div class="tinta" id="me-et" style="top:860px;left:330px;font-size:96px;font-weight:700;color:#fff;transform:rotate(-5deg)">el mecate ↑</div>`,
    camara: { de: { s: 1.05, x: 0, y: 0 }, a: { s: 1.12, x: -20, y: 30 }, origen: '540px 760px' },
    update(lt, dur, t) {
      document.querySelectorAll('#me-ropa .prenda').forEach(g => {
        const i = +g.dataset.i, [x, y] = ropa[i];
        const c = clamp(lt - 0.4 - i * 0.3);
        g.setAttribute('transform', `translate(${x + c * 40} ${y + 900 * c * c}) rotate(${c * 50 * (i % 2 ? -1 : 1)})`);
      });
      const brilla = clamp((lt - 1.3) / 0.3);
      $('#me-cuerda').style.filter = brilla ? `drop-shadow(0 0 ${14 * brilla}px rgba(255,240,180,.9))` : '';
      escribe($('#me-et'), t, INI.mecate + 1.3, 0.5);
    },
  };
})();

// 5. Amarras la botella.
ESCENAS.amarra = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#paredDia)"/>
    <rect y="1385" width="1080" height="535" fill="#6a4a35" stroke="${INK}" stroke-width="8"/>
    <path d="M0 1500 q300 20 600 0 t480 10 M0 1660 q260 -20 540 10 t540 -10" stroke="#5a3e2c" stroke-width="5" fill="none"/>
    <ellipse cx="560" cy="1392" rx="190" ry="20" fill="#000" opacity=".3"/>
    <g filter="url(#ink)">${botella(540, 790, 0, 0.6, 3.2, 'p/ Rosa')}</g>
    <g filter="url(#ink)" id="am-nudo"></g>
    <g filter="url(#ink)" id="am-manos"></g>
    ${viñeta}`),
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.12, x: 0, y: 80 }, origen: '540px 880px' },
  update(lt) {
    const vueltas = Math.min(3, Math.floor(lt / 0.35));
    let s = '';
    for (let i = 0; i < vueltas; i++) s += `<ellipse cx="540" cy="${866 + i * 16}" rx="52" ry="12" fill="none" stroke="${INK}" stroke-width="12"/><ellipse cx="540" cy="${866 + i * 16}" rx="52" ry="12" fill="none" stroke="${MECATE}" stroke-width="6"/>`;
    const tira = Math.sin(lt * 9) * 10;
    s += mecate(590, 880, 760 + tira, 560, -20);
    $('#am-nudo').innerHTML = s;
    $('#am-manos').innerHTML = linea([[1100, 300], [880, 470], [760 + tira, 560]], 10) + punto(760 + tira, 560, 16)
      + linea([[1100, 760], [820, 760], [610 - tira * 0.5, 878]], 10) + punto(610 - tira * 0.5, 878, 16);
  },
};

// 6. La bajas por la ventana, despacio.
ESCENAS.baja = {
  html: lienzo(fachada('ba') + viñeta),
  camara: { de: { s: 1.25, x: 120, y: 140 }, a: { s: 1.12, x: 80, y: -40 } },
  update(lt, dur) {
    const p = ease.outCubic(clamp(lt / (dur - 0.2)));
    $('#ba-colgado').innerHTML = colgando(Math.sin(lt * 2.2) * 1.5, lerp(70, LARGO, p), lt * 2);
  },
};

// 7. Abajo hay unos veinte, quietos, con la cara hacia arriba.
ESCENAS.patio = {
  html: lienzo(vistaAbajo('pa')),
  camara: { claves: [[INI.patio, 1.0, 0, 0], [M.quietos, 1.08, 0, -60], [M.arriba, 1.2, 0, -160], [FIN('patio'), 1.24, 0, -175]] },
  update(lt, dur, t) {
    $('#pa-colgado').innerHTML = colgandoArriba(lt);
    const brillan = clamp((t - M.arriba) / 0.5);
    document.querySelectorAll('#pa-gente .ojos').forEach(o => o.style.filter = brillan ? `drop-shadow(0 0 ${10 * brillan}px #fff)` : '');
  },
};

// 8. El viento gira la botella hacia el vidrio de Rosa. Igual que el gancho.
ESCENAS.giro = {
  html: lienzo(fachada('gi', `<g id="gi-viento" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"></g>`) + viñeta),
  camara: { claves: [
    [INI.giro, 1.25, 120, -150], [M.acerca, 1.5, 200, -300],
    [M.pega, 1.9, 395, -400], [FIN('giro'), 2.0, 410, -420],
  ] },
  update(lt, dur, t) {
    const tCasi = M.pega + 0.35 - INI.giro;
    $('#gi-colgado').innerHTML = colgando(vaiven(lt, tCasi, 1.5), LARGO, lt * 4);
    let v = '';
    for (let i = 0; i < 6; i++) {
      const x = ((lt * 600 + i * 260) % 1400) - 200, y = 700 + i * 110;
      v += `<path d="M${x} ${y} q60 -14 120 0 t120 0"/>`;
    }
    $('#gi-viento').innerHTML = t < M.pega ? v : '';
  },
};

// 9. Chispa suelta un chillido. Pequeño.
ESCENAS.chillido = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#paredDia)"/>
    <rect width="1080" height="1920" fill="#000" opacity=".2"/>
    <rect y="1500" width="1080" height="420" fill="#1a2130"/>
    <g filter="url(#ink)">
      <rect x="-20" y="300" width="400" height="760" fill="url(#ventanaDia)" stroke="#0e1219" stroke-width="16"/>
      <rect x="-20" y="1050" width="420" height="34" fill="#c4b8a8" stroke="${INK}" stroke-width="7"/>
      ${linea([[60, 1500], [120, 1300], [80, 1150]], 9)}${linea([[170, 1500], [200, 1300], [150, 1150]], 9)}
      ${linea([[120, 1150], [260, 1080], [330, 1060]], 9)}${punto(330, 1060, 12)}
      <g id="ch-perro"><g transform="translate(600 1330) scale(-1.5 1.5)">${perro('echada')}</g></g>
      <path d="M430 1210 q-12 -8 -4 -18 M398 1236 q-14 -4 -10 -16" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g id="ch-gemido" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round">
      <path d="M330 1110 q-20 -20 0 -40 t0 -40"/><path d="M290 1160 q-26 -12 -14 -40"/><path d="M370 1080 q-10 -26 14 -40"/>
    </g>
    ${viñeta}`),
  camara: { claves: [[INI.chillido, 1.05, 0, 0], [M.pequeno, 1.2, 60, -90], [FIN('chillido'), 1.24, 64, -96]], origen: '480px 1250px' },
  update(lt, dur, t) {
    const sale = t > M.chillido + 0.4;
    $('#ch-gemido').style.opacity = sale ? Math.abs(Math.sin((t - M.chillido) * 8)) : 0;
    const tiembla = sale ? Math.sin(lt * 50) * 2 : 0;
    $('#ch-perro').setAttribute('transform', `translate(${tiembla} 0)`);
  },
};

// 10. Una cabeza se mueve. Aguantas la respiración. Cinco segundos. Diez.
ESCENAS.cabeza = {
  html: lienzo(vistaAbajo('cb') + `<rect id="cb-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>`),
  fijo: `<div class="cuenta" id="cb-5">5</div><div class="cuenta" id="cb-10">10</div>`,
  camara: { claves: [[INI.cabeza, 1.3, 0, -200], [M.mueve + 0.2, 1.7, -60, -380], [M.aguantas, 1.7, -60, -380], [FIN('cabeza'), 1.2, 0, -160]] },
  update(lt, dur, t) {
    $('#cb-colgado').innerHTML = colgandoArriba(lt, 0.4);
    const k = 9, p = multitudArriba[k];
    const g = document.querySelector(`#cb-gente .cab[data-i="${k}"]`);
    const giro = t > M.mueve ? Math.sin(clamp((t - M.mueve) / 0.5) * Math.PI) : 0;
    g.setAttribute('transform', `translate(${p.x} ${p.y}) scale(${p.s}) rotate(${giro * 28})`);
    g.querySelector('.ojos').setAttribute('transform', `translate(${giro * 12} 0)`);
    const latido = t > M.aguantas ? Math.pow(Math.max(0, Math.sin((t - M.aguantas) * Math.PI * 2.2)), 8) : 0;
    $('#cb-rojo').setAttribute('opacity', 0.18 * latido);
    for (const [id, marca] of [['#cb-5', M.cinco], ['#cb-10', M.diez]]) {
      const q = (t - marca) / 1.2;
      $(id).style.opacity = q > 0 && q < 1 ? 1 - q * q : 0;
      $(id).style.transform = `scale(${lerp(1.4, 1, ease.outCubic(clamp(q * 3)))})`;
    }
  },
};

// 11. Una mano arrugada sale del 402 y atrapa la botella.
ESCENAS.mano = {
  html: lienzo(fachada('ma', `<g id="ma-brazo" filter="url(#ink)"></g>`) + viñeta),
  camara: { claves: [[INI.mano, 1.6, 300, -330], [M.atrapa, 1.75, 360, -360], [FIN('mano'), 1.8, 370, -370]] },
  update(lt, dur, t) {
    const sale = ease.outCubic(clamp((t - INI.mano - 0.5) / 1.6));
    const agarra = clamp((t - M.atrapa) / 0.25);
    const a = CASI * 0.9 + (agarra ? 0 : Math.sin(lt * 25) * 0.15);
    const ar = a * Math.PI / 180;
    let cx = P[0] + LARGO * Math.sin(ar), cy = P[1] + LARGO * Math.cos(ar);
    cx -= 60 * ease.outCubic(clamp((t - M.atrapa - 0.3) / 0.6));
    $('#ma-colgado').innerHTML = mecate(P[0], P[1], cx, cy, 4) + botella(cx, cy, -a, 0);
    $('#ma-vidrio').setAttribute('transform', `translate(0 ${-380 * sale})`);
    const hx = lerp(250, cx - 50, sale), hy = lerp(1110, cy + 120, sale);
    $('#ma-brazo').innerHTML = sale > 0 ? `
      <path d="M250 1100 L${hx} ${hy}" stroke="${INK}" stroke-width="62" stroke-linecap="round"/>
      <path d="M250 1100 L${hx} ${hy}" stroke="#8d8f96" stroke-width="50" stroke-linecap="round"/>
      <path d="M${(250 + hx) / 2 - 10} ${(1100 + hy) / 2 - 22} l12 40 M${(250 + hx) / 2 + 20} ${(1100 + hy) / 2 - 24} l12 40" stroke="#6b6d74" stroke-width="6"/>
      <circle cx="${hx + 20}" cy="${hy}" r="${30 - 6 * agarra}" fill="#f4f1ea" stroke="${INK}" stroke-width="6"/>
      ${[0, 1, 2].map(i => `<path d="M${hx + 30} ${hy - 16 + i * 14} q${18 - agarra * 14} 2 ${22 - agarra * 18} ${10}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`).join('')}
      <path d="M${hx + 8} ${hy - 12} q6 8 0 16 M${hx + 18} ${hy - 16} q6 8 0 16" fill="none" stroke="#b9b2a4" stroke-width="3"/>` : '';
  },
};

// 12. El mecate se sacude dos veces. Lo subes. Viene un papelito.
ESCENAS.sacude = {
  html: lienzo(`
    <rect width="1080" height="1200" fill="url(#ventanaDia)"/>
    <rect y="1150" width="1080" height="770" fill="#1f2a3d"/>
    <g filter="url(#ink)"><rect x="-20" y="1150" width="1120" height="70" fill="#c4b8a8" stroke="${INK}" stroke-width="8"/></g>
    <g id="sa-todo"></g>
    ${viñeta}`),
  camara: { de: { s: 1.05, x: 0, y: 0 }, a: { s: 1.15, x: 0, y: 80 }, origen: '540px 1100px' },
  update(lt, dur, t) {
    let jalon = 0;
    for (const k of [0, 0.42]) { const q = (t - M.dosveces - k) / 0.22; if (q > 0 && q < 1) jalon += Math.sin(q * Math.PI) * 50; }
    const sube = t > M.subes;
    const mano = sube ? Math.sin((t - M.subes) * 9) * 40 : 0;
    const papel = clamp((t - M.papelito + 0.6) / 0.8);
    const yPapel = lerp(1500, 1020, ease.outCubic(papel));
    const corre = sube ? -((t - M.subes) * 420) % 24 : 0;
    let s = `<g filter="url(#ink)">
      <path d="M560 300 L560 ${papel > 0 ? yPapel : 1920}" stroke="${INK}" stroke-width="16"/>
      <path d="M560 300 L560 ${papel > 0 ? yPapel : 1920}" stroke="${MECATE}" stroke-width="9" stroke-dasharray="12 12" stroke-dashoffset="${corre}"/>
      <path d="M560 300 L560 ${papel > 0 ? yPapel : 1920}" stroke="#bfae84" stroke-width="9" stroke-dasharray="12 12" stroke-dashoffset="${corre + 12}" opacity=".6"/>`;
    if (papel > 0) s += `<g transform="translate(560 ${yPapel}) rotate(-8)"><rect x="-60" y="0" width="120" height="80" fill="#f6f3ea" stroke="${INK}" stroke-width="6"/>
      <path d="M-60 26 h120 M-60 52 h120 M-20 0 v80 M20 0 v80" stroke="#b8cde4" stroke-width="3"/><path d="M-14 -4 l14 14 l14 -14" fill="none" stroke="${MECATE}" stroke-width="8"/></g>`;
    s += `</g>`;
    const yL = 860 + jalon + mano, yR = 980 + jalon - mano;
    s += `<g filter="url(#ink)">${linea([[300, 1920], [380, 1300], [540, yL]], 12)}${punto(548, yL, 22)}${linea([[820, 1920], [740, 1350], [575, yR]], 12)}${punto(568, yR, 22)}</g>`;
    $('#sa-todo').innerHTML = s;
    $('#sa-todo').setAttribute('transform', `translate(0 ${jalon * 0.3})`);
  },
};

// 13. La nota de Rosa, con letra temblorosa.
ESCENAS.nota = {
  html: `<div class="full" style="background:#141a24"></div>
    <div class="papel" id="no-papel">
      <div class="cuaderno"></div>
      <div class="tinta temblor" id="no-1" style="top:170px;left:90px;font-size:118px;font-weight:600">Gracias, corazón.</div>
      <div class="tinta temblor" id="no-2" style="top:380px;left:90px;font-size:118px;font-weight:600">Dios te lo pague.</div>
      <div class="tinta temblor" id="no-3" style="top:640px;left:90px;font-size:126px;font-weight:700">No le abras a Memo.</div>
      ${subrayado('no-sub', 'M90 830 q180 -14 360 4 t330 -6')}
    </div>`,
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.08, x: 0, y: -40 } },
  update(lt, dur, t) {
    escribe($('#no-1'), t, INI.nota + 0.2, 0.8);
    escribe($('#no-2'), t, M.dios, 0.7);
    escribe($('#no-3'), t, M.noabras, 0.8);
    $('#no-sub').setAttribute('stroke-dashoffset', 1 - clamp((t - M.noabras - 0.8) / 0.4));
  },
};

// 14. Memo, el administrador. Tiene luz, latas y una planta de luz.
(() => {
  const caja = (x, y, txt) => `<rect x="${x}" y="${y}" width="120" height="86" fill="#b98d5c" stroke="${INK}" stroke-width="6"/><text x="${x + 60}" y="${y + 54}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="26" fill="#4a3424">${txt}</text>`;
  ESCENAS.memo = {
    html: `${lienzo(`
      <rect width="1080" height="1920" fill="#3a2c24"/>
      <circle cx="830" cy="380" r="420" fill="url(#luzCalida)"/>
      <rect y="1480" width="1080" height="440" fill="#21170f"/>
      <g filter="url(#ink)">
        <line x1="830" y1="0" x2="830" y2="300" stroke="${INK}" stroke-width="6"/>
        <circle cx="830" cy="320" r="26" fill="#ffe08a" stroke="${INK}" stroke-width="5"/>
        ${caja(60, 1394, 'ATÚN')}${caja(190, 1394, 'FRIJOL')}${caja(60, 1308, 'SOPA')}${caja(190, 1308, 'ATÚN')}${caja(125, 1222, 'AGUA')}
        <rect x="770" y="1300" width="230" height="180" rx="12" fill="#e0a43a" stroke="${INK}" stroke-width="7"/>
        <rect x="800" y="1340" width="90" height="60" fill="#5d4f46" stroke="${INK}" stroke-width="5"/>
        <path d="M1000 1330 h40 v-40" fill="none" stroke="${INK}" stroke-width="12"/>
        <g id="me-mono">${memo({ head: [540, 800], r: 110, neck: [540, 910], hip: [540, 1190], legL: [[520, 1340], [510, 1478]], legR: [[560, 1340], [570, 1478]], footL: -1, footR: 1,
          armL: [[470, 1060], [455, 1160]], armR: [[630, 1060], [600, 975]], brazosAlFrente: true, look: 14, lookY: 16 })}</g>
        <rect x="575" y="930" width="46" height="80" rx="8" fill="#0b0f17" stroke="${INK}" stroke-width="5"/>
        <rect x="581" y="938" width="34" height="64" rx="4" fill="#9fd0ff"/>
      </g>
      <circle cx="600" cy="880" r="150" fill="#9fd0ff" opacity=".12"/>
      <g id="me-vibra" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"><path d="M1060 1260 l10 -16 M1080 1290 l14 -10 M960 1270 l-6 -18"/></g>
      ${viñeta}`)}`,
    fijo: `<div class="presenta" id="me-tit"><div class="nombre">MEMO</div><div class="cargo">101 · ADMINISTRADOR</div></div>`,
    camara: { de: { s: 1.15, x: 0, y: 40 }, a: { s: 1.25, x: 0, y: 80 }, origen: '540px 1000px' },
    update(lt, dur, t) {
      const p = ease.outCubic(clamp((lt - 0.15) / 0.35));
      $('#me-tit').style.transform = `translateX(${(1 - p) * -900}px)`;
      $('#me-vibra').style.opacity = 0.4 + 0.4 * Math.abs(Math.sin(lt * 30));
      document.querySelector('#esc-memo .cam').style.filter = lt > 0.15 && lt < 0.6 ? 'saturate(.4) contrast(1.2)' : '';
    },
  };
})();

// 15. Esa noche te escribe.
ESCENAS.chatmemo = {
  html: `<div class="chat">
    <div class="status"><span>21:12</span><span>▮▯▯ 29%</span></div>
    <div class="head"><span class="back">‹</span><div class="avatar">🔑</div>
      <div><div class="title">Memo 101</div><div class="members" id="cm-estado">en línea</div></div></div>
    <div class="msgs" style="padding-top:120px">
      <div class="pill">HOY</div>
      <div class="new" id="cm-escribe" style="align-self:flex-start;margin-top:0">escribiendo…</div>
      <div class="msg" id="cm-msg" style="outline:4px solid #e0312b"><div class="who" style="color:#e5a83b">Memo 101</div>ya vi que tienes agua<div class="t">21:12</div></div>
    </div></div>`,
  camara: { de: { s: 1.22, x: 0, y: 40 }, a: { s: 1.32, x: 0, y: 50 }, origen: '40px 600px' },
  update(lt, dur, t) {
    const llega = INI.chatmemo + 1.1;
    const escribe_ = t > M.noche && t < llega;
    $('#cm-estado').textContent = escribe_ ? 'escribiendo…' : 'en línea';
    $('#cm-escribe').style.opacity = escribe_ ? 0.6 + 0.4 * Math.sin(lt * 12) : 0;
    $('#cm-escribe').style.display = t < llega ? 'block' : 'none';
    const p = clamp((t - llega) / 0.25);
    $('#cm-msg').style.opacity = p;
    $('#cm-msg').style.transform = `translateY(${(1 - ease.outCubic(p)) * 50}px)`;
    const vibra = t > llega && t < llega + 0.4 ? Math.sin(lt * 140) * 7 : 0;
    document.querySelector('#esc-chatmemo .chat').style.transform = `translateX(${vibra}px)`;
  },
};

// 16. Cierre: parte 4.
ESCENAS.parte4 = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<g filter="url(#ink)" id="p4-mono"></g>`)}
    <div class="p2" id="p4-txt">PARTE 4 <span>→</span></div>
    <div class="p2b" id="p4-sig">SÍGUEME</div>`,
  update(lt) {
    const ola = Math.sin(lt * 9) * 28;
    $('#p4-mono').innerHTML = stick({ head: [540, 470], r: 110, neck: [540, 580], hip: [540, 830],
      legL: [[515, 950], [500, 1060]], legR: [[565, 950], [580, 1060]], footL: -1, footR: 1,
      armL: [[495, 730], [470, 830]], armR: [[630, 600], [680 + ola, 470]], look: 0 });
    $('#p4-txt').style.transform = `scale(${lerp(0.6, 1, ease.outBack(clamp(lt / 0.35)))})`;
    $('#p4-sig').style.opacity = clamp((lt - 0.3) / 0.25);
  },
};
