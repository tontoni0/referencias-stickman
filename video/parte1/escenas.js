// Escenas de "La alerta", parte 1. Cada escena trae su dibujo (html),
// su cámara y su animación (update). Los tiempos salen de tl.js.


// 1. Tarjeta del gancho: 3:14 A. M.
ESCENAS.alerta = {
  html: `<div class="full" style="background:#07090d">
    <div class="full" id="a-glow" style="background:radial-gradient(circle at 50% 42%, rgba(224,49,43,.55), rgba(224,49,43,0) 62%)"></div>
    ${lienzo(poste(540, 250, 1, 420))}
    <div class="ficcion">HISTORIA DE FICCIÓN</div>
    <div class="hora" id="a-hora">3:14 <small>A. M.</small></div>
    <div class="aviso" id="a-aviso">ALERTA SÍSMICA</div>
  </div>`,
  update(lt) {
    const raiz = document.getElementById('esc-alerta');
    $('#a-glow').style.opacity = 0.35 + 0.65 * pulsoRojo(lt);
    $('#a-aviso').style.opacity = Math.floor(lt * 2.2) % 2 ? 1 : 0.35;
    const amp = lt < TL.intro ? 5 : 1.5;
    $('#a-hora').style.transform = `translate(${Math.sin(lt * 71) * amp}px, ${Math.cos(lt * 59) * amp}px)`;
    animaPoste(raiz, lt);
  },
};

// 2. La unidad habitacional de noche. Los vecinos salen.
(() => {
  const r = rng(11);
  let ventanas = '';
  for (let i = 0; i < 5; i++) for (let j = 0; j < 6; j++) {
    const on = r() < 0.68;
    ventanas += `<rect x="${195 + i * 125}" y="${670 + j * 130}" width="80" height="90" fill="${on ? '#f3c46a' : '#11161f'}" opacity="${on ? 0.85 : 1}" stroke="${INK}" stroke-width="5"/>`;
  }
  let ventanasDer = '';
  for (let i = 0; i < 2; i++) for (let j = 0; j < 6; j++) {
    const on = r() < 0.55;
    ventanasDer += `<rect x="${910 + i * 110}" y="${760 + j * 120}" width="70" height="80" fill="${on ? '#f3c46a' : '#0e131b'}" opacity="${on ? 0.7 : 1}" stroke="${INK}" stroke-width="5"/>`;
  }
  let estrellas = '';
  for (let k = 0; k < 40; k++) estrellas += punto(r() * 1080, r() * 480, 1.5 + r() * 2, '#cfd8ea');
  const tinaco = x => `<rect x="${x}" y="500" width="74" height="62" rx="10" fill="#15171b" stroke="${INK}" stroke-width="5"/><ellipse cx="${x + 37}" cy="502" rx="37" ry="9" fill="#24272c" stroke="${INK}" stroke-width="4"/>`;

  ESCENAS.unidad = {
    html: lienzo(`
      <defs><linearGradient id="u-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1222"/><stop offset="1" stop-color="#1f2a46"/></linearGradient></defs>
      <rect width="1080" height="1920" fill="url(#u-cielo)"/>${estrellas}
      <g transform="translate(0 -220)">
      <g filter="url(#ink)">
        <rect x="-60" y="820" width="230" height="720" fill="#1b2130" stroke="${INK}" stroke-width="8"/>
        <rect x="150" y="560" width="690" height="960" fill="#2a3142" stroke="${INK}" stroke-width="8"/>
        ${tinaco(220)}${tinaco(410)}${tinaco(640)}
        <rect x="150" y="560" width="690" height="80" fill="#323a4d" stroke="${INK}" stroke-width="8"/>
        <text x="495" y="618" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="50" fill="#d9dee6" opacity=".75">EDIFICIO C</text>
        ${ventanas}
        <rect x="420" y="1395" width="140" height="125" fill="#f3c46a" stroke="${INK}" stroke-width="8"/>
        <path d="M400 1395 h180 l-15 -30 h-150 z" fill="#3a4357" stroke="${INK}" stroke-width="6"/>
        <rect x="880" y="700" width="330" height="820" fill="#232a39" stroke="${INK}" stroke-width="8"/>
        ${ventanasDer}
        <rect x="-10" y="1515" width="1100" height="700" fill="#1a1f2a" stroke="${INK}" stroke-width="8"/>
        <line x1="0" y1="1580" x2="1080" y2="1580" stroke="#252c3a" stroke-width="6"/>
      </g>
      <ellipse cx="490" cy="1560" rx="230" ry="60" fill="url(#luzCalida)"/>
      <g id="u-gente"></g>
      ${poste(930, 760, 1.1, 1400)}
      </g>
      ${viñeta}`),
    camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.14, x: 0, y: -30 }, origen: '490px 1230px' },
    update(lt) {
      const raiz = document.getElementById('esc-unidad');
      animaPoste(raiz, lt);
      const colores = ['#7aa6d8', '#d88aa6', '#8fc79a', '#e0c070', '#b39ddb', '#ef9a7a', '#9fd3d0'];
      const destinos = [[760, 1690], [300, 1700], [640, 1730], [180, 1650], [860, 1640], [420, 1740], [560, 1660]];
      let g = '';
      destinos.forEach(([xd, yd], i) => {
        const t0 = 0.2 + i * 0.5;
        if (lt < t0) return;
        const p = clamp((lt - t0) / 3.2);
        const e = ease.outCubic(p);
        const x = lerp(490, xd, e), y = lerp(1512, yd, e) - Math.abs(Math.sin(lt * 9 + i)) * 5;
        g += vecino(x, y, lerp(80, 150, e), colores[i % colores.length], { look: (xd - 490) / 60 });
      });
      $('#u-gente').innerHTML = g;
    },
  };
})();

