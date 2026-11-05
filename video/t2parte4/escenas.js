// Escenas de "La alerta", temporada 2, parte 4: Los escombros. Ganó ⏳ en los comentarios de la parte 3:
// esperas otra alerta. Evelin la manda, pero dura 20 segundos; Chispa aúlla y corre hacia ti. Recuerdo de cómo la
// encontraste entre los escombros. No puedes volver a la unidad. Decisión: 🚇 bajas por el metro o 🏚️ por los escombros.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const ALERTA = M.vuelve - 0.1;             // la segunda alerta empieza a sonar
const CORTE = M.calla + 0.25;              // se calla (dura "veinte segundos")
const SILBIDO = M.silbas + 0.05;           // silbas desde la tienda
const SALTA = M.salta + 0.25;              // Chispa salta el mostrador
// Reloj de la alerta: aparece en 0:20 con "veinte segundos" y llega a 0:00 cuando se calla.
const relojAlerta = t => t < M.veinte ? 20 : t < M.cinco ? 20 - 15 * (t - M.veinte) / (M.cinco - M.veinte)
  : t < M.cuatro ? 5 - (t - M.cinco) / (M.cuatro - M.cinco) : Math.max(0, 4 - 4 * (t - M.cuatro) / (CORTE - M.cuatro));
const mmss = s => `0:${String(Math.ceil(s - 1e-6)).padStart(2, '0')}`;
const sonando = t => t > ALERTA && t < CORTE;

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

// Chispa sentada aullando chiquita (para escenas de lejos).
const chispaAulla = (x, y, s, t, au = 1) => `<g filter="url(#ink)" transform="translate(${x + Math.sin(t * 40) * 2} ${y}) scale(${s})">${perroSentada(au)}</g>`;
// La avenida vista de lado: la unidad a la izquierda, el poste en la esquina, la tienda a la derecha.
function avenidaLado(pre, conTienda = true) {
  return `<rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)">
      <rect x="-20" y="560" width="300" height="700" fill="#2f323c" stroke="${INK}" stroke-width="10"/>
      ${[0, 1, 2].map(f => `<rect x="30" y="${620 + f * 190}" width="90" height="120" fill="#121722" stroke="${INK}" stroke-width="6"/><rect x="160" y="${620 + f * 190}" width="90" height="120" fill="#121722" stroke="${INK}" stroke-width="6"/>`).join('')}
      <text x="130" y="540" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="44" fill="#c9ccd2" opacity=".6">TU CASA</text>
      ${conTienda ? `<rect x="800" y="760" width="300" height="500" fill="#8a7a62" stroke="${INK}" stroke-width="10"/>
        <rect x="830" y="790" width="250" height="90" fill="#e9e2d6" stroke="${INK}" stroke-width="6"/>
        <text x="955" y="850" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" fill="${ROJO}">DON CHUCHO</text>
        <rect x="850" y="920" width="200" height="340" fill="#1b1814" stroke="${INK}" stroke-width="7"/>` : ''}
      <rect x="-20" y="1250" width="1120" height="720" fill="#3d4048" stroke="${INK}" stroke-width="8"/>
      ${[0, 1, 2, 3, 4].map(i => `<rect x="${i * 260 - 40}" y="1460" width="150" height="20" fill="#e9e2d6"/>`).join('')}
    </g>
    ${poste(360, 700, 0.85, 560)}`;
}
const ondasPoste = (sel, t) => {
  const on = sonando(t);
  document.querySelectorAll(`${sel} .onda`).forEach(o => o.setAttribute('opacity', on ? (Math.sin(t * 8 - o.dataset.k) > 0 ? 1 : 0.2) : 0));
  document.querySelectorAll(`${sel} .foco`).forEach(f => f.style.opacity = on ? 0.4 + 0.6 * pulsoRojo(t) : 0.15);
};
// La tienda por dentro, vista desde atrás del mostrador hacia la cortina abierta.
function tiendaDentro(pre) {
  return `<rect width="1080" height="1920" fill="#1b1814"/>
    <svg x="300" y="560" width="480" height="700" viewBox="300 560 480 700"><g id="${pre}-fuera"></g></svg>
    <g filter="url(#ink)">
      <rect x="300" y="560" width="480" height="700" fill="none" stroke="${INK}" stroke-width="12"/>
      <rect x="300" y="560" width="480" height="40" fill="#9aa3ad" stroke="${INK}" stroke-width="6"/>
      ${[0, 1, 2].map(k => [0, 1].map(l => `<rect x="${l ? 820 : 20}" y="${640 + k * 220}" width="240" height="16" fill="#4a3428"/>
        ${[0, 1, 2].map(i => `<rect x="${(l ? 830 : 30) + i * 76}" y="${580 + k * 220}" width="56" height="60" rx="6" fill="${['#c8282e', '#e5a83b', '#3a7d44', '#9aa3ad'][(i + k + l) % 4]}" stroke="${INK}" stroke-width="4"/>`).join('')}`).join('')).join('')}
      <rect x="-20" y="1260" width="1120" height="700" fill="#2a2520"/>
    </g>
    <g id="${pre}-tu"></g>
    <g filter="url(#ink)"><rect x="-20" y="1180" width="1120" height="70" fill="#8a6a4a" stroke="${INK}" stroke-width="9"/><rect x="-20" y="1250" width="1120" height="330" fill="#6b4a2f" stroke="${INK}" stroke-width="9"/></g>
    <rect id="${pre}-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>`;
}
// Lo que se ve por la cortina: la avenida con ellos y Chispa en medio.
const AF_INF = (() => { const r = rng(71), g = []; for (let i = 0; i < 12; i++) g.push({ x: 300 + r() * 480, y: 1120 + r() * 120, h: 150 + r() * 40, l: (r() - 0.5) * 0.04 }); return g.sort((a, b) => a.y - b.y); })();
const vistaAfuera = (t, chispaX = 540, chispaY = 1180) => `<rect x="300" y="560" width="480" height="700" fill="url(#cielo)"/>
  <rect x="300" y="1060" width="480" height="200" fill="#3d4048"/>
  <g filter="url(#ink)">${AF_INF.map((p, i) => `<g transform="translate(${p.x + Math.sin(t * 1.5 + i) * 2} ${p.y + 80}) scale(${p.h})">${infectadoQuieto(0, p.l, -0.03)}</g>`).join('')}</g>
  <g filter="url(#ink)" transform="translate(${chispaX + Math.sin(t * 50) * 2} ${chispaY}) scale(0.38)">${perro('parada')}</g>`;
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
const SEPIA = 'sepia(.75) saturate(1.1) contrast(.95)';

