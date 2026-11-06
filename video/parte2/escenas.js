// Escenas de "La alerta", parte 2: Día 1. Los tiempos salen de tl.js.

const PARA_RELOJ = M.tambor + 0.45;  // cuando sale la pila y el reloj se calla (mezcla.py usa lo mismo)


// 1. Día 1: escribes en el cuaderno. Chispa te mira.
ESCENAS.dia1 = {
  html: `${lienzo(`
    <rect width="1080" height="1920" fill="url(#paredDia)"/>
    <rect y="1500" width="1080" height="420" fill="#1a2130"/>
    <line x1="0" y1="1500" x2="1080" y2="1500" stroke="#0f141d" stroke-width="10"/>
    <g filter="url(#ink)">
      <rect x="80" y="380" width="360" height="520" fill="url(#ventanaDia)"/>
      <ellipse cx="190" cy="470" rx="90" ry="28" fill="#d3dcea" opacity=".7"/><ellipse cx="340" cy="520" rx="70" ry="22" fill="#d3dcea" opacity=".6"/>
      <path d="M80 900 V760 h50 v-50 h60 v80 h40 v-120 h70 v100 h50 v-60 h50 v70 h40 V900z" fill="#6a7c97"/>
      <rect x="80" y="380" width="360" height="520" fill="none" stroke="#0e1219" stroke-width="16"/>
      <line x1="260" y1="380" x2="260" y2="900" stroke="#0e1219" stroke-width="12"/><line x1="80" y1="640" x2="440" y2="640" stroke="#0e1219" stroke-width="12"/>
    </g>
    <polygon points="80,900 440,900 900,1500 380,1500" fill="#dfe8f5" opacity=".06"/>
    <g filter="url(#ink)">
      <line x1="330" y1="1090" x2="330" y2="1530" stroke="${INK}" stroke-width="16"/>
      <rect x="320" y="1330" width="150" height="18" fill="#5a4030" stroke="${INK}" stroke-width="6"/>
      <line x1="460" y1="1348" x2="460" y2="1530" stroke="${INK}" stroke-width="12"/>
      <g id="d1-mono"></g>
      <rect x="390" y="1215" width="620" height="30" fill="#6a4a35" stroke="${INK}" stroke-width="8"/>
      <line x1="430" y1="1245" x2="430" y2="1520" stroke="${INK}" stroke-width="14"/><line x1="970" y1="1245" x2="970" y2="1520" stroke="${INK}" stroke-width="14"/>
      <rect x="570" y="1198" width="230" height="17" fill="#f6f3ea" stroke="${INK}" stroke-width="5"/>
      <g id="d1-mano"></g>
      <g transform="translate(850 1440) scale(-0.7 0.7)">${perro('echada')}</g>
    </g>
    ${viñeta}`)}
    <div class="dia-titulo" id="d1-tit">Día 1</div>`,
  camara: { de: { s: 1.04, x: 0, y: 0 }, a: { s: 1.12, x: -20, y: -10 }, origen: '600px 1200px' },
  update(lt, dur, t) {
    const dx = Math.sin(lt * 13) * 10, dy = Math.abs(Math.sin(lt * 9)) * -4;
    const hx = 680 + dx, hy = 1192 + dy;
    $('#d1-mono').innerHTML = stick({ head: [420, 960], r: 100, neck: [420, 1060], hip: [410, 1335],
      legL: [[530, 1340], [530, 1515]], legR: [[510, 1350], [505, 1522]], footL: 1, footR: 1,
      armL: [[500, 1160], [600, 1205]], look: 30, lookY: 22 });
    $('#d1-mano').innerHTML = linea([[420, 1100], [540, 1165], [hx, hy]], 8.5) + punto(hx, hy, 10)
      + linea([[hx, hy], [hx + 22, hy - 34]], 6, TINTA);
    escribe($('#d1-tit'), t, 0.15, 0.8);
  },
};

