# Parte 1 · La alerta

| | |
|---|---|
| **Video** | `la_alerta_parte1.mp4` · 70.4 s · 1080x1920 · 30 fps · H.264 + AAC |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 12 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Gancho** | Tarjeta "3:14 A. M." con sirena (sin flash-forward; el gancho al inicio empezó en la parte 3) |
| **Commit del video** | `a2122d4` (render original) |

## Guion

1. Guion completo: `guiones/la-alerta-serie-8-partes.md`, sección "Parte 1 · La alerta".
2. Texto exacto enviado a la voz: `video/audio/parte1/texto_voz.txt`.
3. Cambios frente al guion escrito: se agregaron dos escenas. `unidad` (el Edificio C de noche con vecinos saliendo) evita que la tarjeta de 3:14 se quede fija 10 s, y `objetos` muestra "celular, llaves, chanclas" al decir cada palabra.

## Código usado

| Archivo | Papel |
|---|---|
| `video/parte1/escenas.js` | Las 12 escenas |
| `video/parte1/cortes.json` | Frases donde empieza cada escena, marcas, palabras en rojo |
| `video/parte1/tl.js` | Línea de tiempo generada (no editar a mano) |
| `video/parte1/mezcla.py` | Sirena, ambiente, golpes, vibración |
| `video/parte1/parte1.html` | Página que junta todo |
| `video/lib/*` | Dibujo, motor, estilos, línea de tiempo |
| `video/hacer_parte1.sh` | Regenera todo |

Nota: este video se renderizó antes de pasar piezas a `lib/` (línea de tiempo, estilos, `escena_base.js`). Se verificó que el código actual produce la misma imagen (diferencia media de 1.6/255 por píxel, solo compresión).

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `vF8eBLn3JgXGCjOx0Gbl` · https://elevenlabs.io/app/flows/vF8eBLn3JgXGCjOx0Gbl |
| Toma usada | `take1.mp3` (generación `80yCdpjplTTU4eyOKjTY`, 76.1 s). Toma 2: `hyi6IWmP19bE9ZYrUsme` |
| Proceso | `silenceremove` (pausas > 0.42 s quedan en 0.3 s) + `atempo=1.12` → `narracion.mp3`, 67.5 s |
| Transcripción | Scribe v1, generación `QsM98tlcZERWHZmltq71` → `palabras.json` |
| Créditos | ~2,118 (2 tomas × 873 + 371.5 de transcripción) |

Comando del proceso de voz:

```
ffmpeg -i take1.mp3 -af "silenceremove=stop_periods=-1:stop_duration=0.42:stop_threshold=-38dB:stop_silence=0.3,atempo=1.12" narracion.mp3
```

## Sonido

Sirena genérica sintetizada (no la grabación oficial) fuerte 1.2 s antes de la voz y baja hasta que la voz dice "la alerta se calla"; ruido grave de fondo; golpes en "la alerta se calla", "grita" y la tarjeta final; vibración de celular con el mensaje de Lalo.

## Personajes y recursos

Tú, Chispa, vecinos en pijama, infectados corriendo, Lalo 305 (solo en el chat), Memo 101 y Rosa 402 (solo en el chat). Fuentes Oswald y Caveat (`video/fonts/`).

## Referencias

Formato de supervivencia en segunda persona y tarjetas de los videos de `referencias/videos/`. Estilo del personaje en `referencias/personajes/hoja_personajes.png`.

## Cómo regenerarlo

```
cd video
./hacer_parte1.sh              # deja el resultado en salida/ para revisarlo
./hacer_parte1.sh --publicar   # además reemplaza el video de esta carpeta
```
