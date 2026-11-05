# Temporada 2 · Parte 5 · El metro (interactiva, ganó 🏚️)

| | |
|---|---|
| **Video** | `la_alerta_t2_parte5.mp4` · 65.4 s · 1080x1920 · 30 fps · H.264 + AAC · TAMANO · LUFS |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 15 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Tarjeta del voto de la parte 4: "GANÓ" con 🏚️ POR LOS ESCOMBROS encendida y 🚇 POR EL METRO tachada |
| **Final** | Tarjeta de decisión: "¿QUÉ HACES?", 🏃 CORRES POR EL TÚNEL · 🤫 NO TE MUEVES |

## Guion

1. Guion completo: `guiones/la-alerta-temporada-2.md`, sección "Parte 5 · El metro (ganó 🏚️)". La tabla "Cómo se respeta cada voto" dice cómo empieza la parte 6 con cada opción.
2. Texto exacto de la voz: `video/audio/t2parte5/texto_voz.txt`.
3. Lo que pasa: en la parte 4 ganó 🏚️. Bajas por el edificio caído donde encontraste a Chispa y ella lo reconoce. El sótano está partido; pisas una losa, cede y caes a las vías del metro con todo y piedras. El golpe rebota por el túnel. A oscuras, solo con la luz del celular, caminas hasta el andén: hay cientos de infectados parados con la cara hacia arriba. Pasas entre ellos sin respirar. La cinta de la placa de Chispa se despegó en la caída; la placa suena una vez y cientos de cabezas giran hacia ti.
4. Desde aquí la placa de Chispa ya no tiene cinta.
5. La opción de la tarjeta es "no te mueves" y no "te quedas quieto", para que el narrador no tenga género.

## Para publicar

**Título:** Bajamos por los escombros. Abajo nos estaban esperando | Temporada 2, parte 5
**Portada:** UNA SOLA VEZ.

**Comentario fijado:**

```
Cientos de cabezas te miran. ¿Qué haces?
🏃 Corro por el túnel · 🤫 No me muevo
La parte 6 se hace con lo que gane.
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/t2parte5/escenas.js` | Las 15 escenas. Funciones propias: `oscuro` y `luz` (oscuridad con un degradado radial que sigue la luz del celular), `tuConChispa` (tú cargando a Chispa), `celu` (el celular prendido), `tunelLado` (bóveda, vías y durmientes que se mueven), `ANDEN` y `andenGente` (filas de infectados que se alejan), la losa que se agrieta, la placa que se mueve, la multitud vista desde arriba con los ojos que giran hacia ti. Copia de la parte 4: `escombros`, `tuDe`, `foco` |
| `video/t2parte5/cortes.json` | Frases de corte, marcas, palabras en rojo, sin subtítulos en la tarjeta final |
| `video/t2parte5/tl.js` | Línea de tiempo generada |
| `video/t2parte5/mezcla.py` | Campanita, viento, el gemido de Chispa y el eco del aullido de cachorra, polvo, el crujido y el ¡CRAC!, la caída con piedras y su eco, el retumbe y las goteras del túnel, latidos, un paso con eco, la grava, la respiración del andén, la cinta que se despega, el "tin" de la placa, las cabezas que giran, golpes de cierre |
| `video/t2parte5/t2parte5.html` | Página que junta todo |
| `video/hacer_t2parte5.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): la losa truena en `M.cede + 0.35`; caes a las vías en `M.caes + 0.85`; la placa suena en `M.unavez - 0.75`; las cabezas giran en `M.giran - 0.1`.

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `FDSOzZk0byzNdnRl4A3t` · https://elevenlabs.io/app/flows/FDSOzZk0byzNdnRl4A3t |
| Toma usada | `take1.mp3` (generación `ErpSWnvIsY4QmpYsu6jj`, 68.8 s). Toma 2: `iyLELvSjra0G60wp63UO` (70.0 s); las dos susurran igual al final |
| Transcripción | Scribe v1 de la toma 1 (nodo `Z9Kr5GOcnB15DR4tiRb7`, generación `3Byt3Rzpw5xtcglFUivX`), sin costo → `palabras_take1.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.2) → `narracion_sin_pausas.mp3` 53.2 s; `inserta_silencios.py` agrega 17 pausas → `narracion.mp3` 62.3 s |
| Créditos | ~1,528 (2 tomas × 764; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/t2parte5/take1.mp3 audio/t2parte5/narracion_sin_pausas.mp3 0.3 1.2 \
  --palabras audio/t2parte5/palabras_take1.json audio/t2parte5/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/t2parte5/narracion_sin_pausas.mp3 audio/t2parte5/palabras_sin_pausas.json \
  audio/t2parte5/narracion.mp3 audio/t2parte5/palabras.json \
  1.35:0.4 8.18:0.4 11.53:0.3 12.8:0.4 14.12:0.3 18.38:0.6 19.4:1.0 21.35:0.4 27.88:0.6 31.1:0.5 33.3:0.4 37.08:0.5 38.95:0.8 43.5:0.3 46.4:0.9 47.6:0.6 49.95:0.7
```

Este episodio usa más silencio que los otros: un segundo después de "Silencio", casi uno después de "La placa suena" (ahí cae el "tin") y pausas largas antes y después de "sin respirar".

## Sonido

Campanita del voto; viento afuera; un gemido de Chispa y el eco lejano del aullido de cachorra cuando reconoce el edificio; polvo en el sótano; la losa que cruje, el ¡CRAC! y la caída con piedras; el golpe en las vías con eco largo y un segundo retumbe; abajo, un zumbido grave y goteras; latidos; un paso con eco en "el que tú haces"; pasos en la grava; la respiración de cientos en el andén y una tensión que sube; la cinta que se despega; el "tin" de la placa en silencio total, con eco; el barrido de las cabezas que giran, un gemido de cientos y un golpe; golpes de cierre.

Niveles medidos antes de normalizar: efectos de 7 a 19 dB debajo de la voz. El crujido, la caída, el andén y las cabezas que giran quedan entre 7 y 9 dB porque son los momentos fuertes y caen en pausas.

## Personajes y recursos

Tú (cargando a Chispa todo el episodio), Chispa (reconoce el edificio, en tus brazos, su placa de cerca), cientos de infectados en el andén. No aparecen Rosa, Evelin ni Memo.

## Cómo regenerarlo

```
cd video
./hacer_t2parte5.sh
./hacer_t2parte5.sh --publicar
```
