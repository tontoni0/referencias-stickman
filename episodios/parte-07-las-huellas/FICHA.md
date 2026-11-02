# Parte 7 · Las huellas (interactiva)

| | |
|---|---|
| **Video** | `la_alerta_parte7.mp4` · 79.5 s · 1080x1920 · 30 fps · H.264 + AAC |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 19 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Tarjeta del voto de la parte 6: "GANÓ" con 🔦 encendida y 🔑 tachada. No se pone el porcentaje por si cambia |
| **Final** | Otra decisión para los comentarios: 🐕 entras con Chispa o 🔑 subes por Memo |

## Guion

1. Guion completo: `guiones/la-alerta-serie-8-partes.md`, sección "Parte 7B · Las huellas". Es la versión que ganó en la parte 6 (🔦, 87 % a la hora y media). La gente notó que la placa de la foto no tenía cinta; el episodio abre dándoles la razón.
2. Texto exacto de la voz: `video/audio/parte7/texto_voz.txt` (completo). El final se generó aparte: `video/audio/parte7/texto_voz_final.txt`.
3. El usuario pidió que esta parte también terminara con una decisión "bien difícil": Chispa (y la ventana de Rosa, que no se vuelve a abrir) o Memo (que te mintió, pero tiene las llaves de la tienda y sin él no hay comida ni croquetas). La parte 8 tiene dos versiones en el guion.

## Para publicar

**Título:** Mi perrita no está con él. La foto lo dice | Parte 7
**Portada:** MIRA LA PLACA.

**Comentario fijado:**

```
🐕 = entras al 402 con Chispa y dejas a Memo
🔑 = subes a la azotea por Memo (y por las llaves de la comida)
Gana lo que tenga más comentarios en 48 horas. El final sigue lo que elijan.
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/parte7/escenas.js` | Las 19 escenas. Funciones propias: `panelPlaca` (las dos placas lado a lado), `azotea7`, `memoLampara` (Memo con la lámpara y el haz), `puertaCaseta`, `puerta502`, `huella` y `HUELLAS` (huellas de Chispa), `fachadaNoche` con la escalerita, `tuEscalera`, `tuCorriendo`, `brazoVentana`, `jaulaGas`, `ventana402`, `manoRosa` (la mano arrugada con el rebozo) |
| `video/parte7/cortes.json` | Frases de corte, marcas, palabras en rojo, zonas sin subtítulos |
| `video/parte7/tl.js` | Línea de tiempo generada |
| `video/parte7/mezcla.py` | Campanita del voto, sello y tachón, viento, puerta que rechina, llaves, pasos, cerradura, escalerita, clic de la lámpara, CLANG del barandal, golpe y gruñidos, pasos corriendo, latidos, jaula, cortina, gritos ahogados en la azotea, la manija y el pulso de la decisión |
| `video/parte7/parte7.html` | Página que junta todo |
| `video/lib/une_tomas.py` | Nuevo: une una toma hasta un corte con otra toma y junta sus tiempos por palabra. Sirve para cambiar solo el final de una narración |
| `video/lib/dibujo.js` | El degradado `#haz` (haz de la lámpara) pasa a `defsSVG` para que lo vean todas las escenas |
| `video/hacer_parte7.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): el CLANG del barandal en `M.barandal + 0.25` y la puerta de la bodega 502 que abre Memo en `M.abre + 0.8`.

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `yKx4fOhwmHFqFyZDw3Ek` · https://elevenlabs.io/app/flows/yKx4fOhwmHFqFyZDw3Ek |
| Toma principal | `take1.mp3` (generación `rN8sQvuVkm4GULnGQOgX`, 69.0 s). Toma 2: `jucgVUONtKa25PQ3VxSI`. Terminaba con "Sígueme para el final"; se cortó antes de esa frase |
| Final nuevo | `final_take1.mp3` (generación `p8kdAnX9EKMsUaiFbvxh`, 28.2 s). Toma 2: `0xgPEsInQBEjanYPdPzd` |
| Transcripción | Scribe v1 de las dos tomas usadas (generaciones `JKgtPweVmjBnzQPPmzDd` y `nHWpbCoRhrrSOfagBUOJ`), sin costo. Los tiempos se copiaron de la respuesta porque la descarga estaba bloqueada en ese momento |
| Proceso | `une_tomas.py` junta la toma principal hasta 67.15 s con el final (0.4 s de silencio en medio) → `toma_completa.mp3` 95.7 s; `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.2) → 75.3 s; `inserta_silencios.py` agrega 3 pausas → `narracion.mp3` 76.4 s |
| Créditos | ~2,374 (toma principal 2 × 851; final 2 × 336; las transcripciones no cobraron) |

Comandos (desde `video/`):

```
python3 -I lib/une_tomas.py audio/parte7/take1.mp3 audio/parte7/palabras_take1.json 67.15 \
  audio/parte7/final_take1.mp3 audio/parte7/palabras_final_take1.json 0.4 \
  audio/parte7/toma_completa.mp3 audio/parte7/palabras_toma_completa.json
python3 -I lib/recorta_pausas.py audio/parte7/toma_completa.mp3 audio/parte7/narracion_sin_pausas.mp3 0.3 1.2 \
  --palabras audio/parte7/palabras_toma_completa.json audio/parte7/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/parte7/narracion_sin_pausas.mp3 audio/parte7/palabras_sin_pausas.json \
  audio/parte7/narracion.mp3 audio/parte7/palabras.json 35.12:0.45 57.43:0.3 70.94:0.3
```

Las tres pausas: después del CLANG ("golpea el barandal con la lámpara"), después de "se asoma una cola café. Chispa" y antes de la pregunta.

Desde el 2 de noviembre ElevenLabs sirve los archivos desde `elevenlabsusercontent.com`. El usuario lo agregó a los dominios permitidos del entorno; sin eso no se pueden descargar las tomas.

## Sonido

Campanita al anunciar el voto; sello y tachón sobre la foto; viento en la azotea y la cornisa; la puerta de la azotea que rechina; llaves; pasos de Memo y tus pasos rápidos; la llave en la cerradura y la puerta de la bodega; un timbre suave con las huellas; la escalerita de fierro; el clic de la lámpara y el CLANG del barandal con eco; golpe grave y gruñidos cuando voltean; pasos corriendo; latidos hasta el 402; la jaula del gas; el roce de la cortina y un acorde que queda en el aire; gruñidos y gritos ahogados en la azotea; llaves; la manija; golpe y pulso grave en la tarjeta de decisión.

Niveles medidos antes de normalizar: efectos de 9 a 13 dB debajo de la voz en todos los tramos.

## Personajes y recursos

Tú, Memo (con lámpara y llavero, en la azotea y gritando), Rosa (solo su mano arrugada con el rebozo), Chispa (la placa en las dos fotos, su cola y su cabeza detrás de la cortina, su plato vacío), unos 10 infectados (en tu departamento, brazos por la ventana, en la azotea).

## Cómo regenerarlo

```
cd video
./hacer_parte7.sh
./hacer_parte7.sh --publicar
```
