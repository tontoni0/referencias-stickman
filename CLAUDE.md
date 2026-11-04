# CLAUDE.md · Serie stickman "La alerta"

Lee este archivo y `ESTADO_PROYECTO.md` antes de hacer cualquier cosa. Juntos explican todo el proyecto.

## De qué trata

Serie de videos cortos verticales en español para TikTok, Reels y Shorts. Historia de zombies en una unidad habitacional de la Ciudad de México, narrada en segunda persona ("tú"). A las 3:14 a. m. suena la alerta sísmica pero no tiembla; los vecinos bajan al patio como en los simulacros y los infectados, que cazan por el sonido, llegan corriendo.

La temporada 1 tiene 8 partes de 60 a 80 segundos y ya está completa. Unidas forman un video de unos 8 minutos. El guion completo está en `guiones/la-alerta-serie-8-partes.md`. Las partes 6 y 7 son interactivas: terminan con una decisión para los comentarios y la parte siguiente se hace con la opción que gane (en la 6 ganó 🔦; la 8 depende del voto de la 7).

La temporada 2 está en curso y es la última: la historia de "La alerta" termina en su parte 10 (pedido del usuario, para empezar después una historia nueva). Su diseño está en `guiones/la-alerta-temporada-2.md`: 10 capítulos, un personaje nuevo (Evelin, la nieta de Rosa), la verdad de la primera noche, cómo termina y las historias de fondo. Lo que ahí se marca "solo para quien escribe" todavía no se cuenta en video. De la parte 2 a la 9, todas terminan con una decisión para los comentarios; lo que gane cambia cómo empieza la parte siguiente, pero los hechos de cada capítulo y el final son los mismos (tabla "Cómo se respeta cada voto" del guion). La 10 pregunta de qué quieren la siguiente historia. Terminadas: parte 1 ("Evelin") y parte 2 ("La puerta").

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
  la-alerta-temporada-2.md      temporada 2: verdad oculta, cómo termina, historias de fondo, 10 capítulos, qué cambia con cada voto y guiones de las partes ya hechas
  la-ofrenda-short-interactivo.md  short paranormal interactivo (no producido)
  guia-de-estilo.md        estilo del canal
  personajes.md            fichas y prompts de personajes (de cuando se probó Canva)
episodios/                 videos terminados, uno por carpeta
  parte-0N-nombre/         video .mp4, FICHA.md, escenas.md, hoja_de_escenas.jpg
  t2-parte-0N-nombre/      lo mismo para la temporada 2
referencias/               inspiración y pruebas (no se publica)
  videos/                  2 videos de otros creadores que se usaron de referencia
  personajes/              hoja oficial de personajes dibujada con el código
  prueba-codigo/           primera prueba sin créditos
  canva/                   miniaturas y enlaces de las imágenes de prueba en Canva
video/                     código para generar los episodios
  lib/                     piezas compartidas (ver abajo)
  parteN/                  escenas, cortes, mezcla y página de cada parte
  t2parteN/                lo mismo para la temporada 2
  audio/parteN/            tomas de voz, narración procesada, tiempos por palabra, texto de la voz (temporada 2: audio/t2parteN/)
  fonts/                   Oswald y Caveat (licencia OFL)
  personajes/hoja.html     hoja de personajes
  render.js                convierte una página en video o en cuadros sueltos
  hacer_parteN.sh          regenera la parte N (temporada 2: hacer_t2parteN.sh)
  salida/                  resultados temporales (no se sube a git)
