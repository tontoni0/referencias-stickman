#!/usr/bin/env bash
# Arma el video completo de la parte 6: línea de tiempo, cuadros, audio y video final.
#   ./hacer_parte6.sh             deja el video en salida/la_alerta_parte6.mp4 para revisarlo
#   ./hacer_parte6.sh --publicar  además lo copia a episodios/parte-06-la-bodega/ (reemplaza el guardado)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida

python3 -I lib/linea_de_tiempo.py parte6/cortes.json audio/parte6/palabras.json parte6/tl.js
node render.js parte6/parte6.html salida/parte6_imagen.mp4 30
python3 -I parte6/mezcla.py parte6/tl.js audio/parte6/narracion.mp3 salida/parte6_audio.m4a
ffmpeg -v error -y -i salida/parte6_imagen.mp4 -i salida/parte6_audio.m4a \
  -c:v copy -c:a copy -shortest -movflags +faststart salida/la_alerta_parte6.mp4
echo "Video listo: salida/la_alerta_parte6.mp4"

destino=../episodios/parte-06-la-bodega/la_alerta_parte6.mp4
if [[ "${1:-}" == "--publicar" ]]; then
  cp salida/la_alerta_parte6.mp4 "$destino"
  python3 -I lib/resumen_episodio.py parte6/tl.js "$destino" ../episodios/parte-06-la-bodega
  echo "Publicado en $destino"
else
  echo "No se tocó $destino. Revisa el video y corre con --publicar para reemplazarlo."
fi