// ---------- 1. Ganó esperar ----------
ESCENAS.gano = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="1040" r="800" fill="url(#luzCalida)" opacity=".1"/>`)}
    <div class="decide-tit" id="ga-tit">GANÓ</div>
    <div class="opcion" id="ga-a" style="top:560px;font-size:70px"><span class="emo">🏃</span><span class="txt" style="text-decoration:line-through;text-decoration-color:#e0312b;text-decoration-thickness:10px">CRUZAS POR ELLA</span></div>
    <div class="opcion" id="ga-b" style="top:900px;font-size:70px;border-color:#9fd0ff;box-shadow:0 0 40px rgba(159,208,255,.5)"><span class="emo">⏳</span><span class="txt">ESPERAS OTRA ALERTA</span></div>
    <div class="decide-pie" id="ga-pie" style="top:1260px">LOS COMENTARIOS ELIGIERON</div>`,
  camara: { claves: [[0, 1.0, 0, 0], [M.escondes, 1.0, 0, 0], [FIN('gano'), 1.12, 0, -50]], origen: '540px 1030px' },
  update(lt, dur, t) {
    pop($('#ga-tit'), t, 0.02, 0.25);
    pop($('#ga-b'), t, 0.1, 0.3);
    $('#ga-b').style.transform += ` scale(${1 + 0.035 * Math.sin(t * 8)})`;
    $('#ga-a').style.opacity = 0.35;
    $('#ga-pie').style.opacity = clamp((t - M.escondes + 0.3) / 0.3);
  },
};

// ---------- 2. Detrás del mostrador. Chispa tiembla del otro lado. Nadie se mueve ----------
ESCENAS.mostrador = {
  html: lienzo(`${tiendaDentro('mo')}${viñeta}`),
  camara: { claves: [[INI.mostrador, 1.0, 0, 0], foco(M.nadie, 1.35, 540, 1050), foco(FIN('mostrador'), 1.45, 540, 1080)] },
  update(lt, dur, t) {
    $('#mo-fuera').innerHTML = vistaAfuera(t);
    $('#mo-tu').innerHTML = `<g filter="url(#contorno)">${stick({ head: [180, 1110], r: 80, neck: [180, 1190], hip: [190, 1400], look: 22, lookY: -4 })}</g>`;
  },
};