// 2 y 3. Las reglas, escritas en el cuaderno.
ESCENAS.regla1 = {
  html: hoja([
    { id: 'r1-tit', texto: 'REGLA 1', top: 430, size: 210, peso: 700, rot: -2 },
    { id: 'r1-a', texto: 'Si suena la alerta,', top: 760, size: 130 },
    { id: 'r1-b', texto: 'no salgas.', top: 930, size: 130 },
  ], subrayado('r1-sub', 'M190 1105 q120 -18 240 4 t250 -6')),
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.05, x: 0, y: -10 } },
  update(lt, dur, t) {
    escribe($('#r1-tit'), t, INI.regla1 + 0.05, 0.6);
    escribe($('#r1-a'), t, M.r1texto, 0.9);
    escribe($('#r1-b'), t, M.nosalgas, 0.6);
    trazo($('#r1-sub'), t, M.mata, 0.5);
  },
};

ESCENAS.regla2 = {
  html: hoja([
    { id: 'r2-tit', texto: 'REGLA 2', top: 430, size: 210, peso: 700, rot: -2 },
    { id: 'r2-a', texto: 'Si haces ruido,', top: 760, size: 130 },
    { id: 'r2-b', texto: 'ya te encontraron.', top: 930, size: 130 },
  ], subrayado('r2-sub', 'M400 1105 q140 -16 280 4 t260 -4')),
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.05, x: 0, y: -10 } },
  update(lt, dur, t) {
    escribe($('#r2-tit'), t, INI.regla2 + 0.05, 0.5);
    escribe($('#r2-a'), t, M.r2texto, 0.6);
    escribe($('#r2-b'), t, M.encontraron, 0.6);
    trazo($('#r2-sub'), t, M.encontraron + 0.6, 0.4);
  },
};

// 4. Inventario con dibujitos.
(() => {
  const filas = [
    ['agua', 'Agua', '30 litros', 'garrafon'], ['lata', 'Comida', '5 días', 'comida'], ['hueso', 'Croquetas', '12 días', 'croquetas'],
    ['pila', 'Batería', '41%', 'bateria'], ['foco', 'Luz', 'no hay', null],
  ];
  ESCENAS.inventario = {
    html: `<div class="cuaderno"></div>
      <div class="tinta" id="in-tit" style="top:210px;left:150px;font-size:100px;font-weight:700;transform:rotate(-2deg)">INVENTARIO · DÍA 1</div>
      ${filas.map(([ico, a, b], i) => `<div class="inv-fila" id="in-${i}" style="top:${470 + i * 205}px">${iconos[ico]}<span>${a}</span><span class="puntos"></span><span>${b}</span></div>`).join('')}`,
    camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.04, x: 0, y: -20 } },
    update(lt, dur, t) {
      escribe($('#in-tit'), t, INI.inventario + 0.1, 0.7);
      filas.forEach(([, , , marca], i) => escribe($('#in-' + i), t, marca ? M[marca] : M.bateria + 1.1, 0.8));
    },
  };
})();

// 5. El celular en silencio.
ESCENAS.silencio = {
  html: lienzo(`
    <defs><linearGradient id="si-pant" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b4a7a"/><stop offset="1" stop-color="#0f1a30"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="#10151f"/>
    <g filter="url(#ink)">
      <rect x="290" y="330" width="500" height="1000" rx="64" fill="#0b0f17" stroke="${INK}" stroke-width="14"/>
      <rect id="si-switch" x="274" y="520" width="16" height="70" rx="5" fill="#5b616b" stroke="${INK}" stroke-width="4"/>
    </g>
    <rect x="314" y="356" width="452" height="948" rx="44" fill="url(#si-pant)"/>
    <rect x="480" y="378" width="120" height="34" rx="17" fill="#000"/>
    <text x="720" y="400" text-anchor="end" font-family="Inter" font-weight="600" font-size="26" fill="#fff">41%</text>
    <text x="540" y="790" text-anchor="middle" font-family="Oswald" font-weight="500" font-size="170" fill="#fff">9:47</text>
    <text x="540" y="850" text-anchor="middle" font-family="Inter" font-weight="500" font-size="36" fill="#dfe6f2">sin señal</text>
    <g id="si-banner">
      <rect x="370" y="440" width="340" height="86" rx="43" fill="#1c1c1e"/>
      <path d="M418 498 v-20 a18 18 0 0 1 36 0 v20 l6 8 h-48 z M430 510 a6 6 0 0 0 12 0" fill="none" stroke="#ff453a" stroke-width="5" stroke-linejoin="round"/>
      <line x1="412" y1="466" x2="462" y2="516" stroke="#ff453a" stroke-width="5" stroke-linecap="round"/>
      <text x="482" y="497" font-family="Inter" font-weight="600" font-size="36" fill="#ff453a">Silencio</text>
    </g>
    ${viñeta}`),
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.1, x: 0, y: 40 }, origen: '540px 600px' },
  update(lt, dur, t) {
    const p = clamp((t - M.silencio) / 0.25);
    const k = p <= 0 ? 0.001 : ease.outBack(p);
    $('#si-banner').setAttribute('transform', `translate(540 483) scale(${k}) translate(-540 -483)`);
    $('#si-banner').style.opacity = p > 0 ? 1 : 0;
    $('#si-switch').setAttribute('fill', t > M.silencio ? '#ff9f0a' : '#5b616b');
  },
};