// 3. Te levantas de golpe. Chispa a los pies de la cama.
ESCENAS.cama = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#paredNoche)"/>
    <rect y="1420" width="1080" height="500" fill="#0d121b"/>
    <g filter="url(#ink)">
      <rect x="720" y="380" width="290" height="480" fill="url(#cielo)" stroke="#0a0e15" stroke-width="14"/>
      <circle cx="905" cy="480" r="36" fill="#e9eef7"/>
      <path d="M720 860 V760 h50 v-50 h60 v80 h50 v-120 h60 v90 h60 V860z" fill="#0c1324"/>
      <line x1="865" y1="380" x2="865" y2="860" stroke="#0a0e15" stroke-width="10"/>
    </g>
    <polygon points="720,860 1010,860 900,1420 460,1420" fill="#c9d6f0" opacity=".05"/>
    <rect id="c-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    <g filter="url(#ink)">
      <rect x="95" y="990" width="70" height="430" rx="10" fill="#2b2119" stroke="${INK}" stroke-width="9"/>
      <rect x="150" y="1330" width="830" height="70" fill="#2b2119" stroke="${INK}" stroke-width="9"/>
      <rect x="150" y="1250" width="830" height="85" rx="12" fill="#d9dde6" stroke="${INK}" stroke-width="9"/>
      <ellipse cx="225" cy="1222" rx="85" ry="36" fill="#e9ecf2" stroke="${INK}" stroke-width="8"/>
      <g id="c-torso">${stick({ head: [520, 880], r: 110, neck: [520, 990], hip: [520, 1255],
        armL: [[465, 1130], [430, 1222]], armR: [[580, 1130], [615, 1220]], look: 16, eyeScale: 1.3 })}</g>
      <path d="M455 1238 Q700 1215 930 1235 Q975 1250 975 1300 L975 1338 L445 1338 Z" fill="#2f4a7a" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M560 1262 q60 20 110 0 M720 1270 q60 18 120 -2" fill="none" stroke="#24395f" stroke-width="7" stroke-linecap="round"/>
      <g id="c-perro" transform="translate(850 1185) scale(-0.62 0.62)">${perro('echada')}</g>
    </g>
    ${viñeta}`),
  camara: { de: { s: 1.04, x: 0, y: 0 }, a: { s: 1.1, x: -10, y: -10 }, origen: '540px 1150px' },
  update(lt) {
    const p = clamp((lt - 0.15) / 0.42);
    const ang = lerp(-78, 0, ease.outBack(p));
    $('#c-torso').setAttribute('transform', `rotate(${ang} 520 1255)`);
    const brinco = -16 * Math.sin(Math.PI * clamp((lt - 0.35) / 0.3));
    $('#c-perro').setAttribute('transform', `translate(850 ${1185 + brinco}) scale(-0.62 0.62)`);
    $('#c-rojo').setAttribute('opacity', 0.07 * pulsoRojo(lt));
  },
};

// 4. Celular, llaves, chanclas.
(() => {
  const llave = (x, y, ang, color) => `<g transform="rotate(${ang} ${x} ${y})">
    <rect x="${x - 9}" y="${y + 30}" width="18" height="150" fill="${color}" stroke="${INK}" stroke-width="7"/>
    <path d="M${x + 9} ${y + 120} h18 v14 h-10 v12 h12 v14 h-20" fill="${color}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    <circle cx="${x}" cy="${y}" r="40" fill="${color}" stroke="${INK}" stroke-width="8"/>
    <circle cx="${x}" cy="${y - 8}" r="11" fill="#10151f" stroke="${INK}" stroke-width="5"/></g>`;
  const chancla = (x, y, ang) => `<g transform="translate(${x} ${y}) rotate(${ang}) scale(0.9)">
    <path d="M0 -160 C75 -160 85 -60 72 0 C62 80 72 155 0 165 C-72 155 -62 80 -72 0 C-85 -60 -75 -160 0 -160Z" fill="#2f6fd6" stroke="${INK}" stroke-width="9"/>
    <path d="M0 -100 L-62 -5 M0 -100 L62 -5" stroke="${INK}" stroke-width="24" stroke-linecap="round" fill="none"/>
    <path d="M0 -100 L-62 -5 M0 -100 L62 -5" stroke="#f1f1f1" stroke-width="12" stroke-linecap="round" fill="none"/></g>`;
  ESCENAS.objetos = {
    html: lienzo(`
      <rect width="1080" height="1920" fill="#10151f"/>
      <rect id="o-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
      <g filter="url(#ink)">
        <g id="o-cel">
          <rect x="430" y="300" width="220" height="410" rx="34" fill="#0b0f17" stroke="${INK}" stroke-width="10"/>
          <rect x="448" y="330" width="184" height="350" rx="18" fill="#1d3866"/>
          <text x="540" y="505" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="86" fill="#fff">3:14</text>
          <text x="540" y="560" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="24" fill="${ROJO}">ALERTA SÍSMICA</text>
        </g>
        <g id="o-llaves">
          <circle cx="540" cy="880" r="52" fill="none" stroke="${INK}" stroke-width="20"/>
          <circle cx="540" cy="880" r="52" fill="none" stroke="#b8bec6" stroke-width="10"/>
          ${llave(495, 960, 25, '#c9a43a')}${llave(590, 950, -20, '#b8bec6')}
        </g>
        <g id="o-chanclas">${chancla(445, 1340, -12)}${chancla(635, 1350, 10)}</g>
      </g>
      ${viñeta}`),
    update(lt, dur, t) {
      const pop = (id, marca, cx, cy) => {
        const p = clamp((t - marca + 0.05) / 0.28);
        const k = p <= 0 ? 0.001 : ease.outBack(p);
        const el = document.getElementById(id);
        el.setAttribute('transform', `translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`);
        el.style.opacity = p > 0 ? 1 : 0;
      };
      pop('o-cel', M.celular, 540, 505);
      pop('o-llaves', M.llaves, 540, 960);
      pop('o-chanclas', M.chanclas, 540, 1345);
      $('#o-rojo').setAttribute('opacity', 0.06 * pulsoRojo(lt));
    },
  };
})();

// 5. Chispa le gruñe a la puerta.
ESCENAS.puerta = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#paredNoche)"/>
    <rect y="1470" width="1080" height="450" fill="#0d121b"/>
    <g stroke="#182131" stroke-width="4"><line x1="0" y1="1560" x2="1080" y2="1560"/><line x1="0" y1="1680" x2="1080" y2="1680"/><line x1="0" y1="1820" x2="1080" y2="1820"/></g>
    <line x1="0" y1="1470" x2="1080" y2="1470" stroke="#0a0e15" stroke-width="10"/>
    <g filter="url(#ink)">
      <rect x="80" y="360" width="400" height="640" fill="url(#cielo)"/>
      <circle cx="380" cy="470" r="110" fill="url(#luzLuna)"/><circle cx="380" cy="470" r="42" fill="#e9eef7"/>
      <path d="M80 1000 V820 h50 v-60 h60 v90 h40 v-140 h70 v120 h50 v-70 h60 v80 h70 V1000z" fill="#0c1324"/>
      <g fill="#f3c46a"><rect x="148" y="790" width="10" height="14"/><rect x="250" y="740" width="10" height="14"/><rect x="270" y="790" width="10" height="14"/><rect x="420" y="860" width="10" height="14"/></g>
      <rect x="80" y="360" width="400" height="640" fill="none" stroke="#0a0e15" stroke-width="16"/>
      <line x1="280" y1="360" x2="280" y2="1000" stroke="#0a0e15" stroke-width="12"/><line x1="80" y1="680" x2="480" y2="680" stroke="#0a0e15" stroke-width="12"/>
    </g>
    <polygon points="80,1000 480,1000 760,1470 260,1470" fill="#c9d6f0" opacity=".05"/>
    <rect id="p-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    <g filter="url(#ink)">
      <rect x="690" y="520" width="320" height="950" fill="#2b2119" stroke="#0a0e15" stroke-width="12"/>
      <rect x="735" y="580" width="230" height="360" fill="none" stroke="#1d1611" stroke-width="8"/>
      <rect x="735" y="1000" width="230" height="400" fill="none" stroke="#1d1611" stroke-width="8"/>
      <circle cx="735" cy="980" r="14" fill="#8a7a62" stroke="#0a0e15" stroke-width="5"/>
    </g>
    <rect x="700" y="1462" width="300" height="10" fill="#f3c46a"/>
    <g filter="url(#ink)" id="p-stick">
      ${stick({ head: [360, 890], r: 122, neck: [360, 1012], hip: [360, 1300],
        legL: [[340, 1450], [318, 1600]], legR: [[385, 1450], [408, 1600]], footL: -1, footR: 1,
        armL: [[300, 1160], [302, 1258]], armR: [[430, 1170], [454, 1256]], look: 56 })}
      <rect x="304" y="1222" width="40" height="70" rx="8" fill="#0b0f17" stroke="${INK}" stroke-width="6"/>
      <rect x="310" y="1230" width="28" height="52" rx="4" fill="#9fd0ff" opacity=".9"/>
      <g stroke="${INK}" stroke-width="4" fill="none"><circle cx="458" cy="1286" r="14"/><line x1="452" y1="1298" x2="446" y2="1330"/><line x1="464" y1="1298" x2="472" y2="1326"/></g>
    </g>
    <g filter="url(#ink)"><g id="p-perro">${perro('gruñe')}</g></g>
    <g id="p-grr" stroke="#e9edef" stroke-width="5" stroke-linecap="round"><path d="M800 1380 l26 -14"/><path d="M806 1420 l30 0"/><path d="M800 1460 l26 14"/></g>
    ${viñeta}`),
  camara: { claves: [
    [INI.puerta, 1, 0, 0],
    [M.gruñe, 1.08, -59, -107],
    [M.nunca, 1.25, -117, -335],
    [FIN('puerta'), 1.3, -125, -370],
  ] },
  update(lt, dur, t) {
    const tiembla = t > M.gruñe - 0.3 ? 2.5 : 1;
    const dx = Math.sin(lt * 120) * tiembla, dy = Math.cos(lt * 97) * tiembla;
    $('#p-perro').setAttribute('transform', `translate(${605 + dx} ${1470 + dy})`);
    $('#p-grr').style.opacity = 0.35 + 0.65 * Math.abs(Math.sin(lt * 7));
    const mira = t > M.nunca ? 16 : 0;
    $('#p-stick .ojos').setAttribute('transform', `translate(0 ${mira})`);
    $('#p-rojo').setAttribute('opacity', 0.06 * pulsoRojo(lt));
  },
};

