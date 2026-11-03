# Parte 8 · La primera noche (final de temporada)

| | |
|---|---|
| **Video** | `la_alerta_parte8.mp4` · 75.4 s · 1080x1920 · 30 fps · H.264 + AAC · 30 MB · -16.5 LUFS |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 16 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Tarjeta del voto de la parte 7: "GANÓ" con 🐕 encendida y 🔑 tachada |
| **Final** | Tarjeta de sospechosos: ¿quién activó la alerta la primera noche? (Memo 101, Lalo 305, Paty 203 o alguien de afuera) y "TEMPORADA 2" |

## Guion

1. Guion completo: `guiones/la-alerta-serie-8-partes.md`, sección "Parte 8 · La primera noche (final de temporada)". Es la versión 🐕, que ganó en la parte 7 con 70 % de 559 votos en la encuesta de TikTok.
2. Texto exacto de la voz: `video/audio/parte8/texto_voz.txt`.
3. Lo que pasa: Rosa te jala hacia adentro y cierra la ventana; Chispa te lame la cara; los gritos de Memo se apagan y su llavero cae al patio, entre ellos. Rosa prende una vela; le ves la cara por primera vez ("Llegó por mi ventana, corazón. Igual que tu botella"). En su mesa hay un radio con antena de ganchos y una libreta con "3:14" muchas veces. Trabajó treinta años en el sistema de la alerta; la de hace rato fue ella, para vaciar el patio. Pero la primera noche no fue ella. Entonces la alerta empieza a sonar y Rosa no ha tocado el radio. Arriba, en la azotea, una lámpara se vuelve a prender.
4. Dos ganchos para la temporada 2: alguien más controla la alerta, y Memo podría seguir vivo.

## Para publicar

**Título:** ¿Quién activó la alerta la primera noche? | Parte 8 (final)
**Portada:** NO FUE ELLA.

**Comentario fijado:**

```
¿Quién activó la alerta la primera noche?
🔑 Memo · 📱 Lalo · 👩 Paty · ❓ alguien de afuera
La temporada 2 empieza con lo que comenten.
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/parte8/escenas.js` | Las 16 escenas. Funciones propias: `cocina` y `hojaVentana` (la cocina del 402 y la ventana que se cierra), `rosaDe` (Rosa a cualquier tamaño), `vela`, `tuConChispa`, `llavero` (con la etiqueta TIENDA), `botella2L` (la botella de la parte 3 con el mecate), `radioViejo` (radio con antena de ganchos), `LIBRETA` (3:14 escrito muchas veces), la foto "Centro de alerta, 1995" y la tarjeta de sospechosos |
| `video/parte8/cortes.json` | Frases de corte, marcas, palabras en rojo, zonas sin subtítulos |
| `video/parte8/tl.js` | Línea de tiempo generada |
| `video/parte8/mezcla.py` | Campanita, ventana y seguro, gemido de Chispa, acordes de alivio, grito que se apaga, llavero que cae, cerillo, estática del radio, perilla, sirena del recuerdo, tensión y golpe agudo, la alerta que vuelve a sonar, clic de la lámpara, golpes de cierre |
| `video/parte8/parte8.html` | Página que junta todo |
| `video/hacer_parte8.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): el llavero pega en el patio en `INI.patio + 0.45` y Rosa raspa el cerillo en `INI.vela + 0.25`.

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `YcN7ShYitl4jpJpwhiWZ` · https://elevenlabs.io/app/flows/YcN7ShYitl4jpJpwhiWZ |
| Toma usada | `take2.mp3` (generación `WZ9IhzMqmmJRjHg5npcn`, 88.9 s): queda más corta y su susurro final es más bajo. Toma 1: `Vcpm8HP37M78YuzjKKGN` (93.6 s) |
| Transcripción | Scribe v1 de la toma 2 (generación `v9SIz5MkM52bwrQdaL62`), sin costo → `palabras_take2.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.2) → `narracion_sin_pausas.mp3` 68.2 s; `inserta_silencios.py` agrega 8 pausas → `narracion.mp3` 72.0 s |
| Créditos | ~2,056 (2 tomas × 1,028; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/parte8/take2.mp3 audio/parte8/narracion_sin_pausas.mp3 0.3 1.2 \
  --palabras audio/parte8/palabras_take2.json audio/parte8/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/parte8/narracion_sin_pausas.mp3 audio/parte8/palabras_sin_pausas.json \
  audio/parte8/narracion.mp3 audio/parte8/palabras.json 0.95:0.6 15.78:0.4 19.58:0.3 49.58:0.4 50.91:0.35 53.32:0.9 58.52:0.4 62.70:0.5
```

Las pausas: después de "Ganó Chispa" (para que se lea la tarjeta), "Su llavero", "Entre ellos", "Rosa no sonríe", entre las dos "la primera noche", después de "yo no la activé" (la más larga, antes de que suene la alerta), "no ha tocado el radio" y "una lámpara se vuelve a prender".

## Sonido

Campanita del voto; la ventana que baja y el seguro; un gemido feliz de Chispa y un acorde de alivio; el grito de Memo que se apaga; un soplido mientras cae el llavero y su tintineo al pegar en el patio; gruñidos; el cerillo y un acorde cálido; estática del radio; la perilla; la sirena del recuerdo, lejana; tensión que sube y un golpe agudo después de "no la activé"; la alerta que vuelve a sonar hasta el final; el clic de la lámpara; golpes graves en la tarjeta y en "temporada dos".

Niveles medidos antes de normalizar: efectos de 9 a 18 dB debajo de la voz. El golpe agudo de "no la activé" queda a unos 9 dB porque cae en la pausa.

## Personajes y recursos

Tú, Chispa (te lame, sentada junto a Rosa, en tus brazos), Rosa (de cuerpo entero, su cara de cerca por primera vez, en una foto de 1995 frente al tablero de la alerta), Memo (solo su llavero y la lámpara al final), unos 24 infectados en el patio, la botella de 2 L de la parte 3.

## Cómo regenerarlo

```
cd video
./hacer_parte8.sh
./hacer_parte8.sh --publicar
```
