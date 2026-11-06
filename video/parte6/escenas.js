// Escenas de "La alerta", parte 6: La bodega. Sigue la misma noche de la parte 5.
// Los infectados suben al edificio, escapas a la bodega de la azotea y pierdes a Chispa.
// Memo dice que la tiene. Termina con una decisión para los comentarios. Abre directo, sin flash-forward.

// Momentos que también usa mezcla.py. Si cambias uno, cámbialo allá.
const GOLPES = (() => { const g = []; for (let x = INI.golpes + 0.15; x < M.cede - 0.1; x += 0.62) g.push(x); return g; })();
const CIERRA = M.encierras + 0.3;   // la puerta de la bodega se cierra

const infEn = (x, y, h, cuerpo) => `<g transform="translate(${x} ${y}) scale(${h})">${cuerpo}</g>`;
// Tú, con un borde claro para que se vea de noche.
const tuNoche = o => `<g filter="url(#contorno)">${stick(o)}</g>`;

// ---------- 1. Las cabezas desde arriba (igual que el final de la parte 5) ----------
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
    ${poste(540, 420, 0.55, 640)}
    <g id="${pre}-gente" filter="url(#ink)">${monton.map(p => `<g class="cab" data-i="${p.i}" transform="translate(${p.x} ${p.y}) scale(${p.s})">
      <ellipse cx="6" cy="44" rx="56" ry="30" fill="#000" opacity=".25"/>
      <ellipse cx="0" cy="36" rx="54" ry="27" fill="#3d4048" stroke="${INK}" stroke-width="5"/>
      <circle cx="0" cy="0" r="38" fill="url(#headInfectadoOscuro)" stroke="${INK}" stroke-width="6"/>
      <g class="ojos" style="filter:drop-shadow(0 0 7px #fff)"><ellipse cx="-13" cy="-2" rx="6.5" ry="10" fill="#f2f2f2"/><ellipse cx="13" cy="-2" rx="6.5" ry="10" fill="#f2f2f2"/></g></g>`).join('')}</g>
    <rect id="${pre}-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`;
}

ESCENAS.giran = {
  html: lienzo(montonArriba('gi')),
  camara: { claves: [[0, 1.3, 0, -60], [M.paga, 1.12, 0, -20], [FIN('giran'), 1.0, 0, 0]], origen: '540px 1000px' },
  update(lt, dur, t) {
    $('#esc-giran').querySelectorAll('.onda').forEach(o => o.style.opacity = 0);
    $('#esc-giran').querySelectorAll('.foco').forEach(o => o.style.opacity = 0.3);
    if (!this.cabs) this.cabs = [...document.querySelectorAll('#gi-gente .cab')];
    this.cabs.forEach(g => {
      const p = monton.find(m => m.i === +g.dataset.i);
      const k = clamp((t - M.paga + 0.15 - p.d * 0.35) / 0.7);
      const dy = 1100 * k * k, s = p.s * (1 + 0.5 * k * k);
      g.setAttribute('transform', `translate(${p.x + (p.x - 540) * 0.4 * k * k} ${p.y + dy}) scale(${s})`);
    });
    $('#gi-rojo').setAttribute('opacity', t > M.paga ? 0.4 * clamp(1 - (t - M.paga) / 0.4) : 0);
    if (t > M.paga) $('#esc-giran .cam').style.transform += ` translate(${Math.sin(lt * 70) * 9}px, ${Math.cos(lt * 61) * 7}px)`;
  },
};

// ---------- 2. La puerta de vidrio del vestíbulo, con el candado de Memo, revienta ----------
const vidrioR = rng(19);
const afuera = [...Array(7)].map((_, i) => ({ x: 250 + i * 95 + vidrioR() * 30, y: 640 + vidrioR() * 260, r: 52 + vidrioR() * 16, ph: vidrioR() * 6 }));
const palmas = [...Array(9)].map(() => ({ x: 220 + vidrioR() * 640, y: 560 + vidrioR() * 760, ph: vidrioR() * 6, a: (vidrioR() - 0.5) * 50 }));
const grieta = (cx, cy, n, seed) => {
  const r = rng(seed);
  return [...Array(n)].map((_, k) => {
    let a = (k / n) * Math.PI * 2 + r() * 0.5, x = cx, y = cy, d = `M${cx} ${cy}`;
    for (let s = 0; s < 5; s++) { x += Math.cos(a) * (40 + r() * 60); y += Math.sin(a) * (40 + r() * 60); a += (r() - 0.5) * 0.7; d += ` L${x.toFixed(1)} ${y.toFixed(1)}`; }
    return d;
  });
};
const grietas = [...grieta(380, 820, 9, 3), ...grieta(700, 720, 8, 5), ...grieta(540, 1150, 7, 9)];
const astillas = [...Array(26)].map(() => ({ x: 200 + vidrioR() * 680, y: 400 + vidrioR() * 1080, vx: (vidrioR() - 0.5) * 1400, vy: (vidrioR() - 0.3) * 900, g: vidrioR() * 360, vg: (vidrioR() - 0.5) * 900, s: 30 + vidrioR() * 60 }));

