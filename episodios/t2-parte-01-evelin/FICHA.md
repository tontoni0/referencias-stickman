# Temporada 2 · Parte 1 · Evelin

| | |
|---|---|
| **Video** | `la_alerta_t2_parte1.mp4` · 69.3 s · 1080x1920 · 30 fps · H.264 + AAC · TAMANO · LUFS |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 12 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Tarjeta de sospechosos de la parte 8: "USTEDES VOTARON" con Memo encendido y un sello rojo "CASI" |
| **Final** | Tarjeta "¿QUIÉN HIZO QUE SONARA PARA TODOS?", una silueta con un celular, "COMENTA TU TEORÍA" y "PARTE 2 →" |

## Guion

1. Diseño de la temporada y guion de esta parte: `guiones/la-alerta-temporada-2.md`, sección "Parte 1 · Evelin".
2. Texto exacto de la voz: `video/audio/t2parte1/texto_voz.txt`.
3. Lo que pasa: sigue sin pausa al final de la temporada 1. Los comentarios votaron por Memo; la respuesta es "casi". La alerta sigue sonando y el radio de Rosa se prende solo. Rosa: "Esta no la hice yo. Solo una persona sabe hacer esto." Es Evelin, su nieta, operadora de noche en el centro de alerta. De niña inventaron una clave: si hay peligro, se avisan a las 3:14 y la otra se esconde. Por eso la primera noche Rosa no bajó al patio. El radio pita en clave y Rosa escribe ESTOY VIVA. Arriba, la lámpara de Memo baja por la escalera hacia la luz del radio; Chispa le gruñe a la puerta. El radio pita otra vez: FUI YO. PERDONAME ABUELA. Recuerdo de la primera noche: Evelin aprieta la prueba solo para la zona del Edificio C y la alerta se prende en todas las zonas.
4. Ganchos para la parte 2: Memo está afuera de la puerta del 402, y alguien hizo que la alerta de Evelin sonara en toda la ciudad.

## Para publicar

**Título:** La alerta sonó sola. Solo una persona sabe hacer eso | Temporada 2, parte 1
**Portada:** FUE ELLA.

**Comentario fijado:**

```
¿Quién hizo que la alerta de Evelin sonara en toda la ciudad?
Comenten su teoría. La parte 2 sale pronto.
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/t2parte1/escenas.js` | Las 12 escenas. Funciones propias: `morse()` (reparte un mensaje en pitidos y dice cuándo termina cada letra), `radioViejo` (con aguja que se mueve cuando está prendido), `estatica`, `salaControl` (sala del centro de alerta con mapa de zonas, monitores, escritorio y el botón de prueba), `fachadaC` y `VECINOS` (la primera noche), `radioYLibreta`, `morseVisual` (puntos y rayas en pantalla), `letrasEscritas`, `puntaLapiz` y `manoLapiz` (Rosa escribe letra por letra), `cubo` (cubo de la escalera del 2 a la azotea) |
| `video/t2parte1/cortes.json` | Frases de corte, marcas, palabras en rojo, "tres catorce" → "3:14", sin subtítulos en la tarjeta final |
| `video/t2parte1/tl.js` | Línea de tiempo generada |
| `video/t2parte1/mezcla.py` | Campanita y sello, la alerta que sigue sonando, estática, latidos, zumbido del centro de alerta, reloj y lápiz del recuerdo, sirena lejana de la primera noche, pitidos en clave, pasos de Memo, gruñido de Chispa, botón de prueba y alarma de todas las zonas, golpes de cierre |
| `video/t2parte1/t2parte1.html` | Página que junta todo |
| `video/hacer_t2parte1.sh` | Regenera todo |
| `video/lib/dibujo.js` | `evelin()`, nueva para esta temporada |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas):

1. La función `morse()` y los tres mensajes: `ESTOY VIVA` de `INI.pita + 0.3` a `M.viva + 0.4`; `FUI YO` de `INI.fuiyo + 0.3` a `M.fui + 0.35`; `PERDONAME ABUELA` de `M.fui + 0.55` a `INI.centro - 0.55`. Punto 1, raya 3, 1 entre pitidos, 3 entre letras, 7 entre palabras.
2. Evelin aprieta el botón de prueba en `INI.centro + 0.6`.

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `6txqsUgvjx94yBsLk943` · https://elevenlabs.io/app/flows/6txqsUgvjx94yBsLk943 |
| Toma usada | `take1.mp3` (generación `og1UsSrbBjofRmbXSqfr`, 80.5 s). Toma 2: `EDkUVpg4eM4DsPj6sfxE` (80.2 s) |
| Transcripción | Scribe v1 de la toma 1 (nodo `DU2Ax8YrLPBao64B6N40`, generación `DenTENx158c8MYlbazLV`), sin costo → `palabras_take1.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.2) → `narracion_sin_pausas.mp3` 60.1 s; `inserta_silencios.py` agrega 11 pausas → `narracion.mp3` 66.1 s |
| Créditos | ~1,724 (2 tomas × 862; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/t2parte1/take1.mp3 audio/t2parte1/narracion_sin_pausas.mp3 0.3 1.2 \
  --palabras audio/t2parte1/palabras_take1.json audio/t2parte1/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/t2parte1/narracion_sin_pausas.mp3 audio/t2parte1/palabras_sin_pausas.json \
  audio/t2parte1/narracion.mp3 audio/t2parte1/palabras.json \
  2.2:0.6 12.2:0.3 13.0:0.3 31.9:0.5 34.4:0.25 35.27:0.25 38.68:0.5 46.59:0.4 49.04:0.9 50.22:1.5 55.94:0.5
```

Las pausas: después de "Casi" (para leer la tarjeta y el sello), antes y después de "Evelin" (el nombre queda solo), después de "Rosa entendió", después de "Cortos" y de "Largos", después de "Estoy viva", después de "Chispa le gruñe a la puerta", después de "Fui yo" y la más larga después de "Perdóname, abuela" (el radio sigue pitando y cae una lágrima), y antes de la pregunta final.

## Sonido

Campanita y golpe del sello "CASI"; la alerta que sigue sonando; el clic del radio que se prende solo y su estática; latidos y una nota aguda en "solo una persona"; golpe con el nombre de Evelin, zumbido eléctrico y dos bips del centro de alerta; acorde cálido, reloj de la cocina y el lápiz en el recuerdo; la sirena lejana de la primera noche, la gente que baja y el soplido de la vela; pitidos de 760 Hz en clave Morse con el lápiz raspando cada letra; pasos lentos de Memo en la escalera y latidos; el gruñido de Chispa; un acorde triste después de "abuela"; el clic del botón de prueba, un aviso de zona y la alarma de todas las zonas; golpes graves en la pregunta y en "comenta".

Niveles medidos antes de normalizar: efectos de 8 a 13 dB debajo de la voz. En `fuiyo` quedan a unos 6 dB porque los pitidos siguen en la pausa larga después de "abuela".

## Personajes y recursos

Rosa (pálida de cerca, de joven con Evelin niña, en su ventana la primera noche, solo su mano escribiendo), Evelin (presentación con audífonos y gafete, de niña con coletas, en la sala de control la primera noche), Chispa (gruñe a la puerta), Memo (silueta con lámpara en la escalera), vecinos en pijama bajando al patio. Sin infectados en pantalla.

## Cómo regenerarlo

```
cd video
./hacer_t2parte1.sh
./hacer_t2parte1.sh --publicar
```
