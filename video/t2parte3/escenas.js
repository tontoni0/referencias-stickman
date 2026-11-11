// Escenas de "La alerta", temporada 2, parte 3: La tienda. Ganó 🔒 en los comentarios de la parte 2:
// no le abres a Memo. Deja su celular bajo la puerta y huye. Al amanecer sales a la tienda de don Chucho
// con una alerta de 90 segundos que se corta a los 60. Termina con una decisión: 🏃 cruzas por Chispa o ⏳ esperas otra alerta.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const CELULAR = M.algo - 0.2;            // el celular entra por debajo de la puerta
const ALERTA = M.suena - 0.1;             // empieza la alerta que pidió Rosa
const CORTE = M.calla + 0.3;              // la alerta se calla a los 60 segundos
const LLAVE = M.llave + 0.1;              // levantas el llavero del patio
const CORTINA = M.cortinaM + 0.1;         // subes la cortina de la tienda
// El reloj de la alerta: de 1:30 a 0:32 rápido y luego segundo a segundo hasta 0:30, cuando se calla.
const T32 = CORTE - 2;
const reloj = t => t < ALERTA ? 90 : t < T32 ? 90 - 58 * (t - ALERTA) / (T32 - ALERTA) : Math.max(30, 32 - (t - T32));
const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

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
// El llavero de Memo con la etiqueta TIENDA.
const llavero = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#ink)">
  <circle cx="0" cy="0" r="22" fill="none" stroke="#b8bec6" stroke-width="7"/>
  ${[-14, 4, 20].map(d => `<path d="M${d} 18 l${d * 0.5} 46" stroke="#c9a43a" stroke-width="9" stroke-linecap="round"/>`).join('')}
  <rect x="18" y="-6" width="96" height="40" rx="6" fill="#efe6cf" stroke="${INK}" stroke-width="5" transform="rotate(14 18 -6)"/>
  <text x="66" y="24" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="22" fill="${INK}" transform="rotate(14 18 -6)">TIENDA</text></g>`;
const chancla = (x, y) => `<g filter="url(#ink)"><ellipse cx="${x}" cy="${y}" rx="44" ry="16" fill="#f2a6c0" stroke="${INK}" stroke-width="5"/><path d="M${x - 14} ${y - 6} q14 -22 28 0" fill="none" stroke="#d6708e" stroke-width="7"/></g>`;
// Pantalla del celular de Memo: número desconocido.
const celularMemo = (pre, mostrarSegundo) => `<div class="chat">
  <div class="status"><span>3:31</span><span>▮▮▯ 58%</span></div>
  <div class="head"><span class="back">‹</span><div class="avatar">?</div>
    <div><div class="title">Número desconocido</div><div class="members">sin nombre</div></div></div>
  <div class="msgs" style="padding-top:120px">
    <div class="pill">LA PRIMERA NOCHE</div>
    <div class="msg" id="${pre}-m0"><div class="who" style="color:#e5a83b">Número desconocido</div>a las 3:14 bajalos a todos y cierra la puerta. tienes lugar en la evacuacion<div class="t">3:00</div></div>
    <div class="pill" id="${pre}-p1" style="${mostrarSegundo ? '' : 'opacity:0'}">AYER</div>
    <div class="msg" id="${pre}-m1" style="outline:5px solid ${ROJO};${mostrarSegundo ? '' : 'opacity:0'}"><div class="who" style="color:#e5a83b">Número desconocido</div>la operadora esta en la antena del centro de alerta. traela<div class="t">22:41</div></div>
  </div></div>`;
const aparece = (el, t, t0) => { const p = clamp((t - t0) / 0.3); el.style.opacity = p; el.style.transform = `translateY(${(1 - ease.outCubic(p)) * 50}px)`; };

// ---------- 1. Ganó el candado ----------
ESCENAS.gano = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="1040" r="800" fill="url(#luzCalida)" opacity=".1"/>`)}
    <div class="decide-tit" id="ga-tit">GANÓ</div>
    <div class="opcion" id="ga-a" style="top:560px"><span class="emo">🚪</span><span class="txt" style="text-decoration:line-through;text-decoration-color:#e0312b;text-decoration-thickness:10px">SÍ, LE ABRO</span></div>
    <div class="opcion" id="ga-b" style="top:900px;border-color:#9fd0ff;box-shadow:0 0 40px rgba(159,208,255,.5)"><span class="emo">🔒</span><span class="txt">NO LE ABRO</span></div>
    <div class="decide-pie" id="ga-pie" style="top:1260px">LOS COMENTARIOS ELIGIERON</div>`,
  camara: { claves: [[0, 1.0, 0, 0], [M.noabres, 1.0, 0, 0], [FIN('gano'), 1.12, 0, -50]], origen: '540px 1030px' },
  update(lt, dur, t) {
    pop($('#ga-tit'), t, 0.02, 0.25);
    pop($('#ga-b'), t, 0.1, 0.3);
    $('#ga-b').style.transform += ` scale(${1 + 0.035 * Math.sin(t * 8)})`;
    $('#ga-a').style.opacity = 0.35;
    $('#ga-pie').style.opacity = clamp((t - M.noabres) / 0.3);
  },
};

// ---------- 2. Los golpes paran. Por debajo de la puerta entra el celular de Memo ----------
ESCENAS.celular = {
  html: lienzo(puertaDentro('ce')),
  fijo: `<div class="onomato" id="ce-pum" style="top:640px;left:620px;font-size:150px;opacity:0">¡PUM!</div>`,
  camara: { claves: [[INI.celular, 1.0, 0, 0], [CELULAR, 1.05, -40, -40], foco(M.celularM - 0.3, 1.6, 700, PISO - 120), foco(FIN('celular'), 1.7, 690, PISO - 140)] },
  update(lt, dur, t) {
    const d = t - INI.celular;
    $('#ce-hoja').innerHTML = hojaDentro(d < 0.15 ? Math.sin(t * 90) * 5 : 0);
    const pum = $('#ce-pum');
    pum.style.opacity = d < 0.35 ? 1 : 0;
    pum.style.transform = `rotate(-8deg) scale(${lerp(1.4, 1, clamp(d / 0.1))})`;
    // la luz de abajo se va cuando Memo se aleja
    const vaSe = clamp((t - CELULAR - 0.8) / 1.0);
    $('#ce-raya').setAttribute('opacity', 0.7 * (1 - vaSe));
    $('#ce-pies').innerHTML = vaSe < 1 ? [0, 1].map(k => `<rect x="${700 + k * 110 + vaSe * 200}" y="${PISO - 14}" width="60" height="16" fill="#0c0e13" opacity="${1 - vaSe}"/>`).join('') : '';
    const entra = ease.outCubic(clamp((t - CELULAR) / 0.6));
    const cx = lerp(820, 690, entra);
    $('#ce-cosas').innerHTML = vela(150, 1150, t, 0.9) + `<g filter="url(#ink)" transform="translate(${360 + Math.sin(t * 50) * 2} ${PISO - 190}) scale(1.6)">${perro('gruñe')}</g>` +
      (t > CELULAR ? `<g transform="translate(${cx} ${PISO - 22})"><circle r="${90 + 10 * Math.sin(t * 4)}" fill="#9fd0ff" opacity=".25" filter="url(#blur10)"/>
        <rect x="-70" y="-14" width="140" height="28" rx="8" fill="#1b1e24" stroke="${INK}" stroke-width="5"/><rect x="-58" y="-9" width="116" height="18" rx="4" fill="#9fd0ff"/></g>` : '');
  },
};

// ---------- 3. Arriba, Memo corre a la azotea y los de la escalera se van detrás de él ----------
const ALTO = 300, BASE = 1480;
const xEsc = u => { const f = u - Math.floor(u); return f < 0.5 ? 640 + 300 * (f / 0.5) : 940 - 300 * ((f - 0.5) / 0.5); };
const yEsc = u => BASE - ALTO * u;
const AR_INF = (() => { const r = rng(12), g = []; for (let i = 0; i < 10; i++) g.push({ u: 1.6 + r() * 1.5, ph: r() * 6 }); return g; })();
function corteEscalera() {
  return `<rect width="1080" height="1920" fill="#0b0f17"/>
    <g filter="url(#ink)">
      <rect x="80" y="${BASE - ALTO * 5}" width="920" height="${ALTO * 5}" fill="#141a25" stroke="${INK}" stroke-width="10"/>
      ${[0, 1, 2, 3, 4].map(k => { const y = BASE - ALTO * k;
        return `<rect x="80" y="${y - 14}" width="920" height="14" fill="#2c313c"/>
        <polyline points="640,${y} 940,${y - ALTO / 2} 640,${y - ALTO}" fill="none" stroke="#3a3f4a" stroke-width="12"/>
        <rect x="470" y="${y - 190}" width="110" height="176" fill="${k === 3 ? '#5a4030' : '#2a2018'}" stroke="${INK}" stroke-width="6"/>
        <text x="525" y="${y - 200}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="34" fill="#9aa0a8">${k ? (k + 1) + '02' : 'PB'}</text>`; }).join('')}
      <rect x="560" y="${BASE - ALTO * 5 - 160}" width="240" height="160" fill="#20242d" stroke="${INK}" stroke-width="8"/>
      <text x="680" y="${BASE - ALTO * 5 - 60}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" fill="#9aa0a8">AZOTEA</text>
      <rect x="80" y="${BASE}" width="920" height="480" fill="#1a1f2a"/>
    </g>`;
}
ESCENAS.arriba = {
  html: lienzo(`${corteEscalera()}<g id="ar-memo"></g><g id="ar-inf" filter="url(#ink)"></g>${viñeta}`),
  camara: { claves: [[INI.arriba, 1.15, 0, 160], [M.todos, 1.05, 0, 60], [FIN('arriba'), 1.0, 0, 0]] },
  update(lt, dur, t) {
    const um = lerp(3.0, 5.05, ease.inOut(clamp((t - INI.arriba) / 3.2)));
    const f = um - Math.floor(um), dir = f < 0.5 ? 1 : -1;
    $('#ar-memo').innerHTML = um < 5 ? `<g transform="translate(${xEsc(um)} ${yEsc(um)}) scale(${dir} 1) translate(${-xEsc(um)} ${-yEsc(um)})">${memoDe(xEsc(um), yEsc(um), 26, { look: 6, armL: [[xEsc(um) + 20, yEsc(um) - 80], [xEsc(um) + 30, yEsc(um) - 60]], gris: 0.3 })}<circle cx="${xEsc(um) + 30}" cy="${yEsc(um) - 60}" r="36" fill="#fff6c8" opacity=".6" filter="url(#blur10)"/><circle cx="${xEsc(um) + 30}" cy="${yEsc(um) - 60}" r="9" fill="#fff6c8"/></g>` : '';
    const sigue = clamp((t - M.todos + 0.3) / 0.4);
    $('#ar-inf').innerHTML = AR_INF.map(p => {
      const u = p.u + sigue * (t - M.todos + 0.3) * 0.55, ff = u - Math.floor(u), d = ff < 0.5 ? 1 : -1;
      return u < 5 ? `<g transform="translate(${xEsc(u)} ${yEsc(u)}) scale(${d * 110} 110)">${sigue > 0 ? infectadoLado(t * 6 + p.ph) : infectadoQuieto(0, 0, -0.02)}</g>` : '';
    }).join('');
  },
};

// ---------- 4 y 5. Los mensajes en el celular de Memo ----------
ESCENAS.mensaje = {
  html: celularMemo('me', false),
  camara: { claves: [[INI.mensaje, 1.0, 0, 0], [FIN('mensaje'), 1.05, 25, 30]] },
  update(lt, dur, t) { aparece($('#me-m0'), t, M.primera - 0.1); },
};
ESCENAS.otro = {
  html: celularMemo('ot', true),
  camara: { claves: [[INI.otro, 1.05, 25, 30], [M.traela, 1.08, 40, -60], [FIN('otro'), 1.1, 45, -70]] },
  update(lt, dur, t) { aparece($('#ot-p1'), t, M.ayer - 0.2); aparece($('#ot-m1'), t, M.operadora - 0.1); },
};

// ---------- 6. Rosa aprieta el celular. Memo nos vendió. Y ahora quiere a mi niña ----------
ESCENAS.vendio = {
  html: lienzo(`<rect width="1080" height="1920" fill="#14111a"/>
    <circle cx="540" cy="1250" r="700" fill="#9fd0ff" opacity=".12"/>
    <g id="ve-rosa"></g>${viñeta}`),
  camara: { claves: [[INI.vendio, 1.0, 0, 0], [M.nina, 1.1, 0, 40], [FIN('vendio'), 1.18, 0, 70]] },
  update(lt, dur, t) {
    const tiembla = Math.sin(t * 45) * 3, llora = clamp((t - M.nina - 0.3) / 0.6);
    $('#ve-rosa').innerHTML = `<g transform="translate(${tiembla} 0)" filter="url(#contorno)">${rosaDe(540, 700, 230, { look: 0, lookY: 18, eyeScale: lerp(1, 1.15, llora),
      armL: [[330, 1300], [470, 1260]], armR: [[750, 1300], [610, 1260]] })}</g>
      <g transform="translate(540 1250)"><circle r="120" fill="#9fd0ff" opacity=".3" filter="url(#blur10)"/>
        <rect x="-70" y="-110" width="140" height="220" rx="18" fill="#1b1e24" stroke="${INK}" stroke-width="8"/><rect x="-56" y="-92" width="112" height="170" rx="6" fill="#9fd0ff"/></g>
      <path d="M${540 - 100 + tiembla} 612 L${540 - 20 + tiembla} 642 M${540 + 100 + tiembla} 612 L${540 + 20 + tiembla} 642" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>
      ${llora > 0 ? `<g opacity="${llora}"><path d="M${452 + tiembla} 745 L${448 + tiembla} ${745 + 110 * llora}" stroke="#bfe0ff" stroke-width="7" stroke-linecap="round"/>
        <path d="M${448 + tiembla} ${760 + 110 * llora} q-16 22 0 34 q16 -12 0 -34z" fill="#bfe0ff" stroke="${INK}" stroke-width="4"/></g>` : ''}`;
  },
};

// ---------- 7. Amanece: el plato de Chispa vacío; las croquetas arriba, con ellos ----------
ESCENAS.amanece = {
  html: lienzo(`<rect width="1080" height="1920" fill="#0b0f17"/>
    <g filter="url(#ink)">
      <rect x="40" y="200" width="1000" height="700" fill="url(#paredNoche)" stroke="${INK}" stroke-width="10"/>
      <rect x="760" y="300" width="200" height="260" fill="url(#ventanaDia)" stroke="${INK}" stroke-width="8"/>
      <text x="100" y="270" font-family="Oswald" font-weight="700" font-size="50" fill="#c9ccd2" opacity=".6">502</text>
      <rect x="40" y="900" width="1000" height="40" fill="#3a3e46" stroke="${INK}" stroke-width="8"/>
      <rect x="40" y="940" width="1000" height="600" fill="url(#paredDia)" stroke="${INK}" stroke-width="10"/>
      <rect x="760" y="1010" width="200" height="260" fill="url(#ventanaDia)" stroke="${INK}" stroke-width="8"/>
      <text x="100" y="1010" font-family="Oswald" font-weight="700" font-size="50" fill="#4a4f5a" opacity=".6">402</text>
      <rect x="40" y="1540" width="1000" height="400" fill="#1a1f2a"/>
    </g>
    <g id="am-cosas"></g>${viñeta}`),
  camara: { claves: [foco(INI.amanece, 1.45, 480, 1330), foco(M.croquetas - 0.3, 1.45, 480, 1330), foco(M.croquetas + 0.5, 1.4, 480, 640), foco(FIN('amanece'), 1.45, 480, 620)] },
  update(lt, dur, t) {
    const mira = clamp((t - M.croquetas + 0.6) / 0.4);
    // abajo, el 402: Chispa y su plato vacío
    const abajo = `<g filter="url(#ink)"><ellipse cx="520" cy="1525" rx="90" ry="22" fill="#9aa3ad" stroke="${INK}" stroke-width="6"/><ellipse cx="520" cy="1518" rx="64" ry="12" fill="#6b7280"/></g>
      <g filter="url(#ink)" transform="translate(330 ${1430 - mira * 6}) scale(0.95)">${perroSentada(false)}</g>`;
    // arriba, el 502: la bolsa de croquetas entre ellos
    const arriba = `<g filter="url(#ink)"><rect x="440" y="770" width="110" height="130" rx="12" fill="#c8282e" stroke="${INK}" stroke-width="6" transform="rotate(-8 495 835)"/>
      <text x="495" y="845" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="26" fill="#fff" transform="rotate(-8 495 835)">CROQUETAS</text></g>
      <g filter="url(#ink)">${[[220, 900, 300], [380, 900, 330], [650, 900, 320], [860, 900, 300]].map(([x, y, h], i) => `<g transform="translate(${x + Math.sin(t * 2 + i) * 4} ${y}) scale(${h})">${infectadoQuieto(0, 0.01 * (i % 2 ? 1 : -1), -0.02)}</g>`).join('')}</g>`;
    $('#am-cosas').innerHTML = abajo + arriba;
  },
};

// ---------- 8. El plan en la libreta de Rosa ----------
ESCENAS.plan = {
  html: `<div class="cuaderno"></div>${lienzo(`<g id="pl-mapa" stroke="${TINTA}" fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" style="filter:url(#ink)">
      <rect x="150" y="1080" width="260" height="380"/><text x="280" y="1290" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="64" fill="${TINTA}" stroke="none">Edif. C</text>
      <rect x="150" y="760" width="420" height="300" stroke-dasharray="20 14"/><text x="360" y="830" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="60" fill="${TINTA}" stroke="none">patio</text>
      <path id="pl-x" d="M380 900 l60 60 M440 900 l-60 60" stroke="${ROJO}" stroke-width="12"/>
      <text x="460" y="990" font-family="Caveat" font-weight="700" font-size="54" fill="${ROJO}" stroke="none">llave</text>
      <path d="M620 300 L620 1500 M840 300 L840 1500"/><path d="M730 320 L730 1480" stroke-dasharray="40 40"/>
      <text x="730" y="290" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="56" fill="${TINTA}" stroke="none">avenida</text>
      <rect x="890" y="520" width="150" height="220"/><text x="965" y="610" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="44" fill="${TINTA}" stroke="none">don</text><text x="965" y="660" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="44" fill="${TINTA}" stroke="none">Chucho</text>
      <path id="pl-ruta" d="M280 1080 Q300 960 410 930 Q560 900 640 760 Q700 660 890 630" stroke="${ROJO}" stroke-width="10" stroke-dasharray="1" stroke-dashoffset="1" pathLength="1"/>
    </g>`)}`,
  camara: { claves: [[INI.plan, 1.0, 0, 0], [FIN('plan'), 1.08, 0, 30]] },
  update(lt, dur, t) {
    const p = clamp((t - M.patio + 0.4) / 1.2);
    $('#pl-ruta').setAttribute('stroke-dasharray', `${p} 1`);
    $('#pl-ruta').setAttribute('stroke-dashoffset', 0);
    $('#pl-x').setAttribute('opacity', t > M.llaveM - 0.1 ? (Math.sin(t * 10) > -0.3 ? 1 : 0.4) : 0.15);
  },
};

// ---------- 9. Rosa le pide a Evelin una alerta. Noventa segundos ----------
ESCENAS.pide = {
  html: lienzo(`<rect width="1080" height="1920" fill="#2a2026"/>
    <circle cx="540" cy="1000" r="800" fill="url(#luzCalida)" opacity=".4"/>
    <g filter="url(#ink)"><rect x="-20" y="1250" width="1120" height="700" fill="#4a3428" stroke="${INK}" stroke-width="9"/></g>
    <g id="pi-cosas"></g>${viñeta}`),
  fijo: `<div class="reloj-grande" id="pi-reloj" style="top:120px;opacity:0">1:30</div>`,
  camara: { claves: [[INI.pide, 1.0, 0, 0], [FIN('pide'), 1.1, 0, 60]] },
  update(lt, dur, t) {
    const toca = Math.sin(t * 22) > 0.3 && t < M.noventa;
    $('#pi-cosas').innerHTML = radioViejo(440, 1060, t, 1, 1.1) +
      `<g filter="url(#ink)"><rect x="740" y="1210" width="200" height="40" rx="8" fill="#3a3e46" stroke="${INK}" stroke-width="6"/>
        <rect x="780" y="${toca ? 1186 : 1176}" width="120" height="26" rx="6" fill="#9aa3ad" stroke="${INK}" stroke-width="5"/></g>
      <g filter="url(#contorno)">${rosaDe(930, 700, 95, { look: -20, lookY: 16, armL: [[860, 1000], [840, toca ? 1180 : 1162]] })}</g>`;
    const r = $('#pi-reloj'); r.style.opacity = clamp((t - M.noventa + 0.1) / 0.2);
  },
};

// ---------- 10. Suena. Corres. La llave ----------
const PATIO_Y = 1380;
const PA_INF = (() => { const r = rng(4), g = []; for (let i = 0; i < 14; i++) g.push({ x0: 200 + r() * 600, xp: 930 + (r() - 0.5) * 140, y: PATIO_Y + 30 - r() * 120, h: 240 + r() * 60, ph: r() * 6, v: 0.6 + r() * 0.5 }); return g.sort((a, b) => a.y - b.y); })();
ESCENAS.corre = {
  html: lienzo(`<rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)">
      <rect x="-20" y="560" width="300" height="840" fill="#2f323c" stroke="${INK}" stroke-width="10"/>
      ${[0, 1, 2, 3].map(f => `<rect x="40" y="${620 + f * 180}" width="170" height="120" fill="#121722" stroke="${INK}" stroke-width="6"/>`).join('')}
      <rect x="-20" y="${PATIO_Y}" width="1120" height="600" fill="#5a5f69" stroke="${INK}" stroke-width="8"/>
    </g>
    ${poste(960, 620, 1.0, 760)}
    <g id="co-cosas"></g>
    <rect id="co-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${viñeta}`),
  fijo: `<div class="reloj-mini" id="co-reloj">1:30</div>`,
  camara: { claves: [[INI.corre, 1.0, 0, 0], foco(M.llave - 0.2, 1.0, 540, 960), foco(LLAVE, 1.5, 560, PATIO_Y - 120), foco(FIN('corre'), 1.5, 600, PATIO_Y - 140)] },
  update(lt, dur, t) {
    $('#co-rojo').setAttribute('opacity', t > ALERTA ? 0.08 + 0.12 * pulsoRojo(t) : 0);
    document.querySelectorAll('#esc-corre .onda').forEach(o => o.setAttribute('opacity', t > ALERTA ? (Math.sin(t * 8 - o.dataset.k) > 0 ? 1 : 0.2) : 0));
    const r = $('#co-reloj'); r.style.opacity = 1; r.textContent = mmss(reloj(t));
    const va = clamp((t - ALERTA) * 0.9);
    const inf = PA_INF.map(p => { const x = lerp(p.x0, p.xp, ease.inOut(clamp(va * p.v))); const corre = va * p.v < 1;
      return `<g transform="translate(${x} ${p.y + 120}) scale(${p.h})">${corre ? infectadoLado(t * 9 + p.ph) : infectadoQuieto(1, 0, -0.03)}</g>`; }).join('');
    const tx = lerp(180, 560, clamp((t - M.corres + 0.2) / (LLAVE - M.corres + 0.2)));
    const agarra = t > LLAVE;
    $('#co-cosas').innerHTML = chancla(620, PATIO_Y + 20) + (agarra ? '' : llavero(540, PATIO_Y - 10, 1.1)) +
      `<g filter="url(#ink)">${inf}</g>` + chispaCorre(lerp(-80, 120, clamp((t - LLAVE) / 1.5)), PATIO_Y - 80, 0.5, t) +
      (t < LLAVE ? tuCorre(tx, PATIO_Y + 10, 62, t * 14) : tuCorre(560 + (t - LLAVE) * 300, PATIO_Y + 10, 62, t * 14) + llavero(560 + (t - LLAVE) * 300 + 60, PATIO_Y - 180, 0.6));
  },
};