ESCENAS.vidrio = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#11151d"/>
    <rect y="1500" width="1080" height="420" fill="#1b1f27"/>
    <g stroke="#14171e" stroke-width="5">${[1580, 1700, 1850].map(y => `<line x1="0" y1="${y}" x2="1080" y2="${y}"/>`).join('')}</g>
    <defs><clipPath id="vi-clip"><rect x="160" y="360" width="760" height="1140"/></clipPath></defs>
    <g filter="url(#ink)">
      <rect x="160" y="360" width="760" height="1140" fill="#26314a"/>
      <circle cx="760" cy="500" r="200" fill="url(#luzLuna)" opacity=".6"/>
      <g id="vi-fuera"></g>
      <g id="vi-vidrio">
        <rect x="160" y="360" width="760" height="1140" fill="rgba(160,190,220,.16)"/>
        <path d="M230 520 l120 -120 M250 640 l200 -200 M700 1300 l160 -160" stroke="#fff" stroke-width="8" opacity=".25"/>
        <text x="350" y="470" font-family="Oswald" font-weight="700" font-size="54" letter-spacing="8" fill="#fff" opacity=".55">EDIFICIO C</text>
        <g id="vi-grietas" fill="none" stroke="#eef3fa" stroke-width="4" stroke-linecap="round">${grietas.map(d => `<path d="${d}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`).join('')}</g>
      </g>
      <rect x="160" y="360" width="760" height="1140" fill="none" stroke="#c9ccd2" stroke-width="24"/>
      <line x1="540" y1="360" x2="540" y2="1500" stroke="#c9ccd2" stroke-width="20"/>
      <rect x="500" y="900" width="18" height="160" rx="6" fill="#9aa3ad" stroke="${INK}" stroke-width="5"/><rect x="562" y="900" width="18" height="160" rx="6" fill="#9aa3ad" stroke="${INK}" stroke-width="5"/>
      <path d="M509 960 q31 -30 62 0 q-31 30 -62 0 M509 1000 q31 -30 62 0 q-31 30 -62 0" fill="none" stroke="#7d838c" stroke-width="9"/>
      <rect x="515" y="1020" width="50" height="44" rx="6" fill="#c9a43a" stroke="${INK}" stroke-width="5"/><path d="M525 1020 v-16 a15 15 0 0 1 30 0 v16" fill="none" stroke="#9aa3ad" stroke-width="7"/>
    </g>
    <g id="vi-astillas"></g>
    <rect id="vi-flash" width="1080" height="1920" fill="#fff" opacity="0"/>
    ${viñeta}`),
  camara: { claves: [[INI.vidrio, 1.0, 0, 0], [M.revienta, 1.12, 0, -30], [FIN('vidrio'), 1.2, 0, -40]], origen: '540px 950px' },
  update(lt, dur, t) {
    const roto = t >= M.revienta, dr = t - M.revienta;
    const entra = roto ? ease.inOut(clamp(dr / 1.2)) : 0;
    // infectados detrás del vidrio: empujan; cuando revienta, se vienen encima
    $('#vi-fuera').innerHTML = afuera.map(p => {
      const x = p.x + Math.sin(t * 5 + p.ph) * 8, y = p.y + Math.abs(Math.sin(t * 7 + p.ph)) * 10;
      const s = 1 + entra * 0.9, X = 540 + (x - 540) * s, Y = 950 + (y - 950) * s + entra * 260;
      return `<circle cx="${X}" cy="${Y}" r="${p.r * s}" fill="url(#headInfectado)" stroke="#15171b" stroke-width="${6 * s}"/>
        <ellipse cx="${X - p.r * 0.32 * s}" cy="${Y}" rx="${p.r * 0.13 * s}" ry="${p.r * 0.22 * s}" fill="#f4f4f4"/><ellipse cx="${X + p.r * 0.32 * s}" cy="${Y}" rx="${p.r * 0.13 * s}" ry="${p.r * 0.22 * s}" fill="#f4f4f4"/>
        <path d="M${X - p.r * 1.3 * s} ${Y + p.r * 1.2 * s} Q${X} ${Y + p.r * 0.7 * s} ${X + p.r * 1.3 * s} ${Y + p.r * 1.2 * s} L${X + p.r * 1.4 * s} 1920 L${X - p.r * 1.4 * s} 1920 Z" fill="#3a3d44" stroke="#15171b" stroke-width="${5 * s}"/>`;
    }).join('') + (roto ? '' : palmas.map(p => {
      const golpe = Math.max(0, Math.sin(t * 6 + p.ph));
      return `<g transform="translate(${p.x} ${p.y + golpe * 6}) rotate(${p.a}) scale(${1 + golpe * 0.06})"><ellipse rx="36" ry="44" fill="#a7adb5" stroke="#15171b" stroke-width="5"/>
        ${[-24, -8, 8, 24].map(dx => `<rect x="${dx - 7}" y="-92" width="14" height="52" rx="7" fill="#a7adb5" stroke="#15171b" stroke-width="4"/>`).join('')}</g>`;
    }).join(''));
    $('#vi-vidrio').style.display = roto ? 'none' : '';
    if (roto) $('#vi-fuera').removeAttribute('clip-path'); else $('#vi-fuera').setAttribute('clip-path', 'url(#vi-clip)');
    // grietas en tres golpes antes de reventar
    const pasos = [M.revienta - 2.2, M.revienta - 1.2, M.revienta - 0.45];
    document.querySelectorAll('#vi-grietas path').forEach((g, i) => {
      const k = Math.min(2, Math.floor(i / 8)), p = clamp((t - pasos[k]) / 0.25);
      g.setAttribute('stroke-dashoffset', 1 - p);
    });
    // astillas que salen volando hacia la cámara
    $('#vi-astillas').innerHTML = roto && dr < 1.4 ? astillas.map(a => {
      const x = a.x + a.vx * dr, y = a.y + a.vy * dr + 900 * dr * dr, s = a.s * (1 + dr * 1.5);
      return `<polygon points="0,${-s} ${s * 0.6},${s * 0.5} ${-s * 0.5},${s * 0.3}" transform="translate(${x} ${y}) rotate(${a.g + a.vg * dr})" fill="rgba(200,225,250,.55)" stroke="#fff" stroke-width="3" opacity="${clamp(1 - dr / 1.4)}"/>`;
    }).join('') : '';
    $('#vi-flash').setAttribute('opacity', roto ? 0.6 * clamp(1 - dr / 0.2) : 0);
    if (roto && dr < 0.5) $('#esc-vidrio .cam').style.transform += ` translate(${Math.sin(lt * 80) * 16 * (1 - dr / 0.5)}px, ${Math.cos(lt * 71) * 12 * (1 - dr / 0.5)}px)`;
  },
};

// ---------- 3. Corte de la escalera: suben piso por piso ----------
const PISO_ALTO = 640, Y0 = 1500;                 // piso k a nivel de suelo en Y0 - k*640
const yEsc = u => Y0 - PISO_ALTO * u;            // altura del camino en "pisos subidos"
const xEsc = u => { const f = u - Math.floor(u); return f < 0.5 ? 120 + 780 * (f / 0.5) : 900 - 780 * ((f - 0.5) / 0.5); };
const escalonesP = (x0, y0, x1, y1, n) => {
  const dx = (x1 - x0) / n, dy = (y1 - y0) / n;
  let p = `${x0},${y0}`;
  for (let i = 0; i < n; i++) p += ` ${x0 + dx * i},${y0 + dy * (i + 1)} ${x0 + dx * (i + 1)},${y0 + dy * (i + 1)}`;
  return p + ` ${x1},${y1 + 46} ${x0},${y0 + 46}`;
};
function cubo() {
  let s = '';
  for (let k = 0; k <= 5; k++) {
    const Y = Y0 - k * PISO_ALTO;
    s += `<rect x="0" y="${Y - PISO_ALTO}" width="1080" height="${PISO_ALTO}" fill="${k % 2 ? '#161b26' : '#141924'}"/>
      <rect x="470" y="${Y - 560}" width="140" height="110" fill="#2b3a5a" stroke="${INK}" stroke-width="6"/><rect x="470" y="${Y - 560}" width="140" height="110" fill="url(#luzLuna)" opacity=".5"/>
      <text x="230" y="${Y - 330}" font-family="Oswald" font-weight="700" font-size="190" fill="#c9ccd2" opacity=".35">${k === 0 ? 'PB' : k}</text>
      <polygon points="${escalonesP(900, Y - 320, 120, Y - 640, 10)}" fill="#1d222c" stroke="${INK}" stroke-width="5"/>
      <rect x="900" y="${Y - 320}" width="180" height="30" fill="#2a2f3a" stroke="${INK}" stroke-width="5"/>
      <polygon points="${escalonesP(120, Y, 900, Y - 320, 10)}" fill="#2e3440" stroke="${INK}" stroke-width="5"/>
      <rect x="-10" y="${Y}" width="140" height="34" fill="#3a4152" stroke="${INK}" stroke-width="5"/>
      <rect x="10" y="${Y - 230}" width="96" height="230" fill="#4a3428" stroke="${INK}" stroke-width="6"/>
      ${k > 0 ? `<rect x="22" y="${Y - 205}" width="72" height="34" rx="5" fill="#d9dee6" stroke="${INK}" stroke-width="4"/><text x="58" y="${Y - 178}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="26" fill="${INK}">${k}02</text>` : ''}
      <line x1="120" y1="${Y - 90}" x2="900" y2="${Y - 410}" stroke="#5b616b" stroke-width="7"/>`;
  }
  return s;
}
const uLider = t => {
  const pts = [[INI.escalera, 0.55], [M.primer, 1.25], [M.segundo, 2.25], [M.tercero, 3.25], [FIN('escalera'), 3.85]];
  for (let i = 0; i < pts.length - 1; i++) if (t < pts[i + 1][0]) return lerp(pts[i][1], pts[i + 1][1], clamp((t - pts[i][0]) / (pts[i + 1][0] - pts[i][0])));
  return pts[pts.length - 1][1];
};
ESCENAS.escalera = {
  html: lienzo(`<g id="es-mundo"><g filter="url(#ink)">${cubo()}</g><g id="es-gente" filter="url(#ink)"></g></g>${viñeta}`),
  camara: { de: { s: 1.0, x: 0, y: 0 }, a: { s: 1.08, x: 0, y: 0 } },
  update(lt, dur, t) {
    const u = uLider(t);
    $('#es-mundo').setAttribute('transform', `translate(0 ${PISO_ALTO * u - 350})`);
    let g = '';
    for (let i = 6; i >= 0; i--) {
      const ui = u - 0.09 * i;
      if (ui < 0) continue;
      const f = ui - Math.floor(ui), dir = f < 0.5 ? 1 : -1;
      g += `<g transform="translate(${xEsc(ui)} ${yEsc(ui)}) scale(${dir * 210} 210)">${infectadoLado(t * 16 + i * 1.7)}</g>`;
    }
    $('#es-gente').innerHTML = g;
  },
};

// ---------- 4. Rosa, a oscuras, oye que pasan frente a su puerta ----------
ESCENAS.rosa = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#241d29"/>
    <circle cx="170" cy="1180" r="520" fill="url(#luzCalida)" opacity=".8"/>
    <g filter="url(#ink)">
      <rect x="-20" y="1440" width="1120" height="500" fill="#1a141d" stroke="${INK}" stroke-width="8"/>
      <rect x="540" y="500" width="380" height="925" fill="#4a3428" stroke="${INK}" stroke-width="10"/>
      <rect x="520" y="480" width="420" height="20" fill="#3a2a20" stroke="${INK}" stroke-width="6"/>
      <circle cx="585" cy="980" r="16" fill="#c9a43a" stroke="${INK}" stroke-width="5"/>
      <rect x="590" y="560" width="280" height="330" fill="none" stroke="#3a2a20" stroke-width="8"/>
      <rect x="590" y="980" width="280" height="380" fill="none" stroke="#3a2a20" stroke-width="8"/>
      <rect x="60" y="1220" width="210" height="220" fill="#3b2d24" stroke="${INK}" stroke-width="7"/>
      <rect x="150" y="1140" width="26" height="80" fill="#efe6cf" stroke="${INK}" stroke-width="4"/>
    </g>
    <rect x="540" y="1425" width="380" height="16" fill="#9fb3d9" opacity=".85"/>
    <g id="ro-pies"></g>
    <path id="ro-llama" d="" fill="#f3c46a" stroke="#c9792b" stroke-width="3"/>
    <g id="ro-rosa" filter="url(#ink)"></g>
    ${viñeta}`),
  camara: { claves: [[INI.rosa, 1.05, 0, 0], [M.siguen, 1.15, -30, -40], [FIN('rosa'), 1.22, -40, -60]], origen: '420px 1000px' },
  update(lt, dur, t) {
    const fl = Math.sin(t * 17) * 4 + Math.sin(t * 11) * 3;
    $('#ro-llama').setAttribute('d', `M163 1140 q-16 -26 0 -${58 + fl} q16 ${32 + fl / 2} 0 ${58 + fl} z`);
    // sombras de pies que pasan por debajo de la puerta
    let pies = '';
    if (t > M.rosaM - 0.6) for (let k = 0; k < 7; k++) {
      const x = 500 + ((t - M.rosaM + 0.6) * 420 - k * 150), paso = Math.abs(Math.sin(t * 9 + k)) * 6;
      if (x > 520 && x < 940) pies += `<rect x="${x}" y="${1425 - paso * 0.2}" width="${36 + paso}" height="16" fill="#0c0e13"/>`;
    }
    $('#ro-pies').innerHTML = pies;
    const arriba = ease.inOut(clamp((t - M.siguen) / 0.6));
    const tiembla = Math.sin(t * 40) * 1.5;
    $('#ro-rosa').innerHTML = rosa({ head: [330 + tiembla, 860], r: 100, neck: [330, 960], hip: [345, 1220],
      legL: [[330, 1330], [320, 1440]], legR: [[370, 1330], [385, 1440]], footL: 1, footR: 1,
      armL: [[400, 1080], [345, 950]], armR: [[270, 1080], [250, 1170]], brazosAlFrente: true,
      look: lerp(30, 8, arriba), lookY: lerp(4, -30, arriba), eyeScale: 1.35 });
    $('#esc-rosa .cam').style.transform += ` translate(${Math.sin(t * 9) * (t > M.rosaM ? 2 : 0)}px, 0)`;
  },
};