// 6. El reloj: el tic tac suena como tambor. Le quitas la pila.
(() => {
  const C = [540, 860], R = 300;
  let marcas = '';
  for (let i = 0; i < 60; i++) {
    const a = i * 6 * Math.PI / 180, l = i % 5 ? 14 : 34, w = i % 5 ? 4 : 9;
    marcas += linea([[C[0] + Math.sin(a) * (R - 26), C[1] - Math.cos(a) * (R - 26)], [C[0] + Math.sin(a) * (R - 26 - l), C[1] - Math.cos(a) * (R - 26 - l)]], w);
  }
  const num = (n, a) => `<text x="${C[0] + Math.sin(a) * 205}" y="${C[1] - Math.cos(a) * 205 + 24}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="72" fill="${INK}">${n}</text>`;
  const mano = (ang, largo, ancho, color, cola = 0) => {
    const a = ang * Math.PI / 180;
    return linea([[C[0] - Math.sin(a) * cola, C[1] + Math.cos(a) * cola], [C[0] + Math.sin(a) * largo, C[1] - Math.cos(a) * largo]], ancho, color);
  };
  ESCENAS.reloj = {
    html: lienzo(`
      <rect width="1080" height="1920" fill="url(#paredDia)"/>
      <rect width="1080" height="1920" fill="#000" opacity=".25"/>
      <g id="rl-ondas"></g>
      <g id="rl-pila" filter="url(#ink)">
        <rect x="-32" y="-80" width="64" height="160" rx="10" fill="#1c1c1c" stroke="${INK}" stroke-width="6"/>
        <rect x="-32" y="-80" width="64" height="44" rx="10" fill="#c98b2b" stroke="${INK}" stroke-width="6"/>
        <rect x="-12" y="-96" width="24" height="16" rx="4" fill="#9aa3ad" stroke="${INK}" stroke-width="5"/>
      </g>
      <g filter="url(#ink)">
        <circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="#efe9dc" stroke="${INK}" stroke-width="16"/>
        <circle cx="${C[0]}" cy="${C[1]}" r="${R - 22}" fill="none" stroke="#c9c2b2" stroke-width="4"/>
        ${marcas}${num(12, 0)}${num(3, Math.PI / 2)}${num(6, Math.PI)}${num(9, Math.PI * 1.5)}
        ${mano((9 + 47 / 60) * 30, 140, 18, INK)}${mano(47 * 6, 215, 12, INK)}
      </g>
      <g id="rl-seg"></g>
      ${punto(C[0], C[1], 16)}
      <g id="rl-brazo"></g>
      <g id="rl-onoma" font-family="Oswald" font-weight="700" fill="#fff" stroke="#000" stroke-width="10" paint-order="stroke"></g>
      ${viñeta}`),
    camara: { claves: [[INI.reloj, 1, 0, 0], [M.tambor, 1.12, 0, 30], [FIN('reloj'), 1.12, 0, 30]], origen: '540px 860px' },
    update(lt, dur, t) {
      const corre = t < PARA_RELOJ;
      const tic = Math.floor((corre ? lt : PARA_RELOJ - INI.reloj) * 2);
      $('#rl-seg').innerHTML = mano(tic * 6, 245, 5, ROJO, 50);
      const fuerza = clamp(0.25 + 0.75 * (t - INI.reloj) / (M.tambor - INI.reloj));
      let ondas = '', ono = '';
      if (corre) {
        const f = (lt * 2) % 1;
        for (const k of [0, 1]) {
          const p = f + k;
          if (p > 1.6) continue;
          ondas += `<circle cx="${C[0]}" cy="${C[1]}" r="${R + 10 + p * 170 * fuerza}" fill="none" stroke="#e9edef" stroke-width="${10 * fuerza}" opacity="${clamp(1 - p / 1.2) * fuerza}"/>`;
        }
        if (f < 0.4 && t > M.tictac - 0.6) {
          const izq = tic % 2 === 0;
          const s = 70 + 70 * fuerza;
          ono = `<text x="${izq ? 170 : 910}" y="${izq ? 520 : 1300}" text-anchor="middle" font-size="${s}" transform="rotate(${izq ? -12 : 10} ${izq ? 170 : 910} ${izq ? 520 : 1300})">${izq ? 'TIC' : 'TAC'}</text>`;
        }
      }
      $('#rl-ondas').innerHTML = ondas;
      $('#rl-onoma').innerHTML = ono;
      const p = ease.outCubic(clamp((t - PARA_RELOJ + 0.25) / 0.6));
      const px = lerp(600, 840, p), py = lerp(1080, 1400, p);
      $('#rl-pila').setAttribute('transform', `translate(${px} ${py}) rotate(${lerp(0, 38, p)})`);
      $('#rl-brazo').innerHTML = p > 0 ? linea([[1100, 1650], [960, 1500], [px + 20, py + 30]], 9) + punto(px + 20, py + 30, 13) : '';
    },
  };
})();