// 6. El patio visto desde la ventana: los vecinos en el punto de reunión.
(() => {
  const r = rng(5);
  let ventanas = '';
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) {
    const on = r() < 0.6;
    ventanas += `<rect x="${60 + i * 170}" y="${70 + j * 120}" width="90" height="85" fill="${on ? '#f3c46a' : '#0f141d'}" opacity="${on ? 0.75 : 1}" stroke="#0a0d13" stroke-width="6"/>`;
  }
  const colores = ['#7aa6d8', '#d88aa6', '#8fc79a', '#e0c070', '#b39ddb', '#ef9a7a', '#9fd3d0', '#c7c7c7'];
  const gente = [];
  for (let k = 0; k < 26; k++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r());
    const x = 610 + Math.cos(a) * d * 290, y = 1150 + Math.sin(a) * d * 150;
    gente.push({ x, y, h: lerp(120, 165, (y - 1000) / 300), c: colores[k % colores.length], cel: r() < 0.3, look: (r() - 0.5) * 14, ph: r() * 6 });
  }
  gente.sort((a, b) => a.y - b.y);
  const letrero = `
    <line x1="660" y1="770" x2="660" y2="1000" stroke="${INK}" stroke-width="16"/>
    <line x1="660" y1="770" x2="660" y2="1000" stroke="#9aa3ad" stroke-width="8"/>
    <rect x="575" y="640" width="170" height="135" rx="6" fill="#1e9b4b" stroke="${INK}" stroke-width="6"/>
    <g fill="#fff">
      <polygon points="660,690 645,668 675,668"/><polygon points="660,700 645,722 675,722"/>
      <polygon points="652,695 630,680 630,710"/><polygon points="668,695 690,680 690,710"/>
    </g>
    <text x="660" y="747" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="21" fill="#fff">PUNTO DE</text>
    <text x="660" y="768" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="21" fill="#fff">REUNIÓN</text>`;
  ESCENAS.patio = {
    html: lienzo(`
      <rect width="1080" height="1920" fill="#1a202c"/>
      <g filter="url(#ink)">
        <rect x="-10" y="0" width="1100" height="560" fill="#1c2230" stroke="${INK}" stroke-width="8"/>
        ${ventanas}
        <rect x="-10" y="540" width="1100" height="40" fill="#141923"/>
        <rect x="-10" y="580" width="1100" height="1400" fill="#2a3140"/>
      </g>
      <g stroke="#232a37" stroke-width="4">${[720, 880, 1060, 1260, 1480, 1720].map(y => `<line x1="0" y1="${y}" x2="1080" y2="${y}"/>`).join('')}${[180, 400, 620, 840].map(x => `<line x1="${x}" y1="580" x2="${x}" y2="1920"/>`).join('')}</g>
      <ellipse cx="270" cy="1060" rx="340" ry="200" fill="url(#luzCalida)"/>
      <g filter="url(#ink)">
        <rect x="30" y="1320" width="280" height="120" fill="#3b3328" stroke="${INK}" stroke-width="7"/>
        <circle cx="90" cy="1310" r="50" fill="#22402e" stroke="${INK}" stroke-width="6"/><circle cx="170" cy="1295" r="60" fill="#285036" stroke="${INK}" stroke-width="6"/><circle cx="250" cy="1312" r="48" fill="#22402e" stroke="${INK}" stroke-width="6"/>
        <line x1="190" y1="640" x2="190" y2="990" stroke="${INK}" stroke-width="14"/>
        <path d="M150 640 h80 l-12 -30 h-56 z" fill="#3a4357" stroke="${INK}" stroke-width="6"/>
        <circle cx="190" cy="652" r="14" fill="#f3c46a"/>
        ${letrero}
      </g>
      <g filter="url(#ink)" id="pa-gente">${gente.map(g => `<g class="vec" data-ph="${g.ph}">${vecino(g.x, g.y, g.h, g.c, { celular: g.cel, look: g.look, lookY: -6 })}</g>`).join('')}</g>
      <rect id="pa-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
      <g filter="url(#ink)">
        <path d="M0 0 H150 Q120 500 160 960 Q120 1450 150 1920 H0Z" fill="#3b3150" stroke="${INK}" stroke-width="8"/>
        <path d="M60 0 Q40 960 70 1920 M110 0 Q90 960 115 1920" stroke="#2c2440" stroke-width="6" fill="none"/>
        <path d="M1080 0 H930 Q960 500 920 960 Q960 1450 930 1920 H1080Z" fill="#3b3150" stroke="${INK}" stroke-width="8"/>
        <path d="M1020 0 Q1040 960 1010 1920 M970 0 Q990 960 965 1920" stroke="#2c2440" stroke-width="6" fill="none"/>
      </g>
      ${viñeta}`),
    camara: { claves: [
      [INI.patio, 1.12, 0, 160],
      [M.reunion, 1.2, -40, -40],
      [M.simulacros, 1.3, -60, -110],
      [FIN('patio'), 1.32, -60, -120],
    ] },
    update(lt) {
      if (!this.vecs) this.vecs = [...document.querySelectorAll('#pa-gente .vec')];
      this.vecs.forEach(v => v.setAttribute('transform', `translate(0 ${Math.sin(lt * 4.4 + +v.dataset.ph) * 3})`));
      $('#pa-rojo').setAttribute('opacity', 0.05 * pulsoRojo(lt));
    },
  };
})();

