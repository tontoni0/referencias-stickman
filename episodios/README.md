# Episodios

## Temporada 1

Videos terminados de la serie "La alerta", uno por carpeta. Cada carpeta trae el video, su `FICHA.md` (código, voz, recursos y cómo regenerarlo), `escenas.md` (tabla de escenas con tiempos) y `hoja_de_escenas.jpg` (un cuadro por escena).

| Parte | Título | Duración | Escenas | Gancho al inicio | Carpeta |
|---|---|---|---|---|---|
| 1 | La alerta | 70.4 s | 12 | Tarjeta 3:14 con sirena | `parte-01-la-alerta/` |
| 2 | Día 1 | 63.0 s | 12 | "Día 1" en el cuaderno | `parte-02-dia-1/` |
| 3 | El mecate | 71.0 s | 18 | Flash-forward + rebobinado | `parte-03-el-mecate/` |
| 4 | La cornisa | 70.6 s | 20 | Flash-forward: Chispa en la cornisa | `parte-04-la-cornisa/` |
| 5 | 3:14 | 71.4 s | 17 | Sin flash-forward: abre con la alerta sonando y Chispa aullando | `parte-05-tres-catorce/` |
| 6 | La bodega (interactiva) | 70.6 s | 17 | Directo: las cabezas te miran y "Cuando se calla, se paga". Termina con decisión para los comentarios | `parte-06-la-bodega/` |
| 7 | Las huellas (interactiva, ganó 🔦) | 79.5 s | 19 | Tarjeta del voto: "GANÓ" 🔦. Termina con otra decisión: 🐕 Chispa o 🔑 Memo | `parte-07-las-huellas/` |
| 8 | La primera noche (final, ganó 🐕) | 75.4 s | 16 | Tarjeta del voto: "GANÓ" 🐕. Termina con la tarjeta de sospechosos y "TEMPORADA 2" | `parte-08-la-primera-noche/` |

## Temporada 2

Diseño completo en `guiones/la-alerta-temporada-2.md`. Son 10 partes y la historia termina en la última.

| Parte | Título | Duración | Escenas | Inicio | Carpeta |
|---|---|---|---|---|---|
| 1 | Evelin | 69.3 s | 12 | Tarjeta de sospechosos de la parte 8: "Ustedes votaron por Memo" y el sello "CASI". Termina con la pregunta "¿Quién hizo que sonara para todos?" | `t2-parte-01-evelin/` |
| 2 | La puerta (interactiva) | 66.4 s | 14 | Tres toques en la puerta del 402. Memo está mordido. Termina con decisión: 🚪 le abres o 🔒 no le abres | `t2-parte-02-la-puerta/` |
| 3 | La tienda (interactiva, ganó 🔒) | 75.6 s | 15 | Tarjeta del voto: "GANÓ" 🔒. Termina con decisión: 🏃 cruzas por Chispa o ⏳ esperas otra alerta | `t2-parte-03-la-tienda/` |
| 4 | Los escombros (interactiva, ganó ⏳) | 68.1 s | 14 | Tarjeta del voto: "GANÓ" ⏳. Recuerdo de cómo encontraste a Chispa. Termina con decisión: 🚇 por el metro o 🏚️ por los escombros | `t2-parte-04-los-escombros/` |
| 5 | El metro (interactiva, ganó 🏚️) | 65.4 s | 15 | Tarjeta del voto: "GANÓ" 🏚️. Caes al túnel; el andén está lleno. Termina con decisión: 🏃 corres por el túnel o 🤫 no te mueves | `t2-parte-05-el-metro/` |
| 6 | El centro de alerta (interactiva, ganó 🤫) | 70.7 s | 16 | Tarjeta del voto: "GANÓ" 🤫. Muerden a Chispa; el registro de la primera noche; Memo. Termina con decisión: 🤝 lo dejas venir o 🔐 lo encierras aquí | `t2-parte-06-el-centro-de-alerta/` |
| 7 | La antena (interactiva, ganó 🔐) | 67.7 s | 17 | Tarjeta del voto: "GANÓ" 🔐. Evelin en la azotea; los ojos blancos de Chispa y los audífonos; Memo detrás del tinaco. Termina con decisión: 🗣️ le cuentas a Evelin o 🤐 te lo callas | `t2-parte-07-la-antena/` |
| 8 | Noventa segundos (interactiva, gana 🗣️) | 75.8 s | 17 | Tarjeta del voto: "GANÓ" 🗣️. Evelin cuenta la primera noche; el plan de alertas por zona; Chispa aúlla bajo el puente; Memo se lleva a Evelin. Termina con decisión: 🐕 salvas a Chispa o 👩 vas por Evelin | `t2-parte-08-noventa-segundos/` |
| 9 | Bajen al patio (interactiva, gana 🐕) | 75.0 s | 16 | Tarjeta del voto: "GANÓ" 🐕. Salvas a Chispa; la Coordinación se lleva a Evelin y Memo se transforma; el radio anuncia la alerta de las 3:14; "EL TABLERO VIEJO. HAY CURA"; la escalera llena. Termina con decisión: 🪢 por la ventana con el mecate o 🚪 por la escalera | `t2-parte-09-bajen-al-patio/` |
| 10 | La última alerta (final, gana 🪢) | 82.5 s | 20 | Tarjeta del voto: "GANÓ" 🪢. El tablero viejo, la voz de Rosa por las bocinas, "MANDALA ABUELA", la última alerta al estadio, el suero y la placa que suena sin que venga nadie. Termina con "FIN" y la pregunta de la siguiente historia | `t2-parte-10-la-ultima-alerta/` |

Los videos se regeneran desde `video/` con `./hacer_parteN.sh --publicar` (temporada 2: `./hacer_t2parteN.sh --publicar`).
