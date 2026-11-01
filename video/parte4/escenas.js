// Escenas de "La alerta", parte 4: Día 3. Chispa salta a la cornisa detrás de una paloma.
// Abre con el momento más tenso (Chispa en la cornisa, la pata resbala), se congela y rebobina.

const CORNISA = 1100;   // altura de la cara de arriba de la cornisa en la fachada de frente
const CHISPA_X = 680;   // donde está Chispa en la cornisa

// Infectados chiquitos, muy abajo, vistos desde el quinto piso.
const multitudLejos = (() => {
  const r = rng(57);
  return [...Array(18)].map(() => ({ x: 50 + r() * 980, y: 1790 + r() * 110, s: 0.7 + r() * 0.5 })).sort((a, b) => a.y - b.y);
})();
const cabecitas = (lista, rr = 14) => lista.map(p => `<g transform="translate(${p.x} ${p.y}) scale(${p.s})">
  <circle r="${rr}" fill="url(#headInfectadoOscuro)" stroke="${INK}" stroke-width="3"/>
  <ellipse cx="${-rr * 0.36}" cy="-1" rx="${rr * 0.19}" ry="${rr * 0.29}" fill="#f2f2f2"/><ellipse cx="${rr * 0.36}" cy="-1" rx="${rr * 0.19}" ry="${rr * 0.29}" fill="#f2f2f2"/></g>`).join('');

// Fachada de frente: tu ventana (502) arriba, la cornisa, la ventana de Rosa (402) y el vacío hasta el patio.
function fachadaFrente(pre) {
  return `
    <defs><linearGradient id="${pre}-vacio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a404d"/><stop offset="1" stop-color="#151920"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#${pre}-vacio)"/>
    <g filter="url(#ink)">
      <rect x="-20" y="-20" width="1120" height="1780" fill="#9c8676" stroke="${INK}" stroke-width="8"/>
      <rect x="100" y="560" width="360" height="540" fill="#46506a" stroke="${INK}" stroke-width="8"/>
      <rect x="290" y="572" width="158" height="516" fill="#8ea2bd" opacity=".6"/>
      <rect x="100" y="560" width="360" height="540" fill="none" stroke="#d9dde2" stroke-width="10"/>
      <line x1="290" y1="565" x2="290" y2="1095" stroke="#d9dde2" stroke-width="8"/>
      <rect x="100" y="1290" width="360" height="410" fill="#2a2430" stroke="${INK}" stroke-width="8"/>
      <path d="M106 1296 h348 v130 q-22 24 -44 0 q-22 24 -44 0 q-22 24 -44 0 q-22 24 -44 0 q-22 24 -44 0 q-22 24 -44 0 q-22 24 -44 0 q-21 24 -40 0 z" fill="#d8a7b5" opacity=".9"/>
      <rect x="100" y="1290" width="360" height="410" fill="none" stroke="#d9dde2" stroke-width="10"/>
      <line x1="280" y1="1295" x2="280" y2="1695" stroke="#d9dde2" stroke-width="8"/>
      <line x1="130" y1="1480" x2="200" y2="1400" stroke="#fff" stroke-width="5" opacity=".5"/>
      <rect x="80" y="1700" width="400" height="24" fill="#c4b8a8" stroke="${INK}" stroke-width="6"/>
      <rect x="975" y="-20" width="36" height="1780" fill="#7d838c" stroke="${INK}" stroke-width="6"/>
      <rect x="-20" y="${CORNISA}" width="1120" height="24" fill="#c4b8a8" stroke="${INK}" stroke-width="6"/>
      <rect x="-20" y="${CORNISA + 24}" width="1120" height="22" fill="#7d6a5e" stroke="${INK}" stroke-width="5"/>
    </g>
    <rect x="-20" y="${CORNISA + 46}" width="1120" height="26" fill="#000" opacity=".18"/>
    <g filter="url(#ink)">${cabecitas(multitudLejos)}</g>
    <g id="${pre}-tu"></g>
    <g id="${pre}-paloma"></g>
    <g id="${pre}-chispa"></g>`;
}

const chispaCornisa = (x, tiembla, lt, modo = 'parada') =>
  `<g filter="url(#ink)" transform="translate(${x + (tiembla ? Math.sin(lt * 70) * 2.5 : 0)} ${CORNISA - 73}) scale(-0.62 0.62)">${perro(modo)}</g>`;
const palomaEn = (x, y, aleteo = 0, dir = -1, s = 1) =>
  `<g filter="url(#ink)" transform="translate(${x} ${y}) scale(${dir * s} ${s})">${paloma(aleteo)}</g>`;
// Tú, asomado por la ventana. alcance 0..1 estira el brazo hacia Chispa.
const tuAsomado = (alcance, susto = 1.3) => {
  const hx = lerp(470, 610, alcance), hy = lerp(1010, 1080, alcance);
  return `<g filter="url(#ink)">${stick({ head: [300, 800], r: 85, neck: [300, 885], hip: [255, 1090],
    armL: [[230, 990], [190, 1092]], armR: [[430, 960], [hx, hy]], look: 34, lookY: 12, eyeScale: susto })}</g>`;
};