// ---------- 5 y 6. Tu puerta: golpes, la silla, Chispa en tus brazos. La puerta cede ----------
const sillaFrente = (x, y, ang = 0) => {
  const d = (pts, w) => linea(pts, w + 9, INK) + linea(pts, w, '#7a5236');
  return `<g transform="rotate(${ang} ${x} ${y + 420})">
    ${d([[x - 90, y], [x - 90, y + 420]], 14)}${d([[x + 90, y], [x + 90, y + 420]], 14)}
    ${d([[x - 90, y + 40], [x + 90, y + 40]], 12)}${d([[x - 90, y + 110], [x + 90, y + 110]], 12)}
    <path d="M${x - 115} ${y + 200} L${x + 115} ${y + 200} L${x + 100} ${y + 232} L${x - 100} ${y + 232} Z" fill="#8a603f" stroke="${INK}" stroke-width="8"/>
    ${d([[x - 80, y + 232], [x - 95, y + 420]], 12)}${d([[x + 80, y + 232], [x + 95, y + 420]], 12)}</g>`;
};
const SUELO = 1400;
// Empuje de la puerta: cada golpe la sacude y se apaga rápido.
const empuje = t => GOLPES.reduce((s, g) => s + (t > g ? Math.exp(-(t - g) * 10) : 0), 0);
function puerta(pre) {
  return `
    <rect width="1080" height="1920" fill="url(#paredNoche)"/>
    <g filter="url(#ink)">
      <rect x="-20" y="${SUELO}" width="1120" height="560" fill="#33251a" stroke="${INK}" stroke-width="8"/>
      <rect x="580" y="480" width="380" height="${SUELO - 480}" fill="#0a0c10" stroke="${INK}" stroke-width="8"/>
    </g>
    <g id="${pre}-brazos" filter="url(#ink)"></g>
    <g id="${pre}-hoja" filter="url(#ink)"></g>
    <g filter="url(#ink)"><rect x="560" y="460" width="420" height="24" fill="#3a2a20" stroke="${INK}" stroke-width="6"/>
      <rect x="560" y="460" width="22" height="${SUELO - 460}" fill="#3a2a20" stroke="${INK}" stroke-width="6"/><rect x="958" y="460" width="22" height="${SUELO - 460}" fill="#3a2a20" stroke="${INK}" stroke-width="6"/></g>
    <g id="${pre}-polvo"></g>
    <g id="${pre}-silla" filter="url(#ink)"></g>
    <g id="${pre}-tu"></g>
    <rect id="${pre}-flash" width="1080" height="1920" fill="#fff" opacity="0"/>
    ${viñeta}`;
}
// La hoja de la puerta. abre: 0 cerrada, 1 abierta (gira sobre la bisagra derecha).
const hojaPuerta = (abre, sacude) => {
  const w = 380 * (1 - 0.8 * abre);
  return `<g transform="translate(${960 - w + sacude} 480)">
    <rect width="${w}" height="${SUELO - 480}" fill="#5a4030" stroke="${INK}" stroke-width="8"/>
    <rect x="${w * 0.13}" y="70" width="${w * 0.74}" height="330" fill="none" stroke="#4a3428" stroke-width="8"/>
    <rect x="${w * 0.13}" y="470" width="${w * 0.74}" height="380" fill="none" stroke="#4a3428" stroke-width="8"/>
    <circle cx="${w * 0.12}" cy="500" r="16" fill="#c9a43a" stroke="${INK}" stroke-width="5"/>
    ${abre > 0 ? `<path d="M${w * 0.2} 120 l${w * 0.25} 160 l-${w * 0.1} 120 M${w * 0.3} 600 l${w * 0.3} 90" stroke="#1a120c" stroke-width="7" fill="none"/>` : ''}
    <text x="${w * 0.5}" y="45" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="${34 * (1 - 0.6 * abre)}" fill="#d9dee6">502</text></g>`;
};
const chispaEnBrazos = (x, y, tiembla) => `<g transform="translate(${x + Math.sin(tiembla * 60) * 4 * (tiembla > 0 ? 1 : 0)} ${y}) scale(0.55)">${perro('parada')}</g>`;
// Tú de lado con Chispa en brazos: cuerpo, luego Chispa, luego los brazos encima.
const tuConChispa = (x, y, look, tiembla) => {
  const r = 95, sh = [x + 10, y + 95 + r * 0.4];
  const brazo = (c, m) => linea([sh, c, m], r * 0.085) + punto(m[0], m[1], r * 0.1);
  return `<g filter="url(#contorno)">${stick({ head: [x, y], r, neck: [x + 10, y + 95], hip: [x + 20, y + 330],
    legL: [[x + 5, y + 435], [x - 20, SUELO]], legR: [[x + 45, y + 435], [x + 60, SUELO]], footL: -1, footR: 1, look, eyeScale: 1.35 })}
    ${chispaEnBrazos(x + 120, y + 175, tiembla)}${brazo([x + 70, y + 200], [x + 150, y + 225])}${brazo([x + 60, y + 150], [x + 140, y + 165])}</g>`;
};

