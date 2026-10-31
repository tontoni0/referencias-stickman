# Referencias

Todo lo que se usó como inspiración o como prueba antes de producir los episodios. Nada de esta carpeta se publica.

## `videos/` · Videos de referencia de otros creadores

Son las dos grabaciones de pantalla que subiste al inicio (antes estaban en la raíz del repo). Son contenido de otras personas: sirven para estudiar el formato, no para copiar dibujos ni publicar.

| Archivo | Duración | Qué es | Lo que tomamos |
|---|---|---|---|
| `ScreenRecording_10-30-2026 20-23-03_1.mov` | 39 s, horizontal | Historia de supervivencia en un departamento sitiado. Stickman con gorro mostaza y bufanda gris, ilustración de cómic hecha con IA. Tarjetas de "SUPPLIES · DAY 13" y "SIEGE RULE 3". Narración en segunda persona. | La construcción del stickman (cabeza blanca grande, ojos ovalados, sin boca, cuerpo de líneas), tarjetas de reglas e inventario, cortes a negro con el día. |
| `ScreenRecording_10-30-2026 20-32-43_1.mov` | 26 s, vertical | Reel de Instagram de `thirdperiod.zombie` (336K likes). Personajes vectoriales planos, subtítulos palabra por palabra con palabra clave en rojo, final con "PART 2: DO YOU UNLOCK THE DOOR? YES / NO". | Subtítulos grandes con la palabra fuerte en rojo, ritmo de cortes, cierre con suspenso y llamado a la parte siguiente. |

## `personajes/` · Hoja oficial de personajes

`hoja_personajes.png` está dibujada con el mismo código de los episodios (`video/personajes/hoja.html`). Es la referencia de continuidad: si un personaje cambia, se cambia en `video/lib/dibujo.js` y se vuelve a generar esta hoja con `npm run hoja-personajes` desde `video/`.

## `prueba-codigo/` · Primera prueba sin créditos

La prueba que convenció de dibujar todo con código en vez de usar Canva: escena de Chispa gruñendo, tarjeta "REGLA 1" y chat del edificio. `prueba.html` es la fuente; abre en el navegador.

## `canva/` · Imágenes generadas con IA en Canva

Se hicieron tres imágenes de prueba con el generador de Canva antes de decidir dibujar con código. Aquí solo hay miniaturas (199x112), porque el entorno no puede descargar los originales. Los originales miden 1680x944 y están en la cuenta de Canva:

| ID | Qué es | Enlace |
|---|---|---|
| `MAHZiwDsmaY` | Hoja de Tú y Chispa (3 poses) | https://www.canva.com/M/MAHZiwDsmaY |
| `MAHZi2QlCGQ` | Hoja de Rosa, Memo e infectado | https://www.canva.com/M/MAHZi2QlCGQ |
| `MAHZi0yydK0` | Prueba de escena: Chispa gruñe a la puerta | https://www.canva.com/M/MAHZi0yydK0 |

Para guardarlos en el repo: ábrelos en Canva, descárgalos como PNG y ponlos en esta carpeta con el mismo ID en el nombre.