// ---------- 3. Diez minutos. Veinte ----------
ESCENAS.minutos = {
  html: lienzo(`<rect width="1080" height="1920" fill="#1b1814"/>
    <circle cx="540" cy="880" r="520" fill="url(#luzCalida)" opacity=".25"/>
    <g filter="url(#ink)"><circle cx="540" cy="880" r="330" fill="#efe6cf" stroke="${INK}" stroke-width="16"/>
      ${[...Array(12)].map((_, i) => { const a = i / 12 * Math.PI * 2; return `<line x1="${540 + Math.sin(a) * 280}" y1="${880 - Math.cos(a) * 280}" x2="${540 + Math.sin(a) * 310}" y2="${880 - Math.cos(a) * 310}" stroke="${INK}" stroke-width="${i % 3 ? 8 : 16}"/>`; }).join('')}</g>
    <g id="mi-manecillas" filter="url(#ink)"></g>`),
  fijo: `<div class="tinta" id="mi-10" style="top:1290px;left:0;width:1080px;text-align:center;font-size:150px;color:#e9e2d6;opacity:0">+10 min</div>
    <div class="tinta" id="mi-20" style="top:1290px;left:0;width:1080px;text-align:center;font-size:150px;color:#e9e2d6;opacity:0">+20 min</div>`,
  camara: { claves: [[INI.minutos, 1.0, 0, 0], [FIN('minutos'), 1.08, 0, 0]], origen: '540px 880px' },
  update(lt, dur, t) {
    // de las 7:05 a las 7:25, rápido
    const min = 5 + 20 * ease.inOut(clamp((t - INI.minutos - 0.1) / (M.veinteM + 0.3 - INI.minutos)));
    const am = min / 60 * Math.PI * 2, ah = (7 + min / 60) / 12 * Math.PI * 2;
    $('#mi-manecillas').innerHTML = `<line x1="540" y1="880" x2="${540 + Math.sin(ah) * 170}" y2="${880 - Math.cos(ah) * 170}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>
      <line x1="540" y1="880" x2="${540 + Math.sin(am) * 260}" y2="${880 - Math.cos(am) * 260}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><circle cx="540" cy="880" r="20" fill="${ROJO}" stroke="${INK}" stroke-width="5"/>`;
    $('#mi-10').style.opacity = t > M.diez && t < M.veinteM - 0.1 ? 1 : 0;
    $('#mi-20').style.opacity = t > M.veinteM - 0.1 ? 1 : 0;
  },
};

// ---------- 4. La alerta vuelve a sonar. Ellos corren al poste. Chispa no ----------
const SU_INF = (() => { const r = rng(5), g = []; for (let i = 0; i < 16; i++) g.push({ x0: 300 + r() * 700, y: 1240 + r() * 200, h: 230 + r() * 60, v: 0.6 + r() * 0.5, ph: r() * 6, xp: 330 + (r() - 0.5) * 160 }); return g.sort((a, b) => a.y - b.y); })();
ESCENAS.suena = {
  html: lienzo(`${avenidaLado('su')}<g id="su-cosas"></g><rect id="su-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${viñeta}`),
  camara: { claves: [[INI.suena, 1.0, 0, 0], foco(M.corren, 1.0, 540, 960), foco(M.chispano, 1.5, 640, 1240), foco(FIN('suena'), 1.55, 640, 1240)] },
  update(lt, dur, t) {
    ondasPoste('#esc-suena', t);
    $('#su-rojo').setAttribute('opacity', sonando(t) ? 0.08 + 0.12 * pulsoRojo(t) : 0);
    const va = clamp((t - ALERTA - 0.3) * 0.8);
    $('#su-cosas').innerHTML = `<g filter="url(#ink)">${SU_INF.map(p => { const k = clamp(va * p.v), x = lerp(p.x0, p.xp, ease.inOut(k));
      return `<g transform="translate(${x} ${p.y + 120}) scale(${-p.h} ${p.h})">${k < 1 && k > 0 ? infectadoLado(t * 9 + p.ph) : `<g transform="scale(-1 1)">${infectadoQuieto(k >= 1 ? 1 : 0, 0, -0.03)}</g>`}</g>`; }).join('')}</g>` +
      (t > M.chispano + 0.6 ? chispaAulla(640, 1300, 0.5, t, 1) : `<g filter="url(#ink)" transform="translate(${640 + Math.sin(t * 50) * 2} 1300) scale(0.5)">${perro('parada')}</g>`);
  },
};