ESCENAS.golpes = {
  html: lienzo(puerta('go')),
  fijo: `<div class="onomato" id="go-pum" style="top:330px;left:560px;font-size:140px;opacity:0">¡PUM!</div>`,
  camara: { claves: [[INI.golpes, 1.0, 0, 0], [M.silla, 1.06, -40, -20], [M.tiembla, 1.06, -40, -20], [M.tiembla + 0.6, 1.3, 160, -190], [FIN('golpes'), 1.34, 160, -200]] },
  update(lt, dur, t) {
    const e = empuje(t);
    $('#go-hoja').innerHTML = hojaPuerta(0, Math.sin(t * 50) * 5 * e - 6 * e);
    const pone = ease.outCubic(clamp((t - M.silla + 0.2) / 0.5));
    $('#go-silla').innerHTML = t > M.silla - 0.2 ? sillaFrente(lerp(470, 680, pone), 960 + Math.sin(t * 40) * 6 * e, lerp(0, 8, pone) + 3 * e) : '';
    $('#go-tu').innerHTML = tuConChispa(lerp(330, 250, pone), 840, 30, t > M.tiembla - 0.2 ? t : 0);
    let polvo = '';
    for (const g of GOLPES) if (t > g && t < g + 0.8) for (let k = 0; k < 6; k++) {
      const d = t - g; polvo += `<circle cx="${600 + k * 60 + Math.sin(k * 3) * 20}" cy="${490 + 700 * d * d + k * 8}" r="5" fill="#b9a99a" opacity="${1 - d / 0.8}"/>`;
    }
    $('#go-polvo').innerHTML = polvo;
    const ult = GOLPES.filter(g => g <= t).pop(), pum = $('#go-pum');
    const dp = ult === undefined ? 9 : t - ult;
    pum.style.opacity = dp < 0.35 ? 1 : 0;
    pum.style.transform = `rotate(${(GOLPES.indexOf(ult) % 2 ? 8 : -8)}deg) scale(${lerp(1.4, 1, clamp(dp / 0.12))})`;
    pum.style.left = (GOLPES.indexOf(ult) % 2 ? 640 : 520) + 'px';
    if (dp < 0.15) $('#esc-golpes .cam').style.transform += ` translate(${Math.sin(lt * 90) * 8}px, 0)`;
  },
};

const brazosGrises = (k, t) => [[650, 760], [800, 640], [720, 980], [880, 900], [640, 1160]].map(([x, y], i) => {
  const L = 120 + 340 * k + Math.sin(t * 9 + i) * 20, a = -2.6 + i * 0.25;
  const ex = x + Math.cos(a) * L * 0.5 + 60, ey = y + Math.sin(a) * L * 0.2 + 40, hx = x - L * 0.75, hy = y + Math.sin(t * 7 + i) * 18 + 30;
  return linea([[x + 120, y], [ex, ey], [hx, hy]], 34, '#050608') + linea([[x + 120, y], [ex, ey], [hx, hy]], 22, '#9aa0a8') +
    `<circle cx="${hx}" cy="${hy}" r="26" fill="#9aa0a8" stroke="#050608" stroke-width="6"/>`;
}).join('');
ESCENAS.cede = {
  html: lienzo(puerta('ce')),
  camara: { claves: [[INI.cede, 1.15, -60, -40], [M.cede, 1.2, -80, -40], [FIN('cede'), 1.32, -120, -60]] },
  update(lt, dur, t) {
    const ab = ease.outCubic(clamp((t - M.cede) / 0.25)), roto = t >= M.cede;
    const e = empuje(t) + (roto ? 0 : 0.6);
    $('#ce-hoja').innerHTML = hojaPuerta(ab, Math.sin(t * 60) * 7 * e);
    $('#ce-brazos').innerHTML = roto ? brazosGrises(ease.outCubic(clamp((t - M.cede) / 0.6)), t) : '';
    const vuela = clamp((t - M.cede) / 0.6);
    $('#ce-silla').innerHTML = sillaFrente(680 - 520 * vuela, 960 + 300 * vuela * vuela - 200 * vuela, 8 - 140 * vuela);
    let astillas = '';
    if (roto) for (let k = 0; k < 14; k++) {
      const d = t - M.cede, x = 640 + k * 22 - d * (300 + k * 40), y = 600 + k * 50 - d * 200 + 900 * d * d;
      astillas += `<rect x="${x}" y="${y}" width="${30 + k % 3 * 10}" height="9" fill="#7a5236" stroke="${INK}" stroke-width="3" transform="rotate(${k * 40 + d * 500} ${x} ${y})" opacity="${clamp(1 - d / 1.2)}"/>`;
    }
    $('#ce-polvo').innerHTML = astillas;
    $('#ce-tu').innerHTML = tuConChispa(250, 840, 34, t);
    $('#ce-flash').setAttribute('opacity', roto ? 0.5 * clamp(1 - (t - M.cede) / 0.18) : 0);
    if (roto && t < M.cede + 0.5) $('#esc-cede .cam').style.transform += ` translate(${Math.sin(lt * 85) * 14}px, ${Math.cos(lt * 77) * 10}px)`;
  },
};