// Vista hacia abajo desde la cornisa: las patas de Chispa en la orilla, la pared que baja y el patio.
const multitudPatio = (() => {
  const r = rng(91);
  return [...Array(20)].map((_, i) => ({ x: 330 + r() * 420, y: 800 + r() * 640, s: 0.55 + r() * 0.35, d: r() * 0.9, i })).sort((a, b) => a.y - b.y);
})();
function abajoDesdeCornisa(pre) {
  let rejilla = '';
  for (let y = 760; y < 1920; y += 110) rejilla += `<line x1="0" y1="${y}" x2="1080" y2="${y}"/>`;
  for (let x = 0; x < 1100; x += 140) rejilla += `<line x1="${x}" y1="760" x2="${x}" y2="1920"/>`;
  const fila = (y, h) => {
    const k = (y - 330) / 430, l = lerp(0, 290, k), rr = lerp(1080, 790, k), w = rr - l;
    return `<rect x="${l + w * 0.12}" y="${y}" width="${w * 0.3}" height="${h}" fill="#2a2430" stroke="${INK}" stroke-width="4"/><rect x="${l + w * 0.58}" y="${y}" width="${w * 0.3}" height="${h}" fill="#2a2430" stroke="${INK}" stroke-width="4"/>`;
  };
  return `
    <rect width="1080" height="1920" fill="#474d5b"/>
    <g stroke="#3f4552" stroke-width="4">${rejilla}</g>
    <g filter="url(#ink)">
      <polygon points="0,330 1080,330 790,760 290,760" fill="#86705f" stroke="${INK}" stroke-width="6"/>
      ${fila(400, 60)}${fila(540, 40)}${fila(660, 26)}
    </g>
    <g id="${pre}-gente" filter="url(#ink)">${multitudPatio.map(p => `<g class="cab" data-i="${p.i}" transform="translate(${p.x} ${p.y}) scale(${p.s})">
      <ellipse cx="0" cy="36" rx="54" ry="27" fill="#3d4048" stroke="${INK}" stroke-width="5"/>
      <circle cx="0" cy="0" r="38" fill="url(#headInfectadoOscuro)" stroke="${INK}" stroke-width="6"/>
      <g class="ojos"><ellipse cx="-13" cy="-2" rx="6.5" ry="10" fill="#f2f2f2"/><ellipse cx="13" cy="-2" rx="6.5" ry="10" fill="#f2f2f2"/></g></g>`).join('')}</g>
    <g filter="url(#ink)">
      <rect x="-20" y="-20" width="1120" height="330" fill="#c4b8a8" stroke="${INK}" stroke-width="6"/>
      <rect x="-20" y="300" width="1120" height="34" fill="#9d8f7e" stroke="${INK}" stroke-width="6"/>
    </g>
    <g id="${pre}-patas" filter="url(#ink)"></g>
    ${viñeta}`;
}
const pataArriba = (x, y, ang = 0) => `<g transform="translate(${x} ${y}) rotate(${ang})">
  <path d="M0 -320 L0 -30" stroke="${INK}" stroke-width="86" stroke-linecap="round"/><path d="M0 -320 L0 -30" stroke="#6e4325" stroke-width="70" stroke-linecap="round"/>
  <ellipse cx="0" cy="0" rx="56" ry="40" fill="#6e4325" stroke="${INK}" stroke-width="7"/>
  <path d="M-24 4 v22 M0 6 v24 M24 4 v22" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>`;
const animaCabezas = (pre, t, desde) => document.querySelectorAll(`#${pre}-gente .cab`).forEach(g => {
  const p = multitudPatio[+g.dataset.i];
  const giro = desde === null ? 1 : ease.outCubic(clamp((t - desde - p.d) / 0.35));
  g.querySelector('.ojos').setAttribute('transform', `translate(0 ${(1 - giro) * 26}) scale(1 ${0.2 + 0.8 * giro})`);
  g.querySelector('.ojos').style.opacity = 0.15 + 0.85 * giro;
});

