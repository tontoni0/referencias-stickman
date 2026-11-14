#!/usr/bin/env bash
# Arma el video completo de la temporada 2, parte 10: línea de tiempo, cuadros, audio y video final.
#   ./hacer_t2parte10.sh             deja el video en salida/la_alerta_t2_parte10.mp4 para revisarlo
#   ./hacer_t2parte10.sh --publicar  además lo copia a episodios/t2-parte-10-la-ultima-alerta/ (reemplaza el guardado)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p salida

python3 -I lib/linea_de_tiempo.py t2parte10/cortes.json audio/t2parte10/palabras.json t2parte10/tl.js
node render.js t2parte10/t2parte10.html salida/t2parte10_imagen.mp4 30
python3 -I t2parte10/mezcla.py t2parte10/tl.js audio/t2parte10/narracion.mp3 salida/t2parte10_audio.m4a
ffmpeg -v error -y -i salida/t2parte10_imagen.mp4 -i salida/t2parte10_audio.m4a \
  -c:v copy -c:a copy -shortest -movflags +faststart salida/la_alerta_t2_parte10.mp4
echo "Video listo: salida/la_alerta_t2_parte10.mp4"

destino=../episodios/t2-parte-10-la-ultima-alerta/la_alerta_t2_parte10.mp4
if [[ "${1:-}" == "--publicar" ]]; then
  mkdir -p "$(dirname "$destino")"
  cp salida/la_alerta_t2_parte10.mp4 "$destino"
  python3 -I lib/resumen_episodio.py t2parte10/tl.js "$destino" ../episodios/t2-parte-10-la-ultima-alerta
  echo "Publicado en $destino"
else
  echo "No se tocó $destino. Revisa el video y corre con --publicar para reemplazarlo."
fi
