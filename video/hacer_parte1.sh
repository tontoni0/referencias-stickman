#!/usr/bin/env bash
# Arma el video completo de la parte 1: línea de tiempo, cuadros, audio y video final.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida

python3 -I lib/linea_de_tiempo.py parte1/cortes.json audio/parte1/palabras.json parte1/tl.js
node render.js parte1/parte1.html salida/parte1_imagen.mp4 30
python3 -I parte1/mezcla.py parte1/tl.js audio/parte1/narracion.mp3 salida/parte1_audio.m4a
ffmpeg -v error -y -i salida/parte1_imagen.mp4 -i salida/parte1_audio.m4a \
  -c:v copy -c:a copy -shortest -movflags +faststart salida/la_alerta_parte1.mp4
echo "Video listo: salida/la_alerta_parte1.mp4"
