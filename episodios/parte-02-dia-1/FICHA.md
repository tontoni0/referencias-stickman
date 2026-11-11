# Parte 2 · Día 1

| | |
|---|---|
| **Video** | `la_alerta_parte2.mp4` · 63.0 s · 1080x1920 · 30 fps · H.264 + AAC |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 12 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Gancho** | "Día 1" escrito en el cuaderno y "te encuentran por el ruido" (sin flash-forward) |
| **Commit del video** | `e98215e` (segundo render, corrige un subtítulo que se asomaba 2 cuadros; el primero fue `25e9ba6`) |

## Guion

1. Guion completo: `guiones/la-alerta-serie-8-partes.md`, sección "Parte 2 · Día 1".
2. Texto exacto enviado a la voz: `video/audio/parte2/texto_voz.txt`.
3. Cambios frente al guion escrito: se agregaron el recuerdo de Navidad con los tamales, el corte del edificio (tú en el 502, Rosa en el 402) y un mensaje de Memo en el chat ("la puerta de abajo ya está cerrada, no le abran a nadie") que adelanta la parte 4.

## Código usado

| Archivo | Papel |
|---|---|
| `video/parte2/escenas.js` | Las 12 escenas |
| `video/parte2/cortes.json` | Frases de corte, marcas, palabras en rojo, zonas sin subtítulos |
| `video/parte2/tl.js` | Línea de tiempo generada |
| `video/parte2/mezcla.py` | Pluma, reloj, cajita musical, respiración, golpes |
| `video/parte2/parte2.html` | Página que junta todo |
| `video/lib/edificio.js` | Corte del edificio (se creó aquí y se pasó a `lib/` en la parte 3) |
| `video/lib/*` | Dibujo, motor, estilos, línea de tiempo |
| `video/hacer_parte2.sh` | Regenera todo |

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `5PiE6ERf681Ok1ZbnGCd` · https://elevenlabs.io/app/flows/5PiE6ERf681Ok1ZbnGCd |
| Toma usada | `take1.mp3` (generación `3KITZbjM0o0OyoBJxT2N`, 68.5 s). Toma 2: `0KRowkW928Bz9j545ZsD` |
| Proceso | Igual que la parte 1 (`silenceremove` 0.42/0.3 + `atempo=1.12`) → `narracion.mp3`, 61.2 s |
| Transcripción | Scribe v1, generación `kmDKR1D81mI1PLsFyku5` → `palabras.json` |
| Créditos | ~1,986 (2 tomas × 825 + 336 de transcripción) |

## Sonido

Rasguño de pluma en el Día 1; tic tac que crece como tambor y se corta cuando sale la pila (`PARA_RELOJ` en `escenas.js` y `mezcla.py` deben coincidir); primera frase de "Noche de paz" en cajita musical (dominio público); respiración del otro lado de la puerta; golpes. El mensaje de Rosa llega sin sonido porque el celular está en silencio.

## Personajes y recursos

Tú, Chispa (con la placa encintada desde esta parte), doña Rosa (recuerdo y corte), infectado en la escalera. Memo, Paty y Rosa en el chat.

## Referencias

Tarjetas de reglas e inventario inspiradas en `referencias/videos/`, hechas como hoja de cuaderno de cuadrícula (`referencias/prueba-codigo/tarjeta_regla_1.png`).

## Cómo regenerarlo

```
cd video
./hacer_parte2.sh
./hacer_parte2.sh --publicar
```