// ---------- 5. Chispa aúlla. Siempre aúlla con la alerta. Así la encontraste ----------
ESCENAS.aulla = {
  html: lienzo(`<g id="au-todo"><rect width="1080" height="1920" fill="#2a2228"/>
    <g id="au-piernas" filter="url(#ink)"></g>
    <g id="au-cara" filter="url(#ink)"></g>
    <rect id="au-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${viñeta}</g>`),
  camara: { claves: [[INI.aulla, 1.0, 0, 0], [M.encontraste, 1.12, 0, -40], [FIN('aulla'), 1.25, 0, -60]] },
  update(lt, dur, t) {
    $('#au-rojo').setAttribute('opacity', 0.1 + 0.14 * pulsoRojo(t));
    const recuerda = clamp((t - M.encontraste - 0.2) / 1.2);
    $('#esc-aulla .cam').style.filter = recuerda > 0 ? `sepia(${0.75 * recuerda})` : '';
    // piernas de ellos que pasan corriendo detrás
    let p = '';
    for (let i = 0; i < 6; i++) { const x = ((t * 900 + i * 330) % 1500) - 200; p += `<g transform="translate(${1080 - x} 1900) scale(-900 900)">${infectadoLado(t * 10 + i)}</g>`; }
    $('#au-piernas').innerHTML = `<g opacity=".55">${p}</g>`;
    const au = 0.75 + 0.25 * Math.sin(t * 3);
    $('#au-cara').innerHTML = `<g transform="translate(540 1000) rotate(${-14 + Math.sin(t * 2) * 3}) scale(1.0)">${caraChispa({ aullido: au, parpadeo: true })}</g>`;
  },
};

// ---------- 6 y 7. Recuerdo: hace tres años, después del gran sismo, entre los escombros ----------
ESCENAS.recuerdo = {
  html: lienzo(`<rect width="1080" height="1920" fill="#d8c6a2"/>
    <rect width="1080" height="1100" fill="#c9b48c"/>
    ${poste(860, 520, 0.8, 600)}
    <g id="re-polvo"></g>
    ${escombros(470, 1380, 1.15)}
    <g filter="url(#ink)"><rect x="-20" y="1380" width="1120" height="600" fill="#a89878" stroke="${INK}" stroke-width="8"/></g>
    <g id="re-tu"></g>${viñeta}`),
  fijo: `<div class="recuerdo" style="top:150px">Hace tres años</div>`,
  camara: { claves: [[INI.recuerdo, 1.0, 0, 0], foco(M.escombros, 1.1, 520, 1000), foco(FIN('recuerdo'), 1.3, 470, 1080)] },
  update(lt, dur, t) {
    $('#esc-recuerdo .cam').style.filter = SEPIA;
    document.querySelectorAll('#esc-recuerdo .onda').forEach(o => o.setAttribute('opacity', Math.sin(t * 8 - o.dataset.k) > 0 ? 1 : 0.2));
    let polvo = '';
    for (let i = 0; i < 18; i++) { const f = (t * 0.15 + i / 18) % 1; polvo += `<circle cx="${100 + (i * 173) % 900 + Math.sin(t + i) * 20}" cy="${1300 - f * 900}" r="${8 + (i % 4) * 5}" fill="#efe6cf" opacity="${0.4 * (1 - f)}"/>`; }
    $('#re-polvo').innerHTML = polvo;
    const sube = clamp((t - INI.recuerdo) / 3.5);
    $('#re-tu').innerHTML = tuDe(lerp(120, 330, sube), lerp(1390, 1100, sube), 62, { look: 12, lookY: 8 });
  },
};
ESCENAS.losa = {
  html: lienzo(`<rect width="1080" height="1920" fill="#c9b48c"/>
    ${poste(880, 460, 0.7, 500)}
    <g filter="url(#ink)"><rect x="-20" y="1250" width="1120" height="700" fill="#7d776c" stroke="${INK}" stroke-width="9"/>
      <path d="M-20 1250 L200 1120 L420 1180 L600 1100 L820 1170 L1100 1120 L1100 1260 L-20 1260 Z" fill="#8b8477" stroke="${INK}" stroke-width="8"/></g>
    <g id="lo-hueco"></g><g id="lo-losa"></g><g id="lo-tu"></g>${viñeta}`),
  fijo: `<div class="recuerdo" style="top:150px">Hace tres años</div>`,
  camara: { claves: [[INI.losa, 1.0, 0, 0], [M.aullaba - 0.3, 1.05, 0, -20], foco(M.aullaba + 0.4, 1.45, 520, 1260), foco(FIN('losa'), 1.5, 520, 1270)] },
  update(lt, dur, t) {
    $('#esc-losa .cam').style.filter = SEPIA;
    document.querySelectorAll('#esc-losa .onda').forEach(o => o.setAttribute('opacity', Math.sin(t * 8 - o.dataset.k) > 0 ? 1 : 0.2));
    const alza = ease.outCubic(clamp((t - M.losa + 0.2) / 1.3));
    $('#lo-hueco').innerHTML = `<ellipse cx="520" cy="1300" rx="210" ry="80" fill="#2a2520"/>` +
      (alza > 0.3 ? `<g filter="url(#ink)" transform="translate(520 ${1300 - 10 * Math.abs(Math.sin(t * 6))}) scale(0.55)">${perroSentada(alza > 0.6 ? 0.9 + 0.1 * Math.sin(t * 5) : 0)}</g>` : '');
    const ang = lerp(0, -38, alza);
    $('#lo-losa').innerHTML = `<g filter="url(#ink)" transform="rotate(${ang} 300 1250)"><rect x="300" y="1150" width="480" height="90" fill="#9a9385" stroke="${INK}" stroke-width="9"/>
      <path d="M340 1170 l60 50 M500 1160 l40 70 M640 1175 l70 40" stroke="#6b6458" stroke-width="6"/></g>`;
    $('#lo-tu').innerHTML = tuDe(820, 1560, 75, { look: -16, lookY: 10, armL: [[700, 1220], [lerp(760, 690, alza), lerp(1240, 1060, alza)]], armR: [[760, 1250], [lerp(780, 720, alza), lerp(1250, 1090, alza)]] });
  },
};