// ---------- 7, 8 y 9. La fachada de noche: sales a la cornisa, una mano, Chispa se pierde ----------
const CORNISA = 1100;
const lejos = (() => { const r = rng(57); return [...Array(10)].map(() => ({ x: 60 + r() * 900, y: 1800 + r() * 100, s: 0.7 + r() * 0.4 })).sort((a, b) => a.y - b.y); })();
function fachadaNoche(pre) {
  return `
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
    </g>
    <rect x="-20" y="${CORNISA + 46}" width="1120" height="26" fill="#000" opacity=".25"/>
    <g filter="url(#ink)">${lejos.map(p => `<g transform="translate(${p.x} ${p.y}) scale(${p.s})"><circle r="14" fill="url(#headInfectadoOscuro)" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="-5" cy="-1" rx="2.7" ry="4" fill="#f2f2f2"/><ellipse cx="5" cy="-1" rx="2.7" ry="4" fill="#f2f2f2"/></g>`).join('')}</g>
    <g id="${pre}-mano" filter="url(#ink)"></g>
    <g id="${pre}-tu"></g>
    <g id="${pre}-chispa" filter="url(#contorno)"></g>
    <rect width="1080" height="1920" fill="url(#${pre}-sombra)"/>
    ${viñeta}`;
}
// Tú en la cornisa, de espaldas a la pared. con: Chispa bajo el brazo. estira: 0..1 el brazo derecho hacia la derecha.
const tuCornisa = (x, con, estira = 0, susto = 1.3, tiembla = 0) => {
  const y = CORNISA, tx = Math.sin(tiembla * 50) * 2 * (tiembla ? 1 : 0);
  return tuNoche({ head: [x + tx, y - 330], r: 70, neck: [x + tx, y - 260], hip: [x, y - 120],
    legL: [[x - 30, y - 60], [x - 40, y]], legR: [[x + 30, y - 60], [x + 45, y]], footL: -1, footR: 1,
    armL: [[x - 70, y - 190], [x - 60, y - 120]], armR: [[x + lerp(60, 110, estira), y - lerp(200, 230, estira)], [x + lerp(50, 210, estira), y - lerp(140, 250, estira)]],
    look: 18 + 10 * estira, lookY: 8, eyeScale: susto }) +
    (con ? `<g filter="url(#contorno)"><g transform="translate(${x - 70} ${y - 175}) scale(0.42)">${perro('parada')}</g></g>` : '');
};
const manoVentana = (k, t) => {
  if (k <= 0) return '';
  const hx = 460 + 230 * k + Math.sin(t * 8) * 10 * k, hy = 900 + Math.sin(t * 6) * 12;
  return linea([[380, 860], [430 + 80 * k, 880], [hx, hy]], 46, '#050608') + linea([[380, 860], [430 + 80 * k, 880], [hx, hy]], 30, '#9aa0a8') +
    `<g transform="translate(${hx} ${hy})"><circle r="34" fill="#9aa0a8" stroke="#050608" stroke-width="7"/>
    ${[-22, -6, 10, 26].map((dy, i) => linea([[20, dy], [62 + Math.sin(t * 10 + i) * 10, dy - 4]], 16, '#050608') + linea([[20, dy], [62 + Math.sin(t * 10 + i) * 10, dy - 4]], 9, '#9aa0a8')).join('')}</g>`;
};
const chispaCorre = (x, t, salto = 0) => `<g transform="translate(${x} ${CORNISA - 70 - salto - Math.abs(Math.sin(t * 16)) * 10}) scale(0.6)">${perro('parada')}</g>`;

ESCENAS.ventana = {
  html: lienzo(fachadaNoche('ve')),
  camara: { claves: [[INI.ventana, 1.0, 0, 0], [M.cornisa, 1.25, 80, -150], [M.otravez, 1.25, 80, -150], [FIN('ventana'), 1.45, 60, -260]] },
  update(lt, dur, t) {
    const sale = ease.inOut(clamp((t - M.ventanaM + 0.3) / (M.cornisa - M.ventanaM + 0.3)));
    if (sale < 0.5) {
      // todavía en la ventana: se asoma y pasa una pierna
      const x = lerp(250, 400, sale * 2);
      $('#ve-tu').innerHTML = tuNoche({ head: [x, 790], r: 70, neck: [x + 10, 860], hip: [x + 30, 1010], legL: [[x + 60, 1060], [x + 80, CORNISA]], legR: [[x - 10, 1060], [x - 20, 1095]],
        armL: [[x + 80, 930], [460, 900]], armR: [[x - 60, 930], [x - 90, 1000]], look: 26, lookY: 10, eyeScale: 1.3 }) +
        `<g filter="url(#contorno)"><g transform="translate(${x - 60} 935) scale(0.42)">${perro('parada')}</g></g>`;
    } else {
      $('#ve-tu').innerHTML = tuCornisa(lerp(470, 560, (sale - 0.5) * 2), true, 0, t > M.otravez ? 1.5 : 1.3, t > M.otravez ? t : 0);
    }
    $('#ve-mano').innerHTML = '';
  },
};

ESCENAS.mano = {
  html: lienzo(fachadaNoche('ma')),
  camara: { claves: [[INI.mano, 1.3, 60, -200], [M.manoM, 1.2, 80, -140], [M.suelta, 1.25, -20, -160], [FIN('mano'), 1.3, -60, -180]] },
  update(lt, dur, t) {
    const paso = ease.inOut(clamp((t - INI.mano) / 1.0)), x = lerp(560, 640, paso);
    const sale = ease.outBack(clamp((t - M.manoM) / 0.35));
    const suelta = clamp((t - M.suelta + 0.1) / 0.5), conChispa = suelta <= 0;
    $('#ma-mano').innerHTML = manoVentana(sale, t);
    $('#ma-tu').innerHTML = tuCornisa(x + (sale > 0.5 ? 12 : 0), conChispa, conChispa ? 0 : clamp(suelta * 2), 1.6, t);
    // Chispa se zafa: brinca del brazo a la cornisa, hacia la derecha
    if (!conChispa) {
      const p = ease.outCubic(suelta), cx = lerp(x - 70, x + 190, p), cy = lerp(CORNISA - 175, CORNISA - 70, p) - Math.sin(p * Math.PI) * 120;
      $('#ma-chispa').innerHTML = `<g transform="translate(${cx} ${cy}) scale(0.6)">${perro('parada')}</g>`;
    } else $('#ma-chispa').innerHTML = '';
  },
};