// 7. Cinta en la placa del collar de Chispa.
ESCENAS.cinta = {
  html: lienzo(`
    <rect width="1080" height="1920" fill="#1c2534"/>
    <g filter="url(#ink)">
      <path d="M90 1920 C120 1300 240 900 540 880 C840 900 960 1300 990 1920 Z" fill="#6e4325" stroke="${INK}" stroke-width="10"/>
      <path d="M330 420 L250 150 L470 330 Z" fill="#5a361d" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M740 330 Q900 300 930 520 Q850 470 780 470 Z" fill="#5a361d" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>
      <circle cx="540" cy="600" r="290" fill="#6e4325" stroke="${INK}" stroke-width="10"/>
      <ellipse cx="540" cy="760" rx="130" ry="92" fill="#7d4f2d" stroke="${INK}" stroke-width="9"/>
      <ellipse cx="540" cy="712" rx="42" ry="30" fill="${INK}"/>
      <path d="M540 742 v40 M500 800 q40 22 80 0" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
      <g id="ci-ojos">${punto(445, 590, 26)}${punto(635, 590, 26)}${punto(453, 580, 8, '#fff')}${punto(643, 580, 8, '#fff')}</g>
      <path d="M170 960 Q540 1050 910 960 L905 1040 Q540 1130 175 1040 Z" fill="#2f6fd6" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>
      <g id="ci-placa">
        <circle cx="540" cy="1105" r="22" fill="none" stroke="${INK}" stroke-width="14"/><circle cx="540" cy="1105" r="22" fill="none" stroke="#b8bec6" stroke-width="7"/>
        <circle cx="540" cy="1205" r="78" fill="#9aa3ad" stroke="${INK}" stroke-width="9"/>
        <text x="540" y="1218" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="34" fill="#5d636b">CHISPA</text>
        <g id="ci-cinta">
          <path d="M448 1162 L640 1150 L634 1166 L646 1182 L638 1198 L650 1214 L642 1232 L654 1250 L452 1262 L460 1246 L446 1230 L456 1214 L444 1196 L454 1180 Z" fill="#a7a69b" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
          <path d="M470 1190 L620 1182 M470 1230 L620 1222" stroke="#c9c8bc" stroke-width="6" stroke-linecap="round"/>
        </g>
      </g>
      <g id="ci-brillo" stroke="#fff" stroke-width="6" stroke-linecap="round"><path d="M650 1150 l40 -20"/><path d="M660 1205 l44 0"/><path d="M650 1258 l40 20"/><path d="M430 1150 l-40 -20"/><path d="M420 1205 l-44 0"/></g>
    </g>
    ${viñeta}`),
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.1, x: 0, y: -60 }, origen: '540px 1150px' },
  update(lt, dur, t) {
    const pegada = t > M.cinta;
    const ang = pegada ? 0 : 14 * Math.sin(lt * 7);
    $('#ci-placa').setAttribute('transform', `rotate(${ang} 540 1090)`);
    $('#ci-brillo').style.opacity = pegada ? 0 : Math.abs(Math.sin(lt * 7));
    const p = clamp((t - M.cinta) / 0.35);
    $('#ci-cinta').setAttribute('transform', `translate(448 0) scale(${Math.max(0.001, ease.outCubic(p))} 1) translate(-448 0)`);
    $('#ci-cinta').style.opacity = p > 0 ? 1 : 0;
    const parpadea = (lt % 3.1) > 2.95;
    $('#ci-ojos').setAttribute('transform', parpadea ? 'translate(0 590) scale(1 0.1) translate(0 -590)' : '');
  },
};