// ---------- 8. Silbas. Chispa corre hacia ti, entre ellos. La alerta dura veinte segundos ----------
const SI_INF = (() => { const r = rng(33), g = []; for (let i = 0; i < 14; i++) g.push({ x0: 500 + r() * 300, y: 1240 + r() * 220, h: 220 + r() * 60, ph: r() * 6, v: 0.5 + r() * 0.5, xp: 330 + (r() - 0.5) * 220 }); return g.sort((a, b) => a.y - b.y); })();
ESCENAS.silbas = {
  html: lienzo(`${avenidaLado('si')}<g id="si-cosas"></g><rect id="si-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${viñeta}`),
  fijo: `<div class="onomato" id="si-fiu" style="top:640px;left:640px;font-size:120px;opacity:0">¡FIIIU!</div>
    <div class="reloj-grande" id="si-reloj" style="opacity:0">0:20</div>`,
  camara: { claves: [[INI.silbas, 1.1, -60, 0], [FIN('silbas'), 1.1, 0, -40]] },
  update(lt, dur, t) {
    ondasPoste('#esc-silbas', t);
    $('#si-rojo').setAttribute('opacity', 0.08 + 0.12 * pulsoRojo(t));
    const fiu = $('#si-fiu'); fiu.style.opacity = t > SILBIDO && t < SILBIDO + 0.8 ? 1 : 0;
    fiu.style.transform = `rotate(-6deg) scale(${lerp(1.3, 1, clamp((t - SILBIDO) / 0.12))})`;
    const r = $('#si-reloj'); r.style.opacity = t > M.veinte - 0.1 ? 1 : 0; r.textContent = mmss(relojAlerta(t));
    // ellos van al poste (izquierda); Chispa corre a la tienda (derecha)
    const inf = SI_INF.map(p => { const k = clamp((t - INI.silbas) * 0.35 * p.v), x = lerp(p.x0, p.xp, ease.inOut(k));
      return `<g transform="translate(${x} ${p.y + 120}) scale(${-p.h} ${p.h})">${k < 1 ? infectadoLado(t * 9 + p.ph) : `<g transform="scale(-1 1)">${infectadoQuieto(1, 0, -0.03)}</g>`}</g>`; }).join('');
    const cx = t < SILBIDO + 0.3 ? 560 : lerp(560, 900, clamp((t - SILBIDO - 0.3) / (FIN('silbas') - SILBIDO - 0.3)));
    $('#si-cosas').innerHTML = `<g filter="url(#ink)">${inf}</g>` + (t < SILBIDO + 0.3 ? chispaAulla(560, 1300, 0.5, t, 1) : chispaCorre(cx, 1330, 0.5, t)) +
      tuDe(950, 1260, 48, { look: -14, armL: [[910, 1080], [930, 1040]] });
  },
};