// 7. El vaso de agua: la alerta se calla y el agua no se movió.
ESCENAS.vaso = {
  html: lienzo(`
    <defs><linearGradient id="v-pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2334"/><stop offset="1" stop-color="#10161f"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#v-pared)"/>
    <polygon points="0,300 420,1180 0,1180" fill="#c9d6f0" opacity=".04"/>
    <g filter="url(#ink)">
      <rect x="-10" y="1180" width="1100" height="760" fill="#33251a" stroke="${INK}" stroke-width="8"/>
      <path d="M0 1300 q300 30 600 0 t480 10 M0 1460 q260 -20 540 10 t540 -10 M0 1640 q320 30 640 0 t440 10" stroke="#2a1e15" stroke-width="5" fill="none"/>
      <ellipse cx="560" cy="1176" rx="175" ry="22" fill="#000" opacity=".35"/>
      <path d="M390 640 L420 1160 L660 1160 L690 640" fill="rgba(190,215,250,0.07)" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
      <polygon points="405,900 675,900 660,1152 420,1152" fill="rgba(110,160,225,0.38)"/>
      <ellipse cx="540" cy="900" rx="135" ry="15" fill="rgba(175,210,245,0.55)" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="540" cy="1160" rx="120" ry="14" fill="rgba(190,215,250,0.15)" stroke="${INK}" stroke-width="6"/>
      <ellipse cx="540" cy="640" rx="150" ry="20" fill="none" stroke="${INK}" stroke-width="7"/>
      <line x1="425" y1="690" x2="448" y2="1120" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".3"/>
      <line x1="648" y1="700" x2="640" y2="820" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".25"/>
    </g>
    <rect id="v-rojo" width="1080" height="1920" fill="${ROJO}" opacity="0"/>
    ${viñeta}`),
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.2, x: 0, y: 30 }, origen: '540px 900px' },
  update(lt) {
    $('#v-rojo').setAttribute('opacity', 0.14 * clamp(1 - lt / 0.35));
  },
};

