#!/usr/bin/env bash
# Arma el video completo de la parte 7: línea de tiempo, cuadros, audio y video final.
#   ./hacer_parte7.sh             deja el video en salida/la_alerta_parte7.mp4 para revisarlo
#   ./hacer_parte7.sh --publicar  además lo copia a episodios/parte-07-las-huellas/ (reemplaza el guardado)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida

python3 -I lib/linea_de_tiempo.py parte7/cortes.json audio/parte7/palabras.json parte7/tl.js
node render.js parte7/parte7.html salida/parte7_imagen.mp4 30
python3 -I parte7/mezcla.py parte7/tl.js audio/parte7/narracion.mp3 salida/parte7_audio.m4a
ffmpeg -v error -y -i salida/parte7_imagen.mp4 -i salida/parte7_audio.m4a \
  -c:v copy -c:a copy -shortest -movflags +faststart salida/la_alerta_parte7.mp4
echo "Video listo: salida/la_alerta_parte7.mp4"

destino=../episodios/parte-07-las-huellas/la_alerta_parte7.mp4
if [[ "${1:-}" == "--publicar" ]]; then
  cp salida/la_alerta_parte7.mp4 "$destino"
  python3 -I lib/resumen_episodio.py parte7/tl.js "$destino" ../episodios/parte-07-las-huellas
  echo "Publicado en $destino"
else
  echo "No se tocó $destino. Revisa el video y corre con --publicar para reemplazarlo."
fi