// Primer plano de la pata de Chispa en la orilla de la cornisa, con el vacío abajo.
const migasR = rng(5);
const migas = [...Array(8)].map(() => ({ x: 700 + migasR() * 140, vx: (migasR() - 0.5) * 120, r: 8 + migasR() * 10, g: migasR() * 360 }));
function pataCornisa(pre) {
  const lejos = [...Array(14)].map((_, k) => ({ x: 420 + Math.sin(k * 2.1) * 300, y: 1700 + (k % 5) * 40, s: 0.6 }));
  return `
    <defs><linearGradient id="${pre}-abismo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b7384"/><stop offset="1" stop-color="#1d222b"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#${pre}-abismo)"/>
    <polygon points="0,1020 300,1020 430,1920 0,1920" fill="#86705f" opacity=".9"/>
    <g opacity=".85">${cabecitas(lejos, 12)}</g>
    <g filter="url(#ink)">
      <polygon points="-20,860 1100,820 1100,940 -20,990" fill="#c4b8a8" stroke="${INK}" stroke-width="8"/>
      <polygon points="-20,990 1100,940 1100,1010 -20,1065" fill="#7d6a5e" stroke="${INK}" stroke-width="7"/>
      <path d="M330 900 l-14 30 M352 902 l-10 28 M374 904 l-6 26" stroke="#5d4f46" stroke-width="5"/>
    </g>
    <g id="${pre}-migas"></g>
    <g id="${pre}-pata" filter="url(#ink)"></g>
    ${viñeta}`;
}
const pataCerca = (x, y, ang, otraX = 330) => `
  <path d="M${otraX - 60} -60 L${otraX} 860" stroke="${INK}" stroke-width="112" stroke-linecap="round"/><path d="M${otraX - 60} -60 L${otraX} 860" stroke="#6e4325" stroke-width="94" stroke-linecap="round"/>
  <g transform="translate(${otraX} 880)"><ellipse rx="80" ry="50" fill="#6e4325" stroke="${INK}" stroke-width="8"/><path d="M-34 -12 v26 M0 -16 v30 M34 -12 v26" stroke="${INK}" stroke-width="7" stroke-linecap="round"/></g>
  <path d="M${x - 120} -60 L${x} ${y - 20}" stroke="${INK}" stroke-width="112" stroke-linecap="round"/><path d="M${x - 120} -60 L${x} ${y - 20}" stroke="#6e4325" stroke-width="94" stroke-linecap="round"/>
  <g transform="translate(${x} ${y}) rotate(${ang})"><ellipse rx="80" ry="50" fill="#6e4325" stroke="${INK}" stroke-width="8"/>
    <path d="M-34 -12 v26 M0 -16 v30 M34 -12 v26" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <path d="M-44 44 l-6 20 M-14 48 l-4 20 M16 48 l-2 20 M46 44 l2 20" stroke="#f4f1ea" stroke-width="7" stroke-linecap="round"/></g>`;
function animaPata(pre, t, tPaso, tResbala, congelar = Infinity) {
  const tt = Math.min(t, congelar);
  const paso = ease.inOut(clamp((tt - tPaso) / 0.5));
  const sl = clamp((tt - tResbala) / 0.6);
  const x = lerp(lerp(600, 720, paso), 800, ease.outCubic(sl));
  const y0 = lerp(870, 850, paso) - Math.sin(paso * Math.PI) * 60;   // el paso levanta la pata
  const y = lerp(y0, 1010, ease.inOut(sl));                          // y luego se va por la orilla
  $(`#${pre}-pata`).innerHTML = pataCerca(x, y, 35 * ease.inOut(sl));
  let m = '';
  if (tt > tResbala) {
    const d = tt - tResbala;
    for (const c of migas) m += `<rect x="${c.x + c.vx * d}" y="${975 + 1400 * d * d}" width="${c.r}" height="${c.r}" fill="#a49686" stroke="${INK}" stroke-width="2" transform="rotate(${c.g + d * 300} ${c.x + c.vx * d} ${975 + 1400 * d * d})"/>`;
  }
  $(`#${pre}-migas`).innerHTML = m;
}

// ===================== ESCENAS =====================

// 1. GANCHO: Chispa en la cornisa del quinto piso, tú estirando la mano.
ESCENAS.gancho = {
  html: lienzo(fachadaFrente('ga') + viñeta),
  camara: { claves: [[0, 1.55, -40, -230], [FIN('gancho'), 1.75, -60, -300]] },
  update(lt) {
    $('#ga-tu').innerHTML = tuAsomado(0.75);
    $('#ga-chispa').innerHTML = chispaCornisa(CHISPA_X - 20, true, lt);
    $('#ga-paloma').innerHTML = palomaEn(870, CORNISA, Math.abs(Math.sin(lt * 14)));
  },
};

// 2. Abajo hay veinte. Si ladra, la escuchan.
ESCENAS.ganchoAbajo = {
  html: lienzo(abajoDesdeCornisa('gb')),
  camara: { de: { s: 1.0, x: 0, y: 0 }, a: { s: 1.3, x: 0, y: -240 }, origen: '540px 1100px' },
  update(lt, dur, t) {
    $('#gb-patas').innerHTML = pataArriba(470, 300 + Math.sin(lt * 60) * 2) + pataArriba(610, 296);
    animaCabezas('gb', t, null);
    document.querySelectorAll('#gb-gente .ojos').forEach(o => o.style.filter = 'drop-shadow(0 0 8px #fff)');
  },
};

// 3. Si resbala... la pierdes. La pata se resbala y la imagen se congela.
ESCENAS.ganchoPata = {
  html: lienzo(pataCornisa('gp')),
  fijo: `<div class="full" id="gp-flash" style="background:#fff;opacity:0"></div>`,
  camara: { claves: [[INI.ganchoPata, 1.0, 0, 0], [FIN('ganchoPata'), 1.12, -30, -40]] },
  update(lt, dur, t) {
    const congela = FIN('ganchoPata') - 0.85;
    animaPata('gp', t, INI.ganchoPata + 0.1, M.resbalaH + 0.3, congela - 0.05);
    const cam = document.querySelector('#esc-ganchoPata .cam');
    cam.style.filter = t > congela ? 'grayscale(.75) contrast(1.25)' : '';
    $('#gp-flash').style.opacity = t > congela ? 0.7 * clamp(1 - (t - congela) / 0.25) : 0;
  },
};

