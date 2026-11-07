# Temporada 2 · Parte 8 · Noventa segundos (interactiva, gana 🗣️)

| | |
|---|---|
| **Video** | `la_alerta_t2_parte8.mp4` · 75.8 s · 1080x1920 · 30 fps · H.264 + AAC · 34 MB · -16.6 LUFS |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 17 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Tarjeta del voto de la parte 7: "GANÓ" con 🗣️ LE CUENTAS A EVELIN encendida y 🤐 TE LO CALLAS tachada |
| **Final** | Tarjeta de decisión: "¿QUÉ HACES?", 🐕 SALVAS A CHISPA · 👩 VAS POR EVELIN |

## Guion

1. Guion completo: `guiones/la-alerta-temporada-2.md`, sección "Parte 8 · Noventa segundos (gana 🗣️)". La tabla "Cómo se respeta cada voto" dice cómo empieza la parte 9 con cada opción.
2. Texto exacto de la voz: `video/audio/t2parte8/texto_voz.txt`.
3. Lo que pasa: en la parte 7 iba ganando 🗣️ cuando se hizo. Le dices a Evelin que Memo está detrás del tinaco; ella aprieta la consola contra el pecho. Memo sale con las manos arriba: "Me rindo. Llévenme con ustedes." Evelin no le cree, pero te cuenta la primera noche: a las 3:14 mandó una prueba solo para el edificio de su abuela y tres segundos después la Coordinación tomó el sistema; querían a todos en los patios y las avenidas vacías. El plan: alertas de 90 segundos con la consola, zona por zona, hasta Rosa. En la primera alerta los infectados corren al poste y ustedes pasan. Bajo el puente no hay poste y está lleno: le quitas los audífonos a Chispa, aúlla y se los lleva; es más rápida y regresa. En la última zona Evelin aprieta el botón; Memo baja las manos, la agarra por detrás y se la lleva con la consola. Chispa todavía no trae los audífonos: la alerta la jala, ojos blancos, corre al poste entre ellos.
4. Es la parte en la que Memo se lleva a Evelin (sección "Cómo termina" del guion).

## Para publicar

**Título:** Le conté a Evelin. Igual se la llevó | Temporada 2, parte 8
**Portada:** NOVENTA SEGUNDOS.

**Comentario fijado:**

