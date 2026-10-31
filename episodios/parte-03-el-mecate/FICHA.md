# Parte 3 · El mecate

| | |
|---|---|
| **Video** | `la_alerta_parte3.mp4` · 71.0 s · 1080x1920 · 30 fps · H.264 + AAC |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 18 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Gancho** | Flash-forward: la botella a 3 px del vidrio de Rosa, los veinte mirando hacia arriba, congelado, rebobinado VHS "10 MINUTOS ANTES" |
| **Commit del video** | `7eb6f74` |

## Guion

1. Guion completo: `guiones/la-alerta-serie-8-partes.md`, sección "Parte 3 · El mecate" (ya incluye el gancho y el rebobinado).
2. Texto exacto enviado a la voz: `video/audio/parte3/texto_voz.txt`.
3. Cambios frente al guion escrito: gancho en tres tomas rápidas (`gancho`, `ganchoAbajo`, `ganchoVidrio`) más `rebobina`; "Día 2" en el corte del edificio con la escalera tachada; presentación de Memo con su planta de luz; chat privado de Memo.

## Código usado

| Archivo | Papel |
|---|---|
| `video/parte3/escenas.js` | Las 18 escenas. Funciones propias: `botella`, `colgando`, `fachada` (vista de costado), `vistaAbajo` (patio desde arriba), `vaiven` (balanceo que termina a 3 px del vidrio) |
| `video/parte3/cortes.json` | Frases de corte, marcas, palabras en rojo, zonas sin subtítulos |
| `video/parte3/tl.js` | Línea de tiempo generada |
| `video/parte3/mezcla.py` | Viento, tensión, congelado, rebobinado, gemido, latidos, vibración |
| `video/parte3/parte3.html` | Página que junta todo |
| `video/lib/edificio.js` | Corte del edificio reutilizado en "Día 2" |
| `video/lib/dibujo.js` | Se agregaron `memo()` y el filtro `tiembla` |
| `video/lib/motor.js` | Se agregó la capa `fijo` y la corrección de subtítulos |
| `video/hacer_parte3.sh` | Regenera todo |

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `uKdszRs8NZ1gmhS5HRLE` · https://elevenlabs.io/app/flows/uKdszRs8NZ1gmhS5HRLE |
| Toma usada | `take1.mp3` (generación `H4WSxncaAt62PU80TvfC`, 85.8 s). Toma 2: `r7lC7Yat44BViOh4zdua` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.32 s, `atempo` 1.15) → `narracion_sin_pausas.mp3` 67.3 s; luego `inserta_silencios.py` devuelve 3 pausas dramáticas → `narracion.mp3` 69.1 s |
| Transcripción | Scribe v1, generación `gxNFHYUT3xuS0T72sUma` → `palabras_sin_pausas.json`; corrida con los silencios → `palabras.json` |
| Créditos | ~2,212 (2 tomas × 921 + 370 de transcripción) |

Comandos del proceso de voz (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/parte3/take1.mp3 audio/parte3/narracion_sin_pausas.mp3 0.32 1.15
python3 -I lib/inserta_silencios.py audio/parte3/narracion_sin_pausas.mp3 audio/parte3/palabras_sin_pausas.json \
  audio/parte3/narracion.mp3 audio/parte3/palabras.json 5.75:0.6 34.05:0.7 43.3:0.5
```

Las tres pausas: el congelado del gancho (después de "en qué piso vives"), después de "Si pega en el vidrio..." y después de "diez".

## Sonido

Viento afuera; tono que sube durante el gancho y se corta al congelar; golpe y soplido en el congelado; chirrido de cinta en el rebobinado; tensión mientras la botella se acerca; gemido de Chispa; latidos en la cuenta 5… 10; golpes en Memo y en la tarjeta final; vibración del mensaje de Memo.

## Personajes y recursos

Tú, Chispa, doña Rosa (mano con rebozo y nota), Memo (presentación y chat), veinte infectados en el patio.

## Referencias

El gancho con flash-forward se pidió para mejorar la retención. Estilo de personajes en `referencias/personajes/hoja_personajes.png`.

## Cómo regenerarlo

```
cd video
./hacer_parte3.sh
./hacer_parte3.sh --publicar
```