// 4. Rebobinado: "20 minutos antes". Chispa regresa por la ventana.
ESCENAS.rebobina = {
  html: lienzo(fachadaFrente('re') + viñeta),
  fijo: `<div class="full" id="re-ruido"></div>
     <div class="full" style="background:repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 3px, transparent 3px 7px)"></div>
     <div class="vhs" style="top:110px;left:70px">◀◀ REW</div>
     <div class="vhs grande" id="re-txt">20 MINUTOS ANTES</div>`,
  camara: { de: { s: 1.3, x: -20, y: -150 }, a: { s: 1.1, x: 0, y: -60 } },
  update(lt, dur) {
    const p = ease.inOut(clamp(lt / dur));
    $('#re-chispa').innerHTML = p < 0.85 ? chispaCornisa(lerp(CHISPA_X, 330, p), true, lt) : '';
    $('#re-paloma').innerHTML = palomaEn(lerp(870, 1200, p), lerp(CORNISA, 500, p), Math.abs(Math.sin(lt * 30)));
    const cam = document.querySelector('#esc-rebobina .cam');
    cam.style.filter = `saturate(.35) contrast(1.3) hue-rotate(${Math.sin(lt * 9) * 12}deg)`;
    cam.style.transform += ` translateX(${Math.sin(lt * 70) * 8}px)`;
    const r = rng(Math.floor(lt * 30) + 1);
    $('#re-ruido').innerHTML = [...Array(5)].map(() => `<div style="position:absolute;left:0;right:0;top:${r() * 1920}px;height:${6 + r() * 30}px;background:rgba(255,255,255,${0.12 + r() * 0.25})"></div>`).join('');
    $('#re-txt').style.opacity = lt > 0.15 ? 1 : 0;
  },
};

// 5. Día 3: inventario con los números de antes tachados.
(() => {
  const filas = [['agua', 'Agua', '30 L', '18 L'], ['lata', 'Comida', '5 días', '3 días'], ['hueso', 'Croquetas', '12 días', '10 días'], ['pila', 'Batería', '41%', '22%']];
  ESCENAS.dia3 = {
    html: `<div class="cuaderno"></div>
      <div class="tinta" id="d3-tit" style="top:210px;left:150px;font-size:100px;font-weight:700;transform:rotate(-2deg)">INVENTARIO · DÍA 3</div>
      ${filas.map(([ico, a, antes, ahora], i) => `<div class="inv-fila" id="d3-${i}" style="top:${500 + i * 230}px">${iconos[ico]}<span>${a}</span><span class="puntos"></span><span><span class="tachado">${antes}</span>${ahora}</span></div>`).join('')}`,
    camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.05, x: 0, y: -20 } },
    update(lt, dur, t) {
      escribe($('#d3-tit'), t, INI.dia3 + 0.05, 0.6);
      [M.litros, M.comida, M.comida + 0.9, M.comida + 1.6].forEach((m, i) => escribe($('#d3-' + i), t, m, 0.7));
    },
  };
})();

// 6. Memo insiste por privado.
const chatPrivado = (pre, nombre, icono, hora, bateria, viejos, nuevos) => `<div class="chat">
    <div class="status"><span>${hora}</span><span>▮▯▯ ${bateria}</span></div>
    <div class="head"><span class="back">‹</span><div class="avatar">${icono}</div>
      <div><div class="title">${nombre}</div><div class="members">en línea</div></div></div>
    <div class="msgs" style="padding-top:110px">
      ${viejos}
      <div class="pill">HOY</div>
      ${nuevos.map((n, i) => `<div class="msg" id="${pre}-m${i}" style="${n.borde ? `outline:4px solid ${n.borde}` : ''}"><div class="who" style="color:${n.color}">${nombre}</div>${n.texto}<div class="t">${n.hora}</div></div>`).join('')}
    </div></div>`;
const animaMensajes = (pre, t, marcas) => marcas.forEach((m, i) => {
  const el = $(`#${pre}-m${i}`), p = clamp((t - m) / 0.25);
  el.style.opacity = p;
  el.style.transform = `translateY(${(1 - ease.outCubic(p)) * 50}px)`;
});

ESCENAS.chatMemo = {
  html: chatPrivado('cm', 'Memo 101', '🔑', '10:02', '22%',
    `<div class="pill">AYER</div><div class="msg"><div class="who" style="color:#e5a83b">Memo 101</div>ya vi que tienes agua<div class="t">21:12</div></div>`,
    [{ texto: 'tengo latas y planta de luz', hora: '10:02', color: '#e5a83b' },
     { texto: 'te cambio comida x un garrafon 👍', hora: '10:02', color: '#e5a83b', borde: '#e5a83b' }]),
  camara: { de: { s: 1.22, x: 0, y: 40 }, a: { s: 1.3, x: 0, y: 50 }, origen: '40px 600px' },
  update(lt, dur, t) { animaMensajes('cm', t, [INI.chatMemo + 0.25, M.latas]); },
};

