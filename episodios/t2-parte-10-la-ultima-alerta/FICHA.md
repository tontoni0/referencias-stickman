# Temporada 2 · Parte 10 · La última alerta (final de la historia, gana 🪢)

| | |
|---|---|
| **Video** | `la_alerta_t2_parte10.mp4` · 82.5 s · 1080x1920 · 30 fps · H.264 + AAC · 35 MB · -16.8 LUFS |
| **Estado** | Terminado y publicado en el repo. Con esta parte termina "La alerta" |
| **Escenas** | 20 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Tarjeta del voto de la parte 9: "GANÓ" con 🪢 POR LA VENTANA, CON EL MECATE encendida y 🚪 POR LA ESCALERA, ENTRE ELLOS tachada |
| **Final** | Tarjeta "FIN · LA ALERTA" y "¿DE QUÉ QUIEREN LA SIGUIENTE HISTORIA?": 👻 FANTASMAS · 🛸 OVNIS · 🔪 UN ASESINO · COMENTA TU IDEA |

## Guion

1. Guion completo: `guiones/la-alerta-temporada-2.md`, sección "Parte 10 · La última alerta". Sigue el "Cómo termina" del mismo guion.
2. Texto exacto de la voz: `video/audio/t2parte10/texto_voz.txt`.
3. Lo que pasa: en la parte 9 gana 🪢. Rosa baja por la ventana con el mecate del tendedero; por calles oscuras, en silencio, llegan al centro de alerta. El tablero viejo se opera entre dos: Rosa en el micrófono, tú en la señal. A las 3:14 suena la alerta de la Coordinación; Rosa habla y la ciudad oye su voz en vez de la sirena: "No bajen. Quédense en silencio. Esta alerta es mentira." Ellos ya corren a los postes: hay que mandarlos a una sola zona, el estadio, donde está Evelin. A Rosa le tiembla la mano; el radio pita "MANDALA ABUELA". Rosa la manda: todos caminan al estadio, Memo entre ellos, y los helicópteros huyen. Amanece y los vecinos se asoman. Evelin entra al patio con un frasco del suero (se escondió en silencio). Rosa y Evelin se abrazan. El suero cura a Chispa. Le quitas los audífonos, le mueves la placa: suena y no viene nadie.
4. Es la única parte de la temporada 2 que no termina con una decisión: pregunta de qué quieren la siguiente historia.
5. Dura unos 83 s, un poco más que el rango de 60 a 80 s, porque cierra la historia.

## Para publicar

**Título:** La última alerta. Así termina | Temporada 2, parte 10 (final)
**Portada:** Y NO VIENE NADIE.

**Comentario fijado:**

