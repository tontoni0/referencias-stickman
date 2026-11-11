# Temporada 2 · Parte 7 · La antena (interactiva, ganó 🔐)

| | |
|---|---|
| **Video** | `la_alerta_t2_parte7.mp4` · 67.7 s · 1080x1920 · 30 fps · H.264 + AAC · 24 MB · -16.8 LUFS |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 17 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Tarjeta del voto de la parte 6: "GANÓ" con 🔐 LO ENCIERRAS AQUÍ encendida y 🤝 LO DEJAS VENIR tachada |
| **Final** | Tarjeta de decisión: "¿QUÉ HACES?", 🗣️ LE CUENTAS A EVELIN · 🤐 TE LO CALLAS |

## Guion

1. Guion completo: `guiones/la-alerta-temporada-2.md`, sección "Parte 7 · La antena (ganó 🔐)". La tabla "Cómo se respeta cada voto" dice cómo empieza la parte 8 con cada opción.
2. Texto exacto de la voz: `video/audio/t2parte7/texto_voz.txt`.
3. Lo que pasa: en la parte 6 ganó 🔐. Encierras a Memo en la sala de control; golpea el vidrio y enseña su tarjeta. En la azotea del centro de alerta, Evelin te apunta con una llave de tuercas. Chispa la huele y mueve la cola: huele a la casa de Rosa. Evelin baja la llave: "Te mandó mi abuela." Una ráfaga de viento jala a Chispa: ojos blancos, te tira una mordida. Evelin le pone sus audífonos y Chispa se calma. Regla 5: "A los mordidos los jala el ruido. Sin ruido, se calman." Detrás del tinaco, un radio truena con la voz de la Coordinación: "Tráenos a la operadora. Y te curamos." Es Memo, ya salió, y solo tú lo ves: se lleva un dedo a la boca.
4. Desde aquí Chispa trae puestos los audífonos de Evelin. Evelin cuenta la primera noche desde su lado en la parte 8.

## Para publicar

**Título:** Lo encerramos. Igual subió a la antena | Temporada 2, parte 7
**Portada:** NADIE LO VIO.

**Comentario fijado:**