// ---------- 11. La avenida ----------
ESCENAS.avenida = {
  html: lienzo(`<rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)">
      <rect x="-20" y="1180" width="1120" height="800" fill="#3d4048" stroke="${INK}" stroke-width="8"/>
      ${[0, 1, 2, 3, 4].map(i => `<rect x="${i * 260 - 40}" y="1390" width="150" height="22" fill="#e9e2d6"/>`).join('')}
      <rect x="-20" y="1160" width="1120" height="30" fill="#6b7280" stroke="${INK}" stroke-width="6"/>
      <rect x="40" y="560" width="380" height="600" fill="#2f323c" stroke="${INK}" stroke-width="8"/>
      ${[0, 1, 2].map(f => `<rect x="80" y="${610 + f * 170}" width="120" height="110" fill="#121722" stroke="${INK}" stroke-width="6"/><rect x="250" y="${610 + f * 170}" width="120" height="110" fill="#121722" stroke="${INK}" stroke-width="6"/>`).join('')}
    </g>
    <g id="av-cosas"></g>
    <rect id="av-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${viñeta}`),
  fijo: `<div class="reloj-mini" id="av-reloj" style="opacity:1">1:30</div>`,
  camara: { de: { s: 1.15, x: 60, y: -60 }, a: { s: 1.2, x: -60, y: -60 } },
  update(lt, dur, t) {
    $('#av-rojo').setAttribute('opacity', 0.08 + 0.12 * pulsoRojo(t));
    $('#av-reloj').textContent = mmss(reloj(t));
    const p = clamp((t - INI.avenida) / (FIN('avenida') - INI.avenida));
    $('#av-cosas').innerHTML = tuCorre(lerp(80, 980, p), 1470, 70, t * 15) + llavero(lerp(80, 980, p) + 70, 1270, 0.6) + chispaCorre(lerp(-160, 300, p), 1440, 0.55, t);
  },
};