// 7. Rosa te escribe lo que vio.
ESCENAS.chatRosa = {
  html: chatPrivado('cr', 'Rosa 402', '🌸', '10:09', '22%', '',
    [{ texto: 'la noche de la alerta memo cerro la puerta del edificio', hora: '10:09', color: '#d78bd1' },
     { texto: 'con la gente afuera. yo lo vi', hora: '10:09', color: '#d78bd1', borde: '#e0312b' }]),
  camara: { de: { s: 1.22, x: 0, y: 40 }, a: { s: 1.3, x: 0, y: 50 }, origen: '40px 600px' },
  update(lt, dur, t) { animaMensajes('cr', t, [M.noche, M.afuera]); },
};

// 8. Recuerdo en rojo: Memo echa llave mientras los vecinos golpean el vidrio.
(() => {
  const r = rng(13);
  const vecinos = [...Array(6)].map((_, i) => ({ x: 260 + i * 110 + r() * 30, y: 760 + r() * 120, rr: 48 + r() * 14, f: r() * 6 }));
  ESCENAS.recuerdo = {
    html: lienzo(`
      <rect width="1080" height="1920" fill="#2b2222"/>
      <rect y="1500" width="1080" height="420" fill="#1c1515"/>
      <g filter="url(#ink)">
        <rect x="200" y="420" width="680" height="1080" fill="#0d1119" stroke="#c9ccd2" stroke-width="16"/>
        <g id="re-vecinos"></g>
        <rect x="200" y="420" width="680" height="1080" fill="rgba(160,190,220,.12)"/>
        <line x1="540" y1="420" x2="540" y2="1500" stroke="#c9ccd2" stroke-width="14"/>
        <rect x="200" y="420" width="680" height="1080" fill="none" stroke="${INK}" stroke-width="6"/>
        <g id="re-memo"></g>
      </g>
      <g id="re-grano"></g>
      ${viñeta}`),
    fijo: `<div class="recuerdo" style="top:150px;color:#ffd9d9">La noche de la alerta</div>`,
    camara: { de: { s: 1.05, x: 0, y: 0 }, a: { s: 1.15, x: 0, y: -30 }, origen: '540px 950px' },
    update(lt) {
      document.querySelector('#esc-recuerdo .cam').style.filter = 'sepia(1) hue-rotate(-50deg) saturate(3.2) contrast(1.1) brightness(.9)';
      $('#re-vecinos').innerHTML = vecinos.map(v => {
        const g = Math.sin(lt * 16 + v.f) * 10;
        return cabeza(v.x, v.y, v.rr, { eyeScale: 1.4, sinBrillo: true }) +
          punto(v.x - v.rr * 0.9, v.y + v.rr * 1.4 + g, v.rr * 0.24) + punto(v.x + v.rr * 0.9, v.y + v.rr * 1.3 - g, v.rr * 0.24);
      }).join('');
      const giro = clamp((lt - 0.8) / 0.4) * 90;
      $('#re-memo').innerHTML = memo({ head: [720, 900], r: 110, neck: [720, 1010], hip: [730, 1290], legL: [[715, 1400], [705, 1500]], legR: [[745, 1400], [755, 1500]], footL: -1, footR: -1,
        armL: [[640, 1110], [570, 1090]], armR: [[790, 1150], [800, 1250]], brazosAlFrente: true, look: -40 }) +
        `<g transform="rotate(${giro} 565 1090)"><rect x="555" y="1060" width="20" height="60" rx="6" fill="#e0c060" stroke="${INK}" stroke-width="4"/></g>`;
      const rg = rng(Math.floor(lt * 24) + 3);
      $('#re-grano').innerHTML = [...Array(30)].map(() => `<rect x="${rg() * 1080}" y="${rg() * 1920}" width="3" height="${4 + rg() * 30}" fill="#fff" opacity=".18"/>`).join('');
    },
  };
})();

// 9. Regla 3.
ESCENAS.regla3 = {
  html: hoja([
    { id: 'r3-tit', texto: 'REGLA 3', top: 400, size: 210, peso: 700, rot: -2 },
    { id: 'r3-a', texto: 'Desconfía de quien', top: 730, size: 128 },
    { id: 'r3-b', texto: 'sobrevivió', top: 890, size: 128 },
    { id: 'r3-c', texto: 'demasiado fácil.', top: 1050, size: 128 },
  ], subrayado('r3-sub', 'M190 1225 q140 -16 290 4 t300 -6')),
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.05, x: 0, y: -10 } },
  update(lt, dur, t) {
    escribe($('#r3-tit'), t, INI.regla3 + 0.05, 0.6);
    escribe($('#r3-a'), t, M.desconfia, 0.6);
    escribe($('#r3-b'), t, M.desconfia + 0.7, 0.5);
    escribe($('#r3-c'), t, M.desconfia + 1.3, 0.6);
    trazo($('#r3-sub'), t, M.desconfia + 2.0, 0.4);
  },
};

