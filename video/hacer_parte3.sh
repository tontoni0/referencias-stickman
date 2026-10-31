#!/usr/bin/env bash
# Arma el video completo de la parte 3: línea de tiempo, cuadros, audio y video final.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida

python3 -I lib/linea_de_tiempo.py parte3/cortes.json audio/parte3/palabras.json parte3/tl.js
node render.js parte3/parte3.html salida/parte3_imagen.mp4 30
python3 -I parte3/mezcla.py parte3/tl.js audio/parte3/narracion.mp3 salida/parte3_audio.m4a
ffmpeg -v error -y -i salida/parte3_imagen.mp4 -i salida/parte3_audio.m4a \
  -c:v copy -c:a copy -shortest -movflags +faststart salida/la_alerta_parte3.mp4
echo "Video listo: salida/la_alerta_parte3.mp4"