```
Chispa corre al poste y Memo se lleva a Evelin. ¿Qué haces?
🐕 Salvo a Chispa · 👩 Voy por Evelin
La parte 9 se hace con lo que gane.
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/t2parte8/escenas.js` | Las 17 escenas. Funciones propias: `poseCorre`, `tuCorre`, `evelinCorre` y `memoCorre` (corriendo de lado; Memo con las manos arriba), `espejo` (voltea un dibujo para que mire a la izquierda), `manosArriba`, `chispaCorre`, `evelinConsola` (Evelin con la consola contra el pecho), `calle` (avenida de día con poste opcional), `puente` y `bajoGente` (el paso a desnivel lleno), `ondasLejos` (la alerta que llega desde un lado), `MANZANAS`, `GENTE` y `ELLOS` (la ciudad desde arriba), la hoja "EL PLAN" con la ruta, `consolaGrande` (la consola de cerca con su cuenta regresiva). Copia de la parte 7: `azotea`, `fondoCerca`, `tinaco`, `memoDe`, `venas`, `quijada`, `brazoMordido`, `perroMordido`, `chispa`, `ojosBlancos`, `audifonosCara`, `audifonosSueltos`, `consola`, `walkie`, `tuDe`, `evelinDe`, `viento`, `foco`. Copia de la temporada 2, parte 1: `salaControl` y `mapaZonas` |
| `video/t2parte8/cortes.json` | Frases de corte, marcas, palabras en rojo, "tres catorce" → "3:14" y "noventa" → "90", sin subtítulos en la tarjeta final |
| `video/t2parte8/tl.js` | Línea de tiempo generada |
| `video/t2parte8/mezcla.py` | Campanita, viento, el susurro, los pasos de Memo, una tensión baja, el recuerdo (zumbido de la sala, el bip del botón, la alerta lejana en una zona y luego en todas, un golpe, la ciudad), la pluma del plan, la primera alerta con la estampida y los pasos de ustedes, la respiración bajo el puente, latidos, el aullido con eco (mismo generador que la parte 4), la estampida tras Chispa, sus patitas, el clic del botón, la última alerta hasta el final, el golpe y el forcejeo, el arrastre, un soplido cuando la jala, notas agudas, golpes de cierre |
| `video/t2parte8/t2parte8.html` | Página que junta todo |
| `video/hacer_t2parte8.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): la prueba de Evelin en `M.prueba + 0.1`; todas las zonas en `M.tomo`; la primera alerta en `M.primeraM - 0.1`; el aullido en `M.aullaM - 0.05`; el botón de la última zona en `M.boton + 0.25` y la alerta en `M.suena - 0.05`; Memo agarra a Evelin en `M.agarraM + 0.1`; los ojos blancos en `M.ojos + 0.1`.

## Voz (ElevenLabs)

| | |
|---|---|
| Cuenta | La cuenta nueva del usuario (desde el 07/11). La anterior llegó al límite del mes: quedaban 541 de 40,000 créditos y las dos tomas del primer intento fallaron sin cobrar (flujo `Z1ltizgcQE2ET1qI3mFQ`) |
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` (voz de la biblioteca: está en las dos cuentas) |
| Modelo | `eleven_v4` |
| Flujo | `9ucEoW22AUw99nCuiVXY` · https://elevenlabs.io/app/flows/9ucEoW22AUw99nCuiVXY |
| Toma usada | `take1.mp3` (generación `fTt6rKSvVOu9xiyKkTD2`, 81.9 s): más corta y con el susurro final más bajo. Toma 2: `wBYMxYnxTtISEvmEZAwg` (85.6 s) |
| Transcripción | Scribe v1 de la toma 1 (nodo `e3oZ2HZg1QEuXBBkrmtf`, generación `YKcAETrokFInlagDqYqU`), sin costo → `palabras_take1.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.2) → `narracion_sin_pausas.mp3` 66.0 s; `inserta_silencios.py` agrega 16 pausas → `narracion.mp3` 72.7 s |
| Créditos | ~2,002 (2 tomas × 1,001; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/t2parte8/take1.mp3 audio/t2parte8/narracion_sin_pausas.mp3 0.3 1.2 \
  --palabras audio/t2parte8/palabras_take1.json audio/t2parte8/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/t2parte8/narracion_sin_pausas.mp3 audio/t2parte8/palabras_sin_pausas.json \
  audio/t2parte8/narracion.mp3 audio/t2parte8/palabras.json \
  1.48:0.4 6.26:0.4 11.48:0.5 14.87:0.4 19.28:0.4 23.42:0.5 27.00:0.5 31.92:0.3 37.90:0.5 41.57:0.3 44.06:0.4 47.82:0.3 50.44:0.3 55.62:0.6 59.50:0.3 62.73:0.6
```

Los puntos de las pausas salen de `silencedetect` sobre `narracion_sin_pausas.mp3`. Las escenas se dibujaron primero con tiempos por palabra estimados (la voz no se pudo generar ese día); como todo va con marcas, se ajustaron solas a la voz real.

## Sonido

Campanita del voto; viento en la azotea; un susurro cuando le dices a Evelin; los pasos de Memo y una nota aguda en "me rindo"; una tensión baja; un soplido al entrar al recuerdo; en la sala, el zumbido, el bip del botón y la alerta lejana solo en una zona; en "tomó el sistema", la alerta en toda la ciudad con un golpe, y una nota aguda en "Coordinación"; el rumor de la ciudad; la pluma del plan; la primera alerta, la estampida hacia el poste y ustedes corriendo; bajo el puente, la respiración de cientos, latidos y una nota en "lleno"; el roce de los audífonos y el aullido de Chispa con eco; la estampida tras ella y sus patitas de regreso; el clic del botón y la última alerta, que ya no se calla; una nota en "ya no tiene las manos arriba", el golpe y el forcejeo cuando Memo la agarra, el arrastre y latidos rápidos; un soplido cuando la alerta jala a Chispa, una nota en los ojos blancos y la estampida al poste; golpes de cierre.

Niveles medidos antes de normalizar: efectos de 8 a 23 dB debajo de la voz. El aullido y la estampida tras Chispa quedan a unos 8 dB porque son lo que se cuenta.

## Personajes y recursos

Tú (en la azotea, corriendo, con los audífonos de Chispa en la mano), Chispa (con audífonos, luego sin ellos: aúlla, regresa, ojos blancos, corre al poste), Evelin (con la consola contra el pecho; de noche en el recuerdo con los audífonos puestos), Memo (con las manos arriba hasta que agarra a Evelin; gris hasta la quijada; el radio en el cinturón), infectados (avenida, puente, estampida), la ciudad desde arriba.

## Cómo regenerarlo

```
cd video
./hacer_t2parte8.sh
./hacer_t2parte8.sh --publicar
```