// 8. El grupo del edificio: escribe doña Rosa.
ESCENAS.chat = {
  html: `<div class="chat">
    <div class="status"><span>4:47</span><span>▮▮▯ 33%</span></div>
    <div class="head"><span class="back">‹</span><div class="avatar">🏢</div>
      <div><div class="title">Vecinos Edificio C</div><div class="members">86 participantes</div></div></div>
    <div class="msgs">
      <div class="pill">HOY</div>
      <div class="msg"><div class="who" style="color:#e5a83b">Memo 101</div>la puerta de abajo ya esta cerrada. no le abran a nadie<div class="t">7:02</div></div>
      <div class="msg"><div class="who" style="color:#6cc3a0">Paty 203</div>alguien vio a mi hijo??<div class="t">9:15</div></div>
      <div class="new" id="c2-nuevo">1 MENSAJE NO LEÍDO</div>
      <div class="msg" id="c2-rosa" style="outline:4px solid #d78bd1"><div class="who" style="color:#d78bd1">Rosa 402</div>hay alguien vivo? estoy sola. no tengo agua<div class="t">16:47</div></div>
    </div></div>`,
  camara: { de: { s: 1, x: 0, y: 0 }, a: { s: 1.06, x: 0, y: -30 }, origen: '540px 900px' },
  update(lt, dur, t) {
    const p = clamp((t - M.mensaje) / 0.3);
    $('#c2-rosa').style.opacity = $('#c2-nuevo').style.opacity = p;
    $('#c2-rosa').style.transform = `translateY(${(1 - ease.outCubic(p)) * 60}px)`;
    const vibra = t > M.mensaje && t < M.mensaje + 0.4 ? Math.sin(lt * 140) * 6 : 0;
    document.querySelector('#esc-chat .chat').style.transform = `translateX(${vibra}px)`;
  },
};