// ---------- 12. La cortina ----------
ESCENAS.cortina = {
  html: lienzo(`<rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)">
      <rect x="80" y="420" width="920" height="1060" fill="#8a7a62" stroke="${INK}" stroke-width="10"/>
      <rect x="120" y="460" width="840" height="150" fill="#e9e2d6" stroke="${INK}" stroke-width="7"/>
      <text x="540" y="560" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="76" fill="${ROJO}">ABARROTES DON CHUCHO</text>
      <rect x="160" y="660" width="760" height="820" fill="#1b1814" stroke="${INK}" stroke-width="8"/>
      ${[0, 1, 2].map(k => `<rect x="190" y="${760 + k * 230}" width="700" height="18" fill="#4a3428"/>
        ${[...Array(8)].map((_, i) => `<rect x="${210 + i * 84}" y="${690 + k * 230}" width="60" height="70" rx="6" fill="${['#c8282e', '#e5a83b', '#3a7d44', '#9aa3ad'][(i + k) % 4]}" stroke="${INK}" stroke-width="4"/>`).join('')}`).join('')}
      <rect x="-20" y="1480" width="1120" height="500" fill="#3d4048" stroke="${INK}" stroke-width="8"/>
    </g>
    <g id="cr-cortina" filter="url(#ink)"></g><g id="cr-tu"></g>
    <rect id="cr-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${viñeta}`),
  fijo: `<div class="reloj-mini" id="cr-reloj" style="opacity:1">1:30</div>
    <div class="onomato" id="cr-trrr" style="top:520px;left:240px;font-size:130px;opacity:0">¡TRRRAC!</div>`,
  camara: { claves: [[INI.cortina, 1.1, 0, 0], [FIN('cortina'), 1.2, 0, -60]] },
  update(lt, dur, t) {
    $('#cr-rojo').setAttribute('opacity', 0.08 + 0.12 * pulsoRojo(t));
    $('#cr-reloj').textContent = mmss(reloj(t));
    const sube = ease.outCubic(clamp((t - CORTINA) / 0.5));
    const alto = lerp(820, 60, sube);
    let lam = '';
    for (let y = 660; y < 660 + alto; y += 34) lam += `<line x1="160" y1="${y}" x2="920" y2="${y}" stroke="#6b7280" stroke-width="6"/>`;
    $('#cr-cortina').innerHTML = `<rect x="160" y="660" width="760" height="${alto}" fill="#9aa3ad" stroke="${INK}" stroke-width="7"/>${lam}`;
    const tr = $('#cr-trrr'); tr.style.opacity = t > CORTINA && t < CORTINA + 0.6 ? 1 : 0;
    tr.style.transform = `rotate(-6deg) scale(${lerp(1.3, 1, clamp((t - CORTINA) / 0.12))})`;
    $('#cr-tu').innerHTML = tuDe(540, 1560, 80, { look: 0, lookY: -14, armL: [[470, 1200], [440, lerp(1300, 1080, sube)]], armR: [[610, 1200], [640, lerp(1300, 1080, sube)]] });
  },
};

