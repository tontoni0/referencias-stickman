#!/usr/bin/env bash
# Arma el video completo de la parte 2: línea de tiempo, cuadros, audio y video final.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida

python3 -I lib/linea_de_tiempo.py parte2/cortes.json audio/parte2/palabras.json parte2/tl.js
node render.js parte2/parte2.html salida/parte2_imagen.mp4 30
python3 -I parte2/mezcla.py parte2/tl.js audio/parte2/narracion.mp3 salida/parte2_audio.m4a
ffmpeg -v error -y -i salida/parte2_imagen.mp4 -i salida/parte2_audio.m4a \
  -c:v copy -c:a copy -shortest -movflags +faststart salida/la_alerta_parte2.mp4
echo "Video listo: salida/la_alerta_parte2.mp4"
