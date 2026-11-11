# Código de los videos

Todo se dibuja con código, sin generador de imágenes. Las escenas son SVG que se animan en Chromium. Playwright toma una captura por cuadro y ffmpeg arma el video. El flujo completo para hacer un episodio está en `../CLAUDE.md`.

## Dependencias

| Programa | Versión probada | Para qué |
|---|---|---|
| Node | 22 (sirve 18 o más) | `render.js` |
| Playwright + Chromium | 1.63.0 | Dibuja cada cuadro |
| Python | 3.13 (sirve 3.10 o más), solo librería estándar | Línea de tiempo, mezcla, pausas, resumen |
| ffmpeg | 6.1 con libx264 y AAC | Video, efectos de sonido, mezcla |

```
npm install
npx playwright install chromium     # no hace falta en la nube de Claude Code
```

## Regenerar un episodio

```
./hacer_parte1.sh               # deja el video en salida/la_alerta_parte1.mp4 (no se sube a git)
./hacer_parte1.sh --publicar    # además lo copia a ../episodios/parte-01-la-alerta/ y regenera escenas.md y la hoja
```

Cada parte tarda unos 4 a 5 minutos (unos 2,000 cuadros).

## Revisar sin renderizar todo

```
node render.js parte3/parte3.html /tmp/cuadros --cuadros 0.3,5.8,29
```

## Piezas

| Archivo | Qué hace |
|---|---|
| `lib/dibujo.js` | Personajes, degradados y filtros |
| `lib/motor.js` | Escena activa, cámara, subtítulos, fundido, trazo animado |
| `lib/escena_base.js` | Ayudas para escribir escenas |
| `lib/edificio.js` | Corte del Edificio C |
| `lib/estilo.css` | Estilos compartidos |
| `lib/linea_de_tiempo.py` | `palabras.json` + `cortes.json` → `tl.js` |
| `lib/recorta_pausas.py` | Acorta pausas y acelera la voz |
| `lib/inserta_silencios.py` | Mete pausas exactas y corre los tiempos |
| `lib/resumen_episodio.py` | `escenas.md` y `hoja_de_escenas.jpg` |
| `parteN/` | `cortes.json`, `tl.js` (generado), `escenas.js`, `mezcla.py`, `parteN.html` |
| `audio/parteN/` | `texto_voz.txt`, `take1.mp3`, `take2.mp3`, `narracion.mp3`, `palabras.json` |
| `personajes/hoja.html` | Hoja de personajes (`npm run hoja-personajes`) |
| `render.js` | Página → video, o cuadros sueltos con `--cuadros` |
| `hacer_parteN.sh` | Corre todo en orden |
