# Estado del proyecto

Última actualización: 3 de noviembre de 2026 (temporada 2, parte 1).
Rama de trabajo: `claude/guiones-stickman`. Se abrió un PR hacia `main` con todo el trabajo; si ya se fusionó, todo está en `main`.

## Episodios terminados

| Parte | Título | Duración | Escenas | Video | Créditos ElevenLabs |
|---|---|---|---|---|---|
| 1 | La alerta | 70.4 s | 12 | `episodios/parte-01-la-alerta/la_alerta_parte1.mp4` | ~2,118 |
| 2 | Día 1 | 63.0 s | 12 | `episodios/parte-02-dia-1/la_alerta_parte2.mp4` | ~1,986 |
| 3 | El mecate | 71.0 s | 18 | `episodios/parte-03-el-mecate/la_alerta_parte3.mp4` | ~2,212 |
| 4 | La cornisa | 70.6 s | 20 | `episodios/parte-04-la-cornisa/la_alerta_parte4.mp4` | ~1,848 |
| 5 | 3:14 | 71.4 s | 17 | `episodios/parte-05-tres-catorce/la_alerta_parte5.mp4` | ~1,848 |
| 6 | La bodega (interactiva) | 70.6 s | 17 | `episodios/parte-06-la-bodega/la_alerta_parte6.mp4` | ~1,836 |
| 7 | Las huellas (interactiva) | 79.5 s | 19 | `episodios/parte-07-las-huellas/la_alerta_parte7.mp4` | ~2,374 |
| 8 | La primera noche (final) | 75.4 s | 16 | `episodios/parte-08-la-primera-noche/la_alerta_parte8.mp4` | ~2,056 |

La temporada 1 está completa: 8 partes.

Temporada 2 (diseño en `guiones/la-alerta-temporada-2.md`):

| Parte | Título | Duración | Escenas | Video | Créditos ElevenLabs |
|---|---|---|---|---|---|
| 1 | Evelin | 69.3 s | 12 | `episodios/t2-parte-01-evelin/la_alerta_t2_parte1.mp4` | ~1,724 |
| 2 | La puerta (interactiva) | 66.4 s | 14 | `episodios/t2-parte-02-la-puerta/la_alerta_t2_parte2.mp4` | ~1,528 |
| 3 | La tienda (interactiva, ganó 🔒) | 75.6 s | 15 | `episodios/t2-parte-03-la-tienda/la_alerta_t2_parte3.mp4` | ~1,928 |
| 4 | Los escombros (interactiva, ganó ⏳) | 68.1 s | 14 | `episodios/t2-parte-04-los-escombros/la_alerta_t2_parte4.mp4` | ~1,746 |
| 5 | El metro (interactiva, ganó 🏚️) | 65.4 s | 15 | `episodios/t2-parte-05-el-metro/la_alerta_t2_parte5.mp4` | ~1,528 |
| 6 | El centro de alerta (interactiva, ganó 🤫) | 70.7 s | 16 | `episodios/t2-parte-06-el-centro-de-alerta/la_alerta_t2_parte6.mp4` | ~1,660 |
| 7 | La antena (interactiva, ganó 🔐) | 67.7 s | 17 | `episodios/t2-parte-07-la-antena/la_alerta_t2_parte7.mp4` | ~1,658 |
| 8 | Noventa segundos (interactiva, gana 🗣️) | 75.8 s | 17 | `episodios/t2-parte-08-noventa-segundos/la_alerta_t2_parte8.mp4` | ~2,002 |
| 9 | Bajen al patio (interactiva, gana 🐕) | 75.0 s | 16 | `episodios/t2-parte-09-bajen-al-patio/la_alerta_t2_parte9.mp4` | ~1,756 |
| 10 | La última alerta (final, gana 🪢) | 82.5 s | 20 | `episodios/t2-parte-10-la-ultima-alerta/la_alerta_t2_parte10.mp4` | ~1,978 |

La temporada 2 está completa: 10 partes. "La alerta" terminó.

