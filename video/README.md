# Video de la serie

Todo se dibuja con código, sin generador de imágenes. Las escenas son SVG que se animan en el navegador. Playwright toma una captura por cuadro y ffmpeg arma el video.

## Piezas

| Archivo | Qué hace |
|---|---|
| `lib/dibujo.js` | Stickman, paliacate, Chispa, infectados, vecinos. Se comparte entre partes. |
| `lib/motor.js` | Escoge la escena, mueve la cámara, pone subtítulos y anima el trazo de tinta. |
| `parte1/escenas.js` | Las 12 escenas de la parte 1. |
| `parte1/linea_de_tiempo.py` | Lee los tiempos por palabra y decide dónde cortar cada escena y cómo agrupar los subtítulos. |
| `parte1/mezcla.py` | Mezcla voz, sirena, ambiente y golpes. |
| `render.js` | Convierte la página en video, o saca cuadros sueltos para revisar. |
| `hacer_parte1.sh` | Corre todo en orden. |

## Voz y subtítulos

1. La voz es de ElevenLabs: "Alejandro - Horror y Misterio", modelo eleven_v4. El guion va con la etiqueta `[whispering]` antes del mensaje de Lalo.
2. `audio/take1.mp3` es la toma original. `audio/narracion.mp3` es la misma con pausas recortadas y 12 % más rápida.
3. `audio/palabras.json` son los tiempos por palabra que da ElevenLabs Scribe al transcribir `narracion.mp3`. De ahí salen los cortes de escena y los subtítulos.

Si cambias la voz, repite el paso 3 con el audio nuevo y vuelve a correr `hacer_parte1.sh`.

## Revisar sin renderizar todo

```
node render.js parte1/parte1.html /tmp/cuadros --cuadros 5,16,41
```

## Hacer la parte 2

Copia la carpeta `parte1`, cambia las escenas y las frases de corte en `linea_de_tiempo.py`. El personaje y Chispa ya están en `lib/dibujo.js`.