ESCENAS.pierde = {
  html: lienzo(fachadaNoche('pi')),
  camara: { claves: [[INI.pierde, 1.3, -60, -180], [M.pierde, 1.3, -160, -190], [FIN('pierde'), 1.32, -165, -195]] },
  update(lt, dur, t) {
    const corre = clamp((t - INI.pierde) / (M.pierde + 0.6 - INI.pierde));
    const cx = lerp(830, 1160, ease.inOut(corre));
    $('#pi-chispa').innerHTML = cx < 1140 ? chispaCorre(cx, t) : '';
    $('#pi-mano').innerHTML = manoVentana(1, t);
    $('#pi-tu').innerHTML = tuCornisa(652, false, ease.outCubic(clamp((t - INI.pierde) / 0.5)), 1.6, t);
  },
};

// ---------- 10. No puedes gritar su nombre ----------
ESCENAS.nombre = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#10141c"/>
    <circle cx="540" cy="820" r="700" fill="url(#luzLuna)" opacity=".35"/>
    <g id="no-cara" filter="url(#ink)"></g>
    ${viñeta}`),
  fijo: `<div class="onomato" id="no-grito" style="top:170px;left:560px;font-size:150px;transform:rotate(-6deg)">¡CHIS...</div>`,
  camara: { de: { s: 1.0, x: 0, y: 0 }, a: { s: 1.12, x: 0, y: -20 }, origen: '540px 820px' },
  update(lt, dur, t) {
    const tiembla = Math.sin(t * 45) * 3;
    $('#no-cara').innerHTML = `<g transform="translate(${tiembla} 0)">${paliacate(540, 820, 300)}${cabeza(540, 820, 300, { eyeScale: 1.5, lookY: -10 })}
      <path d="M690 830 q-10 50 6 92 q14 -30 -6 -92z" fill="#bfe0ff" stroke="${INK}" stroke-width="5"/>
      ${linea([[330, 1560], [450, 1130]], 44)}${linea([[760, 1560], [640, 1135]], 44)}
      ${[[455, 1040, -10], [625, 1050, 10]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><ellipse rx="105" ry="85" fill="${INK}"/>
        ${[-66, -22, 22, 66].map(dx => `<rect x="${dx - 21}" y="-150" width="42" height="110" rx="21" fill="${INK}"/>`).join('')}
        <rect x="${a < 0 ? 80 : -150}" y="-40" width="70" height="40" rx="20" fill="${INK}"/></g>`).join('')}</g>`;
    const g = $('#no-grito'), p = clamp((t - INI.nombre - 0.15) / 0.5);
    g.style.opacity = clamp(1 - (t - INI.nombre - 0.6) / 0.6);
    escribe(g, t, INI.nombre + 0.05, 0.4);
    g.style.textDecoration = p >= 1 ? 'line-through' : 'none';
    g.style.textDecorationColor = ROJO;
  },
};

// ---------- 11. La escalerita de fierro, la azotea y la bodega ----------
const tinaco = (x, y) => `<rect x="${x - 70}" y="${y - 190}" width="140" height="190" rx="18" fill="#15171c" stroke="${INK}" stroke-width="7"/>
  <ellipse cx="${x}" cy="${y - 190}" rx="70" ry="18" fill="#22252c" stroke="${INK}" stroke-width="6"/>
  ${[0.3, 0.55, 0.8].map(k => `<path d="M${x - 70} ${y - 190 * k} q70 14 140 0" fill="none" stroke="#2b2e36" stroke-width="5"/>`).join('')}`;
