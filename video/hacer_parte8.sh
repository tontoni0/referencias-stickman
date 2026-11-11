#!/usr/bin/env bash
# Arma el video completo de la parte 8: línea de tiempo, cuadros, audio y video final.
#   ./hacer_parte8.sh             deja el video en salida/la_alerta_parte8.mp4 para revisarlo
#   ./hacer_parte8.sh --publicar  además lo copia a episodios/parte-08-la-primera-noche/ (reemplaza el guardado)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida

python3 -I lib/linea_de_tiempo.py parte8/cortes.json audio/parte8/palabras.json parte8/tl.js
node render.js parte8/parte8.html salida/parte8_imagen.mp4 30
python3 -I parte8/mezcla.py parte8/tl.js audio/parte8/narracion.mp3 salida/parte8_audio.m4a
ffmpeg -v error -y -i salida/parte8_imagen.mp4 -i salida/parte8_audio.m4a \
  -c:v copy -c:a copy -shortest -movflags +faststart salida/la_alerta_parte8.mp4
echo "Video listo: salida/la_alerta_parte8.mp4"

destino=../episodios/parte-08-la-primera-noche/la_alerta_parte8.mp4
if [[ "${1:-}" == "--publicar" ]]; then
  cp salida/la_alerta_parte8.mp4 "$destino"
  python3 -I lib/resumen_episodio.py parte8/tl.js "$destino" ../episodios/parte-08-la-primera-noche
  echo "Publicado en $destino"
else
  echo "No se tocó $destino. Revisa el video y corre con --publicar para reemplazarlo."
fi
