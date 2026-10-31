# CLAUDE.md · Serie stickman "La alerta"

Lee este archivo y `ESTADO_PROYECTO.md` antes de hacer cualquier cosa. Juntos explican todo el proyecto.

## De qué trata

Serie de videos cortos verticales en español para TikTok, Reels y Shorts. Historia de zombies en una unidad habitacional de la Ciudad de México, narrada en segunda persona ("tú"). A las 3:14 a. m. suena la alerta sísmica pero no tiembla; los vecinos bajan al patio como en los simulacros y los infectados, que cazan por el sonido, llegan corriendo.

La serie tiene 8 partes de 60 a 70 segundos. Unidas forman un video de unos 8 minutos. El guion completo está en `guiones/la-alerta-serie-8-partes.md`.

Todo se dibuja con código (SVG animado en Chromium). No se usan generadores de imágenes: Canva gasta créditos y no mantiene al personaje igual entre escenas. La voz es de ElevenLabs.

## Cómo empezar una sesión nueva

1. Lee `ESTADO_PROYECTO.md`: qué episodios están terminados, qué sigue y qué errores se conocen.
2. Revisa la rama: `git branch -a` y `git log --oneline -5`. Si el último PR no se ha fusionado a `main`, el trabajo más reciente está en esa rama.
3. Para un episodio nuevo sigue "Flujo para hacer un episodio" (abajo).
4. Al terminar cada episodio, actualiza la documentación (lista al final). Es una instrucción permanente del usuario.

## Estructura de archivos

```
CLAUDE.md                  este archivo
ESTADO_PROYECTO.md         estado, pendientes, decisiones, errores, próximos pasos
README.md                  presentación corta del repo
guiones/                   guiones y guías escritas
  la-alerta-serie-8-partes.md   guion completo de las 8 partes
  la-ofrenda-short-interactivo.md  short paranormal interactivo (no producido)
  guia-de-estilo.md        estilo del canal
  personajes.md            fichas y prompts de personajes (de cuando se probó Canva)
episodios/                 videos terminados, uno por carpeta
  parte-0N-nombre/         video .mp4, FICHA.md, escenas.md, hoja_de_escenas.jpg
referencias/               inspiración y pruebas (no se publica)
  videos/                  2 videos de otros creadores que se usaron de referencia
  personajes/              hoja oficial de personajes dibujada con el código
  prueba-codigo/           primera prueba sin créditos
  canva/                   miniaturas y enlaces de las imágenes de prueba en Canva
video/                     código para generar los episodios
  lib/                     piezas compartidas (ver abajo)
  parteN/                  escenas, cortes, mezcla y página de cada parte
  audio/parteN/            tomas de voz, narración procesada, tiempos por palabra, texto de la voz
  fonts/                   Oswald y Caveat (licencia OFL)
  personajes/hoja.html     hoja de personajes
  render.js                convierte una página en video o en cuadros sueltos
  hacer_parteN.sh          regenera la parte N
  salida/                  resultados temporales (no se sube a git)
```

`video/lib/`:

| Archivo | Qué hace |
|---|---|
| `dibujo.js` | `stick()`, `paliacate()`, `perro()`, `rosa()`, `memo()`, `infectado()`, `infectadoCorriendo()`, `vecino()`, degradados y filtros (`#ink`, `#tiembla`, `#blur10`). |
| `motor.js` | `montar()` y `render(t)`: muestra la escena, mueve la cámara (`de`/`a` o `claves`), subtítulos, fundido y trazo que "hierve". |
| `escena_base.js` | `M` (marcas), `INI`, `FIN()`, `lienzo()`, `viñeta`, `poste()` de la alerta, `escribe()` (texto que se escribe solo), `subrayado()`, `trazo()`. |
| `edificio.js` | `corteEdificio(pre, extra)`: corte del Edificio C con 502, 402 y escalera. |
| `estilo.css` | Fuentes, subtítulos, chat, cuaderno, VHS, cuenta regresiva, papel, presentación de personaje. |
| `linea_de_tiempo.py` | De `palabras.json` + `cortes.json` saca `tl.js`: inicio de cada escena, marcas y subtítulos. |
| `recorta_pausas.py` | Deja las pausas de la voz en un máximo y la acelera. |
| `inserta_silencios.py` | Mete silencios exactos y corre los tiempos de `palabras.json`. |
| `resumen_episodio.py` | Genera `escenas.md` y `hoja_de_escenas.jpg` de un episodio. |