// 9. Recuerdo: doña Rosa te trae tamales en Navidad.
(() => {
  const colores = ['#e53935', '#43a047', '#fdd835', '#1e88e5'];
  const focos = [];
  for (let i = 0; i <= 12; i++) focos.push([280 + i * 43, 500 + Math.sin(i * 1.3) * 10]);
  for (let i = 1; i <= 10; i++) { focos.push([280 + Math.sin(i) * 8, 500 + i * 95]); focos.push([800 + Math.sin(i) * 8, 500 + i * 95]); }
  const tamal = (x, y, a) => `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="46" ry="17" fill="#e8cf8a" stroke="${INK}" stroke-width="5"/><path d="M${x - 30} ${y} h60" stroke="#c9a85e" stroke-width="4"/></g>`;
  ESCENAS.tamales = {
    html: `${lienzo(`
      <rect width="1080" height="1920" fill="#5a4436"/>
      <rect x="300" y="520" width="480" height="980" fill="#f0c27a"/>
      <rect x="380" y="600" width="320" height="700" fill="#e3ad62" opacity=".6"/>
      <rect y="1500" width="1080" height="420" fill="#3a2c24"/>
      <g filter="url(#ink)">
        <rect x="300" y="520" width="480" height="980" fill="none" stroke="${INK}" stroke-width="16"/>
        <polygon points="780,520 860,560 860,1520 780,1500" fill="#6a4a35" stroke="${INK}" stroke-width="10"/>
        ${rosa({ head: [610, 880], r: 100, neck: [610, 980], hip: [610, 1245], legL: [[598, 1360], [588, 1492]], legR: [[625, 1360], [635, 1492]],
          armL: [[560, 1090], [545, 1132]], armR: [[665, 1090], [675, 1132]], brazosAlFrente: true, look: -26 })}
        <ellipse cx="610" cy="1140" rx="130" ry="24" fill="#f0eee8" stroke="${INK}" stroke-width="7"/>
        ${tamal(560, 1118, -8)}${tamal(650, 1116, 6)}${tamal(605, 1100, 0)}
        ${stick({ head: [220, 880], r: 100, neck: [220, 980], hip: [220, 1245], legL: [[208, 1360], [198, 1492]], legR: [[235, 1360], [245, 1492]], footL: -1, footR: 1,
          armL: [[180, 1120], [172, 1220]], armR: [[320, 1080], [440, 1128]], look: 28 })}
      </g>
      <path d="M220 498 ${focos.slice(0, 13).map(f => `L${f[0]} ${f[1]}`).join(' ')}" fill="none" stroke="#2b2b2b" stroke-width="4"/>
      <g id="ta-focos">${focos.map((f, i) => `<g><circle cx="${f[0]}" cy="${f[1]}" r="28" fill="${colores[i % 4]}" opacity=".35"/><circle cx="${f[0]}" cy="${f[1]}" r="12" fill="${colores[i % 4]}" stroke="${INK}" stroke-width="3"/></g>`).join('')}</g>
      <g id="ta-vapor" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7">
        <path d="M570 1080 q-14 -30 0 -60 t0 -60"/><path d="M610 1070 q14 -30 0 -60 t0 -60"/><path d="M650 1080 q-14 -30 0 -60 t0 -60"/>
      </g>
      ${viñeta}`)}
      <div class="recuerdo" id="ta-tit">Navidad pasada</div>`,
    camara: { de: { s: 1.06, x: 0, y: 0 }, a: { s: 1.14, x: -20, y: 0 }, origen: '480px 1100px' },
    update(lt, dur, t) {
      document.querySelector('#esc-tamales .cam').style.filter = 'sepia(.55) saturate(1.25) contrast(1.05)';
      [...$('#ta-focos').children].forEach((g, i) => g.style.opacity = 0.55 + 0.45 * Math.sin(lt * 5 + i * 1.7));
      $('#ta-vapor').setAttribute('transform', `translate(0 ${-((lt * 40) % 30)})`);
      escribe($('#ta-tit'), t, INI.tamales + 0.05, 0.6);
    },
  };
})();

// 10. Corte del edificio: tú en el 502, Rosa en el 402, la escalera en medio.
(() => {
  ESCENAS.corte = {
    html: `${lienzo(`${corteEdificio('co')}
      ${viñeta}`)}
      <div class="tinta" id="co-tu" style="top:400px;left:530px;font-size:90px;font-weight:700;color:#fff;transform:rotate(-6deg)">← tú</div>
      <div class="tinta" id="co-rosa" style="top:1030px;left:540px;font-size:90px;font-weight:700;color:#fff;transform:rotate(-6deg)">← Rosa</div>`,
    camara: { claves: [
      [INI.corte, 1.02, 0, 0], [M.escaleras - 0.3, 1.06, 0, 0],
      [M.escaleras + 0.9, 1.3, -280, -170], [FIN('corte'), 1.34, -300, -180],
    ] },
    update(lt, dur, t) {
      escribe($('#co-tu'), t, INI.corte + 0.1, 0.4);
      escribe($('#co-rosa'), t, M.debajo, 0.5);
      $('#co-ruta').setAttribute('opacity', clamp((t - M.escaleras + 0.4) / 0.5));
      $('#co-inf').setAttribute('opacity', 0.55 * clamp((t - M.escaleras - 0.2) / 0.8));
    },
  };
})();