// ---------- 9. Cinco. Cuatro. Chispa salta el mostrador ----------
ESCENAS.cuenta = {
  html: lienzo(`<rect width="1080" height="1920" fill="#1b1814"/>
    <g filter="url(#ink)">${[0, 1].map(k => `<rect x="40" y="${520 + k * 220}" width="1000" height="16" fill="#4a3428"/>
      ${[...Array(10)].map((_, i) => `<rect x="${60 + i * 98}" y="${460 + k * 220}" width="70" height="60" rx="6" fill="${['#c8282e', '#e5a83b', '#3a7d44', '#9aa3ad'][(i + k) % 4]}" stroke="${INK}" stroke-width="4"/>`).join('')}`).join('')}
      <rect x="-20" y="1450" width="1120" height="500" fill="#2a2520"/>
      <rect x="360" y="1150" width="380" height="300" fill="#6b4a2f" stroke="${INK}" stroke-width="9"/><rect x="340" y="1120" width="420" height="40" fill="#8a6a4a" stroke="${INK}" stroke-width="8"/></g>
    <g id="cu-cosas"></g><rect id="cu-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${viñeta}`),
  fijo: `<div class="reloj-grande" id="cu-reloj">0:05</div>`,
  camara: { claves: [[INI.cuenta, 1.0, 0, 0], [SALTA, 1.05, 0, -20], [FIN('cuenta'), 1.12, -40, -60]] },
  update(lt, dur, t) {
    $('#cu-rojo').setAttribute('opacity', sonando(t) ? 0.08 + 0.12 * pulsoRojo(t) : 0);
    $('#cu-reloj').textContent = mmss(relojAlerta(t));
    const k = clamp((t - SALTA + 0.4) / 0.8);
    const cx = lerp(120, 840, k), cy = 1360 - Math.sin(k * Math.PI) * 420 + (k >= 1 ? -40 : 0);
    const chispa = k <= 0 ? chispaCorre(lerp(-60, 120, clamp((t - INI.cuenta) / 1.2)), 1360, 0.6, t)
      : `<g filter="url(#ink)" transform="translate(${cx} ${cy}) rotate(${lerp(-25, 15, k)}) scale(0.6)">${perro('parada')}</g>`;
    $('#cu-cosas').innerHTML = tuDe(860, 1450, 70, { look: -18, eyeScale: 1.3, armL: [[800, 1120], [lerp(800, 790, k), lerp(1160, 1260, k)]], armR: [[920, 1120], [lerp(900, 880, k), lerp(1160, 1270, k)]] }) + chispa;
  },
};

// ---------- 10. La alerta se calla. Le tapas el hocico ----------
ESCENAS.calla = {
  html: lienzo(`<rect width="1080" height="1920" fill="#241d29"/>
    <g id="ca-cara" filter="url(#ink)"></g><rect id="ca-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>${viñeta}`),
  fijo: `<div class="reloj-grande" id="ca-reloj">0:01</div>`,
  camara: { claves: [[INI.calla, 1.0, 0, 0], [CORTE, 1.05, 0, 0], [M.tapas, 1.12, 0, -30], [FIN('calla'), 1.18, 0, -50]] },
  update(lt, dur, t) {
    $('#ca-rojo').setAttribute('opacity', sonando(t) ? 0.08 + 0.12 * pulsoRojo(t) : 0);
    const r = $('#ca-reloj'); r.textContent = mmss(relojAlerta(t)); r.style.color = sonando(t) ? '#e0312b' : '#fff';
    r.style.opacity = sonando(t) || Math.sin(t * 8) > 0 ? 1 : 0.35;
    const tapa = ease.outCubic(clamp((t - M.tapas + 0.25) / 0.3));
    const au = tapa > 0.5 ? 0 : 0.55;
    // tu mano entra por la derecha y le aprieta el hocico: palma a un lado, cuatro dedos encima
    const mano = tapa > 0 ? `<g transform="translate(${lerp(520, 0, tapa)} 0)">
      <path d="M150 260 L420 420" stroke="${INK}" stroke-width="96" stroke-linecap="round"/><path d="M150 260 L420 420" stroke="#e9e2d6" stroke-width="72" stroke-linecap="round"/>
      <ellipse cx="190" cy="150" rx="105" ry="125" fill="#e9e2d6" stroke="${INK}" stroke-width="12"/>
      ${[55, 100, 145, 190].map((y, i) => `<path d="M190 ${y} L${-95 + i * 12} ${y + 8}" stroke="${INK}" stroke-width="50" stroke-linecap="round"/><path d="M190 ${y} L${-95 + i * 12} ${y + 8}" stroke="#e9e2d6" stroke-width="34" stroke-linecap="round"/>`).join('')}</g>` : '';
    $('#ca-cara').innerHTML = `<g transform="translate(${540 + (tapa > 0.5 ? Math.sin(t * 40) * 6 : 0)} 960) scale(1.05)">${caraChispa({ aullido: au, parpadeo: tapa > 0.5 })}${mano}</g>`;
  },
};

