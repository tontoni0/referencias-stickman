# Estado del proyecto

Última actualización: 31 de octubre de 2026.
Rama de trabajo: `claude/guiones-stickman`. Se abrió un PR hacia `main` con todo el trabajo; si ya se fusionó, todo está en `main`.

## Episodios terminados

| Parte | Título | Duración | Escenas | Video | Créditos ElevenLabs |
|---|---|---|---|---|---|
| 1 | La alerta | 70.4 s | 12 | `episodios/parte-01-la-alerta/la_alerta_parte1.mp4` | ~2,118 |
| 2 | Día 1 | 63.0 s | 12 | `episodios/parte-02-dia-1/la_alerta_parte2.mp4` | ~1,986 |
| 3 | El mecate | 71.0 s | 18 | `episodios/parte-03-el-mecate/la_alerta_parte3.mp4` | ~2,212 |

Cada carpeta tiene `FICHA.md` con el código, la voz, los recursos y los comandos que se usaron.

## Pendiente

1. **Parte 4 · Memo** (Día 3). Guion en `guiones/la-alerta-serie-8-partes.md`. Escenas: tarjeta "DÍA 3", retrato de Memo, chat con su trato (latas por un garrafón), inventario del día 3 (agua 18 L, comida 3 días, croquetas 10 días, batería 22 %), chat de Rosa que revela que Memo cerró la puerta la noche de la alerta, recuerdo en rojo de Memo echando llave con manos golpeando el vidrio, "REGLA 3: Desconfía de quien sobrevivió demasiado fácil", despertar a las 3:14, poste sonando otra vez. Falta decidir el gancho (propuesta: abrir con el recuerdo de Memo echando llave mientras los vecinos golpean el vidrio, congelar y rebobinar).
2. **Partes 5 a 8** según el guion: 3:14, Noventa segundos, La cortina, La primera noche.
3. **Versión larga de 8 minutos**: no está armada. Hay que unir las partes quitando las tarjetas "PARTE N →" y agregar capítulos (ver el final del guion de la serie).
4. **Short "La ofrenda"** (`guiones/la-ofrenda-short-interactivo.md`): escrito, no producido. Pensado para el 1 y 2 de noviembre.
5. **Portadas y títulos para publicar**: el guion trae título y texto de portada por parte; no se han hecho imágenes de portada.

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

## Errores conocidos y limitaciones

1. **Claude no puede escuchar el audio.** Los niveles se midieron (efectos 10 dB o más debajo de la voz, mezcla a -14 LUFS), pero el usuario no ha confirmado cómo suenan las partes 1 a 3.
2. **Las partes 1 y 2 no tienen el gancho con flash-forward.** Se hicieron antes de esa decisión. Se podrían rehacer (pendiente de decidir).
3. **Duraciones**: 63 a 71 s. TikTok y Reels lo aceptan; si se quiere 60 s exactos hay que recortar texto.
4. **Imágenes de Canva**: en el repo solo están las miniaturas; los originales (1680x944) siguen en la cuenta de Canva (enlaces en `referencias/README.md`).
5. **Videos de referencia**: son de otros creadores (`referencias/videos/`). No se publican ni se copian sus dibujos.
6. **Historial pesado**: cada video re-subido agrega unos 22 MB. El repo pesaba unos 122 MB al 31/10.
7. **Escenas mejorables** en la parte 3: `chillido` (Chispa) se ve vacía y en `sacude` los brazos parecen una tienda de campaña.
8. **Se corrigió** una falla del motor que dejaba un subtítulo asomándose 2 a 4 cuadros en la escena siguiente (partes 2 y 3 se volvieron a renderizar).

## Lo que no está en GitHub

| Qué | Dónde está | Cómo recuperarlo |
|---|---|---|
| Imágenes originales de Canva (3) | Cuenta de Canva | Descargar desde los enlaces de `referencias/README.md` |
| Flujos de voz y transcripción | ElevenLabs (IDs en cada `FICHA.md`) | Los audios y tiempos ya están en `video/audio/parteN/`; el flujo solo sirve para editar ahí |
| Cuadros de prueba de cada render | Se borraron con la sesión | Se regeneran con `node render.js ... --cuadros` |
| Resultados intermedios (`video/salida/`) | No se suben a propósito | Se regeneran con `./hacer_parteN.sh` |

## Próximos pasos

1. Fusionar el PR a `main` para que una sesión nueva lo vea todo en la rama principal.
2. Que el usuario revise el audio de las partes 1 a 3.
3. Parte 4 con gancho al inicio.
4. Decidir si se rehace el inicio de las partes 1 y 2 con flash-forward.
5. Partes 5 a 8, versión larga y portadas.

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