// 8. La avenida: vienen corriendo hacia el ruido.
(() => {
  const VX = 540, HZ = 780;
  const X = (L, z) => VX + L * 700 / z, Y = z => HZ + 1100 / z;
  const r = rng(23);
  let ventanas = '';
  for (const lado of [-1, 1]) for (let z = 2.2; z < 22; z *= 1.35) {
    for (let piso = 1; piso < 6; piso++) {
      const on = r() < 0.3;
      const x1 = X(lado * 1.5, z), x2 = X(lado * 1.5, z * 1.15);
      const yb = Y(z) - piso * 220 / z, yb2 = Y(z * 1.15) - piso * 220 / (z * 1.15);
      const h = 120 / z, h2 = 120 / (z * 1.15);
      ventanas += `<polygon points="${x1},${yb} ${x2},${yb2} ${x2},${yb2 - h2} ${x1},${yb - h}" fill="${on ? '#f3c46a' : '#0b0f18'}" opacity="${on ? 0.6 : 0.9}"/>`;
    }
  }
  const muro = lado => `<polygon points="${X(lado * 1.5, 40)},${Y(40)} ${X(lado * 1.5, 40)},${Y(40) - 1500 / 40} ${X(lado * 1.5, 0.9)},${Y(0.9) - 1500 / 0.9} ${X(lado * 1.5, 0.9)},${Y(0.9)}" fill="#111827" stroke="${INK}" stroke-width="6"/>`;
  const banqueta = lado => `<polygon points="${X(lado, 40)},${Y(40)} ${X(lado * 1.5, 40)},${Y(40)} ${X(lado * 1.5, 0.9)},${Y(0.9)} ${X(lado, 0.9)},${Y(0.9)}" fill="#222a38"/>`;
  let rayas = '';
  for (let z = 1.2; z < 30; z *= 1.45) {
    const z2 = z * 1.18;
    rayas += `<polygon points="${X(-0.02, z)},${Y(z)} ${X(0.02, z)},${Y(z)} ${X(0.02, z2)},${Y(z2)} ${X(-0.02, z2)},${Y(z2)}" fill="#c9c9b8" opacity=".45"/>`;
  }
  let lamparas = '';
  for (const lado of [-1, 1]) for (const z of [2.4, 4.8, 9.6, 19]) {
    const x = X(lado * 1.25, z), y = Y(z), h = 520 / z;
    lamparas += `<ellipse cx="${X(lado * 0.7, z)}" cy="${y}" rx="${420 / z}" ry="${90 / z}" fill="url(#luzCalida)"/>`;
    lamparas += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - h}" stroke="${INK}" stroke-width="${Math.max(2, 14 / z)}"/>`;
    lamparas += `<line x1="${x}" y1="${y - h}" x2="${x - lado * 60 / z}" y2="${y - h}" stroke="${INK}" stroke-width="${Math.max(2, 10 / z)}"/>`;
    lamparas += `<circle cx="${x - lado * 60 / z}" cy="${y - h + 6 / z}" r="${Math.max(3, 16 / z)}" fill="#f3c46a"/>`;
    lamparas += `<circle cx="${x - lado * 60 / z}" cy="${y - h}" r="${160 / z}" fill="url(#luzCalida)"/>`;
  }
  const corredores = [];
  for (let k = 0; k < 44; k++) {
    corredores.push({ L: (r() * 2 - 1) * 0.85, v: 1.4 + r() * 0.8, off: r() * 30, ph: r() * 6, f: 2.2 + r() * 0.8,
      desde: k < 14 ? null : M.decenas - 0.6 + (k - 14) * 0.1 });
  }
  const ZF = 15, ZN = 1.3;
  ESCENAS.avenida = {
    html: lienzo(`
      <rect width="1080" height="${HZ + 20}" fill="url(#cielo)"/>
      <path d="M0 ${HZ} V600 h80 v-60 h70 v90 h60 v-150 h90 v120 h70 v-60 h80 v90 h60 v-110 h90 v70 h70 v-40 h90 v130 h80 v-90 h90 V${HZ}z" fill="#0a0f1c"/>
      <g id="av-mundo">
        <rect y="${HZ}" width="1080" height="${1920 - HZ}" fill="#0d121b"/>
        <polygon points="${X(-1, 40)},${Y(40)} ${X(1, 40)},${Y(40)} ${X(1, 0.9)},${Y(0.9)} ${X(-1, 0.9)},${Y(0.9)}" fill="#161c27"/>
        ${banqueta(-1)}${banqueta(1)}
        <g filter="url(#ink)">${muro(-1)}${muro(1)}</g>
        ${ventanas}${rayas}${lamparas}
        <g id="av-corredores" filter="url(#ink)"></g>
      </g>
      ${viñeta}`),
    camara: { claves: [
      [INI.avenida, 1, 0, 0],
      [M.ruido, 1.06, 0, 20],
      [FIN('avenida'), 1.12, 0, 30],
    ] },
    update(lt, dur, t) {
      const lista = [];
      for (const c of corredores) {
        let z;
        if (c.desde === null) z = ZF - ((c.v * lt + c.off) % (ZF - ZN));
        else { if (t < c.desde) continue; z = ZF - c.v * 1.3 * (t - c.desde); if (z < ZN) continue; }
        lista.push({ c, z });
      }
      lista.sort((a, b) => b.z - a.z);
      let g = '';
      for (const { c, z } of lista) {
        const s = 760 / z, x = X(c.L, z) + Math.sin(lt * 3 + c.ph) * 4, y = Y(z);
        const op = clamp((ZF - z) / 2.5) * clamp(0.55 + 3 / z);
        g += `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}">${infectadoCorriendo(lt * 2 * Math.PI * c.f + c.ph)}</g>`;
      }
      $('#av-corredores').innerHTML = g;
      const sacude = t > M.decenas ? 3 : 0;
      $('#av-mundo').setAttribute('transform', `translate(${Math.sin(lt * 37) * sacude} ${Math.cos(lt * 29) * sacude})`);
    },
  };
})();