// ---------- 11. Ellos regresan del poste. Ahora están entre la tienda y tu casa. No puedes volver ----------
const RE_INF = (() => { const r = rng(91), g = []; for (let i = 0; i < 22; i++) g.push({ x1: 260 + r() * 520, y: 1230 + r() * 260, h: 220 + r() * 60, ph: r() * 6, v: 0.5 + r() * 0.4, l: (r() - 0.5) * 0.04 }); return g.sort((a, b) => a.y - b.y); })();
ESCENAS.regresan = {
  html: lienzo(`${avenidaLado('re')}<g id="re2-cosas"></g><g id="re2-x"></g>${viñeta}`),
  camara: { claves: [[INI.regresan, 1.0, 0, 0], [FIN('regresan'), 1.05, 0, -30]] },
  update(lt, dur, t) {
    ondasPoste('#esc-regresan', t);
    const inf = RE_INF.map(p => { const k = clamp((t - INI.regresan) * 0.4 * p.v), x = lerp(330, p.x1, ease.inOut(k));
      return `<g transform="translate(${x} ${p.y + 120}) scale(${p.h})">${k < 1 ? infectadoLado(t * 5 + p.ph) : infectadoQuieto(0, p.l, -0.03)}</g>`; }).join('');
    $('#re2-cosas').innerHTML = `<g filter="url(#ink)">${inf}</g>`;
    const ruta = clamp((t - M.ahora) / 1.0), x = t > M.novolver - 0.1 ? clamp((t - M.novolver + 0.1) / 0.3) : 0;
    $('#re2-x').innerHTML = `<path d="M900 1100 Q600 950 200 1100" fill="none" stroke="${ROJO}" stroke-width="12" stroke-dasharray="30 22" pathLength="1000" style="stroke-dasharray:${1000 * ruta} 1000" opacity=".9"/>
      ${x > 0 ? `<g transform="translate(550 1010) scale(${lerp(1.6, 1, ease.outCubic(x))})" opacity="${x}"><path d="M-90 -90 L90 90 M90 -90 L-90 90" stroke="${ROJO}" stroke-width="34" stroke-linecap="round"/></g>` : ''}`;
  },
};

// ---------- 12. A media cuadra: la entrada del metro y el edificio caído ----------
function calleMetro() {
  return `<rect width="2160" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)">
      <rect x="-20" y="760" width="360" height="560" fill="#8a7a62" stroke="${INK}" stroke-width="10"/>
      <rect x="20" y="790" width="290" height="80" fill="#e9e2d6" stroke="${INK}" stroke-width="6"/><text x="165" y="845" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="36" fill="${ROJO}">DON CHUCHO</text>
      <rect x="-20" y="1320" width="2200" height="700" fill="#5a5f69" stroke="${INK}" stroke-width="8"/>
      <rect x="760" y="1240" width="420" height="90" fill="#3d4048" stroke="${INK}" stroke-width="7"/>
      <path d="M780 1330 L800 1240 M1160 1330 L1140 1240" stroke="#9aa3ad" stroke-width="12"/>
      ${[0, 1, 2, 3].map(i => `<rect x="${800 + i * 22}" y="${1250 + i * 18}" width="${340 - i * 44}" height="16" fill="#2a2d33"/>`).join('')}
      <rect x="900" y="960" width="16" height="280" fill="#6b7280" stroke="${INK}" stroke-width="5"/>
      <rect x="820" y="880" width="180" height="96" rx="10" fill="#efe6cf" stroke="${INK}" stroke-width="7"/>
      <text x="910" y="945" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="50" fill="${INK}">METRO</text>
      <path d="M1040 1260 L1040 1300 L1020 1280 M1040 1300 L1060 1280" stroke="${INK}" stroke-width="6" fill="none"/>
    </g>
    ${escombros(1650, 1330, 1.0)}`;
}
ESCENAS.salida = {
  html: lienzo(`<g id="sa-mundo">${calleMetro()}<g id="sa-cosas"></g></g>${viñeta}`),
  camara: { claves: [[INI.salida, 1.0, 0, 0], [FIN('salida'), 1.04, 0, -20]] },
  update(lt, dur, t) {
    // la calle se desliza: primero la tienda, luego el metro, luego los escombros
    const p1 = ease.inOut(clamp((t - M.media) / 1.4)), p2 = ease.inOut(clamp((t - M.lado) / 1.4));
    $('#sa-mundo').setAttribute('transform', `translate(${-(420 * p1 + 690 * p2)} 0)`);
    $('#sa-cosas').innerHTML = (t > M.caido ? `<circle cx="1650" cy="1150" r="${260 + 14 * Math.sin(t * 5)}" fill="none" stroke="${ROJO}" stroke-width="9" opacity=".8"/>` : '') +
      (t > M.metro && t < M.lado + 0.4 ? `<circle cx="960" cy="1130" r="${250 + 14 * Math.sin(t * 5)}" fill="none" stroke="${ROJO}" stroke-width="9" opacity=".8"/>` : '');
  },
};

