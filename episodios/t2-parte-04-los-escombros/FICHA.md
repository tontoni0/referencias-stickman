# Temporada 2 · Parte 4 · Los escombros (interactiva, ganó ⏳)

| | |
|---|---|
| **Video** | `la_alerta_t2_parte4.mp4` · 68.1 s · 1080x1920 · 30 fps · H.264 + AAC · 28 MB · -16.2 LUFS |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 14 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Tarjeta del voto de la parte 3: "GANÓ" con ⏳ ESPERAS OTRA ALERTA encendida y 🏃 CRUZAS POR ELLA tachada |
| **Final** | Tarjeta de decisión: "¿POR DÓNDE BAJAS?", 🚇 POR EL METRO · 🏚️ POR LOS ESCOMBROS |

## Guion

1. Guion completo: `guiones/la-alerta-temporada-2.md`, sección "Parte 4 · Los escombros (ganó ⏳)". La tabla "Cómo se respeta cada voto" dice cómo empieza la parte 5 con cada opción.
2. Texto exacto de la voz: `video/audio/t2parte4/texto_voz.txt`.
3. Lo que pasa: en la parte 3 ganó ⏳ con 60 % de 912 votos. Esperas detrás del mostrador. Pasan veinte minutos. Evelin manda otra alerta: ellos corren al poste, pero Chispa se queda y aúlla, como siempre que suena la alerta. Recuerdo: hace tres años, después del gran sismo, la encontraste debajo de una losa, entre los escombros de un edificio, aullando mientras sonaba la alerta. Silbas y Chispa corre hacia ti. Esa alerta dura solo 20 segundos: Chispa salta el mostrador justo antes de que se calle y le tapas el hocico. Ellos regresan y te cortan el camino a casa. A media cuadra están la entrada del metro y el edificio caído donde la encontraste; debajo pasa el túnel que llega al centro de alerta.
4. Es la historia de fondo de Chispa (por qué aúlla con la alerta, temporada 1, parte 5).

## Para publicar

**Título:** Chispa se quedó sola entre ellos. Así la encontré | Temporada 2, parte 4
**Portada:** AÚLLA.

**Comentario fijado:**

```
¿Por dónde bajas al túnel?
🚇 Por el metro · 🏚️ Por los escombros
La parte 5 se hace con lo que gane.
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/t2parte4/escenas.js` | Las 14 escenas. Funciones propias: `tiendaDentro` y `vistaAfuera` (la tienda desde atrás del mostrador y la avenida por la cortina), `avenidaLado` (tu casa, el poste y la tienda de lado), `ondasPoste`, `chispaAulla`, `escombros` (el edificio caído), `calleMetro` (la entrada del metro y los escombros), el corte del túnel hasta el centro de alerta, el reloj de pared, la mano que tapa el hocico. Copia de la parte 3: `tuCorre`, `chispaCorre`, `tuDe`, `foco` |
| `video/t2parte4/cortes.json` | Frases de corte, marcas, palabras en rojo, sin subtítulos en la tarjeta final |
| `video/t2parte4/tl.js` | Línea de tiempo generada |
| `video/t2parte4/mezcla.py` | Campanita, latidos, el reloj, la segunda alerta, los aullidos de Chispa (mismo generador que la temporada 1, parte 5), el recuerdo (sirena lejana, polvo, la losa, aullido de cachorra), el silbido, patitas, la cuenta regresiva, el salto, el corte, el gemido, los que regresan, el retumbe del túnel, golpes de cierre |
| `video/t2parte4/t2parte4.html` | Página que junta todo |
| `video/hacer_t2parte4.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): la segunda alerta empieza en `M.vuelve - 0.1` y se calla en `M.calla + 0.25`; silbas en `M.silbas + 0.05`; Chispa salta en `M.salta + 0.25`. El reloj de la alerta aparece en 0:20 con "veinte segundos", marca 0:05 en "Cinco" y 0:04 en "Cuatro", y llega a 0:00 cuando se calla; `mezcla.py` pone un clic en cada segundo de ese tramo final.

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `gr0wMjpqL48ez8a1WVVp` · https://elevenlabs.io/app/flows/gr0wMjpqL48ez8a1WVVp |
| Toma usada | `take1.mp3` (generación `vTMiFA10coF0Tt6OmDxY`, 74.8 s): más corta y con el susurro final más bajo. Toma 2: `3ge8dY3lYiS8unV5vSGu` (76.4 s) |
| Transcripción | Scribe v1 de la toma 1 (nodo `gtu4pdLHIqfv5Dr7oxVn`, generación `T35crEJno0MRWLraNsj3`), sin costo → `palabras_take1.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.2) → `narracion_sin_pausas.mp3` 58.1 s; `inserta_silencios.py` agrega 16 pausas → `narracion.mp3` 64.9 s |
| Créditos | ~1,746 (2 tomas × 873; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/t2parte4/take1.mp3 audio/t2parte4/narracion_sin_pausas.mp3 0.3 1.2 \
  --palabras audio/t2parte4/palabras_take1.json audio/t2parte4/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/t2parte4/narracion_sin_pausas.mp3 audio/t2parte4/palabras_sin_pausas.json \
  audio/t2parte4/narracion.mp3 audio/t2parte4/palabras.json \
  1.10:0.4 6.28:0.4 7.45:0.4 8.25:0.6 11.6:0.2 15.40:0.6 18.62:0.4 27.35:0.5 33.6:0.4 34.38:0.3 35.1:0.2 36.64:0.3 37.98:0.5 39.36:0.5 44.64:0.5 54.84:0.6
```

## Sonido

Campanita del voto; latidos y gemidos detrás del mostrador; el reloj de la pared que corre; la segunda alerta y ellos corriendo al poste; los aullidos de Chispa; en el recuerdo, la sirena lejana, el polvo, la losa que se levanta y un aullido de cachorra más agudo, con un acorde cálido; la alerta otra vez, el silbido y las patitas de Chispa; clics en los últimos segundos; el salto y la caída detrás del mostrador; un golpe sordo cuando se calla; un gemido apagado bajo tu mano; los que regresan; una nota aguda en "No puedes volver"; el retumbe del túnel; golpes de cierre.

Niveles medidos antes de normalizar: efectos de 7 a 16 dB debajo de la voz. Donde Chispa aúlla quedan a unos 7 dB porque el aullido es lo que se cuenta.

## Personajes y recursos

Tú (detrás del mostrador, silbando, en el recuerdo levantando la losa), Chispa (temblando entre ellos, aullando de cerca, de cachorra en los escombros, saltando el mostrador, con el hocico tapado), infectados (avenida y poste). No aparecen Rosa, Evelin ni Memo.

## Cómo regenerarlo

```
cd video
./hacer_t2parte4.sh
./hacer_t2parte4.sh --publicar
```
