// Convierte una parte en video. Toma una captura por cuadro y se la pasa a ffmpeg.
//
//   node render.js parte1/parte1.html salida/parte1_sin_audio.mp4 [fps]
//   node render.js parte1/parte1.html salida/cuadros --cuadros 3,15.2,40   (capturas sueltas)

const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const [html, salida, ...resto] = process.argv.slice(2);
  const iCuadros = resto.indexOf('--cuadros');
  const fps = parseInt(resto.find(a => /^\d+$/.test(a)) || '30', 10);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => { console.error('Error en la página:', e.message); process.exitCode = 1; });
  await page.goto('file://' + path.resolve(html));
  await page.evaluate(() => document.fonts.ready);
  const stage = page.locator('#stage');

  if (iCuadros >= 0) {
    fs.mkdirSync(salida, { recursive: true });
    for (const t of resto[iCuadros + 1].split(',').map(Number)) {
      await page.evaluate(t => render(t), t);
      await stage.screenshot({ path: `${salida}/t${t.toFixed(2)}.png` });
    }
    await browser.close();
    return;
  }

  const duracion = await page.evaluate(() => TL.duracion);
  const total = Math.ceil(duracion * fps);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', salida], { stdio: ['pipe', 'inherit', 'inherit'] });

  const inicio = Date.now();
  for (let i = 0; i < total; i++) {
    await page.evaluate(t => render(t), i / fps);
    const buf = await stage.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`cuadro ${i}/${total} (${((Date.now() - inicio) / 1000).toFixed(0)} s)`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log(`Listo: ${salida} (${total} cuadros)`);
})();