const BODEGAS = [[560, '501'], [740, '502'], [920, '503']];
function azoteaEscena() {
  return `
    <rect width="1080" height="1920" fill="url(#cielo)"/>
    <circle cx="200" cy="300" r="240" fill="url(#luzLuna)"/><circle cx="200" cy="300" r="64" fill="#e9eef7"/>
    <g filter="url(#ink)">
      <rect x="-20" y="1010" width="1120" height="340" fill="#3d3a40" stroke="${INK}" stroke-width="7"/>
      ${tinaco(120, 1040)}${tinaco(290, 1050)}
      <path d="M-20 760 Q300 820 560 770 M-20 690 Q300 750 560 700" fill="none" stroke="#9aa3ad" stroke-width="4"/>
      <path id="az-sabana" d="" fill="#e8e4da" stroke="${INK}" stroke-width="5"/>
      ${BODEGAS.map(([x, n]) => `<rect x="${x - 85}" y="700" width="170" height="320" fill="#5a5560" stroke="${INK}" stroke-width="7"/>
        <rect x="${x - 95}" y="680" width="190" height="26" fill="#47434c" stroke="${INK}" stroke-width="6"/>
        <rect x="${x - 50}" y="790" width="100" height="230" fill="#3a2a20" stroke="${INK}" stroke-width="6"/>
        <text x="${x}" y="770" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" fill="#d9dee6">${n}</text>`).join('')}
      <g id="az-puerta"></g>
      <rect x="-20" y="1350" width="1120" height="70" fill="#5e5960" stroke="${INK}" stroke-width="7"/>
      <rect x="-20" y="1420" width="1120" height="520" fill="#0b0d12"/>
      <line x1="380" y1="1250" x2="380" y2="1940" stroke="#7d838c" stroke-width="12"/><line x1="470" y1="1250" x2="470" y2="1940" stroke="#7d838c" stroke-width="12"/>
      ${[1290, 1380, 1470, 1560, 1650, 1740, 1830].map(y => `<line x1="380" y1="${y}" x2="470" y2="${y}" stroke="#7d838c" stroke-width="9"/>`).join('')}
    </g>
    <g id="az-tu"></g>
    ${viñeta}`;
}
ESCENAS.azotea = {
  html: lienzo(azoteaEscena()),
  camara: { claves: [[INI.azotea, 1.25, 120, -180], [M.azoteaM, 1.2, 60, -40], [CIERRA, 1.2, -110, -10], [FIN('azotea'), 1.25, -120, -20]] },
  update(lt, dur, t) {
    const sube = clamp((t - INI.azotea) / (M.azoteaM + 0.2 - INI.azotea));   // 0 abajo de la orilla, 1 arriba
    const corre = ease.inOut(clamp((t - M.azoteaM - 0.2) / (M.encierras - M.azoteaM)));
    const v = Math.sin(t * 14);
    let s;
    if (corre <= 0) {
      const y = lerp(1700, 1190, ease.outCubic(sube)), m = Math.sin(t * 9) * 30;
      s = tuNoche({ head: [425, y - 290], r: 70, neck: [425, y - 220], hip: [425, y - 80], legL: [[400, y + 10 + m], [395, y + 80 + m]], legR: [[450, y + 10 - m], [455, y + 80 - m]],
        armL: [[390, y - 260], [385, y - 330 - m]], armR: [[460, y - 260], [465, y - 330 + m]], lookY: -14, eyeScale: 1.2 });
    } else {
      const x = lerp(425, 740, corre), y = 1180 - (1 - corre) * 0;
      s = tuNoche({ head: [x, y - 330], r: 70, neck: [x + 6, y - 260], hip: [x, y - 120], legL: [[x - 30 * v, y - 60], [x - 60 * v, y]], legR: [[x + 30 * v, y - 60], [x + 60 * v, y]],
        armL: [[x - 50 * v, y - 200], [x - 70 * v, y - 140]], armR: [[x + 50 * v, y - 200], [x + 70 * v, y - 140]], look: 20, eyeScale: 1.3 });
    }
    const dentro = t > M.encierras;
    $('#az-tu').innerHTML = dentro ? '' : s;
    const cierra = ease.inOut(clamp((t - CIERRA + 0.25) / 0.25));
    const abierta = t > M.encierras - 0.5 ? 1 - cierra : 0;
    $('#az-puerta').innerHTML = abierta > 0.01 ? `<rect x="690" y="790" width="100" height="230" fill="#07080b"/><rect x="${790 - 100 * (1 - abierta * 0.85)}" y="790" width="${100 * (1 - abierta * 0.85)}" height="230" fill="#3a2a20" stroke="${INK}" stroke-width="6"/>` : '';
    const vi = Math.sin(t * 2.3) * 30;
    $('#az-sabana').setAttribute('d', `M150 724 Q250 740 350 730 L${340 + vi * 0.4} ${930 + vi * 0.3} Q250 ${950 + vi * 0.5} ${160 + vi * 0.3} ${925 - vi * 0.3} Z`);
  },
};

// ---------- 12. Adentro de la bodega. Abajo, ellos en tu casa ----------
const abajoR = rng(29);
const abajo = [...Array(4)].map((_, i) => ({ x: 200 + i * 210 + abajoR() * 60, ph: abajoR() * 6 }));
ESCENAS.bodega = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#06070a"/>
    <g filter="url(#ink)">
      <rect x="0" y="260" width="1080" height="890" fill="#0c0e13"/>
      <rect x="40" y="620" width="230" height="520" fill="#15130f" stroke="#1f2228" stroke-width="6"/><rect x="60" y="460" width="180" height="160" fill="#18150f" stroke="#1f2228" stroke-width="6"/>
      <rect x="820" y="760" width="220" height="380" fill="#15130f" stroke="#1f2228" stroke-width="6"/>
      <line x1="300" y1="1140" x2="360" y2="560" stroke="#2a2420" stroke-width="12"/>
      <rect x="1040" y="420" width="12" height="720" fill="#9fb3d9" opacity=".4"/>
      <rect x="-20" y="1150" width="1120" height="44" fill="#2a2d33" stroke="${INK}" stroke-width="7"/>
      <rect x="0" y="1194" width="1080" height="380" fill="#151b28"/>
      <rect x="560" y="1300" width="90" height="120" rx="16" fill="#2f6fd6" opacity=".55" transform="rotate(80 605 1360)" stroke="${INK}" stroke-width="5"/>
      <path d="M520 1560 q120 -10 260 0" stroke="#5d8fd8" stroke-width="10" opacity=".5" fill="none"/>
      <rect x="-20" y="1560" width="1120" height="400" fill="#0a0c10"/>
    </g>
    <circle id="bo-luz" cx="560" cy="860" r="420" fill="#9fc3ff" opacity=".18" filter="url(#blur10)"/>
    <g id="bo-abajo" filter="url(#ink)"></g>
    <g id="bo-tu" filter="url(#ink)"></g>
    ${viñeta}`),
  camara: { claves: [[INI.bodega, 1.35, 0, 160], [M.quince, 1.5, -20, 260], [M.casa - 0.2, 1.5, -20, 260], [M.casa + 0.8, 1.0, 0, 0], [FIN('bodega'), 1.04, 0, -10]] },
  update(lt, dur, t) {
    const resp = Math.sin(t * 2.6) * 4;
    // agachada con las rodillas al pecho; el celular le ilumina la cara
    $('#bo-tu').innerHTML = `<g filter="url(#contorno)">${stick({ head: [470, 760 + resp], r: 90, neck: [480, 850], hip: [500, 1080],
      legL: [[600, 940], [610, 1140]], legR: [[580, 960], [570, 1140]], footL: 1, footR: 1,
      armL: [[580, 940], [600, 880]], armR: [[560, 970], [610, 900]], look: 22, lookY: 14, eyeScale: 1.2 })}</g>
      <g transform="translate(605 885) rotate(-12)"><rect x="-32" y="-56" width="64" height="112" rx="10" fill="#0b0f17" stroke="${INK}" stroke-width="5"/>
      <rect x="-26" y="-48" width="52" height="96" rx="6" fill="#20324f"/>
      <rect x="-14" y="-10" width="28" height="16" rx="3" fill="none" stroke="#fff" stroke-width="3"/><rect x="-12" y="-8" width="4" height="12" fill="${ROJO}"/>
      <text x="0" y="28" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="16" fill="${ROJO}">15%</text></g>`;
    $('#bo-luz').setAttribute('opacity', 0.16 + 0.03 * Math.sin(t * 3));
    // abajo: quietos, con la cara hacia arriba (en silencio miran al techo)
    $('#bo-abajo').innerHTML = abajo.map(p => infEn(p.x + Math.sin(t * 0.8 + p.ph) * 6, 1540, 300, infectadoQuieto(0, 0, -0.03))).join('');
  },
};

// ---------- 13. El celular vibra: Memo ----------
ESCENAS.vibra = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#06070a"/>
    <circle id="vb-luz" cx="540" cy="900" r="700" fill="#9fc3ff" opacity="0" filter="url(#blur10)"/>
    <g id="vb-cel">
      <rect x="260" y="300" width="560" height="1160" rx="70" fill="#0b0f17" stroke="#3a4150" stroke-width="12"/>
      <rect id="vb-pantalla" x="284" y="330" width="512" height="1100" rx="50" fill="#05070b"/>
      <g id="vb-bloqueo" opacity="0">
        <text x="540" y="560" text-anchor="middle" font-family="Oswald" font-weight="600" font-size="150" fill="#e9edef">3:26</text>
        <text x="540" y="620" text-anchor="middle" font-family="Oswald" font-weight="500" font-size="36" fill="#aebac1">sin servicio · 15%</text>
        <g id="vb-noti" opacity="0">
          <rect x="310" y="720" width="460" height="200" rx="30" fill="#1f2c34"/>
          <text x="345" y="790" font-family="Noto Color Emoji" font-size="44">🔑</text>
          <text x="410" y="785" font-family="Oswald" font-weight="700" font-size="40" fill="#e5a83b">Memo 101</text>
          <text x="740" y="785" text-anchor="end" font-family="Oswald" font-size="28" fill="#8696a0">ahora</text>
          <text id="vb-txt" x="345" y="870" font-family="Oswald" font-weight="500" font-size="44" fill="#e9edef" opacity="0">tengo a tu perra</text>
        </g>
      </g>
      ${[600, 760, 920].map(y => `<rect x="215" y="${y}" width="80" height="78" rx="34" fill="${INK}"/>`).join('')}
      <rect x="790" y="820" width="90" height="140" rx="40" fill="${INK}"/>
    </g>
    <g id="vb-ondas"></g>
    ${viñeta}`),
  camara: { claves: [[INI.vibra, 1.0, 0, 0], [M.memoN, 1.06, 0, 20], [M.tengo, 1.3, 0, 150], [FIN('vibra'), 1.36, 0, 160]] },
  update(lt, dur, t) {
    const on = t > M.vibra - 0.1, v = (t > M.vibra - 0.1 && t < M.vibra + 0.5) || (t > M.tengo - 0.1 && t < M.tengo + 0.4);
    $('#vb-cel').setAttribute('transform', v ? `translate(${Math.sin(t * 90) * 7} ${Math.cos(t * 83) * 3})` : '');
    $('#vb-bloqueo').setAttribute('opacity', on ? 1 : 0);
    $('#vb-pantalla').setAttribute('fill', on ? '#0f1a2b' : '#05070b');
    $('#vb-luz').setAttribute('opacity', on ? 0.22 : 0);
    $('#vb-noti').setAttribute('opacity', clamp((t - M.memoN + 0.1) / 0.2));
    $('#vb-txt').setAttribute('opacity', clamp((t - M.tengo + 0.05) / 0.2));
    $('#vb-ondas').innerHTML = v ? [-1, 1].map(l => [0, 1].map(k => `<path d="M${540 + l * (330 + k * 40)} ${820 - 60 - k * 20} q${l * 20} ${80 + k * 20} 0 ${160 + k * 40}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".7"/>`).join('')).join('') : '';
  },
};

