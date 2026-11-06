# Temporada 2 · Parte 6 · El centro de alerta (interactiva, ganó 🤫)

| | |
|---|---|
| **Video** | `la_alerta_t2_parte6.mp4` · 70.7 s · 1080x1920 · 30 fps · H.264 + AAC · TAMANO · LUFS |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 16 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Tarjeta del voto de la parte 5: "GANÓ" con 🤫 NO TE MUEVES encendida y 🏃 CORRES POR EL TÚNEL tachada |
| **Final** | Tarjeta de decisión: "¿QUÉ HACES?", 🤝 LO DEJAS VENIR · 🔐 LO ENCIERRAS AQUÍ |

## Guion

1. Guion completo: `guiones/la-alerta-temporada-2.md`, sección "Parte 6 · El centro de alerta (ganó 🤫)". La sección "La mordida de Chispa" dice cómo sigue ese arco hasta la parte 10.
2. Texto exacto de la voz: `video/audio/t2parte6/texto_voz.txt`.
3. Lo que pasa: en la parte 5 ganó 🤫. No te mueves; te rozan y te huelen, y uno le muerde a Chispa la pata trasera que cuelga de tus brazos. Chispa chilla y el túnel se te viene encima. Escapas por una escalera de emergencia al centro de alerta. La pata de Chispa ya está gris (en una pata tarda días). En la sala de control, una pantalla muestra el registro de la primera noche: a las 3:14:02 la prueba de Evelin solo para el Edificio C; a las 3:14:05 "todas las zonas", usuario Coordinación. Memo abre la puerta con su tarjeta de acceso, gris hasta el cuello. Ve la pata de Chispa y se ríe: "Ya somos dos." Dice que sabe llegar a la antena.
4. Aquí empieza el arco de la mordida de Chispa que pidió el usuario. Chispa no muere: se cura en la parte 10.

## Para publicar

**Título:** No me moví. Igual la mordieron | Temporada 2, parte 6
**Portada:** YA SOMOS DOS.

**Comentario fijado:**

```
Memo sabe llegar a la antena. ¿Qué haces?
🤝 Lo dejo venir · 🔐 Lo encierro aquí
La parte 7 se hace con lo que gane.
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/t2parte6/escenas.js` | Las 16 escenas. Funciones propias: `perroMordido` (Chispa con la pata trasera gris, venas y dos marcas; el gris sube según un valor de 0 a 1), `tuConChispaG` (tú cargando a Chispa mordida), `tarjeta` (la tarjeta de acceso de Memo), `salaVacia` (la sala de control abandonada con una pantalla prendida), `pantallaRegistro` y `teclea` (el registro que se escribe solo), el edificio del centro de alerta con su antena, la puerta con lector de tarjetas. Copia de partes anteriores: `memoDe`, `venas`, `brazoMordido`, `oscuro`, `luz`, `tunelLado`, `andenGente`, `tuCorre`, `tuDe`, `foco` |
| `video/t2parte6/cortes.json` | Frases de corte, marcas, palabras en rojo, "tres catorce" → "3:14", sin subtítulos en la tarjeta final |
| `video/t2parte6/tl.js` | Línea de tiempo generada |
| `video/t2parte6/mezcla.py` | Campanita, el túnel, latidos, olfateos, la mordida y los chillidos de Chispa, la estampida, la carrera, la escalera de metal, la puerta, la luz, viento, el reloj, el zumbido de la sala, el teclado, el "bip" de la tarjeta, la puerta que se abre, la risa de Memo, golpes de cierre |
| `video/t2parte6/t2parte6.html` | Página que junta todo |
| `video/hacer_t2parte6.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): la mordida en `M.muerdeM + 0.15`; sales a la luz en `M.luz - 0.05`; la tarjeta abre la puerta en `M.tarjeta + 0.5`.

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `RrXYWdaymD6ek9S4qfec` · https://elevenlabs.io/app/flows/RrXYWdaymD6ek9S4qfec |
| Toma usada | `take1.mp3` (generación `FpRPKEMjEpeIJhJt9YTQ`, 76.6 s): su susurro final es más bajo. Toma 2: `SMrYKoWfmAYO2DzV5zuM` (78.2 s) |
| Transcripción | Scribe v1 de la toma 1 (nodo `I3jFjbPWyE5dUQv6VU4p`, generación `K8NZKKZmeqefBeO3AT0u`), sin costo → `palabras_take1.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.2) → `narracion_sin_pausas.mp3` 60.0 s; `inserta_silencios.py` agrega 17 pausas → `narracion.mp3` 67.6 s |
| Créditos | ~1,660 (2 tomas × 830; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/t2parte6/take1.mp3 audio/t2parte6/narracion_sin_pausas.mp3 0.3 1.2 \
  --palabras audio/t2parte6/palabras_take1.json audio/t2parte6/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/t2parte6/narracion_sin_pausas.mp3 audio/t2parte6/palabras_sin_pausas.json \
  audio/t2parte6/narracion.mp3 audio/t2parte6/palabras.json \
  1.30:0.4 2.80:0.4 7.6:0.4 10.98:0.5 11.95:0.5 15.9:0.3 20.1:0.4 22.1:0.4 25.6:0.3 29.62:0.6 35.0:0.3 40.4:0.4 45.65:0.6 48.45:0.5 50.7:0.4 54.35:0.6 56.74:0.6
```

## Sonido

Campanita del voto; el retumbe y las goteras del túnel; latidos y olfateos; una tensión que sube mientras se agacha; la mordida, un golpe y el chillido de Chispa (otro más largo en "Chispa chilla"); gruñidos y estampida que crecen; la carrera, la escalera de metal, la puerta y un soplido de luz; viento afuera; un gemido de Chispa, latidos lentos y el reloj; el zumbido de la sala de control; un bip de la pantalla y el teclado del registro, con una nota aguda en "Coordinación"; el "bip" de la tarjeta y la puerta que se abre; un zumbido grave con Memo, su risa y una nota aguda en "Ya somos dos"; golpes de cierre.

Niveles medidos antes de normalizar: efectos de 7 a 15 dB debajo de la voz (la mordida queda a 7 dB porque cae en una pausa). Afuera del centro de alerta solo se oye el viento.

## Personajes y recursos

Tú (cargando a Chispa), Chispa (la muerden, chilla, su pata gris de cerca), Memo (gris hasta el cuello, con su tarjeta de acceso, el brazo mordido), cientos de infectados en el andén.

## Cómo regenerarlo

```
cd video
./hacer_t2parte6.sh
./hacer_t2parte6.sh --publicar
```