```
Aquí termina La alerta. Gracias por votar en cada parte.
¿De qué quieren la siguiente historia?
👻 Fantasmas · 🛸 Ovnis · 🔪 Un asesino · o comenten su idea
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/t2parte10/escenas.js` | Las 20 escenas. Funciones propias: `fachada` (el Edificio C de noche o al amanecer, con luz en las ventanas), `vecinosVentanas` (vecinos que se asoman), `tableroViejo` (el tablero de 1995: mapa de zonas con focos, foco ESTADIO, medidores y palanca SEÑAL), `microfono`, `frasco` (el suero con el emblema), `grisPata` y `chispaCura` (el gris que se retira), `heli`, `ondasVoz` (la voz de Rosa en los postes), `CIELO_NOCHE(id)` y `CIELO_ALBA(id)` (un id por escena). Copia de la parte 9: `tuConChispa`, `grisCadera`, `cocinaRosa` y las piezas de las partes 1 y 8 (`calle`, `chispa`, `caraChispa` con `audifonosCara`, `rosaDe`, `evelinDe`, `memo`, `radioYLibreta`, `letrasEscritas`, `manoLapiz`, `vela`, `radioViejo`). `morse` con las letras de "MANDALA ABUELA" |
| `video/t2parte10/cortes.json` | Frases de corte, marcas, palabras en rojo, "tres catorce" → "3:14", sin subtítulos en la tarjeta final |
| `video/t2parte10/tl.js` | Línea de tiempo generada |
| `video/t2parte10/mezcla.py` | Campanita, grillos, el mecate que cruje, latidos, pasos y respiración, el zumbido del tablero, acordes tibios, la palanca, la alerta de la Coordinación, el clic del micrófono y el pitido de bocina, la estampida, la mano que tiembla, los pitidos en clave con el lápiz, el golpe de la palanca, la alerta lejana del estadio, la multitud que camina, los helicópteros que se van, pájaros, un acorde largo del amanecer, la campanita del frasco, el brillo del suero, el roce de los audífonos, el "tin" de la placa y el cierre. La voz de Rosa por las bocinas va con filtro de megáfono y dos copias retrasadas (140 y 330 ms) |
| `video/t2parte10/t2parte10.html` | Página que junta todo |
| `video/hacer_t2parte10.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): la alerta de la Coordinación en `M.suena - 0.05` y se calla cuando Rosa toma el micrófono en `M.hablaM - 0.1`; la palanca al estadio en `M.mandaM + 0.45`; le quitas los audífonos en `M.quitas + 0.3`; la placa suena en `M.suenaPlaca - 0.55`; los pitidos "MANDALA ABUELA" van de `M.pitaW + 0.5` a `M.abuela + 1.15` (la misma `morse()` en los dos archivos); la voz de Rosa por las bocinas va de `M.nobajenM - 0.05` a `M.pero - 0.15`.

## Voz (ElevenLabs)

| | |
|---|---|
| Cuenta | La cuenta nueva (desde el 07/11) |
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `SECHQQUQYVxyXPWyV4QE` · https://elevenlabs.io/app/flows/SECHQQUQYVxyXPWyV4QE |
| Toma usada | `take1.mp3` (generación `Em8Jhb8s1o7oPb237zVI`, 88.2 s): más corta y con el susurro final más bajo. Toma 2: `KUwoJpuufnwo4UFvQMAq` (90.0 s) |
| Transcripción | Scribe v1 de la toma 1 (nodo `0nDUc5UL9WtQQwP43EXZ`, generación `tnHwThWw4ZzLOYdZzrgG`), sin costo → `palabras_take1.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.2) → `narracion_sin_pausas.mp3` 68.1 s; `inserta_silencios.py` agrega 19 pausas → `narracion.mp3` 79.4 s |
| Créditos | ~1,978 (2 tomas × 989; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/t2parte10/take1.mp3 audio/t2parte10/narracion_sin_pausas.mp3 0.3 1.2 \
  --palabras audio/t2parte10/palabras_take1.json audio/t2parte10/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/t2parte10/narracion_sin_pausas.mp3 audio/t2parte10/palabras_sin_pausas.json \
  audio/t2parte10/narracion.mp3 audio/t2parte10/palabras.json \
  1.12:0.4 5.12:0.4 9.27:0.5 15.98:0.5 19.15:0.6 23.55:0.4 27.48:0.5 34.60:0.3 36.31:0.4 37.60:1.2 38.73:0.8 39.88:0.6 44.48:0.5 51.73:0.3 53.55:0.6 57.62:0.6 60.99:0.6 61.73:0.9 63.38:1.2
```

Las pausas largas: 1.2 s después de "pita" (los pitidos en clave), 0.6 s antes de "Suena" (ahí cae el "tin"), 0.9 s después y 1.2 s después de "no viene nadie".

## Sonido

Campanita del voto; grillos, el mecate que cruje y latidos mientras Rosa baja; pasos y la respiración de ellos en las calles; el zumbido del tablero, un acorde tibio en "corazón" y el clic de la palanca; la alerta de la Coordinación con una nota aguda en "3:14", que se calla de golpe cuando Rosa toma el micrófono (clic y pitido de bocina); otro acorde tibio cuando la ciudad oye su voz; la estampida hacia los postes; una nota en "donde está Evelin"; latidos y un temblor grave con la mano de Rosa; los pitidos en clave con el lápiz; el golpe de la palanca y la alerta lejana del estadio; la multitud que camina y los helicópteros que se alejan; al amanecer, pájaros y un acorde largo hasta el final; una campanita con el frasco; un acorde en el abrazo; un brillo que sube con el suero; el roce de los audífonos; el "tin" de la placa en la pausa antes de "Suena"; un golpe suave y un acorde en "FIN".

Niveles medidos antes de normalizar: efectos de 7 a 16 dB debajo de la voz. La palanca y la alerta del estadio quedan a unos 7 dB porque es el momento fuerte.

La mezcla pasa por `asetpts=N/SR/TB` antes de `apad`: con las copias retrasadas de la voz de Rosa, los tiempos se adelantaban y el audio salía de 79.6 s en vez de 82.5 s (ver "Trampas conocidas" en `CLAUDE.md`).

## Personajes y recursos

Tú (en la señal; le quitas los audífonos a Chispa), Chispa (curada; la placa suena), Rosa (baja por el mecate, habla por las bocinas, manda la última alerta), Evelin (escondida en el estadio; vuelve con el suero), Memo (camina al estadio entre ellos, ya transformado), la Coordinación (su alerta y sus helicópteros), vecinos (en las ventanas), infectados (calles, postes, camino al estadio).

## Cómo regenerarlo

```
cd video
./hacer_t2parte10.sh
./hacer_t2parte10.sh --publicar
```
