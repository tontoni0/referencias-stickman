# Temporada 2 · Parte 9 · Bajen al patio (interactiva, gana 🐕)

| | |
|---|---|
| **Video** | `la_alerta_t2_parte9.mp4` · 75.0 s · 1080x1920 · 30 fps · H.264 + AAC · 29 MB · -16.9 LUFS |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 16 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Tarjeta del voto de la parte 8: "GANÓ" con 🐕 SALVAS A CHISPA encendida y 👩 VAS POR EVELIN tachada |
| **Final** | Tarjeta de decisión: "¿POR DÓNDE BAJAN?", 🪢 POR LA VENTANA, CON EL MECATE · 🚪 POR LA ESCALERA, ENTRE ELLOS |

## Guion

1. Guion completo: `guiones/la-alerta-temporada-2.md`, sección "Parte 9 · Bajen al patio (gana 🐕)". La tabla "Cómo se respeta cada voto" dice cómo empieza la parte 10 con cada opción.
2. Texto exacto de la voz: `video/audio/t2parte9/texto_voz.txt`.
3. Lo que pasa: en la parte 8 gana 🐕. Corres al poste entre ellos (el ruido es gratis), agarras a Chispa y le pones los audífonos: vuelve a ser Chispa. A lo lejos, Memo arrastra a Evelin al estadio. Se abre una reja y unos guantes negros se llevan a Evelin y la consola. Memo estira el brazo gris y una bocina le dice "No evacuamos mordidos". La reja se cierra y a Memo se le van las pupilas: ya no es Memo. Tú y Chispa vuelven con Rosa. A medianoche el radio de Rosa habla solo: "Hoy a las 3:14, bajen al punto de reunión. Orden y calma", lo mismo que escribió Memo la primera noche. Luego los pitidos de Evelin: Rosa escribe "EL TABLERO VIEJO" y "HAY CURA". El gris de Chispa ya pasó la cadera. Rosa apaga la vela: por primera vez va a salir. Abre la puerta: el radio los trajo y la escalera está llena.
4. Memo termina de transformarse aquí. La Coordinación no se ve: solo sus guantes negros, su emblema y su bocina.

## Para publicar

**Título:** Salvé a Chispa. A Evelin se la llevaron | Temporada 2, parte 9
**Portada:** NO EVACUAMOS MORDIDOS.

**Comentario fijado:**