// 10 y 11. Una paloma se para en la ventana. Chispa salta.
const ventanaAdentro = pre => `
  <rect width="1080" height="1920" fill="url(#paredDia)"/>
  <rect y="1500" width="1080" height="420" fill="#1a2130"/>
  <g filter="url(#ink)">
    <rect x="140" y="380" width="800" height="700" fill="url(#ventanaDia)" stroke="#0e1219" stroke-width="16"/>
    <path d="M140 1080 V900 h70 v-60 h80 v90 h60 v-140 h90 v120 h70 v-70 h80 v80 h90 v-110 h80 v130 h80 V1080z" fill="#9aa8bd"/>
    <line x1="540" y1="380" x2="540" y2="1080" stroke="#0e1219" stroke-width="12"/>
    <rect x="110" y="1075" width="860" height="36" fill="#c4b8a8" stroke="${INK}" stroke-width="8"/>
  </g>
  <g id="${pre}-paloma"></g><g id="${pre}-chispa"></g><g id="${pre}-extra"></g>`;

ESCENAS.paloma = {
  html: lienzo(ventanaAdentro('pa') + viñeta),
  camara: { de: { s: 1.0, x: 0, y: 0 }, a: { s: 1.12, x: 0, y: -40 }, origen: '540px 1150px' },
  update(lt, dur, t) {
    const p = ease.outCubic(clamp((t - M.paloma + 0.2) / 1.1));
    const x = lerp(1100, 650, p), y = lerp(260, 1075, p) - Math.sin(p * Math.PI) * 80;
    const bob = p >= 1 ? Math.max(0, Math.sin(lt * 9)) * 6 : 0;
    $('#pa-paloma').innerHTML = palomaEn(x, y + bob, p < 1 ? Math.abs(Math.sin(lt * 22)) : 0, -1, 1.3);
    const atenta = t > M.paloma + 0.6;
    $('#pa-chispa').innerHTML = `<g filter="url(#ink)" transform="translate(330 ${1382 - (atenta ? 8 : 0)}) scale(1.1)">${perro('parada')}</g>`;
    $('#pa-extra').innerHTML = atenta ? `<text x="460" y="1180" font-family="Oswald" font-weight="700" font-size="110" fill="${ROJO}" stroke="${INK}" stroke-width="6" paint-order="stroke">!</text>` : '';
  },
};

ESCENAS.salta = {
  html: lienzo(ventanaAdentro('sa') + viñeta),
  camara: { de: { s: 1.12, x: 0, y: -40 }, a: { s: 1.2, x: -30, y: -60 }, origen: '540px 1150px' },
  update(lt, dur) {
    const p = ease.inOut(clamp(lt / 0.8));
    const x = lerp(330, 860, p), y = lerp(1382, 1000, p) - Math.sin(p * Math.PI) * 300;
    let lineas = '';
    if (p > 0 && p < 1) for (let k = 0; k < 5; k++) lineas += `<line x1="${x - 160 - k * 30}" y1="${y - 40 + k * 22}" x2="${x - 300 - k * 30}" y2="${y - 10 + k * 26}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>`;
    $('#sa-chispa').innerHTML = p < 1 ? lineas + `<g filter="url(#ink)" transform="translate(${x} ${y}) rotate(${lerp(-25, 10, p)}) scale(1.1)">${perro('parada')}</g>` : '';
    const v = clamp(lt / 0.9);
    $('#sa-paloma').innerHTML = palomaEn(lerp(650, 1150, v), lerp(1075, 300, v), Math.abs(Math.sin(lt * 26)), 1, 1.3);
    const brazo = ease.outCubic(clamp((lt - 0.5) / 0.4));
    $('#sa-extra').innerHTML = brazo > 0 ? `<g filter="url(#ink)">${linea([[-40, 1920], [180, 1500], [lerp(200, 520, brazo), lerp(1500, 1180, brazo)]], 14)}${punto(lerp(200, 520, brazo), lerp(1500, 1180, brazo), 20)}</g>` : '';
  },
};

// 12. Ahora está en la cornisa. Tiembla.
ESCENAS.cornisa = {
  html: lienzo(fachadaFrente('co') + viñeta),
  camara: { claves: [[INI.cornisa, 1.0, 0, 0], [M.tiembla, 1.55, -150, -280], [FIN('cornisa'), 1.65, -170, -310]] },
  update(lt, dur, t) {
    $('#co-tu').innerHTML = `<g filter="url(#ink)">${cabeza(300, 820, 85, { look: 34, eyeScale: 1.5 })}${paliacate(300, 820, 85)}</g>`;
    $('#co-chispa').innerHTML = chispaCornisa(CHISPA_X, t > M.tiembla - 0.3, lt);
    $('#co-paloma').innerHTML = palomaEn(870, CORNISA, 0);
  },
};

// 13. Abajo, veinte cabezas giran hacia arriba.
ESCENAS.cabezas = {
  html: lienzo(abajoDesdeCornisa('cb')),
  camara: { de: { s: 1.0, x: 0, y: 0 }, a: { s: 1.35, x: 0, y: -260 }, origen: '540px 1100px' },
  update(lt, dur, t) {
    $('#cb-patas').innerHTML = pataArriba(470, 300 + Math.sin(lt * 60) * 2) + pataArriba(610, 296 + Math.cos(lt * 55) * 2);
    animaCabezas('cb', t, M.giran - 0.2);
  },
};