Cada carpeta tiene `FICHA.md` con el código, la voz, los recursos y los comandos que se usaron.

## Pendiente

1. **Temporada 2**: diseñada en 10 partes con final cerrado; es la última temporada de "La alerta". Las 10 partes están terminadas: la historia terminó. De la 2 a la 9 todas terminan con una decisión; la tabla "Cómo se respeta cada voto" del guion dice cómo empieza la parte siguiente con cada opción. Lo que sigue es una historia nueva, elegida con los comentarios de la parte 10. Las ideas de cada capítulo pueden cambiar según lo que pida el público, siempre que la historia cierre en la parte 10.
2. **Versión larga de 8 minutos**: no está armada. Hay que unir las partes quitando las tarjetas "PARTE N →" y agregar capítulos (ver el final del guion de la serie).
3. **Short "La ofrenda"** (`guiones/la-ofrenda-short-interactivo.md`): escrito, no producido. Pensado para el 1 y 2 de noviembre.
4. **Portadas y títulos para publicar**: el guion trae título y texto de portada por parte; no se han hecho imágenes de portada.

## Decisiones importantes

| Fecha | Decisión | Por qué |
|---|---|---|
| 31/10 | Dibujar todo con código en vez de Canva | Canva cobra cada imagen y no mantiene igual al personaje entre escenas |
| 31/10 | Voz "Alejandro - Horror y Misterio" en ElevenLabs, modelo eleven_v4 | Acento mexicano y tono de terror; `[whispering]` funciona en español |
| 31/10 | Subtítulos sincronizados con la transcripción de ElevenLabs | Tiempos exactos por palabra sin alinear a mano |
| 31/10 | Agregar escenas que no estaban en el guion cuando una toma queda fija mucho tiempo | En la parte 1 la tarjeta de 3:14 duraba 10 s |
| 31/10 | Desde la parte 3, abrir con flash-forward: momento más tenso, congelado, rebobinado VHS | Pedido del usuario para retener a la gente en los primeros segundos |
| 31/10 | Partes de 60 a 71 s en vez de 60 exactos | La voz de terror es lenta; acelerarla más le quita el tono |
| 31/10 | Sirena sintetizada, nunca la grabación oficial de la alerta | La alerta real pone nerviosa a la gente y puede confundir |
| 31/10 | Los videos finales solo se reemplazan con `--publicar` | Evita sobrescribir un episodio guardado por accidente |
| 01/11 | La parte 4 se reescribió como "La cornisa": Chispa salta tras una paloma y casi cae del quinto piso | El usuario pidió más emoción y peligro para Chispa; se conservó todo lo que necesitan las partes 5 a 8 |
| 01/11 | Transcribir la toma original desde el flujo de ElevenLabs y correr los tiempos con `recorta_pausas.py --palabras` | La subida de audio quedó bloqueada por permisos; además así la transcripción no cobró créditos |
| 01/11 | La parte 5 no abre con flash-forward: empieza directo con la alerta sonando | Pedido del usuario |
| 01/11 | En la parte 5 Chispa aúlla durante la alerta y hay que callarla antes de que se calle; se agregó la frase "Cuando se calla, se paga" a la Regla 4 | Mantener a Chispa en peligro, como pidió el usuario en la parte 4 |
| 01/11 | Cuenta regresiva en pantalla comprimida: los 90 s de la alerta pasan en unos 15 s de narración | La voz no puede durar 90 s; el reloj corre rápido hasta 0:10 y luego va casi segundo a segundo |
| 02/11 | Las partes 6 a 8 se reescribieron: los infectados suben al edificio, escapas a la bodega de la azotea, pierdes a Chispa y Memo dice que la tiene. La parte 6 termina con una decisión para los comentarios y la parte 7 tiene dos versiones | Pedido del usuario. Se quitó la salida a la tienda de don Chucho ("Noventa segundos" y "La cortina") |
| 02/11 | Memo miente: la foto de Chispa es vieja (la placa no tiene cinta). Chispa está con Rosa | Deja una pista para quien se acuerde de la cinta y une las dos versiones de la parte 7 en la parte 8 |
| 02/11 | La parte 6 abre directo, sin flash-forward | Sigue sin pausa al final de la parte 5 y el usuario pidió quitar el flashback en la 5 |
| 02/11 | En la parte 6 ganó 🔦 (87 %): se hizo la parte 7B, "Las huellas". Abre con la tarjeta del voto sin porcentaje | Pedido del usuario; el porcentaje podía cambiar antes de cerrar la votación |
| 02/11 | La parte 7 también termina con una decisión, más difícil: Chispa o Memo y la comida. La parte 8 queda en dos versiones | Pedido del usuario |
| 02/11 | El final nuevo de la parte 7 se generó aparte y se unió a la toma con `lib/une_tomas.py` | Rehacer toda la voz costaba unos 1,700 créditos más; el final solo costó 672 |
| 03/11 | En la parte 7 ganó 🐕 (70 % de 559 votos): la parte 8 es la versión en la que entras con Chispa y dejas a Memo | Votación en TikTok |
| 03/11 | El final deja dos ganchos (la alerta suena sola y una lámpara se prende en la azotea) y pide a los comentarios su sospechoso | Cierre de temporada que invita a seguir; pedido del usuario de "hazla buena, hazla interesante" |
| 03/11 | Temporada 2 con un personaje nuevo, Evelin (nieta de Rosa, operadora de noche del centro de alerta). La respuesta al voto "Memo" es "casi": Evelin hizo sonar la alerta solo para su edificio, alguien la hizo sonar en toda la ciudad y Memo sabía que iba a sonar | El usuario pidió a Evelin y no quería que la respuesta fuera simplemente Memo. Así se respeta el voto sin regalar el misterio |
| 03/11 | La temporada 2 sale de la unidad: tienda de don Chucho, metro, centro de alerta, antena | Pedido del usuario ("no forzoso tiene que ser todo en el mismo edificio") |
| 03/11 | Historias de fondo de Evelin, Rosa, Memo y Chispa en el guion de la temporada 2; se cuentan poco a poco en los capítulos | Pedido del usuario, "si es necesario" |
| 03/11 | El radio se comunica con pitidos en clave Morse reales, sincronizados con las letras que escribe Rosa | Da un momento de suspenso propio de la temporada; la misma función `morse()` está en `escenas.js` y en `mezcla.py` |
| 03/11 | "La alerta" termina en la temporada 2, que pasa de 8 a 10 partes con un final cerrado (ver "Cómo termina" en el guion). No hay temporada 3 | Pedido del usuario: quiere empezar una historia nueva y que no se vuelva repetitiva |
| 03/11 | A Memo lo mordieron en la azotea y se transforma poco a poco durante la temporada (mordida en el brazo: días). Sigue siendo el malo hasta el final | Idea del usuario. Una mordida lenta lo deja como villano y es un reloj en cada episodio |
| 04/11 | En la temporada 2, de la parte 2 a la 9 todas terminan con una decisión. El voto cambia cómo empieza la parte siguiente; los hechos de cada capítulo y el final no cambian | Pedido del usuario: más interacción en TikTok aunque todo lleve al mismo final |
| 06/11 | En la parte 4 ganó 🏚️: bajas por el edificio caído donde encontraste a Chispa, la losa cede y caes al túnel; la cinta de la placa se despega en la caída. La opción "te quedas quieto" se cambió a "no te mueves" para que el narrador no tenga género | Votación en TikTok. Regla del narrador sin género |
| 05/11 | En la parte 3 ganó ⏳: Evelin manda otra alerta de solo 20 segundos; Chispa aúlla, silbas y corre hacia ti. Se cuenta que la encontraste entre los escombros del gran sismo, hace tres años | Votación en TikTok (60 % de 912 votos). Un comentario temía que Chispa muriera: se mantiene en peligro, pero viva |
| 06/11 | En la parte 6 muerden a Chispa en una pata trasera. Se pone agresiva por el ruido, la calman los audífonos de operadora de Evelin, ayuda aullando para llevarse a los infectados y en la parte 10 se cura con el suero que la Coordinación guarda en el estadio (Evelin se roba un frasco) | Idea del usuario para darle más trama. Chispa no muere; la cura también le da sentido a lo que busca Memo |
| 04/11 | En la parte 2 ganó 🔒: la parte 3 abre con la tarjeta "GANÓ" y Memo huye a la azotea dejando su celular, con los mensajes de la Coordinación | Votación en TikTok, cerca de 80 % |
| 14/11 | En la parte 9 gana 🪢 y se hace la parte 10, el final: el tablero viejo, la voz de Rosa por las bocinas, "MANDALA ABUELA", la última alerta al estadio, el suero y la placa que suena sin que venga nadie. Termina preguntando de qué quieren la siguiente historia (👻 / 🛸 / 🔪 / su idea) | Pedido del usuario. Sigue el "Cómo termina" del guion. Dura unos 83 s porque cierra la historia |
| 10/11 | En la parte 8 gana 🐕 y se hace la parte 9: salvas a Chispa; la Coordinación se queda con Evelin y la consola y deja afuera a Memo, que se transforma del todo; el radio anuncia la alerta de las 3:14 con las palabras de Memo; los pitidos "EL TABLERO VIEJO" y "HAY CURA"; Rosa decide salir y la escalera está llena | Pedido del usuario. Sigue los hechos del capítulo 9 del guion; la Coordinación sigue sin verse (guantes, emblema, bocina) |
| 07/11 | En la parte 7 iba ganando 🗣️ y se hizo la parte 8 con esa opción. Evelin cuenta la primera noche (su prueba y la Coordinación tres segundos después); el plan de alertas por zona; Chispa aúlla bajo el puente; Memo se lleva a Evelin con la consola y la alerta jala a Chispa al poste | Pedido del usuario ("va ganando"). Sigue los hechos del capítulo 8 del guion |
| 07/11 | La voz se genera en otra cuenta de ElevenLabs: la anterior llegó al límite del mes (541 de 40,000 créditos). La voz es de la biblioteca y tiene el mismo ID | Pedido del usuario |
| 06/11 | En la parte 6 ganó 🔐: encierras a Memo, pero sale con su tarjeta y aparece detrás del tinaco de la azotea con un radio de la Coordinación. Solo tú lo ves. Evelin cuenta la primera noche desde su lado en la parte 8 y no en la 7 | Votación en TikTok. La parte 7 ya tenía mucho (Evelin, la mordida, los audífonos, el radio) |
| 06/11 | Regla 5 en video: "A los mordidos los jala el ruido. Sin ruido, se calman." Desde la parte 7 Chispa trae los audífonos de Evelin | Es la regla 6 del guion de la temporada 2 contada con la hoja de cuaderno de las reglas 1 a 4 |
| 04/11 | Memo ya no solo se roba la consola: se lleva a Evelin para entregarla a la Coordinación a cambio de que lo curen. Rosa y Evelin se reencuentran hasta el final de la parte 10 | Responde a la pregunta del usuario ("¿Memo se va a llevar a Evelin?"); sube lo que está en juego en la parte 8 (Chispa o Evelin) |

