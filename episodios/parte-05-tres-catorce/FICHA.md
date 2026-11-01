# Parte 5 · 3:14

| | |
|---|---|
| **Video** | `la_alerta_parte5.mp4` · 71.4 s · 1080x1920 · 30 fps · H.264 + AAC · 37 MB |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 17 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Sin flash-forward (pedido del usuario). Abre directo con el celular en "3:14", la alerta sonando y Chispa con las orejas paradas; a los 3 s empieza a aullar |

## Guion

1. Guion completo: `guiones/la-alerta-serie-8-partes.md`, sección "Parte 5 · 3:14". Se reescribió frente al guion original para poner a Chispa en peligro: aúlla durante la alerta y hay que callarla antes de que la alerta se calle.
2. Texto exacto enviado a la voz: `video/audio/parte5/texto_voz.txt`.
3. Conserva lo que necesitan las partes 6 a 8: los infectados van al poste mientras suena, la prueba con la silla y la lata, la Regla 4 y el mensaje de Memo de las 3:17.

## Código usado

| Archivo | Papel |
|---|---|
| `video/parte5/escenas.js` | Las 17 escenas. Funciones propias: `cuartoNoche` (cuarto con ventana y poste), `patioArriba` y `dibujaPatio` (el patio desde tu ventana; los infectados corren al poste), `espalda` (el montón visto por detrás), `montonArriba` y `animaMonton` (cabezas desde arriba que giran), `fachadaNoche` y `ondaAullido` (el último aullido que flota), `silla`, `lata`, `restante` y `animaReloj` (cuenta regresiva de 90 s) |
| `video/parte5/cortes.json` | Frases de corte, marcas, palabras en rojo, zonas sin subtítulos |
| `video/parte5/tl.js` | Línea de tiempo generada |
| `video/parte5/mezcla.py` | Sirena, aullidos (claros, tapados y el último con eco), estampida, bip, silla, lata, latidos, viento, golpe, zumbido, vibración |
| `video/parte5/parte5.html` | Página que junta todo |
| `video/lib/dibujo.js` | Nuevas: `perroSentada(aulla)`, `infectadoLado(fase)`, `infectadoQuieto(brazos, look, lookY)`, opción `aullido` en `caraChispa()`, filtro `#contorno` (borde claro para que las figuras se vean de noche) |
| `video/lib/escena_base.js` | `chatPrivado()` y `animaMensajes()` pasaron aquí desde la parte 4 |
| `video/lib/estilo.css` | Nuevas clases: `.reloj-mini`, `.reloj-grande`, `.onomato` |
| `video/hacer_parte5.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): la silla se arrastra de `M.silla + 0.1` a `M.nada1 - 0.15`, la lata pega en el piso en `M.lata + 0.55` y el último aullido sale cuando la alerta se calla (`M.calla`).

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `qmZf5qrnnVz41bdEhD7V` · https://elevenlabs.io/app/flows/qmZf5qrnnVz41bdEhD7V |
| Toma usada | `take1.mp3` (generación `gsZLohTi3diRY9QRAiJz`, 87.8 s). Toma 2: `kAkC3TBR3pC0OV8q0nBq` |
| Transcripción | Scribe v1 de la toma 1 original (generación `723bkKMAJjtHkKhzAJXR`), sin costo → `palabras_take1.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.18) corre también los tiempos → `narracion_sin_pausas.mp3` 67.6 s; `inserta_silencios.py` devuelve 3 pausas → `narracion.mp3` 69.5 s |
| Créditos | ~1,848 (2 tomas × 924; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/parte5/take1.mp3 audio/parte5/narracion_sin_pausas.mp3 0.3 1.18 \
  --palabras audio/parte5/palabras_take1.json audio/parte5/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/parte5/narracion_sin_pausas.mp3 audio/parte5/palabras_sin_pausas.json \
  audio/parte5/narracion.mp3 audio/parte5/palabras.json 44.6:0.3 46.2:1.2 53.65:0.4
```

Las tres pausas: antes de "La alerta se calla", después de "La alerta se calla" (1.2 s para que se oiga el último aullido solo) y después de "tu edificio".

## Sonido

Sirena desde el primer cuadro hasta que la alerta se calla, con corte seco (más fuerte en la toma junto al poste); aullidos de Chispa sintetizados (tono que sube y baja con vibrato), apagados cuando le tapas el hocico; el último aullido sale limpio en el silencio con eco largo; soplido y golpe sordo cuando te lanzas; estampida cuando corren al poste; bip del temporizador; silla que raspa el piso; lata con golpe metálico, rebote y rodada; latidos que suben en la cuenta regresiva; viento en el silencio; golpe grave y zumbido cuando giran las cabezas; vibración del celular con cada mensaje de Memo.

Niveles medidos antes de normalizar (voz contra efectos, por tramo): la mayoría de los tramos quedan de 8 a 10 dB debajo de la voz. Dos tramos quedan más cerca a propósito: la silla y la lata (6.5 dB, suenan en los huecos de la voz) y el último aullido (6.3 dB, suena en la pausa después de "La alerta se calla"). La mezcla pasa por `loudnorm` a -14 LUFS; el video final mide -16.4 LUFS integrados, igual que las partes 3 y 4.

## Personajes y recursos

Tú, Chispa (sentada aullando, primer plano aullando, con la mano en el hocico), unos 26 infectados (corriendo de lado, parados con los brazos arriba, de espaldas en el montón, cabezas desde arriba), Memo (chat). Fachada del edificio C de noche con la ventana del 402 (cortina rosa).

## Cómo regenerarlo

```
cd video
./hacer_parte5.sh
./hacer_parte5.sh --publicar
```