```

`video/lib/`:

| Archivo | Qué hace |
|---|---|
| `dibujo.js` | `stick()`, `paliacate()`, `perro('gruñe' \| 'parada' \| 'echada')`, `perroSentada(aulla)`, `caraChispa()` (primer plano: gruñe, ladra, lame, aúlla; `sinCinta` dibuja la placa como antes del día 1), `paloma()`, `rosa()`, `memo()`, `infectado()`, `infectadoCorriendo()`, `infectadoLado()` (corre de lado), `infectadoQuieto()` (parado, brazos arriba o abajo), `vecino()`, `evelin()` (temporada 2; `audifonos: 'cuello' | 'puestos'`, `nina: true` para Evelin de niña), degradados (`#haz` para el haz de una lámpara) y filtros (`#ink`, `#tiembla`, `#blur10`, `#contorno` para que las figuras se vean de noche). |
| `motor.js` | `montar()` y `render(t)`: muestra la escena, mueve la cámara (`de`/`a` o `claves`), subtítulos, fundido y trazo que "hierve". |
| `escena_base.js` | `M` (marcas), `INI`, `FIN()`, `lienzo()`, `viñeta`, `poste()` de la alerta, `escribe()` (texto que se escribe solo), `subrayado()`, `trazo()`, `hoja()` (cuaderno), `iconos` del inventario, `TINTA`, `chatPrivado()` y `animaMensajes()`. |
| `edificio.js` | `corteEdificio(pre, extra)`: corte del Edificio C con 502, 402 y escalera. |
| `estilo.css` | Fuentes, subtítulos, chat, cuaderno, VHS, cuenta regresiva, papel, presentación de personaje, reloj en pantalla (`.reloj-mini`, `.reloj-grande`), onomatopeyas (`.onomato`), tarjeta de decisión para los comentarios (`.decide-tit`, `.opcion`, `.decide-com`, `.decide-pie`). |
| `linea_de_tiempo.py` | De `palabras.json` + `cortes.json` saca `tl.js`: inicio de cada escena, marcas y subtítulos. Ignora etiquetas como `[whispering]`. |
| `recorta_pausas.py` | Deja las pausas de la voz en un máximo y la acelera. Con `--palabras` también corre los tiempos de una transcripción hecha sobre la toma original. |
| `inserta_silencios.py` | Mete silencios exactos y corre los tiempos de `palabras.json`. |
| `resumen_episodio.py` | Genera `escenas.md` y `hoja_de_escenas.jpg` de un episodio. |
| `une_tomas.py` | Une una toma hasta un corte con otra toma y junta sus tiempos por palabra. Sirve para cambiar solo el final de una voz sin volver a generarla toda (parte 7). |

## Estilo visual

1. Lienzo vertical 1080x1920, 30 cuadros por segundo.
2. Trazo de tinta negra (`#111`) con el filtro `#ink`, que se mueve 8 veces por segundo para que parezca animado a mano.
3. Colores: rojo de subtítulos y alertas `#e0312b`, paliacate `#c8282e`, tinta azul de cuaderno `#1d3a8a`. Noche en azules (`paredNoche`, `cielo`), día nublado en `paredDia` y `ventanaDia`.
4. Subtítulos: Oswald 700, 100 px, mayúsculas, de 1 a 3 palabras, blancos con borde negro y la palabra fuerte en rojo. Viven en la franja y = 1560 a 1700: no pongas nada importante ahí.
5. Tarjetas de reglas, inventario y notas: hoja de cuaderno de cuadrícula con letra Caveat azul, que se escribe sola.
6. Chats: pantalla de celular genérica oscura, sin logo de WhatsApp, mensajes en minúsculas y casi sin acentos.
7. Cámara: zoom lento en cada escena; en momentos fuertes, `claves` que acercan a la acción. Escenas de 2 a 7 segundos.
8. Gancho: las partes 3 y 4 abren con su momento más tenso, lo congelan y rebobinan ("10 MINUTOS ANTES", "20 MINUTOS ANTES"). Ver `video/parte3/escenas.js` y `video/parte4/escenas.js`. La parte 5 no lo usa (pedido del usuario): abre directo con la alerta sonando. Pregunta antes de decidir en las partes siguientes.
9. Sonido sintetizado con ffmpeg (sirena, viento, latidos, golpes). Nunca la grabación oficial de la alerta sísmica. Volumen de efectos 10 dB o más debajo de la voz; la mezcla pasa por `loudnorm` con objetivo -14 LUFS (en una sola pasada; el video final mide entre -16.1 y -16.5 LUFS).

## Personajes

Ver `referencias/personajes/hoja_personajes.png`.

