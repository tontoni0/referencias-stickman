# Temporada 2 · Parte 2 · La puerta (interactiva)

| | |
|---|---|
| **Video** | `la_alerta_t2_parte2.mp4` · 66.4 s · 1080x1920 · 30 fps · H.264 + AAC · TAMANO · LUFS |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 14 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | La puerta del 402 desde adentro: tres toques despacio antes de la voz ("TOC") |
| **Final** | Tarjeta de decisión: "¿LE ABRES?", 🚪 SÍ, LE ABRO · 🔒 NO LE ABRO, "COMENTA 🚪 O 🔒" |

## Guion

1. Guion completo: `guiones/la-alerta-temporada-2.md`, sección "Parte 2 · La puerta". Al final de esa sección está cómo sigue cada opción en la parte 3.
2. Texto exacto de la voz: `video/audio/t2parte2/texto_voz.txt`.
3. Lo que pasa: Memo toca el 402. Por la mirilla se ve que tiene el brazo vendado y la piel gris hasta la muñeca: lo mordieron en la azotea. Pide que le abran porque sabe por qué sonó la alerta en toda la ciudad y dónde está Evelin. Rosa: "No le abras, corazón." Chispa gruñe y la cabeza de Memo voltea hacia el ruido, como la de los infectados. "Todavía soy yo. Todavía." La alerta se calla, los infectados regresan de los postes y los golpes de Memo los llaman escalera arriba.
4. Primera parte de la temporada 2 con decisión para los comentarios. Las otras dos son la 5 y la 8.

## Para publicar

**Título:** Memo tocó la puerta. Lo mordieron. ¿Le abres? | Temporada 2, parte 2
**Portada:** ¿LE ABRES?

**Comentario fijado:**

```
¿Le abres a Memo?
🚪 Sí, le abro · 🔒 No le abro
La parte 3 se hace con lo que gane.
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/t2parte2/escenas.js` | Las 14 escenas. Funciones propias: `memoDe` (Memo de pie con el brazo mordido, la venda y las venas del cuello), `brazoMordido`, `venas`, `lampara`, `puertaDentro` y `hojaDentro` (la puerta del 402 de frente), `corte402`, `puertaCorte` y `dentro402` (corte de la puerta: adentro y el pasillo del cuarto piso), `foco` (cámara que centra un punto sin salirse del cuadro), el corte del edificio con la escalera, la tarjeta de decisión |
| `video/t2parte2/cortes.json` | Frases de corte, marcas, palabras en rojo, sin subtítulos en la tarjeta final. `intro` de 1.8 s para los tres toques |
| `video/t2parte2/tl.js` | Línea de tiempo generada |
| `video/t2parte2/mezcla.py` | Toques, la alerta que se calla de golpe, gruñidos, latidos, la mordida y el grito, el susurro, el tronido del cuello de Memo, pasos y gemidos, golpes en la puerta con eco, tensión y cierre |
| `video/t2parte2/t2parte2.html` | Página que junta todo |
| `video/hacer_t2parte2.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): los toques en 0.25, 0.85 y 1.45 s; la cabeza de Memo voltea en `M.voltea - 0.05`; la alerta se calla en `M.calla + 0.32`; los golpes de Memo cada 0.62 s desde `M.golpeaM - 0.15` hasta `INI.dilema - 0.3`.

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `djHxRRo2T6aV3LVtrMX4` · https://elevenlabs.io/app/flows/djHxRRo2T6aV3LVtrMX4 |
| Toma usada | `take2.mp3` (generación `GDxu6CA2ANLrJmUJyFC4`, 71.8 s): misma duración que la otra al recortarla, pero su susurro final es más bajo. Toma 1: `kcVeCdyskx9U1B5yhMuW` (71.1 s) |
| Transcripción | Scribe v1 de la toma 2 (generación `MUXxdrGSuJNLiz7zXOUz`), sin costo → `palabras_take2.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.2) → `narracion_sin_pausas.mp3` 54.7 s; `inserta_silencios.py` agrega 14 pausas → `narracion.mp3` 61.6 s |
| Créditos | ~1,528 (2 tomas × 764; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/t2parte2/take2.mp3 audio/t2parte2/narracion_sin_pausas.mp3 0.3 1.2 \
  --palabras audio/t2parte2/palabras_take2.json audio/t2parte2/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/t2parte2/narracion_sin_pausas.mp3 audio/t2parte2/palabras_sin_pausas.json \
  audio/t2parte2/narracion.mp3 audio/t2parte2/palabras.json \
  2.40:0.5 5.2:0.5 9.15:0.4 11.26:0.4 17.25:0.5 20.36:0.3 25.72:0.5 29.12:0.6 31.45:1.0 34.6:0.4 39.55:0.4 42.50:0.5 46.98:0.3 51.40:0.6
```

Las pausas: después de "Despacio", "Es Memo", "muñeca", "mordieron", "tu nieta", "corazón", "Como ellos", "Todavía" (antes de que se calle la alerta), la más larga después de "se calla" (un segundo de silencio), después de "Muchos", "Ya vienen", "edificio", "Chispa" y antes de la pregunta final.

## Sonido

Tres toques en la puerta sin voz encima; la alerta de Evelin se oye desde adentro hasta que se calla de golpe y el ambiente desaparece un segundo; el gruñido de Chispa; latidos; una nota aguda cuando el gris llega a la muñeca; gemidos, la mordida y un grito corto en el recuerdo de la azotea; el susurro de Memo; un acorde suave con Rosa; el tronido del cuello de Memo al voltear; un zumbido que sube mientras se tapa la cara; pasos arrastrados y gemidos de los que regresan; golpes graves en la puerta con eco en el edificio; tensión baja en el dilema; golpes de cierre.

Niveles medidos antes de normalizar: efectos de 7 a 15 dB debajo de la voz. Los tres toques del inicio van solos, sin voz, y quedan cerca del volumen de la voz a propósito.

## Personajes y recursos

Memo (por la mirilla, en el pasillo, de cerca tapándose la cara, en el recuerdo de la azotea, en el dilema), Rosa, tú, Chispa (gruñe, de cerca y en el corte de la puerta), infectados (azotea, poste de la esquina, calle, escalera).

## Cómo regenerarlo

```
cd video
./hacer_t2parte2.sh
./hacer_t2parte2.sh --publicar
```