// 14. Sacas medio cuerpo por la ventana. Chispa, ven. Despacio.
ESCENAS.alcanzar = {
  html: lienzo(fachadaFrente('al') + viñeta),
  camara: { claves: [[INI.alcanzar, 1.15, 0, -120], [M.ven, 1.5, -40, -230], [FIN('alcanzar'), 1.6, -50, -260]] },
  update(lt, dur, t) {
    const sale = ease.outCubic(clamp(lt / 0.8));
    const estira = ease.inOut(clamp((t - M.ven) / 0.8));
    $('#al-tu').innerHTML = tuAsomado(0.2 * sale + 0.55 * estira);
    const acerca = ease.inOut(clamp((t - M.despacio) / 1.2));
    $('#al-chispa').innerHTML = chispaCornisa(CHISPA_X - 25 * acerca, true, lt);
    $('#al-paloma').innerHTML = palomaEn(870, CORNISA, 0);
  },
};

// 15. La paloma aletea. Chispa gruñe. Va a ladrar.
ESCENAS.grune = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#ventanaDia)"/>
    <rect y="1250" width="1080" height="700" fill="#9c8676"/>
    <g id="gr-chispa" filter="url(#ink)"></g>
    <g id="gr-paloma"></g>
    <rect id="gr-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`),
  camara: { claves: [[INI.grune, 1.0, 0, 0], [M.ladrar, 1.15, 40, 40], [FIN('grune'), 1.25, 50, 60]], origen: '480px 820px' },
  update(lt, dur, t) {
    const gr = t > M.gruneM - 0.1;
    const boca = !gr ? 0 : t < M.ladrar ? 0.22 : lerp(0.22, 0.75, ease.outCubic(clamp((t - M.ladrar) / 0.8)));
    const tiembla = gr ? Math.sin(lt * 60) * 3 : 0;
    $('#gr-chispa').innerHTML = `<g transform="translate(${430 + tiembla} 860) scale(0.95)">${caraChispa({ boca, ceno: gr, orejasAtras: !gr })}</g>`;
    const aleteo = t > M.aletea - 0.1 ? Math.abs(Math.sin(lt * 24)) : 0;
    $('#gr-paloma').innerHTML = palomaEn(880, 520 - aleteo * 30, aleteo, -1, 1.8);
    const latido = Math.pow(Math.max(0, Math.sin(lt * Math.PI * 2.4)), 8);
    $('#gr-rojo').setAttribute('opacity', t > M.ladrar ? 0.12 + 0.12 * latido : 0.06 * latido);
  },
};

// 16. Da un paso. La pata resbala.
ESCENAS.resbala = {
  html: lienzo(pataCornisa('rs')),
  camara: { claves: [[INI.resbala, 1.0, 0, 0], [M.pata, 1.08, 0, 0], [FIN('resbala'), 1.25, -40, -90]] },
  update(lt, dur, t) {
    animaPata('rs', t, M.paso, M.pata + 0.15);
    const sac = t > M.pata + 0.15 && t < M.pata + 0.8 ? 10 : 0;
    document.querySelector('#esc-resbala .cam').style.transform += ` translate(${Math.sin(lt * 80) * sac}px, ${Math.cos(lt * 67) * sac}px)`;
  },
};

