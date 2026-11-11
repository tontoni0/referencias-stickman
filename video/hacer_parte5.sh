#!/usr/bin/env bash
# Arma el video completo de la parte 5: línea de tiempo, cuadros, audio y video final.
#   ./hacer_parte5.sh             deja el video en salida/la_alerta_parte5.mp4 para revisarlo
#   ./hacer_parte5.sh --publicar  además lo copia a episodios/parte-05-tres-catorce/ (reemplaza el guardado)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida

python3 -I lib/linea_de_tiempo.py parte5/cortes.json audio/parte5/palabras.json parte5/tl.js
node render.js parte5/parte5.html salida/parte5_imagen.mp4 30
python3 -I parte5/mezcla.py parte5/tl.js audio/parte5/narracion.mp3 salida/parte5_audio.m4a
ffmpeg -v error -y -i salida/parte5_imagen.mp4 -i salida/parte5_audio.m4a \
  -c:v copy -c:a copy -shortest -movflags +faststart salida/la_alerta_parte5.mp4
echo "Video listo: salida/la_alerta_parte5.mp4"

destino=../episodios/parte-05-tres-catorce/la_alerta_parte5.mp4
if [[ "${1:-}" == "--publicar" ]]; then
  cp salida/la_alerta_parte5.mp4 "$destino"
  python3 -I lib/resumen_episodio.py parte5/tl.js "$destino" ../episodios/parte-05-tres-catorce
  echo "Publicado en $destino"
else
  echo "No se tocó $destino. Revisa el video y corre con --publicar para reemplazarlo."
fi