// 9. Oscuridad: alguien grita y todos los ojos voltean.
(() => {
  const r = rng(77);
  const pares = [];
  for (let k = 0; k < 34; k++) {
    const y = 220 + r() * 1250;
    pares.push({ x: 80 + r() * 920, y, s: lerp(0.6, 1.5, (y - 220) / 1250) * (0.8 + r() * 0.4), t0: r() * 0.9, d: r() * 0.15 });
  }
  ESCENAS.ojos = {
    html: `<div class="full" style="background:#040507"></div>
      ${lienzo(`<g id="oj-pares">${pares.map((p, i) => `<g class="par" data-i="${i}">
        <ellipse cx="${-17 * p.s}" cy="0" rx="${9 * p.s}" ry="${15 * p.s}" fill="#f2f2f2"/>
        <ellipse cx="${17 * p.s}" cy="0" rx="${9 * p.s}" ry="${15 * p.s}" fill="#f2f2f2"/></g>`).join('')}</g>`)}
      <div class="full" id="oj-rojo" style="background:${ROJO};opacity:0"></div>`,
    update(lt, dur, t) {
      if (!this.els) this.els = [...document.querySelectorAll('#oj-pares .par')];
      this.els.forEach((el, i) => {
        const p = pares[i];
        const vis = clamp((t - (M.grita + p.t0)) / 0.25);
        const giro = ease.outCubic(clamp((t - M.voltean - p.d) / 0.18));
        const parpadeo = Math.sin(lt * 2 + i) > 0.985 ? 0.15 : 1;
        el.setAttribute('transform', `translate(${p.x - 22 * p.s * giro} ${p.y}) scale(${1 - 0.3 * giro} ${parpadeo})`);
        el.style.opacity = vis;
      });
      $('#oj-rojo').style.opacity = 0.5 * clamp(1 - (t - M.grita) / 0.5) * (t >= M.grita ? 1 : 0);
    },
  };
})();