// 17. La agarras del collar. La placa con cinta no hace ni un ruido.
ESCENAS.collar = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#ventanaDia)"/>
    <g filter="url(#ink)"><g transform="translate(540 500) scale(1.25)">${caraChispa({ orejasAtras: true })}</g></g>
    <g id="co2-mano" filter="url(#ink)"></g>
    ${viñeta}`),
  camara: { claves: [[INI.collar, 1.0, 0, 0], [M.placa, 1.15, 0, -120], [FIN('collar'), 1.3, 0, -220]], origen: '540px 1100px' },
  update(lt, dur, t) {
    const p = ease.outCubic(clamp((t - M.agarras + 0.05) / 0.22));
    const hx = lerp(-150, 470, p), hy = lerp(1350, 1010, p) + (p >= 1 ? Math.sin(lt * 40) * 4 : 0);
    $('#co2-mano').innerHTML = `<path d="M-200 1700 L${hx} ${hy}" stroke="${INK}" stroke-width="40" stroke-linecap="round"/>
      <circle cx="${hx}" cy="${hy}" r="64" fill="${INK}"/>
      ${[-40, 0, 40].map(d => `<circle cx="${hx + 52}" cy="${hy + d}" r="22" fill="${INK}"/>`).join('')}`;
    const brilla = clamp((t - M.placa) / 0.4);
    document.querySelector('#esc-collar .placa').style.filter = brilla ? `drop-shadow(0 0 ${30 * brilla}px rgba(255,255,255,.95))` : '';
  },
};

// 18. La jalas hacia adentro. Te lame la cara. No puedes dejar de temblar.
ESCENAS.adentro = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#paredDia)"/>
    <circle cx="540" cy="900" r="700" fill="url(#luzCalida)" opacity=".7"/>
    <rect y="1480" width="1080" height="440" fill="#1a2130"/>
    <g id="ad-todo" filter="url(#ink)"></g>
    ${viñeta}`),
  camara: { claves: [[INI.adentro, 1.0, 0, 0], [M.temblar, 1.12, 0, -30], [FIN('adentro'), 1.15, 0, -40]], origen: '540px 950px' },
  update(lt, dur, t) {
    const tiembla = t > M.temblar - 0.2 ? 5 : 1.5;
    const tx = Math.sin(lt * 50) * tiembla, ty = Math.cos(lt * 43) * tiembla;
    const lame = t > M.lame - 0.1 ? 0.5 + 0.5 * Math.sin((t - M.lame) * 8) : 0;
    let s = `<g transform="translate(${tx} ${ty})">${paliacate(330, 900, 230)}${cabeza(330, 900, 230, { look: 40, eyeScale: 1.35 })}</g>`;
    s += `<g transform="translate(760 840) rotate(-32) scale(0.72)">${caraChispa({ lengua: 0.35 + 0.65 * lame, parpadeo: lame > 0.5 })}</g>`;
    if (lame > 0.3) s += `<path d="M560 980 q30 -20 20 -60 M590 1010 q40 -10 40 -50" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/>`;
    if (t > M.temblar - 0.2) s += [0, 1, 2].map(k => `<path d="M${70 + k * 20} ${780 + k * 70} q-20 30 0 60" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`).join('');
    $('#ad-todo').innerHTML = s;
  },
};

// 19. Esa noche, a las 3:14, la alerta suena otra vez. El piso no se mueve.
ESCENAS.alerta = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#paredNoche)"/>
    <g filter="url(#ink)"><rect x="140" y="260" width="800" height="760" fill="url(#cielo)" stroke="#0a0e15" stroke-width="16"/></g>
    <g id="al2-poste">${poste(700, 470, 0.8, 600)}</g>
    <g filter="url(#ink)"><rect x="140" y="260" width="800" height="760" fill="none" stroke="#0a0e15" stroke-width="16"/><line x1="540" y1="260" x2="540" y2="1020" stroke="#0a0e15" stroke-width="12"/></g>
    <rect id="al2-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    <g filter="url(#ink)">
      <rect x="-20" y="1230" width="1120" height="720" fill="#33251a" stroke="${INK}" stroke-width="8"/>
      <ellipse cx="380" cy="1236" rx="120" ry="16" fill="#000" opacity=".35"/>
      <path d="M290 860 L310 1230 L450 1230 L470 860" fill="rgba(190,215,250,0.08)" stroke="${INK}" stroke-width="7"/>
      <polygon points="300,1030 460,1030 450,1226 310,1226" fill="rgba(110,160,225,0.38)"/>
      <ellipse cx="380" cy="1030" rx="80" ry="10" fill="rgba(175,210,245,0.55)" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="380" cy="860" rx="90" ry="14" fill="none" stroke="${INK}" stroke-width="6"/>
      <rect x="640" y="1150" width="260" height="80" rx="14" fill="#0b0f17" stroke="${INK}" stroke-width="7"/>
      <rect x="652" y="1160" width="236" height="60" rx="8" fill="#1d3866"/>
      <text x="770" y="1206" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="46" fill="#fff">3:14</text>
    </g>
    ${viñeta}`),
  camara: { claves: [[INI.alerta, 1.0, 0, 0], [M.mueve - 0.2, 1.05, 0, 0], [M.mueve + 0.8, 1.45, 230, -170], [FIN('alerta'), 1.5, 240, -180]], origen: '540px 1000px' },
  update(lt, dur, t) {
    const suena = t > M.suena - 0.3;
    animaPoste(document.getElementById('esc-alerta'), lt, suena);
    $('#al2-rojo').setAttribute('opacity', suena ? 0.1 * pulsoRojo(lt) : 0);
  },
};

// 20. Cierre: parte 5.
ESCENAS.parte5 = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<g filter="url(#ink)" id="p5-mono"></g>`)}
    <div class="p2" id="p5-txt">PARTE 5 <span>→</span></div>
    <div class="p2b" id="p5-sig">SÍGUEME</div>`,
  update(lt) {
    const ola = Math.sin(lt * 9) * 28;
    $('#p5-mono').innerHTML = stick({ head: [540, 470], r: 110, neck: [540, 580], hip: [540, 830],
      legL: [[515, 950], [500, 1060]], legR: [[565, 950], [580, 1060]], footL: -1, footR: 1,
      armL: [[495, 730], [470, 830]], armR: [[630, 600], [680 + ola, 470]], look: 0 }) +
      `<g transform="translate(760 1000) scale(-0.7 0.7)">${perro('echada')}</g>`;
    $('#p5-txt').style.transform = `scale(${lerp(0.6, 1, ease.outBack(clamp(lt / 0.35)))})`;
    $('#p5-sig').style.opacity = clamp((lt - 0.3) / 0.25);
  },
};
