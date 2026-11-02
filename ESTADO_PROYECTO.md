# Estado del proyecto

Última actualización: 2 de noviembre de 2026.
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

Cada carpeta tiene `FICHA.md` con el código, la voz, los recursos y los comandos que se usaron.

## Pendiente

1. **Parte 8** ("La primera noche") según lo que voten los comentarios de la parte 7: 🐕 entras con Chispa o 🔑 subes por Memo. Las dos versiones están en el guion. Preguntar al usuario qué opción ganó antes de hacerla.
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

## Lo que no está en GitHub

| Qué | Dónde está | Cómo recuperarlo |
|---|---|---|
| Imágenes originales de Canva (3) | Cuenta de Canva | Descargar desde los enlaces de `referencias/README.md` |
| Flujos de voz y transcripción | ElevenLabs (IDs en cada `FICHA.md`) | Los audios y tiempos ya están en `video/audio/parteN/`; el flujo solo sirve para editar ahí |
| Cuadros de prueba de cada render | Se borraron con la sesión | Se regeneran con `node render.js ... --cuadros` |
| Resultados intermedios (`video/salida/`) | No se suben a propósito | Se regeneran con `./hacer_parteN.sh` |

## Próximos pasos

1. Fusionar el PR a `main` para que una sesión nueva lo vea todo en la rama principal.
2. Que el usuario revise el audio de las partes 1 a 6, sobre todo los aullidos de la parte 5 y los golpes de la parte 6.
3. Publicar la parte 7 con el comentario fijado de su `FICHA.md` y contar los votos a las 48 horas.
4. Parte 8 (versión 🐕 o 🔑 según los votos).
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
| 02/11 | Parte 7 terminada ("Las huellas", interactiva, ganó 🔦): 19 escenas, termina con la decisión 🐕 / 🔑. Nuevo en `lib/`: `une_tomas.py`; el degradado `#haz` pasa a `defsSVG` |
| 02/11 | Parte 6 terminada ("La bodega", interactiva): 17 escenas. Nuevas piezas en `lib/`: `sinCinta` en `caraChispa()`, clases de la tarjeta de decisión; `linea_de_tiempo.py` ignora etiquetas como `[whispering]`. Partes 3 a 5 dan la misma línea de tiempo después del cambio |
