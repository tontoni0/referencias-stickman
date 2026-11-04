# Temporada 2 · Parte 3 · La tienda (interactiva, ganó 🔒)

| | |
|---|---|
| **Video** | `la_alerta_t2_parte3.mp4` · 75.6 s · 1080x1920 · 30 fps · H.264 + AAC · TAMANO · LUFS |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 15 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Tarjeta del voto de la parte 2: "GANÓ" con 🔒 NO LE ABRO encendida y 🚪 SÍ, LE ABRO tachada |
| **Final** | Tarjeta de decisión: "¿QUÉ HACES?", 🏃 CRUZAS POR ELLA · ⏳ ESPERAS OTRA ALERTA |

## Guion

1. Guion completo: `guiones/la-alerta-temporada-2.md`, sección "Parte 3 · La tienda (ganó 🔒)". La tabla "Cómo se respeta cada voto" dice cómo empieza la parte 4 con cada opción.
2. Texto exacto de la voz: `video/audio/t2parte3/texto_voz.txt`.
3. Lo que pasa: en la parte 2 ganó 🔒 con cerca de 80 %. No le abres a Memo: deja su celular debajo de la puerta y huye a la azotea, y los infectados de la escalera lo siguen. En el celular hay dos mensajes de un número desconocido: el de la primera noche ("a las 3:14 bajalos a todos y cierra la puerta. tienes lugar en la evacuacion") y uno de ayer ("la operadora esta en la antena del centro de alerta. traela"). Rosa: "Memo nos vendió. Y ahora quiere a mi niña." Al amanecer no hay croquetas: se quedaron en el 502, con ellos. Rosa le pide a Evelin una alerta de 90 segundos para ir a la tienda de don Chucho. Recoges la llave del patio, cruzas la avenida y subes la cortina. A los 60 segundos la alerta se calla: alguien más la apagó. Chispa te siguió y está del otro lado de la avenida, entre ellos.
4. Detalle para los atentos: Chispa se ve chiquita detrás de ti mientras corres por el patio y la avenida.

## Para publicar

**Título:** No le abrimos a Memo. Esto dejó debajo de la puerta | Temporada 2, parte 3
**Portada:** NOS VENDIÓ.

**Comentario fijado:**

```
Chispa está sola entre ellos. ¿Qué haces?
🏃 Cruzo por ella ahora · ⏳ Espero otra alerta
La parte 4 se hace con lo que gane.
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/t2parte3/escenas.js` | Las 15 escenas. Funciones propias: `tuCorre` (tú corriendo de lado), `chispaCorre`, `llavero` (con la etiqueta TIENDA), `chancla`, `celularMemo` (el chat del número desconocido), `corteEscalera` (el edificio con la escalera hasta la azotea), el mapa de la libreta, la tienda con su cortina, el reloj de la alerta. Copia de la parte 2: `memoDe`, `puertaDentro`, `rosaDe`, `tuDe`, `vela`, `foco`; de la parte 1: `radioViejo` |
| `video/t2parte3/cortes.json` | Frases de corte (con `@2` en "la avenida" y "la llave", que se repiten), marcas, palabras en rojo, "tres catorce" → "3:14", sin subtítulos en la tarjeta final |
| `video/t2parte3/tl.js` | Línea de tiempo generada |
| `video/t2parte3/mezcla.py` | Campanita, el último golpe, el celular raspando, pasos que suben, avisos de mensaje, latidos, pájaros, el lápiz, los pitidos de Rosa, la alerta que se corta, pasos de carrera, llaves, la cortina, el reloj, gemidos, el chillido de Chispa, golpes de cierre |
| `video/t2parte3/t2parte3.html` | Página que junta todo |
| `video/hacer_t2parte3.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): el celular entra en `M.algo - 0.2`; la alerta empieza en `M.suena - 0.1` y se calla en `M.calla + 0.3`; levantas la llave en `M.llave + 0.1`; la cortina sube en `M.cortinaM + 0.1`; los pitidos de Rosa siguen `sin(22·t) > 0.3` hasta `M.noventa`. El reloj de la alerta baja rápido de 1:30 a 0:32 y luego segundo a segundo hasta 0:30, justo cuando se calla.

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `LBSyQJc4VbTX0wiJPeRr` · https://elevenlabs.io/app/flows/LBSyQJc4VbTX0wiJPeRr |
| Toma usada | `take2.mp3` (generación `sVvomVKg4WXpggz3Fn46`, 83.8 s): queda más corta al recortarla y su susurro final es igual de bajo. Toma 1: `VeV3O0VdAJ0NND0dDyQh` (86.2 s) |
| Transcripción | Scribe v1 de la toma 2 (generación `1kAsgZBuWYkiSqEK5wxf`), sin costo → `palabras_take2.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.2) → `narracion_sin_pausas.mp3` 65.5 s; `inserta_silencios.py` agrega 14 pausas → `narracion.mp3` 72.5 s |
| Créditos | ~1,928 (2 tomas × 964; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/t2parte3/take2.mp3 audio/t2parte3/narracion_sin_pausas.mp3 0.3 1.2 \
  --palabras audio/t2parte3/palabras_take2.json audio/t2parte3/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/t2parte3/narracion_sin_pausas.mp3 audio/t2parte3/palabras_sin_pausas.json \
  audio/t2parte3/narracion.mp3 audio/t2parte3/palabras.json \
  2.36:0.4 6.05:0.4 7.53:0.3 13.50:0.3 21.64:0.5 26.40:0.5 31.36:0.5 37.6:0.4 43.66:0.3 47.42:0.6 51.9:1.0 54.75:0.8 56.35:0.4 61.97:0.6
```

Las pausas: después de "No le abres" (para leer la tarjeta), "entra algo", "el celular de Memo", "detrás de él", "evacuación", "Tráela", "mi niña", "con ellos", "patio", antes de "Suena", la más larga después de "La cortina" (tomas las croquetas), después de "se calla" (silencio), "la apagó" y antes de la pregunta final.

## Sonido

Campanita del voto; el último golpe de Memo con eco y luego silencio; el celular que raspa el piso y vibra; los pasos de Memo que suben corriendo y el arrastre de los que lo siguen; dos avisos de mensaje y un zumbido grave; una nota aguda en "Tráela"; latidos y un acorde triste con Rosa; pájaros lejanos y gemidos arriba al amanecer; el lápiz que traza la ruta; los pitidos de Rosa en el radio; la alerta de Evelin desde "Suena" hasta que se corta; pasos de carrera, el llavero y el "¡TRRRAC!" de la cortina; el reloj en los últimos dos segundos; un golpe sordo cuando se calla; gemidos y el chillido bajito de Chispa; golpes de cierre.

Niveles medidos antes de normalizar: efectos de 6 a 17 dB debajo de la voz. La carrera (de "Suena" a "La cortina") va más fuerte a propósito, entre 6 y 9 dB, porque la alerta suena y la voz dice frases de una palabra.

## Personajes y recursos

Tú (corriendo, con la bolsa de croquetas), Chispa (gruñe a la puerta, sentada junto al plato vacío, corriendo detrás de ti, entre los infectados), Rosa (con el celular, en el radio), Memo (solo su celular y su silueta que sube con la lámpara), infectados (escalera, 502, patio, avenida).

## Cómo regenerarlo

```
cd video
./hacer_t2parte3.sh
./hacer_t2parte3.sh --publicar
```
