#!/usr/bin/env bash
# Arma el video completo de la temporada 2, parte 9: línea de tiempo, cuadros, audio y video final.
#   ./hacer_t2parte9.sh             deja el video en salida/la_alerta_t2_parte9.mp4 para revisarlo
#   ./hacer_t2parte9.sh --publicar  además lo copia a episodios/t2-parte-09-bajen-al-patio/ (reemplaza el guardado)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida

python3 -I lib/linea_de_tiempo.py t2parte9/cortes.json audio/t2parte9/palabras.json t2parte9/tl.js
node render.js t2parte9/t2parte9.html salida/t2parte9_imagen.mp4 30
python3 -I t2parte9/mezcla.py t2parte9/tl.js audio/t2parte9/narracion.mp3 salida/t2parte9_audio.m4a
ffmpeg -v error -y -i salida/t2parte9_imagen.mp4 -i salida/t2parte9_audio.m4a \
  -c:v copy -c:a copy -shortest -movflags +faststart salida/la_alerta_t2_parte9.mp4
echo "Video listo: salida/la_alerta_t2_parte9.mp4"

destino=../episodios/t2-parte-09-bajen-al-patio/la_alerta_t2_parte9.mp4
if [[ "${1:-}" == "--publicar" ]]; then
  mkdir -p "$(dirname "$destino")"
  cp salida/la_alerta_t2_parte9.mp4 "$destino"
  python3 -I lib/resumen_episodio.py t2parte9/tl.js "$destino" ../episodios/t2-parte-09-bajen-al-patio
  echo "Publicado en $destino"
else
  echo "No se tocó $destino. Revisa el video y corre con --publicar para reemplazarlo."
fi
