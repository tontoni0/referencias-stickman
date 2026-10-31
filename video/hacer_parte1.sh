#!/usr/bin/env bash
# Arma el video completo de la parte 1: línea de tiempo, cuadros, audio y video final.
#   ./hacer_parte1.sh             deja el video en salida/la_alerta_parte1.mp4 para revisarlo
#   ./hacer_parte1.sh --publicar  además lo copia a episodios/parte-01-la-alerta/ (reemplaza el guardado)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida

python3 -I lib/linea_de_tiempo.py parte1/cortes.json audio/parte1/palabras.json parte1/tl.js
node render.js parte1/parte1.html salida/parte1_imagen.mp4 30
python3 -I parte1/mezcla.py parte1/tl.js audio/parte1/narracion.mp3 salida/parte1_audio.m4a
ffmpeg -v error -y -i salida/parte1_imagen.mp4 -i salida/parte1_audio.m4a \
  -c:v copy -c:a copy -shortest -movflags +faststart salida/la_alerta_parte1.mp4
echo "Video listo: salida/la_alerta_parte1.mp4"

destino=../episodios/parte-01-la-alerta/la_alerta_parte1.mp4
if [[ "${1:-}" == "--publicar" ]]; then
  cp salida/la_alerta_parte1.mp4 "$destino"
  python3 -I lib/resumen_episodio.py parte1/tl.js "$destino" ../episodios/parte-01-la-alerta
  echo "Publicado en $destino"
else
  echo "No se tocó $destino. Revisa el video y corre con --publicar para reemplazarlo."
fi
