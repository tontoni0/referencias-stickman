#!/usr/bin/env bash
# Arma el video completo de la parte 4: línea de tiempo, cuadros, audio y video final.
#   ./hacer_parte4.sh             deja el video en salida/la_alerta_parte4.mp4 para revisarlo
#   ./hacer_parte4.sh --publicar  además lo copia a episodios/parte-04-la-cornisa/ (reemplaza el guardado)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida

python3 -I lib/linea_de_tiempo.py parte4/cortes.json audio/parte4/palabras.json parte4/tl.js
node render.js parte4/parte4.html salida/parte4_imagen.mp4 30
python3 -I parte4/mezcla.py parte4/tl.js audio/parte4/narracion.mp3 salida/parte4_audio.m4a
ffmpeg -v error -y -i salida/parte4_imagen.mp4 -i salida/parte4_audio.m4a \
  -c:v copy -c:a copy -shortest -movflags +faststart salida/la_alerta_parte4.mp4
echo "Video listo: salida/la_alerta_parte4.mp4"

destino=../episodios/parte-04-la-cornisa/la_alerta_parte4.mp4
if [[ "${1:-}" == "--publicar" ]]; then
  cp salida/la_alerta_parte4.mp4 "$destino"
  python3 -I lib/resumen_episodio.py parte4/tl.js "$destino" ../episodios/parte-04-la-cornisa
  echo "Publicado en $destino"
else
  echo "No se tocó $destino. Revisa el video y corre con --publicar para reemplazarlo."
fi