| Personaje | Función | Cómo se ve | Dónde vive |
|---|---|---|---|
| Tú | `stick()` | Cabeza blanca redonda, dos ojos negros ovalados, sin boca ni nariz, cuerpo de líneas, paliacate rojo SIEMPRE | 502, quinto piso |
| Chispa | `perro('gruñe' \| 'parada' \| 'echada')`, `perroSentada()`, `caraChispa()` | Perrita café, una oreja parada y otra doblada, collar azul con placa (encintada desde el día 1) | Contigo |
| Doña Rosa | `rosa()` | Chongo gris, lentes redondos, rebozo gris con flecos | 402, justo debajo |
| Memo | `memo()` | Bigote negro, chaleco beige con bolsillos, llavero | 101, administrador |
| Infectados | `infectado()`, `infectadoCorriendo()`, `infectadoLado()`, `infectadoQuieto()` | Cabeza gris, ojos blancos sin pupila, extremidades grises con contorno oscuro | Patio, escaleras, calle |
| Vecinos | `vecino()` | Stickman chico con pijama de color | Unidad |
| Evelin (temporada 2) | `evelin()` | Pelo negro con fleco y cola de caballo, chamarra verde azulado con franja reflejante, gafete, audífonos al cuello o puestos. Sin paliacate. De niña: dos coletas y playera amarilla | Centro de alerta (nieta de Rosa, operadora de noche) |

Lalo (305) y Paty (203) solo aparecen en el chat.

## Reglas de continuidad

Del mundo:

1. Los infectados cazan por el sonido. En silencio se quedan quietos con la cara hacia arriba. Siempre van hacia el ruido más fuerte.
2. La alerta sísmica dura 90 segundos. Mientras suena, todos van a los postes y "el ruido es gratis".
3. La de la noche 3 la activó Rosa (trabajó 30 años en el sistema de la alerta); se reveló en la parte 8. La primera noche la activó Evelin con una prueba solo para la zona del Edificio C, para avisarle a su abuela con la clave del 3:14; alguien la hizo sonar en toda la ciudad (se mostró en la temporada 2, parte 1). La alerta del final de la temporada 1 también fue Evelin: era su señal de que sigue viva. Quién la hizo sonar para todos todavía no se dice en video (ver `guiones/la-alerta-temporada-2.md`).
4. La clave del 3:14: si hay peligro, Rosa y Evelin se avisan a las 3:14 y la otra se esconde. Por eso Rosa no bajó al patio la primera noche.
5. El radio de Rosa recibe pitidos cortos y largos de Evelin (clave Morse). Rosa los entiende y los escribe letra por letra; tú no.
6. La mordida: la piel se pone gris desde la herida y va subiendo; en un brazo tarda días. Mientras se transforma, el sonido jala a la persona: voltea hacia el ruido aunque no quiera, y por instantes los ojos se le ponen blancos. A Memo lo mordieron en el antebrazo derecho en la azotea la noche 3 (se mostró en la temporada 2, parte 2).

De la historia, ya mostrado en video:

| Momento | Datos que no deben cambiar |
|---|---|
| Noche 0 (parte 1) | Alerta 3:14 a. m., no tiembla. Vecinos al punto de reunión del patio. 3:40: Lalo 305 escribe "no hagan ruido. estan en las escaleras" y no vuelve a escribir. Memo escribió a las 3:14 "bajen al punto de reunion. orden y calma". |
| Día 1 (parte 2) | Reglas 1 y 2. Inventario: agua 30 L (garrafón y medio), comida 5 días, croquetas 12 días, batería 41 %, sin luz. Celular en silencio a las 9:47, sin señal. Pila fuera del reloj. Cinta en la placa de Chispa (desde aquí la placa va encintada). Chat: Memo 7:02 "la puerta de abajo ya esta cerrada. no le abran a nadie", Paty 9:15 "alguien vio a mi hijo??", Rosa 16:47 "hay alguien vivo? estoy sola. no tengo agua". Batería 33 % en la tarde. |
| Día 2 (parte 3) | Rosa lleva 2 días sin agua. Hay infectados en la escalera. Botella de 2 L por el mecate del tendedero. Unos veinte infectados en el patio. Rosa atrapa la botella y manda la nota "Gracias, corazón. Dios te lo pague. No le abras a Memo." Memo tiene planta de luz y cajas de ATÚN, FRIJOL, SOPA y AGUA. 21:12: Memo escribe por privado "ya vi que tienes agua". Batería 29 %. |
| Día 3 (parte 4) | Inventario: agua 18 L, comida 3 días, croquetas 10 días, batería 22 %. 10:02: Memo por privado "tengo latas y planta de luz", "te cambio comida x un garrafon 👍". 10:09: Rosa por privado "la noche de la alerta memo cerro la puerta del edificio", "con la gente afuera. yo lo vi". Regla 3. Una paloma se para en la ventana del mecate; Chispa salta a la cornisa del quinto piso, casi ladra y casi cae; la agarras del collar y la placa encintada no suena. Esa noche (noche 3), 3:14: la alerta suena otra vez y no tiembla. |
| Noche 3 (parte 5) | 3:14: la alerta suena, no tiembla. Chispa aúlla durante toda la alerta. Te lanzas a taparle el hocico. Los infectados no voltean a tu ventana: todos corren al poste de la esquina, se amontonan debajo de las bocinas y estiran los brazos. El patio queda vacío por primera vez en 3 días (queda una chancla rosa tirada). Tomas el tiempo: 90 segundos (temporizador, batería 19 %). Arrastras una silla y tiras una lata: nadie voltea. Con 5 segundos le tapas el hocico; se retuerce. La alerta se calla y el último aullido de Chispa se oye en el silencio: todas las cabezas giran hacia tu edificio. Regla 4: "Mientras suena la alerta, el ruido es gratis. Cuando se calla, se paga." 3:17: Memo por privado "mañana a las 3:14 bajo a la tienda de don chucho", "90 segundos. vienes o te mueres de hambre?". |
| Noche 3, 3:18 a 3:27 (parte 6) | Los infectados revientan la puerta de vidrio del vestíbulo (la que cerró Memo; tenía cadena y candado) y suben por la escalera. Pasan frente al 402: Rosa, a oscuras con una vela, se tapa la boca. Golpean tu puerta (502); le pones la silla; la puerta cede. Sales por la ventana a la cornisa con Chispa bajo el brazo. Una mano gris sale por la ventana; Chispa se suelta y corre por la cornisa hasta perderse en lo oscuro. Subes por la escalerita de fierro a la azotea (tinacos, tendederos, bodegas 501, 502 y 503) y te encierras en la bodega del 502. Batería 15 %. Los infectados se quedan en tu departamento, quietos, con la cara hacia arriba. 3:26: Memo por privado "tengo a tu perra" y una foto de Chispa; 3:27: "baja al 101", "o subo yo", "tengo llave de todas las bodegas". La foto es vieja: la placa no tiene cinta. Chispa en realidad está con Rosa (no se ha dicho en video). |
| Noche 3, parte 7 (ganó 🔦) | La foto de Memo es vieja: la placa no tiene cinta. Memo sube por la puerta de la azotea (caseta a la derecha de las bodegas) con lámpara y llavero. Te escondes detrás de los tinacos; Memo abre la bodega 502 con su llave: vacía. En la cornisa hay pelitos cafés y huellas chiquitas. Bajas por la escalerita (en la fachada, a la derecha de tu ventana). Memo te alumbra y golpea el barandal con la lámpara (CLANG): las cabezas de tu departamento voltean a la ventana y salen brazos. Corres por la cornisa; las huellas dan vuelta en la esquina, bajan por la jaula del gas (dos cilindros) y llegan a la ventana de la cocina del 402 (cortina rosa, vela). Una mano arrugada con el rebozo te hace señas. Detrás de la cortina se asoma la cola de Chispa. Arriba, Memo grita "¡AYÚDAME!": su golpe llevó a los infectados a la azotea. Memo tiene las llaves de la tienda (llave con etiqueta TIENDA); sin él no hay comida ni croquetas (plato de Chispa vacío). Si entras, Rosa cierra la ventana y no la vuelve a abrir. Decisión: 🐕 entras con Chispa o 🔑 subes por Memo. |
| Noche 3, parte 8 (ganó 🐕, final de temporada) | Rosa te jala por la ventana de la cocina del 402 y le pone el seguro. Chispa te lame la cara; la placa con cinta no suena. Los gritos de Memo se apagan y su llavero (llave con etiqueta TIENDA) cae al patio, entre unos 24 infectados. Rosa prende una vela; en su repisa está la botella de 2 L de la parte 3, con el mecate. En su mesa: radio viejo con antena de ganchos de ropa y una libreta con "3:14" escrito muchas veces. Rosa trabajó treinta años en el sistema de la alerta (foto "Centro de alerta, 1995"); la alerta de la noche 3 la activó ella para vaciar el patio. La primera noche no fue ella. Entonces la alerta empieza a sonar y Rosa no ha tocado el radio (el radio se ilumina solo). En la azotea, una lámpara se vuelve a prender. Tarjeta final: ¿quién activó la alerta la primera noche? Memo 101, Lalo 305, Paty 203 o alguien de afuera. Temporada 2. |
| T2, parte 1 (Evelin) | Sigue sin pausa al final de la parte 8. Abre con la tarjeta de sospechosos: "Ustedes votaron por Memo" y un sello rojo "CASI". La alerta sigue sonando y el radio de Rosa se prende solo, con estática. Rosa se pone pálida: "Esta no la hice yo. Solo una persona sabe hacer esto." Evelin, su nieta, operadora de noche en el centro de alerta (audífonos, gafete, chamarra verde). Recuerdo de hace 15 años: Rosa y Evelin niña inventan la clave del 3:14 en un cuaderno ("3:14 = peligro, ¡la otra se esconde!"). La primera noche Rosa vio a todos bajar al patio, apagó la vela y se escondió. El radio pita y Rosa escribe ESTOY VIVA. Arriba, la lámpara de Memo baja por la escalera del quinto al cuarto piso, hacia la luz del radio. Chispa le gruñe a la puerta del 402; por debajo entra la luz de la lámpara y la sombra de dos pies. El radio pita otra vez: FUI YO. PERDONAME ABUELA (una lágrima cae en la hoja). Recuerdo en el centro de alerta, primera noche, 3:14: Evelin aprieta el botón "PRUEBA · ZONA U.H. EDIFICIO C", se prende esa zona en el mapa y luego "TODAS LAS ZONAS". Tarjeta final: ¿quién hizo que sonara para todos? Memo está afuera de la puerta del 402 cuando termina. |
| T2, parte 2 (La puerta) | Noche 3, sigue sin pausa. Tres toques despacio en el 402; por debajo de la puerta, la luz de la lámpara y dos pies. Por la mirilla: Memo. Antebrazo derecho vendado con sangre y la piel gris hasta la muñeca. Recuerdo: en la azotea lo mordieron (la lámpara tirada, infectados encima). Memo susurra: "Abre, Rosa. Sé por qué sonó en toda la ciudad. Y sé dónde está tu nieta." Rosa te agarra del brazo: "No le abras, corazón." Chispa gruñe y la cabeza de Memo voltea de golpe hacia el ruido, como la de ellos; los ojos se le ponen blancos un instante. Memo se tapa la cara: "Todavía soy yo. Todavía." Las venas grises le suben por el cuello. La alerta de Evelin se calla: los infectados del poste de la esquina bajan los brazos y regresan hacia el Edificio C (puerta de vidrio rota). Memo golpea la puerta ("Ábreme. Ya vienen") y cada golpe se oye en todo el edificio; los infectados suben la escalera. Decisión: 🚪 le abres o 🔒 no le abres. |
| Temporada 2, lo que sigue | Ver los capítulos de `guiones/la-alerta-temporada-2.md`. La parte 3 ("La tienda") se hace con lo que gane en la parte 2; al final de esa sección del guion está cómo sigue cada opción. |