```
Memo quiere cambiar a Evelin por su cura. ¿Qué haces?
🗣️ Le cuento a Evelin · 🤐 Me lo callo
La parte 8 se hace con lo que gane.
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/t2parte7/escenas.js` | Las 17 escenas. Funciones propias: `azotea` (cielo, ciudad, pretil, `torre` de la antena con luz roja, gabinete, caseta y `tinaco`), `fondoCerca`, `viento` (rayas que cruzan), `llave` (llave de tuercas), `consola` (consola portátil de Evelin), `walkie` (el radio con "CANAL 3 · COORDINACIÓN"), `evelinDe`, `chispa` (de lado, con ojos blancos, cola que se mueve y audífonos), `ojosBlancos` y `audifonosCara` (sobre `caraChispa`), `audifonosSueltos`, `quijada` (el gris de Memo en la quijada). Copia de partes anteriores: `memoDe`, `venas`, `brazoMordido`, `perroMordido`, `tarjeta`, `tuDe`, `rosaDe`, `foco` |
| `video/t2parte7/cortes.json` | Frases de corte, marcas, palabras en rojo, sin subtítulos en la tarjeta final |
| `video/t2parte7/tl.js` | Línea de tiempo generada |
| `video/t2parte7/mezcla.py` | Campanita, la puerta que corre y el portazo, los golpes en el vidrio, el zumbido de la sala, viento, pasos, la llave, tensión y latidos, olfateos, el acorde del recuerdo, la ráfaga y los papeles, el gruñido, el ¡CLAC!, el roce de los audífonos, el viento apagado, la pluma, el radio que truena, estática, el "shh" de Memo, golpes de cierre. La voz de la Coordinación pasa por un filtro de radio |
| `video/t2parte7/t2parte7.html` | Página que junta todo |
| `video/hacer_t2parte7.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): el portazo en `M.encierrasM + 0.35`; los golpes de Memo en `M.golpea + 0.05`, `M.golpea + 0.45`, `M.vidrio + 0.05` y `M.vidrio + 0.45`; la ráfaga en `M.sopla - 0.1`; el ¡CLAC! en `M.mordidaM + 0.55` (en la pausa después de "mordida"); los audífonos quedan puestos en `M.pone + 0.5`; el radio truena en `M.truena - 0.1`; la voz de radio va de `M.traenos - 0.05` a `M.diceVoz - 0.1` y de `M.yTe - 0.05` a `M.esMemo - 0.15`.

Cambios en `lib/dibujo.js` (las partes anteriores no cambian): `evelin()` acepta `audifonos: 'no'` (sin audífonos) y `perro()` tiene el modo `'contenta'` (de pie, cola arriba) con un segundo parámetro para mover la cola.

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `DSzFqVn6G1KJcPx7EUVL` · https://elevenlabs.io/app/flows/DSzFqVn6G1KJcPx7EUVL |
| Toma usada | `take2.mp3` (generación `yPrnLOiwBPK7s6LDageJ`, 70.6 s): su susurro final es más bajo. Toma 1: `HdGTpMJ1PLV7VSUMSAug` (70.1 s) |
| Transcripción | Scribe v1 de la toma 2 (nodo `5E8HkSYynIf1i15QLB3U`, generación `gz6M4fMUU9XaMU3Sa5SP`), sin costo → `palabras_take2.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.2) → `narracion_sin_pausas.mp3` 55.7 s; `inserta_silencios.py` agrega 19 pausas → `narracion.mp3` 64.6 s |
| Créditos | ~1,658 (2 tomas × 829; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/t2parte7/take2.mp3 audio/t2parte7/narracion_sin_pausas.mp3 0.3 1.2 \
  --palabras audio/t2parte7/palabras_take2.json audio/t2parte7/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/t2parte7/narracion_sin_pausas.mp3 audio/t2parte7/palabras_sin_pausas.json \
  audio/t2parte7/narracion.mp3 audio/t2parte7/palabras.json \
  1.20:0.4 3.08:0.4 4.69:0.3 6.12:0.5 7.97:0.3 8.68:0.4 12.50:0.6 17.62:0.4 24.56:0.5 26.53:0.4 30.10:0.4 31.44:0.6 34.60:0.5 35.51:0.8 42.65:0.5 45.09:0.4 48.72:0.5 50.35:0.4 52.50:0.6
```

Los puntos de las pausas salen de `silencedetect` sobre `narracion_sin_pausas.mp3` (mitad de cada silencio real), no de los tiempos de la transcripción.

## Sonido

Campanita del voto; el zumbido de la sala; la puerta corrediza que cierra con un golpe y un clic; los golpes de Memo en el vidrio (golpe sordo y vidrio que vibra); una nota aguda en "tarjeta"; arriba, viento todo el tiempo y un silbido de la torre; pasos al salir de la caseta; el tintineo de la llave de tuercas, tensión que sube y latidos; un soplido cuando aparece Evelin; olfateos; un acorde tibio en "la casa de Rosa"; un tintineo cuando baja la llave; la ráfaga, los papeles y el silbido fuerte; un soplido cuando Chispa voltea y su gruñido, que crece; una nota aguda en los ojos blancos; el ¡CLAC! en la pausa después de "mordida"; el roce de los audífonos y un golpe sordo cuando quedan puestos; desde ahí el viento se oye apagado, como lo oye Chispa, con latidos lentos y otro acorde tibio cuando vuelve a ser Chispa; la pluma en la regla 5; el radio que truena con estática; la voz de la Coordinación con filtro de radio (de 450 a 2,800 Hz) y estática debajo; un zumbido grave con Memo, una nota aguda en "Es Memo", latidos y su "shh"; golpes de cierre.

Niveles medidos antes de normalizar: efectos de 8 a 18 dB debajo de la voz. En los ojos blancos quedan a 8 dB (el gruñido es lo que se cuenta) y el ¡CLAC! cae en una pausa.

## Personajes y recursos

Tú (con Chispa en brazos, luego Chispa en el piso), Chispa (huele a Evelin, mueve la cola, ojos blancos, te tira una mordida, con los audífonos de Evelin), Evelin (llave de tuercas, consola portátil, audífonos al cuello y luego sin ellos), Memo (detrás del vidrio con su tarjeta, después detrás del tinaco con el radio, gris hasta la quijada), Rosa (en el recuerdo de Chispa).

## Cómo regenerarlo

```
cd video
./hacer_t2parte7.sh
./hacer_t2parte7.sh --publicar
```