// ---------- 13. Debajo de los dos pasa el túnel que llega al centro de alerta ----------
ESCENAS.tunel = {
  html: lienzo(`<rect width="1080" height="1920" fill="url(#cielo)"/>
    <g filter="url(#ink)">
      <rect x="-20" y="760" width="1120" height="1200" fill="#4a3f36" stroke="${INK}" stroke-width="8"/>
      ${[...Array(30)].map((_, i) => `<circle cx="${(i * 137) % 1080}" cy="${820 + (i * 97) % 1100}" r="${6 + (i % 4) * 3}" fill="#3a3129"/>`).join('')}
      <rect x="-20" y="720" width="1120" height="50" fill="#5a5f69" stroke="${INK}" stroke-width="7"/>
      <rect x="20" y="420" width="200" height="300" fill="#8a7a62" stroke="${INK}" stroke-width="7"/><text x="120" y="400" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="34" fill="#e9e2d6">TIENDA</text>
      <rect x="300" y="620" width="40" height="100" fill="#6b7280"/><rect x="250" y="560" width="140" height="60" rx="8" fill="#efe6cf" stroke="${INK}" stroke-width="6"/><text x="320" y="602" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="34" fill="${INK}">METRO</text>
      <path d="M420 770 L420 1250 L520 1250" fill="none" stroke="#9aa3ad" stroke-width="14"/>
      <rect x="-20" y="1250" width="1120" height="230" fill="#14171c" stroke="${INK}" stroke-width="8"/>
      <path d="M-20 1440 L1100 1440 M-20 1460 L1100 1460" stroke="#6b7280" stroke-width="6"/>
    </g>
    ${escombros(720, 720, 0.55)}
    <g id="tu-flechas"></g>
    <g filter="url(#ink)"><rect x="840" y="1020" width="220" height="200" fill="#2a2d33" stroke="${INK}" stroke-width="7"/>
      <path d="M950 1020 L950 900 M910 940 L990 940 M920 900 L980 900" stroke="#b8bec6" stroke-width="8"/>
      <text x="950" y="1100" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="30" fill="#e9e2d6">CENTRO</text>
      <text x="950" y="1140" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="30" fill="#e9e2d6">DE ALERTA</text></g>
    ${viñeta}`),
  camara: { claves: [[INI.tunel, 1.0, 0, 0], [FIN('tunel'), 1.06, 0, -40]] },
  update(lt, dur, t) {
    const a = clamp((t - INI.tunel - 0.2) / 0.8), b = clamp((t - M.tunel) / 1.2);
    $('#tu-flechas').innerHTML = `<path d="M320 720 L420 1280" stroke="#9fd0ff" stroke-width="12" stroke-dasharray="24 18" opacity="${a}"/>
      <path d="M720 720 Q700 1000 650 1280" stroke="#e5a83b" stroke-width="12" stroke-dasharray="24 18" fill="none" opacity="${a}"/>
      <path d="M440 1360 L${lerp(440, 840, b)} 1360" stroke="${ROJO}" stroke-width="16" stroke-linecap="round"/>
      ${b > 0.95 ? `<path d="M820 1330 L850 1360 L820 1390" stroke="${ROJO}" stroke-width="16" fill="none" stroke-linecap="round"/>` : ''}`;
  },
};

// ---------- 14. ¿Bajas por el metro, o por los escombros? ----------
ESCENAS.decide = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="960" r="900" fill="url(#luzLuna)" opacity=".1"/>`)}
    <div class="decide-tit" id="de-tit" style="font-size:100px">¿POR DÓNDE BAJAS?</div>
    <div class="opcion" id="de-a" style="top:560px;font-size:70px"><span class="emo">🚇</span><span class="txt">POR EL METRO</span></div>
    <div class="opcion" id="de-b" style="top:900px;font-size:70px"><span class="emo">🏚️</span><span class="txt">POR LOS ESCOMBROS</span></div>
    <div class="decide-com" id="de-com">COMENTA <span class="emo">🚇</span> O <span class="emo">🏚️</span></div>
    <div class="decide-pie" id="de-pie">GANA LO QUE MÁS COMENTEN</div>`,
  update(lt, dur, t) {
    pop($('#de-tit'), t, INI.decide);
    pop($('#de-a'), t, M.bajas + 0.3);
    pop($('#de-b'), t, M.escombros2 - 0.1);
    pop($('#de-com'), t, M.comenta - 0.1);
    $('#de-pie').style.opacity = clamp((t - M.comenta - 0.6) / 0.3);
    const a = t >= M.bajas + 0.3 && t < M.escombros2 - 0.1, b = t >= M.escombros2 - 0.1 && t < M.comenta - 0.1;
    $('#de-a').style.borderColor = a ? '#e5a83b' : '#fff';
    $('#de-b').style.borderColor = b ? '#9fd0ff' : '#fff';
    if (a) $('#de-a').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
    if (b) $('#de-b').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
  },
};