// ---------- 14. La foto: Chispa, su collar azul, su placa (sin cinta: es una foto vieja) ----------
const fotoChispa = (w = 1000) => `<svg width="${w}" height="${w}" viewBox="0 0 1000 1000" style="display:block">
  <rect width="1000" height="1000" fill="#2a2420"/>
  <rect x="0" y="0" width="620" height="1000" fill="#332c26"/><line x1="620" y1="0" x2="620" y2="1000" stroke="#1d1915" stroke-width="10"/>
  <circle cx="500" cy="420" r="560" fill="#fff6e0" opacity=".16"/>
  <g transform="translate(500 360) scale(0.95)">${caraChispa({ orejasAtras: true, sinCinta: true })}</g>
  <rect width="1000" height="1000" fill="url(#vignette)"/></svg>`;
ESCENAS.foto = {
  html: `<div class="full" style="background:#05070b"></div>
    <div style="position:absolute;top:0;left:0;right:0;height:240px;background:#0b141a;display:flex;align-items:flex-end;gap:28px;padding:0 50px 40px;box-sizing:border-box;font:600 46px Inter,sans-serif;color:#e9edef">
      <span style="font-size:64px;color:#aebac1">‹</span><span>Memo 101</span><span style="margin-left:auto;font-size:36px;color:#8696a0">3:26</span></div>
    <div style="position:absolute;top:400px;left:40px">${fotoChispa(1000)}</div>
    <div class="full" id="fo-brillo" style="opacity:0;background:radial-gradient(circle at 572px 1309px, rgba(255,255,255,.9) 0, rgba(255,255,255,0) 60px)"></div>`,
  camara: { claves: [[INI.foto, 1.0, 0, 0], [M.escha, 1.04, 0, -20], [M.collar, 1.3, 0, -260], [M.placa, 2.1, 0, -880], [FIN('foto'), 2.2, 0, -930]] },
  update(lt, dur, t) {
    $('#fo-brillo').style.opacity = t > M.placa ? 0.5 + 0.5 * Math.sin((t - M.placa) * 9) : 0;
  },
};

// ---------- 15. Baja al 101. O subo yo. ----------
ESCENAS.baja = {
  html: chatPrivado('ba', 'Memo 101', '🔑', '3:27', '15%', '<div style="height:0"></div>',
    [{ texto: 'tengo a tu perra', hora: '3:26', color: '#e5a83b' },
     { texto: `<div style="width:230px;height:230px;border-radius:14px;overflow:hidden;margin-top:6px">${fotoChispa(230)}</div>`, hora: '3:26', color: '#e5a83b' },
     { texto: 'baja al 101', hora: '3:27', color: '#e5a83b' },
     { texto: 'o subo yo', hora: '3:27', color: '#e5a83b' },
     { texto: 'tengo llave de todas las bodegas', hora: '3:27', color: '#e5a83b', borde: '#e0312b' }]).replace('padding-top:110px', 'padding-top:30px').replace('<div class="pill">HOY</div>', ''),
  camara: { de: { s: 1.0, x: 0, y: 0 }, a: { s: 1.03, x: 0, y: -20 }, origen: '40px 300px' },
  update(lt, dur, t) { animaMensajes('ba', t, [INI.baja - 1, INI.baja - 1, INI.baja + 0.15, M.subo, M.llave]); },
};

// ---------- 16. Lo que te escribió Rosa ----------
ESCENAS.nota = {
  html: `<div class="full" style="background:#141a24"></div>
    <div class="papel" id="nt-papel">
      <div class="cuaderno"></div>
      <div class="tinta temblor" style="top:170px;left:90px;font-size:118px;font-weight:600">Gracias, corazón.</div>
      <div class="tinta temblor" style="top:380px;left:90px;font-size:118px;font-weight:600">Dios te lo pague.</div>
      <div class="tinta temblor" id="nt-3" style="top:650px;left:80px;font-size:104px;font-weight:700">No le abras a Memo.</div>
      ${subrayado('nt-sub', 'M90 830 q180 -14 360 4 t330 -6')}
    </div>`,
  camara: { claves: [[INI.nota, 1.0, 0, 0], [M.noabras, 1.05, 0, -20], [FIN('nota'), 1.28, 10, -250]] },
  update(lt, dur, t) {
    $('#nt-3').style.color = t > M.noabras ? '#c62828' : '';
    trazo($('#nt-sub'), t, M.noabras + 0.3, 0.4);
  },
};

// ---------- 17. ¿Qué haces? Los comentarios deciden ----------
ESCENAS.decide = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<circle cx="540" cy="960" r="900" fill="url(#luzLuna)" opacity=".12"/>`)}
    <div class="decide-tit" id="de-tit">¿QUÉ HACES?</div>
    <div class="opcion" id="de-a" style="top:560px"><span class="emo">🔑</span><span class="txt">BAJAS CON MEMO</span></div>
    <div class="opcion" id="de-b" style="top:900px"><span class="emo">🔦</span><span class="txt">BUSCAS A CHISPA</span></div>
    <div class="decide-com" id="de-com">COMENTA <span class="emo">🔑</span> O <span class="emo">🔦</span></div>
    <div class="decide-pie" id="de-pie">LA PARTE 7 LA ELIGEN USTEDES</div>`,
  update(lt, dur, t) {
    const pop = (el, t0) => { const p = clamp((t - t0) / 0.3); el.style.opacity = p; el.style.transform = `scale(${lerp(0.7, 1, ease.outBack(p))})`; };
    pop($('#de-tit'), INI.decide);
    pop($('#de-a'), INI.decide + 0.15);
    pop($('#de-b'), M.buscas - 0.1);
    pop($('#de-com'), M.comenta);
    $('#de-pie').style.opacity = clamp((t - M.comenta - 0.6) / 0.3);
    const a = t < M.buscas - 0.1, b = t >= M.buscas - 0.1 && t < M.comenta;
    $('#de-a').style.borderColor = a ? '#e5a83b' : '#fff';
    $('#de-b').style.borderColor = b ? '#9fd0ff' : '#fff';
    if (a) $('#de-a').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
    if (b) $('#de-b').style.transform += ` scale(${1 + 0.03 * Math.sin(t * 8)})`;
  },
};