## Estilo visual

1. Lienzo vertical 1080x1920, 30 cuadros por segundo.
2. Trazo de tinta negra (`#111`) con el filtro `#ink`, que se mueve 8 veces por segundo para que parezca animado a mano.
3. Colores: rojo de subtítulos y alertas `#e0312b`, paliacate `#c8282e`, tinta azul de cuaderno `#1d3a8a`. Noche en azules (`paredNoche`, `cielo`), día nublado en `paredDia` y `ventanaDia`.
4. Subtítulos: Oswald 700, 100 px, mayúsculas, de 1 a 3 palabras, blancos con borde negro y la palabra fuerte en rojo. Viven en la franja y = 1560 a 1700: no pongas nada importante ahí.
5. Tarjetas de reglas, inventario y notas: hoja de cuaderno de cuadrícula con letra Caveat azul, que se escribe sola.
6. Chats: pantalla de celular genérica oscura, sin logo de WhatsApp, mensajes en minúsculas y casi sin acentos.
7. Cámara: zoom lento en cada escena; en momentos fuertes, `claves` que acercan a la acción. Escenas de 2 a 7 segundos.
8. Gancho: desde la parte 3, cada parte abre con su momento más tenso, lo congela y rebobina ("10 MINUTOS ANTES"). Ver `video/parte3/escenas.js`.
9. Sonido sintetizado con ffmpeg (sirena, viento, latidos, golpes). Nunca la grabación oficial de la alerta sísmica. Volumen de efectos 10 dB o más debajo de la voz; la mezcla final se normaliza a -14 LUFS.

## Personajes

Ver `referencias/personajes/hoja_personajes.png`.

| Personaje | Función | Cómo se ve | Dónde vive |
|---|---|---|---|
| Tú | `stick()` | Cabeza blanca redonda, dos ojos negros ovalados, sin boca ni nariz, cuerpo de líneas, paliacate rojo SIEMPRE | 502, quinto piso |
| Chispa | `perro('gruñe' \| 'echada')` | Perrita café, una oreja parada y otra doblada, collar azul con placa | Contigo |
| Doña Rosa | `rosa()` | Chongo gris, lentes redondos, rebozo gris con flecos | 402, justo debajo |
| Memo | `memo()` | Bigote negro, chaleco beige con bolsillos, llavero | 101, administrador |
| Infectados | `infectado()`, `infectadoCorriendo()` | Cabeza gris, ojos blancos sin pupila, extremidades grises con contorno oscuro | Patio, escaleras, calle |
| Vecinos | `vecino()` | Stickman chico con pijama de color | Unidad |

Lalo (305) y Paty (203) solo aparecen en el chat.

## Reglas de continuidad

Del mundo:

1. Los infectados cazan por el sonido. En silencio se quedan quietos con la cara hacia arriba. Siempre van hacia el ruido más fuerte.
2. La alerta sísmica dura 90 segundos. Mientras suena, todos van a los postes y "el ruido es gratis".
3. La primera noche nadie sabe quién activó la alerta. Desde la noche 3 la activa Rosa (trabajó 30 años en el sistema de la alerta). Es el misterio de la temporada; no se revela antes de la parte 8.

De la historia, ya mostrado en video:

