# Video de la serie

Todo se dibuja con código, sin generador de imágenes. Las escenas son SVG que se animan en el navegador. Playwright toma una captura por cuadro y ffmpeg arma el video.

## Piezas compartidas (`lib/`)

| Archivo | Qué hace |
|---|---|
| `dibujo.js` | Stickman, paliacate, Chispa, doña Rosa, infectados, vecinos. |
| `motor.js` | Escoge la escena, mueve la cámara, pone subtítulos y anima el trazo de tinta. |
| `escena_base.js` | Ayudas para escribir escenas: lienzo, viñeta, poste de la alerta, texto que se escribe solo. |
| `estilo.css` | Fuentes, subtítulos, chat del edificio, hojas de cuaderno. |
| `linea_de_tiempo.py` | Lee los tiempos por palabra y decide dónde cortar cada escena y cómo agrupar los subtítulos. |

## Cada parte (`parteN/`)

| Archivo | Qué hace |
|---|---|
| `cortes.json` | En qué frase empieza cada escena, marcas para animar, palabras en rojo y números ("tres catorce" → "3:14"). |
| `escenas.js` | Los dibujos y animaciones de esa parte. |
| `mezcla.py` | Voz, ambiente y efectos de sonido. |
| `parteN.html` | Junta todo. |

`hacer_parteN.sh` corre todo en orden y deja el video en `salida/la_alerta_parteN.mp4`.

## Voz y subtítulos

1. La voz es de ElevenLabs: "Alejandro - Horror y Misterio", modelo eleven_v4. El texto lleva `[whispering]` antes de la última frase de suspenso.
2. `audio/parteN/take1.mp3` es la toma original. `narracion.mp3` es la misma con pausas recortadas y 12 % más rápida:
   `ffmpeg -i take1.mp3 -af "silenceremove=stop_periods=-1:stop_duration=0.42:stop_threshold=-38dB:stop_silence=0.3,atempo=1.12" narracion.mp3`
3. `palabras.json` son los tiempos por palabra que da ElevenLabs Scribe al transcribir `narracion.mp3`.

Si las pausas largas no se recortan bien con ffmpeg, usa `lib/recorta_pausas.py` (deja cada pausa en un máximo fijo). Para devolver una pausa dramática exacta sin volver a transcribir, usa `lib/inserta_silencios.py`, que también corre los tiempos de `palabras.json`. La parte 3 usó los dos:

```
python3 -I lib/recorta_pausas.py audio/parte3/take1.mp3 audio/parte3/narracion_sin_pausas.mp3 0.32 1.15
python3 -I lib/inserta_silencios.py audio/parte3/narracion_sin_pausas.mp3 audio/parte3/palabras_sin_pausas.json \
  audio/parte3/narracion.mp3 audio/parte3/palabras.json 5.75:0.6 34.05:0.7 43.3:0.5
```

## Gancho al inicio

Desde la parte 3, cada parte puede abrir con su momento más tenso, congelarlo y rebobinar ("10 minutos antes"). En `escenas.js` son tres escenas cortas (`gancho`, `ganchoAbajo`, `ganchoVidrio`) más `rebobina`. Los letreros que no deben moverse con la cámara van en `fijo` en vez de `html`.

## Revisar sin renderizar todo

```
node render.js parte2/parte2.html /tmp/cuadros --cuadros 5,16,41
```

## Hacer la parte siguiente

1. Genera la voz, procésala y transcríbela (pasos de arriba).
2. Copia `parte2/` como `parte3/`, cambia `cortes.json`, las escenas y los efectos.
3. Copia `hacer_parte2.sh` como `hacer_parte3.sh` y cambia los números.