// 11. La oreja en la puerta. Del otro lado, algo respira.
ESCENAS.oreja = {
  html: lienzo(`
    <rect width="560" height="1920" fill="url(#paredDia)"/>
    <rect width="560" height="1920" fill="#000" opacity=".35"/>
    <rect x="560" width="520" height="1920" fill="#080b11"/>
    <circle cx="1010" cy="300" r="260" fill="url(#luzLuna)" opacity=".35"/>
    <rect y="1480" width="560" height="440" fill="#141a24"/>
    <rect x="560" y="1480" width="520" height="440" fill="#06080c"/>
    <g filter="url(#ink)">
      <polygon points="820,1480 820,1530 880,1530 880,1580 940,1580 940,1630 1000,1630 1000,1680 1080,1680 1080,1920 560,1920 560,1480" fill="#12161f" stroke="${INK}" stroke-width="6"/>
      <line x1="840" y1="1300" x2="1080" y2="1520" stroke="#2a2f3a" stroke-width="12"/>
      <g id="or-inf"></g>
      <g transform="translate(190 1430) scale(0.55)">${perro('echada')}</g>
      <g id="or-mono"></g>
      <rect x="530" y="470" width="56" height="1010" fill="#2b2119" stroke="${INK}" stroke-width="10"/>
      <circle cx="518" cy="1000" r="13" fill="#8a7a62" stroke="${INK}" stroke-width="5"/>
    </g>
    <rect x="560" width="520" height="1920" fill="url(#vignette)" opacity=".6"/>
    ${viñeta}`),
  camara: { claves: [
    [INI.oreja, 1, 0, 0], [M.esas, 1.05, 0, 0],
    [M.respira, 1.18, -129, 25], [FIN('oreja'), 1.22, -140, 30],
  ] },
  update(lt, dur, t) {
    const resp = Math.sin(2 * Math.PI * 0.32 * lt) * 7;
    $('#or-inf').innerHTML = infectado({ head: [700, 820 + resp], r: 100, neck: [700, 920 + resp], hip: [700, 1170],
      legL: [[690, 1320], [680, 1478]], legR: [[715, 1320], [725, 1478]], footL: -1, footR: -1,
      armL: [[660, 1050 + resp], [640, 1150]], armR: [[735, 1060 + resp], [745, 1160]], look: -40,
      headFill: 'url(#headInfectadoOscuro)', eyeScale: 1.3, ojosBrillan: true });
    $('#or-inf').style.opacity = 0.4 * clamp((t - M.esas) / 0.8) + 0.6 * clamp((t - M.respira) / 0.3);
    $('#or-inf .ojos').style.opacity = t > M.respira ? (Math.sin(lt * 23) > -0.9 ? 1 : 0.2) : 0;
    const tiembla = t > M.respira ? Math.sin(lt * 60) * 2 : 0;
    $('#or-mono').innerHTML = stick({ head: [425 + tiembla, 830], r: 100, neck: [425, 930], hip: [425, 1180],
      legL: [[410, 1330], [398, 1478]], legR: [[440, 1330], [452, 1478]], footL: 1, footR: 1,
      armL: [[380, 1080], [372, 1170]], armR: [[480, 1000], [515, 950]], look: 44, eyeScale: t > M.respira ? 1.4 : 1.2 });
  },
};

// 12. Cierre: parte 3.
ESCENAS.parte3 = {
  html: `<div class="full" style="background:#0b0f17"></div>
    ${lienzo(`<g filter="url(#ink)" id="p3-mono"></g>`)}
    <div class="p2" id="p3-txt">PARTE 3 <span>→</span></div>
    <div class="p2b" id="p3-sig">SÍGUEME</div>`,
  update(lt) {
    const ola = Math.sin(lt * 9) * 28;
    $('#p3-mono').innerHTML = stick({ head: [540, 470], r: 110, neck: [540, 580], hip: [540, 830],
      legL: [[515, 950], [500, 1060]], legR: [[565, 950], [580, 1060]], footL: -1, footR: 1,
      armL: [[495, 730], [470, 830]], armR: [[630, 600], [680 + ola, 470]], look: 0 });
    $('#p3-txt').style.transform = `scale(${lerp(0.6, 1, ease.outBack(clamp(lt / 0.35)))})`;
    $('#p3-sig').style.opacity = clamp((lt - 0.3) / 0.25);
  },
};
