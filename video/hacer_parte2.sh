#!/usr/bin/env bash
# Arma el video completo de la parte 2: línea de tiempo, cuadros, audio y video final.
#   ./hacer_parte2.sh             deja el video en salida/la_alerta_parte2.mp4 para revisarlo
#   ./hacer_parte2.sh --publicar  además lo copia a episodios/parte-02-dia-1/ (reemplaza el guardado)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida

python3 -I lib/linea_de_tiempo.py parte2/cortes.json audio/parte2/palabras.json parte2/tl.js
node render.js parte2/parte2.html salida/parte2_imagen.mp4 30
python3 -I parte2/mezcla.py parte2/tl.js audio/parte2/narracion.mp3 salida/parte2_audio.m4a
ffmpeg -v error -y -i salida/parte2_imagen.mp4 -i salida/parte2_audio.m4a \
  -c:v copy -c:a copy -shortest -movflags +faststart salida/la_alerta_parte2.mp4
echo "Video listo: salida/la_alerta_parte2.mp4"

destino=../episodios/parte-02-dia-1/la_alerta_parte2.mp4
if [[ "${1:-}" == "--publicar" ]]; then
  cp salida/la_alerta_parte2.mp4 "$destino"
  python3 -I lib/resumen_episodio.py parte2/tl.js "$destino" ../episodios/parte-02-dia-1
  echo "Publicado en $destino"
else
  echo "No se tocó $destino. Revisa el video y corre con --publicar para reemplazarlo."
fi