// 10. En el piso, con Chispa en brazos y la mano en su hocico.
ESCENAS.piso = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="url(#paredNoche)"/>
    <rect y="1490" width="1080" height="430" fill="#0d121b"/>
    <line x1="0" y1="1490" x2="1080" y2="1490" stroke="#0a0e15" stroke-width="10"/>
    <rect x="400" y="340" width="14" height="1140" fill="#c9d6f0" opacity=".35" filter="url(#blur10)"/>
    <g filter="url(#ink)">
      <line x1="20" y1="330" x2="430" y2="330" stroke="#2b2119" stroke-width="14"/>
      <path d="M30 336 H405 Q395 900 410 1478 H30 Z" fill="#3b3150" stroke="${INK}" stroke-width="8"/>
      <path d="M110 340 q-12 560 4 1135 M190 340 q14 560 -4 1135 M270 340 q-12 560 6 1135 M345 340 q12 560 -2 1135" stroke="#2c2440" stroke-width="7" fill="none"/>
      <rect x="965" y="520" width="140" height="970" fill="#2b2119" stroke="${INK}" stroke-width="10"/>
    </g>
    <rect x="975" y="1482" width="110" height="8" fill="#f3c46a" opacity=".8"/>
    <g filter="url(#ink)" id="pi-cuerpo">
      ${stick({ head: [560, 1020], r: 110, neck: [560, 1130], hip: [560, 1468],
        legL: [[800, 1262], [842, 1478]], legR: [[780, 1292], [826, 1486]], footL: 1, footR: 1, look: 34, eyeScale: 1.15 })}
      <g transform="translate(655 1335) scale(0.8)">${perro('echada')}</g>
      ${linea([[560, 1174], [600, 1335], [690, 1352]], 110 * 0.085)}${punto(690, 1352, 12)}
      ${linea([[560, 1174], [650, 1212], [772, 1292]], 110 * 0.085)}${punto(772, 1292, 13)}
    </g>
    ${viñeta}`),
  camara: { de: { s: 1.2, x: -60, y: -120 }, a: { s: 1.32, x: -80, y: -170 }, origen: '640px 1300px' },
  update(lt) {
    $('#pi-cuerpo').setAttribute('transform', `translate(0 ${Math.sin(lt * 2.2) * 3})`);
    const parpadea = (lt % 2.8) > 2.65;
    $('#pi-cuerpo .ojos').setAttribute('transform', parpadea ? 'translate(0 1018) scale(1 0.1) translate(0 -1018)' : '');
  },
};

// 11. El grupo del edificio: un solo mensaje nuevo.
ESCENAS.chat = {
  html: `<div class="chat">
    <div class="status"><span>3:40</span><span>▮▮▮ 41%</span></div>
    <div class="head"><span class="back">‹</span><div class="avatar">🏢</div>
      <div><div class="title">Vecinos Edificio C</div><div class="members">86 participantes</div></div></div>
    <div class="msgs">
      <div class="pill">HOY</div>
      <div class="msg"><div class="who" style="color:#e5a83b">Memo 101</div>bajen al punto de reunion. orden y calma 🙏<div class="t">3:14</div></div>
      <div class="msg"><div class="who" style="color:#d78bd1">Rosa 402</div>que fue eso?? no temblo<div class="t">3:16</div></div>
      <div class="msg"><div class="who" style="color:#6cc3a0">Paty 203</div>alguien vio a mi hijo??<div class="t">3:21</div></div>
      <div class="new" id="ch-nuevo">1 MENSAJE NO LEÍDO</div>
      <div class="msg last" id="ch-lalo"><div class="who" style="color:#53bdeb">Lalo 305</div>no hagan ruido. estan en las escaleras<div class="t">3:40</div></div>
    </div></div>`,
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.06, x: 0, y: -30 }, origen: '540px 1000px' },
  update(lt, dur, t) {
    const p = clamp((t - M.mensaje) / 0.3);
    const lalo = $('#ch-lalo'), nuevo = $('#ch-nuevo');
    lalo.style.opacity = nuevo.style.opacity = p;
    lalo.style.transform = `translateY(${(1 - ease.outCubic(p)) * 60}px)`;
    const vibra = t > M.mensaje && t < M.mensaje + 0.45 ? Math.sin(lt * 140) * 7 : 0;
    document.querySelector('#esc-chat .chat').style.transform = `translateX(${vibra}px)`;
    const brilla = t > M.susurro ? 0.5 + 0.5 * Math.sin(lt * 6) : 0;
    lalo.style.boxShadow = `0 0 ${40 * brilla}px rgba(224,49,43,${0.8 * brilla})`;
  },
};

// 12. Cierre: parte 2.
ESCENAS.parte2 = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<g filter="url(#ink)" id="p2-mono"></g>`)}
    <div class="p2" id="p2-txt">PARTE 2 <span>→</span></div>
    <div class="p2b" id="p2-sig">SÍGUEME</div>`,
  update(lt) {
    const ola = Math.sin(lt * 9) * 28;
    $('#p2-mono').innerHTML = stick({ head: [540, 470], r: 110, neck: [540, 580], hip: [540, 830],
      legL: [[515, 950], [500, 1060]], legR: [[565, 950], [580, 1060]], footL: -1, footR: 1,
      armL: [[495, 730], [470, 830]], armR: [[630, 600], [680 + ola, 470]], look: 0 });
    const p = ease.outBack(clamp(lt / 0.35));
    $('#p2-txt').style.transform = `scale(${lerp(0.6, 1, p)})`;
    $('#p2-sig').style.opacity = clamp((lt - 0.3) / 0.25);
  },
};
