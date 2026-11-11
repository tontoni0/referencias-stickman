// Motor de animación: muestra la escena que toca, mueve la cámara,
// pone los subtítulos y anima el trazo de tinta. Se controla con render(t).
//
// Cada parte define:
//   ESCENAS = { id: { html, fijo (capa que no mueve la cámara), camara: {de:{s,x,y}, a:{s,x,y}, origen:'x y'}, update(lt, dur, t) } }
//   TL = { duracion, escenas:[{id, inicio}], subs:[{s, e, html}], marcas:{nombre: t}, sinSubs:[[a,b]] }

const $ = sel => document.querySelector(sel);

function montar() {
  document.body.insertAdjacentHTML('afterbegin', defsSVG);
  const stage = $('#stage');
  TL.escenas.forEach((e, i) => {
    const fin = i + 1 < TL.escenas.length ? TL.escenas[i + 1].inicio : TL.duracion;
    e.fin = fin;
    const div = document.createElement('div');
    div.className = 'escena';
    div.id = 'esc-' + e.id;
    div.innerHTML = `<div class="cam">${ESCENAS[e.id].html}</div>${ESCENAS[e.id].fijo || ''}`;
    stage.appendChild(div);
    e.el = div;
    e.cam = div.querySelector('.cam');
  });
}

function render(t) {
  // trazo de tinta que "hierve" como animación a mano
  $('#inkNoise').setAttribute('seed', 1 + (Math.floor(t * 8) % 4));

  let actual = null;
  for (const e of TL.escenas) {
    const on = t >= e.inicio && t < e.fin;
    e.el.style.display = on ? 'block' : 'none';
    if (on) actual = e;
  }
  if (!actual) return;
  const esc = ESCENAS[actual.id];
  const dur = actual.fin - actual.inicio, lt = t - actual.inicio;
  const k = clamp(lt / dur);

  const c = esc.camara || {};
  let cs, cx, cy;
  if (c.claves) {
    // claves: [[t absoluto, escala, x, y], ...] con movimiento suave entre una y otra
    const ks = c.claves;
    let i = 0;
    while (i < ks.length - 1 && t >= ks[i + 1][0]) i++;
    const A = ks[i], B = ks[Math.min(i + 1, ks.length - 1)];
    const p = B[0] > A[0] ? ease.inOut(clamp((t - A[0]) / (B[0] - A[0]))) : 0;
    [cs, cx, cy] = [lerp(A[1], B[1], p), lerp(A[2], B[2], p), lerp(A[3], B[3], p)];
  } else {
    const de = c.de || { s: 1, x: 0, y: 0 }, a = c.a || de;
    const e = ease.inOut(k);
    [cs, cx, cy] = [lerp(de.s, a.s, e), lerp(de.x, a.x, e), lerp(de.y, a.y, e)];
  }
  actual.cam.style.transformOrigin = c.origen || '540px 960px';
  actual.cam.style.transform = `translate(${cx}px, ${cy}px) scale(${cs})`;
  if (esc.update) esc.update(lt, dur, t);

  // fundido corto desde negro al entrar a cada escena
  $('#fade').style.opacity = actual.sinFundido ? 0 : clamp(1 - lt / 0.12);

  // subtítulos
  const sub = $('#sub');
  // se oculta si estamos en una zona sin subtítulos o si el subtítulo empezó dentro de una
  const dentro = x => (TL.sinSubs || []).some(([a, b]) => x >= a && x < b);
  let chunk = TL.subs.find(s => t >= s.s && t < s.e);
  if (dentro(t) || (chunk && dentro(chunk.s))) chunk = null;
  if (chunk) {
    if (sub.dataset.k !== String(chunk.s)) { sub.innerHTML = chunk.html; sub.dataset.k = chunk.s; }
    const p = clamp((t - chunk.s) / 0.09);
    sub.style.opacity = 1;
    sub.style.transform = `scale(${lerp(1.18, 1, ease.outCubic(p))})`;
  } else {
    sub.style.opacity = 0;
  }
}
