# Parte 6 · La bodega (interactiva)

| | |
|---|---|
| **Video** | `la_alerta_parte6.mp4` · 70.6 s · 1080x1920 · 30 fps · H.264 + AAC · 24 MB |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 17 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Inicio** | Sin flash-forward. Abre con las cabezas del patio mirando hacia ti con los ojos encendidos (el final de la parte 5) y "Cuando se calla, se paga" |
| **Final** | Tarjeta de decisión para los comentarios: 🔑 bajas con Memo o 🔦 buscas a Chispa |

## Guion

1. Guion completo: `guiones/la-alerta-serie-8-partes.md`, sección "Parte 6 · La bodega (interactiva)". Se reescribió el 2 de noviembre a pedido del usuario: los infectados suben al edificio, escapas a una bodega, pierdes a Chispa y Memo dice que la tiene.
2. Texto exacto enviado a la voz: `video/audio/parte6/texto_voz.txt`.
3. Lo que el espectador todavía no sabe: Memo no tiene a Chispa. La foto es vieja (del directorio de mascotas del edificio) y por eso la placa brilla: no tiene la cinta que le pusiste el día 1. Chispa se metió por la ventana de Rosa (402). La parte 7 tiene dos versiones según lo que voten.

## Para publicar

**Título:** Perdí a mi perrita y el vecino dice que la tiene | Parte 6
**Portada:** TENGO A TU PERRA.

**Comentario fijado:**

```
🔑 = bajas al 101 con Memo
🔦 = buscas a Chispa por tu cuenta
Gana lo que tenga más comentarios en 48 horas. La parte 7 sigue lo que elijan.
```

## Código usado

| Archivo | Papel |
|---|---|
| `video/parte6/escenas.js` | Las 17 escenas. Funciones propias: `montonArriba` (cabezas desde arriba que se lanzan), la puerta de vidrio con candado (`grietas`, `astillas`), `cubo` y `uLider` (corte de la escalera que sube piso por piso), `puerta`, `hojaPuerta`, `sillaFrente` y `tuConChispa` (tu puerta, la silla y Chispa en brazos), `fachadaNoche`, `tuCornisa`, `manoVentana` y `chispaCorre` (la cornisa de noche), `azoteaEscena` (tinacos y bodegas), `fotoChispa` (la foto con la placa sin cinta) |
| `video/parte6/cortes.json` | Frases de corte, marcas, palabras en rojo, zonas sin subtítulos |
| `video/parte6/tl.js` | Línea de tiempo generada |
| `video/parte6/mezcla.py` | Golpe, estampida, manos en el vidrio, grietas, vidrio que revienta, pasos, golpes en la puerta, silla, chillido de Chispa, puerta que cede, viento, uñas, escalerita, bodega, vibraciones, tensión y pulso final |
| `video/parte6/parte6.html` | Página que junta todo |
| `video/lib/dibujo.js` | Nueva opción `sinCinta` en `caraChispa()` (placa como antes del día 1) |
| `video/lib/estilo.css` | Nuevas clases para la tarjeta de decisión: `.decide-tit`, `.opcion`, `.decide-com`, `.decide-pie` |
| `video/lib/linea_de_tiempo.py` | Ignora etiquetas de ElevenLabs como `[whispering]` en la transcripción |
| `video/hacer_parte6.sh` | Regenera todo |

Constantes compartidas entre `escenas.js` y `mezcla.py` (cámbialas juntas): los golpes en la puerta empiezan en `INI.golpes + 0.15` y se repiten cada 0.62 s hasta `M.cede - 0.1`; las grietas salen en `M.revienta - 2.2`, `- 1.2` y `- 0.45`; la puerta de la bodega se cierra en `M.encierras + 0.3`.

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `e8sFK5MtGnRIGPBjApzR` · https://elevenlabs.io/app/flows/e8sFK5MtGnRIGPBjApzR |
| Toma usada | `take1.mp3` (generación `4x9Sqyye2wbJ3mEC9l83`, 83.5 s). Toma 2: `pduXzDBJYKtbshJdtDr1` (80.9 s) |
| Transcripción | Scribe v1 de la toma 1 original (generación `dcJfZyf09gUaQOWQKqgD`), sin costo → `palabras_take1.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.3 s, `atempo` 1.18) corre también los tiempos → `narracion_sin_pausas.mp3` 65.1 s; `inserta_silencios.py` devuelve 6 pausas → `narracion.mp3` 67.9 s |
| Créditos | ~1,836 (2 tomas × 918; la transcripción no cobró) |

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/parte6/take1.mp3 audio/parte6/narracion_sin_pausas.mp3 0.3 1.18 \
  --palabras audio/parte6/palabras_take1.json audio/parte6/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/parte6/narracion_sin_pausas.mp3 audio/parte6/palabras_sin_pausas.json \
  audio/parte6/narracion.mp3 audio/parte6/palabras.json 5.95:0.4 19.5:0.5 30.74:0.6 43.04:0.35 51.45:0.6 59.14:0.35
```

Las seis pausas: después de "revienta" (el vidrio), "La puerta cede", "se pierde en la oscuridad", "ellos están en tu casa", "Su placa" (para que se vea la placa) y "no le abras a Memo".

## Sonido

Golpe de entrada; estampida hacia el edificio; manos que golpean el vidrio, tres grietas y el vidrio que revienta con tintineo; pasos rápidos en la escalera (apagados en el 402); golpes de madera en tu puerta con un retumbe; la silla que raspa; un chillido bajito de Chispa; la puerta que cruje y cede; viento en la cornisa; un gruñido cuando sale la mano; uñas de Chispa que se alejan; latido; la escalerita de fierro; la puerta de la bodega; pasos arrastrados abajo; vibraciones del celular; tensión que sube con la foto y un timbre agudo en la placa; pulso grave en la tarjeta de decisión.

Niveles medidos antes de normalizar: donde habla la voz, los efectos quedan de 7 a 12 dB debajo. El vidrio que revienta y la puerta que cede suenan más fuerte a propósito porque caen en las pausas que se agregaron después de "revienta" y "cede". Video final: -16.5 LUFS integrados, como las partes anteriores.

## Personajes y recursos

Tú, Chispa (en brazos, en la cornisa, corriendo, en la foto con la placa sin cinta), Rosa (a oscuras con una vela), Memo (chat), unos 26 infectados (cabezas desde arriba, detrás del vidrio, en la escalera, brazos en la puerta, la mano en la ventana, quietos con la cara hacia arriba en tu departamento).

## Cómo regenerarlo

```
cd video
./hacer_parte6.sh
./hacer_parte6.sh --publicar
```