Del narrador: segunda persona, sin palabras con género para "tú" (nada de "dormido" o "solo"). Rosa le dice "corazón".

## Flujo para hacer un episodio

Desde `video/`. La temporada 2, parte 2 (`t2parte2/`) es el ejemplo más reciente a copiar (sin gancho con rebobinado, termina con decisión); la parte 4 es el ejemplo con gancho.

1. **Guion:** toma la parte del guion de la serie y define el gancho (momento más tenso para abrir).
2. **Voz:** en ElevenLabs crea un flujo (`creative_create_flow`), genera la voz con `creative_generate_speech`: voz `lr39dERdpNg6kPUtWZTO` ("Alejandro - Horror y Misterio"), modelo `eleven_v4`, 2 tomas (el valor por omisión). Usa `[whispering]` antes de la última frase de suspenso. Escribe los números con letra ("tres catorce"). Guarda el texto en `audio/parteN/texto_voz.txt`.
3. **Descarga** las tomas a `audio/parteN/take1.mp3` y `take2.mp3` de inmediato: las URLs firmadas caducan en 2 horas.
4. **Procesa** la toma elegida hasta que dure unos 60 a 70 s (ver paso 5 para los tiempos). Si se pierde una pausa dramática, devuélvela con `lib/inserta_silencios.py`, que también corre los tiempos de `palabras.json`. Las partes 4 y 5 son los ejemplos más recientes (comandos en su `FICHA.md`).
5. **Transcribe** con ElevenLabs la toma original, sin subir nada: `creative_add_flow_asset_node` con el `generation_id` de la toma y `modality: audio`, luego `creative_transcribe_audio` (`eleven_scribe_v1`) con ese nodo en `connect_from` (no cobró créditos en las partes 4 y 5). Descarga `words_download_url` a `audio/parteN/palabras_take1.json` y procesa con `recorta_pausas.py ... --palabras palabras_take1.json palabras_sin_pausas.json`, que corre los tiempos al audio recortado. Desde la parte 4 la subida de audio (`creative_create_asset_upload`) está bloqueada por permisos. Desde el 2 de noviembre las descargas vienen de `elevenlabsusercontent.com` (tiene que estar en los dominios permitidos del entorno); los tiempos por palabra también vienen en la respuesta de la transcripción.
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
6. Si dos escenas deben coincidir con el audio (reloj de la parte 2, congelado de la parte 3, pitidos en clave de la temporada 2), la constante está en `escenas.js` y en `mezcla.py`; cámbialas juntas. En `t2parte1` los dos archivos tienen la misma función `morse()`: si cambias un mensaje o sus tiempos, cámbialo en los dos.
7. El proxy del entorno bloquea Hugging Face y la descarga de imágenes de Canva. GitHub sí funciona.

## Git

1. Trabaja en una rama `claude/...` y abre un PR a `main`. No hagas force push ni borres trabajos anteriores.
2. Los videos finales solo cambian con `--publicar` y después de revisarlos. Cada video re-subido agrega de 22 a 37 MB al historial: no subas pruebas.
3. Límite de GitHub: 100 MB por archivo. Hoy el más grande pesa 37 MB (parte 5, con muchas escenas de noche), así que no se usa Git LFS. Si un archivo pasa de 50 MB, usa Git LFS o súbelo como asset de un GitHub Release y deja el enlace en la FICHA.
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

Habla español de México. Prefiere respuestas directas en español. Revisa los videos en su celular. Quiere emoción y adrenalina en cada parte, y Chispa es el personaje más querido: ponerla en peligro engancha, pero no la mates. Le gustan los episodios que terminan con una pregunta para los comentarios. Memo es el malo de la historia. Quiere una decisión para los comentarios al final de cada parte, aunque todas las opciones lleven al mismo final. Quiere que "La alerta" termine en la temporada 2 (10 partes, final cerrado) para empezar una historia nueva y no repetirse. Aprobó gastar créditos de ElevenLabs para voz y transcripción (unos 2,000 créditos por parte) y prefiere no gastar créditos de Canva.