// ---------- 13. Sesenta segundos. Y la alerta se calla. Alguien más la apagó ----------
ESCENAS.calla = {
  html: lienzo(`<rect width="1080" height="1920" fill="#1b1814"/>
    <g filter="url(#ink)">
      ${[0, 1].map(k => `<rect x="60" y="${560 + k * 280}" width="960" height="18" fill="#4a3428"/>
        ${[...Array(10)].map((_, i) => `<rect x="${80 + i * 94}" y="${490 + k * 280}" width="70" height="70" rx="6" fill="${['#c8282e', '#e5a83b', '#3a7d44', '#9aa3ad'][(i + k) % 4]}" stroke="${INK}" stroke-width="4"/>`).join('')}`).join('')}
      <rect x="300" y="1000" width="480" height="560" fill="url(#cielo)" stroke="${INK}" stroke-width="10"/>
      <rect x="-20" y="1560" width="1120" height="400" fill="#2a2520"/>
    </g>
    <g id="ca-fuera"></g><g id="ca-tu"></g>
    <rect id="ca-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${viñeta}`),
  fijo: `<div class="reloj-grande" id="ca-reloj" style="top:110px">0:32</div>`,
  camara: { claves: [[INI.calla, 1.0, 0, 0], [CORTE, 1.05, 0, 0], [CORTE + 0.2, 1.15, 0, -60], [FIN('calla'), 1.2, 0, -80]] },
  update(lt, dur, t) {
    const suena = t < CORTE;
    $('#ca-rojo').setAttribute('opacity', suena ? 0.08 + 0.12 * pulsoRojo(t) : 0);
    const r = $('#ca-reloj'); r.textContent = mmss(reloj(t));
    r.style.color = suena ? '#e0312b' : '#fff';
    r.style.opacity = suena || Math.sin(t * 8) > 0 ? 1 : 0.35;
    // por la puerta se ve el poste: con la alerta, ondas; luego se apaga
    $('#ca-fuera').innerHTML = `<svg x="300" y="1000" width="480" height="560" viewBox="300 1000 480 560">${poste(560, 1110, 0.55, 500)}
      ${suena ? [0, 1, 2].map(k => `<path d="M${640 + k * 22} ${1090 - k * 10} q${16 + k * 6} ${40 + k * 10} 0 ${80 + k * 20}" fill="none" stroke="${ROJO}" stroke-width="5" opacity="${Math.sin(t * 8 - k) > 0 ? 1 : 0.2}"/>`).join('') : ''}</svg>`;
    document.querySelectorAll('#ca-fuera .onda').forEach(o => o.setAttribute('opacity', suena ? (Math.sin(t * 8 - o.dataset.k) > 0 ? 1 : 0.2) : 0));
    document.querySelectorAll('#ca-fuera .foco').forEach(f => f.style.opacity = suena ? 1 : 0.15);
    $('#ca-tu').innerHTML = tuDe(220, 1640, 78, { look: t > CORTE ? 14 : -6, eyeScale: t > CORTE ? 1.4 : 1, armL: [[150, 1340], [175, 1400]], armR: [[300, 1340], [290, 1400]] }) +
      `<g filter="url(#ink)"><rect x="150" y="1340" width="160" height="120" rx="12" fill="#c8282e" stroke="${INK}" stroke-width="6"/><text x="230" y="1410" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="26" fill="#fff">CROQUETAS</text></g>`;
  },
};