## Errores conocidos y limitaciones

1. **Claude no puede escuchar el audio.** Los niveles se midieron (efectos 10 dB o más debajo de la voz), pero el usuario no ha confirmado cómo suenan las partes 1 a 6. En la parte 5 los aullidos de Chispa son sintetizados y pueden sonar artificiales; la silla, la lata y el último aullido quedan a unos 6 dB de la voz a propósito.
2. **Las partes 1 y 2 no tienen el gancho con flash-forward.** Se hicieron antes de esa decisión. Se podrían rehacer (pendiente de decidir).
3. **Duraciones**: 63 a 71 s. TikTok y Reels lo aceptan; si se quiere 60 s exactos hay que recortar texto.
4. **Imágenes de Canva**: en el repo solo están las miniaturas; los originales (1680x944) siguen en la cuenta de Canva (enlaces en `referencias/README.md`).
5. **Videos de referencia**: son de otros creadores (`referencias/videos/`). No se publican ni se copian sus dibujos.
6. **Historial pesado**: cada video re-subido agrega de 22 a 37 MB (la parte 5 pesa 37 MB por sus escenas de noche). El repo pesaba unos 122 MB al 31/10.
7. **Escenas mejorables** en la parte 3: `chillido` (Chispa) se ve vacía y en `sacude` los brazos parecen una tienda de campaña.
8. **Se corrigió** una falla del motor que dejaba un subtítulo asomándose 2 a 4 cuadros en la escena siguiente (partes 2 y 3 se volvieron a renderizar).
9. **Subida de audio a ElevenLabs bloqueada** por permisos desde el 01/11. Se resolvió transcribiendo la toma original desde el flujo (ver CLAUDE.md, paso 5).
10. **Parte 5**: en el chat de Memo la cámara recorta la batería de la barra de estado (igual que en la parte 4). Los brazos del montón visto desde arriba (escena `prueba`) parecen patitas.
11. **Volumen final**: la mezcla usa `loudnorm` a -14 LUFS en una sola pasada y los videos quedan entre -16.1 y -16.5 LUFS (medido en las partes 3 a 5). Las plataformas normalizan solas; si se quiere -14 exacto, hay que hacer `loudnorm` en dos pasadas y volver a mezclar.
12. **Parte 6**: los brazos que entran por la puerta parecen tubos con bolitas (no tienen dedos). El vidrio que revienta y la puerta que cede quedan a unos 4 dB de la voz, a propósito, porque caen en pausas de la narración.
13. **Descargas de ElevenLabs**: desde el 02/11 los archivos vienen de `elevenlabsusercontent.com`. El usuario lo agregó a los dominios permitidos del entorno. Si una sesión nueva no puede descargar, revisar Network access del entorno. Los tiempos por palabra también vienen en la respuesta de la transcripción.
14. **Parte 7**: dura 79.5 s, más que las otras, por el final con la decisión. La voz del final es de otra generación (misma voz y modelo); pedir al usuario que revise que no se note el cambio.
15. **Temporada 2, parte 1**: "PERDONAME ABUELA" pita muy rápido (cada punto dura unos 21 ms) para caber en la pausa que sigue a "abuela"; puede sonar como un operador experto o como un chirrido. Pedir al usuario que lo revise. Los pasos de Memo y los latidos en la escalera son sintetizados.
16. **Audio más corto que el video** (temporada 2, parte 6): la mezcla terminaba antes del final y el video salía de 69 s en vez de 70.7 s. Se corrigió rellenando el audio con silencio (`apad`) y volviendo a unir sin repetir el render de imagen. Las partes anteriores tienen un ambiente que dura todo el video y no tienen el problema.
17. **Temporada 2, parte 7**: la voz de la Coordinación ("Tráenos a la operadora" y "Y te curamos") es la misma voz del narrador con un filtro de radio. Pedir al usuario que revise si se entiende y si el cambio de filtro no se oye cortado. El ¡CLAC! cae en la pausa después de "mordida".
18. **ElevenLabs**: el 07/11 la cuenta original llegó al límite del mes (las tomas fallan con "exceeds your quota" y no se cobran). Se cambió a otra cuenta. Si vuelve a pasar, revisar créditos con `estimate_only` antes de generar.
19. **Temporada 2, parte 9**: la bocina del estadio ("No evacuamos mordidos") y el radio de Rosa ("Hoy a las 3:14...") son la voz del narrador con filtro de megáfono y de radio. Los pitidos en clave van a unos 25 ms por unidad. Pedir al usuario que revise que se entiendan.
20. **Temporada 2, parte 10**: dura unos 83 s, más que el rango de 60 a 80 s, porque cierra la historia. La voz de Rosa por las bocinas es la del narrador con filtro de megáfono y dos copias retrasadas (eco de ciudad); pedir al usuario que revise que se entienda.