| Momento | Datos que no deben cambiar |
|---|---|
| Noche 0 (parte 1) | Alerta 3:14 a. m., no tiembla. Vecinos al punto de reunión del patio. 3:40: Lalo 305 escribe "no hagan ruido. estan en las escaleras" y no vuelve a escribir. Memo escribió a las 3:14 "bajen al punto de reunion. orden y calma". |
| Día 1 (parte 2) | Reglas 1 y 2. Inventario: agua 30 L (garrafón y medio), comida 5 días, croquetas 12 días, batería 41 %, sin luz. Celular en silencio a las 9:47, sin señal. Pila fuera del reloj. Cinta en la placa de Chispa (desde aquí la placa va encintada). Chat: Memo 7:02 "la puerta de abajo ya esta cerrada. no le abran a nadie", Paty 9:15 "alguien vio a mi hijo??", Rosa 16:47 "hay alguien vivo? estoy sola. no tengo agua". Batería 33 % en la tarde. |
| Día 2 (parte 3) | Rosa lleva 2 días sin agua. Hay infectados en la escalera. Botella de 2 L por el mecate del tendedero. Unos veinte infectados en el patio. Rosa atrapa la botella y manda la nota "Gracias, corazón. Dios te lo pague. No le abras a Memo." Memo tiene planta de luz y cajas de ATÚN, FRIJOL, SOPA y AGUA. 21:12: Memo escribe por privado "ya vi que tienes agua". Batería 29 %. |
| Día 3 en adelante | Lo que dice el guion de las partes 4 a 8 (inventario del día 3: agua 18 L, comida 3 días, croquetas 10 días, batería 22 %). |

Del narrador: segunda persona, sin palabras con género para "tú" (nada de "dormido" o "solo"). Rosa le dice "corazón".

## Flujo para hacer un episodio

Desde `video/`. La parte 3 es el mejor ejemplo a copiar.

1. **Guion:** toma la parte del guion de la serie y define el gancho (momento más tenso para abrir).
2. **Voz:** en ElevenLabs crea un flujo (`creative_create_flow`), genera la voz con `creative_generate_speech`: voz `lr39dERdpNg6kPUtWZTO` ("Alejandro - Horror y Misterio"), modelo `eleven_v4`, 2 tomas (el valor por omisión). Usa `[whispering]` antes de la última frase de suspenso. Escribe los números con letra ("tres catorce"). Guarda el texto en `audio/parteN/texto_voz.txt`.
3. **Descarga** las tomas a `audio/parteN/take1.mp3` y `take2.mp3` de inmediato: las URLs firmadas caducan en 2 horas.
4. **Procesa** la toma elegida hasta que dure unos 60 a 70 s: `python3 -I lib/recorta_pausas.py audio/parteN/take1.mp3 audio/parteN/narracion.mp3 0.32 1.15`. Si se pierde una pausa dramática, devuélvela con `lib/inserta_silencios.py` después de transcribir.
5. **Transcribe** con ElevenLabs: `creative_create_asset_upload`, PUT del mp3, `creative_finalize_asset_upload` con el `flow_id`, `creative_transcribe_audio` (`eleven_scribe_v1`). Descarga `words_download_url` a `audio/parteN/palabras.json`.
6. **Cortes:** copia `parte3/cortes.json` a `parteN/` y define la frase donde empieza cada escena, las marcas, las palabras en rojo, los reemplazos ("cuatrocientos dos" → "402") y las zonas sin subtítulos. `"frase@2"` busca la segunda vez que aparece. Corre `python3 -I lib/linea_de_tiempo.py parteN/cortes.json audio/parteN/palabras.json parteN/tl.js`.
7. **Escenas:** copia `parte3/parte3.html` como `parteN/parteN.html` (cambia el título) y escribe `parteN/escenas.js`. Letreros que no deben moverse con la cámara van en `fijo`.
8. **Revisa cuadros sueltos** antes de renderizar todo: `node render.js parteN/parteN.html /tmp/cuadros --cuadros 1,5,12` y mira las imágenes. Revisa en especial el gancho, los textos que se salen del cuadro y los subtítulos sobre elementos importantes.
9. **Sonido:** copia `parte3/mezcla.py` y ajusta efectos. Mide niveles por tramo con `volumedetect`; Claude no puede escuchar el audio, así que pide al usuario que lo revise.
10. **Render:** copia `hacer_parte3.sh` como `hacer_parteN.sh` (cambia números y carpeta), corre `./hacer_parteN.sh` (tarda unos 4 a 5 minutos, mejor en segundo plano), revisa `salida/la_alerta_parteN.mp4` y luego `./hacer_parteN.sh --publicar`.
11. **Documenta y sube** (lista al final).