// ---------- 14. Volteas. Chispa te siguió. Del otro lado de la avenida, entre ellos ----------
const CH_INF = (() => { const r = rng(61), g = []; for (let i = 0; i < 18; i++) g.push({ x: 60 + r() * 960, y: 1180 + r() * 260, h: 230 + r() * 70, l: (r() - 0.5) * 0.04 }); return g.sort((a, b) => a.y - b.y); })();
ESCENAS.chispa = {
  html: lienzo(`<rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)">
      <rect x="-20" y="560" width="420" height="700" fill="#2f323c" stroke="${INK}" stroke-width="10"/>
      ${[0, 1, 2].map(f => `<rect x="40" y="${620 + f * 190}" width="140" height="120" fill="#121722" stroke="${INK}" stroke-width="6"/><rect x="220" y="${620 + f * 190}" width="140" height="120" fill="#121722" stroke="${INK}" stroke-width="6"/>`).join('')}
      <rect x="-20" y="1250" width="1120" height="720" fill="#3d4048" stroke="${INK}" stroke-width="8"/>
      ${[0, 1, 2, 3, 4].map(i => `<rect x="${i * 260 - 40}" y="1460" width="150" height="20" fill="#e9e2d6"/>`).join('')}
    </g>
    ${poste(820, 700, 0.8, 600)}
    <g id="ch-cosas"></g>${viñeta}`),
  camara: { claves: [foco(INI.chispa, 1.0, 540, 960), foco(M.siguio - 0.2, 1.0, 540, 960), foco(M.otrolado, 1.6, 560, 1300), foco(M.entre, 2.0, 560, 1300), foco(FIN('chispa'), 2.1, 560, 1290)] },
  update(lt, dur, t) {
    const tiembla = Math.sin(t * 50) * 3;
    document.querySelectorAll('#esc-chispa .onda').forEach(o => o.setAttribute('opacity', 0));
    document.querySelectorAll('#esc-chispa .foco').forEach(f => f.style.opacity = 0.15);
    $('#ch-cosas').innerHTML = `<g filter="url(#ink)">${CH_INF.map((p, i) => `<g transform="translate(${p.x + Math.sin(t * 1.5 + i) * 3} ${p.y + 120}) scale(${p.h})">${infectadoQuieto(0, p.l, -0.03)}</g>`).join('')}</g>` +
      `<g filter="url(#ink)" transform="translate(${560 + tiembla} 1350) scale(0.75)">${perro('parada')}</g>` +
      '' + (t > M.entre ? `<circle cx="560" cy="1310" r="${150 + 20 * Math.sin(t * 6)}" fill="none" stroke="${ROJO}" stroke-width="8" opacity=".8"/>` : '');
  },
};

