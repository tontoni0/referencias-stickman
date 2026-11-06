// Corte del edificio C: tú y Chispa en el 502, doña Rosa en el 402, la escalera en medio.
// Regresa SVG. pre es el prefijo de los ids que se animan: pre-inf (silueta) y pre-ruta (camino rojo).
const escalones = (x0, y0, x1, y1, n) => {
  const dx = (x1 - x0) / n, dy = (y1 - y0) / n;
  let p = `${x0},${y0}`;
  for (let i = 0; i < n; i++) p += ` ${x0 + dx * i},${y0 + dy * (i + 1)} ${x0 + dx * (i + 1)},${y0 + dy * (i + 1)}`;
  return p;
};
const tramoA = escalones(780, 1460, 900, 1170, 8) + ' 900,1195 790,1470';
const tramoB = escalones(900, 1170, 780, 870, 8) + ' 780,895 890,1180';

function corteEdificio(pre, extra = '') {
  return `
      <rect width="1080" height="1920" fill="#0b0f17"/>
      <g filter="url(#ink)">
        <rect x="60" y="280" width="960" height="1210" fill="#141a25" stroke="${INK}" stroke-width="10"/>
        <rect x="80" y="310" width="620" height="560" fill="url(#paredDia)"/>
        <rect x="110" y="400" width="150" height="240" fill="url(#ventanaDia)" stroke="${INK}" stroke-width="8"/>
        <rect x="80" y="900" width="620" height="560" fill="#3a3040"/>
        <rect x="110" y="990" width="150" height="240" fill="#6f7f99" stroke="${INK}" stroke-width="8"/>
        <rect x="720" y="310" width="280" height="1150" fill="#0d1119"/>
        <polygon points="${tramoB}" fill="#1b2029" stroke="${INK}" stroke-width="5"/>
        <rect x="900" y="1170" width="100" height="22" fill="#2a2f3a" stroke="${INK}" stroke-width="5"/>
        <polygon points="${tramoA}" fill="#2a2f3a" stroke="${INK}" stroke-width="5"/>
        <rect x="720" y="870" width="80" height="22" fill="#2a2f3a" stroke="${INK}" stroke-width="5"/>
        <rect x="700" y="310" width="20" height="1150" fill="#3a4152" stroke="${INK}" stroke-width="5"/>
        <rect x="700" y="700" width="20" height="170" fill="#5a4030" stroke="${INK}" stroke-width="5"/>
        <rect x="700" y="1290" width="20" height="170" fill="#5a4030" stroke="${INK}" stroke-width="5"/>
        <rect x="60" y="280" width="960" height="30" fill="#3a4152" stroke="${INK}" stroke-width="6"/>
        <rect x="60" y="870" width="660" height="30" fill="#3a4152" stroke="${INK}" stroke-width="6"/>
        <rect x="60" y="1460" width="960" height="30" fill="#3a4152" stroke="${INK}" stroke-width="6"/>
        <rect x="320" y="1300" width="240" height="160" rx="22" fill="#7a3e3e" stroke="${INK}" stroke-width="7"/>
        <rect x="320" y="1150" width="62" height="310" rx="22" fill="#7a3e3e" stroke="${INK}" stroke-width="7"/>
        ${rosa({ head: [430, 1145], r: 58, neck: [430, 1203], hip: [440, 1330], legL: [[520, 1335], [525, 1452]], legR: [[505, 1342], [508, 1455]], footL: 1, footR: 1,
          armL: [[420, 1290], [480, 1312]], armR: [[465, 1282], [525, 1300]], brazosAlFrente: true, look: 6, lookY: -14 })}
        ${stick({ head: [420, 518], r: 60, neck: [420, 578], hip: [420, 718], legL: [[412, 792], [405, 866]], legR: [[428, 792], [436, 866]], footL: -1, footR: 1,
          armL: [[392, 660], [385, 720]], armR: [[448, 660], [455, 720]], look: 6, lookY: 16 })}
        <g transform="translate(570 842) scale(-0.42 0.42)">${perro('echada')}</g>
      </g>
      <g font-family="Oswald" font-weight="700" font-size="30" text-anchor="middle">
        <rect x="726" y="652" width="70" height="40" rx="6" fill="#d9dee6" stroke="${INK}" stroke-width="4"/><text x="761" y="683" fill="${INK}">502</text>
        <rect x="726" y="1242" width="70" height="40" rx="6" fill="#d9dee6" stroke="${INK}" stroke-width="4"/><text x="761" y="1273" fill="${INK}">402</text>
      </g>
      <g id="${pre}-inf" opacity="0">${infectado({ head: [955, 1042], r: 22, neck: [955, 1064], hip: [955, 1114], legL: [[951, 1142], [948, 1170]], legR: [[959, 1142], [962, 1170]],
        armL: [[942, 1100], [940, 1124]], armR: [[968, 1100], [970, 1124]], look: -6 })}</g>
      <path id="${pre}-ruta" d="M710 860 L866 1160 L710 1450" fill="none" stroke="${ROJO}" stroke-width="9" stroke-dasharray="20 14" stroke-linecap="round" opacity="0"/>
      ${extra}`;
}