## Ejecutar y regenerar

Dependencias: Node 18 o más con Playwright 1.63 y su Chromium, Python 3.10 o más (solo librería estándar), ffmpeg 6 con libx264 y AAC. Fuentes incluidas en `video/fonts/`. En la nube de Claude Code ya están instalados Playwright y Chromium; no corras `playwright install` ahí.

En otra computadora:

```
cd video
npm install                       # instala playwright 1.63.0
npx playwright install chromium
./hacer_parte1.sh                 # o 2, 3...; deja el video en salida/
./hacer_parte1.sh --publicar      # lo copia a episodios/ y regenera escenas.md y la hoja
npm run hoja-personajes           # vuelve a dibujar referencias/personajes/hoja_personajes.png
```

`render.js` toma una captura por cuadro (unos 2,000 cuadros por parte) y se las pasa a ffmpeg.

## Trampas conocidas

1. En `escenas.js`, todo lo que se usa en un `html:` al cargar debe estar definido antes en el archivo (las `const` no se elevan).
2. Un degradado definido dentro de una escena oculta no se ve desde otra escena: los degradados compartidos van en `defsSVG` de `dibujo.js`.
3. Los filtros con desenfoque necesitan región amplia (`x="-100%" width="300%"`) o se recortan.
4. Las escenas con cámara mueven todo su `html`. Títulos fijos van en `fijo`.
5. Si cambias `lib/`, revisa que las partes ya hechas sigan iguales: renderiza un cuadro y compáralo con el video publicado.
6. Si dos escenas deben coincidir con el audio (reloj de la parte 2, congelado de la parte 3), la constante está en `escenas.js` y en `mezcla.py`; cámbialas juntas.
7. El proxy del entorno bloquea Hugging Face y la descarga de imágenes de Canva. GitHub sí funciona.

## Git

1. Trabaja en una rama `claude/...` y abre un PR a `main`. No hagas force push ni borres trabajos anteriores.
2. Los videos finales solo cambian con `--publicar` y después de revisarlos. Cada video re-subido agrega unos 22 MB al historial: no subas pruebas.
3. Límite de GitHub: 100 MB por archivo. Hoy el más grande pesa 24 MB, así que no se usa Git LFS. Si un archivo pasa de 50 MB, usa Git LFS o súbelo como asset de un GitHub Release y deja el enlace en la FICHA.
4. El contenedor de la nube se borra al cerrar la sesión: haz commit y push seguido.

## Después de cada episodio terminado

1. `episodios/parte-0N-nombre/`: video, `FICHA.md` (copia la de la parte 3 y actualiza), `escenas.md` y `hoja_de_escenas.jpg` (los genera `--publicar`).
2. `episodios/README.md`: fila del episodio.
3. `ESTADO_PROYECTO.md`: episodio terminado, decisiones nuevas, errores, próximos pasos y registro de cambios.
4. `CLAUDE.md`: continuidad nueva (qué pasó, números, mensajes, objetos) y funciones nuevas en `lib/`.
5. `guiones/la-alerta-serie-8-partes.md`: si el episodio cambió frente al guion, actualiza esa parte.
6. Si cambió algún personaje, regenera la hoja de personajes.
7. Commit, push y PR.

## Cómo trabaja el usuario

Habla español de México. Prefiere respuestas directas en español. Revisa los videos en su celular. Aprobó gastar créditos de ElevenLabs para voz y transcripción (unos 2,000 créditos por parte) y prefiere no gastar créditos de Canva.