## Lo que no está en GitHub

| Qué | Dónde está | Cómo recuperarlo |
|---|---|---|
| Imágenes originales de Canva (3) | Cuenta de Canva | Descargar desde los enlaces de `referencias/README.md` |
| Flujos de voz y transcripción | ElevenLabs (IDs en cada `FICHA.md`) | Los audios y tiempos ya están en `video/audio/parteN/`; el flujo solo sirve para editar ahí |
| Cuadros de prueba de cada render | Se borraron con la sesión | Se regeneran con `node render.js ... --cuadros` |
| Resultados intermedios (`video/salida/`) | No se suben a propósito | Se regeneran con `./hacer_parteN.sh` |

## Próximos pasos

1. Fusionar el PR a `main` para que una sesión nueva lo vea todo en la rama principal.
2. Que el usuario revise el audio de las partes 1 a 10, sobre todo los aullidos de la parte 5, los golpes de la parte 6, los pitidos en clave de la temporada 2, parte 1, y la voz de radio de la temporada 2, parte 7.
3. Publicar las partes 1 a 10 de la temporada 2 con el comentario fijado de cada `FICHA.md`.
4. Leer los comentarios de la parte 10 (👻 fantasmas, 🛸 ovnis, 🔪 un asesino o ideas propias) y diseñar la historia nueva. "La ofrenda" (`guiones/la-ofrenda-short-interactivo.md`) ya es una idea paranormal escrita.
5. Decidir si se rehace el inicio de las partes 1 y 2 con flash-forward.
6. Versión larga y portadas.