```
La escalera está llena. ¿Por dónde bajan?
🪢 Por la ventana, con el mecate · 🚪 Por la escalera, entre ellos
La parte 10 es la última. Se hace con lo que gane.
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/t2parte9/escenas.js` | Las 16 escenas. Funciones propias: `tuConChispa`, `grisCadera` y `chispaCadera` (el gris en la cadera), `guante` (brazo con guante negro), `estadioReja` (muro, letrero ESTADIO, emblema de la Coordinación, bocina y reja corrediza), `ondasBocina`, `cocinaRosa`, `relojDoce`, `libreta314`, `edificioCorte` y `LLENA` (la escalera llena, como en la parte 2). Copia de la parte 8: `calle`, `tuCorre`, `chispa`, `ojosBlancos`, `audifonosCara`, `consola`, `evelinConsola`, `memoDe`, `venas`, `quijada`, `brazoMordido`, `perroMordido`, `ondasLejos`, `foco`. Copia de la parte 1: `morse` (con C, H y J agregadas), `vela`, `radioViejo`, `estatica`, `radioYLibreta`, `morseVisual`, `letrasEscritas` (con la J más angosta), `puntaLapiz`, `manoLapiz`. `rosaDe` acepta brazos |
| `video/t2parte9/cortes.json` | Frases de corte, marcas, palabras en rojo, "tres catorce" → "3:14", sin subtítulos en la tarjeta final |
| `video/t2parte9/tl.js` | Línea de tiempo generada |
| `video/t2parte9/mezcla.py` | Campanita, la alerta, pasos, gemidos, latidos, el gruñido de Chispa, el roce y el golpe de los audífonos, un acorde tibio, el helicóptero, un zumbido grave, la reja que corre, el forcejeo, el pitido de la bocina, el ¡CLANG! con su resonancia, el gruñido de Memo, grillos, la estática del radio, el aviso del chat, los pitidos en clave con el lápiz, un gemido de Chispa, el soplido de la vela, la puerta, la respiración de la escalera, golpes de cierre. La voz de la bocina va con filtro de megáfono y la del radio con filtro de radio |
| `video/t2parte9/t2parte9.html` | Página que junta todo |
| `video/hacer_t2parte9.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): los audífonos quedan puestos en `M.pones + 0.6`; la reja se abre en `M.abre + 0.1`; los guantes jalan a Evelin en `M.guantes + 0.3`; la reja se cierra en `M.cierraM + 0.1`; a Memo se le van las pupilas en `M.pupilas + 0.2`; la vela se apaga en `M.apaga + 0.5`; la puerta se abre en `M.abrePuerta + 0.25`; los pitidos `EL TABLERO VIEJO` van de `M.pitidosM + 0.75` a `M.viejo + 0.4` y `HAY CURA` de `M.viejo + 0.6` a `M.cura + 0.75` (la misma función `morse()` en los dos archivos); la voz de la bocina va de `M.noEvac - 0.05` a `M.dice - 0.1` y la del radio de `M.hoy - 0.05` a `M.mismo - 0.15`.

## Voz (ElevenLabs)

| | |
|---|---|
| Cuenta | La cuenta nueva (desde el 07/11) |
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `dG9TzMB83c3kZHamSFc2` · https://elevenlabs.io/app/flows/dG9TzMB83c3kZHamSFc2 |
| Toma usada | `take2.mp3` (generación `oF4jBb9sTyfAMLgySATG`, 80.7 s): casi igual a la toma 1 y un poco más corta. Toma 1: `ZfdtEPtOOwuas2TkKXXA` (81.1 s) |
| Transcripción | Scribe v1 de la toma 2 (nodo `82wLeQCDkTniqVmwEBUg`, generación `2A84MjrU8TTaXIrYtTnu`), sin costo → `palabras_take2.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.2) → `narracion_sin_pausas.mp3` 62.0 s; `inserta_silencios.py` agrega 18 pausas → `narracion.mp3` 71.8 s |
| Créditos | ~1,756 (2 tomas × 878; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/t2parte9/take2.mp3 audio/t2parte9/narracion_sin_pausas.mp3 0.3 1.2 \
  --palabras audio/t2parte9/palabras_take2.json audio/t2parte9/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/t2parte9/narracion_sin_pausas.mp3 audio/t2parte9/palabras_sin_pausas.json \
  audio/t2parte9/narracion.mp3 audio/t2parte9/palabras.json \
  1.39:0.4 9.10:0.5 12.45:0.4 17.85:0.5 21.64:0.3 23.00:0.4 26.88:0.5 28.02:0.7 30.14:0.5 33.08:0.4 37.61:0.6 40.32:0.4 41.94:1.2 44.32:0.8 45.15:0.6 48.65:0.5 55.12:0.4 57.10:0.7
```

Las pausas largas después de "pitidos" (1.2 s) y de "viejo" (0.8 s) dejan oír los pitidos en clave. Cada unidad del Morse dura unos 25 ms, como en la parte 1.

## Sonido

Campanita del voto; la alerta que sigue sonando, tus pasos entre ellos, el gemido de cientos y latidos rápidos; el gruñido de Chispa hasta que le pones los audífonos (un roce y un golpe sordo) y un acorde tibio cuando vuelve a ser Chispa; el helicóptero del estadio y un zumbido grave; la reja que corre, el forcejeo cuando la jalan y una nota aguda; un pitido de megáfono antes de la bocina; el ¡CLANG! con resonancia de metal, una nota en las pupilas y el gruñido de Memo; en el 402, grillos y otro acorde tibio; la estática del radio y una nota en "3:14"; el aviso del chat y una nota en "escribió Memo"; los pitidos en clave con el lápiz; latidos lentos y un gemido de Chispa; el soplido de la vela; la puerta que se abre, la respiración de la escalera llena, una nota en "llena" y latidos; golpes de cierre.

Niveles medidos antes de normalizar: efectos de 7 a 24 dB debajo de la voz. La reja, la bocina y el ¡CLANG! quedan entre 7 y 8 dB porque son los momentos fuertes.

La primera mezcla llevaba `aecho` en la voz de la bocina y el audio salía de 72 s en vez de 75: con `aecho` en una rama de la voz, `apad` ya no rellena el final. Se cambió por una copia retrasada 120 ms (ver "Trampas conocidas" en `CLAUDE.md`).

## Personajes y recursos

Tú (corriendo al poste, cargando a Chispa), Chispa (ojos blancos, con audífonos, el gris en la cadera), Memo (arrastra a Evelin, estira el brazo gris, se transforma del todo detrás de la reja), Evelin (se la llevan los guantes negros con la consola), la Coordinación (guantes negros, emblema rojo, bocina; nunca se ve), Rosa (abraza a Chispa, apaga la vela, abre la puerta), infectados (poste, escalera llena).

## Cómo regenerarlo

```
cd video
./hacer_t2parte9.sh
./hacer_t2parte9.sh --publicar
```
