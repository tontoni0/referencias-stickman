# Parte 4 · La cornisa

| | |
|---|---|
| **Video** | `la_alerta_parte4.mp4` · 70.6 s · 1080x1920 · 30 fps · H.264 + AAC |
| **Estado** | Terminado y publicado en el repo |
| **Escenas** | 20 · ver `escenas.md` y `hoja_de_escenas.jpg` |
| **Gancho** | Flash-forward: Chispa en la cornisa del quinto piso, veinte infectados abajo, la pata resbala, congelado, rebobinado VHS "20 MINUTOS ANTES" |

## Guion

1. Guion completo: `guiones/la-alerta-serie-8-partes.md`, sección "Parte 4 · La cornisa". Se reescribió frente al guion original ("Memo") a pedido del usuario: más emoción y Chispa en peligro.
2. Texto exacto enviado a la voz: `video/audio/parte4/texto_voz.txt`.
3. Conserva lo que la historia necesita para las partes 5 a 8: inventario del día 3, el trato de Memo, Rosa revela que Memo cerró la puerta, Regla 3 y la alerta de las 3:14 de la noche 3.

## Código usado

| Archivo | Papel |
|---|---|
| `video/parte4/escenas.js` | Las 20 escenas. Funciones propias: `fachadaFrente` (fachada de frente con la cornisa), `abajoDesdeCornisa` (vista hacia abajo con las patas en la orilla), `pataCornisa` y `animaPata` (la pata que resbala), `chatPrivado` |
| `video/parte4/cortes.json` | Frases de corte, marcas, palabras en rojo, zonas sin subtítulos |
| `video/parte4/tl.js` | Línea de tiempo generada |
| `video/parte4/mezcla.py` | Viento, tensión, congelado, rebobinado, vidrio, paloma, latidos, gruñido, raspón, alivio, sirena |
| `video/parte4/parte4.html` | Página que junta todo |
| `video/lib/dibujo.js` | Nuevas: `perro('parada')`, `caraChispa()` (primer plano que gruñe, ladra o lame), `paloma()` |
| `video/lib/escena_base.js` | `hoja()` e `iconos` del inventario pasaron aquí desde la parte 2 |
| `video/hacer_parte4.sh` | Regenera todo |

## Voz (ElevenLabs)

| | |
|---|---|
| Voz | Alejandro - Horror y Misterio · `lr39dERdpNg6kPUtWZTO` |
| Modelo | `eleven_v4` |
| Flujo | `lneq8JDyIV3EC0mNzHz5` · https://elevenlabs.io/app/flows/lneq8JDyIV3EC0mNzHz5 |
| Toma usada | `take1.mp3` (generación `N7wmXQ2PLsCi4QO9UlCD`, 82.7 s). Toma 2: `Vrainbr00ebInJdAmfNU` |
| Transcripción | Scribe v1 de la toma 1 original (generación `TF9hcsb9cXOzFJSeer3K`), sin costo → `palabras_take1.json` |
| Proceso | `recorta_pausas.py` (pausas máx. 0.32 s, `atempo` 1.15) corre también los tiempos → `narracion_sin_pausas.mp3` 66.8 s; `inserta_silencios.py` devuelve 4 pausas → `narracion.mp3` 68.7 s |
| Créditos | ~1,848 (2 tomas × 924; la transcripción no cobró) |

Cambio de método: la herramienta para subir audio a ElevenLabs quedó bloqueada por permisos, así que se transcribió la toma original directo desde el flujo (`creative_add_flow_asset_node` con el `generation_id` + `creative_transcribe_audio`) y los tiempos se corrieron al audio recortado con `recorta_pausas.py --palabras`. Se verificó que los huecos entre palabras coinciden con los silencios reales (menos de 0.05 s de diferencia).

Comandos (desde `video/`):

```
python3 -I lib/recorta_pausas.py audio/parte4/take1.mp3 audio/parte4/narracion_sin_pausas.mp3 0.32 1.15 \
  --palabras audio/parte4/palabras_take1.json audio/parte4/palabras_sin_pausas.json
python3 -I lib/inserta_silencios.py audio/parte4/narracion_sin_pausas.mp3 audio/parte4/palabras_sin_pausas.json \
  audio/parte4/narracion.mp3 audio/parte4/palabras.json 6.64:0.35 7.55:0.7 46.15:0.25 48.7:0.6
```

Las cuatro pausas: "Si resbala… [pausa] la pierdes", el congelado del gancho, después de "Va a ladrar" y después de "La pata resbala".

## Sonido

Viento en las tomas de afuera; tensión que sube durante el gancho y se corta al congelar; golpe y soplido; chirrido de cinta; vibración del celular con cada mensaje; golpes apagados en el vidrio en el recuerdo; aleteo y arrullo de la paloma; soplido cuando Chispa salta; latidos desde la cornisa hasta que la agarras; gruñido que crece; raspón y migajas cuando resbala la pata; acorde de alivio cuando la jalas adentro; sirena de la alerta en la noche.

## Personajes y recursos

Tú, Chispa (de pie con miedo, primer plano gruñendo y lamiendo, collar con placa encintada), la paloma, Memo (chat y recuerdo), Rosa (chat), vecinos en el recuerdo, veinte infectados en el patio.

## Cómo regenerarlo

```
cd video
./hacer_parte4.sh
./hacer_parte4.sh --publicar
```