## Registro de cambios

| Fecha | Cambio |
|---|---|
| 30/10 | Se suben dos videos de referencia |
| 31/10 | Guiones de la serie, short interactivo, guía de estilo y personajes |
| 31/10 | Pruebas en Canva (3 imágenes) y prueba gratis con código |
| 31/10 | Parte 1 terminada |
| 31/10 | Parte 2 terminada; piezas compartidas pasan a `video/lib/` |
| 31/10 | Parte 3 terminada con gancho al inicio; corrección de subtítulos; partes 2 y 3 re-renderizadas |
| 31/10 | Organización del repo: `episodios/`, `referencias/`, CLAUDE.md, este archivo, fichas por episodio, hoja de personajes |
| 31/10 | Verificado: `hacer_parte1.sh` regenera la parte 1 desde cero igual a la publicada (2,111 cuadros, diferencia media 0.00 sobre 255). Partes 2 y 3: línea de tiempo idéntica y cuadros de muestra iguales. PR #1 abierto hacia `main` |
| 01/11 | Parte 4 terminada ("La cornisa"): 20 escenas, gancho con Chispa en la cornisa. Nuevas piezas en `lib/`: `caraChispa()`, `paloma()`, `perro('parada')`, `hoja()` e `iconos` en la base compartida. Partes 1 a 3 verificadas iguales después del cambio |
| 01/11 | Parte 5 terminada ("3:14"): 17 escenas, sin flash-forward, Chispa aúlla durante la alerta. Nuevas piezas en `lib/`: `perroSentada()`, `infectadoLado()`, `infectadoQuieto()`, aullido en `caraChispa()`, filtro `#contorno`, `chatPrivado()` en la base compartida, clases de reloj y onomatopeyas |
| 02/11 | Guion de las partes 6 a 8 reescrito (la bodega, Chispa perdida, decisión de los comentarios, parte 7 en dos versiones) |
| 03/11 | Parte 8 terminada ("La primera noche", final de temporada, ganó 🐕): 16 escenas. La temporada 1 queda completa |
| 03/11 | Temporada 2 diseñada (`guiones/la-alerta-temporada-2.md`). Personaje nuevo: Evelin, con `evelin()` en `lib/dibujo.js` y en la hoja de personajes |
| 03/11 | Temporada 2, parte 1 terminada ("Evelin"): 12 escenas, pitidos en clave Morse sincronizados con la escritura de Rosa |
| 03/11 | Temporada 2 rehecha en 10 partes con final cerrado. Parte 2 terminada ("La puerta", interactiva): 14 escenas, Memo mordido, decisión 🚪 / 🔒 |
| 04/11 | Guion de la temporada 2: decisión al final de cada parte (2 a 9), tabla de qué cambia con cada voto, y Memo se lleva a Evelin en la parte 8 |
| 14/11 | Temporada 2, parte 10 terminada ("La última alerta", gana 🪢): 20 escenas. "La alerta" termina. La mezcla pasa por `asetpts=N/SR/TB` antes de `apad` (las copias retrasadas de la voz desfasaban los tiempos) |
| 10/11 | Temporada 2, parte 9 terminada ("Bajen al patio", gana 🐕): 16 escenas, la reja del estadio, Memo se transforma, el radio de Rosa, los pitidos en clave, la escalera llena; decisión 🪢 / 🚪. La voz de la bocina va con filtro de megáfono. Trampa nueva: `aecho` en la voz impide que `apad` rellene el final |
| 07/11 | Temporada 2, parte 8 terminada ("Noventa segundos", gana 🗣️): 17 escenas, el recuerdo de la Coordinación, la ciudad desde arriba, el plan en el cuaderno, el puente lleno, el aullido de Chispa, Memo se lleva a Evelin; decisión 🐕 / 👩. Las escenas se dibujaron con tiempos estimados mientras no había créditos y se ajustaron solas a la voz real |
| 06/11 | En la parte 6 ganó 🔐. Temporada 2, parte 7 terminada ("La antena"): 17 escenas, Evelin con la llave de tuercas, los ojos blancos de Chispa y sus audífonos, la regla 5, el radio de la Coordinación y Memo detrás del tinaco; decisión 🗣️ / 🤐. En `lib/dibujo.js`: `evelin()` acepta `audifonos: 'no'` y `perro()` tiene el modo `'contenta'` |
| 06/11 | En la parte 5 ganó 🤫. Temporada 2, parte 6 terminada ("El centro de alerta"): 16 escenas, muerden a Chispa en la pata trasera, el registro de la primera noche en pantalla, Memo con su tarjeta de acceso; decisión 🤝 / 🔐 |
| 06/11 | Guion de la temporada 2: la mordida de Chispa (partes 6 a 10), la cura en el estadio y dos reglas nuevas (el silencio calma a los mordidos; el suero funciona antes de que los ojos pierdan la pupila) |
| 06/11 | En la parte 4 ganó 🏚️. Temporada 2, parte 5 terminada ("El metro"): 15 escenas a oscuras con la luz del celular, la caída al túnel, el andén lleno y la placa que suena; decisión 🏃 / 🤫 |
| 05/11 | En la parte 3 ganó ⏳ (60 % de 912 votos). Temporada 2, parte 4 terminada ("Los escombros"): 14 escenas, la segunda alerta de 20 segundos, el recuerdo de cómo encontraste a Chispa, decisión 🚇 / 🏚️ |
| 04/11 | En la parte 2 ganó 🔒 (cerca de 80 %). Temporada 2, parte 3 terminada ("La tienda"): 15 escenas, el celular de Memo, la alerta que se corta a los 60 segundos, decisión 🏃 / ⏳ |
| 02/11 | Parte 7 terminada ("Las huellas", interactiva, ganó 🔦): 19 escenas, termina con la decisión 🐕 / 🔑. Nuevo en `lib/`: `une_tomas.py`; el degradado `#haz` pasa a `defsSVG` |
| 02/11 | Parte 6 terminada ("La bodega", interactiva): 17 escenas. Nuevas piezas en `lib/`: `sinCinta` en `caraChispa()`, clases de la tarjeta de decisión; `linea_de_tiempo.py` ignora etiquetas como `[whispering]`. Partes 3 a 5 dan la misma línea de tiempo después del cambio |
