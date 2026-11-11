"""Une dos tomas de voz: la primera hasta un corte y la segunda desde su inicio, con un silencio en medio.
También une sus tiempos por palabra (los de la segunda se corren al lugar donde quedan).
Sirve para cambiar solo el final de una narración sin volver a generar toda la voz.

Uso: python3 -I lib/une_tomas.py a.mp3 a.json corte b.mp3 b.json silencio salida.mp3 salida.json

  corte     segundo de a.mp3 donde se corta (se queda todo lo anterior y las palabras que terminan antes)
  silencio  segundos de silencio entre las dos partes
  b.mp3 se usa desde 0.05 s antes de su primera palabra.
"""
import json
import subprocess
import sys


def main(a, a_json, corte, b, b_json, silencio, salida, salida_json):
    corte, silencio = float(corte), float(silencio)
    pa = [w for w in json.load(open(a_json))["words"] if w["end"] <= corte]
    pb = json.load(open(b_json))["words"]
    inicio_b = max(0.0, min(w["start"] for w in pb if w.get("type") == "word") - 0.05)
    filtro = (f"[0:a]atrim=0:{corte},asetpts=PTS-STARTPTS,aresample=44100,aformat=channel_layouts=mono[a];"
              f"anullsrc=r=44100:cl=mono,atrim=0:{silencio}[s];"
              f"[1:a]atrim=start={inicio_b},asetpts=PTS-STARTPTS,aresample=44100,aformat=channel_layouts=mono[b];"
              f"[a][s][b]concat=n=3:v=0:a=1[out]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a, "-i", b, "-filter_complex", filtro,
                    "-map", "[out]", "-c:a", "libmp3lame", "-q:a", "2", salida], check=True)
    corrimiento = corte + silencio - inicio_b
    for w in pb:
        w = dict(w)
        w["start"] = round(w["start"] + corrimiento, 3)
        w["end"] = round(w["end"] + corrimiento, 3)
        pa.append(w)
    json.dump({"words": pa}, open(salida_json, "w"), ensure_ascii=False)
    print(f"{len(pa)} palabras; la segunda toma empieza en {corte + silencio:.2f} s")


if __name__ == "__main__":
    main(*sys.argv[1:9])