// ---------- 15. ¿Cruzas por ella ahora, o esperas otra alerta? ----------
ESCENAS.decide = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="960" r="900" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="de-tit">¿QUÉ HACES?</div>
    <div class="opcion" id="de-a" style="top:560px;font-size:70px"><span class="emo">🏃</span><span class="txt">CRUZAS POR ELLA</span></div>
    <div class="opcion" id="de-b" style="top:900px;font-size:70px"><span class="emo">⏳</span><span class="txt">ESPERAS OTRA ALERTA</span></div>
    <div class="decide-com" id="de-com">COMENTA <span class="emo">🏃</span> O <span class="emo">⏳</span></div>
    <div class="decide-pie" id="de-pie">GANA LO QUE MÁS COMENTEN</div>`,
  update(lt, dur, t) {
    pop($('#de-tit'), t, INI.decide);
    pop($('#de-a'), t, M.cruzas - 0.1);
    pop($('#de-b'), t, M.esperas - 0.1);
    pop($('#de-com'), t, M.comenta - 0.1);
    $('#de-pie').style.opacity = clamp((t - M.comenta - 0.6) / 0.3);
    const a = t >= M.cruzas - 0.1 && t < M.esperas - 0.1, b = t >= M.esperas - 0.1 && t < M.comenta - 0.1;
    $('#de-a').style.borderColor = a ? '#e5a83b' : '#fff';
    $('#de-b').style.borderColor = b ? '#9fd0ff' : '#fff';
    if (a) $('#de-a').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
    if (b) $('#de-b').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
  },
};
